import express, { Router } from "express";
import { getUserHoldings } from "../controllers/holdingController";
import { isAuthenticatedUser } from "../middlewares/user_actions/auth";

const router: Router = express.Router();

// GET /api/holdings — auth required, returns the current user's metal holdings.
router.get("/", isAuthenticatedUser, getUserHoldings);

export default router;
