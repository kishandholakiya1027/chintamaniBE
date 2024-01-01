import { body, param } from "express-validator";

export const Create_Cart_validator = [
    body('userid').notEmpty().withMessage('userid is required'),
    body('productid').notEmpty().withMessage('productid is required')
];

export const Fetch_Cart_validator = [
    param('userid').notEmpty().withMessage('user is required')
];