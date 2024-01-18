import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { IProduct, Product, ProductStatus } from '../../entities/ProductModel';
import { RoutesHandler } from '../../utils/ErrorHandler';
import { ResponseCodes } from '../../utils/response-codes';
import { getRepository } from 'typeorm';
import { SubCategory } from '../../entities/SubCategoryModel';
import { PeoductImageUpload } from '../../utils/Fileservices';
import { FileService } from '../../services/backblaze-upload';
const fileService = new FileService();

export class ProductController {
    constructor() { }

    public async CreateProduct(req: any, res: Response, next): Promise<any> {
        return new Promise(async (resolve, reject) => {
            try {

                const { maintitle, title, price, disccount_price, shape, carat, colour, clarity, cut, polish, symmetry, flourescence, measurements, cert_number, table, crown_height, pavilian_depth, depth, crown_angle, pavilian_angle, size, size_desc, color_desc, clarity_desc, cut_desc, subcategoryid, innercategoryid, categoryid } = req.body

                if (!maintitle || !title || !price || !categoryid || !req.files.sizeimages || !req.files.colorimage || !req.files.clarityimage || !req.files.cutimage || !req.files.productimage || !shape || !carat || !colour || !clarity || !cut || !polish || !symmetry || !flourescence || !measurements || !cert_number || !table || !crown_height || !pavilian_depth || !depth || !crown_angle || !pavilian_angle || !size || !size_desc || !color_desc || !clarity_desc || !cut_desc) {
                    return RoutesHandler.sendError(res, req, "All Filed Required", ResponseCodes.inputError);
                }

                const ProductRepo = getRepository(Product);
                let sizeimages
                let colorimage
                let clarityimage
                let cutimage
                let productimage = []

                if (req.files.sizeimages) {
                    const sizeimagesPath = req.files.sizeimages.map((item: any) => item.path)
                    sizeimages = await fileService.uploadFileInS3("size", sizeimagesPath)
                }

                if (req.files.colorimage) {
                    const colorimagePath = req.files.colorimage.map((item: any) => item.path)
                    colorimage = await fileService.uploadFileInS3("color", colorimagePath)
                }

                if (req.files.clarityimage) {
                    const clarityimagePath = req.files.clarityimage.map((item: any) => item.path)
                    clarityimage = await fileService.uploadFileInS3("clarity", clarityimagePath)
                }

                if (req.files.cutimage) {
                    const cutimagePath = req.files.cutimage.map((item: any) => item.path)
                    cutimage = await fileService.uploadFileInS3("cut", cutimagePath)
                }

                if (req.files.productimage) {
                    const productimagePath = req.files.productimage.map((item: any) => item.path)
                    let productimageUrl = await fileService.uploadFileInS3("product", productimagePath)
                    productimage = productimageUrl.map((item: any) => item.fileName)
                }

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
                            sizeimages: sizeimages[0]?.fileName
                        },
                        diamond_color: {
                            color_desc: color_desc,
                            colorimage: colorimage[0]?.fileName,
                        },
                        diamond_clarity: {
                            clarity_desc: clarity_desc,
                            clarityimage: clarityimage[0]?.fileName,
                        },
                        diamond_cut: {
                            cut_desc: cut_desc,
                            cutimage: cutimage[0]?.fileName,
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
                        .then((data) => {
                            return RoutesHandler.sendSuccess(res, req, data, "Product Successfully Added")
                        })
                        .catch((err) => {
                            console.log(err);
                            return RoutesHandler.sendError(res, req, 'Product Create Some Issue', ResponseCodes.saveError);
                        });

                } else {
                    return RoutesHandler.sendError(res, req, 'Product Already Exist', ResponseCodes.inputError);
                }

            } catch (error) {
                console.log(error, "Error")
                return RoutesHandler.sendError(res, req, 'Internal Server Error', ResponseCodes.serverError);
            }
        });
    }

    public async fetchProduct(req: any, res: Response, next): Promise<any> {
        return new Promise(async (resolve, reject) => {
            try {

                const errors = validationResult(req);

                if (!errors.isEmpty()) {
                    return RoutesHandler.sendError(res, req, errors.array(), ResponseCodes.inputError);
                }

                const { subcategoryid, innnercategoryid, categoryid, minPrice, maxPrice, sort, mincarat, maxcarat, Clarity, Cuts, Color, shape, search } = req.query

                const ProductRepo = getRepository(Product);

                const page = req.query.page ? parseInt(req.query.page) : 1;
                const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 10;

                const qurey = ProductRepo.createQueryBuilder('Product')
                    .leftJoinAndSelect('Product.subcategoryid', 'subcategoryid')
                    .leftJoinAndSelect('Product.categoryid', 'categoryid')
                    .leftJoinAndSelect('Product.innercategoryid', 'innercategoryid')
                    .select()

                if (categoryid) {
                    qurey.where('Product.categoryid = :categoryid ', { categoryid: categoryid })
                }

                if (shape) {
                    qurey.where('Product.shape = :shape ', { shape: shape })
                }

                if (subcategoryid) {
                    qurey.andWhere('Product.subcategoryid = :subcategoryid ', { subcategoryid: subcategoryid })
                }
                if (innnercategoryid) {
                    qurey.andWhere('Product.innnercategoryid = :innnercategoryid ', { innercategoryid: innnercategoryid })

                }
                if (minPrice && maxPrice) {
                    qurey.where('Product.price >= :minPrice', { minPrice: minPrice })
                    qurey.andWhere('Product.price <= :maxPrice', { maxPrice: maxPrice })
                }

                if (Number(sort) === 1) {
                    qurey.orderBy('Product.price', 'ASC')
                }

                if (Number(sort) === 2) {
                    qurey.orderBy('Product.price', 'DESC')
                }

                if (Number(sort) === 3) {
                    qurey.orderBy('Product.createdAt', 'DESC')
                }

                if (mincarat && maxcarat) {
                    qurey.where('Product.carat >= :minCarat', { minCarat: mincarat })
                    qurey.andWhere('Product.carat <= :maxCarat', { maxCarat: maxcarat })
                    qurey.orderBy('Product.carat', 'ASC')
                }

                if (Clarity && Clarity.length) {
                    qurey.andWhere('Product.clarity IN (:...clarity)', { clarity: JSON.parse(Clarity) })
                }

                if (Cuts && Cuts.length) {
                    qurey.andWhere('Product.cut IN (:...cut)', { cut: JSON.parse(Cuts) })
                }

                if (Color && Color.length) {
                    qurey.andWhere('Product.colour IN (:...colour)', { colour: JSON.parse(Color) })
                }

                if (search) {
                    qurey.andWhere('(' +
                        'Product.maintitle LIKE :search OR ' +
                        'Product.title LIKE :search OR ' +
                        'subcategoryid.name LIKE :search OR ' +
                        'categoryid.name LIKE :search OR ' +
                        'innercategoryid.name LIKE :search' +
                        ')', { search: `%${search}%` });

                }

                qurey.skip((page - 1) * pageSize)
                qurey.take(pageSize)

                const [product, total] = await qurey.getManyAndCount()

                if (!product || product.length === 0) {
                    return RoutesHandler.sendError(res, req, 'Product Not Found', ResponseCodes.success);
                }

                return RoutesHandler.sendSuccess(res, req, { product, total, page, pageSize }, "Product Created Successfully")
            } catch (error) {
                console.log(error, "Error")
                return RoutesHandler.sendError(res, req, 'Internal Server Error', ResponseCodes.serverError);
            }
        });
    }

    public async UpdateFile(req: any, res: Response, next): Promise<any> {
        return new Promise(async (resolve, reject) => {
            try {

                if (!req.file) {
                    return RoutesHandler.sendError(res, req, "Images Filed Required", ResponseCodes.inputError);
                }

                let image

                if (req.file) {
                    image = await fileService.uploadFileInS3("product", [req.file.path])
                }

                if (image) {
                    return RoutesHandler.sendSuccess(res, req, { image: image[0].fileName }, "Images SuccessFully Created")
                } else {
                    return RoutesHandler.sendError(res, req, 'Images Not Ganreted', ResponseCodes.inputError);
                }

            } catch (error) {
                console.log(error, "Error")
                return RoutesHandler.sendError(res, req, 'Internal Server Error', ResponseCodes.serverError);
            }
        });
    }

    public async UpdateProduct(req: any, res: Response, next): Promise<any> {
        return new Promise(async (resolve, reject) => {
            try {

                const errors = validationResult(req);

                if (!errors.isEmpty()) {
                    return RoutesHandler.sendError(res, req, errors.array(), ResponseCodes.inputError);
                }

                const { productId, maintitle, title, price, disccount_price, shape, carat, colour, clarity, cut, polish, symmetry, flourescence, measurements, cert_number, table, crown_height, pavilian_depth, depth, crown_angle, pavilian_angle, size, size_desc, color_desc, clarity_desc, cut_desc, subcategoryid, innercategoryid, categoryid, productimage, status, sizeimages, colorimage, clarityimage, cutimage } = req.body

                const productRepo = getRepository(Product);

                const existingProduct = await productRepo.findOne({ where: { id: productId } });

                if (!existingProduct) {
                    return RoutesHandler.sendError(res, req, 'Product does not exist', ResponseCodes.inputError);
                }
                let disccount_percentage = null

                if (price && disccount_price) {
                    const difference = price - disccount_price;
                    const percentage = (difference / price) * 100;
                    disccount_percentage = percentage
                }

                existingProduct.title = title || existingProduct.title;
                existingProduct.maintitle = maintitle || existingProduct.maintitle;
                existingProduct.price = price || existingProduct.price;
                existingProduct.disccount_price = disccount_price || existingProduct.disccount_price;
                existingProduct.disccount_percentage = disccount_percentage || existingProduct.disccount_percentage;
                existingProduct.shape = shape || existingProduct.shape;
                existingProduct.carat = carat || existingProduct.carat;
                existingProduct.colour = colour || existingProduct.colour;
                existingProduct.clarity = clarity || existingProduct.clarity;
                existingProduct.cut = cut || existingProduct.cut;
                existingProduct.polish = polish || existingProduct.polish;
                existingProduct.symmetry = symmetry || existingProduct.symmetry;
                existingProduct.flourescence = flourescence || existingProduct.flourescence;
                existingProduct.measurements = measurements || existingProduct.measurements;
                existingProduct.cert_number = cert_number || existingProduct.cert_number;
                existingProduct.table = table || existingProduct.table;
                existingProduct.crown_height = crown_height || existingProduct.crown_height;
                existingProduct.pavilian_depth = pavilian_depth || existingProduct.pavilian_depth;
                existingProduct.depth = depth || existingProduct.depth;
                existingProduct.crown_angle = crown_angle || existingProduct.crown_angle;
                existingProduct.pavilian_angle = pavilian_angle || existingProduct.pavilian_angle;
                existingProduct.productimage = productimage || existingProduct.productimage;
                existingProduct.status = Number(status) || existingProduct.status;
                existingProduct.diamond_size.size = size || existingProduct.diamond_size.size;
                existingProduct.diamond_size.size_desc = size_desc || existingProduct.diamond_size.size_desc;
                existingProduct.diamond_size.sizeimages = sizeimages || existingProduct.diamond_size.sizeimages;
                existingProduct.diamond_color.color_desc = color_desc || existingProduct.diamond_color.color_desc;
                existingProduct.diamond_color.colorimage = colorimage || existingProduct.diamond_color.colorimage;
                existingProduct.diamond_clarity.clarity_desc = clarity_desc || existingProduct.diamond_clarity.clarity_desc;
                existingProduct.diamond_clarity.clarityimage = clarityimage || existingProduct.diamond_clarity.clarityimage;
                existingProduct.diamond_cut.cut_desc = cut_desc || existingProduct.diamond_cut.cut_desc;
                existingProduct.diamond_cut.cutimage = cutimage || existingProduct.diamond_cut.cutimage;
                existingProduct.subcategoryid = subcategoryid || existingProduct.subcategoryid;
                existingProduct.innercategoryid = innercategoryid || existingProduct.innercategoryid;
                existingProduct.categoryid = categoryid || existingProduct.categoryid;

                await productRepo.save(existingProduct)
                    .then((data) => {
                        return RoutesHandler.sendSuccess(res, req, data, 'Product updated successfully');
                    })
                    .catch((err) => {
                        console.log(err);
                        return RoutesHandler.sendError(res, req, 'Failed to update product', ResponseCodes.saveError);
                    });

            } catch (error) {
                console.log(error, 'Error');
                return RoutesHandler.sendError(res, req, 'Internal Server Error', ResponseCodes.serverError);
            }
        });
    }

    public async DeleteProduct(req: any, res: Response, next): Promise<any> {
        return new Promise(async (resolve, reject) => {
            try {

                const errors = validationResult(req);

                if (!errors.isEmpty()) {
                    return RoutesHandler.sendError(res, req, errors.array(), ResponseCodes.inputError);
                }

                const productId = req.params.productId;

                const productRepo = getRepository(Product);

                const productToDelete = await productRepo.findOne({ where: { id: productId } });

                if (!productToDelete) {
                    return RoutesHandler.sendError(res, req, 'Product not found', ResponseCodes.inputError);
                }

                await productRepo.remove(productToDelete)
                    .then(() => {
                        return RoutesHandler.sendSuccess(res, req, null, 'Product deleted successfully');
                    })
                    .catch((err) => {
                        console.log(err);
                        return RoutesHandler.sendError(res, req, 'Failed to delete product', ResponseCodes.serverError);
                    });
            } catch (error) {
                console.log(error, 'Error');
                return RoutesHandler.sendError(res, req, 'Internal Server Error', ResponseCodes.serverError);
            }
        });
    }

    public async single_fetchProduct(req: any, res: Response, next): Promise<any> {
        return new Promise(async (resolve, reject) => {
            try {

                const errors = validationResult(req);

                if (!errors.isEmpty()) {
                    return RoutesHandler.sendError(res, req, errors.array(), ResponseCodes.inputError);
                }

                const { productId } = req.params

                const ProductRepo = getRepository(Product);

                const qurey = ProductRepo.createQueryBuilder('Product')
                    .leftJoinAndSelect('Product.subcategoryid', 'subcategoryid')
                    .leftJoinAndSelect('Product.categoryid', 'categoryid')
                    .leftJoinAndSelect('Product.innercategoryid', 'innercategoryid')
                    .where('Product.id = :id ', { id: productId })
                    .select()

                const product = await qurey.getOne()

                if (!product) {
                    return RoutesHandler.sendError(res, req, 'Product Not Found', ResponseCodes.success);
                }

                return RoutesHandler.sendSuccess(res, req, product, "Product Found Successfully")
            } catch (error) {
                console.log(error, "Error")
                return RoutesHandler.sendError(res, req, 'Internal Server Error', ResponseCodes.serverError);
            }
        });
    }
}