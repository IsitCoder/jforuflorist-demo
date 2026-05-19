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
  const quantity = String(order.quantity ?? "").trim();
  if (!missing.includes("quantity") && (!/^\d+$/.test(quantity) || Number(quantity) < 1)) {
    missing.push("quantity");
  }

  return { valid: missing.length === 0, missing };
}

function productName(product) {
  return typeof product.name === "string" ? product.name : product.name.en;
}

const defaultReviewCopy = {
  none: "None",
  labels: {
    product: "Product",
    category: "Category",
    price: "Price",
    size: "Size",
    quantity: "Quantity",
    service: "Service",
    date: "Pickup/Delivery Date",
    eventTime: "Event Time",
    buyerName: "Buyer Name",
    buyerPhone: "Buyer Phone",
    recipientName: "Recipient Name",
    recipientPhone: "Recipient Phone",
    deliveryAddress: "Delivery Address",
    cardMessage: "Card Message",
    specialRequest: "Special Request",
  },
};

export function buildOrderReviewItems(product, order, copy = {}) {
  const labels = { ...defaultReviewCopy.labels, ...(copy.labels ?? {}) };
  const none = copy.none ?? defaultReviewCopy.none;
  const values = copy.values ?? {};
  const specialRequest = String(order.specialRequest ?? "").trim() || none;
  const cardMessage = String(order.cardMessage ?? "").trim() || none;

  return [
    { label: labels.product, value: values.productName ?? productName(product) },
    { label: labels.category, value: values.category ?? product.categoryLabel },
    { label: labels.price, value: product.priceLabel },
    { label: labels.size, value: order.size },
    { label: labels.quantity, value: order.quantity },
    { label: labels.service, value: values.service ?? order.serviceType },
    { label: labels.date, value: order.date },
    { label: labels.eventTime, value: order.eventTime },
    { label: labels.buyerName, value: order.buyerName },
    { label: labels.buyerPhone, value: order.buyerPhone },
    { label: labels.recipientName, value: order.recipientName },
    { label: labels.recipientPhone, value: order.recipientPhone },
    { label: labels.deliveryAddress, value: order.deliveryAddress },
    { label: labels.cardMessage, value: cardMessage },
    { label: labels.specialRequest, value: specialRequest },
  ];
}

export function buildWhatsAppMessage(product, order) {
  const specialRequest = String(order.specialRequest ?? "").trim() || "None";
  const cardMessage = String(order.cardMessage ?? "").trim() || "None";

  return [
    "Hi jforuflorist flower studio, I would like to place an order.",
    "",
    "Order Details",
    `Product: ${productName(product)}`,
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
