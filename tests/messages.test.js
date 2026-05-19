import test from "node:test";
import assert from "node:assert/strict";
import {
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
