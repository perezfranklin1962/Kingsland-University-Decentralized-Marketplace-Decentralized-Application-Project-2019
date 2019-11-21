const FranklinDecentralizedMarketplace = artifacts.require("FranklinDecentralizedMarketplace");
const FranklinDecentralizedMarketplaceMediation = artifacts.require("FranklinDecentralizedMarketplaceMediation");

// Reference --> https://www.trufflesuite.com/docs/truffle/getting-started/running-migrations#deployer-then-function-

module.exports = async function(deployer) {
	var franklinDecentralizedMarketplace;
	var franklinDecentralizedMarketplaceMediation;

	await FranklinDecentralizedMarketplace.deployed().then(function(instance) {
		franklinDecentralizedMarketplace = instance;
	});

	await FranklinDecentralizedMarketplaceMediation.deployed().then(function(instance) {
		franklinDecentralizedMarketplaceMediation = instance;
	})

	// console.log('franklinDecentralizedMarketplace =', franklinDecentralizedMarketplace);
	// console.log('franklinDecentralizedMarketplaceMediation =', franklinDecentralizedMarketplaceMediation);
	console.log('franklinDecentralizedMarketplace.address =', franklinDecentralizedMarketplace.address);
	console.log('franklinDecentralizedMarketplaceMediation.address =', franklinDecentralizedMarketplaceMediation.address);
	console.log();

	let franklinDecentralizedMarketplace_mediationMarketplace_instance_before_setting = undefined;
	await franklinDecentralizedMarketplace.mediationMarketplace.call().then(function(instance) {
		franklinDecentralizedMarketplace_mediationMarketplace_instance_before_setting = instance;
	});

	console.log('franklinDecentralizedMarketplace_mediationMarketplace_instance_before_setting = ',
		franklinDecentralizedMarketplace_mediationMarketplace_instance_before_setting);

	let franklinDecentralizedMarketplaceMediation_franklinDecentralizedMarketplaceContract_instance_before_setting = undefined;
	await franklinDecentralizedMarketplaceMediation.franklinDecentralizedMarketplaceContract.call().then(function(instance) {
		franklinDecentralizedMarketplaceMediation_franklinDecentralizedMarketplaceContract_instance_before_setting = instance;
	});

	console.log('franklinDecentralizedMarketplaceMediation_franklinDecentralizedMarketplaceContract_instance_before_setting = ',
		franklinDecentralizedMarketplaceMediation_franklinDecentralizedMarketplaceContract_instance_before_setting);

	// console.log('franklinDecentralizedMarketplace.mediationMarketplace.call() = ', franklinDecentralizedMarketplace.mediationMarketplace.call());
	console.log();


	franklinDecentralizedMarketplace.setFranklinDecentralizedMarketplaceMediationContract(franklinDecentralizedMarketplaceMediation.address);
	franklinDecentralizedMarketplaceMediation.setFranklinDecentralizedMarketplaceContract(franklinDecentralizedMarketplace.address);

	console.log();
	console.log('franklinDecentralizedMarketplace.mediationMarketplace.call() = ', franklinDecentralizedMarketplace.mediationMarketplace.call());
	console.log();

	let franklinDecentralizedMarketplace_mediationMarketplace_instance_after_setting = undefined;
	await franklinDecentralizedMarketplace.mediationMarketplace.call().then(function(instance) {
		franklinDecentralizedMarketplace_mediationMarketplace_instance_after_setting = instance;
	});
	console.log('franklinDecentralizedMarketplace_mediationMarketplace_instance_after_setting = ',
		franklinDecentralizedMarketplace_mediationMarketplace_instance_after_setting);

	let franklinDecentralizedMarketplaceMediation_franklinDecentralizedMarketplaceContract_instance_after_setting = undefined;
	await franklinDecentralizedMarketplaceMediation.franklinDecentralizedMarketplaceContract.call().then(function(instance) {
		franklinDecentralizedMarketplaceMediation_franklinDecentralizedMarketplaceContract_instance_after_setting = instance;
	});

	console.log('franklinDecentralizedMarketplaceMediation_franklinDecentralizedMarketplaceContract_instance_after_setting = ',
		franklinDecentralizedMarketplaceMediation_franklinDecentralizedMarketplaceContract_instance_after_setting);

}