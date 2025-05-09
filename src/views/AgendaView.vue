<script setup lang="ts">
import { ref, onMounted } from 'vue'
import CalendarComponent from '../components/Agenda/CalendarComponent.vue'
import TaskList from '../components/Agenda/TaskList.vue'
import { useAuthStore } from '@/stores/authStore'
import axios from 'axios'
import Swal from 'sweetalert2'

const authStore = useAuthStore()
const currentUserId = authStore.id
const selectedDate = ref<string | null>(null)
const tasks = ref([])
const temas = ref([])
const grupos = ref([])

// Cargar datos iniciales
const loadInitialData = async () => {
  try {
    const [temasResponse, gruposResponse, horariosResponse] = await Promise.all([
      axios.get("https://localhost:7062/api/Tema"),
      axios.get('https://localhost:7062/api/Grupo'),
      axios.get(`https://localhost:7062/api/Horario/usuario/${currentUserId}`)
    ])

    temas.value = temasResponse.data
    grupos.value = gruposResponse.data
    processHorarios(horariosResponse.data)
  } catch (error) {
    console.error('Error al cargar datos:', error)
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'No se pudo cargar los datos iniciales',
      confirmButtonColor: '#DC2626',
    })
  }
}

const processHorarios = (horarios) => {
  tasks.value = horarios.map(horario => ({
    id: horario.id,
    fecha: horario.fecha.split('T')[0],
    hora: horario.fecha.split('T')[1]?.substring(0, 5) || '',
    horaFin: horario.fechaFin?.split('T')[1]?.substring(0, 5) || '',
    temaId: horario.temaId,
    grupoId: horario.grupoId,
    actividad: horario.tarea,
    descripcion: horario.descripcion || '',
    lugar: horario.edificio || ''
  }))
}

const handleDateSelect = (date: string) => {
  selectedDate.value = date
}

const handleTaskCreated = (newTask) => {
  tasks.value.push(newTask)
}

const handleTaskDeleted = (taskId) => {
  tasks.value = tasks.value.filter(task => task.id !== taskId)
}

onMounted(() => {
  loadInitialData()
})
</script>

<template>
  <div class="agenda-calendar p-6 max-w-6xl mx-auto">
    <h1 class="text-2xl font-bold text-gray-800 mb-4">
      Calendario de Actividades
    </h1>

    <CalendarComponent
      :tasks="tasks"
      :temas="temas"
      :grupos="grupos"
      @date-selected="handleDateSelect"
    />

    <TaskList
      v-if="selectedDate"
      :date="selectedDate"
      :tasks="tasks"
      :temas="temas"
      :grupos="grupos"
      @task-created="handleTaskCreated"
      @task-deleted="handleTaskDeleted"
    />
  </div>
</template>
