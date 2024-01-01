const B2 = require('backblaze-b2');
import { Readable } from 'stream';
const fs = require('fs');

let applicationKeyId: string | undefined = '17bd792484b7' || process.env.B2_APPLICATION_KEY_ID
let applicationKey: string | undefined = '00533b84474b8df307606a3235e085b54e15bc7e9b' || process.env.B2_APPLICATION_KEY

const b2 = new B2({
    applicationKeyId: applicationKeyId,
    applicationKey: applicationKey
});
export class FileService {
    constructor() {
        let me = this;
    }
    public async uploadFileInS3(folderName: string, files: any): Promise<any> {
        return new Promise(async (resolve, reject) => {
            try {
                await b2.authorize();
                let allFiles = await Promise.all(files.map(async (file: any) => {
                    return await this.uploadFile(folderName, file)
                }))
                resolve(allFiles || [])
            }
            catch (error: any) {
                console.log("error = " + error)
                reject(error.message)
            }
        });
    }

    async streamToBuffer(stream: any): Promise<Buffer> {
        const buffer: Uint8Array[] = [];

        return await new Promise((resolve, reject) =>
            stream
                .on('error', (error: any) => reject(error))
                .on('data', (data: any) => buffer.push(data))
                .on('end', () => resolve(Buffer.concat(buffer))),
        );
    }

    public async uploadFile(folderName: string, file: any, fileName: any = ""): Promise<any> {
        return new Promise(async (resolve, reject) => {
            try {
                await b2.authorize();
                const data = await b2.getUploadUrl({
                    bucketId: process.env.BLACKBLAZE_BUCKETID
                })

                const readDataData = await this.streamToBuffer(fs.createReadStream(file));

                let filename = fileName || file
                let response = await b2.uploadFile({
                    uploadUrl: data.data.uploadUrl,
                    uploadAuthToken: data.data.authorizationToken,
                    fileName: `${folderName}/${filename}`,
                    data: readDataData,
                    contentLength: 1000000000
                });
                resolve({ fileName: `${process.env.BACKBLAZE_ACCESS_URL}${response.data.fileName}`, fileId: response?.data?.fileId })
            }
            catch (error: any) {
                console.log("error = " + error)
                reject(error.message)
            }
        })
    }

    async uploadFileBase64(folderName: string, file: any, fileName: any = ""): Promise<any> {
        return new Promise(async (resolve, reject) => {
            try {
                await b2.authorize();
                const data = await b2.getUploadUrl({
                    bucketId: process.env.BLACKBLAZE_BUCKETID
                })
                // const readData = fs.readFileSync(file['image'][0]);
                let base64Image = file?.split(";base64,");
                let extension = base64Image[0]?.split("/")?.pop();
                const readData = Buffer.from(file?.replace(/^data:image\/\w+;base64,/, ''), 'base64');
                let filename = fileName || `${+new Date()}.${extension}`

                let response = await b2.uploadFile({
                    uploadUrl: data.data.uploadUrl,
                    uploadAuthToken: data.data.authorizationToken,
                    fileName: `${folderName}/${filename}`,
                    data: readData,
                    contentLength: 1000000000
                });
                resolve({ fileName: `${process.env.BACKBLAZE_ACCESS_URL}${response.data.fileName}`, fileId: response?.data?.fileId })
            }
            catch (error: any) {
                console.log("error = " + error)
                reject(error.message)
            }
        })
    }

}
