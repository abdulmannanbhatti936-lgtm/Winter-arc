<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Winter Arc</title>
<link rel="stylesheet" href="style.css">
</head>
<body>

  <!-- ===== Top nav ===== -->
  <nav class="navbar">
    <div class="nav-logo">❄ Winter Arc</div>
    <div class="nav-date" id="navDate"></div>
  </nav>

  <!-- ===== Hero banner ===== -->
  <header class="hero-banner">
    <div class="hero-content">
      <p class="hero-eyebrow">120-day self-improvement arc</p>
      <h1>Day <span id="dayNum">0</span> <span class="dim">of 120</span></h1>
      <p class="hero-range">Sept 30, 2026 → Feb 10, 2027</p>
    </div>
    <div class="ring-wrap">
      <svg class="ring" viewBox="0 0 120 120">
        <circle class="ring-bg" cx="60" cy="60" r="52"></circle>
        <circle class="ring-fill" id="ringFill" cx="60" cy="60" r="52"></circle>
      </svg>
      <div class="ring-center">
        <span id="pctDone">0%</span>
        <small id="daysLeft">– left</small>
      </div>
    </div>
  </header>

  <!-- ===== Dashboard grid ===== -->
  <main class="dashboard">

    <!-- Left: checkpoints -->
    <section class="col-main">
      <div class="panel">
        <div class="panel-head">
          <h2>Today's checkpoints</h2>
          <span class="panel-sub" id="dateDisplay"></span>
        </div>
        <div id="checkpointList" class="checkpoint-list"></div>

        <form class="add-form" id="addForm">
          <input type="text" id="newCategoryInput" placeholder="Add a checkpoint…" autocomplete="off">
          <input type="text" id="newDurationInput" placeholder="Time slot" autocomplete="off" class="duration-input">
          <button type="submit">+ Add</button>
        </form>
      </div>
    </section>

    <!-- Right: stats + calendar -->
    <aside class="col-side">
      <div class="panel stack">
        <div class="mini-stat">
          <span class="mini-num" id="streakNum">0</span>
          <span class="mini-label">day streak</span>
        </div>
        <div class="mini-stat">
          <span class="mini-num" id="todayNum">0/0</span>
          <span class="mini-label">today</span>
        </div>
        <div class="mini-stat">
          <span class="mini-num" id="perfectNum">0</span>
          <span class="mini-label">full-clear days</span>
        </div>
      </div>

      <div class="panel">
        <div class="panel-head"><h2>Last 4 weeks</h2></div>
        <div class="cal-weekdays">
          <span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span><span>S</span>
        </div>
        <div class="cal-grid" id="calGrid"></div>
      </div>
    </aside>

  </main>

  <script src="script.js"></script>
</body>
</html>
