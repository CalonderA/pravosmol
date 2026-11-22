import { animate, useInView } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

/** Число, которое «наращивается» при появлении на экране. */
export function Counter({
  value,
  suffix = '',
  className,
  duration = 2,
}: {
  value: number;
  suffix?: string;
  className?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -60px 0px' });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, value, {
      duration,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, value, duration]);

  return (
    <span ref={ref} className={className}>
      {display.toLocaleString('ru-RU')}
      {suffix}
    </span>
  );
}
