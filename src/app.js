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
const ui = {
  en: {
    home: "Home",
    menu: "Menu",
    orderInfo: "Order Info",
    faq: "FAQ",
    browseMenu: "Browse menu",
    heroTitle: "jforuflorist flower studio",
    heroText: "Sweet gifting flowers for birthdays, graduations, anniversaries, openings, and quiet comfort moments.",
    menuEyebrow: "Menu",
    menuTitle: "Choose your floral gift",
    order: "Order",
    orderNotice: "Order Notice",
    confirmBeforePayment: "Please confirm before payment",
    sameDay: "Same-day orders depend on flower availability.",
    replacements: "Flower colors and varieties may be adjusted based on daily stock.",
    paymentAfterConfirm: "Payment is recommended after WhatsApp confirmation.",
    paymentDetails: "Payment Details",
    sampleDetails: "Temporary sample details",
    bankTransfer: "Bank Transfer: jforuflorist flower studio",
    duitNow: "DuitNow / QR: Available after confirmation",
    tng: "Touch 'n Go: Available after confirmation",
    commonQuestions: "Common Questions",
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
    panelLabel: "Product order panel",
  },
  zh: {
    home: "首页",
    menu: "花礼菜单",
    orderInfo: "下单须知",
    faq: "常见问题",
    browseMenu: "浏览花礼",
    heroTitle: "jforuflorist 花艺工作室",
    heroText: "为生日、毕业、纪念日、开张与慰问时刻准备的温暖花礼。",
    menuEyebrow: "花礼菜单",
    menuTitle: "选择你的花礼",
    order: "下单",
    orderNotice: "下单须知",
    confirmBeforePayment: "付款前请先确认",
    sameDay: "当日订单需视花材库存而定。",
    replacements: "花色与花材会依每日库存调整。",
    paymentAfterConfirm: "建议 WhatsApp 确认后才付款。",
    paymentDetails: "付款资料",
    sampleDetails: "暂用示例资料",
    bankTransfer: "银行转账：jforuflorist flower studio",
    duitNow: "DuitNow / QR：确认后提供",
    tng: "Touch 'n Go：确认后提供",
    commonQuestions: "常见问题",
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
    panelLabel: "商品下单表格",
  },
};
const u = (key) => ui[state.language][key] ?? key;
const escapeHtml = (value) =>
  String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

function categoryText(categoryId) {
  const category = categories.find((item) => item.id === categoryId);
  return category ? t(category.labelKey) : categoryId;
}

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
        <a href="#home">${u("home")}</a>
        <a href="#menu">${u("menu")}</a>
        <a href="#order-info">${u("orderInfo")}</a>
        <a href="#faq">${u("faq")}</a>
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
        <h1>${u("heroTitle")}</h1>
        <p class="hero-text">
          ${u("heroText")}
        </p>
        <div class="hero-actions">
          <a class="button" href="#menu">${u("browseMenu")}</a>
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
        <p class="product-meta">${categoryText(product.category)}</p>
        <h3>${text(product.name)}</h3>
        <p>${text(product.description)}</p>
        <div class="product-footer">
          <strong>${product.priceLabel}</strong>
          <button class="button secondary" data-action="select-product" data-product-id="${product.id}">
            ${u("order")}
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
        <p class="eyebrow">${u("menuEyebrow")}</p>
        <h2>${u("menuTitle")}</h2>
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
        <p class="eyebrow">${u("orderNotice")}</p>
        <h2>${u("confirmBeforePayment")}</h2>
        <ul>
          <li>${u("sameDay")}</li>
          <li>${u("replacements")}</li>
          <li>${u("paymentAfterConfirm")}</li>
        </ul>
      </section>
      <section>
        <p class="eyebrow">${u("paymentDetails")}</p>
        <h2>${u("sampleDetails")}</h2>
        <p>${u("bankTransfer")}</p>
        <p>${u("duitNow")}</p>
        <p>${u("tng")}</p>
      </section>
    </div>
  `;
}

function renderFaq() {
  $("[data-js='faq']").innerHTML = `
    <div class="section-inner">
      <div class="section-heading">
        <p class="eyebrow">${u("faq")}</p>
        <h2>${u("commonQuestions")}</h2>
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

function renderField(name, labelKey, type = "text") {
  const isMissing = state.missingFields.includes(name);
  return `
    <label class="field ${isMissing ? "has-error" : ""}">
      <span>${u(labelKey)}</span>
      <input type="${type}" name="${name}" value="${escapeHtml(state.order[name])}" />
      ${isMissing ? `<small>${u("required")}</small>` : ""}
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
    <aside class="product-panel" aria-label="${u("panelLabel")}">
      <div class="panel-header">
        <div>
          <p class="eyebrow">${categoryText(product.category)}</p>
          <h2>${text(product.name)}</h2>
        </div>
        <button class="chip" data-action="close-panel">${u("close")}</button>
      </div>
      <div class="panel-grid">
        <div>
          <div class="product-image product-image-${product.imageTone} panel-image"></div>
          <p class="panel-note">${text(product.floristNote)}</p>
          <strong>${product.priceLabel}</strong>
        </div>
        <form class="order-form" data-js="order-form">
          <label class="field">
            <span>${u("size")}</span>
            <select name="size">
              ${product.sizes
                .map((size) => `<option ${state.order.size === size ? "selected" : ""}>${escapeHtml(size)}</option>`)
                .join("")}
            </select>
          </label>
          ${renderField("buyerName", "buyerName")}
          ${renderField("buyerPhone", "buyerPhone", "tel")}
          <label class="field">
            <span>${u("service")}</span>
            <select name="serviceType">
              <option value="Delivery" ${state.order.serviceType === "Delivery" ? "selected" : ""}>${u("delivery")}</option>
              <option value="Pickup" ${state.order.serviceType === "Pickup" ? "selected" : ""}>${u("pickup")}</option>
            </select>
          </label>
          ${renderField("quantity", "quantity", "number")}
          ${renderField("date", "date", "date")}
          ${renderField("eventTime", "eventTime")}
          ${renderField("recipientName", "recipientName")}
          ${renderField("recipientPhone", "recipientPhone", "tel")}
          <label class="field wide ${deliveryAddressMissing ? "has-error" : ""}">
            <span>${u("deliveryAddress")}</span>
            <textarea name="deliveryAddress">${escapeHtml(state.order.deliveryAddress)}</textarea>
            ${deliveryAddressMissing ? `<small>${u("required")}</small>` : ""}
          </label>
          <label class="field wide">
            <span>${u("cardMessage")}</span>
            <textarea name="cardMessage">${escapeHtml(state.order.cardMessage)}</textarea>
          </label>
          <label class="field wide">
            <span>${u("specialRequest")}</span>
            <textarea name="specialRequest">${escapeHtml(state.order.specialRequest)}</textarea>
          </label>
          <div class="panel-actions">
            <button class="button" type="button" data-action="whatsapp-order">${u("orderViaWhatsapp")}</button>
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
