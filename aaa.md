<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>유림텔레콤 현장 대응 SOP 매뉴얼</title>
  <style>
    @import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css');

    :root {
      --primary: #d8006c;
      --primary-dark: #a50050;
      --primary-light: #fdf2f8;
      --bg: #eef2f6;
      --text-main: #1e293b;
      --text-sub: #64748b;
      --white: #ffffff;
      --line: #e2e8f0;
      --shadow-sm: 0 6px 16px rgba(15, 23, 42, 0.06);
      --shadow-md: 0 10px 24px rgba(15, 23, 42, 0.08);
      --radius-lg: 24px;
      --radius-md: 18px;
      --radius-sm: 12px;
    }

    * { box-sizing: border-box; }

    body {
      margin: 0;
      background: linear-gradient(180deg, #f3f5f8 0%, #edf1f5 100%);
      color: var(--text-main);
      font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, sans-serif;
      line-height: 1.6;
    }

    header {
      background: linear-gradient(135deg, var(--primary-dark), var(--primary));
      color: white;
      padding: 16px 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom-left-radius: 22px;
      border-bottom-right-radius: 22px;
      box-shadow: 0 8px 20px rgba(216, 0, 108, 0.22);
      position: sticky;
      top: 0;
      z-index: 100;
    }

    .header-left,
    .header-right {
      flex: 1;
      display: flex;
      align-items: center;
    }

    .header-left { justify-content: flex-start; }
    .header-right { justify-content: flex-end; }

    .header-center {
      flex: 2;
      text-align: center;
    }

    .header-logo {
      background: white;
      color: var(--primary);
      font-weight: 900;
      font-size: 0.95rem;
      padding: 7px 12px;
      border-radius: 10px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.15);
      letter-spacing: -0.4px;
    }

    .main-title {
      margin: 0;
      font-size: 1.25rem;
      font-weight: 900;
      letter-spacing: -0.5px;
    }

    .sub-title {
      margin: 0;
      font-size: 0.78rem;
      opacity: 0.92;
      font-weight: 500;
    }

    .container {
      max-width: 1100px;
      margin: 0 auto;
      padding: 28px 16px 42px;
    }

    .top-bar {
      display: none;
      gap: 10px;
      margin-bottom: 18px;
      flex-wrap: wrap;
      align-items: center;
    }

    .top-bar.visible {
      display: flex;
    }

    .tab-btn {
      border: none;
      background: #e8edf3;
      color: #475569;
      font-weight: 800;
      font-size: 0.95rem;
      padding: 12px 16px;
      border-radius: 999px;
      cursor: pointer;
      transition: 0.2s ease;
      box-shadow: 0 4px 10px rgba(15, 23, 42, 0.04);
    }

    .tab-btn:hover {
      transform: translateY(-1px);
    }

    .tab-btn.active {
      background: linear-gradient(135deg, var(--primary-dark), var(--primary));
      color: white;
      box-shadow: 0 8px 18px rgba(216, 0, 108, 0.18);
    }

    .section-content {
      display: none;
      animation: fadeIn 0.28s ease;
    }

    .section-content.active {
      display: block;
    }

    .home-screen {
      display: none;
      animation: fadeIn 0.3s ease;
    }

    .home-screen.active {
      display: block;
    }

    .home-wrap {
      display: flex;
      justify-content: center;
      align-items: flex-start;
      min-height: calc(100vh - 180px);
      padding-top: 4px;
    }

    .home-card {
      width: 100%;
      max-width: 720px;
      background: rgba(255,255,255,0.88);
      border-radius: 24px;
      box-shadow: 0 12px 28px rgba(15, 23, 42, 0.08);
      padding: 32px 20px 26px;
      text-align: center;
      border: 1px solid rgba(255,255,255,0.9);
      backdrop-filter: blur(8px);
    }

    .home-title {
      margin: 0 0 6px 0;
      color: var(--primary);
      font-size: 2rem;
      font-weight: 900;
      letter-spacing: -0.8px;
    }

    .home-desc {
      margin: 0 0 26px 0;
      color: var(--text-sub);
      font-size: 1rem;
      font-weight: 500;
    }

    .home-menu-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 14px;
    }

    .home-menu-btn {
      background: linear-gradient(180deg, #faf7fb 0%, #f7f4f8 100%);
      border: 1px solid #eadbf0;
      border-radius: 18px;
      padding: 26px 14px 22px;
      cursor: pointer;
      transition: all 0.2s ease;
      box-shadow: inset 0 1px 0 rgba(255,255,255,0.7), 0 6px 16px rgba(15, 23, 42, 0.04);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 112px;
    }

    .home-menu-btn:hover {
      transform: translateY(-3px);
      border-color: rgba(216,0,108,0.25);
      box-shadow: 0 12px 24px rgba(216,0,108,0.08);
      background: linear-gradient(180deg, #fffafd 0%, #faf2f8 100%);
    }

    .home-menu-icon {
      font-size: 2rem;
      display: block;
      margin-bottom: 10px;
      line-height: 1;
    }

    .home-menu-title {
      font-size: 1rem;
      font-weight: 900;
      color: #0f172a;
      letter-spacing: -0.3px;
    }

    .section-shell {
      background: rgba(255,255,255,0.9);
      border-radius: 22px;
      box-shadow: var(--shadow-sm);
      padding: 18px;
      border: 1px solid rgba(255,255,255,0.95);
      backdrop-filter: blur(8px);
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 14px;
      margin-bottom: 18px;
      flex-wrap: wrap;
    }

    .section-title-wrap h3 {
      margin: 0 0 4px;
      font-size: 1.35rem;
      font-weight: 900;
      letter-spacing: -0.5px;
    }

    .section-title-wrap p {
      margin: 0;
      color: var(--text-sub);
      font-size: 0.92rem;
    }

    .data-badge {
      background: #f8fafc;
      border: 1px solid var(--line);
      color: #475569;
      padding: 8px 12px;
      border-radius: 999px;
      font-size: 0.82rem;
      font-weight: 700;
    }

    .category-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
      gap: 10px;
      margin-bottom: 20px;
    }

    .cat-btn {
      border: 1px solid #e2e8f0;
      background: white;
      border-radius: 18px;
      padding: 16px 12px;
      text-align: center;
      cursor: pointer;
      transition: 0.2s ease;
      display: flex;
      flex-direction: column;
      gap: 8px;
      align-items: center;
      justify-content: center;
      min-height: 110px;
      height: auto;
      box-shadow: 0 8px 20px rgba(15, 23, 42, 0.05);
    }

    .cat-btn:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-md);
    }

    .cat-btn.active {
      transform: translateY(-2px);
      color: white;
    }

    .cat-icon {
      font-size: 1.5rem;
      line-height: 1;
    }

    .cat-text {
      margin: 0;
      font-size: 0.82rem;
      font-weight: 900;
      line-height: 1.4;
      word-break: keep-all;
      white-space: normal;
      overflow-wrap: break-word;
      display: block;
      max-width: 100%;
    }

    .sop-group {
      display: none;
      animation: fadeIn 0.28s ease;
    }

    .sop-group.active {
      display: block;
    }

    .card {
      background: white;
      border-radius: 18px;
      padding: 18px;
      margin-bottom: 18px;
      border: 1px solid #eaf0f6;
      box-shadow: var(--shadow-sm);
      position: relative;
      overflow: hidden;
    }

    .card-color-line {
      position: absolute;
      inset: 0 0 auto 0;
      height: 5px;
      background: var(--card-color, var(--primary));
    }

    .situation-tag {
      display: block;
      padding: 12px 14px;
      border-radius: 14px;
      font-size: 1rem;
      font-weight: 900;
      margin: 10px 0 14px;
      line-height: 1.45;
      word-break: keep-all;
      border-left: 5px solid var(--card-color, var(--primary));
      background: var(--card-soft, #fff1f6);
      color: var(--card-strong, var(--primary-dark));
    }

    .speech-box,
    .rebuttal-box,
    .content-box {
      padding: 14px;
      border-radius: 12px;
      margin-bottom: 10px;
      border-left: 4px solid;
    }

    .speech-box {
      background: #f0fdf4;
      border-left-color: #22c55e;
    }

    .rebuttal-box {
      background: var(--card-soft, #fdf2f8);
      border-left-color: var(--card-color, var(--primary));
    }

    .content-box {
      background: #f8fafc;
      border-left-color: #94a3b8;
    }

    .box-title {
      font-size: 0.9rem;
      font-weight: 900;
      margin-bottom: 6px;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .speech-box .box-title { color: #166534; }
    .rebuttal-box .box-title { color: var(--card-strong, var(--primary-dark)); }
    .content-box .box-title { color: #334155; }

    .box-text {
      margin: 0;
      font-size: 0.96rem;
      color: #334155;
      line-height: 1.6;
      font-weight: 500;
      white-space: pre-line;
    }

    .edu-section-wrap {
      padding: 8px 0 0;
    }

    .edu-toolbar {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin-bottom: 22px;
    }

    .edu-tab {
      border: 1px solid #ead8e1;
      background: #fff;
      color: #555;
      padding: 11px 18px;
      border-radius: 999px;
      font-size: 14px;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .edu-tab:hover {
      transform: translateY(-1px);
      box-shadow: 0 8px 20px rgba(216, 0, 108, 0.08);
    }

    .edu-tab.active {
      background: linear-gradient(135deg, #d8006c, #ff5ba0);
      color: #fff;
      border-color: transparent;
    }

    .edu-grid-new {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
      gap: 18px;
    }

    .edu-card-new {
      position: relative;
      overflow: hidden;
      border-radius: 24px;
      min-height: 340px;
      color: #fff;
      cursor: pointer;
      display: flex;
      flex-direction: column;
      box-shadow: 0 18px 34px rgba(0, 0, 0, 0.12);
      transition: transform 0.25s ease, box-shadow 0.25s ease;
      padding: 0;
    }

    .edu-card-new:hover {
      transform: translateY(-4px);
      box-shadow: 0 22px 40px rgba(0, 0, 0, 0.18);
    }

    .edu-card-new::before {
      content: "";
      position: absolute;
      inset: 0;
      background:
        linear-gradient(to top, rgba(0, 0, 0, 0.72), rgba(0, 0, 0, 0.18)),
        radial-gradient(circle at top right, rgba(255, 255, 255, 0.14), transparent 35%);
      z-index: 1;
      pointer-events: none;
    }

    .edu-card-new > * {
      position: relative;
      z-index: 2;
    }

    .edu-card-image-wrap {
      width: 100%;
      height: 190px;
      background: rgba(255,255,255,0.08);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 12px;
    }

    .edu-card-image {
      width: 100%;
      height: 100%;
      object-fit: contain;
      display: block;
      border-radius: 12px;
      background: rgba(255,255,255,0.04);
    }

    .edu-card-top-new {
      display: flex;
      justify-content: space-between;
      align-items: start;
      gap: 12px;
      padding: 18px 18px 0;
    }

    .edu-badge-new {
      display: inline-block;
      padding: 8px 12px;
      border-radius: 999px;
      background: rgba(255,255,255,0.18);
      backdrop-filter: blur(8px);
      font-size: 12px;
      font-weight: 700;
    }

    .edu-icon-new {
      width: 42px;
      height: 42px;
      border-radius: 14px;
      background: rgba(255,255,255,0.18);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
    }

    .edu-card-bottom-new {
      margin-top: auto;
      padding: 0 18px 18px;
    }

    .edu-card-bottom-new h3 {
      font-size: 24px;
      font-weight: 800;
      margin: 0 0 10px;
      line-height: 1.35;
    }

    .edu-card-bottom-new p {
      font-size: 14px;
      line-height: 1.65;
      opacity: 0.95;
      margin: 0 0 14px;
    }

    .edu-meta-new {
      font-size: 13px;
      opacity: 0.92;
      font-weight: 600;
    }

    .edu-bg-1 { background: linear-gradient(135deg, #d8006c, #ff7ca8); }
    .edu-bg-2 { background: linear-gradient(135deg, #6a5cff, #8f7dff); }
    .edu-bg-3 { background: linear-gradient(135deg, #00a389, #37c8a7); }
    .edu-bg-4 { background: linear-gradient(135deg, #ff8a00, #ffb347); }
    .edu-bg-5 { background: linear-gradient(135deg, #1f6feb, #58a6ff); }
    .edu-bg-6 { background: linear-gradient(135deg, #7b2cbf, #c77dff); }

    .edu-modal {
      display: none;
    }

    .edu-modal.show {
      display: block;
    }

    .edu-modal-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(15, 23, 42, 0.58);
      z-index: 999;
    }

    .edu-modal-content {
      position: fixed;
      top: 50%;
      left: 50%;
      width: min(980px, calc(100% - 32px));
      max-height: 88vh;
      overflow-y: auto;
      transform: translate(-50%, -50%);
      background: #fff;
      border-radius: 28px;
      z-index: 1000;
      padding: 28px;
      box-shadow: 0 30px 60px rgba(0, 0, 0, 0.24);
    }

    .edu-modal-close {
      position: absolute;
      top: 18px;
      right: 18px;
      width: 42px;
      height: 42px;
      border: none;
      border-radius: 50%;
      background: #f7f2f5;
      font-size: 26px;
      cursor: pointer;
    }

    .edu-modal-top {
      padding: 6px 0 24px;
      border-bottom: 1px solid #eee;
    }

    .edu-modal-badge {
      display: inline-block;
      margin-bottom: 12px;
      padding: 8px 12px;
      border-radius: 999px;
      background: #ffe7f1;
      color: #d8006c;
      font-size: 13px;
      font-weight: 700;
    }

    .edu-modal-top h3 {
      font-size: 30px;
      margin: 0 0 10px;
      color: #222;
    }

    .edu-modal-top p {
      margin: 0;
      font-size: 15px;
      line-height: 1.7;
      color: #555;
    }

    .edu-gallery {
      margin-top: 18px;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 14px;
    }

    .edu-gallery-item {
      border: 1px solid #e2e8f0;
      background: #f8fafc;
      border-radius: 18px;
      overflow: hidden;
      padding: 10px;
    }

    .edu-gallery-img {
      width: 100%;
      height: 220px;
      object-fit: contain;
      display: block;
      background: #f8fafc;
      cursor: pointer;
      border-radius: 12px;
    }

    .edu-modal-body {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 18px;
      margin-top: 22px;
    }

    .edu-modal-box {
      background: #faf7f9;
      border: 1px solid #f0e4eb;
      border-radius: 20px;
      padding: 20px;
    }

    .edu-modal-box h4 {
      margin: 0 0 14px;
      font-size: 18px;
      color: #222;
    }

    .edu-modal-box ul {
      margin: 0;
      padding-left: 18px;
    }

    .edu-modal-box li {
      margin-bottom: 10px;
      color: #444;
      line-height: 1.6;
    }

    .edu-script {
      white-space: pre-line;
      background: #fff;
      border-left: 4px solid #d8006c;
      border-radius: 14px;
      padding: 16px;
      line-height: 1.8;
      color: #333;
    }

    .edu-lightbox {
      display: none;
    }

    .edu-lightbox.show {
      display: block;
    }

    .edu-lightbox-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.86);
      z-index: 1200;
    }

    .edu-lightbox-content {
      position: fixed;
      inset: 24px;
      z-index: 1201;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 14px;
    }

    .edu-lightbox-close {
      position: absolute;
      top: 0;
      right: 0;
      width: 46px;
      height: 46px;
      border: none;
      border-radius: 50%;
      background: rgba(255,255,255,0.92);
      font-size: 28px;
      cursor: pointer;
    }

    .edu-lightbox-counter {
      position: absolute;
      top: 2px;
      left: 0;
      color: white;
      font-weight: 800;
      background: rgba(0,0,0,0.5);
      padding: 8px 14px;
      border-radius: 999px;
      font-size: 0.92rem;
    }

    .edu-lightbox-stage {
      width: 100%;
      height: 100%;
      display: grid;
      grid-template-columns: 64px 1fr 64px;
      align-items: center;
      gap: 10px;
    }

    .edu-lightbox-nav {
      width: 52px;
      height: 52px;
      border: none;
      border-radius: 50%;
      background: rgba(255,255,255,0.92);
      color: #111827;
      font-size: 28px;
      font-weight: 900;
      cursor: pointer;
      justify-self: center;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .edu-lightbox-nav:disabled {
      opacity: 0.35;
      cursor: default;
    }

    .edu-lightbox-img-wrap {
      display: flex;
      align-items: center;
      justify-content: center;
      min-width: 0;
      min-height: 0;
      height: 100%;
    }

    .edu-lightbox-img {
      max-width: 100%;
      max-height: calc(100vh - 120px);
      object-fit: contain;
      border-radius: 16px;
      background: #fff;
      padding: 8px;
      user-select: none;
      -webkit-user-drag: none;
    }

    .role-select {
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
      gap: 10px;
      margin-bottom: 18px;
    }

    .role-btn {
      padding: 10px 16px;
      border-radius: 999px;
      border: 1px solid var(--primary);
      background: white;
      color: var(--primary);
      font-weight: 800;
      cursor: pointer;
      transition: 0.2s ease;
    }

    .role-btn.active {
      background: linear-gradient(135deg, var(--primary-dark), var(--primary));
      color: white;
      box-shadow: 0 10px 22px rgba(216,0,108,0.18);
    }

    .test-box {
      background: white;
      padding: 22px;
      border-radius: 18px;
      box-shadow: var(--shadow-sm);
      border: 1px solid #eaf0f6;
    }

    .question {
      margin-bottom: 24px;
      padding-bottom: 16px;
      border-bottom: 1px dashed #e2e8f0;
    }

    .question:last-of-type {
      border-bottom: none;
      margin-bottom: 0;
      padding-bottom: 0;
    }

    .question h4 {
      margin: 0 0 12px;
      color: var(--text-main);
      font-size: 1rem;
      line-height: 1.5;
      font-weight: 900;
    }

    .question label {
      display: block;
      padding: 12px 14px;
      margin-bottom: 8px;
      font-size: 0.95rem;
      cursor: pointer;
      color: #475569;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      transition: 0.18s ease;
      font-weight: 600;
    }

    .question label:hover {
      background: #f1f5f9;
      border-color: #cbd5e1;
      transform: translateY(-1px);
    }

    input[type="radio"] {
      margin-right: 8px;
      accent-color: var(--primary);
    }

    input[type="text"],
    input[type="password"] {
      width: 100%;
      padding: 14px;
      margin-bottom: 15px;
      border: 1px solid #cbd5e1;
      border-radius: 12px;
      font-size: 1rem;
      background: #f8fafc;
      font-weight: 700;
      outline: none;
      transition: 0.18s ease;
    }

    input[type="text"]:focus,
    input[type="password"]:focus {
      border-color: rgba(216,0,108,0.5);
      box-shadow: 0 0 0 4px rgba(216,0,108,0.08);
    }

    .submit-btn {
      width: 100%;
      padding: 15px 16px;
      background: linear-gradient(135deg, var(--primary-dark), var(--primary));
      color: white;
      border: none;
      border-radius: 14px;
      font-size: 1.02rem;
      font-weight: 900;
      cursor: pointer;
      margin-top: 10px;
      box-shadow: 0 10px 24px rgba(216,0,108,0.18);
      transition: 0.2s ease;
    }

    .submit-btn:hover {
      transform: translateY(-1px);
    }

    .warning-text {
      color: #ef4444;
      font-size: 0.86rem;
      font-weight: 800;
      text-align: center;
      margin-bottom: 15px;
      line-height: 1.55;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 18px;
      font-size: 0.92rem;
      overflow: hidden;
      border-radius: 14px;
      background: white;
    }

    th, td {
      padding: 12px;
      text-align: left;
      border-bottom: 1px solid #e2e8f0;
    }

    th {
      background: #f8eaf1;
      color: var(--primary);
      font-weight: 900;
    }

    .empty-state,
    .loading-state,
    .error-state {
      background: white;
      border-radius: 18px;
      padding: 24px;
      text-align: center;
      color: #64748b;
      border: 1px solid #e2e8f0;
      box-shadow: var(--shadow-sm);
    }

    .loading-state strong,
    .error-state strong {
      display: block;
      color: #1e293b;
      font-size: 1.03rem;
      margin-bottom: 6px;
    }

    .muted {
      color: #64748b;
      font-size: 0.9rem;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(8px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @media (max-width: 640px) {
      .home-card {
        max-width: 100%;
      }

      .home-menu-grid {
        grid-template-columns: 1fr;
      }

      .home-title {
        font-size: 1.65rem;
      }
    }

    @media (max-width: 640px) {
      header {
        padding: 14px 14px;
        border-bottom-left-radius: 18px;
        border-bottom-right-radius: 18px;
      }

      .main-title {
        font-size: 1.05rem;
      }

      .sub-title {
        font-size: 0.72rem;
      }

      .container {
        padding: 18px 12px 30px;
      }

      .home-wrap {
        min-height: auto;
      }

      .home-card {
        padding: 26px 16px 20px;
        border-radius: 20px;
      }

      .home-title {
        font-size: 1.45rem;
      }

      .home-desc {
        font-size: 0.93rem;
      }

      .section-shell {
        padding: 14px;
      }

      .category-grid {
        grid-template-columns: repeat(2, 1fr);
      }

      .top-bar {
        flex-direction: column;
        align-items: stretch;
      }

      .tab-btn {
        width: 100%;
      }

      th, td {
        padding: 10px 8px;
        font-size: 0.84rem;
      }

      .edu-card-new {
        min-height: 280px;
      }

      .edu-card-image-wrap {
        height: 170px;
      }

      .edu-card-bottom-new h3 {
        font-size: 20px;
      }

      .edu-modal-body {
        grid-template-columns: 1fr;
      }

      .edu-modal-top h3 {
        font-size: 24px;
      }

      .edu-gallery {
        grid-template-columns: 1fr;
      }

      .edu-lightbox-content {
        inset: 12px;
      }

      .edu-lightbox-stage {
        grid-template-columns: 48px 1fr 48px;
      }

      .edu-lightbox-nav {
        width: 42px;
        height: 42px;
        font-size: 24px;
      }
    }

    .category-grid {
      grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)) !important;
    }

    .cat-btn {
      min-height: 120px !important;
      height: auto !important;
      padding: 16px 12px !important;
    }

    .cat-text {
      white-space: normal !important;
      word-break: keep-all !important;
      overflow-wrap: break-word !important;
      line-height: 1.4 !important;
    }

    @media (max-width: 640px) {
      .cat-btn {
        min-height: 120px !important;
      }

      .cat-text {
        font-size: 0.8rem !important;
      }
    }
  </style>
</head>
<body>
  <header>
    <div class="header-left">
      <span class="header-logo">유림텔레콤</span>
    </div>
    <div class="header-center">
      <h2 class="main-title">현장 대응 SOP</h2>
      <p class="sub-title">신입 플래너 교육용</p>
    </div>
    <div class="header-right"></div>
  </header>

  <div class="container">
    <section id="home" class="home-screen active">
      <div class="home-wrap">
        <div class="home-card">
          <h1 class="home-title">유림텔레콤 현장 대응 SOP</h1>
          <p class="home-desc">원하시는 메뉴를 선택해 주세요.</p>

          <div class="home-menu-grid">
            <button class="home-menu-btn" onclick="openSection('sop')">
              <span class="home-menu-icon">📖</span>
              <span class="home-menu-title">SOP 상황별 매뉴얼</span>
            </button>

            <button class="home-menu-btn" onclick="openSection('edu')">
              <span class="home-menu-icon">📚</span>
              <span class="home-menu-title">상품자료</span>
            </button>

            <button class="home-menu-btn" onclick="openSection('test')">
              <span class="home-menu-icon">📝</span>
              <span class="home-menu-title">테스트</span>
            </button>
          </div>
        </div>
      </div>
    </section>

    <div id="top-bar" class="top-bar">
      <button class="tab-btn" onclick="goHome()">🏠 홈</button>
      <button class="tab-btn" id="tab-sop" onclick="switchTab('sop', event)">📖 SOP 매뉴얼</button>
      <button class="tab-btn" id="tab-edu" onclick="switchTab('edu', event)">📚 상품자료</button>
      <button class="tab-btn" id="tab-test" onclick="switchTab('test', event)">📝 테스트</button>
    </div>

    <section id="sop" class="section-content">
      <div class="section-shell">
        <div class="section-header">
          <div class="section-title-wrap">
            <h3>📖 SOP 매뉴얼</h3>
            <p>카테고리별 현장 대응 상황과 실전 화법을 확인하세요.</p>
          </div>
          <div class="data-badge" id="sop-count-badge">로딩 중...</div>
        </div>

        <div id="sop-category-grid" class="category-grid"></div>
        <div id="sop-content-area"></div>
      </div>
    </section>

    <section id="edu" class="section-content">
      <div class="section-shell">
        <div class="section-header">
          <div class="section-title-wrap">
            <h3>📚 상품자료</h3>
            <p>사진 클릭 후 길게 누르면 이미지 저장 가능합니다.</p>
          </div>
          <div class="data-badge" id="edu-count-badge">로딩 중...</div>
        </div>

        <div class="edu-section-wrap">
          <div class="edu-toolbar" id="eduTabs"></div>
          <div id="edu-content-area" class="edu-grid-new">
            <div class="loading-state">
              <strong>상품자료를 불러오는 중입니다.</strong>
              <div>구글시트 데이터를 확인하고 있어요.</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section id="test" class="section-content">
      <div class="section-shell">
        <div class="section-header">
          <div class="section-title-wrap">
            <h3>📝 테스트</h3>
            <p>구글시트에서 문제를 관리하고, 결과는 브라우저에 저장됩니다.</p>
          </div>
          <div class="data-badge" id="test-count-badge">로딩 중...</div>
        </div>

        <div class="role-select" id="role-selector">
          <button class="role-btn active" id="btn-planner" onclick="switchRole('planner')">👨‍💼 신입 플래너용</button>
          <button class="role-btn" id="btn-manager" onclick="switchRole('manager')">👑 점장/관리자용</button>
        </div>

        <div id="planner-intro" class="test-box">
          <h3 style="color: var(--primary); text-align: center; margin-top: 0;">📝 실전 세일즈 모의고사</h3>
          <p class="warning-text">
            ⚠️ 주의: [시험 시작하기]를 누르면 상단 메뉴가 숨겨집니다.<br>
            새로고침 시 입력 상태가 초기화됩니다.
          </p>
          <input type="text" id="planner-name-intro" placeholder="응시자 이름 입력 (예: 홍길동)" />
          <button class="submit-btn" onclick="startExam()">시험 시작하기</button>
        </div>

        <div id="planner-exam" class="test-box" style="display:none;">
          <h3 style="color: var(--primary); border-bottom: 2px solid #e2e8f0; padding-bottom: 10px; margin-top: 0;">
            응시자: <span id="display-name" style="color:#1e293b;"></span>
          </h3>
          <input type="hidden" id="planner-name" />
          <div id="test-question-area"></div>
          <button class="submit-btn" onclick="submitDynamicTest()">답안 최종 제출하기</button>
        </div>

        <div id="manager-view" class="test-box" style="display:none;">
          <div id="login-area">
            <h3 style="display:flex; align-items:center; gap:10px; margin-top:0; margin-bottom:20px;">🔒 관리자 로그인</h3>
            <input type="password" id="manager-pwd" placeholder="관리자 비밀번호 입력" />
            <button class="submit-btn" onclick="checkManagerPassword()">로그인</button>
          </div>

          <div id="dashboard-area" style="display:none;">
            <h3 style="color: var(--primary); margin-top:0;">📊 플래너 테스트 결과 현황</h3>
            <table id="result-table">
              <thead>
                <tr>
                  <th>이름</th>
                  <th>점수</th>
                  <th>응시 시간</th>
                </tr>
              </thead>
              <tbody id="result-body"></tbody>
            </table>
            <button onclick="clearData()" style="padding: 12px 20px; background: #cbd5e1; border:none; border-radius:12px; cursor:pointer; font-weight: 800; margin-top: 20px; width: 100%;">시험 기록 초기화</button>
          </div>
        </div>
      </div>
    </section>
  </div>

  <div class="edu-modal" id="eduModal">
    <div class="edu-modal-backdrop" id="eduModalBackdrop"></div>
    <div class="edu-modal-content">
      <button class="edu-modal-close" id="eduModalClose">×</button>
      <div class="edu-modal-top">
        <span class="edu-modal-badge" id="modalCategory">카테고리</span>
        <h3 id="modalTitle">제목</h3>
        <p id="modalDesc">설명</p>
        <div id="modalGallery" class="edu-gallery"></div>
      </div>
      <div class="edu-modal-body">
        <div class="edu-modal-box">
          <h4>핵심 포인트</h4>
          <ul id="modalPoints"></ul>
        </div>
        <div class="edu-modal-box">
          <h4>추천 멘트</h4>
          <div class="edu-script" id="modalScript"></div>
        </div>
      </div>
    </div>
  </div>

  <div class="edu-lightbox" id="eduLightbox">
    <div class="edu-lightbox-backdrop" id="eduLightboxBackdrop"></div>
    <div class="edu-lightbox-content">
      <div class="edu-lightbox-counter" id="eduLightboxCounter">1 / 1</div>
      <button class="edu-lightbox-close" id="eduLightboxClose">×</button>

      <div class="edu-lightbox-stage">
        <button class="edu-lightbox-nav" id="eduPrevBtn" type="button" aria-label="이전 이미지">‹</button>

        <div class="edu-lightbox-img-wrap">
          <img id="eduLightboxImg" class="edu-lightbox-img" src="" alt="확대 이미지">
        </div>

        <button class="edu-lightbox-nav" id="eduNextBtn" type="button" aria-label="다음 이미지">›</button>
      </div>
    </div>
  </div>

  <script>
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
  </script>
</body>
</html>
