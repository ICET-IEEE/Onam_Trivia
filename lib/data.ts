import { Chapter, LeaderboardTeam, Feature, TeamSkill } from "./types";

export const chapters: Chapter[] = [
  {
    number: "01",
    title: "The Golden Age",
    description:
      "Enter the legendary kingdom of Mahabali and prove your knowledge of his golden reign.",
    difficulty: "Easy",
    type: "Lore / Trivia",
    challenges: 5,
    status: "available",
    progress: 100,
  },
  {
    number: "02",
    title: "Vamana's Disguise",
    description:
      "Not everything is what it seems. Decode the disguises and uncover hidden messages.",
    difficulty: "Easy → Medium",
    type: "Cipher / Pattern / Visual",
    challenges: 6,
    status: "locked",
    progress: 0,
  },
  {
    number: "03",
    title: "The Three Steps",
    description:
      "Three challenges. Three steps. Every answer brings you closer to the final revelation.",
    difficulty: "Medium → Hard",
    type: "Multi-stage",
    challenges: 3,
    status: "locked",
    progress: 0,
  },
  {
    number: "04",
    title: "The Return",
    description:
      "Gather everything you have discovered and face the final trial.",
    difficulty: "Hard",
    type: "Final Challenge",
    challenges: 1,
    status: "locked",
    progress: 0,
  },
];

export const leaderboard: LeaderboardTeam[] = [
  { rank: 1, team: "Team Mahabali", score: 950, progress: 100, lastSolved: "The Golden Age" },
  { rank: 2, team: "Asura Protocol", score: 820, progress: 80, lastSolved: "Vamana's Disguise" },
  { rank: 3, team: "Three Steps Ahead", score: 760, progress: 70, lastSolved: "Vamana's Disguise" },
  { rank: 4, team: "Vamana.exe", score: 690, progress: 60, lastSolved: "The Golden Age" },
  { rank: 5, team: "Golden Lotus", score: 610, progress: 55, lastSolved: "The Golden Age" },
];

export const features: Feature[] = [
  {
    title: "Lore",
    description: "Decode the stories, legends, and traditions of Mahabali's reign.",
    icon: "scroll",
  },
  {
    title: "Disguise",
    description: "Break patterns, decipher clues, and uncover what hides beneath the surface.",
    icon: "eye",
  },
  {
    title: "Discovery",
    description: "Search, inspect, connect the clues, and take the Three Steps.",
    icon: "puzzle",
  },
];

export const teamSkills: TeamSkill[] = [
  { emoji: "📜", label: "Lore Keeper", description: "Knows every legend by heart." },
  { emoji: "🧩", label: "Puzzle Solver", description: "Sees the pattern first." },
  { emoji: "💻", label: "Code Breaker", description: "Reads what's hidden in the system." },
  { emoji: "👁️", label: "Observer", description: "Notices what others walk past." },
];
