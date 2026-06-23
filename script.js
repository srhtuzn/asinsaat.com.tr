/* As İnşaat - Etkileşim ve Animasyon Modülü */

document.addEventListener("DOMContentLoaded", () => {
  initCustomCursor();
  initMobileMenu();
  initScrollAnimations();
  initStatsCounters();
  initProjectModule();
  initContactForm();
});

// 1. ÖZEL MOUSE İMLECİ (CUSTOM CURSOR)
function initCustomCursor() {
  const cursor = document.getElementById("customCursor");
  const dot = document.getElementById("customCursorDot");
  
  if (!cursor || !dot) return;

  let mouseX = 0, mouseY = 0;
  let cursorX = 0, cursorY = 0;

  document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // Nokta anında hareket etsin
    dot.style.left = `${mouseX}px`;
    dot.style.top = `${mouseY}px`;
  });

  // Halka hafif gecikmeli (yay etkisiyle) takip etsin
  function animateCursor() {
    const dx = mouseX - cursorX;
    const dy = mouseY - cursorY;
    
    cursorX += dx * 0.15;
    cursorY += dy * 0.15;
    
    cursor.style.left = `${cursorX}px`;
    cursor.style.top = `${cursorY}px`;
    
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  // Tıklanabilir elementlerde büyüme etkisi
  const clickables = document.querySelectorAll("a, button, .btn, .project-card, .filter-btn, .modal-close, .hamburger");
  clickables.forEach(item => {
    item.addEventListener("mouseenter", () => cursor.classList.add("grow"));
    item.addEventListener("mouseleave", () => cursor.classList.remove("grow"));
  });
}

// 2. MOBİL MENÜ YÖNETİMİ
function initMobileMenu() {
  const hamburger = document.getElementById("hamburger");
  const mobileNav = document.getElementById("mobileNav");

  if (!hamburger || !mobileNav) return;

  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    mobileNav.classList.toggle("active");
  });

  // Mobil menüdeki linklere tıklanınca menü kapansın
  const mobileLinks = mobileNav.querySelectorAll(".nav-item");
  mobileLinks.forEach(link => {
    link.addEventListener("click", () => {
      hamburger.classList.remove("active");
      mobileNav.classList.remove("active");
    });
  });
}

// 3. GSAP KAYDIRMA VE KATMAN PARÇALANMA ANİMASYONU (HERO 3D DECONSTRUCTION)
function initScrollAnimations() {
  // Eğer GSAP yüklenmediyse düzgün çalışması için fallback
  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
    console.warn("GSAP veya ScrollTrigger bulunamadı. Fallback devrede.");
    initScrollFallback();
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  // Fare hareketine göre 3D kutuyu hafifçe döndürme etkisi (Paralaks)
  const viewport = document.getElementById("hero3dViewport");
  const container = document.getElementById("hero3dContainer");

  if (viewport && container) {
    viewport.addEventListener("mousemove", (e) => {
      const rect = viewport.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      // Kaydırma animasyonunu ezmemek için GSAP quickTo kullanıyoruz
      gsap.to(container, {
        rotateY: -25 + (x / rect.width) * 20,
        rotateX: 20 - (y / rect.height) * 20,
        duration: 0.5,
        ease: "power2.out"
      });
    });

    viewport.addEventListener("mouseleave", () => {
      gsap.to(container, {
        rotateY: -25,
        rotateX: 20,
        duration: 1,
        ease: "power2.out"
      });
    });
  }

  // 3D Bina Katmanlarının Kaydırma Tetikleyici ile Parçalanması
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: ".hero-section",
      start: "top top",
      end: "bottom top",
      scrub: 1, // Hassas sürtünme efekti
      pin: false
    }
  });

  // Katmanları 3D uzayda birbirinden ayırma ve döndürme
  tl.to(".layer-facade", {
    z: 180,
    y: 80,
    x: -30,
    opacity: 0.85,
    duration: 1
  }, 0)
  .to(".layer-structure", {
    z: 0,
    y: 0,
    x: 0,
    rotateY: -10,
    duration: 1
  }, 0)
  .to(".layer-blueprint", {
    z: -180,
    y: -80,
    x: 30,
    opacity: 0.6,
    duration: 1
  }, 0);

  // Katman etiketlerinin (Metinler) sırayla ekranda belirmesi
  gsap.to(".label-blueprint", {
    scrollTrigger: {
      trigger: ".hero-section",
      start: "top+=10% top",
      end: "top+=40% top",
      scrub: true
    },
    opacity: 1,
    left: "0px"
  });

  gsap.to(".label-structure", {
    scrollTrigger: {
      trigger: ".hero-section",
      start: "top+=30% top",
      end: "top+=60% top",
      scrub: true
    },
    opacity: 1,
    right: "0px"
  });

  gsap.to(".label-facade", {
    scrollTrigger: {
      trigger: ".hero-section",
      start: "top+=50% top",
      end: "top+=80% top",
      scrub: true
    },
    opacity: 1,
    left: "30px"
  });
}

// GSAP Yüklenemezse Çalışacak Scroll Fallback (Pure JS)
function initScrollFallback() {
  const facade = document.querySelector(".layer-facade");
  const structure = document.querySelector(".layer-structure");
  const blueprint = document.querySelector(".layer-blueprint");
  
  const labelBlue = document.querySelector(".label-blueprint");
  const labelStruct = document.querySelector(".label-structure");
  const labelFacade = document.querySelector(".label-facade");

  window.addEventListener("scroll", () => {
    const scrollY = window.scrollY;
    const maxScroll = window.innerHeight;
    const progress = Math.min(scrollY / maxScroll, 1);

    if (facade && structure && blueprint) {
      facade.style.transform = `translateZ(${progress * 180}px) translateY(${progress * 80}px) translateX(${progress * -30}px)`;
      structure.style.transform = `translateZ(0px) rotateY(${progress * -10}deg)`;
      blueprint.style.transform = `translateZ(${progress * -180}px) translateY(${progress * -80}px) translateX(${progress * 30}px)`;
    }

    // Etiketlerin opaklık kontrolü
    if (labelBlue) labelBlue.style.opacity = progress > 0.15 ? 1 : 0;
    if (labelStruct) labelStruct.style.opacity = progress > 0.45 ? 1 : 0;
    if (labelFacade) labelFacade.style.opacity = progress > 0.7 ? 1 : 0;
  });
}

// 4. İSTATİSTİK SAYAÇLARI ANİMASYONU
function initStatsCounters() {
  const statNumbers = document.querySelectorAll(".stat-number");
  if (statNumbers.length === 0) return;

  const observerOptions = {
    threshold: 0.5,
    rootMargin: "0px"
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = entry.target;
        const targetValue = parseInt(target.getAttribute("data-target"), 10);
        let currentValue = 0;
        const duration = 2000; // 2 saniye
        const stepTime = Math.abs(Math.floor(duration / targetValue));
        
        const timer = setInterval(() => {
          currentValue += 1;
          target.textContent = currentValue + (target.getAttribute("data-suffix") || "");
          if (currentValue >= targetValue) {
            target.textContent = targetValue + (target.getAttribute("data-suffix") || "");
            clearInterval(timer);
          }
        }, Math.max(stepTime, 15));

        observer.unobserve(target);
      }
    });
  }, observerOptions);

  statNumbers.forEach(num => observer.observe(num));
}

// 5. PROJE MODÜLÜ (LİSTELEME, FİLTRELEME VE DETAY MODAL)
function initProjectModule() {
  // Veritabanı (PROJECTS_DATA) yüklü mü kontrol et
  if (typeof PROJECTS_DATA === "undefined") {
    console.error("Projeler veritabanı (projects.js) yüklenemedi.");
    return;
  }

  const projectsGrid = document.getElementById("projectsGrid");
  const filterButtons = document.querySelectorAll(".filter-btn");

  // Sayfada proje ızgarası yoksa modülü sonlandır (Detay sayfaları hariç)
  if (!projectsGrid) return;

  // Projeleri Render Etme Fonksiyonu
  function renderProjects(category = "all") {
    const list = getProjects(category);
    projectsGrid.innerHTML = "";

    if (list.length === 0) {
      projectsGrid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; color: var(--text-dim); padding: 3rem 0;">Seçilen kategoride proje bulunmamaktadır.</div>`;
      return;
    }

    list.forEach(proj => {
      const card = document.createElement("article");
      card.className = "project-card";
      card.setAttribute("data-id", proj.id);
      card.innerHTML = `
        <div class="project-img-wrapper">
          <img class="project-img" src="${proj.mainImage}" alt="${proj.title}" loading="lazy">
          <div class="project-overlay">${proj.categoryTitle}</div>
        </div>
        <div class="project-info">
          <div class="project-meta">
            <span>📍 ${proj.location}</span>
            <span>📅 ${proj.year}</span>
          </div>
          <h3 class="project-card-title">${proj.title}</h3>
          <p class="project-card-desc">${proj.description}</p>
        </div>
      `;
      
      // Tıklanma olayıyla detay modalını aç
      card.addEventListener("click", () => openProjectModal(proj.id));
      projectsGrid.appendChild(card);
    });

    // Custom cursor hover durumunu güncelle
    const cursor = document.getElementById("customCursor");
    if (cursor) {
      const cards = projectsGrid.querySelectorAll(".project-card");
      cards.forEach(c => {
        c.addEventListener("mouseenter", () => cursor.classList.add("grow"));
        c.addEventListener("mouseleave", () => cursor.classList.remove("grow"));
      });
    }
  }

  // Filtre Butonları Tıklanma Olayı
  filterButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      filterButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      
      const filterVal = btn.getAttribute("data-filter");
      renderProjects(filterVal);
    });
  });

  // İlk yüklemede tüm projeleri göster
  renderProjects("all");
}

// Proje Detay Modalını Açma Fonksiyonu
function openProjectModal(id) {
  const project = getProjectById(id);
  if (!project) return;

  // Modal öğelerini oluştur veya seç
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
        <img class="modal-main-img" id="modalMainImg" src="${project.mainImage}" alt="${project.title}">
        <div class="modal-thumbs" id="modalThumbs"></div>
      </div>
      
      <div class="modal-details">
        <div>
          <h3 class="modal-title">${project.title}</h3>
          <div class="modal-meta-grid">
            <div class="modal-meta-item">
              <div class="modal-meta-label">Konum</div>
              <div class="modal-meta-val">${project.location}</div>
            </div>
            <div class="modal-meta-item">
              <div class="modal-meta-label">Proje Yılı</div>
              <div class="modal-meta-val">${project.year}</div>
            </div>
            <div class="modal-meta-item">
              <div class="modal-meta-label">Kategori</div>
              <div class="modal-meta-val">${project.categoryTitle}</div>
            </div>
            <div class="modal-meta-item">
              <div class="modal-meta-label">Toplam Alan</div>
              <div class="modal-meta-val">${project.area}</div>
            </div>
          </div>
          <p class="modal-desc">${project.description}</p>
        </div>
        
        <div>
          <h4 class="modal-features-title">⚙️ ÖNE ÇIKAN ÖZELLİKLER</h4>
          <ul class="modal-features-list">
            ${project.features.map(f => `<li class="modal-feature-item">${f}</li>`).join("")}
          </ul>
        </div>
      </div>
    </div>
  `;

  // Küçük Resimleri Yükleme
  const thumbsContainer = modal.querySelector("#modalThumbs");
  const mainImg = modal.querySelector("#modalMainImg");

  project.images.forEach((imgUrl, idx) => {
    const thumb = document.createElement("img");
    thumb.className = `modal-thumb ${idx === 0 ? "active" : ""}`;
    thumb.src = imgUrl;
    thumb.alt = `${project.title} Görsel ${idx + 1}`;
    
    thumb.addEventListener("click", () => {
      modal.querySelectorAll(".modal-thumb").forEach(t => t.classList.remove("active"));
      thumb.classList.add("active");
      mainImg.src = imgUrl;
    });
    
    thumbsContainer.appendChild(thumb);
  });

  // Modal Kapatma Olayları
  const closeBtn = modal.querySelector("#closeModal");
  
  function closeModal() {
    modal.classList.remove("active");
    document.body.style.overflow = ""; // Scroll kilidini aç
  }

  closeBtn.addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });

  // ESC tuşuyla kapatma
  document.addEventListener("keydown", function escClose(e) {
    if (e.key === "Escape") {
      closeModal();
      document.removeEventListener("keydown", escClose);
    }
  });

  // Modalı Göster
  modal.classList.add("active");
  document.body.style.overflow = "hidden"; // Sayfa kaydırmayı kilitle

  // Custom cursor hover durumunu modal kapatma butonunda aktif et
  const cursor = document.getElementById("customCursor");
  if (cursor) {
    closeBtn.addEventListener("mouseenter", () => cursor.classList.add("grow"));
    closeBtn.addEventListener("mouseleave", () => cursor.classList.remove("grow"));
  }
}

// 6. İLETİŞİM FORMU KONTROLÜ
function initContactForm() {
  const form = document.getElementById("contactForm");
  const status = document.getElementById("formStatus");

  if (!form || !status) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("formName").value.trim();
    const email = document.getElementById("formEmail").value.trim();
    const phone = document.getElementById("formPhone").value.trim();
    const message = document.getElementById("formMessage").value.trim();

    if (!name || !email || !message) {
      showStatus("Lütfen zorunlu alanları (* işaretli) doldurunuz.", "error");
      return;
    }

    if (!validateEmail(email)) {
      showStatus("Lütfen geçerli bir e-posta adresi giriniz.", "error");
      return;
    }

    // Başarılı Gönderim Simülasyonu
    showStatus("Mesajınız başarıyla gönderildi! Sizinle en kısa sürede iletişime geçeceğiz.", "success");
    form.reset();
  });

  function showStatus(msg, type) {
    status.textContent = msg;
    status.className = `form-status ${type}`;
    
    setTimeout(() => {
      status.style.display = "none";
    }, 5000);
  }

  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }
}
