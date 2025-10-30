import { body, param } from 'express-validator';

export const productIdParam = [
    param('product_id').isInt({ gt: 0 }).withMessage('product_id must be a positive integer')
];

export const createInventory = [
    body('product_id').isInt({ gt: 0 }).withMessage('product_id must be a positive integer'),
    body('quantity_in_stock').isInt({ min: 0 }).withMessage('quantity_in_stock must be a non-negative integer')
];

export const updateInventory = [
    body('quantity_in_stock').isInt({ min: 0 }).withMessage('quantity_in_stock must be a non-negative integer')
];