import { db } from "./db";
import { products } from "@shared/schema";

/**
 * Enhanced product catalog for ThriftySouq - Luxury Quick Commerce
 * Categories: watches, jewelry, bags, sunglasses, shoes, fashion, beauty, accessories
 */
const enhancedProducts = [
  // WATCHES (15 items)
  {
    name: "Rolex Submariner Date",
    brand: "Rolex",
    category: "watches",
    originalPrice: "8950.00",
    discountedPrice: "2685.00",
    discount: 70,
    image: "https://images.unsplash.com/photo-1523170335258-f5c0e6f3cafa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
    stock: 3
  },
  {
    name: "Omega Seamaster Professional",
    brand: "Omega",
    category: "watches",
    originalPrice: "4200.00",
    discountedPrice: "2520.00",
    discount: 40,
    image: "https://images.unsplash.com/photo-1594534475808-b18fc33b045e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
    stock: 5
  },
  {
    name: "Tag Heuer Formula 1",
    brand: "Tag Heuer",
    category: "watches",
    originalPrice: "1200.00",
    discountedPrice: "600.00",
    discount: 50,
    image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
    stock: 8
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
    name: "IWC Portugieser Chronograph",
    brand: "IWC",
    category: "watches",
    originalPrice: "6200.00",
    discountedPrice: "2480.00",
    discount: 60,
    image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
    stock: 3
  },
  {
    name: "Cartier Santos de Cartier",
    brand: "Cartier",
    category: "watches",
    originalPrice: "6850.00",
    discountedPrice: "3425.00",
    discount: 50,
    image: "https://images.unsplash.com/photo-1523170335258-f5c0e6f3cafa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
    stock: 2
  },
  {
    name: "Panerai Luminor Marina",
    brand: "Panerai",
    category: "watches",
    originalPrice: "5200.00",
    discountedPrice: "2080.00",
    discount: 60,
    image: "https://images.unsplash.com/photo-1547996160-81dfa63595aa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
    stock: 4
  },
  {
    name: "Jaeger-LeCoultre Reverso",
    brand: "Jaeger-LeCoultre",
    category: "watches",
    originalPrice: "7500.00",
    discountedPrice: "3750.00",
    discount: 50,
    image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
    stock: 2
  },
  {
    name: "Tudor Black Bay",
    brand: "Tudor",
    category: "watches",
    originalPrice: "3200.00",
    discountedPrice: "1920.00",
    discount: 40,
    image: "https://images.unsplash.com/photo-1594534475808-b18fc33b045e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
    stock: 6
  },
  {
    name: "Hublot Big Bang",
    brand: "Hublot",
    category: "watches",
    originalPrice: "12000.00",
    discountedPrice: "4800.00",
    discount: 60,
    image: "https://images.unsplash.com/photo-1523170335258-f5c0e6f3cafa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
    stock: 2
  },
  {
    name: "Zenith El Primero",
    brand: "Zenith",
    category: "watches",
    originalPrice: "6800.00",
    discountedPrice: "3400.00",
    discount: 50,
    image: "https://images.unsplash.com/photo-1547996160-81dfa63595aa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
    stock: 3
  },
  {
    name: "Vacheron Constantin Overseas",
    brand: "Vacheron Constantin",
    category: "watches",
    originalPrice: "24000.00",
    discountedPrice: "9600.00",
    discount: 60,
    image: "https://images.unsplash.com/photo-1594534475808-b18fc33b045e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
    stock: 1
  },
  {
    name: "Grand Seiko Spring Drive",
    brand: "Grand Seiko",
    category: "watches",
    originalPrice: "5500.00",
    discountedPrice: "3300.00",
    discount: 40,
    image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
    stock: 5
  },

  // JEWELRY (12 items)
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
    name: "Cartier Love Bracelet",
    brand: "Cartier",
    category: "jewelry",
    originalPrice: "6300.00",
    discountedPrice: "3150.00",
    discount: 50,
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
    stock: 3
  },
  {
    name: "Bulgari Serpenti Ring",
    brand: "Bulgari",
    category: "jewelry",
    originalPrice: "1850.00",
    discountedPrice: "925.00",
    discount: 50,
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
    stock: 4
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
    name: "Graff Diamond Solitaire Ring",
    brand: "Graff",
    category: "jewelry",
    originalPrice: "15000.00",
    discountedPrice: "6000.00",
    discount: 60,
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
    stock: 1
  },
  {
    name: "David Yurman Cable Bracelet",
    brand: "David Yurman",
    category: "jewelry",
    originalPrice: "850.00",
    discountedPrice: "425.00",
    discount: 50,
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
    stock: 8
  },
  {
    name: "Mikimoto Pearl Necklace",
    brand: "Mikimoto",
    category: "jewelry",
    originalPrice: "3500.00",
    discountedPrice: "1750.00",
    discount: 50,
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
    stock: 4
  },
  {
    name: "Buccellati Gold Cuff",
    brand: "Buccellati",
    category: "jewelry",
    originalPrice: "4200.00",
    discountedPrice: "2100.00",
    discount: 50,
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
    stock: 2
  },
  {
    name: "Pomellato Nudo Ring",
    brand: "Pomellato",
    category: "jewelry",
    originalPrice: "2400.00",
    discountedPrice: "960.00",
    discount: 60,
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
    stock: 5
  },
  {
    name: "Piaget Possession Bracelet",
    brand: "Piaget",
    category: "jewelry",
    originalPrice: "3800.00",
    discountedPrice: "1520.00",
    discount: 60,
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
    stock: 3
  },

  // BAGS (12 items)
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
    name: "Hermès Birkin 30",
    brand: "Hermès",
    category: "bags",
    originalPrice: "12000.00",
    discountedPrice: "3600.00",
    discount: 70,
    image: "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
    stock: 1
  },
  {
    name: "Chanel Classic Flap Bag",
    brand: "Chanel",
    category: "bags",
    originalPrice: "5400.00",
    discountedPrice: "2160.00",
    discount: 60,
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
    stock: 2
  },
  {
    name: "Fendi Baguette",
    brand: "Fendi",
    category: "bags",
    originalPrice: "2890.00",
    discountedPrice: "1156.00",
    discount: 60,
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
    stock: 5
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
    name: "Goyard Saint Louis Tote",
    brand: "Goyard",
    category: "bags",
    originalPrice: "1720.00",
    discountedPrice: "516.00",
    discount: 70,
    image: "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
    stock: 4
  },
  {
    name: "Prada Galleria Bag",
    brand: "Prada",
    category: "bags",
    originalPrice: "2450.00",
    discountedPrice: "1225.00",
    discount: 50,
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
    stock: 5
  },
  {
    name: "Gucci Dionysus Bag",
    brand: "Gucci",
    category: "bags",
    originalPrice: "2200.00",
    discountedPrice: "880.00",
    discount: 60,
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
    stock: 6
  },
  {
    name: "Bottega Veneta Jodie",
    brand: "Bottega Veneta",
    category: "bags",
    originalPrice: "2650.00",
    discountedPrice: "1060.00",
    discount: 60,
    image: "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
    stock: 4
  },
  {
    name: "Celine Luggage Tote",
    brand: "Celine",
    category: "bags",
    originalPrice: "2950.00",
    discountedPrice: "1475.00",
    discount: 50,
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
    stock: 3
  },
  {
    name: "Loewe Puzzle Bag",
    brand: "Loewe",
    category: "bags",
    originalPrice: "2350.00",
    discountedPrice: "940.00",
    discount: 60,
    image: "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
    stock: 5
  },
  {
    name: "Valentino Rockstud Clutch",
    brand: "Valentino",
    category: "bags",
    originalPrice: "1450.00",
    discountedPrice: "725.00",
    discount: 50,
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
    stock: 8
  },

  // SUNGLASSES (8 items)
  {
    name: "Ray-Ban Aviator Classic",
    brand: "Ray-Ban",
    category: "sunglasses",
    originalPrice: "195.00",
    discountedPrice: "97.00",
    discount: 50,
    image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
    stock: 15
  },
  {
    name: "Prada Minimal Baroque",
    brand: "Prada",
    category: "sunglasses",
    originalPrice: "385.00",
    discountedPrice: "154.00",
    discount: 60,
    image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
    stock: 10
  },
  {
    name: "Oakley Radar EV Path",
    brand: "Oakley",
    category: "sunglasses",
    originalPrice: "185.00",
    discountedPrice: "92.00",
    discount: 50,
    image: "https://images.unsplash.com/photo-1508296695146-257a814070b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
    stock: 20
  },
  {
    name: "Versace Medusa Biggie",
    brand: "Versace",
    category: "sunglasses",
    originalPrice: "295.00",
    discountedPrice: "147.00",
    discount: 50,
    image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
    stock: 12
  },
  {
    name: "Tom Ford Henry",
    brand: "Tom Ford",
    category: "sunglasses",
    originalPrice: "425.00",
    discountedPrice: "170.00",
    discount: 60,
    image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
    stock: 15
  },
  {
    name: "Dior So Real",
    brand: "Dior",
    category: "sunglasses",
    originalPrice: "395.00",
    discountedPrice: "158.00",
    discount: 60,
    image: "https://images.unsplash.com/photo-1508296695146-257a814070b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
    stock: 10
  },
  {
    name: "Saint Laurent SL 28",
    brand: "Saint Laurent",
    category: "sunglasses",
    originalPrice: "350.00",
    discountedPrice: "175.00",
    discount: 50,
    image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
    stock: 14
  },
  {
    name: "Persol Steve McQueen",
    brand: "Persol",
    category: "sunglasses",
    originalPrice: "295.00",
    discountedPrice: "118.00",
    discount: 60,
    image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
    stock: 11
  },

  // SHOES (8 items)
  {
    name: "Christian Louboutin Pigalle Pumps",
    brand: "Christian Louboutin",
    category: "shoes",
    originalPrice: "795.00",
    discountedPrice: "398.00",
    discount: 50,
    image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
    stock: 10
  },
  {
    name: "Manolo Blahnik BB Pumps",
    brand: "Manolo Blahnik",
    category: "shoes",
    originalPrice: "725.00",
    discountedPrice: "362.00",
    discount: 50,
    image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
    stock: 8
  },
  {
    name: "Jimmy Choo Romy 100",
    brand: "Jimmy Choo",
    category: "shoes",
    originalPrice: "650.00",
    discountedPrice: "260.00",
    discount: 60,
    image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
    stock: 12
  },
  {
    name: "Gucci Princetown Loafers",
    brand: "Gucci",
    category: "shoes",
    originalPrice: "730.00",
    discountedPrice: "365.00",
    discount: 50,
    image: "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
    stock: 15
  },
  {
    name: "Balenciaga Triple S Sneakers",
    brand: "Balenciaga",
    category: "shoes",
    originalPrice: "975.00",
    discountedPrice: "487.00",
    discount: 50,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
    stock: 10
  },
  {
    name: "Saint Laurent Chelsea Boots",
    brand: "Saint Laurent",
    category: "shoes",
    originalPrice: "895.00",
    discountedPrice: "358.00",
    discount: 60,
    image: "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
    stock: 8
  },
  {
    name: "Valentino Rockstud Heels",
    brand: "Valentino",
    category: "shoes",
    originalPrice: "975.00",
    discountedPrice: "390.00",
    discount: 60,
    image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
    stock: 9
  },
  {
    name: "Common Projects Achilles Low",
    brand: "Common Projects",
    category: "shoes",
    originalPrice: "425.00",
    discountedPrice: "212.00",
    discount: 50,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
    stock: 18
  },

  // BEAUTY (6 items)
  {
    name: "Chanel No. 5 Eau de Parfum",
    brand: "Chanel",
    category: "beauty",
    originalPrice: "135.00",
    discountedPrice: "67.00",
    discount: 50,
    image: "https://images.unsplash.com/photo-1541643600914-78b084683601?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
    stock: 25
  },
  {
    name: "Dior Sauvage Parfum",
    brand: "Dior",
    category: "beauty",
    originalPrice: "145.00",
    discountedPrice: "72.00",
    discount: 50,
    image: "https://images.unsplash.com/photo-1541643600914-78b084683601?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
    stock: 30
  },
  {
    name: "Tom Ford Black Orchid",
    brand: "Tom Ford",
    category: "beauty",
    originalPrice: "160.00",
    discountedPrice: "96.00",
    discount: 40,
    image: "https://images.unsplash.com/photo-1541643600914-78b084683601?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
    stock: 20
  },
  {
    name: "La Mer Crème de la Mer",
    brand: "La Mer",
    category: "beauty",
    originalPrice: "345.00",
    discountedPrice: "172.00",
    discount: 50,
    image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
    stock: 15
  },
  {
    name: "SK-II Facial Treatment Essence",
    brand: "SK-II",
    category: "beauty",
    originalPrice: "185.00",
    discountedPrice: "111.00",
    discount: 40,
    image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
    stock: 22
  },
  {
    name: "Sisley Black Rose Cream",
    brand: "Sisley",
    category: "beauty",
    originalPrice: "295.00",
    discountedPrice: "147.00",
    discount: 50,
    image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
    stock: 12
  },

  // ACCESSORIES (8 items)
  {
    name: "Hermès Silk Scarf",
    brand: "Hermès",
    category: "accessories",
    originalPrice: "425.00",
    discountedPrice: "212.00",
    discount: 50,
    image: "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
    stock: 20
  },
  {
    name: "Gucci Leather Belt",
    brand: "Gucci",
    category: "accessories",
    originalPrice: "420.00",
    discountedPrice: "168.00",
    discount: 60,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
    stock: 25
  },
  {
    name: "Mont Blanc Meisterstück Wallet",
    brand: "Mont Blanc",
    category: "accessories",
    originalPrice: "295.00",
    discountedPrice: "147.00",
    discount: 50,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
    stock: 18
  },
  {
    name: "Bottega Veneta Intrecciato Wallet",
    brand: "Bottega Veneta",
    category: "accessories",
    originalPrice: "650.00",
    discountedPrice: "260.00",
    discount: 60,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
    stock: 12
  },
  {
    name: "Berluti Scritto Card Holder",
    brand: "Berluti",
    category: "accessories",
    originalPrice: "495.00",
    discountedPrice: "148.00",
    discount: 70,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
    stock: 15
  },
  {
    name: "Saint Laurent Card Holder",
    brand: "Saint Laurent",
    category: "accessories",
    originalPrice: "325.00",
    discountedPrice: "162.00",
    discount: 50,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
    stock: 22
  },
  {
    name: "Salvatore Ferragamo Tie",
    brand: "Salvatore Ferragamo",
    category: "accessories",
    originalPrice: "190.00",
    discountedPrice: "95.00",
    discount: 50,
    image: "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
    stock: 30
  },
  {
    name: "Burberry Cashmere Scarf",
    brand: "Burberry",
    category: "accessories",
    originalPrice: "450.00",
    discountedPrice: "180.00",
    discount: 60,
    image: "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
    stock: 16
  },
];

async function seedEnhancedProducts() {
  try {
    console.log("Seeding database with enhanced luxury products...");

    // Check if products already exist
    const existingProducts = await db.select().from(products);
    if (existingProducts.length > 0) {
      console.log("Database already has", existingProducts.length, "products");
      console.log("Clearing existing products and reseeding...");
      await db.delete(products);
    }

    // Insert all enhanced products
    await db.insert(products).values(enhancedProducts);

    console.log("✅ Successfully seeded database with", enhancedProducts.length, "luxury products");
    console.log("Categories:", [...new Set(enhancedProducts.map(p => p.category))].join(", "));
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  }
}

// Run seeding if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedEnhancedProducts()
    .then(() => {
      console.log("Seed completed successfully");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Seed failed:", error);
      process.exit(1);
    });
}

export { seedEnhancedProducts };
