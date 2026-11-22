import { Link } from 'react-router-dom';
import type { ReactNode } from 'react';
import { cn } from '../lib/utils';

/** Основная кнопка фирмы: тонкое золото, свечение при наведении. */
export function GoldButton({
  children,
  to,
  href,
  onClick,
  type = 'button',
  className,
  disabled,
}: {
  children: ReactNode;
  to?: string;
  href?: string;
  onClick?: () => void;
  type?: 'button' | 'submit';
  className?: string;
  disabled?: boolean;
}) {
  const cls = cn(
    'group relative inline-flex items-center justify-center gap-3 overflow-hidden px-9 py-4',
    'border border-gold/50 text-[12px] uppercase tracking-wide2 text-gold-soft',
    'transition-all duration-500 ease-luxe',
    'hover:border-gold hover:text-ink hover:btn-glow',
    disabled && 'pointer-events-none opacity-50',
    className,
  );
  const inner = (
    <>
      {/* золотая заливка, выезжающая слева */}
      <span
        aria-hidden
        className="absolute inset-0 -translate-x-full bg-gold-sheen transition-transform duration-700 ease-luxe group-hover:translate-x-0"
      />
      <span className="relative z-10 flex items-center gap-3">{children}</span>
    </>
  );

  if (to) {
    return (
      <Link to={to} className={cls}>
        {inner}
      </Link>
    );
  }
  if (href) {
    return (
      <a href={href} className={cls}>
        {inner}
      </a>
    );
  }
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={cls}>
      {inner}
    </button>
  );
}

/** Приглушённая кнопка для светлых секций. */
export function IvoryButton({
  children,
  to,
  href,
  onClick,
  className,
}: {
  children: ReactNode;
  to?: string;
  href?: string;
  onClick?: () => void;
  className?: string;
}) {
  const cls = cn(
    'group relative inline-flex items-center justify-center gap-3 overflow-hidden px-9 py-4',
    'border border-onyx/30 text-[12px] uppercase tracking-wide2 text-onyx',
    'transition-all duration-500 ease-luxe',
    'hover:border-onyx hover:bg-onyx hover:text-cream',
    className,
  );
  const inner = <span className="relative z-10 flex items-center gap-3">{children}</span>;
  if (to) {
    return (
      <Link to={to} className={cls}>
        {inner}
      </Link>
    );
  }
  if (href) {
    return (
      <a href={href} className={cls}>
        {inner}
      </a>
    );
  }
  return (
    <button type="button" onClick={onClick} className={cls}>
      {inner}
    </button>
  );
}

/** Стрелка-указатель, оживает при наведении. */
export function ArrowGlyph({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      className={cn('h-4 w-4 stroke-current transition-transform duration-500 ease-luxe group-hover:translate-x-1.5', className)}
    >
      <path d="M3 12h17m0 0-6-6m6 6-6 6" strokeWidth="1.4" strokeLinecap="square" />
    </svg>
  );
}
