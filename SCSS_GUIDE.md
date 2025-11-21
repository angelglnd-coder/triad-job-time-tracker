# SCSS Setup Guide

This project now supports SCSS (Sass) alongside Tailwind CSS v4.

## Installation

SCSS support has been added via the `sass` package (v1.94.2). Vite automatically processes `.scss` files without additional configuration.

## File Structure

```
src/renderer/src/
├── assets/
│   ├── tailwind.css       # Tailwind CSS import (plain CSS)
│   ├── main.scss          # Main SCSS stylesheet
│   └── base.scss          # Base styles and CSS variables
├── styles/
│   ├── variables.scss     # SCSS variables
│   └── mixins.scss        # Reusable SCSS mixins
└── components/
    └── ScssExample.svelte # Example component using SCSS
```

## How to Use SCSS

### 1. Global SCSS Files

Both Tailwind CSS and SCSS files are imported in [src/renderer/src/main.ts](src/renderer/src/main.ts:3-4):

```typescript
import './assets/tailwind.css'  // Tailwind CSS (plain CSS)
import './assets/main.scss'     // Your SCSS styles
```

**Why separate files?**
- [tailwind.css](src/renderer/src/assets/tailwind.css) uses CSS `@import` syntax (required by Tailwind v4)
- [main.scss](src/renderer/src/assets/main.scss) uses modern SCSS `@use` syntax
- This avoids deprecation warnings while keeping all SCSS benefits

[main.scss](src/renderer/src/assets/main.scss) uses modern SCSS syntax:

```scss
@use './base.scss';

// Your global styles here
body {
  // ...
}
```

### 2. Component-Scoped SCSS

Use SCSS in Svelte components with `<style lang="scss">`:

```svelte
<script lang="ts">
  export let active = false
</script>

<div class="my-component">
  <button class="btn">Click me</button>
</div>

<style lang="scss">
  @use '../styles/variables' as *;
  @use '../styles/mixins' as *;

  .my-component {
    padding: $spacing-md;

    .btn {
      @include hover-scale;
      background: $primary-color;
      color: $white;

      &:hover {
        background: darken($primary-color, 10%);
      }
    }
  }
</style>
```

### 3. SCSS Variables

[src/renderer/src/styles/variables.scss](src/renderer/src/styles/variables.scss) provides:

```scss
// Colors
$primary-color: #3b82f6;
$secondary-color: #6366f1;
$success-color: #10b981;
$warning-color: #f59e0b;
$danger-color: #ef4444;

// Spacing
$spacing-xs: 0.25rem;
$spacing-sm: 0.5rem;
$spacing-md: 1rem;
$spacing-lg: 1.5rem;

// Typography
$font-size-base: 1rem;
$font-weight-bold: 700;

// And many more...
```

**Usage:**

```scss
@use '../styles/variables' as *;

.card {
  padding: $spacing-lg;
  background: $primary-color;
  border-radius: $radius-xl;
}
```

### 4. SCSS Mixins

[src/renderer/src/styles/mixins.scss](src/renderer/src/styles/mixins.scss) provides reusable patterns:

#### Layout Mixins

```scss
@use '../styles/mixins' as *;

.container {
  @include flex-center;      // Centers content with flexbox
  @include flex-between;     // Space-between layout
  @include flex-column;      // Flex column
}
```

#### Responsive Breakpoints

```scss
.responsive-component {
  font-size: 14px;

  @include md {
    font-size: 16px;
  }

  @include lg {
    font-size: 18px;
  }
}
```

#### Hover Effects

```scss
.button {
  @include hover-scale(1.05);  // Scale to 1.05 on hover, 0.95 on active
}
```

#### Card Shadows

```scss
.card {
  @include card-shadow($hover: true);  // Adds shadow with hover effect
}
```

#### Gradient Text

```scss
.heading {
  @include gradient-text($primary-color, $secondary-color);
}
```

#### Custom Scrollbar

```scss
.scrollable {
  @include custom-scrollbar(8px, $gray-100, $gray-400);
}
```

#### Glass Morphism

```scss
.modal {
  @include glass-morphism(0.1, 10px);
}
```

#### Other Useful Mixins

```scss
// Truncate text
.text {
  @include truncate;
}

// Multi-line clamp
.description {
  @include line-clamp(3);
}

// Focus ring
.button {
  @include focus-ring($primary-color);
}

// Button reset
.custom-btn {
  @include button-reset;
}
```

## SCSS Features

### 1. Nesting

```scss
.nav {
  background: $white;

  .nav-item {
    padding: $spacing-sm;

    &:hover {
      background: $gray-100;
    }

    &.active {
      color: $primary-color;
    }
  }
}
```

### 2. Variables

```scss
$card-padding: $spacing-lg;
$card-bg: $white;

.card {
  padding: $card-padding;
  background: $card-bg;
}
```

### 3. Color Functions

```scss
.button {
  background: $primary-color;

  &:hover {
    background: darken($primary-color, 10%);
  }

  &:disabled {
    background: lighten($primary-color, 30%);
  }
}
```

### 4. Calculations

```scss
$base-spacing: 1rem;

.container {
  padding: $base-spacing * 2;
  margin: calc($base-spacing / 2);
}
```

### 5. Interpolation

```scss
$side: left;

.box {
  margin-#{$side}: 10px;
}
```

## Using SCSS with Tailwind CSS

SCSS and Tailwind work together seamlessly:

```svelte
<script lang="ts">
  import { cn } from '../lib/utils'
</script>

<div class={cn('custom-card', 'hover:shadow-lg')}>
  Content
</div>

<style lang="scss">
  @use '../styles/variables' as *;

  .custom-card {
    padding: $spacing-lg;
    border-radius: $radius-xl;

    // SCSS nesting with Tailwind responsive classes
    @media (min-width: 768px) {
      padding: $spacing-2xl;
    }
  }
</style>
```

## Example Component

See [src/renderer/src/components/ScssExample.svelte](src/renderer/src/components/ScssExample.svelte) for a complete example:

```svelte
<script lang="ts">
  import ScssExample from './components/ScssExample.svelte'
</script>

<ScssExample title="My Card" variant="primary">
  <div slot="footer">
    <button>Custom button</button>
  </div>
</ScssExample>
```

## Best Practices

1. **Use `@use` instead of `@import`**
   ```scss
   // Good
   @use '../styles/variables' as *;

   // Avoid (deprecated)
   @import '../styles/variables';
   ```

2. **Namespace your imports when needed**
   ```scss
   @use '../styles/variables' as vars;

   .card {
     padding: vars.$spacing-lg;
   }
   ```

3. **Combine SCSS with Tailwind wisely**
   - Use Tailwind for common utilities
   - Use SCSS for complex, reusable component styles
   - Use SCSS variables for design tokens

4. **Leverage SCSS for complex calculations**
   ```scss
   $columns: 12;
   $column-width: 100% / $columns;
   ```

5. **Keep styles scoped to components**
   - Prefer component-level `<style lang="scss">` over global styles
   - Use global SCSS for design system variables and mixins only

## Migration Tips

### Converting Existing CSS to SCSS

Your existing CSS files work as-is in `.scss` files. Gradually enhance them with SCSS features:

```scss
// Before (CSS)
.button {
  padding: 0.5rem 1rem;
}

.button:hover {
  background: #2563eb;
}

// After (SCSS)
@use '../styles/variables' as *;

.button {
  padding: $spacing-sm $spacing-md;

  &:hover {
    background: darken($primary-color, 10%);
  }
}
```

## Troubleshooting

### SCSS not compiling?

1. Ensure `sass` package is installed:
   ```bash
   npm list sass
   ```

2. Check file extension is `.scss` not `.css`

3. Restart the dev server:
   ```bash
   npm run dev
   ```

### Deprecation warnings about `@import`?

**These warnings have been resolved!** The setup now uses:
- [tailwind.css](src/renderer/src/assets/tailwind.css) - Plain CSS file with `@import 'tailwindcss'`
- [main.scss](src/renderer/src/assets/main.scss) - SCSS file using modern `@use` syntax

**For your own SCSS files**, always use `@use` instead of `@import`:

```scss
// ✅ Good - Use @use for SCSS modules
@use '../styles/variables' as *;
@use '../styles/mixins' as *;

// ❌ Avoid - Don't use @import for SCSS
@import '../styles/variables';
```

### Import errors?

Use `@use` with relative paths:
```scss
// Correct
@use '../styles/variables' as *;

// Incorrect
@use 'styles/variables' as *;
```

## Resources

- [Sass Official Documentation](https://sass-lang.com/documentation)
- [Sass Guidelines](https://sass-guidelin.es/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Vite CSS Documentation](https://vite.dev/guide/features.html#css)
