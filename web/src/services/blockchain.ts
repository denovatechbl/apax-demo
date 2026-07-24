import { ethers } from "ethers";
import * as dotenv from "dotenv";

dotenv.config();

export const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);

export const contract = new ethers.Contract(
  process.env.CONTRACT_ADDRESS!,
  [
    "function getBalance(address) view returns (uint256)",
    "event Deposited(address indexed user, uint256 amount)",
    "event Withdrawn(address indexed user, uint256 amount)"
  ],
  provider
);