<script lang="ts">
  import * as Sidebar from "$lib/components/ui/sidebar/index.js"
  import * as Breadcrumb from "$lib/components/ui/breadcrumb/index.js"
  import { Separator } from "$lib/components/ui/separator/index.js"
  import AppSidebar from "$lib/components/app-sidebar.svelte"
  import Versions from './components/Versions.svelte'
  import electronLogo from './assets/electron.svg'

  const ipcHandle = (): void => window.electron.ipcRenderer.send('ping')
</script>

<Sidebar.Provider>
  <AppSidebar />
  <main class="flex h-screen flex-col overflow-hidden">
    <div class="flex items-center gap-2 border-b p-2">
      <Sidebar.Trigger />
      <Separator orientation="vertical" class="h-4" />
      <Breadcrumb.Root>
        <Breadcrumb.List>
          <Breadcrumb.Item class="hidden md:block">
            <Breadcrumb.Link href="##">Time Tracker</Breadcrumb.Link>
          </Breadcrumb.Item>
          <Breadcrumb.Separator class="hidden md:block" />
          <Breadcrumb.Item>
            <Breadcrumb.Page>Dashboard</Breadcrumb.Page>
          </Breadcrumb.Item>
        </Breadcrumb.List>
      </Breadcrumb.Root>
    </div>

    <section class="min-h-0 flex-1 overflow-auto p-4">
      <!-- Content Area -->
      <div class="flex flex-col gap-4">
        <div class="grid auto-rows-min gap-4 md:grid-cols-3">
          <div class="aspect-video rounded-xl bg-muted/50 flex items-center justify-center">
            <div class="text-center space-y-2 p-4">
              <img src={electronLogo} alt="logo" class="w-16 h-16 mx-auto mb-2" />
              <h3 class="font-bold text-lg">Electron</h3>
              <p class="text-sm text-muted-foreground">Desktop Framework</p>
            </div>
          </div>
          <div class="aspect-video rounded-xl bg-muted/50 flex items-center justify-center">
            <div class="text-center space-y-2 p-4">
              <div class="text-4xl">⚡</div>
              <h3 class="font-bold text-lg">Vite</h3>
              <p class="text-sm text-muted-foreground">Next Gen Build Tool</p>
            </div>
          </div>
          <div class="aspect-video rounded-xl bg-muted/50 flex items-center justify-center">
            <div class="text-center space-y-2 p-4">
              <div class="text-4xl">🎨</div>
              <h3 class="font-bold text-lg">Shadcn Svelte</h3>
              <p class="text-sm text-muted-foreground">Beautiful Components</p>
            </div>
          </div>
        </div>

        <!-- Main Content Card -->
        <div class="flex-1 rounded-xl bg-muted/50 p-8">
          <div class="max-w-4xl mx-auto space-y-8">
            <div class="text-center space-y-4">
              <h1 class="text-4xl font-bold">
                Job Time Tracker
              </h1>
              <p class="text-lg text-muted-foreground">
                Track your time efficiently with this beautiful Electron app
              </p>
            </div>

            <div class="grid gap-4 md:grid-cols-2">
              <div class="rounded-lg border bg-card p-6 space-y-2">
                <h3 class="font-semibold">Built with Modern Tech</h3>
                <ul class="space-y-1 text-sm text-muted-foreground">
                  <li>✓ Electron + Vite</li>
                  <li>✓ Svelte 5 with Runes</li>
                  <li>✓ Tailwind CSS v4</li>
                  <li>✓ shadcn-svelte Components</li>
                </ul>
              </div>

              <div class="rounded-lg border bg-card p-6 space-y-2">
                <h3 class="font-semibold">Features</h3>
                <ul class="space-y-1 text-sm text-muted-foreground">
                  <li>✓ Responsive Sidebar</li>
                  <li>✓ Dark Mode Ready</li>
                  <li>✓ Type-Safe</li>
                  <li>✓ Beautiful UI</li>
                </ul>
              </div>
            </div>

            <div class="flex gap-4 justify-center">
              <button
                onclick={ipcHandle}
                class="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2"
              >
                Test IPC
              </button>
              <a
                href="https://electron-vite.org/"
                target="_blank"
                rel="noreferrer"
                class="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2"
              >
                Documentation
              </a>
            </div>

            <Versions />
          </div>
        </div>
      </div>
    </section>
  </main>
</Sidebar.Provider>
