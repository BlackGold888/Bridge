// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./MyERC20.sol";

contract Bridge is Ownable{
    address private tokenAddress;
    uint256 public networkChainId;
    
    constructor(address _tokenAddress, uint256 _networkChainId) {
        tokenAddress = _tokenAddress;
        networkChainId = _networkChainId;
    }

    function setTokenAddress(address newTokenAddress) external virtual onlyOwner {
        tokenAddress = newTokenAddress;
    }

    function swap(address _to, uint256 _amount, string memory _message, uint256 _nonce) external virtual {
        
    }
}