import { Status, User } from "../../entities/UserModel";
import { RoutesHandler } from "../../utils/ErrorHandler";
import { getRepository } from "typeorm";
import { Request, Response } from 'express';
import { ResponseCodes } from "../../utils/response-codes";


export const Fetch_Active_User = (req: any, res: Response, next): Promise<any> => {
    return new Promise(async (resolve, reject) => {
        try {

            const UserRepo = getRepository(User);

            const page = req.query.page ? parseInt(req.query.page) : 1;
            const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 10;

            const qurey = UserRepo.createQueryBuilder('User')
                .select()
                .where('User.status = :status', { status: Status.ACTIVE })
                .skip((page - 1) * pageSize)
                .take(pageSize)

            const [userdata, total] = await qurey.getManyAndCount()

            if (!userdata || userdata.length === 0) {
                return RoutesHandler.sendSuccess(res, req, [], 'User Not Found');
            }

            return RoutesHandler.sendSuccess(res, req, { userdata, total, page, pageSize }, "User Found Successfully")
        } catch (error) {
            console.log(error, "Error")
            return RoutesHandler.sendError(res, req, 'Internal Server Error', ResponseCodes.serverError);
        }
    })
}