import * as express from "express";
import { Create_Currency } from "../Controller/Currency/create_Currency";
import { fetch_Currency } from "../Controller/Currency/fetch_Currency";
import { update_Currency } from "../Controller/Currency/update_Currency";
import { Currency_create_validator } from "../Validator/CurrencyValidator";
import { AUTH } from "../utils/auth";

const Routes = express.Router();

Routes.post("/create", AUTH, Currency_create_validator, Create_Currency);

Routes.get("/fetch", fetch_Currency);

Routes.patch("/update/:currencyid", update_Currency);

export default Routes;
