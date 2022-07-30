import { Request, Response, RequestHandler, NextFunction } from "express";

import asyncHandler from "../handlers/asyncHandler";

import ErrorHandler from "../middleware/errorHandling/modifiedErrorHandler";

import { TaskModel } from "../middleware/authorization/dbModel";
import { PhaseModel } from "../middleware/authorization/dbModel";

const readTasksByDateController = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const {
        validatedReadTasksByDateData: { projectReferenceId, phaseReferenceId },
        accessTokenAuthenticatedUserId,
      } = res.locals;

      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      const modelMatch = {
        user: accessTokenAuthenticatedUserId,
        projectReferenceId: projectReferenceId,
        phaseReferenceId: phaseReferenceId,
        dateOfDeadline: {
          $gte: new Date(yesterday),
        },
        // ...req.query,
      };

      const allTasks = await TaskModel.aggregate([
        {
          $match: modelMatch,
        },
        {
          $project: {
            user: "$user",
            taskId: "$taskId",
            projectReferenceId: "$projectReferenceId",
            phaseReferenceId: "$phaseReferenceId",
            taskContent: "$taskContent",
            dateOfDeadline: "$dateOfDeadline",
            isCompleted: "$isCompleted",
            isPriority: "$isPriority",
            isLapsed: "$isLapsed",
          },
        },
        {
          $group: {
            _id: "$dateOfDeadline",
            taskContent: { $push: "$$CURRENT" },
          },
        },
        { $sort: { _id: 1 } },
      ]);

      res.json(allTasks);
    } catch (error: any) {
      throw new ErrorHandler(500, error.message, error);
    }
  }
) as RequestHandler;

const readPhasesByProjectController = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const {
        validatedReadPhasesByProjectData: { projectReferenceId },
        accessTokenAuthenticatedUserId,
      } = res.locals;

      const filteredPhases = await PhaseModel.find({
        user: accessTokenAuthenticatedUserId,
        projectReferenceId: projectReferenceId,
      });

      res.json(filteredPhases);
    } catch (error: any) {
      throw new ErrorHandler(500, error.message, error);
    }
  }
) as RequestHandler;

const deleteTasksByDateController = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const {
        validatedDeleteTasksByDate: { dateOfDeadline },
        accessTokenAuthenticatedUserId,
      } = res.locals;

      console.log(res.locals);

      const deletedTasks = await TaskModel.deleteMany({
        user: accessTokenAuthenticatedUserId,
        dateOfDeadline: dateOfDeadline,
      });

      res.json(deletedTasks);
    } catch (error: any) {
      throw new ErrorHandler(500, error.message, error);
    }
  }
) as RequestHandler;

const readLapsedTasksController = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const {
        validatedSanitizedPhaseIdData: { phaseId },
        accessTokenAuthenticatedUserId,
      } = res.locals;

      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      const modelMatch = {
        user: accessTokenAuthenticatedUserId,
        // projectReferenceId: projectReferenceId,
        phaseReferenceId: phaseId,
        dateOfDeadline: {
          $lte: new Date(yesterday),
        },
        // ...req.query,
      };

      const lapsedTasks = await TaskModel.aggregate([
        {
          $match: modelMatch,
        },
        {
          $project: {
            user: "$user",
            taskId: "$taskId",
            projectReferenceId: "$projectReferenceId",
            phaseReferenceId: "$phaseReferenceId",
            taskContent: "$taskContent",
            dateOfDeadline: "$dateOfDeadline",
            isCompleted: "$isCompleted",
            isPriority: "$isPriority",
            isLapsed: "$isLapsed",
          },
        },
        {
          $group: {
            _id: "$dateOfDeadline",
            taskContent: { $push: "$$CURRENT" },
          },
        },
        { $sort: { _id: 1 } },
      ]);

      res.json(lapsedTasks);
    } catch (error: any) {
      throw new ErrorHandler(500, error.message, error);
    }
  }
) as RequestHandler;

export {
  readTasksByDateController,
  readPhasesByProjectController,
  deleteTasksByDateController,
  readLapsedTasksController,
};
