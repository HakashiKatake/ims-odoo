import Warehouse from '@/models/Warehouse';
import Receipt from '@/models/Receipt';
import Delivery from '@/models/Delivery';
import Transfer from '@/models/Transfer';
import Adjustment from '@/models/Adjustment';

type OperationType = 'receipt' | 'delivery' | 'transfer' | 'adjustment';

export async function generateReference(
  warehouseId: string,
  operationType: OperationType
): Promise<string> {
  const warehouse = await Warehouse.findById(warehouseId);
  if (!warehouse) {
    throw new Error('Warehouse not found');
  }

  const prefix = operationType.toUpperCase().slice(0, 2);
  const warehouseCode = warehouse.shortCode;

  let model;
  switch (operationType) {
    case 'receipt':
      model = Receipt;
      break;
    case 'delivery':
      model = Delivery;
      break;
    case 'transfer':
      model = Transfer;
      break;
    case 'adjustment':
      model = Adjustment;
      break;
  }

  const count = await model.countDocuments();
  const sequenceNumber = String(count + 1).padStart(4, '0');

  return `${warehouseCode}/${prefix}/${sequenceNumber}`;
}

export function generateAdjustmentReference(warehouseCode: string): string {
  const timestamp = Date.now().toString().slice(-6);
  return `${warehouseCode}/ADJ/${timestamp}`;
}
