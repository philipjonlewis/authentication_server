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

const createProjectDataSanitizer = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      let newProjectData = req.body;

      const { accessTokenAuthenticatedUserId } = res.locals;

      newProjectData = newProjectData.map((projectData: any) => {
        return {
          ...projectData,
          projectName: sanitizeHtml(
            projectData.projectName.toString().trim(),
            sanitizationOptions
          ),
          projectDescription: sanitizeHtml(
            projectData.projectDescription.toString().trim(),
            sanitizationOptions
          ),
          dateOfDeadline: sanitizeHtml(
            projectData.dateOfDeadline.toString().trim(),
            sanitizationOptions
          ),
          user: accessTokenAuthenticatedUserId,
        };
      });

      res.locals.sanitizedNewProjectData = [...newProjectData];

   

      return next();
    } catch (error: any) {
      throw new ErrorHandler(500, error.message, {});
    }
  }
) as RequestHandler;

const readProjectDataSanitizer = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      let { projectId } = req.query;

      if (projectId == undefined) {
        res.locals.isReadProjectDataId = false;
        return next();
      }

      projectId = sanitizeHtml(
        projectId.toString(),
        sanitizationOptions
      ).trim();

      res.locals.sanitizedReadProjectDataId = projectId;

      return next();
    } catch (error: any) {
      throw new ErrorHandler(500, error.message, {});
    }
  }
) as RequestHandler;

const updateProjectDataSanitizer = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      let [updateProjectDataParameters, updateProjectDataContent] = req.body;

      const { accessTokenAuthenticatedUserId } = res.locals;

      const sanitizedUpdateProjectDataContent = {
        ...(updateProjectDataContent.dateOfDeadline && {
          dateOfDeadline: sanitizeHtml(
            updateProjectDataContent.dateOfDeadline.toString().trim(),
            sanitizationOptions
          ),
        }),
        ...(updateProjectDataContent.projectName && {
          projectName: sanitizeHtml(
            updateProjectDataContent.projectName.toString().trim(),
            sanitizationOptions
          ),
        }),
        ...(updateProjectDataContent.projectDescription && {
          projectDescription: sanitizeHtml(
            updateProjectDataContent.projectDescription.toString().trim(),
            sanitizationOptions
          ),
        }),
      };

      res.locals.sanitizedUpdateProjectData = {
        updateProjectDataParameters: {
          user: accessTokenAuthenticatedUserId,
          projectId: sanitizeHtml(
            updateProjectDataParameters.projectId.toString().trim(),
            sanitizationOptions
          ),
        },
        updateProjectDataContent: { ...sanitizedUpdateProjectDataContent },
      };

      return next();
    } catch (error: any) {
      throw new ErrorHandler(500, error.message, error);
    }
  }
) as RequestHandler;

const deleteProjectDataSanitizer = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { projectId } = req.body;
      const { refreshTokenAuthenticatedUserId } = res.locals;

      const sanitizedDeleteProjectDataParams = {
        // user: sanitizeHtml(user, sanitizationOptions),
        projectId: sanitizeHtml(projectId, sanitizationOptions),
        user: refreshTokenAuthenticatedUserId,
      };

      res.locals.sanitizedDeleteProjectDataParams = {
        ...sanitizedDeleteProjectDataParams,
      };

      return next();
    } catch (error: any) {
      throw new ErrorHandler(500, error.message, {});
    }
  }
) as RequestHandler;

export {
  createProjectDataSanitizer,
  readProjectDataSanitizer,
  updateProjectDataSanitizer,
  deleteProjectDataSanitizer,
};
