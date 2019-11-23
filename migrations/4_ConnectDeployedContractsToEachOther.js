const FranklinDecentralizedMarketplace = artifacts.require("FranklinDecentralizedMarketplace");
const FranklinDecentralizedMarketplaceMediation = artifacts.require("FranklinDecentralizedMarketplaceMediation");

// References:
// 1) https://www.trufflesuite.com/docs/truffle/getting-started/running-migrations#deployer-then-function-
// 2) https://www.trufflesuite.com/docs/truffle/getting-started/interacting-with-your-contracts

module.exports = async function(deployer) {
	var franklinDecentralizedMarketplace = undefined;
	var franklinDecentralizedMarketplaceMediation = undefined;

	console.log();

	console.log('   Check to see if FranklinDecentralizedMarketplace and FranklinDecentralizedMarketplaceMediation Smart Contracts have been deployed....');
	console.log('   -------------------------------------------------------------------------------------------------------------------------------------');

	// console.log('FranklinDecentralizedMarketplace = ', FranklinDecentralizedMarketplace);
	// console.log('deployer =', deployer);

	await FranklinDecentralizedMarketplace.deployed().then(function(instance) {
		franklinDecentralizedMarketplace = instance;
	});

	// Above will return an instance EVEN if the FranklinDecentralizedMarketplace has not been deployed, but there is a way to test if it
	// has been deployed. Call the below function, and if it has not been properly deployed, an Error will be thrown.
	try {
		await franklinDecentralizedMarketplace.mediationMarketplaceHasBeenSet.call();
	}
	catch (error) {
		franklinDecentralizedMarketplace = undefined;
	}

	if (franklinDecentralizedMarketplace == undefined) {
		console.log('   > FranklinDecentralizedMarketplace Smart Contract has not been deployed. Please deploy it! Cannot proceed any further!');
		console.log();
		console.log('   > !!!!!!! Please have the FranklinDecentralizedMarketplace Smart Contract properly deployed in one of the Migrations Files to properly deploy it! !!!!!!!');
		return;
	}

	console.log(`   > FranklinDecentralizedMarketplace Smart Contract has been deployed at the ${franklinDecentralizedMarketplace.address} Ethereum Address.`);

	await FranklinDecentralizedMarketplaceMediation.deployed().then(function(instance) {
		franklinDecentralizedMarketplaceMediation = instance;
	});

	// Above will return an instance EVEN if the FranklinDecentralizedMarketplaceMediation has not been deployed, but there is a way to test if it
	// has been deployed. Call the below function, and if it has not been properly deployed, an Error will be thrown.
	try {
		await franklinDecentralizedMarketplaceMediation.franklinDecentralizedMarketplaceContractHasBeenSet.call()
	}
	catch (error) {
		franklinDecentralizedMarketplaceMediation = undefined;
	}

	if (franklinDecentralizedMarketplaceMediation == undefined) {
		console.log('   > FranklinDecentralizedMarketplaceMediation Smart Contract has not been deployed. Please deploy it! Cannot proceed any further!');
		console.log();
		console.log('   > !!!!!!! Please have the FranklinDecentralizedMarketplaceMediation Smart Contract properly deployed in one of the Migrations Files to properly deploy it! !!!!!!!');
		return;
	}

	console.log(`   > FranklinDecentralizedMarketplaceMediation Smart Contract has been deployed at the ${franklinDecentralizedMarketplaceMediation.address} Ethereum Address.`);

	console.log();

	console.log('   Check to see if FranklinDecentralizedMarketplace and FranklinDecentralizedMarketplaceMediation Smart Contracts are connected to (i.e., referencing) each other....');
	console.log('   ------------------------------------------------------------------------------------------------------------------------------------------------------------------');


	let franklinDecentralizedMarketplace_mediationMarketplaceHasBeenSet_instance_before_setting = undefined;
	await franklinDecentralizedMarketplace.mediationMarketplaceHasBeenSet.call().then(function(instance) {
		franklinDecentralizedMarketplace_mediationMarketplaceHasBeenSet_instance_before_setting = instance;
	});

	if (franklinDecentralizedMarketplace_mediationMarketplaceHasBeenSet_instance_before_setting) {
		console.log('   > FranklinDecentralizedMarketplace Smart Contract is already connected to (i.e., referencing) the FranklinDecentralizedMarketplaceMediation Smart Contract.');
	}
	else {
		console.log('   > FranklinDecentralizedMarketplace Smart Contract is not connected to (i.e., referencing) the FranklinDecentralizedMarketplaceMediation Smart Contract.');
	}

	// console.log('   franklinDecentralizedMarketplace_mediationMarketplaceHasBeenSet_instance_before_setting =',
	//	franklinDecentralizedMarketplace_mediationMarketplaceHasBeenSet_instance_before_setting);

	let franklinDecentralizedMarketplaceMediation_franklinDecentralizedMarketplaceContractHasBeenSet_instance_before_setting = undefined;
	await franklinDecentralizedMarketplaceMediation.franklinDecentralizedMarketplaceContractHasBeenSet.call().then(function(instance) {
		franklinDecentralizedMarketplaceMediation_franklinDecentralizedMarketplaceContractHasBeenSet_instance_before_setting = instance;
	});

	if (franklinDecentralizedMarketplaceMediation_franklinDecentralizedMarketplaceContractHasBeenSet_instance_before_setting) {
		console.log('   > FranklinDecentralizedMarketplaceMediation Smart Contract is already connected to (i.e., referencing) the FranklinDecentralizedMarketplace Smart Contract.');
	}
	else {
		console.log('   > FranklinDecentralizedMarketplaceMediation Smart Contract is not connected to (i.e., referencing) the FranklinDecentralizedMarketplace Smart Contract.');
	}

	// console.log('   franklinDecentralizedMarketplaceMediation_franklinDecentralizedMarketplaceContractHasBeenSet_instance_before_setting =',
	//	franklinDecentralizedMarketplaceMediation_franklinDecentralizedMarketplaceContractHasBeenSet_instance_before_setting);

	console.log();

	// console.log('   franklinDecentralizedMarketplace =', franklinDecentralizedMarketplace);
	// console.log('   franklinDecentralizedMarketplaceMediation =', franklinDecentralizedMarketplaceMediation);
	// console.log('   franklinDecentralizedMarketplace.address =', franklinDecentralizedMarketplace.address);
	// console.log('   franklinDecentralizedMarketplaceMediation.address =', franklinDecentralizedMarketplaceMediation.address);
	// console.log();

	console.log('   Make certain that FranklinDecentralizedMarketplace and FranklinDecentralizedMarketplaceMediation Smart Contracts are connected to (i.e., referencing) each other....');
	console.log('   --------------------------------------------------------------------------------------------------------------------------------------------------------------------');

	let franklinDecentralizedMarketplace_mediationMarketplace_instance_before_setting = undefined;
	await franklinDecentralizedMarketplace.mediationMarketplace.call().then(function(instance) {
		franklinDecentralizedMarketplace_mediationMarketplace_instance_before_setting = instance;
	});

	// console.log('   franklinDecentralizedMarketplace_mediationMarketplace_instance_before_setting = ',
	//	franklinDecentralizedMarketplace_mediationMarketplace_instance_before_setting);

	let franklinDecentralizedMarketplaceMediation_franklinDecentralizedMarketplaceContract_instance_before_setting = undefined;
	await franklinDecentralizedMarketplaceMediation.franklinDecentralizedMarketplaceContract.call().then(function(instance) {
		franklinDecentralizedMarketplaceMediation_franklinDecentralizedMarketplaceContract_instance_before_setting = instance;
	});

	// console.log('   franklinDecentralizedMarketplaceMediation_franklinDecentralizedMarketplaceContract_instance_before_setting = ',
	//	franklinDecentralizedMarketplaceMediation_franklinDecentralizedMarketplaceContract_instance_before_setting);

	// console.log('   franklinDecentralizedMarketplace.mediationMarketplace.call() = ', franklinDecentralizedMarketplace.mediationMarketplace.call());
	// console.log();

	if (!franklinDecentralizedMarketplace_mediationMarketplaceHasBeenSet_instance_before_setting) {
		franklinDecentralizedMarketplace.setFranklinDecentralizedMarketplaceMediationContract(franklinDecentralizedMarketplaceMediation.address);
	}

	if (!franklinDecentralizedMarketplaceMediation_franklinDecentralizedMarketplaceContractHasBeenSet_instance_before_setting) {
		franklinDecentralizedMarketplaceMediation.setFranklinDecentralizedMarketplaceContract(franklinDecentralizedMarketplace.address);
	}

	// console.log();
	// console.log('   franklinDecentralizedMarketplace.mediationMarketplace.call() = ', franklinDecentralizedMarketplace.mediationMarketplace.call());
	// console.log();

	let franklinDecentralizedMarketplace_mediationMarketplace_instance_after_setting = undefined;
	await franklinDecentralizedMarketplace.mediationMarketplace.call().then(function(instance) {
		franklinDecentralizedMarketplace_mediationMarketplace_instance_after_setting = instance;
	});

	if (franklinDecentralizedMarketplace_mediationMarketplaceHasBeenSet_instance_before_setting) {
		console.log(`   > FranklinDecentralizedMarketplace Smart Contract is already connected to (i.e., referencing) the ` +
			`FranklinDecentralizedMarketplaceMediation Smart Contract located at Ethereum Address ` +
			`${franklinDecentralizedMarketplace_mediationMarketplace_instance_after_setting}`);
	}
	else {
		console.log(`   > FranklinDecentralizedMarketplace Smart Contract is now connected to (i.e., referencing) the ` +
			`FranklinDecentralizedMarketplaceMediation Smart Contract located at Ethereum Address ` +
			`${franklinDecentralizedMarketplace_mediationMarketplace_instance_after_setting}`);
	}

	// console.log('   franklinDecentralizedMarketplace_mediationMarketplace_instance_after_setting = ',
	//	franklinDecentralizedMarketplace_mediationMarketplace_instance_after_setting);

	let franklinDecentralizedMarketplaceMediation_franklinDecentralizedMarketplaceContract_instance_after_setting = undefined;
	await franklinDecentralizedMarketplaceMediation.franklinDecentralizedMarketplaceContract.call().then(function(instance) {
		franklinDecentralizedMarketplaceMediation_franklinDecentralizedMarketplaceContract_instance_after_setting = instance;
	});

	if (franklinDecentralizedMarketplaceMediation_franklinDecentralizedMarketplaceContractHasBeenSet_instance_before_setting) {
		console.log(`   > FranklinDecentralizedMarketplaceMediation Smart Contract is already connected to (i.e., referencing) the ` +
			`FranklinDecentralizedMarketplace Smart Contract located at Ethereum Address ` +
			`${franklinDecentralizedMarketplaceMediation_franklinDecentralizedMarketplaceContract_instance_after_setting}`);
	}
	else {
		console.log(`   > FranklinDecentralizedMarketplaceMediation Smart Contract is now connected to (i.e., referencing) the ` +
			`FranklinDecentralizedMarketplace Smart Contract located at Ethereum Address ` +
			`${franklinDecentralizedMarketplaceMediation_franklinDecentralizedMarketplaceContract_instance_after_setting}`);
	}

	// console.log('   franklinDecentralizedMarketplaceMediation_franklinDecentralizedMarketplaceContract_instance_after_setting = ',
	//	franklinDecentralizedMarketplaceMediation_franklinDecentralizedMarketplaceContract_instance_after_setting);

	console.log();
}