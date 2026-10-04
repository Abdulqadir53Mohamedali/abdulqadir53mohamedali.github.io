<script setup lang="ts">
import { computed } from 'vue'
import CardVideo from './CardVideo.vue'
import { withBase } from 'vitepress'
import { homeProjects } from '../data/homePortfolio'
import '../styles/portfolioHome.css'
interface Project {
  id: number
  title: string
  image: string
  video?: string
  description: string
  tags: string[]
  date: string
  featured?: boolean
  category?: string
  link?: string
}
const props = defineProps<{ project: Project }>()
const award = computed(() => homeProjects.find(item => item.id === props.project.id)?.award)
</script>

<template>
  <component :is="project.link ? 'a' : 'div'" class="av-project-card catalogue-card"
    :class="`av-palette-${(project.id - 1) % 3}`"
    v-bind="project.link ? { href: withBase(project.link) } : {}">
    <div class="av-card-image">
      <CardVideo v-if="project.video" :src="withBase(project.video)" :poster="withBase(project.image)"
        :aria-label="`${project.title} gameplay preview`" />
      <img v-else :src="withBase(project.image)" :alt="project.title" loading="lazy" />
      <div class="av-media-badges">
        <span class="av-card-date">{{ project.date }}</span>
        <span v-if="project.category" class="av-category-tag">{{ project.category }}</span>
      </div>
      <span v-if="project.featured" class="av-card-featured">✧ Featured</span>
    </div>
    <div class="av-card-body">
      <h3>{{ project.title }}</h3>
      <p>{{ project.description }}</p>
      <div class="av-card-tags"><span v-for="tag in project.tags" :key="tag">{{ tag }}</span></div>
      <p v-if="award" class="av-card-award"><span aria-hidden="true">✧</span> {{ award }}</p>
    </div>
  </component>
</template>

<style scoped>
.catalogue-card {
  --av-surface: #111827;
  --av-muted: #a4adbd;
  --av-gold: #c8ab77;
  color: #f1eee7;
  font-family: 'Segoe UI', sans-serif;
  text-decoration: none;
}
.catalogue-card p { margin: 0; }
.catalogue-card .av-card-award { margin-top: 17px; }
.catalogue-card video { pointer-events: none; }
.catalogue-card:focus-visible { outline: 2px solid #91a5cd; outline-offset: 5px; }
@media (prefers-reduced-motion: reduce) {
  .catalogue-card, .catalogue-card::before, .catalogue-card img, .catalogue-card video { transition: none; }
  .catalogue-card:hover { transform: none; }
}
</style>
