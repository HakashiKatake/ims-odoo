import { Product, StockOperation } from '../types/dashboard';

/**
 * Analyzes inventory data and answers user questions using the Gemini AI API
 * @param inventory - Array of products in the inventory
 * @param history - Array of stock operations (receipts, deliveries, adjustments)
 * @param userMessage - The user's question or request
 * @returns AI-generated response as a string
 */
export async function analyzeInventory(
    inventory: Product[],
    history: StockOperation[],
    userMessage: string
): Promise<string> {
    try {
        // Call the existing chat API endpoint
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: userMessage,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to get AI response');
        }

        const data = await response.json();
        return data.response || 'Sorry, I could not generate a response.';
    } catch (error) {
        console.error('Error analyzing inventory:', error);
        return 'Sorry, I encountered an error while processing your request. Please try again.';
    }
}
