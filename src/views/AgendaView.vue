<template>
  <div class="agenda-calendar p-4">

    <!-- Calendario -->
    <FullCalendar
      :options="calendarOptions"
      class="shadow rounded p-4 mb-8"
    />

    <!-- Tabla de horarios -->
    <div v-if="selectedDate" class="mt-8">
      <h2 class="text-xl font-semibold mb-4">Horario para: {{ formatDate(selectedDate) }}</h2>

      <div class="overflow-auto">
        <table class="min-w-full bg-white border">
          <thead class="bg-gray-100">
            <tr>
              <th class="border p-2">Hora</th>
              <th class="border p-2" v-for="day in daysOfWeek" :key="day">{{ day }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="hour in hours" :key="hour">
              <td class="border p-2 font-semibold">{{ hour }}</td>
              <td
                class="border p-2 hover:bg-gray-100 cursor-pointer"
                v-for="day in daysOfWeek" :key="day"
                @click="openAssignModal(day, hour)"
              >
                <div v-if="getTask(selectedDate, day, hour)">
                  <p class="text-sm font-bold">{{ getTask(selectedDate, day, hour)?.tema }}</p>
                  <p class="text-xs">{{ getTask(selectedDate, day, hour)?.actividad }}</p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal de asignar tarea -->
<div v-if="showAssignModal" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
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
        <input v-model="taskForm.descripcion" type="text" class="border p-2 rounded w-full" placeholder="Descripción">
      </div>

      <!-- Tarea -->
      <div class="mb-4">
        <label class="block mb-1">Tarea</label>
        <input v-model="taskForm.tarea" type="text" class="border p-2 rounded w-full" placeholder="Tarea">
      </div>

      <!-- Actividades (Opcional: puedes agregar un campo más si manejas actividades directamente aquí) -->

      <!-- Lugar -->
      <div class="mb-4">
        <label class="block mb-1">Lugar</label>
        <input v-model="taskForm.lugar" type="text" class="border p-2 rounded w-full" placeholder="Lugar (Edificio)">
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
        <button type="button" @click="closeAssignModal" class="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded">
          Cancelar
        </button>
        <button type="submit" class="bg-indigo-500 hover:bg-indigo-600 text-white py-2 px-4 rounded">
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
import { onMounted, ref } from 'vue';
import FullCalendar from '@fullcalendar/vue3';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import esLocale from '@fullcalendar/core/locales/es';
import axios from 'axios';

// Variables
const selectedDate = ref<string | null>(null);
const showModal = ref(false);
const selectedDay = ref('');
const selectedHour = ref('');
const tasks = ref([]);
const temas = ref([]);
const grupos = ref([]);

const taskForm = ref({
  hora: '',
  temaId: null,
  descripcion: '',
  tarea: '',
  lugar: '',
  grupoId: null
});

// Cargar temas
const fetchTemas = async () => {
  try {
    const response = await axios.get('https://localhost:7063/api/Tema'); 
    temas.value = response.data;
  } catch (error) {
    console.error('Error cargando temas:', error);
  }
};

// Cargar grupos
const fetchGrupos = async () => {
  try {
    const response = await axios.get('https://localhost:7063/api/Grupo');
    grupos.value = response.data;
  } catch (error) {
    console.error('Error cargando grupos:', error);
  }
};

// Cargar al montar la vista
onMounted(() => {
  fetchTemas();
  fetchGrupos();
});

// Opciones del calendario
const calendarOptions = ref({
  plugins: [dayGridPlugin, interactionPlugin],
  initialView: 'dayGridMonth',
  locale: esLocale,
  events: [],
  eventColor: '#4F46E5',
  dateClick: (info) => {
    selectedDate.value = info.dateStr;
  },
});

// Horas de la tabla
const hours = [
  "07:00", "08:00", "09:00", "10:00", "11:00",
  "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"
];

// Días de la semana
const daysOfWeek = ["Tarea"];

// Función para formatear fecha
const formatDate = (dateStr: string) => {
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateStr).toLocaleDateString('es-ES', options);
};

// Abrir el modal
function openAssignModal(day: string, hour: string) {
  selectedDay.value = day;
  selectedHour.value = hour;
  showModal.value = true;
}

const currentUserId = 1;

// Guardar la tarea
const saveTask = async () => {
  if (!taskForm.value.temaId || !taskForm.value.grupoId) {
    alert('Tema y Grupo son obligatorios');
    return;
  }

  const fechaCompleta = selectedDate.value + 'T' + taskForm.value.hora; // Ej: '2025-04-25T07:00'

  const newTask = {
    fecha: fechaCompleta,
    descripcion: taskForm.value.descripcion,
    tarea: taskForm.value.tarea,
    edificio: taskForm.value.lugar,
    grupoId: taskForm.value.grupoId,
    temaId: taskForm.value.temaId,
    usuarioId: currentUserId
  };

  try {
    const response = await axios.post('http://localhost:7062/api/Horario', newTask);
    console.log('Horario creado correctamente:', response.data);
    alert('Tarea guardada');
    // Aquí podrías limpiar el formulario si quieres:
    taskForm.value = {
      hora: '',
      temaId: null,
      descripcion: '',
      tarea: '',
      lugar: '',
      grupoId: null
    };
  } catch (error) {
    console.error('Error al guardar la tarea:', error);
    alert('Error al guardar la tarea');
  }
};

// Buscar tarea en una celda
function getTask(date: string, day: string, hour: string) {
  return tasks.value.find(task => task.fecha === date && task.dia === day && task.hora === hour);
}
</script>

<style scoped>
.agenda-calendar {
  max-width: 1100px;
  margin: 0 auto;
}
</style>

