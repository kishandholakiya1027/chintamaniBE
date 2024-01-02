import { body, param, query } from "express-validator";

export const Color_create_validator = [
    body('name').notEmpty().withMessage('Name is required').isString()
];

export const Fetch_Color_validator = [
    query('page').optional(),
    query('pageSize').optional(),
];

export const Color_Update_validator = [
    body('name').notEmpty().withMessage('Name is required').isString(),
    body('colorid').notEmpty().withMessage('Colorid is required')
];

export const Color_Remove_validator = [
    param('colorid').notEmpty().withMessage('Colorid is required')
];