import { validationResult } from "express-validator";
import { RoutesHandler } from "../../utils/ErrorHandler";
import { ResponseCodes } from "../../utils/response-codes";
import { Request, Response } from 'express';
import { getRepository } from "typeorm";
import { Contact } from "../../entities/ContactModel";

export const Update_active_Contact = (req: any, res: Response, next): Promise<any> => {
    return new Promise(async (resolve, reject) => {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return RoutesHandler.sendError(res, req, errors.array(), ResponseCodes.inputError);
            }

            const { contactid, status } = req.body

            const ContactRepo = getRepository(Contact);

            const existingContact = await ContactRepo.findOne({ where: { id: contactid } });

            existingContact.status = Number(status) || existingContact.status

            await ContactRepo.save(existingContact)
                .then((data) => {
                    return RoutesHandler.sendSuccess(res, req, data, 'Contact updated successfully');
                })
                .catch((err) => {
                    console.log(err);
                    return RoutesHandler.sendError(res, req, 'Failed to update Contact', ResponseCodes.saveError);
                });

        } catch (error) {
            console.log(error, "Error")
            return RoutesHandler.sendError(res, req, 'Internal Server Error', ResponseCodes.serverError);
        }
    })
}