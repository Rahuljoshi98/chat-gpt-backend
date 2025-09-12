import express from "express";
import { ProjectController } from "../../../controllers/index.js";
import {
  ProjectMiddleware,
  AuthMiddleware,
} from "../../../middlewares/index.js";
const router = express.Router();

router.post(
  "/",
  AuthMiddleware.authenticateUser,
  ProjectMiddleware.validateCreateProjectRqst,
  ProjectController.createProject,
);

router.get(
  "/",
  AuthMiddleware.authenticateUser,
  ProjectController.getAllProjects,
);

router.patch(
  "/:id",
  AuthMiddleware.authenticateUser,
  ProjectMiddleware.validateUpdateProjectRqst,
  ProjectController.updateProject,
);
export default router;
