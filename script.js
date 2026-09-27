/**
 * Winter Arc — daily checkpoint tracker
 * Talks to PHP/MySQL backend under /api
 */

let currentData = { categories: [], logs: {} };

const ARC_START = new Date('2026-09-30T00:00:00');
const ARC_END = new Date('2027-02-10T00:00:00');

/** Returns today's date as YYYY-MM-DD */
function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

/** Clones an <svg> from a <template> so it can be reused in multiple items */
function cloneIcon(templateId) {
  return document.getElementById(templateId).content.cloneNode(true);
}

// ---------------------------------------------------------
// API calls
// ---------------------------------------------------------

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

// ---------------------------------------------------------
// Derived stats
// ---------------------------------------------------------

/** Counts consecutive days (ending today) with at least one checkpoint done */
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

/** Counts days where every single checkpoint was completed */
function computePerfectDays() {
  const total = currentData.categories.length;
  if (total === 0) return 0;
  return Object.values(currentData.logs).filter(day => {
    return Object.values(day).filter(v => v).length === total;
  }).length;
}

// ---------------------------------------------------------
// Rendering
// ---------------------------------------------------------

function renderHero() {
  const now = new Date();
  const totalDays = Math.round((ARC_END - ARC_START) / 86400000);
  const elapsed = Math.max(0, Math.round((now - ARC_START) / 86400000));
  const remaining = Math.max(0, Math.round((ARC_END - now) / 86400000));
  const pct = Math.min(100, Math.max(0, (elapsed / totalDays) * 100));

  document.getElementById('dayNum').textContent = Math.min(elapsed, totalDays);
  document.getElementById('daysLeft').textContent = `${remaining} days left`;
  document.getElementById('pctDone').textContent = `${Math.round(pct)}%`;
  document.getElementById('barFill').style.width = `${pct}%`;
}

function renderStats() {
  const todayLog = currentData.logs[todayStr()] || {};
  const doneToday = Object.values(todayLog).filter(v => v).length;

  document.getElementById('streakNum').textContent = computeStreak();
  document.getElementById('todayNum').textContent = `${doneToday}/${currentData.categories.length}`;
  document.getElementById('perfectNum').textContent = computePerfectDays();
}

function renderHeatStrip() {
  const strip = document.getElementById('heatStrip');
  strip.innerHTML = '';
  const totalCategories = currentData.categories.length || 1;

  for (let i = 13; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    const day = currentData.logs[key] || {};
    const doneCount = Object.values(day).filter(v => v).length;
    const ratio = doneCount / totalCategories;

    const cell = document.createElement('div');
    cell.className = 'heat-cell';
    cell.title = `${key}: ${doneCount}/${totalCategories}`;

    let colorVar = '--green-0';
    if (ratio === 1) colorVar = '--green-4';
    else if (ratio > 0.66) colorVar = '--green-3';
    else if (ratio > 0.33) colorVar = '--green-2';
    else if (ratio > 0) colorVar = '--green-1';
    cell.style.background = `var(${colorVar})`;

    strip.appendChild(cell);
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

  currentData.categories.forEach((cat, index) => {
    const isDone = !!todayLog[cat.id];

    const item = document.createElement('div');
    item.className = 'checkpoint-item' + (isDone ? ' done' : '');
    item.style.animationDelay = `${index * 0.03}s`;

    const checkbox = document.createElement('div');
    checkbox.className = 'checkbox';
    if (isDone) checkbox.appendChild(cloneIcon('icon-check'));

    const name = document.createElement('div');
    name.className = 'name';
    name.textContent = cat.name;

    const deleteBtn = document.createElement('div');
    deleteBtn.className = 'delete-btn';
    deleteBtn.appendChild(cloneIcon('icon-close'));

    item.appendChild(checkbox);
    item.appendChild(name);

    if (cat.duration) {
      const badge = document.createElement('div');
      badge.className = 'time-badge';
      badge.textContent = cat.duration;
      item.appendChild(badge);
    }

    item.appendChild(deleteBtn);

    checkbox.onclick = (e) => { e.stopPropagation(); toggleCheckpoint(cat.id); };
    name.onclick = () => toggleCheckpoint(cat.id);
    deleteBtn.onclick = (e) => { e.stopPropagation(); deleteCategory(cat.id); };

    list.appendChild(item);
  });
}

function render() {
  renderHero();
  renderStats();
  renderHeatStrip();
  renderCheckpoints();
}

// ---------------------------------------------------------
// Event listeners
// ---------------------------------------------------------

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

// Initial load
fetchData();