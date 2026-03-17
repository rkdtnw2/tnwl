function escapeAttr(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function normalizeEduText(value) {
  return String(value ?? "").trim().toLowerCase();
}

function getEduCategories() {
  return [...new Set((eduData || []).map(item => item.category).filter(Boolean))];
}

function getEduKeyword() {
  const input = document.getElementById("edu-search-input");
  return normalizeEduText(input ? input.value : "");
}

function getEduFilteredData() {
  const keyword = getEduKeyword();

  return (eduData || []).filter(item => {
    const matchCategory = currentEduCategory === "all" || item.category === currentEduCategory;
    if (!matchCategory) return false;
    if (!keyword) return true;

    const haystack = [
      item.category,
      item.title,
      item.desc,
      item.meta,
      ...(item.points || []),
      item.script
    ]
      .join(" ")
      .toLowerCase();

    return haystack.includes(keyword);
  });
}

function updateEduCountBadge(data) {
  const badge = document.getElementById("edu-count-badge");
  if (!badge) return;
  badge.textContent = `${data.length}개 항목`;
}

function updateEduSearchStatus(data) {
  const status = document.getElementById("edu-search-status");
  const input = document.getElementById("edu-search-input");
  if (!status || !input) return;

  const keyword = input.value.trim();

  if (!keyword && currentEduCategory === "all") {
    status.textContent = "";
    return;
  }

  const parts = [];
  if (currentEduCategory !== "all") parts.push(`카테고리: ${currentEduCategory}`);
  if (keyword) parts.push(`검색어: "${keyword}"`);

  status.textContent = `${parts.join(" · ")} · ${data.length}건`;
}

function renderEduTabs() {
  const tabs = document.getElementById("eduTabs");
  if (!tabs) return;

  const categories = getEduCategories();

  tabs.innerHTML = `
    <button
      type="button"
      class="edu-tab ${currentEduCategory === "all" ? "active" : ""}"
      onclick="setEduCategory('all')"
    >
      전체
    </button>
    ${categories.map(category => `
      <button
        type="button"
        class="edu-tab ${currentEduCategory === category ? "active" : ""}"
        onclick="setEduCategory(${JSON.stringify(category)})"
      >
        ${escapeHtml(category)}
      </button>
    `).join("")}
  `;
}

function renderEduCards(data) {
  const area = document.getElementById("edu-content-area");
  if (!area) return;

  if (!data.length) {
    area.innerHTML = `
      <div class="empty-state" style="grid-column: 1 / -1;">
        등록된 상품자료가 없습니다.
      </div>
    `;
    return;
  }

  area.innerHTML = data.map((item, index) => {
    const bgClass = `edu-bg-${(index % 6) + 1}`;
    const imageHtml = item.image
      ? `<img class="edu-card-image" src="${escapeAttr(item.image)}" alt="${escapeAttr(item.title)}" loading="lazy" />`
      : `<div class="edu-card-image" style="display:flex;align-items:center;justify-content:center;">이미지 없음</div>`;

    return `
      <article class="edu-card-new ${bgClass}" onclick="openEduModal(${JSON.stringify(String(item.id))})">
        <div class="edu-card-image-wrap">
          ${imageHtml}
        </div>

        <div class="edu-card-top-new">
          <span class="edu-badge-new">${escapeHtml(item.category || "기타")}</span>
          <span class="edu-icon-new">${escapeHtml(item.icon || "📘")}</span>
        </div>

        <div class="edu-card-bottom-new">
          <h3>${escapeHtml(item.title)}</h3>
          <p>${escapeHtml(item.desc || "설명이 없습니다.")}</p>
          <div class="edu-meta-new">${escapeHtml(item.meta || "")}</div>
        </div>
      </article>
    `;
  }).join("");
}

function renderEdu() {
  const filtered = getEduFilteredData();
  renderEduTabs();
  renderEduCards(filtered);
  updateEduCountBadge(filtered);
  updateEduSearchStatus(filtered);
}

function setEduCategory(category) {
  currentEduCategory = category;
  renderEdu();
}

function handleEduSearchInput() {
  renderEdu();
}

function clearEduSearch() {
  const input = document.getElementById("edu-search-input");
  if (input) input.value = "";
  currentEduCategory = "all";
  renderEdu();
}

function findEduItemById(id) {
  return (eduData || []).find(item => String(item.id) === String(id));
}

function openEduModal(id) {
  const item = findEduItemById(id);
  if (!item) return;

  const modal = document.getElementById("eduModal");
  const category = document.getElementById("modalCategory");
  const title = document.getElementById("modalTitle");
  const desc = document.getElementById("modalDesc");
  const points = document.getElementById("modalPoints");
  const script = document.getElementById("modalScript");
  const gallery = document.getElementById("modalGallery");

  if (!modal || !category || !title || !desc || !points || !script || !gallery) return;

  category.textContent = item.category || "기타";
  title.textContent = item.title || "제목 없음";
  desc.textContent = item.desc || "설명이 없습니다.";

  points.innerHTML = (item.points && item.points.length)
    ? item.points.map(point => `<li>${escapeHtml(point)}</li>`).join("")
    : `<li>등록된 핵심 포인트가 없습니다.</li>`;

  script.textContent = item.script || "추천 멘트가 없습니다.";

  const images = item.images && item.images.length ? item.images : (item.image ? [item.image] : []);

  gallery.innerHTML = images.length
    ? images.map((img, index) => `
        <div class="edu-gallery-item">
          <img
            src="${escapeAttr(img)}"
            alt="${escapeAttr(item.title)} ${index + 1}"
            class="edu-gallery-img"
            loading="lazy"
            onclick="openEduLightboxById(${JSON.stringify(String(item.id))}, ${index})"
          />
        </div>
      `).join("")
    : `<div class="empty-state" style="grid-column:1 / -1;">등록된 이미지가 없습니다.</div>`;

  modal.classList.add("show");
  document.body.style.overflow = "hidden";
}

function closeEduModal() {
  const modal = document.getElementById("eduModal");
  if (!modal) return;
  modal.classList.remove("show");
  document.body.style.overflow = "";
}

function openEduLightbox(images, startIndex, title) {
  const lightbox = document.getElementById("eduLightbox");
  if (!lightbox) return;

  currentLightboxImages = images || [];
  currentLightboxIndex = startIndex || 0;
  currentLightboxTitle = title || "";

  updateEduLightbox();
  lightbox.classList.add("show");
  document.body.style.overflow = "hidden";
}

function openEduLightboxById(id, startIndex = 0) {
  const item = findEduItemById(id);
  if (!item) return;

  const images = item.images && item.images.length ? item.images : (item.image ? [item.image] : []);
  if (!images.length) return;

  openEduLightbox(images, startIndex, item.title || "");
}

function closeEduLightbox() {
  const lightbox = document.getElementById("eduLightbox");
  if (!lightbox) return;

  lightbox.classList.remove("show");
  currentLightboxImages = [];
  currentLightboxIndex = 0;
  currentLightboxTitle = "";
  document.body.style.overflow = "";
}

function updateEduLightbox() {
  const img = document.getElementById("eduLightboxImg");
  const counter = document.getElementById("eduLightboxCounter");
  const prevBtn = document.getElementById("eduPrevBtn");
  const nextBtn = document.getElementById("eduNextBtn");

  if (!img || !counter || !prevBtn || !nextBtn) return;
  if (!currentLightboxImages.length) return;

  img.src = currentLightboxImages[currentLightboxIndex];
  img.alt = `${currentLightboxTitle} ${currentLightboxIndex + 1}`;
  counter.textContent = `${currentLightboxIndex + 1} / ${currentLightboxImages.length}`;

  prevBtn.disabled = currentLightboxIndex === 0;
  nextBtn.disabled = currentLightboxIndex === currentLightboxImages.length - 1;
}

function moveEduLightbox(direction) {
  const next = currentLightboxIndex + direction;
  if (next < 0 || next >= currentLightboxImages.length) return;
  currentLightboxIndex = next;
  updateEduLightbox();
}

function bindEduEvents() {
  const modalClose = document.getElementById("eduModalClose");
  const modalBackdrop = document.getElementById("eduModalBackdrop");
  const lightboxClose = document.getElementById("eduLightboxClose");
  const lightboxBackdrop = document.getElementById("eduLightboxBackdrop");
  const prevBtn = document.getElementById("eduPrevBtn");
  const nextBtn = document.getElementById("eduNextBtn");

  if (modalClose) modalClose.addEventListener("click", closeEduModal);
  if (modalBackdrop) modalBackdrop.addEventListener("click", closeEduModal);
  if (lightboxClose) lightboxClose.addEventListener("click", closeEduLightbox);
  if (lightboxBackdrop) lightboxBackdrop.addEventListener("click", closeEduLightbox);
  if (prevBtn) prevBtn.addEventListener("click", () => moveEduLightbox(-1));
  if (nextBtn) nextBtn.addEventListener("click", () => moveEduLightbox(1));

  document.addEventListener("keydown", (event) => {
    const modal = document.getElementById("eduModal");
    const lightbox = document.getElementById("eduLightbox");

    if (event.key === "Escape") {
      if (lightbox && lightbox.classList.contains("show")) {
        closeEduLightbox();
        return;
      }
      if (modal && modal.classList.contains("show")) {
        closeEduModal();
      }
    }

    if (lightbox && lightbox.classList.contains("show")) {
      if (event.key === "ArrowLeft") moveEduLightbox(-1);
      if (event.key === "ArrowRight") moveEduLightbox(1);
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  bindEduEvents();
});
