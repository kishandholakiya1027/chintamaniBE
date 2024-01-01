import { body, query } from "express-validator";

export const User_create_validator = [
  body('name').notEmpty().withMessage('Name is required').isString()
];

export const Fetch_SubCategory_To_Innercategory_validator = [
  query('page').optional(),
  query('pageSize').optional(),
  query('subcategoryid').notEmpty().withMessage('Subcategory Id Not Found').isUUID(),
];