import { body } from "express-validator";

export const User_create_validator = [
  body('firstname').notEmpty().withMessage('firstname is required').isString()
];