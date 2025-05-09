<script setup lang="ts">
import { ref, computed } from 'vue'
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import esLocale from '@fullcalendar/core/locales/es'

const props = defineProps({
  tasks: Array,
  temas: Array,
  grupos: Array
})

const emit = defineEmits(['date-selected'])

const calendarRef = ref()
const calendarOptions = ref({
  plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
  initialView: 'dayGridMonth',
  locale: esLocale,
  headerToolbar: {
    left: 'prev,next today',
    center: 'title',
    right: 'dayGridMonth,timeGridWeek',
  },
  events: computed(() => props.tasks.map(task => ({
    id: task.id.toString(),
    title: task.actividad,
    start: `${task.fecha}T${task.hora}`,
    end: `${task.fecha}T${task.horaFin}`,
    allDay: false,
    color: props.grupos.find(g => g.id === task.grupoId)?.color || '#4F46E5'
  }))),
  eventColor: '#4F46E5',
  slotMinTime: '07:00:00',
  slotMaxTime: '22:10:00',
  dateClick: (info) => {
    emit('date-selected', info.dateStr)
  }
})
</script>

<template>
  <FullCalendar
    ref="calendarRef"
    :options="calendarOptions"
    class="w-full max-w-full shadow-lg rounded-xl bg-white p-4 mb-10"
  />
</template>
