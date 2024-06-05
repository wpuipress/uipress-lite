<script setup>
import Notify from "@/js/uip/components/notify/index.vue";
import Tips from "@/js/uip/uibuilder/tips/index.vue";
</script>

<template>
  <div>
    <Notify />
    <Tips />

    <RouterView />
  </div>
</template>
