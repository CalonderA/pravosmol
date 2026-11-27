import { cn } from '../lib/utils';

/** Фирменный знак «ПРАВО-СМОЛ»: щит с весами и башней.
 *  Логотип — PNG на чёрном фоне, поэтому на тёмных секциях используем blend-screen
 *  и CSS-кадрирование щита (в изображении щит занимает ~33–66% по ширине). */
export function LogoMark({ className, blend = true }: { className?: string; blend?: boolean }) {
  return (
    <span
      aria-hidden
      className={cn('relative block overflow-hidden', className)}
      style={{ display: 'inline-block' }}
    >
      <img
        src="/images/logo.png"
        alt=""
        draggable={false}
        className="absolute max-w-none"
        style={{
          width: '420%',
          left: '-160%',
          top: '-118%',
          mixBlendMode: blend ? 'screen' : undefined,
        }}
      />
    </span>
  );
}

/** Полный вертикальный лого-локап (щит + подписи) для прелоадера и футера. */
export function LogoLockup({ className }: { className?: string }) {
  return (
    <img
      src="/images/logo.png"
      alt="ПРАВО-СМОЛ — юридические услуги, Смоленск"
      draggable={false}
      className={cn('w-auto select-none', className)}
      style={{ mixBlendMode: 'screen' }}
    />
  );
}
