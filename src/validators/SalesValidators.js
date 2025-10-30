import { param, body } from 'express-validator';

export const idParam = [
    param('sale_id').isInt({ gt: 0 }).withMessage('sale_id must be a positive integer')
];

export const userIdParam = [
    param('user_id').isInt({ gt: 0 }).withMessage('user_id must be a positive integer')
];

export const upsertSales = [
    body('user_id').optional().isInt({ gt: 0 }).withMessage('user_id must be a positive integer'),
    body('total_amount').optional().isFloat({ gt: 0 }).withMessage('total_amount must be a positive number if provided'),
    body('sale_date').optional().isISO8601().withMessage('sale_date must be a valid date (ISO 8601 format)')
];