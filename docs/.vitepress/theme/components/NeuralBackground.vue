<script setup lang="ts">
import { defineAsyncComponent, onMounted, onBeforeUnmount, ref } from 'vue'
const Renderer = defineAsyncComponent(() => import('./NeuralBackgroundRenderer.vue'))
const boundary = ref<HTMLElement>()
const ready = ref(false)
let observer: IntersectionObserver | undefined
let nearby = false
function activate() {
  if (!nearby || window.scrollY <= 0) return
  ready.value = true
  observer?.disconnect()
  window.removeEventListener('scroll', activate)
}
onMounted(() => {
  observer = new IntersectionObserver(entries => {
    nearby = entries[0].isIntersecting
    activate()
  }, { rootMargin: '300px 0px' })
  observer.observe(boundary.value!)
  window.addEventListener('scroll', activate, { passive: true })
})
onBeforeUnmount(() => { observer?.disconnect(); window.removeEventListener('scroll', activate) })
</script>
<template>
  <div ref="boundary" class="av-neural-boundary" aria-hidden="true"><Renderer v-if="ready" /></div>
</template>
<style scoped>
.av-neural-boundary { position: absolute; inset: 0; pointer-events: none; z-index: 0; }
</style>
