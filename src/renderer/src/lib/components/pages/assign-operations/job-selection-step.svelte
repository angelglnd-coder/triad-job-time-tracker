<script lang="ts">
	import type { Job } from "$lib/types";
	import * as Card from "$lib/components/ui/card";
	import { Button } from "$lib/components/ui/button";
	import { Badge } from "$lib/components/ui/badge";
	import BriefcaseIcon from "@lucide/svelte/icons/briefcase";
	import ChevronLeftIcon from "@lucide/svelte/icons/chevron-left";
	import PackageIcon from "@lucide/svelte/icons/package";

	interface Props {
		jobs: Job[];
		selected: Job | null;
		onSelect: (job: Job) => void;
		onBack: () => void;
	}

	let { jobs, selected, onSelect, onBack }: Props = $props();

	function getStatusColor(status: string): "default" | "secondary" | "destructive" | "outline" {
		const colors: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
			created: "secondary",
			ready: "default",
			in_progress: "default",
			on_hold: "destructive",
			completed: "secondary",
			cancelled: "destructive",
		};
		return colors[status] || "default";
	}

	function getPartNumber(job: Job): string {
		return job.part?.part_number || job.part_number || "Unknown";
	}
</script>

<div class="flex flex-col h-full">
	<div class="py-4">
		<h2 class="text-2xl font-semibold">Select Job</h2>
		<p class="text-muted-foreground">Choose the job containing the operation to assign</p>
	</div>

	<div class="flex-1 overflow-y-auto py-4">
		<div class="grid grid-cols-1 gap-4">
			{#each jobs as job}
				<Card.Root
					class="cursor-pointer transition-all hover:shadow-md {selected?.id === job.id
						? 'ring-2 ring-primary border-primary'
						: ''}"
					onclick={() => onSelect(job)}
				>
					<Card.Header>
						<div class="flex items-start justify-between">
							<div class="flex items-center gap-3">
								<div
									class="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10"
								>
									<BriefcaseIcon class="h-5 w-5 text-primary" />
								</div>
								<div>
									<Card.Title class="text-lg">
										{job.job_number} - {getPartNumber(job)}
									</Card.Title>
									<Card.Description>
										{#if job.part?.description}
											{job.part.description}
										{:else}
											Job #{job.id}
										{/if}
									</Card.Description>
								</div>
							</div>
							<div class="flex items-center gap-2">
								<Badge variant={getStatusColor(job.status)}>
									{job.status.replace("_", " ")}
								</Badge>
								{#if selected?.id === job.id}
									<Badge variant="default">Selected</Badge>
								{/if}
							</div>
						</div>
					</Card.Header>
					<Card.Content class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
						<div>
							<span class="text-muted-foreground">Part Number:</span>
							<div class="font-medium flex items-center gap-1">
								<PackageIcon class="h-3 w-3" />
								{getPartNumber(job)}
							</div>
						</div>
						<div>
							<span class="text-muted-foreground">Quantity:</span>
							<div class="font-medium">
								{job.quantity_completed}/{job.quantity_ordered}
							</div>
						</div>
						<div>
							<span class="text-muted-foreground">Priority:</span>
							<div class="font-medium">
								<Badge variant={job.priority >= 8 ? "destructive" : "secondary"}>
									{job.priority}
								</Badge>
							</div>
						</div>
						{#if job.due_date}
							<div>
								<span class="text-muted-foreground">Due Date:</span>
								<div class="font-medium">
									{new Date(job.due_date).toLocaleDateString()}
								</div>
							</div>
						{/if}
					</Card.Content>
				</Card.Root>
			{/each}
		</div>

		{#if jobs.length === 0}
			<Card.Root>
				<Card.Content class="py-12 text-center">
					<p class="text-muted-foreground">No jobs available</p>
				</Card.Content>
			</Card.Root>
		{/if}
	</div>

	<div class="sticky bottom-0 bg-background border-t pt-4 mt-4">
		<div class="flex justify-between gap-3">
			<Button variant="outline" onclick={onBack}>
				<ChevronLeftIcon class="mr-2 h-4 w-4" />
				Back
			</Button>
		</div>
	</div>
</div>
