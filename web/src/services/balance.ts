import { Deposit, Withdrawal } from "../types/api";

export let deposits: Deposit[] = [];
export let withdrawals: Withdrawal[] = [];

// Add a deposit
export function addDeposit(user: string, amount: number): Deposit {
  const deposit: Deposit = {
    id: deposits.length + 1,
    user,
    amount,
    date: new Date().toISOString(),
  };
  deposits.push(deposit);
  return deposit;
}

// Add a withdrawal
export function addWithdrawal(user: string, amount: number): Withdrawal {
  const withdrawal: Withdrawal = {
    id: withdrawals.length + 1,
    user,
    amount,
    date: new Date().toISOString(),
  };
  withdrawals.push(withdrawal);
  return withdrawal;
}

// Get summary
export function getBalanceSummary() {
  return {
    deposits,
    withdrawals,
  };
}
