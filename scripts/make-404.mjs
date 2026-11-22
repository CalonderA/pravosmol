import { copyFileSync } from 'node:fs';

// GitHub Pages отдаёт 404.html для неизвестных маршрутов.
// Копия index.html превращает её в SPA-фолбэк для BrowserRouter.
copyFileSync('dist/index.html', 'dist/404.html');
console.log('dist/404.html создан (SPA-фолбэк)');
