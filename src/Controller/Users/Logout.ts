import { Status, User, UserRole } from "../../entities/UserModel";
import { RoutesHandler } from "../../utils/ErrorHandler";
import { getRepository } from "typeorm";
import { Request, Response } from 'express';
import { ResponseCodes } from "../../utils/response-codes";
import { validationResult } from "express-validator";


export const Logout_User = (req: any, res: Response, next): Promise<any> => {
    return new Promise(async (resolve, reject) => {
        try {

            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return RoutesHandler.sendError(res, req, errors.array(), ResponseCodes.inputError);
            }

            const { userid } = req.body

            const UserRepo = getRepository(User);

            const qurey = UserRepo.createQueryBuilder('User')
                .select()
                .where('User.status = :status', { status: Status.ACTIVE })
                .where('User.id = :id', { id: userid })

            const userdata = await qurey.getOne()

            if (!userdata) {
                return RoutesHandler.sendError(res, req, 'User Not Found', ResponseCodes.searchError);
            }

            return RoutesHandler.sendSuccess(res, req, true, "User Logout")

        } catch (error) {
            console.log(error, "Error")
            return RoutesHandler.sendError(res, req, 'Internal Server Error', ResponseCodes.serverError);
        }
    })
}