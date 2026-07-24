import { Router, Request, Response } from "express";
import { addDeposit, addWithdrawal, getBalanceSummary } from "../services/balance";

const router = Router();

// Get all activity
router.get("/", (req: Request, res: Response) => {
  res.json(getBalanceSummary());
});

// Add deposit
router.post("/deposit", (req: Request, res: Response) => {
  const { user, amount } = req.body;
  if (!user || !amount) {
    return res.status(400).json({ error: "Missing user or amount" });
  }
  const deposit = addDeposit(user, Number(amount));
  res.status(201).json(deposit);
});

// Add withdrawal
router.post("/withdrawal", (req: Request, res: Response) => {
  const { user, amount } = req.body;
  if (!user || !amount) {
    return res.status(400).json({ error: "Missing user or amount" });
  }
  const withdrawal = addWithdrawal(user, Number(amount));
  res.status(201).json(withdrawal);
});

export default router;
