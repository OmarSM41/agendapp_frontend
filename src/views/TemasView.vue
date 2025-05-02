<template>
  <div class="p-6 max-w-5xl mx-auto">
    <h1 class="text-3xl font-bold mb-6 text-amber-700">Gestión de Temas</h1>

    <!-- Crear tema -->
    <div class="bg-white rounded-xl shadow-md p-6 mb-10">
      <h2 class="text-xl font-semibold mb-4">Crear Nuevo Tema</h2>
      <div class="flex flex-col sm:flex-row gap-4">
        <input
          v-model="nuevoTema"
          type="text"
          placeholder="Nombre del tema"
          class="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <input
          v-model="colorNuevoTema"
          type="color"
          class="w-16 h-10 rounded border cursor-pointer"
        />
        <button
          @click="crearTema"
          class="bg-amber-600 hover:bg-amber-700 text-white px-6 py-2 rounded-lg transition-all flex items-center gap-2"
        >
          <Plus class="w-5 h-5" /> Crear
        </button>
      </div>
    </div>

    <!-- Lista de temas -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="tema in temas"
        :key="tema.id"
        class="bg-white rounded-xl shadow-md p-5 flex flex-col justify-between"
      >
        <div>
          <h3 class="text-lg font-semibold text-gray-800 mb-2">Tema</h3>
          <div v-if="temaEditando === tema.id" class="space-y-2">
            <input
              v-model="nombreEditado"
              class="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input
              v-model="colorEditado"
              type="color"
              class="w-16 h-10 rounded border cursor-pointer"
            />
          </div>
          <div v-else>
            <p class="text-gray-700">{{ tema.nombre }}</p>
            <div class="w-full h-3 mt-3 rounded" :style="{ backgroundColor: tema.color }"></div>
          </div>
        </div>

        <div class="mt-4 flex justify-end gap-2">
          <template v-if="temaEditando === tema.id">
            <button
              @click="actualizarTema(tema.id)"
              class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-all flex items-center gap-1"
            >
              <Save class="w-4 h-4" /> Guardar
            </button>
            <button
              @click="cancelarEdicion"
              class="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-lg transition-all flex items-center gap-1"
            >
              <X class="w-4 h-4" /> Cancelar
            </button>
          </template>
          <template v-else>
            <button
              @click="editarTema(tema)"
              class="bg-yellow-400 hover:bg-yellow-500 text-white px-4 py-2 rounded-lg transition-all flex items-center gap-1"
            >
              <Pencil class="w-4 h-4" /> Editar
            </button>
            <button
              @click="eliminarTema(tema.id)"
              class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-all flex items-center gap-1"
            >
              <Trash2 class="w-4 h-4" /> Eliminar
            </button>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import Swal from 'sweetalert2'
import { Pencil, Trash2, Save, X, Plus } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/authStore'

interface Tema {
  id: number
  nombre: string
  color: string
}

const authStore = useAuthStore()
const usuarioId = authStore.id

const temas = ref<Tema[]>([])
const nuevoTema = ref('')
const colorNuevoTema = ref('#000000')

const temaEditando = ref<number | null>(null)
const nombreEditado = ref('')
const colorEditado = ref('#000000')

const fetchTemas = async () => {
  try {
    const response = await axios.get(`https://localhost:7062/api/tema/usuario/${usuarioId}`)
    temas.value = response.data
  } catch (error) {
    console.error('Error al obtener los temas', error)
    Swal.fire('Error', 'No se pudieron cargar los temas', 'error')
  }
}

const crearTema = async () => {
  if (!nuevoTema.value.trim()) {
    return Swal.fire('Advertencia', 'El nombre del tema es obligatorio', 'warning')
  }
  try {
    await axios.post('https://localhost:7062/api/tema', {
      nombre: nuevoTema.value,
      color: colorNuevoTema.value,
      usuarioId
    })
    nuevoTema.value = ''
    colorNuevoTema.value = '#000000'
    await fetchTemas()
    Swal.fire('Éxito', 'Tema creado correctamente', 'success')
  } catch (error: any) {
    const mensaje = error?.response?.data?.message || ''
    if (mensaje.toLowerCase().includes('ya existe un tema')) {
      Swal.fire('Nombre duplicado', 'Ya existe un tema con ese nombre.', 'error')
    } else {
      Swal.fire('Error', 'No se pudo crear el tema', 'error')
    }
  }
}

const editarTema = (tema: Tema) => {
  temaEditando.value = tema.id
  nombreEditado.value = tema.nombre
  colorEditado.value = tema.color
}

const cancelarEdicion = () => {
  temaEditando.value = null
  nombreEditado.value = ''
  colorEditado.value = '#000000'
}

const actualizarTema = async (id: number) => {
  if (!nombreEditado.value.trim()) {
    return Swal.fire('Advertencia', 'El nombre no puede estar vacío', 'warning')
  }
  try {
    await axios.put(`https://localhost:7062/api/tema/${id}`, {
      nombre: nombreEditado.value,
      color: colorEditado.value,
      usuarioId
    })
    cancelarEdicion()
    await fetchTemas()
    Swal.fire('Éxito', 'Tema actualizado correctamente', 'success')
  } catch (error: any) {
    const mensaje = error?.response?.data?.message || ''
    if (mensaje.toLowerCase().includes('ya existe un tema')) {
      Swal.fire('Nombre duplicado', 'Ya existe un tema con ese nombre.', 'error')
    } else {
      Swal.fire('Error', 'No se pudo actualizar el tema', 'error')
    }
  }
}

const eliminarTema = async (id: number) => {
  const { isConfirmed } = await Swal.fire({
    title: '¿Eliminar este tema?',
    text: 'Esta acción no se puede deshacer',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar',
  })

  if (!isConfirmed) return

  try {
    await axios.delete(`https://localhost:7062/api/tema/${id}`)
    await fetchTemas()
    Swal.fire('Eliminado', 'Tema eliminado correctamente', 'success')
  } catch (error) {
    Swal.fire('Error', 'No se pudo eliminar el tema.', 'error')
  }
}

onMounted(fetchTemas)
</script>
