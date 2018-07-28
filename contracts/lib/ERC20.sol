pragma solidity ^0.4.24;

import "./ERC20Basic.sol";
import "./SafeMath.sol";

// 23 July 2018
// Refer: https://github.com/OpenZeppelin/openzeppelin-solidity/tree/master/contracts/token/ERC20

/**
 * @title ERC20 interface
 * @dev see https://github.com/ethereum/EIPs/issues/20
 */
contract ERC20 is ERC20Basic {

    using SafeMath for uint256;

    // ERC20

    string public name_;
    string public symbol_;
    uint8 public decimals_;
    uint256 public totalSupply_;

    mapping (address => uint256) internal balances;
    mapping (address => mapping (address => uint256)) internal allowed;

    function allowance(address owner, address spender)
        public view returns (uint256);

    function transferFrom(address from, address to, uint256 value)
        public returns (bool);

    function approve(address spender, uint256 value) public returns (bool);

    event Approval(
        address indexed owner,
        address indexed spender,
        uint256 value
    );
}