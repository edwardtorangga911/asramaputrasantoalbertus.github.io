/* =========================================
   main.js – Asrama Putra ST. Albertus
   ========================================= */

document.addEventListener("DOMContentLoaded", () => {
  /* ---- Navbar scroll effect ---- */
  const navbar = document.getElementById("navbar");
  const onScroll = () => {
    navbar.classList.toggle("scrolled", window.scrollY > 50);
    document
      .getElementById("back-to-top")
      .classList.toggle("visible", window.scrollY > 300);
  };
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---- Hamburger menu ---- */
  const hamburger = document.getElementById("hamburger");
  const navMenu = document.getElementById("nav-menu");
  hamburger.addEventListener("click", () => {
    const open = hamburger.classList.toggle("open");
    navMenu.classList.toggle("open");
    hamburger.setAttribute("aria-expanded", open);
  });
  // Close menu when a link is clicked (mobile)
  navMenu.querySelectorAll(".nav-link, .dropdown-item").forEach((link) => {
    link.addEventListener("click", () => {
      hamburger.classList.remove("open");
      navMenu.classList.remove("open");
      hamburger.setAttribute("aria-expanded", "false");
    });
  });

  /* ---- Hero slider ---- */
  const slides = document.querySelectorAll(".hero-slide");
  const dots = document.querySelectorAll(".hero-dot");
  let currentSlide = 0;
  let sliderTimer;

  window.goToSlide = (index) => {
    slides[currentSlide].classList.remove("active");
    dots[currentSlide].classList.remove("active");
    currentSlide = (index + slides.length) % slides.length;
    slides[currentSlide].classList.add("active");
    dots[currentSlide].classList.add("active");
  };

  const nextSlide = () => goToSlide(currentSlide + 1);

  const startSlider = () => {
    sliderTimer = setInterval(nextSlide, 5000);
  };
  const stopSlider = () => clearInterval(sliderTimer);

  startSlider();
  document.querySelector(".hero").addEventListener("mouseenter", stopSlider);
  document.querySelector(".hero").addEventListener("mouseleave", startSlider);

  // Keyboard navigation for hero
  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") goToSlide(currentSlide - 1);
    if (e.key === "ArrowRight") goToSlide(currentSlide + 1);
    if (e.key === "Escape") closeLightbox();
  });

  /* ---- Lightbox ---- */
  const galleryItems = document.querySelectorAll(".gallery-item");
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  const lightboxCap = document.getElementById("lightbox-caption");
  const lightboxBD = document.getElementById("lightbox-backdrop");
  const lightboxClose = document.getElementById("lightbox-close");
  const lightboxPrev = document.getElementById("lightbox-prev");
  const lightboxNext = document.getElementById("lightbox-next");
  let lbImages = [];
  let lbCurrent = 0;

  galleryItems.forEach((item, idx) => {
    const img = item.querySelector("img");
    const cap = item.querySelector(".gallery-overlay p");
    lbImages.push({
      src: img.src,
      alt: img.alt,
      cap: cap ? cap.textContent : "",
    });
    item.addEventListener("click", () => openLightbox(idx));
  });

  function openLightbox(idx) {
    lbCurrent = idx;
    updateLightboxImg();
    lightbox.classList.add("open");
    lightboxBD.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  window.closeLightbox = function () {
    lightbox.classList.remove("open");
    lightboxBD.classList.remove("open");
    document.body.style.overflow = "";
  };

  function updateLightboxImg() {
    const data = lbImages[lbCurrent];
    lightboxImg.src = data.src;
    lightboxImg.alt = data.alt;
    lightboxCap.textContent = data.cap;
  }

  lightboxClose.addEventListener("click", closeLightbox);
  lightboxBD.addEventListener("click", closeLightbox);
  lightboxPrev.addEventListener("click", () => {
    lbCurrent = (lbCurrent - 1 + lbImages.length) % lbImages.length;
    updateLightboxImg();
  });
  lightboxNext.addEventListener("click", () => {
    lbCurrent = (lbCurrent + 1) % lbImages.length;
    updateLightboxImg();
  });

  /* ---- Back to top ---- */
  document.getElementById("back-to-top").addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  /* ---- Scroll animations (lightweight AOS alternative) ---- */
  const aosEls = document.querySelectorAll("[data-aos]");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("aos-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );

  aosEls.forEach((el) => observer.observe(el));

  /* ---- Smooth scroll for anchor links ---- */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      const target = document.querySelector(anchor.getAttribute("href"));
      if (target) {
        e.preventDefault();
        const offset =
          parseInt(
            getComputedStyle(document.documentElement).getPropertyValue(
              "--nav-h"
            )
          ) || 72;
        const top =
          target.getBoundingClientRect().top + window.scrollY - offset - 16;
        window.scrollTo({ top, behavior: "smooth" });
      }
    });
  });

  /* ---- Touch/swipe support for hero slider ---- */
  let touchStartX = 0;
  const heroEl = document.querySelector(".hero");
  heroEl.addEventListener(
    "touchstart",
    (e) => {
      touchStartX = e.touches[0].clientX;
    },
    { passive: true }
  );
  heroEl.addEventListener("touchend", (e) => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50)
      goToSlide(diff > 0 ? currentSlide + 1 : currentSlide - 1);
  });

  /* ---- Touch/swipe support for lightbox ---- */
  let lbTouchStartX = 0;
  lightbox.addEventListener(
    "touchstart",
    (e) => {
      lbTouchStartX = e.touches[0].clientX;
    },
    { passive: true }
  );
  lightbox.addEventListener("touchend", (e) => {
    const diff = lbTouchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      lbCurrent =
        diff > 0
          ? (lbCurrent + 1) % lbImages.length
          : (lbCurrent - 1 + lbImages.length) % lbImages.length;
      updateLightboxImg();
    }
  });

  /* ---- Active nav item on scroll ---- */
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-link");
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          navLinks.forEach((l) => l.classList.remove("active"));
          const match = document.querySelector(
            `.nav-link[href="#${entry.target.id}"]`
          );
          if (match) match.classList.add("active");
        }
      });
    },
    { threshold: 0.4 }
  );
  sections.forEach((s) => sectionObserver.observe(s));
});
