<script lang="ts">
	import type { HTMLLabelAttributes } from "svelte/elements";
	import type { Snippet } from "svelte";
	import { cn } from "$lib/utils.js";

	interface Props extends HTMLLabelAttributes {
		children?: Snippet;
	}

	let { class: className, children, ...restProps }: Props = $props();
</script>

<label
	class={cn(
		"text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
		className
	)}
	{...restProps}
>
	{#if children}
		{@render children()}
	{/if}
</label>
