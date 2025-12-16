import type { JobOperation, User } from '$lib/types'

class OperationStore {
  operations = $state<JobOperation[]>([])
  selectedOperation = $state<JobOperation | null>(null)
  isLoading = $state(false)
  error = $state<string | null>(null)

  // Filters
  filterByUser = $state<number | null>(null)
  filterByWorkCenter = $state<number | null>(null)
  filterByStatus = $state<string | null>(null)

  filteredOperations = $derived(() => {
    let filtered = this.operations

    if (this.filterByUser) {
      filtered = filtered.filter((op) => op.assigned_to_user_id === this.filterByUser)
    }

    if (this.filterByWorkCenter) {
      filtered = filtered.filter((op) => op.work_center_id === this.filterByWorkCenter)
    }

    if (this.filterByStatus) {
      filtered = filtered.filter((op) => op.status === this.filterByStatus)
    }

    return filtered
  })

  async loadOperations() {
    this.isLoading = true
    this.error = null
    try {
      // TODO: Replace with actual API call
      // this.operations = await window.api.operations.getAll()

      // Mock data for now
      this.operations = []
    } catch (err) {
      this.error = err instanceof Error ? err.message : 'Failed to load operations'
    } finally {
      this.isLoading = false
    }
  }

  async loadOperationsByJob(jobId: number) {
    this.isLoading = true
    this.error = null
    try {
      // TODO: Replace with actual API call
      // this.operations = await window.api.operations.getByJob(jobId)

      // Mock data for now
      this.operations = []
    } catch (err) {
      this.error = err instanceof Error ? err.message : 'Failed to load operations'
    } finally {
      this.isLoading = false
    }
  }

  async loadOperationsByUser(userId: number) {
    this.isLoading = true
    this.error = null
    try {
      // TODO: Replace with actual API call
      // this.operations = await window.api.operations.getByUser(userId)

      // Mock data for now
      this.operations = []
    } catch (err) {
      this.error = err instanceof Error ? err.message : 'Failed to load operations'
    } finally {
      this.isLoading = false
    }
  }

  async assignOperation(operationId: number, userId: number) {
    this.isLoading = true
    this.error = null
    try {
      // TODO: Replace with actual API call
      // await window.api.operations.assign(operationId, userId)

      // Update local state
      const operation = this.operations.find((op) => op.id === operationId)
      if (operation) {
        operation.assigned_to_user_id = userId
        operation.status = 'assigned'
        operation.assigned_at = new Date().toISOString()
      }

      return true
    } catch (err) {
      this.error = err instanceof Error ? err.message : 'Failed to assign operation'
      return false
    } finally {
      this.isLoading = false
    }
  }

  selectOperation(operation: JobOperation | null) {
    this.selectedOperation = operation
  }

  setFilters(filters: {
    user?: number | null
    workCenter?: number | null
    status?: string | null
  }) {
    if (filters.user !== undefined) this.filterByUser = filters.user
    if (filters.workCenter !== undefined) this.filterByWorkCenter = filters.workCenter
    if (filters.status !== undefined) this.filterByStatus = filters.status
  }

  clearFilters() {
    this.filterByUser = null
    this.filterByWorkCenter = null
    this.filterByStatus = null
  }
}

export const operationStore = new OperationStore()
