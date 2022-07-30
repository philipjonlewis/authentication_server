import mongoose from "mongoose";

const { Schema } = mongoose;
import { v4 as uuidV4 } from "uuid";

const projectSchema = new Schema(
  {
    user: { type: String, required: true, select: true },
    projectId: { type: String, required: true, select: true, unique: true },
    projectName: {
      type: String,
      required: [true, "Project name is required"],
      select: true,
      maxlength: 64,
    },
    projectDescription: {
      type: String,
      required: false,
      select: true,
      maxlength: 128,
    },
    dateOfDeadline: { type: Date, required: false },
  },
  { timestamps: true }
);

export default projectSchema;
