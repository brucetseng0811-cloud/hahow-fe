# Task Plan: Task 管理面板（Kanban Board）

## Goal
在現有 React + TS + Vite 專案中，新增一個純前端的 Task 管理看板：可新增／修改／刪除卡片（title + desc + 執行者 + 自動創建日期），並在「等待執行 / 執行中 / 完成」三個區塊之間拖動卡片，狀態存於 localStorage。

## Next Step
執行 Phase 1：安裝 @dnd-kit 依賴，並建立 `src/features/board/types.ts` 與 `src/utils/date.ts`。

## Current Phase
Phase 1

## Phases

### Phase 1: 基礎建設（型別、狀態、依賴）
- [ ] `npm i @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities`
- [ ] 建立 `src/features/board/types.ts`：`Task`、`TaskStatus`、`BOARD_COLUMNS`
- [ ] 建立 `src/utils/date.ts`：`formatBoardDate(iso)` → `"23 Dec, 2022"`
- [ ] 建立 `src/features/board/atoms.ts`：`tasksAtom`（atomWithStorage）+ 衍生 `tasksByStatusAtom` + 寫入 atom（add / update / delete / move）
- [ ] 建立 `src/features/board/seed.ts`：3～4 筆示範資料
- [ ] `npm run build` 通過
- **Status:** pending

### Phase 2: BoardCard 展示元件
- [ ] 新增 `src/components/BoardCard/BoardCard.tsx` + `BoardCard.css`
- [ ] 版面：title / desc（clamp 2 行）/ 執行者 Avatar + 姓名 / 創建日期 `<time>`
- [ ] 右上角 edit + delete icon buttons（hover / focus-visible 顯示）
- [ ] 全部樣式走 `src/styles/tokens.css` 的 `--ds-*` 變數，不寫死數值
- [ ] 沿用既有 `Avatar`、`Badge`、`cx()`；**不動** 既有 `TaskCard`
- **Status:** pending

### Phase 3: 看板版面與資料串接（尚未拖拉）
- [ ] `src/features/board/BoardColumn.tsx` + `.css`：欄位標題、卡片數、空狀態、欄內「+ 新增」
- [ ] `src/features/board/Board.tsx` + `.css`：三欄 grid，讀 `tasksByStatusAtom` 渲染
- [ ] `src/main.tsx` 包上 Jotai `<Provider>`
- [ ] `src/App.tsx` 掛載 `<Board />`（放在既有 `#task-card-preview` 之前或取代 demo 區塊）
- [ ] 手動驗證：重新整理後 seed 資料仍在（localStorage 生效）
- **Status:** pending

### Phase 4: CRUD —— 新增 / 修改 / 刪除
- [ ] `src/features/board/TaskFormDialog.tsx` + `.css`：原生 `<dialog>` + `showModal()`
- [ ] 同一個 dialog 支援 create 與 edit 兩種模式（`mode` prop）
- [ ] 表單欄位：title（必填）、description（textarea）、assignee、status（select）
- [ ] 送出時：create → `addTaskAtom`（自動產生 id + createdAt）；edit → `updateTaskAtom`（**不可**改 createdAt）
- [ ] 刪除：`ConfirmDialog` 二次確認後呼叫 `deleteTaskAtom`
- [ ] Esc 關閉、backdrop 點擊關閉、關閉後焦點回到觸發按鈕
- **Status:** pending

### Phase 5: 拖拉（@dnd-kit）
- [ ] `Board.tsx` 包上 `DndContext`，設定 `PointerSensor`（`activationConstraint: { distance: 8 }`）+ `KeyboardSensor`（`sortableKeyboardCoordinates`）
- [ ] `BoardColumn` 使用 `useDroppable` + `SortableContext`（`verticalListSortingStrategy`）
- [ ] `SortableBoardCard` wrapper 使用 `useSortable`，把 `attributes/listeners/transform` 接到 `BoardCard`
- [ ] `onDragOver` 處理跨欄搬移、`onDragEnd` 處理同欄排序，寫回 `moveTaskAtom`
- [ ] `DragOverlay` + `createPortal` 呈現拖曳中的卡片
- [ ] 驗證空欄位可以接收 drop、卡片上的 edit/delete 按鈕不會被拖曳吃掉點擊
- **Status:** pending

### Phase 6: 打磨與驗收
- [ ] a11y：欄位 `aria-label`、卡片 `aria-roledescription`、`announcements` 中文化
- [ ] RWD：桌機三欄並排、窄螢幕改為垂直堆疊或橫向捲動
- [ ] 空看板 / 空欄位的空狀態文案
- [ ] `npm run lint` 與 `npm run build` 皆通過
- [ ] Playwright MCP 實際操作：新增 → 編輯 → 拖曳 → 刪除 → 重新整理，並截圖存證
- [ ] 更新 `CLAUDE.md` 的 Architecture 段落，說明 `src/features/board/`
- **Status:** pending

## Key Questions
1. 拖拉用哪套？ → **已決定：@dnd-kit stable（`@dnd-kit/core@6.3.1` + `@dnd-kit/sortable@10`）**
2. 資料是否持久化？ → **已決定：是，Jotai `atomWithStorage` 寫 localStorage**
3. 既有 TaskCard 怎麼處理？ → **已決定：新建 `BoardCard`，`TaskCard` 原封不動**
4. 欄內排序要不要支援？ → 要。用 `@dnd-kit/sortable`，同欄拖曳即為重新排序
5. 卡片順序怎麼存？ → 單一扁平 `Task[]`，欄位歸屬看 `status`，欄內順序 = 陣列相對順序（細節見 findings.md）

## Decisions Made
| Decision | Rationale |
|----------|-----------|
| @dnd-kit stable v6（非 `@dnd-kit/react@0.5`） | v6.3.1 為正式版且 peer dep `react >=16.8` 相容 React 19；`@dnd-kit/react` 仍在 0.x，API 會變 |
| Jotai `atomWithStorage` + `getOnInit: true` | 專案規則強制用 Jotai；`getOnInit` 避免首次 render 閃現 seed 資料再跳成儲存值 |
| 新建 `BoardCard`，不改 `TaskCard` | `TaskCard` 是 Figma 1:1 還原的 design system 元件（需要 `coverSrc`、無 desc），改它會讓日後從 Figma 重新同步產生衝突 |
| 扁平 `Task[]` + `status` 欄位 | 比 `Record<TaskStatus, Task[]>` 更好做 id 查找與編輯；欄內順序由陣列相對順序表達 |
| `createdAt` 存 ISO 8601 字串，顯示時才格式化 | localStorage 只能存字串；`Date` 物件經 JSON round-trip 會退化成字串，直接存 ISO 最一致 |
| `PointerSensor` 加 8px `activationConstraint` | 卡片本身可拖曳，同時讓卡片上的 edit / delete 按鈕仍能正常點擊 |
| 原生 `<dialog>` 做表單與確認框 | 零依賴，內建 modal 焦點鎖定、Esc 關閉與 backdrop |
| 功能檔放 `src/features/board/`，展示元件放 `src/components/BoardCard/` | 沿用既有 `src/components/<Name>/<Name>.tsx + .css` 慣例，同時把 board 專屬的 atoms/邏輯集中 |

## Errors Encountered
| Error | Attempt | Resolution |
|-------|---------|------------|
|       | 1       |            |

## Notes
- 三個欄位的 key 與顯示名：`todo`→「等待執行」、`in-progress`→「執行中」、`done`→「完成」
- 既有 `src/components/TaskCard/` 與 `src/App.tsx` 的 demo 區塊不要破壞
- 專案沒有測試框架，驗收以 `npm run build` + `npm run lint` + Playwright MCP 手動操作為準
- Update phase status as you progress: pending → in_progress → complete
- Re-read this plan before major decisions
- Log ALL errors - they help avoid repetition
