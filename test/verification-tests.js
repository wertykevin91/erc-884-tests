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
})