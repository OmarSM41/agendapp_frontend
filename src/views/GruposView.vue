<template>
  <div class="p-6 max-w-5xl mx-auto">
    <h1 class="text-3xl font-bold mb-6 text-amber-700">Gestión de Grupos</h1>

    <!-- Crear grupo -->
    <div class="bg-white rounded-xl shadow-md p-6 mb-10">
      <h2 class="text-xl font-semibold mb-4">Crear Nuevo Grupo</h2>
      <div class="flex flex-col sm:flex-row gap-4">
        <input
          v-model="nuevoGrupo"
          type="text"
          placeholder="Nombre del grupo"
          class="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          @click="crearGrupo"
          class="bg-amber-600 hover:bg-amber-700 text-white px-6 py-2 rounded-lg transition-all flex items-center gap-2"
        >
          <Plus class="w-5 h-5" /> Crear
        </button>
      </div>
    </div>

    <!-- Lista de Grupos -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="grupo in grupos"
        :key="grupo.id"
        class="bg-white rounded-xl shadow-md p-5 flex flex-col justify-between"
      >
        <div>
          <h3 class="text-lg font-semibold text-gray-800 mb-2">Grupo #{{ grupo.id }}</h3>
          <div v-if="grupoEditando === grupo.id">
            <input
              v-model="nombreEditado"
              class="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div v-else>
            <p class="text-gray-700">{{ grupo.nombre }}</p>
          </div>
        </div>

        <!-- Acciones -->
        <div class="mt-4 flex justify-end gap-2">
          <template v-if="grupoEditando === grupo.id">
            <button
              @click="actualizarGrupo(grupo.id)"
              class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-all flex items-center gap-1"
            >
              <Save class="w-4 h-4" /> Guardar
            </button>
            <button
              @click="grupoEditando = null"
              class="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-lg transition-all flex items-center gap-1"
            >
              <X class="w-4 h-4" /> Cancelar
            </button>
          </template>
          <template v-else>
            <button
              @click="editarGrupo(grupo)"
              class="bg-yellow-400 hover:bg-yellow-500 text-white px-4 py-2 rounded-lg transition-all flex items-center gap-1"
            >
              <Pencil class="w-4 h-4" /> Editar
            </button>
            <button
              @click="eliminarGrupo(grupo.id)"
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

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'
import Swal from 'sweetalert2'
import { Pencil, Trash2, Save, X, Plus } from 'lucide-vue-next'

const grupos = ref([])
const nuevoGrupo = ref('')
const grupoEditando = ref<number | null>(null)
const nombreEditado = ref('')

const cargarGrupos = async () => {
  try {
    const response = await axios.get('https://localhost:7062/api/Grupo')
    grupos.value = response.data
  } catch (error) {
    console.error('Error al cargar grupos:', error)
    Swal.fire('Error', 'No se pudieron cargar los grupos', 'error')
  }
}

const crearGrupo = async () => {
  if (!nuevoGrupo.value.trim()) {
    return Swal.fire('Advertencia', 'El nombre del grupo es requerido', 'warning')
  }
  try {
    await axios.post('https://localhost:7062/api/Grupo', { nombre: nuevoGrupo.value })
    nuevoGrupo.value = ''
    await cargarGrupos()
    Swal.fire('Éxito', 'Grupo creado correctamente', 'success')
  } catch (error: any) {
    console.error('Error al crear grupo:', error.response?.data)
    Swal.fire('Error', error.response?.data?.message || 'Error al crear grupo', 'error')
  }
}

const eliminarGrupo = async (id: number) => {
  const result = await Swal.fire({
    title: '¿Eliminar grupo?',
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
    await axios.delete(`https://localhost:7062/api/Grupo/${id}`)
    await cargarGrupos()
    Swal.fire('Eliminado', 'Grupo eliminado correctamente', 'success')
  } catch (error: any) {
    console.error('Error al eliminar grupo:', error.response?.data)
    Swal.fire('Error', error.response?.data?.message || 'Error al eliminar grupo', 'error')
  }
}

const editarGrupo = (grupo: any) => {
  grupoEditando.value = grupo.id
  nombreEditado.value = grupo.nombre
}

const actualizarGrupo = async (id: number) => {
  if (!nombreEditado.value.trim()) {
    return Swal.fire('Advertencia', 'El nombre no puede estar vacío', 'warning')
  }
  try {
    await axios.put(`https://localhost:7062/api/Grupo/${id}`, { nombre: nombreEditado.value })
    grupoEditando.value = null
    nombreEditado.value = ''
    await cargarGrupos()
    Swal.fire('Éxito', 'Grupo actualizado correctamente', 'success')
  } catch (error: any) {
    console.error('Error al actualizar grupo:', error.response?.data)
    Swal.fire('Error', error.response?.data?.message || 'Error al actualizar grupo', 'error')
  }
}

onMounted(() => {
  cargarGrupos()
})
</script>
