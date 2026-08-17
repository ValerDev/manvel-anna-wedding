// Replace these three placeholder URLs with the final Google Maps links.
const MAP_URLS = {
  bride: "https://maps.google.com/?q=Bride%27s+house",
  church: "https://maps.google.com/?q=Saint+Astvatsatsin+Church+Armenia",
  restaurant: "https://maps.google.com/?q=Palais+Hall+Armenia"
};

document.querySelectorAll("[data-map]").forEach((link) => {
  link.href = MAP_URLS[link.dataset.map];
});

const observer = new IntersectionObserver((entries, currentObserver) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add("is-visible");
    currentObserver.unobserve(entry.target);
  });
}, { threshold: 0.14, rootMargin: "0px 0px -5%" });

document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));
window.addEventListener("load", () => document.body.classList.add("loaded"), { once: true });
