import { validationResult } from "express-validator";
import { RoutesHandler } from "../../utils/ErrorHandler";
import { ResponseCodes } from "../../utils/response-codes";
import { Request, Response } from 'express';
import { Shape } from "../../entities/ShapeModel";
import { getRepository } from "typeorm";
import { FileService } from "../../services/backblaze-upload";
const fileService = new FileService();

export const Cteate_Shape = (req: any, res: Response, next): Promise<any> => {
    return new Promise(async (resolve, reject) => {
        try {

            const { name, description } = req.body

            if (!name || !description) {
                return RoutesHandler.sendError(res, req, "All Filed required", ResponseCodes.inputError);
            }

            const ShapeRepo = getRepository(Shape);

            let existingShape = await ShapeRepo.findOne({ where: { name: name } });

            if (existingShape) {
                return RoutesHandler.sendError(res, req, ' Shape already in Exis', ResponseCodes.general);
            }

            // let shapeimage

            // if (req.file) {
            //     const shapeimagesPath = [req.file].map((item: any) => item.path)
            //     shapeimage = await fileService.uploadFileInS3("shape", shapeimagesPath)
            // }

            const qurey = await ShapeRepo.create({
                name: name,
                description: description,
                image: req.file ? `${process.env.IMAGEBASEURL}/upload/${req.file.filename}` : null
            })

            const NewShape = await ShapeRepo.save(qurey);

            if (NewShape) {
                return RoutesHandler.sendSuccess(res, req, NewShape, "Shape Created Successfully")
            }

        } catch (error) {
            console.log(error, "Error")
            return RoutesHandler.sendError(res, req, 'Internal Server Error', ResponseCodes.serverError);
        }
    })
}