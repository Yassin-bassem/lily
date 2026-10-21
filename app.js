/* ===================================================
   A CELESTIAL LOVE STORY FOR LILY ❤️
   Interactive Engine & Romance Experience
   =================================================== */

// ===================================================
// SUPABASE CONFIGURATION
// To save Lily's responses and notes to Supabase:
// 1. Create a free project at https://supabase.com
// 2. Put your Project URL and Anon Key below:
// ===================================================
const SUPABASE_URL = 'https://wsekqkigtcdpcosczbzn.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndzZWtxa2lndGNkcGNvc2N6YnpuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI0MzA4NjMsImV4cCI6MjA3ODAwNjg2M30.DfxBmWQTjwkgCfcix-Xbx7zJymu-C6ZlESpMdj4a268';

// Global State
const START_DATE = new Date('2023-10-24T00:00:00');
const YOUTUBE_VIDEO_ID = 'ypgL1DC87T0';

let ytPlayer = null;
let ytPlayerReady = false;
let isAudioPlaying = false;
let audioContext = null;
let supabaseClient = null;

// Initialize Supabase Client if credentials are provided
function initSupabase() {
  if (SUPABASE_URL && SUPABASE_ANON_KEY && window.supabase) {
    try {
      supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
      console.log('Supabase client connected successfully!');
    } catch (e) {
      console.warn('Supabase init error:', e);
    }
  }
}

// Save response to Supabase and LocalStorage
async function saveLilyData(data) {
  // Always persist locally
  const history = JSON.parse(localStorage.getItem('lily_responses_history') || '[]');
  history.push({ ...data, saved_at: new Date().toISOString() });
  localStorage.setItem('lily_responses_history', JSON.stringify(history));

  // If Supabase is configured, send via Supabase JS client or REST fetch
  if (SUPABASE_URL && SUPABASE_ANON_KEY) {
    try {
      if (supabaseClient) {
        const { error } = await supabaseClient.from('lily_responses').insert([data]);
        if (error) throw error;
      } else {
        // Direct REST endpoint fallback (requires zero libraries)
        const res = await fetch(`${SUPABASE_URL}/rest/v1/lily_responses`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
            'Prefer': 'return=minimal'
          },
          body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      }
      return { success: true, cloud: true };
    } catch (err) {
      console.warn('Could not sync to Supabase (saved locally):', err);
      return { success: true, cloud: false, error: err };
    }
  }

  return { success: true, cloud: false };
}

// ===================================================
// 1. RELATIONSHIP STOPWATCH (SINCE 24/10/2023)
// ===================================================
function initLoveClock() {
  const daysEl = document.getElementById('days-count');
  const hoursEl = document.getElementById('hours-count');
  const minutesEl = document.getElementById('minutes-count');
  const secondsEl = document.getElementById('seconds-count');
  const milestoneEl = document.getElementById('milestone-text');

  function updateClock() {
    const now = new Date();
    const diff = now - START_DATE;

    if (diff < 0) return;

    const totalSeconds = Math.floor(diff / 1000);
    const days = Math.floor(totalSeconds / (3600 * 24));
    const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (daysEl) daysEl.textContent = days.toLocaleString();
    if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
    if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, '0');
    if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, '0');

    if (milestoneEl) {
      const totalMinutes = Math.floor(totalSeconds / 60);
      const estHeartbeats = (totalMinutes * 75).toLocaleString();
      milestoneEl.textContent = `${days} Days together · Over ${estHeartbeats} heartbeats dedicated only to Lily ❤️`;
    }
  }

  updateClock();
  setInterval(updateClock, 1000);
}

// ===================================================
// 2. YOUTUBE MUSIC & WEB AUDIO SYNTH ENGINE
// ===================================================
window.onYouTubeIframeAPIReady = function() {
  ytPlayer = new YT.Player('youtube-player', {
    height: '0',
    width: '0',
    videoId: YOUTUBE_VIDEO_ID,
    playerVars: {
      autoplay: 0,
      controls: 0,
      loop: 1,
      playlist: YOUTUBE_VIDEO_ID,
      enablejsapi: 1,
      origin: window.location.origin
    },
    events: {
      onReady: onPlayerReady,
      onStateChange: onPlayerStateChange
    }
  });
};

function onPlayerReady() {
  ytPlayerReady = true;
  ytPlayer.setVolume(90);
}

function onPlayerStateChange(event) {
  const widget = document.getElementById('music-player-widget');
  const playIcon = document.getElementById('ctrl-icon-play');
  const pauseIcon = document.getElementById('ctrl-icon-pause');

  if (event.data === YT.PlayerState.PLAYING) {
    isAudioPlaying = true;
    widget.classList.remove('paused');
    if (playIcon) playIcon.classList.add('hidden');
    if (pauseIcon) pauseIcon.classList.remove('hidden');
  } else if (event.data === YT.PlayerState.PAUSED || event.data === YT.PlayerState.ENDED) {
    isAudioPlaying = false;
    widget.classList.add('paused');
    if (playIcon) playIcon.classList.remove('hidden');
    if (pauseIcon) pauseIcon.classList.add('hidden');
  }
}

function playRomanticChime() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    if (!audioContext) audioContext = new AudioContext();
    if (audioContext.state === 'suspended') audioContext.resume();

    const notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, idx) => {
      const osc = audioContext.createOscillator();
      const gain = audioContext.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, audioContext.currentTime + idx * 0.12);
      gain.gain.setValueAtTime(0, audioContext.currentTime + idx * 0.12);
      gain.gain.linearRampToValueAtTime(0.12, audioContext.currentTime + idx * 0.12 + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + idx * 0.12 + 1.2);

      osc.connect(gain);
      gain.connect(audioContext.destination);

      osc.start(audioContext.currentTime + idx * 0.12);
      osc.stop(audioContext.currentTime + idx * 0.12 + 1.3);
    });
  } catch (err) {
    console.warn("Chime AudioContext error:", err);
  }
}

function startMusic() {
  playRomanticChime();
  if (ytPlayer && ytPlayerReady) {
    try {
      ytPlayer.unMute();
      ytPlayer.setVolume(90);
      ytPlayer.playVideo();
      isAudioPlaying = true;
    } catch (e) {
      console.warn("YouTube play error:", e);
    }
  } else {
    const checkInterval = setInterval(() => {
      if (ytPlayer && ytPlayerReady) {
        clearInterval(checkInterval);
        ytPlayer.unMute();
        ytPlayer.playVideo();
        isAudioPlaying = true;
      }
    }, 500);
  }
}

function toggleAudio() {
  if (!ytPlayer || !ytPlayerReady) return;
  if (isAudioPlaying) {
    ytPlayer.pauseVideo();
  } else {
    ytPlayer.playVideo();
  }
}

function toggleMute() {
  if (!ytPlayer || !ytPlayerReady) return;
  const soundIcon = document.getElementById('ctrl-icon-sound');
  const mutedIcon = document.getElementById('ctrl-icon-muted');

  if (ytPlayer.isMuted()) {
    ytPlayer.unMute();
    if (soundIcon) soundIcon.classList.remove('hidden');
    if (mutedIcon) mutedIcon.classList.add('hidden');
  } else {
    ytPlayer.mute();
    if (soundIcon) soundIcon.classList.add('hidden');
    if (mutedIcon) mutedIcon.classList.remove('hidden');
  }
}

function initMusicControls() {
  const playBtn = document.getElementById('audio-play-pause');
  const muteBtn = document.getElementById('audio-mute-toggle');
  const volumeSlider = document.getElementById('audio-volume-slider');
  const toggleBtn = document.getElementById('player-toggle-btn');
  const widget = document.getElementById('music-player-widget');

  if (playBtn) playBtn.addEventListener('click', toggleAudio);
  if (muteBtn) muteBtn.addEventListener('click', toggleMute);

  if (volumeSlider) {
    volumeSlider.addEventListener('input', (e) => {
      if (ytPlayer && ytPlayerReady) {
        ytPlayer.setVolume(e.target.value);
        if (e.target.value == 0) {
          ytPlayer.mute();
        } else if (ytPlayer.isMuted()) {
          ytPlayer.unMute();
        }
      }
    });
  }

  if (toggleBtn && widget) {
    toggleBtn.addEventListener('click', () => {
      widget.classList.toggle('collapsed');
    });
  }
}

// ===================================================
// 3. INTRO ENVELOPE & CINEMATIC PORTAL
// ===================================================
function initIntro() {
  const introOverlay = document.getElementById('intro-overlay');
  const enterBtn = document.getElementById('enter-button');
  const envelope = document.getElementById('envelope-trigger');
  const waxSeal = document.getElementById('wax-seal-button');

  function openPortal() {
    startMusic();
    burstConfettiAndHearts(window.innerWidth / 2, window.innerHeight / 2, 40);

    if (introOverlay) {
      introOverlay.classList.add('dismissed');
      setTimeout(() => {
        introOverlay.style.display = 'none';
      }, 1000);
    }

    const widget = document.getElementById('music-player-widget');
    if (widget) {
      widget.classList.remove('collapsed');
    }
  }

  if (enterBtn) enterBtn.addEventListener('click', openPortal);
  if (waxSeal) waxSeal.addEventListener('click', (e) => {
    e.stopPropagation();
    openPortal();
  });
  if (envelope) envelope.addEventListener('click', openPortal);
}

// ===================================================
// 4. HIGH-PERFORMANCE ATMOSPHERIC CANVAS (NO LAG)
// ===================================================
function initAmbientCanvas() {
  const canvas = document.getElementById('ambient-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);
  const isMobile = window.innerWidth < 768;

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  // Balanced star count without expensive shadowBlur
  const starsCount = isMobile ? 60 : 100;
  const stars = [];
  for (let i = 0; i < starsCount; i++) {
    stars.push({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.3 + 0.5,
      alpha: Math.random() * 0.7 + 0.3,
      speed: Math.random() * 0.015 + 0.005,
      direction: Math.random() > 0.5 ? 1 : -1
    });
  }

  // Drastically reduced petal count for silky 60 FPS performance
  const petalCount = isMobile ? 6 : 12;
  const petals = [];
  for (let i = 0; i < petalCount; i++) {
    petals.push({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 10 + 8,
      speedY: Math.random() * 0.8 + 0.5,
      speedX: Math.random() * 0.8 - 0.4,
      rotation: Math.random() * 360,
      rotSpeed: (Math.random() - 0.5) * 1.0,
      oscillationSpeed: Math.random() * 0.02 + 0.01,
      oscillationPhase: Math.random() * Math.PI * 2,
      opacity: Math.random() * 0.5 + 0.4,
      color: Math.random() > 0.4 ? '#f43f5e' : '#ec4899'
    });
  }

  function drawPetal(p) {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate((p.rotation * Math.PI) / 180);
    ctx.fillStyle = p.color;
    ctx.globalAlpha = p.opacity;

    // Lightweight smooth petal oval
    ctx.beginPath();
    ctx.ellipse(0, 0, p.size * 0.5, p.size, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    // Fast, crisp stars (no shadowBlur to avoid CPU thrashing)
    for (let i = 0; i < stars.length; i++) {
      const s = stars[i];
      s.alpha += s.speed * s.direction;
      if (s.alpha > 0.95 || s.alpha < 0.2) s.direction *= -1;

      ctx.fillStyle = `rgba(255, 255, 255, ${s.alpha})`;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
      ctx.fill();
    }

    // Smooth falling petals
    for (let i = 0; i < petals.length; i++) {
      const p = petals[i];
      p.oscillationPhase += p.oscillationSpeed;
      p.x += Math.sin(p.oscillationPhase) * 0.8 + p.speedX;
      p.y += p.speedY;
      p.rotation += p.rotSpeed;

      if (p.y > height + 20) {
        p.y = -20;
        p.x = Math.random() * width;
      }
      if (p.x > width + 20) p.x = -20;
      if (p.x < -20) p.x = width + 20;

      drawPetal(p);
    }

    requestAnimationFrame(animate);
  }

  animate();
}

// ===================================================
// 5. THROTTLED CURSOR SPARKLES (NO SCROLL LAG)
// ===================================================
function initCursorSparkles() {
  // Disable sparkle tracking on touch devices to ensure 100% fluid mobile scrolling
  if ('ontouchstart' in window || navigator.maxTouchPoints > 0) return;

  const canvas = document.getElementById('sparkle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particles = [];
  const emojis = ['💖', '✨', '🌸', '🤍'];
  let lastSpawnTime = 0;

  function createSparkle(x, y) {
    const now = Date.now();
    if (now - lastSpawnTime < 80) return; // Throttled to 80ms interval
    lastSpawnTime = now;

    particles.push({
      x: x,
      y: y,
      vx: (Math.random() - 0.5) * 1.5,
      vy: -1.2 - Math.random() * 1.0,
      size: 14,
      emoji: emojis[Math.floor(Math.random() * emojis.length)],
      opacity: 1,
      life: 0.03
    });
  }

  window.addEventListener('pointermove', (e) => {
    createSparkle(e.clientX, e.clientY);
  });

  function animateSparkles() {
    ctx.clearRect(0, 0, width, height);

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.opacity -= p.life;

      if (p.opacity <= 0) {
        particles.splice(i, 1);
        continue;
      }

      ctx.save();
      ctx.globalAlpha = p.opacity;
      ctx.font = `${p.size}px serif`;
      ctx.fillText(p.emoji, p.x, p.y);
      ctx.restore();
    }

    requestAnimationFrame(animateSparkles);
  }

  animateSparkles();
}

// Particle/Heart Explosion Utility
function burstConfettiAndHearts(x, y, count = 30) {
  const canvas = document.getElementById('sparkle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const items = ['💖', '🌹', '✨', '💕', '💍', '🌸'];

  const burstParticles = [];
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 7 + 3;
    burstParticles.push({
      x: x,
      y: y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 2,
      gravity: 0.18,
      size: Math.random() * 16 + 12,
      char: items[Math.floor(Math.random() * items.length)],
      opacity: 1,
      fade: Math.random() * 0.02 + 0.015
    });
  }

  function stepBurst() {
    for (let i = burstParticles.length - 1; i >= 0; i--) {
      const bp = burstParticles[i];
      bp.x += bp.vx;
      bp.y += bp.vy;
      bp.vy += bp.gravity;
      bp.opacity -= bp.fade;

      if (bp.opacity <= 0) {
        burstParticles.splice(i, 1);
        continue;
      }

      ctx.save();
      ctx.globalAlpha = bp.opacity;
      ctx.font = `${bp.size}px serif`;
      ctx.fillText(bp.char, bp.x, bp.y);
      ctx.restore();
    }

    if (burstParticles.length > 0) {
      requestAnimationFrame(stepBurst);
    }
  }

  stepBurst();
}

// ===================================================
// 6. INTERACTIVE TOYS & THE LILY LOVE MACHINE
// ===================================================
function initInteractiveToys() {
  // Toy 1: Infinite Love Meter
  const measureBtn = document.getElementById('measure-love-btn');
  const meterFill = document.getElementById('love-meter-fill');
  const meterLabel = document.getElementById('love-meter-text');
  const meterMsg = document.getElementById('meter-result-message');

  if (measureBtn && meterFill && meterLabel) {
    measureBtn.addEventListener('click', () => {
      measureBtn.disabled = true;
      meterFill.style.width = '0%';
      meterLabel.textContent = 'Measuring...';
      meterMsg.textContent = 'Analyzing every beat of my heart... 💓';

      let progress = 0;
      const interval = setInterval(() => {
        progress += 4;
        if (progress <= 100) {
          meterFill.style.width = `${progress}%`;
          meterLabel.textContent = `${progress}%`;
        } else if (progress <= 999) {
          meterFill.style.width = '100%';
          meterLabel.textContent = `${progress * 100}% OVERLOAD!`;
          meterFill.style.background = 'linear-gradient(90deg, #ec4899, #f43f5e, #fbbf24, #38bdf8)';
        } else {
          clearInterval(interval);
          meterLabel.textContent = '∞ INFINITE LOVE (OFF THE CHARTS)';
          meterMsg.innerHTML = '💖 <strong>Error: The scale broke!</strong> My love for Lily cannot be measured by human numbers. It reaches into eternity!';
          measureBtn.disabled = false;
          burstConfettiAndHearts(window.innerWidth / 2, window.innerHeight * 0.7, 40);
        }
      }, 30);
    });
  }

  // Toy 2: Secret Love Note Generator
  const newNoteBtn = document.getElementById('new-note-btn');
  const noteBox = document.getElementById('random-note-box');

  const notesList = [
    "Lily, you are the most precious girl in my universe. Always remember that.",
    "Whenever my phone rings and it says 'Lily ❤️', my heart skips a beat.",
    "عارفة لما تبقي في بال حد في كل دقيقة؟ أنتي كدة في بالي وفي قلبي.",
    "I fell in love with who you are inside, and every day I discover more reasons to adore you.",
    "أنا ضهرك ومعاكي في كل خطوة.. عمري ما هسيب إيدك أبداً.",
    "You are my answered prayer, my favorite coincidence, and my forever choice.",
    "Those 4:55 AM calls in the car are moments I would trade the world for.",
    "Your happiness is my goal, your smile is my peace, and your heart is my home.",
    "Since 24/10/2023, my life started for real. Thank you for being in it.",
    "You don't need to be anyone else — you are completely perfect just the way you are Lily."
  ];

  if (newNoteBtn && noteBox) {
    newNoteBtn.addEventListener('click', () => {
      let currentText = noteBox.textContent;
      let nextNote = notesList[Math.floor(Math.random() * notesList.length)];
      while (nextNote === currentText && notesList.length > 1) {
        nextNote = notesList[Math.floor(Math.random() * notesList.length)];
      }

      noteBox.style.opacity = '0';
      noteBox.style.transform = 'translateY(10px)';
      setTimeout(() => {
        noteBox.textContent = nextNote;
        noteBox.style.opacity = '1';
        noteBox.style.transform = 'translateY(0)';
      }, 250);

      const rect = newNoteBtn.getBoundingClientRect();
      burstConfettiAndHearts(rect.left + rect.width / 2, rect.top, 15);
    });
  }

  // Toy 3: Question for Lily (YES or NO)
  const yesBtn = document.getElementById('proposal-yes-btn');
  const noBtn = document.getElementById('proposal-no-btn');
  const celebrationMsg = document.getElementById('proposal-celebration');
  const savedBadge = document.getElementById('proposal-saved-badge');

  let noClickCount = 0;

  if (yesBtn) {
    yesBtn.addEventListener('click', async () => {
      celebrationMsg.innerHTML = "🎉💍 SHE SAID YES! Lily, you just made me the happiest man on this planet! Forever together ❤️";
      burstConfettiAndHearts(window.innerWidth / 2, window.innerHeight * 0.6, 60);
      playRomanticChime();

      if (savedBadge) savedBadge.textContent = 'Saving your answer... ⏳';

      const res = await saveLilyData({
        answer: 'YES',
        type: 'proposal_answer',
        created_at: new Date().toISOString()
      });

      if (savedBadge) {
        savedBadge.textContent = res.cloud
          ? 'Saved to our love vault in Supabase ❤️'
          : 'Saved in our hearts forever ❤️';
      }
    });
  }

  if (noBtn) {
    noBtn.addEventListener('click', async () => {
      noClickCount++;
      if (noClickCount === 1) {
        celebrationMsg.innerHTML = "Wait Lily, are you sure? 🥺 Think about our 4 AM drives and our coffee dates!";
        noBtn.style.transform = 'scale(0.9)';
      } else {
        celebrationMsg.innerHTML = "Even if you click No, my heart will keep loving you unconditionally anyway! ❤️";
        if (savedBadge) savedBadge.textContent = 'Saving... ⏳';

        const res = await saveLilyData({
          answer: 'NO',
          type: 'proposal_answer',
          created_at: new Date().toISOString()
        });

        if (savedBadge) {
          savedBadge.textContent = res.cloud
            ? 'Saved to Supabase ❤️'
            : 'Saved in our hearts ❤️';
        }
      }
    });
  }

  // Toy 4: A Note From Lily To Me
  const noteInput = document.getElementById('lily-note-input');
  const sendNoteBtn = document.getElementById('send-lily-note-btn');
  const sendBtnText = document.getElementById('send-note-btn-text');
  const noteStatus = document.getElementById('lily-note-status');
  const moodChips = document.querySelectorAll('.mood-chip');

  let selectedMood = 'I love you so much ❤️';

  moodChips.forEach(chip => {
    chip.addEventListener('click', () => {
      moodChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      selectedMood = chip.getAttribute('data-mood') || 'I love you so much ❤️';
    });
  });

  if (sendNoteBtn && noteInput) {
    sendNoteBtn.addEventListener('click', async () => {
      const text = noteInput.value.trim();
      if (!text) {
        if (noteStatus) noteStatus.textContent = 'Please write a few words for me first, my Lily! 💌';
        return;
      }

      sendNoteBtn.disabled = true;
      if (sendBtnText) sendBtnText.textContent = 'Sending to my heart... ⏳';

      const res = await saveLilyData({
        note: text,
        mood: selectedMood,
        type: 'lily_note',
        created_at: new Date().toISOString()
      });

      burstConfettiAndHearts(window.innerWidth / 2, window.innerHeight * 0.7, 40);
      playRomanticChime();

      if (sendBtnText) sendBtnText.textContent = 'Send Another Note 💌';
      sendNoteBtn.disabled = false;

      if (noteStatus) {
        noteStatus.innerHTML = res.cloud
          ? '💖 <strong>Your note was sent and saved to Supabase!</strong> I will treasure every word forever.'
          : '💖 <strong>Your note was saved with all my love!</strong> I will cherish it forever.';
      }

      noteInput.value = '';
    });
  }

  // Hero Heart Shower Button
  const heroShowerBtn = document.getElementById('hero-heart-burst-btn');
  if (heroShowerBtn) {
    heroShowerBtn.addEventListener('click', () => {
      const rect = heroShowerBtn.getBoundingClientRect();
      burstConfettiAndHearts(rect.left + rect.width / 2, rect.top, 35);
    });
  }

  // Fireworks Button in Footer
  const fireworksBtn = document.getElementById('fireworks-btn');
  if (fireworksBtn) {
    fireworksBtn.addEventListener('click', () => {
      for (let i = 0; i < 3; i++) {
        setTimeout(() => {
          const x = Math.random() * window.innerWidth;
          const y = Math.random() * (window.innerHeight * 0.7);
          burstConfettiAndHearts(x, y, 30);
        }, i * 350);
      }
    });
  }

  // Back to top button
  const backToTopBtn = document.getElementById('back-to-top-btn');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}

// ===================================================
// 7. LIGHTBOX & MEDIA CONTROLS
// ===================================================
function initLightbox() {
  const modal = document.getElementById('lightbox-modal');
  const backdrop = document.getElementById('lightbox-backdrop');
  const closeBtn = document.getElementById('lightbox-close');
  const mediaContainer = document.getElementById('lightbox-media-container');
  const titleEl = document.getElementById('lightbox-title');
  const captionEl = document.getElementById('lightbox-caption');
  const heartBtn = document.getElementById('lightbox-heart-btn');

  const cards = document.querySelectorAll('.gallery-card:not(.featured-video-card)');
  const confessionImg = document.getElementById('confession-zoomable');

  function openLightbox(src, title, caption, isVideo = false) {
    if (!modal || !mediaContainer) return;
    mediaContainer.innerHTML = '';

    if (isVideo) {
      const video = document.createElement('video');
      video.src = src;
      video.controls = true;
      video.autoplay = true;
      mediaContainer.appendChild(video);
    } else {
      const img = document.createElement('img');
      img.src = src;
      img.alt = title;
      mediaContainer.appendChild(img);
    }

    if (titleEl) titleEl.textContent = title;
    if (captionEl) captionEl.textContent = caption;

    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!modal) return;
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (mediaContainer) mediaContainer.innerHTML = '';
  }

  cards.forEach((card) => {
    card.addEventListener('click', () => {
      const img = card.querySelector('img');
      const title = card.getAttribute('data-title') || 'Memory with Lily';
      const caption = card.getAttribute('data-caption') || '';
      if (img) openLightbox(img.src, title, caption);
    });
  });

  if (confessionImg) {
    confessionImg.parentElement.addEventListener('click', () => {
      openLightbox(
        confessionImg.src,
        'The Confession That Spoke My Soul',
        'August 22, 2024 · "عمري ما حبيت واحدة كدة.. أنا بحبها هي ذات نفسها حرفياً.. وبدعي ربنا تكون دي نصيبي — اسمها ليلي ❤️"'
      );
    });
  }

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  if (backdrop) backdrop.addEventListener('click', closeLightbox);

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
      closeLightbox();
    }
  });

  if (heartBtn) {
    heartBtn.addEventListener('click', () => {
      const rect = heartBtn.getBoundingClientRect();
      burstConfettiAndHearts(rect.left + rect.width / 2, rect.top, 25);
    });
  }

  // Featured Video Player logic
  const featVideo = document.getElementById('featured-video');
  const vidPlayBtn = document.getElementById('vid-play-btn');
  const vidSoundBtn = document.getElementById('vid-sound-btn');

  if (featVideo && vidPlayBtn) {
    vidPlayBtn.addEventListener('click', () => {
      if (featVideo.paused) {
        featVideo.play();
        vidPlayBtn.textContent = '⏸ Pause Clip';
        if (ytPlayer && ytPlayerReady && isAudioPlaying) {
          ytPlayer.pauseVideo();
        }
      } else {
        featVideo.pause();
        vidPlayBtn.textContent = '▶ Play Clip';
      }
    });

    featVideo.addEventListener('ended', () => {
      vidPlayBtn.textContent = '▶ Play Clip';
      if (ytPlayer && ytPlayerReady) {
        ytPlayer.playVideo();
      }
    });
  }

  if (featVideo && vidSoundBtn) {
    featVideo.muted = true;
    vidSoundBtn.textContent = '🔇 Sound Muted';
    vidSoundBtn.addEventListener('click', () => {
      featVideo.muted = !featVideo.muted;
      vidSoundBtn.textContent = featVideo.muted ? '🔇 Sound Muted' : '🔊 Sound On';
    });
  }
}

// ===================================================
// 8. SCROLL SPY & NAVIGATION HIGHLIGHT
// ===================================================
function initScrollSpy() {
  const navItems = document.querySelectorAll('.nav-item');
  const sections = document.querySelectorAll('section, footer');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navItems.forEach((link) => {
            if (link.getAttribute('href') === `#${id}`) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });
        }
      });
    },
    { threshold: 0.3 }
  );

  sections.forEach((sec) => observer.observe(sec));
}

// ===================================================
// INITIALIZATION
// ===================================================
document.addEventListener('DOMContentLoaded', () => {
  initSupabase();
  initLoveClock();
  initMusicControls();
  initIntro();
  initAmbientCanvas();
  initCursorSparkles();
  initInteractiveToys();
  initLightbox();
  initScrollSpy();

  console.log("For Lily website loaded smoothly with infinite love ❤️");
});
