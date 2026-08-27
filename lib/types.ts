export type ChapterStatus = "available" | "locked" | "completed";

export interface Chapter {
  number: string;
  title: string;
  description: string;
  difficulty: string;
  type: string;
  challenges: number;
  status: ChapterStatus;
  progress: number;
}

export interface LeaderboardTeam {
  rank: number;
  team: string;
  score: number;
  progress: number;
  lastSolved: string;
}

export interface Feature {
  title: string;
  description: string;
  icon: "scroll" | "eye" | "puzzle";
}

export interface TeamSkill {
  emoji: string;
  label: string;
  description: string;
}
