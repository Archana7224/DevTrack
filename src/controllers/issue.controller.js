import mongoose from "mongoose";
import Issue from "../models/Issue.js";
import Project from "../models/Project.js";
import User from "../models/User.js";
import {
  createIssueSchema,
  updateIssueSchema,
} from "../validators/issue.validator.js";

// CREATE ISSUE
export const createIssue = async (req, res) => {
  try {
    const { projectId } = req.params;
    const result = createIssueSchema.safeParse(req.body);

    if (!mongoose.isValidObjectId(projectId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid project ID",
      });
    }

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid issue details",
        errors: result.error.issues,
      });
    }

    const project = await Project.findOne({
      _id: projectId,
      owner: req.user._id,
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    if (result.data.assignee) {
      const assigneeExists = await User.exists({
        _id: result.data.assignee,
      });

      if (!assigneeExists) {
        return res.status(404).json({
          success: false,
          message: "Assignee not found",
        });
      }
    }

    const issue = await Issue.create({
      ...result.data,
      project: project._id,
      createdBy: req.user._id,
    });

    return res.status(201).json({
      success: true,
      message: "Issue created successfully",
      data: { issue },
    });
  } catch (error) {
    console.error("Create issue error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// GET ALL ISSUES
export const getIssues = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(
      50,
      Math.max(1, parseInt(req.query.limit, 10) || 10)
    );

    const filter = {
      project: {
        $in: await Project.find({ owner: req.user._id }).distinct("_id"),
      },
    };

    if (req.query.projectId) {
      if (!mongoose.isValidObjectId(req.query.projectId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid project ID",
        });
      }

      const ownsProject = await Project.exists({
        _id: req.query.projectId,
        owner: req.user._id,
      });

      if (!ownsProject) {
        return res.status(404).json({
          success: false,
          message: "Project not found",
        });
      }

      filter.project = new mongoose.Types.ObjectId(req.query.projectId);
    }

    const allowedStatuses = ["open", "in-progress", "resolved", "closed"];
    const allowedPriorities = ["low", "medium", "high", "critical"];
    const allowedTypes = ["task", "bug", "feature"];

    if (allowedStatuses.includes(req.query.status)) {
      filter.status = req.query.status;
    }

    if (allowedPriorities.includes(req.query.priority)) {
      filter.priority = req.query.priority;
    }

    if (allowedTypes.includes(req.query.type)) {
      filter.type = req.query.type;
    }

    const sort = req.query.sort === "oldest"
      ? { createdAt: 1 }
      : { createdAt: -1 };

    const [issues, total] = await Promise.all([
      Issue.find(filter)
        .populate("assignee", "name email")
        .populate("createdBy", "name email")
        .populate("project", "name status")
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(limit),
      Issue.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      results: issues.length,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
      data: { issues },
    });
  } catch (error) {
    console.error("Get issues error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// GET SINGLE ISSUE
export const getIssueById = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.issueId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid issue ID",
      });
    }

    const issue = await Issue.findById(req.params.issueId)
      .populate("assignee", "name email")
      .populate("createdBy", "name email")
      .populate("project", "name status owner");

    if (!issue || !issue.project.owner.equals(req.user._id)) {
      return res.status(404).json({
        success: false,
        message: "Issue not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: { issue },
    });
  } catch (error) {
    console.error("Get issue error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// UPDATE ISSUE
export const updateIssue = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.issueId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid issue ID",
      });
    }

    const result = updateIssueSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid issue details",
        errors: result.error.issues,
      });
    }

    const issue = await Issue.findById(req.params.issueId);

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: "Issue not found",
      });
    }

    const ownsProject = await Project.exists({
      _id: issue.project,
      owner: req.user._id,
    });

    if (!ownsProject) {
      return res.status(404).json({
        success: false,
        message: "Issue not found",
      });
    }

    if (result.data.assignee) {
      const assigneeExists = await User.exists({
        _id: result.data.assignee,
      });

      if (!assigneeExists) {
        return res.status(404).json({
          success: false,
          message: "Assignee not found",
        });
      }
    }

    Object.assign(issue, result.data);
    await issue.save();

    await issue.populate([
      { path: "assignee", select: "name email" },
      { path: "createdBy", select: "name email" },
      { path: "project", select: "name status" },
    ]);

    return res.status(200).json({
      success: true,
      message: "Issue updated successfully",
      data: { issue },
    });
  } catch (error) {
    console.error("Update issue error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// DELETE ISSUE
export const deleteIssue = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.issueId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid issue ID",
      });
    }

    const issue = await Issue.findById(req.params.issueId);

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: "Issue not found",
      });
    }

    const ownsProject = await Project.exists({
      _id: issue.project,
      owner: req.user._id,
    });

    if (!ownsProject) {
      return res.status(404).json({
        success: false,
        message: "Issue not found",
      });
    }

    await issue.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Issue deleted successfully",
    });
  } catch (error) {
    console.error("Delete issue error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};