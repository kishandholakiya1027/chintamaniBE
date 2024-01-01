import { body } from "express-validator";

export const Color_create_validator = [
    body('name').notEmpty().withMessage('Name is required').isString()
];