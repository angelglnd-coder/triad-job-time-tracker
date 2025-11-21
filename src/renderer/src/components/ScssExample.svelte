<script lang="ts">
  export let title: string = 'SCSS Example Component'
  export let variant: 'primary' | 'secondary' | 'success' = 'primary'
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
    <li>Functions (darken, lighten)</li>
  </ul>
  <div class="card-footer">
    <slot name="footer">
      <button class="styled-button">Click me</button>
    </slot>
  </div>
</div>

<style lang="scss">
  @use '../styles/variables' as *;
  @use '../styles/mixins' as *;

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
        @include gradient-text($primary-color, darken($primary-color, 15%));
      }
    }

    &.variant-secondary {
      border-color: $secondary-color;

      .card-title {
        @include gradient-text($secondary-color, darken($secondary-color, 15%));
      }
    }

    &.variant-success {
      border-color: $success-color;

      .card-title {
        @include gradient-text($success-color, darken($success-color, 15%));
      }
    }

    &:hover {
      border-color: darken($gray-200, 10%);
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
    background: linear-gradient(135deg, $primary-color, darken($primary-color, 10%));
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
