import { Router } from "express";
import { postSendEmail } from "../controllers/mail.controller.js";

const router = Router ();

//POST
router.post("/send", postSendEmail);

export default router;