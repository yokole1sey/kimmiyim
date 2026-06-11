// Instagram hikayesi paylaşım görseli (1080×1920) — SVG ikonlu
(function() {

  var W      = 1080, H = 1920;
  var PAD    = 68;
  var CW     = W - PAD * 2;
  var GAP    = 12;
  var WH     = 120;
  var HH     = 140;
  var TOP    = 140;

  var SANS = '-apple-system, BlinkMacSystemFont, "Helvetica Neue", Arial, sans-serif';

  var P = {
    calendar:
      'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5' +
      'a2 2 0 00-2 2v12a2 2 0 002 2z',
    sun:
      'M12 3v2m0 14v2M5.636 5.636l1.414 1.414m9.9 9.9l1.414 1.414' +
      'M3 12h2m14 0h2M5.636 18.364l1.414-1.414m9.9-9.9l1.414-1.414' +
      'M12 8a4 4 0 100 8 4 4 0 000-8z',
    moon:
      'M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21' +
      'a9.003 9.003 0 008.354-5.646z',
    heart:
      'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682' +
      'a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318' +
      'a4.5 4.5 0 00-6.364 0z',
    clock:   'M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0z',
    stopwatch:
      'M12 6v6l3.5 2M9.5 3h5M12 3v3M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z',
    star:
      'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 0 0 .95.69' +
      'h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 0 0-.363 1.118' +
      'l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 0 0-1.176 0' +
      'l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 0 0-.363-1.118' +
      'l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 0 0 .951-.69l1.519-4.674z',
    wind:
      'M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-4H2',
    eye:
      'M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z' +
      'M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z',
    moon2:   'M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z',
    walk:    'M23 6l-9.5 9.5-5-5L1 18M17 6h6v6',
    globe:
      'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z' +
      'M2 12h20' +
      'M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z',
    drop:    'M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z',
    users:
      'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2' +
      'M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z' +
      'M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75',
    bolt:    'M13 2L3 14h9l-1 8 10-12h-9l1-8z'
  };

  function drawIcon(ctx, pathKey, cx, cy, size, color) {
    var d = P[pathKey];
    if (!d) return;
    var s = size / 24;
    ctx.save();
    ctx.translate(cx - size / 2, cy - size / 2);
    ctx.scale(s, s);
    ctx.strokeStyle = color || 'rgba(255,255,255,0.82)';
    ctx.lineWidth   = 1.8 / s;
    ctx.lineCap     = 'round';
    ctx.lineJoin    = 'round';
    ctx.fillStyle   = 'transparent';
    ctx.stroke(new Path2D(d));
    ctx.restore();
  }

  function rr(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);             ctx.lineTo(x + w - r, y);
    ctx.arcTo(x + w, y,     x + w, y + r,     r);
    ctx.lineTo(x + w, y + h - r);
    ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
    ctx.lineTo(x + r, y + h);
    ctx.arcTo(x,     y + h, x,     y + h - r, r);
    ctx.lineTo(x, y + r);
    ctx.arcTo(x,     y,     x + r, y,         r);
    ctx.closePath();
  }

  function drawBg(ctx) {
    var g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, '#011d36'); g.addColorStop(0.45, '#023059'); g.addColorStop(1, '#011d36');
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    var g1 = ctx.createRadialGradient(W * 0.82, 280, 0, W * 0.82, 280, 580);
    g1.addColorStop(0, 'rgba(10,127,212,0.18)'); g1.addColorStop(1, 'transparent');
    ctx.fillStyle = g1; ctx.fillRect(0, 0, W, H);
    var g2 = ctx.createRadialGradient(W * 0.18, H * 0.70, 0, W * 0.18, H * 0.70, 440);
    g2.addColorStop(0, 'rgba(10,127,212,0.12)'); g2.addColorStop(1, 'transparent');
    ctx.fillStyle = g2; ctx.fillRect(0, 0, W, H);
  }

  function drawHeader(ctx, subtitleText, name) {
    var cx = W / 2;

    ctx.save();
    ctx.textAlign = 'center'; ctx.textBaseline = 'top';
    ctx.font = 'bold 100px ' + SANS;
    ctx.fillStyle = '#ffffff';
    ctx.fillText('KİM MİYİM?', cx, TOP);
    ctx.restore();

    ctx.save();
    ctx.textAlign = 'center'; ctx.textBaseline = 'top';
    ctx.font = '36px ' + SANS;
    ctx.fillStyle = 'rgba(255,255,255,0.48)';
    ctx.fillText(subtitleText, cx, TOP + 128);
    ctx.restore();

    var sepY;
    if (name) {
      ctx.save();
      ctx.textAlign = 'center'; ctx.textBaseline = 'top';
      ctx.font = 'bold 46px ' + SANS;
      ctx.fillStyle = '#0a7fd4';
      ctx.fillText(name.toLocaleUpperCase('tr-TR'), cx, TOP + 182);
      ctx.restore();
      sepY = TOP + 262;
    } else {
      sepY = TOP + 202;
    }

    ctx.save();
    var gl = ctx.createLinearGradient(PAD, sepY, W - PAD, sepY);
    gl.addColorStop(0, 'transparent'); gl.addColorStop(0.3, 'rgba(255,255,255,0.13)');
    gl.addColorStop(0.7, 'rgba(255,255,255,0.13)'); gl.addColorStop(1, 'transparent');
    ctx.strokeStyle = gl; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(PAD, sepY); ctx.lineTo(W - PAD, sepY); ctx.stroke();
    ctx.restore();

    return name ? (TOP + 288) : (TOP + 228);
  }

  function drawLabel(ctx, y, text) {
    ctx.save();
    ctx.textAlign = 'left'; ctx.textBaseline = 'top';
    ctx.font = 'bold 27px ' + SANS;
    ctx.fillStyle = 'rgba(10,127,212,0.92)';
    ctx.fillText('◆  ' + text, PAD, y);
    ctx.restore();
    return y + 50;
  }

  // Kart cizici — yukseklige orantili, tasmasiz
  // Deger + aciklama dikey blok olarak karti ortalar
  function drawCard(ctx, x, y, w, h, iconKey, value, label) {
    var isWide = w > 600;

    ctx.save();
    rr(ctx, x, y, w, h, 22);
    ctx.fillStyle = 'rgba(255,255,255,0.07)'; ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.13)'; ctx.lineWidth = 1.5; ctx.stroke();
    ctx.restore();

    var midY = y + h / 2;
    var padL = isWide ? 36 : 22;

    // Kart yuksekligine orantili boyutlar
    // Genis kartlar icin: deger buyuk, etiket makul
    // Dar kartlar icin: deger ve etiket daha buyuk katsayi (9 satirda bile okunaklı)
    var iconSz = Math.round(Math.max(isWide ? 44 : 36, Math.min(isWide ? 76 : 64, h * (isWide ? 0.34 : 0.30))));
    var valFsB = Math.round(Math.max(isWide ? 54 : 40, Math.min(isWide ? 82 : 70, h * (isWide ? 0.32 : 0.33))));
    var lblFs  = Math.round(Math.max(isWide ? 27 : 24, Math.min(isWide ? 40 : 32, h * (isWide ? 0.18 : 0.19))));
    var gap    = Math.round(Math.max(6, h * 0.045));

    // Uzun deger icin font kucultme
    var vl = value.length, valFs = valFsB;
    if (valFsB >= 48) {
      if      (vl > 13) valFs = Math.round(valFsB * 0.62);
      else if (vl > 10) valFs = Math.round(valFsB * 0.73);
      else if (vl > 7)  valFs = Math.round(valFsB * 0.84);
      else if (vl > 5)  valFs = Math.round(valFsB * 0.92);
    } else {
      if      (vl > 13) valFs = Math.round(valFsB * 0.74);
      else if (vl > 10) valFs = Math.round(valFsB * 0.85);
      else if (vl > 7)  valFs = Math.round(valFsB * 0.92);
    }

    var blockH = valFs + gap + lblFs;

    // Guvenlik kilidi: icerik blogu kart sinirini asmamali
    if (blockH > h - 8) {
      var sc = (h - 8) / blockH;
      valFs  = Math.max(14, Math.round(valFs * sc));
      lblFs  = Math.max(11, Math.round(lblFs * sc));
      gap    = Math.max(3,  Math.round(gap * sc));
      blockH = valFs + gap + lblFs;
    }

    var iconX   = x + padL + iconSz / 2;
    var textX   = iconX + iconSz / 2 + (isWide ? 28 : 18);
    var maxTxtW = x + w - 16 - textX;

    // Deger + aciklama blogu dikeyde ortalanir
    var blockTop = midY - blockH / 2;
    var valCY    = blockTop + valFs / 2;
    var lblTopY  = blockTop + valFs + gap;

    drawIcon(ctx, iconKey, iconX, valCY, iconSz, 'rgba(255,255,255,0.82)');

    ctx.save();
    ctx.font = 'bold ' + valFs + 'px ' + SANS;
    ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(value, textX, valCY);
    ctx.restore();

    var lblLineH = Math.round(lblFs * 1.32);
    ctx.save();
    ctx.font = lblFs + 'px ' + SANS;
    ctx.textAlign = 'left'; ctx.textBaseline = 'top';
    ctx.fillStyle = 'rgba(255,255,255,0.52)';
    var words = label.split(' '), line = '', lineY = lblTopY;
    for (var wi = 0; wi < words.length; wi++) {
      var test = line + words[wi] + ' ';
      if (ctx.measureText(test).width > maxTxtW && wi > 0) {
        ctx.fillText(line.trim(), textX, lineY);
        line = words[wi] + ' '; lineY += lblLineH;
      } else { line = test; }
    }
    ctx.fillText(line.trim(), textX, lineY);
    ctx.restore();
  }

  function fmt(n)  { return Number(n).toLocaleString('tr-TR'); }
  function fmtK(n) {
    if (n >= 1e12) return (n / 1e12).toFixed(1).replace('.', ',') + ' trilyon';
    if (n >= 1e9)  return (n / 1e9).toFixed(1).replace('.', ',') + ' milyar';
    if (n >= 1e6)  return (n / 1e6).toFixed(1).replace('.', ',') + ' milyon';
    return fmt(n);
  }

  function drawPast(ctx, startY, p) {
    var y = startY, hw = (CW - GAP) / 2;
    drawCard(ctx, PAD, y, CW, WH, 'calendar', fmt(p.days) + ' gün', 'Yaşadın');
    y += WH + GAP;
    drawCard(ctx, PAD,        y, hw, HH, 'star',      p.age + ' yaş',       'Yaşındasın');
    drawCard(ctx, PAD+hw+GAP, y, hw, HH, 'clock',     fmt(p.hours),              'Saat Geçirdin');
    y += HH + GAP;
    drawCard(ctx, PAD,        y, hw, HH, 'stopwatch', fmtK(p.minutes),           'Dakika Yaşadın');
    drawCard(ctx, PAD+hw+GAP, y, hw, HH, 'heart',     fmtK(p.heartbeats),        'Kalbin Attı');
    y += HH + GAP;
    drawCard(ctx, PAD,        y, hw, HH, 'wind',      fmtK(p.breathsTaken),      'Nefes Aldın');
    drawCard(ctx, PAD+hw+GAP, y, hw, HH, 'eye',       fmtK(p.blinked),           'Göz Kırptın');
    y += HH + GAP;
    drawCard(ctx, PAD,        y, hw, HH, 'moon2',     fmt(p.sleptHours),         'Saat Uyudun');
    drawCard(ctx, PAD+hw+GAP, y, hw, HH, 'walk',      fmtK(p.stepsTaken),        'Adım Attın');
    y += HH + GAP;
    drawCard(ctx, PAD, y, CW, WH, 'globe', fmtK(p.earthKm) + ' km', 'Dünya Güneş Etrafında Döndü');
    y += WH + GAP;
    drawCard(ctx, PAD,        y, hw, HH, 'drop',  fmtK(p.bloodPumped), 'Litre Kan Pompaladı');
    drawCard(ctx, PAD+hw+GAP, y, hw, HH, 'users', fmtK(p.babiesBorn),  'Dünyaya Gelen Bebek');
    y += HH + GAP;
    drawCard(ctx, PAD, y, CW, WH, 'bolt', fmtK(p.lightningStrikes), 'Yıldırım Çaktı');
    y += WH + GAP;
    drawCard(ctx, PAD,        y, hw, HH, 'sun',  p.solarSeen + ' kez', 'Güneş Tutulması Gördün');
    drawCard(ctx, PAD+hw+GAP, y, hw, HH, 'moon', p.lunarSeen + ' kez', 'Ay Tutulması Gördün');
    y += HH;
    return y;
  }

  function drawFuture(ctx, startY, f, lifeExp) {
    var y = startY, hw = (CW - GAP) / 2;
    drawCard(ctx, PAD, y, CW, WH, 'calendar', fmt(f.daysLeft) + ' gün', 'Kaldı (' + lifeExp + ' yıl hedefi)');
    y += WH + GAP;
    drawCard(ctx, PAD,        y, hw, HH, 'star',  f.yearsLeft + ' yıl',   'Yılın Kaldı');
    drawCard(ctx, PAD+hw+GAP, y, hw, HH, 'heart', fmtK(f.heartbeatsLeft),      'Kalbin Daha Atacak');
    y += HH + GAP;
    drawCard(ctx, PAD,        y, hw, HH, 'wind',  fmtK(f.breathsLeft),         'Nefes Daha Alacaksın');
    drawCard(ctx, PAD+hw+GAP, y, hw, HH, 'walk',  fmtK(f.stepsLeft),           'Adım Daha Atacaksın');
    y += HH + GAP;
    drawCard(ctx, PAD, y, CW, WH, 'globe', fmtK(f.earthKmLeft) + ' km', 'Dünya Güneş Etrafında Daha Gidecek');
    y += WH + GAP;
    drawCard(ctx, PAD,        y, hw, HH, 'sun',  f.solarFuture + ' kez', 'Güneş Tutulması');
    drawCard(ctx, PAD+hw+GAP, y, hw, HH, 'moon', f.lunarFuture + ' kez', 'Ay Tutulması');
    y += HH;
    return y;
  }

  function drawFooter(ctx) {
    var y = H - 88;
    ctx.save();
    var gl = ctx.createLinearGradient(PAD, y, W - PAD, y);
    gl.addColorStop(0, 'transparent'); gl.addColorStop(0.35, 'rgba(255,255,255,0.11)');
    gl.addColorStop(0.65, 'rgba(255,255,255,0.11)'); gl.addColorStop(1, 'transparent');
    ctx.strokeStyle = gl; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(PAD, y); ctx.lineTo(W - PAD, y); ctx.stroke();
    ctx.restore();
    ctx.save();
    ctx.textAlign = 'center'; ctx.textBaseline = 'top';
    ctx.font = '30px ' + SANS;
    ctx.fillStyle = 'rgba(255,255,255,0.28)';
    ctx.fillText('www.kimmiyim.com', W / 2, y + 24);
    ctx.restore();
  }

  function doDownload(canvas, onDone) {
    canvas.toBlob(function(blob) {
      var file = new File([blob], 'kim-miyim.png', { type: 'image/png' });
      var isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) ||
                  (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
      if (isIOS && navigator.canShare && navigator.canShare({ files: [file] })) {
        navigator.share({ files: [file], title: 'Kim Miyim?' })
          .then(function() { onDone && onDone(); })
          .catch(function() { onDone && onDone(); });
        return;
      }
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url; a.download = 'kim-miyim.png';
      document.body.appendChild(a); a.click();
      document.body.removeChild(a);
      setTimeout(function() { URL.revokeObjectURL(url); }, 1000);
      onDone && onDone();
    }, 'image/png');
  }

  // Dogum Tarihi modu
  window.generateAndDownload = function(pastStats, futureStats, lifeExpectancy, birthDate, name, onDone) {
    var hasFuture = !!(futureStats && lifeExpectancy);
    var months = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
                  'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
    var d = birthDate;
    var subtitleText = 'Doğum: ' + d.getDate() + ' ' + months[d.getMonth()] + ' ' + d.getFullYear();

    var startY = name ? (TOP + 288) : (TOP + 228);
    var AVAIL  = (H - 88) - (startY + 50);
    var PAST_ROWS = 9, FUT_ROWS = 5;

    if (hasFuture) {
      var forCards = AVAIL - 90;
      WH = HH = Math.floor((forCards - (PAST_ROWS - 1 + FUT_ROWS - 1) * GAP) / (PAST_ROWS + FUT_ROWS));
    } else {
      WH = HH = Math.floor((AVAIL - (PAST_ROWS - 1) * GAP) / PAST_ROWS);
    }

    var canvas = document.createElement('canvas');
    canvas.width = W; canvas.height = H;
    var ctx = canvas.getContext('2d');

    drawBg(ctx);
    var y = drawHeader(ctx, subtitleText, name);
    y = drawLabel(ctx, y, 'YAŞADIKLARIM');
    y = drawPast(ctx, y, pastStats);

    if (hasFuture) {
      y += 24;
      y = drawLabel(ctx, y + 16, 'GÖRECEKLERİM');
      drawFuture(ctx, y, futureStats, lifeExpectancy);
    }

    drawFooter(ctx);
    doDownload(canvas, onDone);
  };

  // Ekran Suresi modu
  window.generateScreenTimeDownload = function(stats, name, onDone) {
    var subtitleText = 'Günde ' + stats.hoursPerDay + ' saat  ·  ' + stats.yearsUsing + ' yıldır';

    var startY = name ? (TOP + 288) : (TOP + 228);
    var AVAIL  = (H - 88) - (startY + 50);
    var ROWS   = 8;
    WH = HH = Math.floor((AVAIL - (ROWS - 1) * GAP) / ROWS);

    var canvas = document.createElement('canvas');
    canvas.width = W; canvas.height = H;
    var ctx = canvas.getContext('2d');
    var hw = (CW - GAP) / 2;

    drawBg(ctx);
    var y = drawHeader(ctx, subtitleText, name);
    y = drawLabel(ctx, y, 'EKRAN SÜRESİ');

    drawCard(ctx, PAD, y, CW, WH, 'clock',
      fmt(stats.yearsOnScreen) + ' yıl', 'Ekran Başında Geçirdin');
    y += WH + GAP;
    drawCard(ctx, PAD,        y, hw, HH, 'star',     fmt(stats.moviesWatched),    'Film İzleyebilirdin');
    drawCard(ctx, PAD+hw+GAP, y, hw, HH, 'eye',      fmt(stats.booksRead),        'Kitap Okuyabilirdin');
    y += HH + GAP;
    drawCard(ctx, PAD,        y, hw, HH, 'walk',     fmt(stats.everestClimbs),    'Kez Everest Tırmanışı');
    drawCard(ctx, PAD+hw+GAP, y, hw, HH, 'globe',    fmt(stats.worldTours),       'Kez Dünya Turu');
    y += HH + GAP;
    drawCard(ctx, PAD, y, CW, WH, 'wind',
      fmt(stats.languagesLearned), 'Yeni Dil Öğrenebilirdin');
    y += WH + GAP;
    drawCard(ctx, PAD,        y, hw, HH, 'heart',    fmt(stats.sportYears) + ' yıl', 'Her Gün Spor Yapabilirdin');
    drawCard(ctx, PAD+hw+GAP, y, hw, HH, 'walk',     fmt(stats.kmWalked),         'km Yürüyebilirdin');
    y += HH + GAP;
    drawCard(ctx, PAD, y, CW, WH, 'globe',
      fmt(stats.earthWalks) + ' kez', 'Dünya Etrafını Yürüyebilirdin');
    y += WH + GAP;
    drawCard(ctx, PAD,        y, hw, HH, 'calendar', fmt(stats.daysOnScreen),     'Gün Ekrana Baktın');
    drawCard(ctx, PAD+hw+GAP, y, hw, HH, 'bolt',     fmt(stats.phoneBatteries),   'Telefon Şarjı Tüketti');
    y += HH + GAP;
    drawCard(ctx, PAD, y, CW, WH, 'sun',
      fmt(stats.sunrisesMissed), 'Gündoğumu Kaçırdın');

    drawFooter(ctx);
    doDownload(canvas, onDone);
  };

  // Gezegen Yasi modu
  window.generatePlanetDownload = function(stats, name, onDone) {
    var subtitleText = stats.planetName + ' Gezegeni Yolculuğu';

    var startY = name ? (TOP + 288) : (TOP + 228);
    var AVAIL  = (H - 88) - (startY + 50);
    var ROWS   = 4;
    WH = HH = Math.floor((AVAIL - (ROWS - 1) * GAP) / ROWS);

    var canvas = document.createElement('canvas');
    canvas.width = W; canvas.height = H;
    var ctx = canvas.getContext('2d');
    var hw = (CW - GAP) / 2;

    drawBg(ctx);
    var y = drawHeader(ctx, subtitleText, name);
    y = drawLabel(ctx, y, 'GEZEGEN BİLGİLERİ');

    drawCard(ctx, PAD, y, CW, WH, 'star',
      stats.planetAge + ' yaş', stats.planetName + ' Gezegeni\'nde Yaşındasın');
    y += WH + GAP;
    drawCard(ctx, PAD,        y, hw, HH, 'users',    stats.weightKg + ' kg',       'Bu Gezegende Ağırlığın');
    drawCard(ctx, PAD+hw+GAP, y, hw, HH, 'calendar', fmt(stats.planetDaysLived),   'Gezegen Günü Yaşadın');
    y += HH + GAP;
    drawCard(ctx, PAD,        y, hw, HH, 'clock',    fmt(stats.dayHours) + ' sa',  '1 Gezegen Gününün Uzunluğu');
    drawCard(ctx, PAD+hw+GAP, y, hw, HH, 'stopwatch', stats.daysToNextBday + ' gün', 'Sonraki Gezegen Doğum Gününe');
    y += HH + GAP;
    drawCard(ctx, PAD, y, CW, WH, 'globe',
      fmt(stats.distMKm) + ' M km', 'Güneş\'e Ortalama Uzaklık');

    drawFooter(ctx);
    doDownload(canvas, onDone);
  };

})();
