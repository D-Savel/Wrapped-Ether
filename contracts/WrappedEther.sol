// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/Address.sol";

contract WrappedEther is ERC20 {
    using Address for address payable;

    address private _tokenOwner;

    event Deposited(address indexed buyer, uint256 nbTokens);
    event Withdrew(address indexed recipient, uint256 etherAmount);

    constructor() ERC20("WrappedEther", "WETH") {}

    receive() external payable {
        deposit();
    }

    function deposit() public payable returns (bool) {
        _mint(msg.sender, msg.value);
        emit Deposited(msg.sender, msg.value);
        return true;
    }

    function withdraw(uint256 amount) public {
        require(balanceOf(msg.sender) >= amount, "WrappedEther: Not enough WETH tokens to withdraw ");
        _burn(msg.sender, amount);
        payable(msg.sender).sendValue(amount);
        emit Withdrew(msg.sender, amount);
    }
}
