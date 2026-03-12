function getEduBgClass(index) {
  const classes = ["edu-bg-1", "edu-bg-2", "edu-bg-3", "edu-bg-4", "edu-bg-5", "edu-bg-6"];
  return classes[index % classes.length];
}

function renderEduTabs() {
  const eduTabs = document.getElementById("eduTabs");
  if (!eduTabs) return;

  const categories = ["all", ...new Set(eduData.map(item => item.category))];

  eduTabs.innerHTML = categories.map(category => {
    const label = category === "all" ? "전체" : category;
    const activeClass = category === currentEduCategory ? "active" : "";
    return `<button class="edu-tab ${activeClass}" data-category="${escapeHtml(category)}">${escapeHtml(label)}</button>`;
  }).join("");
}

function renderEduCards() {
  const eduArea = document.getElementById("edu-content-area");
  const countBadge = document.getElementById("edu-count-badge");

  if (!eduArea || !countBadge) return;

  const filtered = currentEduCategory === "all"
    ? eduData
    : eduData.filter(item => item.category === currentEduCategory);

  countBadge.textContent = `총 ${filtered.length}개`;

  if (!filtered.length) {
    eduArea.innerHTML = `<div class="empty-state">등록된 상품자료가 없습니다.</div>`;
    return;
  }

  eduArea.innerHTML = filtered.map((item, index) => `
    <div class="edu-card-new ${hasImage(item.image) ? "" : getEduBgClass(index)}" data-id="${escapeHtml(item.id)}">
      <div class="edu-card-top-new">
        <span class="edu-badge-new">${escapeHtml(item.category || "기타")}</span>
        <div class="edu-icon-new">${escapeHtml(item.icon || "📘")}</div>
      </div>

      ${hasImage(item.image) ? `
        <div class="edu-card-image-wrap">
          <img class="edu-card-image" src="${escapeHtml(item.image)}" alt="${escapeHtml(item.title || "상품자료")}" loading="lazy">
        </div>
      ` : ""}

      <div class="edu-card-bottom-new">
        <h3>${escapeHtml(item.title || "제목 없음")}</h3>
        <p>${escapeHtml(item.desc || "설명이 없습니다.")}</p>
        <div class="edu-meta-new">${escapeHtml(item.meta || "상품자료")}</div>
      </div>
    </div>
  `).join("");
}

function renderEdu() {
  renderEduTabs();
  renderEduCards();
}

function buildGalleryHtml(images, title) {
  if (!images || !images.length) return "";

  return images.map((img, idx) => `
    <div class="edu-gallery-item">
      <img
        class="edu-gallery-img"
        src="${escapeHtml(img)}"
        alt="${escapeHtml(title || "상품자료")} ${idx + 1}"
        loading="lazy"
        onclick="openImageLightboxByIndex(${idx})"
      >
    </div>
  `).join("");
}

function openEduModalById(id) {
  const item = eduData.find(v => String(v.id) === String(id));
  if (!item) return;

  const modalCategory = document.getElementById("modalCategory");
  const modalTitle = document.getElementById("modalTitle");
  const modalDesc = document.getElementById("modalDesc");
  const modalScript = document.getElementById("modalScript");
  const modalPoints = document.getElementById("modalPoints");
  const modalGallery = document.getElementById("modalGallery");
  const eduModal = document.getElementById("eduModal");

  if (!modalCategory || !modalTitle || !modalDesc || !modalScript || !modalPoints || !modalGallery || !eduModal) return;

  modalCategory.textContent = item.category || "기타";
  modalTitle.textContent = item.title || "제목 없음";
  modalDesc.textContent = item.desc || "설명이 없습니다.";
  modalScript.textContent = item.script || "추천 멘트가 없습니다.";

  modalPoints.innerHTML = Array.isArray(item.points) && item.points.length
    ? item.points.map(point => `<li>${escapeHtml(point)}</li>`).join("")
    : `<li>핵심 포인트가 없습니다.</li>`;

  modalGallery.innerHTML = buildGalleryHtml(item.images || [], item.title);

  currentLightboxImages = item.images || [];
  currentLightboxTitle = item.title || "상품자료";
  currentLightboxIndex = 0;

  eduModal.classList.add("show");
  document.body.style.overflow = "hidden";
}

function closeEduModal() {
  const eduModal = document.getElementById("eduModal");
  const eduLightbox = document.getElementById("eduLightbox");

  if (eduModal) eduModal.classList.remove("show");
  if (!eduLightbox || !eduLightbox.classList.contains("show")) {
    document.body.style.overflow = "";
  }
}

function updateLightboxView() {
  const lightbox = document.getElementById("eduLightbox");
  const img = document.getElementById("eduLightboxImg");
  const counter = document.getElementById("eduLightboxCounter");
  const prevBtn = document.getElementById("eduPrevBtn");
  const nextBtn = document.getElementById("eduNextBtn");

  if (!lightbox || !img || !counter || !prevBtn || !nextBtn) return;
  if (!currentLightboxImages.length) return;

  img.src = currentLightboxImages[currentLightboxIndex];
  img.alt = `${currentLightboxTitle} ${currentLightboxIndex + 1}`;
  counter.textContent = `${currentLightboxIndex + 1} / ${currentLightboxImages.length}`;

  prevBtn.disabled = currentLightboxImages.length <= 1;
  nextBtn.disabled = currentLightboxImages.length <= 1;

  lightbox.classList.add("show");
  document.body.style.overflow = "hidden";
}

function openImageLightboxByIndex(index) {
  if (!currentLightboxImages.length) return;
  currentLightboxIndex = index;
  updateLightboxView();
}

function showPrevImage() {
  if (!currentLightboxImages.length) return;
  currentLightboxIndex = (currentLightboxIndex - 1 + currentLightboxImages.length) % currentLightboxImages.length;
  updateLightboxView();
}

function showNextImage() {
  if (!currentLightboxImages.length) return;
  currentLightboxIndex = (currentLightboxIndex + 1) % currentLightboxImages.length;
  updateLightboxView();
}

function closeImageLightbox() {
  const lightbox = document.getElementById("eduLightbox");
  const img = document.getElementById("eduLightboxImg");
  const eduModal = document.getElementById("eduModal");

  if (lightbox) lightbox.classList.remove("show");
  if (img) img.src = "";

  if (!eduModal || !eduModal.classList.contains("show")) {
    document.body.style.overflow = "";
  }
}

function initEducationEvents() {
  const eduTabs = document.getElementById("eduTabs");
  const eduContentArea = document.getElementById("edu-content-area");
  const eduModalBackdrop = document.getElementById("eduModalBackdrop");
  const eduModalClose = document.getElementById("eduModalClose");
  const eduLightboxBackdrop = document.getElementById("eduLightboxBackdrop");
  const eduLightboxClose = document.getElementById("eduLightboxClose");
  const eduPrevBtn = document.getElementById("eduPrevBtn");
  const eduNextBtn = document.getElementById("eduNextBtn");

  if (eduTabs) {
    eduTabs.addEventListener("click", (e) => {
      const tab = e.target.closest(".edu-tab");
      if (!tab) return;

      currentEduCategory = tab.dataset.category;
      renderEdu();
    });
  }

  if (eduContentArea) {
    eduContentArea.addEventListener("click", (e) => {
      const card = e.target.closest(".edu-card-new");
      if (!card) return;
      openEduModalById(card.dataset.id);
    });
  }

  if (eduModalBackdrop) eduModalBackdrop.addEventListener("click", closeEduModal);
  if (eduModalClose) eduModalClose.addEventListener("click", closeEduModal);

  if (eduLightboxBackdrop) eduLightboxBackdrop.addEventListener("click", closeImageLightbox);
  if (eduLightboxClose) eduLightboxClose.addEventListener("click", closeImageLightbox);
  if (eduPrevBtn) eduPrevBtn.addEventListener("click", showPrevImage);
  if (eduNextBtn) eduNextBtn.addEventListener("click", showNextImage);

  window.addEventListener("keydown", (e) => {
    const lightbox = document.getElementById("eduLightbox");

    if (e.key === "Escape") {
      if (lightbox && lightbox.classList.contains("show")) {
        closeImageLightbox();
      } else {
        closeEduModal();
      }
    }

    if (lightbox && lightbox.classList.contains("show")) {
      if (e.key === "ArrowLeft") showPrevImage();
      if (e.key === "ArrowRight") showNextImage();
    }
  });
}

document.addEventListener("DOMContentLoaded", initEducationEvents);
