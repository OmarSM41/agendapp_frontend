<script setup lang="ts">
import Swal from 'sweetalert2'
import axios from 'axios'
import { Trash2Icon } from 'lucide-vue-next'

const props = defineProps({
  taskId: Number
})

const emit = defineEmits(['confirm'])

const confirmDelete = async () => {
  const result = await Swal.fire({
    title: '¿Eliminar tarea?',
    text: 'Esta acción no se puede deshacer',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar',
    confirmButtonColor: '#d33',
    cancelButtonColor: '#aaa',
  })

  if (!result.isConfirmed) return

  try {
    await axios.delete(`https://localhost:7062/api/Horario/${props.taskId}`)
    emit('confirm', props.taskId)

    Swal.fire({
      title: '¡Eliminado!',
      text: 'La tarea fue eliminada correctamente',
      icon: 'success',
      confirmButtonColor: '#4F46E5'
    })
  } catch (error) {
    Swal.fire({
      title: 'Error',
      text: 'No se pudo eliminar la tarea',
      icon: 'error',
      confirmButtonColor: '#DC2626'
    })
  }
}
</script>

<template>
  <button
    @click="confirmDelete"
    class="bg-red-500 hover:bg-red-600 text-white rounded px-2 py-1"
    title="Eliminar"
  >
    <Trash2Icon class="w-4 h-4" />
  </button>
</template>
