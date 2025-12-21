<template>
  <section class="ps">
    <div class="ps-frame">
      <button
        class="ps-arrow ps-arrow--left"
        type="button"
        @click="prev"
        aria-label="Previous slide"
      >
        ‹
      </button>

      <div class="ps-media" @mousemove="onMediaMove" @mouseleave="onMediaLeave">
        <video
          v-if="current.type === 'video'"
          :key="`video-${current.src}`"
          ref="activeVideo"
          class="ps-video"
          :src="current.src"
          autoplay
          muted
          loop
          playsinline
          preload="metadata"
        />

        <img
          v-else
          class="ps-image"
          :class="{ 'is-hovering': isHovering && hoverEnabled }"
          :src="current.src"
          :alt="current.alt || ''"
          loading="lazy"
          :style="imgStyle"
        />
      </div>

      <button
        class="ps-arrow ps-arrow--right"
        type="button"
        @click="next"
        aria-label="Next slide"
      >
        ›
      </button>
    </div>

    <div class="ps-dots" role="tablist" aria-label="Slideshow dots">
      <button
        v-for="(_, i) in slides"
        :key="i"
        class="ps-dot"
        :class="{ 'is-active': i === index }"
        type="button"
        :aria-label="`Go to slide ${i + 1}`"
        @click="goTo(i)"
      />
    </div>

    <div class="ps-caption">
      <div v-if="current.caption" class="ps-caption-text">
        {{ current.caption }}
      </div>

      <div v-if="current.related?.length" class="ps-related">
        <span class="ps-related-label">Related:</span>
        <button
          v-for="r in current.related"
          :key="r.targetId"
          type="button"
          class="ps-chip"
          @click="openDropdown(r.targetId)"
        >
          {{ r.label }}
        </button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue"

type Slide = {
  type: "video" | "image"
  src: string
  alt?: string
  caption?: string
  related?: Array<{ label: string; targetId: string }>

  // ✅ per-slide hover zoom config
  hoverPanZoom?: boolean
  zoomScale?: number
}

const props = defineProps<{ slides: Slide[] }>()

const slides = computed(() => props.slides ?? [])
const index = ref(0)
const activeVideo = ref<HTMLVideoElement | null>(null)
const current = computed(() => slides.value[index.value] ?? slides.value[0])

function clamp(i: number) {
  const n = slides.value.length
  if (n === 0) return 0
  return (i + n) % n
}
function goTo(i: number) {
  index.value = clamp(i)
}
function next() {
  index.value = clamp(index.value + 1)
}
function prev() {
  index.value = clamp(index.value - 1)
}

function openDropdown(targetId: string) {
  const el = document.getElementById(targetId)
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" })
  window.dispatchEvent(new CustomEvent("vp-open-collapse", { detail: { id: targetId } }))
}

async function syncVideoPlayback() {
  activeVideo.value?.pause()
  requestAnimationFrame(async () => {
    if (!activeVideo.value) return
    try {
      activeVideo.value.currentTime = 0
      await activeVideo.value.play()
    } catch {
      // autoplay can be blocked; muted usually works
    }
  })
}

watch(index, () => syncVideoPlayback())
onMounted(() => syncVideoPlayback())
onBeforeUnmount(() => activeVideo.value?.pause())

// -------------------------
// Hover zoom + pan (images)
// -------------------------
const hoverX = ref("50%")
const hoverY = ref("50%")
const isHovering = ref(false)

const hoverEnabled = computed(() => {
  if (current.value?.type !== "image") return false
  return current.value.hoverPanZoom ?? true
})

const zoomScale = computed(() => current.value.zoomScale ?? 1.25)

const imgStyle = computed(() => {
  if (!hoverEnabled.value) return {}

  return {
    transformOrigin: `${hoverX.value} ${hoverY.value}`,
    transform: isHovering.value ? `scale(${zoomScale.value})` : "scale(1)",
  } as Record<string, string>
})

function onMediaMove(e: MouseEvent) {
  if (!hoverEnabled.value) return

  const el = e.currentTarget as HTMLElement
  const rect = el.getBoundingClientRect()

  const x = ((e.clientX - rect.left) / rect.width) * 100
  const y = ((e.clientY - rect.top) / rect.height) * 100

  hoverX.value = `${Math.max(0, Math.min(100, x))}%`
  hoverY.value = `${Math.max(0, Math.min(100, y))}%`
  isHovering.value = true
}

function onMediaLeave() {
  isHovering.value = false
  hoverX.value = "50%"
  hoverY.value = "50%"
}
</script>

<style scoped>
.ps {
  margin: 0.9rem 0 1.1rem;
  background: var(--color-bg-card, #1b1b1f);
  border: 1px solid var(--color-border, #2a2a30);
  border-radius: var(--radius-lg, 12px);
  overflow: hidden;
}

.ps-frame {
  position: relative;
}

.ps-media {
  position: relative;
  overflow: hidden; /* keeps zoom inside the frame */
  border-radius: 12px;
}

.ps-image {
  display: block;
  width: 100%;
  height: auto;
  transition: transform 120ms ease;
  will-change: transform;
}

.ps-image.is-hovering {
  cursor: zoom-in;
}

.ps-video {
  outline: none;
  width: 100%;
  display: block;
}

.ps-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 40px;
  height: 40px;
  border-radius: 999px;
  border: 1px solid var(--color-border, #2a2a30);
  background: rgba(0, 0, 0, 0.35);
  color: var(--color-text-primary, #fff);
  cursor: pointer;
  z-index: 2; /* ✅ stays clickable above zooming image */
  font-size: 1.8rem;
  line-height: 0;
}

.ps-arrow--left { left: 10px; }
.ps-arrow--right { right: 10px; }

.ps-arrow:hover {
  background: rgba(0, 0, 0, 0.55);
}

.ps-dots {
  display: flex;
  gap: 0.45rem;
  justify-content: center;
  padding: 0.6rem 0.8rem;
  border-top: 1px solid var(--color-border, #2a2a30);
}

.ps-dot {
  width: 9px;
  height: 9px;
  border-radius: 999px;
  border: 1px solid rgba(255,255,255,0.25);
  background: rgba(255,255,255,0.12);
  cursor: pointer;
}

.ps-dot.is-active {
  background: rgba(255,255,255,0.85);
}

.ps-caption {
  padding: 0.6rem 0.8rem 0.8rem;
  border-top: 1px solid var(--color-border, #2a2a30);
  color: var(--color-text-secondary, #c2c2c7);
  font-size: 0.9rem;
}

.ps-related {
  margin-top: 0.55rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
  align-items: center;
}

.ps-related-label {
  opacity: 0.85;
  font-weight: 650;
}

.ps-chip {
  border: 1px solid rgba(255,255,255,0.16);
  background: rgba(170, 140, 35, 0.15);
  color: rgba(255,255,255,0.92);
  padding: 0.28rem 0.55rem;
  border-radius: 999px;
  cursor: pointer;
  font-size: 0.85rem;
}

.ps-chip:hover {
  background: rgba(170, 140, 35, 0.24);
}

@media (prefers-reduced-motion: reduce) {
  .ps-image {
    transition: none;
  }
}
</style>
