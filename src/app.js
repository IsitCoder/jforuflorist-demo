import { categories, faq, occasions, products, translations, WHATSAPP_NUMBER } from "./data.js";
import { buildWhatsAppMessage, buildWhatsAppUrl, filterProducts, validateOrder } from "./messages.js";

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

const $ = (selector) => document.querySelector(selector);
const text = (value) => (typeof value === "string" ? value : value[state.language]);
const t = (key) => translations[state.language][key] ?? key;
const escapeHtml = (value) =>
  String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

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
    .map(
      (item) => `
      <button class="chip ${active === item.id ? "is-active" : ""}" data-filter-type="${type}" data-filter-value="${item.id}">
        ${t(item.labelKey)}
      </button>
    `
    )
    .join("");
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
        ${faq
          .map(
            (item) => `
          <details class="faq-item">
            <summary>${text(item.q)}</summary>
            <p>${text(item.a)}</p>
          </details>
        `
          )
          .join("")}
      </div>
    </div>
  `;
}

function selectedProduct() {
  return products.find((product) => product.id === state.selectedProductId) ?? products[0];
}

function renderField(name, label, type = "text") {
  const isMissing = state.missingFields.includes(name);
  return `
    <label class="field ${isMissing ? "has-error" : ""}">
      <span>${label}</span>
      <input type="${type}" name="${name}" value="${escapeHtml(state.order[name])}" />
      ${isMissing ? `<small>Required</small>` : ""}
    </label>
  `;
}

function renderProductPanel() {
  const panel = $("[data-js='product-panel']");

  if (!state.panelOpen) {
    panel.innerHTML = "";
    return;
  }

  const product = selectedProduct();
  const deliveryAddressMissing = state.missingFields.includes("deliveryAddress");

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
              ${product.sizes
                .map((size) => `<option ${state.order.size === size ? "selected" : ""}>${escapeHtml(size)}</option>`)
                .join("")}
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
          <label class="field wide ${deliveryAddressMissing ? "has-error" : ""}">
            <span>Delivery address</span>
            <textarea name="deliveryAddress">${escapeHtml(state.order.deliveryAddress)}</textarea>
            ${deliveryAddressMissing ? `<small>Required</small>` : ""}
          </label>
          <label class="field wide">
            <span>Card message</span>
            <textarea name="cardMessage">${escapeHtml(state.order.cardMessage)}</textarea>
          </label>
          <label class="field wide">
            <span>Optional special request</span>
            <textarea name="specialRequest">${escapeHtml(state.order.specialRequest)}</textarea>
          </label>
          <div class="panel-actions">
            <button class="button" type="button" data-action="whatsapp-order">Order via WhatsApp</button>
          </div>
        </form>
      </div>
    </aside>
  `;
}

function render() {
  renderHeader();
  renderHero();
  renderMenu();
  renderOrderInfo();
  renderFaq();
  renderProductPanel();
}

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
    const message = buildWhatsAppMessage(product, state.order);
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

render();
