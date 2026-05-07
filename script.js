const header = document.querySelector(".site-header");
const toggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelectorAll(".site-nav a");
const yearNode = document.querySelector("#year");
const revealTargets = document.querySelectorAll(
  ".hero-copy, .hero-card, .trust-strip, .impact-strip article, .section-heading, .proof-list article, .info-card, .feature-panel, .audience-card, .machine-card, .timeline article, .faq-card, .cta-band, .contact-copy, .contact-card"
);
const leadForms = document.querySelectorAll(".lead-form");

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

function fireEvent(eventName, params = {}) {
  if (typeof window.gtag === "function") {
    window.gtag("event", eventName, params);
  }
}

document.addEventListener("click", (event) => {
  const link = event.target.closest("a[href]");

  if (!link) {
    return;
  }

  const href = link.getAttribute("href") || "";

  if (href === "tel:+17572510652") {
    fireEvent("phone_click", {
      link_url: href,
      link_text: (link.textContent || "").trim(),
    });
  }

  if (href.startsWith("mailto:")) {
    fireEvent("email_click", {
      link_url: href,
      link_text: (link.textContent || "").trim(),
    });
  }

  if (link.hasAttribute("data-quote-cta")) {
    fireEvent("quote_cta_click", {
      link_url: href,
      cta_name: link.getAttribute("data-quote-cta"),
      link_text: (link.textContent || "").trim(),
    });
  }
});

leadForms.forEach((form) => {
  form.addEventListener("submit", () => {
    fireEvent("quote_cta_click", {
      link_url: window.location.pathname,
      cta_name: "form_submit",
    });
  });
});

const query = new URLSearchParams(window.location.search);
const pathname = window.location.pathname;

if (pathname.endsWith("/thank-you.html") || pathname === "/thank-you.html" || currentPath === "thank-you.html") {
  fireEvent("generate_lead", {
    source_page: document.referrer || "direct",
  });
}

if ((pathname.endsWith("/quote.html") || pathname === "/quote.html" || currentPath === "quote.html") &&
  (query.get("utm_source") === "qr" || query.get("source") === "qr")) {
  fireEvent("qr_quote_visit", {
    utm_medium: query.get("utm_medium") || "",
    utm_campaign: query.get("utm_campaign") || "",
  });
}

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
