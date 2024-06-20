<script setup>
// Define props and data
const props = defineProps({
  rows: { type: [Number] },
  columns: { type: [Number] },
});
</script>

<template>
  <tr v-for="index in rows" class="" :key="`loader-${index}`">
    <td v-for="colindex in columns" class="px-3 py-3" :class="colindex === 2 ? 'w-1/2' : ''"><div class="h-11 bg-slate-100 rounded-xl animate-pulse"></div></td>
  </tr>
</template>
