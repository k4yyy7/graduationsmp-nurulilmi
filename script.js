
  /* ══ AOS — SMOOTH CONFIG ══════════════════════════════ */
  AOS.init({
    duration: 1400,
    offset: 120,
    once: true,
    easing: 'ease-out-cubic',
    anchorPlacement: 'top-bottom'
  });

  /* ══ BACKGROUND MUSIC — AUTO-PLAY + LOOP ════════════ */
  const bgMusic  = document.getElementById('bg-music');
  const musicBtn = document.getElementById('music-toggle');
  let musicReady = false;
  let isPlaying  = false;

  function startMusic() {
    if (musicReady) return;
    musicReady = true;

    bgMusic.volume = 0;
    bgMusic.play().then(() => {
      isPlaying = true;
      musicBtn.classList.remove('paused');
      musicBtn.classList.add('playing');
      /* Fade in volume smoothly */
      let vol = 0;
      const fadeIn = setInterval(() => {
        vol += 0.05;
        if (vol >= 0.45) { vol = 0.45; clearInterval(fadeIn); }
        bgMusic.volume = vol;
      }, 100);
    }).catch(() => {
      /* Browser blocked — will retry on user interaction */
      musicReady = false;
    });
  }

  /* Attempt autoplay immediately */
  startMusic();

  /* Retry on first user interaction if blocked */
  function tryStartOnInteraction() {
    if (!musicReady) {
      startMusic();
    }
    document.removeEventListener('click', tryStartOnInteraction);
    document.removeEventListener('touchstart', tryStartOnInteraction);
    document.removeEventListener('scroll', tryStartOnInteraction);
  }
  document.addEventListener('click', tryStartOnInteraction, { once: false });
  document.addEventListener('touchstart', tryStartOnInteraction, { once: false });
  document.addEventListener('scroll', tryStartOnInteraction, { once: false });

  /* Show music button after a short delay */
  setTimeout(() => {
    musicBtn.classList.add('visible');
  }, 800);

  /* Music toggle */
  musicBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    if (isPlaying) {
      /* Smooth fade out */
      let vol = bgMusic.volume;
      const fadeOut = setInterval(() => {
        vol -= 0.05;
        if (vol <= 0) {
          vol = 0;
          bgMusic.pause();
          clearInterval(fadeOut);
        }
        bgMusic.volume = vol;
      }, 60);
      isPlaying = false;
      this.classList.add('paused');
      this.classList.remove('playing');
    } else {
      bgMusic.volume = 0;
      bgMusic.play().then(() => {
        isPlaying = true;
        this.classList.remove('paused');
        this.classList.add('playing');
        let vol = 0;
        const fadeIn = setInterval(() => {
          vol += 0.05;
          if (vol >= 0.45) { vol = 0.45; clearInterval(fadeIn); }
          bgMusic.volume = vol;
        }, 100);
      });
    }
  });

  /* Keep music playing when it ends (loop fallback) */
  bgMusic.addEventListener('ended', function() {
    this.currentTime = 0;
    this.play();
  });

  /* ══ Falling particles ══════════════════════════════ */
  (function spawnCaps() {
    const container = document.getElementById('cap-container');
    const icons = ['fa-star','fa-star','fa-shoe-prints','fa-star-half-stroke','fa-shoe-prints','fa-star'];
    for (let i = 0; i < 26; i++) {
      const el = document.createElement('i');
      el.className = 'cap-particle fa-solid ' + icons[i % icons.length];
      el.style.cssText = [
        'left:'              + (Math.random() * 100) + '%',
        'top:0',
        'font-size:'         + (0.4 + Math.random() * 0.7) + 'rem',
        'animation-duration:' + (11 + Math.random() * 12) + 's',
        'animation-delay:'   + (Math.random() * 16) + 's',
        'will-change:transform,opacity',
      ].join(';');
      container.appendChild(el);
    }
  })();

  /* ── Show scroll cue ─── */
  setTimeout(() => {
    const cue = document.getElementById('scroll-cue');
    if (cue) cue.style.opacity = '1';
  }, 1600);

  /* ── Floating dock reveal ─── */
  const dock = document.getElementById('float-dock');

  function revealDock() {
    dock.classList.add('visible');
    document.getElementById('sambutan').scrollIntoView({ behavior: 'smooth' });
  }

  document.getElementById('btn-open-inv').addEventListener('click', revealDock);

  /* ── Dock position handler ─── */
  let dockRevealedByScroll = false;

  function handleDockPosition() {
    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;
    const docHeight = document.documentElement.scrollHeight;

    if (!dockRevealedByScroll && scrollY > windowHeight * 0.5) {
      dock.classList.add('visible');
      dockRevealedByScroll = true;
    }

    const footerThreshold = 200;
    const distanceFromBottom = docHeight - (scrollY + windowHeight);

    if (distanceFromBottom < footerThreshold) {
      dock.classList.add('lifted');
    } else {
      dock.classList.remove('lifted');
    }
  }

  window.addEventListener('scroll', handleDockPosition, { passive: true });
  window.addEventListener('resize', handleDockPosition, { passive: true });

  /* ══ COUNTDOWN — with smooth number tick ════════════ */
  (function initCountdown() {
    const target = new Date('2026-06-13T07:00:00+07:00').getTime();
    const els = {
      days:  document.getElementById('cd-days'),
      hours: document.getElementById('cd-hours'),
      mins:  document.getElementById('cd-mins'),
      secs:  document.getElementById('cd-secs'),
    };
    let prev = { days: '', hours: '', mins: '', secs: '' };

    function tickNum(el, newVal, key) {
      if (prev[key] !== newVal) {
        prev[key] = newVal;
        el.classList.add('tick');
        setTimeout(() => {
          el.textContent = newVal;
          el.classList.remove('tick');
        }, 150);
      }
    }

    function tick() {
      const diff = target - Date.now();
      if (diff <= 0) {
        Object.keys(els).forEach(k => { els[k].textContent = '00'; });
        return;
      }
      tickNum(els.days,  String(Math.floor(diff / 86400000)).padStart(2,'0'), 'days');
      tickNum(els.hours, String(Math.floor((diff % 86400000) / 3600000)).padStart(2,'0'), 'hours');
      tickNum(els.mins,  String(Math.floor((diff % 3600000) / 60000)).padStart(2,'0'), 'mins');
      tickNum(els.secs,  String(Math.floor((diff % 60000) / 1000)).padStart(2,'0'), 'secs');
    }
    tick(); setInterval(tick, 1000);
  })();

  /* ══ LIGHTBOX ══════════════════════════════════════ */
  const lightbox  = document.getElementById('lightbox');
  const lbImg     = document.getElementById('lightbox-img');
  const lbCaption = document.getElementById('lightbox-caption');

  function openLightbox(src, caption) {
    lbImg.src = src;
    lbCaption.textContent = caption || '';
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }
  document.getElementById('lightbox-close').addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });

  /* ══ RSVP SUBMIT ════════════════════════════════════ */
  document.getElementById('rsvp-form').addEventListener('submit', function(e) {
    e.preventDefault();
    this.style.display = 'none';
    document.getElementById('rsvp-success').style.display = 'block';
  });


    tailwind.config = {
      theme: {
        extend: {
          colors: {
            ivory:        '#FAF8F5',
            'ivory-dark': '#EFECE6',
            navy:         '#0B0F19',
            'navy-muted': '#1A2238',
            'navy-light': '#2E3A59',
            gold:         '#C5A059',
            'gold-light': '#E5C78F',
            'gold-pale':  '#F7F3E8',
          },
          fontFamily: {
            cinzel:  ['Cinzel',  'serif'],
            jakarta: ['Plus Jakarta Sans', 'sans-serif'],
          },
        },
      },
    };
  