<template>
  <q-page padding>Chat {{ route.params.id }}</q-page>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
// import { watch } from 'vue'

const route = useRoute("/chat/[id]")
// watch(
//   () => route.params.id,
//   (id) => { /* load messages for this chat */ },
//   { immediate: true }
// )
</script>
