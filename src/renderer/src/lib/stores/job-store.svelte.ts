import type { Job, CreateJobFormData, NetSuitePartData } from '$lib/types'
import { globalStore } from './global-store.svelte'

class JobStore {
  jobs = $state<Job[]>([])
  selectedJob = $state<Job | null>(null)
  isLoading = $state(false)
  error = $state<string | null>(null)

  // For job creation workflow
  partData = $state<NetSuitePartData | null>(null)
  createFormData = $state<CreateJobFormData>({
    part_number: '',
    quantity_ordered: 1,
    priority: 5
  })

  async loadJobs(filters?: { status?: string }) {
    this.isLoading = true
    this.error = null
    try {
      // TODO: Replace with actual API call when backend is ready
      // const jobs = await window.api.jobs.getAll(filters)
      // this.jobs = jobs

      // Mock data for now
      this.jobs = []
    } catch (err) {
      this.error = err instanceof Error ? err.message : 'Failed to load jobs'
    } finally {
      this.isLoading = false
    }
  }

  async fetchPartFromNetSuite(partNumber: string): Promise<boolean> {
    this.isLoading = true
    this.error = null
    try {
      // TODO: Replace with actual API call when backend is ready
      // const data = await window.api.parts.syncFromNetSuite(partNumber)
      // this.partData = data

      // Mock NetSuite response for now
      this.partData = {
        partNumber: partNumber,
        itemId: '11819',
        itemType: 'assemblyitem',
        canHaveWorkOrder: true,
        defaultBom: null,
        routings: [
          {
            id: '133',
            name: partNumber,
            locationId: '10',
            location: 'Perris-Production',
            steps: [
              {
                operationSequence: 10,
                operationName: 'KITTING',
                workCenter: 'MATERIAL HANDLING',
                machineResources: 1,
                laborResources: 1,
                costTemplate: 'MATERIAL HANDLING - CT',
                setupTimeMin: 0,
                runRatePerUnitMin: 0.15,
                connectionType: '',
                lagType: '',
                lagAmount: '',
                lagUnits: ''
              },
              {
                operationSequence: 20,
                operationName: 'PREP',
                workCenter: 'PREP',
                machineResources: 1,
                laborResources: 1,
                costTemplate: 'PREP - CT',
                setupTimeMin: 0,
                runRatePerUnitMin: 15,
                connectionType: 'Finish-To-Start (FS)',
                lagType: '',
                lagAmount: '',
                lagUnits: ''
              },
              {
                operationSequence: 30,
                operationName: 'SETUP',
                workCenter: 'SETUP',
                machineResources: 1,
                laborResources: 1,
                costTemplate: 'SETUP - CT',
                setupTimeMin: 15,
                runRatePerUnitMin: 0,
                connectionType: 'Finish-To-Start (FS)',
                lagType: '',
                lagAmount: '',
                lagUnits: ''
              },
              {
                operationSequence: 40,
                operationName: 'WINDING',
                workCenter: 'WINDING',
                machineResources: 1,
                laborResources: 1,
                costTemplate: 'WINDING - CT',
                setupTimeMin: 0,
                runRatePerUnitMin: 45,
                connectionType: 'Finish-To-Start (FS)',
                lagType: '',
                lagAmount: '',
                lagUnits: ''
              },
              {
                operationSequence: 50,
                operationName: 'TERMINATION',
                workCenter: 'TERMINATION',
                machineResources: 1,
                laborResources: 2,
                costTemplate: 'TERMINATION - CT',
                setupTimeMin: 0,
                runRatePerUnitMin: 15,
                connectionType: 'Finish-To-Start (FS)',
                lagType: '',
                lagAmount: '',
                lagUnits: ''
              },
              {
                operationSequence: 60,
                operationName: 'ASSEMBLY',
                workCenter: 'ASSEMBLY',
                machineResources: 0,
                laborResources: 1,
                costTemplate: 'ASSEMBLY - CT',
                setupTimeMin: 0,
                runRatePerUnitMin: 15,
                connectionType: 'Finish-To-Start (FS)',
                lagType: '',
                lagAmount: '',
                lagUnits: ''
              },
              {
                operationSequence: 70,
                operationName: 'TESTING',
                workCenter: 'TESTING',
                machineResources: 1,
                laborResources: 1,
                costTemplate: 'TESTING - CT',
                setupTimeMin: 0,
                runRatePerUnitMin: 1.25,
                connectionType: 'Finish-To-Start (FS)',
                lagType: '',
                lagAmount: '',
                lagUnits: ''
              },
              {
                operationSequence: 80,
                operationName: 'ENCAPSULATION',
                workCenter: 'ENCAPSULATION',
                machineResources: 1,
                laborResources: 1,
                costTemplate: 'ENCAPSULATION - CT',
                setupTimeMin: 0,
                runRatePerUnitMin: 1440,
                connectionType: 'Finish-To-Start (FS)',
                lagType: 'Duration',
                lagAmount: '1440',
                lagUnits: 'Minute(s)'
              },
              {
                operationSequence: 90,
                operationName: 'PACKAGING',
                workCenter: 'MATERIAL HANDLING',
                machineResources: 1,
                laborResources: 1,
                costTemplate: 'MATERIAL HANDLING - CT',
                setupTimeMin: 0,
                runRatePerUnitMin: 1,
                connectionType: 'Finish-To-Start (FS)',
                lagType: '',
                lagAmount: '',
                lagUnits: ''
              },
              {
                operationSequence: 100,
                operationName: 'FINAL INSPECTION',
                workCenter: 'TESTING',
                machineResources: 0,
                laborResources: 1,
                costTemplate: 'TESTING - CT',
                setupTimeMin: 0,
                runRatePerUnitMin: 2,
                connectionType: 'Finish-To-Start (FS)',
                lagType: '',
                lagAmount: '',
                lagUnits: ''
              },
              {
                operationSequence: 110,
                operationName: 'SHIPPING PREP',
                workCenter: 'MATERIAL HANDLING',
                machineResources: 1,
                laborResources: 1,
                costTemplate: 'MATERIAL HANDLING - CT',
                setupTimeMin: 0,
                runRatePerUnitMin: 0.5,
                connectionType: 'Finish-To-Start (FS)',
                lagType: '',
                lagAmount: '',
                lagUnits: ''
              }
            ]
          }
        ],
        workOrders: [
          {
            id: '213678',
            tranId: 'WO3021',
            status: 'Released',
            quantity: '50',
            locationId: '10',
            location: 'Perris-Production',
            startDate: '13-Nov-2025',
            endDate: '27-Nov-2025'
          },
          {
            id: '213679',
            tranId: 'WO3022',
            status: 'Released',
            quantity: '100',
            locationId: '10',
            location: 'Perris-Production',
            startDate: '13-Nov-2025',
            endDate: '11-Dec-2025'
          }
        ]
      }

      this.createFormData.part_data = this.partData
      this.createFormData.part_number = partNumber
      return true
    } catch (err) {
      this.error = err instanceof Error ? err.message : 'Failed to fetch part data'
      this.partData = null
      return false
    } finally {
      this.isLoading = false
    }
  }

  async createJob() {
    this.isLoading = true
    this.error = null
    try {
      console.log('Creating job with data:', this.createFormData)

      // Create job in global store (this also creates operations from routing steps)
      const createdJob = globalStore.createJob(this.createFormData)

      console.log('Job created successfully:', createdJob)

      // Reset form
      this.resetCreateForm()
      return true
    } catch (err) {
      this.error = err instanceof Error ? err.message : 'Failed to create job'
      return false
    } finally {
      this.isLoading = false
    }
  }

  resetCreateForm() {
    this.createFormData = {
      part_number: '',
      quantity_ordered: 1,
      priority: 5
    }
    this.partData = null
  }

  selectJob(job: Job | null) {
    this.selectedJob = job
  }
}

export const jobStore = new JobStore()
