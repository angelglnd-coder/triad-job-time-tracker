<script lang="ts">
	import AssignOperationDialog from "./assign-operations/assign-operation-dialog.svelte";
	import { globalStore } from "$lib/stores/global-store.svelte";
	import { Grid, Willow } from "@svar-ui/svelte-grid";
	import * as Card from "$lib/components/ui/card";
	import { Badge } from "$lib/components/ui/badge";
	import type { JobOperation } from "$lib/types";

	// Get assigned operations
	let assignedOperations = $derived(globalStore.getAssignedOperations());

	// Format time in minutes to "Xh Ym" format
	function formatTime(minutes: number): string {
		if (minutes === 0) return "0m";
		const hours = Math.floor(minutes / 60);
		const mins = Math.round(minutes % 60);
		if (hours === 0) return `${mins}m`;
		if (mins === 0) return `${hours}h`;
		return `${hours}h ${mins}m`;
	}

	// Format date to readable format
	function formatDate(dateString: string | undefined): string {
		if (!dateString) return "N/A";
		const date = new Date(dateString);
		return date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
	}

	// Grid columns configuration
	const columns = [
		{ id: "operation_name", header: "Operation", width: 150 },
		{ id: "job_number", header: "Job", width: 150 },
		{ id: "work_orders", header: "Work Orders", width: 200 },
		{ id: "assigned_to", header: "Assigned To", width: 180 },
		{ id: "planned_time", header: "Planned Time", width: 120 },
		{ id: "assigned_at", header: "Assigned At", width: 180 },
		{ id: "status", header: "Status", width: 120 },
	];

	// Transform operations for grid
	let gridData = $derived(
		assignedOperations.map((op) => {
			const job = globalStore.getJob(op.job_id);
			// Handle both work_order_numbers array and legacy work_order_number
			const workOrders = job?.work_order_numbers?.join(", ") || job?.work_order_number || "N/A";
			return {
				id: op.id,
				operation_name: op.operation_code ? `${op.operation_name} (${op.operation_code})` : op.operation_name,
				job_number: job?.job_number || `#${op.job_id}`,
				work_orders: workOrders,
				assigned_to: op.assigned_to_user?.full_name || "N/A",
				planned_time: formatTime(op.planned_total_time_min),
				assigned_at: formatDate(op.assigned_at),
				status: op.status,
			};
		})
	);
</script>

<div class="flex flex-col gap-6 p-6">
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-3xl font-bold">Assign Operations</h1>
			<p class="text-muted-foreground">Assign operations to operators</p>
		</div>
		<AssignOperationDialog />
	</div>

	<!-- Assigned Operations Grid -->
	<Card.Root>
		<Card.Header>
			<Card.Title>Currently Assigned Operations</Card.Title>
			<Card.Description>
				View all operations that have been assigned to operators
			</Card.Description>
		</Card.Header>
		<Card.Content>
			{#if assignedOperations.length === 0}
				<div class="text-center py-12">
					<p class="text-muted-foreground">No operations currently assigned</p>
					<p class="text-sm text-muted-foreground mt-2">
						Use the "Assign Work" button to assign operations to operators
					</p>
				</div>
			{:else}
				<div class="h-[calc(100vh-350px)]">
					<Willow>
						<Grid data={gridData} {columns} />
					</Willow>
				</div>
			{/if}
		</Card.Content>
	</Card.Root>
</div>
