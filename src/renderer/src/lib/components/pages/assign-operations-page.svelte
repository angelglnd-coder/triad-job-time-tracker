<script lang="ts">
	import { operationStore } from "$lib/stores/operation-store.svelte";
	import { onMount } from "svelte";
	import * as Card from "$lib/components/ui/card";
	import { Button } from "$lib/components/ui/button";
	import { Badge } from "$lib/components/ui/badge";
	import UserPlusIcon from "@lucide/svelte/icons/user-plus";
	import FilterIcon from "@lucide/svelte/icons/filter";

	onMount(() => {
		operationStore.loadOperations();
	});

	function getStatusColor(status: string): string {
		const colors: Record<string, string> = {
			unassigned: "destructive",
			assigned: "secondary",
			in_progress: "default",
			paused: "secondary",
			finished: "secondary",
		};
		return colors[status] || "default";
	}
</script>

<div class="flex flex-col gap-6 p-6">
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-3xl font-bold">Assign Operations</h1>
			<p class="text-muted-foreground">Assign operations to operators</p>
		</div>
		<Button variant="outline">
			<FilterIcon class="mr-2 h-4 w-4" />
			Filter
		</Button>
	</div>

	{#if operationStore.isLoading}
		<div class="text-center py-12">
			<p class="text-muted-foreground">Loading operations...</p>
		</div>
	{:else if operationStore.operations.length === 0}
		<Card.Root>
			<Card.Content class="pt-6 text-center py-12">
				<p class="text-muted-foreground">No operations found</p>
			</Card.Content>
		</Card.Root>
	{:else}
		<div class="grid gap-4">
			{#each operationStore.operations as operation}
				<Card.Root>
					<Card.Header>
						<div class="flex items-center justify-between">
							<div class="flex-1">
								<div class="flex items-center gap-3">
									<div>
										<Card.Title>{operation.operation_name}</Card.Title>
										<Card.Description>
											Sequence {operation.operation_sequence}
											{#if operation.job}
												- Job {operation.job.job_number}
											{/if}
										</Card.Description>
									</div>
								</div>
							</div>
							<div class="flex items-center gap-2">
								<Badge variant={getStatusColor(operation.status)}>
									{operation.status}
								</Badge>
								{#if operation.status === "unassigned"}
									<Button size="sm">
										<UserPlusIcon class="mr-2 h-4 w-4" />
										Assign
									</Button>
								{:else if operation.assigned_to_user}
									<Button size="sm" variant="outline">
										Reassign
									</Button>
								{/if}
							</div>
						</div>
					</Card.Header>
					<Card.Content class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
						{#if operation.work_center}
							<div>
								<span class="text-muted-foreground">Work Center:</span>
								<div class="font-medium">{operation.work_center.name}</div>
							</div>
						{/if}
						{#if operation.assigned_to_user}
							<div>
								<span class="text-muted-foreground">Assigned To:</span>
								<div class="font-medium">{operation.assigned_to_user.full_name}</div>
							</div>
						{/if}
						<div>
							<span class="text-muted-foreground">Planned Time:</span>
							<div class="font-medium">{operation.planned_total_time_min.toFixed(1)} min</div>
						</div>
						{#if operation.actual_time_min > 0}
							<div>
								<span class="text-muted-foreground">Actual Time:</span>
								<div class="font-medium">{operation.actual_time_min.toFixed(1)} min</div>
							</div>
						{/if}
					</Card.Content>
				</Card.Root>
			{/each}
		</div>
	{/if}
</div>
