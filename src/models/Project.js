
import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Project name is required"],
      trim: true,
      minlength: 3,
      maxlength: 100,
    },

    description: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: "",
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Project owner is required"],
    },

    status: {
      type: String,
      enum: ["active", "completed", "archived"],
      default: "active",
    },

    startDate: {
      type: Date,
      default: Date.now,
    },

    dueDate: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Helps retrieve projects belonging to a particular user.
projectSchema.index({ owner: 1, createdAt: -1 });

const Project = mongoose.model("Project", projectSchema);

export default Project;
