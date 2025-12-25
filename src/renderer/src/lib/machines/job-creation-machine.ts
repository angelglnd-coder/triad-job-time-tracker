import { assign, setup } from 'xstate'
import type { Job, NetSuitePartData } from '$lib/types'

export interface JobCreationMachineContext {
	partNumber: string
	partData: NetSuitePartData | null
	selectedWorkOrderIds: string[]
	priority: number
	dueDate: string | undefined
	notes: string | undefined
	createdJob: Job | null
	error: string | null
}

export type JobCreationMachineEvent =
	| { type: 'UPDATE_PART_NUMBER'; value: string }
	| { type: 'FETCH_PART' }
	| { type: 'PART_FETCHED'; partData: NetSuitePartData }
	| { type: 'CONTINUE' }
	| { type: 'BACK' }
	| { type: 'UPDATE_WORK_ORDERS'; value: string[] }
	| { type: 'UPDATE_PRIORITY'; value: number }
	| { type: 'UPDATE_DUE_DATE'; value: string }
	| { type: 'UPDATE_NOTES'; value: string }
	| { type: 'SUBMIT' }
	| { type: 'SUCCESS'; job: Job }
	| { type: 'ERROR'; error: string }
	| { type: 'RETRY' }
	| { type: 'RESET' }

export const jobCreationMachine = setup({
	types: {
		context: {} as JobCreationMachineContext,
		events: {} as JobCreationMachineEvent
	},
	guards: {
		hasPartData: ({ context }) => context.partData !== null,
		hasPartNumber: ({ context }) => context.partNumber.trim().length > 0,
		hasWorkOrders: ({ context }) => context.selectedWorkOrderIds.length > 0,
		canSubmit: ({ context }) => {
			return (
				context.partData !== null &&
				context.selectedWorkOrderIds.length > 0 &&
				context.priority >= 1 &&
				context.priority <= 10
			)
		}
	},
	actions: {
		updatePartNumber: assign({
			partNumber: ({ event }) => {
				if (event.type !== 'UPDATE_PART_NUMBER') return ''
				return event.value
			}
		}),
		setPartData: assign({
			partData: ({ event }) => {
				if (event.type !== 'PART_FETCHED') return null
				return event.partData
			}
		}),
		updateWorkOrders: assign({
			selectedWorkOrderIds: ({ event }) => {
				if (event.type !== 'UPDATE_WORK_ORDERS') return []
				return event.value
			}
		}),
		updatePriority: assign({
			priority: ({ event }) => {
				if (event.type !== 'UPDATE_PRIORITY') return 5
				return event.value
			}
		}),
		updateDueDate: assign({
			dueDate: ({ event }) => {
				if (event.type !== 'UPDATE_DUE_DATE') return undefined
				return event.value
			}
		}),
		updateNotes: assign({
			notes: ({ event }) => {
				if (event.type !== 'UPDATE_NOTES') return undefined
				return event.value
			}
		}),
		setCreatedJob: assign({
			createdJob: ({ event }) => {
				if (event.type !== 'SUCCESS') return null
				return event.job
			}
		}),
		setError: assign({
			error: ({ event }) => {
				if (event.type !== 'ERROR') return null
				return event.error
			}
		}),
		clearError: assign({
			error: null
		}),
		resetForm: assign({
			partNumber: '',
			partData: null,
			selectedWorkOrderIds: [],
			priority: 5,
			dueDate: undefined,
			notes: undefined,
			createdJob: null,
			error: null
		})
	}
}).createMachine({
	id: 'jobCreation',
	initial: 'idle',
	context: {
		partNumber: '',
		partData: null,
		selectedWorkOrderIds: [],
		priority: 5,
		dueDate: undefined,
		notes: undefined,
		createdJob: null,
		error: null
	},
	states: {
		idle: {
			on: {
				UPDATE_PART_NUMBER: {
					actions: 'updatePartNumber'
				},
				FETCH_PART: {
					target: 'fetchingPart',
					guard: 'hasPartNumber'
				}
			}
		},
		fetchingPart: {
			on: {
				PART_FETCHED: {
					target: 'partFetched',
					actions: ['setPartData', 'clearError']
				},
				ERROR: {
					target: 'error',
					actions: 'setError'
				}
			}
		},
		partFetched: {
			on: {
				CONTINUE: {
					target: 'reviewingOperations',
					guard: 'hasPartData'
				},
				BACK: 'idle'
			}
		},
		reviewingOperations: {
			on: {
				CONTINUE: 'enteringDetails',
				BACK: 'partFetched'
			}
		},
		enteringDetails: {
			on: {
				UPDATE_WORK_ORDERS: {
					actions: 'updateWorkOrders'
				},
				UPDATE_PRIORITY: {
					actions: 'updatePriority'
				},
				UPDATE_DUE_DATE: {
					actions: 'updateDueDate'
				},
				UPDATE_NOTES: {
					actions: 'updateNotes'
				},
				SUBMIT: {
					target: 'submitting',
					guard: 'canSubmit'
				},
				BACK: 'reviewingOperations'
			}
		},
		submitting: {
			on: {
				SUCCESS: {
					target: 'completed',
					actions: 'setCreatedJob'
				},
				ERROR: {
					target: 'error',
					actions: 'setError'
				}
			}
		},
		completed: {
			on: {
				RESET: {
					target: 'idle',
					actions: 'resetForm'
				}
			}
		},
		error: {
			on: {
				RETRY: 'idle',
				RESET: {
					target: 'idle',
					actions: 'resetForm'
				}
			}
		}
	}
})
