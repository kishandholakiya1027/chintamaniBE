import { Response } from "express";
import { validationResult } from "express-validator";
import { getRepository } from "typeorm";
import { User } from "../../entities/UserModel";
import { RoutesHandler } from "../../utils/ErrorHandler";
import { ResponseCodes } from "../../utils/response-codes";

export const Update_User = (req: any, res: Response, next): Promise<any> => {
  return new Promise(async (resolve, reject) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return RoutesHandler.sendError(
          res,
          req,
          errors.array(),
          ResponseCodes.inputError
        );
      }

      const {
        userid,
        firstname,
        lastname,
        mobile,
        Address,
        Comment,
        image,
        currency,
        country,
      } = req.body;

      const UserRepo = getRepository(User);

      const existingUser = await UserRepo.findOne({ where: { id: userid } });

      if (!existingUser) {
        return RoutesHandler.sendError(
          res,
          req,
          "User Not Found",
          ResponseCodes.inputError
        );
      }

      existingUser.firstname = firstname || existingUser.firstname;
      existingUser.lastname = lastname || existingUser.lastname;
      existingUser.mobile = mobile || existingUser.mobile;
      existingUser.Address = Address || existingUser.Address;
      existingUser.Comment = Comment || existingUser.Comment;
      existingUser.image = image || existingUser.image;
      existingUser.currency = currency || existingUser.currency;
      existingUser.country = country || existingUser.country;

      await UserRepo.save(existingUser)
        .then((data) => {
          return RoutesHandler.sendSuccess(
            res,
            req,
            data,
            "User updated successfully"
          );
        })
        .catch((err) => {
          console.log(err);
          return RoutesHandler.sendError(
            res,
            req,
            "Failed to update User",
            ResponseCodes.saveError
          );
        });
    } catch (error) {
      console.log(error, "Error");
      return RoutesHandler.sendError(
        res,
        req,
        "Internal Server Error",
        ResponseCodes.serverError
      );
    }
  });
};
