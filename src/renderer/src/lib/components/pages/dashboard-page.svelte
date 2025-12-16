<script lang="ts">
	import { authStore } from "$lib/stores/auth-store.svelte";
	import * as Card from "$lib/components/ui/card";
	import { Button } from "$lib/components/ui/button";
	import BriefcaseIcon from "@lucide/svelte/icons/briefcase";
	import ClockIcon from "@lucide/svelte/icons/clock";
	import CheckCircleIcon from "@lucide/svelte/icons/check-circle";
	import TrendingUpIcon from "@lucide/svelte/icons/trending-up";

	// Mock stats data
	const stats = [
		{
			title: "Active Jobs",
			value: "12",
			icon: BriefcaseIcon,
			description: "Jobs currently in progress",
		},
		{
			title: "My Operations",
			value: "5",
			icon: ClockIcon,
			description: "Operations assigned to you",
		},
		{
			title: "Completed Today",
			value: "8",
			icon: CheckCircleIcon,
			description: "Operations finished today",
		},
		{
			title: "Efficiency",
			value: "94%",
			icon: TrendingUpIcon,
			description: "Average efficiency this week",
		},
	];
</script>

<div class="flex flex-col gap-4 p-6">
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-3xl font-bold">Dashboard</h1>
			<p class="text-muted-foreground">
				Welcome back, {authStore.currentUser?.full_name || "User"}
			</p>
		</div>
	</div>

	<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
		{#each stats as stat}
			<Card.Root>
				<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
					<Card.Title class="text-sm font-medium">{stat.title}</Card.Title>
					<stat.icon class="h-4 w-4 text-muted-foreground" />
				</Card.Header>
				<Card.Content>
					<div class="text-2xl font-bold">{stat.value}</div>
					<p class="text-xs text-muted-foreground">{stat.description}</p>
				</Card.Content>
			</Card.Root>
		{/each}
	</div>

	<div class="grid gap-4 md:grid-cols-2">
		<Card.Root>
			<Card.Header>
				<Card.Title>Recent Jobs</Card.Title>
				<Card.Description>Latest jobs created in the system</Card.Description>
			</Card.Header>
			<Card.Content>
				<div class="text-sm text-muted-foreground text-center py-8">
					No recent jobs to display
				</div>
			</Card.Content>
		</Card.Root>

		<Card.Root>
			<Card.Header>
				<Card.Title>Active Time Entries</Card.Title>
				<Card.Description>Operations currently being worked on</Card.Description>
			</Card.Header>
			<Card.Content>
				<div class="text-sm text-muted-foreground text-center py-8">
					No active time entries
				</div>
			</Card.Content>
		</Card.Root>
	</div>
</div>
