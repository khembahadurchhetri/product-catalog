import "../../scripts/load-env";
import { hash } from "bcryptjs";
import { db } from "./index";
import { cartItems, products, users } from "./schema";

const seedProducts = [
  {
    slug: "wireless-noise-canceling-headphones",
    name: "Wireless Noise-Canceling Headphones",
    category: "Electronics",
    price: 249.99,
    rating: 4.8,
    shortDescription: "Premium over-ear headphones with 30-hour battery life.",
    longDescription:
      "Experience studio-quality sound with adaptive noise cancellation, plush memory-foam ear cushions, and multipoint Bluetooth connectivity. Foldable design includes a hard-shell travel case.",
    imageUrl:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
    stock: 42,
  },
  {
    slug: "smartwatch-fitness-tracker",
    name: "Smartwatch Fitness Tracker",
    category: "Electronics",
    price: 179.5,
    rating: 4.5,
    shortDescription: "Track workouts, sleep, and heart rate on your wrist.",
    longDescription:
      "Water-resistant smartwatch with GPS, 100+ sport modes, SpO2 monitoring, and 7-day battery. Syncs with iOS and Android for notifications and guided breathing sessions.",
    imageUrl:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80",
    stock: 65,
  },
  {
    slug: "mechanical-keyboard-rgb",
    name: "Mechanical Keyboard RGB",
    category: "Electronics",
    price: 129.0,
    rating: 4.6,
    shortDescription: "Hot-swappable switches with per-key RGB lighting.",
    longDescription:
      "Compact 75% layout mechanical keyboard featuring tactile switches, aluminum frame, USB-C connection, and customizable macros via desktop software.",
    imageUrl:
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&q=80",
    stock: 28,
  },
  {
    slug: "organic-cotton-tee",
    name: "Organic Cotton Tee",
    category: "Clothing",
    price: 32.0,
    rating: 4.3,
    shortDescription: "Soft everyday tee made from 100% organic cotton.",
    longDescription:
      "Relaxed-fit crew neck shirt with reinforced stitching, pre-shrunk fabric, and eco-friendly dyes. Available in multiple colors for layering or solo wear.",
    imageUrl:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80",
    stock: 120,
  },
  {
    slug: "slim-denim-jacket",
    name: "Slim Denim Jacket",
    category: "Clothing",
    price: 89.99,
    rating: 4.4,
    shortDescription: "Classic medium-wash denim with modern slim cut.",
    longDescription:
      "Timeless denim jacket crafted from stretch cotton blend for comfort. Features button closure, chest pockets, and subtle fading for a lived-in look.",
    imageUrl:
      "https://images.unsplash.com/photo-1551028711-00167b16eac5?w=800&q=80",
    stock: 35,
  },
  {
    slug: "running-shoes-lightweight",
    name: "Lightweight Running Shoes",
    category: "Clothing",
    price: 119.0,
    rating: 4.7,
    shortDescription: "Breathable mesh upper with responsive foam midsole.",
    longDescription:
      "Engineered for daily training with heel-to-toe rocker geometry, durable rubber outsole, and reflective accents for low-light visibility.",
    imageUrl:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80",
    stock: 54,
  },
  {
    slug: "ceramic-pour-over-set",
    name: "Ceramic Pour-Over Set",
    category: "Home",
    price: 45.5,
    rating: 4.6,
    shortDescription: "Brew café-quality coffee at home with ease.",
    longDescription:
      "Includes handcrafted ceramic dripper, glass carafe, and 100 paper filters. Designed for even extraction and easy cleaning.",
    imageUrl:
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80",
    stock: 40,
  },
  {
    slug: "minimalist-desk-lamp",
    name: "Minimalist Desk Lamp",
    category: "Home",
    price: 59.99,
    rating: 4.2,
    shortDescription: "Adjustable LED lamp with warm and cool light modes.",
    longDescription:
      "Sleek aluminum lamp with touch dimming, USB charging port, and flexible gooseneck. Perfect for home office or bedside reading.",
    imageUrl:
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&q=80",
    stock: 22,
  },
  {
    slug: "memory-foam-pillow",
    name: "Memory Foam Pillow",
    category: "Home",
    price: 49.0,
    rating: 4.5,
    shortDescription: "Cooling gel-infused pillow for neck support.",
    longDescription:
      "Contoured memory foam adapts to your sleeping position while ventilated cover wicks moisture. Hypoallergenic and machine-washable cover included.",
    imageUrl:
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80",
    stock: 78,
  },
  {
    slug: "yoga-mat-pro-grip",
    name: "Yoga Mat Pro Grip",
    category: "Sports",
    price: 68.0,
    rating: 4.8,
    shortDescription: "Extra-thick mat with non-slip texture on both sides.",
    longDescription:
      "Eco-friendly TPE material provides cushioning for joints and stability during flows. Includes carrying strap and alignment markers.",
    imageUrl:
      "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800&q=80",
    stock: 50,
  },
  {
    slug: "insulated-water-bottle",
    name: "Insulated Water Bottle",
    category: "Sports",
    price: 34.99,
    rating: 4.4,
    shortDescription: "Keeps drinks cold 24h or hot 12h in a sleek bottle.",
    longDescription:
      "Double-wall stainless steel bottle with leak-proof lid and wide mouth for ice. BPA-free and fits standard cup holders.",
    imageUrl:
      "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&q=80",
    stock: 90,
  },
  {
    slug: "resistance-bands-set",
    name: "Resistance Bands Set",
    category: "Sports",
    price: 29.5,
    rating: 4.1,
    shortDescription: "Five-band set for strength training anywhere.",
    longDescription:
      "Includes light to heavy resistance loops, door anchor, handles, and ankle straps. Compact pouch for travel-friendly workouts.",
    imageUrl:
      "https://images.unsplash.com/photo-1598289431512-97c9b4cffaa9?w=800&q=80",
    stock: 110,
  },
  {
    slug: "design-systems-book",
    name: "Design Systems Handbook",
    category: "Books",
    price: 42.0,
    rating: 4.9,
    shortDescription: "Practical guide to building scalable UI libraries.",
    longDescription:
      "Authoritative reference covering tokens, components, documentation, and governance. Packed with case studies from leading product teams.",
    imageUrl:
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&q=80",
    stock: 30,
  },
  {
    slug: "javascript-patterns-guide",
    name: "JavaScript Patterns Guide",
    category: "Books",
    price: 38.5,
    rating: 4.6,
    shortDescription: "Modern patterns for maintainable JavaScript apps.",
    longDescription:
      "Deep dive into modules, async flows, testing strategies, and performance tuning. Ideal for intermediate developers leveling up.",
    imageUrl:
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&q=80",
    stock: 45,
  },
  {
    slug: "product-thinking-playbook",
    name: "Product Thinking Playbook",
    category: "Books",
    price: 36.0,
    rating: 4.5,
    shortDescription: "Frameworks for discovery, delivery, and iteration.",
    longDescription:
      "Step-by-step exercises for user interviews, roadmap prioritization, and measuring outcomes. Written for PMs and founders alike.",
    imageUrl:
      "https://images.unsplash.com/photo-1456513080920-9a0d1dc7550b?w=800&q=80",
    stock: 25,
  },
  {
    slug: "4k-portable-monitor",
    name: "4K Portable Monitor",
    category: "Electronics",
    price: 299.0,
    rating: 4.7,
    shortDescription: "15.6-inch 4K display for laptops on the go.",
    longDescription:
      "Ultra-slim IPS panel with HDR support, USB-C power delivery, and built-in kickstand. Ideal for designers and remote workers.",
    imageUrl:
      "https://images.unsplash.com/photo-1527443224754-9a9b86adbe41?w=800&q=80",
    stock: 18,
  },
  {
    slug: "linen-throw-blanket",
    name: "Linen Throw Blanket",
    category: "Home",
    price: 79.0,
    rating: 4.3,
    shortDescription: "Breathable linen blend for year-round comfort.",
    longDescription:
      "Stone-washed linen-cotton throw adds texture to sofas and beds. Gets softer with every wash and comes in earthy neutral tones.",
    imageUrl:
      "https://images.unsplash.com/photo-1631889993959-41b4e9c4e3c5?w=800&q=80",
    stock: 33,
  },
  {
    slug: "trail-running-backpack",
    name: "Trail Running Backpack",
    category: "Sports",
    price: 94.99,
    rating: 4.6,
    shortDescription: "12L hydration pack with chest and waist straps.",
    longDescription:
      "Lightweight pack includes 2L bladder, trekking pole loops, and reflective details. Ventilated back panel reduces sweat buildup.",
    imageUrl:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80",
    stock: 27,
  },
];

async function seed() {
  console.log("Seeding database...");

  await db.delete(cartItems);
  await db.delete(products);
  await db.insert(products).values(seedProducts);
  console.log(`Inserted ${seedProducts.length} products`);

  const demoEmail = "demo@shop.dev";
  const passwordHash = await hash("password123", 12);
  await db
    .insert(users)
    .values({
      email: demoEmail,
      name: "Demo Shopper",
      passwordHash,
    })
    .onConflictDoNothing({ target: users.email });

  console.log("Demo user: demo@shop.dev / password123");
  console.log("Seed complete.");
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
