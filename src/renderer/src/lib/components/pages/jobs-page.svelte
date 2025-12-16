<script lang="ts">
	import { globalStore } from "$lib/stores/global-store.svelte";
	import { Grid, Willow } from "@svar-ui/svelte-grid";
	import * as Card from "$lib/components/ui/card";
	import * as Sheet from "$lib/components/ui/sheet";
	import { Button } from "$lib/components/ui/button";
	import { Badge } from "$lib/components/ui/badge";
	import RefreshCwIcon from "@lucide/svelte/icons/refresh-cw";
	import type { JobStatus, Job, JobOperation } from "$lib/types";

	let jobs = $state<Job[]>([])
	let isLoading = $state(false)
	let selectedJob = $state<Job | null>(null)
	let jobOperations = $state<JobOperation[]>([])
	let isSheetOpen = $state(false)

	// Grid columns configuration
	const columns = [
		{ id: "job_number", header: "Job Number", width: 150 },
		{ id: "part_number", header: "Part Number", width: 200 },
		{ id: "status", header: "Status", width: 120 },
		{ id: "work_orders_display", header: "Work Orders", width: 200 },
		{ id: "quantity_display", header: "Quantity", width: 120 },
		{ id: "priority", header: "Priority", width: 100 },
		{ id: "due_date_display", header: "Due Date", width: 150 },
		{
			id: "actions",
			header: "Actions",
			width: 120,
			template: (row: any) => {
				return `<button class="view-details-btn" data-id="${row.id}">View Details</button>`
			}
		}
	]

	// Transform jobs data for grid display
	let gridData = $derived(jobs.map(job => ({
		...job,
		work_orders_display: job.work_order_numbers && job.work_order_numbers.length > 0
			? job.work_order_numbers.join(', ')
			: job.work_order_number || '-',
		quantity_display: `${job.quantity_completed}/${job.quantity_ordered}`,
		due_date_display: job.due_date ? new Date(job.due_date).toLocaleDateString() : '-'
	})))

	function loadJobs() {
		isLoading = true
		// Load jobs from global store
		jobs = globalStore.getAllJobs()
		isLoading = false
	}

	// Load jobs on mount
	$effect(() => {
		loadJobs()
	})

	function getStatusColor(status: JobStatus): string {
		const colors: Record<JobStatus, string> = {
			created: "secondary",
			ready: "default",
			in_progress: "default",
			on_hold: "secondary",
			completed: "secondary",
			cancelled: "destructive",
		};
		return colors[status] || "default";
	}

	function getOperationStatusColor(status: string): string {
		const colors: Record<string, string> = {
			unassigned: "secondary",
			assigned: "default",
			in_progress: "default",
			paused: "secondary",
			finished: "secondary",
			cancelled: "destructive",
		};
		return colors[status] || "default";
	}

	function viewJobDetails(job: Job) {
		selectedJob = job
		jobOperations = globalStore.getJobOperations(job.id)
		isSheetOpen = true
	}

	function handleGridClick(event: MouseEvent) {
		const target = event.target as HTMLElement

		// Check if clicked element or its parent is a button with view-details-btn class
		const button = target.closest('.view-details-btn')
		if (button) {
			const jobId = parseInt(button.getAttribute('data-id') || '0')
			const job = jobs.find(j => j.id === jobId)
			if (job) {
				viewJobDetails(job)
			}
			return
		}

		// Also try to handle row clicks by finding the closest row
		const row = target.closest('[role="row"]')
		if (row && !target.closest('button')) {
			// Get row index or ID from the row element
			const cells = row.querySelectorAll('[role="gridcell"]')
			if (cells.length > 0) {
				const firstCellText = cells[0].textContent?.trim()
				// Find job by job_number
				const job = jobs.find(j => j.job_number === firstCellText)
				if (job) {
					viewJobDetails(job)
				}
			}
		}
	}

	function formatTime(minutes: number): string {
		const hours = Math.floor(minutes / 60)
		const mins = Math.round(minutes % 60)
		return `${hours}h ${mins}m`
	}
</script>

<div class="flex flex-col gap-6 p-6">
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-3xl font-bold">Active Jobs</h1>
			<p class="text-muted-foreground">View and manage active manufacturing jobs</p>
		</div>
		<Button onclick={() => loadJobs()} disabled={isLoading}>
			<RefreshCwIcon class="mr-2 h-4 w-4" />
			Refresh
		</Button>
	</div>

	{#if isLoading}
		<div class="text-center py-12">
			<p class="text-muted-foreground">Loading jobs...</p>
		</div>
	{:else if jobs.length === 0}
		<Card.Root>
			<Card.Content class="pt-6 text-center py-12">
				<p class="text-muted-foreground">No active jobs found</p>
				<p class="text-sm text-muted-foreground mt-2">Create a new job to get started</p>
			</Card.Content>
		</Card.Root>
	{:else}
		<div class="h-[calc(100vh-200px)]" onclick={handleGridClick}>
			<Willow>
				<Grid
					data={gridData}
					{columns}
				/>
			</Willow>
		</div>
	{/if}
</div>

<!-- Job Details Sheet -->
<Sheet.Root bind:open={isSheetOpen}>
	<Sheet.Content side="right" class="w-full sm:max-w-4xl">
		<Sheet.Header class="px-6 pt-6">
			<Sheet.Title class="text-2xl">Job Details</Sheet.Title>
			<Sheet.Description class="text-base">
				{selectedJob ? `${selectedJob.job_number} - ${selectedJob.part_number}` : ''}
			</Sheet.Description>
		</Sheet.Header>

		{#if selectedJob}
			<div class="flex flex-col gap-8 px-6 py-6 h-[calc(100vh-120px)] overflow-auto">
				<!-- Job Information Card -->
				<Card.Root>
					<Card.Header class="pb-4">
						<Card.Title class="text-xl">Job Information</Card.Title>
					</Card.Header>
					<Card.Content>
						<div class="grid grid-cols-2 gap-6 text-sm">
							<div class="space-y-1">
								<span class="font-semibold text-muted-foreground text-xs uppercase tracking-wide">Job Number</span>
								<p class="text-base font-medium">{selectedJob.job_number}</p>
							</div>
							<div class="space-y-1">
								<span class="font-semibold text-muted-foreground text-xs uppercase tracking-wide">Status</span>
								<div>
									<Badge variant={getStatusColor(selectedJob.status)} class="text-sm">
										{selectedJob.status}
									</Badge>
								</div>
							</div>
							<div class="space-y-1">
								<span class="font-semibold text-muted-foreground text-xs uppercase tracking-wide">Part Number</span>
								<p class="text-base font-medium">{selectedJob.part_number}</p>
							</div>
							<div class="space-y-1">
								<span class="font-semibold text-muted-foreground text-xs uppercase tracking-wide">Priority</span>
								<p class="text-base font-medium">{selectedJob.priority}</p>
							</div>
							{#if selectedJob.work_order_numbers && selectedJob.work_order_numbers.length > 0}
								<div class="space-y-1">
									<span class="font-semibold text-muted-foreground text-xs uppercase tracking-wide">
										Work Orders ({selectedJob.work_order_numbers.length})
									</span>
									<div class="flex flex-wrap gap-1.5">
										{#each selectedJob.work_order_numbers as woNumber}
											<Badge variant="secondary" class="text-xs">
												{woNumber}
											</Badge>
										{/each}
									</div>
								</div>
							{:else if selectedJob.work_order_number}
								<div class="space-y-1">
									<span class="font-semibold text-muted-foreground text-xs uppercase tracking-wide">Work Order</span>
									<p class="text-base font-medium">{selectedJob.work_order_number}</p>
								</div>
							{/if}
							<div class="space-y-1">
								<span class="font-semibold text-muted-foreground text-xs uppercase tracking-wide">Quantity</span>
								<p class="text-base font-medium">
									<span class="text-green-600">{selectedJob.quantity_completed}</span>
									<span class="text-muted-foreground"> / </span>
									<span>{selectedJob.quantity_ordered}</span>
								</p>
							</div>
							{#if selectedJob.due_date}
								<div class="space-y-1">
									<span class="font-semibold text-muted-foreground text-xs uppercase tracking-wide">Due Date</span>
									<p class="text-base font-medium">{new Date(selectedJob.due_date).toLocaleDateString()}</p>
								</div>
							{/if}
							{#if selectedJob.quantity_scrapped > 0}
								<div class="space-y-1">
									<span class="font-semibold text-muted-foreground text-xs uppercase tracking-wide">Scrapped</span>
									<p class="text-base font-medium text-red-600">{selectedJob.quantity_scrapped}</p>
								</div>
							{/if}
						</div>
						{#if selectedJob.notes}
							<div class="mt-6 pt-6 border-t space-y-1">
								<span class="font-semibold text-muted-foreground text-xs uppercase tracking-wide">Notes</span>
								<p class="text-sm leading-relaxed">{selectedJob.notes}</p>
							</div>
						{/if}
					</Card.Content>
				</Card.Root>

				<!-- Operations Table -->
				<Card.Root class="flex flex-col">
					<Card.Header class="pb-4">
						<Card.Title class="text-xl">Operations ({jobOperations.length})</Card.Title>
					</Card.Header>
					<Card.Content class="p-0">
						{#if jobOperations.length === 0}
							<p class="text-sm text-muted-foreground text-center py-8 px-6">No operations found for this job.</p>
						{:else}
							<div class="overflow-auto max-h-96">
								<table class="w-full">
									<thead class="bg-muted sticky top-0">
										<tr class="border-b">
											<th class="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">#</th>
											<th class="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">Operation</th>
											<th class="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">Work Center</th>
											<th class="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">Status</th>
											<th class="px-4 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wide">Planned</th>
											<th class="px-4 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wide">Actual</th>
											<th class="px-4 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wide">Completed</th>
										</tr>
									</thead>
									<tbody class="divide-y">
										{#each jobOperations as operation}
											<tr class="hover:bg-muted/30 transition-colors">
												<td class="px-4 py-4 text-sm font-medium">{operation.operation_sequence}</td>
												<td class="px-4 py-4">
													<div class="flex flex-col">
														<span class="text-sm font-medium">{operation.operation_name}</span>
														<span class="text-xs text-muted-foreground">
															Setup: {formatTime(operation.planned_setup_time_min)}
															| Rate: {operation.planned_run_rate_per_unit_min} min/unit
														</span>
													</div>
												</td>
												<td class="px-4 py-4 text-sm">{operation.work_center}</td>
												<td class="px-4 py-4">
													<Badge variant={getOperationStatusColor(operation.status)} class="text-xs">
														{operation.status}
													</Badge>
												</td>
												<td class="px-4 py-4 text-sm text-right font-medium">
													{formatTime(operation.planned_total_time_min)}
												</td>
												<td class="px-4 py-4 text-sm text-right font-medium">
													{formatTime(operation.actual_time_min)}
												</td>
												<td class="px-4 py-4 text-sm text-right">
													<div class="flex flex-col items-end">
														{#if operation.actual_quantity_completed > 0}
															<span class="text-green-600 font-medium">{operation.actual_quantity_completed}</span>
														{:else}
															<span class="text-muted-foreground">-</span>
														{/if}
														{#if operation.actual_quantity_scrapped > 0}
															<span class="text-xs text-red-600">({operation.actual_quantity_scrapped} scrapped)</span>
														{/if}
													</div>
												</td>
											</tr>
										{/each}
									</tbody>
								</table>
							</div>
						{/if}
					</Card.Content>
				</Card.Root>
			</div>
		{/if}
	</Sheet.Content>
</Sheet.Root>
