/* =============================================
   SCRIPT.JS - Portafolio Coquette para May
   ============================================= */

'use strict';

// =============================================
// ⚙️ CONFIGURACIÓN PERSONALIZABLE
// =============================================

// 🔐 CÓDIGO DE ACCESO (6 dígitos)
const ACCESS_CODE = '180526';

// 🌸 PALABRAS PARA MAY - al hacer clic en adornos (explosión GRANDE)
const MAY_WORDS_BIG = [
  'May 💕', 'Para May 🌸', 'Te queremos May', 'May love ✨',
  'Mi May 💗', 'Te amo May', 'My beautiful May', 'Siempre tuya May',
  'Eres mi sol May', 'May mi cielito 🥹', 'Eres un sueño May',
  'May mi amor eterno 💞', 'I love you May', 'May eres perfecta 🌺',
  'Mi vida entera May', 'Tú y yo May 💝', 'May mi tesoro 🎀',
  'Infinito amor May', 'May mi niñita bella 🌸', 'Para siempre May 💗',
];

// 🌸 PALABRAS PARA MAY - al hacer clic en fondo (explosión PEQUEÑA)
const MAY_WORDS_SMALL = [
  'May', 'Amor', 'May 🌸', '💕 May', 'May ✨',
  'Beso', 'May ❤️', 'Mi reina May', 'May 💗', '💖 May',
  'Siempre May', 'May 🎀', 'Amor May', 'May bella',
];

// 🎵 PLAYLIST DE MÚSICA
// Configura aquí tus canciones. Puedes usar rutas locales (ej: "assets/cancion.mp3")
// o URLs externas directas a archivos mp3.
const PLAYLIST = [
  {
    name: '♪ Canción 1 para May ♪',
    src: 'assets/musica1.mp3',
    // Reemplaza con tu archivo de música
  },
  {
    name: '♪ Canción 2 para May ♪',
    src: 'assets/musica2.mp3',
  },
  {
    name: '♪ Canción 3 para May ♪',
    src: 'assets/musica3.mp3',
  },
  {
    name: '♪ Canción 4 para May ♪',
    src: 'assets/musica4.mp3',
  },
  {
    name: '♪ Canción 5 para May ♪',
    src: 'assets/musica5.mp3',
  },
  {
    name: '♪ Canción 6 para May ♪',
    src: 'assets/musica6.mp3',
  },
  {
    name: '♪ Canción 7 para May ♪',
    src: 'assets/musica7.mp3',
  },
  {
    name: '♪ Canción 8 para May ♪',
    src: 'assets/musica8.mp3',
  },
];

// 🖼️ NÚMERO TOTAL DE IMÁGENES
const TOTAL_SLIDES = 50;

// =============================================
// EMOJIS DE PARTÍCULAS
// =============================================
const EMOJI_BIG = ['💖','💗','💘','💕','💓','✨','🎀','🌸','🦋','🥹','💝','💞','🌺','🌟','⭐','🍒','💫'];
const EMOJI_SMALL = ['💗','✨','🌸','💕','⭐','🌟','💖','🎀'];

// Colores de las partículas
const PARTICLE_COLORS_BIG   = ['#ff69b4','#ff1493','#db2777','#f9a8d4','#c026d3','#e879f9','#fde68a','#fff'];
const PARTICLE_COLORS_SMALL = ['#ff69b4','#f9a8d4','#fda4af','#e9d5ff'];

// =============================================
// TRANSICIONES (array rotativo)
// =============================================
const TRANSITIONS = [
  { in: 'trans-fade-in',     out: 'trans-fade-out'     },
  { in: 'trans-slideRight-in', out: 'trans-slideRight-out' },
  { in: 'trans-slideLeft-in',  out: 'trans-slideLeft-out'  },
  { in: 'trans-zoom-in',     out: 'trans-zoom-out'     },
  { in: 'trans-blur-in',     out: 'trans-blur-out'     },
  { in: 'trans-flip-in',     out: 'trans-flip-out'     },
  { in: 'trans-rotate-in',   out: 'trans-rotate-out'   },
  { in: 'trans-slideUp-in',  out: 'trans-slideUp-out'  },
  { in: 'trans-diagonal-in', out: 'trans-diagonal-out' },
  { in: 'trans-glitch-in',   out: 'trans-glitch-out'   },
];

// =============================================
// VARIABLES DE ESTADO
// =============================================
let currentSlide   = 0;
let isTransitioning = false;
let transitionIndex = 0;

let currentSong    = 0;
let isPlaying      = false;
let musicMinimized = false;

// =============================================
// DOM REFS
// =============================================
const lockScreen     = document.getElementById('lockScreen');
const mainPortfolio  = document.getElementById('mainPortfolio');
const confettiCont   = document.getElementById('confettiContainer');
const lockBtn        = document.getElementById('lockBtn');
const lockError      = document.getElementById('lockError');
const lockDigits     = Array.from({ length: 6 }, (_, i) => document.getElementById('d' + i));

const carousel       = document.getElementById('carousel');
const slides         = carousel ? Array.from(carousel.querySelectorAll('.slide')) : [];
const prevBtn        = document.getElementById('prevBtn');
const nextBtn        = document.getElementById('nextBtn');
const progressText   = document.getElementById('progressText');
const progressBar    = document.getElementById('progressBar');
const dotsContainer  = document.getElementById('dotsContainer');

const audioPlayer    = document.getElementById('audioPlayer');
const playPauseBtn   = document.getElementById('playPauseBtn');
const prevSongBtn    = document.getElementById('prevSongBtn');
const nextSongBtn    = document.getElementById('nextSongBtn');
const songName       = document.getElementById('songName');
const songNum        = document.getElementById('songNum');
const currentTimeEl  = document.getElementById('currentTime');
const totalTimeEl    = document.getElementById('totalTime');
const musicProgFill  = document.getElementById('musicProgressFill');
const musicProgThumb = document.getElementById('musicProgressThumb');
const musicProgBar   = document.getElementById('musicProgressBar');
const volumeSlider   = document.getElementById('volumeSlider');
const musicPlayer    = document.getElementById('musicPlayer');
const musicToggleBtn = document.getElementById('musicToggleBtn');

const lockFloating   = document.getElementById('lockFloatingHearts');

// =============================================
// PANTALLA DE ACCESO
// =============================================

// Navegación entre inputs de dígitos
lockDigits.forEach((input, idx) => {
  input.addEventListener('input', (e) => {
    const val = e.target.value.replace(/\D/g, '').slice(-1);
    e.target.value = val;
    if (val && idx < 5) {
      lockDigits[idx + 1].focus();
    }
    // Auto-verificar si están todos llenos
    const code = lockDigits.map(d => d.value).join('');
    if (code.length === 6) setTimeout(verifyCode, 80);
  });

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Backspace' && !e.target.value && idx > 0) {
      lockDigits[idx - 1].focus();
      lockDigits[idx - 1].value = '';
    }
    if (e.key === 'Enter') verifyCode();
  });

  // Solo permitir números
  input.addEventListener('keypress', (e) => {
    if (!/[0-9]/.test(e.key) && !e.ctrlKey) e.preventDefault();
  });
});

lockBtn.addEventListener('click', verifyCode);

function verifyCode() {
  const code = lockDigits.map(d => d.value).join('');
  if (code === ACCESS_CODE) {
    onCodeCorrect();
  } else {
    lockError.classList.add('visible');
    lockError.style.animation = 'none';
    setTimeout(() => { lockError.style.animation = ''; }, 10);
    lockDigits.forEach(d => { d.value = ''; d.style.borderColor = '#be185d'; });
    setTimeout(() => {
      lockDigits.forEach(d => { d.style.borderColor = ''; });
    }, 800);
    lockDigits[0].focus();
  }
}

function onCodeCorrect() {
  lockError.classList.remove('visible');
  // Lanzar confeti
  launchConfetti();
  // Ocultar lock con animación
  lockScreen.style.animation = 'fadeOut 0.8s ease 0.5s forwards';
  setTimeout(() => {
    lockScreen.style.display = 'none';
    mainPortfolio.classList.remove('hidden');
    mainPortfolio.style.animation = 'fadeIn 0.8s ease forwards';
    // Iniciar música automáticamente
    initMusic();
    // Iniciar corazones flotantes
    startFloatingHearts();
    // Preload de imágenes
    preloadImages();
  }, 1300);
}

// =============================================
// CONFETI
// =============================================
function launchConfetti() {
  const colors = ['#ff69b4','#f9a8d4','#fda4af','#e9d5ff','#c4b5fd','#fde68a','#a7f3d0','#fbcfe8'];
  for (let i = 0; i < 120; i++) {
    setTimeout(() => {
      const el = document.createElement('div');
      el.className = 'confetti-piece';
      el.style.left = Math.random() * 100 + 'vw';
      el.style.background = colors[Math.floor(Math.random() * colors.length)];
      el.style.width  = (Math.random() * 10 + 5) + 'px';
      el.style.height = (Math.random() * 10 + 5) + 'px';
      el.style.borderRadius = Math.random() > 0.5 ? '50%' : '3px';
      el.style.animationDuration = (Math.random() * 2 + 1.5) + 's';
      el.style.animationDelay = Math.random() * 0.5 + 's';
      confettiCont.appendChild(el);
      setTimeout(() => el.remove(), 3500);
    }, i * 10);
  }
}

// =============================================
// CORAZONES FLOTANTES DE FONDO
// =============================================
function startFloatingHearts() {
  const hearts = ['💗','💕','🌸','✨','💖','🎀','🌺'];
  function spawnHeart() {
    const el = document.createElement('div');
    el.className = 'lock-float-heart';
    el.textContent = hearts[Math.floor(Math.random() * hearts.length)];
    el.style.left = Math.random() * 100 + 'vw';
    el.style.animationDuration = (Math.random() * 6 + 7) + 's';
    el.style.fontSize = (Math.random() * 16 + 14) + 'px';
    el.style.opacity = (Math.random() * 0.4 + 0.3).toFixed(2);
    el.style.zIndex = '2';
    el.style.position = 'fixed';
    el.style.bottom = '-40px';
    el.style.pointerEvents = 'none';
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 14000);
  }
  // Spawn inicial
  for (let i = 0; i < 8; i++) setTimeout(spawnHeart, i * 300);
  setInterval(spawnHeart, 600);
}

// Corazones en lock screen
function spawnLockHeart() {
  if (!lockScreen || lockScreen.style.display === 'none') return;
  const hearts = ['💗','💕','🌸','✨','💖'];
  const el = document.createElement('div');
  el.className = 'lock-float-heart';
  el.textContent = hearts[Math.floor(Math.random() * hearts.length)];
  el.style.left = Math.random() * 100 + '%';
  el.style.animationDuration = (Math.random() * 5 + 6) + 's';
  el.style.fontSize = (Math.random() * 14 + 12) + 'px';
  if (lockFloating) lockFloating.appendChild(el);
  setTimeout(() => el.remove(), 12000);
}
for (let i = 0; i < 10; i++) setTimeout(spawnLockHeart, i * 200);
setInterval(spawnLockHeart, 400);

// =============================================
// GALERÍA / CAROUSEL
// =============================================

function buildDots() {
  if (!dotsContainer) return;
  dotsContainer.innerHTML = '';
  for (let i = 0; i < TOTAL_SLIDES; i++) {
    const dot = document.createElement('div');
    dot.className = 'dot' + (i === 0 ? ' active' : '');
    dot.addEventListener('click', () => goToSlide(i));
    dotsContainer.appendChild(dot);
  }
}

function updateProgress() {
  const idx = currentSlide + 1;
  if (progressText) progressText.textContent = `Imagen ${idx} de ${TOTAL_SLIDES} 💗`;
  if (progressBar)  progressBar.style.width = (idx / TOTAL_SLIDES * 100) + '%';
  const dots = dotsContainer ? dotsContainer.querySelectorAll('.dot') : [];
  dots.forEach((d, i) => d.classList.toggle('active', i === currentSlide));
}

function getNextTransition() {
  const t = TRANSITIONS[transitionIndex % TRANSITIONS.length];
  transitionIndex++;
  return t;
}

function goToSlide(newIndex, direction) {
  if (isTransitioning || newIndex === currentSlide) return;
  if (newIndex < 0) newIndex = TOTAL_SLIDES - 1;
  if (newIndex >= TOTAL_SLIDES) newIndex = 0;

  isTransitioning = true;
  const trans = getNextTransition();
  const oldSlide = slides[currentSlide];
  const newSlide = slides[newIndex];

  if (!oldSlide || !newSlide) {
    currentSlide = newIndex;
    isTransitioning = false;
    updateProgress();
    return;
  }

  // Animar slide saliente
  oldSlide.style.display = 'flex';
  oldSlide.classList.add(trans.out);

  // Mostrar y animar slide entrante
  newSlide.style.display = 'flex';
  newSlide.classList.add(trans.in);
  newSlide.classList.add('active');

  const duration = 550;
  setTimeout(() => {
    oldSlide.style.display = 'none';
    oldSlide.classList.remove('active', trans.out);
    newSlide.classList.remove(trans.in);
    currentSlide = newIndex;
    isTransitioning = false;
    updateProgress();
  }, duration);
}

function nextSlide() {
  goToSlide(currentSlide + 1, 'next');
  spawnParticlesOnNav();
}

function prevSlide() {
  goToSlide(currentSlide - 1, 'prev');
  spawnParticlesOnNav();
}

function spawnParticlesOnNav() {
  // Partículas desde el centro al cambiar de imagen
  const cx = window.innerWidth / 2;
  const cy = window.innerHeight / 2;
  spawnParticles(cx, cy, 12, 'small');
}

if (nextBtn) nextBtn.addEventListener('click', nextSlide);
if (prevBtn) prevBtn.addEventListener('click', prevSlide);

// Swipe táctil en el carousel
let touchStartX = 0;
let touchStartY = 0;

if (carousel) {
  carousel.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  }, { passive: true });

  carousel.addEventListener('touchend', (e) => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    const dy = e.changedTouches[0].clientY - touchStartY;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
      if (dx < 0) nextSlide();
      else prevSlide();
    }
  }, { passive: true });
}

// Teclado
document.addEventListener('keydown', (e) => {
  if (mainPortfolio.classList.contains('hidden')) return;
  if (e.key === 'ArrowRight' || e.key === 'ArrowDown') nextSlide();
  if (e.key === 'ArrowLeft'  || e.key === 'ArrowUp')   prevSlide();
});

// =============================================
// PRELOAD DE IMÁGENES
// =============================================
function preloadImages() {
  // Precargar las próximas 5 imágenes desde la actual
  for (let i = 1; i <= 5; i++) {
    const idx = (currentSlide + i) % TOTAL_SLIDES;
    const slide = slides[idx];
    if (slide) {
      const img = slide.querySelector('img');
      if (img && img.dataset.src) {
        img.src = img.dataset.src;
      }
    }
  }
}

// =============================================
// MÚSICA
// =============================================
function initMusic() {
  if (!audioPlayer || PLAYLIST.length === 0) return;
  loadSong(0);
  audioPlayer.volume = 0.7;

  // Intentar reproducir (puede necesitar interacción)
  const tryPlay = () => {
    audioPlayer.play().catch(() => {
      // Reproducción bloqueada hasta interacción
    });
    document.removeEventListener('click', tryPlay);
    document.removeEventListener('touchstart', tryPlay);
  };
  document.addEventListener('click', tryPlay, { once: true });
  document.addEventListener('touchstart', tryPlay, { once: true });
  // Intentar inmediatamente
  setTimeout(() => audioPlayer.play().catch(() => {}), 300);
}

function loadSong(idx) {
  if (!audioPlayer || PLAYLIST.length === 0) return;
  currentSong = ((idx % PLAYLIST.length) + PLAYLIST.length) % PLAYLIST.length;
  const song = PLAYLIST[currentSong];
  audioPlayer.src = song.src;
  if (songName) songName.textContent = song.name;
  if (songNum)  songNum.textContent  = `${currentSong + 1} / ${PLAYLIST.length}`;
  if (isPlaying) {
    audioPlayer.play().catch(() => {});
  }
  updateMusicProgress();
}

function togglePlayPause() {
  if (!audioPlayer) return;
  if (isPlaying) {
    audioPlayer.pause();
    isPlaying = false;
    if (playPauseBtn) playPauseBtn.textContent = '▶';
  } else {
    audioPlayer.play().catch(() => {});
    isPlaying = true;
    if (playPauseBtn) playPauseBtn.textContent = '⏸';
  }
}

function formatTime(secs) {
  if (isNaN(secs)) return '0:00';
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  return m + ':' + (s < 10 ? '0' : '') + s;
}

function updateMusicProgress() {
  if (!audioPlayer) return;
  const pct = audioPlayer.duration ? (audioPlayer.currentTime / audioPlayer.duration * 100) : 0;
  if (musicProgFill)  musicProgFill.style.width  = pct + '%';
  if (musicProgThumb) musicProgThumb.style.left   = pct + '%';
  if (currentTimeEl)  currentTimeEl.textContent  = formatTime(audioPlayer.currentTime);
  if (totalTimeEl)    totalTimeEl.textContent    = formatTime(audioPlayer.duration);
}

if (audioPlayer) {
  audioPlayer.addEventListener('timeupdate', updateMusicProgress);
  audioPlayer.addEventListener('ended', () => {
    // Pasar a siguiente canción automáticamente
    isPlaying = true;
    loadSong(currentSong + 1);
    audioPlayer.play().catch(() => {});
  });
  audioPlayer.addEventListener('play',  () => {
    isPlaying = true;
    if (playPauseBtn) playPauseBtn.textContent = '⏸';
  });
  audioPlayer.addEventListener('pause', () => {
    isPlaying = false;
    if (playPauseBtn) playPauseBtn.textContent = '▶';
  });
  audioPlayer.addEventListener('loadedmetadata', updateMusicProgress);
}

if (playPauseBtn) playPauseBtn.addEventListener('click', (e) => { e.stopPropagation(); togglePlayPause(); });
if (prevSongBtn)  prevSongBtn.addEventListener( 'click', (e) => { e.stopPropagation(); loadSong(currentSong - 1); if (isPlaying) audioPlayer.play().catch(() => {}); });
if (nextSongBtn)  nextSongBtn.addEventListener( 'click', (e) => { e.stopPropagation(); loadSong(currentSong + 1); if (isPlaying) audioPlayer.play().catch(() => {}); });

// Click en barra de progreso de música
if (musicProgBar) {
  const seekMusic = (e) => {
    e.stopPropagation();
    if (!audioPlayer || !audioPlayer.duration) return;
    const rect = musicProgBar.getBoundingClientRect();
    const pct  = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    audioPlayer.currentTime = pct * audioPlayer.duration;
  };
  musicProgBar.addEventListener('click', seekMusic);
  let dragging = false;
  musicProgBar.addEventListener('mousedown',  () => dragging = true);
  document.addEventListener('mouseup',        () => dragging = false);
  document.addEventListener('mousemove',  (e) => { if (dragging && musicProgBar) seekMusic(e); });
}

// Volumen
if (volumeSlider && audioPlayer) {
  volumeSlider.addEventListener('input', (e) => {
    e.stopPropagation();
    audioPlayer.volume = e.target.value;
    // Actualizar gradiente visual
    const pct = e.target.value * 100;
    e.target.style.background = `linear-gradient(90deg, var(--pink-main) ${pct}%, rgba(251,182,206,0.4) ${pct}%)`;
  });
}

// Toggle mostrar/ocultar reproductor
if (musicToggleBtn && musicPlayer) {
  musicToggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    musicMinimized = !musicMinimized;
    musicPlayer.classList.toggle('minimized', musicMinimized);
    musicToggleBtn.textContent = musicMinimized ? '🎵' : '🎵';
  });
}

// =============================================
// PARTÍCULAS
// =============================================
let particlePool = [];
const MAX_PARTICLES = 60;

function spawnParticles(x, y, count, type) {
  // type: 'big' | 'small' | 'nav'
  const isBig = type === 'big';
  const items = isBig ? EMOJI_BIG : EMOJI_SMALL;
  const words = isBig ? MAY_WORDS_BIG : MAY_WORDS_SMALL;
  const colors = isBig ? PARTICLE_COLORS_BIG : PARTICLE_COLORS_SMALL;
  const size   = isBig ? 'particle-big' : 'particle-small';

  // Limitar partículas totales activas
  if (particlePool.length >= MAX_PARTICLES) return;

  for (let i = 0; i < count; i++) {
    if (particlePool.length >= MAX_PARTICLES) break;

    const el = document.createElement('div');
    el.className = 'particle ' + size;

    // Alternar emojis y palabras
    const useWord = Math.random() > 0.5;
    if (useWord) {
      el.textContent = words[Math.floor(Math.random() * words.length)];
      el.style.fontSize  = isBig ? (Math.random() * 6 + 11) + 'px' : (Math.random() * 4 + 8) + 'px';
      el.style.color = colors[Math.floor(Math.random() * colors.length)];
      el.style.fontFamily = "'Dancing Script', cursive";
      el.style.fontWeight = '600';
      el.style.textShadow = '0 1px 4px rgba(190,24,93,0.4)';
    } else {
      el.textContent = items[Math.floor(Math.random() * items.length)];
      el.style.fontSize = isBig
        ? (Math.random() * 12 + 16) + 'px'
        : (Math.random() * 8  + 10) + 'px';
    }

    // Posición y velocidad
    const angle = (Math.random() * Math.PI * 2);
    const speed = isBig ? (Math.random() * 80 + 60) : (Math.random() * 50 + 30);
    const vx = Math.cos(angle) * speed;
    const vy = -Math.abs(Math.sin(angle)) * speed - (isBig ? 60 : 40);

    el.style.left    = x + 'px';
    el.style.top     = y + 'px';
    el.style.position = 'fixed';
    el.style.pointerEvents = 'none';
    el.style.zIndex = '9500';

    const duration = isBig
      ? (Math.random() * 1000 + 1800)
      : (Math.random() * 800  + 1200);

    el.style.animationDuration = duration + 'ms';
    el.style.animationTimingFunction = 'ease-out';

    // Movimiento personalizado con transform
    el.style.setProperty('--vx', vx + 'px');
    el.style.setProperty('--vy', vy + 'px');
    el.style.animation = `particleCustom ${duration}ms ease-out forwards`;

    document.body.appendChild(el);
    particlePool.push(el);

    // Aplicar movimiento con JS
    const startTime = performance.now();
    const startX = x;
    const startY = y;
    const gravity = 80; // px/s²

    function animateParticle(now) {
      const elapsed = (now - startTime) / 1000;
      const newX = startX + vx * elapsed;
      const newY = startY + vy * elapsed + 0.5 * gravity * elapsed * elapsed;
      const rotate = elapsed * (isBig ? 180 : 120);
      const opacity = Math.max(0, 1 - elapsed / (duration / 1000));
      const scale   = Math.max(0.1, 1 - elapsed / (duration / 1000) * 0.7);

      el.style.left      = newX + 'px';
      el.style.top       = newY + 'px';
      el.style.transform = `rotate(${rotate}deg) scale(${scale})`;
      el.style.opacity   = opacity;
      el.style.animation = 'none'; // Usar animación manual

      if (elapsed < duration / 1000 && opacity > 0) {
        requestAnimationFrame(animateParticle);
      } else {
        el.remove();
        const idx = particlePool.indexOf(el);
        if (idx !== -1) particlePool.splice(idx, 1);
      }
    }
    requestAnimationFrame(animateParticle);
  }
}

// =============================================
// CLICS EN ADORNOS DECORATIVOS (EXPLOSIÓN GRANDE)
// =============================================
function initDecoClicks() {
  const decos = document.querySelectorAll('.clickable-deco');
  decos.forEach(deco => {
    const handler = (e) => {
      e.stopPropagation();
      const rect = deco.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top  + rect.height / 2;
      spawnParticles(cx, cy, 22, 'big');
      // Animación del adorno al hacer clic
      deco.style.transform = 'scale(1.5) rotate(20deg)';
      setTimeout(() => { deco.style.transform = ''; }, 300);
    };
    deco.addEventListener('click',      handler);
    deco.addEventListener('touchstart', handler, { passive: true });
  });
}

// =============================================
// CLICS EN FONDO (EXPLOSIÓN PEQUEÑA)
// =============================================
document.addEventListener('click', (e) => {
  if (mainPortfolio.classList.contains('hidden')) return;

  // Ignorar clics en botones, inputs, adornos, player
  const ignore = e.target.closest(
    'button, input, .nav-btn, .clickable-deco, .music-player, ' +
    '.music-toggle-btn, .lock-screen, .dot'
  );
  if (ignore) return;

  spawnParticles(e.clientX, e.clientY, 7, 'small');
});

document.addEventListener('touchstart', (e) => {
  if (mainPortfolio.classList.contains('hidden')) return;

  const ignore = e.target.closest(
    'button, input, .nav-btn, .clickable-deco, .music-player, ' +
    '.music-toggle-btn, .lock-screen, .dot'
  );
  if (ignore) return;

  spawnParticles(
    e.touches[0].clientX,
    e.touches[0].clientY,
    7,
    'small'
  );
}, { passive: true });

// =============================================
// INICIALIZACIÓN
// =============================================
document.addEventListener('DOMContentLoaded', () => {
  // Construir dots
  buildDots();
  updateProgress();

  // Focus en primer input del lock
  if (lockDigits[0]) {
    setTimeout(() => lockDigits[0].focus(), 500);
  }

  // Inicializar clics en adornos (cuando el portafolio esté visible)
  // Los adornos están en el DOM desde el inicio
  initDecoClicks();
});

// =============================================
// RESPONSIVE: recalcular canvas al resize
// =============================================
window.addEventListener('resize', () => {
  // Limpiar partículas huérfanas
  particlePool.forEach(p => { if (!document.body.contains(p)) p.remove(); });
  particlePool = particlePool.filter(p => document.body.contains(p));
});

// =============================================
// PRELOAD EXTRA al navegar
// =============================================
function preloadNext() {
  const next1 = slides[(currentSlide + 1) % TOTAL_SLIDES];
  const next2 = slides[(currentSlide + 2) % TOTAL_SLIDES];
  [next1, next2].forEach(slide => {
    if (!slide) return;
    const img = slide.querySelector('img');
    if (img && img.getAttribute('loading') === 'lazy') {
      img.loading = 'eager';
    }
  });
}

// Observer para preload perezoso
if ('IntersectionObserver' in window) {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target.querySelector('img[data-src]');
        if (img) {
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
        }
      }
    });
  }, { rootMargin: '200px' });

  slides.forEach(slide => obs.observe(slide));
}
