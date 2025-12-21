<template>
  <header class="project-hero">
    <a class="back-to-projects" :href="withBase('/projects/')">
      ← Back to Projects
    </a>
    <h1 class="project-title-projects">{{ title }}</h1>

    <div class="project-meta-card">
      <div class="project-meta-row">
        <span class="project-meta-label">My Role</span>
        <span class="project-meta-value">{{ role }}</span>
      </div>

      <div class="project-meta-row">
        <span class="project-meta-label">Software & Languages Used</span>
        <span class="project-meta-value">{{ tools }}</span>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
  import { withBase } from "vitepress"

defineProps<{
  title: string
  role: string
  tools: string
}>()
</script>
