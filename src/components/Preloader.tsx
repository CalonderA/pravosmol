import { motion } from 'framer-motion';
import { LUXE } from './motion';
import { ScalesIcon } from './ScalesIcon';

/** Вступительная заставка: вензель и золотая линия, затем шторка поднимается. */
export function Preloader() {
  const word = 'ПРАВОСМОЛ'.split('');
  return (
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-ink"
      initial={{ y: 0 }}
      exit={{ y: '-100%' }}
      transition={{ duration: 0.9, ease: LUXE }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: LUXE }}
        className="flex flex-col items-center"
      >
        <ScalesIcon className="h-10 w-10 text-gold" />
        <div className="mt-6 flex overflow-hidden">
          {word.map((ch, i) => (
            <motion.span
              key={i}
              initial={{ y: '110%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.7, ease: LUXE, delay: 0.25 + i * 0.045 }}
              className="font-display text-2xl md:text-3xl tracking-[0.34em] text-cream"
            >
              {ch === ' ' ? '\u00A0' : ch}
            </motion.span>
          ))}
        </div>
        <motion.span
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.1, ease: LUXE, delay: 0.7 }}
          className="mt-6 h-px w-40 origin-center bg-gradient-to-r from-transparent via-gold to-transparent"
        />
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.95 }}
          className="mt-5 font-sans text-[10px] uppercase tracking-registry text-fog"
        >
          Правосудие · Доступность · Репутация
        </motion.span>
      </motion.div>
    </motion.div>
  );
}
