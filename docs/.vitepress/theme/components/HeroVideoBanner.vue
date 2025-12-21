<template>
  <section class="hero-banner">
    <!-- Background video -->
    <video
      class="hero-video"
      :src="videoSrc"
      :poster="posterSrc"
      autoplay
      muted
      loop
      playsinline
      preload="metadata"
      aria-hidden="true"
    />

    <!-- Optional dark overlay so text pops -->
    <div class="hero-overlay" aria-hidden="true"></div>

    <!-- Content on top -->
    <div class="hero-content">
      <slot />
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { withBase } from "vitepress"

const props = withDefaults(
  defineProps<{
    src: string
    poster?: string
  }>(),
  {
    poster: "",
  }
)

const videoSrc = computed(() => withBase(props.src))
const posterSrc = computed(() => (props.poster ? withBase(props.poster) : ""))
</script>

<style scoped>
.hero-banner {
  position: relative;
  border-radius: 18px;
  overflow: hidden;
  min-height: 420px; /* change height to taste */
  display: grid;
  align-items: center;
}

/* video behind everything */
.hero-video {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* darken slightly so text is readable */
.hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    90deg,
    rgba(0, 0, 0, 0.65),
    rgba(0, 0, 0, 0.25)
  );
}

.hero-content {
  position: relative;
  z-index: 2;
  padding: 3rem 2.5rem;
}

/* Respect reduced-motion users */
@media (prefers-reduced-motion: reduce) {
  .hero-video {
    display: none;
  }
}


</style>

