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

                const { maintitle, title, price, disccount_price, shape, carat, colour, clarity, cut, polish, symmetry, flourescence, measurements, cert_number, table, crown_height, pavilian_depth, depth, crown_angle, pavilian_angle, size, size_desc, color_desc, clarity_desc, cut_desc, subcategoryid, innercategoryid, categoryid, customized, srno,location,stock,stone,rap,rap_disccount,per_ct,flourescence_Color,table_inclusion,side_inclusion,feather_inclusion,tinge,eyeclean,girdle,girdle_con,girdle_per,culet,report,report_date,laser_inscription,lab,star_length,lower } = req.body

                if (!maintitle || !title || !price || !categoryid) {
                    return RoutesHandler.sendError(res, req, "All Filed Required", ResponseCodes.inputError);
                }

                const ProductRepo = getRepository(Product);
                let sizeimages
                let diamond_certificate
                let colorimage
                let clarityimage
                let cutimage
                let productvideo
                let productimage = []

                if (req.files.sizeimages) {
                    const sizeimagesPath = req.files.sizeimages.map((item: any) => item.path)
                    sizeimages = await fileService.uploadFileInS3("size", sizeimagesPath)
                }

                if (req?.files?.diamond_certificate) {
                    const diamond_certificateimagesPath = req.files.diamond_certificate.map((item: any) => item.path)
                    diamond_certificate = await fileService.uploadFileInS3("diamond_certificate", diamond_certificateimagesPath)
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

                if (req.files.productvideo) {
                    const productvideoPath = req.files.productvideo.map((item: any) => item.path)
                    productvideo = await fileService.uploadFileInS3("productvideo", productvideoPath)
                }

                const FindProduct = await ProductRepo.createQueryBuilder('Product')
                    .where('Product.maintitle = :maintitle ', { maintitle })
                    .where('Product.title = :title ', { title })
                    .getOne();

                let disccount_percentage = null

                if (!FindProduct) {

                    if (price && disccount_price && disccount_price !== "0") {
                        const difference = price - disccount_price;
                        const percentage = (difference / price) * 100;
                        disccount_percentage = percentage
                    }

                    const newProduct: IProduct = ProductRepo.create({
                        srno: srno,
                        location: location,
                        stock: stock,
                        stone: stone,                         
                        maintitle: maintitle,
                        title: title,
                        price: price,
                        rap: rap,
                        rap_disccount: rap_disccount,
                        per_ct : per_ct,
                        disccount_price: disccount_price ? disccount_price : null,
                        disccount_percentage: disccount_percentage ? disccount_percentage : null,
                        shape: shape,
                        carat: carat,
                        colour: colour,
                        clarity: clarity,
                        cut: cut,
                        polish: polish,
                        symmetry: symmetry,
                        flourescence: flourescence,
                        flourescence_Color : flourescence_Color,
                        measurements: measurements,
                        cert_number: cert_number,
                        table: table,
                        table_inclusion: table_inclusion,
                        side_inclusion: side_inclusion,
                        feather_inclusion : feather_inclusion,
                        tinge: tinge,
                        eyeclean: eyeclean,
                        girdle : girdle,
                        girdle_con : girdle_con,
                        girdle_per: girdle_per,
                        culet : culet, 
                        crown_height: crown_height,
                        pavilian_depth: pavilian_depth,
                        depth: depth,
                        crown_angle: crown_angle,
                        pavilian_angle: pavilian_angle,
                        report: report,
                        report_date: report_date,
                        laser_inscription : laser_inscription,
                        lab: lab,
                        star_length : star_length,
                        lower: lower,
                        productimage: productimage,
                        productvideo: productvideo ?  productvideo[0]?.fileName : null,
                        diamond_certificate: diamond_certificate ? diamond_certificate[0]?.fileName : null,
                        customized: customized,
                        diamond_size: {
                            size: size,
                            size_desc: size_desc,
                            sizeimages: sizeimages ? sizeimages[0]?.fileName : null
                        },
                        diamond_color: {
                            color_desc: color_desc,
                            colorimage: colorimage ? colorimage[0]?.fileName : null,
                        },
                        diamond_clarity: {
                            clarity_desc: clarity_desc,
                            clarityimage: clarityimage ? clarityimage[0]?.fileName : null,
                        },
                        diamond_cut: {
                            cut_desc: cut_desc,
                            cutimage: cutimage ? cutimage[0]?.fileName : null,
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
                    qurey.where('Product.subcategoryid = :subcategoryid ', { subcategoryid: subcategoryid })
                }
                if (innnercategoryid) {
                    qurey.where('Product.innnercategoryid = :innnercategoryid ', { innercategoryid: innnercategoryid })

                }
                if (minPrice && maxPrice) {
                    qurey.where('Product.price >= :minPrice', { minPrice: minPrice })
                    qurey.where('Product.price <= :maxPrice', { maxPrice: maxPrice })
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
                    qurey.where('Product.carat <= :maxCarat', { maxCarat: maxcarat })
                    qurey.orderBy('Product.carat', 'ASC')
                }

                if (Clarity && Clarity.length) {
                    qurey.where('Product.clarity IN (:...clarity)', { clarity: JSON.parse(Clarity) })
                }

                if (Cuts && Cuts.length) {
                    qurey.where('Product.cut IN (:...cut)', { cut: JSON.parse(Cuts) })
                }

                if (Color && Color.length) {
                    qurey.where('Product.colour IN (:...colour)', { colour: JSON.parse(Color) })
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

                if (image) {
                    image = await fileService.uploadFileInS3("product", [req.file.path])
                }

                if (req.file) {
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

                const { productId, maintitle, title, price, disccount_price, shape, carat, colour, clarity, cut, polish, symmetry, flourescence, measurements, cert_number, table, crown_height, pavilian_depth, depth, crown_angle, pavilian_angle, size, size_desc, color_desc, clarity_desc, cut_desc, subcategoryid, innercategoryid, categoryid, productimage, status, sizeimages, colorimage, clarityimage, cutimage, diamond_certificate, customized, srno,location,stock,stone,rap,rap_disccount,per_ct,flourescence_Color,table_inclusion,side_inclusion,feather_inclusion,tinge,eyeclean,girdle,girdle_con,girdle_per,culet,report,report_date,laser_inscription,lab,star_length,lower, productvideo } = req.body

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
                existingProduct.srno = srno || existingProduct.srno;
                existingProduct.location = location || existingProduct.location;
                existingProduct.stock = stock || existingProduct.stock;
                existingProduct.stone = stone || existingProduct.stone;
                existingProduct.rap = rap || existingProduct.rap;
                existingProduct.rap_disccount = rap_disccount || existingProduct.rap_disccount;
                existingProduct.per_ct = per_ct || existingProduct.per_ct;
                existingProduct.flourescence_Color = flourescence_Color || existingProduct.flourescence_Color;
                existingProduct.table_inclusion = table_inclusion || existingProduct.table_inclusion;
                existingProduct.side_inclusion = side_inclusion || existingProduct.side_inclusion;
                existingProduct.feather_inclusion = feather_inclusion || existingProduct.feather_inclusion;
                existingProduct.eyeclean = eyeclean || existingProduct.eyeclean;
                existingProduct.girdle = girdle || existingProduct.girdle;
                existingProduct.tinge = tinge || existingProduct.tinge;
                existingProduct.girdle_con = girdle_con || existingProduct.girdle_con;
                existingProduct.girdle_per = girdle_per || existingProduct.girdle_per;
                existingProduct.report = report || existingProduct.report;
                existingProduct.culet = culet || existingProduct.culet;
                existingProduct.report_date = report_date || existingProduct.report_date;
                existingProduct.laser_inscription = laser_inscription || existingProduct.laser_inscription;
                existingProduct.lab = lab || existingProduct.lab;
                existingProduct.star_length = star_length || existingProduct.star_length;
                existingProduct.lower = lower || existingProduct.lower;
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
                existingProduct.productvideo = productvideo || existingProduct.productvideo;
                existingProduct.diamond_certificate = diamond_certificate || existingProduct.diamond_certificate;
                existingProduct.customized = customized || existingProduct.customized;
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