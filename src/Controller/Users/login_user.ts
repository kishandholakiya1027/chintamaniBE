import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { User } from '../../entities/UserModel';
import { RoutesHandler } from '../../utils/ErrorHandler';
import { ResponseCodes } from '../../utils/response-codes';
import { getRepository } from 'typeorm';
import { comparepassword } from '../../utils/bcrypt';
import { authController } from '../../utils/auth';

export const Login = (req: any, res: Response, next): Promise<any> => {
    return new Promise(async (resolve, reject) => {
        try {

            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return res.status(400).json({ success: false, errors: errors.array() });
            }

            const { email, password } = req.body

            const UserRepo = getRepository(User)


            const qurey = await UserRepo.findOne({ where: { email: email } })

            if (qurey) {

                const comparePassword = await comparepassword(password, qurey.password)

                if (comparePassword) {

                    let accessToken = authController.generateAuthToken(qurey.id)

                    return RoutesHandler.sendSuccess(res, req, { qurey, accessToken }, "User Login Successfully");

                } else {
                    return RoutesHandler.sendError(res, req, 'Password is wrong', ResponseCodes.general);
                }
            } else {
                return RoutesHandler.sendError(res, req, 'User Not Found Try to Registration', ResponseCodes.general);
            }

        } catch (error) {
            console.log(error, "Error")
            return RoutesHandler.sendError(res, req, 'Internal Server Error', ResponseCodes.serverError);
        }
    })
}