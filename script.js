const header = document.querySelector(".site-header");
const toggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelectorAll(".site-nav a");
const yearNode = document.querySelector("#year");
const revealTargets = document.querySelectorAll(
  ".hero-copy, .hero-card, .trust-strip, .section, .info-card, .feature-panel, .audience-card, .timeline article, .cta-band, .contact-card"
);

if (yearNode) {
  yearNode.textContent = new Date().getFullYear();
}

if (toggle && header) {
  toggle.addEventListener("click", () => {
    const isOpen = header.classList.toggle("nav-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });
}

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    if (header && header.classList.contains("nav-open")) {
      header.classList.remove("nav-open");
      if (toggle) {
        toggle.setAttribute("aria-expanded", "false");
      }
    }
  });
});

revealTargets.forEach((node) => {
  node.classList.add("reveal");
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.16,
    rootMargin: "0px 0px -40px 0px",
  }
);

revealTargets.forEach((node) => {
  observer.observe(node);
});
