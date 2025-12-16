<script lang="ts">
	import { jobStore } from "$lib/stores/job-store.svelte";
	import { navigate } from "$lib/routes";
	import * as Card from "$lib/components/ui/card";
	import { Button } from "$lib/components/ui/button";
	import { Input } from "$lib/components/ui/input";
	import { Label } from "$lib/components/ui/label";
	import { Textarea } from "$lib/components/ui/textarea";
	import { MultiSelect } from "$lib/components/ui/multi-select";
	import { toast } from "svelte-sonner";
	import ScanIcon from "@lucide/svelte/icons/scan";
	import PlusCircleIcon from "@lucide/svelte/icons/plus-circle";

	let partNumberInput = $state("");
	let selectedWorkOrderIds = $state<string[]>([]);
	let priority = $state(5);
	let dueDate = $state("");
	let notes = $state("");

	// Calculate total quantity from selected work orders
	let quantity = $derived.by(() => {
		if (!jobStore.partData || selectedWorkOrderIds.length === 0) return 0;

		return selectedWorkOrderIds.reduce((total, woId) => {
			const wo = jobStore.partData!.workOrders.find(w => w.id === woId);
			return total + (wo ? parseInt(wo.quantity) || 0 : 0);
		}, 0);
	});

	async function handleFetchPart() {
		console.log('Fetching part:', partNumberInput);

		if (!partNumberInput.trim()) {
			console.log('No part number entered');
			toast.error("Please enter a part number");
			return;
		}

		console.log('Calling fetchPartFromNetSuite...');
		await jobStore.fetchPartFromNetSuite(partNumberInput.trim());

		console.log('Fetch complete. Error:', jobStore.error, 'Part data:', jobStore.partData);

		if (jobStore.error) {
			toast.error(jobStore.error);
		} else if (jobStore.partData) {
			toast.success(`Part ${jobStore.partData.partNumber} fetched - ${jobStore.partData.routings[0]?.steps.length || 0} operations`);
		}
	}

	async function handleCreateJob() {
		console.log('Creating job. Part data exists:', !!jobStore.partData);

		if (!jobStore.partData) {
			console.log('No part data - cannot create job');
			toast.error("Please fetch part data first");
			return;
		}

		if (selectedWorkOrderIds.length === 0) {
			toast.error("Please select at least one work order");
			return;
		}

		jobStore.createFormData.work_order_ids = selectedWorkOrderIds;
		jobStore.createFormData.quantity_ordered = quantity;
		jobStore.createFormData.priority = priority;
		jobStore.createFormData.due_date = dueDate || undefined;
		jobStore.createFormData.notes = notes || undefined;

		console.log('Creating job with form data:', jobStore.createFormData);

		const success = await jobStore.createJob();

		console.log('Job creation result:', success);

		if (success) {
			toast.success("Job created successfully! Redirecting to jobs page...");
			setTimeout(() => {
				navigate("/jobs");
			}, 1000);
		} else if (jobStore.error) {
			toast.error(jobStore.error);
		}
	}

	function handleScan(e: KeyboardEvent) {
		// Barcode scanners typically send Enter after the scan
		if (e.key === "Enter") {
			handleFetchPart();
		}
	}
</script>

<div class="flex flex-col gap-6 p-6">
	<div>
		<h1 class="text-3xl font-bold">Create Job</h1>
		<p class="text-muted-foreground">Create a new job from a part number</p>
	</div>

	<div class="grid gap-6 max-w-4xl">
		<!-- Part Number Section -->
		<Card.Root>
			<Card.Header>
				<Card.Title>Part Information</Card.Title>
				<Card.Description>Enter or scan the part number to fetch routing data</Card.Description>
			</Card.Header>
			<Card.Content class="space-y-4">
				<div class="flex gap-2">
					<div class="flex-1 space-y-2">
						<Label for="partNumber">Part Number</Label>
						<Input
							id="partNumber"
							bind:value={partNumberInput}
							onkeydown={handleScan}
							placeholder="e.g. 794P9:A"
							disabled={jobStore.isLoading}
						/>
					</div>
					<div class="flex items-end">
						<Button onclick={handleFetchPart} disabled={jobStore.isLoading}>
							<ScanIcon class="mr-2 h-4 w-4" />
							Fetch from NetSuite
						</Button>
					</div>
				</div>

				{#if jobStore.partData}
					<div class="rounded-lg border p-4 space-y-2">
						<div class="font-medium">Part: {jobStore.partData.partNumber}</div>
						<div class="text-sm text-muted-foreground">
							Type: {jobStore.partData.itemType}
						</div>
						{#if jobStore.partData.routings.length > 0}
							<div class="text-sm">
								<span class="font-medium">Routing Steps:</span>
								{jobStore.partData.routings[0].steps.length} operations
							</div>
							<div class="mt-2 space-y-1">
								{#each jobStore.partData.routings[0].steps.slice(0, 3) as step}
									<div class="text-xs text-muted-foreground">
										{step.operationSequence}. {step.operationName} ({step.workCenter})
									</div>
								{/each}
								{#if jobStore.partData.routings[0].steps.length > 3}
									<div class="text-xs text-muted-foreground">
										+{jobStore.partData.routings[0].steps.length - 3} more...
									</div>
								{/if}
							</div>
						{/if}
					</div>
				{/if}
			</Card.Content>
		</Card.Root>

		{#if jobStore.partData}
			<!-- Job Details Section -->
			<Card.Root>
				<Card.Header>
					<Card.Title>Job Details</Card.Title>
					<Card.Description>Configure the job parameters</Card.Description>
				</Card.Header>
				<Card.Content class="space-y-4">
					{#if jobStore.partData.workOrders.length > 0}
						<div class="space-y-2">
							<Label for="workOrder">
								Work Orders <span class="text-destructive">*</span>
							</Label>
							<MultiSelect
								items={jobStore.partData.workOrders.map(wo => ({
									value: wo.id,
									label: `${wo.tranId} - Qty: ${wo.quantity} (${wo.status})`
								}))}
								bind:selected={selectedWorkOrderIds}
								placeholder="Select work orders..."
								maxBadges={2}
							/>
						</div>
					{/if}

					<div class="grid grid-cols-2 gap-4">
						<div class="space-y-2">
							<Label for="quantity">Quantity (Auto-calculated)</Label>
							<Input
								id="quantity"
								type="number"
								value={quantity}
								readonly
								disabled
								class="bg-muted cursor-not-allowed"
							/>
						</div>

						<div class="space-y-2">
							<Label for="priority">Priority (1-10)</Label>
							<Input id="priority" type="number" bind:value={priority} min="1" max="10" />
						</div>
					</div>

					<div class="space-y-2">
						<Label for="dueDate">Due Date (Optional)</Label>
						<Input id="dueDate" type="date" bind:value={dueDate} />
					</div>

					<div class="space-y-2">
						<Label for="notes">Notes (Optional)</Label>
						<Textarea id="notes" bind:value={notes} placeholder="Additional notes..." />
					</div>
				</Card.Content>
				<Card.Footer>
					<Button onclick={handleCreateJob} disabled={jobStore.isLoading} class="w-full">
						<PlusCircleIcon class="mr-2 h-4 w-4" />
						Create Job
					</Button>
				</Card.Footer>
			</Card.Root>
		{/if}
	</div>
</div>
