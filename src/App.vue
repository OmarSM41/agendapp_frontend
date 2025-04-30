<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import HeaderComponent from './components/HeaderComponent.vue'
import FooterComponent from './components/FooterComponent.vue'


</script>

<template>
  <div class="min-h-screen flex flex-col">
    <HeaderComponent />
    <!-- Contenido principal -->
    <main class="flex-grow">
      <router-view />
    </main>

    <!-- Footer -->
    <FooterComponent />
  </div>
</template>

