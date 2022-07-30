import { Request, Response, RequestHandler, NextFunction } from "express";
import asyncHandler from "../handlers/asyncHandler";
import fs from "fs";
import path from "path";
import ErrorHandler from "../middleware/errorHandling/modifiedErrorHandler";

import { AuthModel } from "../middleware/authorization/dbModel";

import { userAgentCleaner } from "../utils/userAgentCleaner";
import jwt from "jsonwebtoken";

import bcrypt from "bcryptjs";

import { onboardingNodemailer } from "../utils/onBoardingNodemailer";

// const  process.env.NEW_KIDS as string = fs.readFileSync(
//   path.resolve(
//     __dirname,
//     "../infosec/keys/refreshTokenKeys/refreshTokenPrivate.key"
//   )
// );

const signUpUserDataController = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const { validatedSignUpUserData, useragent } = res.locals;

      const newUser = await new AuthModel({
        ...validatedSignUpUserData,
        userAgent: { ...(await userAgentCleaner(useragent)) },
      });

      await newUser.save();

      delete res.locals.validatedSignUpUserData;
      delete res.locals.useragent;

      const refreshToken = jwt.sign(
        { token: newUser._id },
        process.env.NEW_KIDS as string,
        {
          issuer: newUser._id.toString(),
          subject: newUser.email,
          audience: "/",
          expiresIn: "672h",
          algorithm: "HS256",
        }
      ) as any;
      //expires in 1 day
      const accessToken = jwt.sign(
        { token: newUser._id },
        process.env.NEW_KIDS as string,
        {
          issuer: newUser._id.toString(),
          subject: newUser.email,
          audience: "/",
          expiresIn: "24h",
          algorithm: "HS256",
        }
      ) as any;

      AuthModel.findByIdAndUpdate(newUser._id, {
        refreshTokens: [refreshToken],
        accessTokens: [accessToken],
      });

      // await onboardingNodemailer(newUser);

      return res
        .status(200)
        .cookie("authentication-refresh", refreshToken, {
          signed: true,
          // expires in 28 days
          // expires: new Date(Date.now() + 6048000 * 4),
          maxAge: 241920000,
          // make secure true upon deployment
          secure: process.env.ENVIRONMENT == "production" ? true : false,
          httpOnly: false,
          // Make sameSite none upon deployment
          sameSite: process.env.ENVIRONMENT == "production" ? "none" : false,
        })
        .cookie("authentication-access", accessToken, {
          signed: true,
          // expires in 28 days
          maxAge: 86400000,
          // make secure true upon deployment
          secure: process.env.ENVIRONMENT == "production" ? true : false,
          httpOnly: false,
          // Make sameSite none upon deployment
          sameSite: process.env.ENVIRONMENT == "production" ? "none" : false,
        })
        .json({
          code: 200,
          status: true,
          message: "Successfully logged in",
          payload: {
            _id: newUser._id,
            email: newUser.email,
          },
        });
      // return res
      //   .status(200)
      //   .cookie("authentication-refresh", refreshToken, {
      //     signed: true,
      //     // expires in 28 days
      //     // expires: new Date(Date.now() + 6048000 * 4),
      //     maxAge: 241920000,
      //     // make secure true upon deployment
      //     secure: true,
      //     httpOnly: false,
      //     sameSite: "none",
      //   })
      //   .cookie("authentication-access", accessToken, {
      //     signed: true,
      //     // expires in 28 days
      //     maxAge: 86400000,
      //     // make secure true upon deployment
      //     secure: true,
      //     httpOnly: false,
      //     sameSite: "none",
      //   })
      //   .json({
      //     code: 200,
      //     status: true,
      //     message: "Successfully logged in",
      //     payload: { _id: newUser._id },
      //   });
    } catch (error: any) {
      throw new ErrorHandler(500, error.message, error);
    }
  }
) as RequestHandler;

const logOutUserDataController = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      res
        .clearCookie("authentication-refresh", {
          //  enable domain on deployment
          domain:
            process.env.ENVIRONMENT == "production"
              ? "https://taptaptask-backend.herokuapp.com"
              : "",
          path: "/",
        })
        .clearCookie("authentication-access", {
          //  enable domain on deployment
          domain:
            process.env.ENVIRONMENT == "production"
              ? "https://taptaptask-backend.herokuapp.com"
              : "",
          path: "/",
        });
      return res.json({
        message: "Logged Out",
      });
    } catch (error: any) {
      throw new ErrorHandler(500, error.message, error);
    }
  }
) as RequestHandler;

const logInUserDataController = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const { validatedLogInUserData }: any = res.locals;

      const existingUser = await AuthModel.find({
        email: validatedLogInUserData.email,
      }).select(
        "+email +username -user +_id -__v -createdAt -updatedAt +password +refreshTokens +accessTokens"
      );

      bcrypt.compare(
        validatedLogInUserData.password,
        existingUser[0].password,
        async function (err, result) {
          if (result) {
            // new refresh and access cookie

            const refreshToken = jwt.sign(
              { token: existingUser[0]._id },
              process.env.NEW_KIDS as string,
              {
                issuer: existingUser[0]._id.toString(),
                subject: existingUser[0].email,
                audience: "/",
                expiresIn: "672h",
                algorithm: "HS256",
              }
            ) as any;
            //expires in 1 day
            const accessToken = jwt.sign(
              { token: existingUser[0]._id },
              process.env.NEW_KIDS as string,
              {
                issuer: existingUser[0]._id.toString(),
                subject: existingUser[0].email,
                audience: "/",
                expiresIn: "24h",
                algorithm: "HS256",
              }
            ) as any;

            AuthModel.findByIdAndUpdate(existingUser[0]._id, {
              refreshTokens: [refreshToken],
              accessTokens: [accessToken],
            });

            return res
              .status(200)
              .cookie("authentication-refresh", refreshToken, {
                signed: true,
                // expires in 28 days
                // expires: new Date(Date.now() + 6048000 * 4),
                maxAge: 241920000,
                // make secure true upon deployment
                secure: process.env.ENVIRONMENT == "production" ? true : false,
                httpOnly: false,
                sameSite:
                  process.env.ENVIRONMENT == "production" ? "none" : false,
              })
              .cookie("authentication-access", accessToken, {
                signed: true,
                // expires in 28 days
                maxAge: 86400000,
                // make secure true upon deployment
                secure: process.env.ENVIRONMENT == "production" ? true : false,
                httpOnly: false,
                sameSite:
                  process.env.ENVIRONMENT == "production" ? "none" : false,
              })
              .json({
                code: 200,
                status: true,
                message: "Successfully logged in",
                payload: {
                  _id: existingUser[0]._id,
                  email: existingUser[0].email,
                },
              });
            // return res
            //   .status(200)
            //   .cookie("authentication-refresh", refreshToken, {
            //     signed: true,
            //     // expires in 28 days
            //     // expires: new Date(Date.now() + 6048000 * 4),
            //     maxAge: 241920000,
            //     // make secure true upon deployment
            //     secure: true,
            //     httpOnly: false,
            //     sameSite: "none",
            //   })
            //   .cookie("authentication-access", accessToken, {
            //     signed: true,
            //     // expires in 28 days
            //     maxAge: 86400000,
            //     // make secure true upon deployment
            //     secure: true,
            //     httpOnly: false,
            //     sameSite: "none",
            //   })
            //   .json({
            //     code: 200,
            //     status: true,
            //     message: "Successfully logged in",
            //     payload: { _id: validatedLogInUserData },
            //   });
            delete res.locals.validatedLogInUserData;
          } else {
            return res.send("No");
          }
        }
      );
    } catch (error: any) {
      throw new ErrorHandler(500, error.message, error);
    }
  }
) as RequestHandler;

const updateUserDataController = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const { validatedEditUserData, refreshTokenAuthenticatedUserId } =
        await res.locals;

      // Must use userId for params and have a setting for existing password to new password
      const { username, email, newPassword, password } = validatedEditUserData;

      const isUserExisting = await AuthModel.find({
        //replace email with user id from cookie
        _id: refreshTokenAuthenticatedUserId,
      }).select("+password");

      if (!isUserExisting) {
        throw new ErrorHandler(500, "No user like that", {});
      }

      // bcrypt.compare(
      //   password,
      //   isUserExisting[0].password,
      //   async function (err, result) {
      //     console.log(result);
      //     if (!result) {
      //       throw new ErrorHandler(500, "very wrong", {});
      //     }

      //   }
      // );

      const isRightPassword = await bcrypt.compare(
        password,
        isUserExisting[0].password
      );

      if (!isRightPassword) {
        throw new ErrorHandler(500, "very wrong", {});
      }

      if (isRightPassword) {
        const editedUser = await AuthModel.findOneAndUpdate(
          {
            _id: refreshTokenAuthenticatedUserId,
          },
          {
            ...(username && { username }),
            ...(email && { email }),
            ...(newPassword && { password: newPassword }),
          },
          { new: true }
        ).select("+email +username -user -_id -__v -createdAt -updatedAt");

        console.log(await editedUser);

        delete res.locals.validatedEditUserData;

        return res.json(editedUser);
      }
    } catch (error: any) {
      throw new ErrorHandler(500, error.message, error);
    }
  }
) as RequestHandler;

const deleteUserDataController = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const { validatedDeleteUserData, refreshTokenAuthenticatedUserId } =
        res.locals;
      // Must use userId for params and have a setting for existing password to new password
      const deletedUser = await AuthModel.findOneAndDelete({
        refreshTokenAuthenticatedUserId,
        ...validatedDeleteUserData,
      });

      delete res.locals.validatedEditUserData;

      return res.json(deletedUser);
    } catch (error: any) {
      throw new ErrorHandler(500, error.message, error.payload);
    }
  }
) as RequestHandler;

export {
  signUpUserDataController,
  logOutUserDataController,
  logInUserDataController,
  updateUserDataController,
  deleteUserDataController,
};
