import * as express from 'express';
export class RoutesHandler {

    public static async respond(res: express.Response, req: express.Request, values: any, error: boolean = false, message: string = "", code: number = 200) {
        if (req.get('origin'))
            res.set('Access-Control-Allow-Origin', req.get('origin'));
        res.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        res.status(code);
        res.json({
            data: values,
            error: error,
            message: message
        });
    }

    public static sendSuccess(res: express.Response, req: express.Request, data: any, message: any) {
        this.respond(res, req, data, false, message)
    }
    public static sendError(res: express.Response, req: express.Request, message: any, code: number) {
        this.respond(res, req, undefined, true, message, code)
    }
}