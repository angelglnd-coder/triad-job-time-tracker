import { tv } from 'tailwind-variants'

/**
 * Example button variants using tailwind-variants
 *
 * Usage:
 * import { button } from './variants'
 * const classes = button({ variant: 'primary', size: 'md' })
 */
export const button = tv({
  base: 'font-semibold rounded-lg transition-colors',
  variants: {
    variant: {
      primary: 'bg-blue-500 text-white hover:bg-blue-600',
      secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300',
      danger: 'bg-red-500 text-white hover:bg-red-600',
    },
    size: {
      sm: 'text-sm px-3 py-1.5',
      md: 'text-base px-4 py-2',
      lg: 'text-lg px-6 py-3',
    },
  },
  defaultVariants: {
    variant: 'primary',
    size: 'md',
  },
})

/**
 * Example card variants
 */
export const card = tv({
  base: 'rounded-lg shadow-md p-6',
  variants: {
    variant: {
      default: 'bg-white border border-gray-200',
      elevated: 'bg-white shadow-xl',
      outlined: 'bg-transparent border-2 border-gray-300',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})
