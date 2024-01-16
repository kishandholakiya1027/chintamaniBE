import { body, param, query } from "express-validator";

export const product_create_validator = [
    body('maintitle').notEmpty().withMessage('maintitle is required').isString(),
    body('title').notEmpty().withMessage('title is required').isString(),
    body('price').notEmpty().withMessage('Price is required').isNumeric(),
    body('categoryid').notEmpty().withMessage('subcategory id is required').isUUID()
];

export const fetch_product_create_validator = [
    query('page').optional(),
    query('pageSize').optional(),
    query('categoryid').optional(),
    query('subcategoryid').optional(),
    query('innnercategoryid').optional()
];

export const update_product_validator = [
    body('productId').notEmpty().withMessage('Product Id Is required'),
];

export const delete_product_validator = [
    param('productId').notEmpty().withMessage('Product Id Is required'),
];

export const fetch_trending_diamonds_product_create_validator = [
    query('categoryid').optional(),
    query('shape').optional(),
    query('Clarity').optional(),
    query('Color').optional(),
    query('Cuts').optional()
];
