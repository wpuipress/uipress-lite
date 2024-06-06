<script setup>
// Define props and data
const props = defineProps({
  rows: { type: [Number] },
  columns: { type: [Number] },
});
</script>

<template>
  <tr v-for="index in rows" class="animate-pulse" :key="`loader-${index}`">
    <td v-for="colindex in columns" class="uip-padding-xs" :class="colindex === 2 ? 'uip-w-500p' : ''">
      <div class="uip-h-32 uip-background-muted uip-border-rounder"></div>
    </td>
  </tr>
</template>
