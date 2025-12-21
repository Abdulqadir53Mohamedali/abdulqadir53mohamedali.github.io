import { h } from 'vue'
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'


// Import styles (order matters!)
import './styles/variables.css'
import './styles/components.css'
import './styles/aboutme.css'
import './styles/experience.css'
import './styles/education.css'
import './styles/projects.css'
import './styles/projectPage.css'



import './style.css'

// Import components
import FeaturedProjects from './components/FeaturedProjects.vue'
import ProjectCard from './components/ProjectCard.vue'
import AboutMe from './components/AboutMe.vue'
import ExperienceTimeline from './components/ExperienceTimeline.vue'
import EducationTimeline from './components/EducationTimeline.vue'
import AllProjects from './components/AllProjects.vue'
import CollapseSection from './components/CollapseSection.vue'
import CodeCollapseSection from './components/CodeCollapseSection.vue'

import ProjectHero from './components/ProjectHero.vue'
import ProjectMedia from './components/ProjectMedia.vue'
import ProjectSlideshow from './components/ProjectSlideShow.vue'







export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      // 'home-hero-after': () => h(FeaturedProjects),
    })
  },
  enhanceApp({ app, router, siteData }) {
        app.component('AllProjects', AllProjects)
    app.component('ProjectCard', ProjectCard)
    app.component('FeaturedProjects', FeaturedProjects)
    app.component('AboutMe', AboutMe)
    app.component('ExperienceTimeline', ExperienceTimeline)
    app.component('EducationTimeline', EducationTimeline)
        app.component('CollapseSection', CollapseSection)
                app.component('CodeCollapseSection', CodeCollapseSection)

            app.component('ProjectHero', ProjectHero)
    app.component('ProjectMedia', ProjectMedia)
      app.component('ProjectSlideshow', ProjectSlideshow)


    // Optional: register components globally
    // app.component('ProjectCard', ProjectCard)
    // app.component('FeaturedProjects', FeaturedProjects)
  }
} satisfies Theme
