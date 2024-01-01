import { FileService } from "src/services/backblaze-upload";

const fileService = new FileService();

export const PeoductImageUpload = async (arr: any) => {
    try {
        let imageData: any = { en: {}, ko: {} }
        let imageArray: object[] = []

        for (let index of arr) {
            imageArray = [...imageArray, ...index]
        }

        const imagePath = imageArray.map((item: any) => item.path)
        let data = await fileService.uploadFileInS3("category", imagePath);
        let count = 0

        for (let value of arr) {
            const fieldname = value[0]?.fieldname

            if (fieldname === "homeimagesen" || fieldname === "pageimagesen" || fieldname === "mobileimagesen") {
                imageData.en[fieldname] = data.slice(count, count + value.length);
                count += value.length
            } else if (fieldname === "homeimagesko" || fieldname === "pageimagesko" || fieldname === "mobileimagesko") {
                imageData.ko[fieldname] = data.slice(count, count + value.length);
                count += value.length
            }

        }

        return imageData
    } catch (error) {
        console.log(error)
    }
}