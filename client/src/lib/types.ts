export interface Product {
  id: number;
  name: string;
  brand: string;
  category: string;
  originalPrice: string;
  discountedPrice: string;
  discount: number;
  image: string;
  stock: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface OrderRequest {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  paymentMethod: "online" | "cod";
  items: {
    productId: number;
    quantity: number;
    price: string;
  }[];
}
