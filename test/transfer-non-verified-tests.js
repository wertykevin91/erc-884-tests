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

    it("Check coin transfer for non-verified addresses", async() => {
        let mySharesContract = await MyShares.deployed();

        await mySharesContract.addVerified(ownerAccount, "0x12345678012345678901234567890");
        let balance1 = await mySharesContract.balanceOf.call(ownerAccount);

        //second account is not ready

        let error1;
        try{
            let result = await mySharesContract.transfer(secondAccount, balance1/2);
        }
        catch(error){
            error1 = error;
        }

        assert(error1!= null, true, "No error on transfer to unverified account.");

        balance1 = await mySharesContract.balanceOf.call(ownerAccount);
        assert.equal(balance1.toNumber(), totalSupply, "Acc 1 should be: " + balance1);

    });
})