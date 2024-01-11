import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { IProduct, Product, ProductStatus } from '../../entities/ProductModel';
import { RoutesHandler } from '../../utils/ErrorHandler';
import { ResponseCodes } from '../../utils/response-codes';
import { getRepository } from 'typeorm';
import { SubCategory } from '../../entities/SubCategoryModel';

export const CreateProduct = async (req: any, res: Response) => {
    try {

        const { data } = req.body

        for (const element of data) {

            try {

                const { maintitle, title, price, disccount_price, shape, carat, colour, clarity, cut, polish, symmetry, flourescence, measurements, cert_number, table, crown_height, pavilian_depth, depth, crown_angle, pavilian_angle, size, size_desc, color_desc, clarity_desc, cut_desc, subcategoryid, innercategoryid, categoryid, productimage, sizeimages, colorimage, clarityimage, cutimage } = element

                const ProductRepo = getRepository(Product);

                const FindProduct = await ProductRepo.createQueryBuilder('Product')
                    .where('Product.maintitle = :maintitle ', { maintitle })
                    .where('Product.title = :title ', { title })
                    .getOne();

                let disccount_percentage = null

                if (!FindProduct) {

                    if (price && disccount_price) {
                        const difference = price - disccount_price;
                        const percentage = (difference / price) * 100;
                        disccount_percentage = percentage
                    }

                    const newProduct: IProduct = ProductRepo.create({
                        maintitle: maintitle,
                        title: title,
                        price: price,
                        disccount_price: disccount_price,
                        disccount_percentage: disccount_percentage ? disccount_percentage : null,
                        shape: shape,
                        carat: carat,
                        colour: colour,
                        clarity: clarity,
                        cut: cut,
                        polish: polish,
                        symmetry: symmetry,
                        flourescence: flourescence,
                        measurements: measurements,
                        cert_number: cert_number,
                        table: table,
                        crown_height: crown_height,
                        pavilian_depth: pavilian_depth,
                        depth: depth,
                        crown_angle: crown_angle,
                        pavilian_angle: pavilian_angle,
                        productimage: productimage,
                        diamond_size: {
                            size: size,
                            size_desc: size_desc,
                            sizeimages: sizeimages
                        },
                        diamond_color: {
                            color_desc: color_desc,
                            colorimage: colorimage,
                        },
                        diamond_clarity: {
                            clarity_desc: clarity_desc,
                            clarityimage: clarityimage,
                        },
                        diamond_cut: {
                            cut_desc: cut_desc,
                            cutimage: cutimage,
                        },
                        categoryid: categoryid
                    })

                    if (innercategoryid) {
                        newProduct.innercategoryid = innercategoryid
                    }

                    if (subcategoryid) {
                        newProduct.subcategoryid = subcategoryid
                    }


                    await ProductRepo.save(newProduct)

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