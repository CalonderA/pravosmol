import { useEffect, useState } from 'react';
import { LinesUpOnScroll, RegistryLabel, Reveal } from './motion';
import { ParallaxImage } from './motion';

export interface NewsItem {
  id: number;
  type: 'news' | 'work';
  title: string;
  content: string;
  image?: string | null;
  date: string;
}

/** Форматирует дату в любом из двух форматов админки: ISO или дд.мм.гггг. */
function formatDate(raw: string): string {
  const iso = /^\d{4}-\d{2}-\d{2}$/.test(raw) ? new Date(raw) : null;
  if (iso && !Number.isNaN(iso.getTime())) {
    return iso.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
  }
  return raw;
}

function typeLabel(type: NewsItem['type']): string {
  return type === 'work' ? 'Кейс' : 'Новость';
}

/** Лента «Новости и кейсы»: содержимое приходит из public/news.json,
 *  который пополняет фирменная админка (публикация → коммит → автосборка). */
export function NewsFeed() {
  const [items, setItems] = useState<NewsItem[] | null>(null);

  useEffect(() => {
    let alive = true;
    fetch('/news.json')
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((data: NewsItem[]) => {
        if (alive && Array.isArray(data)) setItems(data);
      })
      .catch(() => {
        if (alive) setItems([]);
      });
    return () => {
      alive = false;
    };
  }, []);

  // пока лента не загружена — не рисуем ничего, чтобы не мигало
  if (items === null) return null;
  const visible = [...items]
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .slice(0, 6);
  if (visible.length === 0) return null;

  return (
    <section id="news" className="bg-cream text-onyx">
      <div className="mx-auto max-w-shell px-6 py-24 lg:px-10 lg:py-36">
        <RegistryLabel index="05" title="Новости и кейсы" tone="light" />

        <div className="mt-14 grid gap-16 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-4">
            <h2 className="display-tight text-[clamp(2.2rem,4.6vw,4rem)] text-onyx">
              <LinesUpOnScroll
                lines={[
                  <span key="a">Что происходит</span>,
                  <span key="b">
                    в фирме <em className="italic text-gold-deep">сейчас.</em>
                  </span>,
                ]}
              />
            </h2>
            <Reveal delay={0.15}>
              <p className="mt-8 max-w-[40ch] font-sans text-[14.5px] leading-relaxed text-clay">
                Новости фирмы и примеры дел — публикуются партнёром-куратором через фирменную
                админку: без посредников и задержек.
              </p>
              <p className="mt-8 flex items-center gap-3 text-[11px] uppercase tracking-registry text-clay/80">
                <span className="h-1.5 w-1.5 rotate-45 bg-gold-deep" aria-hidden />
                Лента обновляется в день публикации
              </p>
            </Reveal>
          </div>

          <div className="lg:col-span-7 lg:col-start-6">
            {visible.map((item, i) => (
              <Reveal key={item.id} delay={Math.min(i * 0.06, 0.25)}>
                <article className="border-t border-onyx/15 py-9">
                  <div className="flex flex-wrap items-baseline gap-x-5 gap-y-1">
                    <span className="font-display text-lg italic text-gold-deep/85">
                      {formatDate(item.date)}
                    </span>
                    <span className="border border-gold-deep/40 px-2.5 py-0.5 text-[10.5px] uppercase tracking-wide2 text-gold-deep">
                      {typeLabel(item.type)}
                    </span>
                  </div>
                  <h3 className="mt-4 font-display text-[clamp(1.4rem,2.4vw,2rem)] leading-tight text-onyx transition-colors duration-500">
                    {item.title}
                  </h3>
                  {item.image && (
                    <ParallaxImage
                      src={item.image}
                      alt={item.title}
                      className="mt-6 aspect-[16/8] border border-onyx/15"
                      amplitude={22}
                    />
                  )}
                  <p className="mt-4 max-w-[62ch] font-sans text-[14px] leading-relaxed text-onyx/80">
                    {item.content}
                  </p>
                </article>
              </Reveal>
            ))}
            <div className="border-t border-onyx/15" />
          </div>
        </div>
      </div>
    </section>
  );
}
