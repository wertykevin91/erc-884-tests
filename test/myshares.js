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

    it("Check adding + removing verified addresses", async() => {
        let mySharesContract = await MyShares.deployed();

        let isHolder = await mySharesContract.isHolder.call(ownerAccount);
        assert.equal(isHolder, true, "owner should be holder yet.");

        let isVerified = await mySharesContract.isVerified.call(ownerAccount);
        assert.equal(isVerified, false, "owner should not be verified yet.");
        
        // random 32byte hash "0x12345678012345678901234567890"
        await mySharesContract.addVerified(ownerAccount, "0x12345678012345678901234567890");

        isVerified = await mySharesContract.isVerified.call(ownerAccount);
        assert.equal(isVerified, true, "owner should be verified now.");

        // add second account

        await mySharesContract.addVerified(secondAccount, "0x12345678012345678901234567890");

        isVerified = await mySharesContract.isVerified.call(secondAccount);
        assert.equal(isVerified, true, "second account should be verified now.");

        // remove second account

        await mySharesContract.removeVerified(secondAccount);

        isVerified = await mySharesContract.isVerified.call(secondAccount);
        assert.equal(isVerified, false, "second account should not be verified anymore.");
    });

    it("Check coin transfer for verified addresses", async() => {
        let mySharesContract = await MyShares.deployed();
        await mySharesContract.addVerified(ownerAccount, "0x12345678012345678901234567890");
        await mySharesContract.addVerified(secondAccount, "0x12345678012345678901234567890");

        let result = await mySharesContract.transfer(secondAccount, totalSupply/2);
        //console.log(result);

        let balance1 = await mySharesContract.balanceOf.call(ownerAccount);
        assert.equal(balance1.toNumber(), totalSupply/2, "Acc 1 Should be: " + totalSupply / 2);
        let balance2 = await mySharesContract.balanceOf.call(secondAccount);
        assert.equal(balance2.toNumber(), totalSupply/2, "Acc 2 Should be: " + totalSupply / 2);
    });

    it("Check coin transfer for non-verified addresses", async() => {
        let mySharesContract = await MyShares.deployed();

        await mySharesContract.addVerified(ownerAccount, "0x12345678012345678901234567890");
        let balance1 = await mySharesContract.balanceOf.call(ownerAccount);

        //second account is not ready

        try{
            let result = await mySharesContract.transfer(secondAccount, balance1/2);
            console.log('here');
        }
        catch(error){
            console.log(error);
        }

        balance1 = await mySharesContract.balanceOf.call(ownerAccount);
        assert.equal(balance1.toNumber(), totalSupply, "Acc 1 should be: " + balance1);

    });

    it("Check other erc884 specific functions", async() => {
        let mySharesContract = await MyShares.deployed();
    });

    it("Check minting", async() => {
        let mySharesContract = await MyShares.deployed();
    });
});