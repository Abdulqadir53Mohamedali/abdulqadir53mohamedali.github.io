<template>
  <figure class="project-media">
    <!-- Video -->
    <video
      v-if="type === 'video'"
      class="project-media__video"
      :src="src"
      autoplay
      muted
      loop
      playsinline
      controls
    />

    <!-- Image (hover zoom + pan) -->
    <div
      v-else
      class="project-media__img-wrap"
      :class="{ 'is-hover-pan': hoverPanZoom }"
      @mousemove="onMove"
      @mouseenter="onEnter"
      @mouseleave="onLeave"
    >
      <img
        class="project-media__img"
        :src="src"
        :alt="alt"
        loading="lazy"
        :style="imgStyle"
      />
    </div>

    <figcaption v-if="caption" class="project-media__caption">
      {{ caption }}
    </figcaption>
  </figure>
</template>

<script setup lang="ts">
import { computed, ref } from "vue"

const props = withDefaults(
  defineProps<{
    src: string
    type?: "image" | "video"
    alt?: string
    caption?: string

    // enable/disable hover pan zoom per image
    hoverPanZoom?: boolean

    // how strong the zoom is
    zoomScale?: number
  }>(),
  {
    type: "image",
    hoverPanZoom: true,
    zoomScale: 1.8,
  }
)

const originX = ref(50)
const originY = ref(50)
const hovering = ref(false)

function onEnter() {
  hovering.value = true
}

function onLeave() {
  hovering.value = false
  originX.value = 50
  originY.value = 50
}

function onMove(e: MouseEvent) {
  if (!props.hoverPanZoom) return

  const el = e.currentTarget as HTMLElement
  const r = el.getBoundingClientRect()

  const x = ((e.clientX - r.left) / r.width) * 100
  const y = ((e.clientY - r.top) / r.height) * 100

  // clamp so it doesn’t go weird at edges
  originX.value = Math.max(0, Math.min(100, x))
  originY.value = Math.max(0, Math.min(100, y))
}

const imgStyle = computed(() => {
  if (!props.hoverPanZoom) return {}

  return {
    transform: hovering.value ? `scale(${props.zoomScale})` : "scale(1)",
    transformOrigin: `${originX.value}% ${originY.value}%`,
  } as Record<string, string>
})
</script>

<style scoped>
.project-media__img-wrap {
  overflow: hidden;
  border-radius: 12px; /* optional */
}

.project-media__img {
  display: block;
  width: 100%;
  height: auto;
  transition: transform 160ms ease;
}

.project-media__img-wrap.is-hover-pan:hover .project-media__img {
  cursor: zoom-in;
}

/* accessibility */
@media (prefers-reduced-motion: reduce) {
  .project-media__img {
    transition: none;
  }
}
</style>
