var MyShares = artifacts.require("./MyShares.sol");

contract('MyShares', function(accounts){
    //coin info
    var name = "KevinCoin";
    var decimals = 0;
    var totalSupply = 10000;
    var symbol = "KVCT";

    var mySharesContract;
    var ownerAccount;
    it('Check Initialization', function(){
        return MyShares.deployed().then(function(instance){
            mySharesContract = instance;
            ownerAccount = accounts[0];
            return mySharesContract.balanceOf.call(accounts[0]);
        }).then(function(account0Balance){
            assert(account0Balance, totalSupply, "Incorrect balance");
            return mySharesContract.decimals.call();
        }).then(function(contractDecimals){
            assert(contractDecimals, decimals, "Incorrect decimals");
            return mySharesContract.name.call();
        }).then(function(contractName){
            assert(contractName, name, "Incorrect name");
            return mySharesContract.symbol.call();
        }).then(function(contractSymbol){
            assert(contractSymbol, symbol, "Incorrect symbol");
            return mySharesContract.totalSupply.call();
        }).then(function(contractTotalSupply){
            assert(contractTotalSupply, totalSupply, "Incorrect total supply");
        });
    });

    it("Check adding + removing verified addresses", function(){

    });

    it("Check coin transfer for verified addresses", function(){

    });

    it("Check coin transfer for non-verified addresses", function(){

    });

    it("Check other erc884 specific functions", function(){

    });

    it("Check minting", function(){

    });
});