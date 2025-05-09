<script setup lang="ts">
import Swal from 'sweetalert2'
import { Eye as IconEye } from 'lucide-vue-next'


const props = defineProps({
  task: Object,
  temas: Array,
  grupos: Array
})

const viewDetails = () => {
  const tema = props.temas.find(t => t.id === props.task.temaId)
  const grupo = props.grupos.find(g => g.id === props.task.grupoId)

  Swal.fire({
    title: 'Detalles de la Tarea',
    html: `
      <p><strong>Tema:</strong> ${tema?.nombre || 'No asignado'}</p>
      <p><strong>Descripción:</strong> ${props.task.descripcion || 'No asignado'}</p>
      <p><strong>Tarea:</strong> ${props.task.actividad || 'No asignado'}</p>
      <p><strong>Hora:</strong> ${props.task.hora || 'No asignado'} - ${props.task.horaFin || 'No asignado'}</p>
      <p><strong>Lugar:</strong> ${props.task.lugar || 'No asignado'}</p>
      <p><strong>Grupo:</strong> ${grupo?.nombre || 'No asignado'}</p>
    `,
    icon: 'info',
    confirmButtonText: 'Cerrar',
    confirmButtonColor: '#4F46E5',
  })
}
</script>

<template>
  <button
    @click="viewDetails"
    class="bg-indigo-500 hover:bg-indigo-600 text-white rounded px-2 py-1"
    title="Ver detalles"
  >
    <IconEye class="w-4 h-4" />
  </button>
</template>
