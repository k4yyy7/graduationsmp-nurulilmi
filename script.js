
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

  /* ══ RSVP SUBMIT WITH FORMSPREE + SUCCESS ANIMATION ════════════ */
  const rsvpForm = document.getElementById('rsvp-form');
  const rsvpSuccess = document.getElementById('rsvp-success');

  if (rsvpForm) {
    rsvpForm.addEventListener('submit', async function(e) {
      e.preventDefault();

      const formData = new FormData(rsvpForm);
      const submitBtn = rsvpForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-2"></i>Mengirim...';
      submitBtn.disabled = true;

      try {
        const response = await fetch(rsvpForm.action, {
          method: 'POST',
          body: formData,
          headers: { 'Accept': 'application/json' }
        });

        if (response.ok) {
          // Hide form and show success with animation
          rsvpForm.style.display = 'none';
          rsvpSuccess.style.display = 'block';

          // Trigger confetti burst
          createConfetti();

          // Save to localStorage to remember user has submitted
          localStorage.setItem('rsvpSubmitted', 'true');

          // Update dock button if exists
          updateDockRSVPButton();
        } else {
          throw new Error('Form submission failed');
        }
      } catch (error) {
        alert('Maaf, terjadi kesalahan. Silakan coba lagi.');
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
      }
    });
  }

  /* Confetti Burst Animation */
  function createConfetti() {
    const container = document.createElement('div');
    container.className = 'confetti-container';
    document.body.appendChild(container);

    const colors = ['#C5A059', '#E5C78F', '#D4B06A', '#9B7B3A', '#F7F3E8'];
    const confettiCount = 60;

    for (let i = 0; i < confettiCount; i++) {
      const confetti = document.createElement('div');
      confetti.className = 'confetti';
      confetti.style.left = Math.random() * 100 + '%';
      confetti.style.top = '-10px';
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      confetti.style.animationDelay = Math.random() * 0.5 + 's';
      confetti.style.animationDuration = (2 + Math.random() * 2) + 's';
      container.appendChild(confetti);
    }

    // Remove container after animation
    setTimeout(() => {
      container.remove();
    }, 4000);
  }

  /* Check if user already submitted - DISABLED FOR NOW */
  // function checkRSVPStatus() {
  //   if (localStorage.getItem('rsvpSubmitted') === 'true' && rsvpForm && rsvpSuccess) {
  //     rsvpForm.style.display = 'none';
  //     rsvpSuccess.style.display = 'block';
  //   }
  // }

  // Check on page load - disabled
  // checkRSVPStatus();

  /* Update dock RSVP button when form is submitted */
  function updateDockRSVPButton() {
    const rsvpDockItem = document.querySelector('.dock-item[href="#rsvp"]');
    if (rsvpDockItem) {
      rsvpDockItem.classList.add('rsvp-submitted');
    }
  }

  // Also check localStorage on load for dock indicator only
  if (localStorage.getItem('rsvpSubmitted') === 'true') {
    updateDockRSVPButton();
  }

  // Add CSS for submitted state in dock
  const dockStyle = document.createElement('style');
  dockStyle.textContent = `
    .dock-item.rsvp-submitted {
      color: #4ade80 !important;
    }
    .dock-item.rsvp-submitted span {
      color: rgba(74, 222, 128, 0.8) !important;
    }
    .dock-item.rsvp-submitted::after {
      content: '';
      position: absolute;
      top: 0.2rem;
      right: 0.2rem;
      width: 0.5rem;
      height: 0.5rem;
      background: #4ade80;
      border-radius: 50%;
      animation: dotPulse 2s ease-in-out infinite;
    }
    @keyframes dotPulse {
      0%, 100% { transform: scale(1); opacity: 1; }
      50% { transform: scale(1.3); opacity: 0.7; }
    }
  `;
  document.head.appendChild(dockStyle);


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
  