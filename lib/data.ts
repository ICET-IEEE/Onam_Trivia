import { Chapter, LeaderboardTeam, Feature, TeamSkill } from "./types";


export const leaderboard: LeaderboardTeam[] = [];

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
