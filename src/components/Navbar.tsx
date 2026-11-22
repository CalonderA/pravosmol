import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { CONTACTS } from '../lib/data';
import { cn } from '../lib/utils';
import { GoldButton } from './Buttons';
import { ScalesIcon } from './ScalesIcon';
import { LUXE } from './motion';

const LINKS = [
  { label: 'О компании', hash: 'about' },
  { label: 'Направления', hash: 'practices' },
  { label: 'Команда', hash: 'team' },
  { label: 'Отзывы', hash: 'testimonials' },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  // переход по хэш-ссылкам с любой страницы
  const goTo = (hash: string) => {
    setOpen(false);
    if (location.pathname !== '/') {
      navigate({ pathname: '/', hash: `#${hash}` });
    } else {
      document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const wordmark = (
    <Link to="/" className="group flex items-center gap-4" aria-label="ПРАВОСМОЛ — на главную">
      <ScalesIcon className="h-8 w-8 text-gold transition-transform duration-700 ease-luxe group-hover:rotate-[8deg]" />
      <span className="font-display text-xl md:text-2xl font-semibold tracking-[0.22em] text-cream">
        ПРАВОСМОЛ
      </span>
    </Link>
  );

  return (
    <>
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-[80] transition-all duration-700 ease-luxe',
          scrolled ? 'border-b border-gold/15 bg-ink/90 py-3 backdrop-blur-md' : 'border-b border-transparent py-6',
        )}
      >
        <div className="mx-auto flex max-w-shell items-center justify-between px-6 lg:px-10">
          {wordmark}

          <nav className="hidden items-center gap-9 lg:flex" aria-label="Основная навигация">
            {LINKS.map((l) => (
              <button
                key={l.hash}
                onClick={() => goTo(l.hash)}
                className="group relative font-sans text-[12.5px] uppercase tracking-wide2 text-cream/80 transition-colors duration-300 hover:text-cream"
              >
                {l.label}
                <span className="absolute -bottom-1.5 left-0 h-px w-full origin-left scale-x-0 bg-gold transition-transform duration-500 ease-luxe group-hover:scale-x-100" />
              </button>
            ))}
          </nav>

          <div className="hidden items-center gap-7 lg:flex">
            <a
              href={CONTACTS.phoneHref}
              className="font-display text-lg tracking-[0.06em] text-gold-soft transition-colors hover:text-gold-bright"
            >
              {CONTACTS.phone}
            </a>
            <GoldButton onClick={() => goTo('consultation')} className="px-6 py-3">
              Консультация
            </GoldButton>
          </div>

          {/* бургер */}
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? 'Закрыть меню' : 'Открыть меню'}
            aria-expanded={open}
            className="relative z-[85] flex h-11 w-11 flex-col items-center justify-center gap-1.5 lg:hidden"
          >
            <span
              className={cn(
                'h-px w-7 bg-cream transition-all duration-500 ease-luxe',
                open && 'translate-y-[3.5px] rotate-45',
              )}
            />
            <span
              className={cn(
                'h-px w-7 bg-cream transition-all duration-500 ease-luxe',
                open && '-translate-y-[3.5px] -rotate-45',
              )}
            />
          </button>
        </div>
      </header>

      {/* мобильное меню */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: LUXE }}
            className="fixed inset-0 z-[75] flex flex-col justify-between bg-ink px-8 pb-12 pt-32 lg:hidden"
          >
            <nav className="flex flex-col gap-2" aria-label="Мобильная навигация">
              {LINKS.map((l, i) => (
                <motion.button
                  key={l.hash}
                  initial={{ opacity: 0, x: -28 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  transition={{ duration: 0.55, ease: LUXE, delay: 0.08 + i * 0.07 }}
                  onClick={() => goTo(l.hash)}
                  className="border-b border-gold/12 py-5 text-left font-display text-3xl text-cream"
                >
                  {l.label}
                </motion.button>
              ))}
              <motion.button
                initial={{ opacity: 0, x: -28 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.55, ease: LUXE, delay: 0.38 }}
                onClick={() => goTo('consultation')}
                className="border-b border-gold/12 py-5 text-left font-display text-3xl italic text-gold-soft"
              >
                Консультация
              </motion.button>
            </nav>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="space-y-3"
            >
              <a href={CONTACTS.phoneHref} className="block font-display text-2xl text-gold-soft">
                {CONTACTS.phone}
              </a>
              <a href={CONTACTS.emailHref} className="block text-sm text-fog">
                {CONTACTS.email}
              </a>
              <p className="text-[11px] uppercase tracking-registry text-fog/70">{CONTACTS.hours}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
