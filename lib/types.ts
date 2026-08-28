export interface Chapter {
  id: string;
  chapter_number: string;
  title: string;
  description: string;
  difficulty?: string;
  type?: string;
  status?: string;
  progress?: number;
  is_published: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Profile {
  id: string;
  full_name: string;
  mobile_number: string;
  avatar_url: string;
  role: "player" | "admin";
  created_at?: string;
  updated_at?: string;
}

export interface Challenge {
  id: string;
  chapterId: string;
  title: string;
  description: string;
  points: number;
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
