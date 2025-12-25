import { setup, assign } from 'xstate'
import type { User, Job, JobOperation } from '$lib/types'
import { globalStore } from '$lib/stores/global-store.svelte'

/**
 * Context type for the assignment state machine
 */
export interface AssignmentMachineContext {
  selectedOperator: User | null
  selectedJob: Job | null
  selectedOperation: JobOperation | null
  operatorHasAssignments: boolean
  operatorCurrentAssignments: JobOperation[]
  assignmentId: number | null
  assignedAt: string | null
  error: string | null
}

/**
 * Events that can be sent to the assignment machine
 */
export type AssignmentMachineEvent =
  | { type: 'SELECT_OPERATOR'; operator: User }
  | { type: 'CONTINUE' }
  | { type: 'BACK' }
  | { type: 'JOB_SELECTED'; job: Job }
  | { type: 'OPERATION_SELECTED'; operation: JobOperation }
  | { type: 'CONFIRM' }
  | { type: 'SUBMIT' }
  | { type: 'SUCCESS'; assignmentId: number; timestamp: string }
  | { type: 'ERROR'; error: string }
  | { type: 'RETRY' }
  | { type: 'RESET' }

/**
 * Operation assignment state machine
 * Manages the workflow of assigning an operation to an operator
 */
export const assignmentMachine = setup({
  types: {
    context: {} as AssignmentMachineContext,
    events: {} as AssignmentMachineEvent
  },
  guards: {
    hasOperator: ({ context }) => context.selectedOperator !== null,
    hasJob: ({ context }) => context.selectedJob !== null,
    hasOperation: ({ context }) => context.selectedOperation !== null,
    canSubmit: ({ context }) => {
      return (
        context.selectedOperator !== null &&
        context.selectedJob !== null &&
        context.selectedOperation !== null
      )
    },
    operatorHasWarning: ({ context }) => context.operatorHasAssignments
  },
  actions: {
    setOperator: assign({
      selectedOperator: ({ event }) => {
        if (event.type === 'SELECT_OPERATOR') {
          return event.operator
        }
        return null
      },
      operatorHasAssignments: ({ event }) => {
        if (event.type === 'SELECT_OPERATOR') {
          const userOps = globalStore.getUserOperations(event.operator.id)
          return userOps.length > 0
        }
        return false
      },
      operatorCurrentAssignments: ({ event }) => {
        if (event.type === 'SELECT_OPERATOR') {
          return globalStore.getUserOperations(event.operator.id)
        }
        return []
      },
      error: null
    }),
    setJob: assign({
      selectedJob: ({ event }) => {
        if (event.type === 'JOB_SELECTED') {
          return event.job
        }
        return null
      },
      error: null
    }),
    setOperation: assign({
      selectedOperation: ({ event }) => {
        if (event.type === 'OPERATION_SELECTED') {
          return event.operation
        }
        return null
      },
      error: null
    }),
    createAssignment: assign({
      assignmentId: () => Date.now(),
      assignedAt: () => new Date().toISOString()
    }),
    setError: assign({
      error: ({ event }) => {
        if (event.type === 'ERROR') {
          return event.error
        }
        return null
      }
    }),
    clearError: assign({
      error: null
    }),
    resetContext: assign({
      selectedOperator: null,
      selectedJob: null,
      selectedOperation: null,
      operatorHasAssignments: false,
      operatorCurrentAssignments: [],
      assignmentId: null,
      assignedAt: null,
      error: null
    })
  }
}).createMachine({
  id: 'operationAssignment',
  initial: 'idle',
  context: {
    selectedOperator: null,
    selectedJob: null,
    selectedOperation: null,
    operatorHasAssignments: false,
    operatorCurrentAssignments: [],
    assignmentId: null,
    assignedAt: null,
    error: null
  },
  states: {
    idle: {
      on: {
        SELECT_OPERATOR: {
          target: 'operatorSelected',
          actions: ['setOperator']
        }
      }
    },
    operatorSelected: {
      on: {
        CONTINUE: {
          target: 'selectingJob',
          guard: 'hasOperator'
        },
        BACK: {
          target: 'idle'
        },
        SELECT_OPERATOR: {
          target: 'operatorSelected',
          actions: ['setOperator']
        }
      }
    },
    selectingJob: {
      on: {
        JOB_SELECTED: {
          target: 'jobSelected',
          actions: ['setJob']
        },
        BACK: {
          target: 'operatorSelected'
        }
      }
    },
    jobSelected: {
      on: {
        OPERATION_SELECTED: {
          target: 'operationSelected',
          actions: ['setOperation']
        },
        JOB_SELECTED: {
          target: 'jobSelected',
          actions: ['setJob']
        },
        BACK: {
          target: 'selectingJob'
        }
      }
    },
    operationSelected: {
      on: {
        CONFIRM: {
          target: 'reviewing',
          guard: 'canSubmit'
        },
        OPERATION_SELECTED: {
          target: 'operationSelected',
          actions: ['setOperation']
        },
        BACK: {
          target: 'jobSelected'
        }
      }
    },
    reviewing: {
      on: {
        SUBMIT: {
          target: 'submitting',
          guard: 'canSubmit'
        },
        BACK: {
          target: 'operationSelected'
        }
      }
    },
    submitting: {
      on: {
        SUCCESS: {
          target: 'completed',
          actions: ['createAssignment']
        },
        ERROR: {
          target: 'error',
          actions: ['setError']
        }
      }
    },
    completed: {
      on: {
        RESET: {
          target: 'idle',
          actions: ['resetContext']
        }
      }
    },
    error: {
      on: {
        RETRY: {
          target: 'reviewing',
          actions: ['clearError']
        },
        RESET: {
          target: 'idle',
          actions: ['resetContext']
        }
      }
    }
  }
})
