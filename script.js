const header = document.querySelector(".site-header");
const toggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelectorAll(".site-nav a");
const yearNode = document.querySelector("#year");
const form = document.querySelector("#lead-form");
const formNote = document.querySelector("#form-note");
const revealTargets = document.querySelectorAll(
  ".hero-copy, .hero-card, .trust-strip, .impact-strip article, .section-heading, .proof-list article, .info-card, .feature-panel, .audience-card, .machine-card, .timeline article, .faq-card, .cta-band, .contact-copy, .contact-card"
);

if (yearNode) {
  yearNode.textContent = new Date().getFullYear();
}

const currentPath = window.location.pathname.split("/").pop() || "index.html";
navLinks.forEach((link) => {
  const href = link.getAttribute("href");
  if (!href || href.startsWith("#")) {
    return;
  }

  const normalizedHref = href === "/" ? "index.html" : href;
  if (normalizedHref === currentPath) {
    link.classList.add("is-active");
    link.setAttribute("aria-current", "page");
  }
});

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

if ("IntersectionObserver" in window) {
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
} else {
  revealTargets.forEach((node) => {
    node.classList.add("is-visible");
  });
}

if (form) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const data = new FormData(form);
    const entries = {
      name: (data.get("name") || "").toString().trim(),
      company: (data.get("company") || "").toString().trim(),
      locationType: (data.get("locationType") || "").toString().trim(),
      city: (data.get("city") || "").toString().trim(),
      email: (data.get("email") || "").toString().trim(),
      phone: (data.get("phone") || "").toString().trim(),
      traffic: (data.get("traffic") || "").toString().trim(),
      notes: (data.get("notes") || "").toString().trim(),
    };

    const subject = `Blue Pearl location review - ${entries.locationType || "New inquiry"} - ${entries.city || "Hampton Roads"}`;
    const bodyLines = [
      "Blue Pearl Vending Solutions LLC - Location Review Request",
      "",
      `Name: ${entries.name || "-"}`,
      `Company or property: ${entries.company || "-"}`,
      `Location type: ${entries.locationType || "-"}`,
      `City: ${entries.city || "-"}`,
      `Email: ${entries.email || "-"}`,
      `Phone: ${entries.phone || "-"}`,
      `Estimated users or traffic: ${entries.traffic || "-"}`,
      "",
      "Notes:",
      entries.notes || "-",
    ];

    const mailtoHref = `mailto:olu@bluepearlvending.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyLines.join("\n"))}`;
    window.location.href = mailtoHref;

    if (formNote) {
      formNote.textContent = "Opening your email app with your location details filled in.";
    }
  });
}
