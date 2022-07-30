import { Request, Response, RequestHandler, NextFunction } from "express";
import { rmSync } from "fs";

import sanitizeHtml from "sanitize-html";
import asyncHandler from "../../handlers/asyncHandler";

import ErrorHandler from "../errorHandling/modifiedErrorHandler";

const sanitizationOptions = {
  allowedTags: [],
  parser: {
    lowerCaseTags: true,
  },
};

const createPhaseDataSanitizer = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      let newPhaseData = req.body;
      const { refreshTokenAuthenticatedUserId } = res.locals;

      newPhaseData = newPhaseData.map((phaseData: any) => {
        return {
          ...phaseData,
          phaseName: sanitizeHtml(
            phaseData.phaseName.toString(),
            sanitizationOptions
          ).trim(),
          phaseOrder: sanitizeHtml(
            phaseData.phaseOrder.toString(),
            sanitizationOptions
          ).trim(),
          user: refreshTokenAuthenticatedUserId,
        };
      });

      res.locals.sanitizedNewPhaseData = [...newPhaseData];
      return next();
    } catch (error: any) {
      throw new ErrorHandler(500, error.message, {});
    }
  }
) as RequestHandler;

const readPhaseDataSanitizer = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      let { phaseId } = req.query;
      // console.log(phaseId);
      if (phaseId == undefined) {
        res.locals.isReadPhaseDataId = false;
        return next();
      }

      phaseId = sanitizeHtml(phaseId.toString(), sanitizationOptions).trim();

      res.locals.sanitizedReadPhaseDataId = phaseId;

      return next();
    } catch (error: any) {
      throw new ErrorHandler(500, error.message, {});
    }
  }
) as RequestHandler;

const updatePhaseDataSanitizer = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      let [updatePhaseDataParameters, updatePhaseDataContent] = req.body;

      if (updatePhaseDataContent.phaseName == undefined) {
        res.locals.sanitizedUpdatePhaseData = {
          updatePhaseDataParameters,
          updatePhaseDataContent,
        };

        return next();
      }

      updatePhaseDataContent = {
        ...updatePhaseDataContent,
        phaseName: sanitizeHtml(
          updatePhaseDataContent.phaseName.toString().trim(),
          sanitizationOptions
        ),
      };

      res.locals.sanitizedUpdatePhaseData = {
        updatePhaseDataParameters,
        updatePhaseDataContent,
      };

      return next();
    } catch (error: any) {
      throw new ErrorHandler(500, error.message, {});
    }
  }
) as RequestHandler;

const deletePhaseDataSanitizer = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { phaseId, projectReferenceId } = req.body;

      const sanitizedDeletePhaseDataParams = {
        phaseId: sanitizeHtml(phaseId, sanitizationOptions),
        projectReferenceId: sanitizeHtml(
          projectReferenceId,
          sanitizationOptions
        ),
      };

      res.locals.sanitizedDeletePhaseDataParams = {
        ...sanitizedDeletePhaseDataParams,
      };

      return next();
    } catch (error: any) {
      throw new ErrorHandler(500, error.message, {});
    }
  }
) as RequestHandler;

const changeOrderPhaseDataSanitizer = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      let changeOrderPhaseData = req.body;
      const { refreshTokenAuthenticatedUserId } = res.locals;

      changeOrderPhaseData = changeOrderPhaseData.map((phaseData: any) => {
        return {
          ...phaseData,
          phaseName: sanitizeHtml(
            phaseData.phaseName.toString(),
            sanitizationOptions
          ).trim(),
          // phaseOrder: sanitizeHtml(
          //   phaseData.phaseOrder,
          //   sanitizationOptions
          // ).trim(),
          user: refreshTokenAuthenticatedUserId,
        };
      });

      res.locals.sanitizedChangeOrderPhaseData = [...changeOrderPhaseData];
      return next();
    } catch (error: any) {
      throw new ErrorHandler(error?.status, error?.message, error?.payload);
    }
  }
) as RequestHandler;

export {
  createPhaseDataSanitizer,
  readPhaseDataSanitizer,
  updatePhaseDataSanitizer,
  deletePhaseDataSanitizer,
  changeOrderPhaseDataSanitizer,
};
