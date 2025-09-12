import express from "express";
import { UserController } from "../../controllers/index.js";
const router = express.Router();

router.post("/callback", UserController.createUser);

export default router;
