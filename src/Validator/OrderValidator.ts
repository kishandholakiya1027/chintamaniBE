import { body, param, query } from "express-validator";

export const order_create_validator = [
    body('userid').notEmpty().withMessage('userid is required').isUUID()
];

export const order_fetch_validator = [
    query('orderstatus').optional(),
];

export const single_order_validator = [
    param('orderid').notEmpty().withMessage('orderid is required')
];

export const User_single_order_validator = [
    param('userid').notEmpty().withMessage('userid is required')
];

export const update_single_order_validator = [
    body('orderid').notEmpty().withMessage('orderid is required')
];