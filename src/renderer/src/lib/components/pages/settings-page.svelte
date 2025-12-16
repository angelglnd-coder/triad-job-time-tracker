<script lang="ts">
	import * as Card from "$lib/components/ui/card";
	import { Button } from "$lib/components/ui/button";
	import Settings2Icon from "@lucide/svelte/icons/settings-2";
</script>

<div class="flex flex-col gap-6 p-6">
	<div>
		<h1 class="text-3xl font-bold">Settings</h1>
		<p class="text-muted-foreground">Configure application settings</p>
	</div>

	<div class="grid gap-6 max-w-4xl">
		<Card.Root>
			<Card.Header>
				<Card.Title>NetSuite Integration</Card.Title>
				<Card.Description>Configure NetSuite API connection</Card.Description>
			</Card.Header>
			<Card.Content class="space-y-4">
				<p class="text-sm text-muted-foreground">API configuration coming soon...</p>
			</Card.Content>
		</Card.Root>

		<Card.Root>
			<Card.Header>
				<Card.Title>User Management</Card.Title>
				<Card.Description>Manage users and operators</Card.Description>
			</Card.Header>
			<Card.Content class="space-y-4">
				<p class="text-sm text-muted-foreground">User management coming soon...</p>
			</Card.Content>
		</Card.Root>

		<Card.Root>
			<Card.Header>
				<Card.Title>Work Centers</Card.Title>
				<Card.Description>Manage manufacturing work centers</Card.Description>
			</Card.Header>
			<Card.Content class="space-y-4">
				<p class="text-sm text-muted-foreground">Work center management coming soon...</p>
			</Card.Content>
		</Card.Root>
	</div>
</div>
