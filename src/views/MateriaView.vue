<template>
  <div class="p-6 max-w-7xl mx-auto">
    <h1 class="text-4xl font-bold mb-10 text-amber-700 text-center">Gestión de Materias</h1>

    <!-- Crear Materia -->
    <section class="bg-white rounded-2xl shadow-md p-8 mb-14 border border-gray-200">
      <h2 class="text-2xl font-semibold mb-6 text-gray-800">Crear Nueva Materia</h2>
      <div class="grid md:grid-cols-3 sm:grid-cols-2 gap-4">
        <input v-model="nuevaMateria.nombre" type="text" placeholder="Nombre de la materia" class="input-field" />
        <input v-model="nuevaMateria.color" type="color" class="h-10 w-full rounded-lg border cursor-pointer" />
        <input v-model="nuevaMateria.semestre" type="text" placeholder="Semestre" class="input-field" />
      </div>
      <div class="mt-6 flex justify-end" v-if="authStore.isLoggedIn">
        <button @click="crearMateria" class="btn-primary">
          <Plus class="w-5 h-5" /> Crear Materia
        </button>
      </div>
    </section>

    <!-- Lista de Materias -->
    <section class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="materia in materias" :key="materia.id" class="bg-white rounded-2xl shadow p-6 border border-gray-200 flex flex-col justify-between">
        <div>
          <h3 class="text-xl font-bold text-gray-800 mb-4">{{ materia.nombre }}</h3>

          <div v-if="materiaEditando === materia.id" class="space-y-3">
            <input v-model="materiaEditada.nombre" class="input-field w-full" placeholder="Nombre" />
            <input v-model="materiaEditada.color" type="color" class="w-full h-10 rounded border cursor-pointer" />
            <input v-model="materiaEditada.semestre" class="input-field w-full" placeholder="Semestre" />
          </div>

          <div v-else class="space-y-2 text-sm text-gray-600">
            <div class="flex items-center gap-2">
              <span class="font-medium">Color:</span>
              <div class="w-5 h-5 rounded-full border" :style="{ backgroundColor: materia.color }" />
            </div>
            <p>📘 Semestre: <strong>{{ materia.semestre }}</strong></p>
          </div>
        </div>

        <div class="mt-5 flex justify-end gap-2 flex-wrap">
          <template v-if="authStore.isLoggedIn && materiaEditando === materia.id">
            <button @click="actualizarMateria(materia.id)" class="btn-success">
              <Save class="w-4 h-4" /> Guardar
            </button>
            <button @click="cancelarEdicion" class="btn-secondary">
              <X class="w-4 h-4" /> Cancelar
            </button>
          </template>
          <template v-else-if="authStore.isLoggedIn">
            <button @click="editarMateria(materia)" class="btn-warning">
              <Pencil class="w-4 h-4" /> Editar
            </button>
            <button @click="eliminarMateria(materia.id)" class="btn-danger">
              <Trash2 class="w-4 h-4" /> Eliminar
            </button>
          </template>
        </div>
      </div>
    </section>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import Swal from 'sweetalert2'
import { Plus, Save, X, Pencil, Trash2 } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/authStore'

interface Materia {
  id: number
  nombre: string
  color: string
  semestre: string
}

const authStore = useAuthStore()
const materias = ref<Materia[]>([])

const nuevaMateria = ref({
  nombre: '',
  color: '#000000',
  semestre: ''
})

const materiaEditando = ref<number | null>(null)
const materiaEditada = ref<Materia>({
  id: 0,
  nombre: '',
  color: '#000000',
  semestre: ''
})

const fetchMaterias = async () => {
  const res = await axios.get('https://localhost:7062/api/materia')
  materias.value = res.data
}

const crearMateria = async () => {
  if (!authStore.isLoggedIn) {
    return Swal.fire('Acceso denegado', 'Debes iniciar sesión para crear materias', 'error')
  }
  const { nombre, semestre } = nuevaMateria.value
  if (!nombre.trim() || !semestre.trim()) {
    return Swal.fire('Advertencia', 'Todos los campos son obligatorios', 'warning')
  }

  try {
    await axios.post('https://localhost:7062/api/materia', nuevaMateria.value)
    await fetchMaterias()
    Swal.fire('Éxito', 'Materia creada correctamente', 'success')
    nuevaMateria.value = { nombre: '', color: '#000000', semestre: '' }
  } catch {
    Swal.fire('Error', 'No se pudo crear la materia', 'error')
  }
}

const editarMateria = (materia: Materia) => {
  if (!authStore.isLoggedIn) {
    return Swal.fire('Acceso denegado', 'Debes iniciar sesión para editar materias', 'error')
  }
  materiaEditando.value = materia.id
  materiaEditada.value = { ...materia }
}

const cancelarEdicion = () => {
  materiaEditando.value = null
  materiaEditada.value = { id: 0, nombre: '', color: '#000000', semestre: '' }
}

const actualizarMateria = async (id: number) => {
  try {
    await axios.put(`https://localhost:7062/api/materia/${id}`, materiaEditada.value)
    await fetchMaterias()
    cancelarEdicion()
    Swal.fire('Éxito', 'Materia actualizada', 'success')
  } catch {
    Swal.fire('Error', 'No se pudo actualizar la materia', 'error')
  }
}

const eliminarMateria = async (id: number) => {
  const confirm = await Swal.fire({
    title: '¿Eliminar materia?',
    text: 'Esta acción no se puede deshacer',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  })
  if (!confirm.isConfirmed) return

  try {
    await axios.delete(`https://localhost:7062/api/materia/${id}`)
    await fetchMaterias()
    Swal.fire('Eliminado', 'Materia eliminada correctamente', 'success')
  } catch {
    Swal.fire('Error', 'No se pudo eliminar la materia', 'error')
  }
}

onMounted(fetchMaterias)
</script>

<style scoped>

</style>
