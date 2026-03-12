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

    if (isCorrect) total += info.score;

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
    let detailHtml = `<div id="${detailId}" style="display:none; margin-top:10px; color:#94a3b8;">기존 기록</div>`;

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
