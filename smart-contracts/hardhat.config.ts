import hardhatToolboxMochaEthersPlugin from "@nomicfoundation/hardhat-toolbox-mocha-ethers";
import hardhatVerify from "@nomicfoundation/hardhat-verify";
import "dotenv/config";
import { defineConfig } from "hardhat/config";

export default defineConfig({
  plugins: [
    hardhatToolboxMochaEthersPlugin,
    hardhatVerify
  ],
  solidity: {
    profiles: {
      default: {
        version: "0.8.28",
      },
      production: {
        version: "0.8.28",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    },
  },
  networks: {
    hardhatMainnet: {
      type: "edr-simulated",
      chainType: "l1",
    },
    hardhatOp: {
      type: "edr-simulated",
      chainType: "op",
    },
    sepolia: {
      type: "http",
      chainType: "l1",

      url: process.env.SEPOLIA_RPC_URL!,

      accounts: [
        process.env.SEPOLIA_PRIVATE_KEY!
      ],
    },
  },

  etherscan: {

    apiKey: {
      sepolia:
        process.env.ETHERSCAN_API_KEY!
    }

  },
});
