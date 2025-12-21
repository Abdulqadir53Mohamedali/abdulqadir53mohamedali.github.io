<template>
  <section id = "about"class="about-me">
    <div class="about-me-container">
      <h2 class="about-me-title">{{ aboutMeData.title }}</h2>
      
      <div class="about-me-content">
        <p 
          v-for="(paragraph, index) in aboutMeData.paragraphs" 
          :key="index"
          class="about-me-paragraph"
        >
          <!-- Replace institution/course placeholders with links -->
          <span v-if="index === 1">
            I am a student at 
            <a 
              :href="aboutMeData.education.institutionUrl" 
              target="_blank" 
              rel="noopener noreferrer"
              class="about-me-link"
            >
              {{ aboutMeData.education.institution }}
            </a>
            , studying 
            <a 
              :href="aboutMeData.education.courseUrl" 
              target="_blank" 
              rel="noopener noreferrer"
              class="about-me-link"
            >
              {{ aboutMeData.education.course }}
            </a>
            .
          </span>
          <span v-else>{{ paragraph }}</span>
        </p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { aboutMeData } from '../data/aboutme'
</script>

<style scoped>
/* All styles in aboutme.css */
</style>
