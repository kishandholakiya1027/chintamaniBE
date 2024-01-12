import { getRepository } from 'typeorm';
import { Request, Response } from 'express';
import { FORGET_PASSWORD, Status, User } from '../../entities/UserModel';
import { validationResult } from 'express-validator';
import { authController } from '../../utils/auth';
import { bcryptpassword, comparepassword } from '../../utils/bcrypt';
import { ResponseCodes } from '../../utils/response-codes';
import { RoutesHandler } from '../../utils/ErrorHandler';

export const Changes_password = (req: any, res: Response, next): Promise<any> => {
    return new Promise(async (resolve, reject) => {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return res.status(400).json({ success: false, errors: errors.array() });
            }

            const { email, old_password, new_pass, confirm_pass } = req.body

            const UserRepo = getRepository(User)

            const oldUser = await UserRepo.findOne({ where: { email: email } })

            if (!oldUser) {
                return RoutesHandler.sendError(res, req, 'User Not Found', ResponseCodes.inputError);
            }

            const comparePassword = await comparepassword(old_password, oldUser.password)

            if (!comparePassword) {
                return RoutesHandler.sendError(res, req, 'Old Password Not Matching', ResponseCodes.inputError);
            }

            if (!(new_pass == confirm_pass)) {
                return RoutesHandler.sendError(res, req, 'Password and confirm Password Not Matching', ResponseCodes.inputError);
            }

            if (oldUser) {

                const hashedPassword = await bcryptpassword(new_pass)

                oldUser.password = hashedPassword

                await UserRepo.save(oldUser)
                    .then((data) => {
                        return RoutesHandler.sendSuccess(res, req, data, 'Password changd SuccesFully');
                    })
                    .catch((err) => {
                        console.log(err);
                        return RoutesHandler.sendError(res, req, 'Failed to update Password', ResponseCodes.saveError);
                    });

            } else {
                return RoutesHandler.sendError(res, req, 'User Not Found', ResponseCodes.general);
            }

        } catch (error) {
            console.log(error, "Error")
            return RoutesHandler.sendError(res, req, 'Internal Server Error', ResponseCodes.serverError);
        }
    })
}