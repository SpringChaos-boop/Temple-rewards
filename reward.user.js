// ==UserScript==
// @name         Запросник наград Храма Яо-ху
// @namespace    http://tampermonkey.net/
// @version      1.3.7
// @description  Быстрая вставка шаблона запроса наград Храма Яо-ху
// @author       Горицвет [1705753]
// @match        *://*.catwar.su/blog994926*
// @match        *://*.catwar.net/blog994926*
// @icon         https://tinyurl.com/4pckuwth
// @updateURL    https://github.com/SpringChaos-boop/Temple-rewards/raw/refs/heads/main/reward.user.js
// @downloadURL  https://github.com/SpringChaos-boop/Temple-rewards/raw/refs/heads/main/reward.user.js
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';

    /* ============================================================
       ПРИВЯЗКА К БЛОГУ
       ============================================================ */
    const BLOG_ID = '994926';

    function isTargetBlog() {
        const regex = new RegExp(`/blog/?${BLOG_ID}(?:[^0-9]|$)`);
        return regex.test(location.href);
    }

    /* ============================================================
       ВЫБОР ИКОНКИ ПО ДОМЕНУ
       ============================================================ */
    const CURRENT_DOMAIN = location.hostname.includes('catwar.net') ? 'net' : 'su';

    function resolveImage(image) {
        if (!image) return '';
        if (typeof image === 'string') {
            return image.replace(/\{domain\}/g, `catwar.${CURRENT_DOMAIN}`);
        }
        return image[CURRENT_DOMAIN] || image.su || image.net || '';
    }

    /* ============================================================
       ТЕКСТОВЫЕ ПЛАШКИ ДЛЯ КАТЕГОРИЙ
       ============================================================ */
    const CATEGORY_BADGES = {
        "Ветвь Цао": "Запрашивается главой ветви",
        "Ветвь Фэн": "Запрашивается главой ветви",
        "Ветвь Вэй": "Запрашивается главой ветви",
        "Ветвь Пэй": "Запрашивается главой ветви",
        "Детские": "Запрашивается главой ветви Пэй",
        "Отрядные": "Запрашивается главой отряда"
    };

    /* ============================================================
       ДАННЫЕ (МЕДАЛИ)
       ============================================================ */
    const MEDALS = {
        "Общие": [
            { name: 'Моя душа теперь навеки с лисами', image: 'https://{domain}/medal/3640.png', req: 'Активность, 2 медали, Имп. Игровой, 7 БУ' },
            { name: 'Со злом бороться мне придется каждый полумесяц', image: 'https://{domain}/medal/3641.png', badge: 'Запрашивается главами ветвей', req: 'Недельная норма в 1 ветви' },
            { name: 'Тяжёлые налоги', image: 'https://{domain}/medal/3642.png', req: 'Пожертвовать 1000 кролей' },
            { name: 'Откормлю я жабу златом', image: 'https://{domain}/medal/4520.png', req: 'Пожертвовать 2500 кролей' },
            { name: 'Неразлучны, словно мандаринки', image: 'https://{domain}/medal/3644.png', req: '10 котят (от 2-х оруженосец+)' },
            { name: 'Тигр дарует мне великую мощь', image: 'https://{domain}/medal/3645.png', req: '8 БУ' },
            { name: 'Моя сила сравнима лишь с драконом', image: 'https://{domain}/medal/4522.png', req: '9 БУ' },
            { name: 'В воде мне спокойно, как осетру', image: 'https://{domain}/medal/3646.png', req: '8 ПУ' },
            { name: 'Дельфины показали мне, как обуздать волну', image: 'https://{domain}/medal/4528.png', req: '9 ПУ' },
            { name: 'Малая панда укажет мне путь на вершину', image: 'https://{domain}/medal/3647.png', req: '8 ЛУ' },
            { name: 'На вершине гор мне уступает даже снежный барс', image: 'https://{domain}/medal/4527.png', req: '9 ЛУ' },
            { name: 'Совиные глаза помогут отыскать тебя', image: 'https://{domain}/medal/4523.png', req: '8 УЗ' },
            { name: 'Раскрыл мне все глаза орлан', image: 'https://{domain}/medal/4524.png', req: '9 УЗ' },
            { name: 'Соня-копатель поможет отыскать мне клад', image: 'https://{domain}/medal/4525.png', req: '8 КУ' },
            { name: 'Мне удалось найти все сокровища Яо-ху', image: 'https://{domain}/medal/4526.png', req: '9 КУ' },
            { name: 'Твой запах мне найти не сложно', image: 'https://{domain}/medal/4529.png', req: '8 УН' },
            { name: 'Все ароматы мира мне известны', image: 'https://{domain}/medal/4530.png', req: '9 УН' },
            { name: 'За чашкой чая найдем мы судьбу', image: 'https://{domain}/medal/4521.png', req: 'Посетить 5 Ванцань (гость)' },
        ],
        "Ветвь Цао": [
            { name: 'Сосуд души свой заполню травами', image: 'https://{domain}/medal/3648.png', req: '2 медали Цао, 2 нормы' },
            { name: 'Терпение и труд вознаградятся — пусть даже запах трав навсегда останется в моей шерсти', image: 'https://{domain}/medal/5325.png', req: '400 баллов Цао' },
            { name: 'Травы даруют мне покой', image: 'https://{domain}/medal/3649.png', req: '20 палоч./трав./мхов.' },
            { name: 'Мышам не скрыться от меня', image: 'https://{domain}/medal/3650.png', req: '80 мышей' },
        ],
        "Ветвь Фэн": [
            { name: 'Гуань Дао закалит мое сердце в боях', image: 'https://{domain}/medal/3651.png', req: '2 медали Фэн, 2 нормы' },
            { name: 'Всесторонняя защита', image: 'https://{domain}/medal/3652.png', req: '20 патрулей' },
            { name: 'Надёжность гор', image: 'https://{domain}/medal/3653.png', req: '15 дозоров' },
        ],
        "Ветвь Вэй": [
            { name: 'Добычу делят справедливо', image: 'https://{domain}/medal/3654.png', req: '2 медали Вэй, 2 нормы' },
            { name: 'Хищник морей', image: 'https://{domain}/medal/3655.png', req: '60 тушек (20 один.) ИЛИ 2 победы в турнире' },
            { name: 'Ведомый ветром', image: 'https://{domain}/medal/3656.png', req: '15 охотничьих патрулей' },
            { name: 'В тени деревьев — мой охотничий путь', image: 'https://{domain}/medal/5222.png', req: '75 добычи на самост. охотах' },
            { name: 'С ближним разделю я пира радость', image: 'https://{domain}/medal/5221.png', req: '2 Ванцань (собирающий/развлекающий)' },
        ],
        "Ветвь Пэй": [
            { name: 'В унынии и в радости — для меня честь быть вашей опорой', image: 'https://{domain}/medal/3657.png', req: '2 медали Пэй, 2 нормы' },
            { name: 'Мудрость веков', image: 'https://{domain}/medal/3659.png', req: '3 послушника' },
            { name: 'Собрание сочинений', image: 'https://{domain}/medal/3660.png', req: '10 лекций' },
            { name: 'Созерцание тайн волшебства', image: 'https://{domain}/medal/3661.png', req: '10 сказок' },
            { name: 'Горячее сердце', image: 'https://{domain}/medal/3662.png', req: '10 игр' },
        ],
        "Детские": [
            { name: 'Утренняя звезда', image: 'https://{domain}/medal/3663.png', req: '1500 юаней' },
            { name: 'Беспечность бабочки', image: 'https://{domain}/medal/3664.png', req: '80-120 бабочек (зависит от УН)' },
            { name: 'Магия усердия', image: 'https://{domain}/medal/3665.png', req: '15 котячьих патрулей' },
            { name: 'Резвая стрекоза', image: 'https://{domain}/medal/3666.png', req: '28 котячьих дозоров' },
        ],
        "Отрядные": [
            // Техника Цигун
            { name: 'Несломленный после сотни ударов', image: 'https://{domain}/medal/5311.png', group: 'Техника Цигун', req: '20 ч. большой грушей ИЛИ 15 ч. маленькой' },
            { name: 'Последний взмах крыла', image: 'https://{domain}/medal/5323.png', group: 'Техника Цигун', req: '250 БУ котенку (бабочка)' },

            // Затейники
            { name: 'Дарящий свет', image: 'https://{domain}/medal/3669.png', group: 'Затейники', req: '350 баллов Затейников' },
            { name: 'Полёт журавлей укажет путь домой', image: 'https://{domain}/medal/3670.png', group: 'Затейники', req: '180 баллов' },

            // Школа Боя
            { name: 'Овладевший равновесием', image: 'https://{domain}/medal/3668.png', group: 'Школа Боя', req: '20 тренировок' },

            // Жабки и Скалолазы
            { name: 'Бесконечность — не предел', image: 'https://{domain}/medal/5188.png', group: 'Жабки и Скалолазы', req: '100 баллов ИЛИ ст. восходитель + 3 пера' },
            { name: 'Жабья гордость', image: 'https://{domain}/medal/3671.png', group: 'Жабки и Скалолазы', req: '250 баллов ИЛИ 150 баллов + 3 ресурса' },

            // Собиратели Цветов
            { name: 'Цветок Эдема', image: 'https://{domain}/medal/3672.png', group: 'Собиратели Цветов', req: '70 ресурсов с нейтралок' },

            // Отряд НиЁн
            { name: 'Непорочность лилии', image: 'https://{domain}/medal/3673.png', group: 'Отряд НиЁн', req: '150 баллов' },

            // Поздравители
            { name: 'Отрада души нашей', image: 'https://{domain}/medal/5397.png', group: 'Поздравители', req: '600 баллов' },
            { name: 'Вам послание!', image: 'https://{domain}/medal/5401.png', group: 'Поздравители', req: '200 баллов (сборы/поздравления)' },
            { name: 'А теперь — тост!', image: 'https://{domain}/medal/5400.png', group: 'Поздравители', req: '300 баллов (предисловия)' },
            { name: 'Мастер слова', image: 'https://{domain}/medal/5399.png', group: 'Поздравители', req: '200 баллов (проза/стихи)' },
            { name: 'Ваш портрет готов!', image: 'https://{domain}/medal/5398.png', group: 'Поздравители', req: '250 баллов (рисунки)' },
            { name: 'Золотые лапки', image: 'https://{domain}/medal/5402.png', group: 'Поздравители', req: '200 баллов (оформления)' },
        ]
    };

    /* ============================================================
       ПАЛИТРЫ
       ============================================================ */
    const THEMES = {
        light: {
            '--bg':        '#f5f5f7',
            '--bg-input':  '#ffffff',
            '--bg-card':   '#ffffff',
            '--border':    '#d0d0d8',
            '--text':      '#222222',
            '--muted':     '#6a6a7a',
            '--accent':    '#4361ee',
            '--accent-bg': 'rgba(67,97,238,0.10)',
            '--icon-bg':   'linear-gradient(135deg, #ececf0, #e0e0e6)',
        },
        dark: {
            '--bg':        '#151517',
            '--bg-input':  '#1e1e21',
            '--bg-card':   '#1e1e21',
            '--border':    '#2e2e33',
            '--text':      '#e6e6e8',
            '--muted':     '#8a8a92',
            '--accent':    '#e94560',
            '--accent-bg': 'rgba(233,69,96,0.15)',
            '--icon-bg':   'linear-gradient(135deg, #2a2a2e, #3a3a40)',
        }
    };

    /* ============================================================
       ИНИЦИАЛИЗАЦИЯ
       ============================================================ */
    function init() {
        if (!isTargetBlog()) return;

        const form = document.querySelector('#send_comment_form');
        if (!form) {
            console.warn('[CW Award Helper] Форма #send_comment_form не найдена.');
            return;
        }

        const isMobile = window.innerWidth <= 480;

        // Внедряем стили
        const styleEl = document.createElement('style');
        styleEl.textContent = `
            #cw-award-screenshot:disabled {
                background-color: var(--bg) !important;
                color: var(--muted) !important;
                -webkit-text-fill-color: var(--muted) !important;
                opacity: 1 !important;
                cursor: not-allowed !important;
            }
            #cw-award-screenshot:disabled::placeholder {
                color: var(--muted) !important;
                -webkit-text-fill-color: var(--muted) !important;
                opacity: 1 !important;
            }
        `;
        document.head.appendChild(styleEl);

        // ---- Корневая панель ----
        const panel = document.createElement('div');
        panel.id = 'cw-award-helper';
        panel.style.cssText = `
            position: relative;
            background: var(--bg);
            border: 1px solid var(--border);
            border-radius: 10px;
            padding: ${isMobile ? '10px' : '14px'};
            margin-bottom: 12px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            color: var(--text);
            font-size: ${isMobile ? '13px' : '14px'};
            box-sizing: border-box;
            transition: background 0.2s, color 0.2s;
        `;

        // ---- Шапка ----
        const header = document.createElement('div');
        header.style.cssText = 'display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;gap:8px;';

        const title = document.createElement('div');
        title.textContent = '🎖️ Запросник наград Храма Яо-ху';
        title.style.cssText = `font-weight:600;font-size:${isMobile ? '13px' : '15px'};`;
        header.appendChild(title);

        const themeSwitcher = document.createElement('div');
        themeSwitcher.style.cssText = 'display:flex;gap:4px;flex-shrink:0;';
        const themeButtons = {};
        [['light','☀️','Светлая'],['dark','🌙','Тёмная']].forEach(([key, icon, label]) => {
            const b = document.createElement('button');
            b.type = 'button';
            b.textContent = icon;
            b.title = label;
            b.style.cssText = `
                width: ${isMobile ? '24px' : '28px'};
                height: ${isMobile ? '24px' : '28px'};
                padding: 0;
                background: var(--bg-input); border: 1px solid var(--border);
                border-radius: 6px; cursor: pointer;
                font-size: ${isMobile ? '12px' : '14px'};
                line-height: 1; color: var(--text);
            `;
            b.addEventListener('click', () => setTheme(key));
            themeSwitcher.appendChild(b);
            themeButtons[key] = b;
        });
        header.appendChild(themeSwitcher);
        panel.appendChild(header);

        // ---- ID ----
        panel.appendChild(makeLabel('Ваш ID:'));
        const idInput = document.createElement('input');
        idInput.type = 'text';
        idInput.placeholder = 'Например: 123456';
        idInput.style.cssText = inputStyle() + 'margin-bottom: 10px;';
        if (typeof my !== 'undefined' && my && my.id) idInput.value = my.id;
        panel.appendChild(idInput);

        // ---- Имя для шаблона ----
        panel.appendChild(makeLabel('Имя для шаблона:'));
        const nameInput = document.createElement('input');
        nameInput.type = 'text';
        nameInput.placeholder = 'Имя';
        nameInput.value = 'Имя';
        nameInput.style.cssText = inputStyle() + 'margin-bottom: 10px;';
        panel.appendChild(nameInput);

        // ---- Тип награды ----
        panel.appendChild(makeLabel('Тип награды:'));
        const typeSelect = document.createElement('select');
        typeSelect.style.cssText = selectStyle() + 'margin-bottom:10px;';
        typeSelect.innerHTML = `
            <option value="medal">Медаль</option>
            <option value="special_name">Особое имя</option>
            <option value="trophy">Личный трофей</option>
            <option value="status">Личный статус</option>
            <option value="position">Личная должность</option>
            <option value="tribal_status">Племенной статус</option>
        `;
        panel.appendChild(typeSelect);

        // ---- Динамические поля ----
        const customFieldsWrap = document.createElement('div');
        panel.appendChild(customFieldsWrap);

        // ---- Категория ----
        const catWrap = document.createElement('div');
        catWrap.style.cssText = 'display:block;margin-bottom:10px;';
        catWrap.appendChild(makeLabel('Категория:'));
        const catSelect = document.createElement('select');
        catSelect.style.cssText = selectStyle();
        catSelect.innerHTML = '<option value="">— Выберите категорию —</option>';
        Object.keys(MEDALS).forEach(c => {
            const o = document.createElement('option');
            o.value = c; o.textContent = c;
            catSelect.appendChild(o);
        });
        catWrap.appendChild(catSelect);
        panel.appendChild(catWrap);

        // ---- Сетка наград ----
        const grid = document.createElement('div');
        grid.style.cssText = `
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
            gap: 10px; margin: 10px 0;
            max-height: 450px;
            overflow-y: auto;
            padding-right: 4px;
            -webkit-overflow-scrolling: touch;
        `;
        panel.appendChild(grid);

        // ---- Ссылка на скриншот ----
        panel.appendChild(makeLabel('Ссылка на скриншот (если требуется):'));
        const screenshotInput = document.createElement('input');
        screenshotInput.id = 'cw-award-screenshot';
        screenshotInput.type = 'text';
        screenshotInput.placeholder = 'https://...';
        screenshotInput.style.cssText = inputStyle() + 'margin-bottom: 10px; transition: background 0.2s;';
        panel.appendChild(screenshotInput);

        // ---- Предпросмотр ----
        const previewWrap = document.createElement('div');
        previewWrap.style.cssText = 'display:none;margin-top:10px;';
        previewWrap.appendChild(makeLabel('Готовый шаблон:'));

        const previewArea = document.createElement('textarea');
        previewArea.readOnly = true;
        previewArea.style.cssText = `
            width: 100%; min-height: ${isMobile ? '70px' : '90px'};
            padding: 8px;
            background: var(--bg-input); border: 1px solid var(--border);
            border-radius: 6px; color: var(--text);
            font-family: Consolas, Monaco, monospace; font-size: 13px;
            resize: vertical; outline: none; box-sizing: border-box;
        `;
        previewWrap.appendChild(previewArea);

        const insertBtn = document.createElement('button');
        insertBtn.type = 'button';
        insertBtn.textContent = '📋 Вставить в комментарий';
        insertBtn.style.cssText = `
            width: 100%; margin-top: 6px; padding: 10px;
            background: var(--accent); color: #fff; border: none;
            border-radius: 6px; font-size: 14px; font-weight: 600;
            cursor: pointer; transition: filter 0.2s;
        `;
        insertBtn.addEventListener('mouseenter', () => insertBtn.style.filter = 'brightness(1.1)');
        insertBtn.addEventListener('mouseleave', () => insertBtn.style.filter = 'none');
        previewWrap.appendChild(insertBtn);

        panel.appendChild(previewWrap);
        form.prepend(panel);

        /* ============================================================
           ЛОГИКА
           ============================================================ */
        let selected = null;

        function makeLabel(text) {
            const l = document.createElement('div');
            l.textContent = text;
            l.style.cssText = 'font-size:12px;color:var(--muted);margin-bottom:4px;font-weight:600;';
            return l;
        }
        function inputStyle() {
            return `
                width: 100%; padding: 8px 10px; background: var(--bg-input);
                border: 1px solid var(--border); border-radius: 6px;
                color: var(--text); font-size: 14px; outline: none;
                box-sizing: border-box;
            `;
        }
        function selectStyle() {
            return inputStyle();
        }
        function setTheme(key) {
            const theme = THEMES[key] || THEMES.dark;
            Object.entries(theme).forEach(([k, v]) => panel.style.setProperty(k, v));
            Object.entries(themeButtons).forEach(([k, b]) => {
                b.style.borderColor = k === key ? 'var(--accent)' : 'var(--border)';
                b.style.background  = k === key ? 'var(--accent-bg)' : 'var(--bg-input)';
            });
            localStorage.setItem('cw_award_theme', key);
        }

        function renderCustomFields(type) {
            customFieldsWrap.innerHTML = '';

            const createInput = (labelText, placeholder, id, defaultValue = '') => {
                const wrap = document.createElement('div');
                wrap.style.marginBottom = '10px';
                wrap.appendChild(makeLabel(labelText));
                const input = document.createElement('input');
                input.type = 'text';
                input.id = id;
                input.placeholder = placeholder;
                input.value = defaultValue;
                input.style.cssText = inputStyle();
                input.addEventListener('input', updatePreview);
                wrap.appendChild(input);
                customFieldsWrap.appendChild(wrap);
            };

            const createSelect = (labelText, id, options) => {
                const wrap = document.createElement('div');
                wrap.style.marginBottom = '10px';
                wrap.appendChild(makeLabel(labelText));
                const select = document.createElement('select');
                select.id = id;
                select.style.cssText = selectStyle();
                options.forEach(opt => {
                    const o = document.createElement('option');
                    o.value = opt;
                    o.textContent = opt;
                    select.appendChild(o);
                });
                select.addEventListener('change', updatePreview);
                wrap.appendChild(select);
                customFieldsWrap.appendChild(wrap);
            };

            if (type === 'special_name') {
                createInput('Желаемое имя:', 'Введите желаемое имя', 'cw-desired-name');
            } else if (type === 'trophy') {
                createInput('Ссылка на изображение трофея:', 'https://...', 'cw-trophy-img');
                createInput('Название трофея:', 'Название', 'cw-trophy-name');
                createInput('Название действия:', 'Название действия', 'cw-action-name');
                createInput('Строчка в истории:', 'Текст', 'cw-history-line');
            } else if (type === 'status') {
                createInput('Ссылка на изображение статуса (необязательно):', 'https://...', 'cw-status-img');
                createInput('Строчка в статусе:', 'Текст статуса', 'cw-status-text');
            } else if (type === 'position') {
                createInput('Желаемая должность:', 'Введите должность', 'cw-desired-position');
            } else if (type === 'tribal_status') {
                createInput('Духовное имя и цвет:', 'Имя и цвет', 'cw-spirit-name', 'Ваше духовное имя (Адептам и выше)');
                createSelect('Желаемая лиса:', 'cw-fox-type', ['Серая', 'Огненная', 'Кремовая', 'Черная']);
                createInput('Желаемый цвет глаз:', 'Любой', 'cw-eye-color', 'любой');
                createSelect('Рамка (если выполнили условия в Лавке панды у ветви Пэй):', 'cw-frame', ['Дерево', 'Бронза', 'Серебро', 'Золото']);
                createInput('Духовные метки и цвет (если это не первый ваш персонаж в племени):', 'Да, номер, цвет / Нет', 'cw-marks', 'Да, номер, цвет/Нет');
                createSelect('Камни:', 'cw-stones', ['Цилинь', 'Черепаха', 'Тигр', 'Феникс']);
            }
        }

        function updatePreview() {
            const id = idInput.value.trim();
            const name = nameInput.value.trim() || 'Имя';
            const url = screenshotInput.value.trim();
            const type = typeSelect.value;

            if (!id) { previewWrap.style.display = 'none'; return; }

            let text = '';

            if (type === 'medal') {
                if (!selected) { previewWrap.style.display = 'none'; return; }
                text = `[link${id}] [${id}] — ${selected.name}`;
                if (!selected.isHeadRequested) {
                    text += ` [[url=${url || 'ссылка'}]скриншот требований[/url]]`;
                }
            } else {
                const header = `[b]${name} [${id}]:[/b] [link${id}] [${id}].`;
                const scr = url ? `\n[b]Скриншоты выполненных требований:[/b] [[url=${url}]скриншот(ы)[/url]]` : '';

                if (type === 'special_name') {
                    const desired = document.getElementById('cw-desired-name')?.value || '';
                    text = `${header}\n[b]Желаемое имя:[/b] ${desired}${scr}`;
                } else if (type === 'trophy') {
                    const tImg = document.getElementById('cw-trophy-img')?.value || 'изображение трофея';
                    const tName = document.getElementById('cw-trophy-name')?.value || 'название';
                    const aName = document.getElementById('cw-action-name')?.value || '';
                    const hLine = document.getElementById('cw-history-line')?.value || '';
                    text = `${header}\n[b]Трофей:[/b] [img]${tImg}[/img] - ${tName}.\n[b]Название действия:[/b] ${aName}.\n[b]Строчка в истории:[/b] ${hLine}.${scr}`;
                } else if (type === 'status') {
                    const sImg = document.getElementById('cw-status-img')?.value || '';
                    const sText = document.getElementById('cw-status-text')?.value || '';
                    let statusContent = '';
                    if (sImg && sText) statusContent = `[img]${sImg}[/img] / ${sText}`;
                    else if (sImg) statusContent = `[img]${sImg}[/img]`;
                    else if (sText) statusContent = sText;
                    else statusContent = '[img]изображение статуса[/img]/строчка в статусе.';
                    text = `${header}\n[b]Статус:[/b] ${statusContent}${scr}`;
                } else if (type === 'position') {
                    const desired = document.getElementById('cw-desired-position')?.value || '';
                    text = `${header}\n[b]Желаемая должность:[/b] ${desired}${scr}`;
                } else if (type === 'tribal_status') {
                    const spirit = document.getElementById('cw-spirit-name')?.value || 'Ваше духовное имя (Адептам и выше).';
                    const fox = document.getElementById('cw-fox-type')?.value || 'Серая';
                    const eye = document.getElementById('cw-eye-color')?.value || 'любой';
                    const frame = document.getElementById('cw-frame')?.value || 'Дерево';
                    const marks = document.getElementById('cw-marks')?.value || 'Да, номер, цвет/Нет';
                    const stones = document.getElementById('cw-stones')?.value || 'Цилинь';

                    // Убран ${header} для этого шаблона, как вы и просили
                    text = `[b]Духовное имя и цвет:[/b] ${spirit}.\n[b]Желаемая лиса:[/b] ${fox}.\n[b]Желаемый цвет глаз:[/b] ${eye}.\n[b]Рамка:[/b] ${frame}.\n[b]Духовные метки и цвет:[/b] ${marks}.\n[b]Камни:[/b] ${stones}.${scr}`;
                }
            }

            if (text) {
                previewArea.value = text;
                previewWrap.style.display = 'block';
            } else {
                previewWrap.style.display = 'none';
            }
        }

        function clearSelection() {
            selected = null;
            updatePreview();
        }

        function renderGrid(items, catName) {
            clearSelection();
            grid.innerHTML = '';

            if (!items.length) {
                grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;color:var(--muted);padding:10px;font-size:13px;">Список медалей пока пуст</div>`;
                return;
            }

            const renderCard = (item) => {
                const itemBadgeText = item.badge || CATEGORY_BADGES[catName] || '';
                const isHeadRequest = !!itemBadgeText;

                const card = document.createElement('div');
                card.style.cssText = `
                    background: var(--bg-card); border: 2px solid var(--border);
                    border-radius: 8px; padding: 12px 10px; cursor: pointer;
                    text-align: center; transition: all 0.2s;
                    display: flex; flex-direction: column; align-items: center; gap: 8px;
                    user-select: none; -webkit-user-select: none;
                    font-size: 12px; line-height: 1.3;
                    box-sizing: border-box; min-width: 0;
                `;
                card.addEventListener('mouseenter', () => card.style.borderColor = 'var(--accent)');
                card.addEventListener('mouseleave', () => {
                    if (!card.classList.contains('sel')) card.style.borderColor = 'var(--border)';
                });

                const icon = document.createElement('div');
                icon.style.cssText = `
                    width: 90px; height: 71px;
                    border-radius: 6px;
                    background: var(--icon-bg);
                    display: flex; align-items: center; justify-content: center;
                    font-size: 24px; font-weight: bold;
                    color: var(--accent);
                    overflow: hidden; flex-shrink: 0;
                `;

                const imgUrl = resolveImage(item.image);
                if (imgUrl) {
                    const img = document.createElement('img');
                    img.src = imgUrl;
                    img.alt = item.name;
                    img.style.cssText = 'width:100%;height:100%;object-fit:contain;display:block;';
                    img.onerror = () => {
                        img.style.display = 'none';
                        icon.textContent = (item.name.trim()[0] || '?').toUpperCase();
                    };
                    icon.appendChild(img);
                } else {
                    icon.textContent = (item.name.trim()[0] || '?').toUpperCase();
                }
                card.appendChild(icon);

                const nameEl = document.createElement('div');
                nameEl.textContent = item.name;
                nameEl.style.cssText = 'word-break:break-word;overflow-wrap:anywhere;width:100%;';
                card.appendChild(nameEl);

                const badgesWrap = document.createElement('div');
                badgesWrap.style.cssText = 'display:flex; flex-direction:column; gap:4px; align-items:center; margin-top:auto; width:100%;';

                if (item.req) {
                    const reqBadge = document.createElement('div');
                    reqBadge.textContent = item.req;
                    reqBadge.style.cssText = `
                        font-size: 10px; font-weight: 600;
                        color: var(--accent);
                        background: var(--accent-bg);
                        border: 1px solid var(--accent);
                        border-radius: 4px; padding: 2px 6px;
                        text-align: center; line-height: 1.2; word-break: break-word;
                    `;
                    badgesWrap.appendChild(reqBadge);
                }

                if (itemBadgeText) {
                    const badge = document.createElement('div');
                    badge.textContent = itemBadgeText;
                    badge.style.cssText = `
                        font-size: 10px; color: var(--muted);
                        background: var(--bg-input); border: 1px solid var(--border);
                        border-radius: 4px; padding: 2px 6px;
                        text-align: center; line-height: 1.2;
                    `;
                    badgesWrap.appendChild(badge);
                }

                card.appendChild(badgesWrap);

                card.addEventListener('click', () => {
                    grid.querySelectorAll('.sel').forEach(el => {
                        el.classList.remove('sel');
                        el.style.borderColor = 'var(--border)';
                        el.style.background = 'var(--bg-card)';
                    });
                    card.classList.add('sel');
                    card.style.borderColor = 'var(--accent)';
                    card.style.background = 'var(--accent-bg)';

                    selected = item;
                    selected.isHeadRequested = isHeadRequest;

                    if (selected.isHeadRequested) {
                        screenshotInput.value = '';
                        screenshotInput.disabled = true;
                        screenshotInput.placeholder = 'Не требуется (запрашивает глава)';
                    } else {
                        screenshotInput.disabled = false;
                        screenshotInput.placeholder = 'https://...';
                    }

                    updatePreview();
                });

                grid.appendChild(card);
            };

            const groups = {};
            let hasGroups = false;
            items.forEach(item => {
                const g = item.group || '';
                if (g) hasGroups = true;
                if (!groups[g]) groups[g] = [];
                groups[g].push(item);
            });

            if (hasGroups) {
                const sortedKeys = Object.keys(groups).sort((a, b) => {
                    if (a === '') return 1;
                    if (b === '') return -1;
                    return a.localeCompare(b);
                });

                sortedKeys.forEach(groupName => {
                    if (groupName) {
                        const grpHeader = document.createElement('div');
                        grpHeader.textContent = groupName;
                        grpHeader.style.cssText = `
                            grid-column: 1 / -1;
                            font-size: 13px;
                            font-weight: 700;
                            color: var(--text);
                            background: var(--bg-input);
                            padding: 8px 12px;
                            margin: 12px 0 4px 0;
                            border-radius: 6px;
                            border: 1px solid var(--border);
                            text-align: left;
                        `;
                        grid.appendChild(grpHeader);
                    }
                    groups[groupName].forEach(renderCard);
                });
            } else {
                items.forEach(renderCard);
            }
        }

        // ---- Обработчики ----
        typeSelect.addEventListener('change', () => {
            const t = typeSelect.value;
            if (t === 'medal') {
                customFieldsWrap.innerHTML = '';
                catWrap.style.display = 'block';
                grid.style.display = 'grid';
                screenshotInput.disabled = false;
                screenshotInput.placeholder = 'https://...';
            } else {
                catWrap.style.display = 'none';
                grid.style.display = 'none';
                grid.innerHTML = '';
                clearSelection();
                catSelect.value = '';
                screenshotInput.disabled = false;
                screenshotInput.placeholder = 'https://...';
                renderCustomFields(t);
            }
            updatePreview();
        });

        catSelect.addEventListener('change', () => {
            grid.innerHTML = '';
            clearSelection();

            screenshotInput.disabled = false;
            screenshotInput.value = '';
            screenshotInput.placeholder = 'https://...';

            if (!catSelect.value) return;
            renderGrid(MEDALS[catSelect.value] || [], catSelect.value);
        });

        idInput.addEventListener('input', () => {
            localStorage.setItem('cw_award_id', idInput.value);
            updatePreview();
        });

        nameInput.addEventListener('input', () => {
            localStorage.setItem('cw_award_name', nameInput.value);
            updatePreview();
        });

        screenshotInput.addEventListener('input', updatePreview);

        insertBtn.addEventListener('click', () => {
            const field = document.querySelector('#comment');
            if (!field) { alert('Не найдено поле комментария (#comment).'); return; }

            const existingText = field.value;
            if (existingText.trim().length > 0) {
                field.value = existingText + '\n\n' + previewArea.value;
            } else {
                field.value = previewArea.value;
            }

            field.focus();
            field.scrollIntoView({ behavior: 'smooth', block: 'center' });
        });

        // ---- Восстановление состояния ----
        const savedId = localStorage.getItem('cw_award_id');
        if (savedId && !idInput.value) idInput.value = savedId;

        const savedName = localStorage.getItem('cw_award_name');
        if (savedName) nameInput.value = savedName;

        setTheme(localStorage.getItem('cw_award_theme') || 'dark');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
