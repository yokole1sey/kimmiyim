// WHOAMI — Ana uygulama mantığı
(function() {

  // ─── Durum ────────────────────────────────────────────────────────────────
  var activeScreen    = 'home';
  var currentBirth    = null;
  var pastStats       = null;
  var lifeExpectancy  = null;   // kullanıcı seçene kadar null
  var futureReady     = false;  // future tab hiç gösterildi mi

  // ─── Mod sistemi ──────────────────────────────────────────────────────────
  var currentMode = 1;  // 0 = Gezegen Yaşı, 1 = Doğum Tarihi, 2 = Ekran Süresi
  var MODES = [
    { subtitle: 'Doğum tarihi ve gezegen seçin',                   btnLabel: 'HESAPLA'    },
    { subtitle: 'Doğum tarihinizi seçin',                          btnLabel: 'KİM MİYİM?' },
    { subtitle: 'Günde kaç saat ve kaç yıldır kullanıyorsun?',     btnLabel: 'HESAPLA'    }
  ];
  var MODE_COUNT = 3;
  var currentScreenTimeStats = null;
  var currentPlanetStats     = null;

  // ─── Ekran referansları ───────────────────────────────────────────────────
  var screenHome    = document.getElementById('screen-home');
  var screenLoading = document.getElementById('screen-loading');
  var screenResults = document.getElementById('screen-results');

  function showScreen(name) {
    var map = { home: screenHome, loading: screenLoading, results: screenResults };
    var cur  = map[activeScreen];
    var next = map[name];
    cur.classList.add('exiting');
    setTimeout(function() { cur.classList.remove('active', 'exiting'); }, 380);
    setTimeout(function() { next.classList.add('active'); }, 50);
    activeScreen = name;
  }

  // ─── Apple Drum Picker ────────────────────────────────────────────────────
  var dayDrum   = document.getElementById('col-day-drum');
  var monthDrum = document.getElementById('col-month-drum');
  var yearDrum  = document.getElementById('col-year-drum');

  var dayPicker   = new DrumPicker(dayDrum,   buildDays(31),        0);
  var monthPicker = new DrumPicker(monthDrum, PICKER_MONTHS,        0, onMonthOrYearChange);
  var yearPicker  = new DrumPicker(yearDrum,  PICKER_YEARS, PICKER_YEARS.length - 1, onMonthOrYearChange);

  function onMonthOrYearChange() {
    var mIdx  = monthPicker.getIndex();
    var yr    = yearPicker.getValue();
    dayPicker.setItems(buildDays(getDaysInMonth(mIdx, yr)), true);
  }

  // ─── Ekran Süresi Picker ──────────────────────────────────────────────────
  var hoursDrum = document.getElementById('col-hours-drum');
  var ageDrum   = document.getElementById('col-age-drum');

  var SCREEN_HOURS = [];
  for (var hh = 1; hh <= 16; hh++) SCREEN_HOURS.push(hh);

  var SCREEN_YEARS = [];
  for (var sy = 1; sy <= 30; sy++) SCREEN_YEARS.push(sy);

  var hoursPicker = new DrumPicker(hoursDrum, SCREEN_HOURS, 1);          // default: 2 saat
  var agePicker   = new DrumPicker(ageDrum,   SCREEN_YEARS, 9);          // default: 10 yıl

  // ─── Gezegen Picker ───────────────────────────────────────────────────────
  var pdayDrum   = document.getElementById('col-pday-drum');
  var pmonthDrum = document.getElementById('col-pmonth-drum');
  var pyearDrum  = document.getElementById('col-pyear-drum');
  var planetDrum = document.getElementById('col-planet-drum');

  var PLANET_NAMES = PLANET_DATA.map(function(p) { return p.name; });

  var pdayPicker   = new DrumPicker(pdayDrum,   buildDays(31),        0);
  var pmonthPicker = new DrumPicker(pmonthDrum, PICKER_MONTHS,        0, onPMonthOrYearChange);
  var pyearPicker  = new DrumPicker(pyearDrum,  PICKER_YEARS, PICKER_YEARS.length - 1, onPMonthOrYearChange);
  var planetPicker = new DrumPicker(planetDrum, PLANET_NAMES,         2); // default: Mars

  function onPMonthOrYearChange() {
    var mIdx = pmonthPicker.getIndex();
    var yr   = pyearPicker.getValue();
    pdayPicker.setItems(buildDays(getDaysInMonth(mIdx, yr)), true);
  }

  // ─── EKG Animasyonu ───────────────────────────────────────────────────────
  var ekgCanvas = document.getElementById('ekg-canvas');
  var ekgCtx    = ekgCanvas.getContext('2d');
  var ekgPhase  = 0;
  var ekgRafId  = null;
  var BEAT_W    = 90;

  function ekgY(t) {
    if (t < 0.08)  return 0;
    if (t < 0.18)  return -0.18 * Math.sin((t - 0.08) / 0.10 * Math.PI);
    if (t < 0.28)  return 0;
    if (t < 0.31)  return 0.12;
    if (t < 0.36)  return 0.12 - 1.12 * ((t - 0.31) / 0.05);
    if (t < 0.41)  return -1.0 + 1.35 * ((t - 0.36) / 0.05);
    if (t < 0.46)  return 0.35 - 0.35 * ((t - 0.41) / 0.05);
    if (t < 0.62)  return -0.28 * Math.sin((t - 0.46) / 0.16 * Math.PI);
    return 0;
  }

  function drawEKG() {
    var W = ekgCanvas.width, H = ekgCanvas.height;
    ekgCtx.clearRect(0, 0, W, H);
    ekgCtx.save();
    ekgCtx.strokeStyle = '#0a7fd4';
    ekgCtx.lineWidth   = 2.5;
    ekgCtx.shadowColor = '#0a7fd4';
    ekgCtx.shadowBlur  = 10;
    ekgCtx.beginPath();
    for (var x = 0; x < W; x++) {
      var t = ((x + ekgPhase) % BEAT_W) / BEAT_W;
      var y = H / 2 + ekgY(t) * (H * 0.42);
      x === 0 ? ekgCtx.moveTo(x, y) : ekgCtx.lineTo(x, y);
    }
    ekgCtx.stroke();
    ekgCtx.restore();
    ekgPhase += 2.2;
    ekgRafId = requestAnimationFrame(drawEKG);
  }

  function startEKG() { ekgPhase = 0; ekgRafId = requestAnimationFrame(drawEKG); }
  function stopEKG()  { cancelAnimationFrame(ekgRafId); ekgCtx.clearRect(0, 0, ekgCanvas.width, ekgCanvas.height); }

  // ─── Ripple ───────────────────────────────────────────────────────────────
  function spawnRipple(btn, e) {
    var old = btn.querySelector('.btn-ripple-el');
    if (old) old.remove();
    var r = document.createElement('span');
    r.className = 'btn-ripple-el';
    var rect = btn.getBoundingClientRect();
    var size = Math.max(rect.width, rect.height) * 2;
    r.style.cssText = 'width:' + size + 'px;height:' + size + 'px;left:' +
      (e.clientX - rect.left - size / 2) + 'px;top:' +
      (e.clientY - rect.top  - size / 2) + 'px;';
    btn.appendChild(r);
    setTimeout(function() { r.remove(); }, 600);
  }

  function shake(el) { el.classList.remove('shake'); void el.offsetWidth; el.classList.add('shake'); }

  // ─── Kart şablonları ──────────────────────────────────────────────────────
  var PAST_CARDS = [
    { icon: '📅', label: 'Gün Yaşadın',                  key: 'days',             wide: true  },
    { icon: '🎂', label: 'Yaşındasın',                   key: 'age',              wide: false },
    { icon: '⏰', label: 'Saat Geçirdin',                key: 'hours',            wide: false },
    { icon: '⏱', label: 'Dakika Yaşadın',               key: 'minutes',          wide: false },
    { icon: '❤️', label: 'Kalbın Attı',                   key: 'heartbeats',       wide: false },
    { icon: '🫁', label: 'Nefes Aldın',                  key: 'breathsTaken',     wide: false },
    { icon: '👁', label: 'Göz Kırptın',                  key: 'blinked',          wide: false },
    { icon: '😴', label: 'Saat Uyudun',                  key: 'sleptHours',       wide: false },
    { icon: '👣', label: 'Adım Attın',                   key: 'stepsTaken',       wide: false },
    { icon: '🌍', label: 'Dünya Güneş Etrafında km Döndü', key: 'earthKm',        wide: true  },
    { icon: '🩸', label: 'Litre Kan Pompaladı Kalbın',   key: 'bloodPumped',      wide: false },
    { icon: '👶', label: 'Dünyaya Gelen Bebek',           key: 'babiesBorn',       wide: false },
    { icon: '⚡', label: 'Yıldırım Çaktı',               key: 'lightningStrikes', wide: true  },
    { icon: '☀️', label: 'Güneş Tutulması Gördün',       key: 'solarSeen',        wide: false },
    { icon: '🌕', label: 'Ay Tutulması Gördün',           key: 'lunarSeen',        wide: false }
  ];

  // ─── Karusel DOM referansları ─────────────────────────────────────────────
  var carouselWrap  = document.getElementById('mode-carousel-wrap');
  var carouselInner = document.getElementById('mode-carousel-inner');
  var modeCards     = carouselInner.querySelectorAll('.mode-card');
  var modeDots      = document.getElementById('mode-dots').querySelectorAll('.mode-dot');
  var modeSubtitle  = document.getElementById('mode-subtitle');
  var pickerZone    = document.querySelector('.picker-zone');

  // ─── Mod geçişi ───────────────────────────────────────────────────────────
  function setMode(idx, animate) {
    idx = Math.max(0, Math.min(MODE_COUNT - 1, idx));
    currentMode = idx;
    modeCards.forEach(function(c, i) { c.classList.toggle('active', i === idx); });
    modeDots.forEach(function(d, i)  { d.classList.toggle('active', i === idx); });
    modeSubtitle.textContent = MODES[idx].subtitle;
    pickerZone.className     = 'picker-zone mode-' + idx;
    if (btnCalc) btnCalc.textContent = MODES[idx].btnLabel;
  }

  // ─── Karusel swipe (kartlar yerinde kalır, sadece aktif değişir) ───────────
  (function() {
    var startX = 0, startY = 0, dragging = false, locked = false;
    carouselWrap.addEventListener('pointerdown', function(e) {
      startX = e.clientX; startY = e.clientY;
      dragging = true; locked = false;
      // setPointerCapture burada YOK — tıklama olayları kartlara ulaşsın
    });
    carouselWrap.addEventListener('pointermove', function(e) {
      if (!dragging) return;
      if (!locked) {
        var dx = Math.abs(e.clientX - startX), dy = Math.abs(e.clientY - startY);
        if (dx > 8 || dy > 8) {
          locked = true;
          if (dy > dx) { dragging = false; return; }
          carouselWrap.setPointerCapture(e.pointerId);
          e.preventDefault();
        }
      } else { e.preventDefault(); }
    }, { passive: false });
    carouselWrap.addEventListener('pointerup', function(e) {
      if (!dragging) return;
      dragging = false;
      if (locked) {
        var dx = e.clientX - startX;
        if (dx < -30 && currentMode < MODE_COUNT - 1) setMode(currentMode + 1, true);
        else if (dx > 30 && currentMode > 0) setMode(currentMode - 1, true);
      }
    });
    carouselWrap.addEventListener('pointercancel', function() { dragging = false; });
  })();

  var FUTURE_CARDS = [
    { icon: '📅', label: 'Gün Kaldı',                       key: 'daysLeft',        wide: true  },
    { icon: '🎂', label: 'Yılın Kaldı',                    key: 'yearsLeft',       wide: false },
    { icon: '⏰', label: 'Saat Kaldı',                     key: 'hoursLeft',       wide: false },
    { icon: '⏱', label: 'Dakika Kaldı',                   key: 'minutesLeft',     wide: false },
    { icon: '❤️', label: 'Kalbın Daha Atacak',             key: 'heartbeatsLeft',  wide: false },
    { icon: '🫁', label: 'Nefes Daha Alacaksın',           key: 'breathsLeft',     wide: false },
    { icon: '👁', label: 'Göz Daha Kırpacaksın',           key: 'blinksLeft',      wide: false },
    { icon: '😴', label: 'Saat Daha Uyuyacaksın',          key: 'sleepHoursLeft',  wide: false },
    { icon: '👣', label: 'Adım Daha Atacaksın',            key: 'stepsLeft',       wide: false },
    { icon: '🌍', label: 'Dünya km Daha Gidecek',          key: 'earthKmLeft',     wide: true  },
    { icon: '🩸', label: 'Litre Kan Daha Pompalayacak',    key: 'bloodPumpedLeft', wide: false },
    { icon: '⚡', label: 'Yıldırım Daha Çakacak',          key: 'lightningLeft',   wide: false },
    { icon: '☀️', label: 'Güneş Tutulması Göreceksin',     key: 'solarFuture',     wide: false },
    { icon: '🌕', label: 'Ay Tutulması Göreceksin',         key: 'lunarFuture',     wide: false }
  ];

  function cardHTML(c, value) {
    if (c.wide) {
      return '<div class="stat-card wide" data-target="' + value + '">' +
             '<div class="stat-icon">' + c.icon + '</div>' +
             '<div class="stat-info"><div class="stat-value">0</div>' +
             '<div class="stat-label">' + c.label + '</div></div></div>';
    }
    return '<div class="stat-card" data-target="' + value + '">' +
           '<div class="stat-icon">' + c.icon + '</div>' +
           '<div class="stat-value">0</div>' +
           '<div class="stat-label">' + c.label + '</div></div>';
  }

  function buildPastCards(data) {
    document.getElementById('tab-past').innerHTML =
      PAST_CARDS.map(function(c) { return cardHTML(c, data[c.key]); }).join('');
  }

  // ─── Gezegen Kartları ─────────────────────────────────────────────────────
  var PLANET_CARDS = [
    { icon: '🪐', label: 'Yaşındasın O Gezegende',       key: 'planetAge',       wide: true  },
    { icon: '⚖️', label: 'kg Ağırlığındasın',             key: 'weightKg',        wide: false },
    { icon: '📅', label: 'Gezegen Günü Yaşadın',           key: 'planetDaysLived', wide: false },
    { icon: '⏰', label: 'Saat Sürer 1 Gezegen Günü',     key: 'dayHours',        wide: false },
    { icon: '🎂', label: 'Gün Sonra Gezegen Doğum Günün', key: 'daysToNextBday',  wide: false },
    { icon: '🌌', label: 'Milyon km Uzakta Güneş\'ten',   key: 'distMKm',         wide: true  }
  ];

  function buildPlanetCards(data) {
    // Başlığa gezegen adını da ekle
    var header = '<div class="planet-header"><span>' + data.planetName + '</span></div>';
    document.getElementById('tab-past').innerHTML =
      header + PLANET_CARDS.map(function(c) { return cardHTML(c, data[c.key]); }).join('');
    // Başlık kartı animasyona dahil edilmesin
    document.querySelector('.planet-header').classList.add('visible');
  }

  // ─── Ekran Süresi Kartları ────────────────────────────────────────────────
  var SCREEN_TIME_CARDS = [
    { icon: '📱', label: 'Yıl Ekrana Harcadın',                  key: 'yearsOnScreen',    wide: true  },
    { icon: '🎬', label: 'Film İzleyebilirdin',                   key: 'moviesWatched',    wide: false },
    { icon: '📚', label: 'Kitap Okuyabilirdin',                    key: 'booksRead',        wide: false },
    { icon: '🏔', label: 'Kez Everest\'e Tırmanabilirdin',        key: 'everestClimbs',    wide: false },
    { icon: '✈️', label: 'Kez Dünya Turu Yapabilirdin',            key: 'worldTours',       wide: false },
    { icon: '🧠', label: 'Yeni Dil Öğrenebilirdin',                key: 'languagesLearned', wide: true  },
    { icon: '🏋️', label: 'Yıl Her Gün Spor Yapabilirdin',         key: 'sportYears',       wide: false },
    { icon: '🚶', label: 'km Yürüyebilirdin',                      key: 'kmWalked',         wide: false },
    { icon: '🌍', label: 'Kez Dünya Etrafını Yürüyebilirdin',     key: 'earthWalks',       wide: true  },
    { icon: '📅', label: 'Gün Ekrana Baktın',                      key: 'daysOnScreen',     wide: false },
    { icon: '🔋', label: 'Telefon Şarjı Tüketti',                 key: 'phoneBatteries',   wide: false },
    { icon: '🌅', label: 'Gündoğumu Kaçırdın',                     key: 'sunrisesMissed',   wide: false }
  ];

  function buildScreenTimeCards(data) {
    document.getElementById('tab-past').innerHTML =
      SCREEN_TIME_CARDS.map(function(c) { return cardHTML(c, data[c.key]); }).join('');
  }

  function buildFutureCards(data) {
    var changeRow = '<div class="life-change-row">' +
      '<div><div class="life-change-label">Hedef yaşam süresi</div>' +
      '<div class="life-change-value">' + lifeExpectancy + ' yıl</div></div>' +
      '<button class="life-change-btn" id="btn-change-life">Değiştir</button>' +
      '</div>';

    document.getElementById('tab-future').innerHTML =
      changeRow +
      FUTURE_CARDS.map(function(c) { return cardHTML(c, data[c.key]); }).join('');

    document.getElementById('btn-change-life').addEventListener('click', function() {
      openLifeModal();
    });
  }

  // ─── Sayaç animasyonu ─────────────────────────────────────────────────────
  function animateCounter(card) {
    var target  = parseInt(card.dataset.target, 10);
    var valEl   = card.querySelector('.stat-value');
    var dur     = Math.min(1800, Math.max(700, Math.log10(target + 2) * 380));
    var start   = performance.now();
    function step(now) {
      var t = Math.min((now - start) / dur, 1);
      valEl.textContent = Math.round((1 - Math.pow(1 - t, 3)) * target).toLocaleString('tr-TR');
      if (t < 1) requestAnimationFrame(step);
      else valEl.textContent = target.toLocaleString('tr-TR');
    }
    requestAnimationFrame(step);
  }

  function triggerEntrance(panelId) {
    var cards = document.querySelectorAll('#' + panelId + ' .stat-card');
    cards.forEach(function(card, i) {
      setTimeout(function() { card.classList.add('visible'); animateCounter(card); }, i * 100);
    });
  }

  // ─── Sekme geçişi ─────────────────────────────────────────────────────────
  document.querySelectorAll('.tab-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
      var target = btn.dataset.tab;

      if (target === 'future' && lifeExpectancy === null) {
        openLifeModal();
        return;
      }

      document.querySelectorAll('.tab-btn').forEach(function(b) {
        b.classList.toggle('active', b === btn);
      });
      document.querySelectorAll('.tab-panel').forEach(function(p) {
        var isTarget = p.id === 'tab-' + target;
        p.classList.toggle('active', isTarget);
        if (isTarget) {
          var unvisited = p.querySelectorAll('.stat-card:not(.visible)');
          if (unvisited.length > 0) triggerEntrance('tab-' + target);
        }
      });
    });
  });

  // ─── Yaşam beklentisi modali ──────────────────────────────────────────────
  var modal        = document.getElementById('life-modal');
  var lifeNumEl    = document.getElementById('life-number');
  var lifeMinusBtn = document.getElementById('life-minus');
  var lifePlusBtn  = document.getElementById('life-plus');
  var lifeConfirm  = document.getElementById('life-confirm');
  var tempLife     = 80;
  var holdTimer    = null;
  var holdInterval = null;

  function openLifeModal() {
    tempLife = lifeExpectancy !== null ? lifeExpectancy : 80;
    lifeNumEl.textContent = tempLife;
    modal.classList.add('visible');
  }

  function closeLifeModal() {
    modal.classList.remove('visible');
  }

  function changeLife(delta) {
    tempLife = Math.max(40, Math.min(110, tempLife + delta));
    lifeNumEl.textContent = tempLife;
    lifeNumEl.style.transform = 'scale(1.08)';
    setTimeout(function() { lifeNumEl.style.transform = ''; }, 100);
  }

  function startHold(delta) {
    changeLife(delta);
    holdTimer = setTimeout(function() {
      holdInterval = setInterval(function() { changeLife(delta); }, 80);
    }, 400);
  }

  function stopHold() {
    clearTimeout(holdTimer);
    clearInterval(holdInterval);
  }

  lifeMinusBtn.addEventListener('pointerdown', function() { startHold(-1); });
  lifePlusBtn.addEventListener('pointerdown',  function() { startHold(+1); });
  lifeMinusBtn.addEventListener('pointerup',   stopHold);
  lifePlusBtn.addEventListener('pointerup',    stopHold);
  lifeMinusBtn.addEventListener('pointerleave', stopHold);
  lifePlusBtn.addEventListener('pointerleave',  stopHold);

  lifeConfirm.addEventListener('click', function() {
    lifeExpectancy = tempLife;
    var futureData = calculateFuture(currentBirth, lifeExpectancy);
    buildFutureCards(futureData);
    closeLifeModal();

    // Sekmeyi future'a geçir
    document.querySelectorAll('.tab-btn').forEach(function(b) {
      b.classList.toggle('active', b.dataset.tab === 'future');
    });
    document.querySelectorAll('.tab-panel').forEach(function(p) {
      p.classList.toggle('active', p.id === 'tab-future');
    });
    triggerEntrance('tab-future');
    futureReady = true;
  });

  // Overlay'e tıklayınca kapat (modalın dışı)
  modal.addEventListener('click', function(e) {
    if (e.target === modal) closeLifeModal();
  });

  // ─── Ana hesapla butonu ───────────────────────────────────────────────────
  var btnCalc = document.getElementById('btn-calculate');

  // Yan kartlara tiklamak o moda gecer
  modeCards.forEach(function(card, i) {
    card.addEventListener('click', function() {
      if (i !== currentMode) setMode(i, true);
    });
  });

  // Baslangicta mod 1'e ayarla — Doğum Tarihi ortada (btnCalc tanımlandıktan sonra)
  pickerZone.classList.add('mode-1');
  setMode(1, false);

  btnCalc.addEventListener('click', function(e) {
    spawnRipple(btnCalc, e);

    // ── MOD 1: Doğum Tarihi ───────────────────────────────────────────────
    if (currentMode === 1) {
      var dayVal   = dayPicker.getValue();
      var monthIdx = monthPicker.getIndex();
      var yearVal  = yearPicker.getValue();

      if (!isValidBirthDate(dayVal, monthIdx, yearVal)) {
        shake(pickerZone);
        return;
      }

      currentBirth = new Date(yearVal, monthIdx, dayVal);
      currentBirth.setHours(0, 0, 0, 0);
      lifeExpectancy = null;
      futureReady    = false;

      showScreen('loading');
      startEKG();

      var stats = calculateStats(currentBirth);
      pastStats = stats.past;

      setTimeout(function() {
        stopEKG();
        buildPastCards(pastStats);
        document.getElementById('tab-future').innerHTML = '';

        // Sekmeleri göster ve past'e sıfırla
        document.querySelector('.tabs').style.display = '';
        document.querySelectorAll('.tab-btn').forEach(function(b, i) {
          b.classList.toggle('active', i === 0);
        });
        document.querySelectorAll('.tab-panel').forEach(function(p, i) {
          p.classList.toggle('active', i === 0);
        });

        showScreen('results');
        setTimeout(function() { triggerEntrance('tab-past'); }, 200);
      }, 2500);

    // ── MOD 0: Gezegen Yaşı ──────────────────────────────────────────────
    } else if (currentMode === 0) {
      var pdayVal   = pdayPicker.getValue();
      var pmonthIdx = pmonthPicker.getIndex();
      var pyearVal  = pyearPicker.getValue();

      if (!isValidBirthDate(pdayVal, pmonthIdx, pyearVal)) {
        shake(pickerZone);
        return;
      }

      var pBirth = new Date(pyearVal, pmonthIdx, pdayVal);
      pBirth.setHours(0, 0, 0, 0);
      currentBirth   = pBirth;
      lifeExpectancy = null;
      futureReady    = false;

      showScreen('loading');
      startEKG();

      currentPlanetStats = calculatePlanet(pBirth, planetPicker.getIndex());

      setTimeout(function() {
        stopEKG();
        buildPlanetCards(currentPlanetStats);
        document.getElementById('tab-future').innerHTML = '';
        document.querySelector('.tabs').style.display = 'none';
        document.querySelectorAll('.tab-panel').forEach(function(p, i) {
          p.classList.toggle('active', i === 0);
        });
        showScreen('results');
        setTimeout(function() { triggerEntrance('tab-past'); }, 200);
      }, 2500);

    // ── MOD 2: Ekran Süresi ───────────────────────────────────────────────
    } else if (currentMode === 2) {
      var hoursPerDay  = hoursPicker.getValue();
      var yearsUsing   = agePicker.getValue();
      currentBirth = null;
      lifeExpectancy = null;
      futureReady    = false;

      showScreen('loading');
      startEKG();

      currentScreenTimeStats = calculateScreenTime(hoursPerDay, yearsUsing);

      setTimeout(function() {
        stopEKG();
        buildScreenTimeCards(currentScreenTimeStats);
        document.getElementById('tab-future').innerHTML = '';

        // Sekme çubuğunu gizle (sadece geçmiş gösteriliyor)
        document.querySelector('.tabs').style.display = 'none';
        document.querySelectorAll('.tab-panel').forEach(function(p, i) {
          p.classList.toggle('active', i === 0);
        });

        showScreen('results');
        setTimeout(function() { triggerEntrance('tab-past'); }, 200);
      }, 2500);
    }
  });

  // ─── İsim modali ─────────────────────────────────────────────────────────
  var nameModal   = document.getElementById('name-modal');
  var nameInput   = document.getElementById('name-input');
  var nameConfirm = document.getElementById('name-confirm');

  function openNameModal() {
    nameInput.value = '';
    nameModal.classList.add('visible');
    // Animasyon bittikten sonra odaklan
    setTimeout(function() { nameInput.focus(); }, 360);
  }

  function closeNameModal() {
    nameModal.classList.remove('visible');
  }

  // Dışarı tıklayınca kapat
  nameModal.addEventListener('click', function(e) {
    if (e.target === nameModal) closeNameModal();
  });

  // Enter tuşu ile onaylama
  nameInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') nameConfirm.click();
  });

  // ─── İndir butonu ────────────────────────────────────────────────────────
  var btnDownload = document.getElementById('btn-download');
  var btnDownText = btnDownload.querySelector('span');

  btnDownload.addEventListener('click', function() {
    // Hangi modda veri var?
    if (currentMode === 1 && (!currentBirth || !pastStats)) return;
    if (currentMode === 2 && !currentScreenTimeStats) return;
    if (currentMode === 0 && !currentPlanetStats) return;

    openNameModal();
  });

  // İsim onaylandı → hikayeyi oluştur
  nameConfirm.addEventListener('click', function() {
    var nameVal = nameInput.value.trim();
    closeNameModal();

    btnDownload.classList.add('loading');
    btnDownText.textContent = 'Hazırlanıyor…';

    function onDone() {
      btnDownload.classList.remove('loading');
      btnDownText.textContent = 'Hikaye Olarak İndir';
    }

    setTimeout(function() {
      try {
        if (currentMode === 1) {
          var futureData = (lifeExpectancy !== null)
            ? calculateFuture(currentBirth, lifeExpectancy)
            : null;
          generateAndDownload(pastStats, futureData, lifeExpectancy, currentBirth, nameVal, onDone);

        } else if (currentMode === 2) {
          generateScreenTimeDownload(currentScreenTimeStats, nameVal, onDone);

        } else if (currentMode === 0) {
          generatePlanetDownload(currentPlanetStats, nameVal, onDone);

        } else {
          onDone();
        }
      } catch (err) {
        console.error('Hikaye oluşturma hatası:', err);
        onDone();
      }
    }, 80);
  });

  // ─── Geri butonu ─────────────────────────────────────────────────────────
  document.getElementById('btn-back').addEventListener('click', function() {
    showScreen('home');
    // Sekme çubuğunu moda göre geri yükle (sadece Doğum Tarihi = mod 1 gösterir)
    document.querySelector('.tabs').style.display = (currentMode === 1) ? '' : 'none';
    document.querySelectorAll('.stat-card').forEach(function(c) {
      c.classList.remove('visible');
      var v = c.querySelector('.stat-value');
      if (v) v.textContent = '0';
    });
    // İndir butonunu sıfırla (önceki indirme yarıda kalmışsa)
    btnDownload.classList.remove('loading');
    btnDownText.textContent = 'Hikaye Olarak İndir';
  });

  // ─── Canvas boyutu ────────────────────────────────────────────────────────
  function resizeCanvas() {
    ekgCanvas.width  = Math.min(340, window.innerWidth - 48);
    ekgCanvas.height = 80;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

})();
