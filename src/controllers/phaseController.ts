import { Request, Response, RequestHandler, NextFunction } from "express";

import asyncHandler from "../handlers/asyncHandler";

import ErrorHandler from "../middleware/errorHandling/modifiedErrorHandler";

import { PhaseModel, TaskModel } from "../middleware/authorization/dbModel";

const createNewPhaseDataController = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const { validatedNewPhaseData } = res.locals;

      const addedPhaseData = await PhaseModel.insertMany(validatedNewPhaseData);

      delete res.locals.validatedNewPhaseData;

      res.json(addedPhaseData);
    } catch (error: any) {
      throw new ErrorHandler(500, error.message, error);
    }
  }
) as RequestHandler;

const readPhaseDataController = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const { validatedReadPhaseDataId, accessTokenAuthenticatedUserId } =
        res.locals;

      const phaseData = await PhaseModel.find({
        user: accessTokenAuthenticatedUserId,
        ...validatedReadPhaseDataId,
      });

      delete res.locals.validatedReadPhaseDataId;

      res.json(phaseData);
    } catch (error: any) {
      throw new ErrorHandler(500, error.message, error);
    }
  }
) as RequestHandler;

const updatePhaseDataController = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const { accessTokenAuthenticatedUserId } = res.locals;
      const { updatePhaseDataParameters, updatePhaseDataContent } =
        res.locals.validatedUpdatePhaseData;

      const updatedPhaseData = await PhaseModel.updateMany(
        {
          user: accessTokenAuthenticatedUserId,
          ...updatePhaseDataParameters,
        },
        { ...updatePhaseDataContent }
      );

      delete res.locals.validatedUpdatePhaseData;

      res.json(updatedPhaseData);
    } catch (error: any) {
      throw new ErrorHandler(500, error.message, error);
    }
  }
) as RequestHandler;

const deletePhaseDataController = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const { validatedDeletePhaseDataParams, accessTokenAuthenticatedUserId } =
        res.locals;

      const deletedPhaseData = await PhaseModel.findOneAndDelete({
        user: accessTokenAuthenticatedUserId,
        ...validatedDeletePhaseDataParams,
      });

      await TaskModel.deleteMany({
        phaseReferenceId: validatedDeletePhaseDataParams.phaseId,
      });

      delete res.locals.validatedDeletePhaseDataParams;
      res.json(deletedPhaseData);
    } catch (error: any) {
      throw new ErrorHandler(500, error.message, error);
    }
  }
) as RequestHandler;

const changeOrderPhaseDataController = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const { validatedChangeOrderPhaseData, accessTokenAuthenticatedUserId } =
        res.locals;

      validatedChangeOrderPhaseData.forEach(async (phase: any) => {
        await PhaseModel.findByIdAndUpdate(
          {
            user: accessTokenAuthenticatedUserId,
            _id: phase._id,
            // phaseId: phase.phaseId,
          },
          { phaseOrder: phase.phaseOrder }
        );
      });

      delete res.locals.validatedNewPhaseData;

      res.json("updated");
    } catch (error: any) {
      throw new ErrorHandler(500, error.message, error);
    }
  }
) as RequestHandler;

export {
  createNewPhaseDataController,
  readPhaseDataController,
  updatePhaseDataController,
  deletePhaseDataController,
  changeOrderPhaseDataController,
};
