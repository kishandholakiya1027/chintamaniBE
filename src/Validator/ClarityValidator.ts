import { body, param, query } from "express-validator";

export const Clarity_create_validator = [
    body('name').notEmpty().withMessage('Name is required').isString()
];

export const Fetch_clarity_validator = [
    query('page').optional(),
    query('pageSize').optional(),
];

export const Clarity_Update_validator = [
    body('name').notEmpty().withMessage('Name is required').isString(),
    body('clarityid').notEmpty().withMessage('clarityid is required')
];

export const Clarity_Remove_validator = [
    param('clarityid').notEmpty().withMessage('clarityid is required')
];