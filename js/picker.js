// Apple iOS tarzı silindir tarih seçici
(function() {

  var ITEM_H = 52;
  var VISIBLE = 5;
  var FRICTION = 0.92;
  var SNAP_MS = 280;

  var MONTHS = [
    'Ocak','Şubat','Mart','Nisan','Mayıs','Haziran',
    'Temmuz','Ağustos','Eylül','Ekim','Kasım','Aralık'
  ];

  var currentYear = new Date().getFullYear();
  var YEARS = [];
  for (var y = 1924; y <= currentYear; y++) YEARS.push(y);

  function getDaysInMonth(monthIdx, year) {
    return new Date(year, monthIdx + 1, 0).getDate();
  }

  function buildDays(count) {
    var arr = [];
    for (var i = 1; i <= count; i++) arr.push(i);
    return arr;
  }

  function DrumPicker(drumEl, items, initialIndex, onChange) {
    this.el = drumEl;
    this.items = items.slice();
    this.onChange = onChange || function() {};
    this.currentY = 0;
    this.targetY = 0;
    this.velocity = 0;
    this.isDragging = false;
    this.lastClientY = 0;
    this.lastTime = 0;
    this.rafId = null;
    this.snapping = false;

    this._buildDOM();
    this._attachEvents();
    this.goToIndex(initialIndex || 0, false);
  }

  DrumPicker.prototype._buildDOM = function() {
    this.el.innerHTML = '';
    this.el.style.position = 'relative';
    this.el.style.height = (ITEM_H * VISIBLE) + 'px';
    this.el.style.overflow = 'hidden';
    this.el.style.cursor = 'grab';
    this.el.style.touchAction = 'none';
    this.el.style.userSelect = 'none';

    this.inner = document.createElement('div');
    this.inner.className = 'picker-inner';
    this.inner.style.cssText = [
      'position: absolute',
      'left: 0',
      'right: 0',
      'top: 0',
      'will-change: transform'
    ].join(';');

    this._renderItems();
    this.el.appendChild(this.inner);
  };

  DrumPicker.prototype._renderItems = function() {
    this.inner.innerHTML = '';
    // 2 boş spacer üstte
    for (var s = 0; s < 2; s++) {
      var sp = document.createElement('div');
      sp.className = 'picker-item picker-spacer';
      sp.style.height = ITEM_H + 'px';
      this.inner.appendChild(sp);
    }
    this.itemEls = [];
    for (var i = 0; i < this.items.length; i++) {
      var div = document.createElement('div');
      div.className = 'picker-item';
      div.style.height = ITEM_H + 'px';
      div.textContent = this.items[i];
      this.inner.appendChild(div);
      this.itemEls.push(div);
    }
    // 2 boş spacer altta
    for (var s2 = 0; s2 < 2; s2++) {
      var sp2 = document.createElement('div');
      sp2.className = 'picker-item picker-spacer';
      sp2.style.height = ITEM_H + 'px';
      this.inner.appendChild(sp2);
    }
    this.inner.style.height = ((this.items.length + 4) * ITEM_H) + 'px';
  };

  DrumPicker.prototype._attachEvents = function() {
    var self = this;

    this.el.addEventListener('pointerdown', function(e) {
      e.preventDefault();
      self.el.setPointerCapture(e.pointerId);
      self.isDragging = true;
      self.snapping = false;
      self.velocity = 0;
      self.lastClientY = e.clientY;
      self.lastTime = performance.now();
      self.el.style.cursor = 'grabbing';
      cancelAnimationFrame(self.rafId);
    });

    this.el.addEventListener('pointermove', function(e) {
      if (!self.isDragging) return;
      var now = performance.now();
      var dt = now - self.lastTime;
      if (dt < 1) return;
      var delta = e.clientY - self.lastClientY;
      self.velocity = delta / dt;
      self.currentY += delta;
      self._clamp();
      self._applyTransform();
      self._updateClasses();
      self.lastClientY = e.clientY;
      self.lastTime = now;
    });

    this.el.addEventListener('pointerup', function(e) {
      if (!self.isDragging) return;
      self.isDragging = false;
      self.el.style.cursor = 'grab';
      self._startMomentum();
    });

    this.el.addEventListener('pointercancel', function() {
      self.isDragging = false;
      self.el.style.cursor = 'grab';
      self._snapToNearest();
    });

    // Mouse wheel desteği
    this.el.addEventListener('wheel', function(e) {
      e.preventDefault();
      cancelAnimationFrame(self.rafId);
      self.currentY -= e.deltaY * 0.5;
      self._clamp();
      self._applyTransform();
      self._updateClasses();
      clearTimeout(self._wheelTimer);
      self._wheelTimer = setTimeout(function() {
        self._snapToNearest();
      }, 120);
    }, { passive: false });
  };

  DrumPicker.prototype._minY = function() {
    return -(this.items.length - 1) * ITEM_H;
  };

  DrumPicker.prototype._clamp = function() {
    var min = this._minY();
    if (this.currentY > 0) this.currentY = 0;
    if (this.currentY < min) this.currentY = min;
  };

  DrumPicker.prototype._applyTransform = function() {
    this.inner.style.transform = 'translateY(' + this.currentY + 'px)';
  };

  DrumPicker.prototype._updateClasses = function() {
    var centerIdx = Math.round(-this.currentY / ITEM_H);
    centerIdx = Math.max(0, Math.min(this.items.length - 1, centerIdx));
    for (var i = 0; i < this.itemEls.length; i++) {
      var diff = Math.abs(i - centerIdx);
      this.itemEls[i].classList.remove('selected', 'near1', 'near2');
      if (diff === 0) this.itemEls[i].classList.add('selected');
      else if (diff === 1) this.itemEls[i].classList.add('near1');
      else if (diff === 2) this.itemEls[i].classList.add('near2');
    }
  };

  DrumPicker.prototype._startMomentum = function() {
    var self = this;
    var last = performance.now();

    function step(now) {
      var dt = now - last;
      last = now;
      self.velocity *= Math.pow(FRICTION, dt / 16.67);
      self.currentY += self.velocity * dt;
      self._clamp();
      self._applyTransform();
      self._updateClasses();

      if (Math.abs(self.velocity) > 0.05 &&
          self.currentY > self._minY() &&
          self.currentY < 0) {
        self.rafId = requestAnimationFrame(step);
      } else {
        self._snapToNearest();
      }
    }
    self.rafId = requestAnimationFrame(step);
  };

  DrumPicker.prototype._snapToNearest = function() {
    var idx = Math.round(-this.currentY / ITEM_H);
    idx = Math.max(0, Math.min(this.items.length - 1, idx));
    this._animateTo(-idx * ITEM_H, idx);
  };

  DrumPicker.prototype._animateTo = function(targetY, idx) {
    var self = this;
    var start = self.currentY;
    var diff = targetY - start;
    if (Math.abs(diff) < 0.5) {
      self.currentY = targetY;
      self._applyTransform();
      self._updateClasses();
      self.onChange(self.items[idx], idx);
      return;
    }
    var startTime = performance.now();
    self.snapping = true;

    function animate(now) {
      var elapsed = now - startTime;
      var t = Math.min(elapsed / SNAP_MS, 1);
      // ease out cubic
      var ease = 1 - Math.pow(1 - t, 3);
      self.currentY = start + diff * ease;
      self._applyTransform();
      self._updateClasses();
      if (t < 1) {
        self.rafId = requestAnimationFrame(animate);
      } else {
        self.currentY = targetY;
        self._applyTransform();
        self._updateClasses();
        self.snapping = false;
        self.onChange(self.items[idx], idx);
      }
    }
    self.rafId = requestAnimationFrame(animate);
  };

  DrumPicker.prototype.goToIndex = function(idx, animate) {
    idx = Math.max(0, Math.min(this.items.length - 1, idx));
    if (animate === false) {
      this.currentY = -idx * ITEM_H;
      this._applyTransform();
      this._updateClasses();
    } else {
      this._animateTo(-idx * ITEM_H, idx);
    }
  };

  DrumPicker.prototype.getIndex = function() {
    var idx = Math.round(-this.currentY / ITEM_H);
    return Math.max(0, Math.min(this.items.length - 1, idx));
  };

  DrumPicker.prototype.getValue = function() {
    return this.items[this.getIndex()];
  };

  DrumPicker.prototype.setItems = function(newItems, keepValue) {
    var oldValue = this.getValue();
    this.items = newItems.slice();
    this._renderItems();
    // Yeni listede eski değer var mı?
    var newIdx = 0;
    if (keepValue) {
      for (var i = 0; i < this.items.length; i++) {
        if (this.items[i] === oldValue) { newIdx = i; break; }
        if (this.items[i] > oldValue) { newIdx = Math.max(0, i - 1); break; }
        newIdx = this.items.length - 1;
      }
    }
    this.currentY = -newIdx * ITEM_H;
    this._clamp();
    this._applyTransform();
    this._updateClasses();
  };

  // Dışarıya aç
  window.DrumPicker = DrumPicker;
  window.PICKER_MONTHS = MONTHS;
  window.PICKER_YEARS = YEARS;
  window.getDaysInMonth = getDaysInMonth;
  window.buildDays = buildDays;

})();
