import { Router } from "express";
import { getLoginController, getRegisterController, getProfileController, viewUsersController } from "../controllers/users.views.controller.js";
import { getUserDocuments } from "../controllers/users.controllers.js";
import { isAdminMiddleware } from "../controllers/sessions.controller.js";
const router = Router ();

//GET
router.get("/login", getLoginController);
router.get("/register", getRegisterController);
router.get("/profile", getProfileController);
router.get("/:uid/documents", getUserDocuments);
router.get("/view", isAdminMiddleware, viewUsersController)

export default router;