// User and Authentication Types
export interface User {
  id: number
  username: string
  full_name: string
  email?: string
  role: 'operator' | 'supervisor' | 'admin'
  is_active: boolean
  pin_code?: string
  created_at?: string
  updated_at?: string
}

// Work Center Types
export interface WorkCenter {
  id: number
  code: string
  name: string
  description?: string
  is_active: boolean
}

// Part Types
export interface Part {
  id: number
  part_number: string
  description?: string
  revision?: string
  external_part_id?: string
  last_synced_at?: string
}

// Routing Step Types
export interface RoutingStep {
  id: number
  part_id: number
  operation_sequence: number
  operation_code?: string
  operation_name: string
  work_center_id: number
  run_rate_per_unit_min: number
  setup_time_min: number
  is_active: boolean
}

// Job Types
export type JobStatus = 'created' | 'ready' | 'in_progress' | 'on_hold' | 'completed' | 'cancelled'

export interface Job {
  id: number
  job_number: string
  part_id: number
  part?: Part
  work_order_number?: string     // Keep for backward compatibility
  work_order_numbers?: string[]  // NEW: Support multiple work orders
  quantity_ordered: number
  quantity_completed: number
  quantity_scrapped: number
  priority: number
  status: JobStatus
  notes?: string
  due_date?: string
  started_at?: string
  completed_at?: string
  created_at: string
  updated_at?: string
  created_by?: number
}

// Job Operation Types
export type OperationStatus = 'unassigned' | 'assigned' | 'in_progress' | 'paused' | 'finished' | 'cancelled'

export interface JobOperation {
  id: number
  job_id: number
  job?: Job
  routing_step_id?: number
  operation_sequence: number
  operation_code?: string
  operation_name: string
  work_center_id: number
  work_center?: WorkCenter

  // Planned values
  planned_run_rate_per_unit_min: number
  planned_setup_time_min: number
  planned_total_time_min: number

  // Actual values
  actual_time_min: number
  actual_quantity_completed: number
  actual_quantity_scrapped: number

  // Assignment & Status
  assigned_to_user_id?: number
  assigned_to_user?: User
  status: OperationStatus

  // Timestamps
  assigned_at?: string
  started_at?: string
  finished_at?: string
  notes?: string
  created_at?: string
  updated_at?: string
}

// Time Entry Types
export type EntryType = 'work' | 'setup' | 'break' | 'downtime'

export interface TimeEntry {
  id: number
  job_operation_id: number
  job_operation?: JobOperation
  user_id: number
  user?: User
  start_time: string
  end_time?: string
  duration_min?: number
  quantity_completed: number
  quantity_scrapped: number
  scrap_reason?: string
  entry_type: EntryType
  notes?: string
  created_at?: string
  updated_at?: string
}

// NetSuite Integration Types
export interface NetSuitePartData {
  partNumber: string
  itemId: string
  itemType: string
  canHaveWorkOrder: boolean
  defaultBom?: string | null
  routings: NetSuiteRouting[]
  workOrders: NetSuiteWorkOrder[]
}

export interface NetSuiteRouting {
  id: string
  name: string
  locationId: string
  location: string
  steps: NetSuiteRoutingStep[]
}

export interface NetSuiteRoutingStep {
  operationSequence: number
  operationName: string
  workCenter: string
  machineResources: number
  laborResources: number
  costTemplate: string
  setupTimeMin: number
  runRatePerUnitMin: number
  connectionType: string
  lagType: string
  lagAmount: string
  lagUnits: string
}

export interface NetSuiteWorkOrder {
  id: string
  tranId: string
  status: string
  quantity: string
  locationId: string
  location: string
  startDate: string
  endDate: string
}

// Dashboard & Reporting Types
export interface ActiveJobSummary {
  id: number
  job_number: string
  part_number: string
  part_description?: string
  work_order_number?: string
  quantity_ordered: number
  quantity_completed: number
  status: JobStatus
  priority: number
  total_operations: number
  completed_operations: number
  total_planned_time_min: number
  total_actual_time_min: number
  due_date?: string
}

export interface UserWorkloadSummary {
  user_id: number
  username: string
  full_name: string
  assigned_operations: number
  active_operations: number
  pending_operations: number
  total_planned_time_min: number
  total_actual_time_min: number
}

export interface OperationStatusSummary {
  id: number
  job_number: string
  work_order_number?: string
  part_number: string
  operation_sequence: number
  operation_name: string
  work_center_name: string
  status: OperationStatus
  assigned_to?: string
  planned_total_time_min: number
  actual_time_min: number
  efficiency_percentage: number
  actual_quantity_completed: number
  actual_quantity_scrapped: number
  assigned_at?: string
  started_at?: string
  finished_at?: string
}

// Form/UI Types
export interface CreateJobFormData {
  part_number: string
  part_data?: NetSuitePartData
  selected_routing_id?: string
  work_order_id?: string        // Keep for backward compatibility
  work_order_ids: string[]      // Required: Multiple work orders
  work_order_number?: string
  quantity_ordered: number
  priority: number
  due_date?: string
  notes?: string
}

export interface FinishOperationFormData {
  operation_id: number
  quantity_completed: number
  quantity_scrapped: number
  scrap_reason?: string
  notes?: string
}

// Settings Types
export interface AppSettings {
  netsuite_api_url?: string
  netsuite_api_token?: string
  auto_sync_routing: boolean
  default_job_priority: number
  enable_barcode_scanner: boolean
  time_entry_rounding_min: number
  allow_negative_scrap: boolean
}

// Navigation Types
export type PageId =
  | 'dashboard'
  | 'create-job'
  | 'jobs'
  | 'assign-operations'
  | 'operator-console'
  | 'reports-workload'
  | 'reports-variance'
  | 'settings'

export interface NavigationItem {
  id: PageId
  label: string
  icon?: string
  roles?: Array<'operator' | 'supervisor' | 'admin'>
}
