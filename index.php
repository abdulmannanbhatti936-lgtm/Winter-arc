<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Winter Arc</title>
<link rel="stylesheet" href="style.css">
</head>
<body>
  <div class="wrap">

    <!-- ===== Hero: overall 120-day progress ===== -->
    <header class="hero">
      <div class="hero-top">
        <div>
          <h1>Winter Arc</h1>
          <p class="subtitle">Sept 30 → Feb 10 · 120 days</p>
        </div>
        <div class="day-badge">
          <span id="dayNum">–</span>
          <small>day</small>
        </div>
      </div>
      <div class="bar-track"><div class="bar-fill" id="barFill"></div></div>
      <div class="hero-meta">
        <span id="daysLeft">– days left</span>
        <span id="pctDone">0%</span>
      </div>
    </header>

    <!-- ===== Quick stats: streak, today's count, perfect days ===== -->
    <section class="stats">
      <div class="stat-card">
        <div class="stat-num" id="streakNum">0</div>
        <div class="stat-label">day streak</div>
      </div>
      <div class="stat-card">
        <div class="stat-num" id="todayNum">0/0</div>
        <div class="stat-label">today</div>
      </div>
      <div class="stat-card">
        <div class="stat-num" id="perfectNum">0</div>
        <div class="stat-label">full-clear days</div>
      </div>
    </section>

    <!-- ===== 14-day heat strip ===== -->
    <section>
      <div class="section-head">
        <h2>Last 14 days</h2>
      </div>
      <div class="heat-strip" id="heatStrip"></div>
    </section>

    <!-- ===== Today's checkpoints ===== -->
    <section>
      <div class="section-head">
        <h2>Today's checkpoints</h2>
        <span class="section-sub" id="dateDisplay"></span>
      </div>
      <div id="checkpointList" class="checkpoint-list">
        <!-- filled by script.js -->
      </div>
    </section>

    <!-- ===== Add new checkpoint ===== -->
    <section class="add-section">
      <form class="add-form" id="addForm">
        <input type="text" id="newCategoryInput" placeholder="Add a checkpoint…" autocomplete="off">
        <input type="text" id="newDurationInput" placeholder="Time slot (e.g. 5:30–6:00 AM)" autocomplete="off" class="duration-input">
        <button type="submit">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>
          Add
        </button>
      </form>
    </section>

  </div>

  <!-- ===== Reusable SVG icon templates (referenced by script.js) ===== -->
  <template id="icon-check">
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
  </template>
  <template id="icon-close">
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
  </template>

  <script src="script.js"></script>
</body>
</html>