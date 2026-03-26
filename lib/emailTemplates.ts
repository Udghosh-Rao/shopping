import { IOrder, IOrderItem } from '@/models/Order';
import { IUser } from '@/models/User';
import { IReturn } from '@/models/Return';

const BRAND_COLOR = '#0F172A'; // slate-900
const ACCENT_COLOR = '#3B82F6'; // blue-500
const LIGHT_BG = '#F8FAFC'; // slate-50

const baseStyles = `
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  line-height: 1.6;
  color: #1F2937;
`;

const headerStyles = `
  background-color: ${BRAND_COLOR};
  color: white;
  padding: 32px 24px;
  text-align: center;
`;

const buttonStyles = `
  background-color: ${ACCENT_COLOR};
  color: white;
  padding: 12px 24px;
  border-radius: 6px;
  text-decoration: none;
  display: inline-block;
  font-weight: 600;
`;

const footerStyles = `
  background-color: ${LIGHT_BG};
  border-top: 1px solid #E5E7EB;
  padding: 24px;
  text-align: center;
  font-size: 12px;
  color: #6B7280;
`;

const unsubscribeText = `<p style="margin: 0; font-size: 11px; color: #9CA3AF;">
  This is an automated email from DRIPSTORE. If you no longer wish to receive these emails, you can unsubscribe.
</p>`;

export function orderConfirmation(order: IOrder & { _id: string }, user: IUser) {
  const itemsList = order.items
    .map(
      (item: IOrderItem) => `
      <tr style="border-bottom: 1px solid #E5E7EB;">
        <td style="padding: 12px; text-align: left;">${item.name}</td>
        <td style="padding: 12px; text-align: center;">Size: ${item.size}</td>
        <td style="padding: 12px; text-align: center;">Qty: ${item.quantity}</td>
        <td style="padding: 12px; text-align: right;">₹${(item.price * item.quantity).toFixed(2)}</td>
      </tr>
    `
    )
    .join('');

  const estimatedDelivery = new Date();
  estimatedDelivery.setDate(estimatedDelivery.getDate() + 5);

  return {
    subject: `Order Confirmed! #${order._id}`,
    html: `
      <!DOCTYPE html>
      <html style="${baseStyles}">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; ${baseStyles}">
          <div style="max-width: 600px; margin: 0 auto; background: white;">
            <!-- Header -->
            <div style="${headerStyles}">
              <h1 style="margin: 0; font-size: 28px; font-weight: bold;">Order Confirmed!</h1>
              <p style="margin: 8px 0 0 0; opacity: 0.9;">Thank you for your purchase</p>
            </div>

            <!-- Content -->
            <div style="padding: 32px 24px;">
              <p style="margin: 0 0 24px 0;">Hi ${user.name},</p>
              <p style="margin: 0 0 24px 0; color: #6B7280;">
                We're excited to process your order! Here's a summary of what you ordered.
              </p>

              <!-- Order Details -->
              <div style="background: ${LIGHT_BG}; padding: 16px; border-radius: 8px; margin-bottom: 24px;">
                <p style="margin: 0 0 12px 0; font-weight: 600;">Order #${order._id}</p>
                <p style="margin: 0 0 8px 0; font-size: 14px;">
                  <strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}
                </p>
                <p style="margin: 0 0 0 0; font-size: 14px;">
                  <strong>Estimated Delivery:</strong> ${estimatedDelivery.toLocaleDateString()}
                </p>
              </div>

              <!-- Items Table -->
              <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
                <thead>
                  <tr style="background-color: ${LIGHT_BG}; border-bottom: 2px solid #E5E7EB;">
                    <th style="padding: 12px; text-align: left; font-weight: 600;">Product</th>
                    <th style="padding: 12px; text-align: center; font-weight: 600;">Size</th>
                    <th style="padding: 12px; text-align: center; font-weight: 600;">Quantity</th>
                    <th style="padding: 12px; text-align: right; font-weight: 600;">Price</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsList}
                </tbody>
              </table>

              <!-- Price Breakdown -->
              <div style="border-top: 2px solid #E5E7EB; padding-top: 16px; margin-bottom: 24px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                  <span>Subtotal:</span>
                  <span>₹${(order.totalAmount - order.discount - order.deliveryCharge).toFixed(2)}</span>
                </div>
                ${order.discount > 0 ? `<div style="display: flex; justify-content: space-between; margin-bottom: 8px; color: #10B981;">
                  <span>Discount:</span>
                  <span>-₹${order.discount.toFixed(2)}</span>
                </div>` : ''}
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                  <span>Delivery:</span>
                  <span>₹${order.deliveryCharge.toFixed(2)}</span>
                </div>
                <div style="display: flex; justify-content: space-between; font-size: 18px; font-weight: bold; color: ${BRAND_COLOR};">
                  <span>Total:</span>
                  <span>₹${order.totalAmount.toFixed(2)}</span>
                </div>
              </div>

              <!-- CTA Button -->
              <div style="text-align: center; margin-bottom: 24px;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://example.com'}/orders/${order._id}" style="${buttonStyles}">
                  Track Your Order
                </a>
              </div>

              <!-- Shipping Address -->
              <div style="background: ${LIGHT_BG}; padding: 16px; border-radius: 8px; margin-bottom: 24px;">
                <p style="margin: 0 0 12px 0; font-weight: 600;">Shipping Address</p>
                <p style="margin: 0; font-size: 14px;">
                  ${order.shippingAddress.fullName}<br>
                  ${order.shippingAddress.addressLine1}${order.shippingAddress.addressLine2 ? '<br>' + order.shippingAddress.addressLine2 : ''}<br>
                  ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.pincode}
                </p>
              </div>
            </div>

            <!-- Footer -->
            <div style="${footerStyles}">
              <p style="margin: 0 0 12px 0;">
                Questions? <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://example.com'}/support" style="color: ${ACCENT_COLOR}; text-decoration: none;">Contact Support</a> | 
                <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://example.com'}/returns" style="color: ${ACCENT_COLOR}; text-decoration: none;">Return Policy</a>
              </p>
              ${unsubscribeText}
            </div>
          </div>
        </body>
      </html>
    `,
  };
}

export function abandonedCartRecovery(
  user: IUser,
  items: Array<{ productId: string; quantity: number; size: string; name?: string; price?: number; image?: string }>,
  cartValue: number
) {
  const itemsList = items
    .map(
      (item) => `
      <tr style="border-bottom: 1px solid #E5E7EB;">
        <td style="padding: 12px; text-align: left;">${item.name || 'Product'}</td>
        <td style="padding: 12px; text-align: center;">Qty: ${item.quantity}</td>
        <td style="padding: 12px; text-align: right;">₹${((item.price || 0) * item.quantity).toFixed(2)}</td>
      </tr>
    `
    )
    .join('');

  return {
    subject: 'Your cart is waiting! 🛒',
    html: `
      <!DOCTYPE html>
      <html style="${baseStyles}">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; ${baseStyles}">
          <div style="max-width: 600px; margin: 0 auto; background: white;">
            <!-- Header -->
            <div style="${headerStyles}">
              <h1 style="margin: 0; font-size: 28px; font-weight: bold;">Don't Leave Empty-Handed!</h1>
              <p style="margin: 8px 0 0 0; opacity: 0.9;">Your items are waiting</p>
            </div>

            <!-- Content -->
            <div style="padding: 32px 24px;">
              <p style="margin: 0 0 24px 0;">Hi ${user.name},</p>
              <p style="margin: 0 0 24px 0; color: #6B7280;">
                We noticed you left some amazing items in your cart. Complete your purchase today!
              </p>

              <!-- Urgency Banner -->
              <div style="background: #FEF3C7; border-left: 4px solid #F59E0B; padding: 16px; border-radius: 6px; margin-bottom: 24px;">
                <p style="margin: 0; font-weight: 600; color: #92400E;">
                  ⏰ Sale ends in 24 hours - Don't miss out!
                </p>
              </div>

              <!-- Cart Items -->
              <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
                <thead>
                  <tr style="background-color: ${LIGHT_BG}; border-bottom: 2px solid #E5E7EB;">
                    <th style="padding: 12px; text-align: left; font-weight: 600;">Product</th>
                    <th style="padding: 12px; text-align: center; font-weight: 600;">Quantity</th>
                    <th style="padding: 12px; text-align: right; font-weight: 600;">Price</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsList}
                </tbody>
              </table>

              <!-- Cart Total -->
              <div style="background: ${LIGHT_BG}; padding: 16px; border-radius: 8px; margin-bottom: 24px; text-align: right;">
                <div style="font-size: 18px; font-weight: bold; color: ${BRAND_COLOR};">
                  Cart Total: ₹${cartValue.toFixed(2)}
                </div>
              </div>

              <!-- CTA Button -->
              <div style="text-align: center; margin-bottom: 24px;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://example.com'}/cart" style="${buttonStyles}">
                  Complete Your Purchase
                </a>
              </div>

              <p style="margin: 0; font-size: 14px; color: #6B7280; text-align: center;">
                This offer expires in 24 hours. Hurry and grab your items!
              </p>
            </div>

            <!-- Footer -->
            <div style="${footerStyles}">
              <p style="margin: 0 0 12px 0;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://example.com'}/cart" style="color: ${ACCENT_COLOR}; text-decoration: none;">View Cart</a>
              </p>
              ${unsubscribeText}
            </div>
          </div>
        </body>
      </html>
    `,
  };
}

export function returnApproved(
  returnRequest: IReturn & { _id: string },
  user: IUser,
  refundAmount: number
) {
  return {
    subject: 'Your return has been approved ✓',
    html: `
      <!DOCTYPE html>
      <html style="${baseStyles}">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; ${baseStyles}">
          <div style="max-width: 600px; margin: 0 auto; background: white;">
            <!-- Header -->
            <div style="${headerStyles}">
              <h1 style="margin: 0; font-size: 28px; font-weight: bold;">Return Approved ✓</h1>
              <p style="margin: 8px 0 0 0; opacity: 0.9;">Your refund is being processed</p>
            </div>

            <!-- Content -->
            <div style="padding: 32px 24px;">
              <p style="margin: 0 0 24px 0;">Hi ${user.name},</p>
              <p style="margin: 0 0 24px 0; color: #6B7280;">
                Good news! Your return request has been approved and your refund is being processed.
              </p>

              <!-- Return Details -->
              <div style="background: ${LIGHT_BG}; padding: 16px; border-radius: 8px; margin-bottom: 24px;">
                <p style="margin: 0 0 12px 0; font-weight: 600;">Return Details</p>
                <p style="margin: 0 0 8px 0; font-size: 14px;">
                  <strong>Return ID:</strong> ${returnRequest._id}
                </p>
                <p style="margin: 0 0 0 0; font-size: 14px;">
                  <strong>Refund Amount:</strong> <span style="color: #10B981; font-weight: bold;">₹${refundAmount.toFixed(2)}</span>
                </p>
              </div>

              <!-- Timeline -->
              <div style="border-left: 3px solid ${ACCENT_COLOR}; padding-left: 16px; margin-bottom: 24px;">
                <p style="margin: 0 0 16px 0; font-weight: 600;">Refund Timeline</p>
                <div style="margin-bottom: 16px;">
                  <p style="margin: 0 0 4px 0; font-weight: 600; font-size: 14px;">✓ Return Approved</p>
                  <p style="margin: 0; font-size: 12px; color: #6B7280;">Today</p>
                </div>
                <div style="margin-bottom: 16px;">
                  <p style="margin: 0 0 4px 0; font-weight: 600; font-size: 14px;">📦 Item in Transit</p>
                  <p style="margin: 0; font-size: 12px; color: #6B7280;">Next 5-7 business days</p>
                </div>
                <div>
                  <p style="margin: 0 0 4px 0; font-weight: 600; font-size: 14px;">💰 Refund Processed</p>
                  <p style="margin: 0; font-size: 12px; color: #6B7280;">3-5 business days after receipt</p>
                </div>
              </div>

              <p style="margin: 0; font-size: 14px; color: #6B7280; background: #EFF6FF; padding: 12px; border-radius: 6px;">
                <strong>Note:</strong> The refund will appear in your original payment method within 3-5 business days after we receive the item.
              </p>
            </div>

            <!-- Footer -->
            <div style="${footerStyles}">
              <p style="margin: 0 0 12px 0;">
                Questions? <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://example.com'}/support" style="color: ${ACCENT_COLOR}; text-decoration: none;">Contact Support</a>
              </p>
              ${unsubscribeText}
            </div>
          </div>
        </body>
      </html>
    `,
  };
}

export function returnRejected(returnRequest: IReturn & { _id: string }, user: IUser, reason: string) {
  return {
    subject: 'Return Update',
    html: `
      <!DOCTYPE html>
      <html style="${baseStyles}">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; ${baseStyles}">
          <div style="max-width: 600px; margin: 0 auto; background: white;">
            <!-- Header -->
            <div style="${headerStyles}">
              <h1 style="margin: 0; font-size: 28px; font-weight: bold;">Return Update</h1>
              <p style="margin: 8px 0 0 0; opacity: 0.9;">We've reviewed your return request</p>
            </div>

            <!-- Content -->
            <div style="padding: 32px 24px;">
              <p style="margin: 0 0 24px 0;">Hi ${user.name},</p>
              <p style="margin: 0 0 24px 0; color: #6B7280;">
                We've reviewed your return request and unfortunately we're unable to approve it at this time.
              </p>

              <!-- Reason -->
              <div style="background: #FEE2E2; border-left: 4px solid #EF4444; padding: 16px; border-radius: 6px; margin-bottom: 24px;">
                <p style="margin: 0 0 8px 0; font-weight: 600; color: #7F1D1D;">Reason</p>
                <p style="margin: 0; font-size: 14px; color: #991B1B;">
                  ${reason || 'Item does not meet return policy criteria'}
                </p>
              </div>

              <!-- Return Details -->
              <div style="background: ${LIGHT_BG}; padding: 16px; border-radius: 8px; margin-bottom: 24px;">
                <p style="margin: 0 0 8px 0; font-size: 14px;">
                  <strong>Return ID:</strong> ${returnRequest._id}
                </p>
                <p style="margin: 0; font-size: 14px;">
                  <strong>Status:</strong> Rejected
                </p>
              </div>

              <p style="margin: 0 0 16px 0; color: #6B7280;">
                If you believe this decision was made in error or have any questions, please don't hesitate to reach out to our support team.
              </p>

              <!-- Support Link -->
              <div style="text-align: center;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://example.com'}/support" style="${buttonStyles}">
                  Contact Support
                </a>
              </div>
            </div>

            <!-- Footer -->
            <div style="${footerStyles}">
              <p style="margin: 0 0 12px 0;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://example.com'}/support" style="color: ${ACCENT_COLOR}; text-decoration: none;">Get Help</a>
              </p>
              ${unsubscribeText}
            </div>
          </div>
        </body>
      </html>
    `,
  };
}

export function wishlistRestock(product: { name: string; price: number; image?: string }, user: IUser) {
  return {
    subject: `${product.name} is back in stock!`,
    html: `
      <!DOCTYPE html>
      <html style="${baseStyles}">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; ${baseStyles}">
          <div style="max-width: 600px; margin: 0 auto; background: white;">
            <!-- Header -->
            <div style="${headerStyles}">
              <h1 style="margin: 0; font-size: 24px; font-weight: bold;">Back in Stock!</h1>
            </div>

            <!-- Content -->
            <div style="padding: 32px 24px;">
              <p style="margin: 0 0 24px 0;">Hi ${user.name},</p>
              <p style="margin: 0 0 24px 0; color: #6B7280;">
                Great news! An item from your wishlist is now available.
              </p>

              <!-- Product -->
              <div style="background: ${LIGHT_BG}; padding: 16px; border-radius: 8px; margin-bottom: 24px; text-align: center;">
                ${product.image ? `<img src="${product.image}" alt="${product.name}" style="width: 100%; max-width: 300px; height: 200px; object-fit: cover; border-radius: 6px; margin-bottom: 12px;">` : ''}
                <h2 style="margin: 0 0 12px 0; font-size: 18px; font-weight: 600;">${product.name}</h2>
                <p style="margin: 0; font-size: 20px; font-weight: bold; color: ${BRAND_COLOR};">₹${product.price.toFixed(2)}</p>
              </div>

              <!-- CTA Button -->
              <div style="text-align: center; margin-bottom: 24px;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://example.com'}/products" style="${buttonStyles}">
                  View Product
                </a>
              </div>

              <p style="margin: 0; font-size: 14px; color: #6B7280; text-align: center;">
                Hurry! Stock is limited and may sell out quickly.
              </p>
            </div>

            <!-- Footer -->
            <div style="${footerStyles}">
              ${unsubscribeText}
            </div>
          </div>
        </body>
      </html>
    `,
  };
}

export function lowStockAlert(
  product: { _id: string; name: string; stock: number; image?: string; sizes?: string[] },
  adminEmail: string
) {
  return {
    subject: `[Alert] Low Stock: ${product.name}`,
    html: `
      <!DOCTYPE html>
      <html style="${baseStyles}">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; ${baseStyles}">
          <div style="max-width: 600px; margin: 0 auto; background: white;">
            <!-- Header -->
            <div style="${headerStyles}">
              <h1 style="margin: 0; font-size: 24px; font-weight: bold;">⚠️ Low Stock Alert</h1>
            </div>

            <!-- Content -->
            <div style="padding: 32px 24px;">
              <p style="margin: 0 0 24px 0;">Product Alert,</p>

              <!-- Alert Details -->
              <div style="background: #FEF3C7; border-left: 4px solid #F59E0B; padding: 16px; border-radius: 6px; margin-bottom: 24px;">
                <p style="margin: 0 0 12px 0; font-weight: 600;">Stock Below 5 Units</p>
                <p style="margin: 0 0 8px 0; font-size: 14px;">
                  <strong>Product:</strong> ${product.name}
                </p>
                <p style="margin: 0 0 8px 0; font-size: 14px;">
                  <strong>Current Stock:</strong> ${product.stock} units
                </p>
                ${product.sizes && product.sizes.length > 0 ? `<p style="margin: 0; font-size: 14px;">
                  <strong>Affected Sizes:</strong> ${product.sizes.join(', ')}
                </p>` : ''}
              </div>

              <!-- Action -->
              <div style="text-align: center; margin-bottom: 24px;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://example.com'}/admin/products/${product._id}" style="${buttonStyles}">
                  Update Stock
                </a>
              </div>

              <p style="margin: 0; font-size: 14px; color: #6B7280;">
                Please restock this item as soon as possible to maintain availability.
              </p>
            </div>

            <!-- Footer -->
            <div style="${footerStyles}">
              <p style="margin: 0;">Admin Alert - DRIPSTORE Inventory</p>
            </div>
          </div>
        </body>
      </html>
    `,
  };
}
