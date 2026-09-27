let currentData = { categories: [], logs: {} };

const ARC_START = new Date('2026-09-30T00:00:00');
const ARC_END = new Date('2027-02-10T00:00:00');
const RING_CIRCUMFERENCE = 326.7; // 2 * π * 52

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

async function fetchData() {
  const res = await fetch('api/get_data.php');
  currentData = await res.json();
  render();
}

async function toggleCheckpoint(id) {
  await fetch('api/toggle.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ category_id: id, date: todayStr() })
  });
  fetchData();
}

async function addCategory(name, duration) {
  await fetch('api/add_category.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, duration })
  });
  fetchData();
}

async function deleteCategory(id) {
  await fetch('api/delete_category.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id })
  });
  fetchData();
}

function computeStreak() {
  let streak = 0;
  let d = new Date();
  while (true) {
    const key = d.toISOString().slice(0, 10);
    const day = currentData.logs[key];
    if (day && Object.values(day).some(v => v)) {
      streak++;
      d.setDate(d.getDate() - 1);
    } else break;
  }
  return streak;
}

function computePerfectDays() {
  const total = currentData.categories.length;
  if (total === 0) return 0;
  return Object.values(currentData.logs).filter(day =>
    Object.values(day).filter(v => v).length === total
  ).length;
}

function renderNav() {
  document.getElementById('navDate').textContent =
    new Date().toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
}

function renderHero() {
  const now = new Date();
  const totalDays = Math.round((ARC_END - ARC_START) / 86400000);
  const elapsed = Math.max(0, Math.round((now - ARC_START) / 86400000));
  const remaining = Math.max(0, Math.round((ARC_END - now) / 86400000));
  const pct = Math.min(100, Math.max(0, (elapsed / totalDays) * 100));

  document.getElementById('dayNum').textContent = Math.min(elapsed, totalDays);
  document.getElementById('daysLeft').textContent = `${remaining} left`;
  document.getElementById('pctDone').textContent = `${Math.round(pct)}%`;
  document.getElementById('ringFill').style.strokeDashoffset = RING_CIRCUMFERENCE * (1 - pct / 100);
}

function renderStats() {
  const todayLog = currentData.logs[todayStr()] || {};
  const doneToday = Object.values(todayLog).filter(v => v).length;
  document.getElementById('streakNum').textContent = computeStreak();
  document.getElementById('todayNum').textContent = `${doneToday}/${currentData.categories.length}`;
  document.getElementById('perfectNum').textContent = computePerfectDays();
}

/** Renders a real Mon-Sun calendar grid (last 4 weeks) with date numbers, today highlighted */
function renderCalendar() {
  const grid = document.getElementById('calGrid');
  grid.innerHTML = '';
  const total = currentData.categories.length || 1;

  const today = new Date();
  const todayKey = todayStr();
  const dayOfWeek = (today.getDay() + 6) % 7; // Mon=0 ... Sun=6
  const start = new Date(today);
  start.setDate(today.getDate() - dayOfWeek - 21); // 3 full weeks before this week's Monday

  for (let i = 0; i < 28; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    const key = d.toISOString().slice(0, 10);
    const day = currentData.logs[key] || {};
    const doneCount = Object.values(day).filter(v => v).length;
    const ratio = doneCount / total;

    const cell = document.createElement('div');
    cell.className = 'cal-cell' + (key === todayKey ? ' today' : '');
    cell.title = `${key}: ${doneCount}/${total}`;

    let colorVar = '--g0';
    if (d > today) colorVar = '--g0';
    else if (ratio === 1) colorVar = '--g4';
    else if (ratio > 0.66) colorVar = '--g3';
    else if (ratio > 0.33) colorVar = '--g2';
    else if (ratio > 0) colorVar = '--g1';
    cell.style.background = `var(${colorVar})`;

    const numSpan = document.createElement('span');
    numSpan.textContent = d.getDate();
    cell.appendChild(numSpan);

    grid.appendChild(cell);
  }
}

function renderCheckpoints() {
  document.getElementById('dateDisplay').textContent = todayStr();
  const todayLog = currentData.logs[todayStr()] || {};
  const list = document.getElementById('checkpointList');
  list.innerHTML = '';

  if (currentData.categories.length === 0) {
    list.innerHTML = '<div class="empty-state">No checkpoints yet — add your first one below.</div>';
    return;
  }

  currentData.categories.forEach((cat) => {
    const isDone = !!todayLog[cat.id];
    const item = document.createElement('div');
    item.className = 'checkpoint-item' + (isDone ? ' done' : '');
    item.innerHTML = `
      <div class="checkbox">${isDone ? '✓' : ''}</div>
      <div class="name">${cat.name}</div>
      ${cat.duration ? `<div class="time-badge">${cat.duration}</div>` : ''}
      <div class="delete-btn">✕</div>
    `;
    item.querySelector('.checkbox').onclick = (e) => { e.stopPropagation(); toggleCheckpoint(cat.id); };
    item.querySelector('.name').onclick = () => toggleCheckpoint(cat.id);
    item.querySelector('.delete-btn').onclick = (e) => { e.stopPropagation(); deleteCategory(cat.id); };
    list.appendChild(item);
  });
}

function render() {
  renderNav();
  renderHero();
  renderStats();
  renderCalendar();
  renderCheckpoints();
}

document.getElementById('addForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const nameInput = document.getElementById('newCategoryInput');
  const durationInput = document.getElementById('newDurationInput');
  const name = nameInput.value.trim();
  const duration = durationInput.value.trim();
  if (!name) return;
  nameInput.value = '';
  durationInput.value = '';
  addCategory(name, duration);
});

fetchData();

// Auto-refresh at midnight so the date/calendar updates without a manual reload
let lastKnownDate = todayStr();
setInterval(() => {
  const nowDate = todayStr();
  if (nowDate !== lastKnownDate) {
    lastKnownDate = nowDate;
    fetchData();
    renderNav();
  }
}, 60000); // check every minute
