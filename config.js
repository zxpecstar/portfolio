/* =====================================================================
   PORTFOLIO TEMPLATE — YOUR CONTENT LIVES HERE
   ---------------------------------------------------------------------
   Edit the values below and save. You don't need to touch index.html,
   404.html, style.css or script.js.

   Tips
   - Keep the quotes ("...") and commas exactly as they are.
   - To hide a section, empty it: work.items: [], about.paragraphs: [],
     contact.links: [], etc.
   - Use &amp; for an ampersand inside text (or just write "and").
   ===================================================================== */

window.SITE = {

  /* ---------- BASICS ---------- */

  name: "Your Name",                 // shown top-left and in the footer
  siteTitle: "Your Name",            // browser tab title
  description: "Portfolio of Your Name — web developer and designer.", // search/social preview text
  // NOTE: link previews (X, Slack, Discord) and some crawlers don't run JavaScript, so they read the
  // <head> of index.html instead. Update the title, description and og:/twitter: tags there too.
  lang: "en",                        // page language code
  homeUrl: "",                       // where "Back to homepage" on the 404 page points.
                                     // Leave empty: it's detected automatically.

  /* ---------- LOOK & FEEL ---------- */

  theme: {
    paper:  "#FAFAF8",   // page background
    ink:    "#17181B",   // main text
    gray:   "#6B6E76",   // secondary text
    line:   "#E4E3DD",   // divider lines
    accent: "#2451B5"    // links and highlights
  },

  // Any font from fonts.google.com. Set to "" to use system fonts.
  googleFont: "Instrument Sans",


  /* ---------- NAVIGATION ---------- */
  // Links are generated automatically from the sections you fill in.
  // Rename them here if you like.

  nav: {
    work: "Work",
    about: "About",
    contact: "Contact"
  },


  /* ---------- HERO (top of the page) ---------- */

  hero: {
    headline: "Your one-line pitch: what you do and who you do it for.",
    intro: "Two or three sentences about you. What you build, what you care about, and what you're working on right now.",

    // Small facts under the intro. Add, remove or reorder freely (or use [] for none).
    meta: [
      { label: "Building",      value: "What you're working on" },
      { label: "Interested in", value: "Topics you love" },
      { label: "Based in",      value: "City, Country" }
    ]
  },


  /* ---------- WORK ---------- */

  work: {
    title: "Selected work",
    // Small label opposite the heading. {count} becomes the number of projects.
    // Set label to "" to hide it, or write your own text, e.g. "Since 2020".
    label: "{count} projects",
    labelOne: "{count} project",       // used when you have exactly one

    items: [
      {
        year: "20XX",                    // any short text works: "2026", "2024–25", "Now"
        title: "Project One",
        url: "https://example.com",      // set to "" for no link
        description: "A short sentence or two about this project and what makes it interesting.",
        tag: "Active"                    // shown on the right: status, role, tech, anything short
      },
      {
        year: "20XX",
        title: "Project Two",
        url: "https://example.com",
        description: "Another project. Keep descriptions brief; visitors skim.",
        tag: "Shipped"
      },
      {
        year: "20XX",
        title: "Project Three",
        url: "",
        description: "A project without a link, for example client work or something in progress.",
        tag: "Private"
      }
    ]
  },


  /* ---------- ABOUT ---------- */

  about: {
    title: "About",
    paragraphs: [
      "Introduce yourself: who you are, where you're based, and what you do.",
      "Describe your approach, your interests, and what makes your work yours.",
      "Add something personal or lighter here. (Optional; delete this line to remove it.)"
    ],
    // The last paragraph is shown in a softer gray. Set to false to make all paragraphs the same colour.
    fadeLastParagraph: true,

    skillsLabel: "Things I work with:",
    skills: ["HTML", "CSS", "JavaScript", "Design", "Writing"]   // use [] to hide
  },


  /* ---------- CONTACT ---------- */

  contact: {
    heading: "Want to get in touch?",
    email: "hello@example.com",          // set to "" to hide
    links: [                             // add, remove or rename as you like
      { label: "GitHub",   url: "https://github.com/your-username" },
      { label: "LinkedIn", url: "https://linkedin.com/in/your-username" },
      { label: "Bluesky",  url: "https://bsky.app/profile/your-handle" }
    ]
  },


  /* ---------- FOOTER ---------- */

  footer: {
    left: "Your Name, {year}",     // {year} fills in the current year automatically
    right: "City, Country"
  },


  /* ---------- 404 PAGE ---------- */

  notFound: {
    code: "404 — Page not found",
    headline: "This page doesn't exist, or it's been moved somewhere else.",
    text: "You might have followed a broken link, or the page may have been renamed. Either way, there's nothing here.",
    button: "Back to homepage"
  }

};
