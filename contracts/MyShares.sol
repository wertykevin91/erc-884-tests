pragma solidity ^0.4.24;

import "./lib/ERC884.sol";
import "./lib/Ownable.sol";
import "./lib/MintableToken.sol";

// 23rd July 2018
//

/** My implementation of a simple share using erc 884
*   erc 884 could be subject to change.
*   @author Kevin
**/
contract MyShares is ERC884, Ownable, MintableToken {

    // ERC884

    mapping (address => bytes32) private verifiedAddressHashes;
    mapping (address => uint256) private shareholdersIndex;

    /** 
    *   To clarify, shareholders are verified address that are currently holding the tokens.
    *   verified addresses might not need to hold tokens because they could have sold their bags
    **/
    address[] private shareholders;

    // TODO: verifiy if cancellation records is actually necessary.
    // We should assume that users will do their own DD elsewhere

    mapping (address => address) private supersededAddresses;

    /** Constructor taking in all params decimals will be set to 0
    *   
     **/    
    constructor(string _name, string _symbol, uint256 _totalSupply) public {
        name = _name;
        symbol = _symbol;
        decimals = uint8(0);
        owner = msg.sender;
        totalSupply_ = _totalSupply;

        if(_totalSupply > 0){
            balances[msg.sender] = _totalSupply;
            shareholdersIndex[msg.sender] = shareholders.push(msg.sender);
        }
    }

    // Section private functions

    /**
    *   With inspirations taken from prune shareholder from the reference implementation obviously.
    **/
    function _cleanShareholder(address _addr) private {
        // check if address still has coin
        // check if not, remove coin from index mapping. then replace last coin to current index. 
        // change last coin index to current index

        if(balances[_addr] == 0) {
            uint256 currentIndex = shareholdersIndex[_addr] - 1;
            address lastAddr = shareholders[shareholders.length - 1];
            shareholders[currentIndex] = lastAddr;
            shareholders.length--;
            shareholdersIndex[_addr] = 0;
            shareholdersIndex[lastAddr] = currentIndex + 1; 
        }
    }

    function _addShareHolder(address _addr) private {
        if(shareholdersIndex[_addr] == 0) {
            shareholdersIndex[_addr] = shareholders.push(_addr);
        }
    }

    function _transferTokens(address _from, address _to, uint256 _value) private {
        require(_value > 0 && balances[_from] >= _value, "Insufficient balance");

        balances[_from] = balances[_from].sub(_value);
        balances[_to] = balances[_to].add(_value);

        _cleanShareholder(_from);
        _addShareHolder(_to);
    }

    // Implement for Mintable Token

    function mint(address _to, uint256 _amount) public onlyOwner onlyVerifiedAddress(_to) returns(bool){
        _addShareHolder(_to);
        return super.mint(_to, _amount);
    }

    // Implement for ERC 884

    // Section modifiers

    modifier onlyVerifiedAddress(address _address) {
        require(verifiedAddressHashes[_address] != bytes32(0), "No such address");
        _;
    }

    modifier onlyShareholder(address _address) {
        require(shareholdersIndex[_address] != 0, "No such address");
        _;
    }

    // Section functions

    function isHolder(address _addr) public view returns(bool) {
        return shareholdersIndex[_addr] != 0;
    }

    function isVerified(address _addr) public view returns(bool) {
        return verifiedAddressHashes[_addr] != bytes32(0);
    }

    function hasHash(address _addr, bytes32 _hash) public view returns(bool) {
        return verifiedAddressHashes[_addr] == _hash;
    }

    function isSuperseded(address _addr) public view returns(bool) {
        return supersededAddresses[_addr] != address(0);
    }

    function holderCount() public view returns(uint256) {
        return shareholders.length;
    }

    function holderAt(uint256 _index) public view returns(address) {
        return shareholders[_index - 1];
    }

    function getCurrentFor(address _addr) public view returns(address) {
        if(supersededAddresses[_addr] != address(0))
            return getCurrentFor(supersededAddresses[_addr]);
        else
            return _addr;
    }

    function addVerified(address _addr, bytes32 _hash) public onlyOwner {
        require(supersededAddresses[_addr] == address(0), "Address is superseded");
        require(verifiedAddressHashes[_addr] == bytes32(0), "No such address");
        verifiedAddressHashes[_addr] = _hash;
        emit VerifiedAddressAdded(_addr, _hash, msg.sender);
    }

    function removeVerified(address _addr) public onlyOwner  onlyVerifiedAddress(_addr) {
        require(balances[_addr] == 0, "Address has balance");
        verifiedAddressHashes[_addr] = bytes32(0);
        emit VerifiedAddressRemoved(_addr, msg.sender); 
    }

    function updateVerified(address _addr, bytes32 _hash) public onlyOwner onlyVerifiedAddress(_addr) {
        require(_hash != bytes32(0), "Hash is empty.");
        bytes32 oldHash = verifiedAddressHashes[_addr];
        verifiedAddressHashes[_addr] = _hash;
        emit VerifiedAddressUpdated(_addr, oldHash, _hash, msg.sender);
    }

    function cancelAndReissue(address _oldAddr, address _newAddr) public 
    onlyOwner 
    onlyVerifiedAddress(_oldAddr) 
    onlyShareholder(_oldAddr)
    onlyVerifiedAddress(_newAddr) {
        require(shareholdersIndex[_newAddr] == 0, "Is not shareholder.");
        supersededAddresses[_oldAddr] = _newAddr;
        _transferTokens(_oldAddr, _newAddr, balances[_oldAddr]);
        emit VerifiedAddressSuperseded(_oldAddr, _newAddr, msg.sender);
    }

    // Implement for ERC 20

    function totalSupply() public view returns(uint256) {
        return totalSupply_;
    }

    function balanceOf(address _addr) public view returns(uint256) {
        return balances[_addr];
    }

    function transfer(address _to, uint256 _value) public onlyShareholder(msg.sender) onlyVerifiedAddress(_to) returns(bool) {
        _transferTokens(msg.sender, _to, _value);
        emit Transfer(msg.sender, _to, _value);
        return true;
    }

    function transferFrom(address _from, address _to, uint256 _value) public returns(bool) {
        uint256 allowedTransferSender = allowed[_from][msg.sender];
        require(_value <= allowedTransferSender && balances[_from] >= _value, "Insufficient allowance");
        require(_to != address(0), "Address error");
        allowed[_from][msg.sender] = allowedTransferSender.sub(_value);
        _transferTokens(_from, _to, _value);
        emit Transfer(msg.sender, _to, _value);
        return true;
    }

    function allowance(address _owner, address _spender) public view returns(uint256) {
        return allowed[_owner][_spender];
    }

    function approve(address _spender, uint256 _value) public onlyVerifiedAddress(_spender) returns(bool) {
        require(balances[_spender] > _value, "Insufficient balance");
        allowed[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);

        return true;
    }
}