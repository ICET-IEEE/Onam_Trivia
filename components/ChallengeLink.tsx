"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface ChallengeLinkProps {
  challengeId: string;
  chapterId: string;
  children: React.ReactNode;
  className?: string;
}

export function ChallengeLink({ challengeId, chapterId, children, className }: ChallengeLinkProps) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function checkAuth() {
      const { data: { user } } = await supabase.auth.getUser();
      setIsAuthenticated(!!user);
      setLoading(false);
    }
    checkAuth();
  }, [supabase.auth]);

  const handleClick = (e: React.MouseEvent) => {
    if (!isAuthenticated) {
      e.preventDefault();
      router.push('/signin');
    }
  };

  if (loading) {
    return (
      <span className={className} style={{ opacity: 0.5 }}>
        {children}
      </span>
    );
  }

  if (isAuthenticated) {
    return (
      <Link 
        href={`/chapters/${chapterId}/challenges/${challengeId}`}
        className={className}
      >
        {children}
      </Link>
    );
  }

  return (
    <button 
      onClick={handleClick}
      className={className}
    >
      {children}
    </button>
  );
}