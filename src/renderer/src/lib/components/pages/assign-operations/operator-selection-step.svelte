<script lang="ts">
	import type { User } from "$lib/types";
	import * as Card from "$lib/components/ui/card";
	import { Button } from "$lib/components/ui/button";
	import { Badge } from "$lib/components/ui/badge";
	import UserIcon from "@lucide/svelte/icons/user";
	import ChevronRightIcon from "@lucide/svelte/icons/chevron-right";

	interface Props {
		operators: User[];
		selected: User | null;
		onSelect: (operator: User) => void;
		onContinue: () => void;
	}

	let { operators, selected, onSelect, onContinue }: Props = $props();
</script>

<div class="flex flex-col h-full">
	<div class="py-4">
		<h2 class="text-2xl font-semibold">Select Operator</h2>
		<p class="text-muted-foreground">Choose the operator to assign this operation to</p>
	</div>

	<div class="flex-1 overflow-y-auto py-4">
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
			{#each operators as operator}
				<Card.Root
					class="cursor-pointer transition-all hover:shadow-md {selected?.id === operator.id
						? 'ring-2 ring-primary border-primary'
						: ''}"
					onclick={() => onSelect(operator)}
				>
					<Card.Header>
						<div class="flex items-start justify-between">
							<div class="flex items-center gap-3">
								<div
									class="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10"
								>
									<UserIcon class="h-5 w-5 text-primary" />
								</div>
								<div>
									<Card.Title class="text-lg">{operator.full_name}</Card.Title>
									<Card.Description>ID: {operator.id}</Card.Description>
								</div>
							</div>
							{#if selected?.id === operator.id}
								<Badge variant="default">Selected</Badge>
							{/if}
						</div>
					</Card.Header>
					<Card.Content>
						<div class="space-y-2 text-sm">
							<div>
								<span class="text-muted-foreground">Username:</span>
								<span class="ml-2 font-medium">{operator.username}</span>
							</div>
							<div>
								<span class="text-muted-foreground">Role:</span>
								<span class="ml-2 font-medium capitalize">{operator.role}</span>
							</div>
						</div>
					</Card.Content>
				</Card.Root>
			{/each}
		</div>

		{#if operators.length === 0}
			<Card.Root>
				<Card.Content class="py-12 text-center">
					<p class="text-muted-foreground">No operators available</p>
				</Card.Content>
			</Card.Root>
		{/if}
	</div>

	<div class="sticky bottom-0 bg-background border-t pt-4 mt-4">
		<div class="flex justify-end gap-3">
			<Button onclick={onContinue} disabled={!selected}>
				Continue
				<ChevronRightIcon class="ml-2 h-4 w-4" />
			</Button>
		</div>
	</div>
</div>
