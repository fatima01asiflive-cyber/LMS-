require("dotenv").config();
import ErrorHandler from "../utils/ErrorHandler";
import { Request, Response, NextFunction } from "express";
import userModel, { IUser } from "../models/user.model";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import jwt from "jsonwebtoken";

// register user
interface IRegistrationBody {
  email: string;
  name: string;
  password: string;
  avatar?: string;
}

interface IActivationToken {
  token: string;
  activationCode: string;
}

export const createActivationToken = (
  user: IUser | IRegistrationBody,
): IActivationToken => {
  const activationCode = Math.floor(1000 + Math.random() * 9000).toString();

  const token = jwt.sign(
    { user, activationCode },
    process.env.ACTIVATION_SECRET as string,
    {
      expiresIn: "5m",
    },
  );

  return { token, activationCode };
};

export const registrationUser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, email, password } = req.body;

      const isEmailExist = await userModel.findOne({ email });
      if (isEmailExist) {
        return next(new ErrorHandler("Email already exists", 400));
      }

      const user: IRegistrationBody = {
        name,
        email,
        password,
      };

      const activationToken = createActivationToken(user);

      return res.status(201).json({
        success: true,
        activationToken: activationToken.token,
        activationCode: activationToken.activationCode,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  },
);
