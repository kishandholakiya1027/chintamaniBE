import { Status, User, UserRole } from "../../entities/UserModel";
import { RoutesHandler } from "../../utils/ErrorHandler";
import { getRepository } from "typeorm";
import { Request, Response } from 'express';
import { ResponseCodes } from "../../utils/response-codes";


export const Fetch_Active_Admin = (req: any, res: Response, next): Promise<any> => {
    return new Promise(async (resolve, reject) => {
        try {

            const UserRepo = getRepository(User);

            const page = req.query.page ? parseInt(req.query.page) : 1;
            const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 10;

            const qurey = UserRepo.createQueryBuilder('User')
                .select()
                .where('User.status = :status', { status: Status.ACTIVE })
                .where('User.role = :role', { role: UserRole.Admin })
                .skip((page - 1) * pageSize)
                .take(pageSize)

            const [admindata, total] = await qurey.getManyAndCount()

            if (!admindata || admindata.length === 0) {
                return RoutesHandler.sendSuccess(res, req, [], 'Admin Not Found');
            }

            return RoutesHandler.sendSuccess(res, req, { admindata, total, page, pageSize }, "Admin Found Successfully")
        } catch (error) {
            console.log(error, "Error")
            return RoutesHandler.sendError(res, req, 'Internal Server Error', ResponseCodes.serverError);
        }
    })
}