import z from 'zod';

export const createUserValidation = z.object({
    user_name: z.string().min(2, 'User name must be at least 2 characters long').max(50, 'User name must be less than 50 characters long').trim(),
    user_email: z.string().email('Invalid email address').trim(),
    user_password: z.string().min(8, 'User password must be at least 8 characters long').max(50, 'User password must be less than 50 characters long').trim(),
});

export const loginUserValidation = z.object({
    user_email: z.string().email('Invalid email address').trim(),
    user_password: z.string().min(8, 'User password must be at least 8 characters long').max(50, 'User password must be less than 50 characters long').trim(),
});