<script lang="ts">
	import * as Card from '$lib/components/ui/card'
	import { Button } from '$lib/components/ui/button'
	import AlertCircleIcon from '@lucide/svelte/icons/alert-circle'
	import RotateCcwIcon from '@lucide/svelte/icons/rotate-ccw'
	import XIcon from '@lucide/svelte/icons/x'

	interface Props {
		error: string | null
		onRetry: () => void
		onCancel: () => void
	}

	let { error, onRetry, onCancel }: Props = $props()
</script>

<div class="flex flex-col items-center justify-center py-12 px-4">
	<div class="w-full max-w-2xl space-y-6">
		<div class="flex flex-col items-center text-center space-y-4">
			<div class="rounded-full bg-red-100 dark:bg-red-900/20 p-3">
				<AlertCircleIcon class="h-12 w-12 text-red-600 dark:text-red-400" />
			</div>
			<div>
				<h2 class="text-2xl font-semibold">Error Creating Job</h2>
				<p class="text-muted-foreground">An error occurred while creating the job</p>
			</div>
		</div>

		<Card.Root>
			<Card.Header>
				<Card.Title>Error Details</Card.Title>
			</Card.Header>
			<Card.Content>
				<p class="text-sm text-muted-foreground">
					{error || 'An unknown error occurred. Please try again.'}
				</p>
			</Card.Content>
		</Card.Root>

		<div class="flex gap-3">
			<Button onclick={onRetry} class="flex-1">
				<RotateCcwIcon class="mr-2 h-4 w-4" />
				Try Again
			</Button>
			<Button variant="outline" onclick={onCancel} class="flex-1">
				<XIcon class="mr-2 h-4 w-4" />
				Cancel
			</Button>
		</div>
	</div>
</div>
