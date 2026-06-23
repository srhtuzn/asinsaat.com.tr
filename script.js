/* AS Yapı — Animasyon ve Etkileşim Modülü v2 */

let lenis;

document.addEventListener("DOMContentLoaded", () => {
  initLenis();
  initCustomCursor();
  initMobileMenu();
  initHeaderCompact();
  initScrollAnimations();
  initStatsCounters();
  initProjectModule();
  initContactForm();
  initGeneralScrollReveals();
  init3DCardTilt();
  initMagneticButtons();
});

// 1. LENIS SMOOTH SCROLL
function initLenis() {
  if (typeof Lenis === "undefined") return;
  lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    smoothTouch: false
  });
  function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
  requestAnimationFrame(raf);

  if (typeof ScrollTrigger !== "undefined" && typeof gsap !== "undefined") {
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);
  }
}

// 2. CUSTOM CURSOR
function initCustomCursor() {
  const cursor = document.getElementById("customCursor");
  const dot = document.getElementById("customCursorDot");
  if (!cursor || !dot) return;

  let mouseX = 0, mouseY = 0, cursorX = 0, cursorY = 0;

  document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = `${mouseX}px`;
    dot.style.top = `${mouseY}px`;
  });

  function animateCursor() {
    cursorX += (mouseX - cursorX) * 0.12;
    cursorY += (mouseY - cursorY) * 0.12;
    cursor.style.left = `${cursorX}px`;
    cursor.style.top = `${cursorY}px`;
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  document.querySelectorAll("a, button, .btn, .project-card, .filter-btn, .modal-close, .hamburger").forEach(item => {
    item.addEventListener("mouseenter", () => cursor.classList.add("grow"));
    item.addEventListener("mouseleave", () => cursor.classList.remove("grow"));
  });
}

// 3. MOBILE MENU
function initMobileMenu() {
  const hamburger = document.getElementById("hamburger");
  const mobileNav = document.getElementById("mobileNav");
  if (!hamburger || !mobileNav) return;

  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    mobileNav.classList.toggle("active");
  });
  mobileNav.querySelectorAll(".nav-item").forEach(link => {
    link.addEventListener("click", () => {
      hamburger.classList.remove("active");
      mobileNav.classList.remove("active");
    });
  });
}

// 4. COMPACT HEADER ON SCROLL
function initHeaderCompact() {
  if (typeof ScrollTrigger === "undefined") return;
  const header = document.querySelector(".glass-header");
  if (!header) return;

  ScrollTrigger.create({
    start: "top -60",
    onUpdate: (self) => {
      header.classList.toggle("compact", self.progress > 0);
    }
  });
}

// 5. HERO 3D DECONSTRUCTION ANIMATION
function initScrollAnimations() {
  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
    initScrollFallback();
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  // Entry states
  gsap.set(".facade-left",  { xPercent: -100, rotateY: -45, filter: "blur(6px)" });
  gsap.set(".facade-right", { xPercent: 100,  rotateY: 45,  filter: "blur(6px)" });
  gsap.set(".structure-top",    { yPercent: -100, rotateX: 45  });
  gsap.set(".structure-bottom", { yPercent: 100,  rotateX: -45 });
  gsap.set(".reveal-inner", { yPercent: 105, filter: "blur(6px)" });
  gsap.set(".hero-description, .hero-actions, .scroll-indicator", { opacity: 0, y: 35 });

  // Page-load entry
  const startTl = gsap.timeline({ delay: 0.3 });
  startTl
    .to(".structure-top, .structure-bottom", { yPercent: 0, rotateX: 0, duration: 1.4, ease: "power4.out" })
    .to(".facade-left, .facade-right", { xPercent: 0, rotateY: 0, filter: "blur(0px)", duration: 1.6, ease: "power4.out" }, "-=1.0")
    .to(".reveal-inner", { yPercent: 0, filter: "blur(0px)", duration: 1.3, stagger: 0.18, ease: "power4.out" }, "-=1.0")
    .to(".hero-description, .hero-actions", { opacity: 1, y: 0, duration: 1.0, stagger: 0.12, ease: "power3.out" }, "-=0.7")
    .to(".scroll-indicator", { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }, "-=0.5");

  // Scroll-driven layer deconstruction
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: ".hero-section",
      start: "top top",
      end: "+=200%",
      scrub: 1.5,
      pin: true,
      anticipatePin: 1
    }
  });

  tl
    .to(".facade-left",  { xPercent: -105, rotateY: -80, ease: "power2.inOut" }, 0)
    .to(".facade-right", { xPercent: 105,  rotateY: 80,  ease: "power2.inOut" }, 0)
    .fromTo(".layer-structure-bg",
      { scale: 0.9, filter: "brightness(0.2) blur(4px)" },
      { scale: 1,   filter: "brightness(0.35) blur(0px)", ease: "power2.inOut" }, 0)
    .to(".label-facade-screen", { opacity: 1, scale: 1.05, duration: 0.3 }, 0)
    .to(".label-facade-screen", { opacity: 0, duration: 0.2 }, 0.4)

    .to(".structure-top",    { yPercent: -105, rotateX: 80,  ease: "power2.inOut" }, 0.5)
    .to(".structure-bottom", { yPercent: 105,  rotateX: -80, ease: "power2.inOut" }, 0.5)
    .fromTo(".layer-blueprint-bg",
      { scale: 0.9, filter: "brightness(0.1)" },
      { scale: 1,   filter: "brightness(0.25)", ease: "power2.inOut" }, 0.5)
    .to(".label-structure-screen", { opacity: 1, scale: 1.05, duration: 0.3 }, 0.4)
    .to(".label-structure-screen", { opacity: 0, duration: 0.2 }, 0.8)
    .to(".label-blueprint-screen", { opacity: 1, scale: 1.05, duration: 0.3 }, 0.8);
}

function initScrollFallback() {
  const facadeLeft   = document.querySelector(".facade-left");
  const facadeRight  = document.querySelector(".facade-right");
  const structTop    = document.querySelector(".structure-top");
  const structBottom = document.querySelector(".structure-bottom");
  const labelBlue    = document.querySelector(".label-blueprint-screen");
  const labelStruct  = document.querySelector(".label-structure-screen");
  const labelFacade  = document.querySelector(".label-facade-screen");

  if (facadeLeft)  facadeLeft.style.transform  = "translateX(0)";
  if (facadeRight) facadeRight.style.transform = "translateX(0)";
  if (structTop)   structTop.style.transform   = "translateY(0)";
  if (structBottom)structBottom.style.transform= "translateY(0)";

  window.addEventListener("scroll", () => {
    const progress = Math.min(window.scrollY / window.innerHeight, 1);
    const p1 = Math.min(progress * 2, 1);
    if (facadeLeft)  facadeLeft.style.transform  = `translateX(-${p1 * 50}vw)`;
    if (facadeRight) facadeRight.style.transform = `translateX(${p1 * 50}vw)`;
    if (labelFacade) labelFacade.style.opacity = p1 < 0.8 ? 1 : 0;
    if (progress > 0.5) {
      const p2 = Math.min((progress - 0.5) * 2, 1);
      if (structTop)    structTop.style.transform    = `translateY(-${p2 * 50}vh)`;
      if (structBottom) structBottom.style.transform = `translateY(${p2 * 50}vh)`;
      if (labelStruct)  labelStruct.style.opacity = p2 < 0.8 ? 1 : 0;
      if (labelBlue)    labelBlue.style.opacity   = p2 > 0.5 ? 1 : 0;
    }
  });
}

// 6. STATS COUNTERS — GSAP tween
function initStatsCounters() {
  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") return;

  document.querySelectorAll(".stat-number").forEach(el => {
    const target = parseInt(el.getAttribute("data-target"), 10);
    const suffix = el.getAttribute("data-suffix") || "";
    const obj = { val: 0 };

    ScrollTrigger.create({
      trigger: el,
      start: "top 85%",
      once: true,
      onEnter: () => {
        gsap.to(obj, {
          val: target,
          duration: 2.2,
          ease: "power2.out",
          onUpdate: () => { el.textContent = Math.round(obj.val) + suffix; }
        });
      }
    });
  });
}

// 7. PROJECT MODULE
function initProjectModule() {
  if (typeof PROJECTS_DATA === "undefined") return;

  const projectsGrid = document.getElementById("projectsGrid");
  const filterButtons = document.querySelectorAll(".filter-btn");
  if (!projectsGrid) return;

  const isEn = document.documentElement.lang === "en";

  function renderProjects(category = "all") {
    const list = getProjects(category);
    projectsGrid.innerHTML = "";

    if (list.length === 0) {
      const msg = isEn ? "No projects found in the selected category." : "Seçilen kategoride proje bulunmamaktadır.";
      projectsGrid.innerHTML = `<div style="grid-column:1/-1;text-align:center;color:var(--text-2);padding:3rem 0">${msg}</div>`;
      return;
    }

    list.forEach(proj => {
      const card = document.createElement("article");
      card.className = "project-card";
      card.setAttribute("data-id", proj.id);

      const title    = isEn ? (proj.titleEn    || proj.title)    : proj.title;
      const catTitle = isEn ? (proj.categoryTitleEn || proj.categoryTitle) : proj.categoryTitle;
      const location = isEn ? (proj.locationEn || proj.location) : proj.location;
      const desc     = isEn ? (proj.descriptionEn || proj.description) : proj.description;

      card.innerHTML = `
        <div class="project-img-wrapper">
          <img class="project-img" src="${proj.mainImage}" alt="${title}" loading="lazy">
          <div class="project-overlay">${catTitle}</div>
        </div>
        <div class="project-info">
          <div class="project-meta">
            <span>📍 ${location}</span>
            <span>📅 ${proj.year}</span>
          </div>
          <h3 class="project-card-title">${title}</h3>
          <p class="project-card-desc">${desc}</p>
        </div>
      `;

      card.addEventListener("click", () => openProjectModal(proj.id));
      projectsGrid.appendChild(card);
    });

    // Cursor grow on new cards
    const cursor = document.getElementById("customCursor");
    if (cursor) {
      projectsGrid.querySelectorAll(".project-card").forEach(c => {
        c.addEventListener("mouseenter", () => cursor.classList.add("grow"));
        c.addEventListener("mouseleave", () => cursor.classList.remove("grow"));
      });
    }
  }

  // Animated filter swap
  function renderProjectsAnimated(category) {
    if (typeof gsap === "undefined") { renderProjects(category); return; }

    const existing = projectsGrid.querySelectorAll(".project-card");
    if (existing.length === 0) {
      renderProjects(category);
      gsap.from(projectsGrid.querySelectorAll(".project-card"), {
        opacity: 0, y: 28, scale: 0.97,
        duration: 0.5, stagger: 0.08, ease: "power3.out"
      });
      return;
    }

    gsap.to(existing, {
      opacity: 0, y: -18, scale: 0.97,
      duration: 0.22, stagger: 0.04, ease: "power2.in",
      onComplete: () => {
        renderProjects(category);
        gsap.fromTo(
          projectsGrid.querySelectorAll(".project-card"),
          { opacity: 0, y: 28, scale: 0.97 },
          { opacity: 1, y: 0, scale: 1, duration: 0.45, stagger: 0.09, ease: "power3.out" }
        );
      }
    });
  }

  filterButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      filterButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      renderProjectsAnimated(btn.getAttribute("data-filter"));
    });
  });

  renderProjects("all");

  // Initial entrance
  if (typeof gsap !== "undefined") {
    requestAnimationFrame(() => {
      gsap.from(projectsGrid.querySelectorAll(".project-card"), {
        opacity: 0, y: 32,
        duration: 0.65, stagger: 0.1, ease: "power3.out"
      });
    });
  }
}

// 8. PROJECT MODAL — GSAP animated open/close
function openProjectModal(projectId) {
  const project = PROJECTS_DATA.find(p => p.id === projectId);
  if (!project) return;

  const isEn = document.documentElement.lang === "en";
  const title    = isEn ? (project.titleEn    || project.title)    : project.title;
  const location = isEn ? (project.locationEn || project.location) : project.location;
  const catTitle = isEn ? (project.categoryTitleEn || project.categoryTitle) : project.categoryTitle;
  const desc     = isEn ? (project.descriptionEn || project.description) : project.description;
  const features = isEn ? (project.featuresEn || project.features) : project.features;

  let modal = document.getElementById("projectModal");
  if (!modal) {
    modal = document.createElement("div");
    modal.className = "modal-overlay";
    modal.id = "projectModal";
    document.body.appendChild(modal);
  }

  modal.innerHTML = `
    <div class="modal-card">
      <button class="modal-close" id="closeModal">&times;</button>
      <div class="modal-gallery">
        <img class="modal-main-img" id="modalMainImg" src="${project.mainImage}" alt="${title}">
        <div class="modal-thumbs" id="modalThumbs"></div>
      </div>
      <div class="modal-details">
        <div>
          <h3 class="modal-title">${title}</h3>
          <div class="modal-meta-grid">
            <div class="modal-meta-item">
              <div class="modal-meta-label">${isEn ? "Location" : "Konum"}</div>
              <div class="modal-meta-val">${location}</div>
            </div>
            <div class="modal-meta-item">
              <div class="modal-meta-label">${isEn ? "Project Year" : "Proje Yılı"}</div>
              <div class="modal-meta-val">${project.year}</div>
            </div>
            <div class="modal-meta-item">
              <div class="modal-meta-label">${isEn ? "Category" : "Kategori"}</div>
              <div class="modal-meta-val">${catTitle}</div>
            </div>
            <div class="modal-meta-item">
              <div class="modal-meta-label">${isEn ? "Total Area" : "Toplam Alan"}</div>
              <div class="modal-meta-val">${project.area}</div>
            </div>
          </div>
          <p class="modal-desc">${desc}</p>
        </div>
        <div>
          <h4 class="modal-features-title">${isEn ? "⚙️ KEY FEATURES" : "⚙️ ÖNE ÇIKAN ÖZELLİKLER"}</h4>
          <ul class="modal-features-list">
            ${features.map(f => `<li class="modal-feature-item">${f}</li>`).join("")}
          </ul>
        </div>
      </div>
    </div>
  `;

  const modalCard = modal.querySelector(".modal-card");
  const thumbsContainer = modal.querySelector("#modalThumbs");
  const mainImg = modal.querySelector("#modalMainImg");

  project.images.forEach((imgUrl, idx) => {
    const thumb = document.createElement("img");
    thumb.className = `modal-thumb ${idx === 0 ? "active" : ""}`;
    thumb.src = imgUrl;
    thumb.alt = `${title} ${isEn ? "Image" : "Görsel"} ${idx + 1}`;
    thumb.addEventListener("click", () => {
      modal.querySelectorAll(".modal-thumb").forEach(t => t.classList.remove("active"));
      thumb.classList.add("active");
      if (typeof gsap !== "undefined") {
        gsap.fromTo(mainImg,
          { opacity: 0.5, scale: 1.03 },
          { opacity: 1,   scale: 1,    duration: 0.35, ease: "power2.out" }
        );
      }
      mainImg.src = imgUrl;
    });
    thumbsContainer.appendChild(thumb);
  });

  function closeModal() {
    if (typeof gsap !== "undefined") {
      gsap.to(modalCard, {
        opacity: 0, scale: 0.96, y: 14, filter: "blur(4px)",
        duration: 0.25, ease: "power2.in",
        onComplete: () => {
          modal.classList.remove("active");
          document.body.style.overflow = "";
          if (lenis) lenis.start();
        }
      });
    } else {
      modal.classList.remove("active");
      document.body.style.overflow = "";
      if (lenis) lenis.start();
    }
  }

  const closeBtn = modal.querySelector("#closeModal");
  closeBtn.addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => { if (e.target === modal) closeModal(); });
  document.addEventListener("keydown", function escClose(e) {
    if (e.key === "Escape") { closeModal(); document.removeEventListener("keydown", escClose); }
  });

  modal.classList.add("active");
  document.body.style.overflow = "hidden";
  if (lenis) lenis.stop();

  // GSAP entrance
  if (typeof gsap !== "undefined") {
    gsap.fromTo(modalCard,
      { opacity: 0, scale: 0.94, y: 28, filter: "blur(6px)" },
      { opacity: 1, scale: 1,    y: 0,  filter: "blur(0px)", duration: 0.48, ease: "power3.out" }
    );
  }

  const cursor = document.getElementById("customCursor");
  if (cursor) {
    closeBtn.addEventListener("mouseenter", () => cursor.classList.add("grow"));
    closeBtn.addEventListener("mouseleave", () => cursor.classList.remove("grow"));
  }
}

// 9. CONTACT FORM
function initContactForm() {
  const form   = document.getElementById("contactForm");
  const status = document.getElementById("formStatus");
  if (!form || !status) return;

  const isEn = document.documentElement.lang === "en";

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name    = document.getElementById("formName")?.value.trim();
    const email   = document.getElementById("formEmail")?.value.trim();
    const message = document.getElementById("formMessage")?.value.trim();

    if (!name || !email || !message) {
      showStatus(isEn ? "Please fill in all required fields (*)." : "Lütfen zorunlu alanları (* işaretli) doldurunuz.", "error");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showStatus(isEn ? "Please enter a valid email address." : "Lütfen geçerli bir e-posta adresi giriniz.", "error");
      return;
    }
    showStatus(isEn ? "Your message has been sent! We will contact you shortly." : "Mesajınız başarıyla gönderildi! En kısa sürede sizinle iletişime geçeceğiz.", "success");
    form.reset();
  });

  function showStatus(msg, type) {
    status.textContent = msg;
    status.className = `form-status ${type}`;
    status.style.display = "block";
    if (typeof gsap !== "undefined") {
      gsap.fromTo(status, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" });
    }
    setTimeout(() => { status.style.display = "none"; }, 5000);
  }
}

// 10. SCROLL REVEALS — enhanced with skewY
function initGeneralScrollReveals() {
  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") return;

  gsap.utils.toArray(".section-badge, .section-title, .section-desc").forEach(el => {
    if (el.closest(".hero-section")) return;
    gsap.from(el, {
      scrollTrigger: { trigger: el, start: "top 88%", toggleActions: "play none none none" },
      opacity: 0, y: 44, skewY: 1.5,
      duration: 1.0, ease: "power3.out"
    });
  });

  if (document.querySelector(".highlights-section")) {
    gsap.from(".stat-card", {
      scrollTrigger: { trigger: ".highlights-section", start: "top 80%" },
      opacity: 0, y: 55,
      duration: 0.85, stagger: 0.14, ease: "power3.out"
    });
  }

  if (document.querySelector(".services-section")) {
    gsap.from(".service-card", {
      scrollTrigger: { trigger: ".services-section", start: "top 78%" },
      opacity: 0, y: 65,
      duration: 0.95, stagger: 0.18, ease: "power3.out"
    });
  }

  if (document.querySelector(".contact-layout")) {
    gsap.from(".contact-info-block > *, .contact-form", {
      scrollTrigger: { trigger: ".contact-layout", start: "top 78%" },
      opacity: 0, y: 44,
      duration: 0.9, stagger: 0.16, ease: "power3.out"
    });
  }

  // Inner page heroes
  if (document.querySelector(".page-hero-title")) {
    gsap.from(".page-hero .section-badge", { opacity: 0, y: 20, duration: 0.7, delay: 0.2, ease: "power3.out" });
    gsap.from(".page-hero-title", { opacity: 0, y: 44, skewY: 1, duration: 1.0, delay: 0.35, ease: "power3.out" });
  }

  // Timeline alternating reveal
  gsap.utils.toArray(".timeline-item").forEach((item, i) => {
    gsap.from(item, {
      scrollTrigger: { trigger: item, start: "top 85%" },
      opacity: 0,
      x: i % 2 === 0 ? 45 : -45,
      duration: 0.9, ease: "power3.out"
    });
  });

  // Story image
  if (document.querySelector(".story-img-card")) {
    gsap.from(".story-img-card", {
      scrollTrigger: { trigger: ".story-img-card", start: "top 82%" },
      opacity: 0, scale: 0.97, y: 30,
      duration: 1.0, ease: "power3.out"
    });
  }
}

// 11. 3D CARD TILT
function init3DCardTilt() {
  if (typeof gsap === "undefined") return;
  if (window.matchMedia("(hover: none)").matches) return;

  document.querySelectorAll(".service-card").forEach(card => {
    gsap.set(card, { transformPerspective: 900 });

    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const rx = ((e.clientY - rect.top)  / rect.height - 0.5) * -10;
      const ry = ((e.clientX - rect.left) / rect.width  - 0.5) *  14;
      gsap.to(card, { rotateX: rx, rotateY: ry, z: 10, duration: 0.3, ease: "power2.out" });
    });

    card.addEventListener("mouseleave", () => {
      gsap.to(card, { rotateX: 0, rotateY: 0, z: 0, duration: 0.7, ease: "power2.out" });
    });
  });
}

// 12. MAGNETIC BUTTONS
function initMagneticButtons() {
  if (typeof gsap === "undefined") return;
  if (window.matchMedia("(hover: none)").matches) return;

  document.querySelectorAll(".btn-primary, .btn-secondary, .form-submit-btn").forEach(btn => {
    btn.addEventListener("mousemove", (e) => {
      const rect = btn.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width  / 2) * 0.28;
      const y = (e.clientY - rect.top  - rect.height / 2) * 0.28;
      gsap.to(btn, { x, y, duration: 0.35, ease: "power2.out" });
    });
    btn.addEventListener("mouseleave", () => {
      gsap.to(btn, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1, 0.5)" });
    });
  });
}
