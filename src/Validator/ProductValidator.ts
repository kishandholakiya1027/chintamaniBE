import { body, param, query } from "express-validator";

export const product_create_validator = [
    body('maintitle').notEmpty().withMessage('maintitle is required').isString(),
    body('title').notEmpty().withMessage('title is required').isString(),
    body('price').notEmpty().withMessage('Price is required').isString(),
    body('categoryid').notEmpty().withMessage('subcategory id is required')
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