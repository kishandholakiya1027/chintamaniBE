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

        const originalname = req.file.originalname;
        const includesCVD = originalname.includes('CVD');

        if (includesCVD) {

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

                    // const FindProduct = await ProductRepo.createQueryBuilder('Product')
                    //     .where('Product.maintitle = :maintitle', { maintitle: A })
                    //     .where('Product.title = :title', { title: B })
                    //     .getOne();

                    let disccount_percentage = null

                    // if (!FindProduct) {

                        // if (C && D) {
                        //     const difference = C - D;
                        //     const percentage = (difference / C) * 100;
                        //     disccount_percentage = percentage
                        // }

                        const category: any = 'e62ba09e-761d-447f-a447-fcbb5cb7e063'
                        const subcategory: any = '2afbb514-4c4e-4604-bcbd-72b7991d2a79'
                        const innnercategory: any = 'c217e766-6180-4181-8cef-1873754aa73d'

                        const newProduct = ProductRepo.create({
                            srno: A,
                            location: B,
                            stock: C,
                            report: P,
                            laser_inscription: T,
                            lab: Q,
                            maintitle: S,
                            title: S,
                            price: L,
                            disccount_price: null,
                            disccount_percentage: disccount_percentage ? disccount_percentage : null,
                            shape: D,
                            carat: F,
                            colour: F,
                            clarity: G,
                            cut: H,
                            polish: I,
                            symmetry: J,
                            flourescence: K,
                            measurements: O,
                            cert_number: N,
                            table: N,
                            crown_height: P,
                            pavilian_depth: Q,
                            depth: M,
                            crown_angle: S,
                            pavilian_angle: T,
                            productimage: [],
                            productvideo: U,
                            diamond_certificate: R,
                            diamond_size: {
                                size: E,
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
                            categoryid: category,
                            subcategoryid: subcategory,
                            innercategoryid: innnercategory,

                        })

                        await ProductRepo.save(newProduct).catch((error) => {
                            console.log(error, "error")
                        })

                    // } else {
                    //     console.log("Product Alredy Exist")
                    // }

                } catch (error) {
                    console.log(error, "Error")
                }
            }

        } else {

            const workbook = XLSX.readFile(req.file.path);
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];

            const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet, { header: 'A' });

            if (!jsonData && !jsonData.length) {
                return RoutesHandler.sendError(res, req, 'Data Not Found', ResponseCodes.serverError);
            }
            const newJsonData = jsonData.slice(1)

            console.log(newJsonData[0], "newJsonData")

            for (const element of newJsonData) {

                try {

                    const { A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T, U, V, W, X, Y, Z, AB, AC, AD, AE, AF, AG, AA, AH, AK, AI, AJ, AL, AM, AN, AO } = element

                    const ProductRepo = getRepository(Product);
                    const categoryid: any = 'e62ba09e-761d-447f-a447-fcbb5cb7e063'
                    const subcategoryid: any = '353b626c-c7fc-4ff5-822d-b05ce44995d4'

                    // const FindProduct = await ProductRepo.createQueryBuilder('Product')
                    //     .where('Product.srno = :srno OR Product.subcategoryid = :subcategoryid', { srno: A, subcategoryid: subcategoryid })
                    //     .getOne();

                    // let disccount_percentage = null

                    // if (!FindProduct) {

                    const newProduct = ProductRepo.create({
                        srno: A,
                        location: B,
                        stock: C,
                        report_date: AM,
                        report: Y,
                        laser_inscription: AL,
                        lab: Z,
                        girdle: AA,
                        girdle_con: AB,
                        girdle_per: AC,
                        culet: AD,
                        maintitle: AK,
                        title: AK,
                        price: P,
                        rap: M,
                        rap_disccount: N,
                        per_ct: O,
                        disccount_price: null,
                        disccount_percentage: null,
                        shape: D,
                        carat: F,
                        colour: F,
                        clarity: G,
                        cut: H,
                        polish: I,
                        symmetry: J,
                        flourescence: K,
                        flourescence_Color: L,
                        measurements: S,
                        table_inclusion: T,
                        side_inclusion: U,
                        feather_inclusion: V,
                        tinge: W,
                        eyeclean: X,
                        cert_number: N,
                        table: R,
                        crown_height: AF,
                        pavilian_depth: AH,
                        depth: Q,
                        crown_angle: AE,
                        pavilian_angle: AG,
                        star_length: AI,
                        lower: AJ,
                        productimage: [AO],
                        productvideo: AN,
                        diamond_size: {
                            size: E,
                        },
                        categoryid: categoryid
                    })

                    if (Z) {
                        newProduct.subcategoryid = subcategoryid
                    }


                    await ProductRepo.save(newProduct).catch((error) => {
                        console.log(error, "error")
                    })

                    // } else {
                    //     console.log("Product Alredy Exist")
                    // }

                } catch (error) {
                    console.log(error, "Error")
                }
            }
        }

        return RoutesHandler.sendSuccess(res, req, null, "Product Successfully Created")

    } catch (error) {
        console.log(error, "Error")
        return RoutesHandler.sendError(res, req, 'Internal Server Error', ResponseCodes.serverError);
    }
}