import { Status, User, UserRole } from "../../entities/UserModel";
import { RoutesHandler } from "../../utils/ErrorHandler";
import { getRepository } from "typeorm";
import { Request, Response } from 'express';
import { ResponseCodes } from "../../utils/response-codes";
import { validationResult } from "express-validator";


export const Fetch_single_Active_User = (req: any, res: Response, next): Promise<any> => {
    return new Promise(async (resolve, reject) => {
        try {

            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return RoutesHandler.sendError(res, req, errors.array(), ResponseCodes.inputError);
            }

            const { userid } = req.params

            const UserRepo = getRepository(User);

            const qurey = UserRepo.createQueryBuilder('User')
                .select()
                .where('User.id = :id AND User.status = :status', { id: userid, status: Status.ACTIVE })

            const userdata = await qurey.getOne()

            if (!userdata) {
                return RoutesHandler.sendSuccess(res, req, [], 'User Not Found');
            }

            return RoutesHandler.sendSuccess(res, req, userdata, "User Found Successfully")
        } catch (error) {
            console.log(error, "Error")
            return RoutesHandler.sendError(res, req, 'Internal Server Error', ResponseCodes.serverError);
        }
    })
}