<script lang="ts">
	import type { Job, NetSuitePartData } from '$lib/types'
	import * as Card from '$lib/components/ui/card'
	import { Button } from '$lib/components/ui/button'
	import { Badge } from '$lib/components/ui/badge'
	import CheckCircleIcon from '@lucide/svelte/icons/check-circle'
	import PlusCircleIcon from '@lucide/svelte/icons/plus-circle'

	interface Props {
		job: Job
		partData: NetSuitePartData
		onClose: () => void
		onCreateAnother: () => void
	}

	let { job, partData, onClose, onCreateAnother }: Props = $props()

	let operationsCount = $derived(partData.routings[0]?.steps.length || 0)
</script>

<div class="flex flex-col items-center justify-center py-12 px-4">
	<div class="w-full max-w-2xl space-y-6">
		<div class="flex flex-col items-center text-center space-y-4">
			<div class="rounded-full bg-green-100 dark:bg-green-900/20 p-3">
				<CheckCircleIcon class="h-12 w-12 text-green-600 dark:text-green-400" />
			</div>
			<div>
				<h2 class="text-2xl font-semibold">Job Created Successfully</h2>
				<p class="text-muted-foreground">Your manufacturing job has been created</p>
			</div>
		</div>

		<Card.Root>
			<Card.Header>
				<Card.Title>Job Summary</Card.Title>
				<Card.Description>Review the created job details</Card.Description>
			</Card.Header>
			<Card.Content class="space-y-4">
				<div class="grid grid-cols-2 gap-4">
					<div>
						<span class="text-muted-foreground">Job Number:</span>
						<div class="font-medium text-lg">{job.job_number}</div>
					</div>
					<div>
						<span class="text-muted-foreground">Part Number:</span>
						<div class="font-medium">{partData.partNumber}</div>
					</div>
				</div>

				<div>
					<span class="text-muted-foreground">Work Orders:</span>
					<div class="flex flex-wrap gap-2 mt-1">
						{#each job.work_order_numbers || [] as wo}
							<Badge variant="secondary">{wo}</Badge>
						{/each}
					</div>
				</div>

				<div class="grid grid-cols-3 gap-4">
					<div>
						<span class="text-muted-foreground">Quantity:</span>
						<div class="font-medium">{job.quantity_ordered}</div>
					</div>
					<div>
						<span class="text-muted-foreground">Priority:</span>
						<div class="font-medium">
							<Badge variant={job.priority >= 8 ? 'destructive' : 'secondary'}>
								{job.priority}
							</Badge>
						</div>
					</div>
					<div>
						<span class="text-muted-foreground">Operations:</span>
						<div class="font-medium">
							<Badge variant="default">{operationsCount}</Badge>
						</div>
					</div>
				</div>

				{#if job.due_date}
					<div>
						<span class="text-muted-foreground">Due Date:</span>
						<div class="font-medium">{new Date(job.due_date).toLocaleDateString()}</div>
					</div>
				{/if}

				{#if job.notes}
					<div>
						<span class="text-muted-foreground">Notes:</span>
						<div class="font-medium text-sm">{job.notes}</div>
					</div>
				{/if}

				<div>
					<span class="text-muted-foreground">Status:</span>
					<div class="mt-1">
						<Badge variant="secondary">{job.status.replace('_', ' ')}</Badge>
					</div>
				</div>
			</Card.Content>
		</Card.Root>

		<div class="flex gap-3">
			<Button onclick={onClose} class="flex-1">View Jobs</Button>
			<Button variant="outline" onclick={onCreateAnother} class="flex-1">
				<PlusCircleIcon class="mr-2 h-4 w-4" />
				Create Another
			</Button>
		</div>
	</div>
</div>
