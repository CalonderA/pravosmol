import { cn } from '../lib/utils';

/** Фирменный знак: золотые весы правосудия (линейная монограмма). */
export function ScalesIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      aria-hidden
      className={cn('stroke-current', className)}
    >
      <line x1="32" y1="10" x2="32" y2="50" strokeWidth="1.6" />
      <line x1="14" y1="52" x2="50" y2="52" strokeWidth="1.6" />
      <line x1="9" y1="17" x2="55" y2="17" strokeWidth="1.6" />
      <path d="M9 17 L3.5 31 A7.5 7.5 0 0 0 14.5 31 Z" strokeWidth="1.4" />
      <path d="M55 17 L49.5 31 A7.5 7.5 0 0 0 60.5 31 Z" strokeWidth="1.4" />
      <circle cx="32" cy="8.6" r="2.4" strokeWidth="1.4" />
      <circle cx="32" cy="53.5" r="1.8" fill="currentColor" stroke="none" />
    </svg>
  );
}
