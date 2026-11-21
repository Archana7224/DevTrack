import mongoose from "mongoose";
import Project from "../models/Project.js";
import Issue from "../models/Issue.js";
import {
  createProjectSchema,
  updateProjectSchema,
} from "../validators/project.validator.js";

// CREATE PROJECT
export const createProject = async (req, res) => {
  try {
    const result = createProjectSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid project details",
        errors: result.error.issues,
      });
    }

    const project = await Project.create({
      ...result.data,
      owner: req.user._id,
    });

    return res.status(201).json({
      success: true,
      message: "Project created successfully",
      data: { project },
    });
  } catch (error) {
    console.error("Create project error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// GET ALL PROJECTS
export const getProjects = async (req, res) => {
  try {
    const page = Math.max(1, Number.parseInt(req.query.page, 10) || 1);
    const limit = Math.min(
      50,
      Math.max(1, Number.parseInt(req.query.limit, 10) || 10)
    );

    const filter = { owner: req.user._id };

    if (["active", "completed", "archived"].includes(req.query.status)) {
      filter.status = req.query.status;
    }

    const [projects, total] = await Promise.all([
      Project.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      Project.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      results: projects.length,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
      data: { projects },
    });
  } catch (error) {
    console.error("Get projects error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// GET SINGLE PROJECT
export const getProjectById = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.projectId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid project ID",
      });
    }

    const project = await Project.findOne({
      _id: req.params.projectId,
      owner: req.user._id,
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: { project },
    });
  } catch (error) {
    console.error("Get project error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// UPDATE PROJECT
export const updateProject = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.projectId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid project ID",
      });
    }

    const result = updateProjectSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid project details",
        errors: result.error.issues,
      });
    }

    const project = await Project.findOne({
      _id: req.params.projectId,
      owner: req.user._id,
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    Object.assign(project, result.data);
    await project.save();

    return res.status(200).json({
      success: true,
      message: "Project updated successfully",
      data: { project },
    });
  } catch (error) {
    console.error("Update project error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// DELETE PROJECT
export const deleteProject = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.projectId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid project ID",
      });
    }

    const project = await Project.findOne({
      _id: req.params.projectId,
      owner: req.user._id,
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    const hasIssues = await Issue.exists({ project: project._id });

    if (hasIssues) {
      return res.status(409).json({
        success: false,
        message: "Cannot delete a project that still has issues",
      });
    }

    await project.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (error) {
    console.error("Delete project error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};