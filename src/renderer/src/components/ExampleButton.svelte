<script lang="ts">
  import { button } from '../lib/variants'
  import { cn } from '../lib/utils'

  export let variant: 'primary' | 'secondary' | 'danger' = 'primary'
  export let size: 'sm' | 'md' | 'lg' = 'md'
  export let className: string = ''
  export let animated: boolean = false
</script>

<button
  class={cn(
    button({ variant, size }),
    animated && 'animate-fade-in animate-duration-300',
    className
  )}
  on:click
>
  <slot />
</button>

<style>
  /* Additional component-specific styles can go here */
</style>
