'use strict';
/* Тренажёр теста на соцконтракт. One file on purpose: no build step, opens on any phone. */

const EXAM_SIZE = 45, EXAM_PASS = 28, EXAM_SECONDS = 60 * 60, SPEECH_SECONDS = 120;
const TOPIC_ORDER = ['Соцконтракт: правила', 'Бизнес-план и смета', 'Налоги', 'Регистрация и формы',
  'Финансовое планирование', 'Маркетинг и продажи', 'Правовые основы', 'Риски', 'Бухгалтерия', 'Персонал',
  'Госзакупки', 'Тайм-менеджмент', 'Переговоры', 'Публичная презентация', 'Менеджмент', 'Лидерство',
  'Критическое мышление', 'Креативность', 'Эмоциональный интеллект'];
const LETTERS = ['А', 'Б', 'В', 'Г', 'Д'];

/* Defense content is based on Eduard's own commission experience (pamyatka-zashchita.md). */
const DEFENSE = {
  speech: ['Кто я, откуда, чем занимался раньше', 'Что хочу делать и почему именно это',
    'Почему у меня получится: опыт, навыки, документы', 'На что пойдут деньги контракта (кратко по смете)',
    'Сколько буду зарабатывать и когда всё окупится', 'Как буду искать клиентов'],
  asked: [
    { q: 'Какой у вас план действий?', tip: 'Рассказывайте строго по своему бизнес-плану и по порядку: что за дело, что и на какие деньги покупаете, когда начинаете работать, сколько рассчитываете зарабатывать и как будете отчитываться. Не придумывайте нового и не прыгайте туда-сюда: комиссия смотрит, знаете ли вы свой план.' },
    { q: 'Знаете ли вы своё дело?', tip: 'Отвечайте уверенно: да, знаю. Назовите опыт: где и сколько работали, что уже умеете. Если есть трудовая, договоры, сертификаты, фото работ, скажите, что они с собой, и покажите по просьбе. Главное — говорить правду.' },
    { q: 'Есть ли кто-то, кто будет вам помогать?', tip: 'Лучше, если есть помощник или товарищ, который разбирается в теме. Назовите, кто он и чем помогает: советом, работой, связями. Если работаете один, так и скажите, но добавьте, к кому обратитесь за помощью.' },
    { q: 'Уверены ли вы, что будете этим заниматься?', tip: 'Коротко и твёрдо, без «ну, наверное», и сразу причина. Например: «Конечно уверен, поэтому я здесь». Своими словами, но так же прямо.' },
  ],
  extra: [
    { q: 'Почему вы выбрали именно это дело?', tip: 'Честная личная причина работает лучше всего: что вам нравится, что умеете, почему это нужно людям рядом. Эдуард, например, рассказал, что устал от вахт и хочет работать на себя у себя дома, и это сработало, потому что правда.' },
    { q: 'Есть ли у вас опыт и чем он подтверждается?', tip: 'Где, сколько и что делали. Чем подтвердить: трудовая книжка, диплом, сертификаты, справка с работы, договоры, фото работ, отзывы клиентов. Возьмите всё, что есть, с собой.' },
    { q: 'На что именно потратите деньги и почему такие суммы?', tip: 'Назовите 3–4 крупные покупки из сметы и их цену. Скажите, откуда цены: сравнивали в магазинах, есть ссылки или скриншоты. Суммы должны совпадать с бумагой до рубля.' },
    { q: 'Сколько рассчитываете зарабатывать в месяц?', tip: 'Цифра из вашего плана и как она получилась: средний чек × число клиентов в месяц, минус расходы. Комиссия сверяет с планом, поэтому выучите эти числа.' },
    { q: 'Откуда придут клиенты?', tip: 'Конкретные каналы: Авито, группы и чаты вашего района, соцсети, знакомые и сарафанное радио, вывеска. Если первые клиенты или договорённости уже есть, обязательно скажите.' },
    { q: 'Кто ваши конкуренты и чем вы лучше?', tip: 'Назовите 2–3 конкретных конкурента и их цены. Ваше отличие одной фразой: ближе, быстрее, дешевле, качественнее, удобнее по времени. Не ругайте конкурентов, просто покажите, что знаете рынок.' },
    { q: 'Что будете делать, если клиентов будет меньше, чем в плане?', tip: 'Покажите, что подумали заранее: больше рекламы, дополнительные услуги, работа на заказ, снижение своих расходов. Комиссии важно видеть, что вы не бросите дело при первой трудности.' },
    { q: 'Оформитесь самозанятым или ИП, и почему?', tip: 'Как в вашем плане. Самозанятость проще: налог 4% с доходов от людей и 6% от организаций, без обязательных взносов, но доход до 2,4 млн ₽ в год и без наёмных работников. ИП нужно, если будут работники или доход больше.' },
    { q: 'Что будет после окончания контракта?', tip: 'Продолжу дело. По правилам вести его нужно весь срок контракта и ещё не меньше 12 месяцев после, соцзащита это проверяет. Добавьте, как планируете развиваться: новые услуги, больше клиентов.' },
  ],
  checklist: ['Бизнес-план прочитан несколько раз, цифры помню', 'Рассказ на 2 минуты отрепетирован вслух',
    'Ответы на вопросы комиссии продуманы', 'Документы об опыте и паспорт с собой', 'Знаю, где и во сколько меня ждут',
    'Одежда опрятная и удобная', 'Выспался, поел, пришёл заранее'],
};

/* ---------- storage ---------- */
const LS = {
  get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* full or private mode: keep working in memory */ } },
};
const S = Object.assign({ ans: {}, mist: [], exams: [], def: { a: {}, chk: {} }, exam: null, last: null }, LS.get('tr_state', {}));
const save = () => LS.set('tr_state', S);
let ACCESS = LS.get('tr_access', null);   // {code, name, personal}
let BANK = LS.get('tr_bank', null);       // full bank when unlocked
let FREE = null, TOTAL = 470, NTOPICS = 19;

const full = () => !!(ACCESS && BANK);
const pool = () => (full() ? BANK : FREE || []);
const byId = () => { const m = {}; for (const q of pool()) m[q.id] = q; return m; };

/* ---------- helpers ---------- */
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const $ = (sel, el = document) => el.querySelector(sel);
const app = $('#app');
const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const plural = (n, one, few, many) => { const m10 = n % 10, m100 = n % 100; return m10 === 1 && m100 !== 11 ? one : m10 >= 2 && m10 <= 4 && (m100 < 10 || m100 >= 20) ? few : many; };
const mmss = s => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
const go = h => { location.hash = h; };
const chev = '<svg class="chev" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M6 3l5 5-5 5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const backBtn = (to = '#/', label = 'Назад') => `<button class="back" data-go="${to}"><svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M10 3L5 8l5 5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>${label}</button>`;
let tick = null;
const stopTick = () => { if (tick) { clearInterval(tick); tick = null; } };

function topicsOf(list) {
  const m = new Map();
  for (const q of list) { if (!m.has(q.topic)) m.set(q.topic, []); m.get(q.topic).push(q); }
  return [...m.entries()].sort((a, b) => (TOPIC_ORDER.indexOf(a[0]) + 99) % 99 - (TOPIC_ORDER.indexOf(b[0]) + 99) % 99);
}
function readiness() {
  const learned = Object.values(S.ans).filter(a => a.ok).length;
  return { learned, pct: Math.round(learned / TOTAL * 100) };
}
function weakTopic() {
  let worst = null;
  for (const [t, qs] of topicsOf(pool())) {
    const tried = qs.filter(q => S.ans[q.id]);
    if (tried.length < 3) continue;
    const r = tried.filter(q => S.ans[q.id].ok).length / tried.length;
    if (!worst || r < worst.r) worst = { t, r };
  }
  return worst && worst.r < 0.8 ? worst.t : null;
}
function record(q, ok) {
  const a = S.ans[q.id] || { n: 0 };
  a.n++; a.ok = ok; S.ans[q.id] = a;
  S.mist = S.mist.filter(id => id !== q.id);
  if (!ok) S.mist.push(q.id);
}
function mistakes() { const m = byId(); return S.mist.map(id => m[id]).filter(Boolean); }

/* ---------- screens ---------- */
function home() {
  const r = readiness(), weak = weakTopic(), mist = mistakes().length, last = S.exams[S.exams.length - 1];
  const nTopics = NTOPICS;
  let sub;
  if (!r.learned) sub = 'Начните с пробного теста — сразу увидите, где проседаете.';
  else sub = `Знаете ${r.learned} из ${TOTAL} вопросов.` + (weak ? ` Слабая тема — «${esc(weak)}».` : '') + (last ? ` Последний пробный: ${last.score} из ${EXAM_SIZE}.` : '');
  const resume = S.exam ? `<button class="row press" data-go="#/exam"><div><div class="l">Продолжить пробный тест</div><div class="s">Отвечено ${Object.keys(S.exam.ans).length} из ${EXAM_SIZE}</div></div>${chev}</button>` : '';
  return `<div class="wrap in">
    <div class="bar"><span class="brand">Тренажёр теста</span>${full() ? `<span class="access">Полный доступ${ACCESS.name ? `, <b>${esc(ACCESS.name)}</b>` : ''}</span>` : `<button class="access" data-go="#/unlock">У меня есть код</button>`}</div>
    <section class="hero"><h1>Сдайте тест на соцконтракт с первого раза</h1><p>Вопросы по тем же темам, что на настоящем тесте в соцзащите, с разбором каждой ошибки.</p></section>
    <section class="card ready"><div class="ring" style="--p:${r.pct}"><span class="num">${r.pct}%</span></div><div><b>Готовность к тесту</b><span class="muted small">${sub}</span></div></section>
    ${resume}
    <button class="exam" data-act="exam-new"><span class="t">Пробный тест как настоящий</span><span class="s">${EXAM_SIZE} вопросов · 60 минут · сдан, если верно ${EXAM_PASS} из ${EXAM_SIZE}</span><span class="go">${S.exam ? 'Начать заново' : 'Начать'}</span></button>
    <div class="pair">
      <button class="tile press" data-go="${full() ? '#/topics' : '#/unlock'}"><span class="n">${nTopics}</span><span class="l">${plural(nTopics, 'тема', 'темы', 'тем')} с разбором</span><span class="sub">${full() ? 'Учить по порядку' : 'Нужен код доступа'}</span></button>
      <button class="tile press" data-go="#/mistakes"><span class="n ${mist ? 'bad' : ''}">${mist}</span><span class="l">Работа над ошибками</span><span class="sub">${mist ? 'Повторить только их' : 'Пока ошибок нет'}</span></button>
    </div>
    <button class="row press" data-go="#/defense"><div><div class="l">Тренажёр защиты</div><div class="s">Что спросит комиссия и как ответить</div></div>${chev}</button>
    <button class="row press" data-go="#/about"><div><div class="l">Как проходит настоящий тест</div><div class="s">Где, сколько времени, что если не сдал</div></div>${chev}</button>
    <p class="foot">Тренажёр сделал <b>Эдуард</b> — сам получил соцконтракт в Алтайском крае и прошёл этот тест и комиссию. Помогаю с бизнес-планом и подготовкой к защите.</p>
  </div>`;
}

function newExam() {
  const ids = shuffle(pool()).slice(0, EXAM_SIZE).map(q => q.id);
  const order = {}; const m = byId();
  for (const id of ids) order[id] = shuffle(m[id].o.map((_, i) => i));
  S.exam = { ids, order, ans: {}, start: Date.now(), cur: 0 };
  save(); go('#/exam'); render();
}
function examLeft() { return Math.max(0, EXAM_SECONDS - Math.floor((Date.now() - S.exam.start) / 1000)); }

function exam() {
  const E = S.exam; if (!E) { go('#/'); return home(); }
  const m = byId(), id = E.ids[E.cur], q = m[id];
  if (!q) { S.exam = null; save(); go('#/'); return home(); }
  const answered = Object.keys(E.ans).length, left = examLeft();
  const opts = E.order[id].map((oi, k) => `<button class="opt ${E.ans[id] === oi ? 'sel' : ''}" data-act="exam-pick" data-oi="${oi}"><span class="k">${LETTERS[k]}</span><span>${esc(q.o[oi])}</span></button>`).join('');
  const map = E.ids.map((x, i) => `<button class="${E.ans[x] !== undefined ? 'done' : ''} ${i === E.cur ? 'cur' : ''}" data-act="exam-jump" data-i="${i}" aria-label="Вопрос ${i + 1}">${i + 1}</button>`).join('');
  const lastQ = E.cur === E.ids.length - 1;
  return `<div class="wrap">
    <div class="bar">${backBtn('#/', 'Выйти')}<span class="timer num ${left < 300 ? 'low' : ''}" id="timer" aria-label="Осталось времени">${mmss(left)}</span></div>
    <div class="qhead"><span class="num">Вопрос ${E.cur + 1} из ${EXAM_SIZE}</span><span class="meta num">Отвечено ${answered}</span></div>
    <div class="track"><i style="width:${answered / EXAM_SIZE * 100}%"></i></div>
    <span class="topic">${esc(q.topic)}</span>
    <p class="q">${esc(q.q)}</p>
    <div class="opts">${opts}</div>
    <details class="sheet"><summary>Все вопросы теста ${chev}</summary><div class="map">${map}</div></details>
    <div class="actions stick">
      <button class="btn sec" data-act="exam-prev" ${E.cur ? '' : 'disabled'}>Назад</button>
      ${lastQ ? `<button class="btn main" data-act="exam-finish">Завершить тест</button>` : `<button class="btn main" data-act="exam-next">${E.ans[id] === undefined ? 'Пропустить' : 'Дальше'}</button>`}
    </div>
  </div>`;
}
function startExamTimer() {
  stopTick();
  tick = setInterval(() => {
    if (!S.exam || location.hash !== '#/exam') return stopTick();
    const left = examLeft(), t = $('#timer');
    if (t) { t.textContent = mmss(left); t.classList.toggle('low', left < 300); }
    if (!left) finishExam(true);
  }, 1000);
}
function finishExam(timeUp) {
  const E = S.exam, m = byId(); if (!E) return;
  const unanswered = E.ids.filter(id => E.ans[id] === undefined).length;
  if (!timeUp && unanswered && !confirm(`Без ответа ${unanswered} ${plural(unanswered, 'вопрос', 'вопроса', 'вопросов')}. Завершить тест?`)) return;
  stopTick();
  let score = 0; const byTopic = {};
  for (const id of E.ids) {
    const q = m[id]; if (!q) continue;
    const ok = E.ans[id] === q.a; if (ok) score++;
    if (E.ans[id] !== undefined) record(q, ok); else { S.mist = S.mist.filter(x => x !== id); S.mist.push(id); }
    const t = byTopic[q.topic] || (byTopic[q.topic] = [0, 0]); t[1]++; if (ok) t[0]++;
  }
  S.last = { ids: E.ids, ans: E.ans, score, byTopic, timeUp: !!timeUp, sec: Math.min(EXAM_SECONDS, Math.floor((Date.now() - E.start) / 1000)) };
  S.exams.push({ d: Date.now(), score }); S.exam = null; save();
  go('#/result'); render();
}

function result() {
  const L = S.last; if (!L) { go('#/'); return home(); }
  const m = byId(), pass = L.score >= EXAM_PASS, need = EXAM_PASS - L.score;
  const topics = Object.entries(L.byTopic).sort((a, b) => a[1][0] / a[1][1] - b[1][0] / b[1][1])
    .map(([t, [ok, all]]) => `<div class="li"><div class="top"><span>${esc(t)}</span><span>${ok} из ${all}</span></div><div class="track ${ok / all < 0.62 ? 'low' : ''}"><i style="width:${ok / all * 100}%"></i></div></div>`).join('');
  const errs = L.ids.filter(id => m[id] && L.ans[id] !== m[id].a).map(id => {
    const q = m[id], your = L.ans[id];
    return `<div class="err"><p class="qq">${esc(q.q)}</p>
      <p class="a y">${your === undefined ? 'Без ответа' : 'Ваш ответ: ' + esc(q.o[your])}</p>
      <p class="a r">Верно: ${esc(q.o[q.a])}</p><p class="e">${esc(q.e)}</p></div>`;
  }).join('');
  return `<div class="wrap in">
    <div class="bar">${backBtn('#/', 'На главную')}<span class="meta num">${mmss(L.sec)} мин</span></div>
    <section class="card"><p class="score num">${L.score} из ${EXAM_SIZE}</p>
      <p class="verdict ${pass ? 'ok' : 'bad'}">${pass ? 'Тест сдан' : `Не хватило ${need} ${plural(need, 'верного ответа', 'верных ответов', 'верных ответов')}`}</p>
      <p class="muted small" style="margin-top:6px">${L.timeUp ? 'Время вышло. ' : ''}${pass ? 'На настоящем тесте этого хватило бы. Закрепите слабые темы ниже.' : `Нужно ${EXAM_PASS} из ${EXAM_SIZE}. Разберите ошибки и пройдите ещё раз.`}</p></section>
    <div class="actions" style="position:static;padding:0">
      ${errs ? '<button class="btn sec" data-go="#/mistakes">Повторить ошибки</button>' : ''}<button class="btn main" data-act="exam-new">Ещё раз</button></div>
    <button class="btn sec" data-act="share" style="margin-top:10px;width:100%">Сохранить результат картинкой</button>
    <h2 style="margin-top:10px">По темам</h2><div class="list">${topics}</div>
    ${errs ? `<h2 style="margin-top:10px">Разбор ошибок</h2><div class="list">${errs}</div>` : ''}
  </div>`;
}

function topics() {
  if (!full()) { go('#/unlock'); return unlock(); }
  const rows = topicsOf(BANK).map(([t, qs]) => {
    const ok = qs.filter(q => S.ans[q.id]?.ok).length;
    return `<button class="li press" data-go="#/topic/${encodeURIComponent(t)}"><div class="top"><span>${esc(t)}</span><span class="${ok ? '' : 'zero'}">${ok} из ${qs.length}</span></div><div class="track"><i style="width:${ok / qs.length * 100}%"></i></div></button>`;
  }).join('');
  return `<div class="wrap in"><div class="bar">${backBtn()}</div><h1>Учить по темам</h1>
    <p class="muted">Сначала идут вопросы, которые вы ещё не знаете. Ответ сразу с объяснением.</p><div class="list">${rows}</div></div>`;
}

/* practice session: topic or mistakes, answer shows immediately */
let P = null;
function startPractice(kind, topic) {
  let qs = kind === 'mist' ? mistakes() : (full() ? BANK : []).filter(q => q.topic === topic);
  if (kind !== 'mist') qs = [...shuffle(qs.filter(q => !S.ans[q.id]?.ok)), ...shuffle(qs.filter(q => S.ans[q.id]?.ok))];
  P = { kind, topic, ids: qs.map(q => q.id), i: 0, pick: null, order: null, right: 0 };
}
function practice() {
  const m = byId();
  if (!P || P.i >= P.ids.length) return practiceDone();
  const q = m[P.ids[P.i]];
  if (!P.order) P.order = shuffle(q.o.map((_, i) => i));
  const answered = P.pick !== null;
  const opts = P.order.map((oi, k) => {
    let c = ''; if (answered) { if (oi === q.a) c = 'ok'; else if (oi === P.pick) c = 'bad'; }
    if (answered && oi === P.pick) c += ' just';
    return `<button class="opt ${c}" data-act="pr-pick" data-oi="${oi}" ${answered ? 'disabled' : ''}><span class="k">${LETTERS[k]}</span><span>${esc(q.o[oi])}</span></button>`;
  }).join('');
  const ok = P.pick === q.a;
  const title = P.kind === 'mist' ? 'Работа над ошибками' : P.topic;
  return `<div class="wrap">
    <div class="bar">${backBtn(P.kind === 'mist' ? '#/' : '#/topics')}<span class="meta num">${P.i + 1} из ${P.ids.length}</span></div>
    <div class="track"><i style="width:${P.i / P.ids.length * 100}%"></i></div>
    <span class="topic">${esc(title)}</span>
    <p class="q">${esc(q.q)}</p>
    <div class="opts">${opts}</div>
    ${answered ? `<div class="why"><b class="${ok ? 'okc' : 'badc'}">${ok ? 'Верно' : 'Неверно'}</b>${esc(q.e)}</div>` : ''}
    <div class="actions stick">${answered ? `<button class="btn main" data-act="pr-next">Дальше</button>` : `<button class="btn sec" data-act="pr-skip">Пропустить</button>`}</div>
  </div>`;
}
function practiceDone() {
  const n = P ? P.ids.length : 0;
  const isMist = P?.kind === 'mist';
  if (!n) return `<div class="wrap in"><div class="bar">${backBtn()}</div><h1>${isMist ? 'Ошибок нет' : 'Пусто'}</h1>
    <p class="muted">${isMist ? 'Здесь собираются вопросы, где вы ошиблись: в пробном тесте и при учёбе по темам. Пока таких нет.' : ''}</p>
    <div class="actions"><button class="btn main" data-act="exam-new">Пробный тест</button></div></div>`;
  return `<div class="wrap in"><div class="bar">${backBtn(isMist ? '#/' : '#/topics')}</div>
    <section class="card"><p class="score num">${P.right} из ${n}</p><p class="verdict ${P.right === n ? 'ok' : ''}">${P.right === n ? 'Всё верно' : 'Неплохо, ошибки попали в повторение'}</p></section>
    <div class="actions" style="position:static;padding:0"><button class="btn sec" data-go="${isMist ? '#/' : '#/topics'}">${isMist ? 'На главную' : 'Другие темы'}</button>
    <button class="btn main" data-act="pr-again">Ещё раз</button></div></div>`;
}

function defense() {
  const all = [...DEFENSE.asked.map(x => ({ ...x, src: 'asked' })), ...DEFENSE.extra.map(x => ({ ...x, src: 'extra' }))];
  const personal = (full() && ACCESS.personal) || [];
  const card = (d, key, locked) => locked ? '' : `<div class="dcard"><h3>${esc(d.q)}</h3>
    <button class="linkbtn" data-act="tip" aria-expanded="false">Как лучше ответить</button><p class="tip" hidden>${esc(d.tip)}</p>
    <textarea data-key="${key}" placeholder="Ваш ответ — запишите своими словами">${esc(S.def.a[key] || '')}</textarea>
    <div class="rec" data-rec="${key}"><button class="btn sec small" data-act="rec">Записать голосом</button></div></div>`;
  const freeExtra = full() ? all.length : DEFENSE.asked.length;
  return `<div class="wrap in"><div class="bar">${backBtn()}</div>
    <h1>Тренажёр защиты</h1><p class="muted">Комиссия — около 10 человек из соцзащиты и администрации. Вы рассказываете о деле, вам задают вопросы, решение сообщают через 5–10 минут.</p>
    <section class="dcard"><h2>Рассказ о себе за 2 минуты</h2><ol class="plan">${DEFENSE.speech.map(s => `<li>${esc(s)}</li>`).join('')}</ol>
      <p class="big-timer num" id="speech">${mmss(SPEECH_SECONDS)}</p>
      <div class="rec" data-rec="speech"><button class="btn main small" data-act="speech">Начать: таймер и запись</button></div>
      <p class="meta">Послушайте себя: где запинаетесь, там и дорабатывайте.</p></section>
    ${personal.length ? `<h2 style="margin-top:8px">Вопросы по вашему плану</h2>${personal.map((d, i) => card(d, 'p' + i)).join('')}` : ''}
    <h2 style="margin-top:8px">Что спрашивали у Эдуарда</h2>${DEFENSE.asked.map((d, i) => card(d, 'a' + i)).join('')}
    <h2 style="margin-top:8px">Что ещё стоит отработать</h2>
    ${full() ? DEFENSE.extra.map((d, i) => card(d, 'e' + i)).join('') : `<button class="row press" data-go="#/unlock"><div><div class="l">Ещё ${DEFENSE.extra.length} вопросов с подсказками</div><div class="s">И вопросы по вашему собственному плану</div></div><span class="lock">нужен код</span></button>`}
    <h2 style="margin-top:8px">Чек-лист накануне</h2>
    <section class="card">${DEFENSE.checklist.map((c, i) => `<label class="check"><input type="checkbox" data-chk="${i}" ${S.def.chk[i] ? 'checked' : ''}><span>${esc(c)}</span></label>`).join('')}</section>
  </div>`;
}

function about() {
  return `<div class="wrap in"><div class="bar">${backBtn()}</div><h1>Как проходит настоящий тест</h1>
    <p class="muted">Тест на предпринимательские компетенции нужен, если вы идёте на контракт по направлению «бизнес» или «личное подсобное хозяйство». Порядок — приказ Минэкономразвития от 18.03.2026 № 197.</p>
    <section class="card"><dl class="facts">
      <div><dt>Вопросов</dt><dd>45, один верный ответ</dd></div>
      <div><dt>Чтобы сдать</dt><dd>не меньше 28 верных</dd></div>
      <div><dt>Время</dt><dd>60 минут</dd></div>
      <div><dt>Открыть ссылку</dt><dd>в течение 10 минут</dd></div>
      <div><dt>Где</dt><dd>в соцзащите, на их компьютере</dd></div>
      <div><dt>С собой</dt><dd>паспорт, вход через Госуслуги</dd></div>
      <div><dt>Результат действует</dt><dd>12 месяцев</dd></div>
      <div><dt>Если не сдали</dt><dd>пересдача через 30 рабочих дней, после обучения</dd></div>
    </dl></section>
    <p class="muted">На тесте выпадают 45 случайных вопросов из большой базы. Поэтому учите тему, а не порядок ответов: в тренажёре варианты каждый раз перемешиваются.</p>
    <div class="actions"><button class="btn main" data-act="exam-new">Пройти пробный тест</button></div></div>`;
}

function unlock() {
  return `<div class="wrap in"><div class="bar">${backBtn()}</div><h1>Полный доступ</h1>
    <p class="muted">Все ${TOTAL} вопросов по ${NTOPICS} ${plural(NTOPICS, 'теме', 'темам', 'темам')}, учёба по темам с разбором, полный тренажёр защиты и вопросы по вашему бизнес-плану. Доступ входит в подготовку у Эдуарда — код он пришлёт в чате.</p>
    <form id="uform" class="card" style="display:flex;flex-direction:column;gap:12px">
      <label for="code" class="small muted">Код доступа</label>
      <input id="code" class="field" autocomplete="off" autocapitalize="characters" spellcheck="false" placeholder="Например, MARINA-7K3P" value="">
      <p class="msg" id="umsg"></p>
      <button class="btn main" type="submit">Открыть</button>
    </form>
    <p class="meta">Кода нет? Напишите Эдуарду в чате объявления на Авито.</p></div>`;
}

/* ---------- router ---------- */
function render() {
  const h = location.hash || '#/';
  if (h !== '#/exam') stopTick();
  let html;
  if (h === '#/exam') html = exam();
  else if (h === '#/result') html = result();
  else if (h === '#/topics') html = topics();
  else if (h.startsWith('#/topic/')) { const t = decodeURIComponent(h.slice(8)); if (!P || P.kind !== 'topic' || P.topic !== t) startPractice('topic', t); html = full() ? practice() : unlock(); }
  else if (h === '#/mistakes') { if (!P || P.kind !== 'mist') startPractice('mist'); html = practice(); }
  else if (h === '#/defense') html = defense();
  else if (h === '#/about') html = about();
  else if (h === '#/unlock') html = unlock();
  else html = home();
  app.innerHTML = html;
  if (h === '#/exam' && S.exam) startExamTimer();
}
window.addEventListener('hashchange', () => {
  const h = location.hash;
  if (!h.startsWith('#/topic/') && h !== '#/mistakes') P = null;
  render(); window.scrollTo(0, 0);
});

/* ---------- voice recording (needs https) ---------- */
const recs = {};
let active = null;
async function startRec(key, box, onStop) {
  if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) {
    box.insertAdjacentHTML('beforeend', '<p class="meta">Запись голоса в этом браузере недоступна. Можно потренироваться вслух без записи.</p>');
    return false;
  }
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mr = new MediaRecorder(stream), chunks = [];
    mr.ondataavailable = e => chunks.push(e.data);
    mr.onstop = () => {
      stream.getTracks().forEach(t => t.stop());
      if (recs[key]) URL.revokeObjectURL(recs[key]);
      recs[key] = URL.createObjectURL(new Blob(chunks, { type: mr.mimeType }));
      active = null; showRec(key, box); onStop && onStop();
    };
    mr.start(); active = { mr, key };
    return true;
  } catch {
    box.insertAdjacentHTML('beforeend', '<p class="meta">Нет доступа к микрофону. Разрешите его в настройках браузера.</p>');
    return false;
  }
}
function showRec(key, box) {
  const isSpeech = key === 'speech';
  box.innerHTML = `<button class="btn ${isSpeech ? 'main' : 'sec'} small" data-act="${isSpeech ? 'speech' : 'rec'}">Записать заново</button>${recs[key] ? `<audio controls src="${recs[key]}"></audio>` : ''}`;
}
let speechTimer = null;

/* result picture: drawn on a canvas so it works offline; no links or contacts on it on purpose */
async function shareResult() {
  const L = S.last; if (!L) return;
  const pass = L.score >= EXAM_PASS, need = EXAM_PASS - L.score;
  try { await document.fonts.load('700 120px Unbounded'); await document.fonts.load('400 40px "Golos Text"'); } catch (e) {}
  const W = 1080, H = 1350, c = document.createElement('canvas'); c.width = W; c.height = H;
  const x = c.getContext('2d');
  x.fillStyle = '#0F1011'; x.fillRect(0, 0, W, H);
  x.fillStyle = '#18191B'; x.beginPath(); x.roundRect(60, 60, W - 120, H - 120, 40); x.fill();
  x.textAlign = 'center';
  x.fillStyle = '#93958F'; x.font = '400 38px "Golos Text", sans-serif';
  x.fillText('Пробный тест на соцконтракт', W / 2, 190);
  x.fillStyle = '#F2F3EF'; x.font = '700 260px Unbounded, sans-serif';
  x.fillText(String(L.score), W / 2, 540);
  x.fillStyle = '#B5B7B1'; x.font = '400 54px "Golos Text", sans-serif';
  x.fillText('из ' + EXAM_SIZE + ' вопросов', W / 2, 640);
  const label = pass ? 'Тест сдан' : 'Не хватило ' + need + ' ' + plural(need, 'верного ответа', 'верных ответов', 'верных ответов');
  x.fillStyle = pass ? '#C6F062' : '#F2725F';
  // long verdicts ("Не хватило 10 верных ответов") must fit the card, so shrink until they do
  let fs = 62; do { x.font = `700 ${fs}px Unbounded, sans-serif`; fs -= 2; } while (x.measureText(label).width > W - 220 && fs > 30);
  x.fillText(label, W / 2, 790);
  x.fillStyle = '#93958F'; x.font = '400 40px "Golos Text", sans-serif';
  x.fillText('Проходной балл: ' + EXAM_PASS + ' из ' + EXAM_SIZE + ' · время ' + mmss(L.sec), W / 2, 870);
  // two strongest topics: a reason to be proud, not only the score
  const best = Object.entries(L.byTopic).filter(([, [ok, all]]) => all >= 2).sort((a, b) => b[1][0] / b[1][1] - a[1][0] / a[1][1]).slice(0, 2);
  if (best.length) {
    x.fillStyle = '#93958F'; x.font = '400 36px "Golos Text", sans-serif'; x.fillText('Сильные темы', W / 2, 1000);
    x.fillStyle = '#F2F3EF'; x.font = '600 44px "Golos Text", sans-serif';
    best.forEach(([t], i) => x.fillText(t.length > 34 ? t.slice(0, 33) + '…' : t, W / 2, 1066 + i * 62));
  }
  x.fillStyle = '#C6F062'; x.fillRect(W / 2 - 40, H - 190, 80, 6);
  x.fillStyle = '#B5B7B1'; x.font = '400 36px "Golos Text", sans-serif';
  x.fillText('Эдуард · бизнес-план для соцконтракта', W / 2, H - 120);
  const blob = await new Promise(r => c.toBlob(r, 'image/png'));
  const file = new File([blob], 'rezultat-testa.png', { type: 'image/png' });
  // phones: native share sheet; everywhere else: plain download
  if (navigator.canShare && navigator.canShare({ files: [file] })) {
    try { await navigator.share({ files: [file] }); return; } catch (e) { if (e.name === 'AbortError') return; }
  }
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = file.name; a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 4000);
}

/* ---------- events ---------- */
app.addEventListener('click', async e => {
  const b = e.target.closest('[data-go],[data-act]'); if (!b) return;
  if (b.dataset.go) { go(b.dataset.go); return; }
  const act = b.dataset.act, E = S.exam;
  if (act === 'share') { shareResult(); return; }
  if (act === 'exam-new') {
    if (S.exam && !confirm('Начать новый тест? Текущий будет сброшен.')) return;
    S.exam = null; newExam();
  } else if (act === 'exam-pick') { E.ans[E.ids[E.cur]] = +b.dataset.oi; save(); render(); }
  else if (act === 'exam-next') { E.cur = Math.min(E.cur + 1, E.ids.length - 1); save(); render(); window.scrollTo(0, 0); }
  else if (act === 'exam-prev') { E.cur = Math.max(E.cur - 1, 0); save(); render(); window.scrollTo(0, 0); }
  else if (act === 'exam-jump') { E.cur = +b.dataset.i; save(); render(); window.scrollTo(0, 0); }
  else if (act === 'exam-finish') finishExam(false);
  else if (act === 'pr-pick') {
    const q = byId()[P.ids[P.i]]; P.pick = +b.dataset.oi;
    const ok = P.pick === q.a; if (ok) P.right++; record(q, ok); save(); render();
    if (navigator.vibrate && !ok) navigator.vibrate(30);
  } else if (act === 'pr-next' || act === 'pr-skip') { P.i++; P.pick = null; P.order = null; render(); window.scrollTo(0, 0); }
  else if (act === 'pr-again') { startPractice(P.kind, P.topic); render(); }
  else if (act === 'tip') { const t = b.nextElementSibling; t.hidden = !t.hidden; b.setAttribute('aria-expanded', String(!t.hidden)); b.textContent = t.hidden ? 'Как лучше ответить' : 'Скрыть подсказку'; }
  else if (act === 'rec') {
    const box = b.closest('[data-rec]'), key = box.dataset.rec;
    if (active && active.key === key) { active.mr.stop(); return; }
    if (active) active.mr.stop();
    if (await startRec(key, box)) box.innerHTML = '<span class="recdot" aria-hidden="true"></span><span class="small">Идёт запись</span><button class="btn sec small" data-act="rec">Стоп</button>';
  } else if (act === 'speech') {
    const box = b.closest('[data-rec]'), out = $('#speech');
    if (speechTimer) { clearInterval(speechTimer); speechTimer = null; if (active) active.mr.stop(); return; }
    if (active) active.mr.stop();
    const started = await startRec('speech', box, () => { clearInterval(speechTimer); speechTimer = null; });
    let left = SPEECH_SECONDS; out.textContent = mmss(left);
    box.innerHTML = `${started ? '<span class="recdot" aria-hidden="true"></span><span class="small">Идёт запись</span>' : ''}<button class="btn sec small" data-act="speech">Стоп</button>`;
    speechTimer = setInterval(() => {
      left--; out.textContent = mmss(Math.max(left, 0));
      if (left <= 0) { clearInterval(speechTimer); speechTimer = null; if (active) active.mr.stop(); else showRec('speech', box); }
    }, 1000);
  }
});
app.addEventListener('input', e => {
  const k = e.target.dataset.key; if (k) { S.def.a[k] = e.target.value; save(); }
});
app.addEventListener('change', e => {
  const i = e.target.dataset.chk; if (i !== undefined) { S.def.chk[i] = e.target.checked; save(); }
});
app.addEventListener('submit', async e => {
  if (e.target.id !== 'uform') return;
  e.preventDefault();
  const code = $('#code').value.trim(), msg = $('#umsg'), btn = e.target.querySelector('button');
  if (!code) { msg.className = 'msg bad'; msg.textContent = 'Введите код'; return; }
  btn.disabled = true; msg.className = 'msg'; msg.textContent = 'Проверяю…';
  try {
    const d = await openCode(code);
    ACCESS = { code: d.code, name: d.name, personal: d.personal }; BANK = d.bank;
    LS.set('tr_access', ACCESS); LS.set('tr_bank', BANK);
    go('#/'); render();
  } catch (err) {
    msg.className = 'msg bad'; msg.textContent = err.message === 'Failed to fetch' ? 'Нет связи. Проверьте интернет' : err.message; btn.disabled = false;
  }
});

/* ---------- code unlock without a server ---------- */
// Hosting is static, so the code itself is the key: it derives both the encrypted file's name
// and its AES key (same scheme as build_static.py). Wrong code -> file not found.
async function openCode(raw) {
  const code = raw.trim().toUpperCase(), enc = new TextEncoder();
  const base = await crypto.subtle.importKey('raw', enc.encode(code), 'PBKDF2', false, ['deriveBits']);
  const bits = new Uint8Array(await crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt: enc.encode('trenazher-v1'), iterations: 300000 }, base, 512));
  const fid = [...bits.slice(32, 48)].map(b => b.toString(16).padStart(2, '0')).join('');
  const r = await fetch(`data/k/${fid}.bin`, { cache: 'no-cache' });
  if (r.status === 404) throw new Error('Код не подошёл, проверьте его');
  if (!r.ok) throw new Error('Не получилось, попробуйте ещё раз');
  const buf = new Uint8Array(await r.arrayBuffer());
  const key = await crypto.subtle.importKey('raw', bits.slice(0, 32), 'AES-GCM', false, ['decrypt']);
  const plain = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: buf.slice(0, 12) }, key, buf.slice(12));
  return JSON.parse(new TextDecoder().decode(plain));
}

/* ---------- start ---------- */
fetch('data/free.json').then(r => r.json()).then(d => {
  FREE = d.bank; TOTAL = d.total; NTOPICS = d.topics;
  // Refresh personal questions and bank silently, in case Eduard updated them for this client.
  if (ACCESS) openCode(ACCESS.code)
    .then(x => { if (x) { ACCESS.personal = x.personal; ACCESS.name = x.name; BANK = x.bank; LS.set('tr_access', ACCESS); LS.set('tr_bank', BANK); } }).catch(() => {});
  render();
}).catch(() => { app.innerHTML = '<div class="wrap"><h1>Нет связи</h1><p class="muted">Проверьте интернет и обновите страницу.</p></div>'; });
