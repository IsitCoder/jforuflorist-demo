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
