const FranklinDecentralizedMarketplaceMediation = artifacts.require("FranklinDecentralizedMarketplaceMediation");

module.exports = function(deployer) {
	deployer.deploy(FranklinDecentralizedMarketplaceMediation);
};