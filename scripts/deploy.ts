// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { ethers } from "hardhat";

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy

  const TokenERC20 = await ethers.getContractFactory("MyERC20");
  const tokenERC20Instance = await TokenERC20.deploy();
  tokenERC20Instance.deployed();

  const Bridge = await ethers.getContractFactory("Bridge");
  const bridgeInstance = await Bridge.deploy(tokenERC20Instance.address, 3);

  await bridgeInstance.deployed();

  console.log("tokenERC20Instance deployed to:", tokenERC20Instance.address);
  console.log("bridgeInstance deployed to:", bridgeInstance.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
