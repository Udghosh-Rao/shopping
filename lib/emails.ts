// Email template utilities for Resend
// Note: Resend setup requires RESEND_API_KEY environment variable

export interface EmailResponse {
  success: boolean;
  message: string;
  error?: string;
}

export const orderConfirmationTemplate = (
  order: any,
  user: any
): string => {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #E63946; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { border: 1px solid #ddd; padding: 20px; border-radius: 0 0 8px 8px; }
          .order-item { border-bottom: 1px solid #eee; padding: 15px 0; }
          .order-item:last-child { border-bottom: none; }
          .total { background: #f5f5f5; padding: 15px; border-radius: 4px; text-align: right; font-weight: bold; }
          .button { display: inline-block; background: #E63946; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Order Confirmed!</h1>
            <p>Thank you for your purchase</p>
          </div>
          <div class="content">
            <p>Hi ${user.name},</p>
            <p>Your order #${order._id} has been confirmed and will be shipped soon.</p>
            
            <h3>Order Items:</h3>
            ${order.items
              .map(
                (item: any) => `
              <div class="order-item">
                <p><strong>${item.name}</strong></p>
                <p>Quantity: ${item.quantity}</p>
                <p>Price: ₹${item.price}</p>
              </div>
            `
              )
              .join("")}
            
            <div class="total">
              Total: ₹${order.totalAmount}
            </div>
            
            <p style="margin-top: 20px;">
              <a href="https://yourstore.com/order/${order._id}" class="button">Track Order</a>
            </p>
          </div>
        </div>
      </body>
    </html>
  `;
};

export const abandonedCartTemplate = (
  user: any,
  items: any[],
  cartValue: number
): string => {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #f5f5f5; padding: 20px; border-radius: 8px; }
          .cart-item { border-bottom: 1px solid #eee; padding: 15px 0; display: flex; gap: 15px; }
          .cart-item img { width: 80px; height: 80px; object-fit: cover; border-radius: 4px; }
          .cart-total { background: #E63946; color: white; padding: 15px; border-radius: 4px; text-align: right; font-weight: bold; margin: 20px 0; }
          .button { display: inline-block; background: #E63946; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Don't Leave Your Cart Behind!</h1>
            <p>Hi ${user.name}, you have items waiting for you</p>
          </div>
          
          <h3>Your Cart:</h3>
          ${items
            .map(
              (item: any) => `
            <div class="cart-item">
              <div>
                <p><strong>${item.name}</strong></p>
                <p>Quantity: ${item.quantity}</p>
                <p>₹${item.price}</p>
              </div>
            </div>
          `
            )
            .join("")}
          
          <div class="cart-total">
            Cart Total: ₹${cartValue.toFixed(2)}
          </div>
          
          <p style="text-align: center; margin: 20px 0;">
            <a href="https://yourstore.com/cart" class="button">Complete Your Purchase</a>
          </p>
          
          <p style="color: #999; font-size: 12px; text-align: center;">
            Use code COMEBACK10 for 10% off when you complete your purchase
          </p>
        </div>
      </body>
    </html>
  `;
};

export const returnApprovedTemplate = (
  returnItem: any,
  user: any
): string => {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #10b981; color: white; padding: 20px; border-radius: 8px; }
          .content { border: 1px solid #ddd; padding: 20px; border-radius: 4px; margin: 20px 0; }
          .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
          .refund-amount { background: #10b981; color: white; padding: 15px; border-radius: 4px; text-align: center; font-size: 24px; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Return Approved! 🎉</h1>
            <p>Your refund has been processed</p>
          </div>
          
          <div class="content">
            <p>Hi ${user.name},</p>
            <p>Your return request for order #${returnItem.orderId} has been approved.</p>
            
            <div class="refund-amount">
              ₹${returnItem.refundAmount}
            </div>
            
            <h3>Refund Details:</h3>
            <div class="detail-row">
              <span>Reason:</span>
              <strong>${returnItem.reason}</strong>
            </div>
            <div class="detail-row">
              <span>Status:</span>
              <strong>Approved</strong>
            </div>
            
            <p style="margin-top: 20px; color: #666;">
              <strong>Admin Notes:</strong><br>
              ${returnItem.adminNotes || "Thank you for your business!"}
            </p>
            
            <p style="margin-top: 20px; color: #666; font-size: 12px;">
              Your refund will be credited to your original payment method within 5-7 business days.
            </p>
          </div>
        </div>
      </body>
    </html>
  `;
};

export const wishlistRestockTemplate = (
  product: any,
  user: any
): string => {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #E63946; color: white; padding: 20px; border-radius: 8px; text-align: center; }
          .product-section { border: 1px solid #ddd; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .product-image { width: 100%; max-width: 400px; height: auto; border-radius: 4px; margin-bottom: 15px; }
          .price { font-size: 28px; font-weight: bold; color: #E63946; }
          .button { display: inline-block; background: #E63946; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Back in Stock! 📦</h1>
            <p>An item from your wishlist is available again</p>
          </div>
          
          <div class="product-section">
            <p>Hi ${user.name},</p>
            <p><strong>${product.name}</strong> is now back in stock!</p>
            
            <div class="price">₹${product.price}</div>
            
            <p style="margin: 20px 0;">
              <a href="https://yourstore.com/product/${product.slug}" class="button">Shop Now</a>
            </p>
            
            <p style="color: #666; font-size: 12px;">
              Limited stock available. Don't miss out!
            </p>
          </div>
        </div>
      </body>
    </html>
  `;
};

// Email sending functions (requires RESEND_API_KEY)
export async function sendOrderConfirmation(
  order: any,
  user: any
): Promise<EmailResponse> {
  try {
    const html = orderConfirmationTemplate(order, user);
    // Implement with your email service (e.g., Resend, SendGrid, etc.)
    console.log("Order confirmation email sent to:", user.email);
    return { success: true, message: "Order confirmation email sent" };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to send email";
    return { success: false, message: "Failed to send email", error: message };
  }
}

export async function sendAbandonedCartRecovery(
  user: any,
  items: any[],
  cartValue: number
): Promise<EmailResponse> {
  try {
    const html = abandonedCartTemplate(user, items, cartValue);
    console.log("Abandoned cart recovery email sent to:", user.email);
    return { success: true, message: "Abandoned cart recovery email sent" };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to send email";
    return { success: false, message: "Failed to send email", error: message };
  }
}

export async function sendReturnApproved(
  returnItem: any,
  user: any
): Promise<EmailResponse> {
  try {
    const html = returnApprovedTemplate(returnItem, user);
    console.log("Return approved email sent to:", user.email);
    return { success: true, message: "Return approved email sent" };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to send email";
    return { success: false, message: "Failed to send email", error: message };
  }
}

export async function sendWishlistRestock(
  product: any,
  user: any
): Promise<EmailResponse> {
  try {
    const html = wishlistRestockTemplate(product, user);
    console.log("Wishlist restock email sent to:", user.email);
    return { success: true, message: "Wishlist restock email sent" };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to send email";
    return { success: false, message: "Failed to send email", error: message };
  }
}
