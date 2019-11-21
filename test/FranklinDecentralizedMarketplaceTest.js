const FranklinDecentralizedMarketplace = artifacts.require("FranklinDecentralizedMarketplace");
const FranklinDecentralizedMarketplaceMediation = artifacts.require("FranklinDecentralizedMarketplaceMediation");
const utils = require("./utils.js");

// The "assert" JavaScvript documented in --> https://www.w3schools.com/nodejs/ref_assert.asp
// Reference --> https://www.trufflesuite.com/docs/truffle/getting-started/interacting-with-your-contracts

contract("FranklinDecentralizedMarketplace and FranklinDecentralizedMarketplaceMediation", async accounts => {
	let EMPTY_ADDRESS = "0x0000000000000000000000000000000000000000";
	let EMPTY_STRING = "";
	let NUMBER_OF_ACCOUNTS = 100;

	const DAY = 3600 * 24;

	const FINNEY = 10**15; // WEI
	const ETH = 10**18; // WEI

	// Ganache GUI Server Transactions show "gasUsed" and "cumulativeGasUsed" in units of 10*10. I found this out the hard
	// way when I did a Test Case testing the "FranklinDecentralizedMarketplace.purchaseItemWithoutMediator" and noticed that the
	// 57258 showing up for the "gasUsed" and "commulativeGasUsed" is not in units of WEI, but in 10**10 WEI!
	const GAS_BASE_UNIT = 10**10 // WEI

	// Reference --> https://web3js.readthedocs.io/en/v1.2.0/web3-utils.html#bn
	var BN = web3.utils.BN;

	let franklinDecentralizedMarketplaceContract;
	let franklinDecentralizedMarketplaceMediationContract;

	let randomAddressIndex = 0;

	beforeEach(async () => {
		franklinDecentralizedMarketplaceContract = await FranklinDecentralizedMarketplace.new({from: accounts[0]});
		franklinDecentralizedMarketplaceMediationContract = await FranklinDecentralizedMarketplaceMediation.new({from: accounts[0]});
		// console.log('franklinDecentralizedMarketplaceContract =', franklinDecentralizedMarketplaceContract);

		franklinDecentralizedMarketplaceContract.setFranklinDecentralizedMarketplaceMediationContract(
			franklinDecentralizedMarketplaceMediationContract.address, {from: accounts[0]});
		franklinDecentralizedMarketplaceMediationContract.setFranklinDecentralizedMarketplaceContract(
			franklinDecentralizedMarketplaceContract.address, {from: accounts[0]});

		// Reference --> https://www.trufflesuite.com/docs/truffle/getting-started/interacting-with-your-contracts
		/*
		franklinDecentralizedMarketplaceMediationContractAddress =
			await franklinDecentralizedMarketplaceContract.getFranklinDecentralizedMarketplaceMediationContractAddress();
		franklinDecentralizedMarketplaceMediationContract =
			await FranklinDecentralizedMarketplaceMediation.at(franklinDecentralizedMarketplaceMediationContractAddress);
		*/
	});

	afterEach(async () => {
		// Will have in Ganache Ethereum Server a Total of NUMBER_OF_ACCOUNTS Ethereum Addresses
		randomAddressIndex = (randomAddressIndex + 1) % NUMBER_OF_ACCOUNTS;
	});

	/*
	it("FranklinDecentralizedMarketplace : test constructor - sets appropriate contract owner", async () => {
		assert.equal(await franklinDecentralizedMarketplaceContract.contractOwner.call(), accounts[0],
			"Contract Owner not properly set!");
	});

	it("FranklinDecentralizedMarketplace : test constructor - mediationMarketplace data member should initially be set to EMPTY_ADDRESS", async () => {
		let franklinDecentralizedMarketplaceContractTemp = await FranklinDecentralizedMarketplace.new({from: accounts[randomAddressIndex]});
		assert.equal(await franklinDecentralizedMarketplaceContractTemp.mediationMarketplace.call(), EMPTY_ADDRESS,
			`The mediationMarketplace data member not initially set to ${EMPTY_ADDRESS}!`);
	});

	it("FranklinDecentralizedMarketplace : test constructor - mediationMarketplaceHasBeenSet data member should initially be set to false", async () => {
		let franklinDecentralizedMarketplaceContractTemp = await FranklinDecentralizedMarketplace.new({from: accounts[randomAddressIndex]});
		assert.equal(await franklinDecentralizedMarketplaceContractTemp.mediationMarketplaceHasBeenSet.call(), false,
			`The mediationMarketplaceHasBeenSet data member not initially set to boolean false!`);
	});

	it("FranklinDecentralizedMarketplace : test setFranklinDecentralizedMarketplaceMediationContract method - only Contract Owner may execute", async () => {
		try {
			await franklinDecentralizedMarketplaceContract.setFranklinDecentralizedMarketplaceMediationContract(
				franklinDecentralizedMarketplaceMediationContract.address, {from: accounts[1]});
			assert.fail("Only Contract Owner may execute this method!");
		} catch (error) {
			assert.ok(/revert/.test(error.message), "String 'revert' not present in error message!");
			assert.ok(/This method may only be executed by the Contract Owner/.test(error.message),
				"Appropriate error message not returned!");
		}
	});

	it("FranklinDecentralizedMarketplace : test setFranklinDecentralizedMarketplaceMediationContract method - mediationMarkeplace contract reference may only be set once", async () => {
		try {
			await franklinDecentralizedMarketplaceContract.setFranklinDecentralizedMarketplaceMediationContract(
				franklinDecentralizedMarketplaceMediationContract.address, {from: accounts[0]});
			assert.fail("The mediationMarkeplace contract reference may only be set once!");
		} catch (error) {
			assert.ok(/revert/.test(error.message), "String 'revert' not present in error message!");
			assert.ok(/The mediationMarkeplace contract reference has already been set!/.test(error.message),
				"Appropriate error message not returned!");
		}
	});

	it("FranklinDecentralizedMarketplace : test setFranklinDecentralizedMarketplaceMediationContract method - must be same Contract Owner in both FranklinDecentralizedMarketplace and FranklinDecentralizedMarketplaceMediation contracts", async () => {
		let franklinDecentralizedMarketplaceContractTemp = await FranklinDecentralizedMarketplace.new({from: accounts[1]});
		try {
			await franklinDecentralizedMarketplaceContractTemp.setFranklinDecentralizedMarketplaceMediationContract(
				franklinDecentralizedMarketplaceMediationContract.address, {from: accounts[1]});
			assert.fail("Must be same Contract Owner in both the FranklinDecentralizedMarketplace and FranklinDecentralizedMarketplaceMediation contracts!");
		} catch (error) {
			assert.ok(/revert/.test(error.message), "String 'revert' not present in error message!");
			assert.ok(/Must be same Contract Owner in both the FranklinDecentralizedMarketplace and FranklinDecentralizedMarketplaceMediation contracts!/.test(error.message),
				"Appropriate error message not returned!");
		}
	});

	it("FranklinDecentralizedMarketplace : test setFranklinDecentralizedMarketplaceMediationContract method - if require statements pass, check that appropriate variables properly set", async () => {
		let franklinDecentralizedMarketplaceContract_mediationMarketplace_contractAddress = await franklinDecentralizedMarketplaceContract.mediationMarketplace.call();
		// console.log('franklinDecentralizedMarketplaceContract_mediationMarketplace_contractAddress =', franklinDecentralizedMarketplaceContract_mediationMarketplace_contractAddress);
		assert.equal(franklinDecentralizedMarketplaceContract_mediationMarketplace_contractAddress, franklinDecentralizedMarketplaceMediationContract.address,
			"The mediationMarketplace data member not properly set!");
		assert.equal(await franklinDecentralizedMarketplaceContract.mediationMarketplaceHasBeenSet.call(), true,
			"The mmediationMarketplaceHasBeenSet data member not properly set to boolean true!");
	});

	it("FranklinDecentralizedMarketplace : test sellerIsWillingToSellItemsViaMediator method : seller does NOT exist", async () => {
		assert.equal(await franklinDecentralizedMarketplaceContract.sellerIsWillingToSellItemsViaMediator(accounts[randomAddressIndex]),
			false, "If Seller does not exist, then return value should be false!");
	});

	it("FranklinDecentralizedMarketplace : test sellerIsWillingToSellItemsViaMediator method : seller does exist but given no indication either way to accept/reject mediation", async () => {
		await franklinDecentralizedMarketplaceContract.addItemForSale("DummyItem", { from: accounts[randomAddressIndex] });
		assert.equal(await franklinDecentralizedMarketplaceContract.sellerIsWillingToSellItemsViaMediator(accounts[randomAddressIndex]),
			false, "If Seller does exist and made no indication, then return value should be false!");
	});

	it("FranklinDecentralizedMarketplace : test sellerIsWillingToSellItemsViaMediator method : seller does exist and has explicity indicated rejection of mediation", async () => {
		await franklinDecentralizedMarketplaceContract.addItemForSale("DummyItem", { from: accounts[randomAddressIndex] });
		await franklinDecentralizedMarketplaceContract.setSellerWillingToSellItemsViaMediator(false, { from: accounts[randomAddressIndex] });
		assert.equal(await franklinDecentralizedMarketplaceContract.sellerIsWillingToSellItemsViaMediator(accounts[randomAddressIndex]),
			false, "If Seller does exist and has explicitly rejected mediation, then return value should be false!");
	});

	it("FranklinDecentralizedMarketplace : test sellerIsWillingToSellItemsViaMediator method : seller does exist and has explicity indicated acceptance of mediation", async () => {
		await franklinDecentralizedMarketplaceContract.addItemForSale("DummyItem", { from: accounts[randomAddressIndex] });
		await franklinDecentralizedMarketplaceContract.setSellerWillingToSellItemsViaMediator(true, { from: accounts[randomAddressIndex] });
		assert.equal(await franklinDecentralizedMarketplaceContract.sellerIsWillingToSellItemsViaMediator(accounts[randomAddressIndex]),
			true, "If Seller does exist and has explicitly accepted mediation, then return value should be true!");
	});

	it("FranklinDecentralizedMarketplace : test setSellerWillingToSellItemsViaMediator method : seller does NOT exist and has explicity indicated rejection of mediation", async () => {
		await franklinDecentralizedMarketplaceContract.setSellerWillingToSellItemsViaMediator(false, { from: accounts[randomAddressIndex] });
		assert.equal(await franklinDecentralizedMarketplaceContract.sellerIsWillingToSellItemsViaMediator(accounts[randomAddressIndex]),
			false, "If Seller does NOT exist and has explicitly rejected mediation, then return value should be false!");
	});

	it("FranklinDecentralizedMarketplace : test setSellerWillingToSellItemsViaMediator method : seller does NOT exist and has explicity indicated acceptance of mediation", async () => {
		await franklinDecentralizedMarketplaceContract.setSellerWillingToSellItemsViaMediator(true, { from: accounts[randomAddressIndex] });
		assert.equal(await franklinDecentralizedMarketplaceContract.sellerIsWillingToSellItemsViaMediator(accounts[randomAddressIndex]),
			false, "If Seller does NOT exist and has explicitly accepted mediation, then return value should be false!");
	});

	it("FranklinDecentralizedMarketplace : test setSellerWillingToSellItemsViaMediator method : seller does exist and has explicity indicated rejection of mediation", async () => {
		await franklinDecentralizedMarketplaceContract.addItemForSale("DummyItem", { from: accounts[randomAddressIndex] });
		await franklinDecentralizedMarketplaceContract.setSellerWillingToSellItemsViaMediator(false, { from: accounts[randomAddressIndex] });
		assert.equal(await franklinDecentralizedMarketplaceContract.sellerIsWillingToSellItemsViaMediator(accounts[randomAddressIndex]),
			false, "If Seller does exist and has explicitly rejected mediation, then return value should be false!");
	});

	it("FranklinDecentralizedMarketplace : test setSellerWillingToSellItemsViaMediator method : seller does exist and has explicity indicated acceptance of mediation", async () => {
		await franklinDecentralizedMarketplaceContract.addItemForSale("DummyItem", { from: accounts[randomAddressIndex] });
		await franklinDecentralizedMarketplaceContract.setSellerWillingToSellItemsViaMediator(true, { from: accounts[randomAddressIndex] });
		assert.equal(await franklinDecentralizedMarketplaceContract.sellerIsWillingToSellItemsViaMediator(accounts[randomAddressIndex]),
			true, "If Seller does exist and has explicitly accepted mediation, then return value should be true!");
	});

	it("FranklinDecentralizedMarketplace : test addOrUpdateSellerDescription method : seller does NOT exist", async () => {
		try {
			await franklinDecentralizedMarketplaceContract.addOrUpdateSellerDescription("Dummy Seller Description", { from: accounts[randomAddressIndex] });
			assert.fail("Seller that does not exist cannot add or update a description of himself/herself!");
		} catch (error) {
			assert.ok(/revert/.test(error.message), "String 'revert' not present in error message!");
			assert.ok(/You must first add at least ONE Item For Sale before adding a description of yourself!/.test(error.message),
				"Appropriate error message not returned!");
		}
	});

	it("FranklinDecentralizedMarketplace : test addOrUpdateSellerDescription method : seller exists but it's description is an empty string", async () => {
		await franklinDecentralizedMarketplaceContract.addItemForSale("DummyItem", { from: accounts[randomAddressIndex] });
		try {
			await franklinDecentralizedMarketplaceContract.addOrUpdateSellerDescription(EMPTY_STRING, { from: accounts[randomAddressIndex] });
			assert.fail("Seller cannot add/update empty string description of himself/herself!");
		} catch (error) {
			assert.ok(/revert/.test(error.message), "String 'revert' not present in error message!");
			assert.ok(/Cannot have an empty String for the IPFS Hash Key Description of a Seller!/.test(error.message),
				"Appropriate error message not returned!");
		}
	});

	it("FranklinDecentralizedMarketplace : test addOrUpdateSellerDescription method : seller exists and it's description is a non-empty string", async () => {
		await franklinDecentralizedMarketplaceContract.addItemForSale("DummyItem", { from: accounts[randomAddressIndex] });
		let sellerDescription = "The Seller Description";
		await franklinDecentralizedMarketplaceContract.addOrUpdateSellerDescription(sellerDescription, { from: accounts[randomAddressIndex] });
		assert.equal(await franklinDecentralizedMarketplaceContract.getSellerIpfsHashDescription(accounts[randomAddressIndex]),
			sellerDescription, "Seller Description was not properly stored in the Contract!");
	});


	it("FranklinDecentralizedMarketplace : test getSellerIpfsHashDescription method : seller does NOT exist", async () => {
		assert.equal(await franklinDecentralizedMarketplaceContract.getSellerIpfsHashDescription(accounts[randomAddressIndex]),
			EMPTY_STRING, "Seller that does NOT exist and never provided a description of himself/herself should have an empty string description!");
	});

	it("FranklinDecentralizedMarketplace : test getSellerIpfsHashDescription method : seller does exist but has provided no description about himself/herself", async () => {
		await franklinDecentralizedMarketplaceContract.addItemForSale("DummyItem", { from: accounts[randomAddressIndex] });
		assert.equal(await franklinDecentralizedMarketplaceContract.getSellerIpfsHashDescription(accounts[randomAddressIndex]),
			EMPTY_STRING, "Seller that does exist and provided no description about himself/herself should have an empty string description!");
	});

	it("FranklinDecentralizedMarketplace : test getSellerIpfsHashDescription method : seller does exist and has provided a non-empty description about himself/herself", async () => {
		await franklinDecentralizedMarketplaceContract.addItemForSale("DummyItem", { from: accounts[randomAddressIndex] });
		let sellerDescription = "The Seller Description";
		await franklinDecentralizedMarketplaceContract.addOrUpdateSellerDescription(sellerDescription, { from: accounts[randomAddressIndex] })
		assert.equal(await franklinDecentralizedMarketplaceContract.getSellerIpfsHashDescription(accounts[randomAddressIndex]),
			sellerDescription, "Incorrect Seller IPFS Description being returned and different from what was provided!");
	});

	it("FranklinDecentralizedMarketplace : test removeSeller method : seller does NOT exist", async () => {
		await franklinDecentralizedMarketplaceContract.removeSeller({ from: accounts[randomAddressIndex] });

		assert.equal(await franklinDecentralizedMarketplaceContract.sellerExists(accounts[randomAddressIndex]), false, "Seller should not exist!");
		assert.equal(await franklinDecentralizedMarketplaceContract.sellerIsWillingToSellItemsViaMediator(accounts[randomAddressIndex]), false,
			"Seller that does not exist should have it's willingness to sell items via mediator flag to false!");
		assert.equal(await franklinDecentralizedMarketplaceContract.getNumberOfSellers(), 0,  "Number of Sellers should be 0 due to no Sellers existing!");
		assert.equal(await franklinDecentralizedMarketplaceContract.getSellerIpfsHashDescription(accounts[randomAddressIndex]),
			EMPTY_STRING, "Seller that does NOT exist and never provided a description of himself/herself should have an empty string description!");
		assert.equal(await franklinDecentralizedMarketplaceContract.getNumberOfDifferentItemsBeingSoldBySeller(accounts[randomAddressIndex]),
			0, "Seller that does NOT exist should have NO Items to sell!");
	});

	it("FranklinDecentralizedMarketplace : test removeSeller method : seller does exist, has items for sale, an IPFS description, and willing to sell via mediators", async () => {
		await franklinDecentralizedMarketplaceContract.addItemForSale("DummyItem_1", { from: accounts[randomAddressIndex] });
		await franklinDecentralizedMarketplaceContract.addItemForSale("DummyItem_2", { from: accounts[randomAddressIndex] });
		let sellerDescription = "The Seller Description";
		await franklinDecentralizedMarketplaceContract.addOrUpdateSellerDescription(sellerDescription, { from: accounts[randomAddressIndex] });
		await franklinDecentralizedMarketplaceContract.setSellerWillingToSellItemsViaMediator(true, { from: accounts[randomAddressIndex] });

		await franklinDecentralizedMarketplaceContract.removeSeller({ from: accounts[randomAddressIndex] });

		assert.equal(await franklinDecentralizedMarketplaceContract.sellerExists(accounts[randomAddressIndex]), false, "Seller should not exist!");
		assert.equal(await franklinDecentralizedMarketplaceContract.sellerIsWillingToSellItemsViaMediator(accounts[randomAddressIndex]), false,
			"Seller that does not exist should have it's willingness to sell items via mediator flag to false!");
		assert.equal(await franklinDecentralizedMarketplaceContract.getNumberOfSellers(), 0,  "Number of Sellers should be 0 due to know Sellers existing!");
		assert.equal(await franklinDecentralizedMarketplaceContract.getSellerIpfsHashDescription(accounts[randomAddressIndex]),
			sellerDescription, "Seller that does NOT exist and DID provided a description of himself/herself in the past should retain that description!");
		assert.equal(await franklinDecentralizedMarketplaceContract.getNumberOfDifferentItemsBeingSoldBySeller(accounts[randomAddressIndex]),
			0, "Seller that does NOT exist should have NO Items to sell!");
	});

	it("FranklinDecentralizedMarketplace : test getSellerAddress method : input index greater than or equal to the number of sellers", async () => {
		try {
			await franklinDecentralizedMarketplaceContract.getSellerAddress(0);
			assert.fail("Should not be able to obtain a seller when no sellers exist!");
		} catch (error) {
			assert.ok(/revert/.test(error.message), "String 'revert' not present in error message!");
			assert.ok(/Index value given is greater than or equal to the Number of Sellers! It should be less than the Number of Sellers!/.test(error.message),
				"Appropriate error message not returned!");
		}

		await franklinDecentralizedMarketplaceContract.addItemForSale("DummyItem_1", { from: accounts[randomAddressIndex] });
		await franklinDecentralizedMarketplaceContract.addItemForSale("DummyItem_1", { from: accounts[(randomAddressIndex + 1) % NUMBER_OF_ACCOUNTS] });
		await franklinDecentralizedMarketplaceContract.addItemForSale("DummyItem_1", { from: accounts[(randomAddressIndex + 2) % NUMBER_OF_ACCOUNTS] });

		try {
			await franklinDecentralizedMarketplaceContract.getSellerAddress(3);
			assert.fail("Should not be able to obtain a seller when index given is greater than or equal to the number of sellers!");
		} catch (error) {
			assert.ok(/revert/.test(error.message), "String 'revert' not present in error message!");
			assert.ok(/Index value given is greater than or equal to the Number of Sellers! It should be less than the Number of Sellers!/.test(error.message),
				"Appropriate error message not returned!");
		}
	});

	it("FranklinDecentralizedMarketplace : test getSellerAddress method : input index is less than the number of sellers", async () => {
		try {
			await franklinDecentralizedMarketplaceContract.getSellerAddress(0);
			assert.fail("Should not be able to obtain a seller when no sellers exist!");
		} catch (error) {
			assert.ok(/revert/.test(error.message), "String 'revert' not present in error message!");
			assert.ok(/Index value given is greater than or equal to the Number of Sellers! It should be less than the Number of Sellers!/.test(error.message),
				"Appropriate error message not returned!");
		}

		let firstSellerAddress = accounts[randomAddressIndex];
		let secondSellerAddress = accounts[(randomAddressIndex + 1) % NUMBER_OF_ACCOUNTS];
		let thirdSellerAddress = accounts[(randomAddressIndex + 2) % NUMBER_OF_ACCOUNTS];

		await franklinDecentralizedMarketplaceContract.addItemForSale("DummyItem_1", { from: firstSellerAddress });
		await franklinDecentralizedMarketplaceContract.addItemForSale("DummyItem_1", { from: secondSellerAddress });
		await franklinDecentralizedMarketplaceContract.addItemForSale("DummyItem_1", { from: thirdSellerAddress });

		assert.equal(await franklinDecentralizedMarketplaceContract.getSellerAddress(0), thirdSellerAddress, "Incorrect Seller Address returned for index = 0!");
		assert.equal(await franklinDecentralizedMarketplaceContract.getSellerAddress(1), secondSellerAddress, "Incorrect Seller Address returned for index = 0!");
		assert.equal(await franklinDecentralizedMarketplaceContract.getSellerAddress(2), firstSellerAddress, "Incorrect Seller Address returned for index = 0!");
	});

	it("FranklinDecentralizedMarketplace : test sellerExists method : no sellers exist", async () => {
		assert.equal(await franklinDecentralizedMarketplaceContract.sellerExists(accounts[randomAddressIndex]), false,
			"No sellers have been added, yet function returns boolean true!");
	});

	it("FranklinDecentralizedMarketplace : test sellerExists method : sellers exist but input seller does not exist", async () => {
		let firstSellerAddress = accounts[randomAddressIndex];
		let secondSellerAddress = accounts[(randomAddressIndex + 1) % NUMBER_OF_ACCOUNTS];
		let thirdSellerAddress = accounts[(randomAddressIndex + 2) % NUMBER_OF_ACCOUNTS];
		let sellerAddressThatDoesNotExist = accounts[(randomAddressIndex + 3) % NUMBER_OF_ACCOUNTS];

		await franklinDecentralizedMarketplaceContract.addItemForSale("DummyItem_1", { from: firstSellerAddress });
		await franklinDecentralizedMarketplaceContract.addItemForSale("DummyItem_1", { from: secondSellerAddress });
		await franklinDecentralizedMarketplaceContract.addItemForSale("DummyItem_1", { from: thirdSellerAddress });

		assert.equal(await franklinDecentralizedMarketplaceContract.sellerExists(sellerAddressThatDoesNotExist), false,
			"Input Seller Address was never added as a seller, yet function returns back boolean true!");
	});

	it("FranklinDecentralizedMarketplace : test sellerExists method : sellers exist and input seller does exist", async () => {
		let firstSellerAddress = accounts[randomAddressIndex];
		let secondSellerAddress = accounts[(randomAddressIndex + 1) % NUMBER_OF_ACCOUNTS];
		let thirdSellerAddress = accounts[(randomAddressIndex + 2) % NUMBER_OF_ACCOUNTS];

		await franklinDecentralizedMarketplaceContract.addItemForSale("DummyItem_1", { from: firstSellerAddress });
		await franklinDecentralizedMarketplaceContract.addItemForSale("DummyItem_1", { from: secondSellerAddress });
		await franklinDecentralizedMarketplaceContract.addItemForSale("DummyItem_1", { from: thirdSellerAddress });

		assert.equal(await franklinDecentralizedMarketplaceContract.sellerExists(firstSellerAddress), true,
			`Input Seller Address ${firstSellerAddress} was added as a seller, yet function returns back boolean false!`);
		assert.equal(await franklinDecentralizedMarketplaceContract.sellerExists(secondSellerAddress), true,
			`Input Seller Address ${secondSellerAddress} was added as a seller, yet function returns back boolean false!`);
		assert.equal(await franklinDecentralizedMarketplaceContract.sellerExists(thirdSellerAddress), true,
			`Input Seller Address ${thirdSellerAddress} was added as a seller, yet function returns back boolean false!`);
	});

	it("FranklinDecentralizedMarketplace : test getNumberOfSellers method : no sellers exist", async () => {
		assert.equal(await franklinDecentralizedMarketplaceContract.getNumberOfSellers(), 0,
			"No sellers have been added, yet function returns back a number greater than 0!");
	});

	it("FranklinDecentralizedMarketplace : test getNumberOfSellers method : sellers exist - sellers added and removed", async () => {
		assert.equal(await franklinDecentralizedMarketplaceContract.getNumberOfSellers(), 0,
			"No sellers have been added, yet function returns back a number greater than 0!");

		let firstSellerAddress = accounts[randomAddressIndex];
		let secondSellerAddress = accounts[(randomAddressIndex + 1) % NUMBER_OF_ACCOUNTS];
		let thirdSellerAddress = accounts[(randomAddressIndex + 2) % NUMBER_OF_ACCOUNTS];

		await franklinDecentralizedMarketplaceContract.addItemForSale("DummyItem_1", { from: firstSellerAddress });
		assert.equal(await franklinDecentralizedMarketplaceContract.getNumberOfSellers(), 1,
			"One seller added when none existed before, yet function returns back a number that is not equal to 1!");

		await franklinDecentralizedMarketplaceContract.addItemForSale("DummyItem_1", { from: secondSellerAddress });
		assert.equal(await franklinDecentralizedMarketplaceContract.getNumberOfSellers(), 2,
			"Two sellers added when none existed before, yet function returns back a number that is not equal to 2!");

		await franklinDecentralizedMarketplaceContract.addItemForSale("DummyItem_1", { from: thirdSellerAddress });
		assert.equal(await franklinDecentralizedMarketplaceContract.getNumberOfSellers(), 3,
			"Three sellers added when none existed before, yet function returns back a number that is not equal to 3!");

		await franklinDecentralizedMarketplaceContract.removeSeller({ from: firstSellerAddress });
		assert.equal(await franklinDecentralizedMarketplaceContract.getNumberOfSellers(), 2,
			"One seller removed after three sellers were added when none existed, yet function returns back a number that is not equal to 2!");

		await franklinDecentralizedMarketplaceContract.removeSeller({ from: secondSellerAddress });
		assert.equal(await franklinDecentralizedMarketplaceContract.getNumberOfSellers(), 1,
			"Two sellers removed after three sellers were added when none existed, yet function returns back a number that is not equal to 1!");

		await franklinDecentralizedMarketplaceContract.removeSeller({ from: thirdSellerAddress });
		assert.equal(await franklinDecentralizedMarketplaceContract.getNumberOfSellers(), 0,
			"Three sellers removed after three sellers were added when none existed, yet function returns back a number that is not equal to 0!");
	});

	it("FranklinDecentralizedMarketplace : test setPriceOfItem method : seller does NOT exist and input _keyItemIpfsHash is an empty string", async () => {
		try {
			await franklinDecentralizedMarketplaceContract.setPriceOfItem(EMPTY_STRING, 4, { from: accounts[randomAddressIndex] });
			assert.fail("Should not be able to set the Price of an Item when input _keyItemIpfsHash is an empty string!");
		} catch (error) {
			assert.ok(/revert/.test(error.message), "String 'revert' not present in error message!");
			assert.ok(/Cannot have an empty String for the IPFS Hash Key of an Item to Sell!/.test(error.message),
				"Appropriate error message not returned!");
		}
	});

	it("FranklinDecentralizedMarketplace : test setPriceOfItem method : seller does exist and input _keyItemIpfsHash is an empty string", async () => {
		await franklinDecentralizedMarketplaceContract.addItemForSale("DummyItem_1", { from: accounts[randomAddressIndex] });

		try {
			await franklinDecentralizedMarketplaceContract.setPriceOfItem(EMPTY_STRING, 4, { from: accounts[randomAddressIndex] });
			assert.fail("Should not be able to set the Price of an Item when input _keyItemIpfsHash is an empty string!");
		} catch (error) {
			assert.ok(/revert/.test(error.message), "String 'revert' not present in error message!");
			assert.ok(/Cannot have an empty String for the IPFS Hash Key of an Item to Sell!/.test(error.message),
				"Appropriate error message not returned!");
		}
	});

	it("FranklinDecentralizedMarketplace : test setPriceOfItem method : seller does exist but input _keyItemIpfsHash is NOT an item the seller sells", async () => {
		await franklinDecentralizedMarketplaceContract.addItemForSale("DummyItem_1", { from: accounts[randomAddressIndex] });
		await franklinDecentralizedMarketplaceContract.addItemForSale("DummyItem_2", { from: accounts[randomAddressIndex] });
		await franklinDecentralizedMarketplaceContract.addItemForSale("DummyItem_3", { from: accounts[randomAddressIndex] });

		try {
			await franklinDecentralizedMarketplaceContract.setPriceOfItem("Item_Not_Sold", 4, { from: accounts[randomAddressIndex] });
			assert.fail("Should not be able to set the Price of an Item when input _keyItemIpfsHash is an item the seller does not sell!");
		} catch (error) {
			assert.ok(/revert/.test(error.message), "String 'revert' not present in error message!");
			assert.ok(/Given IPFS Hash of Item is not listed as an Item For Sale by the Seller!/.test(error.message),
				"Appropriate error message not returned!");
		}
	});

	it("FranklinDecentralizedMarketplace : test setPriceOfItem method : seller does exist, input _keyItemIpfsHash is an item the seller sells, but input price is zero WEI", async () => {
		await franklinDecentralizedMarketplaceContract.addItemForSale("DummyItem_1", { from: accounts[randomAddressIndex] });
		await franklinDecentralizedMarketplaceContract.addItemForSale("DummyItem_2", { from: accounts[randomAddressIndex] });
		await franklinDecentralizedMarketplaceContract.addItemForSale("DummyItem_3", { from: accounts[randomAddressIndex] });

		await franklinDecentralizedMarketplaceContract.setPriceOfItem("DummyItem_2", 0, { from: accounts[randomAddressIndex] });
		assert.equal(await franklinDecentralizedMarketplaceContract.getPriceOfItem(accounts[randomAddressIndex], "DummyItem_2"), 0,
			"Price of the Item should be equal to zero!");
	});

	it("FranklinDecentralizedMarketplace : test setPriceOfItem method : seller does exist, input _keyItemIpfsHash is an item the seller sells, and input price is NOT zero WEI", async () => {
		await franklinDecentralizedMarketplaceContract.addItemForSale("DummyItem_1", { from: accounts[randomAddressIndex] });
		await franklinDecentralizedMarketplaceContract.addItemForSale("DummyItem_2", { from: accounts[randomAddressIndex] });
		await franklinDecentralizedMarketplaceContract.addItemForSale("DummyItem_3", { from: accounts[randomAddressIndex] });

		await franklinDecentralizedMarketplaceContract.setPriceOfItem("DummyItem_2", 4, { from: accounts[randomAddressIndex] });
		assert.equal(await franklinDecentralizedMarketplaceContract.getPriceOfItem(accounts[randomAddressIndex], "DummyItem_2"), 4,
			"Price of the Item set is NOT equal to what is stored in the Contract!");
	});

	it("FranklinDecentralizedMarketplace : test getPriceOfItem method : seller does NOT exist and input _keyItemIpfsHash is an empty string", async () => {
		try {
			await franklinDecentralizedMarketplaceContract.getPriceOfItem(accounts[randomAddressIndex], EMPTY_STRING);
			assert.fail("Should not be able to get the Price of an Item when input _keyItemIpfsHash is an empty string!");
		} catch (error) {
			assert.ok(/revert/.test(error.message), "String 'revert' not present in error message!");
			assert.ok(/Given IPFS Hash of Item is not listed as an Item For Sale from the Seller!/.test(error.message),
				"Appropriate error message not returned!");
		}
	});

	it("FranklinDecentralizedMarketplace : test getPriceOfItem method : seller does exist and input _keyItemIpfsHash is an empty string", async () => {
		await franklinDecentralizedMarketplaceContract.addItemForSale("DummyItem_1", { from: accounts[randomAddressIndex] });

		try {
			await franklinDecentralizedMarketplaceContract.getPriceOfItem(accounts[randomAddressIndex], EMPTY_STRING);
			assert.fail("Should not be able to get the Price of an Item when input _keyItemIpfsHash is an empty string!");
		} catch (error) {
			assert.ok(/revert/.test(error.message), "String 'revert' not present in error message!");
			assert.ok(/Given IPFS Hash of Item is not listed as an Item For Sale from the Seller!/.test(error.message),
				"Appropriate error message not returned!");
		}
	});

	it("FranklinDecentralizedMarketplace : test getPriceOfItem method : seller does exist but input _keyItemIpfsHash is NOT an item the seller sells", async () => {
		await franklinDecentralizedMarketplaceContract.addItemForSale("DummyItem_1", { from: accounts[randomAddressIndex] });
		await franklinDecentralizedMarketplaceContract.addItemForSale("DummyItem_2", { from: accounts[randomAddressIndex] });
		await franklinDecentralizedMarketplaceContract.addItemForSale("DummyItem_3", { from: accounts[randomAddressIndex] });

		try {
			await franklinDecentralizedMarketplaceContract.getPriceOfItem(accounts[randomAddressIndex], "Item_Not_Sold");
			assert.fail("Should not be able to get the Price of an Item when input _keyItemIpfsHash is an item the seller does not sell!");
		} catch (error) {
			assert.ok(/revert/.test(error.message), "String 'revert' not present in error message!");
			assert.ok(/Given IPFS Hash of Item is not listed as an Item For Sale from the Seller!/.test(error.message),
				"Appropriate error message not returned!");
		}
	});

	it("FranklinDecentralizedMarketplace : test getPriceOfItem method : seller does exist, input _keyItemIpfsHash is an item the seller sells, but seller never set the price of the item", async () => {
		await franklinDecentralizedMarketplaceContract.addItemForSale("DummyItem_1", { from: accounts[randomAddressIndex] });
		await franklinDecentralizedMarketplaceContract.addItemForSale("DummyItem_2", { from: accounts[randomAddressIndex] });
		await franklinDecentralizedMarketplaceContract.addItemForSale("DummyItem_3", { from: accounts[randomAddressIndex] });

		assert.equal(await franklinDecentralizedMarketplaceContract.getPriceOfItem(accounts[randomAddressIndex], "DummyItem_2"), 0,
			"Price of the Item should be equal to zero!");
	});

	it("FranklinDecentralizedMarketplace : test getPriceOfItem method : seller does exist, input _keyItemIpfsHash is an item the seller sells, but seller set the price of the item to zero WEI", async () => {
		await franklinDecentralizedMarketplaceContract.addItemForSale("DummyItem_1", { from: accounts[randomAddressIndex] });
		await franklinDecentralizedMarketplaceContract.addItemForSale("DummyItem_2", { from: accounts[randomAddressIndex] });
		await franklinDecentralizedMarketplaceContract.addItemForSale("DummyItem_3", { from: accounts[randomAddressIndex] });

		await franklinDecentralizedMarketplaceContract.setPriceOfItem("DummyItem_2", 0, { from: accounts[randomAddressIndex] });
		assert.equal(await franklinDecentralizedMarketplaceContract.getPriceOfItem(accounts[randomAddressIndex], "DummyItem_2"), 0,
			"Price of the Item should be equal to zero!");
	});

	it("FranklinDecentralizedMarketplace : test getPriceOfItem method : seller does exist, input _keyItemIpfsHash is an item the seller sells, and seller set the price of the item to a non-zero WEI", async () => {
		await franklinDecentralizedMarketplaceContract.addItemForSale("DummyItem_1", { from: accounts[randomAddressIndex] });
		await franklinDecentralizedMarketplaceContract.addItemForSale("DummyItem_2", { from: accounts[randomAddressIndex] });
		await franklinDecentralizedMarketplaceContract.addItemForSale("DummyItem_3", { from: accounts[randomAddressIndex] });

		await franklinDecentralizedMarketplaceContract.setPriceOfItem("DummyItem_2", 3, { from: accounts[randomAddressIndex] });
		assert.equal(await franklinDecentralizedMarketplaceContract.getPriceOfItem(accounts[randomAddressIndex], "DummyItem_2"), 3,
			"Price of the Item obtained is not the same price it was set!");
	});

	it("FranklinDecentralizedMarketplace : test setQuantityAvailableForSaleOfAnItem method : seller does NOT exist and input _keyItemIpfsHash is an empty string", async () => {
		try {
			await franklinDecentralizedMarketplaceContract.setQuantityAvailableForSaleOfAnItem(EMPTY_STRING, 4, { from: accounts[randomAddressIndex] });
			assert.fail("Should not be able to set the quantity available for sale of an Item when input _keyItemIpfsHash is an empty string!");
		} catch (error) {
			// console.log('error =', error);
			// console.log('error.message =', error.message);
			assert.ok(/revert/.test(error.message), "String 'revert' not present in error message!");
			assert.ok(/Cannot have an empty String for the IPFS Hash Key of an Item to Sell!/.test(error.message),
				"Appropriate error message not returned!");
		}
	});

	it("FranklinDecentralizedMarketplace : test setQuantityAvailableForSaleOfAnItem method : seller does exist and input _keyItemIpfsHash is an empty string", async () => {
		await franklinDecentralizedMarketplaceContract.addItemForSale("DummyItem_1", { from: accounts[randomAddressIndex] });

		try {
			await franklinDecentralizedMarketplaceContract.setQuantityAvailableForSaleOfAnItem(EMPTY_STRING, 4, { from: accounts[randomAddressIndex] });
			assert.fail("Should not be able to set the quantity available for sale of an Item when input _keyItemIpfsHash is an empty string!");
		} catch (error) {
			assert.ok(/revert/.test(error.message), "String 'revert' not present in error message!");
			assert.ok(/Cannot have an empty String for the IPFS Hash Key of an Item to Sell!/.test(error.message),
				"Appropriate error message not returned!");
		}
	});

	it("FranklinDecentralizedMarketplace : test setQuantityAvailableForSaleOfAnItem method : seller does exist but input _keyItemIpfsHash is NOT an item the seller sells", async () => {
		await franklinDecentralizedMarketplaceContract.addItemForSale("DummyItem_1", { from: accounts[randomAddressIndex] });
		await franklinDecentralizedMarketplaceContract.addItemForSale("DummyItem_2", { from: accounts[randomAddressIndex] });
		await franklinDecentralizedMarketplaceContract.addItemForSale("DummyItem_3", { from: accounts[randomAddressIndex] });

		try {
			await franklinDecentralizedMarketplaceContract.setQuantityAvailableForSaleOfAnItem("Item_Not_Sold", 4, { from: accounts[randomAddressIndex] });
			assert.fail("Should not be able to set the quantity available for sale of an Item when input _keyItemIpfsHash is an item the seller does not sell!");
		} catch (error) {
			assert.ok(/revert/.test(error.message), "String 'revert' not present in error message!");
			assert.ok(/Given IPFS Hash of Item is not listed as an Item For Sale by the Seller!/.test(error.message),
				"Appropriate error message not returned!");
		}
	});

	it("FranklinDecentralizedMarketplace : test setQuantityAvailableForSaleOfAnItem method : seller does exist, input _keyItemIpfsHash is an item the seller sells, but input _quantity is zero", async () => {
		await franklinDecentralizedMarketplaceContract.addItemForSale("DummyItem_1", { from: accounts[randomAddressIndex] });
		await franklinDecentralizedMarketplaceContract.addItemForSale("DummyItem_2", { from: accounts[randomAddressIndex] });
		await franklinDecentralizedMarketplaceContract.addItemForSale("DummyItem_3", { from: accounts[randomAddressIndex] });

		await franklinDecentralizedMarketplaceContract.setQuantityAvailableForSaleOfAnItem("DummyItem_2", 0, { from: accounts[randomAddressIndex] });
		assert.equal(await franklinDecentralizedMarketplaceContract.getQuantityAvailableForSaleOfAnItemBySeller(accounts[randomAddressIndex], "DummyItem_2"), 0,
			"Obtained Quantity available for Sale of the Item should be equal to zero!");
	});

	it("FranklinDecentralizedMarketplace : test setQuantityAvailableForSaleOfAnItem method : seller does exist, input _keyItemIpfsHash is an item the seller sells, and input _quantity is NOT zero", async () => {
		await franklinDecentralizedMarketplaceContract.addItemForSale("DummyItem_1", { from: accounts[randomAddressIndex] });
		await franklinDecentralizedMarketplaceContract.addItemForSale("DummyItem_2", { from: accounts[randomAddressIndex] });
		await franklinDecentralizedMarketplaceContract.addItemForSale("DummyItem_3", { from: accounts[randomAddressIndex] });

		await franklinDecentralizedMarketplaceContract.setQuantityAvailableForSaleOfAnItem("DummyItem_2", 4, { from: accounts[randomAddressIndex] });
		assert.equal(await franklinDecentralizedMarketplaceContract.getQuantityAvailableForSaleOfAnItemBySeller(accounts[randomAddressIndex], "DummyItem_2"), 4,
			"Quantity available for Sale of the Item that was set is NOT equal to what is stored in the Contract!");
	});

	it("FranklinDecentralizedMarketplace : test setQuantityAvailableForSaleOfAnItem_v2 method : mediationMarketplace reference has not been set by the Contract Owner", async () => {
		let franklinDecentralizedMarketplaceContractTemp = await FranklinDecentralizedMarketplace.new({from: accounts[randomAddressIndex]});
		try {
			await franklinDecentralizedMarketplaceContractTemp.setQuantityAvailableForSaleOfAnItem_v2(accounts[(randomAddressIndex + 1) % NUMBER_OF_ACCOUNTS], "DummyItem_1", 4, { from: accounts[randomAddressIndex] });
			assert.fail("Should not be able to set the quantity available for sale of an Item when mediationMarketplace reference has not been set by the Contract Owner!");
		} catch (error) {
			assert.ok(/revert/.test(error.message), "String 'revert' not present in error message!");
			assert.ok(/The mediationMarketplace instance has not been set by the Contract Owner!/.test(error.message),
				"Appropriate error message not returned!");
		}
	});

	it("FranklinDecentralizedMarketplace : test setQuantityAvailableForSaleOfAnItem_v2 method : seller does NOT exist and input _keyItemIpfsHash is an empty string", async () => {
		try {
			await franklinDecentralizedMarketplaceContract.setQuantityAvailableForSaleOfAnItem_v2(accounts[randomAddressIndex], EMPTY_STRING, 4, { from: accounts[(randomAddressIndex + 1) % NUMBER_OF_ACCOUNTS] });
			assert.fail("Should not be able to set the quantity available for sale of an Item when input _keyItemIpfsHash is an empty string!");
		} catch (error) {
			assert.ok(/revert/.test(error.message), "String 'revert' not present in error message!");
			assert.ok(/Cannot have an empty String for the IPFS Hash Key of an Item to Sell!/.test(error.message),
				"Appropriate error message not returned!");
		}
	});

	it("FranklinDecentralizedMarketplace : test setQuantityAvailableForSaleOfAnItem_v2 method : seller does exist and input _keyItemIpfsHash is an empty string", async () => {
		await franklinDecentralizedMarketplaceContract.addItemForSale("DummyItem_1", { from: accounts[randomAddressIndex] });
		let fromAddress = accounts[(randomAddressIndex + 1) % NUMBER_OF_ACCOUNTS];

		try {
			await franklinDecentralizedMarketplaceContract.setQuantityAvailableForSaleOfAnItem_v2(accounts[randomAddressIndex], EMPTY_STRING, 4, { from: fromAddress });
			assert.fail("Should not be able to set the quantity available for sale of an Item when input _keyItemIpfsHash is an empty string!");
		} catch (error) {
			assert.ok(/revert/.test(error.message), "String 'revert' not present in error message!");
			assert.ok(/Cannot have an empty String for the IPFS Hash Key of an Item to Sell!/.test(error.message),
				"Appropriate error message not returned!");
		}
	});

	it("FranklinDecentralizedMarketplace : test setQuantityAvailableForSaleOfAnItem_v2 method : seller does exist but input _keyItemIpfsHash is NOT an item the seller sells", async () => {
		await franklinDecentralizedMarketplaceContract.addItemForSale("DummyItem_1", { from: accounts[randomAddressIndex] });
		await franklinDecentralizedMarketplaceContract.addItemForSale("DummyItem_2", { from: accounts[randomAddressIndex] });
		await franklinDecentralizedMarketplaceContract.addItemForSale("DummyItem_3", { from: accounts[randomAddressIndex] });
		let fromAddress = accounts[(randomAddressIndex + 1) % NUMBER_OF_ACCOUNTS];

		try {
			await franklinDecentralizedMarketplaceContract.setQuantityAvailableForSaleOfAnItem_v2(accounts[randomAddressIndex], "Item_Not_Sold", 4, { from: fromAddress });
			assert.fail("Should not be able to set the quantity available for sale of an Item when input _keyItemIpfsHash is an item the seller does not sell!");
		} catch (error) {
			assert.ok(/revert/.test(error.message), "String 'revert' not present in error message!");
			assert.ok(/Given IPFS Hash of Item is not listed as an Item For Sale by the Seller!/.test(error.message),
				"Appropriate error message not returned!");
		}
	});

	it("FranklinDecentralizedMarketplace : test setQuantityAvailableForSaleOfAnItem_v2 method : method being executed by address that is NOT the FranklinDecentralizedMarketplaceMediation contract address", async () => {
		let sellerAddress = accounts[(randomAddressIndex + 2) % NUMBER_OF_ACCOUNTS];

		await franklinDecentralizedMarketplaceContract.addItemForSale("DummyItem_1", { from: sellerAddress });
		await franklinDecentralizedMarketplaceContract.addItemForSale("DummyItem_2", { from: sellerAddress });
		await franklinDecentralizedMarketplaceContract.addItemForSale("DummyItem_3", { from: sellerAddress });

		let fromAddress = accounts[randomAddressIndex];
		if (fromAddress === await franklinDecentralizedMarketplaceContract.mediationMarketplace.call()) {
			fromAddress = accounts[(randomAddressIndex + 1) % NUMBER_OF_ACCOUNTS];
		}

		try {
			await franklinDecentralizedMarketplaceContract.setQuantityAvailableForSaleOfAnItem_v2(sellerAddress, "DummyItem_3", 4, { from: fromAddress });
			assert.fail("Should not be able to set the quantity available for sale of an Item if it's not from the FranklinDecentralizedMarketplaceMediation contract address!");
		} catch (error) {
			assert.ok(/revert/.test(error.message), "String 'revert' not present in error message!");
			assert.ok(/This method may only be executed by the FranklinDecentralizedMarketplaceMediation contract!/.test(error.message),
				"Appropriate error message not returned!");
		}
	});

	it("FranklinDecentralizedMarketplace : test getQuantityAvailableForSaleOfAnItemBySeller method : seller does NOT exist and input _keyItemIpfsHash is an empty string", async () => {
		try {
			await franklinDecentralizedMarketplaceContract.getQuantityAvailableForSaleOfAnItemBySeller(accounts[randomAddressIndex], EMPTY_STRING);
			assert.fail("Should not be able to get the Quantity available for sale of an Item when input _keyItemIpfsHash is an empty string!");
		} catch (error) {
			assert.ok(/revert/.test(error.message), "String 'revert' not present in error message!");
			assert.ok(/Given IPFS Hash of Item is not listed as an Item For Sale from the Seller!/.test(error.message),
				"Appropriate error message not returned!");
		}
	});

	it("FranklinDecentralizedMarketplace : test getQuantityAvailableForSaleOfAnItemBySeller method : seller does exist and input _keyItemIpfsHash is an empty string", async () => {
		await franklinDecentralizedMarketplaceContract.addItemForSale("DummyItem_1", { from: accounts[randomAddressIndex] });

		try {
			await franklinDecentralizedMarketplaceContract.getQuantityAvailableForSaleOfAnItemBySeller(accounts[randomAddressIndex], EMPTY_STRING);
			assert.fail("Should not be able to get the Quantity available for sale of an Item when input _keyItemIpfsHash is an empty string!");
		} catch (error) {
			assert.ok(/revert/.test(error.message), "String 'revert' not present in error message!");
			assert.ok(/Given IPFS Hash of Item is not listed as an Item For Sale from the Seller!/.test(error.message),
				"Appropriate error message not returned!");
		}
	});

	it("FranklinDecentralizedMarketplace : test getQuantityAvailableForSaleOfAnItemBySeller : seller does exist but input _keyItemIpfsHash is NOT an item the seller sells", async () => {
		await franklinDecentralizedMarketplaceContract.addItemForSale("DummyItem_1", { from: accounts[randomAddressIndex] });
		await franklinDecentralizedMarketplaceContract.addItemForSale("DummyItem_2", { from: accounts[randomAddressIndex] });
		await franklinDecentralizedMarketplaceContract.addItemForSale("DummyItem_3", { from: accounts[randomAddressIndex] });

		try {
			await franklinDecentralizedMarketplaceContract.getQuantityAvailableForSaleOfAnItemBySeller(accounts[randomAddressIndex], "Item_Not_Sold");
			assert.fail("Should not be able to get the Quantity available for sale  of an Item when input _keyItemIpfsHash is an item the seller does not sell!");
		} catch (error) {
			assert.ok(/revert/.test(error.message), "String 'revert' not present in error message!");
			assert.ok(/Given IPFS Hash of Item is not listed as an Item For Sale from the Seller!/.test(error.message),
				"Appropriate error message not returned!");
		}
	});

	it("FranklinDecentralizedMarketplace : test getQuantityAvailableForSaleOfAnItemBySeller method : seller does exist, input _keyItemIpfsHash is an item the seller sells, but seller never set the quantity available for sale of the item", async () => {
		await franklinDecentralizedMarketplaceContract.addItemForSale("DummyItem_1", { from: accounts[randomAddressIndex] });
		await franklinDecentralizedMarketplaceContract.addItemForSale("DummyItem_2", { from: accounts[randomAddressIndex] });
		await franklinDecentralizedMarketplaceContract.addItemForSale("DummyItem_3", { from: accounts[randomAddressIndex] });

		assert.equal(await franklinDecentralizedMarketplaceContract.getQuantityAvailableForSaleOfAnItemBySeller(accounts[randomAddressIndex], "DummyItem_2"), 0,
			"Quantity available for sale of the Item should be equal to zero!");
	});

	it("FranklinDecentralizedMarketplace : test getQuantityAvailableForSaleOfAnItemBySeller  method : seller does exist, input _keyItemIpfsHash is an item the seller sells, but seller set quantity available for sale of the item to zero", async () => {
		await franklinDecentralizedMarketplaceContract.addItemForSale("DummyItem_1", { from: accounts[randomAddressIndex] });
		await franklinDecentralizedMarketplaceContract.addItemForSale("DummyItem_2", { from: accounts[randomAddressIndex] });
		await franklinDecentralizedMarketplaceContract.addItemForSale("DummyItem_3", { from: accounts[randomAddressIndex] });

		await franklinDecentralizedMarketplaceContract.setQuantityAvailableForSaleOfAnItem("DummyItem_2", 0, { from: accounts[randomAddressIndex] });
		assert.equal(await franklinDecentralizedMarketplaceContract.getQuantityAvailableForSaleOfAnItemBySeller(accounts[randomAddressIndex], "DummyItem_2"), 0,
			"Quantity available for sale of the Item should be equal to zero!");
	});

	it("FranklinDecentralizedMarketplace : test getQuantityAvailableForSaleOfAnItemBySeller method : seller does exist, input _keyItemIpfsHash is an item the seller sells, and seller sets the quantity available for sale of the item to a non-zero value", async () => {
		await franklinDecentralizedMarketplaceContract.addItemForSale("DummyItem_1", { from: accounts[randomAddressIndex] });
		await franklinDecentralizedMarketplaceContract.addItemForSale("DummyItem_2", { from: accounts[randomAddressIndex] });
		await franklinDecentralizedMarketplaceContract.addItemForSale("DummyItem_3", { from: accounts[randomAddressIndex] });

		await franklinDecentralizedMarketplaceContract.setQuantityAvailableForSaleOfAnItem("DummyItem_2", 3, { from: accounts[randomAddressIndex] });
		assert.equal(await franklinDecentralizedMarketplaceContract.getQuantityAvailableForSaleOfAnItemBySeller(accounts[randomAddressIndex], "DummyItem_2"), 3,
			"Quantity available for sale of the Item obtained is not the same quantity that it was set!");
	});

	it("FranklinDecentralizedMarketplace : test purchaseItemWithoutMediator : _quantity equal to zero", async () => {
		try {
			await franklinDecentralizedMarketplaceContract.purchaseItemWithoutMediator(
				accounts[randomAddressIndex], "KeyItemIPfsHash", 0, {from: accounts[(randomAddressIndex + 1) % NUMBER_OF_ACCOUNTS]});
			assert.fail("Should not be able to purchase an item if the quantity to purchase is zero!");
		} catch (error) {
			assert.ok(/revert/.test(error.message), "String 'revert' not present in error message!");
			assert.ok(/Must purchase at least 1 quantity of the Item for Sale to happen!/.test(error.message),
				"Appropriate error message not returned!");
		}
	});

	it("FranklinDecentralizedMarketplace : test purchaseItemWithoutMediator : Key Item Hash is an empty string", async () => {
		try {
			await franklinDecentralizedMarketplaceContract.purchaseItemWithoutMediator(
				accounts[randomAddressIndex], EMPTY_STRING, 4, {from: accounts[(randomAddressIndex + 1) % NUMBER_OF_ACCOUNTS]});
			assert.fail("Should not be able to purchase an item if the quantity to purchase is zero!");
		} catch (error) {
			assert.ok(/revert/.test(error.message), "String 'revert' not present in error message!");
			assert.ok(/Cannot have an empty String for the IPFS Hash Key of an Item you are purchasing!/.test(error.message),
				"Appropriate error message not returned!");
		}
	});

	it("FranklinDecentralizedMarketplace : test purchaseItemWithoutMediator : Buyer Address same as Seller Address", async () => {
		try {
			await franklinDecentralizedMarketplaceContract.purchaseItemWithoutMediator(
				accounts[randomAddressIndex], "KeyItemIPfsHash", 4, {from: accounts[randomAddressIndex]});
			assert.fail("A Purchase cannot be made if the Buyer Address is the same as Seller Address!");
		} catch (error) {
			assert.ok(/revert/.test(error.message), "String 'revert' not present in error message!");
			assert.ok(/The Buyer Address cannot be the same as the Seller Address!/.test(error.message),
				"Appropriate error message not returned!");
		}
	});

	it("FranklinDecentralizedMarketplace : test purchaseItemWithoutMediator : given seller address does not refer to an existing seller", async () => {
		try {
			await franklinDecentralizedMarketplaceContract.purchaseItemWithoutMediator(
				accounts[randomAddressIndex], "KeyItemIPfsHash", 4, {from: accounts[(randomAddressIndex + 1) % NUMBER_OF_ACCOUNTS]});
			assert.fail("A Purchase cannot be made if the Seller Address does not refer to an existing seller!");
		} catch (error) {
			assert.ok(/revert/.test(error.message), "String 'revert' not present in error message!");
			assert.ok(/Given Seller Address does not exist as a Seller!/.test(error.message),
				"Appropriate error message not returned!");
		}
	});

	it("FranklinDecentralizedMarketplace : test purchaseItemWithoutMediator : Given IPFS Hash of Item is not listed as an Item For Sale from the Seller", async () => {
		await franklinDecentralizedMarketplaceContract.addItemForSale("DummyItem_1", { from: accounts[randomAddressIndex] });
		await franklinDecentralizedMarketplaceContract.addItemForSale("DummyItem_3", { from: accounts[randomAddressIndex] });

		await franklinDecentralizedMarketplaceContract.addItemForSale("DummyItem_1", { from: accounts[(randomAddressIndex + 1) % NUMBER_OF_ACCOUNTS] });
		await franklinDecentralizedMarketplaceContract.addItemForSale("DummyItem_2", { from: accounts[(randomAddressIndex + 1) % NUMBER_OF_ACCOUNTS] });
		await franklinDecentralizedMarketplaceContract.addItemForSale("DummyItem_3", { from: accounts[(randomAddressIndex + 1) % NUMBER_OF_ACCOUNTS] });

		try {
			await franklinDecentralizedMarketplaceContract.purchaseItemWithoutMediator(
				accounts[randomAddressIndex], "DummyItem_2", 4, {from: accounts[(randomAddressIndex + 2) % NUMBER_OF_ACCOUNTS]});
			assert.fail("A Purchase cannot be made if the Buyer wishes to buy an Itemn from the Seller that the Seller does not have!");
		} catch (error) {
			assert.ok(/revert/.test(error.message), "String 'revert' not present in error message!");
			assert.ok(/Given IPFS Hash of Item is not listed as an Item For Sale from the Seller!/.test(error.message),
				"Appropriate error message not returned!");
		}
	});

	it("FranklinDecentralizedMarketplace : test purchaseItemWithoutMediator : Seller has Zero quantity available for Sale for the Item requested to purchase", async () => {
		await franklinDecentralizedMarketplaceContract.addItemForSale("DummyItem_1", { from: accounts[randomAddressIndex] });
		await franklinDecentralizedMarketplaceContract.addItemForSale("DummyItem_3", { from: accounts[randomAddressIndex] });

		try {
			await franklinDecentralizedMarketplaceContract.purchaseItemWithoutMediator(
				accounts[randomAddressIndex], "DummyItem_3", 4, {from: accounts[(randomAddressIndex + 2) % NUMBER_OF_ACCOUNTS]});
			assert.fail("A Purchase cannot be made if the Buyer wishes to purchase an Item the seller has, but the quantity available is zero!");
		} catch (error) {
			assert.ok(/revert/.test(error.message), "String 'revert' not present in error message!");
			assert.ok(/Seller has Zero quantity available for Sale for the Item requested to purchase!/.test(error.message),
				"Appropriate error message not returned!");
		}
	});

	it("FranklinDecentralizedMarketplace : test purchaseItemWithoutMediator : buyer wishes to purhase an item from a seller whose price has not been set by the seller (i.e., price is zero)", async () => {
		await franklinDecentralizedMarketplaceContract.addItemForSale("DummyItem_1", { from: accounts[randomAddressIndex] });
		await franklinDecentralizedMarketplaceContract.addItemForSale("DummyItem_3", { from: accounts[randomAddressIndex] });

		await franklinDecentralizedMarketplaceContract.setQuantityAvailableForSaleOfAnItem("DummyItem_3", 12, { from: accounts[randomAddressIndex] });

		try {
			await franklinDecentralizedMarketplaceContract.purchaseItemWithoutMediator(
				accounts[randomAddressIndex], "DummyItem_3", 4, {from: accounts[(randomAddressIndex + 2) % NUMBER_OF_ACCOUNTS]});
			assert.fail("A Purchase cannot be made if the Buyer wishes to purchase an Item the seller has, but the price has not been set by the seller (i.e, price is zero)!");
		} catch (error) {
			assert.ok(/revert/.test(error.message), "String 'revert' not present in error message!");
			assert.ok(/The Seller has not yet set a Price for Sale for the requested Item! Cannot purchase the Item!/.test(error.message),
				"Appropriate error message not returned!");
		}
	});

	it("FranklinDecentralizedMarketplace : test purchaseItemWithoutMediator : buyer wishes to purchase an item from a seller but buyer does not send enough ETH/WEI to make purchase", async () => {
		await franklinDecentralizedMarketplaceContract.addItemForSale("DummyItem_1", { from: accounts[randomAddressIndex] });
		await franklinDecentralizedMarketplaceContract.addItemForSale("DummyItem_3", { from: accounts[randomAddressIndex] });

		let buyerAddress = accounts[(randomAddressIndex + 2) % NUMBER_OF_ACCOUNTS];

		// Use below as a design pattern in other test cases.
		let buyerBalanceStr = await web3.eth.getBalance(buyerAddress);
		let buyerBalanceBN = new BN(buyerBalanceStr);

		await franklinDecentralizedMarketplaceContract.setQuantityAvailableForSaleOfAnItem("DummyItem_3", 12, { from: accounts[randomAddressIndex] });
		await franklinDecentralizedMarketplaceContract.setPriceOfItem("DummyItem_3", 100, { from: accounts[randomAddressIndex] });

		try {
			await franklinDecentralizedMarketplaceContract.purchaseItemWithoutMediator(
				accounts[randomAddressIndex], "DummyItem_3", 3, {from: buyerAddress, value: 299});
			assert.fail("A Purchase cannot be made if the Buyer does not send enough ETH/WEI for the purchase!");
		} catch (error) {
			assert.ok(/revert/.test(error.message), "String 'revert' not present in error message!");
			assert.ok(/Not enough ETH was sent to purchase the quantity requested of the Item!/.test(error.message),
				"Appropriate error message not returned!");
		}
	});
	*/

	it("FranklinDecentralizedMarketplace : test purchaseItemWithoutMediator : buyer purchases item from seller and sends value equal to amount needed to make purchase", async () => {
		let sellerAddress = accounts[(randomAddressIndex + 4) % NUMBER_OF_ACCOUNTS];
		// console.log('sellerAddress =', sellerAddress);

		await franklinDecentralizedMarketplaceContract.addItemForSale("DummyItem_1", { from: sellerAddress });
		await franklinDecentralizedMarketplaceContract.addItemForSale("DummyItem_3", { from: sellerAddress });

		let originalQuantityAvailableForSale = 12;
		await franklinDecentralizedMarketplaceContract.setQuantityAvailableForSaleOfAnItem("DummyItem_3", originalQuantityAvailableForSale,
			{ from: sellerAddress });

		let priceOfItem = 0.25 * ETH;
		// let priceOfItemBN = new BN(priceOfItem);
		await franklinDecentralizedMarketplaceContract.setPriceOfItem("DummyItem_3", priceOfItem.toString(), { from: sellerAddress });

		// console.log('Passed Point 1....');

		let buyerAddress = accounts[(randomAddressIndex + 2) % NUMBER_OF_ACCOUNTS];
		// console.log('buyerAddress =', buyerAddress);
		let buyerBalanceStr = await web3.eth.getBalance(buyerAddress);
		let buyerBalanceBeforePurchaseBN = new BN(buyerBalanceStr);
		// console.log('buyerBalanceBeforePurchaseBN.toString() =', buyerBalanceBeforePurchaseBN.toString());
		// console.log('                        buyerBalanceStr =', buyerBalanceStr);

		let sellerBalanceStr = await web3.eth.getBalance(sellerAddress);
		let sellerBalanceBeforePurchaseBN = new BN(sellerBalanceStr);
		// console.log('sellerBalanceBeforePurchaseBN.toString() =', sellerBalanceBeforePurchaseBN.toString());
		// console.log('                        sellerBalanceStr =', sellerBalanceStr);

		let quantityOfTheItemInPurchase = 3;
		let amountOfWeiToSend = quantityOfTheItemInPurchase * priceOfItem;
		let results = await franklinDecentralizedMarketplaceContract.purchaseItemWithoutMediator(
			sellerAddress, "DummyItem_3", quantityOfTheItemInPurchase, {from: buyerAddress, value: amountOfWeiToSend});
		// console.log('results =', results);

		// console.log('Passed Point 2....');

		let expectedNewQuantityAvailableForSale = originalQuantityAvailableForSale - quantityOfTheItemInPurchase;
		assert.equal(
			await franklinDecentralizedMarketplaceContract.getQuantityAvailableForSaleOfAnItemBySeller(sellerAddress, "DummyItem_3"),
			expectedNewQuantityAvailableForSale, "Quantity available for Sale of the Item after purchase is incorrect!");

		let cummulativeGasUsed = results.receipt.cumulativeGasUsed;
		// console.log('cummulativeGasUsed =', cummulativeGasUsed);

		// console.log('amountOfWeiToSend =', amountOfWeiToSend);
		// console.log('amountOfWeiToSend.toString() =', amountOfWeiToSend.toString());

		let expectedBuyerBalanceAfterPurchaseBN = buyerBalanceBeforePurchaseBN.sub(new BN(amountOfWeiToSend.toString())); // subtract value spent
		// console.log('expectedBuyerBalanceAfterPurchaseBN.toString() (subtract value spent) =', expectedBuyerBalanceAfterPurchaseBN.toString());

		expectedBuyerBalanceAfterPurchaseBN = expectedBuyerBalanceAfterPurchaseBN.sub(new BN(cummulativeGasUsed * GAS_BASE_UNIT)); // subtract gas spent
		// console.log('expectedBuyerBalanceAfterPurchaseBN.toString() (subtract gas spent) =', expectedBuyerBalanceAfterPurchaseBN.toString());

		buyerBalanceStr = await web3.eth.getBalance(buyerAddress);
		assert.equal(buyerBalanceStr, expectedBuyerBalanceAfterPurchaseBN.toString(), "Buyer balance after purchase is incorrect!");

		let expectedSellerBalanceAfterPurchaseBN = sellerBalanceBeforePurchaseBN.add(new BN(amountOfWeiToSend.toString())); // add value received
		// console.log('expectedSellerBalanceAfterPurchaseBN.toString() =', expectedSellerBalanceAfterPurchaseBN.toString());
		sellerBalanceStr = await web3.eth.getBalance(sellerAddress);
		assert.equal(sellerBalanceStr, expectedSellerBalanceAfterPurchaseBN.toString(), "Seller balance after purchase is incorrect!");

		// console.log('results.logs[0] =', results.logs[0]);
		// console.log('results.logs[0].event =', results.logs[0].event);
		// console.log('results.logs[0].args =', results.logs[0].args);
		// console.log('results.logs[0].args.__length__ =', results.logs[0].args.__length__);
		// console.log('results.logs[0].args._msgSender =', results.logs[0].args._msgSender);
		// console.log('results.logs[0].args._sellerAddress =', results.logs[0].args._sellerAddress);
		// console.log('results.logs[0].args._keyItemIpfsHash =', results.logs[0].args._keyItemIpfsHash);
		// console.log('results.logs[0].args._quantity.toString() =', results.logs[0].args._quantity.toString());

		// Making sure that PurchaseItemWithoutMediatorEvent(msg.sender, _sellerAddress, _keyItemIpfsHash, _quantity) fired off
		assert.equal(results.logs.length, 1, "There should have been one Event Fired Off!");
		assert.equal(results.logs[0].event, 'PurchaseItemWithoutMediatorEvent', "There should have been a PurchaseItemWithoutMediatorEvent Event Fired Off!");
		assert.ok(results.logs[0].args !== undefined, "There should have been a results.logs[0].args object!");
		assert.equal(results.logs[0].args.__length__, 4, "There should have been 4 arguments in the PurchaseItemWithoutMediatorEvent Event that Fired Off!");
		assert.equal(results.logs[0].args._msgSender, buyerAddress, "The _msgSender argument should be the Buyer Address!");
		assert.equal(results.logs[0].args._sellerAddress, sellerAddress, "The _sellerAddress argument should be the Seller Address!");
		assert.equal(results.logs[0].args._keyItemIpfsHash, "DummyItem_3", "The _keyItemIpfsHash argument should be IPFS Hash of Item bought!");
		// console.log('quantityOfTheItemInPurchase =', quantityOfTheItemInPurchase);
		assert.equal(results.logs[0].args._quantity.toString(), quantityOfTheItemInPurchase.toString(), "The __quantity argument should be quantity of the Items bought!");
	});

	it("FranklinDecentralizedMarketplace : test purchaseItemWithoutMediator : buyer purchases item from seller and sends value greater amount needed to make purchase", async () => {
		let sellerAddress = accounts[(randomAddressIndex + 4) % NUMBER_OF_ACCOUNTS];
		// console.log('sellerAddress =', sellerAddress);

		await franklinDecentralizedMarketplaceContract.addItemForSale("DummyItem_1", { from: sellerAddress });
		await franklinDecentralizedMarketplaceContract.addItemForSale("DummyItem_3", { from: sellerAddress });

		let originalQuantityAvailableForSale = 12;
		await franklinDecentralizedMarketplaceContract.setQuantityAvailableForSaleOfAnItem("DummyItem_3", originalQuantityAvailableForSale,
			{ from: sellerAddress });

		let priceOfItem = 0.25 * ETH;
		// let priceOfItemBN = new BN(priceOfItem);
		await franklinDecentralizedMarketplaceContract.setPriceOfItem("DummyItem_3", priceOfItem.toString(), { from: sellerAddress });

		// console.log('Passed Point 1....');

		let buyerAddress = accounts[(randomAddressIndex + 2) % NUMBER_OF_ACCOUNTS];
		// console.log('buyerAddress =', buyerAddress);
		let buyerBalanceStr = await web3.eth.getBalance(buyerAddress);
		let buyerBalanceBeforePurchaseBN = new BN(buyerBalanceStr);
		// console.log('buyerBalanceBeforePurchaseBN.toString() =', buyerBalanceBeforePurchaseBN.toString());
		// console.log('                        buyerBalanceStr =', buyerBalanceStr);

		let sellerBalanceStr = await web3.eth.getBalance(sellerAddress);
		let sellerBalanceBeforePurchaseBN = new BN(sellerBalanceStr);
		// console.log('sellerBalanceBeforePurchaseBN.toString() =', sellerBalanceBeforePurchaseBN.toString());
		// console.log('                        sellerBalanceStr =', sellerBalanceStr);

		let quantityOfTheItemInPurchase = 3;
		let amountOfWeiToSend = quantityOfTheItemInPurchase * priceOfItem;
		let amountOfWeiToSend_plus_extra = amountOfWeiToSend + (0.2 * ETH);
		let results = await franklinDecentralizedMarketplaceContract.purchaseItemWithoutMediator(
			sellerAddress, "DummyItem_3", quantityOfTheItemInPurchase, {from: buyerAddress, value: amountOfWeiToSend_plus_extra});
		// console.log('results =', results);

		// console.log('Passed Point 2....');

		let expectedNewQuantityAvailableForSale = originalQuantityAvailableForSale - quantityOfTheItemInPurchase;
		assert.equal(
			await franklinDecentralizedMarketplaceContract.getQuantityAvailableForSaleOfAnItemBySeller(sellerAddress, "DummyItem_3"),
			expectedNewQuantityAvailableForSale, "Quantity available for Sale of the Item after purchase is incorrect!");

		let cummulativeGasUsed = results.receipt.cumulativeGasUsed;
		// console.log('cummulativeGasUsed =', cummulativeGasUsed);

		// console.log('amountOfWeiToSend =', amountOfWeiToSend);
		// console.log('amountOfWeiToSend.toString() =', amountOfWeiToSend.toString());

		let expectedBuyerBalanceAfterPurchaseBN = buyerBalanceBeforePurchaseBN.sub(new BN(amountOfWeiToSend.toString())); // subtract value spent
		// console.log('expectedBuyerBalanceAfterPurchaseBN.toString() (subtract value spent) =', expectedBuyerBalanceAfterPurchaseBN.toString());

		expectedBuyerBalanceAfterPurchaseBN = expectedBuyerBalanceAfterPurchaseBN.sub(new BN(cummulativeGasUsed * GAS_BASE_UNIT)); // subtract gas spent
		// console.log('expectedBuyerBalanceAfterPurchaseBN.toString() (subtract gas spent) =', expectedBuyerBalanceAfterPurchaseBN.toString());

		buyerBalanceStr = await web3.eth.getBalance(buyerAddress);
		assert.equal(buyerBalanceStr, expectedBuyerBalanceAfterPurchaseBN.toString(), "Buyer balance after purchase is incorrect!");

		let expectedSellerBalanceAfterPurchaseBN = sellerBalanceBeforePurchaseBN.add(new BN(amountOfWeiToSend.toString())); // add value received
		// console.log('expectedSellerBalanceAfterPurchaseBN.toString() =', expectedSellerBalanceAfterPurchaseBN.toString());
		sellerBalanceStr = await web3.eth.getBalance(sellerAddress);
		assert.equal(sellerBalanceStr, expectedSellerBalanceAfterPurchaseBN.toString(), "Seller balance after purchase is incorrect!");

		// console.log('results.logs[0] =', results.logs[0]);
		// console.log('results.logs[0].event =', results.logs[0].event);
		// console.log('results.logs[0].args =', results.logs[0].args);
		// console.log('results.logs[0].args.__length__ =', results.logs[0].args.__length__);
		// console.log('results.logs[0].args._msgSender =', results.logs[0].args._msgSender);
		// console.log('results.logs[0].args._sellerAddress =', results.logs[0].args._sellerAddress);
		// console.log('results.logs[0].args._keyItemIpfsHash =', results.logs[0].args._keyItemIpfsHash);
		// console.log('results.logs[0].args._quantity.toString() =', results.logs[0].args._quantity.toString());

		// Making sure that PurchaseItemWithoutMediatorEvent(msg.sender, _sellerAddress, _keyItemIpfsHash, _quantity) fired off
		assert.equal(results.logs.length, 1, "There should have been one Event Fired Off!");
		assert.equal(results.logs[0].event, 'PurchaseItemWithoutMediatorEvent', "There should have been a PurchaseItemWithoutMediatorEvent Event Fired Off!");
		assert.ok(results.logs[0].args !== undefined, "There should have been a results.logs[0].args object!");
		assert.equal(results.logs[0].args.__length__, 4, "There should have been 4 arguments in the PurchaseItemWithoutMediatorEvent Event that Fired Off!");
		assert.equal(results.logs[0].args._msgSender, buyerAddress, "The _msgSender argument should be the Buyer Address!");
		assert.equal(results.logs[0].args._sellerAddress, sellerAddress, "The _sellerAddress argument should be the Seller Address!");
		assert.equal(results.logs[0].args._keyItemIpfsHash, "DummyItem_3", "The _keyItemIpfsHash argument should be IPFS Hash of Item bought!");
		// console.log('quantityOfTheItemInPurchase =', quantityOfTheItemInPurchase);
		assert.equal(results.logs[0].args._quantity.toString(), quantityOfTheItemInPurchase.toString(), "The __quantity argument should be quantity of the Items bought!");
	});

	// Below is what's returned in function calls that change the contract.
    /*
	it("test addItemForSale", async () => {
		let tx = await franklinDecentralizedMarketplaceContract.addItemForSale("DummyItem", { from: accounts[2], data: "The cat is in the hat!" });
		console.log('tx =', tx);
	});
	*/

	// Use below to see how BN works and setting and getting of prices.
	/*
	it("FranklinDecentralizedMarketplace : test purchaseItemWithoutMediator : buyer wishes to purchase an item from a seller but buyer does not send enough ETH/WEI to make purchase", async () => {
		await franklinDecentralizedMarketplaceContract.addItemForSale("DummyItem_1", { from: accounts[randomAddressIndex] });
		await franklinDecentralizedMarketplaceContract.addItemForSale("DummyItem_3", { from: accounts[randomAddressIndex] });

		let buyerAddress = accounts[(randomAddressIndex + 2) % NUMBER_OF_ACCOUNTS];

		// Use below as a design pattern in other test cases.
		let buyerBalanceStr = await web3.eth.getBalance(buyerAddress);
		let buyerBalanceBN = new BN(buyerBalanceStr);

		console.log('buyerAddress =', buyerAddress);
		console.log('buyerBalanceStr =', buyerBalanceStr);
		console.log('buyerBalanceBN =', buyerBalanceBN);
		console.log('buyerBalanceBN.toString() =', buyerBalanceBN.toString());
		console.log('typeof buyerBalanceStr =', typeof buyerBalanceStr);
		console.log('typeof buyerBalanceBN =', typeof buyerBalanceBN);

		await franklinDecentralizedMarketplaceContract.setPriceOfItem("DummyItem_3", buyerBalanceBN, { from: accounts[randomAddressIndex] });
		let priceOfItemBN = await franklinDecentralizedMarketplaceContract.getPriceOfItem(accounts[randomAddressIndex], "DummyItem_3");
		console.log('priceOfItemBN =', priceOfItemBN);
		console.log('priceOfItemBN.toString() =', priceOfItemBN.toString());
		console.log('typeof priceOfItemBN =', priceOfItemBN);

		console.log();

		let buyerBalanceBN_plus_555_wrong_way = buyerBalanceBN + 555;
		console.log('buyerBalanceBN_plus_555_wrong_way =', buyerBalanceBN_plus_555_wrong_way);
		let buyerBalanceBN_plus_555_correct = buyerBalanceBN.add(new BN(555));
		console.log('buyerBalanceBN_plus_555_correct =', buyerBalanceBN_plus_555_correct);
		console.log('buyerBalanceBN_plus_555_correct.toString() =', buyerBalanceBN_plus_555_correct.toString());
		await franklinDecentralizedMarketplaceContract.setPriceOfItem("DummyItem_3", buyerBalanceBN_plus_555_correct, { from: accounts[randomAddressIndex] });
		priceOfItemBN = await franklinDecentralizedMarketplaceContract.getPriceOfItem(accounts[randomAddressIndex], "DummyItem_3");
		console.log('priceOfItemBN =', priceOfItemBN);
		console.log('priceOfItemBN.toString() =', priceOfItemBN.toString());
		console.log();
		await franklinDecentralizedMarketplaceContract.setPriceOfItem("DummyItem_3", 500, { from: accounts[randomAddressIndex] });
		priceOfItemBN = await franklinDecentralizedMarketplaceContract.getPriceOfItem(accounts[randomAddressIndex], "DummyItem_3");
		console.log('priceOfItemBN =', priceOfItemBN);
		console.log('priceOfItemBN.toString() =', priceOfItemBN.toString());

		await franklinDecentralizedMarketplaceContract.setQuantityAvailableForSaleOfAnItem("DummyItem_3", 12, { from: accounts[randomAddressIndex] });
		await franklinDecentralizedMarketplaceContract.setPriceOfItem("DummyItem_3", 100, { from: accounts[randomAddressIndex] });

		try {
			await franklinDecentralizedMarketplaceContract.purchaseItemWithoutMediator(
				accounts[randomAddressIndex], "DummyItem_3", 3, {from: buyerAddress, value: 299});
			assert.fail("A Purchase cannot be made if the Buyer does not send enough ETH/WEI for the purchase!");
		} catch (error) {
			assert.ok(/revert/.test(error.message), "String 'revert' not present in error message!");
			assert.ok(/Not enough ETH was sent to purchase the quantity requested of the Item!/.test(error.message),
				"Appropriate error message not returned!");
		}
	});


	// Cannot test as pure Unit Test, because Truffle will not let me use "from" address of the "franklinDecentralizedMarketplaceContract.mediationMarketplace.call()".
	// Testing for this will have to be done when testing the "FranklinDecentralizedMarketplaceContractMediation.purchaseItemWithMediator" method.
	// ven though the FranklinDecentralizedMarketplaceMediation Contract got deployed at a certain Ethereum Address on the Ganche Ethereum Server, the Ganache
	// Ethereum Server does not have the Private Key of the Ethereum Address where the FranklinDecentralizedMarketplaceMediation Contract got deployed. The "from"
	// address when making function calls and forceing it to be called from a certain address has to come from an accounts[x] that the Ganache Ethereum Server
	// has the Private Keys.
	/*
	it("FranklinDecentralizedMarketplace : test setQuantityAvailableForSaleOfAnItem_v2 method : seller does exist, input _keyItemIpfsHash is an item the seller sells, and input _quantity is NOT zero", async () => {
		await franklinDecentralizedMarketplaceContract.addItemForSale("DummyItem_1", { from: accounts[randomAddressIndex] });
		await franklinDecentralizedMarketplaceContract.addItemForSale("DummyItem_2", { from: accounts[randomAddressIndex] });
		await franklinDecentralizedMarketplaceContract.addItemForSale("DummyItem_3", { from: accounts[randomAddressIndex] });
		let fromAddress = await franklinDecentralizedMarketplaceContract.mediationMarketplace.call();

		await franklinDecentralizedMarketplaceContract.setQuantityAvailableForSaleOfAnItem(accounts[randomAddressIndex], "DummyItem_2", 4, { from: fromAddress });
		assert.equal(await franklinDecentralizedMarketplaceContract.getQuantityAvailableForSaleOfAnItemBySeller(accounts[randomAddressIndex], "DummyItem_2"), 4,
			"Quantity available for Sale of the Item that was set is NOT equal to what is stored in the Contract!");
	});
	*/

	// Below Unit Test done due to being suggested by Patrick Galloway. It took about 896392 milli-seconds to complete.
	// It should be commented out, since it's highly repetitive and takes a long time to run. If run, it should be the last one to run.
	/*
	it("test capability to add 100 sellers with 10 items each as suggested by Patrick Galloway", async () => {
		for (let sellerAccountIndex = 0; sellerAccountIndex < 100; sellerAccountIndex++) {
			for (let itemIndex = 0; itemIndex < 10; itemIndex++) {
				let itemIpfsHash = `Item ${itemIndex}`;
				await franklinDecentralizedMarketplaceContract.addItemForSale(itemIpfsHash, {from: accounts[sellerAccountIndex]});

				let sellerExistsFlag = await franklinDecentralizedMarketplaceContract.sellerExists(accounts[sellerAccountIndex]);
				assert.equal(sellerExistsFlag, true, `Seller accounts[${sellerAccountIndex}] = ${accounts[sellerAccountIndex]} should exist in ` +
					`"listOfSellers" double-linked list but appears to not exist!`);

				let sellerAddress = await franklinDecentralizedMarketplaceContract.getSellerAddress(0);
				assert.equal(sellerAddress, accounts[sellerAccountIndex], `Seller not added at beginning of "listOfSellers" double-linked list! ` +
					`sellerAddress = ${sellerAddress} NOT equal to accounts[${sellerAccountIndex}] = ${accounts[sellerAccountIndex]}`);

				let itemExistsFlag = await franklinDecentralizedMarketplaceContract.itemForSaleFromSellerExists(sellerAddress, itemIpfsHash);
				assert.equal(itemExistsFlag, true, `Item ${itemIpfsHash} from Seller Address ${sellerAddress} does not exist! It should exist!`);

				let returnedItemIpfsHash = await franklinDecentralizedMarketplaceContract.getItemForSale(sellerAddress, 0);
				assert.equal(returnedItemIpfsHash, itemIpfsHash, `Item ${itemIpfsHash} from Seller Address ${sellerAddress} was not properly added ` +
					`at the beggining of the Seller's double-linked list of items!`);
			}
		}

		// Make sure that ALL the Sellers that were added STILL exist as Sellers and are in the correct location in the "listOfSellers" double-linked list.
		let sellerAccountDecrementingIndex = 99;
		for (let sellerAccountIndex = 0; sellerAccountIndex < 100; sellerAccountIndex++) {
			let sellerExistsFlag = await franklinDecentralizedMarketplaceContract.sellerExists(accounts[sellerAccountIndex]);
			assert.equal(sellerExistsFlag, true, `Seller accounts[${sellerAccountIndex}] = ${accounts[sellerAccountIndex]} should exist in ` +
				`"listOfSellers" double-linked list but appears to not exist!`);

			let sellerAddress = await franklinDecentralizedMarketplaceContract.getSellerAddress(sellerAccountDecrementingIndex);
			assert.equal(sellerAddress, accounts[sellerAccountIndex], `Seller not appropriately added at index ${sellerAccountDecrementingIndex} of "listOfSellers" ` +
				`double-linked list! sellerAddress = ${sellerAddress} NOT equal to ` +
				`accounts[${sellerAccountDecrementingIndex}] = ${accounts[sellerAccountDecrementingIndex]}`);

			sellerAccountDecrementingIndex--;

			// Make sure all the Items added for a Seller are still there and in the correct location of the Seller's double-linked list of Items
			// For Sale.
			let itemDecrementingIndex = 9;
			for (let itemIndex = 0; itemIndex < 10; itemIndex++) {
				let itemIpfsHash = `Item ${itemIndex}`;

				let itemExistsFlag = await franklinDecentralizedMarketplaceContract.itemForSaleFromSellerExists(sellerAddress, itemIpfsHash);
				assert.equal(itemExistsFlag, true, `Item ${itemIpfsHash} from Seller Address ${sellerAddress} does not exist! It should exist!`);

				let returnedItemIpfsHash = await franklinDecentralizedMarketplaceContract.getItemForSale(sellerAddress, itemDecrementingIndex);
				assert.equal(returnedItemIpfsHash, itemIpfsHash, `Item ${itemIpfsHash} from Seller Address ${sellerAddress} not appropriately added at ` +
					`index ${itemDecrementingIndex} of the Seller's double-linked list of Items! itemIpfsHash = ${itemIpfsHash} NOT equal to ` +
					`returnedItemIpfsHash = ${returnedItemIpfsHash}`);

				itemDecrementingIndex--;
			}
		}
	});
	*/

});