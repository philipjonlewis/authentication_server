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

const createTaskDataSanitizer = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      let newTaskData = req.body;
      const { refreshTokenAuthenticatedUserId } = res.locals;

      newTaskData = newTaskData.map((taskData: any) => {
        return {
          ...taskData,
          taskContent: sanitizeHtml(
            taskData.taskContent.toString().trim(),
            sanitizationOptions
          ),
          dateOfDeadline: sanitizeHtml(
            taskData.dateOfDeadline.toString().trim(),
            sanitizationOptions
          ),
          isCompleted: sanitizeHtml(
            taskData.isCompleted.toString().trim(),
            sanitizationOptions
          ),
          user: refreshTokenAuthenticatedUserId,
        };
      });

      res.locals.sanitizedNewTaskData = [...newTaskData];

      return next();
    } catch (error: any) {
      throw new ErrorHandler(500, error.message, {});
    }
  }
) as RequestHandler;

const readTaskDataSanitizer = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      let { taskId } = req.query;

      if (taskId == undefined) {
        res.locals.isReadTaskDataId = false;
        return next();
      }

      taskId = sanitizeHtml(taskId.toString(), sanitizationOptions).trim();

      res.locals.sanitizedReadTaskDataId = { taskId };
      return next();
    } catch (error: any) {
      throw new ErrorHandler(500, error.message, {});
    }
  }
) as RequestHandler;

const updateTaskDataSanitizer = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      let [updateTaskDataParameters, updateTaskDataContent] = req.body;

      // console.log(req.body);

      if (updateTaskDataContent.taskContent) {
        updateTaskDataContent = {
          ...updateTaskDataContent,
          taskContent: sanitizeHtml(
            updateTaskDataContent.taskContent.toString().trim(),
            sanitizationOptions
          ),
        };

        res.locals.sanitizedUpdateTaskData = {
          updateTaskDataParameters,
          updateTaskDataContent,
        };

        return next();
      }

      res.locals.sanitizedUpdateTaskData = {
        updateTaskDataParameters,
        updateTaskDataContent,
      };

      return next();
    } catch (error: any) {
      throw new ErrorHandler(500, error.message, {});
    }
  }
) as RequestHandler;

const deleteTaskDataSanitizer = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { taskId, projectReferenceId, phaseReferenceId } = req.body;

      const sanitizedDeleteDataParams = {
        taskId: sanitizeHtml(taskId, sanitizationOptions),
        projectReferenceId: sanitizeHtml(
          projectReferenceId,
          sanitizationOptions
        ),
        phaseReferenceId: sanitizeHtml(phaseReferenceId, sanitizationOptions),
      };

      res.locals.sanitizedDeleteTaskDataParams = {
        ...sanitizedDeleteDataParams,
      };

      return next();
    } catch (error: any) {
      throw new ErrorHandler(500, error.message, {});
    }
  }
) as RequestHandler;

export {
  createTaskDataSanitizer,
  readTaskDataSanitizer,
  updateTaskDataSanitizer,
  deleteTaskDataSanitizer,
};
