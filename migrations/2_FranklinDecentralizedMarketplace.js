const FranklinDecentralizedMarketplace = artifacts.require("FranklinDecentralizedMarketplace");

module.exports = function(deployer) {
	deployer.deploy(FranklinDecentralizedMarketplace);
};