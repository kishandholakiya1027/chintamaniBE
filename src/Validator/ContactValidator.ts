import { body, param, query } from "express-validator";

export const Contact_create_validator = [
    body('name').notEmpty().withMessage('Name is required').isString(),
    body('email').notEmpty().withMessage('email is required').isString().isEmail(),
    body('phone_number').notEmpty().withMessage('phone_number is required').isString(),
    body('comment').notEmpty().withMessage('comment is required').isString(),
];

export const Fetch_Contact_validator = [
    query('page').optional(),
    query('pageSize').optional(),
];

export const Remove_Contact_validator = [
    param('contactid').notEmpty().withMessage('Contactid is required')
];

export const Update_Contact_validator = [
    body('contactid').notEmpty().withMessage('contactid is required'),
    body('status').notEmpty().withMessage('status is required')
];
