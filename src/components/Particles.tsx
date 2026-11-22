import { useEffect, useRef } from 'react';

interface Mote {
  x: number;
  y: number;
  r: number;
  vx: number;
  vy: number;
  phase: number;
  speed: number;
}

/** Едва заметные золотые частицы, всплывающие в воздухе первого экрана. */
export function Particles({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let w = 0;
    let h = 0;
    let raf = 0;
    let motes: Mote[] = [];
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const seed = () => {
      const count = Math.round(Math.min(110, (w * h) / 16000));
      motes = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: 0.5 + Math.random() * 1.4,
        vx: (Math.random() - 0.5) * 0.08,
        vy: -(0.04 + Math.random() * 0.16),
        phase: Math.random() * Math.PI * 2,
        speed: 0.4 + Math.random() * 0.9,
      }));
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    };

    let t = 0;
    const draw = () => {
      t += 0.008;
      ctx.clearRect(0, 0, w, h);
      for (const m of motes) {
        m.x += m.vx + Math.sin(t * m.speed + m.phase) * 0.06;
        m.y += m.vy;
        if (m.y < -6) {
          m.y = h + 6;
          m.x = Math.random() * w;
        }
        if (m.x < -6) m.x = w + 6;
        if (m.x > w + 6) m.x = -6;
        const twinkle = 0.5 + 0.5 * Math.sin(t * 2 * m.speed + m.phase);
        const alpha = 0.05 + twinkle * 0.22;
        ctx.beginPath();
        ctx.arc(m.x, m.y, m.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(214, 178, 111, ${alpha.toFixed(3)})`;
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener('resize', resize);
    if (!reduced) {
      raf = requestAnimationFrame(draw);
    } else {
      // статичный кадр для prefers-reduced-motion
      ctx.clearRect(0, 0, w, h);
      for (const m of motes) {
        ctx.beginPath();
        ctx.arc(m.x, m.y, m.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(214, 178, 111, 0.12)';
        ctx.fill();
      }
    }

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={className ?? 'pointer-events-none absolute inset-0 h-full w-full'}
    />
  );
}
