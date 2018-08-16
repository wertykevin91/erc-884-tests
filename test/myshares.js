var MyShares = artifacts.require("./MyShares.sol");

contract('MyShares', async(accounts) => {
    //coin info
    var name = "KevinCoin";
    var decimals = 0;
    var totalSupply = 10000;
    var symbol = "KVCT";

    // declare ac vars to make my life easier
    var ownerAccount = accounts[0];
    var secondAccount = accounts[1];
    var thirdAccount = accounts[2];

    it('Check Initialization', function(){
        var mySharesContract;

        return MyShares.deployed().then(function(instance){
            mySharesContract = instance;
            return mySharesContract.balanceOf.call(accounts[0]);
        }).then(function(account0Balance){
            assert.equal(account0Balance, totalSupply, "Incorrect balance");
            return mySharesContract.decimals.call();
        }).then(function(contractDecimals){
            assert.equal(contractDecimals, decimals, "Incorrect decimals");
            return mySharesContract.name.call();
        }).then(function(contractName){
            assert.equal(contractName, name, "Incorrect name");
            return mySharesContract.symbol.call();
        }).then(function(contractSymbol){
            assert.equal(contractSymbol, symbol, "Incorrect symbol");
            return mySharesContract.totalSupply.call();
        }).then(function(contractTotalSupply){
            assert.equal(contractTotalSupply, totalSupply, "Incorrect total supply");
        });
    });
});