// import { defineConfig } from 'vitepress'

// // https://vitepress.dev/reference/site-config
// export default defineConfig({
//     base: '/',

//   title: "Abdulqadir Mohamedali Portfolio",
//   description: "Game Dev Portfolio",
//           appearance: 'dark',  // ← ADD THIS LINE

//   themeConfig: {

//     // https://vitepress.dev/reference/default-theme-config
//     nav: [
//       { text: 'Home', link: '/' },
//       { text: 'Projects', link: '/projects' },
//     ],

// // sidebar: {
// //   // Sidebar used for all pages whose path starts with /projects/
// //   '/projects/': [
// //     {
// //       text: 'On this project',
// //       items: [
// //         // These #ids come from your headings in the markdown
// //         { text: 'Overview',          link: '#overview' },
// //         { text: 'Features Showcase', link: '#features-showcase' },
// //         // Add more shared sections if you want:
// //         // { text: 'Development Notes', link: '#development-notes' },
// //         // { text: 'Learnings',         link: '#learnings' },
// //       ]
// //     }
// //   ],
// //   },
//       docFooter: {
//       prev: false,
//       next: false
//     },

//     socialLinks: [
//       { icon: 'github', link: 'https://github.com/Abdulqadir53Mohamedali' },
//         { icon: 'linkedin', link: 'https://www.linkedin.com/in/abdulqadir-mohamedali-46b534287/' }

      
//     ]
//   }
// })
import { defineConfig } from 'vitepress'

export default defineConfig({
  base: '/',
  title: "Abdulqadir Mohamedali Portfolio",
  description: "Game Dev Portfolio",
  appearance: 'force-dark',

  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Projects', link: '/projects' },
    ],

    docFooter: {
      prev: false,
      next: false
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/Abdulqadir53Mohamedali' },
      { icon: 'linkedin', link: 'https://www.linkedin.com/in/abdulqadir-mohamedali-46b534287/' }
    ]
  }
})