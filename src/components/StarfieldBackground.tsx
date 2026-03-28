import React, { useEffect, useRef } from "react";

export const StarfieldBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let stars: { x: number; y: number; size: number; speed: number; opacity: number }[] = [];
    const starCount = 60; // Reduced for performance

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initStars();
    };

    const initStars = () => {
      stars = [];
      for (let i = 0; i < starCount; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 1.5 + 0.5,
          speed: Math.random() * 0.05 + 0.02,
          opacity: Math.random(),
        });
      }
    };

    const draw = () => {
      ctx.fillStyle = "#05020a";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      stars.forEach((star) => {
        ctx.fillStyle = star.size > 1.5 ? `rgba(212, 175, 55, ${star.opacity})` : `rgba(255, 255, 255, ${star.opacity})`;
        ctx.fillRect(star.x, star.y, star.size, star.size); // Use fillRect instead of arc for speed

        star.y -= star.speed;
        star.x += star.speed * 0.1;
        
        if (star.y < 0) star.y = canvas.height;
        if (star.x > canvas.width) star.x = 0;
        
        star.opacity += (Math.random() - 0.5) * 0.01;
        if (star.opacity < 0.1) star.opacity = 0.1;
        if (star.opacity > 0.7) star.opacity = 0.7;
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    window.addEventListener("resize", resize);
    resize();
    draw();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none"
    />
  );
};
