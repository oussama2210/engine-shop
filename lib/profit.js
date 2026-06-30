import prisma from './prisma';
import { logError } from './logger';

export function calcProfit(buyPrice, sellPrice, quantity = 1) {
  if (buyPrice == null || sellPrice == null) return null;
  return (sellPrice - buyPrice) * quantity;
}

export function calcMargin(buyPrice, sellPrice) {
  if (buyPrice == null || sellPrice == null || sellPrice === 0) return null;
  return ((sellPrice - buyPrice) / sellPrice) * 100;
}

export function calcTotalProfit(items) {
  return items.reduce((sum, item) => {
    const profit = calcProfit(item.buyPrice, item.price, item.qty || 1);
    return sum + (profit || 0);
  }, 0);
}

export async function getProductProfit(productId) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { id: true, name: true, buyPrice: true, price: true, stock: true }
    });
    if (!product) return null;
    return {
      ...product,
      profitPerUnit: calcProfit(product.buyPrice, product.price),
      margin: calcMargin(product.buyPrice, product.price),
      potentialProfit: calcProfit(product.buyPrice, product.price, product.stock),
    };
  } catch (error) {
    logError(error, { method: 'getProductProfit', productId });
    return null;
  }
}

export async function getProfitSummary() {
  try {
    const products = await prisma.product.findMany({
      select: { id: true, name: true, buyPrice: true, price: true, stock: true }
    });

    let totalBuy = 0, totalSell = 0;

    const productProfits = products.map(p => {
      const profitPerUnit = calcProfit(p.buyPrice, p.price);
      const potentialProfit = calcProfit(p.buyPrice, p.price, p.stock);
      const margin = calcMargin(p.buyPrice, p.price);
      if (p.buyPrice != null) totalBuy += p.buyPrice * p.stock;
      totalSell += p.price * p.stock;
      return {
        id: p.id,
        name: p.name,
        buyPrice: p.buyPrice,
        sellPrice: p.price,
        stock: p.stock,
        profitPerUnit,
        margin,
        potentialProfit,
      };
    });

    const totalProfit = productProfits.reduce((sum, p) => sum + (p.potentialProfit || 0), 0);

    return {
      totalProducts: products.length,
      totalBuyValue: totalBuy,
      totalSellValue: totalSell,
      totalProfit,
      overallMargin: totalSell > 0 ? (totalProfit / totalSell) * 100 : 0,
      productProfits,
    };
  } catch (error) {
    logError(error, { method: 'getProfitSummary' });
    return null;
  }
}
