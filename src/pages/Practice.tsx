import { Link, Navigate, useParams } from 'react-router-dom';
import { ArrowGlyph, GoldButton } from '../components/Buttons';
import { ConsultationForm } from '../components/ConsultationForm';
import {
  GoldRule,
  LinesUpOnScroll,
  ParallaxImage,
  RegistryLabel,
  Reveal,
} from '../components/motion';
import { PRACTICES, getPractice } from '../lib/data';
import { useSeo } from '../lib/seo';

export default function Practice() {
  const { slug } = useParams();
  const practice = getPractice(slug);

  // SEO обновляем через хук-обёртку, чтобы не нарушать правила хуков
  return practice ? <PracticePage practice={practice} /> : <Navigate to="/" replace />;
}

function PracticePage({ practice }: { practice: NonNullable<ReturnType<typeof getPractice>> }) {
  useSeo(
    `${practice.title} в Смоленске — ПРАВО-СМОЛ`,
    `${practice.lead} Состав услуг, порядок работы и обращение к юристу направления «${practice.title}» в Смоленске.`,
  );
  const idx = PRACTICES.findIndex((p) => p.slug === practice.slug);
  const prev = PRACTICES[(idx - 1 + PRACTICES.length) % PRACTICES.length];
  const next = PRACTICES[(idx + 1) % PRACTICES.length];

  return (
    <>
      <PracticeHero practice={practice} />
      <PracticeIntro practice={practice} />
      <PracticeServices practice={practice} />
      <PracticeMatters practice={practice} />
      <section className="border-t border-gold/15 bg-coal">
        <div className="mx-auto max-w-shell px-6 py-24 lg:px-10 lg:py-32">
          <div className="grid gap-14 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-4">
              <RegistryLabel index={practice.index} title="Обращение к фирме" />
              <h2 className="mt-10 display-tight text-[clamp(2rem,3.6vw,3rem)] text-cream">
                <LinesUpOnScroll
                  lines={[
                    <span key="a">Обсудим</span>,
                    <span key="b">
                      <em className="italic text-gold-soft">вашу ситуацию?</em>
                    </span>,
                  ]}
                />
              </h2>
              <Reveal delay={0.15}>
                <p className="mt-6 max-w-[40ch] font-sans text-[14px] leading-relaxed text-fog">
                  Опишите ситуацию в двух словах — юрист направления свяжется с
                  вами и предложит формат консультации.
                </p>
                <GoldRule className="mt-10" />
                <p className="mt-8 text-[12px] uppercase tracking-registry text-fog">
                  {practice.response}
                </p>
                <p className="mt-3 text-[12px] uppercase tracking-registry text-fog">{practice.fee}</p>
              </Reveal>
            </div>
            <div className="lg:col-span-7 lg:col-start-6">
              <Reveal delay={0.1}>
                <ConsultationForm defaultService={practice.title} />
              </Reveal>
            </div>
          </div>
        </div>
      </section>
      <PrevNext prev={prev} next={next} />
    </>
  );
}

/* ---------------------------- HERO ---------------------------- */

function PracticeHero({
  practice,
}: {
  practice: NonNullable<ReturnType<typeof getPractice>>;
}) {
  return (
    <section className="relative overflow-hidden bg-ink">
      {/* фоновая сцена: глубокая графитовая тонировка */}
      <div className="absolute inset-0" aria-hidden>
        <img
          src={practice.image}
          alt=""
          className="img-cinema absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-ink/45" />
        <div className="hero-veil absolute inset-0" />
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(135% 135% at 70% 30%, rgba(10,10,11,0) 24%, rgba(10,10,11,0.45) 60%, rgba(10,10,11,0.92) 100%)',
          }}
        />
        <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-ink to-transparent" />
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-ink/85 via-ink/40 to-transparent" />
      </div>

      {/* призрачный номер дела */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-6 top-16 select-none font-display text-[22rem] leading-none text-cream/[0.045] lg:text-[26rem]"
      >
        {practice.index}
      </div>

      <div className="relative z-10 mx-auto max-w-shell px-6 pb-24 pt-44 lg:px-10 lg:pb-32 lg:pt-56">
        <Reveal className="flex flex-wrap items-center gap-4">
          <Link
            to="/#practices"
            className="group flex items-center gap-2 text-[11px] uppercase tracking-registry text-fog transition-colors hover:text-gold-soft"
          >
            <ArrowGlyph className="rotate-180 h-3.5 w-3.5" />
            Направления
          </Link>
          <span className="text-[11px] uppercase tracking-registry text-gold/70">
            Дело № {practice.index}
          </span>
        </Reveal>

        <h1 className="mt-12 display-tight text-[clamp(2.6rem,6vw,4.8rem)] text-cream">
          <LinesUpOnScroll lines={[<span key="t">{practice.title}</span>]} />
        </h1>
        <Reveal delay={0.15}>
          <p className="mt-5 font-display text-xl italic text-gold-soft">{practice.formula}</p>
          <p className="mt-8 max-w-[58ch] font-sans text-[15.5px] leading-relaxed text-cream/75">
            {practice.lead}
          </p>
        </Reveal>

        <Reveal delay={0.25}>
          <div className="mt-12">
            <GoldButton to="/#consultation">
              Бесплатная консультация
              <ArrowGlyph />
            </GoldButton>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------------------- ПОДХОД ---------------------------- */

function PracticeIntro({
  practice,
}: {
  practice: NonNullable<ReturnType<typeof getPractice>>;
}) {
  return (
    <section className="bg-cream text-onyx">
      <div className="mx-auto max-w-shell px-6 py-24 lg:px-10 lg:py-32">
        <RegistryLabel index={practice.index} title="Подход фирмы" tone="light" />

        <div className="mt-14 grid gap-14 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-6">
            <Reveal>
              <p className="font-sans text-[16px] leading-relaxed text-onyx/85">{practice.intro[0]}</p>
              <p className="mt-6 font-sans text-[15px] leading-relaxed text-clay">{practice.intro[1]}</p>
            </Reveal>
          </div>
          <div className="lg:col-span-5 lg:col-start-8">
            {practice.principles.map((pr, i) => (
              <Reveal key={pr.title} delay={i * 0.08}>
                <div className="border-t border-onyx/15 py-7">
                  <p className="flex items-baseline gap-4">
                    <span className="font-display text-2xl italic text-gold-deep/80">
                      {['I', 'II', 'III'][i]}
                    </span>
                    <span className="font-display text-xl text-onyx">{pr.title}</span>
                  </p>
                  <p className="mt-3 pl-10 font-sans text-[13.5px] leading-relaxed text-clay">{pr.text}</p>
                </div>
              </Reveal>
            ))}
            <div className="border-t border-onyx/15" />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------- УСЛУГИ ---------------------------- */

function PracticeServices({
  practice,
}: {
  practice: NonNullable<ReturnType<typeof getPractice>>;
}) {
  return (
    <section className="bg-ink">
      <div className="mx-auto max-w-shell px-6 py-24 lg:px-10 lg:py-32">
        <RegistryLabel index={practice.index} title="Состав услуг" />
        <h2 className="mt-12 display-tight text-[clamp(2rem,4vw,3.4rem)] text-cream">
          <LinesUpOnScroll
            lines={[
              <span key="a">
                Что мы делаем <em className="italic text-gold-soft">в этом деле.</em>
              </span>,
            ]}
          />
        </h2>

        <div className="mt-14">
          {practice.services.map((s, i) => (
            <Reveal key={s.title} delay={Math.min(i * 0.04, 0.25)}>
              <div className="group grid grid-cols-1 gap-3 border-t border-gold/12 py-7 transition-colors duration-500 hover:bg-graphite/50 md:grid-cols-12 md:gap-6">
                <span className="pl-1 font-display text-lg italic text-gold/50 transition-colors group-hover:text-gold md:col-span-1 md:pl-6">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="font-display text-xl text-cream/90 transition-all duration-500 ease-luxe group-hover:translate-x-2 md:col-span-4">
                  {s.title}
                </h3>
                <p className="font-sans text-[13.5px] leading-relaxed text-fog md:col-span-6 md:col-start-7 md:pr-6">
                  {s.text}
                </p>
              </div>
            </Reveal>
          ))}
          <div className="border-t border-gold/12" />
        </div>
      </div>
    </section>
  );
}

/* ---------------------------- ИЗ ПРАКТИКИ ---------------------------- */

function PracticeMatters({
  practice,
}: {
  practice: NonNullable<ReturnType<typeof getPractice>>;
}) {
  const offsets = ['', 'lg:mt-16', 'lg:mt-8'];
  return (
    <section className="bg-cream text-onyx">
      <div className="mx-auto max-w-shell px-6 py-24 lg:px-10 lg:py-32">
        <RegistryLabel index={practice.index} title="Из практики фирмы" tone="light" />

        <div className="mt-14 grid gap-10 md:grid-cols-3">
          {practice.matters.map((m, i) => (
            <Reveal key={m.label} delay={i * 0.08} className={offsets[i]}>
              <div className="border-t border-onyx/20 pt-6">
                <p className="font-display text-3xl italic text-gold-deep/85">{m.label}</p>
                <p className="mt-4 font-sans text-[14px] leading-relaxed text-onyx/80">{m.text}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.15}>
          <div className="mt-20 grid items-center gap-10 lg:grid-cols-12">
            <ParallaxImage
              src={practice.image}
              alt={practice.imageCaption}
              className="aspect-[16/9] border border-onyx/15 lg:col-span-6"
              amplitude={26}
            />
            <div className="lg:col-span-5 lg:col-start-8">
              <p className="font-display text-xl italic leading-relaxed text-onyx/85">
                «{practice.imageCaption}»
              </p>
              <p className="mt-4 text-[11px] uppercase tracking-registry text-clay/80">
                Право — это архитектура, поставленная на службу жизни
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------------------- ПАРТНЁР ---------------------------- */

/* ---------------------------- ПРЕВ/НЕКСТ ---------------------------- */

function PrevNext({ prev, next }: { prev: { slug: string; title: string; index: string }; next: { slug: string; title: string; index: string } }) {
  return (
    <nav className="bg-ink" aria-label="Другие направления">
      <div className="mx-auto grid max-w-shell grid-cols-1 md:grid-cols-2 lg:px-10">
        <Link
          to={`/practice/${prev.slug}`}
          className="group border-t border-gold/12 px-6 py-10 transition-colors duration-500 hover:bg-graphite/50 md:border-t-0 md:border-r lg:px-10"
        >
          <p className="registry-label flex items-center gap-2">
            <ArrowGlyph className="h-3.5 w-3.5 rotate-180" />
            Дело № {prev.index}
          </p>
          <p className="mt-3 font-display text-2xl text-cream/80 transition-all duration-500 ease-luxe group-hover:-translate-x-1 group-hover:text-gold-soft">
            {prev.title}
          </p>
        </Link>
        <Link
          to={`/practice/${next.slug}`}
          className="group border-t border-gold/12 px-6 py-10 text-right transition-colors duration-500 hover:bg-graphite/50 md:border-t-0 lg:px-10"
        >
          <p className="registry-label flex items-center justify-end gap-2">
            Дело № {next.index}
            <ArrowGlyph className="h-3.5 w-3.5" />
          </p>
          <p className="mt-3 font-display text-2xl text-cream/80 transition-all duration-500 ease-luxe group-hover:translate-x-1 group-hover:text-gold-soft">
            {next.title}
          </p>
        </Link>
      </div>
    </nav>
  );
}
