<script lang="ts">
	import type { AssignmentMachineContext } from "$lib/machines/assignment-machine";
	import * as Card from "$lib/components/ui/card";
	import { Button } from "$lib/components/ui/button";
	import { Badge } from "$lib/components/ui/badge";
	import CheckCircleIcon from "@lucide/svelte/icons/check-circle";
	import PlusIcon from "@lucide/svelte/icons/plus";
	import { globalStore } from "$lib/stores/global-store.svelte";

	interface Props {
		context: AssignmentMachineContext;
		onReset: () => void;
	}

	let { context, onReset }: Props = $props();

	function getPartNumber(): string {
		if (!context.selectedJob) return "Unknown";
		return context.selectedJob.part?.part_number || context.selectedJob.part_number || "Unknown";
	}

	// Get all assigned operations
	let allAssignedOperations = $derived.by(() => {
		return globalStore.getAllOperations().filter(op => op.status === 'assigned' && op.assigned_to_user_id !== undefined)
	})
</script>

<div class="space-y-4">
	<div class="text-center space-y-2">
		<div class="flex justify-center">
			<div class="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
				<CheckCircleIcon class="h-10 w-10 text-green-600" />
			</div>
		</div>
		<h2 class="text-2xl font-semibold">Assignment Successful!</h2>
		<p class="text-muted-foreground">
			The operation has been successfully assigned to the operator
		</p>
	</div>

	<Card.Root>
		<Card.Header>
			<Card.Title>Assignment Details</Card.Title>
		</Card.Header>
		<Card.Content class="space-y-4">
			{#if context.assignedAt}
				<div class="flex justify-between items-center pb-3 border-b">
					<span class="text-sm text-muted-foreground">Assigned At</span>
					<span class="font-medium">
						{new Date(context.assignedAt).toLocaleString()}
					</span>
				</div>
			{/if}

			{#if context.selectedOperator}
				<div class="flex justify-between items-center pb-3 border-b">
					<span class="text-sm text-muted-foreground">Operator</span>
					<div class="text-right">
						<div class="font-medium">{context.selectedOperator.full_name}</div>
						<div class="text-xs text-muted-foreground">
							ID: {context.selectedOperator.id}
						</div>
					</div>
				</div>
			{/if}

			{#if context.selectedJob}
				<div class="flex justify-between items-center pb-3 border-b">
					<span class="text-sm text-muted-foreground">Job</span>
					<div class="text-right">
						<div class="font-medium">
							{context.selectedJob.job_number}
						</div>
						<div class="text-xs text-muted-foreground">
							Part: {getPartNumber()}
						</div>
					</div>
				</div>
			{/if}

			{#if context.selectedOperation}
				<div class="flex justify-between items-center">
					<span class="text-sm text-muted-foreground">Operation</span>
					<div class="text-right">
						<div class="font-medium">{context.selectedOperation.operation_name}</div>
						<div class="text-xs text-muted-foreground">
							Sequence: {context.selectedOperation.operation_sequence}
						</div>
					</div>
				</div>
			{/if}
		</Card.Content>
	</Card.Root>

	{#if context.operatorHasAssignments && context.selectedOperator}
		<Card.Root class="border-blue-200 bg-blue-50">
			<Card.Content class="pt-6">
				<div class="text-sm text-blue-900">
					<strong>Note:</strong> This operator now has
					{context.operatorCurrentAssignments.length + 1} total operation(s) assigned.
				</div>
			</Card.Content>
		</Card.Root>
	{/if}

	<!-- All Assigned Operations List -->
	{#if allAssignedOperations.length > 0}
		<Card.Root>
			<Card.Header>
				<Card.Title>All Assigned Operations ({allAssignedOperations.length})</Card.Title>
				<Card.Description>Complete list of operations currently assigned to operators</Card.Description>
			</Card.Header>
			<Card.Content>
				<div class="max-h-96 overflow-y-auto">
					<table class="w-full">
						<thead class="bg-muted sticky top-0">
							<tr class="border-b">
								<th class="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">Part</th>
								<th class="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">Operation</th>
								<th class="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">Operator</th>
								<th class="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">Assigned</th>
							</tr>
						</thead>
						<tbody class="divide-y">
							{#each allAssignedOperations as operation}
								{@const job = globalStore.getJob(operation.job_id)}
								{@const operator = globalStore.getUser(operation.assigned_to_user_id!)}
								<tr class="hover:bg-muted/30 transition-colors">
									<td class="px-4 py-3">
										<div class="text-sm font-medium">
											{job?.part?.part_number || job?.part_number || '-'}
										</div>
										<div class="text-xs text-muted-foreground">
											Job: {job?.job_number || `#${operation.job_id}`}
										</div>
									</td>
									<td class="px-4 py-3">
										<div class="text-sm font-medium">{operation.operation_name}</div>
										<div class="text-xs text-muted-foreground">
											Seq: {operation.operation_sequence}
										</div>
									</td>
									<td class="px-4 py-3">
										<div class="text-sm font-medium">
											{operator?.full_name || `User #${operation.assigned_to_user_id}`}
										</div>
										{#if operator}
											<div class="text-xs text-muted-foreground">
												ID: {operator.id}
											</div>
										{/if}
									</td>
									<td class="px-4 py-3">
										{#if operation.assigned_at}
											<div class="text-xs text-muted-foreground">
												{new Date(operation.assigned_at).toLocaleDateString()}
											</div>
											<div class="text-xs text-muted-foreground">
												{new Date(operation.assigned_at).toLocaleTimeString()}
											</div>
										{:else}
											<div class="text-xs text-muted-foreground">-</div>
										{/if}
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			</Card.Content>
		</Card.Root>
	{/if}

	<div class="flex justify-center gap-3">
		<Button onclick={onReset} class="w-full sm:w-auto">
			<PlusIcon class="mr-2 h-4 w-4" />
			Assign Another Operation
		</Button>
	</div>
</div>
