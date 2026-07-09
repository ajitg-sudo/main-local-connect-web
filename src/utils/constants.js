const DEFAULT_CATEGORY_PHOTO = "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400";

const CATEGORY_PHOTOS = {
  Electricians: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400",
  Plumbers: "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=400",
  "Medical Stores": "https://images.unsplash.com/photo-1576602976037-174adce03781?w=400",
  "Medical Store": "https://images.unsplash.com/photo-1576602976037-174adce03781?w=400",
  Hospital: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400",
  Salons: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400",
  "Beauty Parlour": "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400",
  "Food Carts": "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400",
  Cafe: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400",
  Hotel: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400",
  "Tuition Teachers": "https://images.unsplash.com/photo-1503676260728-1c00da280a25?w=400",
  Library: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400",
  Mechanics: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400",
  Cobbler: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400",
  Grocery: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400",
  "General Store": "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400",
  Tailors: "https://images.unsplash.com/photo-1558171813-4c088753b18d?w=400",
  "Clothes Shop": "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=400",
  Photographers: "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=400",
  "Photo Studio / Photo Shop": "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=400",
  Freelancers: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400",
  Gym: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400"
};

function dedupeBusinessGroups(groups) {
  const seen = new Set();
  return groups
    .map((group) => ({
      ...group,
      types: group.types.filter((type) => {
        if (seen.has(type)) return false;
        seen.add(type);
        return true;
      })
    }))
    .filter((group) => group.types.length > 0);
}

export const BUSINESS_GROUPS = dedupeBusinessGroups([
  { group: "Healthcare Services", types: ["Hospital", "Medical Store"] },
  { group: "Food & Beverage Outlets", types: ["Cafe", "Hotel", "Sweet Shop", "Pizza Shop", "Ice Cream Parlour"] },
  {
    group: "Retail Shops",
    types: ["Clothes Shop", "Flower Shop", "Jewellery Shop", "Mobile Shop", "Furniture Shop", "General Store", "Hardware Shop"]
  },
  { group: "Educational Institutes", types: ["Library", "Dance Classes", "Music Classes", "Computer Classes"] },
  { group: "Fitness & Wellness Centers", types: ["Gym", "Yoga Classes", "Beauty Parlour"] },
  {
    group: "Event & Marriage Services",
    types: ["Marriage Bureau", "Marriage Hall / Banquet Hall", "Photo Studio / Photo Shop"]
  },
  { group: "Technology & Electronics Stores", types: ["Computer Shop", "Electronics Shop", "Mobile Shop"] },
  { group: "Home & Lifestyle Businesses", types: ["Laundry", "Furniture Shop", "Art Gallery", "Flower Shop", "Hardware Shop"] }
]);

export const LEGACY_BUSINESS_TYPES = [
  "Electricians", "Plumbers", "Medical Stores", "Salons", "Food Carts", "Tuition Teachers",
  "Mechanics", "Cobbler", "Grocery", "Tailors", "Photographers", "Freelancers"
];

export const BUSINESS_TYPES = [
  ...new Set([...BUSINESS_GROUPS.flatMap((group) => group.types), ...LEGACY_BUSINESS_TYPES])
];

export const CATEGORIES = BUSINESS_TYPES.map((name) => ({
  name,
  photo: CATEGORY_PHOTOS[name] || DEFAULT_CATEGORY_PHOTO
}));

export const COMMUNITY_CATEGORIES = [...BUSINESS_TYPES, "General Business"];

export const MAJOR_CITIES = [
  "Agra", "Ahmedabad", "Bengaluru", "Bhopal", "Chandigarh", "Chennai", "Delhi",
  "Faridabad", "Ghaziabad", "Gurugram", "Hyderabad", "Indore", "Jaipur", "Kanpur",
  "Kochi", "Kolkata", "Lucknow", "Ludhiana", "Meerut", "Mumbai", "Nagpur", "Nashik",
  "Noida", "Patna", "Pune", "Rajkot", "Surat", "Thane", "Vadodara", "Varanasi", "Visakhapatnam"
];

export const AD_POSITIONS = [
  { value: "Hero Banner", label: "Hero Banner" },
  { value: "Sidebar", label: "Sidebar" },
  { value: "Results Inline", label: "Results Inline" },
  { value: "Footer Strip", label: "Footer Strip" }
];

/** Standard image & animated GIF formats (India programmatic inventory) */
export const DISPLAY_AD_FORMATS = {
  "300x250": { w: 300, h: 250, label: "300×250 Medium Rectangle", group: "Desktop", note: "Highest-performing in-content ad" },
  "728x90": { w: 728, h: 90, label: "728×90 Leaderboard", group: "Desktop", note: "Top-of-page banner" },
  "160x600": { w: 160, h: 600, label: "160×600 Wide Skyscraper", group: "Desktop", note: "Vertical sidebar" },
  "970x250": { w: 970, h: 250, label: "970×250 Billboard", group: "Desktop", note: "Hero header placement" },
  "320x50": { w: 320, h: 50, label: "320×50 Mobile Leaderboard", group: "Mobile & Tablet" },
  "320x100": { w: 320, h: 100, label: "320×100 Large Mobile Banner", group: "Mobile & Tablet" }
};

/** Standard video ad formats */
export const VIDEO_AD_FORMATS = {
  "1080x1920": {
    w: 1080,
    h: 1920,
    label: "1080×1920 Vertical Video",
    group: "Video",
    note: "9:16 — mobile apps & vertical feeds",
    displayMaxW: 360
  },
  "1080x1080": {
    w: 1080,
    h: 1080,
    label: "1080×1080 Square Video",
    group: "Video",
    note: "Instagram, Facebook & social feeds",
    displayMaxW: 400
  },
  "300x250": {
    w: 300,
    h: 250,
    label: "300×250 In-Banner Video",
    group: "Video",
    note: "Plays inside a standard display slot"
  },
  "336x280": {
    w: 336,
    h: 280,
    label: "336×280 In-Banner Video",
    group: "Video",
    note: "Plays inside a large rectangle slot"
  }
};

/** All supported ad formats (display + video-only keys) */
export const IAB_AD_FORMATS = {
  ...DISPLAY_AD_FORMATS,
  "1080x1920": VIDEO_AD_FORMATS["1080x1920"],
  "1080x1080": VIDEO_AD_FORMATS["1080x1080"],
  "336x280": VIDEO_AD_FORMATS["336x280"]
};

/** Recommended display formats per placement */
export const AD_DISPLAY_SIZES_BY_POSITION = {
  "Hero Banner": ["970x250", "728x90", "320x100", "320x50"],
  Sidebar: ["160x600", "300x250"],
  "Results Inline": ["300x250", "728x90", "320x100", "320x50"],
  "Footer Strip": ["728x90", "320x100", "320x50"]
};

/** Recommended video formats per placement */
export const AD_VIDEO_SIZES_BY_POSITION = {
  "Hero Banner": ["1080x1920", "1080x1080", "970x250", "300x250", "336x280"],
  Sidebar: ["300x250", "336x280", "1080x1920"],
  "Results Inline": ["300x250", "336x280", "1080x1080"],
  "Footer Strip": ["300x250", "336x280"]
};

export const AD_DEFAULT_SIZE = {
  "Hero Banner": "970x250",
  Sidebar: "160x600",
  "Results Inline": "300x250",
  "Footer Strip": "728x90"
};

export const AD_DEFAULT_VIDEO_SIZE = {
  "Hero Banner": "1080x1920",
  Sidebar: "300x250",
  "Results Inline": "300x250",
  "Footer Strip": "300x250"
};

/** Legacy size labels and retired IAB keys from older ads */
const LEGACY_SIZE_MAP = {
  Small: "320x50",
  Medium: "300x250",
  Large: "728x90",
  Billboard: "970x250",
  "970x90": "728x90",
  "980x120": "970x250",
  "375x667": "320x100",
  "300x600": "160x600"
};

export function isVideoAdMedia(media) {
  return media === "Video";
}

export function getDefaultAdSize(position, media = "Image") {
  return isVideoAdMedia(media)
    ? AD_DEFAULT_VIDEO_SIZE[position] || "300x250"
    : AD_DEFAULT_SIZE[position] || "300x250";
}

export function getAdFormatsForPosition(position, media = "Image") {
  const map = isVideoAdMedia(media) ? AD_VIDEO_SIZES_BY_POSITION : AD_DISPLAY_SIZES_BY_POSITION;
  const keys = map[position] || map["Results Inline"];
  return keys
    .map((key) => {
      const spec =
        (isVideoAdMedia(media) && VIDEO_AD_FORMATS[key]) ||
        DISPLAY_AD_FORMATS[key] ||
        IAB_AD_FORMATS[key];
      return { key, ...spec };
    })
    .filter((f) => f.w);
}

export function getAdSpec(position, size, media) {
  const normalized = normalizeAdSizeKey(position, size, media);
  if (isVideoAdMedia(media) && VIDEO_AD_FORMATS[normalized]) {
    return VIDEO_AD_FORMATS[normalized];
  }
  return IAB_AD_FORMATS[normalized] || IAB_AD_FORMATS[getDefaultAdSize(position, media)];
}

export function normalizeAdSizeKey(position, size, media) {
  if (size && IAB_AD_FORMATS[size]) return size;
  if (size && LEGACY_SIZE_MAP[size]) {
    return LEGACY_SIZE_MAP[size] || getDefaultAdSize(position, media);
  }
  return getDefaultAdSize(position, media);
}

export const PLANS = [
  {
    name: "Free",
    price: "Rs.0",
    amountPaise: 0,
    features: ["Basic listing", "WhatsApp contact", "1 photo", "Up to 2 offerings"]
  },
  {
    name: "Premium",
    price: "Rs.1000/Year",
    amountPaise: 100000,
    features: ["Higher search rank", "Up to 8 photos", "Up to 10 offerings", "Lead dashboard & analytics"]
  },
  {
    name: "Featured",
    price: "Rs.2000/Year",
    amountPaise: 200000,
    features: ["Top 3 slots in results", "Up to 20 photos", "Unlimited offerings", "All Premium perks"]
  }
];

export function getPlanByName(name) {
  return PLANS.find((p) => p.name === name) || PLANS[0];
}

export function isPaidPlan(plan) {
  return plan === "Premium" || plan === "Featured";
}

export function planBadgeClass(plan) {
  if (plan === "Featured") return "bg-saffron/15 text-amber-800";
  if (plan === "Premium") return "bg-teal/10 text-teal-dark";
  return "bg-line text-muted";
}

export function whatsappLink(phone, text = "") {
  const digits = String(phone).replace(/\D/g, "");
  return `https://wa.me/${digits}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
}

export function telLink(phone) {
  return `tel:${String(phone).replace(/\s/g, "")}`;
}
