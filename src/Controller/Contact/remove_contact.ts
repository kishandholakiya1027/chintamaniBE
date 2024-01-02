import { validationResult } from "express-validator";
import { RoutesHandler } from "../../utils/ErrorHandler";
import { ResponseCodes } from "../../utils/response-codes";
import { Request, Response } from 'express';
import { Contact } from "../../entities/ContactModel";
import { getRepository } from "typeorm";

export const Remove_active_Contact = (req: any, res: Response, next): Promise<any> => {
    return new Promise(async (resolve, reject) => {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return RoutesHandler.sendError(res, req, errors.array(), ResponseCodes.inputError);
            }

            const { contactid } = req.params;

            const ContactRepo = getRepository(Contact);

            const RemoveContact = await ContactRepo.findOne({ where: { id: contactid } });

            if (!RemoveContact) {
                return RoutesHandler.sendError(res, req, 'Contact not found', ResponseCodes.inputError);
            }

            await ContactRepo.remove(RemoveContact)
                .then(() => {
                    return RoutesHandler.sendSuccess(res, req, null, 'Contact Remove successfully');
                })
                .catch((err) => {
                    console.log(err);
                    return RoutesHandler.sendError(res, req, 'Failed to delete Contact', ResponseCodes.serverError);
                });
                
        } catch (error) {
            console.log(error, "Error")
            return RoutesHandler.sendError(res, req, 'Internal Server Error', ResponseCodes.serverError);
        }
    })
}