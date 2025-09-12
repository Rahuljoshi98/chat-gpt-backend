import express from "express";
const router = express.Router();

import apiRoutes from "./api/index.js";
import clerkRoutes from "./clerk/index.js";

router.use("/api", apiRoutes);

router.use("/clerk", clerkRoutes);

export default router;
