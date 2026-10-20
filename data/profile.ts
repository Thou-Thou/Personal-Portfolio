// Edit everything about the portfolio here.

export const profile = {
  name: "Met Chanthou",
  initials: "MC",
  role: "Frontend developer",
  location: "Phnom Penh, Cambodia",
  status: "Open to new projects",
  yearsLabel: "4.5+",
  email: "chhanthoumet025@example.com", // TODO: your email
  phone: "096 2446 8824",
  phoneHref: "tel:+8559624468824",
  github: "https://github.com/", // TODO: your GitHub or LinkedIn
};

export const typedWords = [
  "Vue", "React", "Next.js", "Angular", "TypeScript", "Node.js", "Express", "MongoDB", "Tailwind CSS",
];

export const skillGroups: { title: string; items: string[] }[] = [
  { title: "Frameworks", items: ["Vue", "React", "Next.js", "Angular"] },
  { title: "Languages", items: ["JavaScript", "TypeScript"] },
  { title: "Backend", items: ["Node.js", "Express"] },
  { title: "Database", items: ["MongoDB"] },
  { title: "Markup & styling", items: ["HTML", "CSS", "Tailwind CSS"] },
  { title: "Design", items: ["Figma"] },
  { title: "AI tools", items: ["ChatGPT", "Claude AI"] },
];

export const learningNote =
  "I make a habit of researching new technologies and frameworks, then trying them in small projects before bringing them into real work.";

// Newest first: the first job is shown as the latest commit (HEAD) in experience.log
export const jobs = [
  {
    company: "Intechdevkh",
    duration: "3 years",
    description:
      "Built web applications with Vue, React, Next.js and Angular, from public websites to ticket sales platforms and admin dashboards.",
  },
  {
    company: "EDF",
    duration: "1 year 6 months",
    description:
      "Frontend development with modern JavaScript frameworks, building and maintaining user-facing features.",
  },
];

export type ProjectIcon = "ticket" | "globe" | "pos" | "report" | "services" | "star";

// The first project is shown as the large "Featured project" tile
export const projects: {
  title: string;
  description: string;
  tags: string[];
  icon: ProjectIcon;
  link?: string; // adds a ↗ link to the tile
}[] = [
  {
    title: "Angkor Enterprise: AE Online Sale Ticket & Admin",
    description:
      "An online ticket sales platform for visitors, paired with an admin dashboard for managing tickets, sales and reporting.",
    tags: ["Customer app", "Admin dashboard", "Payments"],
    icon: "ticket",
    link: "https://ticket.angkorenterprise.gov.kh/auth/login",
  },
  {
    title: "Angkor Enterprise Website",
    description:
      "The public website for Angkor Enterprise, built to be fast, responsive and easy to navigate on any device.",
    tags: ["Public website", "Responsive"],
    icon: "globe",
    link: "https://angkorenterprise.gov.kh/",
  },
  {
    title: "AE POS learning process flow",
    description:
      "Mapping and building the process flow for a point-of-sale startup, from sale to checkout.",
    tags: ["Startup", "POS", "Process flow"],
    icon: "pos",
  },
  {
    title: "AE POS report",
    description:
      "A reporting system for managing POS sales, so managers can track sales and performance in one place.",
    tags: ["Reporting", "POS", "Management"],
    icon: "report",
  },
  {
    title: "MISTI Services",
    description:
      "An online services platform for MISTI, built as a set of micro systems so each service can be developed and run independently.",
    tags: ["Micro systems", "Public services", "Web app"],
    icon: "services",
    link: "https://services.misti.gov.kh/",
  },
];

export const education = [
  {
    years: "2023–2025",
    school: "Asia Euro University (AEU)",
    detail: "Higher education in information technology.",
  },
  {
    years: "2019–2021",
    school: "Passerelles Numériques Cambodia (PNC)",
    detail: "Intensive training in web development and IT.",
  },
];
