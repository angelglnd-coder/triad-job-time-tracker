<script lang="ts">
  import * as Sidebar from "$lib/components/ui/sidebar/index.js"
  import * as Breadcrumb from "$lib/components/ui/breadcrumb/index.js"
  import { Separator } from "$lib/components/ui/separator/index.js"
  import { Toaster } from "svelte-sonner"
  import AppSidebar from "$lib/components/app-sidebar.svelte"
  import { authStore } from "$lib/stores/auth-store.svelte"
  import { onMount } from "svelte"
  import { Router } from "sv-router"
  import { route, routeTitles } from "$lib/routes"

  onMount(() => {
    // Load user from localStorage if exists
    authStore.loadFromStorage()

    // If no user is logged in, set a default user for development
    if (!authStore.currentUser) {
      authStore.login({
        id: 1,
        username: "demo",
        full_name: "Demo User",
        email: "demo@triad.com",
        role: "supervisor",
        is_active: true
      })
    }
  })

  $: currentPageTitle = routeTitles[route.pathname] || "Dashboard"
</script>

<Toaster />

<Sidebar.Provider>
  <AppSidebar />
  <main class="flex h-screen flex-col overflow-hidden">
    <div class="flex items-center gap-2 border-b p-2">
      <Sidebar.Trigger />
      <Separator orientation="vertical" class="h-4" />
      <Breadcrumb.Root>
        <Breadcrumb.List>
          <Breadcrumb.Item class="hidden md:block">
            <Breadcrumb.Link>Triad Time Tracker</Breadcrumb.Link>
          </Breadcrumb.Item>
          <Breadcrumb.Separator class="hidden md:block" />
          <Breadcrumb.Item>
            <Breadcrumb.Page>{currentPageTitle}</Breadcrumb.Page>
          </Breadcrumb.Item>
        </Breadcrumb.List>
      </Breadcrumb.Root>
    </div>

    <section class="min-h-0 flex-1 overflow-auto">
      <Router />
    </section>
  </main>
</Sidebar.Provider>
