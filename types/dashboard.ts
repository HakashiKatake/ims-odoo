export interface Product {
    _id: string;
    name: string;
    quantity: number;
    price: number;
    minLevel: number;
    category: string;
}

export interface StockOperation {
    _id: string;
    type: 'receipt' | 'delivery' | 'adjustment';
    status: string;
    date: string;
    // Add other fields if needed, though currently unused in the UI
}
