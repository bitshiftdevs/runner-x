"use client";

import { useCallback, useRef, useState } from "react";

type SlideToAcceptProps = {
  label?: string;
  onAccept: () => void;
};

export function SlideToAccept({
  label = "DRAG HANDLE TO START",
  onAccept,
}: SlideToAcceptProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const handleMove = useCallback(
    (clientX: number) => {
      if (!isDragging || !trackRef.current) return;
      const track = trackRef.current;
      const rect = track.getBoundingClientRect();
      const x = Math.max(
        0,
        Math.min(clientX - rect.left - 28, rect.width - 56),
      );
      setProgress(x / (rect.width - 56));
    },
    [isDragging],
  );

  const handleEnd = useCallback(() => {
    if (!isDragging) return;
    setIsDragging(false);
    if (progress > 0.9) {
      setProgress(1);
      onAccept();
    } else {
      setProgress(0);
    }
  }, [isDragging, progress, onAccept]);

  return (
    <div className="space-y-sm">
      <p className="font-mono text-sm text-on-surface-variant uppercase">
        SLIDE TO ACCEPT MISSION
      </p>
      <div
        ref={trackRef}
        role="slider"
        aria-label="Slide to accept mission"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(progress * 100)}
        tabIndex={0}
        className="relative w-full h-16 bg-surface-container-high rounded-full border border-outline-variant overflow-hidden group"
        onMouseMove={(e) => handleMove(e.clientX)}
        onMouseUp={handleEnd}
        onMouseLeave={handleEnd}
        onTouchMove={(e) => handleMove(e.touches[0].clientX)}
        onTouchEnd={handleEnd}
      >
        <div
          className={`absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-secondary rounded-full transition-[width] ${isDragging ? "duration-0" : "duration-300"}`}
          style={{ width: `${progress * 100}%` }}
        />
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="font-mono text-sm text-on-surface-variant group-hover:text-primary transition-colors">
            {label}
          </span>
        </div>
        <button
          type="button"
          aria-label="Drag handle"
          className={`absolute top-1 bottom-1 w-14 bg-white rounded-full flex items-center justify-center cursor-pointer shadow-xl z-10 transition-[left] ${isDragging ? "duration-0" : "duration-300"}`}
          style={{ left: `${4 + progress * (100 - 15)}%` }}
          onMouseDown={() => setIsDragging(true)}
          onTouchStart={() => setIsDragging(true)}
        >
          <span className="material-symbols-outlined text-background">
            chevron_right
          </span>
        </button>
      </div>
    </div>
  );
}
