/**
 * SalesValidators - express-validator rules for sales endpoints
 * Exports:
 * - idParam: param validator for sale_id
 * - userIdParam: param validator for user_id
 * - upsertSales: body validators for creating/updating sales
 * - applyDiscountValidator: body validator for discount application
 * - getSaleBetweenDates: query validators for date range (DD/MM/YYYY)
 */
import { param, body, query } from 'express-validator';

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

export const applyDiscountValidator = [
    body('discount_percentage').isFloat({ min: 0, max: 100 }).withMessage('Discount percentage must be between 0 and 100')
];
export const getSaleBetweenDates = [
    query('startDate')
        .notEmpty()
        .withMessage('startDate is required')
        .matches(/^\d{2}\/\d{2}\/\d{4}$/)
        .withMessage('startDate must be in DD/MM/YYYY format (e.g., 01/10/2025)'),
    
    query('endDate')
        .notEmpty()
        .withMessage('endDate is required')
        .matches(/^\d{2}\/\d{2}\/\d{4}$/)
        .withMessage('endDate must be in DD/MM/YYYY format (e.g., 31/10/2025)')
];