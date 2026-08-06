# Findings & Decisions — Task 管理面板

## Requirements
使用者原始需求（2026-08-04）：

- 新增一個 **task 管理面板** 功能
- 具備 **新增 / 修改 / 刪除**
- 可建立多張卡片，每張包含：**title + description + 執行者 + 自動顯示創建日期**
- 有 **等待執行 / 執行中 / 完成** 三個區塊，可 **拖動卡片** 在區塊之間移動
- **純前端功能**（不接後端 API）

澄清後補上的決策：
- 拖拉用 **@dnd-kit**（要觸控 + 鍵盤 + a11y）
- 資料 **持久化到 localStorage**（重新整理後卡片還在）
- **新建 BoardCard**，既有 `TaskCard` 保持原樣

## Research Findings

### 現有專案盤點
- React `19.2.7` / TypeScript `~6.0.2` / Vite `8.1.1` / **Jotai `2.20.1` 已在 dependencies，但目前程式碼完全沒用到**
- 無測試框架、無測試 script（`package.json` 只有 dev / build / lint / preview）
- 元件慣例：`src/components/<Name>/<Name>.tsx` + 同名 `.css`，元件內 `import './<Name>.css'`
- CSS 慣例：BEM-ish class 前綴 `ds-`（`ds-task-card__title`），使用 CSS nesting（`& .child {}`）
- `src/styles/tokens.css` 是 Figma 同步下來的 design tokens（`--ds-color-*`、`--ds-space-*`、`--ds-radius-*`、`--ds-text-*`）。檔頭註解明確寫「Do not edit them by hand — re-pull from Figma instead」
- `src/utils/cx.ts` 已有 `cx(...)` join class 的 helper，但 `Avatar`/`Badge`/`TaskCard` 目前仍手寫 `[...].filter(Boolean).join(' ')`（尚未改用）
- `src/main.tsx` 目前 **沒有** Jotai `<Provider>`，需要加
- `src/App.tsx` 仍是 Vite 樣板頁 + 一個 `#task-card-preview` 展示區塊

### 可重用的既有元件
- `Avatar` / `AvatarStack`（`src/components/Avatar/Avatar.tsx`）
  - `AvatarItem = { type:'image', src, alt? } | { type:'placeholder', initials, tone?:'blue'|'red' }`
  - 執行者可直接用 `{ type:'placeholder', initials }` 呈現
- `Badge`（`src/components/Badge/Badge.tsx`）：`tone?: 'red' | 'blue'`（**只有兩色**，若三欄都要 badge 需擴充 tone 或改用欄位標題呈現狀態）
- `TaskCard`（`src/components/TaskCard/TaskCard.tsx`）：**必填 `coverSrc`、無 `description`、無執行者姓名** → 不符合本次需求，故另建 `BoardCard`

### @dnd-kit（context7 查證）
- 版本：`@dnd-kit/core@6.3.1`（peer `react >=16.8.0` → React 19 相容）、`@dnd-kit/sortable@10.0.0`、另需 `@dnd-kit/utilities` 提供 `CSS.Transform.toString()`
- ⚠️ 注意：dndkit.com 官網文件現在同時混雜兩套 API，抄文件時要分清楚：
  - **新世代** `@dnd-kit/react@0.5.0`：`DragDropProvider`、`useDraggable({id})` 回傳 `{ ref, isDragging() }`（getter 形式）
  - **穩定版** `@dnd-kit/core@6`：`DndContext`、`useDroppable`/`useSortable` 回傳 `{ setNodeRef, attributes, listeners, transform, transition }`
  - **本專案採用穩定版 v6 API**
- 多容器（kanban）標準做法：
  - `DndContext` 提供 `onDragStart` / `onDragOver` / `onDragEnd`
  - **`onDragOver` 負責跨容器搬移**（拖到別欄時即時更新歸屬），`onDragEnd` 負責同容器排序 + 收尾
  - 每個 column 用 `useDroppable({ id: columnId })`，**空欄位一定要有 droppable**，否則沒有子項就沒有 drop target
  - `DragOverlay` 建議用 `createPortal(..., document.body)` 掛到 body，避免被欄位 `overflow` 裁切
  - `findColumn(id)`：先看 id 是不是欄位 id，再去各欄陣列找 → 因為 `over.id` 可能是卡片 id 也可能是欄位 id
- Sensors：`PointerSensor` 同時涵蓋 mouse / touch / pen；`KeyboardSensor` 搭配 `sortableKeyboardCoordinates` 提供鍵盤拖曳

### Jotai `atomWithStorage`（context7 查證）
- `import { atomWithStorage } from 'jotai/utils'`
- 簽名：`atomWithStorage(key, initialValue, storage?, options?)`
- **`getOnInit: true`** 很重要：預設（`false`）第一次 render 會先回傳 initialValue、之後才換成儲存值，會造成畫面閃一下 seed 資料
- 內建跨分頁同步（監聽 `storage` 事件）
- 若要防止 localStorage 被塞髒資料炸掉，可傳自訂 storage 物件在 `getItem` 內 try/catch + schema 驗證，失敗時 fallback 回 initialValue

## Technical Decisions

| Decision | Rationale |
|----------|-----------|
| 採 `@dnd-kit/core@6` 穩定版 API | `@dnd-kit/react@0.5.0` 仍是 0.x，API 尚未凍結；v6 生態文件與範例最多 |
| 跨欄搬移放 `onDragOver`，同欄排序放 `onDragEnd` | dnd-kit 官方 multiple-lists 範例的標準拆法；只用 `onDragEnd` 會沒有拖曳中的即時預覽 |
| 資料結構用扁平 `Task[]` | 編輯／刪除只需 `id` 查找；欄位歸屬由 `status` 決定，欄內順序由陣列相對順序表達，避免維護三個陣列的同步問題 |
| `createdAt: string`（ISO 8601） | JSON 序列化後 `Date` 物件會變字串，直接存 ISO 最一致；顯示時才用 `Intl.DateTimeFormat` 格式化 |
| `createdAt` 只在 create 時寫入，edit 不得覆寫 | 需求是「自動顯示創建日期」，編輯不應改動它 |
| id 用 `crypto.randomUUID()` | 瀏覽器原生、零依賴；Vite dev/prod 皆為 secure context 可用 |
| `PointerSensor` `activationConstraint: { distance: 8 }` | 讓整張卡片可拖曳的同時，卡片上的 edit / delete 按鈕點擊不會被拖曳攔截（不需要另做 drag handle） |
| 原生 `<dialog>` + `showModal()` | 內建 modal 焦點鎖、Esc 關閉、`::backdrop`，零依賴 |
| 樣式全部走 `--ds-*` tokens | 沿用專案既有規範；`tokens.css` 不手改，需要新值時在 `board.css` 內用既有 token 組合 |
| 檔案分層：`src/features/board/` + `src/components/BoardCard/` | atoms 與 board 邏輯集中在 feature 資料夾，純展示元件留在既有 `components/` 慣例下 |

## 資料模型（草案）

```ts
// src/features/board/types.ts
export type TaskStatus = 'todo' | 'in-progress' | 'done'

export type Task = {
  id: string          // crypto.randomUUID()
  title: string
  description: string
  assignee: string    // 執行者姓名；空字串代表未指派
  status: TaskStatus
  createdAt: string   // ISO 8601，建立時寫入，編輯不改
}

export const BOARD_COLUMNS = [
  { id: 'todo',        label: '等待執行' },
  { id: 'in-progress', label: '執行中'   },
  { id: 'done',        label: '完成'     },
] as const satisfies ReadonlyArray<{ id: TaskStatus; label: string }>
```

## Atoms 介面（草案）

```ts
// src/features/board/atoms.ts
export const tasksAtom = atomWithStorage<Task[]>(
  'board.tasks.v1', SEED_TASKS, undefined, { getOnInit: true },
)

// 衍生：依 status 分組，欄內順序 = tasksAtom 內的相對順序
export const tasksByStatusAtom = atom((get) => { /* group */ })

// 寫入專用（write-only atoms）
export const addTaskAtom    = atom(null, (get, set, input: NewTaskInput) => {...})
export const updateTaskAtom = atom(null, (get, set, p: { id: string; patch: TaskPatch }) => {...})
export const deleteTaskAtom = atom(null, (get, set, id: string) => {...})
export const moveTaskAtom   = atom(null, (get, set, p: MoveInput) => {...})
```

`NewTaskInput = Pick<Task,'title'|'description'|'assignee'> & { status?: TaskStatus }`
`TaskPatch = Partial<Pick<Task,'title'|'description'|'assignee'|'status'>>`（**刻意排除 `id` 與 `createdAt`**）

## 拖曳搬移演算法（扁平陣列版）

因為只有一個扁平 `Task[]`，欄內顯示順序就是陣列中的相對順序，`moveTaskAtom` 這樣算：

1. 由 `activeId` 找到來源 index `from`
2. 判斷 `overId`：
   - 若 `overId` 是欄位 id（拖到空欄或欄位空白處）→ 目標 status = 該欄，插到該欄**最後**（即該欄最後一張卡的 index + 1；該欄為空時插到陣列尾端）
   - 若 `overId` 是卡片 id → 目標 status = 該卡的 status，插到該卡片的 index（由上往下拖時 index 需 -1 修正）
3. `splice` 取出、更新 `status`、`splice` 插回 → 回傳新陣列（**不可 mutate 原陣列**，Jotai 靠 reference 判斷變更）

## Issues Encountered
| Issue | Resolution |
|-------|------------|
| dndkit.com 文件混用 v6 與 0.x 兩套 API，容易抄錯 | 已在上方明確標註兩者差異；實作一律以 `@dnd-kit/core@6` 的 `setNodeRef / attributes / listeners` 形式為準 |
| `Badge` 只支援 `red` / `blue` 兩種 tone，三欄狀態不夠用 | 狀態改由欄位標題表達，卡片上不放狀態 badge；若之後仍要 badge，再擴充 `BadgeTone`（會動到 design system 元件，需另外確認） |
| `tokens.css` 註解禁止手改 | 新樣式只組合既有 token；若真的缺值，寫在 `board.css` 的區域變數而非改 `tokens.css` |

## Resources
- @dnd-kit 多容器指南：https://dndkit.com/react/guides/multiple-sortable-lists
- @dnd-kit `useDraggable`：https://dndkit.com/react/hooks/use-draggable
- Jotai storage utils：https://github.com/pmndrs/jotai/blob/main/docs/utilities/storage.mdx
- 專案內相關檔案：
  - `src/components/TaskCard/TaskCard.tsx`（不要改，僅參考版面）
  - `src/components/Avatar/Avatar.tsx`、`src/components/Badge/Badge.tsx`（重用）
  - `src/styles/tokens.css`（token 來源，勿手改）
  - `src/utils/cx.ts`（class 組合 helper）
  - `.claude/rules/state-management.md`（強制 Jotai）

## Visual/Browser Findings
- 尚無。Phase 6 用 Playwright MCP 操作後再回填截圖觀察。

---
*Update this file after every 2 view/browser/search operations*
