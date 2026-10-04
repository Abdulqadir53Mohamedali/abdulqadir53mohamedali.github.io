<script setup lang="ts">
import { ref, nextTick } from 'vue'
import { onContentUpdated, useData } from 'vitepress'
const { frontmatter } = useData()
type Topic = { id: string; title: string }
const groups = ref<(Topic & { children: Topic[] })[]>([])
onContentUpdated(() => {
  if (!String(frontmatter.value.pageClass).includes('project-detail')) { groups.value = []; return }
  const result: typeof groups.value = []
  let current: typeof result[number] | undefined
  document.querySelectorAll('.VPDoc .vp-doc h2, .VPDoc .collapse-section').forEach(el => {
    if (el.tagName === 'H2' && !el.closest('.collapse-section')) {
      current = { id: el.id, title: el.textContent?.replace(/[\u200b-\u200d\ufeff]/g, '').replace(/\s*#\s*$/, '').trim() || '', children: [] }
      result.push(current)
    } else if (el.classList.contains('collapse-section') && current && /^(?:Technical\s+)?(?:Highlights|General)$/i.test(current.title)) {
      const title = el.querySelector('.collapse-title')?.textContent?.trim()
      if (el.id && title) current.children.push({ id: el.id, title })
    }
  })
  groups.value = result
})
async function navigate(id: string) {
  window.dispatchEvent(new CustomEvent('vp-open-collapse', { detail: { id } }))
  await nextTick()
  const hash = `#${encodeURIComponent(id)}`
  if (location.hash !== hash) history.pushState(null, '', hash)
  document.getElementById(id)?.scrollIntoView({ block: 'start', behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })
}
</script>

<template>
  <nav v-if="groups.length" class="project-outline" aria-label="On this page">
    <strong>On this page</strong>
    <ul><li v-for="group in groups" :key="group.id">
      <a :href="`#${encodeURIComponent(group.id)}`" @click.prevent="navigate(group.id)">{{ group.title }}</a>
      <ul v-if="group.children.length"><li v-for="topic in group.children" :key="topic.id">
        <a :href="`#${encodeURIComponent(topic.id)}`" @click.prevent="navigate(topic.id)">{{ topic.title }}</a>
      </li></ul>
    </li></ul>
  </nav>
</template>

<style scoped>
.project-outline { border-left: 1px solid var(--vp-c-divider); padding-left: 16px; font-size: 13px; max-height: calc(100vh - 160px); overflow-y: auto; }
strong { color: var(--vp-c-text-1); }
ul { list-style: none; margin: 8px 0; padding: 0; }
ul ul { padding-left: 12px; border-left: 1px solid #45405b; }
a { display: block; color: var(--vp-c-text-2); padding: 5px 0; line-height: 1.5; overflow-wrap: anywhere; }
a:hover, a:focus-visible { color: #b99be7; }
</style>
