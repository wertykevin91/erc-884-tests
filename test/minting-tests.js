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

    it("Check minting", async() => {
        let mySharesContract = await MyShares.deployed();

        var mintAmount = 10000;

        // we verify our current account
        await mySharesContract.addVerified(ownerAccount, "0x12345678012345678901234567890");
        await mySharesContract.addVerified(secondAccount, "0x12345678012345678901234567890");
        let result  = await mySharesContract.mint(ownerAccount, mintAmount);
        let result1  = await mySharesContract.mint(secondAccount, mintAmount);

        let currentTotalSupply = await mySharesContract.totalSupply.call();
        let balance1 = await mySharesContract.balanceOf.call(ownerAccount);
        let balance2 = await mySharesContract.balanceOf.call(secondAccount);
        assert.equal(currentTotalSupply, totalSupply + 2 * mintAmount, "Final total supply incorrect");
        assert.equal(mintAmount + totalSupply, balance1.toNumber(), "Balance inaccurate account 1.");
        assert.equal(mintAmount, balance2.toNumber(), "Balance inaccurate account 2.");
    });
    
});