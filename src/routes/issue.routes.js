import express from "express";
import protect from "../middleware/auth.middleware.js";

import {
  createIssue,
  getIssues,
  getIssueById,
  updateIssue,
  deleteIssue,
} from "../controllers/issue.controller.js";

const router = express.Router();

router.use(protect);

// Create an issue inside a project
router.post("/projects/:projectId/issues", createIssue);

// Get all issues, with optional filters
router.get("/issues", getIssues);

// Operations on a specific issue
router.route("/issues/:issueId")
  .get(getIssueById)
  .patch(updateIssue)
  .delete(deleteIssue);

export default router;