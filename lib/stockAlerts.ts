import dbConnect from './mongodb';
import Product from '@/models/Product';

export async function checkLowStock(productId: string) {
  try {
    await dbConnect();
    
    const product = await Product.findById(productId);
    if (!product) return;

    const lowStockSizes = product.sizes.filter((s: { size: string; stock: number }) => s.stock < 3);
    
    if (lowStockSizes.length > 0 || product.stock < 3) {
      await notifyAdminOfLowStock(product, lowStockSizes);
    }
  } catch (error) {
    console.error('Error checking low stock:', error);
  }
}

export async function notifyAdminOfLowStock(
  product: any,
  lowStockSizes: { size: string; stock: number }[]
) {
  try {
    const sizeInfo = lowStockSizes.map((s) => `Size ${s.size}: ${s.stock} units`).join(', ');
    
    console.log(`[LOW STOCK ALERT] Product: ${product.name}`);
    console.log(`Overall Stock: ${product.stock} units`);
    if (sizeInfo) {
      console.log(`Low Stock Sizes: ${sizeInfo}`);
    }
    console.log('Please restock this product to avoid stockouts.');
  } catch (error) {
    console.error('Error processing low stock notification:', error);
  }
}
