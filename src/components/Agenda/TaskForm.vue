<script setup lang="ts">
import { ref } from 'vue'
import Swal from 'sweetalert2'
import axios from 'axios'
import { useAuthStore } from '@/stores/authStore'

const authStore = useAuthStore()
const props = defineProps({
  date: String,
  temas: Array,
  grupos: Array
})

const emit = defineEmits(['task-created'])

const saveTask = async () => {
  const temasOptions = props.temas
    .map(t => `<option value="${t.id}">${t.nombre}</option>`)
    .join('')
  const gruposOptions = props.grupos
    .map(g => `<option value="${g.id}">${g.nombre}</option>`)
    .join('')

    const { isConfirmed, value: formValues } = await Swal.fire({
    title: 'Crear nueva actividad',
    html: `
    <style>
      .swal2-form-container {
        display: flex;
        flex-direction: column;
        gap: 12px;
        text-align: left;
        max-width: 100%;
      }

      .swal2-form-group {
        display: flex;
        flex-direction: column;
        gap: 6px;
      }

      .swal2-form-group label {
        font-weight: 600;
        font-size: 14px;
      }

      .swal2-input,
      .swal2-select,
      .swal2-textarea {
        width: 80%;
        box-sizing: border-box;
        font-size: 14px;
      }

      @media (min-width: 600px) {
        .swal2-form-container {
          flex-direction: row;
          flex-wrap: wrap;
          gap: 20px;
        }

        .swal2-form-group {
          width: 36%;
        }

        .swal2-form-group.full-width {
          width: 100%;
        }
      }
    </style>

    <div class="swal2-form-container">
      <div class="swal2-form-group">
        <label for="hora">Hora de Incio<span style="color:red">*</span></label>
        <input id="hora" type="time" min="07:00" max="22:00" class="swal2-input" value="07:00">
      </div>
      <div class="swal2-form-group">
      <label for="hora">Hora de Fin<span style="color:red">*</span></label>
      <input id="horaFin" type="time" min="07:00" max="22:00" class="swal2-input" value="07:00">
      </div>

      <div class="swal2-form-group">
        <label for="temaId">Tema <span style="color:red">*</span></label>
        <select id="temaId" class="swal2-select">
          <option value="">Seleccione un tema</option>
          ${temasOptions}
        </select>
      </div>

      <div class="swal2-form-group full-width">
        <label for="descripcion">Descripción</label>
        <textarea id="descripcion" class="swal2-textarea" placeholder="Descripción breve (opcional)"></textarea>
      </div>

      <div class="swal2-form-group">
        <label for="tarea">Tarea <span style="color:red">*</span></label>
        <input id="tarea" class="swal2-input" placeholder="Título de la tarea">
      </div>

      <div class="swal2-form-group">
        <label for="lugar">Lugar <span style="color:red">*</span></label>
        <input id="lugar" class="swal2-input" placeholder="Edificio y salón">
      </div>

      <div class="swal2-form-group">
        <label for="grupoId">Grupo <span style="color:red">*</span></label>
        <select id="grupoId" class="swal2-select">
          <option value="">Seleccione un grupo</option>
          ${gruposOptions}
        </select>
      </div>
    </div>
  `,

    focusConfirm: false,
    showCancelButton: true,
    confirmButtonText: 'Guardar',
    cancelButtonText: 'Cancelar',
    confirmButtonColor: '#4F46E5',
    cancelButtonColor: '#6B7280',
    preConfirm: () => {
      const getValue = (selector) =>
        (
          Swal.getPopup()?.querySelector(selector) as HTMLInputElement | HTMLSelectElement
        )?.value?.trim()
      const hora = getValue('#hora')
      const horaFin = getValue('#horaFin')
      const temaId = parseInt(getValue('#temaId') || '')
      const descripcion = getValue('#descripcion')
      const tarea = getValue('#tarea')
      const lugar = getValue('#lugar')
      const grupoId = parseInt(getValue('#grupoId') || '')
      if (!hora || !horaFin || !temaId || !tarea || !lugar || !grupoId) {
        Swal.showValidationMessage('Completa todos los campos obligatorios')
        return null
      }

      if (hora < '07:00' || hora > '21:40' || horaFin < '07:00' || horaFin > '21:40') {
        Swal.showValidationMessage('La hora debe estar entre 07:00 y 21:40')
        return null
      }

      if (horaFin <= hora) {
        Swal.showValidationMessage('La hora de fin debe ser mayor que la hora de inicio')
        return null
      }

      return { hora, horaFin, temaId, descripcion, tarea, lugar, grupoId }
    }
  })

  if (!isConfirmed || !formValues) return

  try {
    const response = await axios.post('https://localhost:7062/api/Horario', {
      fecha: `${props.date}T${formValues.hora}`,
      fechaFin: `${props.date}T${formValues.horaFin}`,
      descripcion: formValues.descripcion,
      tarea: formValues.tarea,
      edificio: formValues.lugar,
      grupoId: formValues.grupoId,
      temaId: formValues.temaId,
      usuarioId: authStore.id
    })

    emit('task-created', {
      id: response.data.id,
      fecha: props.date,
      hora: formValues.hora,
      horaFin: formValues.horaFin,
      temaId: formValues.temaId,
      grupoId: formValues.grupoId,
      actividad: formValues.tarea,
      descripcion: formValues.descripcion,
      lugar: formValues.lugar
    })

    Swal.fire({
      icon: 'success',
      title: '¡Guardado!',
      text: 'La tarea fue creada con éxito',
      confirmButtonColor: '#4F46E5'
    })
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'No se pudo guardar la tarea',
      confirmButtonColor: '#DC2626'
    })
  }
}
</script>

<template>
  <button
    @click="saveTask"
    class="bg-amber-600 hover:bg-amber-700 text-white font-medium py-2 px-4 rounded-lg shadow flex items-center gap-2"
  >
    <IconPlus class="w-5 h-5" />
    Agregar Actividad
  </button>
</template>
