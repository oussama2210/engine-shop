import prisma from './prisma';

/**
 * Inventory Service
 * Handles all inventory-related operations
 */

export class InventoryService {
  /**
   * Get product stock level
   */
  static async getStock(productId) {
    try {
      const product = await prisma.product.findUnique({
        where: { id: productId },
        select: { stock: true }
      });
      return product?.stock || 0;
    } catch (error) {
      console.error('Error getting stock:', error);
      return 0;
    }
  }

  /**
   * Update product stock
   */
  static async updateStock(productId, quantity, operation = 'set') {
    try {
      if (operation === 'set') {
        return await prisma.product.update({
          where: { id: productId },
          data: { stock: quantity }
        });
      } else if (operation === 'add') {
        return await prisma.product.update({
          where: { id: productId },
          data: { stock: { increment: quantity } }
        });
      } else if (operation === 'subtract') {
        return await prisma.product.update({
          where: { id: productId },
          data: { stock: { decrement: quantity } }
        });
      }
    } catch (error) {
      console.error('Error updating stock:', error);
      throw error;
    }
  }

  /**
   * Check if product is in stock
   */
  static async isInStock(productId, quantity = 1) {
    const stock = await this.getStock(productId);
    return stock >= quantity;
  }

  /**
   * Reserve stock for an order
   */
  static async reserveStock(productId, quantity) {
    try {
      const product = await prisma.product.findUnique({
        where: { id: productId },
        select: { stock: true }
      });

      if (!product || product.stock < quantity) {
        throw new Error(`Insufficient stock. Available: ${product?.stock || 0}, Requested: ${quantity}`);
      }

      return await prisma.product.update({
        where: { id: productId },
        data: { stock: { decrement: quantity } }
      });
    } catch (error) {
      console.error('Error reserving stock:', error);
      throw error;
    }
  }

  /**
   * Get low stock products
   */
  static async getLowStock(threshold = 10) {
    try {
      return await prisma.product.findMany({
        where: {
          stock: {
            lte: threshold,
            gt: 0
          }
        },
        orderBy: { stock: 'asc' }
      });
    } catch (error) {
      console.error('Error getting low stock:', error);
      return [];
    }
  }

  /**
   * Get out of stock products
   */
  static async getOutOfStock() {
    try {
      return await prisma.product.findMany({
        where: { stock: 0 },
        orderBy: { updatedAt: 'desc' }
      });
    } catch (error) {
      console.error('Error getting out of stock:', error);
      return [];
    }
  }

  /**
   * Get inventory summary
   */
  static async getInventorySummary() {
    try {
      const totalProducts = await prisma.product.count();
      const totalStock = await prisma.product.aggregate({
        _sum: { stock: true }
      });
      const lowStock = await this.getLowStock();
      const outOfStock = await this.getOutOfStock();

      return {
        totalProducts,
        totalStock: totalStock._sum.stock || 0,
        lowStockCount: lowStock.length,
        outOfStockCount: outOfStock.length,
        lowStockProducts: lowStock,
        outOfStockProducts: outOfStock
      };
    } catch (error) {
      console.error('Error getting inventory summary:', error);
      return {
        totalProducts: 0,
        totalStock: 0,
        lowStockCount: 0,
        outOfStockCount: 0,
        lowStockProducts: [],
        outOfStockProducts: []
      };
    }
  }

  /**
   * Bulk update stock
   */
  static async bulkUpdateStock(updates) {
    try {
      const results = [];
      for (const update of updates) {
        try {
          const result = await this.updateStock(
            update.productId,
            update.quantity,
            update.operation || 'set'
          );
          results.push({ success: true, productId: update.productId, result });
        } catch (error) {
          results.push({ success: false, productId: update.productId, error: error.message });
        }
      }
      return results;
    } catch (error) {
      console.error('Error in bulk update:', error);
      throw error;
    }
  }
}

/**
 * Inventory API endpoints (for use in API routes)
 */
export const inventoryAPI = {
  async GET(req, { params }) {
    const { productId } = params;
    
    if (productId) {
      const stock = await InventoryService.getStock(productId);
      return Response.json({ productId, stock });
    } else {
      const summary = await InventoryService.getInventorySummary();
      return Response.json(summary);
    }
  },

  async POST(req) {
    const body = await req.json();
    const { productId, quantity, operation } = body;
    
    if (!productId || quantity === undefined) {
      return Response.json({ error: 'Missing productId or quantity' }, { status: 400 });
    }

    try {
      const result = await InventoryService.updateStock(productId, quantity, operation);
      return Response.json({ success: true, result });
    } catch (error) {
      return Response.json({ error: error.message }, { status: 400 });
    }
  },

  async PATCH(req) {
    const body = await req.json();
    const { updates } = body;
    
    if (!Array.isArray(updates)) {
      return Response.json({ error: 'Updates must be an array' }, { status: 400 });
    }

    try {
      const results = await InventoryService.bulkUpdateStock(updates);
      return Response.json({ success: true, results });
    } catch (error) {
      return Response.json({ error: error.message }, { status: 400 });
    }
  }
};