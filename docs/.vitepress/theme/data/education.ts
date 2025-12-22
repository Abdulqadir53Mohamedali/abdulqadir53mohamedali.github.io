export interface Education {
  id: number
  date: string
  qualification: string
  institution: string
  description: string
  tags: string[]
}

export const educations: Education[] = [
  {
    id: 1,
    date: "SEP 2024 - PRESENT",
    qualification: "BSc (Hons) Computer Games Desing & Programming",
    institution: "University of Staffordshire",
    description: "I am a second year (level 5) student studying BSc (Hons) Computer Games Desing & Programming at University of Staffordshire, where I focus primarily on in-engine development work. I work with industry standard tools like Unity and Unreal Engine 5, and have the opportunity to collaborate with artists and designers to build my professional portfolio.",
    tags: ["C++", "C#", "Unreal Engine","Unity"]
  },
  {
    id: 2,
    date: "SEP 2022 - JUN 2024",
    qualification: "T-Level , Digital Design Devleopment & Production",
    institution: "Leiecter College",
  description:"Completed a Level 3 T-Level in Digital Design, Development & Production, learning the languages listed below and studying both the front-end and back-end sides of web development, including security and database integration. Built several mini web applications (such as weather apps and Pokédex-style projects), and for the final exam designed and implemented a safari booking website with full documentation: user research, flowcharts, class diagrams, testing plans, evaluation and iteration. As part of the T-Level industry placement, completed a 316-hour project-based placement working in multidisciplinary teams to prototype a university open day app.",    
  tags: ["PHP", "HTML", "CSS","JS","Bootsrap","MySQL","Python"]
  }
]
