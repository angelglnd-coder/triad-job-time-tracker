# Tailwind CSS Setup Guide

This project is configured with Tailwind CSS v4 and related utilities.

## Installed Packages

- **tailwindcss** (^4.1.13) - The core Tailwind CSS framework
- **@tailwindcss/vite** (^4.1.13) - Vite plugin for Tailwind CSS v4
- **tailwind-merge** (^3.3.1) - Utility for merging Tailwind classes
- **tailwind-variants** (^3.1.1) - Create component variants with Tailwind
- **tw-animate-css** (^1.4.0) - Animation utilities for Tailwind
- **clsx** - Utility for conditionally joining classNames

## Configuration

### Vite Plugin Setup

The `@tailwindcss/vite` plugin has been added to [electron.vite.config.ts](electron.vite.config.ts):

```typescript
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  renderer: {
    plugins: [tailwindcss(), svelte()]
  }
})
```

### CSS Import

Tailwind CSS is imported in [src/renderer/src/assets/main.css](src/renderer/src/assets/main.css):

```css
@import 'tailwindcss';
```

## Usage Examples

### 1. Basic Tailwind Classes

Use Tailwind utility classes directly in your Svelte components:

```svelte
<div class="flex items-center justify-center p-4 bg-blue-500 text-white rounded-lg">
  Hello World
</div>
```

### 2. Tailwind Merge (`cn` utility)

The `cn` utility function ([src/renderer/src/lib/utils.ts](src/renderer/src/lib/utils.ts)) helps merge classes and resolve conflicts:

```svelte
<script lang="ts">
  import { cn } from '$lib/utils'

  export let variant: 'primary' | 'secondary' = 'primary'
  export let className: string = ''
</script>

<button
  class={cn(
    'px-4 py-2 rounded',
    variant === 'primary' && 'bg-blue-500 text-white',
    variant === 'secondary' && 'bg-gray-200 text-gray-900',
    className
  )}
>
  Click me
</button>
```

### 3. Tailwind Variants

Create reusable component variants with type safety ([src/renderer/src/lib/variants.ts](src/renderer/src/lib/variants.ts)):

```svelte
<script lang="ts">
  import { button } from '$lib/variants'

  export let variant: 'primary' | 'secondary' | 'danger' = 'primary'
  export let size: 'sm' | 'md' | 'lg' = 'md'
</script>

<button class={button({ variant, size })}>
  <slot />
</button>
```

Define new variants:

```typescript
import { tv } from 'tailwind-variants'

export const myComponent = tv({
  base: 'common-classes-here',
  variants: {
    color: {
      primary: 'bg-blue-500',
      secondary: 'bg-gray-500',
    },
    size: {
      sm: 'text-sm',
      lg: 'text-lg',
    }
  },
  defaultVariants: {
    color: 'primary',
    size: 'sm'
  }
})
```

### 4. Animations (tw-animate-css)

Use animation utilities in your classes:

```svelte
<div class="animate-fade-in animate-duration-500">
  Fading in content
</div>

<div class="animate-slide-in-left animate-delay-200">
  Sliding from left
</div>

<div class="hover:animate-bounce">
  Hover to bounce
</div>
```

Common animation classes:
- `animate-fade-in`, `animate-fade-out`
- `animate-slide-in-up`, `animate-slide-in-down`, `animate-slide-in-left`, `animate-slide-in-right`
- `animate-bounce`, `animate-pulse`, `animate-spin`
- `animate-duration-{ms}` - Set duration (e.g., `animate-duration-300`)
- `animate-delay-{ms}` - Set delay (e.g., `animate-delay-200`)

## Tailwind CSS v4 Features

Tailwind v4 uses CSS-first configuration instead of JavaScript config files. You can customize your design system using CSS:

```css
@import 'tailwindcss';

@theme {
  --color-primary: #3b82f6;
  --color-secondary: #6366f1;

  --font-display: 'Inter', sans-serif;

  --spacing-huge: 5rem;
}
```

Then use these custom values:

```svelte
<div class="bg-primary text-secondary font-display p-huge">
  Custom themed content
</div>
```

## Tips

1. **Class Conflicts**: Use the `cn()` utility to avoid class conflicts
2. **Component Variants**: Use tailwind-variants for complex component patterns
3. **Custom Theme**: Add custom properties in your CSS using `@theme`
4. **Animations**: Combine tw-animate-css with Tailwind's built-in transitions
5. **Type Safety**: tailwind-variants provides full TypeScript support

## Resources

- [Tailwind CSS v4 Docs](https://tailwindcss.com/docs)
- [tailwind-merge](https://github.com/dcastil/tailwind-merge)
- [tailwind-variants](https://www.tailwind-variants.org/)
- [tw-animate-css](https://github.com/ben-rogerson/tw-animate-css)
