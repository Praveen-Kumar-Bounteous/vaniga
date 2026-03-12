import axios from 'axios';

interface OrderEmailData {
  id: string;
  totalAmount: number;
  shippingAddress: any; 
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
}

export const sendOrderConfirmation = async (email: string, name: string, order: OrderEmailData) => {
  const itemSubTotal = order.items.reduce((acc, i) => acc + (i.price * i.quantity), 0);
  const gst = itemSubTotal * 0.18;
  const deliveryFee = itemSubTotal > 2000 ? 0 : 40;
  const autoSavings = itemSubTotal * 0.10;

  const itemsHtml = order.items.map((i) => `
    <tr style="border-bottom: 1px dashed #ddd;">
      <td style="padding: 12px 0; text-align: left;">
        <div style="font-weight: bold; color: #333; font-size: 14px;">${i.name.toUpperCase()}</div>
        <div style="font-size: 11px; color: #888;">UNIT PRICE: ₹${i.price}</div>
      </td>
      <td style="padding: 12px 0; text-align: center; color: #333; font-size: 14px;">${i.quantity}</td>
      <td style="padding: 12px 0; text-align: right; font-weight: bold; color: #333; font-size: 14px;">₹${(i.price * i.quantity).toFixed(2)}</td>
    </tr>
  `).join('');

  const address = (order.shippingAddress as any) || {};
  const date = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

  const brevoData = {
    sender: { name: "Vaniga", email: process.env.BREVO_SENDER_EMAIL },
    to: [{ email: email, name: name }],
    subject: `Order Confirmed! #${order.id.split('-')[0].toUpperCase()}`,
    htmlContent: `
      <div style="background-color: #f5f5f5; padding: 20px; font-family: 'Helvetica', 'Arial', sans-serif;">
        <div style="max-width: 500px; margin: auto; background: #fff; padding: 30px; border-radius: 4px; box-shadow: 0 0 10px rgba(0,0,0,0.1); border-top: 8px solid #6D28D9;">
          
          <!-- Header -->
          <div style="text-align: center; margin-bottom: 20px;">
            <h1 style="margin: 0; color: #6D28D9; font-size: 36px; letter-spacing: -2px;">VANIGA</h1>
          </div>

          <!-- Greeting Section -->
          <div style="margin-bottom: 25px; color: #333;">
            <p style="font-size: 18px; margin: 0;">Dear <b>${name}</b>,</p>
            <p style="font-size: 14px; color: #666; line-height: 1.5; margin-top: 10px;">
              Your order has been successfully placed! We're getting it ready for shipment. Here is your detailed tax invoice for your recent purchase.
            </p>
          </div>

          <div style="margin-bottom: 20px; border-top: 1px solid #eee; border-bottom: 1px solid #eee; padding: 10px 0; text-align: center;">
            <p style="margin: 0; font-size: 13px; font-family: 'Courier New', Courier, monospace;"><b>TAX INVOICE / RECEIPT</b></p>
          </div>

          <!-- Metadata -->
          <div style="font-size: 12px; margin-bottom: 30px; line-height: 1.6; color: #444; font-family: 'Courier New', Courier, monospace;">
            <div><b>ORDER ID:</b> ${order.id}</div>
            <div><b>DATE:</b> ${date}</div>
            <div style="margin-top: 10px; padding: 10px; background: #f9f9f9; border-radius: 5px;">
              <b>SHIPPING TO:</b><br/>
              ${address.street || "N/A"}, ${address.city || ""}, ${address.state || ""}<br/>
              PH: ${address.phone || "N/A"}
            </div>
          </div>

          <!-- Items Table -->
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px; font-family: 'Courier New', Courier, monospace;">
            <thead>
              <tr style="border-bottom: 2px solid #333;">
                <th style="text-align: left; font-size: 12px; padding-bottom: 10px;">DESCRIPTION</th>
                <th style="text-align: center; font-size: 12px; padding-bottom: 10px;">QTY</th>
                <th style="text-align: right; font-size: 12px; padding-bottom: 10px;">TOTAL</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>

          <!-- Bill Summary -->
          <div style="margin-top: 20px; border-top: 2px solid #eee; padding-top: 15px; font-family: 'Courier New', Courier, monospace;">
            <div style="display: flex; justify-content: space-between; font-size: 14px; margin-bottom: 5px; color: #666;">
              <span style="width: 70%; display: inline-block;">Sub-Total:</span>
              <span style="width: 25%; display: inline-block; text-align: right;">₹${itemSubTotal.toFixed(2)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 14px; margin-bottom: 5px; color: #e53e3e;">
              <span style="width: 70%; display: inline-block;">Instant Savings (10%):</span>
              <span style="width: 25%; display: inline-block; text-align: right;">-₹${autoSavings.toFixed(2)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 14px; margin-bottom: 5px; color: #666;">
              <span style="width: 70%; display: inline-block;">GST (18%):</span>
              <span style="width: 25%; display: inline-block; text-align: right;">₹${gst.toFixed(2)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 14px; margin-bottom: 15px; color: #666;">
              <span style="width: 70%; display: inline-block;">Delivery Fee:</span>
              <span style="width: 25%; display: inline-block; text-align: right;">${deliveryFee === 0 ? 'FREE' : '₹' + deliveryFee.toFixed(2)}</span>
            </div>

            <!-- Grand Total -->
            <div style="border-top: 2px solid #333; border-bottom: 2px solid #333; padding: 15px 0; display: flex; justify-content: space-between; align-items: center;">
              <span style="font-size: 18px; font-weight: bold; text-transform: uppercase;">Total:</span>
              <span style="font-size: 24px; font-weight: bold; color: #6D28D9;">₹${order.totalAmount.toFixed(2)}</span>
            </div>
          </div>

          <!-- Barcode Aesthetic -->
          <div style="margin-top: 40px; text-align: center;">
            <p style="font-size: 11px; color: #999; text-transform: uppercase; letter-spacing: 2px;">Thank you for shopping at Vaniga</p>
            <div style="margin-top: 15px; font-size: 18px; color: #eee; letter-spacing: 5px;">|||| || | ||||| ||| | ||</div>
          </div>

        </div>
      </div>
    `
  };

  try {
    await axios.post('https://api.brevo.com/v3/smtp/email', brevoData, {
      headers: {
        'api-key': process.env.BREVO_API_KEY,
        'Content-Type': 'application/json',
      },
    });
    console.log(`[Mailer] Professional Invoice sent to ${name}`);
  } catch (error: any) {
    console.error("[Mailer] Brevo API Error:", error.response?.data || error.message);
  }
};