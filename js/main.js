const CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vROVBZlJbe3DKK0q9NT8aYjcob7lhscT_O88TrdqhfUMWx1vIWX0vSiEH4M0Iq1iebOCe6Z_W20_cWM/pub?gid=1576805448&single=true&output=csv";
const EDU_SPREADSHEET_URL = "https://docs.google.com/spreadsheets/d/1irp_D1Sd8b1CJees0iO6iIzw_92BX3v70mW4e2MCQzw/edit?gid=1752227120#gid=1752227120";

const COLOR_MAP = {
  핑크: "#E30678",
  파랑: "#3B82F6",
  블루: "#3B82F6",
  초록: "#22C55E",
  그린: "#22C55E",
  주황: "#F59E0B",
  오렌지: "#F59E0B",
  보라: "#8B5CF6",
  퍼플: "#8B5CF6",
  빨강: "#EF4444",
  레드: "#EF4444",
  청록: "#06B6D4",
  민트: "#14B8A6",
  회색: "#64748B",
  그레이: "#64748B"
};

const DEFAULT_COLOR = "#D8006C";
const DEFAULT_ICON = "📂";
const MANAGER_PASSWORD = "ureem!";

let sheetData = [];
let sopData = [];
let eduData = [];
let testData = [];
let dynamicTestAnswerKey = {};
let currentEduCategory = "all";

let currentLightboxImages = [];
let currentLightboxIndex = 0;
let currentLightboxTitle = "";

const FALLBACK_EDU_DATA = [
  {
    id: "1",
    category: "응대",
    title: "고객이 매장에 들어왔는데 말이 없을 때",
    desc: "첫 인사와 착석 유도, 자연스러운 대화 시작 흐름",
    images: [],
    image: "",
    icon: "💬",
    meta: "고객응대 · 기초",
    points: [
      "3초 안에 먼저 인사하기",
      "부담 없는 첫 질문으로 대화 시작하기",
      "자연스럽게 자리 안내하기",
      "필름/요금점검으로 연결하기"
    ],
    script: "안녕하세요 고객님 😊\n혹시 휴대폰 보시러 오셨어요?\n편하게 앉으셔도 됩니다."
  }
];

function normalizeText(value) {
  return (value ?? "")
    .toString()
    .replace(/\uFEFF/g, "")
    .replace(/\u200B/g, "")
    .replace(/\u00A0/g, " ")
    .trim();
}

function convertImageUrl(url) {
  const raw = normalizeText(url);
  if (!raw) return "";

  if (raw.includes("drive.google.com")) {
    const fileMatch = raw.match(/\/d\/([a-zA-Z0-9_-]+)/);
    const openMatch = raw.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    const fileId = fileMatch ? fileMatch[1] : (openMatch ? openMatch[1] : "");
    if (fileId) {
      return `https://drive.google.com/thumbnail?id=${fileId}&sz=w1600`;
    }
  }

  if (raw.includes("imgur.com")) {
    if (raw.includes("i.imgur.com")) return raw;

    const singleMatch = raw.match(/imgur\.com\/([a-zA-Z0-9]+)(?:\.[a-zA-Z]+)?(?:[/?#].*)?$/);
    if (singleMatch && singleMatch[1] && !raw.includes("/a/") && !raw.includes("/gallery/")) {
      return `https://i.imgur.com/${singleMatch[1]}.png`;
    }
  }

  return raw;
}

function hasImage(url) {
  return !!normalizeText(url);
}

function getColorValue(colorName) {
  const raw = normalizeText(colorName);
  if (!raw) return DEFAULT_COLOR;
  if (raw.startsWith("#")) return raw;
  return COLOR_MAP[raw] || DEFAULT_COLOR;
}

function hexToRgba(hex, alpha = 1) {
  let c = hex.replace("#", "");
  if (c.length === 3) c = c.split("").map(ch => ch + ch).join("");
  const num = parseInt(c, 16);
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function escapeHtml(str) {
  return String(str ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function parseCSV(text) {
  const rows = [];
  let row = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const next = text[i + 1];

    if (char === '"') {
      if (inQuotes && next === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === "," && !inQuotes) {
      row.push(current);
      current = "";
    } else if ((char === "\n" || char === "\r") && !inQuotes) {
      if (char === "\r" && next === "\n") i++;
      row.push(current);
      if (row.some(cell => cell !== "")) rows.push(row);
      row = [];
      current = "";
    } else {
      current += char;
    }
  }

  if (current !== "" || row.length > 0) {
    row.push(current);
    if (row.some(cell => cell !== "")) rows.push(row);
  }

  if (!rows.length) return [];

  const headers = rows[0].map(h => normalizeText(h));
  return rows.slice(1).map(cols => {
    const obj = {};
    headers.forEach((header, idx) => {
      obj[header] = normalizeText(cols[idx] || "");
    });
    return obj;
  });
}

async function fetchSheetData() {
  const url = CSV_URL + (CSV_URL.includes("?") ? "&" : "?") + "t=" + Date.now();
  const res = await fetch(url);
  if (!res.ok) throw new Error("CSV 데이터를 불러오지 못했습니다.");
  const csvText = await res.text();
  return parseCSV(csvText);
}

function safeText(value, fallback = "") {
  return (value ?? "").toString().trim() || fallback;
}

function parseSpreadsheetInfo(url) {
  const idMatch = url.match(/\/d\/([a-zA-Z0-9-_]+)/);
  const gidMatch = url.match(/[?&#]gid=([0-9]+)/);
  return {
    sheetId: idMatch ? idMatch[1] : "",
    gid: gidMatch ? gidMatch[1] : "0"
  };
}

function parseGvizResponse(text) {
  const jsonText = text
    .replace(/^[\s\S]*setResponse\(/, "")
    .replace(/\);\s*$/, "");
  return JSON.parse(jsonText);
}

function getCellValue(cell) {
  if (!cell) return "";
  if (cell.f && typeof cell.f === "string") return cell.f;
  if (cell.v === null || cell.v === undefined) return "";
  return String(cell.v);
}

function splitEduPoints(row) {
  const points = [];

  for (let i = 1; i <= 6; i++) {
    const value =
      safeText(row[`point${i}`]) ||
      safeText(row[`포인트${i}`]);

    if (value) points.push(value);
  }

  const merged =
    safeText(row.points) ||
    safeText(row.포인트) ||
    safeText(row["교육포인트"]) ||
    safeText(row["교육 포인트"]);

  if (!points.length && merged) {
    return merged
      .split(/\n|\/|,/)
      .map(v => v.trim())
      .filter(Boolean);
  }

  return points;
}

function collectEduImages(row) {
  const rawImages = [
    row.image,
    row.이미지,
    row.image1,
    row.image2,
    row.image3,
    row.image4,
    row.image5,
    row.image6,
    row.이미지1,
    row.이미지2,
    row.이미지3,
    row.이미지4,
    row.이미지5,
    row.이미지6
  ];

  const converted = rawImages
    .map(v => convertImageUrl(v))
    .filter(v => normalizeText(v));

  return [...new Set(converted)];
}

function normalizeEduRow(row, index) {
  const images = collectEduImages(row);

  return {
    id: safeText(row.id || row.ID, String(index + 1)),
    category: safeText(row.category || row.카테고리, "기타"),
    title: safeText(row.title || row.제목, "제목 없음"),
    desc: safeText(row.desc || row.description || row.설명, "설명이 없습니다."),
    images,
    image: images[0] || "",
    icon: safeText(row.icon || row.아이콘, "📘"),
    meta: safeText(row.meta || row.메타 || row.분류, ""),
    points: splitEduPoints(row),
    script: safeText(
      row.script ||
      row.멘트 ||
      row["추천멘트"] ||
      row["추천 멘트"],
      "추천 멘트가 없습니다."
    )
  };
}

async function fetchEduSheetData() {
  const { sheetId, gid } = parseSpreadsheetInfo(EDU_SPREADSHEET_URL);
  if (!sheetId) throw new Error("상품자료 구글시트 ID를 찾을 수 없습니다.");

  const gvizUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?gid=${gid}&tqx=out:json&t=${Date.now()}`;
  const response = await fetch(gvizUrl);

  if (!response.ok) {
    throw new Error("상품자료 구글시트 데이터를 불러오지 못했습니다.");
  }

  const text = await response.text();
  const json = parseGvizResponse(text);
  const table = json.table;

  if (!table || !table.cols || !table.rows) {
    throw new Error("상품자료 시트 형식이 올바르지 않습니다.");
  }

  const headers = table.cols.map((col, index) => {
    const label = safeText(col.label);
    return label || `col${index}`;
  });

  return table.rows.map((row) => {
    const obj = {};
    headers.forEach((header, index) => {
      obj[header] = getCellValue(row.c[index]);
    });
    return obj;
  });
}

function openSection(sectionId) {
  document.getElementById("home").classList.remove("active");
  document.getElementById("top-bar").classList.add("visible");

  document.querySelectorAll(".section-content").forEach(sec => sec.classList.remove("active"));
  document.querySelectorAll(".tab-btn").forEach(btn => btn.classList.remove("active"));

  document.getElementById(sectionId).classList.add("active");
  const targetTab = document.getElementById("tab-" + sectionId);
  if (targetTab) targetTab.classList.add("active");

  if (sectionId === "test") resetTestView();
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

  if (event) event.target.classList.add("active");
  document.getElementById(tabName).classList.add("active");

  if (tabName === "test") resetTestView();
}

function setLoadingState() {
  document.getElementById("sop-category-grid").innerHTML = "";
  document.getElementById("sop-content-area").innerHTML = `
    <div class="loading-state">
      <strong>데이터를 불러오는 중입니다.</strong>
      <div>구글시트 CSV 데이터를 읽고 있어요.</div>
    </div>
  `;
  document.getElementById("eduTabs").innerHTML = "";
  document.getElementById("edu-content-area").innerHTML = `
    <div class="loading-state">
      <strong>상품자료를 불러오는 중입니다.</strong>
      <div>잠시만 기다려 주세요.</div>
    </div>
  `;
  document.getElementById("test-question-area").innerHTML = `
    <div class="loading-state">
      <strong>테스트 문항을 불러오는 중입니다.</strong>
      <div>잠시만 기다려 주세요.</div>
    </div>
  `;
}

function setErrorState(message) {
  document.getElementById("sop-content-area").innerHTML = `
    <div class="error-state">
      <strong>데이터 로드 실패</strong>
      <div>${escapeHtml(message)}</div>
      <div class="muted" style="margin-top:8px;">CSV URL과 구글시트 웹 게시 상태를 확인해 주세요.</div>
    </div>
  `;
  document.getElementById("eduTabs").innerHTML = "";
  document.getElementById("edu-content-area").innerHTML = `
    <div class="error-state">
      <strong>상품자료 로드 실패</strong>
      <div>${escapeHtml(message)}</div>
    </div>
  `;
  document.getElementById("test-question-area").innerHTML = `
    <div class="error-state">
      <strong>테스트 로드 실패</strong>
      <div>${escapeHtml(message)}</div>
    </div>
  `;
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

function getEduBgClass(index) {
  const classes = ["edu-bg-1", "edu-bg-2", "edu-bg-3", "edu-bg-4", "edu-bg-5", "edu-bg-6"];
  return classes[index % classes.length];
}

function renderEduTabs() {
  const eduTabs = document.getElementById("eduTabs");
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
        <span class="edu-badge-new">${escapeHtml(item.category)}</span>
        <div class="edu-icon-new">${escapeHtml(item.icon)}</div>
      </div>

      ${hasImage(item.image) ? `
        <div class="edu-card-image-wrap">
          <img class="edu-card-image" src="${escapeHtml(item.image)}" alt="${escapeHtml(item.title)}" loading="lazy">
        </div>
      ` : ""}

      <div class="edu-card-bottom-new">
        <h3>${escapeHtml(item.title)}</h3>
        <p>${escapeHtml(item.desc)}</p>
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
  if (!images.length) return "";

  return images.map((img, idx) => `
    <div class="edu-gallery-item">
      <img
        class="edu-gallery-img"
        src="${escapeHtml(img)}"
        alt="${escapeHtml(title)} ${idx + 1}"
        loading="lazy"
        onclick="openImageLightboxByIndex(${idx})"
      >
    </div>
  `).join("");
}

function openEduModalById(id) {
  const item = eduData.find(v => String(v.id) === String(id));
  if (!item) return;

  document.getElementById("modalCategory").textContent = item.category;
  document.getElementById("modalTitle").textContent = item.title;
  document.getElementById("modalDesc").textContent = item.desc;
  document.getElementById("modalScript").textContent = item.script;

  const modalPoints = document.getElementById("modalPoints");
  modalPoints.innerHTML = item.points.length
    ? item.points.map(point => `<li>${escapeHtml(point)}</li>`).join("")
    : `<li>핵심 포인트가 없습니다.</li>`;

  document.getElementById("modalGallery").innerHTML = buildGalleryHtml(item.images || [], item.title);

  currentLightboxImages = item.images || [];
  currentLightboxTitle = item.title || "상품자료";
  currentLightboxIndex = 0;

  document.getElementById("eduModal").classList.add("show");
  document.body.style.overflow = "hidden";
}

function closeEduModal() {
  document.getElementById("eduModal").classList.remove("show");
  if (!document.getElementById("eduLightbox").classList.contains("show")) {
    document.body.style.overflow = "";
  }
}

function updateLightboxView() {
  const lightbox = document.getElementById("eduLightbox");
  const img = document.getElementById("eduLightboxImg");
  const counter = document.getElementById("eduLightboxCounter");
  const prevBtn = document.getElementById("eduPrevBtn");
  const nextBtn = document.getElementById("eduNextBtn");

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

  lightbox.classList.remove("show");
  img.src = "";

  if (!document.getElementById("eduModal").classList.contains("show")) {
    document.body.style.overflow = "";
  }
}

function renderTest(data) {
  const testArea = document.getElementById("test-question-area");
  const countBadge = document.getElementById("test-count-badge");
  testArea.innerHTML = "";

  if (!data.length) {
    countBadge.textContent = "0문항";
    testArea.innerHTML = `<div class="empty-state">등록된 테스트 문항이 없습니다.</div>`;
    dynamicTestAnswerKey = {};
    return;
  }

  const sorted = data.sort((a, b) => Number(a.order || 0) - Number(b.order || 0));
  countBadge.textContent = `${sorted.length}문항`;

  const questionsHtml = sorted.map((q, idx) => `
    <div class="question">
      <h4>${idx + 1}. ${escapeHtml(q.title)}</h4>
      <label><input type="radio" name="q${idx + 1}" value="1"> ${escapeHtml(q.choice1)}</label>
      <label><input type="radio" name="q${idx + 1}" value="2"> ${escapeHtml(q.choice2)}</label>
      <label><input type="radio" name="q${idx + 1}" value="3"> ${escapeHtml(q.choice3)}</label>
    </div>
  `).join("");

  testArea.innerHTML = questionsHtml;

  dynamicTestAnswerKey = sorted.reduce((acc, q, idx) => {
    acc[`q${idx + 1}`] = {
      answer: String(q.answer),
      score: 10
    };
    return acc;
  }, {});
}

function switchRole(role) {
  document.getElementById("btn-planner").classList.remove("active");
  document.getElementById("btn-manager").classList.remove("active");
  document.getElementById("planner-intro").style.display = "none";
  document.getElementById("planner-exam").style.display = "none";
  document.getElementById("manager-view").style.display = "none";

  document.getElementById("btn-" + role).classList.add("active");

  if (role === "planner") {
    document.getElementById("planner-intro").style.display = "block";
  } else {
    document.getElementById("manager-view").style.display = "block";
    document.getElementById("login-area").style.display = "block";
    document.getElementById("dashboard-area").style.display = "none";
    document.getElementById("manager-pwd").value = "";
  }
}

function resetTestView() {
  document.getElementById("btn-planner").classList.add("active");
  document.getElementById("btn-manager").classList.remove("active");
  document.getElementById("role-selector").style.display = "flex";
  document.getElementById("planner-intro").style.display = "block";
  document.getElementById("planner-exam").style.display = "none";
  document.getElementById("manager-view").style.display = "none";
}

function startExam() {
  const nameInput = document.getElementById("planner-name-intro").value.trim();
  if (!nameInput) {
    alert("응시자 이름을 정확히 입력해야 시험을 시작할 수 있습니다.");
    return;
  }

  if (!testData.length) {
    alert("테스트 문항 데이터가 없습니다. 구글시트를 확인해 주세요.");
    return;
  }

  document.getElementById("planner-name").value = nameInput;
  document.getElementById("display-name").innerText = nameInput;

  document.getElementById("top-bar").classList.remove("visible");
  document.getElementById("role-selector").style.display = "none";
  document.getElementById("planner-intro").style.display = "none";
  document.getElementById("planner-exam").style.display = "block";
}

function submitDynamicTest() {
  const name = document.getElementById("planner-name").value;
  let total = 0;
  const answerDetails = [];

  for (const key in dynamicTestAnswerKey) {
    const info = dynamicTestAnswerKey[key];

    const checked = document.querySelector(`input[name="${key}"]:checked`);
    if (!checked) {
      alert("아직 풀지 않은 문제가 있습니다. 모든 문제를 풀어주세요.");
      return;
    }

    const questionNumber = Number(key.replace("q", "")) - 1;
    const questionData = testData[questionNumber] || {};

    const selectedValue = checked.value;
    const selectedText = questionData[`choice${selectedValue}`] || "";
    const correctValue = String(info.answer);
    const correctText = questionData[`choice${correctValue}`] || "";
    const isCorrect = selectedValue === correctValue;

    if (isCorrect) {
      total += info.score;
    }

    answerDetails.push({
      questionNo: questionNumber + 1,
      questionTitle: questionData.title || `${questionNumber + 1}번 문제`,
      selectedValue,
      selectedText,
      correctValue,
      correctText,
      isCorrect
    });
  }

  const date = new Date().toLocaleString();
  const records = JSON.parse(localStorage.getItem("sopTestResults_ureem")) || [];

  records.push({
    name,
    score: total,
    date,
    answers: answerDetails
  });

  localStorage.setItem("sopTestResults_ureem", JSON.stringify(records));

  alert(`${name} 플래너님, 답안이 제출되었습니다.\n수고하셨습니다.`);
  location.reload();
}

function checkManagerPassword() {
  const pwd = document.getElementById("manager-pwd").value;
  if (pwd === MANAGER_PASSWORD) {
    document.getElementById("login-area").style.display = "none";
    document.getElementById("dashboard-area").style.display = "block";
    loadResults();
  } else {
    alert("비밀번호가 틀렸습니다.");
  }
}

function toggleAnswerDetail(button, detailId) {
  const detailEl = document.getElementById(detailId);
  if (!detailEl) return;

  const isOpen = detailEl.style.display === "block";
  detailEl.style.display = isOpen ? "none" : "block";
  button.textContent = isOpen ? "상세보기" : "닫기";
}

function loadResults() {
  const records = JSON.parse(localStorage.getItem("sopTestResults_ureem")) || [];
  const tbody = document.getElementById("result-body");
  tbody.innerHTML = "";

  const tableHeadRow = document.querySelector("#result-table thead tr");
  if (tableHeadRow) {
    tableHeadRow.innerHTML = `
      <th>이름</th>
      <th>점수</th>
      <th>틀린 번호</th>
      <th>응시 시간</th>
      <th>상세</th>
    `;
  }

  if (!records.length) {
    tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;">아직 응시한 플래너가 없습니다.</td></tr>';
    return;
  }

  records.slice().reverse().forEach((record, index) => {
    const detailId = `answer-detail-${index}`;
    let wrongNumbersText = `<span style="color:#16a34a; font-weight:800;">전부 정답</span>`;
    let detailHtml = `<div style="color:#94a3b8;">기존 기록</div>`;

    if (Array.isArray(record.answers) && record.answers.length > 0) {
      const wrongAnswers = record.answers.filter(answer => !answer.isCorrect);

      if (wrongAnswers.length > 0) {
        wrongNumbersText = wrongAnswers
          .map(answer => `${answer.questionNo}번`)
          .join(", ");
      }

      detailHtml = `
        <div id="${detailId}" style="display:none; margin-top:10px;">
          ${record.answers.map(answer => `
            <div style="margin-bottom:10px; padding:10px; background:#f8fafc; border:1px solid #e2e8f0; border-radius:10px;">
              <div style="font-weight:800; color:#1e293b; margin-bottom:4px;">
                ${escapeHtml(String(answer.questionNo))}. ${escapeHtml(answer.questionTitle)}
              </div>
              <div style="color:#475569; font-size:0.9rem; margin-bottom:3px;">
                체크: ${escapeHtml(answer.selectedText || "-")}
              </div>
              <div style="color:${answer.isCorrect ? '#16a34a' : '#ef4444'}; font-size:0.88rem; font-weight:800;">
                ${answer.isCorrect ? '정답' : `오답 (정답: ${escapeHtml(answer.correctText || "-")})`}
              </div>
            </div>
          `).join("")}
        </div>
      `;
    } else {
      wrongNumbersText = `<span style="color:#94a3b8;">기록 없음</span>`;
    }

    const row = `
      <tr>
        <td style="font-weight:800; vertical-align:top;">${escapeHtml(record.name)}</td>
        <td style="color:${record.score >= 80 ? "#e30678" : "#ef4444"}; font-weight:900; vertical-align:top;">${record.score}점</td>
        <td style="vertical-align:top; font-weight:700; color:#334155;">${wrongNumbersText}</td>
        <td style="color:#64748b; font-size:0.84rem; vertical-align:top;">${escapeHtml(record.date)}</td>
        <td style="vertical-align:top; min-width:220px;">
          <button
            onclick="toggleAnswerDetail(this, '${detailId}')"
            style="padding:8px 12px; border:none; border-radius:8px; background:#e30678; color:#fff; font-weight:800; cursor:pointer;"
          >
            상세보기
          </button>
          ${detailHtml}
        </td>
      </tr>
    `;
    tbody.innerHTML += row;
  });
}

function clearData() {
  if (confirm("정말 모든 시험 기록을 삭제하시겠습니까? (복구 불가)")) {
    localStorage.removeItem("sopTestResults_ureem");
    loadResults();
  }
}

async function initGoogleSheetContent() {
  try {
    setLoadingState();

    if (!CSV_URL || CSV_URL.includes("여기에_구글시트_CSV_URL")) {
      throw new Error("코드 상단의 CSV_URL에 구글시트 CSV 주소를 넣어주세요.");
    }

    sheetData = await fetchSheetData();

    sopData = sheetData.filter(row => normalizeText(row["menu"]).replace(/\s+/g, "").toUpperCase() === "SOP");
    testData = sheetData.filter(row => normalizeText(row["menu"]).replace(/\s+/g, "").toUpperCase() === "TEST");

    try {
      const eduRows = await fetchEduSheetData();
      eduData = eduRows.map((row, index) => normalizeEduRow(row, index));
      if (!eduData.length) eduData = FALLBACK_EDU_DATA;
    } catch (eduError) {
      console.error("상품자료 시트 로드 실패:", eduError);
      eduData = FALLBACK_EDU_DATA;
    }

    renderSOP(sopData);
    renderEdu();
    renderTest(testData);
  } catch (error) {
    console.error(error);
    setErrorState(error.message || "알 수 없는 오류가 발생했습니다.");
  }
}

document.getElementById("eduTabs").addEventListener("click", (e) => {
  const tab = e.target.closest(".edu-tab");
  if (!tab) return;

  currentEduCategory = tab.dataset.category;
  renderEdu();
});

document.getElementById("edu-content-area").addEventListener("click", (e) => {
  const card = e.target.closest(".edu-card-new");
  if (!card) return;
  openEduModalById(card.dataset.id);
});

document.getElementById("eduModalBackdrop").addEventListener("click", closeEduModal);
document.getElementById("eduModalClose").addEventListener("click", closeEduModal);

document.getElementById("eduLightboxBackdrop").addEventListener("click", closeImageLightbox);
document.getElementById("eduLightboxClose").addEventListener("click", closeImageLightbox);
document.getElementById("eduPrevBtn").addEventListener("click", showPrevImage);
document.getElementById("eduNextBtn").addEventListener("click", showNextImage);

window.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    if (document.getElementById("eduLightbox").classList.contains("show")) {
      closeImageLightbox();
    } else {
      closeEduModal();
    }
  }

  if (document.getElementById("eduLightbox").classList.contains("show")) {
    if (e.key === "ArrowLeft") showPrevImage();
    if (e.key === "ArrowRight") showNextImage();
  }
});

document.addEventListener("DOMContentLoaded", initGoogleSheetContent);
