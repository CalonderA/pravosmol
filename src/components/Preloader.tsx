import { motion } from 'framer-motion';
import { LUXE } from './motion';
import { LogoLockup } from './LogoMark';

/** Вступительная заставка: фирменный знак ПРАВО-СМОЛ, затем шторка поднимается. */
export function Preloader() {
  return (
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-ink"
      initial={{ y: 0 }}
      exit={{ y: '-100%' }}
      transition={{ duration: 0.9, ease: LUXE }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.1, ease: LUXE }}
        className="flex flex-col items-center"
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, ease: LUXE }}
        >
          <LogoLockup className="h-52 md:h-60" />
        </motion.div>
        <motion.span
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.1, ease: LUXE, delay: 0.7 }}
          className="mt-8 h-px w-44 origin-center bg-gradient-to-r from-transparent via-gold to-transparent"
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
