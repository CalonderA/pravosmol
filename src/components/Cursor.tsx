import { useEffect, useRef } from 'react';

/** Минималистичный курсор: золотая точка + кольцо-спутник.
 *  - Точка движется мгновенно, кольцо — с лёгким «дорогое» затуханием (0.3, не тягучим)
 *  - Над нативными списками (select) прячется: там работает системный курсор
 *  - Восстанавливается сразу после выбора опции (change / pointerdown), а не при следующем движении
 *  - Скрывается при уходе курсора за окно — не «застывает» у края */
export function Cursor() {
  const rootRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!fine || reduced) return;

    const root = rootRef.current!;
    const dot = dotRef.current!;
    const ring = ringRef.current!;
    document.body.dataset.cursor = 'on';

    let x = -100;
    let y = -100;
    let rx = -100;
    let ry = -100;
    let hovering = false;
    let nativeCursor = false;
    let raf = 0;

    const applyRoot = () => {
      const hidden = nativeCursor || document.hidden;
      root.style.opacity = hidden ? '0' : '1';
      document.body.dataset.cursor = nativeCursor ? 'off' : 'on';
    };

    const onMove = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      dot.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
      const t = e.target as HTMLElement | null;
      const interactive = t?.closest('a, button, input, textarea, select, label, [data-cursor-hover]');
      if (!!interactive !== hovering) {
        hovering = !!interactive;
        ring.dataset.hover = hovering ? 'on' : 'off';
      }
      const overSelect = !!t?.closest('select');
      if (overSelect !== nativeCursor) {
        nativeCursor = overSelect;
        applyRoot();
      }
    };

    // выбор опции в списке: вернуть кольцо сразу, не дожидаясь движения мыши
    const onSelectChange = () => {
      nativeCursor = false;
      applyRoot();
    };

    // клик мимо списка тоже возвращает кольцо
    const onPointerDown = (e: PointerEvent) => {
      if (!(e.target as HTMLElement | null)?.closest('select') && nativeCursor) {
        nativeCursor = false;
        applyRoot();
      }
    };

    // курсор ушёл за пределы окна — кольцо не должно висеть у края
    const onLeave = () => {
      root.style.opacity = '0';
    };
    const onEnter = () => {
      if (!nativeCursor) root.style.opacity = '1';
    };
    const onVisibility = () => applyRoot();

    const loop = () => {
      rx += (x - rx) * 0.3;
      ry += (y - ry) * 0.3;
      ring.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%)`;
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('change', onSelectChange, true);
    document.addEventListener('pointerdown', onPointerDown, true);
    document.addEventListener('mouseleave', onLeave);
    document.addEventListener('mouseenter', onEnter);
    document.addEventListener('visibilitychange', onVisibility);
    raf = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('change', onSelectChange, true);
      document.removeEventListener('pointerdown', onPointerDown, true);
      document.removeEventListener('mouseleave', onLeave);
      document.removeEventListener('mouseenter', onEnter);
      document.removeEventListener('visibilitychange', onVisibility);
      cancelAnimationFrame(raf);
      delete document.body.dataset.cursor;
    };
  }, []);

  return (
    <div
      ref={rootRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[90] hidden transition-opacity duration-200 [@media(pointer:fine)]:block"
    >
      {/* кольцо */}
      <div
        ref={ringRef}
        data-hover="off"
        className="absolute left-0 top-0 h-9 w-9 rounded-full border border-gold/45 will-change-transform transition-[width,height,opacity,border-color] duration-300 ease-luxe data-[hover=on]:h-14 data-[hover=on]:w-14 data-[hover=on]:border-gold/80 data-[hover=on]:bg-gold/5"
      />
      {/* точка */}
      <div
        ref={dotRef}
        className="absolute left-0 top-0 h-1.5 w-1.5 rounded-full bg-gold-bright will-change-transform"
      />
    </div>
  );
}
