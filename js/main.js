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

document.addEventListener("DOMContentLoaded", initGoogleSheetContent);
