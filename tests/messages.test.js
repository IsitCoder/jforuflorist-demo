import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  buildOrderReviewItems,
  buildWhatsAppMessage,
  buildWhatsAppUrl,
  filterProducts,
  validateOrder,
} from "../src/messages.js";
import {
  WHATSAPP_NUMBER,
  contact,
  galleryImages,
  products as floristProducts,
  translations,
} from "../src/data.js";

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

test("validateOrder rejects invalid quantities", () => {
  for (const quantity of ["0", "-1", "1.5", "abc"]) {
    const result = validateOrder({ ...order, quantity });
    assert.equal(result.valid, false);
    assert.deepEqual(result.missing, ["quantity"]);
  }

  assert.deepEqual(validateOrder({ ...order, quantity: "1" }), { valid: true, missing: [] });
  assert.deepEqual(validateOrder({ ...order, quantity: "2" }), { valid: true, missing: [] });
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

test("buildWhatsAppMessage supports localized product data", () => {
  const message = buildWhatsAppMessage(floristProducts[0], order);
  assert.match(message, /Product: Sweet Peony Bouquet/);
  assert.doesNotMatch(message, /\[object Object\]/);
});

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

test("buildOrderReviewItems supports localized visible review labels and values", () => {
  const items = buildOrderReviewItems(
    { name: { en: "Sweet Peony Bouquet", zh: "甜美牡丹花束" }, categoryLabel: "Bouquet", priceLabel: "From RM 168" },
    { ...order, cardMessage: "", specialRequest: "", serviceType: "Delivery" },
    {
      none: "无",
      labels: {
        product: "商品",
        category: "类别",
        price: "价格",
        size: "尺寸",
        quantity: "数量",
        service: "服务方式",
        date: "自取 / 配送日期",
        eventTime: "使用时间",
        buyerName: "订购人姓名",
        buyerPhone: "订购人电话",
        recipientName: "收件人姓名",
        recipientPhone: "收件人电话",
        deliveryAddress: "配送地址",
        cardMessage: "卡片留言",
        specialRequest: "特别要求（可选）",
      },
      values: {
        productName: "甜美牡丹花束",
        category: "花束",
        service: "配送",
      },
    }
  );

  assert.deepEqual(items.slice(0, 3), [
    { label: "商品", value: "甜美牡丹花束" },
    { label: "类别", value: "花束" },
    { label: "价格", value: "From RM 168" },
  ]);
  assert.ok(items.some((item) => item.label === "服务方式" && item.value === "配送"));
  assert.ok(items.some((item) => item.label === "卡片留言" && item.value === "无"));
  assert.ok(items.some((item) => item.label === "特别要求（可选）" && item.value === "无"));
});

test("buildWhatsAppMessage prints None for empty optional text", () => {
  const message = buildWhatsAppMessage(
    { name: "Blush Gift Flower Box", categoryLabel: "Flower Box" },
    { ...order, cardMessage: "", specialRequest: "" }
  );
  assert.match(message, /Card Message\nNone/);
  assert.match(message, /Special Request\nNone/);
});

test("buildWhatsAppUrl strips non-digits from phone number", () => {
  const url = buildWhatsAppUrl("+60 12-345 6789", "Hello flower studio");
  assert.equal(url, "https://wa.me/60123456789?text=Hello%20flower%20studio");
});

test("florist contact configuration uses provided shop details", () => {
  assert.equal(WHATSAPP_NUMBER, "60162969982");
  assert.equal(contact.phone, "60162969982");
  assert.equal(contact.ssm, "JR0162620-K");
  assert.match(contact.location.en, /Nibong Tebal/);
  assert.match(contact.location.en, /Cameron Highland/);
});

test("products and gallery use local flower photo assets", () => {
  assert.ok(floristProducts.every((product) => product.image?.startsWith("./assets/flowers/")));
  assert.ok(galleryImages.length >= 8);
  assert.ok(galleryImages.every((image) => image.src.startsWith("./assets/flowers/")));
  assert.ok(galleryImages.every((image) => typeof image.label?.en === "string"));
  assert.ok(galleryImages.every((image) => typeof image.label?.zh === "string"));
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

test("review order UI labels exist in local app copy", () => {
  const appSource = readFileSync(new URL("../src/app.js", import.meta.url), "utf8");

  for (const key of ["reviewIntro", "reviewOrder", "editDetails", "sendWhatsappOrder", "reviewProduct", "reviewCategory", "reviewPrice", "none"]) {
    const matches = appSource.match(new RegExp(`${key}:\\s*"[^"]+"`, "g")) ?? [];
    assert.equal(matches.length, 2);
  }
});

test("page structure contains redesigned single-page sections", () => {
  const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");
  assert.match(html, /id="about"/);
  assert.match(html, /id="gallery"/);
  assert.match(html, /id="faq"/);
  assert.doesNotMatch(html, /id="order-info"/);
});
