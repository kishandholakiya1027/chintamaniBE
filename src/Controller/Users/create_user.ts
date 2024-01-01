import { getRepository } from 'typeorm';
import { Request, Response } from 'express';
import { User } from '../../entities/UserModel';
import { validationResult } from 'express-validator';
import { authController } from '../../utils/auth';
import { bcryptpassword } from '../../utils/bcrypt';
import { ResponseCodes } from '../../utils/response-codes';
import { RoutesHandler } from '../../utils/ErrorHandler';

export class UserController {
  constructor(

  ) { }

  public async CreateUser(req: any, res: Response, next): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
          return res.status(400).json({ success: false, errors: errors.array() });
        }

        const { firstname, lastname, password, email, mobile, } = req.body

        if (!firstname || !lastname || !password || !email || !mobile) {
          return RoutesHandler.sendError(res, req, "All Field Required", ResponseCodes.inputError)
        }

        const UserRepo = getRepository(User)

        const user = await UserRepo
          .createQueryBuilder('user')
          .where('user.mobile = :mobile OR user.email = :email', { mobile, email })
          .getOne();

        if (!user) {

          const hashedPassword = await bcryptpassword(password);

          let user = {
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            password: hashedPassword,
            mobile: req.body.mobile,
            email: req.body.email,
          }

          const UserData = await UserRepo.create(user)
          await UserRepo.save(UserData)
            .then(data => {

              let accessToken = authController.generateAuthToken(data.id)

              return res.status(ResponseCodes.success).json({
                data: data,
                accessToken: accessToken,
                message: "User Created Successfully",
                status: true
              })
            })

            .catch(err => {
              return next({ statusCode: ResponseCodes.saveError, message: "Registration Some Error" })
            })

        } else {
          return next({ statusCode: ResponseCodes.inputError, message: "User Already Exist" })
        }

      } catch (error) {
        return next({ statusCode: ResponseCodes.serverError, message: "Internal Server Error" })
      }
    })
  }
}
