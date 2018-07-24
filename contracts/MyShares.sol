pragma solidity ^0.4.24;

import "./lib/ERC884.sol";
import "./lib/Ownable.sol";
import "./lib/SafeMath.sol";

// 23rd July 2018
//

/** My implementation of a simple share using erc 884
*   erc 884 could be subject to change.
*   @author Kevin
**/
contract MyShares is ERC884, Ownable {
    using SafeMath for uint256;

    // ERC20

    string public name;
    string public symbol;
    uint8 public decimals;
    uint256 public totalSupply;

    mapping (address => uint256) balances;
    mapping (address => mapping (address => uint256)) allowed;

    // ERC884

    mapping (address => bytes32) private verifiedAddressHashes;
    uint256 userCount;

    /** Constructor taking in all params decimals will be set to 0
    *   
     **/    
    constructor(string _name, string _symbol, uint256 _totalSupply) public {
        name = _name;
        symbol = _symbol;
        decimals = uint8(0);
        owner = msg.sender;
        totalSupply = _totalSupply;
        balances[msg.sender] = _totalSupply;
    }

    // Implement for ERC 884

    function addVerified(address _addr, bytes32 _hash) public onlyOwner {
        require(verifiedAddressHashes[_addr] == "");
        verifiedAddressHashes[_addr] = _hash;
        emit VerifiedAddressAdded(_addr, _hash, msg.sender);
    }

    function removeVerified(address _addr) public onlyOwner {
        require(verifiedAddressHashes[_addr] != "" && balances[_addr] == 0);
    }

    // Implement for ERC 20

    function totalSupply() public view returns(uint256) {
        return totalSupply;
    }

    function balanceOf(address _addr) public view returns(uint256) {
        return balances[_addr];
    }

    function transfer(address _to, uint256 _value) public returns(bool) {
        _transferTokens(msg.sender, _to, _value);
        return true;
    }

    function transferFrom(address _from, address _to, uint256 _value) public returns(bool) {
        uint256 aTS = allowed[_from][_to];
        require(_value <= aTS && balances[_from] >= _value);
        allowed[_from][_to] = aTS.sub(_value);
        _transferTokens(_from, _to, _value);
        return true;
    }

    function _transferTokens(address _from, address _to, uint256 _value) private {
        require(_value > 0 && balances[_from] >= _value);
        balances[_from] = balances[_from].sub(_value);
        balances[_to] = balances[_to].add(_value);
        emit Transfer(msg.sender, _to, _value);
    }

    function allowance(address _owner, address _spender) public view returns(uint256) {
        return allowed[_owner][_spender];
    }

    function approve(address _spender, uint256 _value) public returns(bool) {
        allowed[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
        return true;
    }
}