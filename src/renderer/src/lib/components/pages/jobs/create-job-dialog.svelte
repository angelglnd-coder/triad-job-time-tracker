<script lang="ts">
	import { useMachine } from '@xstate/svelte'
	import { jobCreationMachine } from '$lib/machines/job-creation-machine'
	import { globalStore } from '$lib/stores/global-store.svelte'
	import { jobStore } from '$lib/stores/job-store.svelte'
	import * as Dialog from '$lib/components/ui/dialog'
	import { Button } from '$lib/components/ui/button'
	import CreateJobStepIndicator from './create-job-step-indicator.svelte'
	import PartInputStep from './part-input-step.svelte'
	import OperationsPreviewStep from './operations-preview-step.svelte'
	import JobDetailsStep from './job-details-step.svelte'
	import JobCreatedStep from './job-created-step.svelte'
	import ErrorStep from './error-step.svelte'
	import PlusCircleIcon from '@lucide/svelte/icons/plus-circle'

	interface Props {
		onJobCreated?: () => void
	}

	let { onJobCreated }: Props = $props()

	let open = $state(false)

	const { snapshot, send } = useMachine(jobCreationMachine)

	// Derived state for operations preview
	let operations = $derived.by(() => {
		if (!$snapshot.context.partData) return []
		return $snapshot.context.partData.routings[0]?.steps || []
	})

	// Handler for fetching part data
	async function handleFetchPart() {
		send({ type: 'FETCH_PART' })
		const success = await jobStore.fetchPartFromNetSuite($snapshot.context.partNumber)
		if (success && jobStore.partData) {
			send({ type: 'PART_FETCHED', partData: jobStore.partData })
		} else {
			send({ type: 'ERROR', error: jobStore.error || 'Failed to fetch part data' })
		}
	}

	// Handler for job creation
	async function handleSubmit() {
		send({ type: 'SUBMIT' })

		// Calculate total quantity
		const totalQuantity = $snapshot.context.selectedWorkOrderIds.reduce((total, woId) => {
			const wo = $snapshot.context.partData?.workOrders.find((w) => w.id === woId)
			return total + (wo ? parseInt(wo.quantity) || 0 : 0)
		}, 0)

		// Populate createFormData
		jobStore.createFormData = {
			part_number: $snapshot.context.partNumber,
			part_data: $snapshot.context.partData || undefined,
			work_order_ids: $snapshot.context.selectedWorkOrderIds,
			quantity_ordered: totalQuantity,
			priority: $snapshot.context.priority,
			due_date: $snapshot.context.dueDate,
			notes: $snapshot.context.notes
		}

		const success = await jobStore.createJob()

		if (success) {
			const createdJob = globalStore.getAllJobs()[0] // Most recent job
			send({ type: 'SUCCESS', job: createdJob })
		} else {
			send({ type: 'ERROR', error: jobStore.error || 'Failed to create job' })
		}
	}

	// Dialog open/close handler
	function handleOpenChange(newOpen: boolean) {
		open = newOpen

		// Reset machine when dialog closes
		if (!newOpen && !$snapshot.matches('idle')) {
			send({ type: 'RESET' })
		}
	}

	// Close handler for success/cancel
	function handleClose() {
		send({ type: 'RESET' })
		open = false
		onJobCreated?.() // Refresh jobs list
	}

	// Get current step number for indicator
	function getCurrentStep(state: typeof $snapshot.value): number {
		if (state === 'idle' || state === 'fetchingPart' || state === 'partFetched') return 1
		if (state === 'reviewingOperations') return 2
		if (state === 'enteringDetails' || state === 'submitting') return 3
		return 1
	}
</script>

<Dialog.Root {open} onOpenChange={handleOpenChange}>
	<Dialog.Trigger>
		<Button>
			<PlusCircleIcon class="mr-2 h-4 w-4" />
			Create Job
		</Button>
	</Dialog.Trigger>

	<Dialog.Content class="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
		<Dialog.Header>
			<Dialog.Title>Create New Job</Dialog.Title>
			<Dialog.Description>
				Follow the steps to create a new manufacturing job
			</Dialog.Description>
		</Dialog.Header>

		{#if !$snapshot.matches('completed') && !$snapshot.matches('error')}
			<div class="sticky top-0 z-10 bg-background pt-4 pb-4 border-b">
				<CreateJobStepIndicator currentStep={getCurrentStep($snapshot.value)} />
			</div>
		{/if}

		<div class="flex-1 overflow-y-auto px-1">
			{#if $snapshot.matches('idle') || $snapshot.matches('fetchingPart') || $snapshot.matches('partFetched')}
				<PartInputStep
					partNumber={$snapshot.context.partNumber}
					partData={$snapshot.context.partData}
					isLoading={$snapshot.matches('fetchingPart')}
					onPartNumberChange={(val) => send({ type: 'UPDATE_PART_NUMBER', value: val })}
					onFetch={handleFetchPart}
					onContinue={() => send({ type: 'CONTINUE' })}
				/>
			{:else if $snapshot.matches('reviewingOperations')}
				<OperationsPreviewStep
					{operations}
					onBack={() => send({ type: 'BACK' })}
					onContinue={() => send({ type: 'CONTINUE' })}
				/>
			{:else if $snapshot.matches('enteringDetails')}
				<JobDetailsStep
					partData={$snapshot.context.partData!}
					selectedWorkOrderIds={$snapshot.context.selectedWorkOrderIds}
					priority={$snapshot.context.priority}
					dueDate={$snapshot.context.dueDate}
					notes={$snapshot.context.notes}
					onWorkOrdersChange={(ids) => send({ type: 'UPDATE_WORK_ORDERS', value: ids })}
					onPriorityChange={(val) => send({ type: 'UPDATE_PRIORITY', value: val })}
					onDueDateChange={(val) => send({ type: 'UPDATE_DUE_DATE', value: val })}
					onNotesChange={(val) => send({ type: 'UPDATE_NOTES', value: val })}
					onBack={() => send({ type: 'BACK' })}
					onSubmit={handleSubmit}
				/>
			{:else if $snapshot.matches('submitting')}
				<div class="text-center py-12">
					<p class="text-muted-foreground">Creating job...</p>
				</div>
			{:else if $snapshot.matches('completed')}
				<JobCreatedStep
					job={$snapshot.context.createdJob!}
					partData={$snapshot.context.partData!}
					onClose={handleClose}
					onCreateAnother={() => send({ type: 'RESET' })}
				/>
			{:else if $snapshot.matches('error')}
				<ErrorStep
					error={$snapshot.context.error}
					onRetry={() => send({ type: 'RETRY' })}
					onCancel={handleClose}
				/>
			{/if}
		</div>
	</Dialog.Content>
</Dialog.Root>
