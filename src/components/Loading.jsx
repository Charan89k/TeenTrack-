import { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";

export default function Loading({ onComplete }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          if (onComplete) {
            // Tiny delay for a smooth transition after hitting 100%
            setTimeout(onComplete, 300);
          }
          return 100;
        }
        // Realistic step-wise progress updates
        const increment = Math.floor(Math.random() * 12) + 4;
        return Math.min(100, prev + increment);
      });
    }, 80);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-background flex flex-col items-center justify-center overflow-hidden z-50">
      <div className="flex flex-col items-center max-w-xs w-full px-4">
        {/* Pulsing Central Logo */}
        <img 
          src="/logo.png" 
          alt="TeenTrack Logo" 
          className="w-48 h-48 object-contain mb-8 animate-pulse" 
        />
        
        {/* Progress Bar & Percentage Indicators */}
        <div className="w-full space-y-3">
          <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-primary font-mono">
            <span>HYDRATING STATE</span>
            <span>{progress}%</span>
          </div>
          <Progress value={progress} className="h-1 bg-muted rounded-full overflow-hidden" />
        </div>
      </div>
    </div>
  );
}
