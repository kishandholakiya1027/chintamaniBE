import { body } from "express-validator";

export const order_create_validator = [
    body('userid').notEmpty().withMessage('userid is required').isUUID()
];