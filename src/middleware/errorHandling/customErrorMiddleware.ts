import modifiedErrorHandler from "./modifiedErrorHandler";
// Also import a custom error model for storing errors

import express, {
  ErrorRequestHandler,
  Request,
  Response,
  NextFunction,
  RequestHandler,
} from "express";

const customErrorMiddleware = async (
  error: ErrorRequestHandler | any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  //Error logging should be universal here
  const status = error?.status || 500;
  const message = error?.message || "Something is wrong";

  // payload should only be for logging errors in the database
  // Make a system to separate errors and log to error DB only the important ones

  return (
    res
      // .clearCookie("authentication-refresh", { path: "/" })
      // .clearCookie("authentication-access", { path: "/" })
      .json({
        code: status,
        status: false,
        message: message,
        //remove payload on deployment maybe
        ...(error.payload ? { payload: error.payload } : { payload: null }),
      })
  );
};

export default customErrorMiddleware;
