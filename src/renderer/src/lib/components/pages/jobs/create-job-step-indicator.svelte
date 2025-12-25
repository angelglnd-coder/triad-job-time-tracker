<script lang="ts">
	import CheckIcon from '@lucide/svelte/icons/check'

	interface Props {
		currentStep: number
	}

	let { currentStep }: Props = $props()

	const steps = [
		{ label: 'Part Number', step: 1 },
		{ label: 'Operations', step: 2 },
		{ label: 'Job Details', step: 3 }
	]

	function getStepStatus(stepNumber: number): 'completed' | 'current' | 'upcoming' {
		if (stepNumber < currentStep) return 'completed'
		if (stepNumber === currentStep) return 'current'
		return 'upcoming'
	}
</script>

<div class="w-full">
	<nav aria-label="Progress">
		<ol class="flex items-center justify-between">
			{#each steps as step, index}
				{@const status = getStepStatus(step.step)}
				<li class="flex items-center {index !== steps.length - 1 ? 'flex-1' : ''}">
					<div class="flex items-center {index !== steps.length - 1 ? 'w-full' : ''}">
						<div class="flex flex-col items-center gap-2">
							<div
								class="flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors
								{status === 'completed'
									? 'border-primary bg-primary text-primary-foreground'
									: status === 'current'
										? 'border-primary bg-background text-primary'
										: 'border-muted-foreground/30 bg-background text-muted-foreground'}"
							>
								{#if status === 'completed'}
									<CheckIcon class="h-5 w-5" />
								{:else}
									<span class="text-sm font-medium">{step.step}</span>
								{/if}
							</div>
							<span
								class="text-sm font-medium transition-colors
								{status === 'completed' || status === 'current'
									? 'text-foreground'
									: 'text-muted-foreground'}"
							>
								{step.label}
							</span>
						</div>

						{#if index !== steps.length - 1}
							<div
								class="flex-1 h-0.5 mx-4 transition-colors
								{status === 'completed' ? 'bg-primary' : 'bg-muted-foreground/30'}"
							></div>
						{/if}
					</div>
				</li>
			{/each}
		</ol>
	</nav>
</div>
