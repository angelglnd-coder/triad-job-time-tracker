<script lang="ts">
	import type { NetSuiteRoutingStep } from '$lib/types'
	import * as Card from '$lib/components/ui/card'
	import { Button } from '$lib/components/ui/button'
	import { Badge } from '$lib/components/ui/badge'
	import SettingsIcon from '@lucide/svelte/icons/settings'
	import ChevronLeftIcon from '@lucide/svelte/icons/chevron-left'
	import ChevronRightIcon from '@lucide/svelte/icons/chevron-right'
	import ClockIcon from '@lucide/svelte/icons/clock'
	import BuildingIcon from '@lucide/svelte/icons/building'

	interface Props {
		operations: NetSuiteRoutingStep[]
		onBack: () => void
		onContinue: () => void
	}

	let { operations, onBack, onContinue }: Props = $props()
</script>

<div class="flex flex-col h-full">
	<div class="py-4">
		<h2 class="text-2xl font-semibold">Review Operations</h2>
		<p class="text-muted-foreground">These operations will be created for the job</p>
	</div>

	<div class="flex-1 overflow-y-auto py-4">
		<div class="space-y-4">
			<div class="flex items-center justify-between">
				<Badge variant="secondary">
					{operations.length} Operation{operations.length !== 1 ? 's' : ''}
				</Badge>
			</div>

			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
				{#each operations as operation}
					<Card.Root>
						<Card.Header>
							<div class="flex items-start justify-between">
								<div class="flex items-center gap-3">
									<div
										class="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10"
									>
										<SettingsIcon class="h-5 w-5 text-primary" />
									</div>
									<div>
										<Card.Title class="text-lg">Operation {operation.operationSequence}</Card.Title>
										<Card.Description>{operation.operationName}</Card.Description>
									</div>
								</div>
							</div>
						</Card.Header>
						<Card.Content class="space-y-3 text-sm">
							<div>
								<span class="text-muted-foreground flex items-center gap-1">
									<BuildingIcon class="h-3 w-3" />
									Work Center:
								</span>
								<div class="font-medium mt-1">{operation.workCenter}</div>
							</div>
							<div class="grid grid-cols-2 gap-2">
								<div>
									<span class="text-muted-foreground flex items-center gap-1">
										<ClockIcon class="h-3 w-3" />
										Setup:
									</span>
									<div class="font-medium">{operation.setupTimeMin.toFixed(1)} min</div>
								</div>
								<div>
									<span class="text-muted-foreground">Run Rate:</span>
									<div class="font-medium">{operation.runRatePerUnitMin.toFixed(2)} min/unit</div>
								</div>
							</div>
							<div class="grid grid-cols-2 gap-2 text-xs">
								<div>
									<span class="text-muted-foreground">Machine:</span>
									<div class="font-medium">{operation.machineResources}</div>
								</div>
								<div>
									<span class="text-muted-foreground">Labor:</span>
									<div class="font-medium">{operation.laborResources}</div>
								</div>
							</div>
						</Card.Content>
					</Card.Root>
				{/each}
			</div>

			{#if operations.length === 0}
				<Card.Root>
					<Card.Content class="py-12 text-center">
						<p class="text-muted-foreground">
							No operations found for this part. Please check the part number.
						</p>
					</Card.Content>
				</Card.Root>
			{/if}
		</div>
	</div>

	<div class="sticky bottom-0 bg-background border-t pt-4 mt-4">
		<div class="flex justify-between gap-3">
			<Button variant="outline" onclick={onBack}>
				<ChevronLeftIcon class="mr-2 h-4 w-4" />
				Back
			</Button>
			<Button onclick={onContinue}>
				Continue
				<ChevronRightIcon class="ml-2 h-4 w-4" />
			</Button>
		</div>
	</div>
</div>
