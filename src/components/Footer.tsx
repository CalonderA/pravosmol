import { Link } from 'react-router-dom';
import { CONTACTS, PRACTICES } from '../lib/data';
import { useSectionNav } from '../lib/sectionNav';
import { LogoMark } from './LogoMark';
import { Reveal } from './motion';

const CHANNELS = [
  { label: 'WhatsApp', href: 'https://wa.me/79206629031', glyph: 'WA' },
  { label: 'Почта', href: CONTACTS.emailHref, glyph: '@' },
  { label: 'Позвонить', href: CONTACTS.phoneHref, glyph: 'TEL' },
];

export function Footer() {
  const goTo = useSectionNav();
  const year = new Date().getFullYear();

  return (
    <footer id="contacts" className="relative overflow-hidden border-t border-gold/15 bg-coal">
      {/* призрачный вензель на фоне */}
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-10 left-1/2 w-full -translate-x-1/2 select-none text-center font-display font-semibold tracking-[0.14em] text-cream/[0.04]"
        style={{ fontSize: 'clamp(6rem, 17vw, 17rem)', lineHeight: 0.8 }}
      >
        ПРАВО-СМОЛ
      </div>

      <div className="relative mx-auto max-w-shell px-6 pb-10 pt-20 lg:px-10 lg:pt-28">
        <Reveal>
          <div className="flex items-center gap-4">
            <LogoMark className="h-12 w-12" />
            <div>
              <p className="font-display text-xl font-semibold tracking-[0.22em] text-cream">ПРАВО-СМОЛ</p>
              <p className="mt-1 text-[10px] uppercase tracking-registry text-fog">
                Ваш надёжный юрист в Смоленске
              </p>
            </div>
          </div>
          <p className="mt-8 max-w-[58ch] font-sans text-[13.5px] leading-relaxed text-fog">
            Профессиональные юридические услуги, защита прав и законных интересов граждан и
            организаций. Мы делаем правосудие доступным и понятным.
          </p>
        </Reveal>

        <div className="mt-16 grid gap-12 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {/* Направления */}
          <Reveal delay={0.05}>
            <p className="registry-label">Направления практики</p>
            <ul className="mt-6 space-y-3">
              {PRACTICES.map((p) => (
                <li key={p.slug}>
                  <Link
                    to={`/practice/${p.slug}`}
                    className="text-sm text-cream/70 transition-colors duration-300 hover:text-gold-soft"
                  >
                    {p.title}
                  </Link>
                </li>
              ))}
            </ul>
          </Reveal>

          {/* Фирма */}
          <Reveal delay={0.1}>
            <p className="registry-label">Фирма</p>
            <ul className="mt-6 space-y-3">
              {[
                { label: 'О компании', hash: 'about' },
                { label: 'Кто ведёт дела', hash: 'team' },
                { label: 'Новости и кейсы', hash: 'news' },
                { label: 'Этапы работы', hash: 'process' },
                { label: 'Отзывы клиентов', hash: 'testimonials' },
                { label: 'Оставить заявку', hash: 'consultation' },
              ].map((l) => (
                <li key={l.hash}>
                  <button
                    onClick={() => goTo(l.hash)}
                    className="text-left text-sm text-cream/70 transition-colors duration-300 hover:text-gold-soft"
                  >
                    {l.label}
                  </button>
                </li>
              ))}
            </ul>
          </Reveal>

          {/* Контакты */}
          <Reveal delay={0.15}>
            <p className="registry-label">Контакты</p>
            <ul className="mt-6 space-y-3 text-sm text-cream/70">
              <li>{CONTACTS.office}</li>
              <li>
                <a href={CONTACTS.phoneHref} className="font-display text-lg tracking-wide text-gold-soft transition-colors hover:text-gold-bright">
                  {CONTACTS.phone}
                </a>
              </li>
              <li>
                <a href={CONTACTS.emailHref} className="transition-colors hover:text-gold-soft">
                  {CONTACTS.email}
                </a>
              </li>
              <li className="text-fog">{CONTACTS.hours}</li>
            </ul>
          </Reveal>

          {/* Каналы связи */}
          <Reveal delay={0.2}>
            <p className="registry-label">Связь</p>
            <div className="mt-6 flex gap-3">
              {CHANNELS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target={s.href.startsWith('http') ? '_blank' : undefined}
                  rel={s.href.startsWith('http') ? 'noreferrer noopener' : undefined}
                  aria-label={s.label}
                  className="flex h-11 w-11 items-center justify-center border border-gold/25 font-sans text-[11px] tracking-widest text-gold-soft transition-all duration-500 ease-luxe hover:border-gold hover:bg-gold/10 hover:text-gold-bright"
                >
                  {s.glyph}
                </a>
              ))}
            </div>
            <p className="mt-6 max-w-[26ch] text-[13px] leading-relaxed text-fog">
              Оставьте заявку — юрист свяжется с вами в течение 15 минут.
            </p>
          </Reveal>
        </div>

        <div className="mt-20 h-px w-full bg-gold/15" />

        <div className="mt-6 flex flex-col gap-3 text-[12px] text-fog md:flex-row md:items-center md:justify-between">
          <p>© {year} ПРАВО-СМОЛ. Все права защищены.</p>
          <div className="flex flex-wrap gap-6">
            <Link to="/admin" className="transition-colors hover:text-gold-soft">
              Админ-панель
            </Link>
            <Link to="/legal" className="transition-colors hover:text-gold-soft">
              Политика конфиденциальности
            </Link>
            <span>Фотоматериалы — Wikimedia Commons</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
