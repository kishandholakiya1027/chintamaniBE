import { body } from "express-validator";

export const Clarity_create_validator = [
    body('name').notEmpty().withMessage('Name is required').isString()
];