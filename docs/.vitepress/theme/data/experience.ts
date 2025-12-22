export interface Experience {
  id: number
  date: string
  title: string
  company: string
  description: string[]
  tags: string[]
}

export const experiences: Experience[] = [
{
  id: 1,
  date: "SEP 2024",
  title: "Junior Software Engineer",
  company: "Sidefest | De Montfort University",
  description: [
    "Led the 3D modelling and animation team on a T-Level project to prototype a De Montfort University open day app, collaborating with 4–5 specialist student teams (audio, programming, UI/UX).",
    "Created low-poly humanoid models, rigged and animated them in Blender, and supported Unity implementation by helping set up the character controller for map navigation.",
    "Coordinated task distribution, and provided daily and weekly progress updates to the project supervisor across a 316-hour mandatory placement."
  ],
  tags: ["Blender", "Unity"]
}
  // },
  // {
  //   id: 2,
  //   date: "DEC 2021 - PRESENT",
  //   title: "Dispenserer",
  //   company: "Alfa Chemists",
  //   description: [
  //     "Developed and programmed many games in a variety of genres from tycoons and obstacle courses to simulators using Lua.",
  //     "Focused on gameplay programming and building interactive UI, creating server systems to handle client requests via UI and other events to develop gameplay.",
  //     "Collaborated in a small team to create cohesive and engaging game experiences.",
  //     "Reached ~37,000 players with an average 86% like ratio through iterative design and user testing."
  //   ],
  //   tags: ["Lua", "Roblox Studio"]
  // }
]
