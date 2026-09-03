export interface Chapter {
  id: string;
  chapter_number: string;
  title: string;
  description: string;
  difficulty?: string;
  status?: string;
  is_published: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface College {
  id: string;
  name: string;
  normalized_name?: string;
  is_verified: boolean;
  created_at?: string;
}

export interface Profile {
  id: string;
  full_name: string;
  mobile_number: string;
  avatar_url: string;
  role: "player" | "admin";
  college_id?: string | null;
  email?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Challenge {
  id: string;
  chapter_id: string;
  title: string;
  description?: string;
  question?: string;
  type: string;
  difficulty: string;
  points: number;
  image_url?: string;
  audio_url?: string;
  video_url?: string;
  flag_hash?: string; // DEPRECATED: Use challenge_answers table
  hint?: string;
  is_published: boolean;
  order_number: number;
  created_at?: string;
  updated_at?: string;
}

export interface ChallengeAnswer {
  id: string;
  challenge_id: string;
  answer_hash: string;
  created_at?: string;
}

export interface LeaderboardTeam {
  rank: number;
  team: string;
  score: number;
  progress: number;
  lastSolved: string;
}

export interface UserProgress {
  userId: string;
  name: string;
  score: number;
  challengesSolved: number;
  totalChallenges: number;
  chaptersCompleted: number;
  completedChapterNumbers?: string[];
  totalChapters: number;
  latestSolveTime?: number;
  mobileNumber?: string;
  collegeName?: string | null;
  email?: string;
  createdAt?: string;
}

export interface ChallengeSolverDetails {
  userName: string;
  collegeName: string | null;
  solvedAt: string;
}

export interface FirstSolver {
  challengeId: string;
  challengeTitle: string;
  chapterNumber: string;
  orderNumber?: number;
  userName: string | null;
  solvedAt: string | null;
  solvers: ChallengeSolverDetails[];
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
