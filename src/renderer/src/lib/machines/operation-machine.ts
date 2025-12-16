import { setup, assign } from 'xstate'
import type { TimeEntry, FinishOperationFormData } from '$lib/types'

/**
 * Context type for the operation state machine
 */
export interface OperationMachineContext {
  operationId: number
  assignedUserId: number | null
  activeTimeEntry: TimeEntry | null
  totalElapsedSeconds: number
  quantityCompleted: number
  quantityScrapped: number
  error: string | null
}

/**
 * Events that can be sent to the operation machine
 */
export type OperationMachineEvent =
  | { type: 'ASSIGN'; userId: number }
  | { type: 'UNASSIGN' }
  | { type: 'START'; timeEntry: TimeEntry }
  | { type: 'PAUSE' }
  | { type: 'RESUME'; timeEntry: TimeEntry }
  | { type: 'FINISH'; data: FinishOperationFormData }
  | { type: 'CANCEL' }
  | { type: 'UPDATE_ELAPSED'; seconds: number }
  | { type: 'ERROR'; error: string }

/**
 * Operation lifecycle state machine
 * Manages the workflow of assigning, starting, pausing, and finishing an operation
 */
export const operationMachine = setup({
  types: {
    context: {} as OperationMachineContext,
    events: {} as OperationMachineEvent,
    input: {} as { operationId: number }
  },
  guards: {
    isAssigned: ({ context }) => context.assignedUserId !== null,
    hasActiveTimeEntry: ({ context }) => context.activeTimeEntry !== null,
    canFinish: ({ context }) => {
      return context.activeTimeEntry !== null && context.assignedUserId !== null
    }
  },
  actions: {
    assignToUser: assign({
      assignedUserId: ({ event }) => {
        if (event.type === 'ASSIGN') {
          return event.userId
        }
        return null
      },
      error: null
    }),
    unassignUser: assign({
      assignedUserId: null,
      error: null
    }),
    startTimer: assign({
      activeTimeEntry: ({ event }) => {
        if (event.type === 'START') {
          return event.timeEntry
        }
        return null
      },
      totalElapsedSeconds: 0,
      error: null
    }),
    pauseTimer: assign({
      activeTimeEntry: null
    }),
    resumeTimer: assign({
      activeTimeEntry: ({ event }) => {
        if (event.type === 'RESUME') {
          return event.timeEntry
        }
        return null
      }
    }),
    finishOperation: assign({
      activeTimeEntry: null,
      quantityCompleted: ({ event }) => {
        if (event.type === 'FINISH') {
          return event.data.quantity_completed
        }
        return 0
      },
      quantityScrapped: ({ event }) => {
        if (event.type === 'FINISH') {
          return event.data.quantity_scrapped || 0
        }
        return 0
      }
    }),
    updateElapsedTime: assign({
      totalElapsedSeconds: ({ event, context }) => {
        if (event.type === 'UPDATE_ELAPSED') {
          return event.seconds
        }
        return context.totalElapsedSeconds
      }
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
    })
  }
}).createMachine({
  id: 'operation',
  context: ({ input }) => ({
    operationId: input.operationId,
    assignedUserId: null,
    activeTimeEntry: null,
    totalElapsedSeconds: 0,
    quantityCompleted: 0,
    quantityScrapped: 0,
    error: null
  }),
  initial: 'unassigned',
  states: {
    unassigned: {
      on: {
        ASSIGN: {
          target: 'assigned',
          actions: ['assignToUser']
        },
        CANCEL: {
          target: 'cancelled'
        }
      }
    },
    assigned: {
      on: {
        UNASSIGN: {
          target: 'unassigned',
          actions: ['unassignUser']
        },
        START: {
          target: 'inProgress',
          actions: ['startTimer'],
          guard: 'isAssigned'
        },
        CANCEL: {
          target: 'cancelled'
        }
      }
    },
    inProgress: {
      on: {
        UPDATE_ELAPSED: {
          actions: ['updateElapsedTime']
        },
        PAUSE: {
          target: 'paused',
          actions: ['pauseTimer']
        },
        FINISH: {
          target: 'finished',
          actions: ['finishOperation'],
          guard: 'canFinish'
        },
        ERROR: {
          target: 'error',
          actions: ['setError']
        }
      }
    },
    paused: {
      on: {
        RESUME: {
          target: 'inProgress',
          actions: ['resumeTimer']
        },
        FINISH: {
          target: 'finished',
          actions: ['finishOperation']
        },
        CANCEL: {
          target: 'cancelled'
        }
      }
    },
    finished: {
      type: 'final'
    },
    cancelled: {
      type: 'final'
    },
    error: {
      on: {
        PAUSE: {
          target: 'paused',
          actions: ['pauseTimer', 'clearError']
        },
        CANCEL: {
          target: 'cancelled',
          actions: ['clearError']
        }
      }
    }
  }
})
