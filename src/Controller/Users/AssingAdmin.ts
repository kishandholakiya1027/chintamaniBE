import { Status, User, UserRole } from "../../entities/UserModel";
import { RoutesHandler } from "../../utils/ErrorHandler";
import { getRepository } from "typeorm";
import { Request, Response } from 'express';
import { ResponseCodes } from "../../utils/response-codes";
import { validationResult } from "express-validator";

export const Assing_Admin = (req: any, res: Response, next): Promise<any> => {
    return new Promise(async (resolve, reject) => {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return RoutesHandler.sendError(res, req, errors.array(), ResponseCodes.inputError);
            }

            const { email } = req.body

            const UserRepo = getRepository(User);

            const AssingUserAdmin = await UserRepo.findOne({ where: { email: email } });

            if (AssingUserAdmin) {

                AssingUserAdmin.role = UserRole.Admin;

                const UpdatedbAdmin = await UserRepo.save(AssingUserAdmin);

                if (UpdatedbAdmin) {
                    return RoutesHandler.sendSuccess(res, req, UpdatedbAdmin, "Admin Assing Successfully")
                } else {
                    return RoutesHandler.sendError(res, req, 'Admin Not Updated Some Error', ResponseCodes.saveError);
                }

            } else {
                return RoutesHandler.sendError(res, req, 'Email not found', ResponseCodes.searchError);
            }
        } catch (error) {
            console.log(error, "Error")
            return RoutesHandler.sendError(res, req, 'Internal Server Error', ResponseCodes.serverError);
        }
    })
}