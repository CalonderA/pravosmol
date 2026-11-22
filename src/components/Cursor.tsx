import { useEffect, useRef } from 'react';

/** Минималистичный курсор: золотая точка + отстающее кольцо. Активен только на точных указателях.
 *  Над нативными выпадающими списками (select) прячется — там работает обычный курсор. */
export function Cursor() {
  const rootRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!fine || reduced) return;

    document.body.dataset.cursor = 'on';
    const root = rootRef.current!;
    const dot = dotRef.current!;
    const ring = ringRef.current!;

    let x = -100;
    let y = -100;
    let rx = -100;
    let ry = -100;
    let hovering = false;
    let overSelect = false;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      x = e.clientX;
      y = e.clientY;
      dot.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
      const t = e.target as HTMLElement | null;
      const interactive = t?.closest('a, button, input, textarea, select, label, [data-cursor-hover]');
      if (!!interactive !== hovering) {
        hovering = !!interactive;
        ring.dataset.hover = hovering ? 'on' : 'off';
      }
      // над select отдаём управление нативному курсору
      const selectHover = !!t?.closest('select');
      if (selectHover !== overSelect) {
        overSelect = selectHover;
        root.style.opacity = overSelect ? '0' : '1';
        document.body.dataset.cursor = overSelect ? 'off' : 'on';
      }
    };

    const loop = () => {
      rx += (x - rx) * 0.16;
      ry += (y - ry) * 0.16;
      ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    raf = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf);
      delete document.body.dataset.cursor;
    };
  }, []);

  return (
    <div
      ref={rootRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[90] hidden transition-opacity duration-300 [@media(pointer:fine)]:block"
    >
      {/* кольцо */}
      <div
        ref={ringRef}
        data-hover="off"
        className="absolute left-0 top-0 h-9 w-9 rounded-full border border-gold/45 transition-[width,height,opacity,border-color] duration-300 ease-luxe data-[hover=on]:h-14 data-[hover=on]:w-14 data-[hover=on]:border-gold/80 data-[hover=on]:bg-gold/5"
      />
      {/* точка */}
      <div ref={dotRef} className="absolute left-0 top-0 h-1.5 w-1.5 rounded-full bg-gold-bright" />
    </div>
  );
}
