/* ===================================================
   A CELESTIAL LOVE STORY FOR LILY ❤️
   Interactive Engine & Romance Experience
   =================================================== */

// ===================================================
// SUPABASE CONFIGURATION
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

// Persistent User State (Always initialized so neither field is ever null)
let lilySession = {
  answer: localStorage.getItem('lily_chosen_answer') || 'YES',
  note: localStorage.getItem('lily_written_note') || '(Always by your side ❤️)',
  mood: localStorage.getItem('lily_chosen_mood') || 'I love you so much ❤️'
};

// Save unified response to Supabase & LocalStorage (Guarantees NO NULLS)
async function saveUnifiedLilyData() {
  const payload = {
    answer: lilySession.answer || 'YES',
    note: lilySession.note || '(Always by your side ❤️)',
    mood: lilySession.mood || 'I love you so much ❤️',
    type: 'lily_response',
    created_at: new Date().toISOString()
  };

  // 1. Always save in localStorage
  localStorage.setItem('lily_chosen_answer', payload.answer);
  localStorage.setItem('lily_written_note', payload.note);
  localStorage.setItem('lily_chosen_mood', payload.mood);

  // 2. Save directly to Supabase via standard REST API
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/lily_responses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Prefer': 'return=representation'
      },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      throw new Error(`Supabase returned status ${res.status}`);
    }

    const data = await res.json();
    console.log('Saved to Supabase with zero nulls:', data);
    return { success: true, cloud: true, data };
  } catch (err) {
    console.warn('Saved locally (Supabase sync failed):', err);
    return { success: true, cloud: false, error: err };
  }
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
// 2. YOUTUBE MUSIC & AUDIO ENGINE (MOBILE & DESKTOP)
// ===================================================
window.onYouTubeIframeAPIReady = function() {
  ytPlayer = new YT.Player('youtube-player', {
    height: '100%',
    width: '100%',
    videoId: YOUTUBE_VIDEO_ID,
    playerVars: {
      autoplay: 1,
      playsinline: 1, // MANDATORY for mobile iOS Safari & Chrome
      controls: 0,
      disablekb: 1,
      fs: 0,
      loop: 1,
      playlist: YOUTUBE_VIDEO_ID,
      enablejsapi: 1,
      modestbranding: 1
    },
    events: {
      onReady: onPlayerReady,
      onStateChange: onPlayerStateChange
    }
  });
};

function onPlayerReady() {
  ytPlayerReady = true;
  try {
    ytPlayer.setVolume(100);
  } catch (e) {}
}

function onPlayerStateChange(event) {
  const widget = document.getElementById('music-player-widget');
  const playIcon = document.getElementById('ctrl-icon-play');
  const pauseIcon = document.getElementById('ctrl-icon-pause');
  const mobilePrompt = document.getElementById('mobile-sound-tap-prompt');

  if (event.data === YT.PlayerState.PLAYING) {
    isAudioPlaying = true;
    if (widget) widget.classList.remove('paused');
    if (playIcon) playIcon.classList.add('hidden');
    if (pauseIcon) pauseIcon.classList.remove('hidden');
    if (mobilePrompt) mobilePrompt.classList.add('hidden');
  } else {
    isAudioPlaying = false;
    if (widget) widget.classList.add('paused');
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
  } catch (err) {}
}

// User-gesture activated music play (guaranteed to unlock audio on iOS and Android)
function triggerDirectAudioPlayback() {
  playRomanticChime();
  if (ytPlayer && ytPlayerReady && typeof ytPlayer.playVideo === 'function') {
    try {
      ytPlayer.unMute();
      ytPlayer.setVolume(100);
      ytPlayer.playVideo();
      isAudioPlaying = true;
    } catch (e) {
      console.warn("Direct play notice:", e);
    }
  }

  // If mobile browser blocked unmuted autoplay, show tap helper
  setTimeout(() => {
    if (!isAudioPlaying) {
      const mobilePrompt = document.getElementById('mobile-sound-tap-prompt');
      if (mobilePrompt) mobilePrompt.classList.remove('hidden');
    }
  }, 1200);
}

function toggleAudio() {
  if (!ytPlayer || !ytPlayerReady) return;
  if (isAudioPlaying) {
    ytPlayer.pauseVideo();
  } else {
    ytPlayer.unMute();
    ytPlayer.setVolume(100);
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
  const mobilePrompt = document.getElementById('mobile-sound-tap-prompt');

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

  if (mobilePrompt) {
    mobilePrompt.addEventListener('click', () => {
      triggerDirectAudioPlayback();
      mobilePrompt.classList.add('hidden');
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
    triggerDirectAudioPlayback();

    if (introOverlay) {
      introOverlay.classList.add('dismissed');
      setTimeout(() => {
        introOverlay.style.display = 'none';
      }, 900);
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
// 4. INTERACTIVE TOYS & THE LILY LOVE MACHINE
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
      }, 200);
    });
  }

  // Toy 3: Question for Lily (YES or NO)
  const yesBtn = document.getElementById('proposal-yes-btn');
  const noBtn = document.getElementById('proposal-no-btn');
  const celebrationMsg = document.getElementById('proposal-celebration');
  const savedBadge = document.getElementById('proposal-saved-badge');
  const noteInput = document.getElementById('lily-note-input');

  let noClickCount = 0;

  if (yesBtn) {
    yesBtn.addEventListener('click', async () => {
      lilySession.answer = 'YES';
      if (noteInput && noteInput.value.trim()) {
        lilySession.note = noteInput.value.trim();
      }

      celebrationMsg.innerHTML = "🎉💍 SHE SAID YES! Lily, you just made me the happiest man on this planet! Forever together ❤️";
      playRomanticChime();

      if (savedBadge) savedBadge.textContent = 'Saving answer & note to Supabase... ⏳';

      const res = await saveUnifiedLilyData();

      if (savedBadge) {
        savedBadge.textContent = res.cloud
          ? 'Saved to our love vault in Supabase ❤️ (Answer: YES)'
          : 'Saved in our hearts forever ❤️';
      }
    });
  }

  if (noBtn) {
    noBtn.addEventListener('click', async () => {
      noClickCount++;
      if (noClickCount === 1) {
        celebrationMsg.innerHTML = "Wait Lily, are you sure? 🥺 Think about our 4 AM drives and coffee dates!";
        noBtn.style.transform = 'scale(0.9)';
      } else {
        lilySession.answer = 'NO';
        if (noteInput && noteInput.value.trim()) {
          lilySession.note = noteInput.value.trim();
        }

        celebrationMsg.innerHTML = "Even if you click No, my heart will keep loving you unconditionally anyway! ❤️";
        if (savedBadge) savedBadge.textContent = 'Saving... ⏳';

        const res = await saveUnifiedLilyData();

        if (savedBadge) {
          savedBadge.textContent = res.cloud
            ? 'Saved to Supabase ❤️'
            : 'Saved in our hearts ❤️';
        }
      }
    });
  }

  // Toy 4: A Note From Lily To Me
  const sendNoteBtn = document.getElementById('send-lily-note-btn');
  const sendBtnText = document.getElementById('send-note-btn-text');
  const noteStatus = document.getElementById('lily-note-status');
  const moodChips = document.querySelectorAll('.mood-chip');

  moodChips.forEach(chip => {
    chip.addEventListener('click', () => {
      moodChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      lilySession.mood = chip.getAttribute('data-mood') || 'I love you so much ❤️';
    });
  });

  if (sendNoteBtn && noteInput) {
    sendNoteBtn.addEventListener('click', async () => {
      const text = noteInput.value.trim();
      if (!text) {
        if (noteStatus) noteStatus.textContent = 'Please write a few words for me first, my Lily! 💌';
        return;
      }

      lilySession.note = text;
      sendNoteBtn.disabled = true;
      if (sendBtnText) sendBtnText.textContent = 'Saving note & answer together... ⏳';

      const res = await saveUnifiedLilyData();
      playRomanticChime();

      if (sendBtnText) sendBtnText.textContent = 'Send Another Note 💌';
      sendNoteBtn.disabled = false;

      if (noteStatus) {
        noteStatus.innerHTML = res.cloud
          ? `💖 <strong>Saved to Supabase!</strong> Both your answer (${lilySession.answer}) and your note were saved together ❤️`
          : '💖 <strong>Your note was saved with all my love!</strong> I will cherish it forever.';
      }

      if (savedBadge) {
        savedBadge.textContent = `Saved in Supabase: Answer (${lilySession.answer}) + Note ❤️`;
      }
    });
  }

  // Hero Heart Shower Button
  const heroShowerBtn = document.getElementById('hero-heart-burst-btn');
  if (heroShowerBtn) {
    heroShowerBtn.addEventListener('click', playRomanticChime);
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
// 5. LIGHTBOX & MEDIA CONTROLS
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
    heartBtn.addEventListener('click', playRomanticChime);
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
// 6. SCROLL SPY & NAVIGATION HIGHLIGHT
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
  initLoveClock();
  initMusicControls();
  initIntro();
  initInteractiveToys();
  initLightbox();
  initScrollSpy();

  console.log("For Lily website loaded with infinite love ❤️");
});
