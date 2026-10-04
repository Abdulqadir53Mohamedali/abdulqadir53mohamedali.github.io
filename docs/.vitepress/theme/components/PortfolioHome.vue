<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { withBase } from 'vitepress'
import { homeContact, homeProjects } from '../data/homePortfolio'
import { projects } from '../data/projects'
import PortfolioNav from './PortfolioNav.vue'
import NeuralBackground from './NeuralBackground.vue'
import { experiences } from '../data/experience'
import { educations } from '../data/education'
import '../styles/portfolioHome.css'

const slimeProject = projects.find(project => project.id === 9)!
const showcases = [...homeProjects.slice(0, 3), { ...slimeProject, title: 'Slime Dungeon', engine: 'Unity', video: slimeProject.video!, link: slimeProject.link!, image: '/Images/TopDownSlime/SmallSlimeWithProjectile.png' }]
const activeIndex = ref(0)
const activeProject = computed(() => showcases[activeIndex.value])
const heroVideo = ref<HTMLVideoElement>()
const hero = ref<HTMLElement>()
const menuOpen = ref(false)
const reducedMotion = ref(true)
const paused = ref(true)
const manuallySelected = ref(false)
const inView = ref(true)
const pageVisible = ref(true)
const videoFailed = ref(false)
const scrollProgress = ref(0)
const headerScrolled = ref(false)
const specialisms = ['Gameplay Frameworks', 'Combat Systems', 'Boss Encounters', 'Character AI', 'Movement & Game Feel']
const specialismIndex = ref(0)
const copyStatus = ref('')
const ripple = ref<{ x: number; y: number; id: number } | null>(null)
const cv = withBase('/CV/AbdulqadirMohamedaliCV.pdf')
let observer: IntersectionObserver | undefined
let titleObserver: IntersectionObserver | undefined
const introAnimations = new Set<Animation>()
let motionQuery: MediaQueryList | undefined
let statusTimeout: ReturnType<typeof setTimeout> | undefined
let rippleTimeout: ReturnType<typeof setTimeout> | undefined
let specialismTimer: ReturnType<typeof setInterval> | undefined
let disposed = false

async function syncPlayback() {
  await nextTick()
  const video = heroVideo.value
  if (!video || disposed) return
  if (paused.value || !inView.value || !pageVisible.value) video.pause()
  else {
    try { await video.play() }
    catch { if (heroVideo.value === video) paused.value = true }
  }
}
function chooseProject(index: number) {
  if (index === activeIndex.value && heroVideo.value) heroVideo.value.currentTime = 0
  activeIndex.value = index
  manuallySelected.value = true
  videoFailed.value = false
  syncPlayback()
}
function onEnded() {
  if (!manuallySelected.value && !reducedMotion.value) {
    activeIndex.value = (activeIndex.value + 1) % showcases.length
    videoFailed.value = false
  } else if (heroVideo.value) heroVideo.value.currentTime = 0
  syncPlayback()
}
function togglePlayback() { paused.value = !paused.value; syncPlayback() }
function updatePreferences() {
  reducedMotion.value = motionQuery?.matches ?? true
  if (reducedMotion.value) {
    titleObserver?.disconnect()
    introAnimations.forEach(animation => animation.cancel())
    introAnimations.clear()
  }
  paused.value = reducedMotion.value
  syncPlayback()
}
function revealTitle(element: Element, delay = 0, isName = false) {
  if (reducedMotion.value) return
  const animation = element.animate([
    { opacity: 0, transform: `translateY(${isName ? 28 : 18}px)`, filter: 'blur(5px)', clipPath: 'inset(0 0 100% 0)' },
    { opacity: 1, transform: 'translateY(0)', filter: 'blur(0)', clipPath: 'inset(-10% -5% -15% -5%)' },
  ], {
    duration: isName ? 1100 : 1400,
    delay,
    easing: isName ? 'cubic-bezier(0.16, 1, 0.3, 1)' : 'cubic-bezier(0.4, 0, 0.2, 1)',
    fill: 'backwards',
  })
  introAnimations.add(animation)
  animation.onfinish = () => { introAnimations.delete(animation); animation.cancel() }
}
function initialiseTitleIntros() {
  if (reducedMotion.value) return
  document.querySelectorAll('.av-name-line').forEach((line, index) => revealTitle(line, index * 180, true))
  titleObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return
      revealTitle(entry.target)
      titleObserver?.unobserve(entry.target)
    })
  }, { threshold: 0.4 })
  document.querySelectorAll('.av-home h2, .av-home .av-column-title, .av-home .av-card-body h3')
    .forEach(title => titleObserver?.observe(title))
}
function updateVisibility() { pageVisible.value = !document.hidden; syncPlayback() }
function updateScroll() {
  headerScrolled.value = window.scrollY > 24
  const height = document.documentElement.scrollHeight - window.innerHeight
  scrollProgress.value = height > 0 ? window.scrollY / height : 0
}
function createRipple(event: MouseEvent) {
  if (reducedMotion.value || !hero.value || event.detail === 0) return
  const rect = hero.value.getBoundingClientRect()
  ripple.value = { x: event.clientX - rect.left, y: event.clientY - rect.top, id: Date.now() }
  clearTimeout(rippleTimeout)
  rippleTimeout = setTimeout(() => { ripple.value = null }, 650)
}
async function copy(value: string, label: string) {
  try { await navigator.clipboard.writeText(value); copyStatus.value = `${label} copied.` }
  catch { copyStatus.value = `Select and copy: ${value}` }
  clearTimeout(statusTimeout)
  statusTimeout = setTimeout(() => { copyStatus.value = '' }, 6000)
}
function closeMenu(event: KeyboardEvent) {
  if (event.key === 'Escape' && menuOpen.value) {
    menuOpen.value = false
    document.getElementById('portfolio-menu-button')?.focus()
  }
}
onMounted(() => {
  motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
  motionQuery.addEventListener('change', updatePreferences)
  updatePreferences()
  initialiseTitleIntros()
  specialismTimer = setInterval(() => {
    if (!reducedMotion.value && !paused.value && inView.value && pageVisible.value) {
      specialismIndex.value = (specialismIndex.value + 1) % specialisms.length
    }
  }, 3400)
  updateScroll()
  window.addEventListener('scroll', updateScroll, { passive: true })
  window.addEventListener('resize', updateScroll, { passive: true })
  document.addEventListener('visibilitychange', updateVisibility)
  document.addEventListener('keydown', closeMenu)
  observer = new IntersectionObserver(([entry]) => { inView.value = entry.isIntersecting; syncPlayback() }, { threshold: 0.15 })
  if (hero.value) observer.observe(hero.value)
})
onBeforeUnmount(() => {
  disposed = true
  clearInterval(specialismTimer)
  observer?.disconnect()
  titleObserver?.disconnect()
  introAnimations.forEach(animation => animation.cancel())
  introAnimations.clear()
  motionQuery?.removeEventListener('change', updatePreferences)
  window.removeEventListener('scroll', updateScroll)
  window.removeEventListener('resize', updateScroll)
  document.removeEventListener('visibilitychange', updateVisibility)
  document.removeEventListener('keydown', closeMenu)
  clearTimeout(statusTimeout)
  clearTimeout(rippleTimeout)
})
</script>

<template>
  <div class="av-home" id="top">
    <a class="av-skip" href="#main">Skip to content</a>
    <PortfolioNav />
    <main id="main">
      <section ref="hero" class="av-hero" :class="{ 'is-paused': paused || !inView || !pageVisible }" aria-labelledby="hero-title" @click="createRipple">
        <div class="av-hero-media" aria-hidden="true">
          <img class="av-hero-poster" :src="withBase(activeProject.image)" alt="" fetchpriority="high" />
          <video v-if="!videoFailed" :key="activeProject.id" ref="heroVideo" :src="withBase(activeProject.video)" :poster="withBase(activeProject.image)" muted playsinline preload="none" tabindex="-1" @ended="onEnded" @error="videoFailed = true; paused = true" />
        </div>
        <div class="av-hero-shade" aria-hidden="true"></div>
        <span v-if="ripple" :key="ripple.id" class="av-ripple" :style="{ left: `${ripple.x}px`, top: `${ripple.y}px` }" aria-hidden="true"></span>
        <div class="av-hero-content av-shell">
          <p class="av-availability"><span class="av-status-dot"></span> OPEN TO ROLES & INTERNSHIPS</p>
          <h1 id="hero-title"><span class="av-name-line">Abdulqadir</span><span class="av-name-line av-name-last">Mohamedali</span></h1>
          <div class="av-hero-intro">
            <p class="av-role-title">Gameplay Programmer</p><span class="av-role-dot" aria-hidden="true">·</span>
            <div class="av-specialisms" aria-hidden="true"><Transition name="av-specialism" mode="out-in"><span :key="specialismIndex">{{ specialisms[specialismIndex] }}</span></Transition></div>
            <span class="av-sr-only">Gameplay frameworks, combat systems, boss encounters, character AI, and movement and game feel.</span>
          </div>
          <div class="av-actions"><a class="av-button av-button-primary" href="#work">View projects <span aria-hidden="true">↗</span></a><a class="av-button av-button-quiet" :href="cv" target="_blank" rel="noopener">View CV <span aria-hidden="true">↗</span></a></div>
          <div class="av-hero-tools"><span>UNREAL ENGINE</span><span>UNITY</span><span>C++ / C#</span><span class="av-location">BASED IN THE UK</span></div>
        </div>
        <div class="av-showcase av-shell">
          <div class="av-showcase-heading"><button class="av-playback" :disabled="videoFailed" :aria-label="paused ? 'Play showcase video' : 'Pause showcase video'" @click.stop="togglePlayback">{{ videoFailed ? 'Preview image' : paused ? '▷ Play' : 'Ⅱ Pause' }}</button></div>
          <div class="av-showcase-options" role="group" aria-label="Choose a project preview">
            <button v-for="(project, index) in showcases" :key="project.id" class="av-showcase-option" :class="{ 'is-active': activeIndex === index }" :aria-pressed="activeIndex === index" @click="chooseProject(index)"><span class="av-index">0{{ index + 1 }}</span><span><strong>{{ project.title }}</strong><small>{{ project.engine }} · {{ project.tags[0] }}</small></span><span class="av-option-diamond" aria-hidden="true">◇</span></button>
          </div>
          <div class="av-showcase-caption"><a :href="withBase(activeProject.link)">Explore project <span aria-hidden="true">↗</span></a></div>
        </div>
      </section>

      <div class="av-content-backdrop">
        <div class="av-spectrum-divider" aria-hidden="true"><span /></div>
        <NeuralBackground />
      <section id="work" class="av-section av-shell" aria-labelledby="work-title">
        <div class="av-section-heading"><div><p class="av-eyebrow">PROJECT SPOTLIGHT</p><h2 id="work-title">Featured projects</h2></div></div>
        <p class="av-section-intro">A selection of team projects, prototypes, and experiments. Take a look at what I built and how it works.</p>
        <div class="av-project-grid"><a v-for="(project, index) in homeProjects" :key="project.id" :href="withBase(project.link)" class="av-project-card" :class="`av-palette-${index % 3}`">
          <div class="av-card-image"><video :src="withBase(project.video)" :poster="withBase(project.image)" :aria-label="`${project.title} gameplay preview`" autoplay muted loop playsinline preload="metadata" /><div class="av-media-badges"><span class="av-card-date">{{ project.date }}</span><span class="av-category-tag">{{ project.category }}</span></div><span class="av-card-featured">✧ Featured</span></div>
          <div class="av-card-body"><h3>{{ project.title }}</h3><p>{{ project.description }}</p><div class="av-card-tags"><span v-for="tag in [...new Set([project.engine, ...project.tags])]" :key="tag">{{ tag }}</span></div><p v-if="project.award" class="av-card-award"><span aria-hidden="true">✧</span> {{ project.award }}</p></div>
        </a></div>
        <div class="av-all-projects"><a class="av-button av-button-primary" :href="withBase('/projects')">View all projects</a></div>
      </section>

      <section id="about" class="av-about-section" aria-labelledby="about-title"><div class="av-shell">
        <p class="av-eyebrow"><span aria-hidden="true">—</span> BEHIND THE WORK</p><h2 id="about-title">About me</h2>
        <div class="av-about-grid">
          <div class="av-about-copy"><p class="av-lead"> I am a programmer with a passion for game development and creating game mechanics. I have a growing interest in UI creation and implementation, as well as AI ( NPC / Enemy) in games, and enjoy continiously increasing my knowlegde and applying it in these areas.</p><p>I study <a class="av-inline-link" href="https://www.staffs.ac.uk/course/computer-games-design-programming-bsc" target="_blank" rel="noopener noreferrer">Games Design & Programming</a> at the <a class="av-inline-link" href="https://www.staffs.ac.uk/" target="_blank" rel="noopener noreferrer">University of Staffordshire</a>. My work spans Unreal Engine and Unity, with a particular interest in gameplay mechanics, character AI, and UI implementation.</p><p>Outside development, you’ll usually find me playing games, enjoying Warhammer, or talking Star Wars. Fantasy and sci-fi are a big part of what inspires me.</p></div>
          <div class="av-skills-grid">
            <article class="av-skill-panel"><h3>Engines</h3><p>Unreal Engine 5 · Unity</p></article>
            <article class="av-skill-panel"><h3>Languages</h3><p>C++ · C# · Unreal Blueprints</p></article>
            <article class="av-skill-panel"><h3>Systems</h3><p>Companion AI · State machines · Pathfinding · UI / UMG</p></article>
            <article class="av-skill-panel"><h3>Game feel</h3><p>Player movement · Forgiveness mechanics · VFX · Audio feedback</p></article>
          </div>
        </div>
      </div></section>

      <section id="experience" class="av-section av-shell" aria-labelledby="experience-title">
        <div class="av-section-heading"><div><p class="av-eyebrow"><span aria-hidden="true">—</span> THE JOURNEY SO FAR</p><h2 id="experience-title">Experience</h2></div></div>
        <div class="av-timeline-list"><article v-for="experience in experiences" :key="experience.id" class="av-timeline-item"><span class="av-timeline-date">{{ experience.date }} · INDUSTRY PLACEMENT</span><h4>{{ experience.title }}</h4><p class="av-institution">{{ experience.company }}</p><ul class="av-experience-bullets"><li v-for="(line, index) in experience.description" :key="index">{{ line }}</li></ul><div class="av-card-tags"><span v-for="tag in experience.tags" :key="tag">{{ tag }}</span></div></article></div>
      </section>

      <section id="education" class="av-section av-education-section" aria-labelledby="education-title">
        <div class="av-shell">
        <div class="av-section-heading"><div><p class="av-eyebrow"><span aria-hidden="true">—</span> STUDY & DEVELOPMENT</p><h2 id="education-title">Education</h2></div></div>
        <div class="av-timeline-list"><article v-for="education in educations" :key="education.id" class="av-timeline-item"><span class="av-timeline-date">{{ education.date }}</span><h4>{{ education.qualification }}</h4><p class="av-institution"><a class="av-inline-link" :href="education.institutionUrl" target="_blank" rel="noopener noreferrer">{{ education.institution }}</a></p><ul class="av-education-bullets"><li v-for="point in education.highlights" :key="point">{{ point }}</li></ul><div class="av-card-tags"><span v-for="tag in education.tags" :key="tag">{{ tag }}</span></div></article></div>
        </div>
      </section>

      <section id="contact" class="av-contact-section av-shell" aria-labelledby="contact-title"><p class="av-eyebrow av-contact-label"><span aria-hidden="true">—</span> CONNECT</p><div class="av-contact-panel"><div class="av-contact-intro"><p class="av-eyebrow av-contact-availability">AVAILABLE NOW</p><h2 id="contact-title">Let’s build something.</h2><p>Have a project in mind, a question about my work, or just want to talk game development? Get in touch.</p><a class="av-button av-button-primary" :href="`mailto:${homeContact.email}`">Email me <span aria-hidden="true">↗</span></a></div>
          <div class="av-contact-details"><div class="av-contact-row"><span>EMAIL</span><a :href="`mailto:${homeContact.email}`">{{ homeContact.email }}</a><button aria-label="Copy email address" @click="copy(homeContact.email, 'Email')">Copy</button></div><div class="av-contact-row"><span>DISCORD</span><strong>{{ homeContact.discord }}</strong><button aria-label="Copy Discord username" @click="copy(homeContact.discord, 'Discord username')">Copy</button></div><div class="av-contact-row"><span>CV</span><a :href="cv" target="_blank" rel="noopener">View CV (PDF) <span aria-hidden="true">↗</span></a></div><div class="av-contact-row"><span>BASED IN</span><strong>United Kingdom</strong><span class="av-status-dot" aria-hidden="true"></span></div><div class="av-contact-socials"><a v-for="social in homeContact.socials" :key="social.label" :href="social.href" :title="social.placeholder ? `${social.label} — profile link coming soon` : social.label" target="_blank" rel="noopener noreferrer">{{ social.label }} <span aria-hidden="true">↗</span></a></div><p class="av-copy-status" role="status">{{ copyStatus }}</p></div>
        </div></section>
      </div>
    </main>
    <footer class="av-footer av-shell"><a class="av-footer-brand" href="#top">AVDOLZ<span class="av-name-dot">.</span></a><p>© {{ new Date().getFullYear() }} Abdulqadir Mohamedali. All rights reserved.</p><div><a :href="withBase('/projects')">Projects</a><a :href="cv" target="_blank" rel="noopener">CV ↗</a><a v-for="social in homeContact.socials.slice(0, 2)" :key="social.label" :href="social.href" target="_blank" rel="noopener noreferrer">{{ social.label }} ↗</a></div></footer>
    <nav class="av-page-controls" aria-label="Page shortcuts"><a v-show="scrollProgress > 0.08" href="#top" aria-label="Back to top" title="Back to top">↑</a><a v-show="scrollProgress < 0.92" href="#contact" aria-label="Jump to contact" title="Jump to contact">↓</a></nav>
  </div>
</template>
