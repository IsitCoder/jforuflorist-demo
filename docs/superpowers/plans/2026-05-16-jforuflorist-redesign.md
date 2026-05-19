# jforuflorist Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the jforuflorist single-page demo with uploaded flower photos, stronger boutique styling, About/Contact details, an Instagram-style gallery, FAQ-based ordering guidance, and an order review step before WhatsApp.

**Architecture:** Keep the existing frontend-only vanilla JavaScript app. Store shop/product/gallery content in `src/data.js`, keep message and review formatting pure in `src/messages.js`, render page sections in `src/app.js`, and keep GitHub Pages-compatible static assets under `assets/flowers/`.

**Tech Stack:** Static HTML, CSS, vanilla ES modules, Node built-in test runner, GitHub Pages.

---

Repository root: `C:\Users\60135\Documents\Codex\2026-05-11\superpowers-plugin-superpowers-openai-curated-i`

## File Structure

- Create: `assets/flowers/`
  - Stable copied image assets from `C:\Users\60135\Pictures\Flower`.
- Modify: `index.html`
  - Replace the old standalone `order-info` section with `about`, `gallery`, and `faq`.
- Modify: `src/data.js`
  - Update WhatsApp number, contact details, product image paths, gallery image data, FAQ/order-help content, and translations.
- Modify: `src/messages.js`
  - Keep validation and WhatsApp URL generation, add a pure order review summary helper.
- Modify: `src/app.js`
  - Render redesigned header, hero, menu, About, gallery, FAQ/order-help, and review-first product panel.
- Modify: `src/styles.css`
  - Rework visual design, product cards, modal panel, gallery, About/FAQ sections, and responsive layout.
- Modify: `tests/messages.test.js`
  - Add tests for contact configuration, local image data, translations, and order review summary.

## Task 1: Assets, Contact Data, And Content Tests

**Files:**
- Create: `assets/flowers/`
- Modify: `src/data.js`
- Modify: `tests/messages.test.js`

- [ ] **Step 1: Copy selected uploaded photos into project assets**

Run from repository root:

```powershell
New-Item -ItemType Directory -Force assets\flowers | Out-Null
Copy-Item -LiteralPath "C:\Users\60135\Pictures\Flower\WhatsApp Image 2026-05-16 at 14.42.45.jpeg" -Destination "assets\flowers\hero-pair-bouquets.jpeg"
Copy-Item -LiteralPath "C:\Users\60135\Pictures\Flower\WhatsApp Image 2026-05-16 at 14.39.42 (1).jpeg" -Destination "assets\flowers\product-pastel-bouquet.jpeg"
Copy-Item -LiteralPath "C:\Users\60135\Pictures\Flower\WhatsApp Image 2026-05-16 at 14.39.42 (2).jpeg" -Destination "assets\flowers\product-peach-bouquet.jpeg"
Copy-Item -LiteralPath "C:\Users\60135\Pictures\Flower\WhatsApp Image 2026-05-16 at 14.39.43 (3).jpeg" -Destination "assets\flowers\product-dark-wrap.jpeg"
Copy-Item -LiteralPath "C:\Users\60135\Pictures\Flower\WhatsApp Image 2026-05-16 at 14.39.44 (2).jpeg" -Destination "assets\flowers\product-white-bouquet.jpeg"
Copy-Item -LiteralPath "C:\Users\60135\Pictures\Flower\WhatsApp Image 2026-05-16 at 14.42.45 (2).jpeg" -Destination "assets\flowers\gallery-event-terrace.jpeg"
Copy-Item -LiteralPath "C:\Users\60135\Pictures\Flower\WhatsApp Image 2026-05-16 at 14.42.45 (3).jpeg" -Destination "assets\flowers\gallery-event-wall.jpeg"
Copy-Item -LiteralPath "C:\Users\60135\Pictures\Flower\WhatsApp Image 2026-05-16 at 14.42.45 (4).jpeg" -Destination "assets\flowers\gallery-event-wide.jpeg"
```

Expected: `Get-ChildItem assets\flowers` shows 8 copied `.jpeg` files.

- [ ] **Step 2: Write failing data/content tests**

Modify the import in `tests/messages.test.js`:

```js
import {
  WHATSAPP_NUMBER,
  contact,
  galleryImages,
  products as floristProducts,
  translations,
} from "../src/data.js";
```

Add these tests after the current URL tests:

```js
test("florist contact configuration uses provided shop details", () => {
  assert.equal(WHATSAPP_NUMBER, "60162969982");
  assert.equal(contact.phone, "60162969982");
  assert.equal(contact.ssm, "JR0162620-K");
  assert.match(contact.location.en, /Nibong Tebal/);
  assert.match(contact.location.en, /Cameron Highland/);
});

test("products and gallery use local flower photo assets", () => {
  assert.ok(floristProducts.every((product) => product.image?.startsWith("./assets/flowers/")));
  assert.ok(galleryImages.length >= 6);
  assert.ok(galleryImages.every((image) => image.src.startsWith("./assets/flowers/")));
});

test("new redesign labels exist in both languages", () => {
  for (const language of ["en", "zh"]) {
    assert.equal(typeof translations[language].about, "string");
    assert.equal(typeof translations[language].gallery, "string");
    assert.equal(typeof translations[language].reviewOrder, "string");
    assert.equal(typeof translations[language].sendWhatsappOrder, "string");
    assert.equal(typeof translations[language].editDetails, "string");
  }
});
```

- [ ] **Step 3: Run tests and verify the new tests fail**

Run:

```powershell
npm test
```

Expected: FAIL because `contact`, `galleryImages`, product `image`, and new translation keys are not defined yet.

- [ ] **Step 4: Update `src/data.js` data**

Make these content changes:

```js
export const WHATSAPP_NUMBER = "60162969982";

export const contact = {
  phone: "60162969982",
  ssm: "JR0162620-K",
  location: {
    en: "Based in Nibong Tebal | Cameron Highland",
    zh: "位于 Nibong Tebal | Cameron Highland",
  },
};

export const galleryImages = [
  {
    id: "pastel-pair",
    src: "./assets/flowers/hero-pair-bouquets.jpeg",
    label: { en: "Pastel bouquet pair", zh: "粉彩双花束" },
  },
  {
    id: "soft-bouquet",
    src: "./assets/flowers/product-pastel-bouquet.jpeg",
    label: { en: "Soft gifting bouquet", zh: "柔和送礼花束" },
  },
  {
    id: "peach-bouquet",
    src: "./assets/flowers/product-peach-bouquet.jpeg",
    label: { en: "Peach rose bouquet", zh: "蜜桃玫瑰花束" },
  },
  {
    id: "dark-wrap",
    src: "./assets/flowers/product-dark-wrap.jpeg",
    label: { en: "Moody premium wrap", zh: "深色高级包装" },
  },
  {
    id: "white-bouquet",
    src: "./assets/flowers/product-white-bouquet.jpeg",
    label: { en: "White bouquet styling", zh: "白色花束造型" },
  },
  {
    id: "event-terrace",
    src: "./assets/flowers/gallery-event-terrace.jpeg",
    label: { en: "Event floral setup", zh: "活动花艺布置" },
  },
  {
    id: "event-wall",
    src: "./assets/flowers/gallery-event-wall.jpeg",
    label: { en: "Blue and yellow event flowers", zh: "蓝黄活动花艺" },
  },
  {
    id: "event-wide",
    src: "./assets/flowers/gallery-event-wide.jpeg",
    label: { en: "Outdoor ceremony flowers", zh: "户外仪式花艺" },
  },
];
```

Add an `image` property to each product:

```js
image: "./assets/flowers/product-pastel-bouquet.jpeg",
```

Use these mappings:

- `sweet-peony`: `./assets/flowers/product-pastel-bouquet.jpeg`
- `sunny-grad`: `./assets/flowers/product-peach-bouquet.jpeg`
- `blush-box`: `./assets/flowers/hero-pair-bouquets.jpeg`
- `opening-basket`: `./assets/flowers/gallery-event-wall.jpeg`
- `quiet-comfort`: `./assets/flowers/product-white-bouquet.jpeg`

Add these translation keys to both `translations.en` and `translations.zh`:

```js
about: "About",
gallery: "Gallery",
reviewOrder: "Review order",
sendWhatsappOrder: "Send WhatsApp order",
editDetails: "Edit details",
```

Chinese values:

```js
about: "关于我们",
gallery: "作品相册",
reviewOrder: "检查订单",
sendWhatsappOrder: "发送 WhatsApp 订单",
editDetails: "修改资料",
```

- [ ] **Step 5: Run tests and commit**

Run:

```powershell
npm test
```

Expected: PASS.

Commit:

```powershell
git add assets\flowers src\data.js tests\messages.test.js
git commit -m "feat: add florist assets and contact data"
```

## Task 2: Page Structure, Header, Hero, About, Gallery, And FAQ Help

**Files:**
- Modify: `index.html`
- Modify: `src/app.js`
- Modify: `src/data.js`
- Modify: `src/styles.css`
- Modify: `tests/messages.test.js`

- [ ] **Step 1: Add a failing static structure test**

Add Node filesystem imports at the top of `tests/messages.test.js`:

```js
import { readFileSync } from "node:fs";
```

Add this test:

```js
test("page structure contains redesigned single-page sections", () => {
  const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");
  assert.match(html, /id="about"/);
  assert.match(html, /id="gallery"/);
  assert.match(html, /id="faq"/);
  assert.doesNotMatch(html, /id="order-info"/);
});
```

- [ ] **Step 2: Run tests and verify failure**

Run:

```powershell
npm test
```

Expected: FAIL because `index.html` still contains `order-info` and lacks `about` and `gallery`.

- [ ] **Step 3: Update `index.html` section containers**

Replace the current main sections with:

```html
<main>
  <section id="home" class="hero" data-js="hero"></section>
  <section id="menu" class="menu-section" data-js="menu"></section>
  <section id="about" class="about-section" data-js="about"></section>
  <section id="gallery" class="gallery-section" data-js="gallery"></section>
  <section id="faq" class="faq-section" data-js="faq"></section>
</main>
```

- [ ] **Step 4: Update `src/app.js` imports and UI copy**

Change the data import to include new data:

```js
import {
  categories,
  contact,
  faq,
  galleryImages,
  occasions,
  products,
  translations,
  WHATSAPP_NUMBER,
} from "./data.js";
```

Add UI keys for the new sections in `ui.en`:

```js
aboutTitle: "Flowers for soft gifting moments",
aboutText:
  "jforuflorist flower studio creates gentle bouquets, flower boxes, flower baskets, and event arrangements for thoughtful celebrations and comfort moments.",
contactTitle: "Studio details",
phone: "Phone / WhatsApp",
location: "Location",
ssm: "SSM",
galleryTitle: "Fresh from the studio",
galleryText: "A curated look at bouquet styles and event floral moments.",
orderingHelp: "Ordering Help",
```

Add matching `ui.zh` values:

```js
aboutTitle: "为温柔心意准备的花礼",
aboutText:
  "jforuflorist 花艺工作室制作花束、花盒、花篮与活动花艺，为庆祝、送礼与慰问时刻准备温柔花礼。",
contactTitle: "店铺资料",
phone: "电话 / WhatsApp",
location: "地点",
ssm: "SSM",
galleryTitle: "花艺作品",
galleryText: "精选花束风格与活动花艺布置。",
orderingHelp: "下单帮助",
```

- [ ] **Step 5: Replace old section rendering**

In `renderHeader`, remove the `Order Info` link and use:

```js
<a href="#home">${u("home")}</a>
<a href="#menu">${u("menu")}</a>
<a href="#about">${t("about")}</a>
<a href="#gallery">${t("gallery")}</a>
<a href="#faq">${u("faq")}</a>
```

Replace `renderOrderInfo()` with:

```js
function renderAbout() {
  $("[data-js='about']").innerHTML = `
    <div class="section-inner about-grid">
      <div>
        <p class="eyebrow">${t("about")}</p>
        <h2>${u("aboutTitle")}</h2>
        <p>${u("aboutText")}</p>
      </div>
      <div class="contact-panel">
        <p class="eyebrow">${u("contactTitle")}</p>
        <dl>
          <div><dt>${u("location")}</dt><dd>${text(contact.location)}</dd></div>
          <div><dt>${u("phone")}</dt><dd><a href="https://wa.me/${WHATSAPP_NUMBER}" target="_blank" rel="noreferrer">${contact.phone}</a></dd></div>
          <div><dt>${u("ssm")}</dt><dd>${contact.ssm}</dd></div>
        </dl>
      </div>
    </div>
  `;
}

function renderGallery() {
  $("[data-js='gallery']").innerHTML = `
    <div class="section-inner">
      <div class="section-heading split-heading">
        <div>
          <p class="eyebrow">${t("gallery")}</p>
          <h2>${u("galleryTitle")}</h2>
        </div>
        <p>${u("galleryText")}</p>
      </div>
      <div class="gallery-grid">
        ${galleryImages
          .map(
            (image) => `
          <figure class="gallery-card">
            <img src="${image.src}" alt="${escapeHtml(text(image.label))}" loading="lazy" />
            <figcaption>${text(image.label)}</figcaption>
          </figure>
        `
          )
          .join("")}
      </div>
    </div>
  `;
}
```

Update `renderFaq()` so it includes ordering cards before the FAQ list:

```js
<div class="order-help-grid">
  ${renderOrderNoticeCard()}
  ${renderDeliveryNoteCard()}
  ${renderPaymentCard()}
</div>
```

Update `render()`:

```js
renderHeader();
renderHero();
renderMenu();
renderAbout();
renderGallery();
renderFaq();
renderProductPanel();
```

- [ ] **Step 6: Update product cards to use real image paths**

Replace the product image div in `renderProductCard(product)` with:

```js
<img class="product-image" src="${product.image}" alt="${escapeHtml(text(product.name))}" loading="lazy" />
```

In `renderProductPanel()`, replace the panel image div with:

```js
<img class="panel-image" src="${product.image}" alt="${escapeHtml(text(product.name))}" />
```

- [ ] **Step 7: Run tests and commit**

Run:

```powershell
npm test
```

Expected: PASS.

Commit:

```powershell
git add index.html src\app.js src\data.js src\styles.css tests\messages.test.js
git commit -m "feat: add redesigned page sections"
```

## Task 3: Order Review Before WhatsApp

**Files:**
- Modify: `src/messages.js`
- Modify: `src/app.js`
- Modify: `src/data.js`
- Modify: `tests/messages.test.js`

- [ ] **Step 1: Write failing order review utility test**

Change the `src/messages.js` import in `tests/messages.test.js`:

```js
import {
  buildOrderReviewItems,
  buildWhatsAppMessage,
  buildWhatsAppUrl,
  filterProducts,
  validateOrder,
} from "../src/messages.js";
```

Add this test:

```js
test("buildOrderReviewItems summarizes buyer order before WhatsApp", () => {
  const items = buildOrderReviewItems(
    { name: { en: "Sweet Peony Bouquet" }, categoryLabel: "Bouquet", priceLabel: "From RM 168" },
    order
  );

  assert.deepEqual(items.slice(0, 4), [
    { label: "Product", value: "Sweet Peony Bouquet" },
    { label: "Category", value: "Bouquet" },
    { label: "Price", value: "From RM 168" },
    { label: "Size", value: "Medium" },
  ]);
  assert.ok(items.some((item) => item.label === "Buyer Phone" && item.value === "0123456789"));
  assert.ok(items.some((item) => item.label === "Special Request" && item.value === "Pastel pink please"));
});
```

- [ ] **Step 2: Run tests and verify failure**

Run:

```powershell
npm test
```

Expected: FAIL because `buildOrderReviewItems` is not exported.

- [ ] **Step 3: Add pure order review helper**

Add this helper to `src/messages.js`:

```js
function productName(product) {
  return typeof product.name === "string" ? product.name : product.name.en;
}

export function buildOrderReviewItems(product, order) {
  const specialRequest = String(order.specialRequest ?? "").trim() || "None";
  const cardMessage = String(order.cardMessage ?? "").trim() || "None";

  return [
    { label: "Product", value: productName(product) },
    { label: "Category", value: product.categoryLabel },
    { label: "Price", value: product.priceLabel },
    { label: "Size", value: order.size },
    { label: "Quantity", value: order.quantity },
    { label: "Service", value: order.serviceType },
    { label: "Pickup/Delivery Date", value: order.date },
    { label: "Event Time", value: order.eventTime },
    { label: "Buyer Name", value: order.buyerName },
    { label: "Buyer Phone", value: order.buyerPhone },
    { label: "Recipient Name", value: order.recipientName },
    { label: "Recipient Phone", value: order.recipientPhone },
    { label: "Delivery Address", value: order.deliveryAddress },
    { label: "Card Message", value: cardMessage },
    { label: "Special Request", value: specialRequest },
  ];
}
```

Then update `buildWhatsAppMessage` to use `productName(product)` instead of redeclaring product name logic.

- [ ] **Step 4: Add panel review state and translations**

In `state`, add:

```js
orderStep: "form",
```

Add `ui.en` keys:

```js
reviewIntro: "Please check the order details before sending to WhatsApp.",
reviewOrder: "Review order",
editDetails: "Edit details",
sendWhatsappOrder: "Send WhatsApp order",
```

Add `ui.zh` keys:

```js
reviewIntro: "发送到 WhatsApp 前，请先检查订单资料。",
reviewOrder: "检查订单",
editDetails: "修改资料",
sendWhatsappOrder: "发送 WhatsApp 订单",
```

- [ ] **Step 5: Render review step in `src/app.js`**

Import the helper:

```js
import {
  buildOrderReviewItems,
  buildWhatsAppMessage,
  buildWhatsAppUrl,
  filterProducts,
  validateOrder,
} from "./messages.js";
```

Add:

```js
function renderOrderReview(product) {
  const reviewItems = buildOrderReviewItems(product, state.order);
  return `
    <div class="order-review">
      <p class="eyebrow">${u("reviewOrder")}</p>
      <p>${u("reviewIntro")}</p>
      <dl>
        ${reviewItems
          .map(
            (item) => `
          <div>
            <dt>${escapeHtml(item.label)}</dt>
            <dd>${escapeHtml(item.value)}</dd>
          </div>
        `
          )
          .join("")}
      </dl>
      <div class="panel-actions">
        <button class="button secondary" type="button" data-action="edit-order">${u("editDetails")}</button>
        <button class="button" type="button" data-action="send-reviewed-order">${u("sendWhatsappOrder")}</button>
      </div>
    </div>
  `;
}
```

In `renderProductPanel()`, show either the form or review:

```js
${state.orderStep === "review" ? renderOrderReview(product) : renderOrderForm(product, deliveryAddressMissing)}
```

Extract the existing form markup into `renderOrderForm(product, deliveryAddressMissing)` and change the form action button to:

```html
<button class="button" type="button" data-action="review-order">${u("reviewOrder")}</button>
```

- [ ] **Step 6: Update click handlers**

When opening a product, reset to form:

```js
state.orderStep = "form";
```

Replace the old `whatsapp-order` click handler with:

```js
if (event.target.closest("[data-action='review-order']")) {
  const result = validateOrder(state.order);
  state.missingFields = result.missing;
  if (!result.valid) {
    renderProductPanel();
    return;
  }

  state.orderStep = "review";
  renderProductPanel();
  return;
}

if (event.target.closest("[data-action='edit-order']")) {
  state.orderStep = "form";
  renderProductPanel();
  return;
}

if (event.target.closest("[data-action='send-reviewed-order']")) {
  const result = validateOrder(state.order);
  state.missingFields = result.missing;
  if (!result.valid) {
    state.orderStep = "form";
    renderProductPanel();
    return;
  }

  const product = selectedProduct();
  const message = buildWhatsAppMessage(product, state.order);
  window.open(buildWhatsAppUrl(WHATSAPP_NUMBER, message), "_blank", "noopener,noreferrer");
  return;
}
```

- [ ] **Step 7: Run tests and commit**

Run:

```powershell
npm test
```

Expected: PASS.

Commit:

```powershell
git add src\messages.js src\app.js src\data.js tests\messages.test.js
git commit -m "feat: add order review before whatsapp"
```

## Task 4: Premium Sweet Boutique Styling

**Files:**
- Modify: `src/styles.css`
- Modify: `src/app.js`

- [ ] **Step 1: Update CSS variables and global section rhythm**

Replace the top variables with:

```css
:root {
  --bg: #fffaf7;
  --surface: #ffffff;
  --surface-warm: #fff1eb;
  --ink: #2f2522;
  --muted: #75655f;
  --line: #ead8cf;
  --accent: #d56f7a;
  --accent-dark: #984853;
  --leaf: #667b5f;
  --cream: #fff4dc;
  --shadow: 0 18px 50px rgba(88, 54, 46, 0.14);
  --radius: 8px;
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}
```

Add `about-section` and `gallery-section` to section padding selectors:

```css
.hero,
.menu-section,
.about-section,
.gallery-section,
.faq-section {
  padding: 72px 0;
}
```

- [ ] **Step 2: Style hero with real imagery**

Update `renderHero()` so the visual uses the copied hero photo:

```js
<div class="hero-visual" aria-label="Soft gifting floral arrangement preview">
  <img src="./assets/flowers/hero-pair-bouquets.jpeg" alt="Pastel jforuflorist bouquets" />
  <div class="hero-card">
    <span>Sweet Gifting Mood</span>
    <strong>Nibong Tebal | Cameron Highland</strong>
  </div>
</div>
```

Replace old `.hero-visual`, `.flower-shape`, and shape styles with:

```css
.hero-visual {
  min-height: 480px;
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  position: relative;
  overflow: hidden;
  background: var(--surface-warm);
}

.hero-visual img {
  width: 100%;
  height: 100%;
  min-height: 480px;
  object-fit: cover;
  display: block;
}

.hero-card {
  position: absolute;
  left: 22px;
  right: 22px;
  bottom: 22px;
  background: rgba(255, 255, 255, 0.86);
  border: 1px solid rgba(255, 255, 255, 0.72);
  border-radius: var(--radius);
  padding: 16px;
  backdrop-filter: blur(14px);
  display: grid;
  gap: 4px;
}
```

- [ ] **Step 3: Style real product images and gallery**

Replace old gradient product image classes with:

```css
.product-image,
.panel-image,
.gallery-card img {
  width: 100%;
  object-fit: cover;
  display: block;
}

.product-image {
  aspect-ratio: 4 / 5;
  border-radius: var(--radius) var(--radius) 0 0;
}

.panel-image {
  aspect-ratio: 4 / 5;
  border-radius: var(--radius);
}

.gallery-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14px;
}

.gallery-card {
  margin: 0;
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: var(--radius);
  overflow: hidden;
  box-shadow: 0 10px 28px rgba(91, 55, 47, 0.08);
}

.gallery-card img {
  aspect-ratio: 1 / 1;
}

.gallery-card figcaption {
  padding: 10px 12px;
  color: var(--muted);
  font-size: 14px;
}
```

- [ ] **Step 4: Style About, contact, order help, and review**

Add:

```css
.about-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(280px, 0.72fr);
  gap: 28px;
  align-items: start;
}

.about-grid h2 {
  margin: 0 0 14px;
  font-family: Georgia, "Times New Roman", serif;
  letter-spacing: 0;
  font-size: 42px;
}

.about-grid p,
.split-heading p {
  color: var(--muted);
  line-height: 1.7;
}

.contact-panel,
.order-review {
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: var(--radius);
  box-shadow: 0 10px 28px rgba(91, 55, 47, 0.08);
  padding: 20px;
}

.contact-panel dl,
.order-review dl {
  display: grid;
  gap: 12px;
  margin: 0;
}

.contact-panel div,
.order-review div {
  display: grid;
  gap: 4px;
}

.contact-panel dt,
.order-review dt {
  color: var(--muted);
  font-size: 13px;
  font-weight: 750;
}

.contact-panel dd,
.order-review dd {
  margin: 0;
  color: var(--ink);
  overflow-wrap: anywhere;
}

.order-help-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
  margin: 0 0 28px;
}
```

- [ ] **Step 5: Update responsive layout**

Add:

```css
@media (max-width: 960px) {
  .gallery-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .about-grid,
  .order-help-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 520px) {
  .gallery-grid {
    grid-template-columns: 1fr;
  }
}
```

- [ ] **Step 6: Run tests and commit**

Run:

```powershell
npm test
```

Expected: PASS.

Commit:

```powershell
git add src\styles.css src\app.js
git commit -m "style: refresh florist storefront design"
```

## Task 5: Browser Verification, Deploy Readiness, And Final Commit

**Files:**
- Modify only files needed to fix issues found during verification.

- [ ] **Step 1: Run automated tests**

Run:

```powershell
npm test
```

Expected: all tests pass.

- [ ] **Step 2: Start local preview**

Run:

```powershell
npm run preview
```

Expected: server starts and prints a local URL, commonly `http://127.0.0.1:4173/`.

- [ ] **Step 3: Browser verification checklist**

Open the preview URL in the in-app browser and verify:

- Header links scroll to `Home`, `Menu`, `About`, `Gallery`, and `FAQ`.
- No `Order Info` navigation item remains.
- Hero image renders and is not blank.
- Product cards render real images.
- Gallery shows uploaded bouquet/event photos.
- About section shows Nibong Tebal, Cameron Highland, phone `60162969982`, and SSM `JR0162620-K`.
- FAQ includes order notice, delivery note, payment guidance, and the original FAQ questions.
- Click a product, fill required fields, click `Review order`, see the review summary, click `Edit details`, and return to the form.
- Click `Review order` with missing required fields and see validation.
- Toggle English/Chinese and confirm labels change without broken encoding.
- Check mobile width around 390px and desktop width around 1366px.

- [ ] **Step 4: Fix any verification issues**

If a verified item fails, make the smallest scoped fix in the relevant file, then rerun:

```powershell
npm test
```

Expected: PASS after each fix.

- [ ] **Step 5: Final status and integration handoff**

Run:

```powershell
git status --short --branch
```

Expected: branch `codex/florist-redesign` with no unstaged changes.

If all verification passes, use `superpowers:finishing-a-development-branch` to choose merge/push/deploy handling.
