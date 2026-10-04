import { projects } from './projects'

// Homepage copy, with routes and footage sourced from the existing project catalogue.
const selections = [
  { id: 1, title: 'Flick & Fetch', engine: 'Unreal Engine', category: 'Team project', poster: 'flick-fetch',
    contribution: 'I built the companion AI, lantern interactions, and supporting VFX.',
    tags: ['C++', 'Companion AI', 'VFX'], award: 'Best Mechanic Award' },
  { id: 3, title: 'Paint Mechanics', engine: 'Unreal Engine', category: 'Solo project', poster: 'paint',
    contribution: 'I built the paint abilities, reusable C++ systems, and designer-facing tools.',
    tags: ['C++', 'Gameplay systems', 'UMG'], award: '' },
  { id: 2, title: 'Movement, Juice & Feel', engine: 'Unity', category: 'Solo project', poster: 'movement',
    contribution: 'I programmed the movement and brought it together with VFX, lighting, and audio.',
    tags: ['C#', 'Player movement', 'Game feel'], award: '' },
  { id: 4, title: 'Game AI & Decision Making', engine: 'Unity', category: 'Academic project', poster: 'ai',
    contribution: 'I implemented the algorithms, steering framework, and agent decision systems.',
    tags: ['C#', 'Pathfinding', 'Fuzzy logic'], award: '' },
  { id: 5, title: 'TwinSync', engine: 'Unity', category: 'Team game jam', poster: 'twinsync',
    contribution: 'I contributed UI, game design, and gameplay programming.',
    tags: ['Unity', 'UI', 'Game jam'], award: 'UKIE Student Game Jam · Top 10' },
  { id: 6, title: 'Platformer Forgiveness', engine: 'Unity', category: 'Solo project', poster: 'forgiveness',
    contribution: 'I built the movement systems, training zones, and event-driven checkpoint flow.',
    tags: ['C#', 'Coroutines', 'Player movement'], award: '' },
]

export const homeProjects = selections.map(selection => {
  const project = projects.find(project => project.id === selection.id)!
  return { ...selection, category: project.category, description: project.description, date: project.date, link: project.link!, video: project.video!,
    image: `/Images/home/${selection.poster}.webp` }
})

export const homeContact = {
  email: 'abdulqadir.tm@gmail.com',
  discord: 'avdolz.m',
  socials: [
    { label: 'GitHub', href: 'https://github.com/Abdulqadir53Mohamedali', placeholder: false },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/abdulqadir-mohamedali-46b534287/', placeholder: false },
    // Temporary platform links requested by the owner; replace with profile URLs.
    { label: 'YouTube', href: 'https://youtube.com/@aqgamedevs?si=RTirkGNMCKGetDCJ', placeholder: true },
    { label: 'X', href: 'https://x.com/aqgamedeveloper?s=11&t=bO5FKDyiPlCcnkK-Udi9AQ', placeholder: true },
  ],
}
