export const SITE = {
  name: "Mark Bjornsgaard",
  title: "Mark Bjornsgaard — The Idea Drug",
  description:
    "Author of The Idea Drug, founder of System Two. Ideas are killing innovation — here's how to stop using them.",
  url: "https://markbjornsgaard.com",
  book: {
    title: "The Idea Drug",
    subtitle: "Why Ideas Are Killing Innovation and How to Stop Using Them",
    publisher: "Lowell & Pearce",
    tagline: "Because Someone Will",
    launchDate: "June 8th 2026",
  },
  social: {
    linkedin: "https://www.linkedin.com/in/mark-bjornsgaard/",
    spotify: "https://open.spotify.com/artist/49sAZLRBJgtum6oW6pjrrT?si=bBx8BLF1QkaAb3tZnOu7qA",
  },
  footer: {
    text: "© 2026 System Two Group",
  },
  nav: [
    { label: "The Idea Drug", href: "/the-idea-drug" },
    { label: "System Two", href: "/system-two" },
    { label: "Thinking", href: "/thinking" },
  ],
  navRight: [{ label: "Contact", href: "/contact" }],
} as const;
