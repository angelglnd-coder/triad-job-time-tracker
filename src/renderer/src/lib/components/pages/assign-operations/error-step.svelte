<script lang="ts">
	import * as Card from "$lib/components/ui/card";
	import { Button } from "$lib/components/ui/button";
	import XCircleIcon from "@lucide/svelte/icons/x-circle";
	import RotateCcwIcon from "@lucide/svelte/icons/rotate-ccw";
	import XIcon from "@lucide/svelte/icons/x";

	interface Props {
		error: string | null;
		onRetry: () => void;
		onReset: () => void;
	}

	let { error, onRetry, onReset }: Props = $props();
</script>

<div class="space-y-4">
	<div class="text-center space-y-2">
		<div class="flex justify-center">
			<div class="flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
				<XCircleIcon class="h-10 w-10 text-red-600" />
			</div>
		</div>
		<h2 class="text-2xl font-semibold">Assignment Failed</h2>
		<p class="text-muted-foreground">
			There was an error while trying to assign the operation
		</p>
	</div>

	<Card.Root class="border-red-200 bg-red-50">
		<Card.Header>
			<Card.Title class="text-red-900">Error Details</Card.Title>
		</Card.Header>
		<Card.Content>
			<div class="text-sm text-red-800">
				{error || "An unknown error occurred. Please try again."}
			</div>
		</Card.Content>
	</Card.Root>

	<Card.Root>
		<Card.Content class="pt-6">
			<div class="space-y-2 text-sm">
				<p class="font-medium">What you can do:</p>
				<ul class="list-disc list-inside space-y-1 text-muted-foreground ml-2">
					<li>Click "Retry" to attempt the assignment again</li>
					<li>Click "Cancel" to start a new assignment from the beginning</li>
					<li>Check that the operation hasn't been assigned to another operator</li>
					<li>Verify the operator account is active</li>
				</ul>
			</div>
		</Card.Content>
	</Card.Root>

	<div class="flex justify-center gap-3">
		<Button variant="outline" onclick={onReset}>
			<XIcon class="mr-2 h-4 w-4" />
			Cancel
		</Button>
		<Button onclick={onRetry}>
			<RotateCcwIcon class="mr-2 h-4 w-4" />
			Retry
		</Button>
	</div>
</div>
