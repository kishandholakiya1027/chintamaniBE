import { body, param, query } from "express-validator";

export const Shape_create_validator = [
    body('name').notEmpty().withMessage('Name is required').isString()
];

export const Fetch_Shape_validator = [
    query('page').optional(),
    query('pageSize').optional(),
];

export const Shape_Update_validator = [
    body('name').notEmpty().withMessage('Name is required').isString(),
    body('shapeid').notEmpty().withMessage('Shapeid is required')
];

export const Shape_Remove_validator = [
    param('shapeid').notEmpty().withMessage('Shapeid is required')
];