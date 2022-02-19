import { expect } from "chai";
import { Contract, ContractFactory, ContractReceipt, ContractTransaction } from "ethers";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { boolean, string } from "hardhat/internal/core/params/argumentTypes";

import Web3 from 'web3';
// @ts-ignore
const web3 = new Web3(network.provider) as Web3;


describe("Bridge", function () {
  let Bridge: ContractFactory;
  let bridgeInstance: Contract;
  let bridgeInstance2: Contract;

  let TokenERC20: ContractFactory;
  let tokenERC20Instance: Contract;

  let owner: SignerWithAddress;
  let addr1: SignerWithAddress;
  let addr2: SignerWithAddress;

  beforeEach(async function () {
    TokenERC20 = await ethers.getContractFactory("MyERC20");
    tokenERC20Instance = await TokenERC20.deploy();
    await tokenERC20Instance.deployed();
    Bridge = await ethers.getContractFactory("Bridge");
    bridgeInstance = await Bridge.deploy(tokenERC20Instance.address, 3);
    bridgeInstance2 = await Bridge.deploy(tokenERC20Instance.address, 16);
    
    [owner, addr1, addr2] = await ethers.getSigners();
  });

  it("Swap", async function () {
    console.log(owner.address);
    await tokenERC20Instance.mint(addr1.address, ethers.utils.parseEther('100'));
    const contractTx: ContractTransaction = await bridgeInstance.connect(addr1).swap(ethers.utils.parseEther('100'), 1, 16);
    const contractReceipt: ContractReceipt = await contractTx.wait();
    const event = contractReceipt.events?.find(event => event.event === 'SwapInitialized');
    expect(await tokenERC20Instance.balanceOf(addr1.address)).to.equal(0);
  });

  it.only("Redeem", async function () {
    // await tokenERC20Instance.mint(addr2.address, ethers.utils.parseEther('100'));
    // const contractTx: ContractTransaction = await bridgeInstance.connect(addr2).swap(ethers.utils.parseEther('100').toString(), 1, 16);
    // const contractReceipt: ContractReceipt = await contractTx.wait();
    // const event = contractReceipt.events?.find(event => event.event === 'SwapInitialized');
    
    // console.log(event);
    
    const message:string = web3.utils.keccak256(web3.eth.abi.encodeParameters(
      ['address','uint256', 'uint256', 'uint256'],
      [addr2.address, ethers.utils.parseEther('100').toString(), 1, 16]
    ));

    const signature = await addr2.signMessage(message)

    const {r, s, v} = await ethers.utils.splitSignature(signature);

    // console.log(data);
    await tokenERC20Instance.transferOwnership(bridgeInstance.address);
    
    const redeem = await bridgeInstance.connect(addr2).redeem(ethers.utils.parseEther('100'), 1, 16, r, s, v);
   // console.log(redeem);
    
  });
});
