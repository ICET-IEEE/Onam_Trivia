import { Chapter, LeaderboardTeam, Feature, TeamSkill } from "./types";


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
