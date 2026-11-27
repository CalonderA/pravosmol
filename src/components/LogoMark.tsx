import { cn } from '../lib/utils';

/** Фирменный знак «ПРАВО-СМОЛ»: щит с весами и башней.
 *  Используется обработанный PNG: кремовый щит + золотые весы на прозрачном фоне. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <img
      src="/images/logo-mark.png"
      alt="Знак ПРАВО-СМОЛ"
      draggable={false}
      className={cn('select-none', className)}
    />
  );
}

/** Полный вертикальный лого-локап (щит + подписи) для прелоадера и футера. */
export function LogoLockup({ className }: { className?: string }) {
  return (
    <img
      src="/images/logo-lockup.png"
      alt="ПРАВО-СМОЛ — юридические услуги, Смоленск"
      draggable={false}
      className={cn('w-auto select-none', className)}
    />
  );
}
