# APAX Smart Contracts

Smart contract module for the APAX Portfolio Vault.

## Technologies

- Solidity 0.8.x
- Hardhat 3
- OpenZeppelin v5
- Ethers.js v6
- Hardhat Ignition

## Features

- ERC20 Token
- Holder Whitelist
- Transfer Restrictions
- Ownership Management
- Custom Errors
- Events
- Unit Testing
- Sepolia Deployment
- Source Verification

## Commands

Compile

npx hardhat compile

Test

npx hardhat test

Deploy Local

npx hardhat ignition deploy ignition/modules/APAXToken.ts --network localhost

Deploy Sepolia

npx hardhat ignition deploy ignition/modules/APAXToken.ts --network sepolia

Verify

npx hardhat verify --network sepolia <CONTRACT_ADDRESS> <OWNER_ADDRESS>