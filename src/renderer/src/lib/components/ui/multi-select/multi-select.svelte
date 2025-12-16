<script lang="ts">
	import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
	import { Badge } from "$lib/components/ui/badge";
	import ChevronDown from "lucide-svelte/icons/chevron-down";
	import X from "lucide-svelte/icons/x";
	import { cn } from "$lib/utils";

	export interface MultiSelectItem<T = string> {
		value: T;
		label: string;
		disabled?: boolean;
	}

	interface Props<T = string> {
		items?: MultiSelectItem<T>[];
		selected?: T[];
		placeholder?: string;
		maxBadges?: number;
		disabled?: boolean;
		class?: string;
	}

	let {
		items = [],
		selected = $bindable([]),
		placeholder = "Select items...",
		maxBadges = 3,
		disabled = false,
		class: className = ""
	}: Props = $props();

	// Derived state
	let selectedItems = $derived(items.filter((item) => selected.includes(item.value)));

	let displayText = $derived.by(() => {
		if (selected.length === 0) return placeholder;
		if (selected.length <= maxBadges) return null; // Show badges
		return `${selected.length} selected`;
	});

	// Handlers
	function toggleItem(value: string) {
		if (selected.includes(value)) {
			selected = selected.filter((v) => v !== value);
		} else {
			selected = [...selected, value];
		}
	}

	function removeItem(value: string) {
		selected = selected.filter((v) => v !== value);
	}
</script>

<div class={cn("w-full", className)}>
	<DropdownMenu.Root>
		<DropdownMenu.Trigger asChild>
			{#snippet child({ props })}
				<button
					{...props}
					class="flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
					{disabled}
				>
					<span class:text-muted-foreground={selected.length === 0}>
						{displayText || `${selected.length} selected`}
					</span>
					<ChevronDown class="h-4 w-4 opacity-50" />
				</button>
			{/snippet}
		</DropdownMenu.Trigger>

		<DropdownMenu.Content class="w-[var(--bits-dropdown-menu-trigger-width)]">
			{#if items.length === 0}
				<div class="px-2 py-1.5 text-sm text-muted-foreground">No items available</div>
			{:else}
				{#each items as item}
					<DropdownMenu.CheckboxItem
						checked={selected.includes(item.value)}
						onCheckedChange={() => toggleItem(item.value)}
						disabled={item.disabled}
					>
						{item.label}
					</DropdownMenu.CheckboxItem>
				{/each}
			{/if}
		</DropdownMenu.Content>
	</DropdownMenu.Root>

	<!-- Badges Display -->
	{#if selectedItems.length > 0 && selectedItems.length <= maxBadges}
		<div class="mt-2 flex flex-wrap gap-1.5">
			{#each selectedItems as item}
				<Badge variant="secondary" class="gap-1 pr-1">
					<span class="text-xs">{item.label}</span>
					<button
						type="button"
						onclick={() => removeItem(item.value)}
						class="ml-1 rounded-sm hover:bg-muted"
					>
						<X class="h-3 w-3" />
					</button>
				</Badge>
			{/each}
		</div>
	{/if}
</div>
