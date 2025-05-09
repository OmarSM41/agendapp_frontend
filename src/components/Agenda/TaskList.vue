<script setup lang="ts">
import { computed } from 'vue'
import { format, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'
import TaskForm from './TaskForm.vue'
import TaskDetailsModal from './TaskDetailsModal.vue'
import DeleteConfirmation from './DeleteConfirmation.vue'
import { ClipboardList as IconClipboardList, Plus as IconPlus } from 'lucide-vue-next'

const props = defineProps({
  date: String,
  tasks: Array,
  temas: Array,
  grupos: Array
})

const emit = defineEmits(['task-created', 'task-deleted'])

const formatDate = (dateStr: string) => {
  return format(parseISO(dateStr), "EEEE, d 'de' MMMM 'de' yyyy", { locale: es })
}

const tasksForDate = computed(() => {
  return props.tasks
    .filter(task => task.fecha === props.date)
    .sort((a, b) => a.hora.localeCompare(b.hora))
})

const handleTaskCreated = (newTask) => {
  emit('task-created', newTask)
}

const handleDelete = async (taskId) => {
  emit('task-deleted', taskId)
}
</script>

<template>
  <div class="mt-10">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-xl font-semibold text-gray-800 flex items-center gap-2">
        <IconClipboardList class="w-5 h-5 text-indigo-600" />
        Actividades para: {{ formatDate(date) }}
      </h2>
      <TaskForm
        :date="date"
        :temas="temas"
        :grupos="grupos"
        @task-created="handleTaskCreated"
      />
    </div>

    <div class="overflow-x-auto bg-white shadow rounded-lg">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50 text-gray-700 text-sm font-semibold text-left">
          <tr>
            <th class="px-4 py-2">Hora</th>
            <th class="px-4 py-2">Tema</th>
            <th class="px-4 py-2">Tarea</th>
            <th class="px-4 py-2">Lugar</th>
            <th class="px-4 py-2">Grupo</th>
            <th class="px-4 py-2 text-center">Acciones</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200 text-sm">
          <tr v-for="task in tasksForDate" :key="task.id" class="hover:bg-gray-50">
            <td class="px-4 py-2">{{ task.hora }} - {{ task.horaFin }}</td>
            <td class="px-4 py-2">{{ temas.find(t => t.id === task.temaId)?.nombre || '' }}</td>
            <td class="px-4 py-2">{{ task.actividad }}</td>
            <td class="px-4 py-2">{{ task.lugar }}</td>
            <td class="px-4 py-2">{{ grupos.find(g => g.id === task.grupoId)?.nombre || '' }}</td>
            <td class="px-4 py-2 flex justify-center gap-2">
              <TaskDetailsModal
                :task="task"
                :temas="temas"
                :grupos="grupos"
              />
              <DeleteConfirmation
                :task-id="task.id"
                @confirm="handleDelete"
              />
            </td>
          </tr>
          <tr v-if="tasksForDate.length === 0">
            <td colspan="6" class="text-center px-4 py-4 text-gray-500">
              No hay actividades registradas
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
