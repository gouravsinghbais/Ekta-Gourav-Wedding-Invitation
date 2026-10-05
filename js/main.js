(function () {
  'use strict';
  var C = window.WEDDING;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var MONTHS = ['JANUARY','FEBRUARY','MARCH','APRIL','MAY','JUNE','JULY','AUGUST','SEPTEMBER','OCTOBER','NOVEMBER','DECEMBER'];
  function safe(fn) { try { return fn(); } catch (e) { return null; } }

  /* ---------- Map / venue ---------- */
  $('#dirBtn').href = C.venue.map;
  $('#venueAddr').innerHTML = '<b>' + esc(C.venue.title) + '</b>' + C.venue.lines.map(function (l) { return esc(l); }).join('<br>');
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  /* ---------- Theme list (dress code) ---------- */
  $('#themeList').innerHTML = C.events.map(function (e) {
    return '<div class="th-row"><span class="th-l"><b>' + esc(e.name) + '</b><small>' + e.day + ' November · ' + e.time + '</small></span><span class="th-r">' + esc(e.theme) + '</span></div>';
  }).join('');

  /* ---------- Calendar ---------- */
  (function () {
    $('#calMonth').textContent = MONTHS[C.month]; $('#calYear').textContent = C.year;
    var first = new Date(C.year, C.month, 1).getDay();      // 0 = Sun
    var offset = (first + 6) % 7;                           // Monday first
    var total = new Date(C.year, C.month + 1, 0).getDate();
    var h = '';
    for (var i = 0; i < offset; i++) h += '<span></span>';
    var heart = '<svg viewBox="0 0 64 58"><path d="M32 53 C12 38 4 28 4 18 C4 9 10 4 17 4 C24 4 29 8 32 14 C35 8 40 4 47 4 C54 4 60 9 60 18 C60 28 52 38 32 53Z"/></svg>';
    for (var d = 1; d <= total; d++) {
      var hl = C.days.indexOf(d) > -1;
      h += '<span class="' + (hl ? 'hl' : '') + '">' + d + (hl ? heart : '') + '</span>';
    }
    $('#calGrid').innerHTML = h;
  })();

  /* ---------- Timeline ---------- */
  var ICONS = {
    sun: '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10 46 H54"/><path d="M20 46 A12 12 0 0 1 44 46"/><path d="M32 18 V26 M16 24 L21 29 M48 24 L43 29 M8 38 H15 M49 38 H56"/><path d="M14 52 C20 48 26 52 32 50 C38 52 44 48 50 52" /><path d="M24 56 C28 52 30 54 32 56 C34 54 36 52 40 56"/><circle cx="32" cy="36" r="4" opacity=".6"/></svg>',
    coupe: (function () {
      function c(x, y) { return '<path d="M' + (x - 8) + ',' + y + ' Q' + (x - 8) + ',' + (y + 8) + ' ' + x + ',' + (y + 9) + ' Q' + (x + 8) + ',' + (y + 8) + ' ' + (x + 8) + ',' + y + 'Z"/><path d="M' + x + ',' + (y + 9) + ' V' + (y + 13) + ' M' + (x - 5) + ',' + (y + 13) + ' H' + (x + 5) + '"/>'; }
      return '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">' + c(32, 8) + c(22, 22) + c(42, 22) + c(12, 36) + c(32, 36) + c(52, 36) + '<path d="M6 52 H58 M10 56 H54"/></svg>';
    })(),
    temple: '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M8 56 H56 M12 56 V40 H52 V56"/><path d="M16 40 L32 10 L48 40"/><path d="M20 34 H44 M24 28 H40 M27 22 H37"/><path d="M32 10 V4 L38 6 L32 8"/><path d="M26 56 V46 Q32 38 38 46 V56"/><path d="M16 56 V46 M48 56 V46" opacity=".6"/><path d="M29 17 V22 M35 17 V22" opacity=".6"/></svg>',
    table: '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="32" cy="36" rx="20" ry="6"/><path d="M12 36 C10 46 8 54 6 58 H58 C56 54 54 46 52 36"/><path d="M20 42 C20 50 18 54 16 58 M32 43 V58 M44 42 C44 50 46 54 48 58"/><path d="M32 30 V14 M26 20 H38 M26 20 V16 M38 20 V16 M32 14 V10"/><circle cx="26" cy="13" r="1.6"/><circle cx="38" cy="13" r="1.6"/><circle cx="32" cy="8" r="1.6"/><path d="M6 36 C2 28 6 22 12 24 M58 36 C62 28 58 22 52 24" opacity=".7"/></svg>'
  };
  var tlWrap = $('#timeline'), chipsEl = $('#chips');
  var tlPath = null, heartEl = null, tlLen = 0, dayYs = [];
  var CHIP_DAYS = [22, 23, 24, 25, 26];
  var MON = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

  function buildTimeline() {
    var W = tlWrap.clientWidth, TOP = 30;
    chipsEl.innerHTML = CHIP_DAYS.map(function (d) {
      var ok = C.days.indexOf(d) > -1;
      return '<button class="chip ' + (ok ? '' : 'dis') + '" data-d="' + d + '"' + (ok ? '' : ' tabindex="-1" disabled') + '>' + d + '</button>';
    }).join('');
    // entries: day header + its events
    var entries = [];
    C.days.forEach(function (d) {
      entries.push({ type: 'day', day: d });
      C.events.filter(function (e) { return e.day === d; }).forEach(function (e) { entries.push({ type: 'ev', e: e }); });
    });
    var xR = W * 0.66, xL = W * 0.34, y = 150, sideIdx = 0, pts = [], prevType = null;
    var first = $('.chip[data-d="' + C.days[0] + '"]', chipsEl).getBoundingClientRect(), wr = tlWrap.getBoundingClientRect();
    var sx = first.left - wr.left + first.width / 2;
    pts.push([sx, 54]);
    entries.forEach(function (en, i) {
      if (i > 0) y += (en.type === 'day') ? 150 : (prevType === 'day' ? 120 : 180);
      en.y = y;
      if (en.type === 'day') { en.x = W * 0.5; sideIdx = 0; }
      else { en.left = sideIdx % 2 === 0; en.x = en.left ? xR : xL; sideIdx++; }
      pts.push([en.x, y]); prevType = en.type;
    });
    var H = y + 150;
    pts.push([W * 0.5, H - 30]);
    tlWrap.style.height = H + 'px';
    $$('.tl-item,.tl-day,.tl-svg,.tl-heart', tlWrap).forEach(function (n) { n.remove(); });
    var d = 'M' + pts[0][0] + ',' + pts[0][1];
    for (var i = 1; i < pts.length; i++) {
      var a = pts[i - 1], b = pts[i], dy = b[1] - a[1];
      d += ' C' + a[0] + ',' + (a[1] + dy * 0.55) + ' ' + b[0] + ',' + (b[1] - dy * 0.55) + ' ' + b[0] + ',' + b[1];
    }
    var ns = 'http://www.w3.org/2000/svg';
    var svg = document.createElementNS(ns, 'svg'); svg.setAttribute('class', 'tl-svg'); svg.setAttribute('width', W); svg.setAttribute('height', H);
    tlPath = document.createElementNS(ns, 'path'); tlPath.setAttribute('d', d); svg.appendChild(tlPath);
    tlWrap.appendChild(svg); tlLen = tlPath.getTotalLength();
    dayYs = [];
    entries.forEach(function (en) {
      var el = document.createElement('div');
      if (en.type === 'day') {
        el.className = 'tl-day';
        el.innerHTML = '<span>' + en.day + ' ' + MON[C.month] + '</span>';
        el.style.left = en.x + 'px'; el.style.top = en.y + 'px';
        dayYs.push({ day: en.day, y: en.y });
      } else {
        var e = en.e;
        el.className = 'tl-item ' + (en.left ? 'l' : 'r');
        el.innerHTML = '<div class="ic">' + (ICONS[e.icon] || '') + '</div><div class="tx"><h4>' + esc(e.name) + '</h4><span class="tm">' + e.time + '</span><span class="th">Dress code: ' + esc(e.theme) + '</span></div>';
        el.style.top = (en.y - 44) + 'px';
        if (en.left) { el.style.left = '14px'; el.style.right = (W - en.x + 28) + 'px'; } else { el.style.left = (en.x + 28) + 'px'; el.style.right = '14px'; }
      }
      tlWrap.appendChild(el);
    });
    heartEl = document.createElement('div'); heartEl.className = 'tl-heart';
    heartEl.innerHTML = '<svg viewBox="0 0 64 58"><use href="#heart"/></svg><b>' + C.days[0] + '</b>';
    tlWrap.appendChild(heartEl);
    placeHeart(); observeItems();
  }
  function placeHeart() {
    if (!tlPath) return;
    var r = tlWrap.getBoundingClientRect(), vh = window.innerHeight;
    var p = (vh * 0.55 - r.top - 40) / (r.height - 140);
    p = Math.max(0, Math.min(1, p));
    var pt = tlPath.getPointAtLength(p * tlLen);
    heartEl.style.left = pt.x + 'px'; heartEl.style.top = pt.y + 'px';
    heartEl.style.transform = 'scale(' + (p < 0.02 ? 1 : 0.8) + ')';
    var cur = C.days[0]; dayYs.forEach(function (d) { if (pt.y >= d.y - 40) cur = d.day; });
    var bEl = heartEl.querySelector('b'); if (bEl.textContent != cur) bEl.textContent = cur;
  }
  chipsEl.addEventListener('click', function (e) {
    var b = e.target.closest('.chip'); if (!b || b.disabled) return;
    var t = dayYs.filter(function (d) { return d.day === +b.dataset.d; })[0]; if (!t) return;
    var top = tlWrap.getBoundingClientRect().top + window.pageYOffset + t.y - 120;
    window.scrollTo({ top: top, behavior: 'smooth' });
  });

  /* ---------- Scroll reveal ---------- */
  var io = 'IntersectionObserver' in window ? new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.18, rootMargin: '0px 0px -6% 0px' }) : null;
  function observeItems() { $$('.tl-item').forEach(function (n) { io ? io.observe(n) : n.classList.add('in'); }); }
  $$('.sr').forEach(function (n) { io ? io.observe(n) : n.classList.add('in'); });

  window.addEventListener('scroll', placeHeart, { passive: true });
  window.addEventListener('resize', function () { if (!document.body.classList.contains('locked')) buildTimeline(); });

  /* ---------- Countdown ---------- */
  var target = new Date(C.countdownTarget).getTime();
  function tick() {
    var d = Math.max(0, target - Date.now()), s = Math.floor(d / 1000);
    function p(n) { return n < 10 ? '0' + n : '' + n; }
    $('#cd').textContent = Math.floor(s / 86400); $('#ch').textContent = p(Math.floor(s % 86400 / 3600));
    $('#cm').textContent = p(Math.floor(s % 3600 / 60)); $('#cs').textContent = p(s % 60);
  }
  tick(); setInterval(tick, 1000);

  /* ---------- Music (mp3 if present, else soft synthesized melody) ---------- */
  var wave = $('#wave');
  for (var k = 0; k < 28; k++) {
    var b = document.createElement('i'); var h = 6 + Math.abs(Math.sin(k * 0.55)) * 20 + (k % 3) * 2;
    b.style.setProperty('--h', h.toFixed(0) + 'px'); b.style.setProperty('--d', (-(k * 0.13)).toFixed(2) + 's'); wave.appendChild(b);
  }
  var audio = null, ctx = null, synthTimer = null, playing = false, mode = null;
  function synthStart() {
    var AC = window.AudioContext || window.webkitAudioContext; if (!AC) return;
    ctx = ctx || new AC(); if (ctx.state === 'suspended') ctx.resume();
    var master = ctx.createGain(); master.gain.value = 0.0; master.connect(ctx.destination);
    master.gain.linearRampToValueAtTime(0.5, ctx.currentTime + 2);
    var dl = ctx.createDelay(1); dl.delayTime.value = 0.38; var fb = ctx.createGain(); fb.gain.value = 0.38; dl.connect(fb); fb.connect(dl);
    var wet = ctx.createGain(); wet.gain.value = 0.45; dl.connect(wet); wet.connect(master);
    synthStart.master = master;
    var scale = [293.66, 329.63, 369.99, 440, 493.88, 587.33, 659.25, 739.99];   // D major pentatonic-ish
    var chords = [[146.83, 220, 293.66], [123.47, 185, 246.94], [98, 146.83, 196], [110, 164.81, 220]];
    var step = 0, pat = [0, 2, 4, 5, 4, 2, 3, 1, 0, 2, 4, 7, 5, 4, 2, 3];
    function note(f, t, dur, vol, type) {
      var o = ctx.createOscillator(), g = ctx.createGain(); o.type = type || 'sine'; o.frequency.value = f;
      g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol, t + 0.02); g.gain.exponentialRampToValueAtTime(0.0008, t + dur);
      o.connect(g); g.connect(master); g.connect(dl); o.start(t); o.stop(t + dur + 0.05);
    }
    function sched() {
      var t = ctx.currentTime + 0.05, ch = chords[Math.floor(step / 16) % chords.length];
      note(scale[pat[step % 16]], t, 1.8, 0.16, 'triangle');
      if (step % 8 === 0) ch.forEach(function (f, i) { note(f, t + i * 0.04, 4.2, 0.07, 'sine'); });
      step++;
    }
    sched(); synthTimer = setInterval(sched, 560);
  }
  function synthStop() { clearInterval(synthTimer); synthTimer = null; if (synthStart.master && ctx) { var m = synthStart.master; m.gain.cancelScheduledValues(ctx.currentTime); m.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.5); setTimeout(function () { try { m.disconnect(); } catch (e) { } }, 700); } }
  function setUI(on) {
    playing = on; $('#musicBtn').classList.toggle('paused', !on); $('#musicBtn').setAttribute('aria-label', on ? 'Pause music' : 'Play music');
    $('#coverSound').classList.toggle('off', !on);
  }
  function toast(msg) {
    var t = document.getElementById('toast');
    if (!t) { t = document.createElement('div'); t.id = 'toast'; document.body.appendChild(t); }
    t.textContent = msg; t.className = 'show'; clearTimeout(toast.h); toast.h = setTimeout(function () { t.className = ''; }, 6000);
  }
  /* YouTube (hidden player, official embed API) */
  var yt = null, ytReady = false, ytWant = false, ytFailed = false;
  if (C.youtubeId) {
    var holder = document.createElement('div'); holder.id = 'ytHolder'; holder.setAttribute('aria-hidden', 'true');
    holder.innerHTML = '<div id="ytp"></div>'; document.body.appendChild(holder);
    window.onYouTubeIframeAPIReady = function () {
      yt = new YT.Player('ytp', {
        width: '200', height: '200', videoId: C.youtubeId,
        playerVars: { origin: /^https?:/.test(location.protocol) ? location.origin : undefined, autoplay: 0, controls: 0, loop: 1, playlist: C.youtubeId, playsinline: 1, rel: 0, modestbranding: 1, start: C.youtubeStart || 0 },
        events: {
          onReady: function () { ytReady = true; yt.setVolume(80); if (ytWant) yt.playVideo(); },
          onStateChange: function (e) { if (e.data === 0) { yt.seekTo(C.youtubeStart || 0); yt.playVideo(); } },
          onError: function (e) {
            ytFailed = true; setUI(false);
            var why = (e.data === 101 || e.data === 150) ? 'The video owner has disabled playback on other websites.' : (e.data === 153 || e.data === 152 ? 'YouTube blocked the player here. Open the site from a web address (not a file on your computer).' : 'The song could not be loaded (code ' + e.data + ').');
            toast(why);
            if (C.fallbackMelody) { mode = 'synth'; synthStart(); setUI(true); }
          }
        }
      });
    };
    var tag = document.createElement('script'); tag.src = 'https://www.youtube.com/iframe_api'; tag.async = true; document.head.appendChild(tag);
    tag.onerror = function () { ytFailed = true; setUI(false); toast('Could not reach YouTube. Check your internet connection.'); };
    if (location.protocol === 'file:') { setTimeout(function () { if (!ytReady) toast('Song needs the site to be opened from a web address (not a local file).'); }, 4000); }
    mode = 'yt';
  }
  function play() {
    if (mode === 'yt' && !ytFailed) { ytWant = true; if (ytReady) yt.playVideo(); setUI(true); return; }
    if (mode === 'yt' && ytFailed) { if (C.fallbackMelody) mode = 'synth'; else { setUI(false); return; } }
    if (mode === 'synth') { synthStart(); setUI(true); return; }
    if (!audio) {
      audio = new Audio(C.music); audio.loop = true; audio.volume = 0.7;
      audio.addEventListener('error', function () { setUI(false); toast('Music file could not be loaded.'); if (C.fallbackMelody) { mode = 'synth'; synthStart(); setUI(true); } });
    }
    var p = audio.play();
    if (p && p.then) p.then(function () { mode = 'file'; setUI(true); }).catch(function () { setUI(false); });
    else { mode = 'file'; setUI(true); }
    setUI(true);
  }
  function pause() { if (mode === 'yt') { ytWant = false; if (ytReady) yt.pauseVideo(); } else if (mode === 'synth') synthStop(); else if (audio) audio.pause(); setUI(false); }
  $('#musicBtn').addEventListener('click', function () { playing ? pause() : play(); });
  $('#coverSound').addEventListener('click', function () { playing ? pause() : play(); });
  document.addEventListener('visibilitychange', function () { if (document.hidden && playing) { pause(); setUI(true); document.addEventListener('visibilitychange', function r() { if (!document.hidden) { document.removeEventListener('visibilitychange', r); play(); } }); } });
  setUI(false);

  /* ---------- Open the envelope ---------- */
  var cover = $('#cover'), opened = false;
  function openInvite() {
    if (opened) return; opened = true; cover.classList.add('open'); play();
    setTimeout(function () {
      document.body.classList.remove('locked'); window.scrollTo(0, 0); buildTimeline();
      cover.classList.add('gone'); $('#dock').classList.add('show');
      setTimeout(function () { cover.classList.add('removed'); }, 1100);
    }, 3300);
  }
  $('#seal').addEventListener('click', openInvite);
  cover.addEventListener('click', function (e) { if (!e.target.closest('#coverSound')) openInvite(); });
  // pre-build timeline (hidden) so layout is ready; rebuilt on open
  buildTimeline();
  if (location.hash === '#open') { openInvite(); }
})();
