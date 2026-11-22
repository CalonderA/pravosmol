import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, type ReactNode } from 'react';
import { cn } from '../lib/utils';

// Единый «дорогой» easing для всех появлений
export const LUXE = [0.22, 1, 0.36, 1] as const;

export const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  shown: { opacity: 1, y: 0 },
};

/** Базовое появление блока при прокрутке: плавный подъём + проявление. */
export function Reveal({
  children,
  delay = 0,
  className,
  as = 'div',
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: 'div' | 'span' | 'li' | 'section';
}) {
  const Comp = (motion as never as Record<string, typeof motion.div>)[as];
  return (
    <Comp
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, margin: '0px 0px -80px 0px' }}
      variants={fadeUp}
      transition={{ duration: 0.9, ease: LUXE, delay }}
      className={className}
    >
      {children}
    </Comp>
  );
}

/** Заголовок, появляющийся построчно с движением вверх (эффект театрального подъёма). */
export function LinesUp({
  lines,
  className,
  lineClassName,
  delay = 0,
  stagger = 0.14,
}: {
  lines: ReactNode[];
  className?: string;
  lineClassName?: string;
  delay?: number;
  stagger?: number;
}) {
  return (
    <span className={cn('block', className)}>
      {lines.map((line, i) => (
        <span key={i} className={cn('block overflow-hidden pb-[0.08em] -mb-[0.08em]', lineClassName)}>
          <motion.span
            className="block will-change-transform"
            initial={{ y: '112%' }}
            animate={{ y: '0%' }}
            transition={{ duration: 1.1, ease: LUXE, delay: delay + i * stagger }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

/** Тот же подъём, но по вьюпорту (для секций ниже первого экрана).
 *  Важно: whileInView стоит на внешней «шторке», чтобы наблюдатель видел
 *  видимый элемент, а внутренняя строка анимируется через variants. */
export function LinesUpOnScroll({
  lines,
  className,
  stagger = 0.1,
}: {
  lines: ReactNode[];
  className?: string;
  stagger?: number;
}) {
  return (
    <span className={cn('block', className)}>
      {lines.map((line, i) => (
        <motion.span
          key={i}
          className="block overflow-hidden pb-[0.08em] -mb-[0.08em]"
          initial="hidden"
          whileInView="shown"
          viewport={{ once: true, margin: '0px 0px -40px 0px' }}
        >
          <motion.span
            className="block will-change-transform"
            variants={{
              hidden: { y: '112%' },
              shown: { y: '0%' },
            }}
            transition={{ duration: 1, ease: LUXE, delay: i * stagger }}
          >
            {line}
          </motion.span>
        </motion.span>
      ))}
    </span>
  );
}

/** Золотая линия, прорисовывающаяся при появлении секции. */
export function GoldRule({
  className,
  delay = 0,
  origin = 'left',
}: {
  className?: string;
  delay?: number;
  origin?: 'left' | 'center';
}) {
  return (
    <motion.span
      aria-hidden
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true, margin: '0px 0px -40px 0px' }}
      transition={{ duration: 1.4, ease: LUXE, delay }}
      style={{ transformOrigin: origin }}
      className={cn('gold-rule', className)}
    />
  );
}

/** Рубрика реестра: «ДЕЛО № 04 — НАПРАВЛЕНИЯ». */
export function RegistryLabel({
  index,
  title,
  tone = 'dark',
  className,
}: {
  index: string;
  title: string;
  tone?: 'dark' | 'light';
  className?: string;
}) {
  return (
    <Reveal className={cn('flex items-baseline gap-4', className)}>
      <span className="font-display text-xl leading-none text-gold">{index}</span>
      <span
        className={cn(
          'registry-label',
          tone === 'light' && 'text-clay/90',
        )}
      >
        {title}
      </span>
      <span className={cn('h-px flex-1 translate-y-[-4px]', tone === 'dark' ? 'bg-gold/25' : 'bg-onyx/15')} />
    </Reveal>
  );
}

/** Изображение с мягким параллаксом при прокрутке. */
export function ParallaxImage({
  src,
  alt,
  className,
  imgClassName,
  amplitude = 36,
  eager = false,
}: {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  amplitude?: number;
  eager?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], [-amplitude, amplitude]);

  return (
    <div ref={ref} className={cn('relative overflow-hidden', className)}>
      <motion.img
        src={src}
        alt={alt}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        style={{ y, scale: 1.18 }}
        className={cn('h-full w-full object-cover will-change-transform', imgClassName)}
      />
    </div>
  );
}
