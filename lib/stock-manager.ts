import Stock from '@/models/Stock';
import StockLedger, { MovementType } from '@/models/StockLedger';
import Location from '@/models/Location';
import Product from '@/models/Product';
import mongoose from 'mongoose';

interface StockMovement {
  productId: string;
  locationId: string;
  quantity: number;
  movementType: MovementType;
  reference: string;
  documentId: string;
  responsible: string;
  date?: Date;
}

export async function updateStock(movement: StockMovement): Promise<void> {
  try {
    const location = await Location.findById(movement.locationId).populate('warehouse');
    if (!location) {
      throw new Error('Location not found');
    }

    // Get current stock or create new
    let stock = await Stock.findOne({
      product: movement.productId,
      location: movement.locationId,
    });

    if (!stock) {
      stock = new Stock({
        product: movement.productId,
        location: movement.locationId,
        warehouse: location.warehouse,
        onHand: 0,
        freeToUse: 0,
      });
    }

    // Update stock based on movement type
    let quantityChange = 0;

    switch (movement.movementType) {
      case 'receipt':
        quantityChange = Math.abs(movement.quantity);
        break;
      case 'delivery':
        quantityChange = -Math.abs(movement.quantity);
        break;
      case 'adjustment':
        quantityChange = movement.quantity;
        break;
      default:
        quantityChange = movement.quantity;
    }

    stock.onHand += quantityChange;
    stock.freeToUse += quantityChange;

    if (stock.onHand < 0) {
      throw new Error('Insufficient stock');
    }

    await stock.save();

    // Create ledger entry
    const ledgerEntry = new StockLedger({
      product: movement.productId,
      location: movement.locationId,
      warehouse: location.warehouse,
      quantity: movement.quantity,
      onHand: stock.onHand,
      freeToUse: stock.freeToUse,
      movementType: movement.movementType,
      reference: movement.reference,
      documentId: movement.documentId,
      date: movement.date || new Date(),
      responsible: movement.responsible,
    });

    await ledgerEntry.save();
  } catch (error) {
    throw error;
  }
}

export async function getStockByProduct(
  productId: string,
  warehouseId?: string
): Promise<{ onHand: number; freeToUse: number; locations: any[] }> {
  const query: any = { product: productId };
  if (warehouseId) {
    query.warehouse = warehouseId;
  }

  const stocks = await Stock.find(query)
    .populate('location')
    .populate('warehouse');

  const totalOnHand = stocks.reduce((sum, s) => sum + s.onHand, 0);
  const totalFreeToUse = stocks.reduce((sum, s) => sum + s.freeToUse, 0);

  return {
    onHand: totalOnHand,
    freeToUse: totalFreeToUse,
    locations: stocks.map(s => ({
      location: s.location,
      warehouse: s.warehouse,
      onHand: s.onHand,
      freeToUse: s.freeToUse,
    })),
  };
}

export async function getLowStockProducts(warehouseId?: string) {
  // Ensure Product model is loaded
  const ProductModel = Product;

  const pipeline: any[] = [
    {
      $lookup: {
        from: 'products',
        localField: 'product',
        foreignField: '_id',
        as: 'productData',
      },
    },
    {
      $unwind: '$productData',
    },
    {
      $group: {
        _id: '$product',
        totalOnHand: { $sum: '$onHand' },
        product: { $first: '$productData' },
      },
    },
    {
      $match: {
        $expr: {
          $lte: ['$totalOnHand', '$product.minStockLevel'],
        },
      },
    },
  ];

  if (warehouseId) {
    pipeline.unshift({
      $match: { warehouse: new mongoose.Types.ObjectId(warehouseId) },
    });
  }

  const lowStockItems = await Stock.aggregate(pipeline);
  return lowStockItems;
}
