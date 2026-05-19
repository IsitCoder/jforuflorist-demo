export const WHATSAPP_NUMBER = "60162969982";

export const contact = {
  phone: "60162969982",
  ssm: "JR0162620-K",
  location: {
    en: "Based in Nibong Tebal | Cameron Highland",
    zh: "位于 Nibong Tebal | Cameron Highland",
  },
};

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
    image: "./assets/flowers/product-pastel-bouquet.jpeg",
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
    image: "./assets/flowers/product-peach-bouquet.jpeg",
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
    image: "./assets/flowers/hero-pair-bouquets.jpeg",
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
    image: "./assets/flowers/gallery-event-wall.jpeg",
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
    image: "./assets/flowers/product-white-bouquet.jpeg",
    imageTone: "comfort",
    floristNote: {
      en: "Tone will be kept gentle and respectful.",
      zh: "整体色调会保持温和与庄重。",
    },
  },
];

export const galleryImages = [
  {
    src: "./assets/flowers/hero-pair-bouquets.jpeg",
    label: { en: "Signature paired bouquet arrangement", zh: "招牌双花束作品" },
  },
  {
    src: "./assets/flowers/product-pastel-bouquet.jpeg",
    label: { en: "Pastel bouquet with soft wrap", zh: "柔色包装花束" },
  },
  {
    src: "./assets/flowers/product-peach-bouquet.jpeg",
    label: { en: "Peach-toned celebration bouquet", zh: "蜜桃色庆祝花束" },
  },
  {
    src: "./assets/flowers/product-dark-wrap.jpeg",
    label: { en: "Dark wrap premium bouquet", zh: "深色包装高级花束" },
  },
  {
    src: "./assets/flowers/product-white-bouquet.jpeg",
    label: { en: "White bouquet for gentle occasions", zh: "白色温柔场合花束" },
  },
  {
    src: "./assets/flowers/gallery-event-terrace.jpeg",
    label: { en: "Event floral terrace styling", zh: "露台活动花艺布置" },
  },
  {
    src: "./assets/flowers/gallery-event-wall.jpeg",
    label: { en: "Event flower wall arrangement", zh: "活动花墙布置" },
  },
  {
    src: "./assets/flowers/gallery-event-wide.jpeg",
    label: { en: "Wide event floral installation", zh: "大型活动花艺布置" },
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
    about: "About",
    gallery: "Gallery",
    reviewOrder: "Review Order",
    sendWhatsappOrder: "Send WhatsApp Order",
    editDetails: "Edit Details",
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
    about: "关于我们",
    gallery: "作品相册",
    reviewOrder: "检查订单",
    sendWhatsappOrder: "发送 WhatsApp 订单",
    editDetails: "修改资料",
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
