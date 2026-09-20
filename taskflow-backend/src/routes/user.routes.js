import { Router } from "express";
import { verifyJWTtoken } from "../middlewares/auth.middleware.js";
import { getUserInfo } from "../controllers/user.controllers.js";

const router = Router();

router.route("/user-info").post(verifyJWTtoken, getUserInfo);

export default router;
