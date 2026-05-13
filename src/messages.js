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
  const productName = typeof product.name === "string" ? product.name : product.name.en;

  return [
    "Hi jforuflorist flower studio, I would like to place an order.",
    "",
    "Order Details",
    `Product: ${productName}`,
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
