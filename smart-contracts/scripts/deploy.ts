import { network } from "hardhat";


async function main() {


  const { ethers } =
    await network.connect();



  const [deployer] =
    await ethers.getSigners();



  console.log(
    "Deploying contract with:",
    deployer.address
  );



  const balance =
    await ethers.provider.getBalance(
      deployer.address
    );



  console.log(
    "Deployer balance:",
    ethers.formatEther(balance),
    "ETH"
  );



  const APAXToken =
    await ethers.getContractFactory(
      "APAXToken"
    );



  const token =
    await APAXToken.deploy(
      deployer.address
    );



  await token.waitForDeployment();



  const address =
    await token.getAddress();



  console.log(
    "APAXToken deployed at:",
    address
  );


}



main()
  .catch((error) => {

    console.error(error);

    process.exitCode = 1;

  });