var myShares = artifacts.require('./MyShares.sol');
var safeMath = artifacts.require('./lib/SafeMath.sol');

module.exports = function(deployer){
    deployer.deploy(safeMath);
    deployer.link(safeMath, myShares);
    deployer.deploy(myShares, "Kevin Co", "KCCT", 10000);
}