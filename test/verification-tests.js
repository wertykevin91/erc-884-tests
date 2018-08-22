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

    var reusedHash = "0x12345678012345678901234567890";
    var updatedHash = "0x1234567801234567890123456789D";

    it("Check adding + removing verified addresses", async() => {
        let mySharesContract = await MyShares.deployed();

        let isHolder = await mySharesContract.isHolder.call(ownerAccount);
        assert.equal(isHolder, true, "owner should be holder yet.");

        let hasHash = await mySharesContract.hasHash.call(ownerAccount, reusedHash);
        let isVerified = await mySharesContract.isVerified.call(ownerAccount);
        let isShareholder = await mySharesContract.isHolder.call(ownerAccount);
        assert.equal(hasHash, false, "owner should not be have hash yet.");
        assert.equal(isVerified, false, "owner should not be verified yet.");
        assert.equal(isShareholder, true, "owner will be shareholder upon initialization");
        
        // random 32byte hash "0x12345678012345678901234567890"
        await mySharesContract.addVerified(ownerAccount, "0x12345678012345678901234567890");

        hasHash = await mySharesContract.hasHash.call(ownerAccount, reusedHash);
        isVerified = await mySharesContract.isVerified.call(ownerAccount);
        isShareholder = await mySharesContract.isHolder.call(ownerAccount);
        assert.equal(hasHash, true, "owner should have hash.");
        assert.equal(isVerified, true, "owner should be verified now.");
        assert.equal(isShareholder, true, "owner will be shareholder.");

        // update hash

        await mySharesContract.updateVerified(ownerAccount, updatedHash);

        hasHash = await mySharesContract.hasHash.call(ownerAccount, updatedHash);
        let hashOldHash = await mySharesContract.hasHash.call(ownerAccount, reusedHash);
        isVerified = await mySharesContract.isVerified.call(ownerAccount);
        isShareholder = await mySharesContract.isHolder.call(ownerAccount);
        assert.equal(hashOldHash, false, "owner should not have old hash.");
        assert.equal(hasHash, true, "owner should have new hash.");
        assert.equal(isVerified, true, "owner should be verified.");
        assert.equal(isShareholder, true, "owner will be shareholder.");


        // add second account

        await mySharesContract.addVerified(secondAccount, "0x12345678012345678901234567890");

        hasHash = await mySharesContract.hasHash.call(secondAccount, reusedHash);
        isVerified = await mySharesContract.isVerified.call(secondAccount);
        isShareholder = await mySharesContract.isHolder.call(secondAccount);
        assert.equal(hasHash, true, "second account should have hash.");
        assert.equal(isVerified, true, "second account should be verified now.");
        assert.equal(isShareholder, false, "second account will not be shareholder without shares.");

        // remove second account

        await mySharesContract.removeVerified(secondAccount);

        hasHash = await mySharesContract.hasHash.call(secondAccount, reusedHash);
        isVerified = await mySharesContract.isVerified.call(secondAccount);
        isShareholder = await mySharesContract.isHolder.call(secondAccount);
        assert.equal(hasHash, false, "second account should not have hash.");
        assert.equal(isVerified, false, "second account should not be verified anymore.");
        assert.equal(isShareholder, false, "second account will not be shareholder without shares.");

        // re-add second account, transfer to it, then superced it with third account

        await mySharesContract.addVerified(secondAccount, "0x12345678012345678901234567890");
        let result = await mySharesContract.transfer(secondAccount, totalSupply/2);
        await mySharesContract.addVerified(thirdAccount, "0x12345678012345678901234567890");

        await mySharesContract.cancelAndReissue(secondAccount, thirdAccount);
        let balance2 = await mySharesContract.balanceOf.call(secondAccount);
        let balance3 = await mySharesContract.balanceOf.call(thirdAccount);

        assert.equal(balance2.toNumber(), 0, "Acc 2 Should be: " + 0);
        assert.equal(balance3.toNumber(), totalSupply/2, "Acc 3 Should be: " + totalSupply / 2);
    });
})