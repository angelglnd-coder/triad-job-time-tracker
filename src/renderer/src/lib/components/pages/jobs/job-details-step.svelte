<script lang="ts">
	import type { NetSuitePartData } from '$lib/types'
	import * as Card from '$lib/components/ui/card'
	import { Button } from '$lib/components/ui/button'
	import { Input } from '$lib/components/ui/input'
	import { Label } from '$lib/components/ui/label'
	import { Textarea } from '$lib/components/ui/textarea'
	import { Badge } from '$lib/components/ui/badge'
	import MultiSelect from '$lib/components/ui/multi-select/multi-select.svelte'
	import type { MultiSelectItem } from '$lib/components/ui/multi-select/multi-select.svelte'
	import PackageIcon from '@lucide/svelte/icons/package'
	import ChevronLeftIcon from '@lucide/svelte/icons/chevron-left'
	import CheckIcon from '@lucide/svelte/icons/check'

	interface Props {
		partData: NetSuitePartData
		selectedWorkOrderIds: string[]
		priority: number
		dueDate: string | undefined
		notes: string | undefined
		onWorkOrdersChange: (ids: string[]) => void
		onPriorityChange: (value: number) => void
		onDueDateChange: (value: string) => void
		onNotesChange: (value: string) => void
		onBack: () => void
		onSubmit: () => void
	}

	let {
		partData,
		selectedWorkOrderIds,
		priority,
		dueDate,
		notes,
		onWorkOrdersChange,
		onPriorityChange,
		onDueDateChange,
		onNotesChange,
		onBack,
		onSubmit
	}: Props = $props()

	// Local state for work order selection
	let localSelectedWorkOrderIds = $state<string[]>([])

	// Watch for changes and notify parent
	$effect(() => {
		onWorkOrdersChange(localSelectedWorkOrderIds)
	})

	let workOrderItems: MultiSelectItem<string>[] = $derived(
		partData.workOrders.map((wo) => ({
			value: wo.id,
			label: `${wo.tranId} - Qty: ${wo.quantity} (${wo.status})`
		}))
	)

	let totalQuantity = $derived.by(() => {
		console.log('Calculating quantity for IDs:', localSelectedWorkOrderIds)
		const quantity = localSelectedWorkOrderIds.reduce((total, woId) => {
			const wo = partData.workOrders.find((w) => w.id === woId)
			const woQty = wo ? parseInt(wo.quantity) || 0 : 0
			console.log(`WO ${woId}: ${woQty}`, wo)
			return total + woQty
		}, 0)
		console.log('Total quantity:', quantity)
		return quantity
	})

	let operationsCount = $derived(partData.routings[0]?.steps.length || 0)
</script>

<div class="flex flex-col h-full">
	<div class="py-4">
		<h2 class="text-2xl font-semibold">Job Details</h2>
		<p class="text-muted-foreground">Select work orders and configure job settings</p>
	</div>

	<div class="flex-1 overflow-y-auto py-4">
		<div class="max-w-3xl mx-auto space-y-6">
			<!-- Part Information Summary -->
			<Card.Root>
				<Card.Header>
					<div class="flex items-center gap-3">
						<div class="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
							<PackageIcon class="h-5 w-5 text-primary" />
						</div>
						<div>
							<Card.Title>Part Information</Card.Title>
							<Card.Description>{partData.partNumber}</Card.Description>
						</div>
					</div>
				</Card.Header>
				<Card.Content class="grid grid-cols-2 gap-4 text-sm">
					<div>
						<span class="text-muted-foreground">Item Type:</span>
						<div class="font-medium">{partData.itemType}</div>
					</div>
					<div>
						<span class="text-muted-foreground">Operations:</span>
						<div class="font-medium">
							<Badge variant="secondary">{operationsCount} steps</Badge>
						</div>
					</div>
				</Card.Content>
			</Card.Root>

			<!-- Work Orders Selection -->
			<div class="space-y-4">
				<div class="space-y-2">
					<Label for="workOrders">
						Work Orders <span class="text-destructive">*</span>
					</Label>
					<MultiSelect
						items={workOrderItems}
						bind:selected={localSelectedWorkOrderIds}
						placeholder="Select work orders..."
						maxBadges={2}
					/>
					{#if localSelectedWorkOrderIds.length === 0}
						<p class="text-sm text-muted-foreground">At least one work order is required</p>
					{/if}
				</div>

				<!-- Total Quantity (Auto-calculated) -->
				<div class="space-y-2">
					<Label for="quantity">Total Quantity</Label>
					{#key totalQuantity}
						<Input
							id="quantity"
							value={totalQuantity.toString()}
							readonly
							class="bg-muted text-foreground cursor-not-allowed font-medium"
						/>
					{/key}
					<p class="text-sm text-muted-foreground">
						Auto-calculated from selected work orders
					</p>
				</div>

				<!-- Priority and Due Date -->
				<div class="grid grid-cols-2 gap-4">
					<div class="space-y-2">
						<Label for="priority">Priority</Label>
						<Input
							id="priority"
							type="number"
							min="1"
							max="10"
							value={priority}
							oninput={(e) => onPriorityChange(parseInt(e.currentTarget.value) || 5)}
						/>
						<p class="text-sm text-muted-foreground">1 (Low) to 10 (High)</p>
					</div>

					<div class="space-y-2">
						<Label for="dueDate">Due Date (Optional)</Label>
						<Input
							id="dueDate"
							type="date"
							value={dueDate || ''}
							oninput={(e) => onDueDateChange(e.currentTarget.value)}
						/>
					</div>
				</div>

				<!-- Notes -->
				<div class="space-y-2">
					<Label for="notes">Notes (Optional)</Label>
					<Textarea
						id="notes"
						value={notes || ''}
						oninput={(e) => onNotesChange(e.currentTarget.value)}
						placeholder="Additional notes about this job..."
						rows={3}
					/>
				</div>
			</div>
		</div>
	</div>

	<div class="sticky bottom-0 bg-background border-t pt-4 mt-4">
		<div class="flex justify-between gap-3">
			<Button variant="outline" onclick={onBack}>
				<ChevronLeftIcon class="mr-2 h-4 w-4" />
				Back
			</Button>
			<Button onclick={onSubmit} disabled={localSelectedWorkOrderIds.length === 0}>
				<CheckIcon class="mr-2 h-4 w-4" />
				Create Job
			</Button>
		</div>
	</div>
</div>
