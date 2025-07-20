import { storage } from "./storage";
import type { Order, OrderItem, Product } from "@shared/schema";

export interface WebhookPayload {
  event: string;
  timestamp: string;
  data: {
    order: Order;
    items: (OrderItem & { product: Product })[];
    customer: {
      name: string;
      email: string;
      phone: string;
      shippingAddress: string;
    };
    totals: {
      subtotal: number;
      shipping: number;
      total: number;
    };
    metadata: {
      orderNumber: string;
      paymentMethod: string;
      status: string;
    };
  };
}

class WebhookService {
  async triggerWebhook(event: string, payload: any): Promise<void> {
    try {
      const webhooks = await storage.getActiveWebhooksForEvent(event);
      
      for (const webhook of webhooks) {
        await this.sendWebhook(webhook.url, payload, webhook.secret);
      }
    } catch (error) {
      console.error("Error triggering webhooks:", error);
    }
  }

  private async sendWebhook(url: string, payload: WebhookPayload, secret?: string | null): Promise<void> {
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'User-Agent': 'LuxDeal-Webhook/1.0'
      };

      // Add signature if secret is provided
      if (secret) {
        const crypto = await import('crypto');
        const signature = crypto
          .createHmac('sha256', secret)
          .update(JSON.stringify(payload))
          .digest('hex');
        headers['X-Webhook-Signature'] = `sha256=${signature}`;
      }

      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        console.error(`Webhook failed: ${url} - ${response.status} ${response.statusText}`);
      } else {
        console.log(`Webhook sent successfully: ${url}`);
      }
    } catch (error) {
      console.error(`Error sending webhook to ${url}:`, error);
    }
  }

  async triggerOrderCreated(order: Order, items: (OrderItem & { product: Product })[]): Promise<void> {
    const subtotal = items.reduce((sum, item) => sum + (parseFloat(item.price) * item.quantity), 0);
    const shipping = subtotal >= 1000 ? 0 : 25;
    const total = subtotal + shipping;

    const payload: WebhookPayload = {
      event: 'order.created',
      timestamp: new Date().toISOString(),
      data: {
        order,
        items,
        customer: {
          name: order.customerName,
          email: order.customerEmail,
          phone: order.customerPhone,
          shippingAddress: order.shippingAddress,
        },
        totals: {
          subtotal,
          shipping,
          total,
        },
        metadata: {
          orderNumber: order.orderNumber,
          paymentMethod: order.paymentMethod,
          status: order.status,
        },
      },
    };

    await this.triggerWebhook('order.created', payload);
  }

  async triggerOrderStatusChanged(order: Order, oldStatus: string, newStatus: string): Promise<void> {
    const payload = {
      event: 'order.status_changed',
      timestamp: new Date().toISOString(),
      data: {
        order,
        statusChange: {
          from: oldStatus,
          to: newStatus,
        },
        metadata: {
          orderNumber: order.orderNumber,
        },
      },
    };

    await this.triggerWebhook('order.status_changed', payload);
  }
}

export const webhookService = new WebhookService();