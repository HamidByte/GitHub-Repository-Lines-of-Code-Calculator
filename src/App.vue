<template>
  <div class="main">
    <Header />

    <RouterView />
  </div>
</template>

<script setup>
import { RouterView } from 'vue-router'
import Header from '@/components/Header.vue'
</script>

<style scoped>
@import '../src/assets/layout.css';
</style>
