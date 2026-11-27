// Обработка фирменного логотипа:
//  1. чёрный фон -> прозрачность
//  2. тёмно-синие элементы -> светлый кремовый (видно на тёмных секциях)
//  3. золотые весы остаются золотыми
// Результаты:
//  - public/images/logo-mark.png   (кроп щита, квадрат, 512px — шапка/футер/фавикон)
//  - public/images/logo-lockup.png (полный лого-локап для прелоадера)
//  - public/favicon.png            (64px)
// Запуск: node scripts/make-logo.mjs
import sharp from 'sharp';

const SRC = 'public/images/logo.png';

const recolor = ({ data, info }) => {
  const { width, height, channels } = info;
  const out = Buffer.from(data);
  for (let i = 0; i < out.length; i += channels) {
    const r = out[i];
    const g = out[i + 1];
    const b = out[i + 2];
    // почти чёрный фон -> прозрачный
    if (r < 44 && g < 44 && b < 44) {
      out[i + 3] = 0;
      continue;
    }
    // тёмно-синий (вес «синего» заметно выше красного, в целом тёмный) -> кремовый
    const brightness = 0.299 * r + 0.587 * g + 0.114 * b;
    if (b > r + 10 && b >= g - 6 && brightness < 165) {
      out[i] = 245;
      out[i + 1] = 240;
      out[i + 2] = 228;
    }
  }
  return { data: out, info };
};

const source = sharp(SRC).ensureAlpha();
const meta = await source.metadata();
console.log('источник:', meta.width, 'x', meta.height);

// 1) кроп щита (в оригинале 1024px: щит ~ x 320–710, y 118–505)
const markBuf = await source
  .clone()
  .extract({ left: 312, top: 118, width: 398, height: 398 })
  .raw()
  .toBuffer({ resolveWithObject: true })
  .then(recolor);

await sharp(markBuf.data, { raw: markBuf.info })
  .resize(512, 512)
  .png()
  .toFile('public/images/logo-mark.png');

// 2) favicon 64px из щита
await sharp(markBuf.data, { raw: markBuf.info })
  .resize(64, 64)
  .png()
  .toFile('public/favicon.png');

// 3) полный локап с перекраской и прозрачным фоном
const lockBuf = await source
  .clone()
  .raw()
  .toBuffer({ resolveWithObject: true })
  .then(recolor);

await sharp(lockBuf.data, { raw: lockBuf.info })
  .png()
  .toFile('public/images/logo-lockup.png');

console.log('готово: logo-mark.png, logo-lockup.png, favicon.png');
