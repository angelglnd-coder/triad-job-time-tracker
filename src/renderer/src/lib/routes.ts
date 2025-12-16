import { createRouter } from 'sv-router'
import DashboardPage from '$lib/components/pages/dashboard-page.svelte'
import CreateJobPage from '$lib/components/pages/create-job-page.svelte'
import JobsPage from '$lib/components/pages/jobs-page.svelte'
import AssignOperationsPage from '$lib/components/pages/assign-operations-page.svelte'
import OperatorConsolePage from '$lib/components/pages/operator-console-page.svelte'
import SettingsPage from '$lib/components/pages/settings-page.svelte'

export const { p, navigate, isActive, route } = createRouter({
  '/': DashboardPage,
  '/create-job': CreateJobPage,
  '/jobs': JobsPage,
  '/assign-operations': AssignOperationsPage,
  '/operator-console': OperatorConsolePage,
  '/operation-status': DashboardPage,
  '/reports-workload': DashboardPage,
  '/reports-variance': DashboardPage,
  '/settings': SettingsPage
})

export const routeTitles: Record<string, string> = {
  '/': 'Dashboard',
  '/create-job': 'Create Job',
  '/jobs': 'Active Jobs',
  '/assign-operations': 'Assign Operations',
  '/operator-console': 'My Operations',
  '/operation-status': 'Operation Status',
  '/reports-workload': 'User Workload',
  '/reports-variance': 'Actual vs Planned',
  '/settings': 'Settings'
}
