<template>
  <section class="featured-projects">
    <!-- <div class="divider-wavy"></div> -->
    <div class="featured-projects-header">
      <h2 class="featured-projects-title">Featured Projects</h2>
      <p class="featured-projects-description">
        Check out some of the projects I'm most proud of. Click on a project to learn more.
      </p>
    </div>
    
    <div class="featured-projects-grid">
      <ProjectCard 
        v-for="project in projects.filter(p => p.featured)" 
        :key="project.id"
        :project="project"
      />
    </div>
    
  <div class="projects-center-container">
      <a class="view-all-button" :href="withBase('/projects/')">
        View All Projects →
      </a>
    </div>
        <!-- <div class="divider-wavy-nder-view-all"></div> -->
    <AboutMe />
  <!-- <div class="divider-wavy-nder-view-all"></div> -->
    <ExperienceTimeline />
  <!-- <div class="divider-wavy-nder-view-all"></div> -->
    <EducationTimeline />


  </section>
</template>

<script setup lang="ts">
import ProjectCard from './ProjectCard.vue'
import AboutMe from './AboutMe.vue'
import ExperienceTimeline from './ExperienceTimeline.vue'
import EducationTimeline from './EducationTimeline.vue'

import { withBase } from 'vitepress'


import { projects } from '../data/projects'


</script>

<style scoped>
/* All styles in components.css */
</style>
