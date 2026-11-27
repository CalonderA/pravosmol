import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import { GoldRule, RegistryLabel } from '../components/motion';
import { useSeo } from '../lib/seo';
import { cn } from '../lib/utils';
import type { NewsItem } from '../components/NewsFeed';

const REPO = 'CalonderA/pravosmol';
const FILE_PATH = 'public/news.json';
const TOKEN_KEY = 'pravosmol_gh_token';
const UPLOADS_DIR = 'public/uploads';

/** Тонкий клиент GitHub Contents API. */
const ghHeaders = (token: string) => ({
  Authorization: `Bearer ${token}`,
  Accept: 'application/vnd.github+json',
  'X-GitHub-Api-Version': '2022-11-28',
});

function decodeBase64Utf8(b64: string): string {
  const bytes = Uint8Array.from(atob(b64.replace(/\s/g, '')), (c) => c.charCodeAt(0));
  return new TextDecoder('utf-8').decode(bytes);
}

function encodeBase64Utf8(str: string): string {
  const bytes = new TextEncoder().encode(str);
  let bin = '';
  bytes.forEach((b) => (bin += String.fromCharCode(b)));
  return btoa(bin);
}

async function readFileAsBase64(file: File): Promise<{ base64: string; ext: string }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = String(reader.result);
      const match = dataUrl.match(/^data:image\/(\w+);base64,(.*)$/);
      if (!match) return reject(new Error('Это не изображение'));
      const ext = match[1].toLowerCase() === 'jpeg' ? 'jpg' : match[1].toLowerCase();
      resolve({ base64: match[2], ext });
    };
    reader.onerror = () => reject(new Error('Не удалось прочитать файл'));
    reader.readAsDataURL(file);
  });
}

interface AdminItem extends NewsItem {}

export default function Admin() {
  useSeo('Администрирование — ПРАВО-СМОЛ');

  // noindex для админки
  useEffect(() => {
    document.querySelector('meta[name="robots"]')?.setAttribute('content', 'noindex, nofollow');
    return () => {
      document.querySelector('meta[name="robots"]')?.setAttribute('content', 'index, follow');
    };
  }, []);

  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) ?? '');
  const [authed, setAuthed] = useState(false);
  const [authError, setAuthError] = useState('');

  const [items, setItems] = useState<AdminItem[]>([]);
  const [sha, setSha] = useState<string | undefined>(undefined);
  const [loadingList, setLoadingList] = useState(false);

  const [type, setType] = useState<AdminItem['type']>('news');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<{ kind: 'ok' | 'err' | 'info'; text: string } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  /** Загрузить news.json из репозитория (свежая версия, не из кэша деплоя). */
  const loadList = async (t: string) => {
    setLoadingList(true);
    try {
      const res = await fetch(`https://api.github.com/repos/${REPO}/contents/${FILE_PATH}`, {
        headers: ghHeaders(t),
      });
      if (!res.ok) throw new Error(res.status === 401 ? 'Токен недействителен' : `Ошибка ${res.status}`);
      const json = await res.json();
      setSha(json.sha);
      const parsed = JSON.parse(decodeBase64Utf8(json.content ?? 'W10=')) as AdminItem[];
      setItems(Array.isArray(parsed) ? parsed : []);
      setAuthed(true);
      setAuthError('');
    } catch (e) {
      setAuthed(false);
      setAuthError(e instanceof Error ? e.message : 'Неизвестная ошибка');
    } finally {
      setLoadingList(false);
    }
  };

  // авто-вход по сохранённому токену
  useEffect(() => {
    if (token) loadList(token);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = (e: FormEvent) => {
    e.preventDefault();
    const t = token.trim();
    if (!t) return;
    localStorage.setItem(TOKEN_KEY, t);
    loadList(t);
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setToken('');
    setAuthed(false);
    setItems([]);
  };

  const onImagePick = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setImageFile(file);
    setImagePreview(file ? URL.createObjectURL(file) : '');
  };

  /** Коммит файла (или обновление существующего) в репозиторий. */
  const commitFile = async (
    path: string,
    contentB64: string,
    message: string,
    existingSha?: string,
  ) => {
    const res = await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`, {
      method: 'PUT',
      headers: { ...ghHeaders(token), 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, content: contentB64, ...(existingSha ? { sha: existingSha } : {}) }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message ?? `Ошибка GitHub: ${res.status}`);
    }
    return res.json();
  };

  const publish = async (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setStatus({ kind: 'err', text: 'Заполните заголовок и текст новости' });
      return;
    }
    setBusy(true);
    setStatus({ kind: 'info', text: 'Загружаем в репозиторий…' });
    try {
      let imagePath: string | null = null;
      if (imageFile) {
        const { base64, ext } = await readFileAsBase64(imageFile);
        imagePath = `/uploads/img_${Date.now()}.${ext}`;
        await commitFile(
          `${UPLOADS_DIR}/img_${Date.now()}.${ext}`,
          base64,
          `Изображение к публикации: ${title.trim()}`,
        );
      }
      const newItem: AdminItem = {
        id: Date.now(),
        type,
        title: title.trim(),
        content: content.trim(),
        image: imagePath,
        date,
      };
      const next = [newItem, ...items];
      await commitFile(
        FILE_PATH,
        encodeBase64Utf8(JSON.stringify(next, null, 2)),
        `Публикация: ${title.trim()}`,
        sha,
      );
      setItems(next);
      setTitle('');
      setContent('');
      setImageFile(null);
      setImagePreview('');
      if (fileRef.current) fileRef.current.value = '';
      setStatus({
        kind: 'ok',
        text: 'Опубликовано! Сайт пересоберётся автоматически и обновится через 1–2 минуты.',
      });
    } catch (err) {
      setStatus({ kind: 'err', text: err instanceof Error ? err.message : 'Ошибка публикации' });
    } finally {
      setBusy(false);
    }
  };

  const remove = async (id: number) => {
    if (!confirm('Удалить публикацию?')) return;
    setBusy(true);
    setStatus({ kind: 'info', text: 'Удаляем…' });
    try {
      const next = items.filter((i) => i.id !== id);
      await commitFile(
        FILE_PATH,
        encodeBase64Utf8(JSON.stringify(next, null, 2)),
        `Удаление публикации #${id}`,
        sha,
      );
      setItems(next);
      setStatus({ kind: 'ok', text: 'Удалено. Сайт обновится через 1–2 минуты.' });
    } catch (err) {
      setStatus({ kind: 'err', text: err instanceof Error ? err.message : 'Ошибка удаления' });
    } finally {
      setBusy(false);
    }
  };

  const inputCls =
    'w-full border border-gold/25 bg-graphite px-4 py-3 font-sans text-[14px] text-cream placeholder:text-fog/60 transition-colors duration-300 focus:border-gold focus:outline-none';

  return (
    <section className="min-h-screen bg-ink pb-24 pt-40 md:pt-48">
      <div className="mx-auto max-w-4xl px-6">
        <RegistryLabel index="§" title="Администрирование" />
        <h1 className="mt-10 font-display text-[clamp(2rem,4vw,3.2rem)] font-medium text-cream">
          Публикация новостей
        </h1>
        <GoldRule className="mt-8" />

        {!authed ? (
          <form onSubmit={login} className="mt-12 border border-gold/20 bg-graphite/60 p-8">
            <p className="registry-label">Токен GitHub</p>
            <input
              type="password"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="github_pat_…"
              autoComplete="off"
              className={cn(inputCls, 'mt-3')}
            />
            <p className="mt-4 text-[12.5px] leading-relaxed text-fog">
              Нужен токен с правом записи в репозиторий{' '}
              <span className="text-gold-soft">{REPO}</span>. Создай на{' '}
              <a
                href="https://github.com/settings/personal-access-tokens/new"
                target="_blank"
                rel="noreferrer noopener"
                className="text-gold-soft underline decoration-gold/40 underline-offset-4 hover:text-gold"
              >
                github.com/settings/personal-access-tokens
              </a>
              : Repository access → CalonderA/pravosmol, Permissions → Contents → Read and write.
              Токен хранится только в этом браузере.
            </p>
            {authError && <p className="mt-3 text-[13px] text-[#d98a6a]">{authError}</p>}
            <div className="mt-6">
              <button
                type="submit"
                disabled={loadingList}
                className="w-full border border-gold/60 bg-gold px-6 py-3.5 font-sans text-[12px] uppercase tracking-wide2 text-ink transition-all duration-500 hover:bg-gold-bright disabled:opacity-50"
              >
                {loadingList ? 'Проверяем токен…' : 'Войти в админку'}
              </button>
            </div>
          </form>
        ) : (
          <>
            <div className="mt-10 flex items-center justify-between">
              <p className="text-[12px] uppercase tracking-wide2 text-fog">
                Публикаций в ленте: <span className="text-gold-soft">{items.length}</span>
              </p>
              <button
                onClick={logout}
                className="text-[12px] uppercase tracking-wide2 text-fog transition-colors hover:text-gold-soft"
              >
                Выйти
              </button>
            </div>

            {status && (
              <p
                className={cn(
                  'mt-6 border px-5 py-4 text-[13.5px] leading-relaxed',
                  status.kind === 'ok' && 'border-gold/40 bg-gold/10 text-gold-soft',
                  status.kind === 'info' && 'border-gold/25 bg-graphite text-fog',
                  status.kind === 'err' && 'border-[#d98a6a]/50 bg-[#d98a6a]/10 text-[#e8a990]',
                )}
              >
                {status.text}
              </p>
            )}

            <div className="mt-10 grid gap-10 md:grid-cols-2">
              {/* форма публикации */}
              <form onSubmit={publish} className="border border-gold/20 bg-graphite/60 p-7">
                <p className="registry-label">Новая публикация</p>
                <div className="mt-5 grid grid-cols-2 gap-4">
                  <label className="block">
                    <span className="registry-label">Тип</span>
                    <select
                      value={type}
                      onChange={(e) => setType(e.target.value as AdminItem['type'])}
                      className={cn(inputCls, 'mt-2 appearance-none')}
                    >
                      <option value="news">Новость</option>
                      <option value="work">Кейс</option>
                    </select>
                  </label>
                  <label className="block">
                    <span className="registry-label">Дата</span>
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className={cn(inputCls, 'mt-2')}
                    />
                  </label>
                </div>
                <label className="mt-5 block">
                  <span className="registry-label">Заголовок</span>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Открытие нового офиса в Смоленске"
                    className={cn(inputCls, 'mt-2')}
                  />
                </label>
                <label className="mt-5 block">
                  <span className="registry-label">Текст</span>
                  <textarea
                    rows={5}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="О чём расскажем клиентам…"
                    className={cn(inputCls, 'mt-2 resize-none')}
                  />
                </label>
                <label className="mt-5 block">
                  <span className="registry-label">Изображение — по желанию</span>
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/png,image/jpeg,image/gif"
                    onChange={onImagePick}
                    className={cn(inputCls, 'mt-2 file:mr-4 file:border-0 file:bg-gold/20 file:px-3 file:py-1.5 file:text-gold-soft')}
                  />
                </label>
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Предпросмотр"
                    className="mt-4 max-h-44 w-full border border-gold/20 object-cover"
                  />
                )}
                <button
                  type="submit"
                  disabled={busy}
                  className="mt-7 w-full border border-gold/60 bg-gold px-6 py-3.5 font-sans text-[12px] uppercase tracking-wide2 text-ink transition-all duration-500 hover:bg-gold-bright disabled:opacity-50"
                >
                  {busy ? 'Публикуем…' : 'Опубликовать'}
                </button>
              </form>

              {/* список публикаций */}
              <div className="border border-gold/20 bg-graphite/60 p-7">
                <p className="registry-label">Опубликованное</p>
                <div className="mt-5 max-h-[560px] space-y-0 overflow-y-auto pr-1">
                  {items.length === 0 && (
                    <p className="py-6 text-[13px] text-fog">Лента пуста — опубликуйте первую новость.</p>
                  )}
                  {items.map((item) => (
                    <div key={item.id} className="group flex items-start gap-3 border-b border-gold/12 py-4">
                      <div className="min-w-0 flex-1">
                        <p className="text-[11px] uppercase tracking-wide2 text-gold/70">
                          {item.type === 'work' ? 'Кейс' : 'Новость'} · {item.date}
                        </p>
                        <p className="mt-1 truncate font-display text-[16px] text-cream">{item.title}</p>
                      </div>
                      <button
                        onClick={() => remove(item.id)}
                        disabled={busy}
                        aria-label={`Удалить: ${item.title}`}
                        className="shrink-0 border border-gold/25 px-2.5 py-1 text-[11px] text-fog transition-all duration-300 hover:border-[#d98a6a] hover:text-[#d98a6a] disabled:opacity-40"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
