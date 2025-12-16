<script lang="ts" module>
	import HomeIcon from "@lucide/svelte/icons/home";
	import BriefcaseIcon from "@lucide/svelte/icons/briefcase";
	import PlusCircleIcon from "@lucide/svelte/icons/plus-circle";
	import ListIcon from "@lucide/svelte/icons/list";
	import UserCheckIcon from "@lucide/svelte/icons/user-check";
	import ClockIcon from "@lucide/svelte/icons/clock";
	import BarChartIcon from "@lucide/svelte/icons/bar-chart";
	import UsersIcon from "@lucide/svelte/icons/users";
	import TrendingUpIcon from "@lucide/svelte/icons/trending-up";
	import Settings2Icon from "@lucide/svelte/icons/settings-2";
	import FactoryIcon from "@lucide/svelte/icons/factory";

	// Navigation data for Triad Job Time Tracker
	const data = {
		navMain: [
			{
				title: "Dashboard",
				url: "/dashboard",
				icon: HomeIcon,
				isActive: true,
			},
			{
				title: "Jobs",
				url: "#",
				icon: BriefcaseIcon,
				items: [
					{
						title: "Create Job",
						url: "/create-job",
					},
					{
						title: "Active Jobs",
						url: "/jobs",
					},
				],
			},
			{
				title: "Operations",
				url: "#",
				icon: ListIcon,
				items: [
					{
						title: "Assign Operations",
						url: "/assign-operations",
					},
					{
						title: "Operation Status",
						url: "/operation-status",
					},
				],
			},
			{
				title: "Time Tracking",
				url: "#",
				icon: ClockIcon,
				items: [
					{
						title: "My Operations",
						url: "/operator-console",
					},
				],
			},
			{
				title: "Reports",
				url: "#",
				icon: BarChartIcon,
				items: [
					{
						title: "User Workload",
						url: "/reports-workload",
					},
					{
						title: "Actual vs Planned",
						url: "/reports-variance",
					},
				],
			},
			{
				title: "Settings",
				url: "/settings",
				icon: Settings2Icon,
			},
		],
	};
</script>

<script lang="ts">
	import NavMain from "./nav-main.svelte";
	import NavUser from "./nav-user.svelte";
	import * as Sidebar from "$lib/components/ui/sidebar/index.js";
	import type { ComponentProps } from "svelte";
	import { authStore } from "$lib/stores/auth-store.svelte";

	let {
		ref = $bindable(null),
		collapsible = "icon",
		...restProps
	}: ComponentProps<typeof Sidebar.Root> = $props();

	// User data from auth store
	const userData = $derived({
		name: authStore.currentUser?.full_name || "Guest",
		email: authStore.currentUser?.email || "",
		avatar: "",
	});
</script>

<Sidebar.Root {collapsible} {...restProps}>
	<Sidebar.Header>
		<div class="flex items-center gap-2 px-4 py-2">
			<FactoryIcon class="h-6 w-6" />
			<div class="flex flex-col">
				<span class="font-semibold text-sm">Triad Manufacturing</span>
				<span class="text-xs text-muted-foreground">Time Tracker</span>
			</div>
		</div>
	</Sidebar.Header>
	<Sidebar.Content>
		<NavMain items={data.navMain} />
	</Sidebar.Content>
	<Sidebar.Footer>
		<NavUser user={userData} />
	</Sidebar.Footer>
	<Sidebar.Rail />
</Sidebar.Root>
