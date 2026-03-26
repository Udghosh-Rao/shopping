import { PDFDocument, rgb } from 'pdf-lib';
import { IOrder } from '@/models/Order';
import { IUser } from '@/models/User';

interface BusinessDetails {
  name: string;
  address: string;
  gstIn: string;
  phone: string;
  email: string;
}

interface InvoiceData {
  order: IOrder;
  user: IUser;
  businessDetails?: BusinessDetails;
}

const DEFAULT_BUSINESS: BusinessDetails = {
  name: 'Shopping Store',
  address: 'India',
  gstIn: process.env.BUSINESS_GST_IN || '18AABCT1234H1Z0',
  phone: process.env.BUSINESS_PHONE || '+91 XXXXXXXXXX',
  email: process.env.BUSINESS_EMAIL || 'support@shopping.com',
};

export async function generateInvoice(data: InvoiceData): Promise<Buffer> {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]); // A4 size

  const { order, user, businessDetails = DEFAULT_BUSINESS } = data;

  // Helper functions
  const drawText = (text: string, x: number, y: number, size: number) => {
    page.drawText(text, {
      x,
      y,
      size,
      color: rgb(0, 0, 0),
    });
  };

  const drawBox = (x: number, y: number, width: number, height: number) => {
    page.drawRectangle({
      x,
      y,
      width,
      height,
      borderColor: rgb(0, 0, 0),
      borderWidth: 1,
    });
  };

  let currentY = 800;

  // Header
  drawText('INVOICE', 50, currentY, 24);
  currentY -= 40;

  // Business details
  drawText(businessDetails.name, 50, currentY, 12);
  currentY -= 15;
  drawText(businessDetails.address, 50, currentY, 10);
  currentY -= 12;
  drawText(`GSTIN: ${businessDetails.gstIn}`, 50, currentY, 10);
  currentY -= 12;
  drawText(`Phone: ${businessDetails.phone} | Email: ${businessDetails.email}`, 50, currentY, 10);
  currentY -= 25;

  // Invoice details
  drawBox(50, currentY - 40, 245, 40);
  drawText(`Invoice #: ${order._id.toString().slice(-8).toUpperCase()}`, 60, currentY - 15, 10);
  drawText(`Date: ${new Date(order.createdAt).toLocaleDateString()}`, 60, currentY - 28, 10);

  drawBox(325, currentY - 40, 220, 40);
  drawText(`Order Date: ${new Date(order.createdAt).toLocaleDateString()}`, 335, currentY - 15, 10);
  drawText(`Payment Status: ${order.paymentStatus.toUpperCase()}`, 335, currentY - 28, 10);

  currentY -= 50;

  // Customer details
  drawText('BILL TO:', 50, currentY, 11);
  currentY -= 18;
  drawText(order.shippingAddress.fullName, 50, currentY, 10);
  currentY -= 12;
  drawText(`${order.shippingAddress.addressLine1}`, 50, currentY, 10);
  currentY -= 12;
  if (order.shippingAddress.addressLine2) {
    drawText(order.shippingAddress.addressLine2, 50, currentY, 10);
    currentY -= 12;
  }
  drawText(
    `${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.pincode}`,
    50,
    currentY,
    10
  );
  currentY -= 12;
  drawText(`Phone: ${order.shippingAddress.phone}`, 50, currentY, 10);
  currentY -= 12;
  drawText(`Email: ${user.email}`, 50, currentY, 10);
  currentY -= 30;

  // Items table header
  drawBox(50, currentY - 20, 495, 20);
  drawText('Item', 60, currentY - 12, 10);
  drawText('Size', 180, currentY - 12, 10);
  drawText('Qty', 240, currentY - 12, 10);
  drawText('Price', 300, currentY - 12, 10);
  drawText('Amount', 420, currentY - 12, 10);
  currentY -= 25;

  // Items
  let itemsHeight = 0;
  order.items.forEach((item) => {
    const amount = item.price * item.quantity;
    drawText(item.name.slice(0, 25), 60, currentY - itemsHeight, 9);
    drawText(item.size, 180, currentY - itemsHeight, 9);
    drawText(item.quantity.toString(), 240, currentY - itemsHeight, 9);
    drawText(`₹${item.price}`, 300, currentY - itemsHeight, 9);
    drawText(`₹${amount}`, 420, currentY - itemsHeight, 9);
    itemsHeight += 15;
  });

  currentY -= itemsHeight + 20;

  // Totals
  const subtotal = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const gstAmount = (subtotal * 0.18).toFixed(2);
  const grandTotal = (subtotal + parseFloat(gstAmount) + order.deliveryCharge - order.discount).toFixed(2);

  drawBox(300, currentY - 100, 245, 100);

  let totalY = currentY - 15;
  drawText(`Subtotal: ₹${subtotal.toFixed(2)}`, 310, totalY, 10);
  totalY -= 18;
  drawText(`Delivery: ₹${order.deliveryCharge}`, 310, totalY, 10);
  totalY -= 18;
  drawText(`Discount: -₹${order.discount}`, 310, totalY, 10);
  totalY -= 18;
  drawText(`GST (18%): ₹${gstAmount}`, 310, totalY, 10);
  totalY -= 20;
  drawText(`GRAND TOTAL: ₹${grandTotal}`, 310, totalY, 11);

  currentY -= 110;

  // Footer
  drawText('Thank you for your purchase!', 50, 30, 10);
  drawText('For queries, contact: ' + businessDetails.email, 50, 15, 9);

  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
}
