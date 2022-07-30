import { Request, Response, RequestHandler, NextFunction } from "express";

import sanitizeHtml from "sanitize-html";
import asyncHandler from "../../handlers/asyncHandler";

import ErrorHandler from "../errorHandling/modifiedErrorHandler";

const sanitizationOptions = {
  allowedTags: [],
  parser: {
    lowerCaseTags: true,
  },
};

const signUpUserDataSanitizer = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    console.log("hello");
    try {
      const { email, password, passwordConfirmation } = req.body;

      const sanitizedSignUpUserData = {
        email: sanitizeHtml(email.toString().trim(), sanitizationOptions),
        password,
        passwordConfirmation,
      };

      res.locals.sanitizedSignUpUserData = {
        ...sanitizedSignUpUserData,
      };

      return next();
    } catch (error: any) {
      throw new ErrorHandler(500, error.message, {});
    }
  }
) as RequestHandler;

const logInUserDataSanitizer = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;

      const sanitizedLogInUserData = {
        email: sanitizeHtml(email.toString().trim(), sanitizationOptions),
        password,
      };

      res.locals.sanitizedLogInUserData = {
        ...sanitizedLogInUserData,
      };

      return next();
    } catch (error: any) {
      throw new ErrorHandler(500, error.message, {});
    }
  }
) as RequestHandler;

const updateUserDataSanitizer = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, username, newPassword, password } = req.body;

      const sanitizedEditUserData = {
        ...(email && {
          email: sanitizeHtml(email.toString().trim(), sanitizationOptions),
        }),
        ...(username && {
          username: sanitizeHtml(
            username.toString().trim(),
            sanitizationOptions
          ),
        }),
        ...(newPassword && {
          newPassword,
        }),
        password,
      };

      res.locals.sanitizedEditUserData = {
        ...sanitizedEditUserData,
      };

      return next();
    } catch (error: any) {
      throw new ErrorHandler(500, error.message, {});
    }
  }
) as RequestHandler;

const deleteUserDataSanitizer = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;

      const sanitizedDeleteUserData = {
        email: sanitizeHtml(email.toString().trim(), sanitizationOptions),
        password,
      };

      res.locals.sanitizedDeleteUserData = {
        ...sanitizedDeleteUserData,
      };

      return next();
    } catch (error: any) {
      throw new ErrorHandler(500, error.message, {});
    }
  }
) as RequestHandler;

export {
  signUpUserDataSanitizer,
  logInUserDataSanitizer,
  updateUserDataSanitizer,
  deleteUserDataSanitizer,
};
