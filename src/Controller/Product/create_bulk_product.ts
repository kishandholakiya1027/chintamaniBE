import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { IProduct, Product, ProductStatus } from '../../entities/ProductModel';
import { RoutesHandler } from '../../utils/ErrorHandler';
import { ResponseCodes } from '../../utils/response-codes';
import { getRepository } from 'typeorm';
import { SubCategory } from '../../entities/SubCategoryModel';
import * as XLSX from 'xlsx';

export const Create_bulk_Product = async (req: any, res: Response) => {
    try {

        const workbook = XLSX.readFile(req.file.path);
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet, { header: 'A' });

        if (!jsonData && !jsonData.length) {
            return RoutesHandler.sendError(res, req, 'Data Not Found', ResponseCodes.serverError);
        }
        const newJsonData = jsonData.slice(1)

        for (const element of newJsonData) {

            try {

                const { A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T, U, V, W, X, Y, Z, AB, AC, AD, AE, AF, AG, AA } = element

                const ProductRepo = getRepository(Product);

                const FindProduct = await ProductRepo.createQueryBuilder('Product')
                    .where('Product.maintitle = :maintitle', { maintitle: A })
                    .where('Product.title = :title', { title: B })
                    .getOne();

                let disccount_percentage = null

                if (!FindProduct) {

                    if (C && D) {
                        const difference = C - D;
                        const percentage = (difference / C) * 100;
                        disccount_percentage = percentage
                    }

                    const newProduct = ProductRepo.create({
                        maintitle: A,
                        title: B,
                        price: C,
                        disccount_price: D,
                        disccount_percentage: disccount_percentage ? disccount_percentage : null,
                        shape: E,
                        carat: F,
                        colour: G,
                        clarity: H,
                        cut: I,
                        polish: J,
                        symmetry: K,
                        flourescence: L,
                        measurements: M,
                        cert_number: N,
                        table: O,
                        crown_height: P,
                        pavilian_depth: Q,
                        depth: R,
                        crown_angle: S,
                        pavilian_angle: T,
                        productimage: [AC],
                        diamond_size: {
                            size: U,
                            size_desc: V,
                            sizeimages: AD
                        },
                        diamond_color: {
                            color_desc: W,
                            colorimage: AE,
                        },
                        diamond_clarity: {
                            clarity_desc: X,
                            clarityimage: AF,
                        },
                        diamond_cut: {
                            cut_desc: Y,
                            cutimage: AG,
                        },
                        categoryid: AB
                    })

                    if (AA) {
                        newProduct.innercategoryid = AA
                    }

                    if (Z) {
                        newProduct.subcategoryid = Z
                    }


                    await ProductRepo.save(newProduct).catch((error) => {
                        console.log(error, "error")
                    })

                } else {
                    console.log("Product Alredy Exist")
                }

            } catch (error) {
                console.log(error, "Error")
            }
        }

        return RoutesHandler.sendSuccess(res, req, null, "Product Successfully Created")

    } catch (error) {
        console.log(error, "Error")
        return RoutesHandler.sendError(res, req, 'Internal Server Error', ResponseCodes.serverError);
    }

}