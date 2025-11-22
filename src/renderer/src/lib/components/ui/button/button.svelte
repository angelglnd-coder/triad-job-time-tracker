<script lang="ts">
	import type { HTMLButtonAttributes } from "svelte/elements";
	import { Button as ButtonPrimitive } from "bits-ui";
	import { cn } from "$lib/utils.js";
	import { buttonVariants, type Props } from "./index.js";

	type $$Props = Props & HTMLButtonAttributes;

	let {
		variant = "default",
		size = "default",
		builders = [],
		class: className,
		...restProps
	}: $$Props = $props();
</script>

<ButtonPrimitive.Root
	{builders}
	class={cn(buttonVariants({ variant, size, className }))}
	type="button"
	{...restProps}
	onclick={restProps.onclick}
>
	<slot />
</ButtonPrimitive.Root>
