import type { User } from '$lib/types'

class AuthStore {
  currentUser = $state<User | null>(null)
  isAuthenticated = $derived(this.currentUser !== null)
  isOperator = $derived(this.currentUser?.role === 'operator')
  isSupervisor = $derived(this.currentUser?.role === 'supervisor')
  isAdmin = $derived(this.currentUser?.role === 'admin')

  login(user: User) {
    this.currentUser = user
    // Store in localStorage for persistence
    localStorage.setItem('currentUser', JSON.stringify(user))
  }

  logout() {
    this.currentUser = null
    localStorage.removeItem('currentUser')
  }

  loadFromStorage() {
    const stored = localStorage.getItem('currentUser')
    if (stored) {
      try {
        this.currentUser = JSON.parse(stored)
      } catch (e) {
        console.error('Failed to parse stored user:', e)
        localStorage.removeItem('currentUser')
      }
    }
  }

  hasRole(...roles: Array<'operator' | 'supervisor' | 'admin'>): boolean {
    if (!this.currentUser) return false
    return roles.includes(this.currentUser.role)
  }
}

export const authStore = new AuthStore()
