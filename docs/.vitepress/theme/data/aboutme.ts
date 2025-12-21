export interface AboutMeData {
  title: string
  paragraphs: string[]
  education: {
    institution: string
    institutionUrl: string
    course: string
    courseUrl: string
  }
}

export const aboutMeData: AboutMeData = {
  title: "About Me",
  paragraphs: [
    "I am a programmer with a passion for game development and creating game mechanics. I have a growing interest in UI creation and implementation, as well as AI in games, and enjoy continiously increasing my knowlegde and soon to be implementation in these areas. ",
    
    "Currently I am a student at University of Staffordshire, studying BSc (Hons) Games Design & Programming.",
    
    "Alongside my studies, I am working on some smaller side projects which are still in the works.",
    
    "When I'm not studying, I enjoy playing video games, Warhammer with myth soceity, Debates at Star Wars society, and creating smaller personal projects like games, mechanics, scripts and tools, to continue learning and improving my skills."
  ],
  education: {
    institution: "University of Staffordshire",
    institutionUrl: "https://www.staffs.ac.uk/",
    course: "BSc (Hons) Games Design & Programming",
    courseUrl: "https://www.staffs.ac.uk/course/computer-games-design-programming-bsc"
  }
}
