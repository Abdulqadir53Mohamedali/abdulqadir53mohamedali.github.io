<template>
  <section class="collapse-section" :class="{ 'is-open': isOpen }":id="sectionId">
    
    <button
      class="collapse-header"
      type="button"
      @click="toggle"
      :aria-expanded="isOpen"
    >
      <span v-if="icon" class="collapse-icon">
        {{ icon }}
      </span>

      <span class="collapse-title">
        {{ title }}
      </span>

      <span class="collapse-chevron" aria-hidden="true">
        <!-- you can swap this for an SVG if you want -->
        {{ isOpen ? '−' : '+' }}
      </span>
    </button>

    <div class="collapse-body" v-show="isOpen">
      <slot />
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps<{
  title: string
  icon?: string
  defaultOpen?: boolean
    sectionId?: string 

}>()

const isOpen = ref(props.defaultOpen ?? false)

const toggle = () => {
  isOpen.value = !isOpen.value
}

// Listen for slideshow “open this dropdown” event
const onOpenRequest = (event: Event) => {
  const e = event as CustomEvent<{ id?: string }>
  if (!props.sectionId) return
  if (e.detail?.id === props.sectionId) {
    isOpen.value = true
  }
}

onMounted(() => {
  window.addEventListener('vp-open-collapse', onOpenRequest as EventListener)
})

onBeforeUnmount(() => {
  window.removeEventListener('vp-open-collapse', onOpenRequest as EventListener)
})
</script>


<style scoped>
.collapse-section {
  border-radius: var(--radius-md, 8px);
  overflow: hidden;
  background: var(--color-collpaseableCards-baseBackgroundColour, #1b1b1f);
  border: 1px solid var(--color-border, #2a2a30);
  margin-bottom: 0.75rem;
}

/* header bar */
.collapse-header {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.6rem 0.9rem;
  background: transparent;
  border: none;
  cursor: pointer;
  text-align: left;
  color: var(--color-text-primary, #fff);
  font-size: 0.95rem;
  font-weight: 600;
}

.collapse-header:hover {
  background: rgba(255, 255, 255, 0.03);
}

.collapse-icon {
  font-size: 0.95rem;
  opacity: 0.8;
}

.collapse-title {
  flex: 1;
}

.collapse-chevron {
  font-size: 1.1rem;
  opacity: 0.8;
}

/* body */
.collapse-body {
  padding: 0.75rem 0.9rem 0.85rem;
  font-size: 0.9rem;
  color: var(--color-text-secondary, #c2c2c7);
  background: var(--color-bg-card, #1b1b1f);
  border-top: 1px solid var(--color-border, #2a2a30);
}

/* optional: stronger border when open */
.collapse-section.is-open {
  border-color: var(--color-collpaseableCards-open-highlight, #a855f7);
}
</style>
