<template>
  <div class="all-projects-container">
    <!-- Header -->
    <div class="projects-header">
      <h1 class="projects-title">Projects</h1>
      <p class="projects-description">
        A collection of projects I've worked on, Click on a project to learn more.
      </p>
    </div>

    <!-- Filter & Count Section -->
    <div class="filter-section">
      <button 
        class="filter-toggle-btn"
        @click="toggleFilters"
      >
        <span class="filter-icon">⚙️</span>
        {{ showFilters ? 'Hide Filters' : 'Show Filters' }}
      </button>

      <div class="projects-count">
        Showing {{ filteredProjects.length }} of {{ projects.length }} projects
      </div>
    </div>

    <!-- Filters Panel -->
    <div v-if="showFilters" class="filters-panel">
      <!-- Filter by Type -->
      <div class="filter-group">
        <h3 class="filter-group-title">Filter by Type</h3>
        <div class="filter-tags">
          <button
            v-for="type in allTypes"
            :key="type"
            :class="['filter-tag', { active: selectedTags.includes(type) }]"
            @click="toggleTag(type)"
          >
            {{ type }}
          </button>
        </div>
      </div>

      <!-- Filter by Language & Software -->
      <div class="filter-group">
        <h3 class="filter-group-title">Filter by Language & Software</h3>
        <div class="filter-tags">
          <button
            v-for="lang in allLanguages"
            :key="lang"
            :class="['filter-tag', { active: selectedTags.includes(lang) }]"
            @click="toggleTag(lang)"
          >
            {{ lang }}
          </button>
        </div>
      </div>



      <!-- Reset Button -->
      <button 
        v-if="selectedTags.length > 0"
        class="reset-filters-btn"
        @click="resetFilters"
      >
        <span class="reset-icon">↻</span>
        Reset Filters
      </button>
    </div>

    <!-- Projects Grid -->
    <div class="projects-grid">
      <ProjectCard
        v-for="project in filteredProjects"
        :key="project.id"
        :project="project"
      />
    </div>

    <!-- No Results -->
    <div v-if="filteredProjects.length === 0" class="no-results">
      <p>No projects match your filters. Try adjusting your selection.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import ProjectCard from './ProjectCard.vue'
import { projects } from '../data/projects'

const showFilters = ref(false)
const selectedTags = ref<string[]>([])

// Get all unique tags from projects
const allTypes = computed(() => {
  const types = new Set<string>()
  projects.forEach(p => {
    if (p.category) types.add(p.category)
  })
  return Array.from(types).sort()
})

const allLanguages = computed(() => {
  const langs = new Set<string>()
  projects.forEach(p => {
    p.tags.forEach(tag => langs.add(tag))
  })
  return Array.from(langs).sort()
})

const allContexts = computed(() => {
  const contexts = new Set<string>()
  projects.forEach(p => {
    if (p.category) contexts.add(p.category)
  })
  return Array.from(contexts).sort()
})

// Filter logic
const filteredProjects = computed(() => {
  if (selectedTags.value.length === 0) {
    return projects
  }

  return projects.filter(project => {
    // Check if project has any of the selected tags
    const projectAllTags = [...project.tags, project.category]
    return selectedTags.value.some(tag => projectAllTags.includes(tag))
  })
})

// Toggle filters visibility
const toggleFilters = () => {
  showFilters.value = !showFilters.value
}

// Toggle individual tag
const toggleTag = (tag: string) => {
  const index = selectedTags.value.indexOf(tag)
  if (index > -1) {
    selectedTags.value.splice(index, 1)
  } else {
    selectedTags.value.push(tag)
  }
}

// Reset all filters
const resetFilters = () => {
  selectedTags.value = []
}
</script>

<style scoped>
/* All styles in projects.css */
</style>
