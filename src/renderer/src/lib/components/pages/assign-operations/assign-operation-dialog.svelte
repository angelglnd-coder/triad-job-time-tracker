<script lang="ts">
	import { useMachine } from "@xstate/svelte";
	import { assignmentMachine } from "$lib/machines/assignment-machine";
	import { globalStore } from "$lib/stores/global-store.svelte";
	import * as Dialog from "$lib/components/ui/dialog";
	import { Button } from "$lib/components/ui/button";
	import OperatorSelectionStep from "./operator-selection-step.svelte";
	import JobSelectionStep from "./job-selection-step.svelte";
	import OperationSelectionStep from "./operation-selection-step.svelte";
	import ReviewStep from "./review-step.svelte";
	import CompletedStep from "./completed-step.svelte";
	import ErrorStep from "./error-step.svelte";
	import StepIndicator from "./step-indicator.svelte";
	import BriefcaseIcon from "@lucide/svelte/icons/briefcase";

	interface Props {
		open?: boolean;
		onOpenChange?: (open: boolean) => void;
	}

	let { open = $bindable(false), onOpenChange }: Props = $props();

	const { snapshot, send } = useMachine(assignmentMachine);

	let operators = $derived(globalStore.getOperators());
	let jobs = $derived(globalStore.getAllJobs());
	let operations = $derived.by(() => {
		if (!$snapshot.context.selectedJob) return [];
		return globalStore
			.getJobOperations($snapshot.context.selectedJob.id)
			.filter((op) => op.status === "unassigned" || op.status === "assigned");
	});

	function handleOperatorSelect(operator: typeof operators[0]) {
		send({ type: "SELECT_OPERATOR", operator });
	}

	function handleJobSelect(job: typeof jobs[0]) {
		send({ type: "JOB_SELECTED", job });
	}

	function handleOperationSelect(operation: typeof operations[0]) {
		send({ type: "OPERATION_SELECTED", operation });
	}

	async function handleSubmit() {
		const { selectedOperator, selectedOperation } = $snapshot.context;

		if (!selectedOperator || !selectedOperation) {
			send({ type: "ERROR", error: "Missing operator or operation" });
			return;
		}

		const success = globalStore.assignOperationToUser(selectedOperation.id, selectedOperator.id);

		if (success) {
			send({
				type: "SUCCESS",
				assignmentId: selectedOperation.id,
				timestamp: new Date().toISOString(),
			});
		} else {
			send({
				type: "ERROR",
				error: "Failed to assign operation. The operation or operator may not exist.",
			});
		}
	}

	function getCurrentStep(state: typeof $snapshot.value): number {
		if (state === "idle" || state === "operatorSelected") return 1;
		if (state === "selectingJob") return 2;
		if (state === "jobSelected" || state === "operationSelected") return 3;
		if (state === "reviewing" || state === "submitting") return 4;
		return 1;
	}

	function handleOpenChange(newOpen: boolean) {
		open = newOpen;
		onOpenChange?.(newOpen);

		// Reset machine when dialog closes
		if (!newOpen && !$snapshot.matches("idle")) {
			send({ type: "RESET" });
		}
	}

	function handleReset() {
		send({ type: "RESET" });
		open = false;
	}

	// Automatically trigger submit when machine enters submitting state
	$effect(() => {
		if ($snapshot.matches("submitting")) {
			handleSubmit();
		}
	});
</script>

<Dialog.Root {open} onOpenChange={handleOpenChange}>
	<Dialog.Trigger>
		<Button>
			<BriefcaseIcon class="mr-2 h-4 w-4" />
			Assign Work
		</Button>
	</Dialog.Trigger>
	<Dialog.Content class="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
		<Dialog.Header>
			<Dialog.Title>Assign Operation to Operator</Dialog.Title>
			<Dialog.Description>
				Follow the steps to assign an operation to an operator
			</Dialog.Description>
		</Dialog.Header>

		{#if !$snapshot.matches("completed") && !$snapshot.matches("error")}
			<div class="sticky top-0 z-10 bg-background pt-4 pb-4 border-b">
				<StepIndicator currentStep={getCurrentStep($snapshot.value)} />
			</div>
		{/if}

		<div class="flex-1 overflow-y-auto px-1">
			{#if $snapshot.matches("idle") || $snapshot.matches("operatorSelected")}
				<OperatorSelectionStep
					operators={operators}
					selected={$snapshot.context.selectedOperator}
					onSelect={handleOperatorSelect}
					onContinue={() => send({ type: "CONTINUE" })}
				/>
			{:else if $snapshot.matches("selectingJob")}
				<JobSelectionStep
					jobs={jobs}
					selected={$snapshot.context.selectedJob}
					onSelect={handleJobSelect}
					onBack={() => send({ type: "BACK" })}
				/>
			{:else if $snapshot.matches("jobSelected") || $snapshot.matches("operationSelected")}
				<OperationSelectionStep
					operations={operations}
					selected={$snapshot.context.selectedOperation}
					onSelect={handleOperationSelect}
					onConfirm={() => send({ type: "CONFIRM" })}
					onBack={() => send({ type: "BACK" })}
				/>
			{:else if $snapshot.matches("reviewing")}
				<ReviewStep
					context={$snapshot.context}
					onConfirm={() => send({ type: "SUBMIT" })}
					onBack={() => send({ type: "BACK" })}
				/>
			{:else if $snapshot.matches("submitting")}
				<div class="text-center py-12">
					<p class="text-muted-foreground">Processing assignment...</p>
				</div>
			{:else if $snapshot.matches("completed")}
				<CompletedStep context={$snapshot.context} onReset={handleReset} />
			{:else if $snapshot.matches("error")}
				<ErrorStep
					error={$snapshot.context.error}
					onRetry={() => send({ type: "RETRY" })}
					onReset={handleReset}
				/>
			{/if}
		</div>
	</Dialog.Content>
</Dialog.Root>
