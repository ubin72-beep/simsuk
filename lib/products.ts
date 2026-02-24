export interface Product {
  id: string;
  name: string;
  nameKo: string;
  description: string;
  descriptionKo: string;
  price: number;
  category: "bracelet" | "necklace" | "earring" | "ring" | "anklet" | "set";
  categoryKo: string;
  image: string;
  images: string[];
  inStock: boolean;
  badge?: string;
  badgeKo?: string;
  details: string[];
  detailsKo: string[];
}

export const categories = [
  { id: "all", name: "All", nameKo: "전체" },
  { id: "bracelet", name: "Bracelets", nameKo: "팔찌" },
  { id: "necklace", name: "Necklaces", nameKo: "목걸이" },
  { id: "earring", name: "Earrings", nameKo: "귀걸이" },
  { id: "ring", name: "Rings", nameKo: "반지" },
  { id: "anklet", name: "Anklets", nameKo: "발찌" },
  { id: "set", name: "Sets", nameKo: "세트" },
];

export const products: Product[] = [
  {
    id: "hematite-bracelet-classic",
    name: "Classic Hematite Bracelet",
    nameKo: "클래식 헤마타이트 팔찌",
    description:
      "A timeless bracelet crafted from genuine natural hematite stones, polished to a mirror-like shine.",
    descriptionKo:
      "천연 헤마타이트 원석을 미러처럼 광택 처리한 클래식한 팔찌입니다.",
    price: 28000,
    category: "bracelet",
    categoryKo: "팔찌",
    image: "/images/bracelet-classic.jpg",
    images: [
      "/images/bracelet-classic.jpg",
      "/images/bracelet-classic-2.jpg",
    ],
    inStock: true,
    badge: "Best Seller",
    badgeKo: "베스트셀러",
    details: [
      "Material: 100% Natural Hematite",
      "Bead Size: 8mm",
      "Elastic band – one size fits most",
      "Weight: approx. 18g",
    ],
    detailsKo: [
      "소재: 100% 천연 헤마타이트",
      "비즈 사이즈: 8mm",
      "탄성 밴드 – 대부분의 사이즈에 맞음",
      "중량: 약 18g",
    ],
  },
  {
    id: "hematite-bracelet-double",
    name: "Double-Strand Hematite Bracelet",
    nameKo: "더블 스트랜드 헤마타이트 팔찌",
    description:
      "Two strands of pure hematite beads intertwined for an elegant, layered look.",
    descriptionKo: "두 줄의 순수 헤마타이트 비즈가 엮인 우아한 레이어드 팔찌.",
    price: 42000,
    category: "bracelet",
    categoryKo: "팔찌",
    image: "/images/bracelet-double.jpg",
    images: ["/images/bracelet-double.jpg"],
    inStock: true,
    details: [
      "Material: 100% Natural Hematite",
      "Bead Size: 6mm",
      "Double-strand elastic design",
    ],
    detailsKo: [
      "소재: 100% 천연 헤마타이트",
      "비즈 사이즈: 6mm",
      "더블 스트랜드 탄성 디자인",
    ],
  },
  {
    id: "hematite-necklace-pendant",
    name: "Hematite Pendant Necklace",
    nameKo: "헤마타이트 펜던트 목걸이",
    description:
      "A stunning pendant necklace featuring a polished oval hematite centerpiece on a sterling silver chain.",
    descriptionKo:
      "광택 처리된 타원형 헤마타이트 센터피스와 스털링 실버 체인의 화려한 펜던트 목걸이.",
    price: 58000,
    category: "necklace",
    categoryKo: "목걸이",
    image: "/images/necklace-pendant.jpg",
    images: ["/images/necklace-pendant.jpg"],
    inStock: true,
    badge: "New",
    badgeKo: "신상",
    details: [
      "Pendant: Natural Hematite (20mm × 15mm)",
      "Chain: Sterling Silver 925",
      "Chain Length: 45cm (adjustable)",
    ],
    detailsKo: [
      "펜던트: 천연 헤마타이트 (20mm × 15mm)",
      "체인: 스털링 실버 925",
      "체인 길이: 45cm (조절 가능)",
    ],
  },
  {
    id: "hematite-necklace-beaded",
    name: "Beaded Hematite Necklace",
    nameKo: "비즈 헤마타이트 목걸이",
    description:
      "A gorgeous beaded necklace made entirely of genuine hematite stones with a magnetic clasp.",
    descriptionKo:
      "천연 헤마타이트 비즈로 만들어진 자석 클래스프가 달린 비즈 목걸이.",
    price: 65000,
    category: "necklace",
    categoryKo: "목걸이",
    image: "/images/necklace-beaded.jpg",
    images: ["/images/necklace-beaded.jpg"],
    inStock: true,
    details: [
      "Material: 100% Natural Hematite",
      "Bead Size: 10mm",
      "Length: 50cm",
      "Magnetic clasp closure",
    ],
    detailsKo: [
      "소재: 100% 천연 헤마타이트",
      "비즈 사이즈: 10mm",
      "길이: 50cm",
      "자석 클래스프 잠금",
    ],
  },
  {
    id: "hematite-earrings-stud",
    name: "Hematite Stud Earrings",
    nameKo: "헤마타이트 스터드 귀걸이",
    description:
      "Minimalist round hematite studs with sterling silver posts, perfect for everyday elegance.",
    descriptionKo:
      "스털링 실버 포스트의 미니멀한 둥근 헤마타이트 스터드 귀걸이.",
    price: 22000,
    category: "earring",
    categoryKo: "귀걸이",
    image: "/images/earrings-stud.jpg",
    images: ["/images/earrings-stud.jpg"],
    inStock: true,
    details: [
      "Stone: Natural Hematite (8mm)",
      "Post: Sterling Silver 925",
      "Includes butterfly backs",
    ],
    detailsKo: [
      "스톤: 천연 헤마타이트 (8mm)",
      "포스트: 스털링 실버 925",
      "버터플라이 백 포함",
    ],
  },
  {
    id: "hematite-earrings-drop",
    name: "Hematite Drop Earrings",
    nameKo: "헤마타이트 드롭 귀걸이",
    description:
      "Elegant drop earrings with teardrop hematite stones set in oxidized silver settings.",
    descriptionKo: "산화은 세팅의 티어드롭 헤마타이트 스톤으로 된 우아한 드롭 귀걸이.",
    price: 35000,
    category: "earring",
    categoryKo: "귀걸이",
    image: "/images/earrings-drop.jpg",
    images: ["/images/earrings-drop.jpg"],
    inStock: true,
    details: [
      "Stone: Natural Hematite (teardrop, 15mm)",
      "Setting: Oxidized Silver",
      "Total Length: 3.5cm",
    ],
    detailsKo: [
      "스톤: 천연 헤마타이트 (티어드롭, 15mm)",
      "세팅: 산화은",
      "전체 길이: 3.5cm",
    ],
  },
  {
    id: "hematite-ring-band",
    name: "Hematite Band Ring",
    nameKo: "헤마타이트 밴드 반지",
    description:
      "A sleek, polished hematite band ring that exudes natural luxury and strength.",
    descriptionKo: "자연의 럭셔리와 강인함을 발산하는 매끄럽고 광택 있는 헤마타이트 밴드 반지.",
    price: 32000,
    category: "ring",
    categoryKo: "반지",
    image: "/images/ring-band.jpg",
    images: ["/images/ring-band.jpg"],
    inStock: true,
    details: [
      "Material: 100% Natural Hematite",
      "Width: 6mm",
      "Available sizes: 5–11 (US)",
    ],
    detailsKo: [
      "소재: 100% 천연 헤마타이트",
      "너비: 6mm",
      "가용 사이즈: 5–11 (US)",
    ],
  },
  {
    id: "hematite-anklet",
    name: "Hematite Anklet",
    nameKo: "헤마타이트 발찌",
    description:
      "A delicate hematite bead anklet with an adjustable chain for a perfect summer accessory.",
    descriptionKo: "완벽한 여름 액세서리를 위한 조절 가능한 체인의 섬세한 헤마타이트 비즈 발찌.",
    price: 25000,
    category: "anklet",
    categoryKo: "발찌",
    image: "/images/anklet.jpg",
    images: ["/images/anklet.jpg"],
    inStock: true,
    details: [
      "Material: Hematite Beads + Sterling Silver Chain",
      "Length: 23–27cm (adjustable)",
      "Lobster clasp closure",
    ],
    detailsKo: [
      "소재: 헤마타이트 비즈 + 스털링 실버 체인",
      "길이: 23–27cm (조절 가능)",
      "랍스터 클래스프 잠금",
    ],
  },
  {
    id: "hematite-set-classic",
    name: "Classic Hematite Gift Set",
    nameKo: "클래식 헤마타이트 선물 세트",
    description:
      "The perfect gift set: one classic bracelet + one pair of stud earrings, beautifully packaged.",
    descriptionKo: "클래식 팔찌 1개 + 스터드 귀걸이 1쌍, 아름답게 포장된 완벽한 선물 세트.",
    price: 45000,
    category: "set",
    categoryKo: "세트",
    image: "/images/set-classic.jpg",
    images: ["/images/set-classic.jpg"],
    inStock: true,
    badge: "Gift",
    badgeKo: "선물",
    details: [
      "Includes: 1 × Classic Bracelet (8mm) + 1 × Stud Earrings (8mm)",
      "Comes in a premium gift box",
      "Gift wrapping available",
    ],
    detailsKo: [
      "포함: 클래식 팔찌 (8mm) 1개 + 스터드 귀걸이 (8mm) 1쌍",
      "프리미엄 선물 박스 포함",
      "선물 포장 가능",
    ],
  },
  {
    id: "hematite-set-premium",
    name: "Premium Hematite Set",
    nameKo: "프리미엄 헤마타이트 세트",
    description:
      "A luxurious matching set: pendant necklace + drop earrings + band ring, presented in a velvet box.",
    descriptionKo: "벨벳 박스에 담긴 펜던트 목걸이 + 드롭 귀걸이 + 밴드 반지의 럭셔리 매칭 세트.",
    price: 118000,
    category: "set",
    categoryKo: "세트",
    image: "/images/set-premium.jpg",
    images: ["/images/set-premium.jpg"],
    inStock: true,
    badge: "Premium",
    badgeKo: "프리미엄",
    details: [
      "Includes: Pendant Necklace + Drop Earrings + Band Ring",
      "Premium velvet gift box",
      "Certificate of authenticity included",
    ],
    detailsKo: [
      "포함: 펜던트 목걸이 + 드롭 귀걸이 + 밴드 반지",
      "프리미엄 벨벳 선물 박스",
      "진품 인증서 포함",
    ],
  },
];

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function getProductsByCategory(category: string): Product[] {
  if (category === "all") return products;
  return products.filter((p) => p.category === category);
}

export function formatPrice(price: number): string {
  return price.toLocaleString("ko-KR") + "원";
}
