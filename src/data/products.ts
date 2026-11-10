import type { Product, Category } from "../types";

export const products: Product[] = [
  {
    id: 1,
    name: "Abstract Graphic Tee",
    category: "Tees",
    price: 375000,
    originalPrice: 450000,
    image: "/images/tshirt-graphic.png",
    badge: "SALE",
    description:
      "Oversized graphic t-shirt with abstract blue artwork. Premium 240gsm cotton, screen-printed artwork. True to the unconscious expression.",
    sizes: ["S", "M", "L", "XL"],
  },
  {
    id: 2,
    name: "Quilted Liner Vest",
    category: "Outerwear",
    price: 485000,
    image: "/images/vest-quilted.png",
    badge: "NEW",
    description:
      "Military-inspired quilted liner vest with diamond quilting pattern. Lightweight warmth, versatile layering piece.",
    sizes: ["M", "L", "XL"],
  },
  {
    id: 3,
    name: "Cable Knit Pullover",
    category: "Sweaters",
    price: 520000,
    image: "/images/pullover-sweater.png",
    description:
      "Oversized cable knit pullover in dark olive. Chunky texture, dropped shoulders. Perfect for the urban explorer.",
    sizes: ["S", "M", "L", "XL"],
  },
  {
    id: 4,
    name: 'Fleece Balaclava "Blue Camo"',
    category: "Accessories",
    price: 175000,
    image: "/images/fleece-balaclava.png",
    badge: "HOT",
    description:
      "Camouflage fleece balaclava with adjustable elastics. Cozy fit, statement piece for the bold.",
    sizes: ["ONE SIZE"],
  },
  {
    id: 5,
    name: "Quilted Crossbody Bag",
    category: "Bags",
    price: 345000,
    image: "/images/quilted-bag.png",
    description:
      "Quilted crossbody bag with multiple compartments. Water-resistant fabric, adjustable strap.",
    sizes: ["ONE SIZE"],
  },
  {
    id: 6,
    name: "Leaf Camo Crewneck",
    category: "Sweaters",
    price: 425000,
    originalPrice: 500000,
    image: "/images/camo-longsleeve.png",
    badge: "SALE",
    description:
      "All-over autumn leaf camouflage crewneck sweatshirt. Heavy 350gsm fleece, ribbed cuffs and hem.",
    sizes: ["S", "M", "L", "XL"],
  },
  {
    id: 7,
    name: "Essential Jogger Pants",
    category: "Bottoms",
    price: 385000,
    image: "/images/jogger-pants.png",
    description:
      "Relaxed fit jogger pants in navy. Elastic waistband with drawcord, side pockets, tapered leg with elastic cuffs.",
    sizes: ["S", "M", "L", "XL"],
  },
  {
    id: 8,
    name: "Oversized Pullover - Olive",
    category: "Sweaters",
    price: 520000,
    image: "/images/pullover-sweater.png",
    badge: "BEST",
    description:
      "Our best-selling oversized pullover. Cable knit construction, dark olive colorway. Cozy and stylish.",
    sizes: ["M", "L", "XL"],
  },
];

export const categories: Category[] = [
  {
    name: "Tees & Longsleeves",
    count: "12 Products",
    image: "/images/tshirt-graphic.png",
  },
  {
    name: "Sweaters & Outerwear",
    count: "8 Products",
    image: "/images/pullover-sweater.png",
  },
  {
    name: "Accessories",
    count: "6 Products",
    image: "/images/fleece-balaclava.png",
  },
];

export function formatPrice(price: number): string {
  return "Rp " + price.toLocaleString("id-ID");
}