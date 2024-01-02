import { body } from "express-validator";

export const User_create_validator = [
  body('email').notEmpty().withMessage('email is required').isString()
];