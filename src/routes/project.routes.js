import express from "express";
import protect from "../middleware/auth.middleware.js";

import {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
} from "../controllers/project.controller.js";

const router = express.Router();

router.use(protect);

router.route("/")
  .post(createProject)
  .get(getProjects);

router.route("/:projectId")
  .get(getProjectById)
  .patch(updateProject)
  .delete(deleteProject);

export default router;