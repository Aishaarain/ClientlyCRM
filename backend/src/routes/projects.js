import express from "express";
import {
  createProject,
  getProjects,
  updateProject,
  deleteProject,
  getProjectById
} from "../controllers/projectController.js";
import { protect, authorizeRoles } from "../middleware/auth.js";

const router = express.Router();

router.get("/", protect, authorizeRoles("admin", "freelancer", "member"), getProjects);

router.post("/", protect, authorizeRoles("admin"), createProject);

router.put("/:id", protect, authorizeRoles("admin"), updateProject);

router.delete("/:id", protect, authorizeRoles("admin"), deleteProject);

router.get("/:id", protect, getProjectById);
export default router;