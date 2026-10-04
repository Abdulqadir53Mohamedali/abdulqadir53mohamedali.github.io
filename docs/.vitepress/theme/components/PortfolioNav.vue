<script setup lang="ts">
import { computed, onMounted, onBeforeUnmount, ref } from 'vue'
import { useRoute, withBase } from 'vitepress'
import { homeContact } from '../data/homePortfolio'
import '../styles/portfolioHome.css'
const route = useRoute()
const isHome = computed(() => route.path === withBase('/') || route.path === withBase('/index.html'))
const isProjects = computed(() => /\/projects(?:\/|\.html|$)/.test(route.path))
const menuOpen = ref(false)
const scrolled = ref(false)
const updateScroll = () => { scrolled.value = window.scrollY > 24 }
function closeOnEscape(event: KeyboardEvent) { if (event.key === 'Escape' && menuOpen.value) { menuOpen.value = false; document.getElementById('portfolio-menu-button')?.focus() } }
onMounted(() => { updateScroll(); window.addEventListener('scroll', updateScroll, { passive: true }); document.addEventListener('keydown', closeOnEscape) })
onBeforeUnmount(() => { window.removeEventListener('scroll', updateScroll); document.removeEventListener('keydown', closeOnEscape) })
</script>
<template>
  <header class="av-header" :class="{ 'is-scrolled': scrolled || !isHome, 'has-open-menu': menuOpen, 'is-inner': !isHome }">
    <a class="av-brand" :href="withBase('/')"><span>Avdolz - Game Developer</span></a>
    <button id="portfolio-menu-button" class="av-menu-toggle" :aria-expanded="menuOpen" aria-controls="portfolio-navigation" @click="menuOpen = !menuOpen">{{ menuOpen ? 'Close −' : 'Menu +' }}</button>
    <nav id="portfolio-navigation" class="av-nav" :class="{ 'is-open': menuOpen }" aria-label="Main navigation" @click="menuOpen = false">
      <a :href="withBase('/')" :class="{ 'is-page-active': isHome }" :aria-current="isHome ? 'page' : undefined">Home</a>
      <a :href="withBase('/projects')" :class="{ 'is-page-active': isProjects }" :aria-current="isProjects ? 'page' : undefined">Projects</a>
      <a :href="withBase('/#about')">About me</a><a :href="withBase('/#experience')">Experience</a><a :href="withBase('/#education')">Education</a><a :href="withBase('/#contact')">Contact</a>
      <a class="av-nav-icon" :href="homeContact.socials[0].href" aria-label="GitHub" target="_blank" rel="noopener noreferrer"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.86c-2.78.6-3.37-1.18-3.37-1.18-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.89 1.53 2.34 1.09 2.91.83.09-.65.35-1.09.64-1.34-2.22-.25-4.56-1.11-4.56-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.03A9.58 9.58 0 0 1 12 6.83c.85 0 1.71.11 2.51.34 1.91-1.3 2.75-1.03 2.75-1.03.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.58 4.93.36.31.68.92.68 1.85v2.76c0 .27.18.58.69.48A10 10 0 0 0 12 2Z"/></svg></a>
      <a class="av-nav-icon" :href="homeContact.socials[1].href" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.45 2H3.55C2.69 2 2 2.68 2 3.52v16.96C2 21.32 2.69 22 3.55 22h16.9c.86 0 1.55-.68 1.55-1.52V3.52C22 2.68 21.31 2 20.45 2ZM7.93 18.75H4.98V9.2h2.95ZM6.46 7.9a1.71 1.71 0 1 1 0-3.42 1.71 1.71 0 0 1 0 3.42Zm12.29 10.85H15.8V14.1c0-1.11-.02-2.54-1.55-2.54-1.55 0-1.79 1.21-1.79 2.46v4.73H9.51V9.2h2.83v1.3h.04c.39-.75 1.36-1.54 2.79-1.54 2.98 0 3.58 1.96 3.58 4.51Z"/></svg></a>
      <a class="av-nav-cv" :href="withBase('/CV/AbdulqadirMohamedaliCV.pdf')" target="_blank" rel="noopener"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="M6 3h8l4 4v14H6Z M14 3v5h4 M9 12h6 M9 16h6"/></svg>CV</a>
    </nav>
  </header>
</template>
