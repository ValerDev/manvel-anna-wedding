// Replace these three placeholder URLs with the final Yandex Maps links.
const MAP_URLS = {
  church: "https://yandex.com/maps/?text=Saint%20Astvatsatsin%20Church%2C%20Armenia",
  restaurant: "https://yandex.com/maps/?text=Palais%20Hall%2C%20Armenia"
};

const WEDDING_DATE = new Date("2026-09-04T00:00:00+04:00");

document.querySelectorAll("[data-map]").forEach((link) => {
  link.href = MAP_URLS[link.dataset.map];
});

const countdownValues = {
  days: document.querySelector('[data-count="days"]'),
  hours: document.querySelector('[data-count="hours"]'),
  minutes: document.querySelector('[data-count="minutes"]'),
  seconds: document.querySelector('[data-count="seconds"]')
};

function updateCountdown() {
  const remaining = WEDDING_DATE.getTime() - Date.now();
  if (remaining <= 0) {
    document.querySelector(".countdown-grid").hidden = true;
    document.querySelector(".countdown-finished").hidden = false;
    return;
  }

  countdownValues.days.textContent = String(Math.floor(remaining / 86400000)).padStart(3, "0");
  countdownValues.hours.textContent = String(Math.floor((remaining / 3600000) % 24)).padStart(2, "0");
  countdownValues.minutes.textContent = String(Math.floor((remaining / 60000) % 60)).padStart(2, "0");
  countdownValues.seconds.textContent = String(Math.floor((remaining / 1000) % 60)).padStart(2, "0");
}

updateCountdown();
setInterval(updateCountdown, 1000);

const observer = new IntersectionObserver((entries, currentObserver) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add("is-visible");
    currentObserver.unobserve(entry.target);
  });
}, { threshold: 0.14, rootMargin: "0px 0px -5%" });

document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));
// Start the entrance immediately; do not wait for images or fonts to finish loading.
requestAnimationFrame(() => document.body.classList.add("loaded"));

const musicSection = document.querySelector(".music-section");
const musicAudio = document.querySelector("#wedding-song");
const musicSeek = document.querySelector("#music-seek");
const musicCurrent = document.querySelector("#music-current");
const musicDuration = document.querySelector("#music-duration");

function formatTime(seconds) {
  if (!Number.isFinite(seconds)) return "0:00";
  const minutes = Math.floor(seconds / 60);
  return `${minutes}:${String(Math.floor(seconds % 60)).padStart(2, "0")}`;
}

function syncMusicProgress() {
  const duration = musicAudio.duration || 0;
  const current = musicAudio.currentTime || 0;
  const progress = duration ? (current / duration) * 100 : 0;
  musicSeek.value = progress;
  musicSeek.style.setProperty("--music-progress", `${progress}%`);
  musicCurrent.textContent = formatTime(current);
  musicDuration.textContent = formatTime(duration);
}

musicAudio.addEventListener("loadedmetadata", syncMusicProgress);
musicAudio.addEventListener("durationchange", syncMusicProgress);
musicAudio.addEventListener("timeupdate", syncMusicProgress);
musicAudio.addEventListener("play", () => {
  removeScrollPlayListeners();
  musicSection.classList.add("is-playing");
  document.querySelector('[data-music="play"]').setAttribute("aria-label", "Դադարեցնել");
});
musicAudio.addEventListener("pause", () => {
  musicSection.classList.remove("is-playing");
  document.querySelector('[data-music="play"]').setAttribute("aria-label", "Նվագարկել");
});
musicAudio.addEventListener("ended", syncMusicProgress);

let scrollPlayAttemptInProgress = false;

function removeScrollPlayListeners() {
  window.removeEventListener("scroll", startMusicFromScroll);
  window.removeEventListener("wheel", startMusicFromScroll);
  window.removeEventListener("touchstart", startMusicFromScroll);
}

function startMusicFromScroll() {
  if (!musicAudio.paused || scrollPlayAttemptInProgress) return;
  scrollPlayAttemptInProgress = true;
  musicAudio.play()
    .then(removeScrollPlayListeners)
    .catch(() => { scrollPlayAttemptInProgress = false; });
}

window.addEventListener("scroll", startMusicFromScroll, { passive: true });
window.addEventListener("wheel", startMusicFromScroll, { passive: true });
window.addEventListener("touchstart", startMusicFromScroll, { passive: true });

document.querySelectorAll("[data-music]").forEach((button) => {
  button.addEventListener("click", () => {
    const action = button.dataset.music;
    if (action === "play") {
      musicAudio.paused ? musicAudio.play() : musicAudio.pause();
    } else if (action === "repeat") {
      musicAudio.loop = !musicAudio.loop;
      button.classList.toggle("is-active", musicAudio.loop);
    } else if (action === "shuffle") {
      button.classList.toggle("is-active");
    } else {
      musicAudio.currentTime = 0;
      musicAudio.play();
    }
  });
});

musicSeek.addEventListener("input", () => {
  if (!musicAudio.duration) return;
  musicAudio.currentTime = (Number(musicSeek.value) / 100) * musicAudio.duration;
  syncMusicProgress();
});
