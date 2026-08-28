"use client";

import { useState } from "react";

interface ChallengeImageProps {
  imageUrl: string;
  title: string;
}

export function ChallengeImage({ imageUrl, title }: ChallengeImageProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="mt-8 rounded-xl overflow-hidden border border-ivory-line shadow-sm">
      {imageError && (
        <p className="text-xs text-red-500 p-2 break-all">
          DEBUG URL (failed to load): {imageUrl}
        </p>
      )}
      <img
        src={imageUrl}
        alt={title}
        className="w-full h-auto max-h-[500px] object-contain bg-ivory-deep/30"
        onError={() => setImageError(true)}
        onLoad={() => setImageError(false)}
      />
    </div>
  );
}