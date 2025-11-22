<script lang="ts">
  import Versions from './components/Versions.svelte'
  import ScssExample from './components/ScssExample.svelte'
  import electronLogo from './assets/electron.svg'
  import { cn } from './lib/utils'
  import { button, card } from './lib/variants'
  import { Button } from '$lib/components/ui/button'

  const ipcHandle = (): void => window.electron.ipcRenderer.send('ping')
</script>

<div class="flex flex-col items-center justify-center min-h-screen p-8 space-y-8">
  <!-- Logo with Tailwind animations -->
  <img
    alt="logo"
    class={cn(
      'w-32 h-32 mb-4 select-none',
      'animate-fade-in animate-duration-500',
      'hover:scale-110 hover:drop-shadow-[0_0_1.2em_rgba(105,136,230,0.7)]',
      'transition-all duration-300'
    )}
    src={electronLogo}
  />

  <!-- Header Card with tailwind-variants -->
  <div class={cn(card({ variant: 'elevated' }), 'max-w-2xl animate-fade-in animate-delay-200')}>
    <div class="text-center space-y-4">
      <div class="text-sm font-semibold text-gray-500 uppercase tracking-wide">
        Powered by electron-vite
      </div>

      <h1 class="text-4xl font-bold text-gray-900">
        Build an Electron app with
        <span
          class="bg-gradient-to-r from-orange-500 to-blue-500 bg-clip-text text-transparent font-bold"
        >
          Svelte
        </span>
        and
        <span
          class="bg-gradient-to-r from-blue-600 to-yellow-400 bg-clip-text text-transparent font-bold"
        >
          TypeScript
        </span>
      </h1>

      <p class="text-base text-gray-600 font-medium">
        Please try pressing
        <code
          class="px-2 py-1 mx-1 text-sm font-semibold text-purple-700 bg-purple-100 rounded border border-purple-200"
        >
          F12
        </code>
        to open the devTool
      </p>
    </div>
  </div>

  <!-- Action Buttons using tailwind-variants and tailwind-merge -->
  <div class="flex flex-wrap gap-4 pt-4 animate-fade-in animate-delay-300">
    <a
      href="https://electron-vite.org/"
      target="_blank"
      rel="noreferrer"
      class={cn(
        button({ variant: 'primary', size: 'lg' }),
        'hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl'
      )}
    >
      📚 Documentation
    </a>

    <!-- svelte-ignore a11y-click-events-have-key-events a11y-no-static-element-interactions a11y-missing-attribute-->
    <a
      target="_blank"
      rel="noreferrer"
      on:click={ipcHandle}
      class={cn(
        button({ variant: 'secondary', size: 'lg' }),
        'hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl cursor-pointer'
      )}
    >
      🚀 Send IPC
    </a>
  </div>

  <!-- Feature Cards Grid -->
  <div
    class="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl pt-8 animate-fade-in animate-delay-400"
  >
    <div class={card({ variant: 'outlined' })}>
      <div class="text-center space-y-2">
        <div class="text-3xl">⚡</div>
        <h3 class="font-bold text-lg text-gray-900">Tailwind CSS v4</h3>
        <p class="text-sm text-gray-600">Modern utility-first CSS framework</p>
      </div>
    </div>

    <div class={card({ variant: 'outlined' })}>
      <div class="text-center space-y-2">
        <div class="text-3xl">🎨</div>
        <h3 class="font-bold text-lg text-gray-900">Tailwind Variants</h3>
        <p class="text-sm text-gray-600">Type-safe component variants</p>
      </div>
    </div>

    <div class={card({ variant: 'outlined' })}>
      <div class="text-center space-y-2">
        <div class="text-3xl">✨</div>
        <h3 class="font-bold text-lg text-gray-900">Animations</h3>
        <p class="text-sm text-gray-600">Beautiful CSS animations built-in</p>
      </div>
    </div>
  </div>

  <!-- SCSS Example Components -->
  <div class="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl pt-8 animate-fade-in animate-delay-500">
    <ScssExample title="Primary Example" variant="primary" />
    <ScssExample title="Secondary Example" variant="secondary" />
    <ScssExample title="Success Example" variant="success" />
  </div>

  <!-- shadcn-svelte Button Examples -->
  <div class="flex flex-wrap gap-4 pt-8 animate-fade-in animate-delay-600">
    <Button variant="default">Default Button</Button>
    <Button variant="secondary">Secondary</Button>
    <Button variant="destructive">Destructive</Button>
    <Button variant="outline">Outline</Button>
    <Button variant="ghost">Ghost</Button>
    <Button variant="link">Link</Button>
  </div>

  <div class="flex flex-wrap gap-4 animate-fade-in animate-delay-700">
    <Button size="sm">Small</Button>
    <Button size="default">Default Size</Button>
    <Button size="lg">Large</Button>
    <Button size="icon">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M5 12h14" />
        <path d="m12 5 7 7-7 7" />
      </svg>
    </Button>
  </div>

  <Versions />
</div>
