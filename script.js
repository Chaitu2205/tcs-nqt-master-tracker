/* ============================================================
   TCS NQT MASTER TRACKER — APPLICATION LOGIC
   Vanilla JS. All state persisted to localStorage.
   ============================================================ */

'use strict';

/* ---------------------------------------------------------
   1. STATIC DATA
--------------------------------------------------------- */

const ROADMAP = [
  { id:1, title:'Fundamentals', topics:['Sum of Digits','Count Digits','Reverse Number','Palindrome','Armstrong','Prime','Perfect Number','Fibonacci','GCD','LCM','Strong Number','Neon Number','Automorphic','Harshad Number','Swap Numbers','Revision'] },
  { id:2, title:'Arrays', topics:['Largest','Smallest','Second Largest','Second Smallest','Sum','Average','Reverse','Ascending Sort','Descending Sort','Remove Duplicates','Frequency','Rotate','Merge','Missing Number','Duplicate','Even Odd'] },
  { id:3, title:'Strings', topics:['Reverse String','Palindrome String','Count Vowels','Count Consonants','Character Frequency','Remove Spaces','Remove Duplicate Characters','ASCII','Toggle Case','Replace Character','Count Words','Longest Word','Anagram','Substring','Compare Strings'] },
  { id:4, title:'Patterns', topics:['Half Pyramid','Full Pyramid','Inverted Pyramid','Diamond','Butterfly','Hollow Square','X Pattern','Pascal Triangle','Floyd Triangle','Number Triangle'] },
  { id:5, title:'Searching & Sorting', topics:['Linear Search','Binary Search','Bubble Sort','Selection Sort','Insertion Sort','Merge Sort','Quick Sort','Heap Sort','Kth Largest','Binary Search Variants'] },
  { id:6, title:'Recursion', topics:['Factorial','Fibonacci','Power','GCD','Reverse String','Palindrome','Array Sum','Print Numbers','Tower of Hanoi','Backtracking Basics'] },
  { id:7, title:'Data Structures', topics:['Stack','Queue','Circular Queue','Deque','Linked List','Reverse Linked List','HashMap','HashSet','Balanced Parentheses','Priority Queue'] },
  { id:8, title:'Matrices', topics:['Addition','Multiplication','Transpose','Diagonal Sum','Identity Matrix','Rotate Matrix','Spiral Matrix','Boundary Elements','Upper Triangle','Lower Triangle'] },
  { id:9, title:'Logic Problems', topics:['Salary Calculation','Electricity Bill','ATM','Grade System','Taxi Fare','Chocolate Distribution','Voting','Password Validation','Inventory','Calendar'] },
  { id:10, title:'Frequently Asked', topics:['Two Sum','Leaders in Array','Move Zeroes','Majority Element','Happy Number','Stock Buy Sell','Rotate String','Common Elements','First Non Repeating Character','Valid Parentheses'] },
];

const TOTAL_TOPICS = ROADMAP.reduce((s,w) => s + w.topics.length, 0);

function difficultyFor(weekIdx, topicIdx, total){
  const base = [0.08,0.12,0.16,0.28,0.34,0.38,0.42,0.46,0.50,0.56][weekIdx] || 0.4;
  const score = base + (topicIdx/total) * 0.32;
  if (score < 0.32) return 'easy';
  if (score < 0.62) return 'medium';
  return 'hard';
}

const APTITUDE = {
  quantitative: { label:'Quantitative', items:['Number System','Percentages','Profit & Loss','Time & Work','Time, Speed & Distance','Ratio & Proportion','Averages','Simple & Compound Interest','Permutation & Combination','Probability'] },
  reasoning: { label:'Reasoning', items:['Blood Relations','Coding-Decoding','Series Completion','Direction Sense','Syllogisms','Puzzles','Seating Arrangement','Data Sufficiency','Clocks & Calendars','Logical Venn Diagrams'] },
  verbal: { label:'Verbal', items:['Reading Comprehension','Synonyms & Antonyms','Sentence Correction','Para Jumbles','Fill in the Blanks','Error Spotting','Analogies','Idioms & Phrases','One Word Substitution','Cloze Test'] },
};

const SUBJECTS = {
  dbms: { label:'DBMS', short:'DB', items:['ER Model','Normalization','Transactions & ACID','Indexing','Joins','Keys & Constraints'] },
  sql: { label:'SQL', short:'SQL', items:['Basic Queries','Joins','Subqueries','Aggregate Functions','Views','Stored Procedures'] },
  os: { label:'Operating Systems', short:'OS', items:['Process Management','Scheduling Algorithms','Deadlocks','Memory Management','Paging & Segmentation','File Systems'] },
  cn: { label:'Computer Networks', short:'CN', items:['OSI Model','TCP/IP','Routing','DNS','HTTP / HTTPS','Network Security Basics'] },
  oop: { label:'OOP', short:'OOP', items:['Classes & Objects','Inheritance','Polymorphism','Encapsulation','Abstraction','Design Principles'] },
  python: { label:'Python', short:'PY', items:['Data Types','Functions','OOP in Python','List / Dict Comprehensions','Exception Handling','File Handling'] },
};

const INTERVIEW = {
  hr: { label:'HR Questions', items:['Tell me about yourself','Strengths and weaknesses','Why TCS?','Where do you see yourself in 5 years?','Why should we hire you?','Describe a challenge you overcame','Are you willing to relocate?','Questions to ask the interviewer'] },
  technical: { label:'Technical Questions', items:['OOP concepts with examples','DBMS normalization forms','SQL joins explained','Process vs thread','Core data structures basics','Time complexity analysis','Explain your project architecture','Your debugging approach'] },
  projects: { label:'Projects Checklist', items:['Prepare a 2-minute project pitch','List the full tech stack used','Know your project\'s edge cases','Be ready to explain your exact role','Prepare an answer for "what would you improve"'] },
};

const QUOTES = [
  'Consistency compounds — one topic a day is a cleared roadmap in 127 days.',
  'The mock test is a rehearsal, not a verdict. Learn from it and move on.',
  'A blank checkbox today is tomorrow\'s easy win — don\'t skip the fundamentals.',
  'Debugging your own code is the fastest way to actually learn a concept.',
  'Speed comes after accuracy. Get the logic right first, then get it fast.',
  'Your streak isn\'t about perfection — it\'s about showing up.',
  'Every pattern you print by hand builds intuition no video can give you.',
  'The interviewer isn\'t testing if you\'re perfect. They\'re testing if you can think out loud.',
  'Aptitude is a skill, not a talent. Ten minutes a day beats one long cram session.',
  'Revisit Week 1 topics even in Week 10 — the basics are what interviewers probe first.',
  'Progress you can\'t see is still progress. Trust the tracker.',
  'Finish today\'s smallest task first. Momentum matters more than motivation.',
];

const ACHIEVEMENTS = [
  { id:'bronze', label:'Bronze', medal:'🥉', need:10, desc:'Complete 10 topics' },
  { id:'silver', label:'Silver', medal:'🥈', need:30, desc:'Complete 30 topics' },
  { id:'gold', label:'Gold', medal:'🥇', need:60, desc:'Complete 60 topics' },
  { id:'diamond', label:'Diamond', medal:'💎', need:100, desc:'Complete 100 topics' },
  { id:'master', label:'Master', medal:'👑', need:TOTAL_TOPICS, desc:`Complete all ${TOTAL_TOPICS} topics` },
];

/* ---------------------------------------------------------
   2. STATE
--------------------------------------------------------- */

const STORAGE_KEY = 'tcsNqtTrackerState_v1';

function defaultState(){
  return {
    user: { name: 'Aspirant' },
    theme: 'dark',
    sidebarCollapsed: false,
    topics: {},
    planner: {},
    pomodoro: { minutes:25, history: [], lastDate:null, sessionsToday:0, minutesToday:0 },
    notes: [],
    mocks: [1,2,3,4,5].map(n => ({ name:`Mock ${n}`, score:'', total:'', date:'', notes:'' })),
    interview: mkChecklist(INTERVIEW),
    aptitude: mkChecklist(APTITUDE),
    subjects: mkChecklist(SUBJECTS),
    xp: 0,
    streak: { current:0, longest:0, lastActiveDate:null },
    achievementsUnlocked: [],
  };
}
function mkChecklist(src){
  const out = {};
  Object.keys(src).forEach(k => { out[k] = src[k].items.map(t => ({ text:t, done:false })); });
  return out;
}

let state = loadState();

function loadState(){
  try{
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();
    const parsed = JSON.parse(raw);
    return Object.assign(defaultState(), parsed);
  }catch(e){
    console.error('Failed to load state', e);
    return defaultState();
  }
}
function saveState(){
  try{ localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
  catch(e){ console.error('Failed to save state', e); }
}

function topicState(id){
  if (!state.topics[id]){
    state.topics[id] = { done:false, status:'pending', notes:'', timeSpent:0, dateCompleted:null, solPython:'', solJava:'', solCpp:'' };
  }
  return state.topics[id];
}

/* ---------------------------------------------------------
   3. UTILITIES
--------------------------------------------------------- */

function todayStr(d = new Date()){
  return d.toISOString().slice(0,10);
}
function dayLabel(offset){
  const d = new Date(); d.setDate(d.getDate()+offset);
  return d.toLocaleDateString(undefined,{ weekday:'short' });
}
function fmtDate(iso){
  if (!iso) return '—';
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString(undefined,{ month:'short', day:'numeric' });
}
function uid(){ return Math.random().toString(36).slice(2,10) + Date.now().toString(36); }
function clamp(n,a,b){ return Math.max(a, Math.min(b,n)); }

function toast(msg, type=''){
  const stack = document.getElementById('toastStack');
  const el = document.createElement('div');
  el.className = 'toast ' + type;
  el.textContent = msg;
  stack.appendChild(el);
  setTimeout(() => { el.style.transition='opacity .3s ease'; el.style.opacity='0'; setTimeout(()=>el.remove(),300); }, 2800);
}

function addXp(amount){
  state.xp += amount;
  saveState();
  renderXp();
}
function levelInfo(){
  const perLevel = 200;
  const level = Math.floor(state.xp / perLevel) + 1;
  const into = state.xp % perLevel;
  return { level, into, perLevel, pct: (into/perLevel)*100 };
}

function touchActivity(){
  const today = todayStr();
  const s = state.streak;
  if (s.lastActiveDate === today) return;
  if (s.lastActiveDate){
    const prev = new Date(s.lastActiveDate + 'T00:00:00');
    const diffDays = Math.round((new Date(today+'T00:00:00') - prev) / 86400000);
    s.current = diffDays === 1 ? s.current + 1 : 1;
  } else {
    s.current = 1;
  }
  s.lastActiveDate = today;
  s.longest = Math.max(s.longest, s.current);
  saveState();
}

function weekOfTopics(topics){
  return topics.filter(t => topicState(t.tid).status === 'completed').length;
}

/* ---------------------------------------------------------
   4. NAVIGATION / SHELL
--------------------------------------------------------- */

const pages = ['dashboard','roadmap','planner','pomodoro','notes','mocks','interview','aptitude','subjects','analytics','achievements'];

function initNav(){
  document.querySelectorAll('.nav-item').forEach(btn => {
    btn.addEventListener('click', () => goToPage(btn.dataset.page));
  });
  document.getElementById('hamburger').addEventListener('click', () => {
    document.getElementById('sidebar').classList.add('mobile-open');
    document.getElementById('sidebarScrim').classList.add('show');
  });
  document.getElementById('sidebarScrim').addEventListener('click', closeMobileSidebar);
  document.getElementById('sidebarToggle').addEventListener('click', () => {
    state.sidebarCollapsed = !state.sidebarCollapsed;
    document.getElementById('sidebar').classList.toggle('collapsed', state.sidebarCollapsed);
    saveState();
  });
  if (state.sidebarCollapsed) document.getElementById('sidebar').classList.add('collapsed');
}
function closeMobileSidebar(){
  document.getElementById('sidebar').classList.remove('mobile-open');
  document.getElementById('sidebarScrim').classList.remove('show');
}
function goToPage(page){
  if (!pages.includes(page)) return;
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('page-' + page).classList.add('active');
  document.querySelectorAll('.nav-item').forEach(b => b.classList.toggle('active', b.dataset.page === page));
  if (history.replaceState) history.replaceState(null, '', '#' + page);
  closeMobileSidebar();
  window.scrollTo({ top:0, behavior:'instant' in window ? 'instant' : 'auto' });
  if (page === 'dashboard') renderDashboard();
  if (page === 'analytics') renderAnalytics();
  if (page === 'achievements') renderAchievements();
}

function initTheme(){
  document.documentElement.setAttribute('data-theme', state.theme);
  document.getElementById('themeToggle').addEventListener('click', () => {
    state.theme = state.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', state.theme);
    saveState();
    renderAnalytics(); renderDashboard();
  });
}

/* ---------------------------------------------------------
   5. DASHBOARD
--------------------------------------------------------- */

function allTopicRefs(){
  const refs = [];
  ROADMAP.forEach((wk, wi) => wk.topics.forEach((name, ti) => {
    refs.push({ tid:`w${wk.id}-t${ti}`, name, week:wk.id, weekTitle:wk.title, difficulty: difficultyFor(wi,ti,wk.topics.length) });
  }));
  return refs;
}
const TOPIC_REFS = allTopicRefs();

function computeStats(){
  const completed = TOPIC_REFS.filter(t => topicState(t.tid).status === 'completed').length;
  const progress = TOPIC_REFS.filter(t => topicState(t.tid).status === 'progress').length;
  const pending = TOTAL_TOPICS - completed - progress;
  const pct = Math.round((completed / TOTAL_TOPICS) * 100);
  const totalMinutes = TOPIC_REFS.reduce((s,t) => s + (Number(topicState(t.tid).timeSpent) || 0), 0);
  return { completed, progress, pending, pct, totalMinutes };
}

function renderDashboard(){
  const eyebrow = document.getElementById('dateEyebrow');
  eyebrow.textContent = new Date().toLocaleDateString(undefined, { weekday:'long', year:'numeric', month:'long', day:'numeric' }).toUpperCase();
  document.getElementById('userNameDisplay').textContent = state.user.name || 'Aspirant';
  document.getElementById('quoteText').textContent = QUOTES[new Date().getDate() % QUOTES.length];

  const stats = computeStats();
  const circumference = 2 * Math.PI * 60;
  const ring = document.getElementById('dashRing');
  ring.style.strokeDasharray = circumference;
  ring.style.strokeDashoffset = circumference - (stats.pct/100) * circumference;
  document.getElementById('dashPct').textContent = stats.pct + '%';

  const { level, pct: lvlPct } = levelInfo();

  const statGrid = document.getElementById('statGrid');
  statGrid.innerHTML = '';
  const cards = [
    { ic:'▤', color:'var(--accent)', bg:'var(--accent-soft)', val: TOTAL_TOPICS, label:'Total Topics' },
    { ic:'✓', color:'var(--success)', bg:'var(--success-soft)', val: stats.completed, label:'Completed' },
    { ic:'◔', color:'var(--warning)', bg:'var(--warning-soft)', val: stats.pending, label:'Remaining' },
    { ic:'🔥', color:'var(--warning)', bg:'var(--warning-soft)', val: state.streak.current, label:'Daily Streak' },
    { ic:'✦', color:'var(--accent-2)', bg:'var(--accent-soft)', val: state.xp, label:'XP Points' },
    { ic:'⬢', color:'var(--info)', bg:'rgba(56,189,248,.14)', val: 'Lv ' + level, label:'Current Level' },
  ];
  cards.forEach(c => {
    const div = document.createElement('div');
    div.className = 'stat-card';
    div.innerHTML = `<span class="stat-ic" style="background:${c.bg};color:${c.color}">${c.ic}</span><span class="stat-val">${c.val}</span><span class="stat-label">${c.label}</span>`;
    statGrid.appendChild(div);
  });

  renderXp();
  renderWeekStrip();
  renderDashPlan();
  drawWeeklyChart();
  drawMonthlyChart();
}

function renderXp(){
  const { level, pct } = levelInfo();
  document.getElementById('topLevel').textContent = 'Lv ' + level;
  document.getElementById('topXpFill').style.width = pct + '%';
  document.getElementById('topXpNum').textContent = state.xp + ' XP';
  document.getElementById('sidebarStreakNum').textContent = state.streak.current;
}

function renderWeekStrip(){
  const strip = document.getElementById('weekStrip');
  strip.innerHTML = '';
  ROADMAP.forEach(wk => {
    const refs = TOPIC_REFS.filter(t => t.week === wk.id);
    const done = refs.filter(t => topicState(t.tid).status === 'completed').length;
    const pct = Math.round((done/refs.length)*100);
    const chip = document.createElement('div');
    chip.className = 'week-chip' + (pct === 100 ? ' done' : '');
    chip.innerHTML = `<div class="wk-num">WEEK ${wk.id}</div><div class="wk-name">${wk.title}</div><div class="wk-bar"><div class="wk-bar-fill" style="width:${pct}%"></div></div>`;
    chip.addEventListener('click', () => { goToPage('roadmap'); setTimeout(()=>openWeek(wk.id), 60); });
    strip.appendChild(chip);
  });
}

function renderDashPlan(){
  const today = state.planner[todayStr()] || { morning:[], afternoon:[], evening:[] };
  const all = [...(today.morning||[]), ...(today.afternoon||[]), ...(today.evening||[])];
  const wrap = document.getElementById('dashPlanPreview');
  document.getElementById('dashPlanTag').textContent = all.length + ' tasks';
  if (!all.length){
    wrap.innerHTML = `<p class="empty-hint">No tasks planned for today yet. Head to Daily Planner to add some.</p>`;
    return;
  }
  wrap.innerHTML = all.slice(0,6).map(t => `<div class="dash-plan-row ${t.done?'done':''}"><span class="dot"></span>${escapeHtml(t.text)}</div>`).join('');
}

function escapeHtml(s){
  return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

/* ---------------------------------------------------------
   6. CANVAS CHARTS (no external libs)
--------------------------------------------------------- */

function cssVar(name){ return getComputedStyle(document.documentElement).getPropertyValue(name).trim(); }

function drawBarChart(canvasId, labels, data, color){
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  const w = rect.width || canvas.clientWidth || 300;
  const h = canvas.height ? Number(canvas.getAttribute('height')) : 160;
  canvas.width = w * dpr; canvas.height = h * dpr;
  canvas.style.width = w + 'px'; canvas.style.height = h + 'px';
  const ctx = canvas.getContext('2d');
  ctx.scale(dpr,dpr);
  ctx.clearRect(0,0,w,h);

  const max = Math.max(1, ...data);
  const padBottom = 22, padTop = 10;
  const chartH = h - padBottom - padTop;
  const gap = 10;
  const barW = (w - gap*(labels.length+1)) / labels.length;
  const textColor = cssVar('--text-faint');

  ctx.font = '10px JetBrains Mono, monospace';
  ctx.fillStyle = textColor;
  ctx.textAlign = 'center';

  labels.forEach((lab,i) => {
    const val = data[i];
    const barH = Math.max(3, (val/max) * chartH);
    const x = gap + i*(barW+gap);
    const y = padTop + (chartH - barH);
    const grad = ctx.createLinearGradient(0,y,0,y+barH);
    grad.addColorStop(0, color);
    grad.addColorStop(1, color + '55');
    ctx.fillStyle = grad;
    roundRect(ctx, x, y, barW, barH, 4);
    ctx.fill();
    ctx.fillStyle = textColor;
    ctx.fillText(lab, x + barW/2, h - 6);
  });
}
function roundRect(ctx,x,y,w,h,r){
  ctx.beginPath();
  ctx.moveTo(x+r,y);
  ctx.arcTo(x+w,y,x+w,y+h,r);
  ctx.arcTo(x+w,y+h,x,y+h,r);
  ctx.arcTo(x,y+h,x,y,r);
  ctx.arcTo(x,y,x+w,y,r);
  ctx.closePath();
}

function drawLineChart(canvasId, labels, data, color){
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  const w = rect.width || canvas.clientWidth || 300;
  const h = Number(canvas.getAttribute('height')) || 160;
  canvas.width = w*dpr; canvas.height = h*dpr;
  canvas.style.width = w+'px'; canvas.style.height = h+'px';
  const ctx = canvas.getContext('2d');
  ctx.scale(dpr,dpr);
  ctx.clearRect(0,0,w,h);
  const max = Math.max(1, ...data), min = 0;
  const padB = 22, padT = 14, padX = 16;
  const chartW = w - padX*2, chartH = h - padB - padT;
  const stepX = data.length > 1 ? chartW/(data.length-1) : 0;
  ctx.beginPath();
  data.forEach((v,i) => {
    const x = padX + i*stepX;
    const y = padT + chartH - ((v-min)/(max-min||1))*chartH;
    if (i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
  });
  ctx.strokeStyle = color; ctx.lineWidth = 2.4; ctx.lineJoin='round'; ctx.stroke();
  data.forEach((v,i) => {
    const x = padX + i*stepX;
    const y = padT + chartH - ((v-min)/(max-min||1))*chartH;
    ctx.beginPath(); ctx.arc(x,y,3.4,0,Math.PI*2); ctx.fillStyle = color; ctx.fill();
  });
  ctx.font = '10px JetBrains Mono, monospace';
  ctx.fillStyle = cssVar('--text-faint');
  ctx.textAlign = 'center';
  labels.forEach((lab,i) => {
    const x = padX + i*stepX;
    ctx.fillText(lab, x, h-6);
  });
}

function completedCountsByDay(days){
  const counts = new Array(days).fill(0);
  const now = new Date();
  TOPIC_REFS.forEach(t => {
    const ts = topicState(t.tid);
    if (ts.status === 'completed' && ts.dateCompleted){
      const d = new Date(ts.dateCompleted + 'T00:00:00');
      const diff = Math.round((new Date(todayStr()+'T00:00:00') - d) / 86400000);
      const idx = days - 1 - diff;
      if (idx >= 0 && idx < days) counts[idx]++;
    }
  });
  return counts;
}

function drawWeeklyChart(){
  const counts = completedCountsByDay(7);
  const labels = counts.map((_,i) => dayLabel(i-6));
  drawBarChart('weeklyChart', labels, counts, cssVar('--accent'));
}
function drawMonthlyChart(){
  const counts = completedCountsByDay(28);
  const weekly = [0,0,0,0];
  counts.forEach((c,i) => { weekly[Math.floor(i/7)] += c; });
  drawBarChart('monthlyChart', ['Wk -3','Wk -2','Wk -1','This wk'], weekly, cssVar('--accent-2'));
}

/* ---------------------------------------------------------
   7. ROADMAP
--------------------------------------------------------- */

let openWeekId = 1;
let roadmapFilter = 'all';
let roadmapQuery = '';

function initRoadmap(){
  document.getElementById('roadmapSearch').addEventListener('input', e => {
    roadmapQuery = e.target.value.toLowerCase().trim();
    renderRoadmap();
  });
  document.querySelectorAll('#statusFilter .seg-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#statusFilter .seg-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      roadmapFilter = btn.dataset.filter;
      renderRoadmap();
    });
  });
  document.querySelector('#page-roadmap .hero-title-sm').textContent = `${TOTAL_TOPICS} topics across 10 weeks`;
}

function openWeek(id){
  openWeekId = id;
  renderRoadmap();
  const el = document.getElementById('week-'+id);
  if (el) el.scrollIntoView({ behavior:'smooth', block:'start' });
}

function matchesFilter(tid){
  const ts = topicState(tid);
  if (roadmapFilter === 'completed') return ts.status === 'completed';
  if (roadmapFilter === 'progress') return ts.status === 'progress';
  if (roadmapFilter === 'pending') return ts.status === 'pending';
  return true;
}

function renderRoadmap(){
  const wrap = document.getElementById('roadmapWeeks');
  wrap.innerHTML = '';
  ROADMAP.forEach((wk, wi) => {
    const refs = TOPIC_REFS.filter(t => t.week === wk.id);
    const visible = refs.filter(t => {
      const nameMatch = !roadmapQuery || t.name.toLowerCase().includes(roadmapQuery);
      return nameMatch && matchesFilter(t.tid);
    });
    if (roadmapQuery && !visible.length) return;

    const done = refs.filter(t => topicState(t.tid).status === 'completed').length;
    const pct = Math.round((done/refs.length)*100);

    const block = document.createElement('div');
    block.className = 'week-block' + (openWeekId === wk.id ? ' open' : '');
    block.id = 'week-' + wk.id;
    block.innerHTML = `
      <div class="week-block-head">
        <span class="wb-idx">WEEK ${wk.id}</span>
        <h3>${wk.title}</h3>
        <div class="wb-bar"><div class="wb-bar-fill" style="width:${pct}%"></div></div>
        <span class="wb-count">${done}/${refs.length}</span>
        <span class="wb-chevron">▸</span>
      </div>
      <div class="week-block-body"></div>
    `;
    block.querySelector('.week-block-head').addEventListener('click', () => {
      openWeekId = openWeekId === wk.id ? null : wk.id;
      renderRoadmap();
    });
    const body = block.querySelector('.week-block-body');
    visible.forEach(t => body.appendChild(renderTopicRow(t)));
    wrap.appendChild(block);
  });
}

let openTopicId = null;

function renderTopicRow(t){
  const ts = topicState(t.tid);
  const row = document.createElement('div');
  row.className = 'topic-row' + (openTopicId === t.tid ? ' open' : '');
  row.innerHTML = `
    <div class="topic-head">
      <div class="topic-check ${ts.status==='completed'?'checked':''}" data-act="toggle"></div>
      <span class="topic-name ${ts.status==='completed'?'done':''}">${escapeHtml(t.name)}</span>
      <span class="badge badge-${t.difficulty}">${t.difficulty.toUpperCase()}</span>
      <span class="status-pill st-${ts.status==='completed'?'completed':ts.status==='progress'?'progress':'pending'}">${ts.status.toUpperCase()}</span>
      <span class="topic-caret">▸</span>
    </div>
    <div class="topic-detail"></div>
  `;
  row.querySelector('[data-act="toggle"]').addEventListener('click', ev => {
    ev.stopPropagation();
    ts.status = ts.status === 'completed' ? 'pending' : 'completed';
    ts.done = ts.status === 'completed';
    if (ts.status === 'completed'){
      ts.dateCompleted = todayStr();
      addXp(15);
      touchActivity();
      toast(`${t.name} marked complete (+15 XP)`, 'success');
      checkWeekCompletion(t.week);
      checkAchievements();
    } else {
      ts.dateCompleted = null;
    }
    saveState();
    renderRoadmap();
    renderDashboard();
  });
  row.querySelector('.topic-head').addEventListener('click', () => {
    openTopicId = openTopicId === t.tid ? null : t.tid;
    renderRoadmap();
  });
  if (openTopicId === t.tid){
    row.querySelector('.topic-detail').appendChild(renderTopicDetail(t));
  }
  return row;
}

function renderTopicDetail(t){
  const ts = topicState(t.tid);
  const wrap = document.createElement('div');
  wrap.innerHTML = `
    <div class="topic-detail-grid">
      <div class="field"><label>Status</label>
        <select data-f="status">
          <option value="pending" ${ts.status==='pending'?'selected':''}>Pending</option>
          <option value="progress" ${ts.status==='progress'?'selected':''}>In Progress</option>
          <option value="completed" ${ts.status==='completed'?'selected':''}>Completed</option>
        </select>
      </div>
      <div class="field"><label>Time Spent (min)</label><input type="number" min="0" data-f="timeSpent" value="${ts.timeSpent||0}"></div>
      <div class="field"><label>Date Completed</label><input type="date" data-f="dateCompleted" value="${ts.dateCompleted||''}"></div>
      <div class="field"><label>Difficulty</label><input type="text" value="${t.difficulty}" disabled></div>
    </div>
    <div class="field topic-notes"><label>Notes</label><textarea placeholder="Approach, edge cases, gotchas…" data-f="notes">${escapeHtml(ts.notes||'')}</textarea></div>
    <div class="topic-actions">
      <button class="btn btn-ghost btn-sm sol-btn" data-lang="Python">🐍 Python solution</button>
      <button class="btn btn-ghost btn-sm sol-btn" data-lang="Java">☕ Java solution</button>
      <button class="btn btn-ghost btn-sm sol-btn" data-lang="C++" >⚙ C++ solution</button>
      <button class="btn btn-primary btn-sm" data-act="practice">▶ Practice</button>
    </div>
  `;
  wrap.querySelector('[data-f="status"]').addEventListener('change', e => {
    ts.status = e.target.value;
    ts.done = ts.status === 'completed';
    ts.dateCompleted = ts.status === 'completed' ? (ts.dateCompleted || todayStr()) : ts.dateCompleted;
    if (ts.status === 'completed'){ addXp(15); touchActivity(); checkWeekCompletion(t.week); checkAchievements(); }
    saveState(); renderRoadmap(); renderDashboard();
  });
  wrap.querySelector('[data-f="timeSpent"]').addEventListener('change', e => {
    ts.timeSpent = Number(e.target.value) || 0; saveState();
  });
  wrap.querySelector('[data-f="dateCompleted"]').addEventListener('change', e => {
    ts.dateCompleted = e.target.value || null; saveState();
  });
  wrap.querySelector('[data-f="notes"]').addEventListener('change', e => {
    ts.notes = e.target.value; saveState();
  });
  wrap.querySelectorAll('.sol-btn').forEach(btn => {
    btn.addEventListener('click', () => openSolutionModal(t, btn.dataset.lang));
  });
  wrap.querySelector('[data-act="practice"]').addEventListener('click', () => {
    const q = encodeURIComponent(t.name + ' programming practice');
    window.open('https://www.google.com/search?q=' + q, '_blank', 'noopener');
  });
  return wrap;
}

function checkWeekCompletion(weekId){
  const refs = TOPIC_REFS.filter(t => t.week === weekId);
  const allDone = refs.every(t => topicState(t.tid).status === 'completed');
  if (allDone) fireConfetti();
}

function openSolutionModal(t, lang){
  const ts = topicState(t.tid);
  const field = lang === 'Python' ? 'solPython' : lang === 'Java' ? 'solJava' : 'solCpp';
  openModal(`${lang} — ${t.name}`, `
    <textarea id="solEditor" placeholder="Write or paste your ${lang} solution here…">${escapeHtml(ts[field]||'')}</textarea>
  `, [
    { label:'Close', cls:'btn-ghost', onClick: closeModal },
    { label:'Save solution', cls:'btn-primary', onClick: () => {
        ts[field] = document.getElementById('solEditor').value;
        saveState(); closeModal(); toast('Solution saved locally.');
      } },
  ]);
}

/* ---------------------------------------------------------
   8. DAILY PLANNER
--------------------------------------------------------- */

function initPlanner(){
  document.getElementById('plannerDateLabel').textContent =
    'Schedule for ' + new Date().toLocaleDateString(undefined,{ weekday:'long', month:'long', day:'numeric' });
  document.querySelectorAll('.planner-add').forEach(form => {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const input = form.querySelector('input');
      const text = input.value.trim();
      if (!text) return;
      const slot = form.dataset.slot;
      const day = getPlannerDay();
      day[slot].push({ id: uid(), text, done:false });
      input.value = '';
      saveState(); renderPlanner(); renderDashboard();
    });
  });
  document.getElementById('clearPlannerBtn').addEventListener('click', () => {
    const day = getPlannerDay();
    ['morning','afternoon','evening'].forEach(slot => { day[slot] = day[slot].filter(t => !t.done); });
    saveState(); renderPlanner(); renderDashboard();
    toast('Cleared completed tasks.');
  });
  renderPlanner();
}

function getPlannerDay(){
  const key = todayStr();
  if (!state.planner[key]) state.planner[key] = { morning:[], afternoon:[], evening:[] };
  return state.planner[key];
}

function renderPlanner(){
  const day = getPlannerDay();
  ['morning','afternoon','evening'].forEach(slot => {
    const list = document.getElementById('list-' + slot);
    list.innerHTML = '';
    if (!day[slot].length){
      list.innerHTML = `<p class="empty-hint">No tasks yet.</p>`;
      return;
    }
    day[slot].forEach(task => {
      const row = document.createElement('div');
      row.className = 'planner-task' + (task.done ? ' done' : '');
      row.innerHTML = `<div class="topic-check ${task.done?'checked':''}"></div><span>${escapeHtml(task.text)}</span><button title="Delete">✕</button>`;
      row.querySelector('.topic-check').addEventListener('click', () => {
        task.done = !task.done;
        if (task.done){ addXp(2); touchActivity(); }
        saveState(); renderPlanner(); renderDashboard();
      });
      row.querySelector('button').addEventListener('click', () => {
        day[slot] = day[slot].filter(t => t.id !== task.id);
        saveState(); renderPlanner(); renderDashboard();
      });
      list.appendChild(row);
    });
  });
}

/* ---------------------------------------------------------
   9. POMODORO TIMER
--------------------------------------------------------- */

let pomoTimer = null;
let pomoRemaining = 25 * 60;
let pomoTotal = 25 * 60;
let pomoRunning = false;

function initPomodoro(){
  ensurePomoDay();
  document.querySelectorAll('#pomoPresets .seg-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#pomoPresets .seg-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      setPomoMinutes(Number(btn.dataset.mins));
    });
  });
  document.getElementById('pomoCustomBtn').addEventListener('click', () => {
    const v = clamp(Number(document.getElementById('pomoCustomInput').value) || 25, 1, 180);
    document.querySelectorAll('#pomoPresets .seg-btn').forEach(b => b.classList.remove('active'));
    setPomoMinutes(v);
  });
  document.getElementById('pomoStart').addEventListener('click', startPomo);
  document.getElementById('pomoPause').addEventListener('click', pausePomo);
  document.getElementById('pomoReset').addEventListener('click', resetPomo);
  setPomoMinutes(state.pomodoro.minutes || 25);
  renderPomoStats();
}

function ensurePomoDay(){
  const today = todayStr();
  if (state.pomodoro.lastDate !== today){
    state.pomodoro.lastDate = today;
    state.pomodoro.sessionsToday = 0;
    state.pomodoro.minutesToday = 0;
    saveState();
  }
}

function setPomoMinutes(mins){
  state.pomodoro.minutes = mins;
  pomoTotal = mins * 60;
  pomoRemaining = pomoTotal;
  saveState();
  updatePomoUI();
}

function updatePomoUI(){
  const m = Math.floor(pomoRemaining/60).toString().padStart(2,'0');
  const s = Math.floor(pomoRemaining%60).toString().padStart(2,'0');
  document.getElementById('pomoTime').textContent = `${m}:${s}`;
  document.getElementById('pomoMode').textContent = pomoRunning ? 'FOCUS SESSION — RUNNING' : 'FOCUS SESSION';
  const circumference = 2 * Math.PI * 96;
  const ring = document.getElementById('pomoRing');
  ring.style.strokeDasharray = circumference;
  const progressed = 1 - (pomoRemaining / pomoTotal);
  ring.style.strokeDashoffset = circumference * (1 - progressed);
}

function startPomo(){
  if (pomoRunning) return;
  pomoRunning = true;
  document.getElementById('pomoStart').disabled = true;
  document.getElementById('pomoPause').disabled = false;
  pomoTimer = setInterval(() => {
    pomoRemaining--;
    if (pomoRemaining <= 0){
      clearInterval(pomoTimer);
      pomoRunning = false;
      onPomoComplete();
      return;
    }
    updatePomoUI();
  }, 1000);
}
function pausePomo(){
  pomoRunning = false;
  clearInterval(pomoTimer);
  document.getElementById('pomoStart').disabled = false;
  document.getElementById('pomoPause').disabled = true;
  updatePomoUI();
}
function resetPomo(){
  clearInterval(pomoTimer);
  pomoRunning = false;
  pomoRemaining = pomoTotal;
  document.getElementById('pomoStart').disabled = false;
  document.getElementById('pomoPause').disabled = true;
  updatePomoUI();
}
function onPomoComplete(){
  ensurePomoDay();
  const mins = Math.round(pomoTotal/60);
  state.pomodoro.sessionsToday++;
  state.pomodoro.minutesToday += mins;
  state.pomodoro.history.push({ date: todayStr(), minutes: mins });
  addXp(10);
  touchActivity();
  saveState();
  document.getElementById('pomoStart').disabled = false;
  document.getElementById('pomoPause').disabled = true;
  pomoRemaining = pomoTotal;
  updatePomoUI();
  renderPomoStats();
  toast('Focus session complete. +10 XP', 'success');
  playChime();
}
function renderPomoStats(){
  document.getElementById('pomoSessionsToday').textContent = state.pomodoro.sessionsToday || 0;
  document.getElementById('pomoMinutesToday').textContent = state.pomodoro.minutesToday || 0;
}
function playChime(){
  try{
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    [880, 1108].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine'; osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.001, ctx.currentTime + i*0.18);
      gain.gain.exponentialRampToValueAtTime(0.18, ctx.currentTime + i*0.18 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i*0.18 + 0.35);
      osc.connect(gain); gain.connect(ctx.destination);
      osc.start(ctx.currentTime + i*0.18);
      osc.stop(ctx.currentTime + i*0.18 + 0.4);
    });
  }catch(e){ /* audio not available */ }
}

/* ---------------------------------------------------------
   10. NOTES
--------------------------------------------------------- */

function initNotes(){
  document.getElementById('addNoteBtn').addEventListener('click', () => openNoteEditor(null));
  renderNotes();
}
function renderNotes(){
  const grid = document.getElementById('notesGrid');
  grid.innerHTML = '';
  state.notes.slice().sort((a,b) => b.updated - a.updated).forEach(note => {
    const card = document.createElement('div');
    card.className = 'note-card';
    card.innerHTML = `<h4>${escapeHtml(note.title || 'Untitled')}</h4><p>${escapeHtml(note.content||'')}</p><time>${new Date(note.updated).toLocaleDateString()}</time>`;
    card.addEventListener('click', () => openNoteEditor(note.id));
    grid.appendChild(card);
  });
  const add = document.createElement('div');
  add.className = 'note-new-card';
  add.textContent = '+ Add a note';
  add.addEventListener('click', () => openNoteEditor(null));
  grid.appendChild(add);
}
function openNoteEditor(id){
  const note = id ? state.notes.find(n => n.id === id) : { id: uid(), title:'', content:'', updated:Date.now() };
  openModal(id ? 'Edit note' : 'New note', `
    <input id="noteTitle" type="text" placeholder="Note title" value="${escapeHtml(note.title||'')}">
    <textarea id="noteContent" placeholder="Write your note…" style="min-height:200px">${escapeHtml(note.content||'')}</textarea>
  `, [
    ...(id ? [{ label:'Delete', cls:'btn-danger', onClick: () => { state.notes = state.notes.filter(n => n.id!==id); saveState(); closeModal(); renderNotes(); } }] : []),
    { label:'Cancel', cls:'btn-ghost', onClick: closeModal },
    { label:'Save', cls:'btn-primary', onClick: () => {
        note.title = document.getElementById('noteTitle').value.trim();
        note.content = document.getElementById('noteContent').value.trim();
        note.updated = Date.now();
        if (!id) state.notes.push(note);
        saveState(); closeModal(); renderNotes(); touchActivity();
      } },
  ]);
}

/* ---------------------------------------------------------
   11. MOCK TESTS
--------------------------------------------------------- */

function initMocks(){ renderMocks(); }
function renderMocks(){
  const grid = document.getElementById('mockGrid');
  grid.innerHTML = '';
  state.mocks.forEach((mock, i) => {
    const pct = mock.score !== '' && mock.total ? Math.round((Number(mock.score)/Number(mock.total))*100) : null;
    const card = document.createElement('div');
    card.className = 'mock-card';
    card.innerHTML = `
      <div class="mock-card-head"><h4>${mock.name}</h4><span class="badge ${pct===null?'':pct>=60?'badge-easy':pct>=40?'badge-medium':'badge-hard'}">${pct===null?'—':pct+'%'}</span></div>
      <div class="mock-score">${mock.score || 0}<small> / ${mock.total || '—'}</small></div>
      <div class="mock-fields">
        <input type="number" placeholder="Score" data-f="score" value="${mock.score}">
        <input type="number" placeholder="Total" data-f="total" value="${mock.total}">
        <input type="date" data-f="date" value="${mock.date}">
        <input type="text" placeholder="Notes" data-f="notes" value="${escapeHtml(mock.notes||'')}">
      </div>
    `;
    card.querySelectorAll('[data-f]').forEach(inp => {
      inp.addEventListener('change', e => {
        mock[e.target.dataset.f] = e.target.value;
        if (e.target.dataset.f === 'score') { addXp(20); touchActivity(); }
        saveState(); renderMocks();
      });
    });
    grid.appendChild(card);
  });
  const scores = state.mocks.map(m => m.score && m.total ? Math.round((Number(m.score)/Number(m.total))*100) : 0);
  drawLineChart('mockChart', state.mocks.map(m=>m.name.replace('Mock ','M')), scores, cssVar('--accent'));
}

/* ---------------------------------------------------------
   12. GENERIC CHECKLIST GROUPS (interview / aptitude / subjects)
--------------------------------------------------------- */

function renderChecklistGroup(containerId, srcMeta, stateKey, options={}){
  const container = document.getElementById(containerId);
  container.innerHTML = '';
  Object.keys(srcMeta).forEach(key => {
    const meta = srcMeta[key];
    const items = state[stateKey][key];
    const done = items.filter(i => i.done).length;
    const card = document.createElement('div');
    card.className = options.subject ? 'subject-card' : 'checklist-card';
    if (options.subject){
      card.innerHTML = `
        <div class="subject-card-head"><div class="subject-ic">${meta.short}</div><h3>${meta.label}</h3></div>
        <div class="subject-bar"><div class="subject-bar-fill" style="width:${Math.round((done/items.length)*100)}%"></div></div>
        <div class="checklist-progress" style="margin-bottom:10px">${done}/${items.length} sub-topics covered</div>
        <div class="checklist-items"></div>
      `;
    } else {
      card.innerHTML = `
        <div class="checklist-card-head"><h3>${meta.label}</h3><span class="checklist-progress">${done}/${items.length}</span></div>
        <div class="checklist-items"></div>
        <form class="checklist-add"><input type="text" placeholder="Add item…" required><button type="submit" class="btn btn-ghost btn-sm">+</button></form>
      `;
    }
    const itemsWrap = card.querySelector('.checklist-items');
    items.forEach((it, idx) => {
      const row = document.createElement('div');
      row.className = 'check-item' + (it.done ? ' done' : '');
      row.innerHTML = `<div class="topic-check ${it.done?'checked':''}"></div><span>${escapeHtml(it.text)}</span>`;
      row.querySelector('.topic-check').addEventListener('click', () => {
        it.done = !it.done;
        if (it.done){ addXp(5); touchActivity(); }
        saveState();
        renderChecklistGroup(containerId, srcMeta, stateKey, options);
        if (stateKey !== 'subjects') renderDashboard();
      });
      itemsWrap.appendChild(row);
    });
    const form = card.querySelector('.checklist-add');
    if (form){
      form.addEventListener('submit', e => {
        e.preventDefault();
        const input = form.querySelector('input');
        const text = input.value.trim();
        if (!text) return;
        items.push({ text, done:false });
        saveState();
        renderChecklistGroup(containerId, srcMeta, stateKey, options);
      });
    }
    container.appendChild(card);
  });
}

function initInterview(){ renderChecklistGroup('interviewCols', INTERVIEW, 'interview'); }
function initAptitude(){ renderChecklistGroup('aptitudeCols', APTITUDE, 'aptitude'); }
function initSubjects(){ renderChecklistGroup('subjectGrid', SUBJECTS, 'subjects', { subject:true }); }

/* ---------------------------------------------------------
   13. ANALYTICS
--------------------------------------------------------- */

function renderAnalytics(){
  const weekly = completedCountsByDay(7);
  drawBarChart('anaWeekly', weekly.map((_,i)=>dayLabel(i-6)), weekly, cssVar('--accent'));

  const monthlyCounts = completedCountsByDay(28);
  const weeklyBuckets = [0,0,0,0];
  monthlyCounts.forEach((c,i) => weeklyBuckets[Math.floor(i/7)] += c);
  drawBarChart('anaMonthly', ['Wk -3','Wk -2','Wk -1','This wk'], weeklyBuckets, cssVar('--accent-2'));

  const completionPct = ROADMAP.map(wk => {
    const refs = TOPIC_REFS.filter(t => t.week === wk.id);
    const done = refs.filter(t => topicState(t.tid).status === 'completed').length;
    return Math.round((done/refs.length)*100);
  });
  drawBarChart('anaCompletion', ROADMAP.map(w=>'W'+w.id), completionPct, cssVar('--success'));

  const timePerWeek = ROADMAP.map(wk => {
    const refs = TOPIC_REFS.filter(t => t.week === wk.id);
    return refs.reduce((s,t) => s + (Number(topicState(t.tid).timeSpent)||0), 0);
  });
  drawBarChart('anaTime', ROADMAP.map(w=>'W'+w.id), timePerWeek, cssVar('--warning'));
}

/* ---------------------------------------------------------
   14. ACHIEVEMENTS
--------------------------------------------------------- */

function checkAchievements(){
  const completed = TOPIC_REFS.filter(t => topicState(t.tid).status === 'completed').length;
  ACHIEVEMENTS.forEach(a => {
    if (completed >= a.need && !state.achievementsUnlocked.includes(a.id)){
      state.achievementsUnlocked.push(a.id);
      saveState();
      toast(`Achievement unlocked: ${a.medal} ${a.label}!`, 'success');
      fireConfetti();
    }
  });
}

function renderAchievements(){
  const grid = document.getElementById('achvGrid');
  grid.innerHTML = '';
  const completed = TOPIC_REFS.filter(t => topicState(t.tid).status === 'completed').length;
  ACHIEVEMENTS.forEach(a => {
    const unlocked = state.achievementsUnlocked.includes(a.id) || completed >= a.need;
    const card = document.createElement('div');
    card.className = 'achv-card' + (unlocked ? ' unlocked' : '');
    card.innerHTML = `<div class="achv-medal">${a.medal}</div><h4>${a.label}</h4><p>${a.desc}</p>`;
    grid.appendChild(card);
  });
  const sg = document.getElementById('streakGrid');
  sg.innerHTML = `
    <div class="streak-box"><div class="sv">${state.streak.current}</div><div class="sl">Current daily streak</div></div>
    <div class="streak-box"><div class="sv">${state.streak.longest}</div><div class="sl">Longest streak</div></div>
    <div class="streak-box"><div class="sv">${Object.keys(state.planner).length}</div><div class="sl">Active planner days</div></div>
  `;
}

/* ---------------------------------------------------------
   15. MODAL SYSTEM
--------------------------------------------------------- */

function openModal(title, bodyHtml, buttons){
  const overlay = document.getElementById('modalOverlay');
  const box = document.getElementById('modalBox');
  box.innerHTML = `
    <div class="modal-head"><h3>${title}</h3><button class="modal-close">✕</button></div>
    <div class="modal-body">${bodyHtml}</div>
    <div class="modal-foot"></div>
  `;
  box.querySelector('.modal-close').addEventListener('click', closeModal);
  const foot = box.querySelector('.modal-foot');
  (buttons||[]).forEach(b => {
    const btn = document.createElement('button');
    btn.className = 'btn ' + (b.cls || 'btn-ghost');
    btn.textContent = b.label;
    btn.addEventListener('click', b.onClick);
    foot.appendChild(btn);
  });
  overlay.classList.add('show');
}
function closeModal(){
  document.getElementById('modalOverlay').classList.remove('show');
}
document.getElementById('modalOverlay').addEventListener('click', e => {
  if (e.target.id === 'modalOverlay') closeModal();
});

/* ---------------------------------------------------------
   16. CONFETTI
--------------------------------------------------------- */

function fireConfetti(){
  const layer = document.getElementById('confettiLayer');
  const colors = ['#5B6EF5','#9B8CFB','#34D399','#FBBF24','#38BDF8'];
  for (let i=0;i<70;i++){
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';
    const size = 5 + Math.random()*6;
    piece.style.left = Math.random()*100 + 'vw';
    piece.style.width = size + 'px';
    piece.style.height = (size*0.4) + 'px';
    piece.style.background = colors[Math.floor(Math.random()*colors.length)];
    piece.style.animationDuration = (2.2 + Math.random()*1.6) + 's';
    piece.style.animationDelay = (Math.random()*0.4) + 's';
    layer.appendChild(piece);
    setTimeout(() => piece.remove(), 4200);
  }
}

/* ---------------------------------------------------------
   17. GLOBAL SEARCH
--------------------------------------------------------- */

function initGlobalSearch(){
  document.getElementById('globalSearch').addEventListener('input', e => {
    const q = e.target.value.trim();
    if (!q) return;
  });
  document.getElementById('globalSearch').addEventListener('keydown', e => {
    if (e.key === 'Enter'){
      const q = e.target.value.trim();
      if (!q) return;
      goToPage('roadmap');
      document.getElementById('roadmapSearch').value = q;
      roadmapQuery = q.toLowerCase();
      renderRoadmap();
      e.target.blur();
    }
  });
}

/* ---------------------------------------------------------
   18. EXPORT / IMPORT
--------------------------------------------------------- */

function initExportImport(){
  document.getElementById('exportBtn').addEventListener('click', exportProgress);
  document.getElementById('importFile').addEventListener('change', importProgress);
}

function exportProgress(){
  openModal('Export progress', `
    <p style="font-size:13px;color:var(--text-dim)">Choose a format. JSON keeps full data for re-import later. Print/PDF gives a shareable summary you can save from your browser's print dialog.</p>
  `, [
    { label:'Download JSON', cls:'btn-ghost', onClick: () => { downloadJson(); closeModal(); } },
    { label:'Print / Save as PDF', cls:'btn-primary', onClick: () => { closeModal(); printSummary(); } },
  ]);
}
function downloadJson(){
  const blob = new Blob([JSON.stringify(state, null, 2)], { type:'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'tcs-nqt-progress.json';
  document.body.appendChild(a); a.click(); a.remove();
  URL.revokeObjectURL(url);
  toast('Progress exported as JSON.');
}
function printSummary(){
  const stats = computeStats();
  const w = window.open('', '_blank');
  const rows = ROADMAP.map(wk => {
    const refs = TOPIC_REFS.filter(t => t.week === wk.id);
    const done = refs.filter(t => topicState(t.tid).status === 'completed').length;
    return `<tr><td>Week ${wk.id} — ${wk.title}</td><td>${done}/${refs.length}</td><td>${Math.round((done/refs.length)*100)}%</td></tr>`;
  }).join('');
  w.document.write(`
    <html><head><title>TCS NQT Progress Summary</title>
    <style>body{font-family:Arial,sans-serif;padding:32px;color:#111} h1{margin-bottom:0} table{width:100%;border-collapse:collapse;margin-top:20px} td,th{border:1px solid #ccc;padding:8px 10px;text-align:left;font-size:13px} .stats{display:flex;gap:24px;margin-top:16px} .stat{font-size:13px}</style>
    </head><body>
    <h1>TCS NQT Master Tracker</h1>
    <p>Progress summary — generated ${new Date().toLocaleString()}</p>
    <div class="stats">
      <div class="stat"><b>${stats.completed}</b> / ${TOTAL_TOPICS} topics completed</div>
      <div class="stat"><b>${stats.pct}%</b> overall completion</div>
      <div class="stat"><b>${state.streak.current}</b> day streak</div>
      <div class="stat"><b>${state.xp}</b> XP</div>
    </div>
    <table><tr><th>Week</th><th>Completed</th><th>Progress</th></tr>${rows}</table>
    </body></html>
  `);
  w.document.close();
  setTimeout(() => w.print(), 400);
}
function importProgress(e){
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try{
      const parsed = JSON.parse(reader.result);
      state = Object.assign(defaultState(), parsed);
      saveState();
      toast('Progress imported successfully.', 'success');
      renderEverything();
    }catch(err){
      toast('Could not import file — invalid JSON.');
    }
  };
  reader.readAsText(file);
  e.target.value = '';
}

/* ---------------------------------------------------------
   19. KEYBOARD SHORTCUTS
--------------------------------------------------------- */

const SHORTCUTS = [
  { keys:'1 – 0', desc:'Jump to Dashboard … Analytics' },
  { keys:'/', desc:'Focus global search' },
  { keys:'T', desc:'Toggle theme' },
  { keys:'N', desc:'New note' },
  { keys:'Esc', desc:'Close modal' },
];
function initShortcuts(){
  document.getElementById('shortcutsBtn').addEventListener('click', showShortcutsModal);
  document.addEventListener('keydown', e => {
    const tag = (e.target.tagName||'').toLowerCase();
    const typing = tag === 'input' || tag === 'textarea' || tag === 'select';
    if (e.key === 'Escape'){ closeModal(); return; }
    if (typing) return;
    if (e.key === '/'){ e.preventDefault(); document.getElementById('globalSearch').focus(); return; }
    if (e.key.toLowerCase() === 't'){ document.getElementById('themeToggle').click(); return; }
    if (e.key.toLowerCase() === 'n'){ goToPage('notes'); openNoteEditor(null); return; }
    const map = { '1':'dashboard','2':'roadmap','3':'planner','4':'pomodoro','5':'notes','6':'mocks','7':'interview','8':'aptitude','9':'subjects','0':'analytics' };
    if (map[e.key]) goToPage(map[e.key]);
  });
}
function showShortcutsModal(){
  const rows = SHORTCUTS.map(s => `<div class="kbd-row"><span>${s.desc}</span><span class="kbd">${s.keys}</span></div>`).join('');
  openModal('Keyboard shortcuts', rows, [{ label:'Got it', cls:'btn-primary', onClick: closeModal }]);
}

/* ---------------------------------------------------------
   20. INIT
--------------------------------------------------------- */

function renderEverything(){
  renderDashboard();
  renderRoadmap();
  renderPlanner();
  renderPomoStats();
  renderNotes();
  renderMocks();
  initInterview();
  initAptitude();
  initSubjects();
  renderAchievements();
  document.documentElement.setAttribute('data-theme', state.theme);
  document.getElementById('sidebar').classList.toggle('collapsed', state.sidebarCollapsed);
}

function init(){
  initNav();
  initTheme();
  initRoadmap();
  initPlanner();
  initPomodoro();
  initNotes();
  initMocks();
  initInterview();
  initAptitude();
  initSubjects();
  initGlobalSearch();
  initExportImport();
  initShortcuts();
  initServiceWorker();
  initInstallPrompt();
  initOfflineDetection();
  initDeepLinkHash();

  touchActivity();
  renderDashboard();
  renderRoadmap();
  renderAchievements();
  checkAchievements();

  setTimeout(() => {
    document.getElementById('bootScreen').classList.add('hide');
  }, 650);
}

document.addEventListener('DOMContentLoaded', init);

/* ---------------------------------------------------------
   21. PWA — SERVICE WORKER, INSTALL PROMPT, OFFLINE STATE
--------------------------------------------------------- */

function initServiceWorker(){
  if (!('serviceWorker' in navigator)) return;
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./service-worker.js').catch(err => {
      console.warn('Service worker registration failed:', err);
    });
  });
}

let deferredInstallPrompt = null;

function initInstallPrompt(){
  const installBtn = document.getElementById('installBtn');

  window.addEventListener('beforeinstallprompt', e => {
    e.preventDefault();
    deferredInstallPrompt = e;
    installBtn.hidden = false;
  });

  installBtn.addEventListener('click', async () => {
    if (!deferredInstallPrompt) return;
    installBtn.hidden = true;
    deferredInstallPrompt.prompt();
    const choice = await deferredInstallPrompt.userChoice;
    if (choice.outcome === 'accepted'){
      toast('Installing TCS NQT Tracker…', 'success');
    }
    deferredInstallPrompt = null;
  });

  window.addEventListener('appinstalled', () => {
    installBtn.hidden = true;
    deferredInstallPrompt = null;
    toast('App installed. Find it on your home screen!', 'success');
  });

  // iOS Safari has no beforeinstallprompt — show manual instructions instead.
  const isIos = /iphone|ipad|ipod/i.test(navigator.userAgent);
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
  const dismissed = localStorage.getItem('nqtIosInstallDismissed');
  if (isIos && !isStandalone && !dismissed){
    setTimeout(() => {
      document.getElementById('iosInstallSheet').hidden = false;
    }, 2500);
  }
  document.getElementById('iosInstallClose').addEventListener('click', () => {
    document.getElementById('iosInstallSheet').hidden = true;
    localStorage.setItem('nqtIosInstallDismissed', '1');
  });
  document.getElementById('iosInstallSheet').addEventListener('click', e => {
    if (e.target.id === 'iosInstallSheet'){
      e.currentTarget.hidden = true;
      localStorage.setItem('nqtIosInstallDismissed', '1');
    }
  });
}

function initOfflineDetection(){
  const pill = document.getElementById('offlinePill');
  function update(){
    const offline = !navigator.onLine;
    pill.hidden = !offline;
    pill.innerHTML = offline ? '<span class="offline-dot"></span>Offline — changes save locally' : '';
  }
  window.addEventListener('online', update);
  window.addEventListener('offline', update);
  update();
}

function initDeepLinkHash(){
  const hash = (location.hash || '').replace('#','');
  if (pages.includes(hash)) goToPage(hash);
  window.addEventListener('hashchange', () => {
    const h = (location.hash || '').replace('#','');
    if (pages.includes(h)) goToPage(h);
  });
}
