<template>
  <div class="p-6 max-w-5xl mx-auto">
    <h1 class="text-3xl font-bold mb-6 text-indigo-700">Gestión de Temas</h1>

    <!-- Formulario -->
    <div class="bg-white rounded-xl shadow-md p-6 mb-10">
      <h2 class="text-xl font-semibold mb-4">
        {{ isEditMode ? 'Editar Tema' : 'Crear Nuevo Tema' }}
      </h2>
      <form @submit.prevent="handleSubmit" class="grid gap-4 md:grid-cols-2">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Nombre del tema</label>
          <input v-model="form.nombre" type="text"
            class="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Ej. Matemáticas" required />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Color</label>
          <input v-model="form.color" type="color" class="w-16 h-10 rounded border cursor-pointer" required />
        </div>
        <div class="col-span-2 flex gap-4 mt-2">
          <button type="submit"
            class="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg transition-all">
            {{ isEditMode ? 'Actualizar Tema' : 'Crear Tema' }}
          </button>
          <button v-if="isEditMode" type="button" @click="cancelEdit"
            class="bg-gray-400 hover:bg-gray-500 text-white px-6 py-2 rounded-lg transition-all">
            Cancelar
          </button>
        </div>
      </form>
    </div>

    <!-- Lista de Temas -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="tema in temas" :key="tema.id" class="bg-white rounded-xl shadow-md p-5 flex flex-col justify-between">
        <div>
          <h3 class="text-lg font-semibold text-gray-800">{{ tema.nombre }}</h3>
          <div class="w-full h-3 mt-3 rounded" :style="{ backgroundColor: tema.color }"></div>
        </div>

        <!-- Asegúrate de tener esto en tu componente, dentro del <template> -->

        <div class="mt-4 flex justify-end gap-2">
          <!-- Botón Editar -->
          <button @click="editTema(tema)"
            class="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-white text-sm px-4 py-2 rounded-lg transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24"
              stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.5-9.5a2.121 2.121 0 013 3L12 17H9v-3l8.5-8.5z" />
            </svg>
            Editar
          </button>

          <!-- Botón Eliminar -->
          <button @click="deleteTema(tema.id)"
            class="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white text-sm px-4 py-2 rounded-lg transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24"
              stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7h6m2 0a2 2 0 012 2v0a2 2 0 01-2 2H7a2 2 0 01-2-2v0a2 2 0 012-2h10z" />
            </svg>
            Eliminar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import axios from 'axios'
import { useAuthStore } from '@/stores/authStore'
import Swal from 'sweetalert2'

interface Tema {
  id: number
  nombre: string
  color: string
}

interface TemaForm {
  nombre: string
  color: string
}

export default defineComponent({
  name: 'TemasView',
  setup() {
    const temas = ref<Tema[]>([])
    const form = ref<TemaForm>({ nombre: '', color: '#000000' })
    const isEditMode = ref(false)
    const editId = ref<number | null>(null)
    const authStore = useAuthStore()
    const usuarioId = authStore.id

    const fetchTemas = async () => {
      try {
        const Temaresponse = await axios.get(`https://localhost:7062/api/tema/usuario/${usuarioId}`)
        temas.value = Temaresponse.data
        Swal.fire({
          icon: 'success',
          title: 'Temas cargados',
          showConfirmButton: false,
          timer: 1500,
        })
      } catch (error) {
        console.error('Error al obtener los temas', error)
        Swal.fire({
          icon: 'error',
          title: 'Error al cargar temas',
          text: 'Verifica tu conexión o intenta más tarde',
        })
      }
    }

    const handleSubmit = async () => {
      if (isEditMode.value && editId.value !== null) {
        // Actualizar
        try {
          console.log(`✏️ Enviando actualización del tema ID ${editId.value}:`, form.value)
          const response = await axios.put(`https://localhost:7062/api/tema/${editId.value}`, {
            ...form.value,
            usuarioId,
          })
          console.log('✅ Respuesta al actualizar:', response.data)
          await fetchTemas()
          resetForm()
          Swal.fire({
            icon: 'success',
            title: 'Tema actualizado',
            showConfirmButton: false,
            timer: 1500,
          })
        } catch (error: any) {
          console.error('❌ Error al actualizar el tema:', error)

          const mensaje = error?.response?.data?.message || ''
          if (mensaje.toLowerCase().includes('ya existe un tema')) {
            Swal.fire({
              icon: 'error',
              title: 'Nombre duplicado',
              text: 'Ya existe un tema con ese nombre. Por favor elige otro.',
            })
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Error al actualizar tema',
              text: 'Ocurrió un problema al actualizar el tema.',
            })
          }
        }
      } else {
        // Crear
        try {
          console.log('📦 Enviando nuevo tema al servidor:', form.value)
          const response = await axios.post('https://localhost:7062/api/tema', {
            ...form.value,
            usuarioId, // Asegúrate de incluir el usuarioId si tu API lo necesita
          })
          console.log('✅ Respuesta al crear tema:', response.data)
          await fetchTemas()
          resetForm()
          Swal.fire({
            icon: 'success',
            title: 'Tema creado',
            showConfirmButton: false,
            timer: 1500,
          })
        } catch (error: any) {
          console.error('❌ Error al crear el tema:', error)

          const mensaje = error?.response?.data?.message || ''
          if (mensaje.toLowerCase().includes('ya existe un tema')) {
            Swal.fire({
              icon: 'error',
              title: 'Nombre duplicado',
              text: 'Ya existe un tema con ese nombre. Por favor elige otro.',
            })
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Error al crear tema',
              text: 'No se pudo guardar el tema.',
            })
          }
        }
      }
    }

    const editTema = (tema: Tema) => {
      form.value.nombre = tema.nombre
      form.value.color = tema.color
      isEditMode.value = true
      editId.value = tema.id
    }

    const cancelEdit = () => {
      resetForm()
    }

    const deleteTema = async (id: number) => {
      const confirmacion = await Swal.fire({
        title: '¿Eliminar este tema?',
        text: 'Esta acción no se puede deshacer',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
      })
      if (confirmacion.isConfirmed) {
        try {
          console.log(`🗑️ Enviando solicitud para eliminar tema ID ${id}...`)
          const response = await axios.delete(`https://localhost:7062/api/tema/${id}`)
          console.log('✅ Respuesta al eliminar tema:', response.data)
          await fetchTemas()
          Swal.fire({
            icon: 'success',
            title: 'Tema eliminado',
            showConfirmButton: false,
            timer: 1500
          });
        } catch (error) {
          console.error('❌ Error al eliminar el tema:', error)
          Swal.fire({
            icon: 'error',
            title: 'Error al eliminar',
            text: 'No se pudo eliminar el tema.',
          });
        }
      }
    }

    const resetForm = () => {
      form.value = { nombre: '', color: '#000000' }
      isEditMode.value = false
      editId.value = null
    }

    onMounted(() => {
      fetchTemas()
    })

    return {
      temas,
      form,
      isEditMode,
      handleSubmit,
      editTema,
      cancelEdit,
      deleteTema,
    }
  },
})
</script>
