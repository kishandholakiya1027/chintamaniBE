import { validationResult } from "express-validator";
import { RoutesHandler } from "../../utils/ErrorHandler";
import { ResponseCodes } from "../../utils/response-codes";
import { Request, Response } from 'express';
import { getRepository } from "typeorm";
import { Contact } from "../../entities/ContactModel";
import { Status } from "../../entities/UserModel";

export const Fetch_active_Contact = (req: any, res: Response, next): Promise<any> => {
    return new Promise(async (resolve, reject) => {
        try {

            const ContactRepo = getRepository(Contact);

            const page = req.query.page ? parseInt(req.query.page) : 1;
            const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 10;

            const qurey = ContactRepo.createQueryBuilder('Contact')
                .select()
                .where('Contact.status = :status', { status: Status.ACTIVE })
                .skip((page - 1) * pageSize)
                .take(pageSize)

            const [Contactdata, total] = await qurey.getManyAndCount()

            if (!Contactdata || Contactdata.length === 0) {
                return RoutesHandler.sendSuccess(res, req, [], 'Contact Not Found');
            }

            return RoutesHandler.sendSuccess(res, req, { Contactdata, total, page, pageSize }, "Contact Found Successfully")
        } catch (error) {
            console.log(error, "Error")
            return RoutesHandler.sendError(res, req, 'Internal Server Error', ResponseCodes.serverError);
        }
    })
}