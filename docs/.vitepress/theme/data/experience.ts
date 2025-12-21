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
    company: "Sidefest | De-Montfort University",
    description: [
      "Developed a prototype open day app for the university , using Agile Methodolgy , UI & UX design, 4 different teams , I was 3D modelling & Animation team lead ( based on vote), ",
      "The Development team creeatign the actual open day app exmained ours to see how peole our age viewed and tookon this priject ot then ensure the best / most optimal open day app was created for the university , 316 hours in total"
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
