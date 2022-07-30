import { Request, Response, RequestHandler, NextFunction } from "express";

import asyncHandler from "../handlers/asyncHandler";

import ErrorHandler from "../middleware/errorHandling/modifiedErrorHandler";

import { TaskModel } from "../middleware/authorization/dbModel";

const createNewTaskDataController = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const { validatedNewTaskData } = res.locals;

      const addedTaskData = await TaskModel.insertMany(validatedNewTaskData);

      delete res.locals.validatedNewTaskData;

      res.json(addedTaskData);
    } catch (error: any) {
      throw new ErrorHandler(500, error.message, error);
    }
  }
) as RequestHandler;

const readTaskDataController = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const { validatedReadTaskDataId, refreshTokenAuthenticatedUserId } =
        res.locals;
      console.log(refreshTokenAuthenticatedUserId);
      const taskData = await TaskModel.find({
        // user: refreshTokenAuthenticatedUserId,
        ...validatedReadTaskDataId,
      });
      // 629f16040553eb13ba470d99
      delete res.locals.validatedReadTaskDataId;

      res.json(taskData);
    } catch (error: any) {
      throw new ErrorHandler(500, error.message, error);
    }
  }
) as RequestHandler;

const updateTaskDataController = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const { refreshTokenAuthenticatedUserId } = res.locals;

      const { updateTaskDataParameters, updateTaskDataContent } =
        res.locals.validatedUpdateTaskData;

      const updatedTaskData = await TaskModel.updateMany(
        {
          // user: refreshTokenAuthenticatedUserId,
          ...updateTaskDataParameters,
        },
        { ...updateTaskDataContent }
      );

      delete res.locals.validatedUpdateTaskData;

      res.json(updatedTaskData);
    } catch (error: any) {
      throw new ErrorHandler(500, error.message, error);
    }
  }
) as RequestHandler;

const deleteTaskDataController = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const { validatedDeleteTaskDataParams, refreshTokenAuthenticatedUserId } =
        res.locals;

      const deletedTaskData = await TaskModel.findOneAndDelete({
        user: refreshTokenAuthenticatedUserId,
        ...validatedDeleteTaskDataParams,
      });

      delete res.locals.validatedDeleteTaskDataParams;
      res.json(deletedTaskData);
    } catch (error: any) {
      throw new ErrorHandler(500, error.message, error);
    }
  }
) as RequestHandler;

export {
  createNewTaskDataController,
  readTaskDataController,
  updateTaskDataController,
  deleteTaskDataController,
};
