<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold mb-4">CRUD de Temas</h1>

    <!-- Formulario para agregar o editar tema -->
    <form @submit.prevent="handleSubmit" class="mb-6">
      <div class="mb-4">
        <label class="block mb-1">Nombre del tema:</label>
        <input v-model="form.nombre" type="text" class="border p-2 w-full" required />
      </div>
      <div class="mb-4">
        <label class="block mb-1">Color del tema:</label>
        <input v-model="form.color" type="color" class="border p-2 w-16 h-10" required />
      </div>
      <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded">
        {{ isEditMode ? 'Actualizar Tema' : 'Crear Tema' }}
      </button>
      <button
        v-if="isEditMode"
        type="button"
        @click="cancelEdit"
        class="ml-2 bg-gray-500 text-white px-4 py-2 rounded"
      >
        Cancelar
      </button>
    </form>

    <!-- Listado de temas -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div v-for="tema in temas" :key="tema.id" class="border p-4 rounded shadow">
        <h2 class="text-xl font-semibold">{{ tema.nombre }}</h2>
        <div class="w-8 h-8 my-2" :style="{ backgroundColor: tema.color }"></div>

        <button @click="editTema(tema)" class="bg-yellow-400 text-white px-2 py-1 rounded mr-2">
          Editar
        </button>
        <button @click="deleteTema(tema.id)" class="bg-red-500 text-white px-2 py-1 rounded">
          Eliminar
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import axios from 'axios'

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

    const fetchTemas = async () => {
      try {
        const response = await axios.get('/api/tema')
        temas.value = response.data
      } catch (error) {
        console.error('Error al obtener los temas', error)
      }
    }

    const handleSubmit = async () => {
      if (isEditMode.value && editId.value !== null) {
        // Actualizar
        try {
          await axios.put(`/api/tema/${editId.value}`, form.value)
          await fetchTemas()
          resetForm()
        } catch (error) {
          console.error('Error al actualizar el tema', error)
        }
      } else {
        // Crear
        try {
          await axios.post('/api/tema', form.value)
          await fetchTemas()
          resetForm()
        } catch (error) {
          console.error('Error al crear el tema', error)
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
      if (confirm('¿Estás seguro de eliminar este tema?')) {
        try {
          await axios.delete(`/api/tema/${id}`)
          await fetchTemas()
        } catch (error) {
          console.error('Error al eliminar el tema', error)
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
  }
})
</script>

