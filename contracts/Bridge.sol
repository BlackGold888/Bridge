// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./MyERC20.sol";

contract Bridge is Ownable{
    address private tokenAddress;
    uint256 public networkChainId;

    event SwapInitialized(
        address to,
        uint256 amount,
        uint256 nonce,
        uint256 networkChainId
    );

    mapping(bytes32 => bool) public users; 
    
    constructor(address _tokenAddress, uint256 _networkChainId) {
        tokenAddress = _tokenAddress;
        networkChainId = _networkChainId;
    }

    function setTokenAddress(address newTokenAddress) external virtual onlyOwner {
        tokenAddress = newTokenAddress;
    }

    function swap(uint256 _amount, uint256 _nonce, uint256 _networkChainId) external virtual {
        MyERC20(tokenAddress).burn(msg.sender, _amount);
        emit SwapInitialized(msg.sender, _amount, _nonce, _networkChainId);
    }

    

    function redeem(uint256 _amount, uint256 _nonce, uint256 _networkChainId, bytes32 r, bytes32 s, uint8 v) external virtual returns(address){
            bytes32 messageHash = keccak256(
               abi.encodePacked("\x19Ethereum Signed Message:\n32", keccak256(abi.encodePacked(msg.sender,_amount, _nonce, _networkChainId)))
            );
            require(users[messageHash] == false, "You already mint");

            users[messageHash] = true;
            MyERC20(tokenAddress).mint(msg.sender, _amount);
            return ecrecover(messageHash, v, r, s);
    }
}