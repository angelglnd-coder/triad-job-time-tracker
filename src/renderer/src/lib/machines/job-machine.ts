import { setup, assign, fromPromise } from 'xstate'
import type { NetSuitePartData, CreateJobFormData, Job } from '$lib/types'

/**
 * Context type for the job creation state machine
 */
export interface JobMachineContext {
  partNumber: string | null
  partData: NetSuitePartData | null
  formData: CreateJobFormData
  createdJob: Job | null
  error: string | null
}

/**
 * Events that can be sent to the job machine
 */
export type JobMachineEvent =
  | { type: 'FETCH_PART'; partNumber: string }
  | { type: 'PART_FETCHED'; partData: NetSuitePartData }
  | { type: 'PART_FETCH_ERROR'; error: string }
  | { type: 'CREATE_JOB'; formData: CreateJobFormData }
  | { type: 'JOB_CREATED'; job: Job }
  | { type: 'JOB_CREATE_ERROR'; error: string }
  | { type: 'RESET' }

/**
 * Job creation state machine
 * Manages the workflow of fetching part data from NetSuite and creating a job
 */
export const jobMachine = setup({
  types: {
    context: {} as JobMachineContext,
    events: {} as JobMachineEvent
  },
  actions: {
    setPartNumber: assign({
      partNumber: ({ event }) => {
        if (event.type === 'FETCH_PART') {
          return event.partNumber
        }
        return null
      }
    }),
    setPartData: assign({
      partData: ({ event }) => {
        if (event.type === 'PART_FETCHED') {
          return event.partData
        }
        return null
      },
      formData: ({ event, context }) => {
        if (event.type === 'PART_FETCHED') {
          return {
            ...context.formData,
            part_number: event.partData.partNumber,
            part_data: event.partData
          }
        }
        return context.formData
      }
    }),
    setPartFetchError: assign({
      error: ({ event }) => {
        if (event.type === 'PART_FETCH_ERROR') {
          return event.error
        }
        return null
      }
    }),
    updateFormData: assign({
      formData: ({ event, context }) => {
        if (event.type === 'CREATE_JOB') {
          return event.formData
        }
        return context.formData
      }
    }),
    setCreatedJob: assign({
      createdJob: ({ event }) => {
        if (event.type === 'JOB_CREATED') {
          return event.job
        }
        return null
      }
    }),
    setJobCreateError: assign({
      error: ({ event }) => {
        if (event.type === 'JOB_CREATE_ERROR') {
          return event.error
        }
        return null
      }
    }),
    resetContext: assign({
      partNumber: null,
      partData: null,
      formData: {
        part_number: '',
        quantity_ordered: 1,
        priority: 5
      },
      createdJob: null,
      error: null
    })
  }
}).createMachine({
  id: 'jobCreation',
  initial: 'idle',
  context: {
    partNumber: null,
    partData: null,
    formData: {
      part_number: '',
      quantity_ordered: 1,
      priority: 5
    },
    createdJob: null,
    error: null
  },
  states: {
    idle: {
      on: {
        FETCH_PART: {
          target: 'fetchingPart',
          actions: ['setPartNumber']
        }
      }
    },
    fetchingPart: {
      on: {
        PART_FETCHED: {
          target: 'partFetched',
          actions: ['setPartData']
        },
        PART_FETCH_ERROR: {
          target: 'error',
          actions: ['setPartFetchError']
        }
      }
    },
    partFetched: {
      on: {
        CREATE_JOB: {
          target: 'creatingJob',
          actions: ['updateFormData']
        },
        FETCH_PART: {
          target: 'fetchingPart',
          actions: ['setPartNumber']
        },
        RESET: {
          target: 'idle',
          actions: ['resetContext']
        }
      }
    },
    creatingJob: {
      on: {
        JOB_CREATED: {
          target: 'jobCreated',
          actions: ['setCreatedJob']
        },
        JOB_CREATE_ERROR: {
          target: 'error',
          actions: ['setJobCreateError']
        }
      }
    },
    jobCreated: {
      on: {
        RESET: {
          target: 'idle',
          actions: ['resetContext']
        },
        FETCH_PART: {
          target: 'fetchingPart',
          actions: ['resetContext', 'setPartNumber']
        }
      }
    },
    error: {
      on: {
        RESET: {
          target: 'idle',
          actions: ['resetContext']
        },
        FETCH_PART: {
          target: 'fetchingPart',
          actions: ['resetContext', 'setPartNumber']
        }
      }
    }
  }
})
