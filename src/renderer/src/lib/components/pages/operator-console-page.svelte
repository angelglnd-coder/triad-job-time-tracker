<script lang="ts">
	import { operationStore } from "$lib/stores/operation-store.svelte";
	import { timeTrackingStore } from "$lib/stores/time-tracking-store.svelte";
	import { authStore } from "$lib/stores/auth-store.svelte";
	import { onMount } from "svelte";
	import * as Card from "$lib/components/ui/card";
	import { Button } from "$lib/components/ui/button";
	import { Badge } from "$lib/components/ui/badge";
	import PlayIcon from "@lucide/svelte/icons/play";
	import PauseIcon from "@lucide/svelte/icons/pause";
	import CheckCircleIcon from "@lucide/svelte/icons/check-circle";
	import ClockIcon from "@lucide/svelte/icons/clock";
	import type { JobOperation } from "$lib/types";

	onMount(() => {
		if (authStore.currentUser) {
			operationStore.loadOperationsByUser(authStore.currentUser.id);
		}
	});

	async function handleStartOperation(operation: JobOperation) {
		await timeTrackingStore.startOperation(operation);
		// Refresh operations to update status
		if (authStore.currentUser) {
			operationStore.loadOperationsByUser(authStore.currentUser.id);
		}
	}

	async function handlePauseOperation() {
		await timeTrackingStore.pauseOperation();
		// Refresh operations
		if (authStore.currentUser) {
			operationStore.loadOperationsByUser(authStore.currentUser.id);
		}
	}

	function getStatusColor(status: string): string {
		const colors: Record<string, string> = {
			assigned: "secondary",
			in_progress: "default",
			paused: "secondary",
			finished: "secondary",
		};
		return colors[status] || "default";
	}
</script>

<div class="flex flex-col gap-6 p-6">
	<div>
		<h1 class="text-3xl font-bold">My Operations</h1>
		<p class="text-muted-foreground">Operations assigned to you</p>
	</div>

	<!-- Active Timer Display -->
	{#if timeTrackingStore.isWorking && timeTrackingStore.currentOperation}
		<Card.Root class="border-primary">
			<Card.Header>
				<Card.Title class="flex items-center gap-2">
					<ClockIcon class="h-5 w-5 text-primary" />
					Currently Working
				</Card.Title>
			</Card.Header>
			<Card.Content class="space-y-4">
				<div>
					<div class="text-2xl font-bold">
						{timeTrackingStore.currentOperation.operation_name}
					</div>
					<div class="text-sm text-muted-foreground">
						Operation {timeTrackingStore.currentOperation.operation_sequence}
						{#if timeTrackingStore.currentOperation.job?.job_number}
							- {timeTrackingStore.currentOperation.job.job_number}
						{/if}
					</div>
				</div>

				<div class="flex items-center justify-between">
					<div>
						<div class="text-4xl font-mono font-bold tabular-nums">
							{timeTrackingStore.formattedElapsedTime}
						</div>
						<div class="text-sm text-muted-foreground">Elapsed Time</div>
					</div>

					<div class="flex gap-2">
						<Button variant="outline" onclick={handlePauseOperation}>
							<PauseIcon class="mr-2 h-4 w-4" />
							Pause
						</Button>
						<Button variant="destructive">
							<CheckCircleIcon class="mr-2 h-4 w-4" />
							Finish
						</Button>
					</div>
				</div>
			</Card.Content>
		</Card.Root>
	{/if}

	<!-- Assigned Operations List -->
	{#if operationStore.isLoading}
		<div class="text-center py-12">
			<p class="text-muted-foreground">Loading operations...</p>
		</div>
	{:else if operationStore.operations.length === 0}
		<Card.Root>
			<Card.Content class="pt-6 text-center py-12">
				<p class="text-muted-foreground">No operations assigned to you</p>
			</Card.Content>
		</Card.Root>
	{:else}
		<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
			{#each operationStore.operations as operation}
				<Card.Root>
					<Card.Header>
						<div class="flex items-start justify-between">
							<div>
								<Card.Title>
									{operation.operation_name}
								</Card.Title>
								<Card.Description>
									Sequence {operation.operation_sequence}
								</Card.Description>
							</div>
							<Badge variant={getStatusColor(operation.status)}>{operation.status}</Badge>
						</div>
					</Card.Header>
					<Card.Content class="space-y-2">
						{#if operation.job}
							<div class="text-sm">
								<span class="font-medium">Job:</span>
								{operation.job.job_number}
							</div>
						{/if}
						{#if operation.work_center}
							<div class="text-sm">
								<span class="font-medium">Work Center:</span>
								{operation.work_center.name}
							</div>
						{/if}
						<div class="text-sm">
							<span class="font-medium">Planned Time:</span>
							{operation.planned_total_time_min.toFixed(1)} min
						</div>
						{#if operation.actual_time_min > 0}
							<div class="text-sm">
								<span class="font-medium">Actual Time:</span>
								{operation.actual_time_min.toFixed(1)} min
							</div>
						{/if}
					</Card.Content>
					<Card.Footer>
						{#if operation.status === "assigned"}
							<Button
								variant="default"
								size="sm"
								class="w-full"
								onclick={() => handleStartOperation(operation)}
							>
								<PlayIcon class="mr-2 h-4 w-4" />
								Start
							</Button>
						{:else if operation.status === "paused"}
							<Button
								variant="default"
								size="sm"
								class="w-full"
								onclick={() => handleStartOperation(operation)}
							>
								<PlayIcon class="mr-2 h-4 w-4" />
								Resume
							</Button>
						{:else if operation.status === "finished"}
							<Button variant="outline" size="sm" class="w-full" disabled>
								Completed
							</Button>
						{/if}
					</Card.Footer>
				</Card.Root>
			{/each}
		</div>
	{/if}
</div>
