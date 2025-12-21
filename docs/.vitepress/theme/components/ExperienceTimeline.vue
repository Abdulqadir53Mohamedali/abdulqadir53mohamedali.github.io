<template>
  <section id = "experience"class="experience">
    <div class="experience-container">
      <h2 class="experience-title">Experience</h2>
      
      <div class="experience-timeline">
        <div 
          v-for="exp in experiences" 
          :key="exp.id"
          class="experience-card"
        >
          <!-- Date Column -->
          <div class="experience-date">
            {{ exp.date }}
          </div>
          
          <!-- Content Column -->
          <div class="experience-content">
            <!-- Title & Company -->
            <div class="experience-header">
              <h3 class="experience-title-item">{{ exp.title }}</h3>
              <p class="experience-company">{{ exp.company }}</p>
            </div>
            
            <!-- Description Bullets -->
            <ul class="experience-description">
              <li 
                v-for="(item, index) in exp.description" 
                :key="index"
                class="experience-item"
              >
                {{ item }}
              </li>
            </ul>
            
            <!-- Tech Tags -->
            <div class="experience-tags">
              <span 
                v-for="tag in exp.tags" 
                :key="tag"
                class="experience-tag"
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
import { experiences } from '../data/experience'
</script>

<style scoped>
/* All styles in experience.css */
</style>
