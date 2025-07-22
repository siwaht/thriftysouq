import { db } from "./db";
import { products } from "@shared/schema";

const sampleProducts = [
  {
    name: "Rolex Submariner Watch",
    brand: "Rolex",
    category: "watches",
    originalPrice: "8950.00",
    discountedPrice: "2685.00",
    discount: 70,
    image: "https://images.unsplash.com/photo-1523170335258-f5c0e6f3cafa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
    stock: 3
  },
  {
    name: "Ray-Ban Aviator Classic",
    brand: "Ray-Ban",
    category: "sunglasses",
    originalPrice: "195.00",
    discountedPrice: "97.00",
    discount: 50,
    image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
    stock: 12
  },
  {
    name: "Tiffany & Co. Diamond Necklace",
    brand: "Tiffany & Co.",
    category: "jewelry",
    originalPrice: "2850.00",
    discountedPrice: "1425.00",
    discount: 50,
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
    stock: 5
  },
  {
    name: "Louis Vuitton Neverfull MM",
    brand: "Louis Vuitton",
    category: "bags",
    originalPrice: "1690.00",
    discountedPrice: "845.00",
    discount: 50,
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
    stock: 7
  },
  {
    name: "Gucci Leather Wallet",
    brand: "Gucci",
    category: "wallets",
    originalPrice: "420.00",
    discountedPrice: "168.00",
    discount: 60,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
    stock: 15
  },
  {
    name: "Omega Seamaster Watch",
    brand: "Omega",
    category: "watches",
    originalPrice: "4200.00",
    discountedPrice: "2520.00",
    discount: 40,
    image: "https://images.unsplash.com/photo-1594534475808-b18fc33b045e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
    stock: 4
  },
  {
    name: "Prada Sunglasses",
    brand: "Prada",
    category: "sunglasses",
    originalPrice: "385.00",
    discountedPrice: "154.00",
    discount: 60,
    image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
    stock: 8
  },
  {
    name: "Cartier Love Bracelet",
    brand: "Cartier",
    category: "jewelry",
    originalPrice: "6300.00",
    discountedPrice: "3150.00",
    discount: 50,
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
    stock: 2
  },
  {
    name: "Hermès Birkin Bag",
    brand: "Hermès",
    category: "bags",
    originalPrice: "12000.00",
    discountedPrice: "3600.00",
    discount: 70,
    image: "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
    stock: 1
  },
  {
    name: "Mont Blanc Wallet",
    brand: "Mont Blanc",
    category: "wallets",
    originalPrice: "295.00",
    discountedPrice: "147.00",
    discount: 50,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
    stock: 10
  },
  {
    name: "Tag Heuer Formula 1",
    brand: "Tag Heuer",
    category: "watches",
    originalPrice: "1200.00",
    discountedPrice: "600.00",
    discount: 50,
    image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
    stock: 6
  },
  {
    name: "Oakley Radar Sunglasses",
    brand: "Oakley",
    category: "sunglasses",
    originalPrice: "185.00",
    discountedPrice: "92.00",
    discount: 50,
    image: "https://images.unsplash.com/photo-1508296695146-257a814070b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
    stock: 20
  },
  {
    name: "Bulgari Serpenti Ring",
    brand: "Bulgari",
    category: "jewelry",
    originalPrice: "1850.00",
    discountedPrice: "925.00",
    discount: 50,
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
    stock: 3
  },
  {
    name: "Chanel Quilted Bag",
    brand: "Chanel",
    category: "bags",
    originalPrice: "5400.00",
    discountedPrice: "2160.00",
    discount: 60,
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
    stock: 2
  },
  {
    name: "Breitling Chronomat",
    brand: "Breitling",
    category: "watches",
    originalPrice: "4850.00",
    discountedPrice: "2425.00",
    discount: 50,
    image: "https://images.unsplash.com/photo-1547996160-81dfa63595aa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
    stock: 4
  },
  {
    name: "Versace Medusa Sunglasses",
    brand: "Versace",
    category: "sunglasses",
    originalPrice: "295.00",
    discountedPrice: "147.00",
    discount: 50,
    image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
    stock: 12
  },
  {
    name: "Chopard Happy Diamonds Ring",
    brand: "Chopard",
    category: "jewelry",
    originalPrice: "3200.00",
    discountedPrice: "1280.00",
    discount: 60,
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
    stock: 3
  },
  {
    name: "Fendi Baguette Bag",
    brand: "Fendi",
    category: "bags",
    originalPrice: "2890.00",
    discountedPrice: "1156.00",
    discount: 60,
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
    stock: 5
  },
  {
    name: "Bottega Veneta Intrecciato Wallet",
    brand: "Bottega Veneta",
    category: "wallets",
    originalPrice: "650.00",
    discountedPrice: "260.00",
    discount: 60,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
    stock: 8
  },
  {
    name: "Patek Philippe Calatrava",
    brand: "Patek Philippe",
    category: "watches",
    originalPrice: "28500.00",
    discountedPrice: "8550.00",
    discount: 70,
    image: "https://images.unsplash.com/photo-1523170335258-f5c0e6f3cafa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
    stock: 1
  },
  {
    name: "Tom Ford Aviator Sunglasses",
    brand: "Tom Ford",
    category: "sunglasses",
    originalPrice: "425.00",
    discountedPrice: "170.00",
    discount: 60,
    image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
    stock: 15
  },
  {
    name: "Van Cleef & Arpels Alhambra Necklace",
    brand: "Van Cleef & Arpels",
    category: "jewelry",
    originalPrice: "4950.00",
    discountedPrice: "1485.00",
    discount: 70,
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
    stock: 2
  },
  {
    name: "Balenciaga City Bag",
    brand: "Balenciaga",
    category: "bags",
    originalPrice: "1890.00",
    discountedPrice: "945.00",
    discount: 50,
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
    stock: 6
  },
  {
    name: "Saint Laurent Card Holder",
    brand: "Saint Laurent",
    category: "wallets",
    originalPrice: "325.00",
    discountedPrice: "162.00",
    discount: 50,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
    stock: 20
  },
  {
    name: "Audemars Piguet Royal Oak",
    brand: "Audemars Piguet",
    category: "watches",
    originalPrice: "35000.00",
    discountedPrice: "14000.00",
    discount: 60,
    image: "https://images.unsplash.com/photo-1594534475808-b18fc33b045e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
    stock: 1
  },
  {
    name: "Dior So Real Sunglasses",
    brand: "Dior",
    category: "sunglasses",
    originalPrice: "395.00",
    discountedPrice: "158.00",
    discount: 60,
    image: "https://images.unsplash.com/photo-1508296695146-257a814070b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
    stock: 10
  },
  {
    name: "Harry Winston Diamond Earrings",
    brand: "Harry Winston",
    category: "jewelry",
    originalPrice: "8500.00",
    discountedPrice: "3400.00",
    discount: 60,
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
    stock: 2
  },
  {
    name: "Goyard Saint Louis Tote",
    brand: "Goyard",
    category: "bags",
    originalPrice: "1720.00",
    discountedPrice: "516.00",
    discount: 70,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
    stock: 4
  },
  {
    name: "Berluti Scritto Wallet",
    brand: "Berluti",
    category: "wallets",
    originalPrice: "495.00",
    discountedPrice: "148.00",
    discount: 70,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
    stock: 12
  },
  {
    name: "IWC Portugieser",
    brand: "IWC",
    category: "watches",
    originalPrice: "6200.00",
    discountedPrice: "2480.00",
    discount: 60,
    image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
    stock: 3
  }
];

async function seedDatabase() {
  try {
    console.log("Seeding database with sample products...");
    
    // Check if products already exist
    const existingProducts = await db.select().from(products);
    if (existingProducts.length > 0) {
      console.log("Database already seeded with", existingProducts.length, "products");
      return;
    }
    
    // Insert all sample products
    await db.insert(products).values(sampleProducts);
    
    console.log("Successfully seeded database with", sampleProducts.length, "products");
  } catch (error) {
    console.error("Error seeding database:", error);
    throw error;
  }
}

// Run seeding if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase()
    .then(() => {
      console.log("Seed completed successfully");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Seed failed:", error);
      process.exit(1);
    });
}

export { seedDatabase as seedProducts };