import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

interface TokenPayload {
    userId: any;
}

class AuthController {
    private readonly secretKey: string;

    constructor(secretKey: string) {
        this.secretKey = secretKey;
    }

    // Function to generate an authentication token
    generateAuthToken(userId: any): string {
        const token = jwt.sign({ userId }, this.secretKey, { expiresIn: '5d' });
        return token;
    }

    generateForgetPasswordToken(userId: any, status: number): string {
        const token = jwt.sign({ userId, status }, this.secretKey, { expiresIn: '5m' });
        return token;
    }

    // Function to verify an authentication token
    verifyAuthToken(token: string): string | object {
        try {
            const decoded = jwt.verify(token, this.secretKey) as TokenPayload;
            return decoded;
        } catch (error) {
            console.error('Token verification failed:', error.message);
            return '';
        }
    }
}

export function AUTH(req: any, res: Response, next: NextFunction) {
    const token = req.headers.authorization?.split(' ')[1]; // Assuming the token is passed in the 'Authorization' header

    if (!token) {
        return res.status(401).json({ success: false, message: 'Authorization token not provided' });
    }

    const decodedToken = authController.verifyAuthToken(token);

    if (!decodedToken) {
        return res.status(401).json({ success: false, message: 'Invalid authorization token' });
    }

    // If the token is valid, attach the decoded token payload to the request object for further use in API handlers
    req.tokenPayload = decodedToken;
    next();
}

const secretKey = "GZ13J2Rl3ZE6UAE0NMTIRxMRwT"
export const authController = new AuthController(secretKey);