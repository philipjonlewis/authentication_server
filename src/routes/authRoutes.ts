import {
  Request,
  Response,
  NextFunction,
  RequestHandler,
  Router,
} from "express";

import userAgent from "express-useragent";

const router = Router();

router.use(userAgent.express());

import {
  refreshCookieAuthentication,
  accessCookieAuthentication,
} from "../infosec/cookies/authentication/cookieAuthentication";

import {
  userCredentialsAuthenticator,
  signUpAuthenticator,
  logInAuthenticator,
} from "../middleware/authentication/authAuthenticator";

import {
  signUpUserDataSanitizer,
  logInUserDataSanitizer,
  updateUserDataSanitizer,
  deleteUserDataSanitizer,
} from "../middleware/sanitization/authSanitizer";

import {
  signUpUserDataValidator,
  logInUserDataValidator,
  updateUserDataValidator,
  deleteUserDataValidator,
} from "../middleware/validation/authValidator";

import {
  signUpUserDataController,
  logOutUserDataController,
  logInUserDataController,
  updateUserDataController,
  deleteUserDataController,
} from "../controllers/authController";

router
  .route("/signup")
  .post([
    signUpUserDataSanitizer,
    signUpUserDataValidator,
    signUpAuthenticator,
    signUpUserDataController,
  ]);

router
  .route("/login")
  .post([
    logInUserDataSanitizer,
    logInUserDataValidator,
    logInAuthenticator,
    logInUserDataController,
  ]);
router
  .route("/logout")
  .get([
    logOutUserDataController
  ]);

router
  .route("/update")
  .patch([
    refreshCookieAuthentication,
    accessCookieAuthentication,
    updateUserDataSanitizer,
    updateUserDataValidator,
    userCredentialsAuthenticator,
    updateUserDataController,
  ]);

router
  .route("/delete")
  .delete([
    refreshCookieAuthentication,
    accessCookieAuthentication,
    deleteUserDataSanitizer,
    deleteUserDataValidator,
    userCredentialsAuthenticator,
    deleteUserDataController,
  ]);

export default router;
