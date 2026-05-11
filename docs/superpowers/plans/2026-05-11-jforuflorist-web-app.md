# jforuflorist Web App Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a polished single-page catalog and WhatsApp ordering app for jforuflorist flower studio - Penang Florist.

**Architecture:** Use a static frontend with `index.html`, CSS, and small ES modules. Keep product data, translations, filtering, validation, and WhatsApp message generation separate so the UI stays easy to edit and test.

**Tech Stack:** HTML, CSS, vanilla JavaScript ES modules, Node.js built-in test runner.

---

## File Structure

- Create: `index.html` - app shell and semantic section anchors.
- Create: `src/styles.css` - responsive Sweet Gifting Mood visual system and component styling.
- Create: `src/data.js` - products, FAQ content, order notices, delivery notes, payment sample content, and UI translations.
- Create: `src/messages.js` - pure functions for filtering products, validating form data, building WhatsApp messages, and creating WhatsApp URLs.
- Create: `src/app.js` - UI state, rendering, event handling, language toggle, filters, product detail panel, form binding.
- Create: `tests/messages.test.js` - tests for filtering, validation, WhatsApp message content, and URL encoding.
- Create: `tools/static-server.mjs` - dependency-free local preview server.
- Modify: `.gitignore` - already includes generated and local folders.

## Task 1: Static App Shell

**Files:**
- Create: `index.html`
- Create: `src/styles.css`
- Create: `tools/static-server.mjs`

- [ ] **Step 1: Create the HTML shell**

Create `index.html` with this structure:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta
      name="description"
      content="jforuflorist flower studio - Penang Florist. Bouquets, flower boxes, flower baskets, and WhatsApp ordering."
    />
    <title>jforuflorist flower studio | Penang Florist</title>
    <link rel="stylesheet" href="./src/styles.css" />
  </head>
  <body>
    <header class="site-header" data-js="header"></header>
    <main>
      <section id="home" class="hero" data-js="hero"></section>
      <section id="menu" class="menu-section" data-js="menu"></section>
      <section id="order-info" class="info-section" data-js="order-info"></section>
      <section id="faq" class="faq-section" data-js="faq"></section>
    </main>
    <div class="product-panel-shell" data-js="product-panel" aria-live="polite"></div>
    <script type="module" src="./src/app.js"></script>
  </body>
</html>
```

- [ ] **Step 2: Add the visual foundation**

Create `src/styles.css` with the design tokens and base layout:

```css
:root {
  --bg: #fff9f5;
  --surface: #ffffff;
  --surface-warm: #fff1eb;
  --ink: #312522;
  --muted: #74645f;
  --line: #ead9d1;
  --accent: #d66f78;
  --accent-dark: #9f4650;
  --green: #6f8b72;
  --gold: #c79a4b;
  --shadow: 0 18px 50px rgba(91, 55, 47, 0.14);
  --radius: 8px;
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}

* {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  margin: 0;
  background: var(--bg);
  color: var(--ink);
}

button,
input,
select,
textarea {
  font: inherit;
}

button {
  cursor: pointer;
}

.site-header {
  position: sticky;
  top: 0;
  z-index: 20;
  background: rgba(255, 249, 245, 0.92);
  border-bottom: 1px solid var(--line);
  backdrop-filter: blur(16px);
}

.header-inner,
.section-inner {
  width: min(1120px, calc(100% - 32px));
  margin: 0 auto;
}

.hero,
.menu-section,
.info-section,
.faq-section {
  padding: 72px 0;
}

.button {
  border: 0;
  border-radius: var(--radius);
  padding: 12px 16px;
  background: var(--accent);
  color: #fff;
  font-weight: 700;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.button.secondary {
  background: #fff;
  color: var(--accent-dark);
  border: 1px solid var(--line);
}

.chip {
  border: 1px solid var(--line);
  background: #fff;
  color: var(--muted);
  border-radius: 999px;
  padding: 9px 13px;
}

.chip.is-active {
  background: var(--ink);
  color: #fff;
  border-color: var(--ink);
}

@media (max-width: 720px) {
  .hero,
  .menu-section,
  .info-section,
  .faq-section {
    padding: 48px 0;
  }
}
```

- [ ] **Step 3: Commit the app shell**

Create `tools/static-server.mjs` so previewing the app does not depend on downloaded packages:

```js
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";

const root = process.cwd();
const port = Number(process.env.PORT ?? 4173);
const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
};

const server = createServer(async (request, response) => {
  const url = new URL(request.url ?? "/", `http://${request.headers.host}`);
  const pathname = url.pathname === "/" ? "/index.html" : url.pathname;
  const filePath = normalize(join(root, pathname));

  if (!filePath.startsWith(root)) {
    response.writeHead(403);
    response.end("Forbidden");
    return;
  }

  try {
    const body = await readFile(filePath);
    response.writeHead(200, { "Content-Type": types[extname(filePath)] ?? "application/octet-stream" });
    response.end(body);
  } catch {
    response.writeHead(404);
    response.end("Not found");
  }
});

server.listen(port, "127.0.0.1", () => {
  console.log(`Preview: http://127.0.0.1:${port}`);
});
```

- [ ] **Step 4: Commit the app shell**

Run:

```powershell
git add index.html src/styles.css tools/static-server.mjs
git commit -m "feat: add static app shell"
```

Expected: commit succeeds with `index.html`, `src/styles.css`, and `tools/static-server.mjs`.

## Task 2: Data And Pure Ordering Utilities

**Files:**
- Create: `src/data.js`
- Create: `src/messages.js`
- Create: `tests/messages.test.js`

- [ ] **Step 1: Write failing tests for filters, validation, and WhatsApp generation**

Create `tests/messages.test.js`:

```js
import test from "node:test";
import assert from "node:assert/strict";
import {
  buildWhatsAppMessage,
  buildWhatsAppUrl,
  filterProducts,
  validateOrder,
} from "../src/messages.js";

const products = [
  { id: "a", category: "bouquets", occasions: ["birthday"], name: "A" },
  { id: "b", category: "boxes", occasions: ["graduation"], name: "B" },
];

const order = {
  buyerName: "Mei",
  buyerPhone: "0123456789",
  serviceType: "Delivery",
  quantity: "2",
  date: "2026-06-01",
  eventTime: "2:00 PM",
  size: "Medium",
  recipientName: "Ling",
  recipientPhone: "0198887777",
  deliveryAddress: "George Town, Penang",
  cardMessage: "Happy birthday",
  specialRequest: "Pastel pink please",
};

test("filterProducts filters by category and occasion", () => {
  assert.deepEqual(filterProducts(products, "bouquets", "birthday").map((p) => p.id), ["a"]);
  assert.deepEqual(filterProducts(products, "all", "graduation").map((p) => p.id), ["b"]);
});

test("validateOrder reports missing required fields", () => {
  const result = validateOrder({ ...order, buyerName: "", date: "" });
  assert.equal(result.valid, false);
  assert.deepEqual(result.missing, ["buyerName", "date"]);
});

test("buildWhatsAppMessage includes selected product and order details", () => {
  const message = buildWhatsAppMessage({ name: "Sweet Peony Bouquet", categoryLabel: "Bouquet" }, order);
  assert.match(message, /Sweet Peony Bouquet/);
  assert.match(message, /Quantity: 2/);
  assert.match(message, /Delivery Address: George Town, Penang/);
  assert.match(message, /Please confirm availability and final total/);
});

test("buildWhatsAppUrl encodes message for wa.me", () => {
  const url = buildWhatsAppUrl("60123456789", "Hello flower studio");
  assert.equal(url, "https://wa.me/60123456789?text=Hello%20flower%20studio");
});
```

- [ ] **Step 2: Run tests and verify failure**

Run:

```powershell
node --test tests/messages.test.js
```

Expected: FAIL because `src/messages.js` does not exist.

- [ ] **Step 3: Add product and translation data**

Create `src/data.js`:

```js
export const WHATSAPP_NUMBER = "60123456789";

export const categories = [
  { id: "all", labelKey: "all" },
  { id: "bouquets", labelKey: "bouquets" },
  { id: "boxes", labelKey: "flowerBoxes" },
  { id: "baskets", labelKey: "flowerBaskets" },
];

export const occasions = [
  { id: "all", labelKey: "allOccasions" },
  { id: "birthday", labelKey: "birthday" },
  { id: "graduation", labelKey: "graduation" },
  { id: "anniversary", labelKey: "anniversary" },
  { id: "grand-opening", labelKey: "grandOpening" },
  { id: "condolence", labelKey: "condolence" },
];

export const products = [
  {
    id: "sweet-peony",
    category: "bouquets",
    categoryLabel: "Bouquet",
    occasions: ["birthday", "anniversary"],
    name: { en: "Sweet Peony Bouquet", zh: "甜美牡丹花束" },
    description: {
      en: "A warm pastel bouquet for birthdays, romance, and gentle surprises.",
      zh: "柔和暖色花束，适合生日、浪漫纪念和惊喜送礼。",
    },
    priceLabel: "From RM 168",
    sizes: ["Petite", "Medium", "Grand"],
    imageTone: "peony",
    floristNote: {
      en: "Seasonal blooms may be adjusted while keeping the same sweet mood.",
      zh: "花材会依季节调整，但会保留同样甜美的感觉。",
    },
  },
  {
    id: "sunny-grad",
    category: "bouquets",
    categoryLabel: "Bouquet",
    occasions: ["graduation"],
    name: { en: "Sunny Graduation Bouquet", zh: "阳光毕业花束" },
    description: {
      en: "Bright, cheerful blooms arranged for graduation moments.",
      zh: "明亮开朗的毕业花束，适合拍照与祝福。",
    },
    priceLabel: "From RM 138",
    sizes: ["Standard", "Premium"],
    imageTone: "sunny",
    floristNote: {
      en: "Ribbon and wrap colors can be matched to the graduation theme.",
      zh: "丝带与包装色可依毕业主题搭配。",
    },
  },
  {
    id: "blush-box",
    category: "boxes",
    categoryLabel: "Flower Box",
    occasions: ["birthday", "anniversary"],
    name: { en: "Blush Gift Flower Box", zh: "粉色礼盒花" },
    description: {
      en: "Compact, elegant, and easy to display as a thoughtful gift.",
      zh: "精致好摆放的花礼盒，适合贴心送礼。",
    },
    priceLabel: "From RM 188",
    sizes: ["Classic", "Luxe"],
    imageTone: "box",
    floristNote: {
      en: "Best for office delivery, surprises, and table display.",
      zh: "适合办公室配送、惊喜送礼和桌面摆设。",
    },
  },
  {
    id: "opening-basket",
    category: "baskets",
    categoryLabel: "Flower Basket",
    occasions: ["grand-opening"],
    name: { en: "Warm Wishes Opening Basket", zh: "开张祝福花篮" },
    description: {
      en: "A warm basket arrangement for shop openings and business greetings.",
      zh: "温暖大方的开张花篮，适合商务祝贺。",
    },
    priceLabel: "From RM 268",
    sizes: ["Standard", "Grande"],
    imageTone: "basket",
    floristNote: {
      en: "Message stand card can be arranged after WhatsApp confirmation.",
      zh: "贺词牌可在 WhatsApp 确认后安排。",
    },
  },
  {
    id: "quiet-comfort",
    category: "baskets",
    categoryLabel: "Flower Basket",
    occasions: ["condolence"],
    name: { en: "Quiet Comfort Basket", zh: "静心慰问花篮" },
    description: {
      en: "A respectful white and green arrangement for condolences.",
      zh: "白绿配色慰问花篮，表达安静与尊重。",
    },
    priceLabel: "From RM 238",
    sizes: ["Standard", "Grande"],
    imageTone: "comfort",
    floristNote: {
      en: "Tone will be kept gentle and respectful.",
      zh: "整体色调会保持温和与庄重。",
    },
  },
];

export const translations = {
  en: {
    all: "All",
    allOccasions: "All occasions",
    bouquets: "Bouquets",
    flowerBoxes: "Flower Boxes",
    flowerBaskets: "Flower Baskets",
    birthday: "Birthday",
    graduation: "Graduation",
    anniversary: "Anniversary",
    grandOpening: "Grand Opening",
    condolence: "Condolence",
  },
  zh: {
    all: "全部",
    allOccasions: "全部场合",
    bouquets: "花束",
    flowerBoxes: "花盒",
    flowerBaskets: "花篮",
    birthday: "生日",
    graduation: "毕业",
    anniversary: "纪念日",
    grandOpening: "开张",
    condolence: "慰问",
  },
};

export const faq = [
  {
    q: { en: "How early should I place my order?", zh: "我需要提前多久下单？" },
    a: {
      en: "Please order at least 1-2 days earlier. Same-day orders depend on flower availability.",
      zh: "建议提前 1-2 天下单。当日订单需视花材库存而定。",
    },
  },
  {
    q: { en: "What is your flower replacement policy?", zh: "花材替换政策是什么？" },
    a: {
      en: "If certain flowers are unavailable, we will replace them with suitable blooms in a similar style and value.",
      zh: "若指定花材缺货，我们会以相近风格与价值的花材替换。",
    },
  },
  {
    q: { en: "Do you deliver to outstation areas?", zh: "可以送外州吗？" },
    a: {
      en: "Outstation delivery requires manual confirmation through WhatsApp before payment.",
      zh: "外州配送需先通过 WhatsApp 人工确认后才付款。",
    },
  },
  {
    q: { en: "Can the bouquet be left in the car?", zh: "花束可以放在车里吗？" },
    a: {
      en: "Flowers should not be left in a hot car because heat can damage fresh blooms quickly.",
      zh: "不建议把鲜花放在热车内，高温会很快影响花况。",
    },
  },
];
```

- [ ] **Step 4: Add pure utility implementation**

Create `src/messages.js`:

```js
const requiredFields = [
  "buyerName",
  "buyerPhone",
  "serviceType",
  "quantity",
  "date",
  "eventTime",
  "size",
  "recipientName",
  "recipientPhone",
  "deliveryAddress",
];

export function filterProducts(products, category, occasion) {
  return products.filter((product) => {
    const categoryMatches = category === "all" || product.category === category;
    const occasionMatches = occasion === "all" || product.occasions.includes(occasion);
    return categoryMatches && occasionMatches;
  });
}

export function validateOrder(order) {
  const missing = requiredFields.filter((field) => !String(order[field] ?? "").trim());
  return { valid: missing.length === 0, missing };
}

export function buildWhatsAppMessage(product, order) {
  const specialRequest = String(order.specialRequest ?? "").trim() || "None";
  const cardMessage = String(order.cardMessage ?? "").trim() || "None";

  return [
    "Hi jforuflorist flower studio, I would like to place an order.",
    "",
    "Order Details",
    `Product: ${product.name}`,
    `Category: ${product.categoryLabel}`,
    `Size: ${order.size}`,
    `Quantity: ${order.quantity}`,
    `Service: ${order.serviceType}`,
    `Pickup/Delivery Date: ${order.date}`,
    `Event Time: ${order.eventTime}`,
    "",
    "Buyer Details",
    `Name: ${order.buyerName}`,
    `Phone: ${order.buyerPhone}`,
    "",
    "Recipient / Delivery Details",
    `Recipient Name: ${order.recipientName}`,
    `Recipient Phone: ${order.recipientPhone}`,
    `Delivery Address: ${order.deliveryAddress}`,
    "",
    "Card Message",
    cardMessage,
    "",
    "Special Request",
    specialRequest,
    "",
    "Payment Details",
    "I have reviewed the payment details and order notice. Please confirm availability and final total. Thank you.",
  ].join("\n");
}

export function buildWhatsAppUrl(phoneNumber, message) {
  const cleanNumber = String(phoneNumber).replace(/[^\d]/g, "");
  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
}
```

- [ ] **Step 5: Run tests and verify pass**

Run:

```powershell
node --test tests/messages.test.js
```

Expected: PASS with 4 passing tests.

- [ ] **Step 6: Commit data and utilities**

Run:

```powershell
git add src/data.js src/messages.js tests/messages.test.js
git commit -m "feat: add florist data and whatsapp utilities"
```

Expected: commit succeeds.

## Task 3: Render Header, Hero, Menu, FAQ, And Order Info

**Files:**
- Create: `src/app.js`
- Modify: `src/styles.css`

- [ ] **Step 1: Implement initial rendering**

Create `src/app.js`:

```js
import { categories, faq, occasions, products, translations, WHATSAPP_NUMBER } from "./data.js";
import { filterProducts } from "./messages.js";

const state = {
  language: "en",
  category: "all",
  occasion: "all",
  selectedProductId: products[0].id,
};

const $ = (selector) => document.querySelector(selector);
const text = (value) => (typeof value === "string" ? value : value[state.language]);
const t = (key) => translations[state.language][key] ?? key;

function renderHeader() {
  $("[data-js='header']").innerHTML = `
    <div class="header-inner nav-layout">
      <a class="brand" href="#home">
        <span class="brand-mark">j</span>
        <span>
          <strong>jforuflorist flower studio</strong>
          <small>Penang Florist</small>
        </span>
      </a>
      <nav class="nav-links" aria-label="Primary navigation">
        <a href="#home">Home</a>
        <a href="#menu">Menu</a>
        <a href="#order-info">Order Info</a>
        <a href="#faq">FAQ</a>
      </nav>
      <div class="nav-actions">
        <button class="chip" data-action="language">${state.language === "en" ? "中文" : "EN"}</button>
        <a class="button" href="https://wa.me/${WHATSAPP_NUMBER}" target="_blank" rel="noreferrer">WhatsApp</a>
      </div>
    </div>
  `;
}

function renderHero() {
  $("[data-js='hero']").innerHTML = `
    <div class="section-inner hero-grid">
      <div class="hero-copy">
        <p class="eyebrow">Penang Florist</p>
        <h1>${state.language === "en" ? "jforuflorist flower studio" : "jforuflorist 花艺工作室"}</h1>
        <p class="hero-text">
          ${
            state.language === "en"
              ? "Sweet gifting flowers for birthdays, graduations, anniversaries, openings, and quiet comfort moments."
              : "为生日、毕业、纪念日、开张与慰问时刻准备的温暖花礼。"
          }
        </p>
        <div class="hero-actions">
          <a class="button" href="#menu">${state.language === "en" ? "Browse menu" : "浏览花礼"}</a>
          <a class="button secondary" href="https://wa.me/${WHATSAPP_NUMBER}" target="_blank" rel="noreferrer">WhatsApp</a>
        </div>
      </div>
      <div class="hero-visual" aria-label="Soft gifting floral arrangement preview">
        <div class="flower-shape shape-one"></div>
        <div class="flower-shape shape-two"></div>
        <div class="flower-shape shape-three"></div>
        <p>Sweet Gifting Mood</p>
      </div>
    </div>
  `;
}

function renderFilters(items, active, type) {
  return items
    .map((item) => `
      <button class="chip ${active === item.id ? "is-active" : ""}" data-filter-type="${type}" data-filter-value="${item.id}">
        ${t(item.labelKey)}
      </button>
    `)
    .join("");
}

function renderMenu() {
  const visibleProducts = filterProducts(products, state.category, state.occasion);
  $("[data-js='menu']").innerHTML = `
    <div class="section-inner">
      <div class="section-heading">
        <p class="eyebrow">${state.language === "en" ? "Menu" : "花礼菜单"}</p>
        <h2>${state.language === "en" ? "Choose your floral gift" : "选择你的花礼"}</h2>
      </div>
      <div class="filter-group">${renderFilters(categories, state.category, "category")}</div>
      <div class="filter-group">${renderFilters(occasions, state.occasion, "occasion")}</div>
      <div class="product-grid">
        ${visibleProducts.map(renderProductCard).join("")}
      </div>
    </div>
  `;
}

function renderProductCard(product) {
  return `
    <article class="product-card">
      <div class="product-image product-image-${product.imageTone}"></div>
      <div class="product-body">
        <p class="product-meta">${product.categoryLabel}</p>
        <h3>${text(product.name)}</h3>
        <p>${text(product.description)}</p>
        <div class="product-footer">
          <strong>${product.priceLabel}</strong>
          <button class="button secondary" data-action="select-product" data-product-id="${product.id}">
            ${state.language === "en" ? "Order" : "下单"}
          </button>
        </div>
      </div>
    </article>
  `;
}

function renderOrderInfo() {
  $("[data-js='order-info']").innerHTML = `
    <div class="section-inner info-grid">
      <section>
        <p class="eyebrow">${state.language === "en" ? "Order Notice" : "下单须知"}</p>
        <h2>${state.language === "en" ? "Please confirm before payment" : "付款前请先确认"}</h2>
        <ul>
          <li>${state.language === "en" ? "Same-day orders depend on flower availability." : "当日订单需视花材库存而定。"}</li>
          <li>${state.language === "en" ? "Flower colors and varieties may be adjusted based on daily stock." : "花色与花材会依每日库存调整。"}</li>
          <li>${state.language === "en" ? "Payment is recommended after WhatsApp confirmation." : "建议 WhatsApp 确认后才付款。"}</li>
        </ul>
      </section>
      <section>
        <p class="eyebrow">${state.language === "en" ? "Payment Details" : "付款资料"}</p>
        <h2>${state.language === "en" ? "Temporary sample details" : "暂用示例资料"}</h2>
        <p>Bank Transfer: jforuflorist flower studio</p>
        <p>DuitNow / QR: Available after confirmation</p>
        <p>Touch 'n Go: Available after confirmation</p>
      </section>
    </div>
  `;
}

function renderFaq() {
  $("[data-js='faq']").innerHTML = `
    <div class="section-inner">
      <div class="section-heading">
        <p class="eyebrow">FAQ</p>
        <h2>${state.language === "en" ? "Common Questions" : "常见问题"}</h2>
      </div>
      <div class="faq-list">
        ${faq.map((item) => `
          <details class="faq-item">
            <summary>${text(item.q)}</summary>
            <p>${text(item.a)}</p>
          </details>
        `).join("")}
      </div>
    </div>
  `;
}

function render() {
  renderHeader();
  renderHero();
  renderMenu();
  renderOrderInfo();
  renderFaq();
}

document.addEventListener("click", (event) => {
  const filterButton = event.target.closest("[data-filter-type]");
  if (filterButton) {
    state[filterButton.dataset.filterType] = filterButton.dataset.filterValue;
    renderMenu();
    return;
  }

  if (event.target.closest("[data-action='language']")) {
    state.language = state.language === "en" ? "zh" : "en";
    render();
  }
});

render();
```

- [ ] **Step 2: Add section and card CSS**

Append to `src/styles.css`:

```css
.nav-layout,
.nav-links,
.nav-actions,
.hero-actions,
.filter-group,
.product-footer {
  display: flex;
  align-items: center;
  gap: 12px;
}

.nav-layout {
  min-height: 74px;
  justify-content: space-between;
}

.brand {
  color: var(--ink);
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 10px;
}

.brand-mark {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: var(--accent);
  color: #fff;
  display: grid;
  place-items: center;
  font-family: Georgia, serif;
  font-size: 26px;
}

.brand small,
.eyebrow,
.product-meta {
  color: var(--muted);
  display: block;
}

.nav-links a {
  color: var(--muted);
  text-decoration: none;
  font-weight: 650;
}

.hero-grid,
.info-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(320px, 0.8fr);
  gap: 40px;
  align-items: center;
}

.hero h1,
.section-heading h2,
.info-grid h2 {
  margin: 0;
  font-family: Georgia, "Times New Roman", serif;
  letter-spacing: 0;
}

.hero h1 {
  font-size: clamp(48px, 8vw, 92px);
  line-height: 0.95;
}

.hero-text {
  color: var(--muted);
  font-size: 18px;
  line-height: 1.7;
  max-width: 560px;
}

.hero-visual {
  min-height: 460px;
  border-radius: var(--radius);
  background: linear-gradient(135deg, #fff7f1 0%, #f8cfd2 45%, #f3e6b5 100%);
  box-shadow: var(--shadow);
  position: relative;
  overflow: hidden;
  display: grid;
  place-items: end center;
  padding: 32px;
  color: var(--accent-dark);
  font-family: Georgia, serif;
  font-size: 28px;
}

.flower-shape {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.62);
}

.shape-one { width: 190px; height: 190px; top: 42px; left: 50px; }
.shape-two { width: 230px; height: 230px; top: 150px; right: 42px; }
.shape-three { width: 140px; height: 140px; bottom: 92px; left: 90px; }

.section-heading {
  margin-bottom: 24px;
}

.filter-group {
  flex-wrap: wrap;
  margin-bottom: 14px;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px;
  margin-top: 26px;
}

.product-card,
.faq-item,
.info-grid section {
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: var(--radius);
  box-shadow: 0 10px 28px rgba(91, 55, 47, 0.08);
}

.product-image {
  min-height: 220px;
  border-radius: var(--radius) var(--radius) 0 0;
}

.product-image-peony { background: linear-gradient(135deg, #fde2e8, #fff3d5); }
.product-image-sunny { background: linear-gradient(135deg, #ffe7a8, #ffd1d7); }
.product-image-box { background: linear-gradient(135deg, #f6d3d8, #fdf7f0); }
.product-image-basket { background: linear-gradient(135deg, #e7d1a4, #f7d4cc); }
.product-image-comfort { background: linear-gradient(135deg, #f7f7f0, #d9e6d4); }

.product-body,
.info-grid section,
.faq-item {
  padding: 20px;
}

.product-body h3 {
  margin: 4px 0 8px;
}

.product-body p {
  color: var(--muted);
  line-height: 1.6;
}

.product-footer {
  justify-content: space-between;
  margin-top: 18px;
}

.faq-list {
  display: grid;
  gap: 12px;
}

.faq-item summary {
  font-weight: 750;
  cursor: pointer;
}

.faq-item p,
.info-grid li,
.info-grid p {
  color: var(--muted);
  line-height: 1.7;
}

@media (max-width: 900px) {
  .nav-links {
    display: none;
  }

  .hero-grid,
  .info-grid,
  .product-grid {
    grid-template-columns: 1fr;
  }
}
```

- [ ] **Step 3: Manually preview**

Run a static server:

```powershell
node tools/static-server.mjs
```

Expected: `Preview: http://127.0.0.1:4173` prints. Open it and verify header, hero, filters, products, order info, and FAQ render.

- [ ] **Step 4: Commit rendered sections**

Run:

```powershell
git add src/app.js src/styles.css
git commit -m "feat: render florist storefront sections"
```

Expected: commit succeeds.

## Task 4: Product Detail Panel, Order Form, Validation, And WhatsApp

**Files:**
- Modify: `src/app.js`
- Modify: `src/styles.css`
- Modify: `tests/messages.test.js`

- [ ] **Step 1: Add a test for optional form values**

Append to `tests/messages.test.js`:

```js
test("buildWhatsAppMessage prints None for empty optional text", () => {
  const message = buildWhatsAppMessage(
    { name: "Blush Gift Flower Box", categoryLabel: "Flower Box" },
    { ...order, cardMessage: "", specialRequest: "" }
  );
  assert.match(message, /Card Message\nNone/);
  assert.match(message, /Special Request\nNone/);
});
```

- [ ] **Step 2: Run tests and verify pass**

Run:

```powershell
node --test tests/messages.test.js
```

Expected: PASS with 5 passing tests.

- [ ] **Step 3: Add panel state and form state**

Modify the top of `src/app.js` so `state` includes `selectedProductId`, `panelOpen`, and `order`:

```js
const state = {
  language: "en",
  category: "all",
  occasion: "all",
  selectedProductId: products[0].id,
  panelOpen: false,
  order: {
    buyerName: "",
    buyerPhone: "",
    serviceType: "Delivery",
    quantity: "1",
    date: "",
    eventTime: "",
    size: products[0].sizes[0],
    recipientName: "",
    recipientPhone: "",
    deliveryAddress: "",
    cardMessage: "",
    specialRequest: "",
  },
  missingFields: [],
};
```

Update the import from `src/messages.js`:

```js
import { buildWhatsAppMessage, buildWhatsAppUrl, filterProducts, validateOrder } from "./messages.js";
```

- [ ] **Step 4: Add product panel rendering**

Add these functions to `src/app.js` before `render()`:

```js
function selectedProduct() {
  return products.find((product) => product.id === state.selectedProductId) ?? products[0];
}

function productNameForMessage(product) {
  return typeof product.name === "string" ? product.name : product.name[state.language];
}

function renderField(name, label, type = "text") {
  const isMissing = state.missingFields.includes(name);
  return `
    <label class="field ${isMissing ? "has-error" : ""}">
      <span>${label}</span>
      <input type="${type}" name="${name}" value="${state.order[name] ?? ""}" />
      ${isMissing ? `<small>Required</small>` : ""}
    </label>
  `;
}

function renderProductPanel() {
  const product = selectedProduct();
  const panel = $("[data-js='product-panel']");

  if (!state.panelOpen) {
    panel.innerHTML = "";
    return;
  }

  panel.innerHTML = `
    <aside class="product-panel" aria-label="Product order panel">
      <div class="panel-header">
        <div>
          <p class="eyebrow">${product.categoryLabel}</p>
          <h2>${text(product.name)}</h2>
        </div>
        <button class="chip" data-action="close-panel">Close</button>
      </div>
      <div class="panel-grid">
        <div>
          <div class="product-image product-image-${product.imageTone} panel-image"></div>
          <p class="panel-note">${text(product.floristNote)}</p>
          <strong>${product.priceLabel}</strong>
        </div>
        <form class="order-form" data-js="order-form">
          <label class="field">
            <span>Size</span>
            <select name="size">
              ${product.sizes.map((size) => `<option ${state.order.size === size ? "selected" : ""}>${size}</option>`).join("")}
            </select>
          </label>
          ${renderField("buyerName", "Buyer name")}
          ${renderField("buyerPhone", "Buyer phone", "tel")}
          <label class="field">
            <span>Service</span>
            <select name="serviceType">
              <option ${state.order.serviceType === "Delivery" ? "selected" : ""}>Delivery</option>
              <option ${state.order.serviceType === "Pickup" ? "selected" : ""}>Pickup</option>
            </select>
          </label>
          ${renderField("quantity", "Quantity", "number")}
          ${renderField("date", "Pickup / delivery date", "date")}
          ${renderField("eventTime", "Event time")}
          ${renderField("recipientName", "Recipient name")}
          ${renderField("recipientPhone", "Recipient phone", "tel")}
          <label class="field ${state.missingFields.includes("deliveryAddress") ? "has-error" : ""}">
            <span>Delivery address</span>
            <textarea name="deliveryAddress">${state.order.deliveryAddress}</textarea>
            ${state.missingFields.includes("deliveryAddress") ? `<small>Required</small>` : ""}
          </label>
          <label class="field">
            <span>Card message</span>
            <textarea name="cardMessage">${state.order.cardMessage}</textarea>
          </label>
          <label class="field">
            <span>Optional special request</span>
            <textarea name="specialRequest">${state.order.specialRequest}</textarea>
          </label>
          <div class="panel-actions">
            <button class="button" type="button" data-action="whatsapp-order">Order via WhatsApp</button>
          </div>
        </form>
      </div>
    </aside>
  `;
}
```

- [ ] **Step 5: Wire panel events**

Modify the click handler in `src/app.js` to handle product selection, close, and WhatsApp order:

```js
document.addEventListener("click", (event) => {
  const filterButton = event.target.closest("[data-filter-type]");
  if (filterButton) {
    state[filterButton.dataset.filterType] = filterButton.dataset.filterValue;
    renderMenu();
    return;
  }

  const productButton = event.target.closest("[data-action='select-product']");
  if (productButton) {
    const product = products.find((item) => item.id === productButton.dataset.productId);
    state.selectedProductId = product.id;
    state.order.size = product.sizes[0];
    state.panelOpen = true;
    state.missingFields = [];
    renderProductPanel();
    return;
  }

  if (event.target.closest("[data-action='close-panel']")) {
    state.panelOpen = false;
    renderProductPanel();
    return;
  }

  if (event.target.closest("[data-action='whatsapp-order']")) {
    const result = validateOrder(state.order);
    state.missingFields = result.missing;
    if (!result.valid) {
      renderProductPanel();
      return;
    }
    const product = selectedProduct();
    const message = buildWhatsAppMessage(
      { name: productNameForMessage(product), categoryLabel: product.categoryLabel },
      state.order
    );
    window.open(buildWhatsAppUrl(WHATSAPP_NUMBER, message), "_blank", "noopener,noreferrer");
    return;
  }

  if (event.target.closest("[data-action='language']")) {
    state.language = state.language === "en" ? "zh" : "en";
    render();
  }
});

document.addEventListener("input", (event) => {
  const field = event.target.closest("[name]");
  if (!field || !field.closest("[data-js='order-form']")) return;
  state.order[field.name] = field.value;
});

document.addEventListener("change", (event) => {
  const field = event.target.closest("[name]");
  if (!field || !field.closest("[data-js='order-form']")) return;
  state.order[field.name] = field.value;
});
```

Modify `render()` to include the panel:

```js
function render() {
  renderHeader();
  renderHero();
  renderMenu();
  renderOrderInfo();
  renderFaq();
  renderProductPanel();
}
```

- [ ] **Step 6: Add panel CSS**

Append to `src/styles.css`:

```css
.product-panel-shell:not(:empty) {
  position: fixed;
  inset: 0;
  z-index: 40;
  background: rgba(49, 37, 34, 0.36);
  display: grid;
  place-items: center;
  padding: 20px;
}

.product-panel {
  width: min(1040px, 100%);
  max-height: min(860px, calc(100vh - 40px));
  overflow: auto;
  background: var(--surface);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  padding: 24px;
}

.panel-header,
.panel-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
}

.panel-grid {
  display: grid;
  grid-template-columns: minmax(260px, 0.8fr) minmax(0, 1.2fr);
  gap: 24px;
}

.panel-image {
  border-radius: var(--radius);
  min-height: 320px;
}

.panel-note {
  color: var(--muted);
  line-height: 1.7;
}

.order-form {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}

.field {
  display: grid;
  gap: 7px;
  color: var(--muted);
  font-weight: 650;
}

.field input,
.field select,
.field textarea {
  width: 100%;
  border: 1px solid var(--line);
  border-radius: var(--radius);
  padding: 11px 12px;
  color: var(--ink);
  background: #fff;
}

.field textarea {
  min-height: 86px;
  resize: vertical;
}

.field:has(textarea),
.panel-actions {
  grid-column: 1 / -1;
}

.field.has-error input,
.field.has-error textarea,
.field.has-error select {
  border-color: var(--accent-dark);
}

.field small {
  color: var(--accent-dark);
}

@media (max-width: 760px) {
  .panel-grid,
  .order-form {
    grid-template-columns: 1fr;
  }
}
```

- [ ] **Step 7: Run tests and manually verify form**

Run:

```powershell
node --test tests/messages.test.js
node tools/static-server.mjs
```

Expected: tests pass. In the browser, selecting a product opens the panel, missing required fields are marked, filling the form opens a WhatsApp URL.

- [ ] **Step 8: Commit order panel**

Run:

```powershell
git add src/app.js src/styles.css tests/messages.test.js
git commit -m "feat: add product order panel"
```

Expected: commit succeeds.

## Task 5: Bilingual Polish, Responsiveness, And Final Verification

**Files:**
- Modify: `src/app.js`
- Modify: `src/styles.css`
- Modify: `docs/superpowers/specs/2026-05-11-jforuflorist-design.md` only if implementation intentionally changes the approved design.

- [ ] **Step 1: Replace remaining buyer-facing static English labels in the panel**

In `src/app.js`, add a `ui` object after `t`:

```js
const ui = {
  en: {
    close: "Close",
    size: "Size",
    buyerName: "Buyer name",
    buyerPhone: "Buyer phone",
    service: "Service",
    delivery: "Delivery",
    pickup: "Pickup",
    quantity: "Quantity",
    date: "Pickup / delivery date",
    eventTime: "Event time",
    recipientName: "Recipient name",
    recipientPhone: "Recipient phone",
    deliveryAddress: "Delivery address",
    cardMessage: "Card message",
    specialRequest: "Optional special request",
    required: "Required",
    orderViaWhatsapp: "Order via WhatsApp",
  },
  zh: {
    close: "关闭",
    size: "尺寸",
    buyerName: "订购人姓名",
    buyerPhone: "订购人电话",
    service: "服务方式",
    delivery: "配送",
    pickup: "自取",
    quantity: "数量",
    date: "自取 / 配送日期",
    eventTime: "使用时间",
    recipientName: "收件人姓名",
    recipientPhone: "收件人电话",
    deliveryAddress: "配送地址",
    cardMessage: "卡片留言",
    specialRequest: "特别要求（可选）",
    required: "必填",
    orderViaWhatsapp: "通过 WhatsApp 下单",
  },
};

const u = (key) => ui[state.language][key] ?? key;
```

Update `renderProductPanel()` labels to use `u("...")`. Keep the generated WhatsApp message in English because the florist-facing operational message should stay consistent.

- [ ] **Step 2: Verify no hard-to-read mobile layouts**

Run:

```powershell
node tools/static-server.mjs
```

Expected browser checks:

- At desktop width, hero and product grid have balanced spacing.
- At mobile width, navigation does not overlap, product grid becomes one column, and panel fields stack.
- Buttons do not have clipped text.
- Payment and FAQ sections remain readable.

- [ ] **Step 3: Run automated tests**

Run:

```powershell
node --test tests/messages.test.js
```

Expected: PASS with all tests passing.

- [ ] **Step 4: Final status check**

Run:

```powershell
git status --short
```

Expected: only intentional modified files appear before the final commit.

- [ ] **Step 5: Commit polish**

Run:

```powershell
git add src/app.js src/styles.css docs/superpowers/specs/2026-05-11-jforuflorist-design.md
git commit -m "feat: polish bilingual florist experience"
```

Expected: commit succeeds, or Git reports there is nothing to commit if Task 5 made no file changes.

## Self-Review Notes

- Spec coverage: tasks cover the single-page storefront, Sweet Gifting Mood styling, menu categories, occasion filters, product detail/order form, WhatsApp message generation, FAQ, order notice, payment details, bilingual toggle, and frontend-only scope.
- Validation coverage: `tests/messages.test.js` covers filtering, required fields, optional text defaults, message content, and WhatsApp URL encoding.
- Known final content inputs remain outside implementation scope: real WhatsApp number, real payment details, and real product photos/prices can replace sample data in `src/data.js`.
