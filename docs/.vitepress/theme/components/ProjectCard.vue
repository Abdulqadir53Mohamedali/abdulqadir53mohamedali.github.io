<template>
  <component
    :is="project.link ? 'a' : 'div'"
    class="project-card"
    v-bind="project.link ? { href: project.link } : {}"
  >
    <div class="project-image">
      <!-- VIDEO THUMBNAIL (preferred) -->
      <video
        v-if="project.video"
        class="project-thumb"
        :src="project.video"
        :poster="project.image"
        autoplay
        muted
        loop
        playsinline
        preload="metadata"
      />

      <!-- IMAGE THUMBNAIL (fallback) -->
      <img
        v-else
        class="project-thumb"
        :src="project.image"
        :alt="project.title"
        loading="lazy"
      />
  
  <div class="badges-left-container">
    <span class="badge badge--date">
      {{ project.date }}
   </span>
    <span v-if="project.category" class="badge badge--category">
      <span class="category-icon">{{ getCategoryIcon(project.category) }}</span>
      {{ project.category }}
   </span>
  </div>

  <div class="badges-right-container">
   <span v-if="project.featured" class="badge badge--featured">
      ♛ Featured
   </span>
  </div>
    </div>


    <div class="project-info">
      <h3 class="project-title">
        {{ project.title }}
      </h3>
      
      <p class="project-description">
        {{ project.description }}
      </p>
      
      <div class="project-tags">
        <span 
          v-for="tag in project.tags" 
          :key="tag"
          class="project-tag"
        >
          {{ tag }}
        </span>
      </div>
    </div>
 </component>

</template>

<script setup lang="ts">
interface Project {
  id: number
  title: string
  image: string
  video? : string;
  description: string
  tags: string[]
  date: string
  featured?: boolean
  category?: string
  link?: string
}

defineProps<{
  project: Project
}>()

const getCategoryIcon = (category: string): string => {
  const icons: Record<string, string> = {
    'Academic': '🕮',
    'Personal': '♜',
    'Professional': '☣'
  }
  return icons[category] || '🕮'
}
</script>

<style scoped>
.project-thumb {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;

  /* stops the video eating clicks (so the whole card is clickable) */
  pointer-events: none;
}
</style>
