<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue'

const props = defineProps<{ src: string; poster: string }>()
const video = ref<HTMLVideoElement>()
let cleanup = () => {}

onMounted(() => {
  const el = video.value!
  let loaded = false
  let visible = false
  let disposed = false
  const load = () => {
    if (loaded) return
    loaded = true
    el.poster = props.poster
    el.src = props.src
    el.preload = 'metadata'
    el.load()
  }
  const sync = async () => {
    if (disposed || !visible || document.hidden) { el.pause(); return }
    load()
    el.muted = true
    try {
      await el.play()
      if (disposed || !visible || document.hidden) el.pause()
    } catch { /* Keep the poster if autoplay is unavailable. */ }
  }
  // Fetch metadata shortly before arrival; only play within the viewport.
  const nearby = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) { load(); nearby.disconnect() }
  }, { rootMargin: '250px 0px' })
  const preview = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) { el.poster = props.poster; preview.disconnect() }
  }, { rootMargin: '500px 0px' })
  preview.observe(el)
  const viewport = new IntersectionObserver(entries => {
    visible = entries[0].isIntersecting
    void sync()
  })
  nearby.observe(el)
  viewport.observe(el)
  document.addEventListener('visibilitychange', sync)
  cleanup = () => {
    disposed = true
    preview.disconnect()
    nearby.disconnect()
    viewport.disconnect()
    document.removeEventListener('visibilitychange', sync)
    el.pause()
    el.removeAttribute('src')
    el.load()
  }
})
onBeforeUnmount(() => cleanup())
</script>

<template>
  <video ref="video" muted loop playsinline preload="none" />
</template>
