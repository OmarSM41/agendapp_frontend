  <script setup lang="ts">
  // Imports
  import { onMounted, ref } from 'vue'
  import FullCalendar from '@fullcalendar/vue3'
  import dayGridPlugin from '@fullcalendar/daygrid'
  import interactionPlugin from '@fullcalendar/interaction'
  import esLocale from '@fullcalendar/core/locales/es'
  import axios from 'axios'
  import { format, parseISO } from 'date-fns'
  import { es } from 'date-fns/locale'
  import { computed } from 'vue'
  import { useAuthStore } from '@/stores/authStore'
  import Swal from 'sweetalert2'
  import timeGridPlugin from '@fullcalendar/timegrid'
  import {
    CalendarDays as IconCalendarDays,
    ClipboardList as IconClipboardList,
    Plus as IconPlus,
    Eye as IconEye,
    X as IconX,
  } from 'lucide-vue-next'
  import { jsPDF } from 'jspdf'
  import html2pdf from 'html2pdf.js'


  const authStore = useAuthStore()

  // Variables
  const selectedDate = ref<string | null>(null)
  const selectedDay = ref('')
  const calendarRef = ref('')
  const tasks = ref([])
  const temas = ref([])
  const grupos = ref([])
  const fechaInicio = ref<string>('')
  const fechaFin = ref<string>('')
  const mostrarSelectorRango = ref(false)

  const currentUserId = authStore.id // Esto reemplaza tu const currentUserId = 1

  // Función para exportar a PDF
  const exportToPDF = async () => {
  try {
    // Mostrar diálogo para seleccionar semana
    const { value: weekNumber } = await Swal.fire({
      title: 'Seleccionar semana',
      html: `
        <div class="swal2-form-container">
          <div class="swal2-form-group">
            <label for="semana">Número de semana</label>
            <input id="semana" type="week" class="swal2-input">
          </div>
        </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Generar PDF',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#4F46E5',
      cancelButtonColor: '#6B7280',
      preConfirm: () => {
        return (document.getElementById('semana') as HTMLInputElement).value
      }
    })

    if (!weekNumber) return

    // Obtener fechas de inicio y fin de la semana seleccionada
    const [year, week] = weekNumber.split('-W')
    const fechaInicioSemana = new Date(year, 0, 1 + (week - 1) * 7)
    const fechaFinSemana = new Date(fechaInicioSemana)
    fechaFinSemana.setDate(fechaFinSemana.getDate() + 6) // 6 días después para completar la semana

    // Ajustar para que incluya solo días laborales (Lunes a Viernes)
    const fechaInicio = new Date(fechaInicioSemana)
    if (fechaInicio.getDay() === 0) fechaInicio.setDate(fechaInicio.getDate() + 1) // Si es domingo, empezar el lunes
    else if (fechaInicio.getDay() === 6) fechaInicio.setDate(fechaInicio.getDate() + 2) // Si es sábado, empezar el lunes

    const fechaFin = new Date(fechaFinSemana)
    if (fechaFin.getDay() === 0) fechaFin.setDate(fechaFin.getDate() - 2) // Si es domingo, terminar el viernes
    else if (fechaFin.getDay() === 6) fechaFin.setDate(fechaFin.getDate() - 1) // Si es sábado, terminar el viernes

    // Obtener eventos del calendario
    const calendar = calendarRef.value.getApi()
    const allEvents = calendar.getEvents()

    // Filtrar eventos por el rango seleccionado
    const events = allEvents.filter(event => {
      const eventDate = new Date(event.start)
      return eventDate >= fechaInicio && eventDate <= fechaFin
    })

    // Si no hay eventos, mostrar mensaje
    if (events.length === 0) {
      await Swal.fire({
        icon: 'info',
        title: 'No hay actividades',
        text: 'No hay actividades en la semana seleccionada',
        confirmButtonColor: '#4F46E5'
      })
      return
    }

    // Definir estructura de la tabla
    const daysOfWeek = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes']
    const timeSlots = [
      '07:00 - 08:00', '08:00 - 09:00', '09:00 - 10:00', '10:00 - 11:00',
      '11:00 - 12:00', '12:00 - 13:00', '13:00 - 14:00', '14:00 - 15:00',
      '15:00 - 16:00', '16:00 - 17:00', '17:00 - 18:00', '18:00 - 19:00',
      '19:00 - 20:00', '20:00 - 21:00', '21:00 - 21:40'
    ]

    // Crear estructura de datos para la tabla
    const tableData = {}
    timeSlots.forEach(time => {
      tableData[time] = {
        Lunes: '', Martes: '', Miércoles: '', Jueves: '', Viernes: ''
      }
    })

    // Llenar la tabla con los eventos
    events.forEach(event => {
      const dayName = format(event.start, 'EEEE', { locale: es })
      const formattedDay = dayName.charAt(0).toUpperCase() + dayName.slice(1)
      const timeRange = `${format(event.start, 'HH:mm')} - ${format(event.end, 'HH:mm')}`

      // Encontrar el slot de tiempo correspondiente
      const matchingSlot = timeSlots.find(slot => {
        const [slotStart] = slot.split(' - ')
        return timeRange.startsWith(slotStart)
      })

      if (matchingSlot && daysOfWeek.includes(formattedDay)) {
        // Obtener detalles extendidos del evento
        const extendedProps = event.extendedProps || {}
        const tema = temas.value.find(t => t.id === extendedProps.temaId)
        const grupo = grupos.value.find(g => g.id === extendedProps.grupoId)

        tableData[matchingSlot][formattedDay] = `
          <div style="margin: 3px 0; font-size: 10px; line-height: 1.3;">
            <strong style="font-size: 11px; display: block;">${event.title}</strong>
            ${tema ? `<span style="color: #4F46E5;">Tema:</span> ${tema.nombre}<br>` : ''}
            ${grupo ? `<span style="color: #4F46E5;">Grupo:</span> ${grupo.nombre}<br>` : ''}
            ${extendedProps.lugar ? `<span style="color: #4F46E5;">Lugar:</span> ${extendedProps.lugar}` : ''}
          </div>
        `
      }
    })

    // Generar HTML para la tabla
    let tableRows = ''
    timeSlots.forEach(time => {
      tableRows += `
        <tr>
          <td style="border: 1px solid #ddd; padding: 5px; font-weight: bold; font-size: 11px; width: 10%;">${time}</td>
          ${daysOfWeek.map(day => `
            <td style="border: 1px solid #ddd; padding: 5px; vertical-align: top; font-size: 10px;">${tableData[time][day] || '-'}</td>
          `).join('')}
        </tr>
      `
    })

    // Formatear fechas para mostrar
    const fechaInicioFormatted = format(fechaInicio, 'PPPP', { locale: es })
    const fechaFinFormatted = format(fechaFin, 'PPPP', { locale: es })

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; padding: 10px;">
        <h1 style="text-align: center; color: #4F46E5; margin-bottom: 5px; font-size: 16px;">Horario Semanal</h1>
        <p style="text-align: center; margin-bottom: 10px; font-size: 12px;">
          Semana del ${fechaInicioFormatted} al ${fechaFinFormatted}
        </p>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; font-size: 10px;">
          <thead>
            <tr style="background-color: #4F46E5; color: white;">
              <th style="border: 1px solid #ddd; padding: 8px; width: 10%;">Hora</th>
              ${daysOfWeek.map(day => `
                <th style="border: 1px solid #ddd; padding: 8px;">${day}</th>
              `).join('')}
            </tr>
          </thead>
          <tbody>
            ${tableRows}
          </tbody>
        </table>
        <p style="text-align: right; margin-top: 10px; font-size: 10px; color: #666;">
          Generado el ${format(new Date(), 'PPPP', { locale: es })}
        </p>
      </div>
    `

    // Configuración para html2pdf
    const options = {
      margin: 5,
      filename: `horario-semana-${weekNumber}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: {
        unit: 'mm',
        format: 'a4',
        orientation: 'landscape',
        hotfixes: ['px_scaling']
      }
    }

    // Generar el PDF
    html2pdf().from(htmlContent).set(options).save()

  } catch (error) {
    console.error('Error al generar PDF:', error)
    await Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'No se pudo generar el PDF',
      confirmButtonColor: '#DC2626'
    })
  }
}


  const viewTaskDetails = async (task) => {
    const grupoNombre = grupos.value.find((g) => g.id === task.grupoId)?.nombre || 'No asignado'
    const htmlContent = `
      <p><strong>Tema:</strong> ${task.tema || 'No asignado'}</p>
      <p><strong>Descripción:</strong> ${task.descripcion || 'No asignado'}</p>
      <p><strong>Tarea:</strong> ${task.actividad || 'No asignado'}</p>
      <p><strong>Hora:</strong> ${task.hora || 'No asignado'} - ${task.horaFin || 'No asignado'}</p>
      <p><strong>Lugar:</strong> ${task.lugar || 'No asignado'}</p>
      <p><strong>Grupo:</strong> ${grupoNombre}</p>
    `

    await Swal.fire({
      title: 'Detalles de la Tarea',
      html: htmlContent,
      icon: 'info',
      confirmButtonText: 'Cerrar',
      confirmButtonColor: '#4F46E5',
    })
  }

  const tasksForSelectedDate = computed(() => {
    return tasks.value
      .filter((task) => task.fecha === selectedDate.value)
      .sort((a, b) => a.hora.localeCompare(b.hora))
  })

  // Cargar al montar la vista
  onMounted(async () => {
    try {
      // Temas
      const temasResponse = await axios.get('https://localhost:7062/api/Tema')
      temas.value = temasResponse.data

      // Grupos
      const gruposResponse = await axios.get('https://localhost:7062/api/Grupo')
      grupos.value = gruposResponse.data

      // Horarios
      const horariosResponse = await axios.get(
        `https://localhost:7062/api/Horario/usuario/${currentUserId}`,
      )
      const horarios = horariosResponse.data

      tasks.value = horarios.map((horario) => {
        const fechaObj = parseISO(horario.fecha)
        const diaSemana = format(fechaObj, 'EEEE', { locale: es })
        const diaFormateado = diaSemana.charAt(0).toUpperCase() + diaSemana.slice(1)

        return {
          fecha: horario.fecha.split('T')[0], // solo la fecha YYYY-MM-DD
          dia: diaFormateado,
          hora: horario.fecha.split('T')[1]?.substring(0, 5) || '',
          horaFin: horario.fechaFin?.split('T')[1]?.substring(0, 5) || '',
          tema: temas.value.find((t) => t.id === horario.temaId)?.nombre || '',
          actividad: horario.tarea,
          descripcion: horario.descripcion || '',
          lugar: horario.edificio || '',
          grupoId: horario.grupoId || null,
          temaId: horario.temaId || null,
        }
      })

      // eventos al calendario
      calendarOptions.value.events = horarios.map((horario) => {
        const tema = temas.value.find((t) => t.id === horario.temaId)
        return {
          title: horario.tarea,
          start: horario.fecha,
          end: horario.fechaFin,
          allDay: false,
          color: tema?.color || '#4F46E5' // Usa el color del tema o uno por defecto
        }
      }
      )
    } catch (error) {
      console.error('Error al cargar los horarios:', error)
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo guardar la tarea',
        confirmButtonColor: '#DC2626',
      })
    }
  })

  // Opciones del calendario
  const calendarOptions = ref({
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    locale: esLocale,
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek',
    },
    events: [],
    eventColor: '#4F46E5',
    slotMinTime: '07:00:00', // empieza a las 7 AM
    slotMaxTime: '21:40:00',
    eventTimeFormat: {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    },
    dateClick: (info) => {
      selectedDate.value = format(info.date, 'yyyy-MM-dd')
    },
  })

  // Función para formatear fecha
  const formatDate = (dateStr: string) => {
    return format(parseISO(dateStr), "EEEE, d 'de' MMMM 'de' yyyy", { locale: es })
  }

  // Guardar la tarea
  const saveTask = async () => {
    const temasOptions = temas.value
      .map((t) => `<option value="${t.id}">${t.nombre}</option>`)
      .join('')
    const gruposOptions = grupos.value
      .map((g) => `<option value="${g.id}">${g.nombre}</option>`)
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
        <input id="hora" type="time" min="07:00" max="21:40" class="swal2-input" value="07:00">
      </div>
      <div class="swal2-form-group">
      <label for="hora">Hora de Fin<span style="color:red">*</span></label>
      <input id="horaFin" type="time" min="07:00" max="21:40" class="swal2-input" value="07:00">
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

    const fechaSolo = selectedDate.value.split('T')[0] // Extrae solo 'YYYY-MM-DD'
    const fechaCompleta = `${fechaSolo}T${formValues.hora}`
    const fechaFinCompleta = `${fechaSolo}T${formValues.horaFin}`

    const nuevaTarea = {
      fecha: fechaCompleta,
      fechaFin: fechaFinCompleta,
      descripcion: formValues.descripcion,
      tarea: formValues.tarea,
      edificio: formValues.lugar,
      grupoId: formValues.grupoId,
      temaId: formValues.temaId,
      usuarioId: currentUserId,
    }

    try {
      console.log('Datos enviados al servidor:', nuevaTarea)
      await axios.post('https://localhost:7062/api/Horario', nuevaTarea)

      tasks.value.push({
        fecha: selectedDate.value,
        dia: selectedDay.value,
        hora: formValues.hora,
        horaFin: formValues.horaFin,
        tema: temas.value.find((t) => t.id === formValues.temaId)?.nombre || '',
        actividad: formValues.tarea,
        descripcion: formValues.descripcion,
        lugar: formValues.lugar,
        grupoId: formValues.grupoId,
      })

      calendarRef.value.getApi().addEvent({
        title: formValues.tarea,
        start: fechaCompleta,
        end: fechaFinCompleta,
        allDay: false,
      })

      await Swal.fire({
        icon: 'success',
        title: 'Actividad guardada',
        text: 'La tarea fue creada con éxito',
        confirmButtonColor: '#4F46E5',
      })
    } catch (error) {
      await Swal.fire({
        icon: 'error',
        title: 'Error al guardar',
        text: 'No se pudo guardar la actividad',
      })
    }
  }
</script>
  <template>
    <div class="agenda-calendar p-6 max-w-6xl mx-auto">
      <!-- Calendario -->
      <div class="flex items-center justify-between mb-4">
        <h1 class="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <IconCalendarDays class="w-6 h-6 text-indigo-600" />
          Calendario de Actividades
        </h1>
        <button @click="exportToPDF"
          class="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg shadow flex items-center gap-2">
          <IconClipboardList class="w-5 h-5" />
          Exportar PDF
        </button>
      </div>


      <FullCalendar ref="calendarRef" :options="calendarOptions"
        class="w-full max-w-full shadow-lg rounded-xl bg-white p-4 mb-10" />
      <!-- Actividades del día -->
      <div v-if="selectedDate" class="mt-10">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <IconClipboardList class="w-5 h-5 text-indigo-600" />
            Actividades para: {{ formatDate(selectedDate) }}
          </h2>
          <form @submit.prevent="saveTask">
            <button type="submit"
              class="bg-amber-600 hover:bg-amber-700 text-white font-medium py-2 px-4 rounded-lg shadow flex items-center gap-2">
              <IconPlus class="w-5 h-5" />
              Agregar Actividad
            </button>
          </form>
        </div>
        <!-- Tabla -->
        <div class="overflow-x-auto bg-white shadow rounded-lg">
          <table class="min-w-full text-sm text-gray-700">
            <thead class="bg-gray-100 text-gray-600 uppercase text-xs">
              <tr>
                <th class="px-4 py-3 text-left">Hora</th>
                <th class="px-4 py-3 text-left">Actividad</th>
                <th class="px-4 py-3 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="task in tasksForSelectedDate" :key="task.hora + task.tema + task.actividad"
                class="border-b hover:bg-gray-50">
                <td class="px-4 py-3 font-semibold">{{ task.hora }} - {{ task.horaFin }}</td>
                <td class="px-4 py-3">
                  <p class="font-medium text-indigo-600">{{ task.tema }}</p>
                  <p class="text-xs text-gray-500">{{ task.actividad }}</p>
                </td>
                <td class="px-4 py-3">
                  <button @click="viewTaskDetails(task)"
                    class="text-white bg-blue-500 hover:bg-blue-600 font-medium py-1.5 px-3 rounded shadow-sm flex items-center gap-2">
                    <IconEye class="w-4 h-4" />
                    Ver
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
          <p v-if="tasksForSelectedDate.length === 0" class="text-center text-gray-500 py-6">
            No hay actividades asignadas para este día.
          </p>
        </div>
      </div>
    </div>
  </template>

<style scoped>
.agenda-calendar {
  max-width: 1100px;
  margin: 0 auto;
}
</style>
