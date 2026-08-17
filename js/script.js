// Replace these three placeholder URLs with the final Yandex Maps links.
const MAP_URLS = {
  bride: "https://yandex.com/maps/?text=Bride%27s%20house%2C%20Armenia",
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
window.addEventListener("load", () => document.body.classList.add("loaded"), { once: true });
