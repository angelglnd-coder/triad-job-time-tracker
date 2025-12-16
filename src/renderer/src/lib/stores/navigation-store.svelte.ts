import type { PageId } from '$lib/types'

class NavigationStore {
  activePage = $state<PageId>('dashboard')

  navigateTo(page: PageId) {
    console.log('NavigationStore.navigateTo called with:', page)
    console.log('Before:', this.activePage)
    this.activePage = page
    console.log('After:', this.activePage)
  }
}

export const navigationStore = new NavigationStore()
