import { AnimatePresence, motion } from 'framer-motion';
import { useState, type FormEvent } from 'react';
import { SERVICES_OPTIONS } from '../lib/data';
import { cn } from '../lib/utils';
import { GoldButton } from './Buttons';
import { LUXE } from './motion';

interface Fields {
  name: string;
  phone: string;
  email: string;
  service: string;
  message: string;
}

const EMPTY: Fields = { name: '', phone: '', email: '', service: '', message: '' };

/** Форма заявки на консультацию: тёмный фон, золотые акценты, валидация и сценарий успеха. */
export function ConsultationForm({
  defaultService,
  id = 'consultation-form',
}: {
  defaultService?: string;
  id?: string;
}) {
  const [fields, setFields] = useState<Fields>({ ...EMPTY, service: defaultService ?? '' });
  const [errors, setErrors] = useState<Partial<Record<keyof Fields | 'consent', string>>>({});
  const [consent, setConsent] = useState(false);
  const [state, setState] = useState<'idle' | 'sending' | 'done'>('idle');
  const [apiError, setApiError] = useState('');

  const set = (key: keyof Fields) => (e: { target: { value: string } }) => {
    setFields((f) => ({ ...f, [key]: e.target.value }));
    setErrors((er) => ({ ...er, [key]: undefined }));
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const er: typeof errors = {};
    if (fields.name.trim().length < 2) er.name = 'Укажите, как к вам обращаться';
    if (fields.phone.trim().length < 6) er.phone = 'Укажите номер для связи';
    if (fields.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) er.email = 'Проверьте адрес почты';
    if (!consent) er.consent = 'Подтвердите согласие на обработку персональных данных';
    setErrors(er);
    if (Object.keys(er).length > 0) return;

    setState('sending');

    // На хостинге pravo-smol.ru заявка уходит на PHP-обработчик api.php
    // (письмо на info@pravo-smol.ru). На статических зеркалах (GitHub Pages,
    // локальный просмотр) api.php отсутствует — включается демо-сценарий.
    try {
      const res = await fetch('/api.php?action=send_lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: fields.name.trim(),
          phone: fields.phone.trim(),
          email: fields.email.trim(),
          message: `${fields.service ? `Услуга: ${fields.service}. ` : ''}${fields.message.trim()}`,
          consent: true,
        }),
      });
      const json = res.ok ? await res.json().catch(() => null) : null;
      if (json?.success) {
        setState('done');
        return;
      }
      if (json?.error) {
        setApiError(json.error + ' Позвоните нам: 8 (920) 662-90-31 — примем заявку по телефону.');
        setState('idle');
        return;
      }
    } catch {
      // api.php недоступен — статическое зеркало, показываем демо-подтверждение
    }
    window.setTimeout(() => setState('done'), 600);
  };

  const inputCls =
    'w-full border-b border-gold/25 bg-transparent px-0 py-3 font-sans text-[15px] text-cream placeholder:text-fog/70 transition-colors duration-300 focus:border-gold focus:outline-none';

  return (
    <div id={id} className="relative">
      <AnimatePresence mode="wait">
        {state === 'done' ? (
          <motion.div
            key="done"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: LUXE }}
            className="flex min-h-[420px] flex-col items-center justify-center border border-gold/30 bg-graphite/60 px-8 text-center"
          >
            <svg viewBox="0 0 48 48" className="h-14 w-14 text-gold" fill="none" aria-hidden>
              <circle cx="24" cy="24" r="22" stroke="currentColor" strokeWidth="1.2" className="opacity-50" />
              <path
                d="M14 24.5 21 31.5 34 17.5"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="square"
                className="draw-stroke"
              />
            </svg>
            <p className="mt-8 font-display text-3xl text-cream">Заявка принята</p>
            <p className="mt-4 max-w-[42ch] text-sm leading-relaxed text-fog">
              Юрист ПРАВО-СМОЛ свяжется с вами в течение 15 минут в рабочее время и предложит
              удобный формат разговора — в офисе, по телефону или в мессенджере.
            </p>
            <p className="mt-6 font-display text-lg italic text-gold-soft">
              «Закон радует тех, кто с нами!»
            </p>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            onSubmit={submit}
            noValidate
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.4 }}
            className="border border-gold/20 bg-graphite/60 p-8 md:p-10"
          >
            <div className="grid gap-7 md:grid-cols-2">
              <Field label="Ваше имя" error={errors.name}>
                <input
                  type="text"
                  value={fields.name}
                  onChange={set('name')}
                  placeholder="Иван Иванов"
                  autoComplete="name"
                  className={inputCls}
                />
              </Field>
              <Field label="Номер телефона" error={errors.phone}>
                <input
                  type="tel"
                  value={fields.phone}
                  onChange={set('phone')}
                  placeholder="+7 ___ ___-__-__"
                  autoComplete="tel"
                  className={inputCls}
                />
              </Field>
              <Field label="Электронная почта" error={errors.email} optional>
                <input
                  type="email"
                  value={fields.email}
                  onChange={set('email')}
                  placeholder="name@company.ru"
                  autoComplete="email"
                  className={inputCls}
                />
              </Field>
              <Field label="Юридическая услуга">
                <select
                  value={fields.service}
                  onChange={set('service')}
                  className={cn(inputCls, 'appearance-none bg-transparent', !fields.service && 'text-fog/70')}
                >
                  <option value="" disabled className="bg-graphite text-fog">
                    Выберите направление
                  </option>
                  {SERVICES_OPTIONS.map((s) => (
                    <option key={s} value={s} className="bg-graphite text-cream">
                      {s}
                    </option>
                  ))}
                  <option value="Другое" className="bg-graphite text-cream">
                    Другое / несколько направлений
                  </option>
                </select>
              </Field>
            </div>

            <div className="mt-7">
              <Field label="Опишите вашу ситуацию">
                <textarea
                  rows={4}
                  value={fields.message}
                  onChange={set('message')}
                  placeholder="Несколько фраз о ситуации — этого достаточно для первого ответа"
                  className={cn(inputCls, 'resize-none')}
                />
              </Field>
            </div>

            {apiError && (
              <p className="mt-6 border border-[#d98a6a]/50 bg-[#d98a6a]/10 px-5 py-4 text-[13.5px] leading-relaxed text-[#e8a990]">
                {apiError}
              </p>
            )}

            {/* согласие на обработку персональных данных */}
            <div className="mt-8">
              <label className="flex max-w-[52ch] cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => {
                    setConsent(e.target.checked);
                    setErrors((er) => ({ ...er, consent: undefined }));
                  }}
                  className="mt-1 h-4 w-4 shrink-0 appearance-none border border-gold/50 bg-transparent transition-colors duration-300 checked:border-gold checked:bg-gold focus:outline-none"
                />
                <span className="text-[12.5px] leading-relaxed text-fog">
                  Я согласен(-на) на обработку персональных данных в соответствии с{' '}
                  <a href="/legal" className="text-gold-soft underline decoration-gold/40 underline-offset-4 hover:text-gold">
                    политикой конфиденциальности
                  </a>
                  .
                </span>
              </label>
              {errors.consent && (
                <p className="mt-2 text-[12px] text-[#d98a6a]">{errors.consent}</p>
              )}
            </div>

            <div className="mt-8 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <GoldButton type="submit" disabled={state === 'sending'}>
                {state === 'sending' ? 'Отправляем…' : 'Отправить заявку'}
              </GoldButton>
              <p className="flex max-w-[34ch] items-start gap-2.5 text-[12px] leading-relaxed text-fog">
                <LockGlyph />
                Данные защищены юридической тайной и не передаются третьим лицам. Ответ — в течение
                15 минут в рабочее время.
              </p>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}

function Field({
  label,
  children,
  error,
  optional,
}: {
  label: string;
  children: React.ReactNode;
  error?: string;
  optional?: boolean;
}) {
  return (
    <label className="block">
      <span className="registry-label flex items-baseline gap-2">
        {label}
        {optional && <span className="text-fog/50 normal-case tracking-normal">— по желанию</span>}
      </span>
      <span className="mt-2 block">{children}</span>
      {error && <span className="mt-2 block text-[12px] text-[#d98a6a]">{error}</span>}
    </label>
  );
}

function LockGlyph() {
  return (
    <svg viewBox="0 0 16 16" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold/70" fill="none" aria-hidden>
      <rect x="3" y="7" width="10" height="7" stroke="currentColor" strokeWidth="1.2" />
      <path d="M5.5 7V5.2a2.5 2.5 0 0 1 5 0V7" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}
