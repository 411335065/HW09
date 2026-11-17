# CLAUDE.md — Study Notes 筆記整理庫 專案規範

> 本檔與 `AGENTS.md` 內容必須**完全相同**。修改其一，務必同步複製到另一個。
> AI 每次新增或修改內容前，先完整閱讀本規範，並嚴格遵守。

## 1. 技術架構
- 純靜態網站：原生 HTML5 + CSS3 + Vanilla JS。
- **零外部框架、零 CDN、無建置步驟**，推上 GitHub Pages 即可瀏覽。
- 所有路徑一律使用**相對路徑**：根目錄頁面用 `./assets/style.css`；`/notes/` 內頁面用 `../assets/style.css`。禁止以 `/` 開頭的絕對路徑。
- 禁止 HTML 內寫行內樣式（`style="..."`）、`<style>` 區塊、行內事件（`onclick=` 等）與行內 `<script>`。

## 2. 視覺風格：乾淨、高可讀性的技術文件閱讀風
| 用途 | 變數 | 色碼 |
|---|---|---|
| 頁面底色 | `--c-bg` | `#FFFFFF` |
| 側邊欄／卡片底色 | `--c-surface` | `#F8FAFC` |
| 文字 | `--c-text` | `#1E293B` |
| 重點色（學術藍） | `--c-accent` | `#2563EB` |
| 邊框 | `--c-border` | `#E2E8F0` |

- 行高 `1.7`（`--lh`）、最大閱讀寬度 `800px`（`--read-width`）。
- 字體為系統字體堆疊（含繁中字體），不載入網路字型。
- RWD：寬度 ≤ 900px 時側邊欄收合，以漢堡選單開關。

## 3. 檔案結構
```
/index.html            首頁：依科目分區的筆記總覽卡片
/notes/                所有筆記頁面，命名 [科目縮寫]-[章節或主題].html（小寫、連字號）
/assets/style.css      全站唯一樣式表
/assets/app.js         導覽高亮、手機選單、關鍵字搜尋
/CLAUDE.md /AGENTS.md  本規範（內容相同）
```
科目縮寫範例：`dm` = 資料探勘。新科目請在此表登記：

| 縮寫 | 科目 |
|---|---|
| dm | 資料探勘 (Data Mining) |

目前筆記：`dm-ch1-ch2`（CH1–CH2 含問答）、`dm-ch3`（CH3 資料前處理）、`dm-ch6-ch8`（CH6、CH8）。

## 4. 筆記頁面標準結構
每頁須依序包含：`<aside class="sidebar">`（全站導覽）→ `.nav-overlay` → `.main`（內含 `.topbar` 漢堡按鈕與 `<main class="container">`）。`<main>` 內順序：頁首（麵包屑、`h1.page-title`、`.page-meta` 科目標籤）→ `.search-box` → 一至多個 `section.note-section[data-search-group]` → `#no-results`。

### 名詞定義卡片（Term Card）模板
```html
<article class="term-card" data-searchable>
  <header class="term-head">
    <span class="term-no">01</span>
    <h3 class="term-title">English Term</h3>
    <span class="term-zh">中文名稱</span>              <!-- 原稿有才寫 -->
  </header>
  <div class="def def-en"><span class="def-label">English Definition</span><p lang="en">…</p></div>
  <div class="def def-zh"><span class="def-label">中文白話解釋</span><p>…</p></div>
  <p class="example"><span class="badge">例</span><span class="badge badge-example">範例</span></p>
</article>
```
規則：
1. 英文原文與中文解釋**必須分開**呈現（`.def-en`／`.def-zh`）。
2. 原稿**沒有英文原文**時，省略 `.def-en`，**不得自行捏造**；原稿的內容不得竄改或遺漏。
3. 舉例一律用 Badge（`.badge` 標題 + `.badge-example` 各例）。
4. 每張卡片必須有 `data-searchable`，每個章節區塊必須有 `data-search-group`，搜尋功能才會運作。
5. 非「名詞 + 定義」的內容（問答、步驟、分類清單、方法比較）：同樣使用 `.term-card`，但定義區改放 `<div class="term-after">`，內含 `ul.note-list` / `ol.note-list`；每個清單項目以 `<strong>` 標示重點詞，英文原文用 `<span class="li-line" lang="en">`，中文用 `<span class="li-line">`，巢狀清單再放一層 `ul.note-list`。問答章節標題用 `DM01 (CH1) 問答` 格式，`id` 為 `dm01-qa`。
6. 原稿的圖片若無法重現，以文字整理其結構，並在卡片內說明「原稿為圖」。
7. 章節標題沿用原稿（如 `DM01 (CH1)`），`id` 用小寫（`dm01`）。

## 5. 導覽列規範
導覽列 HTML 置於 `<!-- NAV:START -->` 與 `<!-- NAV:END -->` 之間，格式：
```html
<div class="nav-group">
  <p class="nav-subject">科目中文 (English)</p>
  <ul class="nav-list">
    <li><a href="./notes/xxx.html">筆記簡稱</a></li>
  </ul>
</div>
```
- `index.html` 的連結前綴為 `./notes/`；`/notes/` 內頁面為 `./`，首頁連結為 `../index.html`。
- 目前頁面的高亮由 `app.js` 自動加上 `.is-active`，**不得手寫**。

## 6. AI 新增／修改內容必守規則
1. **新增筆記時必須同步**：（a）建立 `/notes/[縮寫]-[主題].html`；（b）在 `/index.html` 的 `SUBJECTS` 區塊加入 `.note-card`（含標題、一句描述、章節 Badge）；（c）更新**所有既有 HTML 頁面**（含 `index.html`）的 `NAV` 區塊，加入新連結，確保全站導覽一致。
2. 新科目：在 `index.html` 新增 `section.subject-block[data-search-group]`，在每頁導覽新增 `.nav-group`，並登記於第 3 節科目表。
3. **嚴禁更動** `/assets/style.css` 的 `:root` 基礎變數與色票。如需新樣式，只能在檔案末尾追加，且只能使用既有變數，並先向使用者說明。
4. 不得引入外部函式庫、字型、圖片 CDN 或建置工具。
5. 完成後自我檢查：連結不失效、相對路徑正確、無行內樣式／腳本、導覽在所有頁面一致、`CLAUDE.md` 與 `AGENTS.md` 相同、搜尋可正常過濾。

## 7. 部署
推送到 GitHub 後，於 Settings → Pages 選擇 `main` 分支的 `/ (root)` 即可。
