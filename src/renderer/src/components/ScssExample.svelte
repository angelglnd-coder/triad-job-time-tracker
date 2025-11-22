<script lang="ts">
  import type { Snippet } from 'svelte'

  interface Props {
    title?: string
    variant?: 'primary' | 'secondary' | 'success'
    footer?: Snippet
  }

  let { title = 'SCSS Example Component', variant = 'primary', footer }: Props = $props()
</script>

<div class="scss-card" class:variant-primary={variant === 'primary'} class:variant-secondary={variant === 'secondary'} class:variant-success={variant === 'success'}>
  <h3 class="card-title">{title}</h3>
  <p class="card-description">
    This component demonstrates SCSS features including:
  </p>
  <ul class="feature-list">
    <li>SCSS variables</li>
    <li>Nesting</li>
    <li>Mixins</li>
    <li>Functions (color.adjust)</li>
  </ul>
  <div class="card-footer">
    {#if footer}
      {@render footer()}
    {:else}
      <button class="styled-button">Click me</button>
    {/if}
  </div>
</div>

<style lang="scss">
  @use '../styles/variables' as *;
  @use '../styles/mixins' as *;

  @use 'sass:color';

  .scss-card {
    @include card-shadow($hover: true);
    @include transition(all);

    padding: $spacing-lg;
    border-radius: $radius-xl;
    background: $white;
    border: 2px solid $gray-200;
    max-width: 400px;

    // Variant styles using SCSS nesting
    &.variant-primary {
      border-color: $primary-color;

      .card-title {
        @include gradient-text($primary-color, color.adjust($primary-color, $lightness: -15%));
      }
    }

    &.variant-secondary {
      border-color: $secondary-color;

      .card-title {
        @include gradient-text($secondary-color, color.adjust($secondary-color, $lightness: -15%));
      }
    }

    &.variant-success {
      border-color: $success-color;

      .card-title {
        @include gradient-text($success-color, color.adjust($success-color, $lightness: -15%));
      }
    }

    &:hover {
      border-color: color.adjust($gray-200, $lightness: -10%);
      transform: translateY(-4px);
    }
  }

  .card-title {
    font-size: $font-size-2xl;
    font-weight: $font-weight-bold;
    margin-bottom: $spacing-md;
  }

  .card-description {
    font-size: $font-size-base;
    color: $gray-600;
    margin-bottom: $spacing-md;
  }

  .feature-list {
    @include list-reset;
    margin-bottom: $spacing-lg;

    li {
      padding: $spacing-xs 0;
      padding-left: $spacing-md;
      position: relative;
      color: $gray-700;

      // Custom bullet using SCSS
      &::before {
        content: '✓';
        position: absolute;
        left: 0;
        color: $success-color;
        font-weight: $font-weight-bold;
      }
    }
  }

  .card-footer {
    @include flex-center;
    padding-top: $spacing-md;
    border-top: 1px solid $gray-200;
  }

  .styled-button {
    @include button-reset;
    @include hover-scale(1.05);
    @include focus-ring($primary-color);

    padding: $spacing-sm $spacing-lg;
    background: linear-gradient(135deg, $primary-color, color.adjust($primary-color, $lightness: -10%));
    color: $white;
    border-radius: $radius-lg;
    font-weight: $font-weight-semibold;
    box-shadow: $shadow-sm;

    &:hover {
      box-shadow: $shadow-md;
    }

    &:active {
      box-shadow: $shadow-sm;
    }
  }
</style>
