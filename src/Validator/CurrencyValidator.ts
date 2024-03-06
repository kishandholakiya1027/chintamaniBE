import { body } from "express-validator";

export const Currency_create_validator = [
  body("name").notEmpty().withMessage("Name is required").isString(),
];
