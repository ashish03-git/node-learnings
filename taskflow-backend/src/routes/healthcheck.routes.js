import { Router } from "express";
import healthCheck from "../controllers/healthcheck-controller.js";
import { verifyJWTtoken } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/").get(verifyJWTtoken, healthCheck);

export default router;
