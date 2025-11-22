import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dbConnect from '@/lib/db';
import Product from '@/models/Product';
import Stock from '@/models/Stock';
import Location from '@/models/Location';

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

    // Build context from inventory data
    const [products, stockData, locations] = await Promise.all([
      Product.find().limit(50).lean(),
      Stock.find().populate('product').populate('location').limit(50).lean(),
      Location.find().populate('warehouse').limit(20).lean(),
    ]);

    const context = `
You are an intelligent inventory management assistant for StockMaster IMS. You help warehouse managers and staff with inventory-related questions.

Current Inventory Context:
- Total Products: ${products.length}
- Products in Stock: ${stockData.length} records
- Locations: ${locations.length}

Sample Products (first 10):
${products.slice(0, 10).map((p: any) => `- ${p.name} (SKU: ${p.sku}, Min Stock: ${p.minStockLevel})`).join('\n')}

Sample Stock Levels (first 10):
${stockData.slice(0, 10).map((s: any) => `- ${s.product?.name || 'Unknown'} at ${s.location?.name || 'Unknown'}: ${s.quantity} units`).join('\n')}

Available Locations:
${locations.map((l: any) => `- ${l.name} (${l.shortCode}) in ${l.warehouse?.name || 'Unknown'}`).join('\n')}

Please provide helpful, accurate information about inventory management. If asked about specific products, locations, or stock levels, use the context above. If you don't have specific data, provide general guidance about inventory best practices.

Be concise and professional. Format responses clearly with bullet points when appropriate.
`;

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

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
