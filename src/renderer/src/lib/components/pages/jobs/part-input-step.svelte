<script lang="ts">
	import type { NetSuitePartData } from '$lib/types'
	import * as Card from '$lib/components/ui/card'
	import { Button } from '$lib/components/ui/button'
	import { Input } from '$lib/components/ui/input'
	import { Label } from '$lib/components/ui/label'
	import PackageIcon from '@lucide/svelte/icons/package'
	import ChevronRightIcon from '@lucide/svelte/icons/chevron-right'
	import LoaderCircleIcon from '@lucide/svelte/icons/loader-circle'

	interface Props {
		partNumber: string
		partData: NetSuitePartData | null
		isLoading: boolean
		onPartNumberChange: (value: string) => void
		onFetch: () => void
		onContinue: () => void
	}

	let { partNumber, partData, isLoading, onPartNumberChange, onFetch, onContinue }: Props =
		$props()
</script>

<div class="flex flex-col h-full">
	<div class="py-4">
		<h2 class="text-2xl font-semibold">Enter Part Number</h2>
		<p class="text-muted-foreground">Enter the part number to fetch data from NetSuite</p>
	</div>

	<div class="flex-1 overflow-y-auto py-4">
		<div class="max-w-2xl mx-auto space-y-6">
			<div class="space-y-4">
				<div class="space-y-2">
					<Label for="partNumber">Part Number</Label>
					<div class="flex gap-2">
						<Input
							id="partNumber"
							value={partNumber}
							oninput={(e) => onPartNumberChange(e.currentTarget.value)}
							placeholder="e.g. 794P9:A"
							disabled={isLoading}
							class="flex-1"
						/>
						<Button onclick={onFetch} disabled={isLoading || !partNumber.trim()}>
							{#if isLoading}
								<LoaderCircleIcon class="mr-2 h-4 w-4 animate-spin" />
								Fetching...
							{:else}
								Fetch Part
							{/if}
						</Button>
					</div>
				</div>

				{#if partData}
					<Card.Root>
						<Card.Header>
							<div class="flex items-center gap-3">
								<div
									class="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10"
								>
									<PackageIcon class="h-5 w-5 text-primary" />
								</div>
								<div>
									<Card.Title>Part Data Loaded</Card.Title>
									<Card.Description>Successfully fetched part information</Card.Description>
								</div>
							</div>
						</Card.Header>
						<Card.Content class="space-y-2">
							<div>
								<span class="text-muted-foreground">Part Number:</span>
								<span class="ml-2 font-medium">{partData.partNumber}</span>
							</div>
							<div>
								<span class="text-muted-foreground">Item Type:</span>
								<span class="ml-2 font-medium">{partData.itemType}</span>
							</div>
							{#if partData.routings.length > 0}
								<div>
									<span class="text-muted-foreground">Operations:</span>
									<span class="ml-2 font-medium"
										>{partData.routings[0].steps.length} routing steps</span
									>
								</div>
							{/if}
							{#if partData.workOrders.length > 0}
								<div>
									<span class="text-muted-foreground">Available Work Orders:</span>
									<span class="ml-2 font-medium">{partData.workOrders.length}</span>
								</div>
							{/if}
						</Card.Content>
					</Card.Root>
				{/if}
			</div>
		</div>
	</div>

	<div class="sticky bottom-0 bg-background border-t pt-4 mt-4">
		<div class="flex justify-end gap-3">
			<Button onclick={onContinue} disabled={!partData}>
				Continue
				<ChevronRightIcon class="ml-2 h-4 w-4" />
			</Button>
		</div>
	</div>
</div>
