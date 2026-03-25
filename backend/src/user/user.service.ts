import { prisma } from '../lib/prisma.js';

export class UserService {

    private static formatStatus(status: string) {
    const statusMap: Record<string, string> = {
      PENDING: "currently being validated and will move to processing shortly",
      PROCESSING: "being carefully prepared by our team for dispatch",
      SHIPPED: "dispatched and is currently on its way to your destination",
      DELIVERED: "marked as successfully delivered. we hope you enjoy your purchase",
      CANCELLED: "voided. If this was a mistake, please contact our senior support team",
    };
    return statusMap[status] || status.toLowerCase();
  }

  static async getFullDashboard(userId: string) {
    return prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        address: true,
        // Fetch Orders + Items (Bills)
        orders: {
          include: { items: true },
          orderBy: { createdAt: 'desc' }
        },
        // Fetch Cart Items
        cart: {
          include: {
            items: { include: { product: true } }
          }
        }
      }
    });
  }

static async updateDetails(userId: string, data: any) {
  const { name, address } = data;
  
  return prisma.user.update({
    where: { id: userId },
    data: {
      name,
      address: {
        upsert: {
          create: {
            street: address.street || "",
            city: address.city || "",
            state: address.state || "", // FIX: Added state
            zip: address.zip || "",
            country: address.country || "India", // Ensure country is present if required
          },
          update: {
            street: address.street,
            city: address.city,
            state: address.state, // FIX: Added state
            zip: address.zip,
          },
        },
      },
    },
  });
}

 static async processBotMessage(userId: string, userName: string, message: string) {
    const lowerMsg = message.toLowerCase();
    const formatINR = (p: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(p);

    // 1. Intent: Search by specific Order ID (UUID)
    const uuidRegex = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i;
    const foundId = message.match(uuidRegex);

    if (foundId) {
      const specificOrder = await prisma.order.findUnique({
        where: { id: foundId[0], userId }
      });

      if (!specificOrder) {
        return `I've looked through our records, but I couldn't find an order matching that ID in your account. Please double-check the reference number.`;
      }

      return `I've located your order details for #${specificOrder.id.slice(0, 8)}. \n\nStatus: Your package is ${this.formatStatus(specificOrder.status)}. \nInvoice Total: ${formatINR(specificOrder.totalAmount)} \nPayment: Verified via ${specificOrder.paymentStatus.toUpperCase()}.`;
    }

    // 2. Intent: Order History / Bills
    if (lowerMsg.includes("history") || lowerMsg.includes("past") || lowerMsg.includes("bills") || lowerMsg.includes("orders")) {
      const orders = await prisma.order.findMany({
        where: { userId },
        take: 3,
        orderBy: { createdAt: 'desc' },
      });

      if (orders.length === 0) {
        return `It looks like you haven't placed any orders with us yet, ${userName}. Would you like me to show you our trending collections?`;
      }

      const historyList = orders.map(o => `• #${o.id.slice(0, 5)}... | ${formatINR(o.totalAmount)} | ${o.status}`).join('\n');
      return `Certainly, ${userName}. Here are your three most recent transactions: \n\n${historyList} \n\nFor a full list of receipts and downloadable bills, please visit your Account Dashboard.`;
    }

    // 3. Intent: Recent Order Status (Most common query)
    if (lowerMsg.includes("order") || lowerMsg.includes("status") || lowerMsg.includes("track")) {
      const order = await prisma.order.findFirst({
        where: { userId },
        orderBy: { createdAt: 'desc' },
      });

      if (!order) {
        return `I couldn't find any active or past orders associated with your profile, ${userName}.`;
      }

      return `Certainly! Your most recent order is #${order.id.slice(0, 8)}. \n\nIt is ${this.formatStatus(order.status)}. The total transaction amount was ${formatINR(order.totalAmount)}, and the payment has been ${order.paymentStatus === 'paid' ? 'successfully settled' : 'flagged as pending'}.`;
    }

    // 4. Intent: Greetings
    if (lowerMsg.includes("hi") || lowerMsg.includes("hello") || lowerMsg.includes("hey") || lowerMsg.includes("help")) {
      return `Greetings, ${userName}! I am your Vaniga Virtual Concierge. \n\nI can help you track a specific package, provide your billing history, or update you on your latest order. \n\nHow may I assist you today?`;
    }

    // 5. Fallback
    return `I apologize, but I didn't quite capture your request. Could you please specify if you'd like to "track my order", "see my history", or if you'd like to provide an Order ID?`;
  }
}