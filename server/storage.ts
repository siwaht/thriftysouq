import { products, orders, orderItems, type Product, type Order, type OrderItem, type InsertProduct, type InsertOrder, type InsertOrderItem } from "@shared/schema";

export interface IStorage {
  getProducts(): Promise<Product[]>;
  getProductById(id: number): Promise<Product | undefined>;
  getProductsByCategory(category: string): Promise<Product[]>;
  createOrder(order: InsertOrder, items: Omit<InsertOrderItem, 'orderId'>[]): Promise<{ order: Order; orderNumber: string }>;
  updateProductStock(productId: number, newStock: number): Promise<void>;
}

export class MemStorage implements IStorage {
  private products: Map<number, Product>;
  private orders: Map<number, Order>;
  private orderItems: Map<number, OrderItem>;
  private currentProductId: number;
  private currentOrderId: number;
  private currentOrderItemId: number;

  constructor() {
    this.products = new Map();
    this.orders = new Map();
    this.orderItems = new Map();
    this.currentProductId = 1;
    this.currentOrderId = 1;
    this.currentOrderItemId = 1;

    // Initialize with sample products
    this.initializeProducts();
  }

  private initializeProducts() {
    const sampleProducts = [
      {
        id: this.currentProductId++,
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
        id: this.currentProductId++,
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
        id: this.currentProductId++,
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
        id: this.currentProductId++,
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
        id: this.currentProductId++,
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
        id: this.currentProductId++,
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
        id: this.currentProductId++,
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
        id: this.currentProductId++,
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
        id: this.currentProductId++,
        name: "Hermès Birkin Bag",
        brand: "Hermès",
        category: "bags",
        originalPrice: "12000.00",
        discountedPrice: "3600.00",
        discount: 70,
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
        stock: 1
      },
      {
        id: this.currentProductId++,
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
        id: this.currentProductId++,
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
        id: this.currentProductId++,
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
        id: this.currentProductId++,
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
        id: this.currentProductId++,
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
        id: this.currentProductId++,
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
        id: this.currentProductId++,
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
        id: this.currentProductId++,
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
        id: this.currentProductId++,
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
        id: this.currentProductId++,
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
        id: this.currentProductId++,
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
        id: this.currentProductId++,
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
        id: this.currentProductId++,
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
        id: this.currentProductId++,
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
        id: this.currentProductId++,
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
        id: this.currentProductId++,
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
        id: this.currentProductId++,
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
        id: this.currentProductId++,
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
        id: this.currentProductId++,
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
        id: this.currentProductId++,
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
        id: this.currentProductId++,
        name: "IWC Portugieser",
        brand: "IWC",
        category: "watches",
        originalPrice: "6200.00",
        discountedPrice: "2480.00",
        discount: 60,
        image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
        stock: 3
      },
      {
        id: this.currentProductId++,
        name: "Persol Steve McQueen Sunglasses",
        brand: "Persol",
        category: "sunglasses",
        originalPrice: "315.00",
        discountedPrice: "126.00",
        discount: 60,
        image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
        stock: 18
      },
      {
        id: this.currentProductId++,
        name: "Mikimoto Pearl Necklace",
        brand: "Mikimoto",
        category: "jewelry",
        originalPrice: "3850.00",
        discountedPrice: "1155.00",
        discount: 70,
        image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
        stock: 3
      },
      {
        id: this.currentProductId++,
        name: "Celine Luggage Tote",
        brand: "Celine",
        category: "bags",
        originalPrice: "3200.00",
        discountedPrice: "1280.00",
        discount: 60,
        image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
        stock: 3
      },
      {
        id: this.currentProductId++,
        name: "Hermès Constance Wallet",
        brand: "Hermès",
        category: "wallets",
        originalPrice: "2100.00",
        discountedPrice: "630.00",
        discount: 70,
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
        stock: 2
      }
    ];

    sampleProducts.forEach(product => {
      this.products.set(product.id, product);
    });
  }

  async getProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async getProductById(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    return Array.from(this.products.values()).filter(p => p.category === category);
  }

  async createOrder(order: InsertOrder, items: Omit<InsertOrderItem, 'orderId'>[]): Promise<{ order: Order; orderNumber: string }> {
    const orderNumber = `LD-${new Date().getFullYear()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
    const newOrder: Order = {
      id: this.currentOrderId++,
      orderNumber,
      status: "pending",
      ...order
    };

    this.orders.set(newOrder.id, newOrder);

    // Create order items
    items.forEach(item => {
      const orderItem: OrderItem = {
        id: this.currentOrderItemId++,
        orderId: newOrder.id,
        productId: item.productId,
        quantity: item.quantity,
        price: item.price
      };
      this.orderItems.set(orderItem.id, orderItem);
    });

    return { order: newOrder, orderNumber };
  }

  async updateProductStock(productId: number, newStock: number): Promise<void> {
    const product = this.products.get(productId);
    if (product) {
      product.stock = newStock;
      this.products.set(productId, product);
    }
  }
}

export const storage = new MemStorage();
