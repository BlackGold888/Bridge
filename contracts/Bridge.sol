// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./MyERC20.sol";

contract Bridge is Ownable{
    address private tokenAddress;
    uint256 public networkChainId;

    event SwapInitialized(
        address _to,
        address _from,
        uint256 amount,
        uint256 nonce
    );
    
    constructor(address _tokenAddress, uint256 _networkChainId) {
        tokenAddress = _tokenAddress;
        networkChainId = _networkChainId;
    }

    function setTokenAddress(address newTokenAddress) external virtual onlyOwner {
        tokenAddress = newTokenAddress;
    }

    function swap(address _to, address _from, uint256 _amount, uint256 _nonce) external virtual {
        MyERC20(tokenAddress).burn(_from, _amount);
        emit SwapInitialized(_to, _from, _amount, _nonce);
    }

    

    function redeem(address _to, address _from, uint256 _amount, uint256 _nonce, bytes memory _signature) external virtual returns(address){
            bytes32 messageHash = keccak256(
               abi.encodePacked("\x19Ethereum Signed Message:\n32", keccak256(abi.encodePacked(_to, _from,_amount, _nonce)))
            );
            (bytes32 r, bytes32 s, uint8 v) = splitSignature(_signature);
            return ecrecover(messageHash, v, r, s);
    }

    function splitSignature(bytes memory sig)
        public
        pure
        returns (
            bytes32 r,
            bytes32 s,
            uint8 v
        )
    {
        require(sig.length == 65, "invalid signature length");

        assembly {
            /*
            First 32 bytes stores the length of the signature

            add(sig, 32) = pointer of sig + 32
            effectively, skips first 32 bytes of signature

            mload(p) loads next 32 bytes starting at the memory address p into memory
            */

            // first 32 bytes, after the length prefix
            r := mload(add(sig, 32))
            // second 32 bytes
            s := mload(add(sig, 64))
            // final byte (first byte of the next 32 bytes)
            v := byte(0, mload(add(sig, 96)))
        }

        // implicitly return (r, s, v)
    }
}