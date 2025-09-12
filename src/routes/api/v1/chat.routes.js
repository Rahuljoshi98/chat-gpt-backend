import express from "express";
import { ChatController } from "../../../controllers/index.js";
import { ChatMiddleware } from "../../../middlewares/index.js";
import { AuthMiddleware } from "../../../middlewares/index.js";

const router = express.Router();

router.post(
  "/",
  AuthMiddleware.authenticateUser,
  ChatController.addInteraction,
);
router.get("/", AuthMiddleware.authenticateUser, ChatController.getAllChats);
router.get("/:id", AuthMiddleware.authenticateUser, ChatController.getChat);
router.patch(
  "/:id",
  AuthMiddleware.authenticateUser,
  ChatController.updateChat,
);
router.delete(
  "/:id",
  AuthMiddleware.authenticateUser,
  ChatController.deleteUserChat,
);

export default router;
