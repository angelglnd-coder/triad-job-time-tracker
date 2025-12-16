import type { TimeEntry, JobOperation, FinishOperationFormData } from '$lib/types'

class TimeTrackingStore {
  activeTimeEntry = $state<TimeEntry | null>(null)
  currentOperation = $state<JobOperation | null>(null)
  isWorking = $derived(this.activeTimeEntry !== null && !this.activeTimeEntry.end_time)
  elapsedSeconds = $state(0)

  private intervalId: number | null = null

  // Calculated elapsed time for display
  elapsedTime = $derived(() => {
    if (!this.activeTimeEntry?.start_time) return { hours: 0, minutes: 0, seconds: 0 }

    const start = new Date(this.activeTimeEntry.start_time).getTime()
    const now = Date.now()
    const diffMs = now - start
    const diffSec = Math.floor(diffMs / 1000)

    const hours = Math.floor(diffSec / 3600)
    const minutes = Math.floor((diffSec % 3600) / 60)
    const seconds = diffSec % 60

    return { hours, minutes, seconds }
  })

  formattedElapsedTime = $derived(() => {
    const { hours, minutes, seconds } = this.elapsedTime
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
  })

  async startOperation(operation: JobOperation) {
    try {
      // TODO: Replace with actual API call
      // const timeEntry = await window.api.time.start(operation.id)

      // Mock time entry for now
      const timeEntry: TimeEntry = {
        id: Date.now(),
        job_operation_id: operation.id,
        user_id: 1, // TODO: Get from auth store
        start_time: new Date().toISOString(),
        quantity_completed: 0,
        quantity_scrapped: 0,
        entry_type: 'work'
      }

      this.activeTimeEntry = timeEntry
      this.currentOperation = operation
      this.startTimer()

      return true
    } catch (err) {
      console.error('Failed to start operation:', err)
      return false
    }
  }

  async pauseOperation() {
    if (!this.activeTimeEntry) return false

    try {
      // TODO: Replace with actual API call
      // await window.api.time.pause(this.activeTimeEntry.job_operation_id)

      this.stopTimer()
      this.activeTimeEntry = null
      this.currentOperation = null

      return true
    } catch (err) {
      console.error('Failed to pause operation:', err)
      return false
    }
  }

  async resumeOperation(operation: JobOperation) {
    return this.startOperation(operation)
  }

  async finishOperation(formData: FinishOperationFormData) {
    if (!this.activeTimeEntry) return false

    try {
      // TODO: Replace with actual API call
      // await window.api.time.finish({
      //   ...formData,
      //   time_entry_id: this.activeTimeEntry.id
      // })

      console.log('Finishing operation with data:', formData)

      this.stopTimer()
      this.activeTimeEntry = null
      this.currentOperation = null

      return true
    } catch (err) {
      console.error('Failed to finish operation:', err)
      return false
    }
  }

  private startTimer() {
    // Update every second
    this.intervalId = window.setInterval(() => {
      this.elapsedSeconds++
    }, 1000)
  }

  private stopTimer() {
    if (this.intervalId) {
      clearInterval(this.intervalId)
      this.intervalId = null
    }
    this.elapsedSeconds = 0
  }

  // Cleanup on unmount
  destroy() {
    this.stopTimer()
  }
}

export const timeTrackingStore = new TimeTrackingStore()
