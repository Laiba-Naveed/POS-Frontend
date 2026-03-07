// ─── CATEGORY CONFIG (visual metadata only) ────────────────
export const CATEGORY_META = {
  Naan: {
    emoji: "🫓",
    image: "/categories/naan.jpg",
    color: "#C8711A",
    light: "#FFF3E0",
    grad: "linear-gradient(135deg,#C8711A,#E8931F)",
    urdu: "نان",
  },
  Chana: {
    emoji: "🥘",
    image: "/categories/chana.jpg",
    color: "#8B5E3C",
    light: "#FDF6EE",
    grad: "linear-gradient(135deg,#8B5E3C,#B8865A)",
    urdu: "چنے",
  },
  Lassi: {
    emoji: "🥛",
    image: "/categories/lassi.jpg",
    color: "#2E86AB",
    light: "#EEF6FA",
    grad: "linear-gradient(135deg,#2E86AB,#54A8CC)",
    urdu: "لسی",
  },
  Refreshments: {
    emoji: "🥤",
    image: "/categories/refreshments.jpg",
    color: "#2D6A4F",
    light: "#EEFAF5",
    grad: "linear-gradient(135deg,#2D6A4F,#52B788)",
    urdu: "مشروبات",
  },
  Others: {
    emoji: "🍽️",
    image: "/categories/others.jpg",
    color: "#6B4C8B",
    light: "#F5F0FB",
    grad: "linear-gradient(135deg,#6B4C8B,#9B72BB)",
    urdu: "دیگر",
  },
};

export const DEFAULT_META = {
  emoji: "🍴",
  image: null,
  color: "#888",
  light: "#f5f5f5",
  grad: "linear-gradient(135deg,#888,#aaa)",
  urdu: "",
};

export const CATEGORIES_LIST = ["Naan", "Chana", "Lassi", "Refreshments", "Others"];

export const PRODUCTS_BY_CAT = {
  Naan: ["Kulcha Naan", "Sada Naan", "Rogni Naan", "Tandoori Roti"],
  Chana: ["Kofta Chana", "Andy Chana", "Murgh Chana"],
  Lassi: ["Meethi Lassi", "Namkeen Lassi", "Mango Lassi"],
  Refreshments: ["Chai", "Cold Drink", "Water", "Sharbat"],
  Others: ["Pickles", "Salad", "Raita"],
};
