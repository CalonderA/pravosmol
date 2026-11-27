import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { Cursor } from './components/Cursor';
import { Footer } from './components/Footer';
import { Navbar } from './components/Navbar';
import { Preloader } from './components/Preloader';
import { LUXE } from './components/motion';
import Home from './pages/Home';
import Legal from './pages/Legal';
import Practice from './pages/Practice';

/** Прокрутка наверх при смене страницы; на хэш — плавный спуск к секции. */
function useScrollManagement() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      // ждём завершения перехода страницы
      const t = window.setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      }, 700);
      return () => window.clearTimeout(t);
    }
    window.scrollTo(0, 0);
  }, [location.pathname, location.hash]);
}

function AnimatedRoutes() {
  const location = useLocation();
  useScrollManagement();

  return (
    <AnimatePresence mode="wait">
      <motion.main
        key={location.pathname}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.5, ease: LUXE }}
      >
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/practice/:slug" element={<Practice />} />
          <Route path="/legal" element={<Legal />} />
          <Route path="*" element={<Home />} />
        </Routes>
        <Footer />
      </motion.main>
    </AnimatePresence>
  );
}

function Shell() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = window.setTimeout(() => setLoading(false), 2000);
    return () => window.clearTimeout(t);
  }, []);

  useEffect(() => {
    document.body.style.overflow = loading ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [loading]);

  return (
    <div className="grain relative min-h-screen bg-ink">
      <AnimatePresence>{loading && <Preloader key="preloader" />}</AnimatePresence>
      <Cursor />
      <Navbar />
      <AnimatedRoutes />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Shell />
    </BrowserRouter>
  );
}
