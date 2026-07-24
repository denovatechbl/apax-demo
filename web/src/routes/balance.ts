import { Router, Request, Response } from "express";
import { getBalanceSummary } from "../services/balance";

const router = Router();

// Get current balance summary
router.get("/", (req: Request, res: Response) => {
  res.json(getBalanceSummary());
});

export default router;
