import express from "express";
import {
  createClient,
  getClients,
  getClientById,
  updateClient,
  deleteClient,
} from "../controllers/clientController.js";

import { protect, authorizeRoles } from "../middleware/auth.js";

const router = express.Router();

router.get(
  "/",
  protect,
  authorizeRoles("admin", "freelancer", "member"),
  getClients
);

router.get(
  "/:id",
  protect,
  authorizeRoles("admin", "freelancer", "member"),
  getClientById
);

router.post(
  "/",
  protect,
  authorizeRoles("admin"),
  createClient
);

router.put(
  "/:id",
  protect,
  authorizeRoles("admin"),
  updateClient
);

router.delete(
  "/:id",
  protect,
  authorizeRoles("admin"),
  deleteClient
);

export default router;