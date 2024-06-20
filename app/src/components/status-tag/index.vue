<script setup>
import { ref, computed } from "vue";
const props = defineProps(["status", "text"]);

const returnStatusClasses = computed(() => {
  if (props.status === "success") return " text-green-600 border-green-300";
  if (props.status === "warning") return " text-orange-600 border-orange-300";
  if (props.status === "danger") return " text-red-500 border-red-300";
  return "text-indigo-600 border-indigo-300";
});
const returnStatusGlowClasses = computed(() => {
  if (props.status === "success") return "bg-green-300";
  if (props.status === "warning") return "bg-orange-300";
  if (props.status === "danger") return "bg-red-300";
  return "bg-indigo-300";
});
const returnStatusCircleClasses = computed(() => {
  if (props.status === "success") return "bg-green-500";
  if (props.status === "warning") return "bg-orange-500";
  if (props.status === "danger") return "bg-red-500";
  return "bg-indigo-500";
});
</script>

<template>
  <div class="flex gap-2 flex-row relative items-center rounded-md text-xs py-1 px-2 inline-flex border transition-all" :class="returnStatusClasses">
    <span class="relative flex h-2 w-2">
      <span class="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" :class="returnStatusGlowClasses" style="animation-duration: 1.5s"></span>
      <span class="relative inline-flex rounded-full h-2 w-3" :class="returnStatusCircleClasses"></span>
    </span>
    <div class="font-mono">{{ text }}</div>
  </div>
</template>
