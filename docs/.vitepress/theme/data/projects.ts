export interface Project {
  id: number
  title: string
  image: string
    video? : string;

  description: string
  tags: string[]
  date: string
  featured?: boolean
  category?: 'Academic' | 'Personal' | 'Professional'
  link?: string
}

export const projects: Project[] = [
  {
    id: 1,
    title: "Paint Mechanics System",
    date: "November 2025",
    featured: true,
    category: "Academic",
    video:"/Videos/Paint/Thumbnail/PaintThumbnailTest2.mp4",
    image: "/images/CarlottaWuWaPlaceholder.png",
    description: "A first-person UE5 prototype where you chain different paint powers to move, solve traversal puzzles, and clear a modular testing course built around scalable, data-driven systems.",    tags: ["C++", "Unreal Engine", "Unreal Blueprints", "Jetbrains Rider"],
    link: '/projects/Paint'
  },
  {
    id: 2,
    title: "2D Movement , Juice & Feel",
    date: "November 2025",
    featured: true,
    category: "Academic",
        video:"/Videos/Splatoon/Thumbnail/SplatoonThumnail.mp4",
    image: "/images/CarlottaWuWaPlaceholder.png",
 description: "A 2D platformer built around responsive movement, squid‑style wall/ground traversal, and a focus on “juice & feel” through tightly synced VFX, sound, dashes, and shooting feedback.",    tags: ["C#", "Visual Studio 2022", "Unity"],
    link: "/projects/Splatoon"
  },
   {
    id: 3,
    title: "Platformer Forgivness Mechanics",
    date: "November 2025",
    featured: true,
    category: "Academic",
    video:"/Videos/FM/Thumbnail/FMThumbnailTest.mp4",
    image: "/images/CarlottaWuWaPlaceholder.png",
  description: "A 2D platformer prototype focused on forgiveness mechanics (jump buffer, coyote time, variable jump height etc) with event-driven (& coroutine) checkpoints, respawns, and interactions.",
    tags: ["C#","Unity", "Visual Studio 2022"],
    link: "/projects/ForgivenessMechanics"
  }
 ,  {
    id: 4,
    title: "Tank Combat Encounters",
    date: "December 2024",
    featured: false,
    category: "Academic",
        video:"/Videos/TankGame/Thumbnail/TankGameThumbnailTest.mp4",
    image: "/images/CarlottaWuWaPlaceholder.png",
  description: "An Unreal Engine tank combat playthrough built in Blueprints from a provided framework, featuring multiple enemy types, projectile patterns, and boss encounters.",
    tags: ["Unreal Engine Blueprints", "Visual Studio 2022","Unreal Engine"],
    link: "/projects/TankGame"
  },{
    id: 5,
    title: "Procedural Dungeon Generator (Star-Wars Themed)",
    date: "November 2024",
    featured: false,
    category: "Academic",
            video:"/Videos/StarWarsDungeon/Thumbnail/TextBasedGameThumbnail.mp4",
    image: "/images/StarWarsDungeon/FinsheGame.png",
description:
  "A pure C++, Star‑Wars‑inspired procedural text dungeon that uses a dot‑grid map, random enemy waves and postioning, a coin‑driven shop and inventory system, built to be memory‑safe and input‑robust.",    tags: ["C++", "Visual Studio 2022"],
    link: "/projects/StarWarsDungeon"
  }  , {
    id: 6,
    title: "Slime Dungeon Combat System",
    date: "December 2024",
    featured: false,
    category: "Academic",
    video:"/Videos/TopDownSlime/Thumbnail/SlimeDungeonThumbnail.mp4",
    image: "/images/CarlottaWuWaPlaceholder.png",
description: "A 2D top-down dungeon with four rooms of slime encounters, featuring projectile debuffs, trap-spawning bosses, stamina-based dash, and a lure ability to manage enemy pressure.",
    tags: ["C#","Unity", "Visual Studio 2022"],
    link: "/projects/TopDownSlimeDungeon"
  } ,  
  {
    id: 7,
    title: "Contextual Input Platformer",
    date: "Febuary 2025",
    featured: false,
    category: "Academic",
        video:"/Videos/OneButtonChallenge/Thumbnail/OneButtonPrototypeThumbnail.mp4",
    image: "/images/CarlottaWuWaPlaceholder.png",
    description: "A 3‑week 2D platformer prototype built around a one‑button challenge, where the Spacebar contextually controls double jumps, swinging, wall jumps, and Mario‑style stomp attacks.",
    tags: ["C#","Unity", "Visual Studio 2022"],
    link: "/projects/OneButtonPrototype"
  }
  // , {
  //   id: 8,
  //   title: "Narrative-Prototype",
  //   date: "November 2024",
  //   featured: false,
  //   category: "Academic",
  //   image: "/images/CarlottaWuWaPlaceholder.png",
  //   description: "Solo developed a pure C++ star wars inspired text based dungeon ,with a shop, randomised enemy positions,waves ( the enemies within a wave are randomsie dnever the same), visual dot grid and coins that drop frome enemies when they die   ",
  //   tags: ["C#","Unity", "Visual Studio 2022"],
  //   link: "/projects/ratventure"
  // }
  
]
