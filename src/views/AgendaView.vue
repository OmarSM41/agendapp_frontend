<template>
  <div class="agenda-calendar p-4">
    <!-- Calendario -->
    <FullCalendar :options="calendarOptions" class="shadow rounded p-4 mb-8" />

    <!-- Tabla de horario simplificada -->
    <div v-if="selectedDate" class="mt-8">
      <h2 class="text-xl font-semibold mb-4">Actividades para: {{ formatDate(selectedDate) }}</h2>

      <!-- Botón para agregar una nueva actividad -->
      <div class="mb-4">
        <button
          @click="openAssignModal(selectedDate)"
          class="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
        >
          Agregar Actividad
        </button>
      </div>

      <!-- Tabla de actividades -->
      <div class="overflow-auto">
        <table class="min-w-full bg-white border">
          <thead class="bg-gray-100">
            <tr>
              <th class="border p-2">Hora</th>
              <th class="border p-2">Actividad</th>
              <th class="border p-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="task in tasksForSelectedDate" :key="task.hora + task.tema">
              <td class="border p-2 font-semibold">{{ task.hora }}</td>
              <td class="border p-2">
                <p class="text-sm font-bold">{{ task.tema }}</p>
                <p class="text-xs">{{ task.actividad }}</p>
              </td>
              <td class="border p-2">
                <button
                  @click="viewTaskDetails(task)"
                  class="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-1 px-3 rounded"
                >
                  Ver
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        <p v-if="tasksForSelectedDate.length === 0" class="text-center text-gray-500 mt-4">
          No hay actividades asignadas para este día.
        </p>
      </div>
    </div>

    <!-- Modal de detalles de tarea -->
    <div
      v-if="isDetailsModalOpen"
      class="fixed inset-0 bg-gray-500/50 flex justify-center items-center z-50"
    >
      <div class="bg-white p-6 rounded-lg w-1/2">
        <h2 class="text-2xl font-bold mb-4">Detalles de la Tarea</h2>

        <div v-if="selectedTask">
          <p><strong>Tema:</strong> {{ selectedTask.temaId }}</p>
          <p><strong>Descripción:</strong> {{ selectedTask.descripcion }}</p>
          <p><strong>Tarea:</strong> {{ selectedTask.tarea }}</p>
          <p><strong>Hora:</strong> {{ selectedTask.hora }}</p>
          <p><strong>Lugar:</strong> {{ selectedTask.lugar }}</p>
          <p><strong>Grupo:</strong> {{ selectedTask.grupoId }}</p>
        </div>

        <button
          @click="closeDetailsModal"
          class="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded mt-4"
        >
          Cerrar
        </button>
      </div>
    </div>

    <!-- Modal de asignar tarea -->
    <div
      v-if="showAssignModal"
      class="fixed inset-0 bg-gray-500/50 flex justify-center items-center z-50"
    >
      <div class="bg-white p-6 rounded shadow-lg w-96">
        <h2 class="text-lg font-semibold mb-4">Asignar tarea</h2>

        <form @submit.prevent="saveTask">
          <!-- Tema -->
          <div class="mb-4">
            <label class="block mb-1">Tema</label>
            <select v-model="taskForm.temaId" class="border p-2 rounded w-full" required>
              <option value="" disabled selected>Seleccione un tema</option>
              <option v-for="tema in temas" :key="tema.id" :value="tema.id">
                {{ tema.nombre }}
              </option>
            </select>
          </div>

          <!-- Descripción -->
          <div class="mb-4">
            <label class="block mb-1">Descripción</label>
            <input
              v-model="taskForm.descripcion"
              type="text"
              class="border p-2 rounded w-full"
              placeholder="Descripción"
            />
          </div>

          <!-- Tarea -->
          <div class="mb-4">
            <label class="block mb-1">Tarea</label>
            <input
              v-model="taskForm.tarea"
              type="text"
              class="border p-2 rounded w-full"
              placeholder="Tarea"
            />
          </div>

          <!-- Hora -->
          <div class="mb-4">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="hora"> Hora </label>
            <input
              v-model="taskForm.hora"
              type="time"
              id="hora"
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>

          <!-- Lugar -->
          <div class="mb-4">
            <label class="block mb-1">Lugar</label>
            <input
              v-model="taskForm.lugar"
              type="text"
              class="border p-2 rounded w-full"
              placeholder="Lugar (Edificio)"
            />
          </div>

          <!-- Grupo -->
          <div class="mb-4">
            <label class="block mb-1">Grupo</label>
            <select v-model="taskForm.grupoId" class="border p-2 rounded w-full" required>
              <option value="" disabled selected>Seleccione un grupo</option>
              <option v-for="grupo in grupos" :key="grupo.id" :value="grupo.id">
                {{ grupo.nombre }}
              </option>
            </select>
          </div>

          <!-- Botones -->
          <div class="flex justify-end space-x-2">
            <button
              type="button"
              @click="closeAssignModal"
              class="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded"
            >
              Cancelar
            </button>
            <button
              type="submit"
              class="bg-indigo-500 hover:bg-indigo-600 text-white py-2 px-4 rounded"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Imports
import { onMounted, ref } from 'vue'
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import esLocale from '@fullcalendar/core/locales/es'
import axios from 'axios'
import { format, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'
import { computed } from 'vue'
import { useAuthStore } from '@/stores/authStore' // Asegúrate de importar el store


// Variables
const selectedDate = ref<string | null>(null)
const selectedDay = ref('')
const selectedHour = ref('')
const tasks = ref([])
const temas = ref([])
const grupos = ref([])
const showAssignModal = ref(false)
const selectedTask = ref(null)
const isDetailsModalOpen = ref(false);
const authStore = useAuthStore()


const viewTaskDetails = (task) => {
  selectedTask.value = task
  isDetailsModalOpen.value = true
}

const closeDetailsModal = () => {
  isDetailsModalOpen.value = false; // Cerramos el modal
};

const tasksForSelectedDate = computed(() => {
  return tasks.value.filter((task) => task.fecha === selectedDate.value)
})

const taskForm = ref({
  hora: '',
  temaId: null,
  descripcion: '',
  tarea: '',
  lugar: '',
  grupoId: null,
})

// Cargar al montar la vista
onMounted(async () => {
  try {
    // Obtener los datos del usuario autenticado
    const usuarioId = authStore.usuarioId // Obtén el ID del usuario

    // Temas
    const temasResponse = await axios.get('https://localhost:7062/api/Tema')
    temas.value = temasResponse.data

    // Grupos
    const gruposResponse = await axios.get('https://localhost:7062/api/Grupo')
    grupos.value = gruposResponse.data

    // Horarios
    const horariosResponse = await axios.get('https://localhost:7062/api/Horario')
    const horarios = horariosResponse.data

    // Filtrar los horarios por el usuario logueado
    const horariosFiltrados = horarios.filter(horario => horario.usuarioId === usuarioId)

    tasks.value = horariosFiltrados.map((horario) => {
      const fechaObj = parseISO(horario.fecha)
      const diaSemana = format(fechaObj, 'EEEE', { locale: es })
      const diaFormateado = diaSemana.charAt(0).toUpperCase() + diaSemana.slice(1)

      return {
        fecha: horario.fecha.split('T')[0], // solo la fecha YYYY-MM-DD
        dia: diaFormateado,
        hora: horario.fecha.split('T')[1]?.substring(0, 5) || '',
        tema: temas.value.find((t) => t.id === horario.temaId)?.nombre || '',
        actividad: horario.tarea,
      }
    })

    // Establecer eventos para el calendario
    calendarOptions.value.events = horariosFiltrados.map((horario) => ({
      title: horario.tarea,
      start: horario.fecha,
      allDay: true,
    }))
  } catch (error) {
    console.error('Error al cargar los horarios:', error)
    alert('Error al cargar los horarios')
  }
})

// Opciones del calendario
const calendarOptions = ref({
  plugins: [dayGridPlugin, interactionPlugin],
  initialView: 'dayGridMonth',
  locale: esLocale,
  events: [],
  eventColor: '#4F46E5',
  dateClick: (info) => {
    selectedDate.value = info.dateStr
  },
})

// Horas de la tabla
const hours = [
  '07:00',
  '08:00',
  '09:00',
  '10:00',
  '11:00',
  '12:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
]

// Días de la semana
const daysOfWeek = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']

// Función para formatear fecha
const formatDate = (dateStr: string) => {
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
  return new Date(dateStr).toLocaleDateString('es-ES', options)
}

// Abrir el modal
const openAssignModal = (day) => {
  selectedDay.value = day
  taskForm.value = {
    hora: '',
    temaId: null,
    descripcion: '',
    tarea: '',
    lugar: '',
    grupoId: null,
  }
  showAssignModal.value = true // O como sea que abras tu modal
}

// Cerrar el modal
function closeAssignModal() {
  showAssignModal.value = false
}


// Guardar la tarea
const saveTask = async () => {
  if (!taskForm.value.temaId || !taskForm.value.grupoId || !taskForm.value.tarea.trim()) {
    alert('Tema, Grupo y Tarea son obligatorios')
    return
  }

  const fechaCompleta = selectedDate.value + 'T' + taskForm.value.hora

  const newTask = {
    fecha: fechaCompleta,
    descripcion: taskForm.value.descripcion.trim(),
    tarea: taskForm.value.tarea.trim(),
    edificio: taskForm.value.lugar.trim(),
    grupoId: taskForm.value.grupoId,
    temaId: taskForm.value.temaId,
    usuarioId: authStore.usuarioId, 
  }

  try {
    const response = await axios.post('https://localhost:7062/api/Horario', newTask)
    console.log('Horario creado correctamente:', response.data)

    // Agregar solo las tareas del usuario autenticado
    if (response.data.usuarioId === authStore.usuarioId) {
      tasks.value.push({
        fecha: selectedDate.value,
        dia: selectedDay.value,
        hora: taskForm.value.hora,
        tema: temas.value.find((t) => t.id === taskForm.value.temaId)?.nombre || '',
        actividad: taskForm.value.tarea,
      })

      calendarOptions.value.events.push({
        title: taskForm.value.tarea,
        start: selectedDate.value,
        allDay: true,
      })
    }

    alert('Tarea guardada')

    // Limpiar el formulario
    taskForm.value = {
      hora: '',
      temaId: null,
      descripcion: '',
      tarea: '',
      lugar: '',
      grupoId: null,
    }

    closeAssignModal()
  } catch (error) {
    alert('Error al guardar la tarea')
  }
}


// Buscar tarea en una celda
function getTask(date: string, day: string, hour: string) {
  return tasks.value.find((task) => task.fecha === date && task.dia === day && task.hora === hour)
}
</script>

<style scoped>
.agenda-calendar {
  max-width: 1100px;
  margin: 0 auto;
}
</style>
