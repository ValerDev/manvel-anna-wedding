// Replace these three placeholder URLs with the final Yandex Maps links.
const MAP_URLS = {
  church: "https://yandex.com/maps/?text=Saint%20Astvatsatsin%20Church%2C%20Armenia",
  restaurant: "https://yandex.com/maps/?text=Palais%20Hall%2C%20Armenia"
};

const WEDDING_DATE = new Date("2026-09-04T00:00:00+04:00");
const MUSIC_VIDEO_ID = "MIvlR2R1dx4";

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
const musicSeek = document.querySelector("#music-seek");
const musicCurrent = document.querySelector("#music-current");
const musicDuration = document.querySelector("#music-duration");
let musicPlayer;
let musicTimer;
let repeatSong = false;

function formatTime(seconds) {
  if (!Number.isFinite(seconds)) return "0:00";
  const minutes = Math.floor(seconds / 60);
  return `${minutes}:${String(Math.floor(seconds % 60)).padStart(2, "0")}`;
}

function syncMusicProgress() {
  if (!musicPlayer?.getDuration) return;
  const duration = musicPlayer.getDuration() || 0;
  const current = musicPlayer.getCurrentTime() || 0;
  const progress = duration ? (current / duration) * 100 : 0;
  musicSeek.value = progress;
  musicSeek.style.setProperty("--music-progress", `${progress}%`);
  musicCurrent.textContent = formatTime(current);
  musicDuration.textContent = formatTime(duration);
}

window.onYouTubeIframeAPIReady = () => {
  musicPlayer = new YT.Player("youtube-player", {
    videoId: MUSIC_VIDEO_ID,
    playerVars: { controls: 0, rel: 0, playsinline: 1 },
    events: {
      onReady: syncMusicProgress,
      onStateChange: ({ data }) => {
        const playing = data === YT.PlayerState.PLAYING;
        musicSection.classList.toggle("is-playing", playing);
        document.querySelector('[data-music="play"]').setAttribute("aria-label", playing ? "Դադարեցնել" : "Նվագարկել");
        clearInterval(musicTimer);
        if (playing) musicTimer = setInterval(syncMusicProgress, 500);
        if (data === YT.PlayerState.ENDED && repeatSong) musicPlayer.playVideo();
        syncMusicProgress();
      }
    }
  });
};

const youtubeApi = document.createElement("script");
youtubeApi.src = "https://www.youtube.com/iframe_api";
youtubeApi.async = true;
document.head.appendChild(youtubeApi);

document.querySelectorAll("[data-music]").forEach((button) => {
  button.addEventListener("click", () => {
    if (!musicPlayer?.playVideo) return;
    const action = button.dataset.music;
    if (action === "play") {
      musicPlayer.getPlayerState() === YT.PlayerState.PLAYING ? musicPlayer.pauseVideo() : musicPlayer.playVideo();
    } else if (action === "repeat") {
      repeatSong = !repeatSong;
      button.classList.toggle("is-active", repeatSong);
    } else if (action === "shuffle") {
      button.classList.toggle("is-active");
    } else {
      musicPlayer.seekTo(0, true);
      musicPlayer.playVideo();
    }
  });
});

musicSeek.addEventListener("input", () => {
  if (!musicPlayer?.getDuration) return;
  musicPlayer.seekTo((Number(musicSeek.value) / 100) * musicPlayer.getDuration(), true);
  syncMusicProgress();
});
