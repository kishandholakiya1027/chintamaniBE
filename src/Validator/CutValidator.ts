import { body, param, query } from "express-validator";

export const Cut_create_validator = [
    body('name').notEmpty().withMessage('Name is required').isString()
];

export const Fetch_Cut_validator = [
    query('page').optional(),
    query('pageSize').optional(),
];

export const Cut_Update_validator = [
    body('name').notEmpty().withMessage('Name is required').isString(),
    body('cutid').notEmpty().withMessage('Cutid is required')
];

export const Cut_Remove_validator = [
    param('cutid').notEmpty().withMessage('Cutid is required')
];