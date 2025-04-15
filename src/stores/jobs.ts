import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import type { Ref } from 'vue'

// Importamos el json con los trabajos


export const useJobStore = defineStore('job', () => {
  const jobList = ref([]) as Ref<Job[]>

  const jobCount = computed(() => jobList.value.length)

  //Función para obtener los trabajos
  async function getJobs() {
    // Simular datos manteniendo la reactividad
    jobList.value = jobs as Job[] // Asignar directamente el array
  }
  // Función para agregar un trabajo
  function addJob(job: Job) {
    // Verificar si el trabajo ya existe en la lista
    if (!jobList.value.some((existingJob) => existingJob.id === job.id)) {
      // Si no existe, agregar el trabajo a la lista
      jobList.value.push(job)
    }
    // Si el trabajo ya existe, podemos mostrar un mensaje de error
  }

  // Función para remover un trabajo
  function removeJob(job: Job) {
    // Encontrar el índice del trabajo en la lista
    const index = jobList.value.findIndex((existingJob) => existingJob.id === job.id)
    // Si el trabajo no se encuentra, salir de la función
    if (index === -1) return
    // Remover el trabajo de la lista usando el índice encontrado
    jobList.value.splice(index, 1)
  }

  return { jobList, jobCount, getJobs, addJob, removeJob }
})
