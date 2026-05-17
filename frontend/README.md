# DTAI · Frontend Prototype (Mercado)

DTAI 食材掃描 + 食譜推薦的前端原型,純靜態 HTML + JSX (Babel),無建置流程。

## 檔案結構

### 主檔案
- **`Mercado Prototype.html`** — 完整可互動 web app(響應式,手機/電腦皆可)
- **`index.html`** — 設計探索畫布(3 個視覺方向 × 5 個畫面並排對比,給設計討論用)

### 共用依賴
- `data.jsx` — 食材清單、食譜資料、`<FoodImage>` 元件
- `ios-frame.jsx` — iPhone bezel(只有 `index.html` 用)
- `design-canvas.jsx` — 設計畫布(只有 `index.html` 用)
- `tweaks-panel.jsx` — Tweaks 控制面板(只有 `index.html` 用)

### Mercado 方向
- `mercado-prototype.jsx` — 互動原型(`Mercado Prototype.html` 用)
- `mercado.jsx` — 靜態版本(`index.html` 用)

### 其他兩個方向(設計畫布用)
- `verde.jsx` — 鮮綠市場風
- `pantry-os.jsx` — 暗色 AI 終端風

## (mock) 欄位

以下欄位是前端 mock,等後端串接後就能拔掉:

| 欄位 | 來源 |
|---|---|
| 到期日 / `daysLeft` | 需要 OCR 或規則表 |
| 食譜資料 | 需要食譜資料庫 |
| 存放位置 | inventory table 尚無此欄位 |
| 統計(EXPIRING / OVERDUE) | 依賴到期日 |

**已串接(真實)**:`class_name`、`class_index`、`confidence`、`source`(model)。

## 部署

純靜態,可以放任何能 serve HTML 的地方:

### GitHub Pages
```bash
git add .
git commit -m "frontend prototype"
git push
```
然後 Settings → Pages → Source = `main` branch root,等 1 分鐘。
入口檔: `Mercado Prototype.html`(或設成 `index.html`)

### Vercel / Netlify
拖整個資料夾進去 drop zone 就好。

### 本機跑
```bash
python -m http.server 8000
# 開 http://localhost:8000/Mercado%20Prototype.html
```

## 後端串接點(給後端工程師看)

前端需要這些 API:

```
POST /scan           multipart: image
                     → { class_name, class_index, confidence, source }

GET  /inventory      → [{ id, item_name, quantity, last_added_at,
                          expiry_date?, location? }]

POST /inventory      { item_name, expiry_date?, location? }

GET  /recipes?ids=…  根據食材 id 列表推薦食譜
                     → [{ id, name, min, kcal, uses[], steps[] }]
```

`data.jsx` 裡的 `FOODS` 與 `RECIPES` 就是上面這些 API 的形狀,可以對著抄。
