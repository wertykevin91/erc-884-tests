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
});