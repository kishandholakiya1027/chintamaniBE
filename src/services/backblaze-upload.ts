const B2 = require('backblaze-b2');
import { Readable } from 'stream';
const fs = require('fs');

let applicationKeyId: string | undefined = 'd07ca89b86a6' || process.env.B2_APPLICATION_KEY_ID
let applicationKey: string | undefined = '0057c3703feb6097b2a6ca1583e4a38223a6c8427d' || process.env.B2_APPLICATION_KEY

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
                    bucketId: '3d60d7fcca58092b88d60a16'
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
                resolve({ fileName: `https://GemsBucket.s3.us-east-005.backblazeb2.com/${response.data.fileName}`, fileId: response?.data?.fileId })
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
                    bucketId: '3d60d7fcca58092b88d60a16'
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
                resolve({ fileName: `https://GemsBucket.s3.us-east-005.backblazeb2.com/${response.data.fileName}`, fileId: response?.data?.fileId })
            }
            catch (error: any) {
                console.log("error = " + error)
                reject(error.message)
            }
        })
    }

}
