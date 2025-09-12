import express from "express";
import { AuthController } from "../../../controllers/index.js";
import { AuthMiddleware } from "../../../middlewares/index.js";
const router = express.Router();

router.post("/login", AuthMiddleware.validateLoginRqst, AuthController.login);

export default router;
