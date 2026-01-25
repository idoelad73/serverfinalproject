import z from 'zod';

export const createOrderValidation = z.object({
    products: z.array(z.object({
        product_id: z.string(),
        product_rtp: z.number(),
        quantity: z.number().min(1)
    })),
    user_adress: z.string()
        .min(10, 'Shipping address must be at least 10 characters long')
        .max(100, 'Shipping address must be less than 100 characters long')
        // .regex(/^[a-zA-Z0-9\s,.-]+$/, 'Shipping address must contain only letters, numbers, and common punctuation')
});

export const updateOrderValidation = z.object({
    status: z.enum(['Pending', 'Confirmed',"Processing", 'Shipped', 'Delivered', 'Completed', 'Cancelled']),
    notes: z.string().optional()
});

export const updateOrderValidationParams = z.object({
    id: z.string().min(1, 'Order ID is required').regex(/^[0-9a-fA-F]{24}$/, 'Order ID must be a valid MongoDB ObjectId')
});