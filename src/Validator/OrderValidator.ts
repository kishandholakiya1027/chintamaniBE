import { body, param } from "express-validator";

export const order_create_validator = [
    body('userid').notEmpty().withMessage('userid is required').isUUID()
];

export const single_order_validator = [
    param('orderid').notEmpty().withMessage('orderid is required')
];