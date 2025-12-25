<script lang="ts">
	import type { JobOperation } from "$lib/types";
	import * as Card from "$lib/components/ui/card";
	import { Button } from "$lib/components/ui/button";
	import { Badge } from "$lib/components/ui/badge";
	import SettingsIcon from "@lucide/svelte/icons/settings";
	import ChevronLeftIcon from "@lucide/svelte/icons/chevron-left";
	import ChevronRightIcon from "@lucide/svelte/icons/chevron-right";
	import ClockIcon from "@lucide/svelte/icons/clock";
	import BuildingIcon from "@lucide/svelte/icons/building";

	interface Props {
		operations: JobOperation[];
		selected: JobOperation | null;
		onSelect: (operation: JobOperation) => void;
		onConfirm: () => void;
		onBack: () => void;
	}

	let { operations, selected, onSelect, onConfirm, onBack }: Props = $props();

	function getStatusColor(
		status: string
	): "default" | "secondary" | "destructive" | "outline" {
		const colors: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
			unassigned: "destructive",
			assigned: "secondary",
			in_progress: "default",
			paused: "secondary",
			finished: "secondary",
			cancelled: "destructive",
		};
		return colors[status] || "default";
	}
</script>

<div class="flex flex-col h-full">
	<div class="py-4">
		<h2 class="text-2xl font-semibold">Select Operation</h2>
		<p class="text-muted-foreground">Choose the specific operation to assign</p>
	</div>

	<div class="flex-1 overflow-y-auto py-4">
		<div class="grid grid-cols-1 gap-4">
			{#each operations as operation}
				<Card.Root
					class="cursor-pointer transition-all hover:shadow-md {selected?.id === operation.id
						? 'ring-2 ring-primary border-primary'
						: ''}"
					onclick={() => onSelect(operation)}
				>
					<Card.Header>
						<div class="flex items-start justify-between">
							<div class="flex items-center gap-3">
								<div
									class="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10"
								>
									<SettingsIcon class="h-5 w-5 text-primary" />
								</div>
								<div>
									<Card.Title class="text-lg">
										{operation.operation_name}
									</Card.Title>
									<Card.Description>
										Sequence {operation.operation_sequence}
										{#if operation.operation_code}
											- {operation.operation_code}
										{/if}
									</Card.Description>
								</div>
							</div>
							<div class="flex items-center gap-2">
								{#if selected?.id === operation.id}
									<Badge variant="default">Selected</Badge>
								{:else}
									<Badge variant={getStatusColor(operation.status)}>
										{operation.status.replace("_", " ")}
									</Badge>
								{/if}
							</div>
						</div>
					</Card.Header>
					<Card.Content class="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
						<div>
							<span class="text-muted-foreground flex items-center gap-1">
								<BuildingIcon class="h-3 w-3" />
								Work Center:
							</span>
							<div class="font-medium">
								{operation.work_center?.name || operation.work_center_id}
							</div>
						</div>
						<div>
							<span class="text-muted-foreground flex items-center gap-1">
								<ClockIcon class="h-3 w-3" />
								Planned Time:
							</span>
							<div class="font-medium">
								{operation.planned_total_time_min.toFixed(1)} min
							</div>
						</div>
						{#if operation.assigned_to_user}
							<div>
								<span class="text-muted-foreground">Currently Assigned:</span>
								<div class="font-medium">
									{operation.assigned_to_user.full_name}
								</div>
							</div>
						{/if}
						{#if operation.actual_time_min > 0}
							<div>
								<span class="text-muted-foreground">Actual Time:</span>
								<div class="font-medium">
									{operation.actual_time_min.toFixed(1)} min
								</div>
							</div>
						{/if}
					</Card.Content>
				</Card.Root>
			{/each}
		</div>

		{#if operations.length === 0}
			<Card.Root>
				<Card.Content class="py-12 text-center">
					<p class="text-muted-foreground">
						No operations available for this job. Please select a different job.
					</p>
				</Card.Content>
			</Card.Root>
		{/if}
	</div>

	<div class="sticky bottom-0 bg-background border-t pt-4 mt-4">
		<div class="flex justify-between gap-3">
			<Button variant="outline" onclick={onBack}>
				<ChevronLeftIcon class="mr-2 h-4 w-4" />
				Back
			</Button>
			<Button onclick={onConfirm} disabled={!selected}>
				Review Assignment
				<ChevronRightIcon class="ml-2 h-4 w-4" />
			</Button>
		</div>
	</div>
</div>
