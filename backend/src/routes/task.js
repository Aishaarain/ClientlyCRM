import express from "express";
import {
  createTask,
  getTasks,
  updateTaskStatus,
  deleteTask,
} from "../controllers/taskController.js";
import { protect, authorizeRoles } from "../middleware/auth.js";

const router = express.Router();

router.get("/", protect, authorizeRoles("admin", "freelancer", "member"), getTasks);

router.post("/", protect, authorizeRoles("admin"), createTask);

router.patch("/:id/status", protect, authorizeRoles("admin", "freelancer", "member"), updateTaskStatus);

router.delete("/:id", protect, authorizeRoles("admin"), deleteTask);

export default router;