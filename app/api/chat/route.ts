import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dbConnect from '@/lib/db';
import Warehouse from '@/models/Warehouse';
import Product from '@/models/Product';
import Stock from '@/models/Stock';
import Location from '@/models/Location';
import Receipt from '@/models/Receipt';
import Delivery from '@/models/Delivery';
import Transfer from '@/models/Transfer';
import Adjustment from '@/models/Adjustment';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { message } = await request.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    await dbConnect();

    // Ensure Warehouse model is registered
    Warehouse.modelName;

    // Build context from inventory data
    const [products, stockData, locations, receipts, deliveries, transfers, adjustments] = await Promise.all([
      Product.find().limit(50).lean(),
      Stock.find().populate('product').populate('location').limit(50).lean(),
      Location.find().populate('warehouse').limit(20).lean(),
      Receipt.find().populate('products.product').populate('to').sort({ scheduleDate: -1 }).limit(20).lean(),
      Delivery.find().populate('products.product').populate('from').sort({ scheduleDate: -1 }).limit(20).lean(),
      Transfer.find().populate('products.product').populate('from').populate('to').sort({ date: -1 }).limit(15).lean(),
      Adjustment.find().populate('products.product').populate('location').sort({ createdAt: -1 }).limit(15).lean(),
    ]);

    const context = `
You are an intelligent inventory management assistant for StockMaster IMS. You help warehouse managers and staff with inventory-related questions.

Current Inventory Context:
- Total Products: ${products.length}
- Products in Stock: ${stockData.length} records
- Locations: ${locations.length}
- Recent Receipts: ${receipts.length}
- Recent Deliveries: ${deliveries.length}
- Recent Transfers: ${transfers.length}
- Recent Adjustments: ${adjustments.length}

Sample Products (first 10):
${products.slice(0, 10).map((p: any) => `- ${p.name} (SKU: ${p.sku}, Min Stock: ${p.minStockLevel})`).join('\n')}

Sample Stock Levels (first 10):
${stockData.slice(0, 10).map((s: any) => `- ${s.product?.name || 'Unknown'} at ${s.location?.name || 'Unknown'}: On Hand: ${s.onHand}, Free to Use: ${s.freeToUse}`).join('\n')}

Available Locations:
${locations.map((l: any) => `- ${l.name} (${l.shortCode}) in ${l.warehouse?.name || 'Unknown'}`).join('\n')}

Recent Receipts (last 10):
${receipts.slice(0, 10).map((r: any) => {
  const productsList = r.products?.map((p: any) => `${p.product?.name || 'Unknown'} (Qty: ${p.quantity})`).join(', ') || 'No products';
  return `- ${productsList} to ${r.to?.name || 'Unknown'} on ${new Date(r.scheduleDate).toLocaleDateString()} (Ref: ${r.reference}) - Status: ${r.status}`;
}).join('\n')}

Recent Deliveries (last 10):
${deliveries.slice(0, 10).map((d: any) => {
  const productsList = d.products?.map((p: any) => `${p.product?.name || 'Unknown'} (Qty: ${p.quantity})`).join(', ') || 'No products';
  return `- ${productsList} from ${d.from?.name || 'Unknown'} on ${new Date(d.scheduleDate).toLocaleDateString()} (Ref: ${d.reference}) - Status: ${d.status}`;
}).join('\n')}

Recent Transfers (last 10):
${transfers.slice(0, 10).map((t: any) => {
  const productsList = t.products?.map((p: any) => `${p.product?.name || 'Unknown'} (Qty: ${p.quantity})`).join(', ') || 'No products';
  return `- ${productsList} from ${t.from?.name || 'Unknown'} to ${t.to?.name || 'Unknown'} on ${new Date(t.date).toLocaleDateString()} (Ref: ${t.reference}) - Status: ${t.status}`;
}).join('\n')}

Recent Adjustments (last 10):
${adjustments.slice(0, 10).map((a: any) => {
  const productsList = a.products?.map((p: any) => `${p.product?.name || 'Unknown'} (${p.quantityChange > 0 ? '+' : ''}${p.quantityChange})`).join(', ') || 'No products';
  return `- ${productsList} at ${a.location?.name || 'Unknown'} on ${new Date(a.createdAt).toLocaleDateString()} - Reason: ${a.reason} - Status: ${a.status}`;
}).join('\n')}

Please provide helpful, accurate information about inventory management. Use the actual data above to answer questions about recent transactions, stock levels, and product information. Be specific and reference actual numbers, dates, and product names from the context.

Be concise and professional. Format responses clearly with bullet points when appropriate, don't add any unnecessary formatting like markdown or code blocks.
`;

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const chat = model.startChat({
      history: [
        {
          role: 'user',
          parts: [{ text: context }],
        },
        {
          role: 'model',
          parts: [{ text: 'I understand. I\'m ready to assist with inventory management questions using the provided context.' }],
        },
      ],
    });

    const result = await chat.sendMessage(message);
    const response = result.response;
    const text = response.text();

    return NextResponse.json({ response: text });
  } catch (error: any) {
    console.error('Chat error:', error);
    return NextResponse.json(
      { error: 'Failed to process chat message', details: error.message },
      { status: 500 }
    );
  }
}
