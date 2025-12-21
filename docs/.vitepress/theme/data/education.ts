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
    tags: ["C++", "C#", "Unreal Engine 5, Unity"]
  },
  {
    id: 2,
    date: "SEP 2022 - JUN 2024",
    qualification: "T-Level , Digital Design Devleopment & Production",
    institution: "Leiecter College",
    description: "I completed a T-Level Level 3 in Dgital Design Development & Production, leanrning the langauges specified below , I learnt the inner and outer working of web devleopment , nto just visuals but laos the secruity and database side fo it and hwo toimplement this, developing various mini website such as wetaher apps , pokedexes etc . During the final exam we were tasked with creating , desinging a safar website , sp full on flowcharts , class diagrams , testing consdierations, user feedback , evaulation etc  ",
    tags: ["PHP", "HTML", "CSS","JS","Bootsrap","MySQL","Python"]
  }
]
