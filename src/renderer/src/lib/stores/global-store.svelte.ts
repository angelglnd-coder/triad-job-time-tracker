import type { Job, JobOperation, TimeEntry, User, CreateJobFormData } from '$lib/types'

/**
 * Global in-memory store for all application data
 * This serves as a temporary replacement for a database
 */
class GlobalStore {
  // Data maps using Svelte runes for reactivity
  jobs = $state<Map<number, Job>>(new Map())
  operations = $state<Map<number, JobOperation>>(new Map())
  timeEntries = $state<Map<number, TimeEntry>>(new Map())
  users = $state<Map<number, User>>(new Map())

  // Auto-increment IDs
  nextJobId = $state(1)
  nextOperationId = $state(1)
  nextTimeEntryId = $state(1)

  constructor() {
    this.initializeMockUsers()
  }

  // Initialize with mock users for development
  private initializeMockUsers() {
    this.users.set(1, {
      id: 1,
      username: 'demo',
      full_name: 'Demo User',
      email: 'demo@triad.com',
      role: 'supervisor',
      is_active: true
    })

    this.users.set(2, {
      id: 2,
      username: 'operator1',
      full_name: 'John Operator',
      email: 'john@triad.com',
      role: 'operator',
      is_active: true
    })

    this.users.set(3, {
      id: 3,
      username: 'operator2',
      full_name: 'Jane Operator',
      email: 'jane@triad.com',
      role: 'operator',
      is_active: true
    })
  }

  // ========== JOB METHODS ==========

  createJob(data: CreateJobFormData): Job {
    const jobId = this.nextJobId++
    const now = new Date().toISOString()

    // Map work order IDs to work order numbers (transaction IDs)
    let workOrderNumbers: string[] | undefined = undefined
    if (data.work_order_ids && data.work_order_ids.length > 0 && data.part_data) {
      workOrderNumbers = data.work_order_ids.map(woId => {
        const wo = data.part_data!.workOrders.find(w => w.id === woId)
        return wo ? wo.tranId : woId
      })
    }

    const job: Job = {
      id: jobId,
      job_number: `JOB-${String(jobId).padStart(5, '0')}`,
      part_number: data.part_number,
      part_data: data.part_data,
      work_order_number: data.work_order_id,  // Keep for backward compatibility
      work_order_numbers: workOrderNumbers,   // NEW: Array of work order transaction IDs
      quantity_ordered: data.quantity_ordered,
      quantity_completed: 0,
      quantity_scrapped: 0,
      priority: data.priority,
      status: 'created',
      due_date: data.due_date,
      notes: data.notes,
      created_at: now,
      updated_at: now
    }

    this.jobs.set(jobId, job)

    // Create operations from routing steps
    if (data.part_data && data.part_data.routings.length > 0) {
      const routing = data.part_data.routings[0]
      routing.steps.forEach((step) => {
        this.createOperation(jobId, {
          operation_sequence: step.operationSequence,
          operation_name: step.operationName,
          work_center: step.workCenter,
          planned_setup_time_min: step.setupTimeMin,
          planned_run_rate_per_unit_min: step.runRatePerUnitMin,
          planned_total_time_min: step.setupTimeMin + (step.runRatePerUnitMin * data.quantity_ordered)
        })
      })
    }

    return job
  }

  getJob(id: number): Job | undefined {
    return this.jobs.get(id)
  }

  getAllJobs(): Job[] {
    return Array.from(this.jobs.values()).sort((a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
  }

  updateJob(id: number, updates: Partial<Job>): void {
    const job = this.jobs.get(id)
    if (job) {
      const updatedJob = { ...job, ...updates, updated_at: new Date().toISOString() }
      this.jobs.set(id, updatedJob)
    }
  }

  deleteJob(id: number): void {
    this.jobs.delete(id)
    // Also delete related operations
    const operations = this.getJobOperations(id)
    operations.forEach(op => this.operations.delete(op.id))
    // Trigger Svelte reactivity by creating a new Map reference
    this.operations = new Map(this.operations)
  }

  // ========== OPERATION METHODS ==========

  createOperation(jobId: number, data: {
    operation_sequence: number
    operation_name: string
    work_center: string
    planned_setup_time_min: number
    planned_run_rate_per_unit_min: number
    planned_total_time_min: number
  }): JobOperation {
    const operationId = this.nextOperationId++
    const now = new Date().toISOString()

    const operation: JobOperation = {
      id: operationId,
      job_id: jobId,
      operation_sequence: data.operation_sequence,
      operation_name: data.operation_name,
      work_center: data.work_center,
      planned_setup_time_min: data.planned_setup_time_min,
      planned_run_rate_per_unit_min: data.planned_run_rate_per_unit_min,
      planned_total_time_min: data.planned_total_time_min,
      actual_time_min: 0,
      actual_quantity_completed: 0,
      actual_quantity_scrapped: 0,
      status: 'unassigned',
      created_at: now,
      updated_at: now
    }

    this.operations.set(operationId, operation)
    // Trigger Svelte reactivity by creating a new Map reference
    this.operations = new Map(this.operations)
    return operation
  }

  getOperation(id: number): JobOperation | undefined {
    return this.operations.get(id)
  }

  getAllOperations(): JobOperation[] {
    return Array.from(this.operations.values())
  }

  getJobOperations(jobId: number): JobOperation[] {
    return Array.from(this.operations.values())
      .filter(op => op.job_id === jobId)
      .sort((a, b) => a.operation_sequence - b.operation_sequence)
  }

  getUserOperations(userId: number): JobOperation[] {
    return Array.from(this.operations.values())
      .filter(op => op.assigned_to_user_id === userId)
      .sort((a, b) => {
        // Sort by status priority: in_progress > paused > assigned
        const statusPriority: Record<string, number> = {
          'in_progress': 1,
          'paused': 2,
          'assigned': 3,
          'unassigned': 4,
          'finished': 5,
          'cancelled': 6
        }
        return (statusPriority[a.status] || 99) - (statusPriority[b.status] || 99)
      })
  }

  getUnassignedOperations(): JobOperation[] {
    return Array.from(this.operations.values())
      .filter(op => op.status === 'unassigned')
      .sort((a, b) => {
        // Sort by job priority then sequence
        const jobA = this.getJob(a.job_id)
        const jobB = this.getJob(b.job_id)
        if (jobA && jobB && jobA.priority !== jobB.priority) {
          return jobB.priority - jobA.priority // Higher priority first
        }
        return a.operation_sequence - b.operation_sequence
      })
  }

  updateOperation(id: number, updates: Partial<JobOperation>): void {
    const operation = this.operations.get(id)
    if (operation) {
      const updatedOperation = { ...operation, ...updates, updated_at: new Date().toISOString() }
      this.operations.set(id, updatedOperation)
      // Trigger Svelte reactivity by creating a new Map reference
      this.operations = new Map(this.operations)
    }
  }

  deleteOperation(id: number): void {
    this.operations.delete(id)
    // Trigger Svelte reactivity by creating a new Map reference
    this.operations = new Map(this.operations)
    // Also delete related time entries
    const timeEntries = this.getOperationTimeEntries(id)
    timeEntries.forEach(te => this.timeEntries.delete(te.id))
  }

  // ========== ASSIGNMENT METHODS ==========

  assignOperationToUser(operationId: number, userId: number): boolean {
    const operation = this.operations.get(operationId)
    const user = this.users.get(userId)

    if (!operation || !user) {
      return false
    }

    this.updateOperation(operationId, {
      assigned_to_user_id: userId,
      assigned_to_user: user,
      status: 'assigned',
      assigned_at: new Date().toISOString()
    })

    return true
  }

  unassignOperation(operationId: number): boolean {
    const operation = this.operations.get(operationId)

    if (!operation) {
      return false
    }

    this.updateOperation(operationId, {
      assigned_to_user_id: undefined,
      assigned_at: undefined,
      status: 'unassigned'
    })

    return true
  }

  getOperatorWorkload(userId: number): {
    totalOperations: number
    byStatus: Record<OperationStatus, number>
    estimatedTimeMin: number
  } {
    const operations = this.getUserOperations(userId)

    const byStatus = operations.reduce(
      (acc, op) => {
        acc[op.status] = (acc[op.status] || 0) + 1
        return acc
      },
      {} as Record<OperationStatus, number>
    )

    const estimatedTimeMin = operations
      .filter((op) => op.status !== 'finished' && op.status !== 'cancelled')
      .reduce((total, op) => total + (op.planned_total_time_min - op.actual_time_min), 0)

    return {
      totalOperations: operations.length,
      byStatus,
      estimatedTimeMin
    }
  }

  getAssignedOperations(): JobOperation[] {
    return Array.from(this.operations.values())
      .filter((op) => op.status === 'assigned')
      .sort((a, b) => {
        // Sort by assigned_at timestamp (newest first)
        if (a.assigned_at && b.assigned_at) {
          return new Date(b.assigned_at).getTime() - new Date(a.assigned_at).getTime()
        }
        return 0
      })
  }

  // ========== TIME ENTRY METHODS ==========

  createTimeEntry(operationId: number, data: {
    user_id: number
    entry_type: 'work' | 'setup' | 'break' | 'downtime'
    start_time: string
  }): TimeEntry {
    const timeEntryId = this.nextTimeEntryId++

    const timeEntry: TimeEntry = {
      id: timeEntryId,
      operation_id: operationId,
      user_id: data.user_id,
      entry_type: data.entry_type,
      start_time: data.start_time,
      duration_min: 0,
      created_at: new Date().toISOString()
    }

    this.timeEntries.set(timeEntryId, timeEntry)
    return timeEntry
  }

  getTimeEntry(id: number): TimeEntry | undefined {
    return this.timeEntries.get(id)
  }

  getOperationTimeEntries(operationId: number): TimeEntry[] {
    return Array.from(this.timeEntries.values())
      .filter(te => te.operation_id === operationId)
      .sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime())
  }

  updateTimeEntry(id: number, updates: Partial<TimeEntry>): void {
    const timeEntry = this.timeEntries.get(id)
    if (timeEntry) {
      const updatedTimeEntry = { ...timeEntry, ...updates }
      this.timeEntries.set(id, updatedTimeEntry)
    }
  }

  deleteTimeEntry(id: number): void {
    this.timeEntries.delete(id)
  }

  // ========== USER METHODS ==========

  getUser(id: number): User | undefined {
    return this.users.get(id)
  }

  getAllUsers(): User[] {
    return Array.from(this.users.values())
      .filter(user => user.is_active)
      .sort((a, b) => a.full_name.localeCompare(b.full_name))
  }

  getOperators(): User[] {
    return this.getAllUsers().filter(user => user.role === 'operator' || user.role === 'supervisor')
  }

  // ========== STATISTICS ==========

  getJobStats(jobId: number) {
    const operations = this.getJobOperations(jobId)
    return {
      total: operations.length,
      unassigned: operations.filter(op => op.status === 'unassigned').length,
      assigned: operations.filter(op => op.status === 'assigned').length,
      inProgress: operations.filter(op => op.status === 'in_progress').length,
      paused: operations.filter(op => op.status === 'paused').length,
      finished: operations.filter(op => op.status === 'finished').length,
      cancelled: operations.filter(op => op.status === 'cancelled').length
    }
  }

  getOperationTotalTime(operationId: number): number {
    const timeEntries = this.getOperationTimeEntries(operationId)
    return timeEntries.reduce((total, entry) => total + (entry.duration_min || 0), 0)
  }
}

export const globalStore = new GlobalStore()
