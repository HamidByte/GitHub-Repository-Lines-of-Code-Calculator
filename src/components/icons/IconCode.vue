<template>
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke-width="2" :stroke="color" aria-hidden="true">
    <path stroke-linecap="round" stroke-linejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path>
  </svg>
</template>

<script>
export default {
  props: {
    color: {
      type: String,
      default: '#000'
    }
  }
}
</script>
