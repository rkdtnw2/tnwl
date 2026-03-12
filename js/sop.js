function openSection(sectionId) {
  document.getElementById("home").classList.remove("active");
  document.getElementById("top-bar").classList.add("visible");

  document.querySelectorAll(".section-content").forEach(sec => sec.classList.remove("active"));
  document.querySelectorAll(".tab-btn").forEach(btn => btn.classList.remove("active"));

  document.getElementById(sectionId).classList.add("active");
  const targetTab = document.getElementById("tab-" + sectionId);
  if (targetTab) targetTab.classList.add("active");

  if (sectionId === "test") {
    resetTestView();
  }
}

function goHome() {
  document.getElementById("home").classList.add("active");
  document.getElementById("top-bar").classList.remove("visible");

  document.querySelectorAll(".section-content").forEach(sec => sec.classList.remove("active"));
  document.querySelectorAll(".tab-btn").forEach(btn => btn.classList.remove("active"));
}

function switchTab(tabName, event) {
  document.getElementById("home").classList.remove("active");
  document.getElementById("top-bar").classList.add("visible");

  document.querySelectorAll(".section-content").forEach(sec => sec.classList.remove("active"));
  document.querySelectorAll(".tab-btn").forEach(btn => btn.classList.remove("active"));

  if (event && event.currentTarget) {
    event.currentTarget.classList.add("active");
  } else {
    const targetTab = document.getElementById("tab-" + tabName);
    if (targetTab) targetTab.classList.add("active");
  }

  document.getElementById(tabName).classList.add("active");

  if (tabName === "test") {
    resetTestView();
  }
}

function renderSOP(data) {
  const categoryGrid = document.getElementById("sop-category-grid");
  const contentArea = document.getElementById("sop-content-area");
  const countBadge = document.getElementById("sop-count-badge");

  categoryGrid.innerHTML = "";
  contentArea.innerHTML = "";

  if (!data.length) {
    countBadge.textContent = "0개 카테고리";
    contentArea.innerHTML = `<div class="empty-state">등록된 SOP 데이터가 없습니다.</div>`;
    return;
  }

  const groups = {};

  data.forEach(row => {
    const category = normalizeText(row.category) || "기타";
    const key = category;

    if (!groups[key]) {
      groups[key] = {
        category,
        icon: normalizeText(row.icon) || DEFAULT_ICON,
        color: getColorValue(row.color),
        items: []
      };
    }

    groups[key].items.push(row);
  });

  const categoryNames = Object.keys(groups);
  countBadge.textContent = `${categoryNames.length}개 카테고리`;

  categoryNames.forEach((key, index) => {
    const group = groups[key];
    const softColor = hexToRgba(group.color, 0.10);
    const strongColor = group.color;

    const btn = document.createElement("button");
    btn.className = "cat-btn" + (index === 0 ? " active" : "");
    btn.style.borderColor = hexToRgba(group.color, 0.24);
    btn.innerHTML = `
      <span class="cat-icon">${escapeHtml(group.icon)}</span>
      <p class="cat-text">${escapeHtml(group.category)}</p>
    `;

    if (index === 0) {
      btn.style.background = `linear-gradient(135deg, ${strongColor}, ${hexToRgba(group.color, 0.82)})`;
      btn.style.color = "#fff";
      btn.style.boxShadow = `0 10px 24px ${hexToRgba(group.color, 0.26)}`;
    } else {
      btn.style.background = `linear-gradient(180deg, #fff, ${softColor})`;
      btn.style.color = "#1e293b";
    }

    btn.onclick = () => {
      document.querySelectorAll("#sop-category-grid .cat-btn").forEach((b, idx) => {
        b.classList.remove("active");
        const currentKey = categoryNames[idx];
        const currentGroup = groups[currentKey];
        b.style.background = `linear-gradient(180deg, #fff, ${hexToRgba(currentGroup.color, 0.10)})`;
        b.style.color = "#1e293b";
        b.style.boxShadow = "0 8px 20px rgba(15, 23, 42, 0.05)";
      });

      btn.classList.add("active");
      btn.style.background = `linear-gradient(135deg, ${group.color}, ${hexToRgba(group.color, 0.82)})`;
      btn.style.color = "#fff";
      btn.style.boxShadow = `0 10px 24px ${hexToRgba(group.color, 0.26)}`;

      document.querySelectorAll("#sop-content-area .sop-group").forEach(g => g.classList.remove("active"));
      document.getElementById("sop-group-" + index).classList.add("active");
    };

    categoryGrid.appendChild(btn);

    const groupDiv = document.createElement("div");
    groupDiv.id = "sop-group-" + index;
    groupDiv.className = "sop-group" + (index === 0 ? " active" : "");

    const sortedItems = group.items.sort((a, b) => Number(a.order || 0) - Number(b.order || 0));

    groupDiv.innerHTML = sortedItems.map((item, idx2) => `
      <div class="card" style="--card-color:${group.color}; --card-soft:${hexToRgba(group.color, 0.10)}; --card-strong:${group.color};">
        <div class="card-color-line"></div>
        <div class="situation-tag">상황 ${Number(item.order || idx2 + 1)}: ${escapeHtml(item.title)}</div>
        <div class="speech-box">
          <div class="box-title">🗣️ 세일즈 화법</div>
          <p class="box-text">${escapeHtml(item.speech || "-")}</p>
        </div>
        <div class="rebuttal-box">
          <div class="box-title">🛡️ 반론 극복</div>
          <p class="box-text">${escapeHtml(item.rebuttal || "-")}</p>
        </div>
      </div>
    `).join("");

    contentArea.appendChild(groupDiv);
  });
}
