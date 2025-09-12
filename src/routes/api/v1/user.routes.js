import express from "express";
import { UserController } from "../../../controllers/index.js";
import { UserMiddleware } from "../../../middlewares/index.js";
const router = express.Router();

router.post("/", UserMiddleware.validateCreateUser, UserController.createUser);

export default router;
