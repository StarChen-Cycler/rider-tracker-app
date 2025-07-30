<template>
  <div class="flex items-center justify-center" :class="containerClass">
    <div
      class="loading-spinner"
      :class="spinnerClass"
      :style="{ width: size, height: size }"
    ></div>
    <span v-if="text" class="ml-3 text-gray-600" :class="textClass">{{ text }}</span>
  </div>
</template>

<script setup>
defineProps({
  size: {
    type: String,
    default: '32px'
  },
  text: {
    type: String,
    default: ''
  },
  containerClass: {
    type: String,
    default: 'p-4'
  },
  spinnerClass: {
    type: String,
    default: ''
  },
  textClass: {
    type: String,
    default: ''
  }
})
</script> 