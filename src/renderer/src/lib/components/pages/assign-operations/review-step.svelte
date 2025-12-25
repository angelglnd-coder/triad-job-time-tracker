<script lang="ts">
	import type { AssignmentMachineContext } from "$lib/machines/assignment-machine";
	import * as Card from "$lib/components/ui/card";
	import { Button } from "$lib/components/ui/button";
	import { Badge } from "$lib/components/ui/badge";
	import ChevronLeftIcon from "@lucide/svelte/icons/chevron-left";
	import CheckIcon from "@lucide/svelte/icons/check";
	import UserIcon from "@lucide/svelte/icons/user";
	import BriefcaseIcon from "@lucide/svelte/icons/briefcase";
	import SettingsIcon from "@lucide/svelte/icons/settings";
	import AlertTriangleIcon from "@lucide/svelte/icons/alert-triangle";
	import { globalStore } from "$lib/stores/global-store.svelte";

	interface Props {
		context: AssignmentMachineContext;
		onConfirm: () => void;
		onBack: () => void;
	}

	let { context, onConfirm, onBack }: Props = $props();

	function getPartNumber(): string {
		if (!context.selectedJob) return "Unknown";
		return context.selectedJob.part?.part_number || context.selectedJob.part_number || "Unknown";
	}
</script>

<div class="flex flex-col h-full">
	<div>
		<h2 class="text-2xl font-semibold">Review Assignment</h2>
		<p class="text-muted-foreground">
			Please review the assignment details before confirming
		</p>
	</div>

	{#if context.operatorHasAssignments && context.selectedOperator}
		<Card.Root class="border-yellow-500 bg-yellow-50">
			<Card.Content class="pt-6">
				<div class="flex items-start gap-3">
					<AlertTriangleIcon class="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
					<div class="flex-1">
						<div class="font-medium text-yellow-900">Operator Already Has Assignments</div>
						<div class="text-sm text-yellow-700 mt-1">
							{context.selectedOperator.full_name} currently has
							{context.operatorCurrentAssignments.length} operation(s) assigned.
						</div>
						<div class="mt-2 space-y-1">
							{#each context.operatorCurrentAssignments.slice(0, 3) as op}
								{@const job = globalStore.getJob(op.job_id)}
								<div class="text-xs text-yellow-600">
									• {op.operation_name} (Job {job?.job_number || `#${op.job_id}`}) - Status:
									{op.status}
								</div>
							{/each}
							{#if context.operatorCurrentAssignments.length > 3}
								<div class="text-xs text-yellow-600">
									... and {context.operatorCurrentAssignments.length - 3} more
								</div>
							{/if}
						</div>
					</div>
				</div>
			</Card.Content>
		</Card.Root>
	{/if}

	<Card.Root>
		<Card.Header>
			<Card.Title>Assignment Summary</Card.Title>
			<Card.Description>Confirm the following details are correct</Card.Description>
		</Card.Header>
		<Card.Content class="space-y-6">
			{#if context.selectedOperator}
				<div class="flex items-start gap-3">
					<div class="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
						<UserIcon class="h-5 w-5 text-primary" />
					</div>
					<div class="flex-1">
						<div class="text-sm text-muted-foreground">Operator</div>
						<div class="font-semibold text-lg">{context.selectedOperator.full_name}</div>
						<div class="text-sm text-muted-foreground">
							ID: {context.selectedOperator.id} • Username: {context.selectedOperator.username}
							• Role: <span class="capitalize">{context.selectedOperator.role}</span>
						</div>
					</div>
					<Badge variant="secondary">Operator</Badge>
				</div>
			{/if}

			{#if context.selectedJob}
				<div class="flex items-start gap-3">
					<div class="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
						<BriefcaseIcon class="h-5 w-5 text-primary" />
					</div>
					<div class="flex-1">
						<div class="text-sm text-muted-foreground">Job</div>
						<div class="font-semibold text-lg">
							{context.selectedJob.job_number} - {getPartNumber()}
						</div>
						<div class="text-sm text-muted-foreground">
							Quantity: {context.selectedJob.quantity_completed}/{context.selectedJob
								.quantity_ordered}
							• Priority: {context.selectedJob.priority}
							• Status: <span class="capitalize"
								>{context.selectedJob.status.replace("_", " ")}</span
							>
						</div>
					</div>
					<Badge variant="secondary">Job</Badge>
				</div>
			{/if}

			{#if context.selectedOperation}
				<div class="flex items-start gap-3">
					<div class="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
						<SettingsIcon class="h-5 w-5 text-primary" />
					</div>
					<div class="flex-1">
						<div class="text-sm text-muted-foreground">Operation</div>
						<div class="font-semibold text-lg">{context.selectedOperation.operation_name}</div>
						<div class="text-sm text-muted-foreground">
							Sequence: {context.selectedOperation.operation_sequence}
							{#if context.selectedOperation.operation_code}
								• Code: {context.selectedOperation.operation_code}
							{/if}
							• Work Center: {context.selectedOperation.work_center?.name ||
								context.selectedOperation.work_center_id}
						</div>
						<div class="text-sm text-muted-foreground mt-1">
							Planned Time: {context.selectedOperation.planned_total_time_min.toFixed(1)} min
							{#if context.selectedOperation.actual_time_min > 0}
								• Actual Time: {context.selectedOperation.actual_time_min.toFixed(1)} min
							{/if}
						</div>
					</div>
					<Badge variant="secondary">Operation</Badge>
				</div>
			{/if}
		</Card.Content>
	</Card.Root>

	<div class="sticky bottom-0 bg-background border-t pt-4 mt-4">
		<div class="flex justify-between gap-3">
			<Button variant="outline" onclick={onBack}>
				<ChevronLeftIcon class="mr-2 h-4 w-4" />
				Back
			</Button>
			<Button onclick={onConfirm}>
				<CheckIcon class="mr-2 h-4 w-4" />
				Confirm Assignment
			</Button>
		</div>
	</div>
</div>
