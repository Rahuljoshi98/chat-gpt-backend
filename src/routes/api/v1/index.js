import express from "express";
import UserRoutes from "./user.routes.js";
import AuthRoutes from "./auth.routes.js";
import ChatRoutes from "./chat.routes.js";
import ProjectRoutes from "./project.router.js";

const router = express.Router();

router.use("/user", UserRoutes);
router.use("/auth", AuthRoutes);
router.use("/chat", ChatRoutes);
router.use("/project", ProjectRoutes);

export default router;
