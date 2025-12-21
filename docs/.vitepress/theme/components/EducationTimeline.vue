<template>
  <section id = "education"class="education">
    <div class="education-container">
      <h2 class="education-title">Education</h2>
      
      <div class="education-timeline">
        <div 
          v-for="edu in educations" 
          :key="edu.id"
          class="education-card"
        >
          <!-- Date Column -->
          <div class="education-date">
            {{ edu.date }}
          </div>
          
          <!-- Content Column -->
          <div class="education-content">
            <!-- Qualification & Institution -->
            <div class="education-header">
              <h3 class="education-title-item">{{ edu.qualification }}</h3>
              <p class="education-institution">{{ edu.institution }}</p>
            </div>
            
            <!-- Description (NO BULLETS) -->
            <p class="education-description">
              {{ edu.description }}
            </p>
            
            <!-- Tech Tags -->
            <div class="education-tags">
              <span 
                v-for="tag in edu.tags" 
                :key="tag"
                class="education-tag"
              >
                {{ tag }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { educations } from '../data/education'
</script>

<style scoped>
/* All styles in education.css */
</style>
