import mongoose from "mongoose";

const { Schema } = mongoose;
import { v4 as uuidV4 } from "uuid";

const phaseSchema = new Schema(
  {
    user: { type: String, required: true, select: true },
    phaseId: { type: String, required: true, select: true, unique: true },
    projectReferenceId: {
      type: String,
      required: [true, "Project reference is required"],
      select: true,
    },
    phaseName: {
      type: String,
      required: [true, "Phase name is required"],
      select: true,
      maxlength: 64,
    },
    phaseOrder: {
      type: Number,
      select: true,
    },
  },
  { timestamps: true }
);

export default phaseSchema;
