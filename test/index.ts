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

  let TokenERC20: ContractFactory;
  let tokenERC20Instance: Contract;

  let owner: SignerWithAddress;
  let addr1: SignerWithAddress;
  let addr2: SignerWithAddress;

  before(async function () {
    TokenERC20 = await ethers.getContractFactory("MyERC20");
    tokenERC20Instance = await TokenERC20.attach('0x5FbDB2315678afecb367f032d93F642f64180aa3');

    Bridge = await ethers.getContractFactory("Bridge");
    bridgeInstance = await Bridge.attach('0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512');// 3 - ropsten chainId

    [owner, addr1, addr2] = await ethers.getSigners();
  });

  it("Swap", async function () {
    console.log(owner.address);
    await tokenERC20Instance.mint(addr1.address, ethers.utils.parseEther('100'));
    const contractTx: ContractTransaction = await bridgeInstance.connect(addr1).swap(addr1.address, addr2.address, ethers.utils.parseEther('100'), 1);
    const contractReceipt: ContractReceipt = await contractTx.wait();
    const event = contractReceipt.events?.find(event => event.event === 'SwapInitialized');
    expect(await tokenERC20Instance.balanceOf(addr1.address)).to.equal(0);
  });

  it.only("Redeem", async function () {
    console.log(owner.address);
    // await tokenERC20Instance.mint(addr1.address, ethers.utils.parseEther('100'));
    // const contractTx: ContractTransaction = await bridgeInstance.connect(addr1).swap(addr1.address, ethers.utils.parseEther('100'), 'hello', 1);
    // const contractReceipt: ContractReceipt = await contractTx.wait();
    // const event = contractReceipt.events?.find(event => event.event === 'SwapInitialized');
    

    const message:string = web3.utils.keccak256(web3.eth.abi.encodeParameters(
      ['address', 'address', 'uint256', 'uint256'],
      [addr1.address, addr2.address, ethers.utils.parseEther('100').toString(), 1]
    ));
    
    const signature = await web3.eth.sign(message, addr1.address);

    console.log(signature);
    
  //   const buyerHash = web3.utils.soliditySha3(
  //     user1.address,
  //     nft.address,
  //     0,
  //     oneEther,
  // );
  // const buyerSignature = await user1.signMessage(ethers.utils.arrayify(buyerHash));


  //  const temp = ethers.utils.solidityKeccak256(["string", "string", "string", "uint8"], [addr1.address, addr2.address, ethers.utils.parseEther('100'), 1]);
   
    // console.log(temp);
    //const signature = new ethers.utils.SigningKey(temp);
    console.log(await bridgeInstance.connect(addr1).redeem(addr1.address, addr2.address, ethers.utils.parseEther('100'), 1, signature));
    
  });
});
