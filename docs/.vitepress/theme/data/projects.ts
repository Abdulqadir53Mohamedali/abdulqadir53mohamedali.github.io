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
    title: "Paint Training Course",
    date: "November 2025",
    featured: true,
    category: "Academic",
    video:"/Videos/Paint/Thumbnail/PaintThumbnailTest2.mp4",
    image: "/images/CarlottaWuWaPlaceholder.png",
    description: "A first-person UES prototype, where the player makes use of different paint colours to traverse the testing grounds",
    tags: ["C++", "Unreal Engine", "Unreal Blueprints", "Jetbrains Rider"],
    link: '/projects/Paint'
  },
  {
    id: 2,
    title: "Splatoon Inspired, Juice & Feel",
    date: "November 2025",
    featured: true,
    category: "Academic",
        video:"/Videos/Splatoon/Thumbnail/SplatoonThumnail.mp4",
    image: "/images/CarlottaWuWaPlaceholder.png",
    description: "A 2D side scroller where we were tasked with creating a charcter with an ability or two focusing on game juicines & feel ( Audio , Partilces , Smoothness)",
    tags: ["C#", "Visual Studio 2022", "Unity"],
    link: "/projects/Splatoon"
  },
   {
    id: 3,
    title: "Forgivness Mechanics",
    date: "November 2025",
    featured: true,
    category: "Academic",
    video:"/Videos/FM/Thumbnail/FMThumbnailTest.mp4",
    image: "/images/CarlottaWuWaPlaceholder.png",
  description: "A 2D platformer prototype focused on forgiveness mechanics (jump buffer, coyote time, variable jump height etc) with event-driven checkpoints, respawns, and interactions.",
    tags: ["C#","Unity", "Visual Studio 2022"],
    link: "/projects/ForgivenessMechanics"
  }
 ,  {
    id: 4,
    title: "Tank Game",
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
    title: "Procedural Star Wars Text Based Dungeon",
    date: "November 2024",
    featured: false,
    category: "Academic",
            video:"/Videos/StarWarsDungeon/Thumbnail/TextBasedGameThumbnail.mp4",
    image: "/images/StarWarsDungeon/FinsheGame.png",
    description: "A memory efficient & robust pure C++ star wars inspired procedural text based dungeon ,with a shop, randomised enemy positions, and waves every run , visual dot grid and coins",
    tags: ["C++", "Visual Studio 2022"],
    link: "/projects/StarWarsDungeon"
  }  , {
    id: 6,
    title: "Top-down slime dungeon",
    date: "December 2024",
    featured: false,
    category: "Academic",
    video:"/Videos/TopDownSlime/Thumbnail/SlimeDungeonThumbnail.mp4",
    image: "/images/CarlottaWuWaPlaceholder.png",
description: "A 2D top-down dungeon brawler with four rooms of slime encounters, featuring projectile debuffs, trap-spawning bosses, stamina-based dash, and a lure ability to manage enemy pressure.",
    tags: ["C#","Unity", "Visual Studio 2022"],
    link: "/projects/TopDownSlimeDungeon"
  } ,  
  {
    id: 7,
    title: "One-Button Challenge",
    date: "Febuary 2025",
    featured: false,
    category: "Academic",
        video:"/Videos/OneButtonChallenge/Thumbnail/OneButtonPrototypeThumbnail.mp4",
    image: "/images/CarlottaWuWaPlaceholder.png",
    description: "A 3-week prototpye where we were challenged with makign multiple mechanics all through one button",
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
