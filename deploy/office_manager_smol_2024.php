<?php
// Защита админки: требуем секретный параметр в URL
if (!isset($_GET['access']) || $_GET['access'] !== 'granted_smol_jur') {
    header("HTTP/1.1 404 Not Found");
    echo "Not Found";
    exit;
}
?>
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Админ-панель ЮрАктив Смоленск</title>
    <link rel="icon" type="image/png" href="ic_logo.png">
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;600;700&display=swap" rel="stylesheet">
    <script src="https://unpkg.com/lucide@latest"></script>
    <style>
        body { background: #080808; color: #e0e0e0; font-family: 'Montserrat', sans-serif; }
        .glass { background: rgba(255, 255, 255, 0.03); backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.08); }
        .accent-gold { color: #C5A367; }
        .bg-gold { background: #C5A367; }
        
        input, textarea, select { 
            background: rgba(255,255,255,0.05); 
            border: 1px solid rgba(255,255,255,0.1); 
            color: white; 
            padding: 14px 18px; 
            border-radius: 12px; 
            width: 100%; 
            margin-bottom: 20px; 
            outline: none;
            transition: all 0.3s ease;
        }
        input:focus, textarea:focus, select:focus { 
            border-color: #C5A367; 
            background: rgba(255,255,255,0.08);
            box-shadow: 0 0 15px rgba(197, 163, 103, 0.1);
        }
        
        .btn-gold { 
            background: #C5A367; 
            color: #000; 
            padding: 16px; 
            border-radius: 12px; 
            font-weight: 700; 
            letter-spacing: 0.05em;
            text-transform: uppercase;
            cursor: pointer; 
            transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
        }
        .btn-gold:hover { 
            background: #E6D5B8; 
            transform: translateY(-3px);
            box-shadow: 0 10px 20px rgba(197, 163, 103, 0.2);
        }
        .btn-gold:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

        .tooltip-box {
            position: relative;
            display: inline-block;
        }
        .tooltip-text {
            visibility: hidden;
            width: 220px;
            background: #1a1a1a;
            color: #fff;
            text-align: center;
            padding: 10px;
            border-radius: 8px;
            position: absolute;
            z-index: 50;
            bottom: 125%;
            left: 50%;
            transform: translateX(-50%);
            opacity: 0;
            transition: opacity 0.3s;
            font-size: 11px;
            border: 1px solid #C5A367;
            pointer-events: none;
            line-height: 1.4;
        }
        .tooltip-box:hover .tooltip-text { visibility: visible; opacity: 1; }

        .preview-container {
            width: 100%;
            height: 200px;
            border: 2px dashed rgba(255,255,255,0.1);
            border-radius: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 20px;
            overflow: hidden;
            position: relative;
        }
        #imagePreview { width: 100%; height: 100%; object-fit: cover; display: none; }

        /* Modal Styles */
        .modal {
            display: none;
            position: fixed;
            inset: 0;
            z-index: 100;
            background: rgba(0,0,0,0.9);
            backdrop-filter: blur(10px);
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        .modal-content {
            background: #111;
            border: 1px solid rgba(197, 163, 103, 0.2);
            border-radius: 32px;
            max-width: 800px;
            width: 100%;
            max-height: 90vh;
            overflow-y: auto;
            position: relative;
        }
        
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(197, 163, 103, 0.2); border-radius: 10px; }
    </style>
</head>
<body class="p-6 md:p-12 min-h-screen flex items-center justify-center">
    <div class="max-w-6xl w-full">
        <!-- Header -->
        <div class="flex flex-col md:flex-row justify-between items-end mb-12 gap-8">
            <div>
                <div class="flex items-center gap-3 mb-2">
                    <div class="w-10 h-10 flex items-center justify-center">
                        <img src="ic_logo.png" alt="Logo" class="w-full h-full object-contain">
                    </div>
                    <span class="text-xs font-bold uppercase tracking-[0.3em] opacity-40">Панель управления</span>
                </div>
                <h1 class="text-4xl md:text-5xl font-bold accent-gold">ЮрАктив <span class="text-white opacity-90">Смоленск</span></h1>
            </div>
            
            <div class="glass p-4 rounded-2xl flex flex-col gap-2 w-full md:w-auto">
                <div class="flex items-center gap-2 mb-1">
                    <i data-lucide="lock" class="w-3 h-3 accent-gold"></i>
                    <span class="text-[10px] uppercase font-bold tracking-widest opacity-50">Безопасный вход</span>
                </div>
                <input type="password" id="adminPassword" placeholder="Введите секретный ключ" class="mb-0 py-2 px-4 text-sm bg-white/5 border-white/10 w-full md:w-64">
            </div>
        </div>
        
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <!-- Form Column -->
            <div class="lg:col-span-5">
                <div class="glass p-8 rounded-[32px] relative overflow-hidden">
                    <div class="absolute top-0 right-0 p-8 opacity-5">
                        <i data-lucide="file-plus" class="w-24 h-24"></i>
                    </div>
                    
                    <h2 class="text-2xl font-bold mb-8 flex items-center gap-3">
                        Создать публикацию
                        <div class="tooltip-box">
                            <i data-lucide="help-circle" class="w-4 h-4 opacity-30 cursor-help hover:opacity-100 transition-opacity"></i>
                            <span class="tooltip-text">Выберите тип контента, добавьте заголовок, текст и фото. После публикации запись сразу появится на главной странице.</span>
                        </div>
                    </h2>

                    <form id="addForm">
                        <label class="block mb-2 text-[10px] uppercase font-bold tracking-[0.2em] opacity-40 ml-1">Раздел сайта</label>
                        <select id="type">
                            <option value="news">Новости законодательства</option>
                            <option value="work">Успешная практика / Кейс</option>
                        </select>
                        
                        <label class="block mb-2 text-[10px] uppercase font-bold tracking-[0.2em] opacity-40 ml-1">Заголовок</label>
                        <input type="text" id="title" placeholder="Например: Победа в суде по трудовому спору" required>
                        
                        <label class="block mb-2 text-[10px] uppercase font-bold tracking-[0.2em] opacity-40 ml-1">Текст публикации</label>
                        <textarea id="content" rows="6" placeholder="Опишите подробности дела или новость..." required></textarea>

                        <label class="block mb-2 text-[10px] uppercase font-bold tracking-[0.2em] opacity-40 ml-1">Медиа-файл</label>
                        <div class="preview-container group cursor-pointer" onclick="document.getElementById('imageInput').click()">
                            <div id="uploadPlaceholder" class="flex flex-col items-center gap-2 opacity-30 group-hover:opacity-60 transition-opacity">
                                <i data-lucide="image-plus" class="w-10 h-10"></i>
                                <span class="text-xs">Нажмите, чтобы загрузить фото</span>
                            </div>
                            <img id="imagePreview">
                        </div>
                        <input type="file" id="imageInput" accept="image/*" class="hidden">
                        
                        <button type="submit" id="submitBtn" class="btn-gold">
                            <i data-lucide="send" class="w-5 h-5"></i>
                            Опубликовать сейчас
                        </button>
                    </form>
                </div>
            </div>

            <!-- List Column -->
            <div class="lg:col-span-7">
                <div class="glass p-8 rounded-[32px] h-full flex flex-col">
                    <div class="flex justify-between items-center mb-8">
                        <h2 class="text-2xl font-bold">Активные записи</h2>
                        <div class="text-[10px] uppercase font-bold tracking-widest opacity-30" id="statsCount">Загрузка...</div>
                    </div>
                    
                    <div id="itemsList" class="space-y-4 overflow-y-auto pr-4 flex-1 max-h-[700px]">
                        <!-- Items -->
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Modal for "Details" -->
    <div id="detailsModal" class="modal">
        <div class="modal-content p-8 md:p-12">
            <button onclick="closeModal()" class="absolute top-6 right-6 text-white/40 hover:text-white transition-colors">
                <i data-lucide="x" class="w-8 h-8"></i>
            </button>
            <div id="modalBody">
                <!-- Content injected here -->
            </div>
        </div>
    </div>

    <script>
        lucide.createIcons();
        const imageInput = document.getElementById('imageInput');
        const imagePreview = document.getElementById('imagePreview');
        const uploadPlaceholder = document.getElementById('uploadPlaceholder');
        let currentBase64 = null;

        // Вспомогательная функция для безопасного получения JSON (теперь через api.php)
        async function fetchJson(url, options = {}) {
            try {
                const res = await fetch(url, options);
                const contentType = res.headers.get('content-type');
                
                if (!res.ok) {
                    if (contentType && contentType.includes('application/json')) {
                        const errData = await res.json();
                        throw new Error(errData.error || `Ошибка сервера: ${res.status}`);
                    } else {
                        const text = await res.text();
                        console.error('Server returned non-JSON:', text.substring(0, 100));
                        throw new Error(`Сервер вернул ошибку ${res.status}. Проверьте правильность загрузки api.php.`);
                    }
                }

                if (!contentType || !contentType.includes('application/json')) {
                    throw new Error('Сервер вернул некорректный формат данных (ожидался JSON).');
                }

                return await res.json();
            } catch (e) {
                if (e.message.includes('Unexpected token')) {
                    throw new Error('Ошибка: Сервер вернул HTML вместо данных. Проверьте api.php на сервере.');
                }
                throw e;
            }
        }

        imageInput.addEventListener('change', function() {
            const file = this.files[0];
            if (file) {
                if (file.size > 5 * 1024 * 1024) {
                    alert('Файл слишком большой! Максимальный размер — 5 МБ.');
                    this.value = '';
                    return;
                }

                const reader = new FileReader();
                reader.onload = function(e) {
                    currentBase64 = e.target.result;
                    imagePreview.src = currentBase64;
                    imagePreview.style.display = 'block';
                    uploadPlaceholder.style.display = 'none';
                }
                reader.readAsDataURL(file);
            }
        });

        const loadItems = async () => {
            try {
                const data = await fetchJson('api.php?action=get_data');
                window.allData = data; // Сохраняем для модалки
                const list = document.getElementById('itemsList');
                document.getElementById('statsCount').innerText = `Всего: ${data.length}`;
                
                list.innerHTML = data.map(item => `
                    <div class="glass p-5 rounded-2xl border-white/5 flex gap-5 group hover:bg-white/[0.05] transition-all relative">
                        <div class="w-20 h-20 shrink-0 rounded-xl overflow-hidden bg-white/5 border border-white/10">
                            ${item.image ? `<img src="${item.image}" class="w-full h-full object-cover">` : `<div class="w-full h-full flex items-center justify-center opacity-10"><i data-lucide="image"></i></div>`}
                        </div>
                        <div class="flex-1 min-w-0">
                            <div class="flex items-center gap-2 mb-1">
                                <span class="text-[9px] uppercase font-bold tracking-widest ${item.type === 'news' ? 'accent-gold' : 'text-white/40'}">
                                    ${item.type === 'news' ? 'Новость' : 'Успешный кейс'}
                                </span>
                                <span class="w-1 h-1 rounded-full bg-white/10"></span>
                                <span class="text-[9px] opacity-20 uppercase font-bold">${item.date}</span>
                            </div>
                            <h3 class="text-base font-bold text-white truncate group-hover:text-accent-gold transition-colors">${item.title}</h3>
                            <p class="text-xs text-white/40 mt-1 line-clamp-1 leading-relaxed">${item.content}</p>
                            
                            <div class="flex gap-4 mt-3">
                                <button onclick="showDetails(${item.id})" class="text-[10px] uppercase font-bold tracking-widest text-accent-gold hover:underline">Подробнее</button>
                                <button onclick="deleteItem(${item.id})" class="text-[10px] uppercase font-bold tracking-widest text-red-500/60 hover:text-red-500 transition-colors">Удалить</button>
                            </div>
                        </div>
                    </div>
                `).join('');
                lucide.createIcons();
            } catch (e) { 
                console.error(e);
                document.getElementById('statsCount').innerText = 'Ошибка загрузки данных';
            }
        };

        window.showDetails = (id) => {
            const item = window.allData.find(i => i.id == id);
            if (!item) return;

            const modalBody = document.getElementById('modalBody');
            modalBody.innerHTML = `
                <div class="flex items-center gap-3 mb-6">
                    <span class="text-xs font-bold uppercase tracking-[0.3em] ${item.type === 'news' ? 'accent-gold' : 'text-white/40'}">
                        ${item.type === 'news' ? 'Новость законодательства' : 'Успешный кейс'}
                    </span>
                    <span class="text-xs opacity-30 uppercase font-bold">${item.date}</span>
                </div>
                <h2 class="text-3xl font-bold mb-8 text-white">${item.title}</h2>
                ${item.image ? `<img src="${item.image}" class="w-full rounded-2xl mb-8 border border-white/10 shadow-2xl">` : ''}
                <div class="text-white/70 leading-relaxed text-lg whitespace-pre-wrap">${item.content}</div>
            `;
            document.getElementById('detailsModal').style.display = 'flex';
        };

        window.closeModal = () => {
            document.getElementById('detailsModal').style.display = 'none';
        };

        window.deleteItem = async (id) => {
            const password = document.getElementById('adminPassword').value;
            if (!password) return alert('Введите пароль для удаления!');
            
            if (!confirm('Вы уверены, что хотите удалить эту запись?')) return;

            try {
                const result = await fetchJson('api.php?action=delete_item', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id, password })
                });
                if (result.success) {
                    alert('Запись удалена');
                    loadItems();
                }
            } catch (err) {
                alert('Ошибка: ' + err.message);
            }
        };

        document.getElementById('addForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const password = document.getElementById('adminPassword').value;
            if (!password) return alert('Введите секретный ключ доступа!');

            const submitBtn = document.getElementById('submitBtn');
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i data-lucide="loader-2" class="w-5 h-5 animate-spin"></i> Сохранение...';
            lucide.createIcons();

            try {
                let imageUrl = null;
                if (currentBase64) {
                    const uploadData = await fetchJson('api.php?action=upload', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ image: currentBase64, password })
                    });
                    if (uploadData.success) imageUrl = uploadData.url;
                }

                const newItem = {
                    type: document.getElementById('type').value,
                    title: document.getElementById('title').value,
                    content: document.getElementById('content').value,
                    image: imageUrl,
                    password
                };

                const result = await fetchJson('api.php?action=save_data', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newItem)
                });

                if (result.success || result.item) {
                    alert('Успешно опубликовано на сайт!');
                    document.getElementById('addForm').reset();
                    imagePreview.style.display = 'none';
                    uploadPlaceholder.style.display = 'flex';
                    currentBase64 = null;
                    loadItems();
                }
            } catch (err) {
                alert('Ошибка: ' + err.message);
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;
                lucide.createIcons();
            }
        });

        loadItems();
    </script>
</body>
</html>
