# Progress Log — Task 管理面板

## Session: 2026-08-04

### Phase 0: 需求釐清與規劃（規劃階段，非 task_plan 中的正式 phase）
- **Status:** complete
- Actions taken:
  - 盤點專案：`package.json`、`src/` 檔案樹、`App.tsx`、`TaskCard`/`Avatar`/`Badge`、`tokens.css`、`cx.ts`
  - 確認 Jotai 2.20.1 已安裝但尚未使用；`main.tsx` 缺 `<Provider>`
  - 向使用者確認三項關鍵決策：拖拉方案（@dnd-kit）、持久化（localStorage）、卡片元件（新建 BoardCard）
  - 用 context7 查證 `@dnd-kit` 多容器 API 與 Jotai `atomWithStorage`
  - 用 `npm view` 確認 `@dnd-kit/core@6.3.1`（React 19 相容）、`@dnd-kit/sortable@10.0.0`、`@dnd-kit/react@0.5.0`（0.x，不採用）
  - 建立 `task_plan.md` / `findings.md` / `progress.md`
- Files created/modified:
  - `task_plan.md`（created）
  - `findings.md`（created）
  - `progress.md`（created）

### Phase 1: 基礎建設（型別、狀態、依賴）
- **Status:** pending
- Actions taken:
  -
- Files created/modified:
  -

### Phase 2: BoardCard 展示元件
- **Status:** pending
- Actions taken:
  -
- Files created/modified:
  -

### Phase 3: 看板版面與資料串接
- **Status:** pending
- Actions taken:
  -
- Files created/modified:
  -

### Phase 4: CRUD —— 新增 / 修改 / 刪除
- **Status:** pending
- Actions taken:
  -
- Files created/modified:
  -

### Phase 5: 拖拉（@dnd-kit）
- **Status:** pending
- Actions taken:
  -
- Files created/modified:
  -

### Phase 6: 打磨與驗收
- **Status:** pending
- Actions taken:
  -
- Files created/modified:
  -

## Test Results
專案無測試框架，驗收以下列手動檢查為準。

| Test | Input | Expected | Actual | Status |
|------|-------|----------|--------|--------|
| 型別檢查 | `npm run build` | tsc + vite build 皆通過 | | pending |
| Lint | `npm run lint` | 0 error | | pending |
| 新增卡片 | 開啟 dialog → 填 title/desc/執行者 → 送出 | 卡片出現在指定欄位，日期為今天 | | pending |
| 編輯卡片 | 點卡片 edit → 改 title → 送出 | title 更新，`createdAt` 不變 | | pending |
| 刪除卡片 | 點 delete → 確認 | 卡片消失 | | pending |
| 跨欄拖曳 | 從「等待執行」拖到「執行中」 | 卡片落在新欄位，狀態同步更新 | | pending |
| 欄內排序 | 同欄上下拖曳 | 順序改變並保持 | | pending |
| 拖到空欄 | 把最後一張卡拖到空的「完成」欄 | 可成功放入 | | pending |
| 按鈕不被拖曳吃掉 | 直接點卡片上的 edit 按鈕 | dialog 開啟（未觸發拖曳） | | pending |
| 持久化 | 操作後重新整理頁面 | 卡片與順序保持不變 | | pending |
| 鍵盤拖曳 | Tab 到卡片 → Space → 方向鍵 → Space | 可用鍵盤移動卡片 | | pending |
| RWD | 視窗縮到 375px | 三欄不橫向溢出頁面 | | pending |

## Error Log
| Timestamp | Error | Attempt | Resolution |
|-----------|-------|---------|------------|
|           |       | 1       |            |

## 5-Question Reboot Check
| Question | Answer |
|----------|--------|
| Where am I? | Phase 1（規劃已完成，尚未動任何 src/ 程式碼） |
| Where am I going? | Phase 1 基礎建設 → 2 BoardCard → 3 看板版面 → 4 CRUD → 5 拖拉 → 6 打磨驗收 |
| What's the goal? | 純前端 Kanban 看板：卡片 CRUD（title/desc/執行者/自動創建日期）+ 三欄拖曳 + localStorage 持久化 |
| What have I learned? | 見 findings.md：專案慣例、可重用元件、@dnd-kit v6 vs 0.x API 差異、Jotai atomWithStorage 的 getOnInit |
| What have I done? | 完成專案盤點、三項技術決策確認、API 查證，建立三份規劃檔 |

---
*Update after completing each phase or encountering errors*
