<template>
  <div class="p-6 max-w-5xl mx-auto">
    <h1 class="text-3xl font-bold mb-6 text-amber-700">Gestión de Temas</h1>

    <!-- Crear tema -->
    <div class="bg-white rounded-xl shadow-md p-6 mb-10">
      <h2 class="text-xl font-semibold mb-4">Crear Nuevo Tema</h2>
      <div class="flex flex-col gap-4">
        <input v-model="nuevoTema" type="text" placeholder="Nombre del tema" class="input" />
        <input v-model="unidadNuevoTema" type="text" placeholder="Unidad" class="input" />

        <!-- Select de materias -->
        <select v-model.number="materiaIdNuevoTema" class="input">
          <option disabled value="0">Selecciona una materia</option>
          <option v-for="materia in materias" :key="materia.id" :value="materia.id">
            {{ materia.nombre }}
          </option>
        </select>

        <input v-model="colorNuevoTema" type="color" class="w-16 h-10 rounded border cursor-pointer" />
        <button @click="crearTema" class="btn-create">
          <Plus class="w-5 h-5" /> Crear
        </button>
      </div>
    </div>

    <!-- Lista de temas -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="tema in temas" :key="tema.id" class="card">
        <div>
          <h3 class="text-lg font-semibold text-gray-800 mb-2">Tema</h3>
          <div v-if="temaEditando === tema.id" class="space-y-2">
            <input v-model="nombreEditado" class="input" />
            <input v-model="unidadEditada" class="input" />
            <select v-model.number="materiaIdEditado" class="input">
              <option disabled value="0">Selecciona una materia</option>
              <option v-for="materia in materias" :key="materia.id" :value="materia.id">
                {{ materia.nombre }}
              </option>
            </select>
            <input v-model="colorEditado" type="color" class="w-16 h-10 rounded border cursor-pointer" />
          </div>
          <div v-else>
            <p class="text-gray-700">{{ tema.nombre }}</p>
            <p class="text-gray-600 text-sm">Unidad: {{ tema.unidad }}</p>
            <p class="text-gray-600 text-sm">Materia: {{ getNombreMateria(tema.materiaId) }}</p>
            <div class="w-full h-3 mt-3 rounded" :style="{ backgroundColor: tema.color }"></div>
          </div>

          <!-- Actividades -->
          <div v-if="tema.actividades?.length" class="mt-4">
            <h4 class="text-sm font-medium text-gray-600 mb-1">Actividades:</h4>
            <ul class="list-disc list-inside text-sm text-gray-700 space-y-2">
              <li v-for="actividad in tema.actividades" :key="actividad.id" class="flex items-start justify-between gap-2">
                <div class="flex-1">
                  <template v-if="actividadEditandoId === actividad.id">
                    <textarea v-model="descripcionEditada" class="input text-sm"></textarea>
                  </template>
                  <template v-else>
                    <span>{{ actividad.descripcion }}</span>
                  </template>
                </div>
                <div class="flex gap-1 mt-1">
                  <template v-if="actividadEditandoId === actividad.id">
                    <button @click="guardarActividad(actividad)"><Save class="icon text-green-600" /></button>
                    <button @click="cancelarEdicionActividad"><X class="icon text-gray-500" /></button>
                  </template>
                  <template v-else>
                    <button @click="editarActividad(actividad)"><Pencil class="icon text-yellow-400" /></button>
                    <button @click="eliminarActividad(actividad.id)"><Trash2 class="icon text-red-500" /></button>
                  </template>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <!-- Botones tema -->
        <div class="mt-4 flex flex-wrap justify-end gap-2">
          <template v-if="temaEditando === tema.id">
            <button @click="actualizarTema(tema.id)" class="btn-green"><Save class="icon" /> Guardar</button>
            <button @click="cancelarEdicion" class="btn-gray"><X class="icon" /> Cancelar</button>
          </template>
          <template v-else>
            <button @click="editarTema(tema)" class="btn-yellow"><Pencil class="icon" /> Editar</button>
            <button @click="eliminarTema(tema.id)" class="btn-red"><Trash2 class="icon" /> Eliminar</button>
            <button @click="agregarActividad(tema.id)" class="btn-indigo"><Plus class="icon" /> Agregar Actividad</button>
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

interface Actividad {
  id: number
  descripcion: string
  temaId: number
  createdAt: string
  updatedAt: string
}

interface Tema {
  id: number
  nombre: string
  color: string
  unidad: string
  materiaId: number
  actividades?: Actividad[]
}

interface Materia {
  id: number
  nombre: string
}

const authStore = useAuthStore()
const usuarioId = authStore.id

const temas = ref<Tema[]>([])
const materias = ref<Materia[]>([])

const nuevoTema = ref('')
const unidadNuevoTema = ref('')
const materiaIdNuevoTema = ref(0)
const colorNuevoTema = ref('#000000')

const temaEditando = ref<number | null>(null)
const nombreEditado = ref('')
const unidadEditada = ref('')
const materiaIdEditado = ref(0)
const colorEditado = ref('#000000')

const actividadEditandoId = ref<number | null>(null)
const descripcionEditada = ref('')

const getNombreMateria = (materiaId: number) => {
  return materias.value.find(m => m.id === materiaId)?.nombre || `ID: ${materiaId}`
}

const fetchTemas = async () => {
  try {
    const response = await axios.get('https://localhost:7062/api/tema')
    const temasData: Tema[] = response.data

    const temasConActividades = await Promise.all(
      temasData.map(async (tema) => {
        const actividadesRes = await axios.get(`https://localhost:7062/api/Actividad/Tema/${tema.id}`)
        return { ...tema, actividades: actividadesRes.data }
      })
    )

    temas.value = temasConActividades
  } catch (error) {
    Swal.fire('Error', 'No se pudieron cargar los temas', 'error')
  }
}

const fetchMaterias = async () => {
  try {
    const response = await axios.get('https://localhost:7062/api/materia')
    materias.value = response.data
  } catch (error) {
    Swal.fire('Error', 'No se pudieron cargar las materias', 'error')
  }
}

const crearTema = async () => {
  if (!nuevoTema.value.trim() || !unidadNuevoTema.value.trim() || !materiaIdNuevoTema.value) {
    return Swal.fire('Advertencia', 'Todos los campos son obligatorios', 'warning')
  }
  try {
    await axios.post('https://localhost:7062/api/tema', {
      nombre: nuevoTema.value,
      color: colorNuevoTema.value,
      unidad: unidadNuevoTema.value,
      materiaId: materiaIdNuevoTema.value,
      usuarioId
    })
    nuevoTema.value = ''
    unidadNuevoTema.value = ''
    materiaIdNuevoTema.value = 0
    colorNuevoTema.value = '#000000'
    await fetchTemas()
    Swal.fire('Éxito', 'Tema creado correctamente', 'success')
  } catch (error: any) {
    const mensaje = error?.response?.data?.message || ''
    if (mensaje.toLowerCase().includes('ya existe')) {
      Swal.fire('Duplicado', mensaje, 'error')
    } else {
      Swal.fire('Error', 'No se pudo crear el tema', 'error')
    }
  }
}

const editarTema = (tema: Tema) => {
  temaEditando.value = tema.id
  nombreEditado.value = tema.nombre
  unidadEditada.value = tema.unidad
  materiaIdEditado.value = tema.materiaId
  colorEditado.value = tema.color
}

const cancelarEdicion = () => {
  temaEditando.value = null
  nombreEditado.value = ''
  unidadEditada.value = ''
  materiaIdEditado.value = 0
  colorEditado.value = '#000000'
}

const actualizarTema = async (id: number) => {
  if (!nombreEditado.value.trim() || !unidadEditada.value.trim() || !materiaIdEditado.value) {
    return Swal.fire('Advertencia', 'Todos los campos son obligatorios', 'warning')
  }
  try {
    await axios.put(`https://localhost:7062/api/tema/${id}`, {
      nombre: nombreEditado.value,
      color: colorEditado.value,
      unidad: unidadEditada.value,
      materiaId: materiaIdEditado.value,
      usuarioId
    })
    cancelarEdicion()
    await fetchTemas()
    Swal.fire('Éxito', 'Tema actualizado correctamente', 'success')
  } catch (error: any) {
    const mensaje = error?.response?.data?.message || ''
    if (mensaje.toLowerCase().includes('ya existe')) {
      Swal.fire('Duplicado', mensaje, 'error')
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
    cancelButtonText: 'Cancelar'
  })

  if (!isConfirmed) return

  try {
    await axios.delete(`https://localhost:7062/api/tema/${id}`)
    await fetchTemas()
    Swal.fire('Eliminado', 'Tema eliminado correctamente', 'success')
  } catch {
    Swal.fire('Error', 'No se pudo eliminar el tema.', 'error')
  }
}

const agregarActividad = async (temaId: number) => {
  const { value: descripcion } = await Swal.fire({
    title: 'Nueva Actividad',
    input: 'textarea',
    inputLabel: 'Descripción',
    inputPlaceholder: 'Describe la actividad...',
    showCancelButton: true,
    confirmButtonText: 'Guardar',
    cancelButtonText: 'Cancelar',
    inputValidator: (value) => {
      if (!value) return 'La descripción no puede estar vacía'
    },
  })

  if (!descripcion) return

  try {
    await axios.post('https://localhost:7062/api/Actividad', { descripcion, temaId })
    await fetchTemas()
    Swal.fire('Éxito', 'Actividad agregada correctamente', 'success')
  } catch {
    Swal.fire('Error', 'No se pudo agregar la actividad', 'error')
  }
}

const editarActividad = (actividad: Actividad) => {
  actividadEditandoId.value = actividad.id
  descripcionEditada.value = actividad.descripcion
}

const cancelarEdicionActividad = () => {
  actividadEditandoId.value = null
  descripcionEditada.value = ''
}

const guardarActividad = async (actividad: Actividad) => {
  if (!descripcionEditada.value.trim()) {
    return Swal.fire('Advertencia', 'La descripción no puede estar vacía', 'warning')
  }

  try {
    await axios.put(`https://localhost:7062/api/Actividad/${actividad.id}`, {
      descripcion: descripcionEditada.value,
      temaId: actividad.temaId
    })
    actividadEditandoId.value = null
    descripcionEditada.value = ''
    await fetchTemas()
    Swal.fire('Éxito', 'Actividad actualizada correctamente', 'success')
  } catch {
    Swal.fire('Error', 'No se pudo actualizar la actividad', 'error')
  }
}

const eliminarActividad = async (actividadId: number) => {
  const { isConfirmed } = await Swal.fire({
    title: '¿Eliminar esta actividad?',
    text: 'Esta acción no se puede deshacer',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  })

  if (!isConfirmed) return

  try {
    await axios.delete(`https://localhost:7062/api/Actividad/${actividadId}`)
    await fetchTemas()
    Swal.fire('Eliminada', 'Actividad eliminada correctamente', 'success')
  } catch {
    Swal.fire('Error', 'No se pudo eliminar la actividad', 'error')
  }
}

onMounted(async () => {
  await Promise.all([fetchTemas(), fetchMaterias()])
})
</script>
 