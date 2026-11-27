import {
  AnimatePresence,
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowGlyph, GoldButton } from '../components/Buttons';
import { ConsultationForm } from '../components/ConsultationForm';
import { Counter } from '../components/Counter';
import { NewsFeed } from '../components/NewsFeed';
import { Particles } from '../components/Particles';
import { RoleIcon } from '../components/RoleIcon';
import {
  GoldRule,
  LUXE,
  LinesUp,
  LinesUpOnScroll,
  ParallaxImage,
  RegistryLabel,
  Reveal,
} from '../components/motion';
import { CONTACTS, PRACTICES, PROCESS, STATS, TEAM_ROLES, TESTIMONIALS } from '../lib/data';
import { useSectionNav } from '../lib/sectionNav';
import { useSeo } from '../lib/seo';
import { cn } from '../lib/utils';

export default function Home() {
  useSeo(
    'ПРАВО-СМОЛ — юридические услуги в Смоленске | Юрист, адвокат',
    'Профессиональная юридическая помощь в Смоленске: защита в суде, гражданские и уголовные дела, арбитраж, трудовые и семейные споры. 12 лет опыта, 180+ выигранных дел, ответ за 15 минут.',
  );

  const goTo = useSectionNav();

  return (
    <>
      <Hero goTo={goTo} />
      <About />
      <Practices />
      <WhyUs />
      <Team />
      <NewsFeed />
      <Stats />
      <Process />
      <Testimonials />
      <Consultation />
    </>
  );
}

/* ------------------------------------------------------------------ */
/* 1. HERO — величественная Фемида, кинематографический въезд          */
/* ------------------------------------------------------------------ */

function Hero({ goTo }: { goTo: (hash: string) => void }) {
  // параллакс сцены при прокрутке
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const contentScrollY = useTransform(scrollYProgress, [0, 0.7], [0, -60]);

  // скролл-сцена: Фемида грациозно поворачивается и уходит вниз
  const imgScrollY = useTransform(scrollYProgress, [0, 1], [0, 170]);
  const imgScrollRotY = useTransform(scrollYProgress, [0, 0.5, 1], [0, 9, 20]);
  const imgScrollRotX = useTransform(scrollYProgress, [0, 1], [0, -5]);
  const imgScrollScale = useTransform(scrollYProgress, [0, 1], [1.1, 1.02]);

  // «3D-глубина»: курсор двигает слои с разной амплитудой и лёгким наклоном сцены
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 55, damping: 16, mass: 0.7 });
  const sy = useSpring(my, { stiffness: 55, damping: 16, mass: 0.7 });
  const imgX = useTransform(sx, (v) => 48 + v * 24);
  const imgMouseRY = useTransform(sx, (v) => v * 2.4);
  const imgMouseRX = useTransform(sy, (v) => v * -1.8);
  const imgMouseY = useTransform(sy, (v) => v * 18);
  const imgY = useTransform<number, number>([imgScrollY, imgMouseY], (vals) => vals[0] + vals[1]);
  const imgRotY = useTransform<number, number>([imgScrollRotY, imgMouseRY], (vals) => vals[0] + vals[1]);
  const imgRotX = useTransform<number, number>([imgScrollRotX, imgMouseRX], (vals) => vals[0] + vals[1]);
  const textX = useTransform(sx, (v) => v * -12);
  const textY = useTransform<number, number>([contentScrollY, sy], (vals) => vals[0] + vals[1] * -9);

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!fine || reduced) return;
    const onMove = (e: MouseEvent) => {
      mx.set((e.clientX / window.innerWidth - 0.5) * 2);
      my.set((e.clientY / window.innerHeight - 0.5) * 2);
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, [mx, my]);

  return (
    <section ref={ref} className="relative flex min-h-[100svh] flex-col overflow-hidden bg-ink">
      {/* Фемида: кинематографический zoom, поворот за прокруткой и 3D-реакция на курсор */}
      <motion.div
        style={{
          y: imgY,
          x: imgX,
          rotateX: imgRotX,
          rotateY: imgRotY,
          scale: imgScrollScale,
          transformPerspective: 1200,
        }}
        className="absolute inset-0 will-change-transform"
      >
        <motion.img
          src="/images/themis-hero.jpg"
          alt="Бронзовая статуя Фемиды с золотыми весами правосудия"
          initial={{ scale: 1.18 }}
          animate={{ scale: 1 }}
          transition={{ duration: 7, ease: LUXE }}
          className="img-cinema h-full w-full object-cover object-[58%_26%]"
        />
      </motion.div>

      {/* вуаль: левая сторона уходит в графит, низ растворяется в странице */}
      <div className="hero-veil absolute inset-0" aria-hidden />
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(135% 135% at 66% 30%, rgba(10,10,11,0) 26%, rgba(10,10,11,0.42) 58%, rgba(10,10,11,0.9) 100%)',
        }}
      />
      <div className="absolute inset-0 bg-ink/20" aria-hidden />
      <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-ink via-ink/55 to-transparent" aria-hidden />
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-ink/85 via-ink/45 to-transparent" aria-hidden />

      {/* золотые частицы */}
      <Particles className="pointer-events-none absolute inset-0 h-full w-full" />

      {/* вертикальная рубрика у правого края */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.4, delay: 3 }}
        className="absolute right-8 top-1/2 hidden origin-right -translate-y-1/2 rotate-90 font-sans text-[10px] uppercase tracking-registry text-gold/45 xl:block"
        aria-hidden
      >
        Право · Стратегия · Репутация
      </motion.p>

      {/* контент: отдельный слой глубины */}
      <motion.div
        style={{ opacity: contentOpacity, x: textX, y: textY }}
        className="relative z-10 mx-auto flex w-full max-w-shell flex-1 flex-col justify-center px-6 pb-24 pt-40 lg:px-10"
      >
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: LUXE, delay: 2.05 }}
          className="flex items-center gap-4"
        >
          <span className="h-px w-12 bg-gold/70" />
          <p className="registry-label !text-gold-soft">Личный юрист в Смоленске</p>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, letterSpacing: '0.5em' }}
          animate={{ opacity: 1, letterSpacing: '0.2em' }}
          transition={{ duration: 1.6, ease: LUXE, delay: 2.25 }}
          className="mt-10 font-display text-[clamp(1.9rem,3.4vw,2.8rem)] font-semibold text-cream"
        >
          ПРАВО-СМОЛ
        </motion.h1>

        <p className="mt-8 font-display text-[clamp(2.5rem,5.6vw,4.8rem)] leading-[1.04] text-cream">
          <LinesUp
            delay={2.4}
            lines={[
              <span key="a">Правосудие —</span>,
              <span key="b">
                <em className="font-medium italic text-gold-soft">доступное и понятное.</em>
              </span>,
            ]}
          />
        </p>

        <motion.p
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: LUXE, delay: 3 }}
          className="mt-8 max-w-[52ch] font-sans text-[15px] leading-relaxed text-cream/70 md:text-base"
        >
          Профессиональная юридическая помощь в Смоленске: защита в суде, гражданские и уголовные
          дела, интересы бизнеса. Двенадцать лет практики и сто восемьдесят выигранных дел — это не
          цифры, а судьбы.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: LUXE, delay: 3.2 }}
          className="mt-12 flex flex-wrap items-center gap-5"
        >
          <GoldButton onClick={() => goTo('consultation')}>
            Бесплатная консультация
            <ArrowGlyph />
          </GoldButton>
          <HeroGhostButton onClick={() => goTo('practices')}>Наши направления</HeroGhostButton>
        </motion.div>
      </motion.div>

      {/* нижняя метка первого экрана */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, delay: 3.6 }}
        className="relative z-10 mx-auto flex w-full max-w-shell items-end justify-between px-6 pb-10 lg:px-10"
      >
        <p className="font-sans text-[10px] uppercase tracking-registry text-cream/50">
          Смоленск · с 2014 года
        </p>
        <button
          onClick={() => goTo('about')}
          className="group flex items-center gap-3 text-[10px] uppercase tracking-registry text-cream/50 transition-colors hover:text-gold-soft"
          aria-label="Прокрутить к разделу о компании"
        >
          Листайте
          <span className="relative block h-10 w-px overflow-hidden bg-cream/25">
            <motion.span
              className="absolute left-0 top-0 h-4 w-px bg-gold"
              animate={{ y: [-16, 40] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            />
          </span>
        </button>
      </motion.div>
    </section>
  );
}

function HeroGhostButton({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="group inline-flex items-center justify-center gap-3 border border-cream/25 px-9 py-4 font-sans text-[12px] uppercase tracking-wide2 text-cream/85 transition-all duration-500 ease-luxe hover:border-gold/70 hover:text-gold-soft"
    >
      {children}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* 2. О КОМПАНИИ — молочная редакционная секция                        */
/* ------------------------------------------------------------------ */

const ABOUT_FACTS = ['12 лет опыта в праве', '180+ выигранных дел', 'Смоленск и Смоленская область'];

function About() {
  return (
    <section id="about" className="bg-cream text-onyx">
      <div className="mx-auto max-w-shell px-6 py-24 lg:px-10 lg:py-36">
        <RegistryLabel index="01" title="О компании" tone="light" />

        <div className="mt-14 grid gap-16 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-7">
            <Reveal>
              <p className="mb-6 max-w-[44ch] font-display text-lg italic leading-relaxed text-clay">
                «Равенство прав не в том, что все ими пользуются, а в том, что они всем
                предоставлены.»
              </p>
            </Reveal>
            <h2 className="display-tight text-[clamp(2.2rem,4.6vw,4rem)] text-onyx">
              <LinesUpOnScroll
                lines={[
                  <span key="a">Мы делаем правосудие</span>,
                  <span key="b">
                    <em className="italic text-gold-deep">доступным и понятным.</em>
                  </span>,
                ]}
              />
            </h2>
          </div>

          <div className="lg:col-span-4 lg:col-start-9">
            <Reveal>
              <p className="font-sans text-[15px] leading-relaxed text-onyx/80">
                ПРАВО-СМОЛ — юридическая фирма из Смоленска с двенадцатилетним опытом в праве. Мы
                защищаем граждан и организации: в судах, на переговорах, в спорах с ведомствами и
                работодателями.
              </p>
              <p className="mt-5 font-sans text-[15px] leading-relaxed text-onyx/80">
                Более ста восьмидесяти выигранных дел — уголовных, гражданских и арбитражных. Мы не
                любим считать процессы: каждое дело для нас — не цифра, а судьба. Поэтому в нашей
                работе есть письменная стратегия, понятные сроки и юрист, который отвечает за
                результат своим именем.
              </p>
            </Reveal>
            <GoldRule className="mt-10 !bg-gradient-to-r !from-onyx/25 !via-gold-deep/50 !to-transparent" />
            <Reveal delay={0.15}>
              <ul className="mt-8 space-y-2.5">
                {ABOUT_FACTS.map((f) => (
                  <li key={f} className="flex items-baseline gap-3 text-[13px] text-clay">
                    <span className="h-1 w-1 rotate-45 bg-gold-deep/70" aria-hidden />
                    {f}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>

        {/* принципы: реестровый список с римской нумерацией */}
        <div className="mt-24 lg:mt-32">
          {[
            {
              n: 'I',
              t: 'Профессионализм',
              d: 'Каждое дело ведёт юрист, который специализируется именно на таких спорах. Двенадцать лет практики — двенадцать лет одной дисциплины.',
            },
            {
              n: 'II',
              t: 'Гарантированная помощь',
              d: 'Письменная стратегия, честная оценка перспектив и понятные сроки — до подписания договора, а не «по ходу дела».',
            },
            {
              n: 'III',
              t: 'Конфиденциальность',
              d: 'Сведения о деле и самом факте обращения защищены юридической тайной. О вашем конфликте не узнают коллеги и соседи.',
            },
            {
              n: 'IV',
              t: 'Приемлемые цены',
              d: 'Стоимость фиксируется письмом до начала работы. Первая консультация о перспективах дела — бесплатно.',
            },
          ].map((v, i) => (
            <Reveal key={v.n} delay={i * 0.08}>
              <div className="grid grid-cols-1 gap-4 border-t border-onyx/15 py-8 md:grid-cols-12 md:gap-6">
                <span className="font-display text-4xl italic leading-none text-gold-deep/80 md:col-span-2">
                  {v.n}
                </span>
                <h3 className="font-display text-2xl text-onyx md:col-span-4">{v.t}</h3>
                <p className="font-sans text-[14px] leading-relaxed text-clay md:col-span-5 md:col-start-8">
                  {v.d}
                </p>
              </div>
            </Reveal>
          ))}
          <div className="border-t border-onyx/15" />
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 3. НАПРАВЛЕНИЯ — реестр дел                                          */
/* ------------------------------------------------------------------ */

function Practices() {
  return (
    <section id="practices" className="relative bg-ink">
      <div className="mx-auto max-w-shell px-6 py-24 lg:px-10 lg:py-36">
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <RegistryLabel index="02" title="Юридические направления" />
            <h2 className="mt-12 display-tight text-[clamp(2.2rem,4.6vw,4rem)] text-cream">
              <LinesUpOnScroll
                lines={[
                  <span key="a">Семь направлений.</span>,
                  <span key="b">
                    <em className="italic text-gold-soft">Один юрист на всё дело.</em>
                  </span>,
                ]}
              />
            </h2>
          </div>
          <div className="flex items-end lg:col-span-3 lg:col-start-10">
            <Reveal delay={0.2}>
              <p className="max-w-[30ch] text-[13px] leading-relaxed text-fog">
                Сферы компетенции фирмы — от гражданских споров до уголовной защиты. Откройте
                «дело», чтобы увидеть состав услуг и порядок работы.
              </p>
            </Reveal>
          </div>
        </div>

        <div className="mt-16 lg:mt-20">
          {PRACTICES.map((p, i) => (
            <Reveal key={p.slug} delay={Math.min(i * 0.05, 0.3)}>
              <Link
                to={`/practice/${p.slug}`}
                className="group relative grid grid-cols-[auto_1fr_auto] items-baseline gap-4 border-t border-gold/12 py-7 transition-colors duration-500 hover:bg-graphite/50 md:grid-cols-12 md:gap-6 lg:py-8"
              >
                {/* золотая черта слева при наведении */}
                <span className="absolute left-0 top-0 h-full w-px origin-top scale-y-0 bg-gold transition-transform duration-700 ease-luxe group-hover:scale-y-100" />
                <span className="pl-4 font-display text-xl italic leading-none text-gold/50 transition-colors duration-500 group-hover:text-gold md:col-span-1 md:pl-6">
                  {p.index}
                </span>
                <span className="font-display text-[clamp(1.4rem,2.6vw,2.3rem)] leading-tight text-cream/90 transition-all duration-500 ease-luxe group-hover:translate-x-2 group-hover:text-cream md:col-span-6">
                  {p.title}
                </span>
                <span className="hidden text-[12px] uppercase tracking-wide2 text-fog md:col-span-3 md:block">
                  {p.formula}
                </span>
                <span className="pr-2 text-gold/40 transition-all duration-500 group-hover:translate-x-1.5 group-hover:text-gold md:col-span-2 md:pr-6 md:text-right">
                  <ArrowGlyph className="h-5 w-5" />
                </span>
              </Link>
            </Reveal>
          ))}
          <div className="border-t border-gold/12" />
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 4. ПОЧЕМУ КЛИЕНТЫ ВЫБИРАЮТ НАС — асимметричная композиция           */
/* ------------------------------------------------------------------ */

const ADVANTAGES = [
  {
    n: '01',
    t: 'Личный юрист',
    d: 'Вы получаете не колл-центр, а конкретного юриста, который знает ваше дело от первого слова до решения суда.',
  },
  {
    n: '02',
    t: 'Гарантированная помощь',
    d: 'Письменная стратегия, честная оценка перспектив и фиксированные сроки — до того, как вы приняли решение.',
  },
  {
    n: '03',
    t: 'Понятные цены',
    d: 'Стоимость закрепляется письмом: фикс или процент от взысканного. Первая консультация — бесплатно.',
  },
  {
    n: '04',
    t: 'Конфиденциальность',
    d: 'Сведения о деле и самом факте обращения защищены юридической тайной — это режим работы, а не обещание.',
  },
];

function WhyUs() {
  return (
    <section className="bg-cream text-onyx">
      <div className="mx-auto max-w-shell px-6 py-24 lg:px-10 lg:py-36">
        <RegistryLabel index="03" title="Почему клиенты выбирают нас" tone="light" />

        <div className="mt-16 grid gap-16 lg:grid-cols-12 lg:gap-10">
          {/* крупная цитата — девиз фирмы */}
          <div className="lg:col-span-4">
            <Reveal>
              <blockquote className="display-tight text-[clamp(1.9rem,3.4vw,2.9rem)] text-onyx">
                «Равенство прав не в том, что все ими пользуются, а в том, что они всем{' '}
                <em className="italic text-gold-deep">предоставлены.</em>»
              </blockquote>
              <p className="mt-8 text-[12px] uppercase tracking-wide2 text-clay">
                Девиз фирмы ПРАВО-СМОЛ
              </p>
              <p className="mt-10 max-w-[38ch] font-sans text-[14px] leading-relaxed text-clay">
                С этих слов начинается каждое новое дело. Всё остальное — стратегия, гонорары,
                отчётность — подчинено этому принципу.
              </p>
            </Reveal>
          </div>

          {/* архивное фото с параллаксом */}
          <div className="lg:col-span-3 lg:col-start-6 lg:mt-24">
            <Reveal delay={0.1}>
              <ParallaxImage
                src="/images/library.jpg"
                alt="Историческая юридическая библиотека — читальный зал с архивом права"
                className="aspect-[3/4] border border-onyx/15"
                imgClassName="img-archival"
                amplitude={30}
              />
              <p className="mt-4 text-[11px] uppercase tracking-registry text-clay/80">
                Читальный зал юридической библиотеки
              </p>
            </Reveal>
          </div>

          {/* преимущества: журнальные врезки со смещением */}
          <div className="lg:col-span-4 lg:col-start-10">
            <div className="space-y-0">
              {ADVANTAGES.map((a, i) => (
                <Reveal key={a.n} delay={0.08 * i}>
                  <div
                    className={cn(
                      'border-t border-onyx/15 py-7',
                      i % 2 === 1 && 'lg:ml-12',
                    )}
                  >
                    <p className="flex items-baseline gap-3">
                      <span className="font-display text-lg italic text-gold-deep/80">{a.n}</span>
                      <span className="font-display text-xl text-onyx">{a.t}</span>
                    </p>
                    <p className="mt-3 font-sans text-[13.5px] leading-relaxed text-clay">{a.d}</p>
                  </div>
                </Reveal>
              ))}
              <div className="border-t border-onyx/15" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 5. ПАРТНЁРЫ ФИРМЫ — портретная галерея                               */
/* ------------------------------------------------------------------ */

/* ------------------------------------------------------------------ */
/* 5. КТО ВЕДЁТ ДЕЛО — роли фирмы вместо портретов                     */
/* ------------------------------------------------------------------ */

const ROLE_OFFSETS = ['', 'lg:mt-14', 'lg:mt-6', 'lg:mt-20'];

function Team() {
  return (
    <section id="team" className="relative overflow-hidden bg-ink">
      {/* мягкое золотое свечение */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-48 top-1/4 h-[440px] w-[440px] rounded-full bg-gold/[0.05] blur-[130px]"/>
      <div className="relative mx-auto max-w-shell px-6 py-24 lg:px-10 lg:py-36">
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <RegistryLabel index="04" title="Кто ведёт ваше дело" />
            <h2 className="mt-12 display-tight text-[clamp(2.2rem,4.6vw,4rem)] text-cream">
              <LinesUpOnScroll
                lines={[
                  <span key="a">Фирма без колл-центра.</span>,
                  <span key="b">
                    <em className="italic text-gold-soft">За дело отвечает юрист.</em>
                  </span>,
                ]}
              />
            </h2>
          </div>
          <div className="flex items-end lg:col-span-3 lg:col-start-10">
            <Reveal delay={0.2}>
              <p className="max-w-[34ch] text-[13px] leading-relaxed text-fog">
                Портреты юристов мы не публикуем — это часть конфиденциальности. Знакомство
                происходит на первой консультации: лично и без посредников.
              </p>
            </Reveal>
          </div>
        </div>

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:mt-24 lg:grid-cols-4 lg:gap-6">
          {TEAM_ROLES.map((role, i) => (
            <Reveal key={role.index} delay={i * 0.08} className={ROLE_OFFSETS[i]}>
              <div className="group relative h-full border border-gold/15 bg-graphite/50 p-7 transition-all duration-700 ease-luxe hover:-translate-y-1.5 hover:border-gold/40 hover:bg-graphite">
                <div className="flex items-start justify-between">
                  <span className="font-display text-3xl italic leading-none text-gold/45">{role.index}</span>
                  <RoleIcon
                    icon={role.icon}
                    className="h-7 w-7 text-gold-soft transition-transform duration-700 ease-luxe group-hover:rotate-[10deg] group-hover:text-gold"/>
                </div>
                <h3 className="mt-8 font-display text-[1.45rem] leading-tight text-cream">{role.title}</h3>
                <p className="mt-3 font-sans text-[13px] leading-relaxed text-fog">{role.text}</p>
                <p className="mt-6 text-[10.5px] uppercase tracking-registry text-gold/70">{role.tags}</p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* атмосфера практики + девиз */}
        <Reveal delay={0.1}>
          <div className="mt-24 grid items-center gap-10 lg:grid-cols-12">
            <ParallaxImage
              src="/images/columns.jpg"
              alt="Колонны зала суда — ордер и порядок"
              className="aspect-[16/8] border border-gold/15 lg:col-span-6"
              imgClassName="img-cinema"
              amplitude={30}
            />
            <div className="lg:col-span-5 lg:col-start-8">
              <p className="font-display text-[clamp(1.5rem,2.4vw,2rem)] italic leading-relaxed text-cream/85">
                «Право выигрывает не громкостью, а точностью.»
              </p>
              <p className="mt-5 text-[11px] uppercase tracking-registry text-fog">
                Из внутреннего устава судебной практики
              </p>
              <GoldRule className="mt-10" />
              <p className="mt-8 max-w-[46ch] font-sans text-[14px] leading-relaxed text-fog">
                За двенадцать лет через фирму прошли сто восемьдесят дел — уголовных, гражданских и
                арбитражных. Это не цифры, а судьбы людей и семей.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 6. ДОСТИЖЕНИЯ — асимметричные крупные числа                          */
/* ------------------------------------------------------------------ */

const STAT_LAYOUT = [
  'lg:col-span-5',
  'lg:col-span-4 lg:col-start-7 lg:mt-24',
  'lg:col-span-4',
  'lg:col-span-5 lg:col-start-8 lg:mt-16',
];

function Stats() {
  return (
    <section className="relative overflow-hidden bg-coal">
      {/* тонкое золотое свечение фона */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 top-1/3 h-[480px] w-[480px] rounded-full bg-gold/[0.05] blur-[120px]"
      />
      <div className="relative mx-auto max-w-shell px-6 py-24 lg:px-10 lg:py-36">
        <RegistryLabel index="06" title="Фирма в цифрах" />

        <div className="mt-16 grid gap-y-16 lg:mt-24 lg:grid-cols-12 lg:gap-x-10">
          {STATS.map((s, i) => (
            <div key={s.label} className={cn('lg:col-span-6', STAT_LAYOUT[i])}>
              <GoldRule className="mb-8" delay={i * 0.06} />
              <Reveal>
                <p className="font-display text-[clamp(4rem,9vw,7.5rem)] leading-none">
                  <Counter
                    value={s.value}
                    suffix={s.suffix}
                    className="bg-gold-sheen bg-clip-text text-transparent"
                  />
                </p>
                <p className="mt-5 text-[13px] uppercase tracking-wide2 text-cream/85">{s.label}</p>
                <p className="mt-3 max-w-[44ch] font-sans text-[13.5px] leading-relaxed text-fog">{s.note}</p>
              </Reveal>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 7. ЭТАПЫ РАБОТЫ — процесс с прорисовывающейся линией                */
/* ------------------------------------------------------------------ */

function Process() {
  return (
    <section id="process" className="bg-cream text-onyx">
      <div className="mx-auto max-w-shell px-6 py-24 lg:px-10 lg:py-36">
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <RegistryLabel index="07" title="Этапы работы с клиентами" tone="light" />
            <h2 className="mt-12 display-tight text-[clamp(2.2rem,4.6vw,4rem)]">
              <LinesUpOnScroll
                lines={[
                  <span key="a">Пять шагов — от разговора</span>,
                  <span key="b">
                    до <em className="italic text-gold-deep">результата.</em>
                  </span>,
                ]}
              />
            </h2>
          </div>
        </div>

        <div className="relative mt-20">
          {/* прорисовывающаяся золотая линия */}
          <motion.span
            aria-hidden
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true, margin: '0px 0px -120px 0px' }}
            transition={{ duration: 2.4, ease: LUXE }}
            className="absolute left-[7px] top-0 hidden h-full w-px origin-top bg-gradient-to-b from-gold-deep/70 via-gold-deep/40 to-transparent md:block"
          />

          <div className="space-y-14">
            {PROCESS.map((s, i) => (
              <Reveal key={s.index} delay={i * 0.06}>
                <div className="relative grid grid-cols-1 gap-4 md:grid-cols-12 md:gap-6">
                  {/* ромб-метка на линии */}
                  <span
                    aria-hidden
                    className="absolute -left-0 top-2 hidden h-3.5 w-3.5 rotate-45 border border-gold-deep bg-cream md:block"
                    style={{ left: 1.5 }}
                  />
                  <span className="font-display text-5xl italic leading-none text-gold-deep/60 md:col-span-2 md:pl-12">
                    {s.index}
                  </span>
                  <div className="md:col-span-5">
                    <h3 className="font-display text-2xl md:text-[1.7rem]">{s.title}</h3>
                    <p className="mt-2 text-[13px] uppercase tracking-wide2 text-clay/80">{s.text}</p>
                  </div>
                  <p className="font-sans text-[14px] leading-relaxed text-clay md:col-span-4 md:col-start-9">
                    {s.detail}
                  </p>
                </div>
                {i < PROCESS.length - 1 && <div className="mt-14 border-t border-onyx/12 md:hidden" />}
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 8. ОТЗЫВЫ — одна большая цитата                                      */
/* ------------------------------------------------------------------ */

function Testimonials() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  // мягкая автосмена; останавливается при наведении/фокусе
  useEffect(() => {
    if (paused) return;
    const t = window.setInterval(() => setIndex((i) => (i + 1) % TESTIMONIALS.length), 8000);
    return () => window.clearInterval(t);
  }, [paused]);

  const t = TESTIMONIALS[index];
  const go = (dir: 1 | -1) =>
    setIndex((i) => (i + dir + TESTIMONIALS.length) % TESTIMONIALS.length);

  return (
    <section
      id="testimonials"
      className="bg-ink"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="mx-auto max-w-shell px-6 py-24 lg:px-10 lg:py-36">
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <RegistryLabel index="08" title="Отзывы клиентов" />
          </div>
          <div className="flex items-end justify-start lg:col-span-3 lg:col-start-10 lg:justify-end">
            <Reveal delay={0.15}>
              <p className="text-[11px] uppercase tracking-registry text-fog">
                {String(index + 1).padStart(2, '0')} — {String(TESTIMONIALS.length).padStart(2, '0')}
              </p>
            </Reveal>
          </div>
        </div>

        <div className="mt-14 grid gap-12 lg:grid-cols-12">
          {/* монограмма клиента */}
          <div className="lg:col-span-2">
            <Reveal>
              <div className="flex h-16 w-16 items-center justify-center rounded-full border border-gold/40 font-display text-lg text-gold-soft">
                {t.initials}
              </div>
            </Reveal>
          </div>

          <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
              <motion.blockquote
                key={index}
                initial={{ opacity: 0, y: 26 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -18 }}
                transition={{ duration: 0.7, ease: LUXE }}
              >
                <p className="font-display text-[clamp(1.5rem,2.9vw,2.4rem)] leading-[1.28] text-cream/90">
                  «{t.quote}»
                </p>
                <footer className="mt-8 text-[12px] uppercase tracking-wide2 text-fog">
                  {t.role}
                </footer>
              </motion.blockquote>
            </AnimatePresence>

            <div className="mt-12 flex items-center gap-6">
              <button
                onClick={() => go(-1)}
                aria-label="Предыдущий отзыв"
                className="group flex h-11 w-11 items-center justify-center border border-gold/30 text-gold-soft transition-all duration-500 hover:border-gold hover:text-gold"
              >
                <ArrowGlyph className="rotate-180 group-hover:-translate-x-1 group-hover:translate-x-0" />
              </button>
              <button
                onClick={() => go(1)}
                aria-label="Следующий отзыв"
                className="group flex h-11 w-11 items-center justify-center border border-gold/30 text-gold-soft transition-all duration-500 hover:border-gold hover:text-gold"
              >
                <ArrowGlyph />
              </button>
              <div className="ml-2 flex gap-2">
                {TESTIMONIALS.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setIndex(i)}
                    aria-label={`Отзыв ${i + 1}`}
                    className={cn(
                      'h-px w-8 transition-all duration-500',
                      i === index ? 'bg-gold' : 'bg-gold/25 hover:bg-gold/50',
                    )}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 9. КОНСУЛЬТАЦИЯ                                                      */
/* ------------------------------------------------------------------ */

function Consultation() {
  return (
    <section id="consultation" className="relative border-t border-gold/15 bg-coal">
      <div
        aria-hidden
        className="pointer-events-none absolute -left-40 bottom-0 h-[420px] w-[420px] rounded-full bg-gold/[0.05] blur-[120px]"
      />
      <div className="relative mx-auto max-w-shell px-6 py-24 lg:px-10 lg:py-36">
        <div className="grid gap-16 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-5">
            <RegistryLabel index="09" title="Запись на консультацию" />
            <h2 className="mt-12 display-tight text-[clamp(2.2rem,4.6vw,3.8rem)] text-cream">
              <LinesUpOnScroll
                lines={[
                  <span key="a">Запишитесь на консультацию —</span>,
                  <span key="b">
                    <em className="italic text-gold-soft">первый шаг к решению.</em>
                  </span>,
                ]}
              />
            </h2>
            <Reveal delay={0.15}>
              <p className="mt-8 max-w-[46ch] font-sans text-[14.5px] leading-relaxed text-fog">
                Опишите ситуацию — юрист фирмы свяжется с вами в течение 15 минут. Первая
                консультация о перспективах дела — бесплатно, без гонорара и обязательств.
              </p>
              <div className="mt-12 space-y-5">
                <a href={CONTACTS.phoneHref} className="group flex items-baseline gap-4">
                  <span className="registry-label shrink-0">Телефон</span>
                  <span className="font-display text-2xl text-gold-soft transition-colors group-hover:text-gold-bright">
                    {CONTACTS.phone}
                  </span>
                </a>
                <a href={CONTACTS.emailHref} className="group flex items-baseline gap-4">
                  <span className="registry-label shrink-0">Почта</span>
                  <span className="text-[15px] text-cream/80 transition-colors group-hover:text-gold-soft">
                    {CONTACTS.email}
                  </span>
                </a>
                <p className="flex items-baseline gap-4">
                  <span className="registry-label shrink-0">Офис</span>
                  <span className="text-[15px] text-fog">{CONTACTS.office}</span>
                </p>
                <p className="flex items-baseline gap-4">
                  <span className="registry-label shrink-0">Часы</span>
                  <span className="text-[15px] text-fog">{CONTACTS.hours}</span>
                </p>
              </div>
              <p className="mt-12 max-w-[40ch] font-display text-lg italic leading-relaxed text-gold-soft">
                «Закон радует тех, кто с нами!»
              </p>
            </Reveal>
          </div>

          <div className="lg:col-span-6 lg:col-start-7">
            <Reveal delay={0.1}>
              <ConsultationForm />
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
