
"use client";

import { Banknote } from "lucide-react";
import { useEffect, useState } from "react";

export default function Loading() {
  const [elements, setElements] = useState<{ id: number; left: string; delay: string; duration: string }[]>([]);

  useEffect(() => {
    // Generate random floating elements only on client to avoid hydration mismatch
    const newElements = Array.from({ length: 12 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 5}s`,
      duration: `${6 + Math.random() * 4}s`,
    }));
    setElements(newElements);
  }, []);

  return (
    <div className="fixed inset-0 bg-[#F8F6F2] flex flex-col items-center justify-center overflow-hidden">
      {/* Floating Elements Container */}
      <div className="absolute inset-0 pointer-events-none">
        {elements.map((el) => (
          <div
            key={el.id}
            className="absolute bottom-[-100px] animate-float-up opacity-0"
            style={{
              left: el.left,
              animationDelay: el.delay,
              animationDuration: el.duration,
            }}
          >
            <Banknote className="w-8 h-8 text-primary/20 rotate-12" />
          </div>
        ))}
      </div>

      {/* Center Logo & Progress */}
      <div className="relative z-10 flex flex-col items-center">
        <div className="w-16 h-16 bg-primary rounded-[2rem] flex items-center justify-center text-white shadow-2xl shadow-primary/30 mb-6 animate-pulse">
          <Banknote className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-extrabold tracking-tight text-[#111111]">
          TeenTrack
        </h2>
        <div className="mt-4 w-32 h-1 bg-muted rounded-full overflow-hidden">
          <div className="h-full bg-primary w-1/2 animate-[loading-bar_2s_ease-in-out_infinite]" />
        </div>
      </div>
    </div>
  );
}
