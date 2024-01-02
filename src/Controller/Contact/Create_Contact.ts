import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { RoutesHandler } from '../../utils/ErrorHandler';
import { ResponseCodes } from '../../utils/response-codes';
import { Contact } from '../../entities/ContactModel';
import { getRepository } from 'typeorm';
import { Status } from '../../entities/UserModel';

export const Cteate_Contact = (req: any, res: Response, next): Promise<any> => {
    return new Promise(async (resolve, reject) => {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return RoutesHandler.sendError(res, req, errors.array(), ResponseCodes.inputError);
            }

            const { name, email, phone_number, comment } = req.body

            const ConstactRepo = getRepository(Contact);

            const oldUser = await ConstactRepo.createQueryBuilder('contact')
                .select()
                .where('contact.phone_number = :phone OR contact.email = :email', { phone: phone_number, email: email })
                .andWhere('contact.status = :status', { status: Status.DEFAULT })
                .getOne();

            if (oldUser) {
                const createdAtDate = oldUser.createdAt;

                const currentDate = new Date();
                const isSameDate =
                    createdAtDate.getFullYear() === currentDate.getFullYear() &&
                    createdAtDate.getMonth() === currentDate.getMonth() &&
                    createdAtDate.getDate() === currentDate.getDate();

                if (isSameDate) {
                    return RoutesHandler.sendError(res, req, 'Pendding your contact info', ResponseCodes.saveError);
                } else {
                    oldUser.createdAt = new Date()
                    oldUser.name = name
                    oldUser.email = email
                    oldUser.phone_number = phone_number
                    oldUser.comment = comment

                    await ConstactRepo.save(oldUser)
                        .then((data) => {
                            return RoutesHandler.sendSuccess(res, req, data, 'Contact Added successfully');
                        })
                        .catch((err) => {
                            console.log(err);
                            return RoutesHandler.sendError(res, req, 'failed to create contact', ResponseCodes.saveError);
                        });
                }
            } else {
                const qurey = ConstactRepo.create({
                    name: name,
                    email: email,
                    phone_number: phone_number,
                    comment: comment
                })

                await ConstactRepo.save(qurey)
                    .then((data) => {
                        return RoutesHandler.sendSuccess(res, req, data, 'Contact Added successfully');
                    })
                    .catch((err) => {
                        console.log(err);
                        return RoutesHandler.sendError(res, req, 'failed to create contact', ResponseCodes.saveError);
                    });
            }
        } catch (error) {
            console.log(error, "Error")
            return RoutesHandler.sendError(res, req, 'Internal Server Error', ResponseCodes.serverError);
        }
    })
}