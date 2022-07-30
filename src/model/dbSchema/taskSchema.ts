import mongoose from "mongoose";

const { Schema } = mongoose;
import { v4 as uuidV4 } from "uuid";

const taskSchema = new Schema(
  {
    user: { type: String, required: true, select: true },
    taskId: { type: String, required: true, select: true, unique: true },
    phaseReferenceId: {
      type: String,
      required: [true, "Phase reference is required"],
      select: true,
    },
    projectReferenceId: {
      type: String,
      required: [true, "Phase reference is required"],
      select: true,
    },
    taskContent: {
      type: String,
      required: [true, "Project name is required"],
      select: true,
      maxlength: 128,
    },
    dateOfDeadline: { type: Date, required: true },
    isCompleted: { type: Boolean },
  },
  { timestamps: true }
);

export default taskSchema;
