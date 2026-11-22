import { ScalesIcon } from './ScalesIcon';
import type { TeamRole } from '../lib/data';

/** Линейные золотые пиктограммы ролей фирмы. */
export function RoleIcon({ icon, className }: { icon: TeamRole['icon']; className?: string }) {
  switch (icon) {
    case 'scales':
      return <ScalesIcon className={className} />;
    case 'gavel':
      return (
        <svg viewBox="0 0 32 32" fill="none" aria-hidden className={`stroke-current ${className ?? ''}`}>
          <path d="M6 12 L14 4" strokeWidth="1.5" strokeLinecap="square" />
          <path d="M10 15 L18 7" strokeWidth="1.5" strokeLinecap="square" />
          <rect x="3.2" y="10.6" width="8" height="4.6" transform="rotate(-45 7.2 12.9)" strokeWidth="1.4" />
          <rect x="11.2" y="2.6" width="8" height="4.6" transform="rotate(-45 15.2 4.9)" strokeWidth="1.4" />
          <path d="M16 16 L26 26" strokeWidth="1.5" strokeLinecap="square" />
          <path d="M5 28 H15" strokeWidth="1.4" strokeLinecap="square" />
        </svg>
      );
    case 'shield':
      return (
        <svg viewBox="0 0 32 32" fill="none" aria-hidden className={`stroke-current ${className ?? ''}`}>
          <path d="M16 3 L27 7.5 V16 C27 23 21.8 27.6 16 29 C10.2 27.6 5 23 5 16 V7.5 Z" strokeWidth="1.4" />
          <path d="M11 15.5 L15 19.5 L21.5 12" strokeWidth="1.5" strokeLinecap="square" />
        </svg>
      );
    case 'feather':
      return (
        <svg viewBox="0 0 32 32" fill="none" aria-hidden className={`stroke-current ${className ?? ''}`}>
          <path d="M26 5 C16 6 9 12 6.5 24" strokeWidth="1.4" strokeLinecap="square" />
          <path d="M26 5 C22 12 17 16.5 10 19" strokeWidth="1.2" strokeLinecap="square" />
          <path d="M6.5 24 C9 17 13.5 11.5 21 8" strokeWidth="1.1" strokeLinecap="square" />
          <path d="M4 28 C8 26.5 11 25.5 13.5 25" strokeWidth="1.4" strokeLinecap="square" />
        </svg>
      );
  }
}
