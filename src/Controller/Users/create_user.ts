import { getRepository } from 'typeorm';
import { Request, Response } from 'express';
import { FORGET_PASSWORD, User } from '../../entities/UserModel';
import { validationResult } from 'express-validator';
import { authController } from '../../utils/auth';
import { bcryptpassword, comparepassword } from '../../utils/bcrypt';
import { ResponseCodes } from '../../utils/response-codes';
import { RoutesHandler } from '../../utils/ErrorHandler';
import generateOTPFunc from '../../services/otp';
import shortid from 'shortid';
import { Otps } from '../../entities/OtpModel';
import sendEmail from '../../services/nodemailer';
import isOTPExpired from '../../services/otp_verification';

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

        const { firstname, lastname, email, password, otp } = req.body

        const UserRepo = getRepository(User)
        const OtpsRepo = getRepository(Otps)

        const qurey = await UserRepo.findOne({ where: { email: email } })

        if (qurey) {
          return RoutesHandler.sendError(res, req, 'User already in Exist Try to login', ResponseCodes.general);
        }

        const userOtp = await OtpsRepo.findOne({ where: { email, otp } });

        if (!userOtp) {
          return RoutesHandler.sendError(res, req, 'Invalid email or otp', ResponseCodes.searchError);
        }

        if (isOTPExpired(userOtp.expiresIn)) {
          return RoutesHandler.sendError(res, req, 'OTP Expired', ResponseCodes.TokenError);
        }

        if (!qurey) {

          const hashedPassword = await bcryptpassword(password)

          const UserData = await UserRepo.create({
            firstname: firstname,
            lastname: lastname,
            password: hashedPassword,
            email: email,
          })

          await UserRepo.save(UserData)
            .then(data => {

              let accessToken = authController.generateAuthToken(data.id)
              return RoutesHandler.sendSuccess(res, req, { data, accessToken }, "User Created Successfully");

            })

        } else {
          return RoutesHandler.sendError(res, req, 'User already in Exist Try to login', ResponseCodes.general);
        }

      } catch (error) {
        console.log(error, "Error")
        return RoutesHandler.sendError(res, req, 'Internal Server Error', ResponseCodes.serverError);
      }
    })
  }

  public async VerificationUser(req: any, res: Response, next): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
          return res.status(400).json({ success: false, errors: errors.array() });
        }

        const { email } = req.body

        const OtpsRepo = getRepository(Otps)

        const qurey = await OtpsRepo.findOne({ where: { email: email } })

        if (qurey) {
          return RoutesHandler.sendError(res, req, 'User already in Exist', ResponseCodes.general);
        }

        const generate6digitOTp: any = await generateOTPFunc();
        const id = `otp_${shortid.generate()}`;
        const CrrentDate: number = new Date(Date.now() + 5 * 60 * 1000).getTime()

        const otpData = OtpsRepo.create({
          id: id,
          email: email,
          otp: Number(generate6digitOTp),
          expiresIn: CrrentDate,
        });

        await sendEmail(email, generate6digitOTp);

        await OtpsRepo.save(otpData)
          .then((data) => {
            return RoutesHandler.sendSuccess(res, req, { Otp: data.otp }, 'Otp Created successfully');
          })
          .catch((err) => {
            console.log(err);
            return RoutesHandler.sendError(res, req, 'Failed to Otp generate', ResponseCodes.saveError);
          });

      } catch (error) {
        console.log(error, "Error")
        return RoutesHandler.sendError(res, req, 'Internal Server Error', ResponseCodes.serverError);
      }
    })
  }

  public async SendOtp(req: any, res: Response, next): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
          return res.status(400).json({ success: false, errors: errors.array() });
        }

        const { email } = req.body

        const OtpsRepo = getRepository(Otps)
        const UserRepo = getRepository(User)

        const generate6digitOTp = await generateOTPFunc();

        const oldotp = await OtpsRepo.findOne({ where: { email: email } });
        const oldUser = await UserRepo.findOne({ where: { email: email } })

        if (oldotp) {
          if (!oldUser) {

            oldotp.otp = Number(generate6digitOTp)
            oldotp.expiresIn = new Date(Date.now() + 5 * 60 * 1000).getTime()


            await sendEmail(email, generate6digitOTp);

            await OtpsRepo.save(oldotp)
              .then((data) => {
                return RoutesHandler.sendSuccess(res, req, { Otp: data.otp }, 'Otp Created successfully');
              })
              .catch((err) => {
                console.log(err);
                return RoutesHandler.sendError(res, req, 'Failed to Otp generate', ResponseCodes.saveError);
              });

          } else {
            return RoutesHandler.sendError(res, req, 'User Alredy Ragister Please Try to Login', ResponseCodes.loginError);
          }

        } else {
          return RoutesHandler.sendError(res, req, 'Not Found Registration Process', ResponseCodes.general);
        }

      } catch (error) {
        console.log(error, "Error")
        return RoutesHandler.sendError(res, req, 'Internal Server Error', ResponseCodes.serverError);
      }
    })
  }

  public async Forget_password(req: any, res: Response, next): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
          return res.status(400).json({ success: false, errors: errors.array() });
        }

        const { email } = req.body

        const OtpsRepo = getRepository(Otps)
        const UserRepo = getRepository(User)

        const generate6digitOTp = await generateOTPFunc();

        const oldotp = await OtpsRepo.findOne({ where: { email: email } });
        const oldUser = await UserRepo.findOne({ where: { email: email } })

        if (oldotp) {
          if (oldUser) {

            oldotp.otp = Number(generate6digitOTp)
            oldotp.expiresIn = new Date(Date.now() + 5 * 60 * 1000).getTime()


            await sendEmail(email, generate6digitOTp);

            await OtpsRepo.save(oldotp)
              .then((data) => {
                return RoutesHandler.sendSuccess(res, req, { Otp: data.otp }, 'Otp send successfully');
              })
              .catch((err) => {
                console.log(err);
                return RoutesHandler.sendError(res, req, 'Failed to Otp generate', ResponseCodes.saveError);
              });

          } else {
            return RoutesHandler.sendError(res, req, 'This Email Not Exist This Platform', ResponseCodes.loginError);
          }

        } else {
          return RoutesHandler.sendError(res, req, 'User Not Found', ResponseCodes.general);
        }

      } catch (error) {
        console.log(error, "Error")
        return RoutesHandler.sendError(res, req, 'Internal Server Error', ResponseCodes.serverError);
      }
    })
  }

  public async Verify_Forget_password(req: any, res: Response, next): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
          return res.status(400).json({ success: false, errors: errors.array() });
        }

        const { email, otp } = req.body

        const OtpsRepo = getRepository(Otps)
        const UserRepo = getRepository(User)

        const userOtp = await OtpsRepo.findOne({ where: { email, otp } });

        if (isOTPExpired(userOtp.expiresIn)) {
          return RoutesHandler.sendError(res, req, 'OTP Expired', ResponseCodes.TokenError);
        }

        if (userOtp) {

          const userData = await UserRepo.findOne({ where: { email } });

          let ForgetPasswordToken = authController.generateForgetPasswordToken(userData.id, 5)

          return RoutesHandler.sendSuccess(res, req, { email: userData.email, ForgetPasswordToken: ForgetPasswordToken }, "User Verification Success");

        } else {
          return RoutesHandler.sendError(res, req, 'User Not Found', ResponseCodes.general);
        }

      } catch (error) {
        console.log(error, "Error")
        return RoutesHandler.sendError(res, req, 'Internal Server Error', ResponseCodes.serverError);
      }
    })
  }

  public async Create_password(req: any, res: Response, next): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
          return res.status(400).json({ success: false, errors: errors.array() });
        }

        const { new_pass, confirm_pass } = req.body

        if (!(new_pass == confirm_pass)) {
          return RoutesHandler.sendError(res, req, 'Password and confirm Password Not Matching', ResponseCodes.inputError);
        }

        const UserRepo = getRepository(User)
        const UserData = req.tokenPayload

        if (UserData.status === FORGET_PASSWORD.status) {

          const OldUserData = await UserRepo.findOne({ where: { id: UserData.id } });

          if (OldUserData) {

            const hashedPassword = await bcryptpassword(new_pass)

            OldUserData.password = hashedPassword

            await UserRepo.save(OldUserData)
              .then((data) => {
                return RoutesHandler.sendSuccess(res, req, data, 'Password Updated SuccesFully');
              })
              .catch((err) => {
                console.log(err);
                return RoutesHandler.sendError(res, req, 'Failed to update Password', ResponseCodes.saveError);
              });

          } else {
            return RoutesHandler.sendError(res, req, 'User Not Found', ResponseCodes.general);
          }
        }

      } catch (error) {
        console.log(error, "Error")
        return RoutesHandler.sendError(res, req, 'Internal Server Error', ResponseCodes.serverError);
      }
    })
  }

  public async Change_password(req: any, res: Response, next): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
          return res.status(400).json({ success: false, errors: errors.array() });
        }

        const UserData = req.tokenPayload

        const { old_pass, new_pass, confirm_pass } = req.body

        const UserRepo = getRepository(User)

        const OldUserData = await UserRepo.findOne({ where: { id: UserData.id } });

        const comparePassword = await comparepassword(old_pass, OldUserData.password)

        if (!comparePassword) {
          return RoutesHandler.sendError(res, req, 'Old Password Not Match', ResponseCodes.inputError);
        }

        if (!(new_pass == confirm_pass)) {
          return RoutesHandler.sendError(res, req, 'Password and confirm Password Not Matching', ResponseCodes.inputError);
        }

        if (OldUserData) {

          const hashedPassword = await bcryptpassword(new_pass)

          OldUserData.password = hashedPassword

          await UserRepo.save(OldUserData)
            .then((data) => {
              return RoutesHandler.sendSuccess(res, req, data, 'Password Updated SuccesFully');
            })
            .catch((err) => {
              console.log(err);
              return RoutesHandler.sendError(res, req, 'Failed to update Password', ResponseCodes.saveError);
            });

        } else {
          return RoutesHandler.sendError(res, req, 'User Not Found', ResponseCodes.general);
        }

      } catch (error) {
        console.log(error, "Error")
        return RoutesHandler.sendError(res, req, 'Internal Server Error', ResponseCodes.serverError);
      }
    })
  }
}
