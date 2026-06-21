/* =========================================
   main.js â€“ Asrama Putra ST. Albertus
   ========================================= */

document.addEventListener("DOMContentLoaded", () => {

  /* ---- Hero text entrance animation ---- */
  const heroContent = document.querySelector(".hero-content");
  const heroChildren = heroContent.querySelectorAll(".hero-badge, .hero-eyebrow, .hero-title, .hero-motto, .hero-cta");
  heroChildren.forEach((el, i) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(40px)";
    el.style.transition = "opacity 0.8s ease, transform 0.8s ease";
    el.style.transitionDelay = `${0.3 + i * 0.15}s`;
  });
  // Trigger after a short delay
  setTimeout(() => {
    heroChildren.forEach(el => {
      el.style.opacity = "1";
      el.style.transform = "translateY(0)";
    });
  }, 200);

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

document.addEventListener("DOMContentLoaded", () => {

  /* ---- Stats counter animation ---- */
  const statCards = document.querySelectorAll(".stat-card");
  const animateCounter = (el) => {
    const numberEl = el.querySelector(".stat-number");
    const targetText = numberEl.getAttribute("data-count");
    // Only animate pure numbers (skip "2018" or "55+")
    const isNumeric = /^\d+$/.test(targetText);
    if (!isNumeric) return;
    const target = parseInt(targetText, 10);
    const duration = 2000;
    const start = performance.now();
    const step = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      numberEl.textContent = Math.floor(eased * target);
      if (progress < 1) requestAnimationFrame(step);
      else numberEl.textContent = targetText; // restore original (with "+" etc)
    };
    requestAnimationFrame(step);
  };

  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        statsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  statCards.forEach(card => statsObserver.observe(card));

  /* ---- Dark mode toggle ---- */
  const themeToggle = document.getElementById("theme-toggle");
  const html = document.documentElement;
  const themeIcon = themeToggle.querySelector("i");

  const getSystemTheme = () =>
    window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";

  const savedTheme = localStorage.getItem("theme");
  const currentTheme = savedTheme || getSystemTheme();
  html.setAttribute("data-theme", currentTheme);
  updateThemeIcon(currentTheme);

  function updateThemeIcon(theme) {
    themeIcon.className = theme === "dark" ? "fa fa-sun" : "fa fa-moon";
  }

  themeToggle.addEventListener("click", () => {
    const next = html.getAttribute("data-theme") === "dark" ? "light" : "dark";
    html.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
    updateThemeIcon(next);
  });

  /* ---- FAQ accordion ---- */
  document.querySelectorAll(".faq-question").forEach((btn) => {
    btn.addEventListener("click", () => {
      const expanded = btn.getAttribute("aria-expanded") === "true";
      // Close all others
      document.querySelectorAll(".faq-question").forEach((other) => {
        other.setAttribute("aria-expanded", "false");
        other.nextElementSibling.classList.remove("open");
      });
      // Open clicked (if not already open)
      if (!expanded) {
        btn.setAttribute("aria-expanded", "true");
        btn.nextElementSibling.classList.add("open");
      }
    });
  });

  /* ---- Form submission ---- */
  const daftarForm = document.getElementById("daftar-form");
  if (daftarForm) {
    daftarForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const btn = daftarForm.querySelector("button[type=submit]");
      const originalText = btn.innerHTML;
      btn.innerHTML = '<i class="fa fa-spinner fa-spin"></i> Mengirim...';
      btn.disabled = true;

      try {
        const formData = new FormData(daftarForm);
        const res = await fetch(daftarForm.action, {
          method: "POST",
          body: formData,
          headers: { Accept: "application/json" },
        });

        if (res.ok) {
          btn.innerHTML = '<i class="fa fa-check"></i> Terkirim!';
          btn.style.background = "#3A7C5A";
          daftarForm.reset();
          setTimeout(() => {
            btn.innerHTML = originalText;
            btn.style.background = "";
            btn.disabled = false;
          }, 3000);
        } else {
          throw new Error("Gagal mengirim");
        }
      } catch (err) {
        btn.innerHTML = '<i class="fa fa-exclamation-triangle"></i> Gagal, coba lagi';
        btn.style.background = "#C0392B";
        setTimeout(() => {
          btn.innerHTML = originalText;
          btn.style.background = "";
          btn.disabled = false;
        }, 3000);
        // Fallback: open WhatsApp with form data
        const nama = document.getElementById("form-nama").value;
        const telp = document.getElementById("form-telp").value;
        const ortu = document.getElementById("form-ortu").value;
        const asal = document.getElementById("form-asal").value;
        const pesan = document.getElementById("form-pesan").value;
        const waMsg = encodeURIComponent(
          `Halo, saya ingin mendaftar Asrama Putra St. Albertus:\n\nNama: ${nama}\nOrtu/Wali: ${ortu}\nTelepon: ${telp}\nAsal: ${asal}\nPesan: ${pesan}`
        );
        window.open(`https://wa.me/6281237542913?text=${waMsg}`, "_blank");
      }
    });
  }
});
