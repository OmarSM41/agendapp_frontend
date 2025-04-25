<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold mb-4">Agenda del Profesor</h1>

    <div class="overflow-x-auto">
      <table class="min-w-full table-auto border-collapse">
        <thead>
          <tr>
            <th class="border p-2 w-24">Hora</th>
            <th v-for="dia in dias" :key="dia" class="border p-2 text-center">
              {{ dia }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="hora in horas" :key="hora">
            <td class="border p-2 text-sm font-medium">{{ hora }}</td>
            <td v-for="dia in dias" :key="dia" class="border p-2 h-16">
              <div class="relative h-full">
                <div
                  v-if="tareas[dia] && tareas[dia][hora]"
                  class="bg-orange-200 rounded p-2 text-sm h-full flex flex-col justify-between"
                >
                  <span>{{ tareas[dia][hora].tema }}</span>
                  <div class="flex justify-end space-x-2 mt-2 text-xs">
                    <button @click="verDetalles(dia, hora)" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                      Ver
                    </button>
                    <button
                      @click="confirmarEliminacion(() => eliminarTarea(dia, hora))"
                      class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
                <button
                  v-else
                  @click="abrirModal(dia, hora)"
                  class="text-sm text-gray-500 hover:text-gray-700 w-full h-full"
                >
                  + Añadir tarea
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal para crear tarea -->
    <div
      v-if="modalAbierto"
      class="fixed inset-0 bg-gray-950/50 flex items-center justify-center z-50"
    >
      <div class="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
        <h2 class="text-lg font-semibold mb-4 text-center">Agregar Tarea</h2>

        <div class="space-y-4">
          <input
            v-model="formTarea.tema"
            type="text"
            placeholder="Tema"
            class="border w-full p-2 rounded"
          />
          <textarea
            v-model="formTarea.descripcion"
            placeholder="Descripción"
            class="border w-full p-2 h-20 rounded resize-none"
          ></textarea>
          <input
            v-model="formTarea.tarea"
            type="text"
            placeholder="Tarea"
            class="border w-full p-2 rounded"
          />
          <textarea
            v-model="formTarea.actividades"
            placeholder="Actividades"
            class="border w-full p-2 h-20 rounded resize-none"
          ></textarea>
          <input
            v-model="formTarea.lugar"
            type="text"
            placeholder="Lugar de la universidad"
            class="border w-full p-2 rounded"
          />
          <input
            v-model="formTarea.grupo"
            type="text"
            placeholder="Grupo"
            class="border w-full p-2 rounded"
          />
        </div>

        <div class="flex justify-center space-x-4 mt-6">
          <button
            @click="guardarTarea"
            class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Guardar
          </button>
          <button
            @click="modalAbierto = false"
            class="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>

    <!-- Modal de Detalles -->
<div v-if="modalDetallesAbierto" class="fixed inset-0 bg-gray-950/50 flex items-center justify-center z-50">
  <div class="bg-white p-6 rounded-lg shadow-lg max-w-md w-full text-left">
    <h2 class="text-lg font-semibold mb-4 text-center">Detalles de la Tarea</h2>
    <div class="space-y-2 text-sm">
      <p><strong>Tema:</strong> {{ detalleActual?.tema }}</p>
      <p><strong>Descripción:</strong><br/> {{ detalleActual?.descripcion }}</p>
      <p><strong>Tarea:</strong> {{ detalleActual?.tarea }}</p>
      <p><strong>Actividades:</strong><br/> {{ detalleActual?.actividades }}</p>
      <p><strong>Lugar:</strong> {{ detalleActual?.lugar }}</p>
      <p><strong>Grupo:</strong> {{ detalleActual?.grupo }}</p>
    </div>
    <div class="flex justify-center mt-6">
      <button @click="modalDetallesAbierto = false" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
        Cerrar
      </button>
    </div>
  </div>
</div>


    <!-- Modal de confirmación -->
    <div
      v-if="mostrarConfirmacion"
      class="fixed inset-0 bg-gray-950/50 flex items-center justify-center z-50"
    >
      <div class="bg-white p-6 rounded-lg shadow-lg text-center max-w-sm w-full">
        <h2 class="text-lg font-semibold mb-4">¿Eliminar tarea?</h2>
        <p class="mb-6">Esta acción no se puede deshacer.</p>
        <div class="flex justify-center space-x-4">
          <button
            @click="
              () => {
                onConfirmarEliminacion()
                mostrarConfirmacion = false
              }
            "
            class="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
          >
            Eliminar
          </button>
          <button
            @click="mostrarConfirmacion = false"
            class="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, watch } from 'vue'

interface DetalleTarea {
  tema: string
  descripcion: string
  tarea: string
  actividades: string
  lugar: string
  grupo: string
}

export default defineComponent({
  setup() {
    const dias = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']
    const horas = [
      '07:00 - 7:50',
      '07:50 - 8:40',
      '08:40 - 9:30',
      '10:00 - 10:50',
      '10:50 - 11:40',
      '11:40 - 12:30',
      '12:50 - 13:40',
      '13:40 - 14:30',
      '14:30 - 15:20',
      '15:20 - 16:10',
      '16:40 - 17:30',
      '17:30 - 18:20',
      '18:20 - 19:10',
      '19:10 - 20:00',
      '20:00 - 20:50',
      '20:50 - 21:40',
    ]

    const tareas = ref<Record<string, Record<string, DetalleTarea>>>({})

    const modalAbierto = ref(false)
    const modalDia = ref('')
    const modalHora = ref('')
    const formTarea = ref<DetalleTarea>({
      tema: '',
      descripcion: '',
      tarea: '',
      actividades: '',
      lugar: '',
      grupo: '',
    })

    const modalDetallesAbierto = ref(false)
const detalleActual = ref<DetalleTarea | null>(null)

const verDetalles = (dia: string, hora: string) => {
  detalleActual.value = tareas.value[dia][hora]
  modalDetallesAbierto.value = true
}

    const mostrarConfirmacion = ref(false)
    const onConfirmarEliminacion = ref<() => void>(() => {})

    const guardarTareasEnLocalStorage = () => {
      localStorage.setItem('agendaTareas', JSON.stringify(tareas.value))
    }

    onMounted(() => {
      const datos = localStorage.getItem('agendaTareas')
      if (datos) {
        tareas.value = JSON.parse(datos)
      }
    })

    watch(tareas, guardarTareasEnLocalStorage, { deep: true })

    const abrirModal = (dia: string, hora: string) => {
      modalDia.value = dia
      modalHora.value = hora
      const tareaExistente = tareas.value[dia]?.[hora]
      formTarea.value = tareaExistente
        ? { ...tareaExistente }
        : {
            tema: '',
            descripcion: '',
            tarea: '',
            actividades: '',
            lugar: '',
            grupo: '',
          }
      modalAbierto.value = true
    }

    const guardarTarea = () => {
      if (!tareas.value[modalDia.value]) {
        tareas.value[modalDia.value] = {}
      }
      tareas.value[modalDia.value][modalHora.value] = { ...formTarea.value }
      modalAbierto.value = false
    }

    const confirmarEliminacion = (callback: () => void) => {
      onConfirmarEliminacion.value = callback
      mostrarConfirmacion.value = true
    }

    const eliminarTarea = (dia: string, hora: string) => {
      if (tareas.value[dia] && tareas.value[dia][hora]) {
        delete tareas.value[dia][hora]
        if (Object.keys(tareas.value[dia]).length === 0) {
          delete tareas.value[dia]
        }
      }
    }

    return {
      dias,
      horas,
      tareas,
      modalAbierto,
      modalDia,
      modalHora,
      formTarea,
      abrirModal,
      guardarTarea,
      eliminarTarea,
      verDetalles,
      mostrarConfirmacion,
      confirmarEliminacion,
      onConfirmarEliminacion,
      modalDetallesAbierto,
      detalleActual
    }
  },
})
</script>
