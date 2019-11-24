const FranklinDecentralizedMarketplace = artifacts.require("FranklinDecentralizedMarketplace");
const FranklinDecentralizedMarketplaceMediation = artifacts.require("FranklinDecentralizedMarketplaceMediation");
const utils = require("./utils.js");

// The "assert" JavaScvript documented in --> https://www.w3schools.com/nodejs/ref_assert.asp
// Reference --> https://www.trufflesuite.com/docs/truffle/getting-started/interacting-with-your-contracts

contract("FranklinDecentralizedMarketplace and FranklinDecentralizedMarketplaceMediation", async accounts => {
	const EMPTY_ADDRESS = "0x0000000000000000000000000000000000000000";
	const EMPTY_STRING = "";
	const NUMBER_OF_ACCOUNTS = 100;

	const BUYER_INDEX = 0;
	const SELLER_INDEX = 1;
	const MEDIATOR_INDEX = 2;

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

		await franklinDecentralizedMarketplaceContract.setFranklinDecentralizedMarketplaceMediationContract(
			franklinDecentralizedMarketplaceMediationContract.address, {from: accounts[0]});
		await franklinDecentralizedMarketplaceMediationContract.setFranklinDecentralizedMarketplaceContract(
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

	// Begin Unit Testing of FranklinDecentralizedMarketplace Smart Contract

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

		assert.equal(await franklinDecentralizedMarketplaceContract.sellerExists.call(accounts[randomAddressIndex]), false, "Seller should not exist!");
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

		assert.equal(await franklinDecentralizedMarketplaceContract.sellerExists.call(accounts[randomAddressIndex]), false, "Seller should not exist!");
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

	it("FranklinDecentralizedMarketplace : test sellerExists built-in method : no sellers exist", async () => {
		assert.equal(await franklinDecentralizedMarketplaceContract.sellerExists.call(accounts[randomAddressIndex]), false,
			"No sellers have been added, yet function returns boolean true!");
	});

	it("FranklinDecentralizedMarketplace : test sellerExists built-in method : sellers exist but input seller does not exist", async () => {
		let firstSellerAddress = accounts[randomAddressIndex];
		let secondSellerAddress = accounts[(randomAddressIndex + 1) % NUMBER_OF_ACCOUNTS];
		let thirdSellerAddress = accounts[(randomAddressIndex + 2) % NUMBER_OF_ACCOUNTS];
		let sellerAddressThatDoesNotExist = accounts[(randomAddressIndex + 3) % NUMBER_OF_ACCOUNTS];

		await franklinDecentralizedMarketplaceContract.addItemForSale("DummyItem_1", { from: firstSellerAddress });
		await franklinDecentralizedMarketplaceContract.addItemForSale("DummyItem_1", { from: secondSellerAddress });
		await franklinDecentralizedMarketplaceContract.addItemForSale("DummyItem_1", { from: thirdSellerAddress });

		assert.equal(await franklinDecentralizedMarketplaceContract.sellerExists.call(sellerAddressThatDoesNotExist), false,
			"Input Seller Address was never added as a seller, yet function returns back boolean true!");
	});

	it("FranklinDecentralizedMarketplace : test sellerExists built-in method : sellers exist and input seller does exist", async () => {
		let firstSellerAddress = accounts[randomAddressIndex];
		let secondSellerAddress = accounts[(randomAddressIndex + 1) % NUMBER_OF_ACCOUNTS];
		let thirdSellerAddress = accounts[(randomAddressIndex + 2) % NUMBER_OF_ACCOUNTS];

		await franklinDecentralizedMarketplaceContract.addItemForSale("DummyItem_1", { from: firstSellerAddress });
		await franklinDecentralizedMarketplaceContract.addItemForSale("DummyItem_1", { from: secondSellerAddress });
		await franklinDecentralizedMarketplaceContract.addItemForSale("DummyItem_1", { from: thirdSellerAddress });

		assert.equal(await franklinDecentralizedMarketplaceContract.sellerExists.call(firstSellerAddress), true,
			`Input Seller Address ${firstSellerAddress} was added as a seller, yet function returns back boolean false!`);
		assert.equal(await franklinDecentralizedMarketplaceContract.sellerExists.call(secondSellerAddress), true,
			`Input Seller Address ${secondSellerAddress} was added as a seller, yet function returns back boolean false!`);
		assert.equal(await franklinDecentralizedMarketplaceContract.sellerExists.call(thirdSellerAddress), true,
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
		assert.equal(results.logs[0].args._quantity.toString(), quantityOfTheItemInPurchase.toString(), "The _quantity argument should be quantity of the Items bought!");
	});

	it("FranklinDecentralizedMarketplace : test purchaseItemWithoutMediator : buyer purchases item from seller and sends value greater then amount needed to make purchase", async () => {
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
		assert.equal(results.logs[0].args._quantity.toString(), quantityOfTheItemInPurchase.toString(), "The _quantity argument should be quantity of the Items bought!");
	});

	it("FranklinDecentralizedMarketplace : test addItemForSale : IPFS Hash key referring to an Item is an empty string", async () => {
		try {
			await franklinDecentralizedMarketplaceContract.addItemForSale(EMPTY_STRING, { from: accounts[randomAddressIndex] });
			assert.fail("Cannot add an Item for Sale that is identified by an empty string!");
		} catch (error) {
			assert.ok(/revert/.test(error.message), "String 'revert' not present in error message!");
			assert.ok(/Cannot have an empty String for the IPFS Hash Key of an Item to Sell!/.test(error.message),
				"Appropriate error message not returned!");
		}
	});

	it("FranklinDecentralizedMarketplace : test addItemForSale : IPFS Hash Key refers to an already existing Item in the seller's list of items for sale", async () => {
		let sellerAddress = accounts[randomAddressIndex];
		await franklinDecentralizedMarketplaceContract.addItemForSale("DummyItem_1", { from: sellerAddress });
		assert.equal(await franklinDecentralizedMarketplaceContract.getNumberOfDifferentItemsBeingSoldBySeller(sellerAddress), 1,
			"Initial count of Items for Seller should have been 1!");
		assert.equal(await franklinDecentralizedMarketplaceContract.itemForSaleFromSellerExists(sellerAddress, "DummyItem_1"), true,
			"Initially, given Item IPFS Key Hash should have already existed for the Seller!");

		let results = await franklinDecentralizedMarketplaceContract.addItemForSale("DummyItem_1", { from: sellerAddress });
		assert.equal(results.logs.length, 0, "There should be no events that fire off!");
		assert.equal(await franklinDecentralizedMarketplaceContract.getNumberOfDifferentItemsBeingSoldBySeller(sellerAddress), 1,
			"Count of Items for Seller should not change!");
		assert.equal(await franklinDecentralizedMarketplaceContract.itemForSaleFromSellerExists(sellerAddress, "DummyItem_1"), true,
			"Should still reflect that given Item exists!");
	});

	it("FranklinDecentralizedMarketplace : test addItemForSale : seller does not exist - multiple sellers added for same Item", async () => {
		let sellerAddress = accounts[randomAddressIndex];
		assert.equal(await franklinDecentralizedMarketplaceContract.sellerExists.call(sellerAddress), false, "Seller should initially not exist!");
		assert.equal(await franklinDecentralizedMarketplaceContract.itemForSaleFromSellerExists(sellerAddress, "DummyItem_1"), false,
			"Initially, given Item IPFS Key Hash should NOT exist for the Seller!");
		assert.equal(await franklinDecentralizedMarketplaceContract.getNumberOfDifferentItemsBeingSoldBySeller(sellerAddress), 0,
			"Initial count of Items for Seller should have been 0!");
		assert.equal(await franklinDecentralizedMarketplaceContract.getNumberOfSellers(), 0,
			"Initally, Number of Sellers should be equal to zero!");

		// Item for a Seller that does not exist is added.
		await franklinDecentralizedMarketplaceContract.addItemForSale("DummyItem_1", { from: sellerAddress});
		assert.equal(await franklinDecentralizedMarketplaceContract.sellerExists.call(sellerAddress), true, "Seller should exist after adding an Item For Sale!");
		assert.equal(await franklinDecentralizedMarketplaceContract.itemForSaleFromSellerExists(sellerAddress, "DummyItem_1"), true,
			"Given Item IPFS Key Hash should now exist for the Seller after adding of the Item!");
		assert.equal(await franklinDecentralizedMarketplaceContract.getNumberOfDifferentItemsBeingSoldBySeller(sellerAddress), 1,
			"Count of Items for Seller increase by 1 when an Item that did not exist for the Seller is added!");
		assert.equal(await franklinDecentralizedMarketplaceContract.getNumberOfSellers(), 1,
			"Number of Sellers should increase by 1 after seller that did not exist is added!");
		assert.equal(await franklinDecentralizedMarketplaceContract.getSellerAddress(0), sellerAddress,
			"Seller Address should exist in 'listOfSellers' and should be able to be accessed via the appropropriate index");
		assert.equal(await franklinDecentralizedMarketplaceContract.getItemForSale(sellerAddress, 0), "DummyItem_1",
			"Item that Seller just added should be accesible in it's 'listOfItems' at the appropriate index");

		// Adding a second seller

		sellerAddress = accounts[(randomAddressIndex + 1) % NUMBER_OF_ACCOUNTS];
		assert.equal(await franklinDecentralizedMarketplaceContract.sellerExists.call(sellerAddress), false, "Seller should initially not exist!");
		assert.equal(await franklinDecentralizedMarketplaceContract.itemForSaleFromSellerExists(sellerAddress, "DummyItem_1"), false,
			"Initially, given Item IPFS Key Hash should NOT exist for the Seller!");
		assert.equal(await franklinDecentralizedMarketplaceContract.getNumberOfDifferentItemsBeingSoldBySeller(sellerAddress), 0,
			"Initial count of Items for Seller should have been 0!");
		assert.equal(await franklinDecentralizedMarketplaceContract.getNumberOfSellers(), 1,
			"Number of Sellers should be equal to the number of sellers that have beed added so far!");

		// Item for a second Seller that does not exist is added.
		await franklinDecentralizedMarketplaceContract.addItemForSale("DummyItem_1", { from: sellerAddress});
		assert.equal(await franklinDecentralizedMarketplaceContract.sellerExists.call(sellerAddress), true, "Seller should exist after adding an Item For Sale!");
		assert.equal(await franklinDecentralizedMarketplaceContract.itemForSaleFromSellerExists(sellerAddress, "DummyItem_1"), true,
			"Given Item IPFS Key Hash should now exist for the Seller after adding of the Item!");
		assert.equal(await franklinDecentralizedMarketplaceContract.getNumberOfDifferentItemsBeingSoldBySeller(sellerAddress), 1,
			"Count of Items for Seller increase by 1 when an Item that did not exist for the Seller is added!");
		assert.equal(await franklinDecentralizedMarketplaceContract.getNumberOfSellers(), 2,
			"Number of Sellers should increase by 1 after seller that did not exist is added!");
		assert.equal(await franklinDecentralizedMarketplaceContract.getSellerAddress(0), sellerAddress,
			"Seller Address should exist in 'listOfSellers' and should be able to be accessed via the appropropriate index!");
		assert.equal(await franklinDecentralizedMarketplaceContract.getItemForSale(sellerAddress, 0), "DummyItem_1",
			"Item that Seller just added should be accesible in it's 'listOfItems' at the appropriate index");

		// Adding a third seller

		sellerAddress = accounts[(randomAddressIndex + 2) % NUMBER_OF_ACCOUNTS];
		assert.equal(await franklinDecentralizedMarketplaceContract.sellerExists.call(sellerAddress), false, "Seller should initially not exist!");
		assert.equal(await franklinDecentralizedMarketplaceContract.itemForSaleFromSellerExists(sellerAddress, "DummyItem_1"), false,
			"Initially, given Item IPFS Key Hash should NOT exist for the Seller!");
		assert.equal(await franklinDecentralizedMarketplaceContract.getNumberOfDifferentItemsBeingSoldBySeller(sellerAddress), 0,
			"Initial count of Items for Seller should have been 0!");
		assert.equal(await franklinDecentralizedMarketplaceContract.getNumberOfSellers(), 2,
			"Number of Sellers should be equal to the number of sellers that have beed added so far!");

		// Item for a third Seller that does not exist is added.
		await franklinDecentralizedMarketplaceContract.addItemForSale("DummyItem_1", { from: sellerAddress});
		assert.equal(await franklinDecentralizedMarketplaceContract.sellerExists.call(sellerAddress), true, "Seller should exist after adding an Item For Sale!");
		assert.equal(await franklinDecentralizedMarketplaceContract.itemForSaleFromSellerExists(sellerAddress, "DummyItem_1"), true,
			"Given Item IPFS Key Hash should now exist for the Seller after adding of the Item!");
		assert.equal(await franklinDecentralizedMarketplaceContract.getNumberOfDifferentItemsBeingSoldBySeller(sellerAddress), 1,
			"Count of Items for Seller increase by 1 when an Item that did not exist for the Seller is added!");
		assert.equal(await franklinDecentralizedMarketplaceContract.getNumberOfSellers(), 3,
			"Number of Sellers should increase by 1 after seller that did not exist is added!");
		assert.equal(await franklinDecentralizedMarketplaceContract.getSellerAddress(0), sellerAddress,
			"Seller Address should exist in 'listOfSellers' and should be able to be accessed via the appropropriate index!");
		assert.equal(await franklinDecentralizedMarketplaceContract.getItemForSale(sellerAddress, 0), "DummyItem_1",
			"Item that Seller just added should be accesible in it's 'listOfItems' at the appropriate index");

		// Testing to see that ALL the sellers exist in the "listOfSellers" at the appropriate index
		let decrementingIndex = 2;
		for (let i = 0; i < 3; i++) {
			sellerAddress = accounts[(randomAddressIndex + i) % NUMBER_OF_ACCOUNTS];
			assert.equal(await franklinDecentralizedMarketplaceContract.getSellerAddress(decrementingIndex), sellerAddress,
				"Seller Address exists in the wrong index position of the 'listOfSellers' double-linked list!");
			decrementingIndex--;
		}
	});

	it("FranklinDecentralizedMarketplace : test addItemForSale : seller does exist - multiple Items that do no exist for a seller are added", async () => {
		let sellerAddress = accounts[randomAddressIndex];
		await franklinDecentralizedMarketplaceContract.addItemForSale("DummyItem_0", { from: sellerAddress});
		assert.equal(await franklinDecentralizedMarketplaceContract.sellerExists.call(sellerAddress),true, "Seller initially exists!");
		assert.equal(await franklinDecentralizedMarketplaceContract.itemForSaleFromSellerExists(sellerAddress, "DummyItem"), false,
			"Initially, given Item IPFS Key Hash should exist for the Seller!");
		assert.equal(await franklinDecentralizedMarketplaceContract.getNumberOfDifferentItemsBeingSoldBySeller(sellerAddress), 1,
			"Initial count of Items for Seller should have been 1!");

		// First New Item for an existing seller is added.
		let itemToAdd = "DummyItem_1"
		await franklinDecentralizedMarketplaceContract.addItemForSale(itemToAdd, { from: sellerAddress});
		assert.equal(await franklinDecentralizedMarketplaceContract.sellerExists.call(sellerAddress), true, "Seller should STILL exist after adding an Item For Sale!");
		assert.equal(await franklinDecentralizedMarketplaceContract.itemForSaleFromSellerExists(sellerAddress, itemToAdd), true,
			"Given Item IPFS Key Hash should now exist for the Seller after adding of the Item!");
		assert.equal(await franklinDecentralizedMarketplaceContract.getNumberOfDifferentItemsBeingSoldBySeller(sellerAddress), 2,
			"Count of Items for Seller should increase by 1 when an Item that did not exist for the Seller is added!");
		assert.equal(await franklinDecentralizedMarketplaceContract.getItemForSale(sellerAddress, 0), itemToAdd,
			"Item that Seller just added should be accesible in it's 'listOfItems' at the appropriate index");

		// Second New Item for an existing seller is added.
		itemToAdd = "DummyItem_2"
		await franklinDecentralizedMarketplaceContract.addItemForSale(itemToAdd, { from: sellerAddress});
		assert.equal(await franklinDecentralizedMarketplaceContract.sellerExists.call(sellerAddress), true, "Seller should STILL exist after adding an Item For Sale!");
		assert.equal(await franklinDecentralizedMarketplaceContract.itemForSaleFromSellerExists(sellerAddress, itemToAdd), true,
			"Given Item IPFS Key Hash should now exist for the Seller after adding of the Item!");
		assert.equal(await franklinDecentralizedMarketplaceContract.getNumberOfDifferentItemsBeingSoldBySeller(sellerAddress), 3,
			"Count of Items for Seller should ncrease by 1 when an Item that did not exist for the Seller is added!");
		assert.equal(await franklinDecentralizedMarketplaceContract.getItemForSale(sellerAddress, 0), itemToAdd,
			"Item that Seller just added should be accesible in it's 'listOfItems' at the appropriate index");

		// Third New Item for an existing seller is added.
		itemToAdd = "DummyItem_3"
		await franklinDecentralizedMarketplaceContract.addItemForSale(itemToAdd, { from: sellerAddress});
		assert.equal(await franklinDecentralizedMarketplaceContract.sellerExists.call(sellerAddress), true, "Seller should STILL exist after adding an Item For Sale!");
		assert.equal(await franklinDecentralizedMarketplaceContract.itemForSaleFromSellerExists(sellerAddress, itemToAdd), true,
			"Given Item IPFS Key Hash should now exist for the Seller after adding of the Item!");
		assert.equal(await franklinDecentralizedMarketplaceContract.getNumberOfDifferentItemsBeingSoldBySeller(sellerAddress), 4,
			"Count of Items for Seller should ncrease by 1 when an Item that did not exist for the Seller is added!");
		assert.equal(await franklinDecentralizedMarketplaceContract.getItemForSale(sellerAddress, 0), itemToAdd,
			"Item that Seller just added should be accesible in it's 'listOfItems' at the appropriate index");

		// Testing to see that all the Items for Sale from a Seller may be accessed at the appropriate index.
		let decrementingIndex = 3;
		for (let i = 0; i < 4; i++) {
			let itemToAccess = `DummyItem_${i}`;
			assert.equal(await franklinDecentralizedMarketplaceContract.getItemForSale(sellerAddress, decrementingIndex), itemToAccess,
				"Item exists in the wrong index position of the 'listOfItems' double-linked list of the Seller!");
			decrementingIndex--;
		}
	});

	it("FranklinDecentralizedMarketplace : test addItemForSale : verify AddItemForSaleAndPossiblySellerEvent is generated whenever an Item that does not exist for a seller is added", async () => {
		let sellerAddress = accounts[randomAddressIndex];
		let results = await franklinDecentralizedMarketplaceContract.addItemForSale("DummyItem", { from: sellerAddress});

		// Making sure that AddItemForSaleAndPossiblySellerEvent(_msgSender, _keyItemIpfsHash) fired off
		assert.equal(results.logs.length, 1, "There should have been one Event Fired Off!");
		assert.equal(results.logs[0].event, 'AddItemForSaleAndPossiblySellerEvent', "There should have been a AddItemForSaleAndPossiblySellerEvent Event Fired Off!");
		assert.ok(results.logs[0].args !== undefined, "There should have been a results.logs[0].args object!");
		assert.equal(results.logs[0].args.__length__, 2, "There should have been 2 arguments in the AddItemForSaleAndPossiblySellerEvent that Fired Off!");
		assert.equal(results.logs[0].args._msgSender, sellerAddress, "The _msgSender argument should be the Seller Address!");;
		assert.equal(results.logs[0].args._keyItemIpfsHash, "DummyItem", "The _keyItemIpfsHash argument should be IPFS Hash of Item bought!");
	});

	it("FranklinDecentralizedMarketplace : test removeItemForSale : neither the item nor the seller exist", async () => {
		let sellerAddress = accounts[randomAddressIndex];
		let itemIpfsHash = "DummyItem";
		assert.equal(await franklinDecentralizedMarketplaceContract.sellerExists.call(sellerAddress), false, "Seller should not intially exist!");
		assert.equal(await franklinDecentralizedMarketplaceContract.itemForSaleFromSellerExists(sellerAddress, itemIpfsHash), false,
			"Item for Seller should not initially exist!");

		let results = await franklinDecentralizedMarketplaceContract.removeItemForSale(itemIpfsHash, { from: sellerAddress});
		assert.equal(await franklinDecentralizedMarketplaceContract.sellerExists.call(sellerAddress), false, "Seller should continue to not exist!");
		assert.equal(await franklinDecentralizedMarketplaceContract.itemForSaleFromSellerExists(sellerAddress, itemIpfsHash), false,
			"Item for Seller should continue to not exist!");
		assert.equal(results.logs.length, 0, "There should be no events that fire off!");
	});

	it("FranklinDecentralizedMarketplace : test removeItemForSale : the seller exists but the item for the seller does not exist", async () => {
		let sellerAddress = accounts[randomAddressIndex];
		let itemIpfsHash = "DummyItem";
		await franklinDecentralizedMarketplaceContract.addItemForSale("DummyItem_2", { from: sellerAddress});
		assert.equal(await franklinDecentralizedMarketplaceContract.sellerExists.call(sellerAddress), true, "Seller should intially exist!");
		assert.equal(await franklinDecentralizedMarketplaceContract.itemForSaleFromSellerExists(sellerAddress, itemIpfsHash), false,
			"Item for Seller should not initially exist!");

		let results = await franklinDecentralizedMarketplaceContract.removeItemForSale(itemIpfsHash, { from: sellerAddress });
		assert.equal(await franklinDecentralizedMarketplaceContract.sellerExists.call(sellerAddress), true, "Seller should continue to exist!");
		assert.equal(await franklinDecentralizedMarketplaceContract.itemForSaleFromSellerExists(sellerAddress, itemIpfsHash), false,
			"Item for Seller should continue to not exist!");
		assert.equal(results.logs.length, 0, "There should be no events that fire off!");
	});

	it("FranklinDecentralizedMarketplace : test removeItemForSale : the seller does not exist but the item for the seller exists with another seller", async () => {
		let sellerAddress = accounts[randomAddressIndex];
		let anotherSellerAddress = accounts[(randomAddressIndex + 1) % NUMBER_OF_ACCOUNTS];
		let itemIpfsHash = "DummyItem";

		await franklinDecentralizedMarketplaceContract.addItemForSale(itemIpfsHash, { from: anotherSellerAddress });
		assert.equal(await franklinDecentralizedMarketplaceContract.sellerExists.call(sellerAddress), false, "Seller should intially not exist!");
		assert.equal(await franklinDecentralizedMarketplaceContract.itemForSaleFromSellerExists(sellerAddress, itemIpfsHash), false,
			"Item for Seller should not initially exist!");
		assert.equal(await franklinDecentralizedMarketplaceContract.sellerExists.call(anotherSellerAddress), true, "The other seller intially exist!");
		assert.equal(await franklinDecentralizedMarketplaceContract.itemForSaleFromSellerExists(anotherSellerAddress, itemIpfsHash), true,
			"Item for other Seller should initially exist!");

		let results = await franklinDecentralizedMarketplaceContract.removeItemForSale(itemIpfsHash, { from: sellerAddress });
		assert.equal(await franklinDecentralizedMarketplaceContract.sellerExists.call(sellerAddress), false, "Seller should continue to not exist!");
		assert.equal(await franklinDecentralizedMarketplaceContract.itemForSaleFromSellerExists(sellerAddress, itemIpfsHash), false,
			"Item for Seller should continue to not exist!");
		assert.equal(await franklinDecentralizedMarketplaceContract.sellerExists.call(anotherSellerAddress), true, "The other seller should continue to exist!");
		assert.equal(await franklinDecentralizedMarketplaceContract.itemForSaleFromSellerExists(anotherSellerAddress, itemIpfsHash), true,
			"Item for other Seller should continue to exist!");
		assert.equal(results.logs.length, 0, "There should be no events that fire off!");
	});

	it("FranklinDecentralizedMarketplace : test removeItemForSale : both the seller and the item for the seller exists - seller has only one item for sale", async () => {
		let sellerAddress = accounts[randomAddressIndex];
		let itemIpfsHash = "DummyItem";

		await franklinDecentralizedMarketplaceContract.addItemForSale(itemIpfsHash, { from: sellerAddress });
		assert.equal(await franklinDecentralizedMarketplaceContract.sellerExists.call(sellerAddress), true, "Seller should intially exist!");
		assert.equal(await franklinDecentralizedMarketplaceContract.itemForSaleFromSellerExists(sellerAddress, itemIpfsHash), true,
			"Item for Seller should initially exist!");

		let results = await franklinDecentralizedMarketplaceContract.removeItemForSale(itemIpfsHash, { from: sellerAddress });
		assert.equal(await franklinDecentralizedMarketplaceContract.sellerExists.call(sellerAddress), false, "Seller should not exist after having it's last item removed!");
		assert.equal(await franklinDecentralizedMarketplaceContract.itemForSaleFromSellerExists(sellerAddress, itemIpfsHash), false,
			"Item for Seller should afterwards not exist!");

		assert.equal(results.logs.length, 1, "There should have been one Event Fired Off!");
		assert.equal(results.logs[0].event, 'RemoveItemForSaleAndPossibleSellerEvent',
			"There should have been a RemoveItemForSaleAndPossibleSellerEvent Event Fired Off!");
		assert.ok(results.logs[0].args !== undefined, "There should have been a results.logs[0].args object!");
		assert.equal(results.logs[0].args.__length__, 2, "There should have been 2 arguments in the RemoveItemForSaleAndPossibleSellerEvent that Fired Off!");
		assert.equal(results.logs[0].args._msgSender, sellerAddress, "The _msgSender argument should be the Seller Address!");;
		assert.equal(results.logs[0].args._keyItemIpfsHash, itemIpfsHash, "The _keyItemIpfsHash argument should be IPFS Hash of Item removed!");
	});

	it("FranklinDecentralizedMarketplace : test removeItemForSale : both the seller and the item for the seller exists - seller has more than one item type for sale", async () => {
		let sellerAddress = accounts[randomAddressIndex];
		let itemIpfsHashToRemove = "DummyItem";
		let itemIpfsHashToRemain = "DummyItemToRemain"

		await franklinDecentralizedMarketplaceContract.addItemForSale(itemIpfsHashToRemove, { from: sellerAddress });
		await franklinDecentralizedMarketplaceContract.addItemForSale(itemIpfsHashToRemain, { from: sellerAddress });
		assert.equal(await franklinDecentralizedMarketplaceContract.sellerExists.call(sellerAddress), true, "Seller should intially exist!");
		assert.equal(await franklinDecentralizedMarketplaceContract.itemForSaleFromSellerExists(sellerAddress, itemIpfsHashToRemove), true,
			"Item for Seller to be removed should initially exist!");
		assert.equal(await franklinDecentralizedMarketplaceContract.itemForSaleFromSellerExists(sellerAddress, itemIpfsHashToRemain), true,
			"Item for Seller to remain should initially exist!");

		let results = await franklinDecentralizedMarketplaceContract.removeItemForSale(itemIpfsHashToRemove, { from: sellerAddress });
		assert.equal(await franklinDecentralizedMarketplaceContract.sellerExists.call(sellerAddress), true,
			"Seller should continue to exist due to still having items to sell!");
		assert.equal(await franklinDecentralizedMarketplaceContract.itemForSaleFromSellerExists(sellerAddress, itemIpfsHashToRemove), false,
			"Item for Seller that was to be removed should afterwards not exist for seller!");
		assert.equal(await franklinDecentralizedMarketplaceContract.itemForSaleFromSellerExists(sellerAddress, itemIpfsHashToRemain), true,
			"Item for Seller that was to remain should afterwards continue to exist for the seller!");

		assert.equal(results.logs.length, 1, "There should have been one Event Fired Off!");
		assert.equal(results.logs[0].event, 'RemoveItemForSaleAndPossibleSellerEvent',
			"There should have been a RemoveItemForSaleAndPossibleSellerEvent Event Fired Off!");
		assert.ok(results.logs[0].args !== undefined, "There should have been a results.logs[0].args object!");
		assert.equal(results.logs[0].args.__length__, 2, "There should have been 2 arguments in the RemoveItemForSaleAndPossibleSellerEvent that Fired Off!");
		assert.equal(results.logs[0].args._msgSender, sellerAddress, "The _msgSender argument should be the Seller Address!");;
		assert.equal(results.logs[0].args._keyItemIpfsHash, itemIpfsHashToRemove, "The _keyItemIpfsHash argument should be IPFS Hash of Item removed!");
	});

	it("FranklinDecentralizedMarketplace : test removeItemForSale : both seller and item for seller exists - seller has three items for sale - make sure that other items still exist after removal of one of them and can be properly accessed", async () => {
		let sellerAddress = accounts[randomAddressIndex];
		let itemIpfsBaseHash = "DummyItem";

		for (let i = 0; i < 3; i++) {
			let itemIpfsHash = `${itemIpfsBaseHash}_${i}`;
			await franklinDecentralizedMarketplaceContract.addItemForSale(itemIpfsHash, { from: sellerAddress });
		}

		assert.equal(await franklinDecentralizedMarketplaceContract.sellerExists.call(sellerAddress), true, "Seller should intially exist!");
		assert.equal(await franklinDecentralizedMarketplaceContract.getNumberOfDifferentItemsBeingSoldBySeller(sellerAddress), 3,
			"Seller should intially have three different item types to sell!");

		// Items for Seller should initially exist and be accessed via the correct index.
		let decrementingIndex = 2;
		for (let i = 0; i < 3; i++) {
			let itemIpfsHash = `${itemIpfsBaseHash}_${i}`;
			assert.equal(await franklinDecentralizedMarketplaceContract.itemForSaleFromSellerExists(sellerAddress, itemIpfsHash), true,
				`Item ${itemIpfsHash} for Seller should initially exist!`);
			assert.equal(await franklinDecentralizedMarketplaceContract.getItemForSale(sellerAddress, decrementingIndex), itemIpfsHash,
				`Item ${itemIpfsHash} should have been able to be accessed via index number ${decrementingIndex}!`);
			decrementingIndex--;
		}

		let itemIpfsHashToBeRemoved = `${itemIpfsBaseHash}_1`;
		let results = await franklinDecentralizedMarketplaceContract.removeItemForSale(itemIpfsHashToBeRemoved, { from: sellerAddress });
		assert.equal(await franklinDecentralizedMarketplaceContract.sellerExists.call(sellerAddress), true,
			"Seller should continue to exist due to still having items for sale!");
		assert.equal(await franklinDecentralizedMarketplaceContract.itemForSaleFromSellerExists(sellerAddress, itemIpfsHashToBeRemoved), false,
			`Item ${itemIpfsHashToBeRemoved} for Seller should not continue to exist in seller's list!`);
		assert.equal(await franklinDecentralizedMarketplaceContract.getNumberOfDifferentItemsBeingSoldBySeller(sellerAddress), 2,
			"Seller should now have two different item types to sell!");

		// The other items in the list should continue to exist as part of the seller's list of items to sell.
		assert.equal(await franklinDecentralizedMarketplaceContract.itemForSaleFromSellerExists(sellerAddress, `${itemIpfsBaseHash}_0`), true,
				`Item ${itemIpfsBaseHash}_0 for Seller should continue to exist!`);
		assert.equal(await franklinDecentralizedMarketplaceContract.itemForSaleFromSellerExists(sellerAddress, `${itemIpfsBaseHash}_2`), true,
				`Item ${itemIpfsBaseHash}_2 for Seller should continue to exist!`);
		assert.equal(await franklinDecentralizedMarketplaceContract.getItemForSale(sellerAddress, 0), `${itemIpfsBaseHash}_2`,
				`Item ${itemIpfsBaseHash}_2 should have been able to be accessed via index number 0!`);
		assert.equal(await franklinDecentralizedMarketplaceContract.getItemForSale(sellerAddress, 1), `${itemIpfsBaseHash}_0`,
				`Item ${itemIpfsBaseHash}_0 should have been able to be accessed via index number 1!`);

		assert.equal(results.logs.length, 1, "There should have been one Event Fired Off!");
		assert.equal(results.logs[0].event, 'RemoveItemForSaleAndPossibleSellerEvent',
			"There should have been a RemoveItemForSaleAndPossibleSellerEvent Event Fired Off!");
		assert.ok(results.logs[0].args !== undefined, "There should have been a results.logs[0].args object!");
		assert.equal(results.logs[0].args.__length__, 2, "There should have been 2 arguments in the RemoveItemForSaleAndPossibleSellerEvent that Fired Off!");
		assert.equal(results.logs[0].args._msgSender, sellerAddress, "The _msgSender argument should be the Seller Address!");;
		assert.equal(results.logs[0].args._keyItemIpfsHash, itemIpfsHashToBeRemoved, "The _keyItemIpfsHash argument should be IPFS Hash of Item removed!");
	});

	it("FranklinDecentralizedMarketplace : test removeItemForSale : both seller and item for seller exists with a non-zero quantity available for sale of item to be removed", async () => {
		let sellerAddress = accounts[randomAddressIndex];
		let itemIpfsHash = "DummyItem";

		await franklinDecentralizedMarketplaceContract.addItemForSale(itemIpfsHash, { from: sellerAddress });
		await franklinDecentralizedMarketplaceContract.setQuantityAvailableForSaleOfAnItem(itemIpfsHash, 10, { from: sellerAddress });
		assert.equal(await franklinDecentralizedMarketplaceContract.itemForSaleFromSellerExists(sellerAddress, itemIpfsHash), true,
			"Item for Seller should initially exist!");
		assert.equal(await franklinDecentralizedMarketplaceContract.getQuantityAvailableForSaleOfAnItemBySeller(sellerAddress, itemIpfsHash), 10,
			"Item for Seller should have the correct intially set amount of quantity for sale of the item!");

		let results = await franklinDecentralizedMarketplaceContract.removeItemForSale(itemIpfsHash, { from: sellerAddress });
		assert.equal(await franklinDecentralizedMarketplaceContract.itemForSaleFromSellerExists(sellerAddress, itemIpfsHash), false,
			"Item for Seller should afterwards not exist!");

		try {
			await franklinDecentralizedMarketplaceContract.getQuantityAvailableForSaleOfAnItemBySeller(sellerAddress, itemIpfsHash);
			assert.fail("Should not be able to get the Quantity available for sale of an Item when input _keyItemIpfsHash for seller does not exist!");
		} catch (error) {
			assert.ok(/revert/.test(error.message), "String 'revert' not present in error message!");
			assert.ok(/Given IPFS Hash of Item is not listed as an Item For Sale from the Seller!/.test(error.message),
				"Appropriate error message not returned!");
		}

		assert.equal(results.logs.length, 1, "There should have been one Event Fired Off!");
		assert.equal(results.logs[0].event, 'RemoveItemForSaleAndPossibleSellerEvent',
			"There should have been a RemoveItemForSaleAndPossibleSellerEvent Event Fired Off!");
		assert.ok(results.logs[0].args !== undefined, "There should have been a results.logs[0].args object!");
		assert.equal(results.logs[0].args.__length__, 2, "There should have been 2 arguments in the RemoveItemForSaleAndPossibleSellerEvent that Fired Off!");
		assert.equal(results.logs[0].args._msgSender, sellerAddress, "The _msgSender argument should be the Seller Address!");;
		assert.equal(results.logs[0].args._keyItemIpfsHash, itemIpfsHash, "The _keyItemIpfsHash argument should be IPFS Hash of Item removed!");
	});

	it("FranklinDecentralizedMarketplace : test removeItemForSale : both seller and item for seller exists with a non-zero price available for sale of item to be removed", async () => {
		let sellerAddress = accounts[randomAddressIndex];
		let itemIpfsHash = "DummyItem";

		await franklinDecentralizedMarketplaceContract.addItemForSale(itemIpfsHash, { from: sellerAddress });
		await franklinDecentralizedMarketplaceContract.setPriceOfItem(itemIpfsHash, 100, { from: sellerAddress });
		assert.equal(await franklinDecentralizedMarketplaceContract.itemForSaleFromSellerExists(sellerAddress, itemIpfsHash), true,
			"Item for Seller should initially exist!");
		assert.equal(await franklinDecentralizedMarketplaceContract.getPriceOfItem(sellerAddress, itemIpfsHash), 100,
			"Item for Seller should have the correct initial price for sale of the item!");

		let results = await franklinDecentralizedMarketplaceContract.removeItemForSale(itemIpfsHash, { from: sellerAddress });
		assert.equal(await franklinDecentralizedMarketplaceContract.itemForSaleFromSellerExists(sellerAddress, itemIpfsHash), false,
			"Item for Seller should afterwards not exist!");

		try {
			await franklinDecentralizedMarketplaceContract.getPriceOfItem(accounts[randomAddressIndex], itemIpfsHash);
			assert.fail("Should not be able to get the Price of an Item when input _keyItemIpfsHash for seller does not exist!");
		} catch (error) {
			assert.ok(/revert/.test(error.message), "String 'revert' not present in error message!");
			assert.ok(/Given IPFS Hash of Item is not listed as an Item For Sale from the Seller!/.test(error.message),
				"Appropriate error message not returned!");
		}

		assert.equal(results.logs.length, 1, "There should have been one Event Fired Off!");
		assert.equal(results.logs[0].event, 'RemoveItemForSaleAndPossibleSellerEvent',
			"There should have been a RemoveItemForSaleAndPossibleSellerEvent Event Fired Off!");
		assert.ok(results.logs[0].args !== undefined, "There should have been a results.logs[0].args object!");
		assert.equal(results.logs[0].args.__length__, 2, "There should have been 2 arguments in the RemoveItemForSaleAndPossibleSellerEvent that Fired Off!");
		assert.equal(results.logs[0].args._msgSender, sellerAddress, "The _msgSender argument should be the Seller Address!");;
		assert.equal(results.logs[0].args._keyItemIpfsHash, itemIpfsHash, "The _keyItemIpfsHash argument should be IPFS Hash of Item removed!");
	});

	it("FranklinDecentralizedMarketplace : test getNumberOfDifferentItemsBeingSoldBySeller : seller exists - just added", async () => {
		let sellerAddress = accounts[randomAddressIndex];

		assert.equal(await franklinDecentralizedMarketplaceContract.sellerExists.call(sellerAddress), false, "Seller does not exist!");
		assert.equal(await franklinDecentralizedMarketplaceContract.getNumberOfDifferentItemsBeingSoldBySeller(sellerAddress), 0,
			"Seller that does not exist should have zero different items to sell!");
	});

	it("FranklinDecentralizedMarketplace : test getNumberOfDifferentItemsBeingSoldBySeller : seller exists - just added", async () => {
		let sellerAddress = accounts[randomAddressIndex];
		let itemIpfsHash = "DummyItem";

		await franklinDecentralizedMarketplaceContract.addItemForSale(itemIpfsHash, { from: sellerAddress });

		assert.equal(await franklinDecentralizedMarketplaceContract.sellerExists.call(sellerAddress), true, "Seller should intially exist!");
		assert.equal(await franklinDecentralizedMarketplaceContract.getNumberOfDifferentItemsBeingSoldBySeller(sellerAddress), 1,
			"Seller that just existed should have 1 item type to sell!");
	});

	it("FranklinDecentralizedMarketplace : test getNumberOfDifferentItemsBeingSoldBySeller : seller exists with just one item to sell", async () => {
		let sellerAddress = accounts[randomAddressIndex];

		assert.equal(await franklinDecentralizedMarketplaceContract.sellerExists.call(sellerAddress), false, "Seller should not intially exist!");
		assert.equal(await franklinDecentralizedMarketplaceContract.getNumberOfDifferentItemsBeingSoldBySeller(sellerAddress), 0,
			"Seller that does not exist should have zero different items for sale!");

		await franklinDecentralizedMarketplaceContract.addItemForSale("DummyItem", { from: sellerAddress });
		assert.equal(await franklinDecentralizedMarketplaceContract.getNumberOfDifferentItemsBeingSoldBySeller(sellerAddress), 1,
			"Seller should have just one item type to sell!");
	});

	it("FranklinDecentralizedMarketplace : test getNumberOfDifferentItemsBeingSoldBySeller : seller initially does not exist - different scenarios of adding and removing items for a seller", async () => {
		let sellerAddress = accounts[randomAddressIndex];
		let itemIpfsHashBase = "DummyItem";

		assert.equal(await franklinDecentralizedMarketplaceContract.sellerExists.call(sellerAddress), false, "Seller should not intially exist!");
		assert.equal(await franklinDecentralizedMarketplaceContract.getNumberOfDifferentItemsBeingSoldBySeller(sellerAddress), 0,
			"Seller that does not exist should have zero different items for sale!");

		await franklinDecentralizedMarketplaceContract.addItemForSale(itemIpfsHashBase, { from: sellerAddress });
		assert.equal(await franklinDecentralizedMarketplaceContract.getNumberOfDifferentItemsBeingSoldBySeller(sellerAddress), 1,
			"Seller should have 1 item type to sell after just being added!");
		assert.equal(await franklinDecentralizedMarketplaceContract.sellerExists.call(sellerAddress), true,
			"Seller should exist as long as seller has at least one item type to sell!");

		await franklinDecentralizedMarketplaceContract.removeItemForSale(itemIpfsHashBase, { from: sellerAddress });
		assert.equal(await franklinDecentralizedMarketplaceContract.getNumberOfDifferentItemsBeingSoldBySeller(sellerAddress), 0,
			"Seller should have zero different types of items to sell if the lasr remaining one was removed!");
		assert.equal(await franklinDecentralizedMarketplaceContract.sellerExists.call(sellerAddress), false,
			"Seller should not exist when seller has 0 different items to sell!");

		await franklinDecentralizedMarketplaceContract.removeSeller({ from: sellerAddress });
		assert.equal(await franklinDecentralizedMarketplaceContract.getNumberOfDifferentItemsBeingSoldBySeller(sellerAddress), 0,
			"Seller that's been removed should have zero different types of items to sell!");
		assert.equal(await franklinDecentralizedMarketplaceContract.sellerExists.call(sellerAddress), false,
			"Seller should not exist when seller has 0 different items to sell!");

		// Add items to seller
		for (let i = 0; i < 4; i++) {
			let itemIpfsHash = `${itemIpfsHashBase}_${i}`;
			await franklinDecentralizedMarketplaceContract.addItemForSale(itemIpfsHash, { from: sellerAddress });
			assert.equal(await franklinDecentralizedMarketplaceContract.getNumberOfDifferentItemsBeingSoldBySeller(sellerAddress), (i + 1),
				`Seller should now have ${i + 1} different types of items to sell after adding this item for sale!`);
			assert.equal(await franklinDecentralizedMarketplaceContract.sellerExists.call(sellerAddress), true,
				"Seller should exist as long as seller has at least one item type to sell!");
		}

		await franklinDecentralizedMarketplaceContract.removeSeller({ from: sellerAddress });
		assert.equal(await franklinDecentralizedMarketplaceContract.getNumberOfDifferentItemsBeingSoldBySeller(sellerAddress), 0,
			"Seller that's been removed should have zero different types of items to sell!");
		assert.equal(await franklinDecentralizedMarketplaceContract.sellerExists.call(sellerAddress), false,
			"Seller should not exist when seller has 0 different items to sell!");


		// Add items to seller
		for (let i = 0; i < 4; i++) {
			let itemIpfsHash = `${itemIpfsHashBase}_${i}`;
			await franklinDecentralizedMarketplaceContract.addItemForSale(itemIpfsHash, { from: sellerAddress });
			assert.equal(await franklinDecentralizedMarketplaceContract.getNumberOfDifferentItemsBeingSoldBySeller(sellerAddress), (i + 1),
				"Seller should now have ${i + 1} different types of items to sell after adding this item for sale!!");
			assert.equal(await franklinDecentralizedMarketplaceContract.sellerExists.call(sellerAddress), true,
				"Seller should exist as long as seller has at least one item type to sell!");
		}

		// Delete items from seller one at a time
		let decrementingCounter = 4;
		for (let i = 0; i < 4; i++) {
			let itemIpfsHash = `${itemIpfsHashBase}_${i}`;
			await franklinDecentralizedMarketplaceContract.removeItemForSale(itemIpfsHash, { from: sellerAddress });
			decrementingCounter--;

			assert.equal(await franklinDecentralizedMarketplaceContract.getNumberOfDifferentItemsBeingSoldBySeller(sellerAddress), decrementingCounter,
				`Seller should now have ${decrementingCounter} different types of items to sell after removing the ${itemIpfsHash} item for sale!`);
			if (decrementingCounter > 0) {
				assert.equal(await franklinDecentralizedMarketplaceContract.sellerExists.call(sellerAddress), true,
					"Seller should exist as long as seller has 1 or more diferent items to sell!");
			}
			else {
				assert.equal(await franklinDecentralizedMarketplaceContract.sellerExists.call(sellerAddress), false,
					"Seller should not exist when seller has 0 different items to sell!");
			}
		}
	});

	it("FranklinDecentralizedMarketplace : test itemForSaleFromSellerExists : seller does not exist", async () => {
		let sellerAddress = accounts[randomAddressIndex];
		let itemIpfsHash = "DummyItem";

		assert.equal(await franklinDecentralizedMarketplaceContract.sellerExists.call(sellerAddress), false, "Seller should not exist!");
		assert.equal(await franklinDecentralizedMarketplaceContract.itemForSaleFromSellerExists(sellerAddress, itemIpfsHash), false,
			"Seller that does not exist should also have no items ro sell that exist!");
	});

	it("FranklinDecentralizedMarketplace : test itemForSaleFromSellerExists : seller exists but item type in question does not exist for the seller", async () => {
		let sellerAddress = accounts[randomAddressIndex];
		let itemIpfsHash = "DummyItem";

		await franklinDecentralizedMarketplaceContract.addItemForSale("DummyItem_Exists", { from: sellerAddress });
		assert.equal(await franklinDecentralizedMarketplaceContract.sellerExists.call(sellerAddress), true,
			"Seller that has at leat one item type to sell should always exist!");
		assert.equal(await franklinDecentralizedMarketplaceContract.itemForSaleFromSellerExists(sellerAddress, itemIpfsHash), false,
			`Seller does not have the ${itemIpfsHash} Item Type in question!`);
	});

	it("FranklinDecentralizedMarketplace : test itemForSaleFromSellerExists : seller exists and item type in question does exist for the seller", async () => {
		let sellerAddress = accounts[randomAddressIndex];
		let itemIpfsHash = "DummyItem";

		await franklinDecentralizedMarketplaceContract.addItemForSale("DummyItem_Exists", { from: sellerAddress });
		await franklinDecentralizedMarketplaceContract.addItemForSale(itemIpfsHash, { from: sellerAddress });
		assert.equal(await franklinDecentralizedMarketplaceContract.sellerExists.call(sellerAddress), true,
			"Seller that has at leat one item type to sell should always exist!");
		assert.equal(await franklinDecentralizedMarketplaceContract.itemForSaleFromSellerExists(sellerAddress, itemIpfsHash), true,
			`Seller does have the ${itemIpfsHash} Item Type in question!`);
	});

	it("FranklinDecentralizedMarketplace : test getItemForSale : seller does not exist", async () => {
		let sellerAddress = accounts[randomAddressIndex];

		assert.equal(await franklinDecentralizedMarketplaceContract.sellerExists.call(sellerAddress), false, "Seller does not exist!");
		assert.equal(await franklinDecentralizedMarketplaceContract.getNumberOfDifferentItemsBeingSoldBySeller(sellerAddress), 0,
			"Seller that does not exist should have zero different items to sell!");

		// No matter what index one tries for a seller that does not exist, it will always return back an empty string
		for (let i = 0; i < 10; i++) {
			assert.equal(await franklinDecentralizedMarketplaceContract.getItemForSale(sellerAddress, i), EMPTY_STRING,
				"Seller that does not exist should always return back an EMPTY_STRING in this case!");
		}
	});

	it("FranklinDecentralizedMarketplace : test getItemForSale : seller exists but index given is greater than or equal to the number of diferent types of items the seller is selling", async () => {
		let sellerAddress = accounts[randomAddressIndex];
		let itemIpfsHashBase = "DummyItem";

		for (let i = 0; i < 5; i++) {
			let itemIpfsHash = `${itemIpfsHashBase}_${i}`;

			assert.equal(await franklinDecentralizedMarketplaceContract.getItemForSale(sellerAddress, i), EMPTY_STRING,
				"Should return back empty string due to index ${i} being greater then or equal to the number of different items the seller has to sell!");
			await franklinDecentralizedMarketplaceContract.addItemForSale(itemIpfsHash, { from: sellerAddress });
			assert.equal(await franklinDecentralizedMarketplaceContract.getItemForSale(sellerAddress, (i + 1)), EMPTY_STRING,
				"Should return back empty string due to index ${i + 1} being greater then or equal to the number of different items the seller has to sell!");
		}
	});

	it("FranklinDecentralizedMarketplace : test getItemForSale : seller exists and index given is less the number of diferent types of items the seller is selling", async () => {
		let sellerAddress = accounts[randomAddressIndex];
		let itemIpfsHashBase = "DummyItem";

		for (let i = 0; i < 5; i++) {
			let itemIpfsHash = `${itemIpfsHashBase}_${i}`;

			await franklinDecentralizedMarketplaceContract.addItemForSale(itemIpfsHash, { from: sellerAddress });
			assert.equal(await franklinDecentralizedMarketplaceContract.getItemForSale(sellerAddress, 0), itemIpfsHash,
				"Item Type just added is always added in the 0'th index position!");
		}

		assert.equal(await franklinDecentralizedMarketplaceContract.getNumberOfDifferentItemsBeingSoldBySeller(sellerAddress), 5,
			"Five items were added so 5 should be the number of different item types the seller is selling!");

		// Make sure that all the items added are in the correct index postion.
		let decrementingIndex = 4;
		for (let i = 0; i < 5; i++) {
			let itemIpfsHash = `${itemIpfsHashBase}_${i}`;

			assert.equal(await franklinDecentralizedMarketplaceContract.getItemForSale(sellerAddress, decrementingIndex), itemIpfsHash,
				`The ${itemIpfsHash} Item Type should be accessible via index number ${decrementingIndex}!`);
			decrementingIndex--;
		}
	});

	// Begin Unit Testing of FranklinDecentralizedMarketplaceMediation Smart Contract

	it("FranklinDecentralizedMarketplaceMediation : test constructor - sets appropriate contract owner", async () => {
		assert.equal(await franklinDecentralizedMarketplaceMediationContract.contractOwner.call(), accounts[0],
			"Contract Owner not properly set!");
	});

	it("FranklinDecentralizedMarketplaceMediation : test constructor - franklinDecentralizedMarketplaceContract data member should initially be set to EMPTY_ADDRESS", async () => {
		let franklinDecentralizedMarketplaceMediationContractTemp = await FranklinDecentralizedMarketplaceMediation.new({from: accounts[randomAddressIndex]});
		assert.equal(await franklinDecentralizedMarketplaceMediationContractTemp.franklinDecentralizedMarketplaceContract.call(), EMPTY_ADDRESS,
			`The franklinDecentralizedMarketplaceContract data member not initially set to ${EMPTY_ADDRESS}!`);
	});


	it("FranklinDecentralizedMarketplaceMediation : test constructor - franklinDecentralizedMarketplaceContractHasBeenSet data member should initially be set to false", async () => {
		let franklinDecentralizedMarketplaceMediationContractTemp = await FranklinDecentralizedMarketplaceMediation.new({from: accounts[randomAddressIndex]});
		assert.equal(await franklinDecentralizedMarketplaceMediationContractTemp.franklinDecentralizedMarketplaceContractHasBeenSet.call(), false,
			`The franklinDecentralizedMarketplaceContractHasBeenSet data member not initially set to boolean false!`);
	});


	it("FranklinDecentralizedMarketplaceMediation : test setFranklinDecentralizedMarketplaceContract method - only Contract Owner may execute", async () => {
		try {
			await franklinDecentralizedMarketplaceMediationContract.setFranklinDecentralizedMarketplaceContract(
				franklinDecentralizedMarketplaceContract.address, {from: accounts[1]});
			assert.fail("Only Contract Owner may execute this method!");
		} catch (error) {
			assert.ok(/revert/.test(error.message), "String 'revert' not present in error message!");
			assert.ok(/This method may only be executed by the Contract Owner/.test(error.message),
				"Appropriate error message not returned!");
		}
	});


	it("FranklinDecentralizedMarketplaceMediation : test setFranklinDecentralizedMarketplaceContract method - franklinDecentralizedMarketplaceContract contract reference may only be set once", async () => {
		try {
			await franklinDecentralizedMarketplaceMediationContract.setFranklinDecentralizedMarketplaceContract(
				franklinDecentralizedMarketplaceContract.address, {from: accounts[0]});
			assert.fail("The franklinDecentralizedMarketplaceContract contract reference may only be set once!");
		} catch (error) {
			assert.ok(/revert/.test(error.message), "String 'revert' not present in error message!");
			assert.ok(/The franklinDecentralizedMarketplaceContract reference has already been set!/.test(error.message),
				"Appropriate error message not returned!");
		}
	});

	it("FranklinDecentralizedMarketplaceMediation : test setFranklinDecentralizedMarketplaceContract method - must be same Contract Owner in both FranklinDecentralizedMarketplace and FranklinDecentralizedMarketplaceMediation contracts", async () => {
		let franklinDecentralizedMarketplaceMediationContractTemp = await FranklinDecentralizedMarketplaceMediation.new({from: accounts[1]});
		try {
			await franklinDecentralizedMarketplaceMediationContractTemp.setFranklinDecentralizedMarketplaceContract(
				franklinDecentralizedMarketplaceContract.address, {from: accounts[1]});
			assert.fail("Must be same Contract Owner in both the FranklinDecentralizedMarketplace and FranklinDecentralizedMarketplaceMediation contracts!");
		} catch (error) {
			assert.ok(/revert/.test(error.message), "String 'revert' not present in error message!");
			assert.ok(/Must be same Contract Owner in both the FranklinDecentralizedMarketplace and FranklinDecentralizedMarketplaceMediation contracts!/.test(error.message),
				"Appropriate error message not returned!");
		}
	});

	it("FranklinDecentralizedMarketplaceMediation : test setFranklinDecentralizedMarketplaceContract method - if require statements pass, check that appropriate variables properly set", async () => {
		let franklinDecentralizedMarketplaceMediationContract_franklinDecentralizedMarketplaceContract_contractAddress = await franklinDecentralizedMarketplaceMediationContract.franklinDecentralizedMarketplaceContract.call();
		assert.equal(franklinDecentralizedMarketplaceMediationContract_franklinDecentralizedMarketplaceContract_contractAddress, franklinDecentralizedMarketplaceContract.address,
			"The franklinDecentralizedMarketplaceContract data member not properly set!");
		assert.equal(await franklinDecentralizedMarketplaceMediationContract.franklinDecentralizedMarketplaceContractHasBeenSet.call(), true,
			"The franklinDecentralizedMarketplaceContractHasBeenSet data member not properly set to boolean true!");
	});

	it("FranklinDecentralizedMarketplaceMediation : test addOrUpdateMediator method - input _mediatorIpfsHashDescription is an EMPTY_STRING", async () => {
		try {
			await franklinDecentralizedMarketplaceMediationContract.addOrUpdateMediator(EMPTY_STRING, {from: accounts[randomAddressIndex]});
			assert.fail("Cannot have an empty String for the IPFS Hash Key Description of a Mediator!");
		} catch (error) {
			assert.ok(/revert/.test(error.message), "String 'revert' not present in error message!");
			assert.ok(/Cannot have an empty String for the IPFS Hash Key Description of a Mediator!/.test(error.message),
				"Appropriate error message not returned!");
		}
	});

	it("FranklinDecentralizedMarketplaceMediation : test addOrUpdateMediator method - msg.sender is NOT an existing Mediator and input _mediatorIpfsHashDescription is not an existing description for msg.sender", async () => {
		let mediatorAddress = accounts[randomAddressIndex];
		assert.equal(await franklinDecentralizedMarketplaceMediationContract.mediatorExists.call(mediatorAddress), false,
			`Ethereum Address ${mediatorAddress} should not initially exist as a Mediator!`);
		assert.equal(await franklinDecentralizedMarketplaceMediationContract.descriptionInfoAboutMediators.call(mediatorAddress), EMPTY_STRING,
			`Ethereum Address ${mediatorAddress} should initially have a Mediator Description Info of EMPTY_STRING!`);
		assert.equal(await franklinDecentralizedMarketplaceMediationContract.numberOfMediators.call(), 0,
			"Number of Mediators should initially be zero!");

		try {
			await franklinDecentralizedMarketplaceMediationContract.getMediatorAddress.call(0);
			assert.fail(`Mediator Address ${mediatorAddress} should initially NOT be able to be accessed in the 'listOfMediators' double-linked list under index 0!`);
		} catch (error) {
			assert.ok(/revert/.test(error.message), "String 'revert' not present in error message!");
			assert.ok(/Index value given is greater than or equal to the Number of Mediators! It should be less than the Number of Mediators!/.test(error.message),
				"Appropriate error message not returned!");
		}

		let mediatorIpfsHashDescription = "Dummy_Mediator_Description";
		await franklinDecentralizedMarketplaceMediationContract.addOrUpdateMediator(mediatorIpfsHashDescription, {from: mediatorAddress});
		assert.equal(await franklinDecentralizedMarketplaceMediationContract.mediatorExists.call(mediatorAddress), true,
			`Ethereum Address ${mediatorAddress} should now exist as a Mediator!`);
		assert.equal(await franklinDecentralizedMarketplaceMediationContract.descriptionInfoAboutMediators.call(mediatorAddress), mediatorIpfsHashDescription,
			`Ethereum Address ${mediatorAddress} should now have a Mediator Description Info of ${mediatorIpfsHashDescription}!`);
		assert.equal(await franklinDecentralizedMarketplaceMediationContract.numberOfMediators.call(), 1,
			"Number of Mediators should now be one!");
		assert.equal(await franklinDecentralizedMarketplaceMediationContract.getMediatorAddress.call(0), mediatorAddress,
			`Mediator Address ${mediatorAddress} should be able to be accessed in the 'listOfMediators' double-linked list under index 0!`);
	});

	it("FranklinDecentralizedMarketplaceMediation : test addOrUpdateMediator method - msg.sender is NOT an existing Mediator and input _mediatorIpfsHashDescription IS an existing description for msg.sender", async () => {
		let mediatorAddress = accounts[randomAddressIndex];
		let mediatorIpfsHashDescription = "Dummy_Mediator_Description";
		await franklinDecentralizedMarketplaceMediationContract.addOrUpdateMediator(mediatorIpfsHashDescription, {from: mediatorAddress});
		await franklinDecentralizedMarketplaceMediationContract.removeMediator({from: mediatorAddress});

		assert.equal(await franklinDecentralizedMarketplaceMediationContract.mediatorExists.call(mediatorAddress), false,
			`Ethereum Address ${mediatorAddress} should not initially exist as a Mediator!`);
		assert.equal(await franklinDecentralizedMarketplaceMediationContract.descriptionInfoAboutMediators.call(mediatorAddress), mediatorIpfsHashDescription,
			`Ethereum Address ${mediatorAddress} should initially have a Mediator Description Info of ${mediatorIpfsHashDescription}!`);
		assert.equal(await franklinDecentralizedMarketplaceMediationContract.numberOfMediators.call(), 0,
			"Number of Mediators should initially be zero!");

		try {
			await franklinDecentralizedMarketplaceMediationContract.getMediatorAddress.call(0);
			assert.fail(`Mediator Address ${mediatorAddress} should initially NOT be able to be accessed in the 'listOfMediators' double-linked list under index 0!`);
		} catch (error) {
			assert.ok(/revert/.test(error.message), "String 'revert' not present in error message!");
			assert.ok(/Index value given is greater than or equal to the Number of Mediators! It should be less than the Number of Mediators!/.test(error.message),
				"Appropriate error message not returned!");
		}

		await franklinDecentralizedMarketplaceMediationContract.addOrUpdateMediator(mediatorIpfsHashDescription, {from: mediatorAddress});
		assert.equal(await franklinDecentralizedMarketplaceMediationContract.mediatorExists.call(mediatorAddress), true,
			`Ethereum Address ${mediatorAddress} should now exist as a Mediator!`);
		assert.equal(await franklinDecentralizedMarketplaceMediationContract.descriptionInfoAboutMediators.call(mediatorAddress), mediatorIpfsHashDescription,
			`Ethereum Address ${mediatorAddress} should now have a Mediator Description Info of ${mediatorIpfsHashDescription}!`);
		assert.equal(await franklinDecentralizedMarketplaceMediationContract.numberOfMediators.call(), 1,
			"Number of Mediators should now be one!");
		assert.equal(await franklinDecentralizedMarketplaceMediationContract.getMediatorAddress.call(0), mediatorAddress,
			`Mediator Address ${mediatorAddress} should be able to be accessed in the 'listOfMediators' double-linked list under index 0!`);
	});

	it("FranklinDecentralizedMarketplaceMediation : test addOrUpdateMediator method - msg.sender is NOT an existing Mediator and msg.sender already has an existing Mediator Description that is NOT the input _mediatorIpfsHashDescription description", async () => {
		let mediatorAddress = accounts[randomAddressIndex];
		let mediatorIpfsHashDescription = "Dummy_Mediator_Description_Before";
		await franklinDecentralizedMarketplaceMediationContract.addOrUpdateMediator(mediatorIpfsHashDescription, {from: mediatorAddress});
		await franklinDecentralizedMarketplaceMediationContract.removeMediator({from: mediatorAddress});

		assert.equal(await franklinDecentralizedMarketplaceMediationContract.mediatorExists.call(mediatorAddress), false,
			`Ethereum Address ${mediatorAddress} should not initially exist as a Mediator!`);
		assert.equal(await franklinDecentralizedMarketplaceMediationContract.descriptionInfoAboutMediators.call(mediatorAddress), mediatorIpfsHashDescription,
			`Ethereum Address ${mediatorAddress} should initially have a Mediator Description Info of ${mediatorIpfsHashDescription}!`);
		assert.equal(await franklinDecentralizedMarketplaceMediationContract.numberOfMediators.call(), 0,
			"Number of Mediators should initially be zero!");

		try {
			await franklinDecentralizedMarketplaceMediationContract.getMediatorAddress.call(0);
			assert.fail(`Mediator Address ${mediatorAddress} should initially NOT be able to be accessed in the 'listOfMediators' double-linked list under index 0!`);
		} catch (error) {
			assert.ok(/revert/.test(error.message), "String 'revert' not present in error message!");
			assert.ok(/Index value given is greater than or equal to the Number of Mediators! It should be less than the Number of Mediators!/.test(error.message),
				"Appropriate error message not returned!");
		}

		mediatorIpfsHashDescription = "Dummy_Mediator_Description_Now";
		await franklinDecentralizedMarketplaceMediationContract.addOrUpdateMediator(mediatorIpfsHashDescription, {from: mediatorAddress});
		assert.equal(await franklinDecentralizedMarketplaceMediationContract.mediatorExists.call(mediatorAddress), true,
			`Ethereum Address ${mediatorAddress} should now exist as a Mediator!`);
		assert.equal(await franklinDecentralizedMarketplaceMediationContract.descriptionInfoAboutMediators.call(mediatorAddress), mediatorIpfsHashDescription,
			`Ethereum Address ${mediatorAddress} should now have a Mediator Description Info of ${mediatorIpfsHashDescription}!`);
		assert.equal(await franklinDecentralizedMarketplaceMediationContract.numberOfMediators.call(), 1,
			"Number of Mediators should now be one!");
		assert.equal(await franklinDecentralizedMarketplaceMediationContract.getMediatorAddress.call(0), mediatorAddress,
			`Mediator Address ${mediatorAddress} should be able to be accessed in the 'listOfMediators' double-linked list under index 0!`);
	});

	it("FranklinDecentralizedMarketplaceMediation : test addOrUpdateMediator method - msg.sender IS an existing Mediator and input _mediatorIpfsHashDescription IS an existing description for msg.sender", async () => {
		let mediatorAddress = accounts[randomAddressIndex];
		let mediatorIpfsHashDescription = "Dummy_Mediator_Description";
		await franklinDecentralizedMarketplaceMediationContract.addOrUpdateMediator(mediatorIpfsHashDescription, {from: mediatorAddress});

		assert.equal(await franklinDecentralizedMarketplaceMediationContract.mediatorExists.call(mediatorAddress), true,
			`Ethereum Address ${mediatorAddress} should initially exist as a Mediator!`);
		assert.equal(await franklinDecentralizedMarketplaceMediationContract.descriptionInfoAboutMediators.call(mediatorAddress), mediatorIpfsHashDescription,
			`Ethereum Address ${mediatorAddress} should initially have a Mediator Description Info of ${mediatorIpfsHashDescription}!`);
		assert.equal(await franklinDecentralizedMarketplaceMediationContract.numberOfMediators.call(), 1,
			"Number of Mediators should initially be one!");
		assert.equal(await franklinDecentralizedMarketplaceMediationContract.getMediatorAddress.call(0), mediatorAddress,
			`Mediator Address ${mediatorAddress} should initially be able to be accessed in the 'listOfMediators' double-linked list under index 0!`);

		await franklinDecentralizedMarketplaceMediationContract.addOrUpdateMediator(mediatorIpfsHashDescription, {from: mediatorAddress});
		assert.equal(await franklinDecentralizedMarketplaceMediationContract.mediatorExists.call(mediatorAddress), true,
			`Ethereum Address ${mediatorAddress} should continue to exist as a Mediator!`);
		assert.equal(await franklinDecentralizedMarketplaceMediationContract.descriptionInfoAboutMediators.call(mediatorAddress), mediatorIpfsHashDescription,
			`Ethereum Address ${mediatorAddress} should now have a Mediator Description Info of ${mediatorIpfsHashDescription}!`);
		assert.equal(await franklinDecentralizedMarketplaceMediationContract.numberOfMediators.call(), 1,
			"Number of Mediators should now be one!");
		assert.equal(await franklinDecentralizedMarketplaceMediationContract.getMediatorAddress.call(0), mediatorAddress,
			`Mediator Address ${mediatorAddress} should be able to be accessed in the 'listOfMediators' double-linked list under index 0!`);
	});

	it("FranklinDecentralizedMarketplaceMediation : test addOrUpdateMediator method - msg.sender IS an existing Mediator and msg.sender already has an existing Mediator Description that is NOT the input _mediatorIpfsHashDescription description", async () => {
		let mediatorAddress = accounts[randomAddressIndex];
		let mediatorIpfsHashDescription = "Dummy_Mediator_Description_Before";
		await franklinDecentralizedMarketplaceMediationContract.addOrUpdateMediator(mediatorIpfsHashDescription, {from: mediatorAddress});

		assert.equal(await franklinDecentralizedMarketplaceMediationContract.mediatorExists.call(mediatorAddress), true,
			`Ethereum Address ${mediatorAddress} should initially exist as a Mediator!`);
		assert.equal(await franklinDecentralizedMarketplaceMediationContract.descriptionInfoAboutMediators.call(mediatorAddress), mediatorIpfsHashDescription,
			`Ethereum Address ${mediatorAddress} should initially have a Mediator Description Info of ${mediatorIpfsHashDescription}!`);
		assert.equal(await franklinDecentralizedMarketplaceMediationContract.numberOfMediators.call(), 1,
			"Number of Mediators should initially be one!");
		assert.equal(await franklinDecentralizedMarketplaceMediationContract.getMediatorAddress.call(0), mediatorAddress,
			`Mediator Address ${mediatorAddress} should be able to be accessed in the 'listOfMediators' double-linked list under index 0!`);

		mediatorIpfsHashDescription = "Dummy_Mediator_Description_Now";
		await franklinDecentralizedMarketplaceMediationContract.addOrUpdateMediator(mediatorIpfsHashDescription, {from: mediatorAddress});
		assert.equal(await franklinDecentralizedMarketplaceMediationContract.mediatorExists.call(mediatorAddress), true,
			`Ethereum Address ${mediatorAddress} should continue to exist as a Mediator!`);
		assert.equal(await franklinDecentralizedMarketplaceMediationContract.descriptionInfoAboutMediators.call(mediatorAddress), mediatorIpfsHashDescription,
			`Ethereum Address ${mediatorAddress} should now have a Mediator Description Info of ${mediatorIpfsHashDescription}!`);
		assert.equal(await franklinDecentralizedMarketplaceMediationContract.numberOfMediators.call(), 1,
			"Number of Mediators should continue to be one!");
		assert.equal(await franklinDecentralizedMarketplaceMediationContract.getMediatorAddress.call(0), mediatorAddress,
			`Mediator Address ${mediatorAddress} should be able to be accessed in the 'listOfMediators' double-linked list under index 0!`);
	});

	it("FranklinDecentralizedMarketplaceMediation : test removeMediator method - msg.sender is NOT an existing Mediator and has no IPFS Mediator Description Info", async () => {
		let mediatorAddress = accounts[randomAddressIndex];
		assert.equal(await franklinDecentralizedMarketplaceMediationContract.mediatorExists.call(mediatorAddress), false,
			`Ethereum Address ${mediatorAddress} should not initially exist as a Mediator!`);
		assert.equal(await franklinDecentralizedMarketplaceMediationContract.descriptionInfoAboutMediators.call(mediatorAddress), EMPTY_STRING,
			`Ethereum Address ${mediatorAddress} should initially have a Mediator Description Info of EMPTY_STRING!`);
		assert.equal(await franklinDecentralizedMarketplaceMediationContract.numberOfMediators.call(), 0,
			"Number of Mediators should initially be zero!");

		try {
			await franklinDecentralizedMarketplaceMediationContract.getMediatorAddress.call(0);
			assert.fail(`Mediator Address ${mediatorAddress} should initially NOT be able to be accessed in the 'listOfMediators' double-linked list under index 0!`);
		} catch (error) {
			assert.ok(/revert/.test(error.message), "String 'revert' not present in error message!");
			assert.ok(/Index value given is greater than or equal to the Number of Mediators! It should be less than the Number of Mediators!/.test(error.message),
				"Appropriate error message not returned!");
		}

		await franklinDecentralizedMarketplaceMediationContract.removeMediator({from: mediatorAddress});
		assert.equal(await franklinDecentralizedMarketplaceMediationContract.mediatorExists.call(mediatorAddress), false,
			`Ethereum Address ${mediatorAddress} should continue to not exist as a Mediator!`);
		assert.equal(await franklinDecentralizedMarketplaceMediationContract.descriptionInfoAboutMediators.call(mediatorAddress), EMPTY_STRING,
			`Ethereum Address ${mediatorAddress} should continue to have a Mediator Description Info of EMPTY_STRING!`);
		assert.equal(await franklinDecentralizedMarketplaceMediationContract.numberOfMediators.call(), 0,
			"Number of Mediators should continue to be zero!");
	});

	it("FranklinDecentralizedMarketplaceMediation : test removeMediator method - msg.sender is NOT an existing Mediator and has already an IPFS Mediator Description Info", async () => {
		let mediatorAddress = accounts[randomAddressIndex];
		let mediatorIpfsHashDescription = "Dummy_Mediator_Description";
		await franklinDecentralizedMarketplaceMediationContract.addOrUpdateMediator(mediatorIpfsHashDescription, {from: mediatorAddress});
		await franklinDecentralizedMarketplaceMediationContract.removeMediator({from: mediatorAddress});

		assert.equal(await franklinDecentralizedMarketplaceMediationContract.mediatorExists.call(mediatorAddress), false,
			`Ethereum Address ${mediatorAddress} should not initially exist as a Mediator!`);
		assert.equal(await franklinDecentralizedMarketplaceMediationContract.descriptionInfoAboutMediators.call(mediatorAddress), mediatorIpfsHashDescription,
			`Ethereum Address ${mediatorAddress} should initially have a Mediator Description Info of ${mediatorIpfsHashDescription}!`);
		assert.equal(await franklinDecentralizedMarketplaceMediationContract.numberOfMediators.call(), 0,
			"Number of Mediators should initially be zero!");

		try {
			await franklinDecentralizedMarketplaceMediationContract.getMediatorAddress.call(0);
			assert.fail(`Mediator Address ${mediatorAddress} should initially NOT be able to be accessed in the 'listOfMediators' double-linked list under index 0!`);
		} catch (error) {
			assert.ok(/revert/.test(error.message), "String 'revert' not present in error message!");
			assert.ok(/Index value given is greater than or equal to the Number of Mediators! It should be less than the Number of Mediators!/.test(error.message),
				"Appropriate error message not returned!");
		}

		await franklinDecentralizedMarketplaceMediationContract.removeMediator({from: mediatorAddress});
		assert.equal(await franklinDecentralizedMarketplaceMediationContract.mediatorExists.call(mediatorAddress), false,
			`Ethereum Address ${mediatorAddress} should continue to not exist as a Mediator!`);
		assert.equal(await franklinDecentralizedMarketplaceMediationContract.descriptionInfoAboutMediators.call(mediatorAddress), mediatorIpfsHashDescription,
			`Ethereum Address ${mediatorAddress} should continue to have a Mediator Description Info of ${mediatorIpfsHashDescription}!`);
		assert.equal(await franklinDecentralizedMarketplaceMediationContract.numberOfMediators.call(), 0,
			"Number of Mediators should continue to be zero!");

		try {
			await franklinDecentralizedMarketplaceMediationContract.getMediatorAddress.call(0);
			assert.fail(`Mediator Address ${mediatorAddress} should continue to NOT be able to be accessed in the 'listOfMediators' double-linked list under index 0!`);
		} catch (error) {
			assert.ok(/revert/.test(error.message), "String 'revert' not present in error message!");
			assert.ok(/Index value given is greater than or equal to the Number of Mediators! It should be less than the Number of Mediators!/.test(error.message),
				"Appropriate error message not returned!");
		}
	});

	it("FranklinDecentralizedMarketplaceMediation : test removeMediator method - msg.sender IS an existing Mediator", async () => {
		let mediatorAddress = accounts[randomAddressIndex];
		let mediatorIpfsHashDescription = "Dummy_Mediator_Description";
		await franklinDecentralizedMarketplaceMediationContract.addOrUpdateMediator(mediatorIpfsHashDescription, {from: mediatorAddress});

		assert.equal(await franklinDecentralizedMarketplaceMediationContract.mediatorExists.call(mediatorAddress), true,
			`Ethereum Address ${mediatorAddress} should initially exist as a Mediator!`);
		assert.equal(await franklinDecentralizedMarketplaceMediationContract.descriptionInfoAboutMediators.call(mediatorAddress), mediatorIpfsHashDescription,
			`Ethereum Address ${mediatorAddress} should initially have a Mediator Description Info of ${mediatorIpfsHashDescription}!`);
		assert.equal(await franklinDecentralizedMarketplaceMediationContract.numberOfMediators.call(), 1,
			"Number of Mediators should initially be one!");
		assert.equal(await franklinDecentralizedMarketplaceMediationContract.getMediatorAddress.call(0), mediatorAddress,
			`Mediator Address ${mediatorAddress} should initially be able to be accessed in the 'listOfMediators' double-linked list under index 0!`);

		await franklinDecentralizedMarketplaceMediationContract.removeMediator({from: mediatorAddress});
		assert.equal(await franklinDecentralizedMarketplaceMediationContract.mediatorExists.call(mediatorAddress), false,
			`Ethereum Address ${mediatorAddress} should continue to not exist as a Mediator!`);
		assert.equal(await franklinDecentralizedMarketplaceMediationContract.descriptionInfoAboutMediators.call(mediatorAddress), mediatorIpfsHashDescription,
			`Ethereum Address ${mediatorAddress} should continue to have a Mediator Description Info of ${mediatorIpfsHashDescription}!`);
		assert.equal(await franklinDecentralizedMarketplaceMediationContract.numberOfMediators.call(), 0,
			"Number of Mediators should continue to be zero!");

		try {
			await franklinDecentralizedMarketplaceMediationContract.getMediatorAddress.call(0);
			assert.fail(`Mediator Address ${mediatorAddress} should now NOT be able to be accessed in the 'listOfMediators' double-linked list under index 0!`);
		} catch (error) {
			assert.ok(/revert/.test(error.message), "String 'revert' not present in error message!");
			assert.ok(/Index value given is greater than or equal to the Number of Mediators! It should be less than the Number of Mediators!/.test(error.message),
				"Appropriate error message not returned!");
		}
	});

	it("FranklinDecentralizedMarketplaceMediation : test getMediatorAddress method - no Mediators exist", async () => {
		assert.equal(await franklinDecentralizedMarketplaceMediationContract.numberOfMediators.call(), 0,
			"Number of Mediators should be 0!");

		// Test index values greater than or equal to zero.
		for (let i = 0; i < 5; i++) {
			try {
				await franklinDecentralizedMarketplaceMediationContract.getMediatorAddress.call(i);
				assert.fail(`No Mediators should be able to be accessed when the number of mediators is 0!`);
			} catch (error) {
				assert.ok(/revert/.test(error.message), "String 'revert' not present in error message!");
				assert.ok(/Index value given is greater than or equal to the Number of Mediators! It should be less than the Number of Mediators!/.test(error.message),
					"Appropriate error message not returned!");
			}
		}
	});

	it("FranklinDecentralizedMarketplaceMediation : test getMediatorAddress method - one Mediator exists", async () => {
		let mediatorAddress = accounts[randomAddressIndex];
		let mediatorIpfsHashDescription = "Dummy_Mediator_Description";
		await franklinDecentralizedMarketplaceMediationContract.addOrUpdateMediator(mediatorIpfsHashDescription, {from: mediatorAddress});

		assert.equal(await franklinDecentralizedMarketplaceMediationContract.numberOfMediators.call(), 1,
			"Number of Mediators should be one!");
		assert.equal(await franklinDecentralizedMarketplaceMediationContract.getMediatorAddress.call(0), mediatorAddress,
			`Mediator Address ${mediatorAddress} should be able to be accessed in the 'listOfMediators' double-linked list under index 0!`);

		// Test index values greater than or equal to one.
		for (let i = 1; i < 6; i++) {
			try {
				await franklinDecentralizedMarketplaceMediationContract.getMediatorAddress.call(i);
				assert.fail(`No Mediators should be able to be accessed when the index value is greater than or equal to the number of Mediators!`);
			} catch (error) {
				assert.ok(/revert/.test(error.message), "String 'revert' not present in error message!");
				assert.ok(/Index value given is greater than or equal to the Number of Mediators! It should be less than the Number of Mediators!/.test(error.message),
					"Appropriate error message not returned!");
			}
		}
	});

	it("FranklinDecentralizedMarketplaceMediation : test getMediatorAddress method - add three Mediators and test for proper index access and numberOfMediators", async () => {
		let mediatorIpfsHashDescriptionBase = "Dummy_Mediator_Description";
		for (let i = 0; i < 3; i++) {
			let mediatorAddress = accounts[(randomAddressIndex + i) % NUMBER_OF_ACCOUNTS];
			let mediatorIpfsHashDescription = `${mediatorIpfsHashDescriptionBase}_${i}`;
			await franklinDecentralizedMarketplaceMediationContract.addOrUpdateMediator(mediatorIpfsHashDescription, {from: mediatorAddress});

			assert.equal(await franklinDecentralizedMarketplaceMediationContract.numberOfMediators.call(), i + 1,
				"First for loop: Number of Mediators should have reflected the number of Mediators added so far!");
			assert.equal(await franklinDecentralizedMarketplaceMediationContract.getMediatorAddress.call(0), mediatorAddress,
				`First fir loop: Mediator Address ${mediatorAddress} should be able to be accessed in the 'listOfMediators' double-linked list under ` +
				`index ${i} immediately after being added as a Mediator!`);
		}

		// Test index values greater than or equal to 3.
		for (let i = 3; i < 6; i++) {
			try {
				await franklinDecentralizedMarketplaceMediationContract.getMediatorAddress.call(i);
				assert.fail(`No Mediators should be able to be accessed when the index value is greater than or equal to the number of Mediators!`);
			} catch (error) {
				assert.ok(/revert/.test(error.message), "String 'revert' not present in error message!");
				assert.ok(/Index value given is greater than or equal to the Number of Mediators! It should be less than the Number of Mediators!/.test(error.message),
					"Appropriate error message not returned!");
			}
		}

		let decrementingIndex = 2;
		for (let i = 0; i < 3; i++) {
			let mediatorAddress = accounts[(randomAddressIndex + i) % NUMBER_OF_ACCOUNTS];
			let mediatorIpfsHashDescription = `${mediatorIpfsHashDescriptionBase}_${i}`;

			assert.equal(await franklinDecentralizedMarketplaceMediationContract.numberOfMediators.call(), 3,
				"Second for loop: Number of Mediators should have reflected the number of Mediators added so far!");
			assert.equal(await franklinDecentralizedMarketplaceMediationContract.getMediatorAddress.call(decrementingIndex), mediatorAddress,
				`Second for loop: Mediator Address ${mediatorAddress} should be able to be accessed in the 'listOfMediators' double-linked list under ` +
				`index ${decrementingIndex} immediately after being added as a Mediator!`);

			decrementingIndex--;
		}
	});

	it("FranklinDecentralizedMarketplaceMediation : test getMediatorAddress method - add three Mediators and then delete the middle one and test for proper index access and numberOfMediators", async () => {
		let mediatorIpfsHashDescriptionBase = "Dummy_Mediator_Description";
		for (let i = 0; i < 3; i++) {
			let mediatorAddress = accounts[(randomAddressIndex + i) % NUMBER_OF_ACCOUNTS];
			let mediatorIpfsHashDescription = `${mediatorIpfsHashDescriptionBase}_${i}`;
			await franklinDecentralizedMarketplaceMediationContract.addOrUpdateMediator(mediatorIpfsHashDescription, {from: mediatorAddress});
		}

		let mediatorAddressToBeRemoved = accounts[(randomAddressIndex + 1) % NUMBER_OF_ACCOUNTS];
		await franklinDecentralizedMarketplaceMediationContract.removeMediator({ from: mediatorAddressToBeRemoved});
		assert.equal(await franklinDecentralizedMarketplaceMediationContract.numberOfMediators.call(), 2,
			"Number of Mediators should have reflected the removing of a Mediator!");

		let mediatorAddress = accounts[(randomAddressIndex + 0) % NUMBER_OF_ACCOUNTS];
		assert.equal(await franklinDecentralizedMarketplaceMediationContract.getMediatorAddress.call(1), mediatorAddress,
			`Second for loop: Mediator Address ${mediatorAddress} should be able to be accessed in the 'listOfMediators' double-linked list under ` +
			`index 1 immediately after deleting the middle Mediator!`);

		mediatorAddress = accounts[(randomAddressIndex + 2) % NUMBER_OF_ACCOUNTS];
		assert.equal(await franklinDecentralizedMarketplaceMediationContract.getMediatorAddress.call(0), mediatorAddress,
			`Second for loop: Mediator Address ${mediatorAddress} should be able to be accessed in the 'listOfMediators' double-linked list under ` +
			`index 0 immediately after deleting the middle Mediator!`);
	});

	it("FranklinDecentralizedMarketplaceMediation : test purchaseItemWithMediator method - FranklinDecentralizedMarketplaceContract has not been set by the Contract Owner", async () => {
		let contractOwnerAddress = accounts[randomAddressIndex];
		let franklinDecentralizedMarketplaceMediationContractTemp = await FranklinDecentralizedMarketplaceMediation.new({from: contractOwnerAddress});
		assert.equal(await franklinDecentralizedMarketplaceMediationContractTemp.franklinDecentralizedMarketplaceContractHasBeenSet.call(), false,
			"The franklinDecentralizedMarketplaceContractHasBeenSet should initially be false!");

		let buyerAddress = accounts[(randomAddressIndex + 1) % NUMBER_OF_ACCOUNTS];
		let sellerAddress = accounts[(randomAddressIndex + 2) % NUMBER_OF_ACCOUNTS];
		let mediatorAddress = accounts[(randomAddressIndex + 3) % NUMBER_OF_ACCOUNTS];
		let keyItemIpfsHash = "DummyItem_IpfsHash";
		let mediatedSalesTransactionIpfsHash = "DummyMediationSalesTransaction_IpfsHash";
		let quantity = 1;

		try {
			await franklinDecentralizedMarketplaceMediationContractTemp.purchaseItemWithMediator(sellerAddress, mediatorAddress, keyItemIpfsHash,
				mediatedSalesTransactionIpfsHash, quantity, {from: buyerAddress});
			assert.fail("Should not be able to execute this method until FranklinDecentralizedMarketplaceContract has not been set by the Contract Owner!");
		} catch (error) {
			assert.ok(/revert/.test(error.message), "String 'revert' not present in error message!");
			assert.ok(/The FranklinDecentralizedMarketplaceContract has not been set by the Contract Owner!/.test(error.message),
				"Appropriate error message not returned!");
		}
	});

	it("FranklinDecentralizedMarketplaceMediation : test purchaseItemWithMediator method - quantity of items to purchase is zero", async () => {
		let buyerAddress = accounts[(randomAddressIndex + 1) % NUMBER_OF_ACCOUNTS];
		let sellerAddress = accounts[(randomAddressIndex + 2) % NUMBER_OF_ACCOUNTS];
		let mediatorAddress = accounts[(randomAddressIndex + 3) % NUMBER_OF_ACCOUNTS];
		let keyItemIpfsHash = "DummyItem_IpfsHash";
		let mediatedSalesTransactionIpfsHash = "DummyMediationSalesTransaction_IpfsHash";
		let quantity = 0;

		try {
			await franklinDecentralizedMarketplaceMediationContract.purchaseItemWithMediator(sellerAddress, mediatorAddress, keyItemIpfsHash,
				mediatedSalesTransactionIpfsHash, quantity, {from: buyerAddress});
			assert.fail("Should not be able to execute this method when the quantity of items to purchase is zero!");
		} catch (error) {
			assert.ok(/revert/.test(error.message), "String 'revert' not present in error message!");
			assert.ok(/Must purchase at least 1 quantity of the Item for Sale to happen!/.test(error.message),
				"Appropriate error message not returned!");
		}
	});

	it("FranklinDecentralizedMarketplaceMediation : test purchaseItemWithMediator method - _keyItemIpfsHash input is an EMPTY_STRING", async () => {
		let buyerAddress = accounts[(randomAddressIndex + 1) % NUMBER_OF_ACCOUNTS];
		let sellerAddress = accounts[(randomAddressIndex + 2) % NUMBER_OF_ACCOUNTS];
		let mediatorAddress = accounts[(randomAddressIndex + 3) % NUMBER_OF_ACCOUNTS];
		let keyItemIpfsHash = EMPTY_STRING;
		let mediatedSalesTransactionIpfsHash = "DummyMediationSalesTransaction_IpfsHash";
		let quantity = 1;

		try {
			await franklinDecentralizedMarketplaceMediationContract.purchaseItemWithMediator(sellerAddress, mediatorAddress, keyItemIpfsHash,
				mediatedSalesTransactionIpfsHash, quantity, {from: buyerAddress});
			assert.fail("Should not be able to execute this method when the _keyItemIpfsHash input is an EMPTY_STRING!");
		} catch (error) {
			assert.ok(/revert/.test(error.message), "String 'revert' not present in error message!");
			assert.ok(/Cannot have an empty String for the IPFS Hash Key of an Item you are purchasing!/.test(error.message),
				"Appropriate error message not returned!");
		}
	});

	it("FranklinDecentralizedMarketplaceMediation : test purchaseItemWithMediator method - _mediatedSalesTransactionIpfsHash input is an EMPTY_STRING", async () => {
		let buyerAddress = accounts[(randomAddressIndex + 1) % NUMBER_OF_ACCOUNTS];
		let sellerAddress = accounts[(randomAddressIndex + 2) % NUMBER_OF_ACCOUNTS];
		let mediatorAddress = accounts[(randomAddressIndex + 3) % NUMBER_OF_ACCOUNTS];
		let keyItemIpfsHash = "DummyItem_IpfsHash";
		let mediatedSalesTransactionIpfsHash = EMPTY_STRING;
		let quantity = 1;

		try {
			await franklinDecentralizedMarketplaceMediationContract.purchaseItemWithMediator(sellerAddress, mediatorAddress, keyItemIpfsHash,
				mediatedSalesTransactionIpfsHash, quantity, {from: buyerAddress});
			assert.fail("Should not be able to execute this method when the _mediatedSalesTransactionIpfsHash input is an EMPTY_STRING!");
		} catch (error) {
			assert.ok(/revert/.test(error.message), "String 'revert' not present in error message!");
			assert.ok(/Cannot have an empty String for the IPFS Hash Key of the Mediated Sales Transaction!/.test(error.message),
				"Appropriate error message not returned!");
		}
	});

	it("FranklinDecentralizedMarketplaceMediation : test purchaseItemWithMediator method - given _sellerAddress does not exist as a seller", async () => {
		let buyerAddress = accounts[(randomAddressIndex + 1) % NUMBER_OF_ACCOUNTS];
		let sellerAddress = accounts[(randomAddressIndex + 2) % NUMBER_OF_ACCOUNTS];
		let mediatorAddress = accounts[(randomAddressIndex + 3) % NUMBER_OF_ACCOUNTS];
		let keyItemIpfsHash = "DummyItem_IpfsHash";
		let mediatedSalesTransactionIpfsHash = "DummyMediationSalesTransaction_IpfsHash";
		let quantity = 1;

		assert.equal(await franklinDecentralizedMarketplaceContract.sellerExists.call(sellerAddress), false,
			"Seller Address should initially not exist as a Seller!");

		try {
			await franklinDecentralizedMarketplaceMediationContract.purchaseItemWithMediator(sellerAddress, mediatorAddress, keyItemIpfsHash,
				mediatedSalesTransactionIpfsHash, quantity, {from: buyerAddress});
			assert.fail("Should not be able to execute this method when the _sellerAddress does not exist as a Seller!");
		} catch (error) {
			assert.ok(/revert/.test(error.message), "String 'revert' not present in error message!");
			assert.ok(/Given Seller Address does not exist as a Seller!/.test(error.message),
				"Appropriate error message not returned!");
		}
	});

	it("FranklinDecentralizedMarketplaceMediation : test purchaseItemWithMediator method - given _keyItemIpfsHash does not exist as an item for sale from the seller", async () => {
		let buyerAddress = accounts[(randomAddressIndex + 1) % NUMBER_OF_ACCOUNTS];
		let sellerAddress = accounts[(randomAddressIndex + 2) % NUMBER_OF_ACCOUNTS];
		let mediatorAddress = accounts[(randomAddressIndex + 3) % NUMBER_OF_ACCOUNTS];
		let keyItemIpfsHash = "DummyItem_IpfsHash";
		let mediatedSalesTransactionIpfsHash = "DummyMediationSalesTransaction_IpfsHash";
		let quantity = 1;

		await franklinDecentralizedMarketplaceContract.addItemForSale(keyItemIpfsHash, {from: sellerAddress});

		keyItemIpfsHash = `${keyItemIpfsHash}_NotSoldBySeller`;
		assert.equal(await franklinDecentralizedMarketplaceContract.itemForSaleFromSellerExists(sellerAddress, keyItemIpfsHash), false,
			"Item requested to purchase should not exists as an item for sale from the seller!");

		try {
			await franklinDecentralizedMarketplaceMediationContract.purchaseItemWithMediator(sellerAddress, mediatorAddress, keyItemIpfsHash,
				mediatedSalesTransactionIpfsHash, quantity, {from: buyerAddress});
			assert.fail("Should not be able to execute this method when _keyItemIpfsHash does not exist as an item for sale from the seller!");
		} catch (error) {
			assert.ok(/revert/.test(error.message), "String 'revert' not present in error message!");
			assert.ok(/Given IPFS Hash of Item is not listed as an Item For Sale from the Seller!/.test(error.message),
				"Appropriate error message not returned!");
		}
	});

	it("FranklinDecentralizedMarketplaceMediation : test purchaseItemWithMediator method - seller has zero quantity available for sale for the item requested to purchase", async () => {
		let buyerAddress = accounts[(randomAddressIndex + 1) % NUMBER_OF_ACCOUNTS];
		let sellerAddress = accounts[(randomAddressIndex + 2) % NUMBER_OF_ACCOUNTS];
		let mediatorAddress = accounts[(randomAddressIndex + 3) % NUMBER_OF_ACCOUNTS];
		let keyItemIpfsHash = "DummyItem_IpfsHash";
		let mediatedSalesTransactionIpfsHash = "DummyMediationSalesTransaction_IpfsHash";
		let quantity = 1;

		await franklinDecentralizedMarketplaceContract.addItemForSale(keyItemIpfsHash, {from: sellerAddress});
		assert.equal(await franklinDecentralizedMarketplaceContract.itemForSaleFromSellerExists(sellerAddress, keyItemIpfsHash), true,
			"Item requested to purchase should exist as an item for sale from the seller!");

		assert.equal(await franklinDecentralizedMarketplaceContract.getQuantityAvailableForSaleOfAnItemBySeller(sellerAddress, keyItemIpfsHash), 0,
			"Number of items available for sale from the seller should be zero!");

		try {
			await franklinDecentralizedMarketplaceMediationContract.purchaseItemWithMediator(sellerAddress, mediatorAddress, keyItemIpfsHash,
				mediatedSalesTransactionIpfsHash, quantity, {from: buyerAddress});
			assert.fail("Should not be able to execute this method when _keyItemIpfsHash does not exist as an item for sale from the seller!");
		} catch (error) {
			assert.ok(/revert/.test(error.message), "String 'revert' not present in error message!");
			assert.ok(/Seller has Zero quantity available for Sale for the Item requested to purchase!/.test(error.message),
				"Appropriate error message not returned!");
		}
	});

	it("FranklinDecentralizedMarketplaceMediation : test purchaseItemWithMediator method - quantity available for sale of the item from the seller is less than the quantity requested to purchase", async () => {
		let buyerAddress = accounts[(randomAddressIndex + 1) % NUMBER_OF_ACCOUNTS];
		let sellerAddress = accounts[(randomAddressIndex + 2) % NUMBER_OF_ACCOUNTS];
		let mediatorAddress = accounts[(randomAddressIndex + 3) % NUMBER_OF_ACCOUNTS];
		let keyItemIpfsHash = "DummyItem_IpfsHash";
		let mediatedSalesTransactionIpfsHash = "DummyMediationSalesTransaction_IpfsHash";
		let quantity = 3;

		await franklinDecentralizedMarketplaceContract.addItemForSale(keyItemIpfsHash, {from: sellerAddress});
		assert.equal(await franklinDecentralizedMarketplaceContract.itemForSaleFromSellerExists(sellerAddress, keyItemIpfsHash), true,
			"Item requested to purchase should exist as an item for sale from the seller!");

		await franklinDecentralizedMarketplaceContract.setQuantityAvailableForSaleOfAnItem(keyItemIpfsHash, quantity - 1, {from: sellerAddress})
		assert.ok(await franklinDecentralizedMarketplaceContract.getQuantityAvailableForSaleOfAnItemBySeller(sellerAddress, keyItemIpfsHash) < quantity,
			"Number of items available for sale from the seller should be less than the number requested to purchase from the buyer!");

		try {
			await franklinDecentralizedMarketplaceMediationContract.purchaseItemWithMediator(sellerAddress, mediatorAddress, keyItemIpfsHash,
				mediatedSalesTransactionIpfsHash, quantity, {from: buyerAddress});
			assert.fail("Should not be able to execute this method when quantity available for sale of the item from the seller is less than the quantity requested to purchase!");
		} catch (error) {
			assert.ok(/revert/.test(error.message), "String 'revert' not present in error message!");
			assert.ok(/Quantity available For Sale of the Item from the Seller is less than the quantity requested to purchase!/.test(error.message),
				"Appropriate error message not returned!");
		}
	});

	it("FranklinDecentralizedMarketplaceMediation : test purchaseItemWithMediator method - seller has not yet set a price for sale for the requested item", async () => {
		let buyerAddress = accounts[(randomAddressIndex + 1) % NUMBER_OF_ACCOUNTS];
		let sellerAddress = accounts[(randomAddressIndex + 2) % NUMBER_OF_ACCOUNTS];
		let mediatorAddress = accounts[(randomAddressIndex + 3) % NUMBER_OF_ACCOUNTS];
		let keyItemIpfsHash = "DummyItem_IpfsHash";
		let mediatedSalesTransactionIpfsHash = "DummyMediationSalesTransaction_IpfsHash";
		let quantity = 3;

		await franklinDecentralizedMarketplaceContract.addItemForSale(keyItemIpfsHash, {from: sellerAddress});
		assert.equal(await franklinDecentralizedMarketplaceContract.itemForSaleFromSellerExists(sellerAddress, keyItemIpfsHash), true,
			"Item requested to purchase should exist as an item for sale from the seller!");

		await franklinDecentralizedMarketplaceContract.setQuantityAvailableForSaleOfAnItem(keyItemIpfsHash, quantity + 1, {from: sellerAddress})
		assert.ok(await franklinDecentralizedMarketplaceContract.getQuantityAvailableForSaleOfAnItemBySeller(sellerAddress, keyItemIpfsHash) >= quantity,
			"Number of items available for sale from the seller is greater than or equal to the number requested to purchase from the buyer!");

		assert.equal(await franklinDecentralizedMarketplaceContract.getPriceOfItem(sellerAddress, keyItemIpfsHash), 0,
			"Seller should not have set a price for the item requested to purchase from the buyer!");

		try {
			await franklinDecentralizedMarketplaceMediationContract.purchaseItemWithMediator(sellerAddress, mediatorAddress, keyItemIpfsHash,
				mediatedSalesTransactionIpfsHash, quantity, {from: buyerAddress});
			assert.fail("Should not be able to execute this method when quantity available for sale of the item from the seller is less than the quantity requested to purchase!");
		} catch (error) {
			assert.ok(/revert/.test(error.message), "String 'revert' not present in error message!");
			assert.ok(/The Seller has not yet set a Price for Sale for the requested Item! Cannot purchase the Item!/.test(error.message),
				"Appropriate error message not returned!");
		}
	});

	it("FranklinDecentralizedMarketplaceMediation : test purchaseItemWithMediator method - not enough ETH/WEI was sent by the buyer to purchase the quantity requested of the item", async () => {
		let buyerAddress = accounts[(randomAddressIndex + 1) % NUMBER_OF_ACCOUNTS];
		let sellerAddress = accounts[(randomAddressIndex + 2) % NUMBER_OF_ACCOUNTS];
		let mediatorAddress = accounts[(randomAddressIndex + 3) % NUMBER_OF_ACCOUNTS];
		let keyItemIpfsHash = "DummyItem_IpfsHash";
		let mediatedSalesTransactionIpfsHash = "DummyMediationSalesTransaction_IpfsHash";
		let quantity = 3;

		await franklinDecentralizedMarketplaceContract.addItemForSale(keyItemIpfsHash, {from: sellerAddress});
		assert.equal(await franklinDecentralizedMarketplaceContract.itemForSaleFromSellerExists(sellerAddress, keyItemIpfsHash), true,
			"Item requested to purchase should exist as an item for sale from the seller!");

		await franklinDecentralizedMarketplaceContract.setQuantityAvailableForSaleOfAnItem(keyItemIpfsHash, quantity + 2, {from: sellerAddress})
		assert.ok(await franklinDecentralizedMarketplaceContract.getQuantityAvailableForSaleOfAnItemBySeller(sellerAddress, keyItemIpfsHash) >= quantity,
			"Number of items available for sale from the seller is greater than or equal to the number requested to purchase from the buyer!");

		let priceOfItemInWei = 0.25 * ETH;
		// console.log('priceOfItemInWei =', priceOfItemInWei);
		// console.log('priceOfItemInWei.toString() =', priceOfItemInWei.toString());
		let priceOfItemInWeiBN = new BN(priceOfItemInWei.toString());
		// console.log('priceOfItemInWeiBN =', priceOfItemInWeiBN);
		// console.log('priceOfItemInWeiBN.toString() =', priceOfItemInWeiBN.toString());
		await franklinDecentralizedMarketplaceContract.setPriceOfItem(keyItemIpfsHash, priceOfItemInWeiBN, {from: sellerAddress});

		let returnedPriceOfItemInWeiBN = await franklinDecentralizedMarketplaceContract.getPriceOfItem(sellerAddress, keyItemIpfsHash);
		// console.log('returnedPriceOfItemInWeiBN =', returnedPriceOfItemInWeiBN);
		// console.log('returnedPriceOfItemInWeiBN.toString() =', returnedPriceOfItemInWeiBN.toString());
		assert.notEqual(returnedPriceOfItemInWeiBN, new BN(0), "Seller should have set a non-zero price for the item requested to purchase from the buyer!");

		let amountNeededToPurchaseItemsInWei = quantity * priceOfItemInWei;
		// console.log('amountNeededToPurchaseItemsInWei =', amountNeededToPurchaseItemsInWei);
		let amountBuyerSendsToPurchaseInWeiBN = new BN(amountNeededToPurchaseItemsInWei.toString()).sub(new BN(1));
		// console.log('amountBuyerSendsToPurchaseInWeiBN =', amountBuyerSendsToPurchaseInWeiBN);
		// console.log('amountBuyerSendsToPurchaseInWeiBN.toString() =', amountBuyerSendsToPurchaseInWeiBN.toString());
		try {
			await franklinDecentralizedMarketplaceMediationContract.purchaseItemWithMediator(sellerAddress, mediatorAddress, keyItemIpfsHash,
				mediatedSalesTransactionIpfsHash, quantity, {from: buyerAddress, value: amountBuyerSendsToPurchaseInWeiBN});
			assert.fail("Should not be able to execute this method when buyer does not send enough ETH/WEI to purchase item(s)!");
		} catch (error) {
			assert.ok(/revert/.test(error.message), "String 'revert' not present in error message!");
			assert.ok(/Not enough ETH\/WEI was sent to purchase the quantity requested of the Item!/.test(error.message),
				"Appropriate error message not returned!");
		}
	});

	it("FranklinDecentralizedMarketplaceMediation : test purchaseItemWithMediator method - buyer address same as seller address", async () => {
		let buyerAddress = accounts[(randomAddressIndex + 1) % NUMBER_OF_ACCOUNTS];
		let sellerAddress = accounts[(randomAddressIndex + 2) % NUMBER_OF_ACCOUNTS];
		let mediatorAddress = accounts[(randomAddressIndex + 3) % NUMBER_OF_ACCOUNTS];
		let keyItemIpfsHash = "DummyItem_IpfsHash";
		let mediatedSalesTransactionIpfsHash = "DummyMediationSalesTransaction_IpfsHash";
		let quantity = 3;

		buyerAddress = sellerAddress;

		await franklinDecentralizedMarketplaceContract.addItemForSale(keyItemIpfsHash, {from: sellerAddress});
		assert.equal(await franklinDecentralizedMarketplaceContract.itemForSaleFromSellerExists(sellerAddress, keyItemIpfsHash), true,
			"Item requested to purchase should exist as an item for sale from the seller!");

		await franklinDecentralizedMarketplaceContract.setQuantityAvailableForSaleOfAnItem(keyItemIpfsHash, quantity + 2, {from: sellerAddress})
		assert.ok(await franklinDecentralizedMarketplaceContract.getQuantityAvailableForSaleOfAnItemBySeller(sellerAddress, keyItemIpfsHash) >= quantity,
			"Number of items available for sale from the seller is greater than or equal to the number requested to purchase from the buyer!");

		let priceOfItemInWei = 0.25 * ETH;
		// console.log('priceOfItemInWei =', priceOfItemInWei);
		// console.log('priceOfItemInWei.toString() =', priceOfItemInWei.toString());
		let priceOfItemInWeiBN = new BN(priceOfItemInWei.toString());
		// console.log('priceOfItemInWeiBN =', priceOfItemInWeiBN);
		// console.log('priceOfItemInWeiBN.toString() =', priceOfItemInWeiBN.toString());
		await franklinDecentralizedMarketplaceContract.setPriceOfItem(keyItemIpfsHash, priceOfItemInWeiBN, {from: sellerAddress});

		let returnedPriceOfItemInWeiBN = await franklinDecentralizedMarketplaceContract.getPriceOfItem(sellerAddress, keyItemIpfsHash);
		// console.log('returnedPriceOfItemInWeiBN =', returnedPriceOfItemInWeiBN);
		// console.log('returnedPriceOfItemInWeiBN.toString() =', returnedPriceOfItemInWeiBN.toString());
		assert.notEqual(returnedPriceOfItemInWeiBN, new BN(0), "Seller should have set a non-zero price for the item requested to purchase from the buyer!");

		let amountNeededToPurchaseItemsInWei = quantity * priceOfItemInWei;
		// console.log('amountNeededToPurchaseItemsInWei =', amountNeededToPurchaseItemsInWei);
		let amountBuyerSendsToPurchaseInWeiBN = new BN(amountNeededToPurchaseItemsInWei.toString());
		// console.log('amountBuyerSendsToPurchaseInWeiBN =', amountBuyerSendsToPurchaseInWeiBN);
		// console.log('amountBuyerSendsToPurchaseInWeiBN.toString() =', amountBuyerSendsToPurchaseInWeiBN.toString());

		try {
			await franklinDecentralizedMarketplaceMediationContract.purchaseItemWithMediator(sellerAddress, mediatorAddress, keyItemIpfsHash,
				mediatedSalesTransactionIpfsHash, quantity, {from: buyerAddress, value: amountBuyerSendsToPurchaseInWeiBN});
			assert.fail("Should not be able to execute this method when buyer address is the same as the seller address!");
		} catch (error) {
			assert.ok(/revert/.test(error.message), "String 'revert' not present in error message!");
			assert.ok(/The Buyer Address cannot be the same as the Seller Address!/.test(error.message),
				"Appropriate error message not returned!");
		}
	});

	it("FranklinDecentralizedMarketplaceMediation : test purchaseItemWithMediator method - buyer address same as mediator address", async () => {
		let buyerAddress = accounts[(randomAddressIndex + 1) % NUMBER_OF_ACCOUNTS];
		let sellerAddress = accounts[(randomAddressIndex + 2) % NUMBER_OF_ACCOUNTS];
		let mediatorAddress = accounts[(randomAddressIndex + 3) % NUMBER_OF_ACCOUNTS];
		let keyItemIpfsHash = "DummyItem_IpfsHash";
		let mediatedSalesTransactionIpfsHash = "DummyMediationSalesTransaction_IpfsHash";
		let quantity = 3;

		buyerAddress = mediatorAddress;

		await franklinDecentralizedMarketplaceContract.addItemForSale(keyItemIpfsHash, {from: sellerAddress});
		assert.equal(await franklinDecentralizedMarketplaceContract.itemForSaleFromSellerExists(sellerAddress, keyItemIpfsHash), true,
			"Item requested to purchase should exist as an item for sale from the seller!");

		await franklinDecentralizedMarketplaceContract.setQuantityAvailableForSaleOfAnItem(keyItemIpfsHash, quantity + 2, {from: sellerAddress})
		assert.ok(await franklinDecentralizedMarketplaceContract.getQuantityAvailableForSaleOfAnItemBySeller(sellerAddress, keyItemIpfsHash) >= quantity,
			"Number of items available for sale from the seller is greater than or equal to the number requested to purchase from the buyer!");

		let priceOfItemInWei = 0.25 * ETH;
		// console.log('priceOfItemInWei =', priceOfItemInWei);
		// console.log('priceOfItemInWei.toString() =', priceOfItemInWei.toString());
		let priceOfItemInWeiBN = new BN(priceOfItemInWei.toString());
		// console.log('priceOfItemInWeiBN =', priceOfItemInWeiBN);
		// console.log('priceOfItemInWeiBN.toString() =', priceOfItemInWeiBN.toString());
		await franklinDecentralizedMarketplaceContract.setPriceOfItem(keyItemIpfsHash, priceOfItemInWeiBN, {from: sellerAddress});

		let returnedPriceOfItemInWeiBN = await franklinDecentralizedMarketplaceContract.getPriceOfItem(sellerAddress, keyItemIpfsHash);
		// console.log('returnedPriceOfItemInWeiBN =', returnedPriceOfItemInWeiBN);
		// console.log('returnedPriceOfItemInWeiBN.toString() =', returnedPriceOfItemInWeiBN.toString());
		assert.notEqual(returnedPriceOfItemInWeiBN, new BN(0), "Seller should have set a non-zero price for the item requested to purchase from the buyer!");

		let amountNeededToPurchaseItemsInWei = quantity * priceOfItemInWei;
		// console.log('amountNeededToPurchaseItemsInWei =', amountNeededToPurchaseItemsInWei);
		let amountBuyerSendsToPurchaseInWeiBN = new BN(amountNeededToPurchaseItemsInWei.toString());
		// console.log('amountBuyerSendsToPurchaseInWeiBN =', amountBuyerSendsToPurchaseInWeiBN);
		// console.log('amountBuyerSendsToPurchaseInWeiBN.toString() =', amountBuyerSendsToPurchaseInWeiBN.toString());

		try {
			await franklinDecentralizedMarketplaceMediationContract.purchaseItemWithMediator(sellerAddress, mediatorAddress, keyItemIpfsHash,
				mediatedSalesTransactionIpfsHash, quantity, {from: buyerAddress, value: amountBuyerSendsToPurchaseInWeiBN});
			assert.fail("Should not be able to execute this method when buyer address is the same as the mediator address!");
		} catch (error) {
			assert.ok(/revert/.test(error.message), "String 'revert' not present in error message!");
			assert.ok(/The Buyer Address cannot be the same as the Mediator Address!/.test(error.message),
				"Appropriate error message not returned!");
		}
	});

	it("FranklinDecentralizedMarketplaceMediation : test purchaseItemWithMediator method - seller address same as mediator address", async () => {
		let buyerAddress = accounts[(randomAddressIndex + 1) % NUMBER_OF_ACCOUNTS];
		let sellerAddress = accounts[(randomAddressIndex + 2) % NUMBER_OF_ACCOUNTS];
		let mediatorAddress = accounts[(randomAddressIndex + 3) % NUMBER_OF_ACCOUNTS];
		let keyItemIpfsHash = "DummyItem_IpfsHash";
		let mediatedSalesTransactionIpfsHash = "DummyMediationSalesTransaction_IpfsHash";
		let quantity = 3;

		sellerAddress = mediatorAddress;

		await franklinDecentralizedMarketplaceContract.addItemForSale(keyItemIpfsHash, {from: sellerAddress});
		assert.equal(await franklinDecentralizedMarketplaceContract.itemForSaleFromSellerExists(sellerAddress, keyItemIpfsHash), true,
			"Item requested to purchase should exist as an item for sale from the seller!");

		await franklinDecentralizedMarketplaceContract.setQuantityAvailableForSaleOfAnItem(keyItemIpfsHash, quantity + 2, {from: sellerAddress})
		assert.ok(await franklinDecentralizedMarketplaceContract.getQuantityAvailableForSaleOfAnItemBySeller(sellerAddress, keyItemIpfsHash) >= quantity,
			"Number of items available for sale from the seller is greater than or equal to the number requested to purchase from the buyer!");

		let priceOfItemInWei = 0.25 * ETH;
		// console.log('priceOfItemInWei =', priceOfItemInWei);
		// console.log('priceOfItemInWei.toString() =', priceOfItemInWei.toString());
		let priceOfItemInWeiBN = new BN(priceOfItemInWei.toString());
		// console.log('priceOfItemInWeiBN =', priceOfItemInWeiBN);
		// console.log('priceOfItemInWeiBN.toString() =', priceOfItemInWeiBN.toString());
		await franklinDecentralizedMarketplaceContract.setPriceOfItem(keyItemIpfsHash, priceOfItemInWeiBN, {from: sellerAddress});

		let returnedPriceOfItemInWeiBN = await franklinDecentralizedMarketplaceContract.getPriceOfItem(sellerAddress, keyItemIpfsHash);
		// console.log('returnedPriceOfItemInWeiBN =', returnedPriceOfItemInWeiBN);
		// console.log('returnedPriceOfItemInWeiBN.toString() =', returnedPriceOfItemInWeiBN.toString());
		assert.notEqual(returnedPriceOfItemInWeiBN, new BN(0), "Seller should have set a non-zero price for the item requested to purchase from the buyer!");

		let amountNeededToPurchaseItemsInWei = quantity * priceOfItemInWei;
		// console.log('amountNeededToPurchaseItemsInWei =', amountNeededToPurchaseItemsInWei);
		let amountBuyerSendsToPurchaseInWeiBN = new BN(amountNeededToPurchaseItemsInWei.toString());
		// console.log('amountBuyerSendsToPurchaseInWeiBN =', amountBuyerSendsToPurchaseInWeiBN);
		// console.log('amountBuyerSendsToPurchaseInWeiBN.toString() =', amountBuyerSendsToPurchaseInWeiBN.toString());

		try {
			await franklinDecentralizedMarketplaceMediationContract.purchaseItemWithMediator(sellerAddress, mediatorAddress, keyItemIpfsHash,
				mediatedSalesTransactionIpfsHash, quantity, {from: buyerAddress, value: amountBuyerSendsToPurchaseInWeiBN});
			assert.fail("Should not be able to execute this method when seller address same as mediator address!");
		} catch (error) {
			assert.ok(/revert/.test(error.message), "String 'revert' not present in error message!");
			assert.ok(/The Seller Address cannot be the same as the Mediator Address!/.test(error.message),
				"Appropriate error message not returned!");
		}
	});

	it("FranklinDecentralizedMarketplaceMediation : test purchaseItemWithMediator method - given _mediatorAddress does not exist as a mediator", async () => {
		let buyerAddress = accounts[(randomAddressIndex + 1) % NUMBER_OF_ACCOUNTS];
		let sellerAddress = accounts[(randomAddressIndex + 2) % NUMBER_OF_ACCOUNTS];
		let mediatorAddress = accounts[(randomAddressIndex + 3) % NUMBER_OF_ACCOUNTS];
		let keyItemIpfsHash = "DummyItem_IpfsHash";
		let mediatedSalesTransactionIpfsHash = "DummyMediationSalesTransaction_IpfsHash";
		let quantity = 3;

		await franklinDecentralizedMarketplaceContract.addItemForSale(keyItemIpfsHash, {from: sellerAddress});
		assert.equal(await franklinDecentralizedMarketplaceContract.itemForSaleFromSellerExists(sellerAddress, keyItemIpfsHash), true,
			"Item requested to purchase should exist as an item for sale from the seller!");

		await franklinDecentralizedMarketplaceContract.setQuantityAvailableForSaleOfAnItem(keyItemIpfsHash, quantity + 2, {from: sellerAddress})
		assert.ok(await franklinDecentralizedMarketplaceContract.getQuantityAvailableForSaleOfAnItemBySeller(sellerAddress, keyItemIpfsHash) >= quantity,
			"Number of items available for sale from the seller is greater than or equal to the number requested to purchase from the buyer!");

		let priceOfItemInWei = 0.25 * ETH;
		// console.log('priceOfItemInWei =', priceOfItemInWei);
		// console.log('priceOfItemInWei.toString() =', priceOfItemInWei.toString());
		let priceOfItemInWeiBN = new BN(priceOfItemInWei.toString());
		// console.log('priceOfItemInWeiBN =', priceOfItemInWeiBN);
		// console.log('priceOfItemInWeiBN.toString() =', priceOfItemInWeiBN.toString());
		await franklinDecentralizedMarketplaceContract.setPriceOfItem(keyItemIpfsHash, priceOfItemInWeiBN, {from: sellerAddress});

		let returnedPriceOfItemInWeiBN = await franklinDecentralizedMarketplaceContract.getPriceOfItem(sellerAddress, keyItemIpfsHash);
		// console.log('returnedPriceOfItemInWeiBN =', returnedPriceOfItemInWeiBN);
		// console.log('returnedPriceOfItemInWeiBN.toString() =', returnedPriceOfItemInWeiBN.toString());
		assert.notEqual(returnedPriceOfItemInWeiBN, new BN(0), "Seller should have set a non-zero price for the item requested to purchase from the buyer!");

		let amountNeededToPurchaseItemsInWei = quantity * priceOfItemInWei;
		// console.log('amountNeededToPurchaseItemsInWei =', amountNeededToPurchaseItemsInWei);
		let amountBuyerSendsToPurchaseInWeiBN = new BN(amountNeededToPurchaseItemsInWei.toString());
		// console.log('amountBuyerSendsToPurchaseInWeiBN =', amountBuyerSendsToPurchaseInWeiBN);
		// console.log('amountBuyerSendsToPurchaseInWeiBN.toString() =', amountBuyerSendsToPurchaseInWeiBN.toString());

		assert.equal(await franklinDecentralizedMarketplaceMediationContract.mediatedSalesTransactionExists.call(mediatedSalesTransactionIpfsHash), false,
			"Given _mediatedSalesTransactionIpfsHash should not exist yet inside of Smart Contract!");
		assert.equal(await franklinDecentralizedMarketplaceMediationContract.mediatorExists.call(mediatorAddress), false,
			"Given Mediator Address should not exist as a Mediator!");

		try {
			await franklinDecentralizedMarketplaceMediationContract.purchaseItemWithMediator(sellerAddress, mediatorAddress, keyItemIpfsHash,
				mediatedSalesTransactionIpfsHash, quantity, {from: buyerAddress, value: amountBuyerSendsToPurchaseInWeiBN});
			assert.fail("Should not be able to execute this method when mediator address does not exist as a mediator!");
		} catch (error) {
			assert.ok(/revert/.test(error.message), "String 'revert' not present in error message!");
			assert.ok(/Given Mediator Address does not exist as a Mediator!/.test(error.message),
				"Appropriate error message not returned!");
		}
	});

	it("FranklinDecentralizedMarketplaceMediation : test purchaseItemWithMediator method - buyer sends amount of ETH/WEI equal to amount needed to purchase items and _mediatedSalesTransactionIpfsHash does not exist yet as a Mediated Sales Transaction in the Smart Contract", async () => {
		let buyerAddress = accounts[(randomAddressIndex + 1) % NUMBER_OF_ACCOUNTS];
		let sellerAddress = accounts[(randomAddressIndex + 2) % NUMBER_OF_ACCOUNTS];
		let mediatorAddress = accounts[(randomAddressIndex + 3) % NUMBER_OF_ACCOUNTS];
		let keyItemIpfsHash = "DummyItem_IpfsHash";
		let mediatedSalesTransactionIpfsHash = "DummyMediationSalesTransaction_IpfsHash";
		let quantity = 3;

		await franklinDecentralizedMarketplaceContract.addItemForSale(keyItemIpfsHash, {from: sellerAddress});
		assert.equal(await franklinDecentralizedMarketplaceContract.itemForSaleFromSellerExists(sellerAddress, keyItemIpfsHash), true,
			"Item requested to purchase should exist as an item for sale from the seller!");

		await franklinDecentralizedMarketplaceContract.setQuantityAvailableForSaleOfAnItem(keyItemIpfsHash, quantity + 2, {from: sellerAddress})
		assert.ok(await franklinDecentralizedMarketplaceContract.getQuantityAvailableForSaleOfAnItemBySeller(sellerAddress, keyItemIpfsHash) >= quantity,
			"Number of items available for sale from the seller is greater than or equal to the number requested to purchase from the buyer!");

		let priceOfItemInWei = 0.25 * ETH;
		// console.log('priceOfItemInWei =', priceOfItemInWei);
		// console.log('priceOfItemInWei.toString() =', priceOfItemInWei.toString());
		let priceOfItemInWeiBN = new BN(priceOfItemInWei.toString());
		// console.log('priceOfItemInWeiBN =', priceOfItemInWeiBN);
		// console.log('priceOfItemInWeiBN.toString() =', priceOfItemInWeiBN.toString());
		await franklinDecentralizedMarketplaceContract.setPriceOfItem(keyItemIpfsHash, priceOfItemInWeiBN, {from: sellerAddress});

		let returnedPriceOfItemInWeiBN = await franklinDecentralizedMarketplaceContract.getPriceOfItem(sellerAddress, keyItemIpfsHash);
		// console.log('returnedPriceOfItemInWeiBN =', returnedPriceOfItemInWeiBN);
		// console.log('returnedPriceOfItemInWeiBN.toString() =', returnedPriceOfItemInWeiBN.toString());
		assert.notEqual(returnedPriceOfItemInWeiBN, new BN(0), "Seller should have set a non-zero price for the item requested to purchase from the buyer!");

		let amountNeededToPurchaseItemsInWei = quantity * priceOfItemInWei;
		let amountNeededToPurchaseItemsInWeiBN = new BN(amountNeededToPurchaseItemsInWei.toString());
		// console.log('amountNeededToPurchaseItemsInWei =', amountNeededToPurchaseItemsInWei);
		// console.log('amountNeededToPurchaseItemsInWeiBN =', amountNeededToPurchaseItemsInWeiBN);
		// console.log('amountNeededToPurchaseItemsInWeiBN.toString() =', amountNeededToPurchaseItemsInWeiBN.toString());
		let amountBuyerSendsToPurchaseInWeiBN = amountNeededToPurchaseItemsInWeiBN;
		// console.log('amountBuyerSendsToPurchaseInWeiBN =', amountBuyerSendsToPurchaseInWeiBN);
		// console.log('amountBuyerSendsToPurchaseInWeiBN.toString() =', amountBuyerSendsToPurchaseInWeiBN.toString());

		assert.equal(await franklinDecentralizedMarketplaceMediationContract.mediatedSalesTransactionExists.call(mediatedSalesTransactionIpfsHash), false,
			"Given _mediatedSalesTransactionIpfsHash should not exist yet inside of Smart Contract!");

		let mediatorIpfsHashDescription = "DummyMediatorIpfsHashDescription";
		await franklinDecentralizedMarketplaceMediationContract.addOrUpdateMediator(mediatorIpfsHashDescription, {from: mediatorAddress})
		assert.equal(await franklinDecentralizedMarketplaceMediationContract.mediatorExists.call(mediatorAddress), true,
			"Given Mediator Address should exist as a Mediator!");

		assert.equal(await franklinDecentralizedMarketplaceMediationContract.numberOfMediationsMediatorInvolved.call(mediatorAddress), 0,
			"Number of mediations mediator has been involved should initially be zero in this case!");

		let buyerBalanceBeforePurchaseStr = await web3.eth.getBalance(buyerAddress);
		let buyerBalanceBeforePurchaseBN = new BN(buyerBalanceBeforePurchaseStr);
		// console.log('buyerBalanceBeforePurchaseStr =', buyerBalanceBeforePurchaseStr);
		// console.log('buyerBalanceBeforePurchaseBN =', buyerBalanceBeforePurchaseBN);
		// console.log('buyerBalanceBeforePurchaseBN.toString() =', buyerBalanceBeforePurchaseBN.toString());

		let mediationContractBalanceBeforePurchaseStr = await web3.eth.getBalance(franklinDecentralizedMarketplaceMediationContract.address);
		let mediationContractBalanceBeforePurchaseBN = new BN(mediationContractBalanceBeforePurchaseStr);
		// console.log('mediationContractBalanceBeforePurchaseStr =', mediationContractBalanceBeforePurchaseStr);
		// console.log('mediationContractBalanceBeforePurchaseBN =', mediationContractBalanceBeforePurchaseBN);
		// console.log('mediationContractBalanceBeforePurchaseBN.toString() =', mediationContractBalanceBeforePurchaseBN.toString());

		let results = await franklinDecentralizedMarketplaceMediationContract.purchaseItemWithMediator(sellerAddress, mediatorAddress, keyItemIpfsHash,
			mediatedSalesTransactionIpfsHash, quantity, {from: buyerAddress, value: amountBuyerSendsToPurchaseInWeiBN});

		// Make sure Smart Contract keeps track of the existence of the Mediated Sales Transaction so that it can be Approved or Disapproved by the
		// Buyer, Seller, and/or Mediator in the future.
		assert.equal(await franklinDecentralizedMarketplaceMediationContract.mediatedSalesTransactionExists.call(mediatedSalesTransactionIpfsHash), true,
			"Given _mediatedSalesTransactionIpfsHash should exist after successfully purchasing item(s) with mediator!");
		assert.equal(await franklinDecentralizedMarketplaceMediationContract.mediatedSalesTransactionAddresses.call(mediatedSalesTransactionIpfsHash, BUYER_INDEX),
			buyerAddress, `Given ${buyerAddress} should exist as a buyer for the ${mediatedSalesTransactionIpfsHash} Mediation Sales Transation ` +
			` under mediatedSalesTransactionAddresses[${mediatedSalesTransactionIpfsHash}][${BUYER_INDEX}]!`);
		assert.equal(await franklinDecentralizedMarketplaceMediationContract.mediatedSalesTransactionAddresses.call(mediatedSalesTransactionIpfsHash, SELLER_INDEX),
			sellerAddress, `Given ${sellerAddress} should exist as a seller for the ${mediatedSalesTransactionIpfsHash} Mediation Sales Transation ` +
			` under mediatedSalesTransactionAddresses[${mediatedSalesTransactionIpfsHash}][${SELLER_INDEX}]!`);
		assert.equal(await franklinDecentralizedMarketplaceMediationContract.mediatedSalesTransactionAddresses.call(mediatedSalesTransactionIpfsHash, MEDIATOR_INDEX),
			mediatorAddress, `Given ${mediatorAddress} should exist as a mediator for the ${mediatedSalesTransactionIpfsHash} Mediation Sales Transation ` +
			` under mediatedSalesTransactionAddresses[${mediatedSalesTransactionIpfsHash}][${MEDIATOR_INDEX}]!`);

		// Make sure that Smart Contract keeps track of what Mediated Sales Transactions each party has been involved.
		assert.equal(await franklinDecentralizedMarketplaceMediationContract.mediatedSalesTransactionsAddressInvolved.call(buyerAddress, 0),
			mediatedSalesTransactionIpfsHash, `Given ${mediatedSalesTransactionIpfsHash} Mediated Sales Transaction should exist as one of the ` +
			`Mediated Sales Transactions for the buyer in the mediatedSalesTransactionsAddressInvolved[${buyerAddress}] array!`);
		assert.equal(await franklinDecentralizedMarketplaceMediationContract.mediatedSalesTransactionsAddressInvolved.call(sellerAddress, 0),
			mediatedSalesTransactionIpfsHash, `Given ${mediatedSalesTransactionIpfsHash} Mediated Sales Transaction should exist as one of the ` +
			`Mediated Sales Transactions for the seller in the mediatedSalesTransactionsAddressInvolved[${sellerAddress}] array!`);
		assert.equal(await franklinDecentralizedMarketplaceMediationContract.mediatedSalesTransactionsAddressInvolved.call(mediatorAddress, 0),
			mediatedSalesTransactionIpfsHash, `Given ${mediatedSalesTransactionIpfsHash} Mediated Sales Transaction should exist as one of the ` +
			`Mediated Sales Transactions for the mediator in the mediatedSalesTransactionsAddressInvolved[${mediatorAddress}] array!`);

		// Make sure that the Smart Contract keeps track of the "amountNeededToPurchaseItemsInWeiBN" for the given "mediatedSalesTransactionIpfsHash"
		// Mediation Sales Transaction.
		let returnedMediatedSalesTransactionAmountBN = await franklinDecentralizedMarketplaceMediationContract.mediatedSalesTransactionAmount.call(
			mediatedSalesTransactionIpfsHash);
		// console.log('returnedMediatedSalesTransactionAmountBN =', returnedMediatedSalesTransactionAmountBN);
		// console.log('returnedMediatedSalesTransactionAmountBN.toString() =', returnedMediatedSalesTransactionAmountBN.toString());
		assert.equal(returnedMediatedSalesTransactionAmountBN.toString(), amountNeededToPurchaseItemsInWeiBN.toString(),
			`Given ${mediatedSalesTransactionIpfsHash} Mediated Sales Transaction amount needed to make purchase ` +
			`should be stored at mediatedSalesTransactionAmount[${mediatedSalesTransactionIpfsHash}]!`);

		// Make sure that the number of mediations that the mediator is involved is properly incremented by one.
		assert.equal(await franklinDecentralizedMarketplaceMediationContract.numberOfMediationsMediatorInvolved.call(mediatorAddress), 1,
			"Number of mediations mediator has been involved was not properly incremented!");

		// Make sure that the quantity available for sale of this item being sold by the seller is properly updated.
		assert.equal(await franklinDecentralizedMarketplaceContract.getQuantityAvailableForSaleOfAnItemBySeller(sellerAddress, keyItemIpfsHash), 2,
			"Quantity available for sale of this item being sold by the seller was not properly updated!");

		let buyerBalanceAfterPurchaseStr = await web3.eth.getBalance(buyerAddress);
		let buyerBalanceAfterPurchaseBN = new BN(buyerBalanceAfterPurchaseStr);
		// console.log('buyerBalanceAfterPurchaseStr =', buyerBalanceAfterPurchaseStr);
		// console.log('buyerBalanceAfterPurchaseBN =', buyerBalanceAfterPurchaseBN);
		// console.log('buyerBalanceAfterPurchaseBN.toString() =', buyerBalanceAfterPurchaseBN.toString());

		let mediationContractBalanceAfterPurchaseStr = await web3.eth.getBalance(franklinDecentralizedMarketplaceMediationContract.address);
		let mediationContractBalanceAfterPurchaseBN = new BN(mediationContractBalanceAfterPurchaseStr);
		// console.log('mediationContractBalanceAfterPurchaseStr =', mediationContractBalanceAfterPurchaseStr);
		// console.log('mediationContractBalanceAfterPurchaseBN =', mediationContractBalanceAfterPurchaseBN);
		// console.log('mediationContractBalanceAfterPurchaseBN.toString() =', mediationContractBalanceAfterPurchaseBN.toString());

		let cummulativeGasUsed = results.receipt.cumulativeGasUsed;
		// console.log('cummulativeGasUsed =', cummulativeGasUsed);

		let expectedBuyerBalanceAfterPurchaseBN = buyerBalanceBeforePurchaseBN.sub(amountNeededToPurchaseItemsInWeiBN); // subtract value spent
		expectedBuyerBalanceAfterPurchaseBN = expectedBuyerBalanceAfterPurchaseBN.sub(new BN(cummulativeGasUsed * GAS_BASE_UNIT)); // subtract gas spent
		let expectedMediationContractBalanceAfterPurchaseBN = mediationContractBalanceBeforePurchaseBN.add(amountNeededToPurchaseItemsInWeiBN);
		// console.log('expectedBuyerBalanceAfterPurchaseBN.toString() =', expectedBuyerBalanceAfterPurchaseBN.toString());
		// console.log('expectedMediationContractBalanceAfterPurchaseBN.toString() =', expectedMediationContractBalanceAfterPurchaseBN.toString());

		assert.equal(buyerBalanceAfterPurchaseBN.toString(), expectedBuyerBalanceAfterPurchaseBN.toString(),
			"Buyer Address balance after purchase is not correct!");
		assert.equal(mediationContractBalanceAfterPurchaseBN.toString(), expectedMediationContractBalanceAfterPurchaseBN.toString(),
			"FranklinDecentralizedMarketplaceMediation Contract balance after purchase is not correct!");

		// Making sure that PurchaseItemWithMediatorEvent(msg.sender, _sellerAddress, _mediatorAddress, _keyItemIpfsHash, _mediatedSalesTransactionIpfsHash, _quantity) fired off
		assert.equal(results.logs.length, 1, "There should have been one Event Fired Off!");
		assert.equal(results.logs[0].event, 'PurchaseItemWithMediatorEvent', "There should have been a PurchaseItemWithMediatorEvent Event Fired Off!");
		assert.ok(results.logs[0].args !== undefined, "There should have been a results.logs[0].args object!");
		assert.equal(results.logs[0].args.__length__, 6, "There should have been 6 arguments in the PurchaseItemWithoutMediatorEvent Event that Fired Off!");
		assert.equal(results.logs[0].args._msgSender, buyerAddress, "The _msgSender argument should be the Buyer Address!");
		assert.equal(results.logs[0].args._sellerAddress, sellerAddress, "The _sellerAddress argument should be the Seller Address!");
		assert.equal(results.logs[0].args._mediatorAddress, mediatorAddress, "The _mediatorAddress argument should be the Mediator Address!");
		assert.equal(results.logs[0].args._keyItemIpfsHash, keyItemIpfsHash, "The _keyItemIpfsHash argument should be IPFS Hash of Item bought!");
		assert.equal(results.logs[0].args._mediatedSalesTransactionIpfsHash, mediatedSalesTransactionIpfsHash, "The _mediatedSalesTransactionIpfsHash argument should be IPFS Hash of Item bought!");
		assert.equal(results.logs[0].args._quantity.toString(), quantity.toString(), "The _quantity argument should be quantity of the Items bought!");
	});

	it("FranklinDecentralizedMarketplaceMediation : test purchaseItemWithMediator method - given _mediatedSalesTransactionIpfsHash exists already as a Mediated Sales Transaction in the Smart Contract", async () => {
		let buyerAddress = accounts[(randomAddressIndex + 1) % NUMBER_OF_ACCOUNTS];
		let sellerAddress = accounts[(randomAddressIndex + 2) % NUMBER_OF_ACCOUNTS];
		let mediatorAddress = accounts[(randomAddressIndex + 3) % NUMBER_OF_ACCOUNTS];
		let keyItemIpfsHash = "DummyItem_IpfsHash";
		let mediatedSalesTransactionIpfsHash = "DummyMediationSalesTransaction_IpfsHash";
		let quantity = 3;

		await franklinDecentralizedMarketplaceContract.addItemForSale(keyItemIpfsHash, {from: sellerAddress});
		assert.equal(await franklinDecentralizedMarketplaceContract.itemForSaleFromSellerExists(sellerAddress, keyItemIpfsHash), true,
			"Item requested to purchase should exist as an item for sale from the seller!");

		await franklinDecentralizedMarketplaceContract.setQuantityAvailableForSaleOfAnItem(keyItemIpfsHash, quantity + 10, {from: sellerAddress})
		assert.ok(await franklinDecentralizedMarketplaceContract.getQuantityAvailableForSaleOfAnItemBySeller(sellerAddress, keyItemIpfsHash) >= quantity,
			"Number of items available for sale from the seller is greater than or equal to the number requested to purchase from the buyer!");

		let priceOfItemInWei = 0.25 * ETH;
		// console.log('priceOfItemInWei =', priceOfItemInWei);
		// console.log('priceOfItemInWei.toString() =', priceOfItemInWei.toString());
		let priceOfItemInWeiBN = new BN(priceOfItemInWei.toString());
		// console.log('priceOfItemInWeiBN =', priceOfItemInWeiBN);
		// console.log('priceOfItemInWeiBN.toString() =', priceOfItemInWeiBN.toString());
		await franklinDecentralizedMarketplaceContract.setPriceOfItem(keyItemIpfsHash, priceOfItemInWeiBN, {from: sellerAddress});

		let returnedPriceOfItemInWeiBN = await franklinDecentralizedMarketplaceContract.getPriceOfItem(sellerAddress, keyItemIpfsHash);
		// console.log('returnedPriceOfItemInWeiBN =', returnedPriceOfItemInWeiBN);
		// console.log('returnedPriceOfItemInWeiBN.toString() =', returnedPriceOfItemInWeiBN.toString());
		assert.notEqual(returnedPriceOfItemInWeiBN, new BN(0), "Seller should have set a non-zero price for the item requested to purchase from the buyer!");

		let amountNeededToPurchaseItemsInWei = quantity * priceOfItemInWei;
		let amountNeededToPurchaseItemsInWeiBN = new BN(amountNeededToPurchaseItemsInWei.toString());
		// console.log('amountNeededToPurchaseItemsInWei =', amountNeededToPurchaseItemsInWei);
		// console.log('amountNeededToPurchaseItemsInWeiBN =', amountNeededToPurchaseItemsInWeiBN);
		// console.log('amountNeededToPurchaseItemsInWeiBN.toString() =', amountNeededToPurchaseItemsInWeiBN.toString());
		let amountBuyerSendsToPurchaseInWeiBN = amountNeededToPurchaseItemsInWeiBN;
		// console.log('amountBuyerSendsToPurchaseInWeiBN =', amountBuyerSendsToPurchaseInWeiBN);
		// console.log('amountBuyerSendsToPurchaseInWeiBN.toString() =', amountBuyerSendsToPurchaseInWeiBN.toString());

		assert.equal(await franklinDecentralizedMarketplaceMediationContract.mediatedSalesTransactionExists.call(mediatedSalesTransactionIpfsHash), false,
			"Given _mediatedSalesTransactionIpfsHash should not exist yet inside of Smart Contract!");

		let mediatorIpfsHashDescription = "DummyMediatorIpfsHashDescription";
		await franklinDecentralizedMarketplaceMediationContract.addOrUpdateMediator(mediatorIpfsHashDescription, {from: mediatorAddress})
		assert.equal(await franklinDecentralizedMarketplaceMediationContract.mediatorExists.call(mediatorAddress), true,
			"Given Mediator Address should exist as a Mediator!");

		assert.equal(await franklinDecentralizedMarketplaceMediationContract.numberOfMediationsMediatorInvolved.call(mediatorAddress), 0,
			"Number of mediations mediator has been involved should initially be zero in this case!");

		// This needs to be executed so that the given "mediatedSalesTransactionIpfsHash" gets stored as an already existing Mediated Sales Transaction in the
		// Smart Contract.
		await franklinDecentralizedMarketplaceMediationContract.purchaseItemWithMediator(sellerAddress, mediatorAddress, keyItemIpfsHash,
			mediatedSalesTransactionIpfsHash, quantity, {from: buyerAddress, value: amountBuyerSendsToPurchaseInWeiBN});

		try {
			await franklinDecentralizedMarketplaceMediationContract.purchaseItemWithMediator(sellerAddress, mediatorAddress, keyItemIpfsHash,
				mediatedSalesTransactionIpfsHash, quantity, {from: buyerAddress, value: amountBuyerSendsToPurchaseInWeiBN});
			assert.fail("Should not be able to execute this method when the given _mediatedSalesTransactionIpfsHash exists already as a " +
				"Mediated Sales Transaction in the Smart Contract!");
		} catch (error) {
			assert.ok(/revert/.test(error.message), "String 'revert' not present in error message!");
			assert.ok(/Mediated Sales Transaction already exists!/.test(error.message),
				"Appropriate error message not returned!");
		}
	});

	it("FranklinDecentralizedMarketplaceMediation : test purchaseItemWithMediator method - buyer sends amount of ETH/WEI greater than amount needed to purchase items and _mediatedSalesTransactionIpfsHash does not exist yet as a Mediated Sales Transaction in the Smart Contract", async () => {
		let buyerAddress = accounts[(randomAddressIndex + 1) % NUMBER_OF_ACCOUNTS];
		let sellerAddress = accounts[(randomAddressIndex + 2) % NUMBER_OF_ACCOUNTS];
		let mediatorAddress = accounts[(randomAddressIndex + 3) % NUMBER_OF_ACCOUNTS];
		let keyItemIpfsHash = "DummyItem_IpfsHash";
		let mediatedSalesTransactionIpfsHash = "DummyMediationSalesTransaction_IpfsHash";
		let quantity = 3;

		await franklinDecentralizedMarketplaceContract.addItemForSale(keyItemIpfsHash, {from: sellerAddress});
		assert.equal(await franklinDecentralizedMarketplaceContract.itemForSaleFromSellerExists(sellerAddress, keyItemIpfsHash), true,
			"Item requested to purchase should exist as an item for sale from the seller!");

		await franklinDecentralizedMarketplaceContract.setQuantityAvailableForSaleOfAnItem(keyItemIpfsHash, quantity + 2, {from: sellerAddress})
		assert.ok(await franklinDecentralizedMarketplaceContract.getQuantityAvailableForSaleOfAnItemBySeller(sellerAddress, keyItemIpfsHash) >= quantity,
			"Number of items available for sale from the seller is greater than or equal to the number requested to purchase from the buyer!");

		let priceOfItemInWei = 0.25 * ETH;
		// console.log('priceOfItemInWei =', priceOfItemInWei);
		// console.log('priceOfItemInWei.toString() =', priceOfItemInWei.toString());
		let priceOfItemInWeiBN = new BN(priceOfItemInWei.toString());
		// console.log('priceOfItemInWeiBN =', priceOfItemInWeiBN);
		// console.log('priceOfItemInWeiBN.toString() =', priceOfItemInWeiBN.toString());
		await franklinDecentralizedMarketplaceContract.setPriceOfItem(keyItemIpfsHash, priceOfItemInWeiBN, {from: sellerAddress});

		let returnedPriceOfItemInWeiBN = await franklinDecentralizedMarketplaceContract.getPriceOfItem(sellerAddress, keyItemIpfsHash);
		// console.log('returnedPriceOfItemInWeiBN =', returnedPriceOfItemInWeiBN);
		// console.log('returnedPriceOfItemInWeiBN.toString() =', returnedPriceOfItemInWeiBN.toString());
		assert.notEqual(returnedPriceOfItemInWeiBN, new BN(0), "Seller should have set a non-zero price for the item requested to purchase from the buyer!");

		let amountNeededToPurchaseItemsInWei = quantity * priceOfItemInWei;
		let amountNeededToPurchaseItemsInWeiBN = new BN(amountNeededToPurchaseItemsInWei.toString());
		// console.log('amountNeededToPurchaseItemsInWei =', amountNeededToPurchaseItemsInWei);
		// console.log('amountNeededToPurchaseItemsInWeiBN =', amountNeededToPurchaseItemsInWeiBN);
		// console.log('amountNeededToPurchaseItemsInWeiBN.toString() =', amountNeededToPurchaseItemsInWeiBN.toString());
		let amountExtraInWei = 0.2 * ETH;
		let amountBuyerSendsToPurchaseInWeiBN = amountNeededToPurchaseItemsInWeiBN.add(new BN(amountExtraInWei.toString()));
		// console.log('amountBuyerSendsToPurchaseInWeiBN =', amountBuyerSendsToPurchaseInWeiBN);
		// console.log('amountBuyerSendsToPurchaseInWeiBN.toString() =', amountBuyerSendsToPurchaseInWeiBN.toString());

		assert.equal(await franklinDecentralizedMarketplaceMediationContract.mediatedSalesTransactionExists.call(mediatedSalesTransactionIpfsHash), false,
			"Given _mediatedSalesTransactionIpfsHash should not exist yet inside of Smart Contract!");

		let mediatorIpfsHashDescription = "DummyMediatorIpfsHashDescription";
		await franklinDecentralizedMarketplaceMediationContract.addOrUpdateMediator(mediatorIpfsHashDescription, {from: mediatorAddress})
		assert.equal(await franklinDecentralizedMarketplaceMediationContract.mediatorExists.call(mediatorAddress), true,
			"Given Mediator Address should exist as a Mediator!");

		assert.equal(await franklinDecentralizedMarketplaceMediationContract.numberOfMediationsMediatorInvolved.call(mediatorAddress), 0,
			"Number of mediations mediator has been involved should initially be zero in this case!");

		let buyerBalanceBeforePurchaseStr = await web3.eth.getBalance(buyerAddress);
		let buyerBalanceBeforePurchaseBN = new BN(buyerBalanceBeforePurchaseStr);
		// console.log('buyerBalanceBeforePurchaseStr =', buyerBalanceBeforePurchaseStr);
		// console.log('buyerBalanceBeforePurchaseBN =', buyerBalanceBeforePurchaseBN);
		// console.log('buyerBalanceBeforePurchaseBN.toString() =', buyerBalanceBeforePurchaseBN.toString());

		let mediationContractBalanceBeforePurchaseStr = await web3.eth.getBalance(franklinDecentralizedMarketplaceMediationContract.address);
		let mediationContractBalanceBeforePurchaseBN = new BN(mediationContractBalanceBeforePurchaseStr);
		// console.log('mediationContractBalanceBeforePurchaseStr =', mediationContractBalanceBeforePurchaseStr);
		// console.log('mediationContractBalanceBeforePurchaseBN =', mediationContractBalanceBeforePurchaseBN);
		// console.log('mediationContractBalanceBeforePurchaseBN.toString() =', mediationContractBalanceBeforePurchaseBN.toString());

		let results = await franklinDecentralizedMarketplaceMediationContract.purchaseItemWithMediator(sellerAddress, mediatorAddress, keyItemIpfsHash,
			mediatedSalesTransactionIpfsHash, quantity, {from: buyerAddress, value: amountBuyerSendsToPurchaseInWeiBN});

		// Make sure Smart Contract keeps track of the existence of the Mediated Sales Transaction so that it can be Approved or Disapproved by the
		// Buyer, Seller, and/or Mediator in the future.
		assert.equal(await franklinDecentralizedMarketplaceMediationContract.mediatedSalesTransactionExists.call(mediatedSalesTransactionIpfsHash), true,
			"Given _mediatedSalesTransactionIpfsHash should exist after successfully purchasing item(s) with mediator!");
		assert.equal(await franklinDecentralizedMarketplaceMediationContract.mediatedSalesTransactionAddresses.call(mediatedSalesTransactionIpfsHash, BUYER_INDEX),
			buyerAddress, `Given ${buyerAddress} should exist as a buyer for the ${mediatedSalesTransactionIpfsHash} Mediation Sales Transation ` +
			` under mediatedSalesTransactionAddresses[${mediatedSalesTransactionIpfsHash}][${BUYER_INDEX}]!`);
		assert.equal(await franklinDecentralizedMarketplaceMediationContract.mediatedSalesTransactionAddresses.call(mediatedSalesTransactionIpfsHash, SELLER_INDEX),
			sellerAddress, `Given ${sellerAddress} should exist as a seller for the ${mediatedSalesTransactionIpfsHash} Mediation Sales Transation ` +
			` under mediatedSalesTransactionAddresses[${mediatedSalesTransactionIpfsHash}][${SELLER_INDEX}]!`);
		assert.equal(await franklinDecentralizedMarketplaceMediationContract.mediatedSalesTransactionAddresses.call(mediatedSalesTransactionIpfsHash, MEDIATOR_INDEX),
			mediatorAddress, `Given ${mediatorAddress} should exist as a mediator for the ${mediatedSalesTransactionIpfsHash} Mediation Sales Transation ` +
			` under mediatedSalesTransactionAddresses[${mediatedSalesTransactionIpfsHash}][${MEDIATOR_INDEX}]!`);

		// Make sure that Smart Contract keeps track of what Mediated Sales Transactions each party has been involved.
		assert.equal(await franklinDecentralizedMarketplaceMediationContract.mediatedSalesTransactionsAddressInvolved.call(buyerAddress, 0),
			mediatedSalesTransactionIpfsHash, `Given ${mediatedSalesTransactionIpfsHash} Mediated Sales Transaction should exist as one of the ` +
			`Mediated Sales Transactions for the buyer in the mediatedSalesTransactionsAddressInvolved[${buyerAddress}] array!`);
		assert.equal(await franklinDecentralizedMarketplaceMediationContract.mediatedSalesTransactionsAddressInvolved.call(sellerAddress, 0),
			mediatedSalesTransactionIpfsHash, `Given ${mediatedSalesTransactionIpfsHash} Mediated Sales Transaction should exist as one of the ` +
			`Mediated Sales Transactions for the seller in the mediatedSalesTransactionsAddressInvolved[${sellerAddress}] array!`);
		assert.equal(await franklinDecentralizedMarketplaceMediationContract.mediatedSalesTransactionsAddressInvolved.call(mediatorAddress, 0),
			mediatedSalesTransactionIpfsHash, `Given ${mediatedSalesTransactionIpfsHash} Mediated Sales Transaction should exist as one of the ` +
			`Mediated Sales Transactions for the mediator in the mediatedSalesTransactionsAddressInvolved[${mediatorAddress}] array!`);

		// Make sure that the Smart Contract keeps track of the "amountNeededToPurchaseItemsInWeiBN" for the given "mediatedSalesTransactionIpfsHash"
		// Mediation Sales Transaction.
		let returnedMediatedSalesTransactionAmountBN = await franklinDecentralizedMarketplaceMediationContract.mediatedSalesTransactionAmount.call(
			mediatedSalesTransactionIpfsHash);
		// console.log('returnedMediatedSalesTransactionAmountBN =', returnedMediatedSalesTransactionAmountBN);
		// console.log('returnedMediatedSalesTransactionAmountBN.toString() =', returnedMediatedSalesTransactionAmountBN.toString());
		assert.equal(returnedMediatedSalesTransactionAmountBN.toString(), amountNeededToPurchaseItemsInWeiBN.toString(),
			`Given ${mediatedSalesTransactionIpfsHash} Mediated Sales Transaction amount needed to make purchase ` +
			`should be stored at mediatedSalesTransactionAmount[${mediatedSalesTransactionIpfsHash}]!`);

		// Make sure that the number of mediations that the mediator is involved is properly incremented by one.
		assert.equal(await franklinDecentralizedMarketplaceMediationContract.numberOfMediationsMediatorInvolved.call(mediatorAddress), 1,
			"Number of mediations mediator has been involved was not properly incremented!");

		// Make sure that the quantity available for sale of this item being sold by the seller is properly updated.
		assert.equal(await franklinDecentralizedMarketplaceContract.getQuantityAvailableForSaleOfAnItemBySeller(sellerAddress, keyItemIpfsHash), 2,
			"Quantity available for sale of this item being sold by the seller was not properly updated!");

		let buyerBalanceAfterPurchaseStr = await web3.eth.getBalance(buyerAddress);
		let buyerBalanceAfterPurchaseBN = new BN(buyerBalanceAfterPurchaseStr);
		// console.log('buyerBalanceAfterPurchaseStr =', buyerBalanceAfterPurchaseStr);
		// console.log('buyerBalanceAfterPurchaseBN =', buyerBalanceAfterPurchaseBN);
		// console.log('buyerBalanceAfterPurchaseBN.toString() =', buyerBalanceAfterPurchaseBN.toString());

		let mediationContractBalanceAfterPurchaseStr = await web3.eth.getBalance(franklinDecentralizedMarketplaceMediationContract.address);
		let mediationContractBalanceAfterPurchaseBN = new BN(mediationContractBalanceAfterPurchaseStr);
		// console.log('mediationContractBalanceAfterPurchaseStr =', mediationContractBalanceAfterPurchaseStr);
		// console.log('mediationContractBalanceAfterPurchaseBN =', mediationContractBalanceAfterPurchaseBN);
		// console.log('mediationContractBalanceAfterPurchaseBN.toString() =', mediationContractBalanceAfterPurchaseBN.toString());

		let cummulativeGasUsed = results.receipt.cumulativeGasUsed;
		// console.log('cummulativeGasUsed =', cummulativeGasUsed);

		let expectedBuyerBalanceAfterPurchaseBN = buyerBalanceBeforePurchaseBN.sub(amountNeededToPurchaseItemsInWeiBN); // subtract value spent
		expectedBuyerBalanceAfterPurchaseBN = expectedBuyerBalanceAfterPurchaseBN.sub(new BN(cummulativeGasUsed * GAS_BASE_UNIT)); // subtract gas spent
		let expectedMediationContractBalanceAfterPurchaseBN = mediationContractBalanceBeforePurchaseBN.add(amountNeededToPurchaseItemsInWeiBN);
		// console.log('expectedBuyerBalanceAfterPurchaseBN.toString() =', expectedBuyerBalanceAfterPurchaseBN.toString());
		// console.log('expectedMediationContractBalanceAfterPurchaseBN.toString() =', expectedMediationContractBalanceAfterPurchaseBN.toString());

		assert.equal(buyerBalanceAfterPurchaseBN.toString(), expectedBuyerBalanceAfterPurchaseBN.toString(),
			"Buyer Address balance after purchase is not correct!");
		assert.equal(mediationContractBalanceAfterPurchaseBN.toString(), expectedMediationContractBalanceAfterPurchaseBN.toString(),
			"FranklinDecentralizedMarketplaceMediation Contract balance after purchase is not correct!");

		// Making sure that PurchaseItemWithMediatorEvent(msg.sender, _sellerAddress, _mediatorAddress, _keyItemIpfsHash, _mediatedSalesTransactionIpfsHash, _quantity) fired off
		assert.equal(results.logs.length, 1, "There should have been one Event Fired Off!");
		assert.equal(results.logs[0].event, 'PurchaseItemWithMediatorEvent', "There should have been a PurchaseItemWithMediatorEvent Event Fired Off!");
		assert.ok(results.logs[0].args !== undefined, "There should have been a results.logs[0].args object!");
		assert.equal(results.logs[0].args.__length__, 6, "There should have been 6 arguments in the PurchaseItemWithoutMediatorEvent Event that Fired Off!");
		assert.equal(results.logs[0].args._msgSender, buyerAddress, "The _msgSender argument should be the Buyer Address!");
		assert.equal(results.logs[0].args._sellerAddress, sellerAddress, "The _sellerAddress argument should be the Seller Address!");
		assert.equal(results.logs[0].args._mediatorAddress, mediatorAddress, "The _mediatorAddress argument should be the Mediator Address!");
		assert.equal(results.logs[0].args._keyItemIpfsHash, keyItemIpfsHash, "The _keyItemIpfsHash argument should be IPFS Hash of Item bought!");
		assert.equal(results.logs[0].args._mediatedSalesTransactionIpfsHash, mediatedSalesTransactionIpfsHash, "The _mediatedSalesTransactionIpfsHash argument should be IPFS Hash of Item bought!");
		assert.equal(results.logs[0].args._quantity.toString(), quantity.toString(), "The _quantity argument should be quantity of the Items bought!");
	});

	it("FranklinDecentralizedMarketplaceMediation : test mediatedSalesTransactionHasBeenApproved method - given _mediatedSalesTransactionIpfsHash does not exist yet as a Mediated Sales Transaction in the Smart Contract", async () => {
		let mediatedSalesTransactionIpfsHash = "DummyMediationSalesTransaction_IpfsHash";
		assert.equal(await franklinDecentralizedMarketplaceMediationContract.mediatedSalesTransactionExists.call(mediatedSalesTransactionIpfsHash), false,
			"The given _mediatedSalesTransactionIpfsHash should not exist in the Smart Contract!");

		try {
			await franklinDecentralizedMarketplaceMediationContract.mediatedSalesTransactionHasBeenApproved(mediatedSalesTransactionIpfsHash);
			assert.fail("Should not be able to execute this method when _mediatedSalesTransactionIpfsHash does not exist in the Smart Contract!");
		} catch (error) {
			assert.ok(/revert/.test(error.message), "String 'revert' not present in error message!");
			assert.ok(/Given Mediated Sales Transaction IPFS Hash does not exist!/.test(error.message),
				"Appropriate error message not returned!");
		}
	});

	it("FranklinDecentralizedMarketplaceMediation : test mediatedSalesTransactionHasBeenApproved method - none of the involved parties have approved the given _mediatedSalesTransactionIpfsHash that exists as a Mediated Sales Transaction in the Smart Contract", async () => {
		let buyerAddress = accounts[(randomAddressIndex + 1) % NUMBER_OF_ACCOUNTS];
		let sellerAddress = accounts[(randomAddressIndex + 2) % NUMBER_OF_ACCOUNTS];
		let mediatorAddress = accounts[(randomAddressIndex + 3) % NUMBER_OF_ACCOUNTS];
		let keyItemIpfsHash = "DummyItem_IpfsHash";
		let mediatedSalesTransactionIpfsHash = "DummyMediationSalesTransaction_IpfsHash";
		let quantity = 3;

		await franklinDecentralizedMarketplaceContract.addItemForSale(keyItemIpfsHash, {from: sellerAddress});
		assert.equal(await franklinDecentralizedMarketplaceContract.itemForSaleFromSellerExists(sellerAddress, keyItemIpfsHash), true,
			"Item requested to purchase should exist as an item for sale from the seller!");

		await franklinDecentralizedMarketplaceContract.setQuantityAvailableForSaleOfAnItem(keyItemIpfsHash, quantity + 10, {from: sellerAddress})
		assert.ok(await franklinDecentralizedMarketplaceContract.getQuantityAvailableForSaleOfAnItemBySeller(sellerAddress, keyItemIpfsHash) >= quantity,
			"Number of items available for sale from the seller is greater than or equal to the number requested to purchase from the buyer!");

		let priceOfItemInWei = 0.25 * ETH;
		// console.log('priceOfItemInWei =', priceOfItemInWei);
		// console.log('priceOfItemInWei.toString() =', priceOfItemInWei.toString());
		let priceOfItemInWeiBN = new BN(priceOfItemInWei.toString());
		// console.log('priceOfItemInWeiBN =', priceOfItemInWeiBN);
		// console.log('priceOfItemInWeiBN.toString() =', priceOfItemInWeiBN.toString());
		await franklinDecentralizedMarketplaceContract.setPriceOfItem(keyItemIpfsHash, priceOfItemInWeiBN, {from: sellerAddress});

		let returnedPriceOfItemInWeiBN = await franklinDecentralizedMarketplaceContract.getPriceOfItem(sellerAddress, keyItemIpfsHash);
		// console.log('returnedPriceOfItemInWeiBN =', returnedPriceOfItemInWeiBN);
		// console.log('returnedPriceOfItemInWeiBN.toString() =', returnedPriceOfItemInWeiBN.toString());
		assert.notEqual(returnedPriceOfItemInWeiBN, new BN(0), "Seller should have set a non-zero price for the item requested to purchase from the buyer!");

		let amountNeededToPurchaseItemsInWei = quantity * priceOfItemInWei;
		let amountNeededToPurchaseItemsInWeiBN = new BN(amountNeededToPurchaseItemsInWei.toString());
		// console.log('amountNeededToPurchaseItemsInWei =', amountNeededToPurchaseItemsInWei);
		// console.log('amountNeededToPurchaseItemsInWeiBN =', amountNeededToPurchaseItemsInWeiBN);
		// console.log('amountNeededToPurchaseItemsInWeiBN.toString() =', amountNeededToPurchaseItemsInWeiBN.toString());
		let amountBuyerSendsToPurchaseInWeiBN = amountNeededToPurchaseItemsInWeiBN;
		// console.log('amountBuyerSendsToPurchaseInWeiBN =', amountBuyerSendsToPurchaseInWeiBN);
		// console.log('amountBuyerSendsToPurchaseInWeiBN.toString() =', amountBuyerSendsToPurchaseInWeiBN.toString());

		assert.equal(await franklinDecentralizedMarketplaceMediationContract.mediatedSalesTransactionExists.call(mediatedSalesTransactionIpfsHash), false,
			"Given _mediatedSalesTransactionIpfsHash should not exist yet inside of Smart Contract!");

		let mediatorIpfsHashDescription = "DummyMediatorIpfsHashDescription";
		await franklinDecentralizedMarketplaceMediationContract.addOrUpdateMediator(mediatorIpfsHashDescription, {from: mediatorAddress})
		assert.equal(await franklinDecentralizedMarketplaceMediationContract.mediatorExists.call(mediatorAddress), true,
			"Given Mediator Address should exist as a Mediator!");

		assert.equal(await franklinDecentralizedMarketplaceMediationContract.numberOfMediationsMediatorInvolved.call(mediatorAddress), 0,
			"Number of mediations mediator has been involved should initially be zero in this case!");

		// This needs to be executed so that the given "mediatedSalesTransactionIpfsHash" gets stored as an already existing Mediated Sales Transaction in the
		// Smart Contract.
		await franklinDecentralizedMarketplaceMediationContract.purchaseItemWithMediator(sellerAddress, mediatorAddress, keyItemIpfsHash,
			mediatedSalesTransactionIpfsHash, quantity, {from: buyerAddress, value: amountBuyerSendsToPurchaseInWeiBN});

		assert.equal(await franklinDecentralizedMarketplaceMediationContract.mediatedSalesTransactionExists.call(mediatedSalesTransactionIpfsHash), true,
			"The given _mediatedSalesTransactionIpfsHash should exist in the Smart Contract!");

		assert.equal(await franklinDecentralizedMarketplaceMediationContract.mediatedSalesTransactionHasBeenApproved(mediatedSalesTransactionIpfsHash), false,
			"The given _mediatedSalesTransactionIpfsHash Mediated Sales Transaction should NOT be in the Approved state when none of the involved " +
			"parties have approved the given _mediatedSalesTransactionIpfsHash Mediated Sales Transaction!");
	});

	it("FranklinDecentralizedMarketplaceMediation : test mediatedSalesTransactionHasBeenDisapproved method - given _mediatedSalesTransactionIpfsHash does not exist yet as a Mediated Sales Transaction in the Smart Contract", async () => {
		let mediatedSalesTransactionIpfsHash = "DummyMediationSalesTransaction_IpfsHash";
		assert.equal(await franklinDecentralizedMarketplaceMediationContract.mediatedSalesTransactionExists.call(mediatedSalesTransactionIpfsHash), false,
			"The given _mediatedSalesTransactionIpfsHash should not exist in the Smart Contract!");

		try {
			await franklinDecentralizedMarketplaceMediationContract.mediatedSalesTransactionHasBeenDisapproved(mediatedSalesTransactionIpfsHash);
			assert.fail("Should not be able to execute this method when _mediatedSalesTransactionIpfsHash does not exist in the Smart Contract!");
		} catch (error) {
			assert.ok(/revert/.test(error.message), "String 'revert' not present in error message!");
			assert.ok(/Given Mediated Sales Transaction IPFS Hash does not exist!/.test(error.message),
				"Appropriate error message not returned!");
		}
	});

	it("FranklinDecentralizedMarketplaceMediation : test mediatedSalesTransactionHasBeenDisapproved method - none of the involved parties have disapproved the given _mediatedSalesTransactionIpfsHash that exists as a Mediated Sales Transaction in the Smart Contract", async () => {
		let buyerAddress = accounts[(randomAddressIndex + 1) % NUMBER_OF_ACCOUNTS];
		let sellerAddress = accounts[(randomAddressIndex + 2) % NUMBER_OF_ACCOUNTS];
		let mediatorAddress = accounts[(randomAddressIndex + 3) % NUMBER_OF_ACCOUNTS];
		let keyItemIpfsHash = "DummyItem_IpfsHash";
		let mediatedSalesTransactionIpfsHash = "DummyMediationSalesTransaction_IpfsHash";
		let quantity = 3;

		await franklinDecentralizedMarketplaceContract.addItemForSale(keyItemIpfsHash, {from: sellerAddress});
		assert.equal(await franklinDecentralizedMarketplaceContract.itemForSaleFromSellerExists(sellerAddress, keyItemIpfsHash), true,
			"Item requested to purchase should exist as an item for sale from the seller!");

		await franklinDecentralizedMarketplaceContract.setQuantityAvailableForSaleOfAnItem(keyItemIpfsHash, quantity + 10, {from: sellerAddress})
		assert.ok(await franklinDecentralizedMarketplaceContract.getQuantityAvailableForSaleOfAnItemBySeller(sellerAddress, keyItemIpfsHash) >= quantity,
			"Number of items available for sale from the seller is greater than or equal to the number requested to purchase from the buyer!");

		let priceOfItemInWei = 0.25 * ETH;
		// console.log('priceOfItemInWei =', priceOfItemInWei);
		// console.log('priceOfItemInWei.toString() =', priceOfItemInWei.toString());
		let priceOfItemInWeiBN = new BN(priceOfItemInWei.toString());
		// console.log('priceOfItemInWeiBN =', priceOfItemInWeiBN);
		// console.log('priceOfItemInWeiBN.toString() =', priceOfItemInWeiBN.toString());
		await franklinDecentralizedMarketplaceContract.setPriceOfItem(keyItemIpfsHash, priceOfItemInWeiBN, {from: sellerAddress});

		let returnedPriceOfItemInWeiBN = await franklinDecentralizedMarketplaceContract.getPriceOfItem(sellerAddress, keyItemIpfsHash);
		// console.log('returnedPriceOfItemInWeiBN =', returnedPriceOfItemInWeiBN);
		// console.log('returnedPriceOfItemInWeiBN.toString() =', returnedPriceOfItemInWeiBN.toString());
		assert.notEqual(returnedPriceOfItemInWeiBN, new BN(0), "Seller should have set a non-zero price for the item requested to purchase from the buyer!");

		let amountNeededToPurchaseItemsInWei = quantity * priceOfItemInWei;
		let amountNeededToPurchaseItemsInWeiBN = new BN(amountNeededToPurchaseItemsInWei.toString());
		// console.log('amountNeededToPurchaseItemsInWei =', amountNeededToPurchaseItemsInWei);
		// console.log('amountNeededToPurchaseItemsInWeiBN =', amountNeededToPurchaseItemsInWeiBN);
		// console.log('amountNeededToPurchaseItemsInWeiBN.toString() =', amountNeededToPurchaseItemsInWeiBN.toString());
		let amountBuyerSendsToPurchaseInWeiBN = amountNeededToPurchaseItemsInWeiBN;
		// console.log('amountBuyerSendsToPurchaseInWeiBN =', amountBuyerSendsToPurchaseInWeiBN);
		// console.log('amountBuyerSendsToPurchaseInWeiBN.toString() =', amountBuyerSendsToPurchaseInWeiBN.toString());

		assert.equal(await franklinDecentralizedMarketplaceMediationContract.mediatedSalesTransactionExists.call(mediatedSalesTransactionIpfsHash), false,
			"Given _mediatedSalesTransactionIpfsHash should not exist yet inside of Smart Contract!");

		let mediatorIpfsHashDescription = "DummyMediatorIpfsHashDescription";
		await franklinDecentralizedMarketplaceMediationContract.addOrUpdateMediator(mediatorIpfsHashDescription, {from: mediatorAddress})
		assert.equal(await franklinDecentralizedMarketplaceMediationContract.mediatorExists.call(mediatorAddress), true,
			"Given Mediator Address should exist as a Mediator!");

		assert.equal(await franklinDecentralizedMarketplaceMediationContract.numberOfMediationsMediatorInvolved.call(mediatorAddress), 0,
			"Number of mediations mediator has been involved should initially be zero in this case!");

		// This needs to be executed so that the given "mediatedSalesTransactionIpfsHash" gets stored as an already existing Mediated Sales Transaction in the
		// Smart Contract.
		await franklinDecentralizedMarketplaceMediationContract.purchaseItemWithMediator(sellerAddress, mediatorAddress, keyItemIpfsHash,
			mediatedSalesTransactionIpfsHash, quantity, {from: buyerAddress, value: amountBuyerSendsToPurchaseInWeiBN});

		assert.equal(await franklinDecentralizedMarketplaceMediationContract.mediatedSalesTransactionExists.call(mediatedSalesTransactionIpfsHash), true,
			"The given _mediatedSalesTransactionIpfsHash should exist in the Smart Contract!");

		assert.equal(await franklinDecentralizedMarketplaceMediationContract.mediatedSalesTransactionHasBeenDisapproved(mediatedSalesTransactionIpfsHash), false,
			"The given _mediatedSalesTransactionIpfsHash Mediated Sales Transaction should NOT be in the Disapproved state when none of the involved " +
			"parties have disapproved the given _mediatedSalesTransactionIpfsHash Mediated Sales Transaction!");
	});

	it("FranklinDecentralizedMarketplaceMediation : test approveMediatedSalesTransaction method - given _mediatedSalesTransactionIpfsHash does not exist yet as a Mediated Sales Transaction in the Smart Contract", async () => {
		let mediatedSalesTransactionIpfsHash = "DummyMediationSalesTransaction_IpfsHash";
		assert.equal(await franklinDecentralizedMarketplaceMediationContract.mediatedSalesTransactionExists.call(mediatedSalesTransactionIpfsHash), false,
			"The given _mediatedSalesTransactionIpfsHash should not exist in the Smart Contract!");

		try {
			await franklinDecentralizedMarketplaceMediationContract.approveMediatedSalesTransaction(
				mediatedSalesTransactionIpfsHash, {from: accounts[(randomAddressIndex + 1) % NUMBER_OF_ACCOUNTS]});
			assert.fail("Should not be able to execute this method when _mediatedSalesTransactionIpfsHash does not exist in the Smart Contract!");
		} catch (error) {
			assert.ok(/revert/.test(error.message), "String 'revert' not present in error message!");
			assert.ok(/Given Mediated Sales Transaction IPFS Hash does not exist!/.test(error.message),
				"Appropriate error message not returned!");
		}
	});

	it("FranklinDecentralizedMarketplaceMediation : test approveMediatedSalesTransaction method - message sender is neither the buyer, seller, or mediator address of the given _mediatedSalesTransactionIpfsHash that exists as a Mediated Sales Transaction in the Smart Contract", async () => {
		let buyerAddress = accounts[(randomAddressIndex + 1) % NUMBER_OF_ACCOUNTS];
		let sellerAddress = accounts[(randomAddressIndex + 2) % NUMBER_OF_ACCOUNTS];
		let mediatorAddress = accounts[(randomAddressIndex + 3) % NUMBER_OF_ACCOUNTS];
		let keyItemIpfsHash = "DummyItem_IpfsHash";
		let mediatedSalesTransactionIpfsHash = "DummyMediationSalesTransaction_IpfsHash";
		let quantity = 3;

		await franklinDecentralizedMarketplaceContract.addItemForSale(keyItemIpfsHash, {from: sellerAddress});
		assert.equal(await franklinDecentralizedMarketplaceContract.itemForSaleFromSellerExists(sellerAddress, keyItemIpfsHash), true,
			"Item requested to purchase should exist as an item for sale from the seller!");

		await franklinDecentralizedMarketplaceContract.setQuantityAvailableForSaleOfAnItem(keyItemIpfsHash, quantity + 10, {from: sellerAddress})
		assert.ok(await franklinDecentralizedMarketplaceContract.getQuantityAvailableForSaleOfAnItemBySeller(sellerAddress, keyItemIpfsHash) >= quantity,
			"Number of items available for sale from the seller is greater than or equal to the number requested to purchase from the buyer!");

		let priceOfItemInWei = 0.25 * ETH;
		// console.log('priceOfItemInWei =', priceOfItemInWei);
		// console.log('priceOfItemInWei.toString() =', priceOfItemInWei.toString());
		let priceOfItemInWeiBN = new BN(priceOfItemInWei.toString());
		// console.log('priceOfItemInWeiBN =', priceOfItemInWeiBN);
		// console.log('priceOfItemInWeiBN.toString() =', priceOfItemInWeiBN.toString());
		await franklinDecentralizedMarketplaceContract.setPriceOfItem(keyItemIpfsHash, priceOfItemInWeiBN, {from: sellerAddress});

		let returnedPriceOfItemInWeiBN = await franklinDecentralizedMarketplaceContract.getPriceOfItem(sellerAddress, keyItemIpfsHash);
		// console.log('returnedPriceOfItemInWeiBN =', returnedPriceOfItemInWeiBN);
		// console.log('returnedPriceOfItemInWeiBN.toString() =', returnedPriceOfItemInWeiBN.toString());
		assert.notEqual(returnedPriceOfItemInWeiBN, new BN(0), "Seller should have set a non-zero price for the item requested to purchase from the buyer!");

		let amountNeededToPurchaseItemsInWei = quantity * priceOfItemInWei;
		let amountNeededToPurchaseItemsInWeiBN = new BN(amountNeededToPurchaseItemsInWei.toString());
		// console.log('amountNeededToPurchaseItemsInWei =', amountNeededToPurchaseItemsInWei);
		// console.log('amountNeededToPurchaseItemsInWeiBN =', amountNeededToPurchaseItemsInWeiBN);
		// console.log('amountNeededToPurchaseItemsInWeiBN.toString() =', amountNeededToPurchaseItemsInWeiBN.toString());
		let amountBuyerSendsToPurchaseInWeiBN = amountNeededToPurchaseItemsInWeiBN;
		// console.log('amountBuyerSendsToPurchaseInWeiBN =', amountBuyerSendsToPurchaseInWeiBN);
		// console.log('amountBuyerSendsToPurchaseInWeiBN.toString() =', amountBuyerSendsToPurchaseInWeiBN.toString());

		assert.equal(await franklinDecentralizedMarketplaceMediationContract.mediatedSalesTransactionExists.call(mediatedSalesTransactionIpfsHash), false,
			"Given _mediatedSalesTransactionIpfsHash should not exist yet inside of Smart Contract!");

		let mediatorIpfsHashDescription = "DummyMediatorIpfsHashDescription";
		await franklinDecentralizedMarketplaceMediationContract.addOrUpdateMediator(mediatorIpfsHashDescription, {from: mediatorAddress})
		assert.equal(await franklinDecentralizedMarketplaceMediationContract.mediatorExists.call(mediatorAddress), true,
			"Given Mediator Address should exist as a Mediator!");

		assert.equal(await franklinDecentralizedMarketplaceMediationContract.numberOfMediationsMediatorInvolved.call(mediatorAddress), 0,
			"Number of mediations mediator has been involved should initially be zero in this case!");

		// This needs to be executed so that the given "mediatedSalesTransactionIpfsHash" gets stored as an already existing Mediated Sales Transaction in the
		// Smart Contract.
		await franklinDecentralizedMarketplaceMediationContract.purchaseItemWithMediator(sellerAddress, mediatorAddress, keyItemIpfsHash,
			mediatedSalesTransactionIpfsHash, quantity, {from: buyerAddress, value: amountBuyerSendsToPurchaseInWeiBN});

		assert.equal(await franklinDecentralizedMarketplaceMediationContract.mediatedSalesTransactionExists.call(mediatedSalesTransactionIpfsHash), true,
			"The given _mediatedSalesTransactionIpfsHash should exist in the Smart Contract!");

		try {
			await franklinDecentralizedMarketplaceMediationContract.approveMediatedSalesTransaction(
				mediatedSalesTransactionIpfsHash, {from: accounts[(randomAddressIndex + 4) % NUMBER_OF_ACCOUNTS]});
			assert.fail("Should not be able to execute this method when Message Sender is neither the Buyer, Seller, nor Mediator Address!");
		} catch (error) {
			assert.ok(/revert/.test(error.message), "String 'revert' not present in error message!");
			assert.ok(/Not allowed to Approve Mediated Sales Transaction, because Message Sender is neither the Buyer, Seller, or Mediator!/.test(error.message),
				"Appropriate error message not returned!");
		}
	});

	it("FranklinDecentralizedMarketplaceMediation : test approveMediatedSalesTransaction method - nobody has yet done approval and message sender is the buyer address of the given _mediatedSalesTransactionIpfsHash that exists as a Mediated Sales Transaction in the Smart Contract", async () => {
		let buyerAddress = accounts[(randomAddressIndex + 1) % NUMBER_OF_ACCOUNTS];
		let sellerAddress = accounts[(randomAddressIndex + 2) % NUMBER_OF_ACCOUNTS];
		let mediatorAddress = accounts[(randomAddressIndex + 3) % NUMBER_OF_ACCOUNTS];
		let keyItemIpfsHash = "DummyItem_IpfsHash";
		let mediatedSalesTransactionIpfsHash = "DummyMediationSalesTransaction_IpfsHash";
		let quantity = 3;

		await franklinDecentralizedMarketplaceContract.addItemForSale(keyItemIpfsHash, {from: sellerAddress});
		assert.equal(await franklinDecentralizedMarketplaceContract.itemForSaleFromSellerExists(sellerAddress, keyItemIpfsHash), true,
			"Item requested to purchase should exist as an item for sale from the seller!");

		await franklinDecentralizedMarketplaceContract.setQuantityAvailableForSaleOfAnItem(keyItemIpfsHash, quantity + 10, {from: sellerAddress})
		assert.ok(await franklinDecentralizedMarketplaceContract.getQuantityAvailableForSaleOfAnItemBySeller(sellerAddress, keyItemIpfsHash) >= quantity,
			"Number of items available for sale from the seller is greater than or equal to the number requested to purchase from the buyer!");

		let priceOfItemInWei = 0.25 * ETH;
		// console.log('priceOfItemInWei =', priceOfItemInWei);
		// console.log('priceOfItemInWei.toString() =', priceOfItemInWei.toString());
		let priceOfItemInWeiBN = new BN(priceOfItemInWei.toString());
		// console.log('priceOfItemInWeiBN =', priceOfItemInWeiBN);
		// console.log('priceOfItemInWeiBN.toString() =', priceOfItemInWeiBN.toString());
		await franklinDecentralizedMarketplaceContract.setPriceOfItem(keyItemIpfsHash, priceOfItemInWeiBN, {from: sellerAddress});

		let returnedPriceOfItemInWeiBN = await franklinDecentralizedMarketplaceContract.getPriceOfItem(sellerAddress, keyItemIpfsHash);
		// console.log('returnedPriceOfItemInWeiBN =', returnedPriceOfItemInWeiBN);
		// console.log('returnedPriceOfItemInWeiBN.toString() =', returnedPriceOfItemInWeiBN.toString());
		assert.notEqual(returnedPriceOfItemInWeiBN, new BN(0), "Seller should have set a non-zero price for the item requested to purchase from the buyer!");

		let amountNeededToPurchaseItemsInWei = quantity * priceOfItemInWei;
		let amountNeededToPurchaseItemsInWeiBN = new BN(amountNeededToPurchaseItemsInWei.toString());
		// console.log('amountNeededToPurchaseItemsInWei =', amountNeededToPurchaseItemsInWei);
		// console.log('amountNeededToPurchaseItemsInWeiBN =', amountNeededToPurchaseItemsInWeiBN);
		// console.log('amountNeededToPurchaseItemsInWeiBN.toString() =', amountNeededToPurchaseItemsInWeiBN.toString());
		let amountBuyerSendsToPurchaseInWeiBN = amountNeededToPurchaseItemsInWeiBN;
		// console.log('amountBuyerSendsToPurchaseInWeiBN =', amountBuyerSendsToPurchaseInWeiBN);
		// console.log('amountBuyerSendsToPurchaseInWeiBN.toString() =', amountBuyerSendsToPurchaseInWeiBN.toString());

		assert.equal(await franklinDecentralizedMarketplaceMediationContract.mediatedSalesTransactionExists.call(mediatedSalesTransactionIpfsHash), false,
			"Given _mediatedSalesTransactionIpfsHash should not exist yet inside of Smart Contract!");

		let mediatorIpfsHashDescription = "DummyMediatorIpfsHashDescription";
		await franklinDecentralizedMarketplaceMediationContract.addOrUpdateMediator(mediatorIpfsHashDescription, {from: mediatorAddress})
		assert.equal(await franklinDecentralizedMarketplaceMediationContract.mediatorExists.call(mediatorAddress), true,
			"Given Mediator Address should exist as a Mediator!");

		assert.equal(await franklinDecentralizedMarketplaceMediationContract.numberOfMediationsMediatorInvolved.call(mediatorAddress), 0,
			"Number of mediations mediator has been involved should initially be zero in this case!");

		// This needs to be executed so that the given "mediatedSalesTransactionIpfsHash" gets stored as an already existing Mediated Sales Transaction in the
		// Smart Contract.
		await franklinDecentralizedMarketplaceMediationContract.purchaseItemWithMediator(sellerAddress, mediatorAddress, keyItemIpfsHash,
			mediatedSalesTransactionIpfsHash, quantity, {from: buyerAddress, value: amountBuyerSendsToPurchaseInWeiBN});

		assert.equal(await franklinDecentralizedMarketplaceMediationContract.mediatedSalesTransactionExists.call(mediatedSalesTransactionIpfsHash), true,
			"The given _mediatedSalesTransactionIpfsHash should exist in the Smart Contract!");

		await franklinDecentralizedMarketplaceMediationContract.approveMediatedSalesTransaction(mediatedSalesTransactionIpfsHash, {from: buyerAddress});

		// Note the approval from the "msg.sender" Address. If one approves, than one cannot disapprove.
		assert.equal(await franklinDecentralizedMarketplaceMediationContract.mediatedSalesTransactionApprovedByParties.call(
			mediatedSalesTransactionIpfsHash, BUYER_INDEX), true,
			`The mediatedSalesTransactionApprovedByParties[${mediatedSalesTransactionIpfsHash}][${BUYER_INDEX}] should be boolean true!`);
		assert.equal(await franklinDecentralizedMarketplaceMediationContract.mediatedSalesTransactionDisapprovedByParties.call(
			mediatedSalesTransactionIpfsHash, BUYER_INDEX), false,
			`The mediatedSalesTransactionDisapprovedByParties[${mediatedSalesTransactionIpfsHash}][${BUYER_INDEX}] should be boolean false!`);

		assert.equal(await franklinDecentralizedMarketplaceMediationContract.mediatedSalesTransactionHasBeenApproved.call(mediatedSalesTransactionIpfsHash), false,
			"Mediated Sales Transaction should not be in the Approved State if only one party has signaled approval!");
	});

	it("FranklinDecentralizedMarketplaceMediation : test approveMediatedSalesTransaction method - buyer and seller addresses signal approval of the given _mediatedSalesTransactionIpfsHash that exists as a Mediated Sales Transaction in the Smart Contract", async () => {
		let buyerAddress = accounts[(randomAddressIndex + 1) % NUMBER_OF_ACCOUNTS];
		let sellerAddress = accounts[(randomAddressIndex + 2) % NUMBER_OF_ACCOUNTS];
		let mediatorAddress = accounts[(randomAddressIndex + 3) % NUMBER_OF_ACCOUNTS];
		let keyItemIpfsHash = "DummyItem_IpfsHash";
		let mediatedSalesTransactionIpfsHash = "DummyMediationSalesTransaction_IpfsHash";
		let quantity = 3;

		await franklinDecentralizedMarketplaceContract.addItemForSale(keyItemIpfsHash, {from: sellerAddress});
		assert.equal(await franklinDecentralizedMarketplaceContract.itemForSaleFromSellerExists(sellerAddress, keyItemIpfsHash), true,
			"Item requested to purchase should exist as an item for sale from the seller!");

		await franklinDecentralizedMarketplaceContract.setQuantityAvailableForSaleOfAnItem(keyItemIpfsHash, quantity + 10, {from: sellerAddress})
		assert.ok(await franklinDecentralizedMarketplaceContract.getQuantityAvailableForSaleOfAnItemBySeller(sellerAddress, keyItemIpfsHash) >= quantity,
			"Number of items available for sale from the seller is greater than or equal to the number requested to purchase from the buyer!");

		let priceOfItemInWei = 0.25 * ETH;
		// console.log('priceOfItemInWei =', priceOfItemInWei);
		// console.log('priceOfItemInWei.toString() =', priceOfItemInWei.toString());
		let priceOfItemInWeiBN = new BN(priceOfItemInWei.toString());
		// console.log('priceOfItemInWeiBN =', priceOfItemInWeiBN);
		// console.log('priceOfItemInWeiBN.toString() =', priceOfItemInWeiBN.toString());
		await franklinDecentralizedMarketplaceContract.setPriceOfItem(keyItemIpfsHash, priceOfItemInWeiBN, {from: sellerAddress});

		let returnedPriceOfItemInWeiBN = await franklinDecentralizedMarketplaceContract.getPriceOfItem(sellerAddress, keyItemIpfsHash);
		// console.log('returnedPriceOfItemInWeiBN =', returnedPriceOfItemInWeiBN);
		// console.log('returnedPriceOfItemInWeiBN.toString() =', returnedPriceOfItemInWeiBN.toString());
		assert.notEqual(returnedPriceOfItemInWeiBN, new BN(0), "Seller should have set a non-zero price for the item requested to purchase from the buyer!");

		let amountNeededToPurchaseItemsInWei = quantity * priceOfItemInWei;
		let amountNeededToPurchaseItemsInWeiBN = new BN(amountNeededToPurchaseItemsInWei.toString());
		// console.log('amountNeededToPurchaseItemsInWei =', amountNeededToPurchaseItemsInWei);
		// console.log('amountNeededToPurchaseItemsInWeiBN =', amountNeededToPurchaseItemsInWeiBN);
		// console.log('amountNeededToPurchaseItemsInWeiBN.toString() =', amountNeededToPurchaseItemsInWeiBN.toString());
		let amountBuyerSendsToPurchaseInWeiBN = amountNeededToPurchaseItemsInWeiBN;
		// console.log('amountBuyerSendsToPurchaseInWeiBN =', amountBuyerSendsToPurchaseInWeiBN);
		// console.log('amountBuyerSendsToPurchaseInWeiBN.toString() =', amountBuyerSendsToPurchaseInWeiBN.toString());

		assert.equal(await franklinDecentralizedMarketplaceMediationContract.mediatedSalesTransactionExists.call(mediatedSalesTransactionIpfsHash), false,
			"Given _mediatedSalesTransactionIpfsHash should not exist yet inside of Smart Contract!");

		let mediatorIpfsHashDescription = "DummyMediatorIpfsHashDescription";
		await franklinDecentralizedMarketplaceMediationContract.addOrUpdateMediator(mediatorIpfsHashDescription, {from: mediatorAddress})
		assert.equal(await franklinDecentralizedMarketplaceMediationContract.mediatorExists.call(mediatorAddress), true,
			"Given Mediator Address should exist as a Mediator!");

		assert.equal(await franklinDecentralizedMarketplaceMediationContract.numberOfMediationsMediatorInvolved.call(mediatorAddress), 0,
			"Number of mediations mediator has been involved should initially be zero in this case!");

		// This needs to be executed so that the given "mediatedSalesTransactionIpfsHash" gets stored as an already existing Mediated Sales Transaction in the
		// Smart Contract.
		await franklinDecentralizedMarketplaceMediationContract.purchaseItemWithMediator(sellerAddress, mediatorAddress, keyItemIpfsHash,
			mediatedSalesTransactionIpfsHash, quantity, {from: buyerAddress, value: amountBuyerSendsToPurchaseInWeiBN});

		assert.equal(await franklinDecentralizedMarketplaceMediationContract.mediatedSalesTransactionExists.call(mediatedSalesTransactionIpfsHash), true,
			"The given _mediatedSalesTransactionIpfsHash should exist in the Smart Contract!");

		// First Buyer signals Approval of Mediated Sales Transaction.
		await franklinDecentralizedMarketplaceMediationContract.approveMediatedSalesTransaction(mediatedSalesTransactionIpfsHash, {from: buyerAddress});

		// Note the approval from the "msg.sender" Address. If one approves, than one cannot disapprove.
		assert.equal(await franklinDecentralizedMarketplaceMediationContract.mediatedSalesTransactionApprovedByParties.call(
			mediatedSalesTransactionIpfsHash, BUYER_INDEX), true,
			`The mediatedSalesTransactionApprovedByParties[${mediatedSalesTransactionIpfsHash}][${BUYER_INDEX}] should be boolean true!`);
		assert.equal(await franklinDecentralizedMarketplaceMediationContract.mediatedSalesTransactionDisapprovedByParties.call(
			mediatedSalesTransactionIpfsHash, BUYER_INDEX), false,
			`The mediatedSalesTransactionDisapprovedByParties[${mediatedSalesTransactionIpfsHash}][${BUYER_INDEX}] should be boolean false!`);

		assert.equal(await franklinDecentralizedMarketplaceMediationContract.mediatedSalesTransactionHasBeenApproved.call(mediatedSalesTransactionIpfsHash), false,
			"Mediated Sales Transaction should not be in the Approved State if only one party has signaled approval!");

		let sellerBalanceBeforeApprovalStr = await web3.eth.getBalance(sellerAddress);
		let sellerBalanceBeforeApprovalBN = new BN(sellerBalanceBeforeApprovalStr);
		// console.log('sellerBalanceBeforeApprovalStr =', sellerBalanceBeforeApprovalStr);
		// console.log('sellerBalanceBeforeApprovalBN =', sellerBalanceBeforeApprovalBN);
		// console.log('sellerBalanceBeforeApprovalBN.toString() =', sellerBalanceBeforeApprovalBN.toString());

		let mediatorBalanceBeforeApprovalStr = await web3.eth.getBalance(mediatorAddress);
		let mediatorBalanceBeforeApprovalBN = new BN(mediatorBalanceBeforeApprovalStr);
		// console.log('mediatorBalanceBeforeApprovalStr =', mediatorBalanceBeforeApprovalStr);
		// console.log('mediatorBalanceBeforeApprovalBN =', mediatorBalanceBeforeApprovalBN);
		// console.log('mediatorBalanceBeforeApprovalBN.toString() =', mediatorBalanceBeforeApprovalBN.toString());

		let mediationContractBalanceBeforeApprovalStr = await web3.eth.getBalance(franklinDecentralizedMarketplaceMediationContract.address);
		let mediationContractBalanceBeforeApprovalBN = new BN(mediationContractBalanceBeforeApprovalStr);
		// console.log('mediationContractBalanceBeforeApprovalStr =', mediationContractBalanceBeforeApprovalStr);
		// console.log('mediationContractBalanceBeforeApprovalBN =', mediationContractBalanceBeforeApprovalBN);
		// console.log('mediationContractBalanceBeforeApprovalBN.toString() =', mediationContractBalanceBeforeApprovalBN.toString());

		// Second... Seller signals Approval of the Mediated Sales Transaction
		let results = await franklinDecentralizedMarketplaceMediationContract.approveMediatedSalesTransaction(mediatedSalesTransactionIpfsHash, {from: sellerAddress});

		let sellerBalanceAfterApprovalStr = await web3.eth.getBalance(sellerAddress);
		let sellerBalanceAfterApprovalBN = new BN(sellerBalanceAfterApprovalStr);
		// console.log('sellerBalanceAfterApprovalStr =', sellerBalanceAfterApprovalStr);
		// console.log('sellerBalanceAfterApprovalBN =', sellerBalanceAfterApprovalBN);
		// console.log('sellerBalanceAfterApprovalBN.toString() =', sellerBalanceAfterApprovalBN.toString());

		let mediatorBalanceAfterApprovalStr = await web3.eth.getBalance(mediatorAddress);
		let mediatorBalanceAfterApprovalBN = new BN(mediatorBalanceAfterApprovalStr);
		// console.log('mediatorBalanceAfterApprovalStr =', mediatorBalanceAfterApprovalStr);
		// console.log('mediatorBalanceAfterApprovalBN =', mediatorBalanceAfterApprovalBN);
		// console.log('mediatorBalanceAfterApprovalBN.toString() =', mediatorBalanceAfterApprovalBN.toString());

		let mediationContractBalanceAfterApprovalStr = await web3.eth.getBalance(franklinDecentralizedMarketplaceMediationContract.address);
		let mediationContractBalanceAfterApprovalBN = new BN(mediationContractBalanceAfterApprovalStr);
		// console.log('mediationContractBalanceAfterApprovalStr =', mediationContractBalanceAfterApprovalStr);
		// console.log('mediationContractBalanceAfterApprovalBN =', mediationContractBalanceAfterApprovalBN);
		// console.log('mediationContractBalanceAfterApprovalBN.toString() =', mediationContractBalanceAfterApprovalBN.toString());

		let amountOfWeiToSendMediatorBN = amountNeededToPurchaseItemsInWeiBN.mul(new BN(5)).div(new BN(100)); // 5% to mediator
		// console.log('amountOfWeiToSendMediatorBN.toString() =', amountOfWeiToSendMediatorBN.toString());
		let amountOfWeiToSendSellerBN = amountNeededToPurchaseItemsInWeiBN.sub(amountOfWeiToSendMediatorBN); // 95% to seller
		// console.log('amountOfWeiToSendSellerBN.toString() =', amountOfWeiToSendSellerBN.toString());

		let cummulativeGasUsed = results.receipt.cumulativeGasUsed;
		// console.log('cummulativeGasUsed =', cummulativeGasUsed);

		let expectedSellerBalanceAfterApprovalBN = sellerBalanceBeforeApprovalBN.add(amountOfWeiToSendSellerBN); // 95% to seller
		expectedSellerBalanceAfterApprovalBN = expectedSellerBalanceAfterApprovalBN.sub(new BN(cummulativeGasUsed * GAS_BASE_UNIT)); // subtract gas spent
		// console.log('expectedSellerBalanceAfterApprovalBN.toString() =', expectedSellerBalanceAfterApprovalBN.toString());

		let expectedMediatorBalanceAfterApprovalBN = mediatorBalanceBeforeApprovalBN.add(amountOfWeiToSendMediatorBN); // 5% to mediator
		// console.log('expectedMediatorBalanceAfterApprovalBN.toString() =', expectedMediatorBalanceAfterApprovalBN.toString());

		let expectedMediationContractBalanceAfterApprovalBN = mediationContractBalanceBeforeApprovalBN.sub(amountNeededToPurchaseItemsInWeiBN);
		// console.log('expectedMediationContractBalanceAfterApprovalBN.toString() =', expectedMediationContractBalanceAfterApprovalBN.toString());

		assert.equal(mediationContractBalanceAfterApprovalBN.toString(), expectedMediationContractBalanceAfterApprovalBN.toString(),
			"Mediation Contract Address Balance after approval is incorrect!");
		assert.equal(sellerBalanceAfterApprovalBN.toString(), expectedSellerBalanceAfterApprovalBN.toString(),
			"Seller Address Balance after approval is incorrect!");
		assert.equal(mediatorBalanceAfterApprovalBN.toString(), expectedMediatorBalanceAfterApprovalBN.toString(),
			"Mediator Address Balance after approval is incorrect!");

		// Note the approval from the "msg.sender" Address. If one approves, than one cannot disapprove.
		assert.equal(await franklinDecentralizedMarketplaceMediationContract.mediatedSalesTransactionApprovedByParties.call(
			mediatedSalesTransactionIpfsHash, SELLER_INDEX), true,
			`The mediatedSalesTransactionApprovedByParties[${mediatedSalesTransactionIpfsHash}][${SELLER_INDEX}] should be boolean true!`);
		assert.equal(await franklinDecentralizedMarketplaceMediationContract.mediatedSalesTransactionDisapprovedByParties.call(
			mediatedSalesTransactionIpfsHash, SELLER_INDEX), false,
			`The mediatedSalesTransactionDisapprovedByParties[${mediatedSalesTransactionIpfsHash}][${SELLER_INDEX}] should be boolean false!`);

		assert.equal(await franklinDecentralizedMarketplaceMediationContract.mediatedSalesTransactionHasBeenApproved.call(mediatedSalesTransactionIpfsHash), true,
			"Mediated Sales Transaction should now be in the Approved State because two parties have signaled approval!");

		// Making sure that MediatedSalesTransactionHasBeenFullyApprovedEvent(_mediatedSalesTransactionIpfsHash) fired off
		assert.equal(results.logs.length, 1, "There should have been one Event Fired Off!");
		assert.equal(results.logs[0].event, 'MediatedSalesTransactionHasBeenFullyApprovedEvent', "There should have been a MediatedSalesTransactionHasBeenFullyApprovedEvent Fired Off!");
		assert.ok(results.logs[0].args !== undefined, "There should have been a results.logs[0].args object!");
		assert.equal(results.logs[0].args.__length__, 1, "There should have been 1 argument(s) in the MediatedSalesTransactionHasBeenFullyApproved that Fired Off!");
		assert.equal(results.logs[0].args._mediatedSalesTransactionIpfsHash, mediatedSalesTransactionIpfsHash, "The _mediatedSalesTransactionIpfsHash argument should be IPFS Hash of Item bought!");
	});

	it("FranklinDecentralizedMarketplaceMediation : test approveMediatedSalesTransaction method - nobody has yet done approval and message sender is the seller address of the given _mediatedSalesTransactionIpfsHash that exists as a Mediated Sales Transaction in the Smart Contract", async () => {
		let buyerAddress = accounts[(randomAddressIndex + 1) % NUMBER_OF_ACCOUNTS];
		let sellerAddress = accounts[(randomAddressIndex + 2) % NUMBER_OF_ACCOUNTS];
		let mediatorAddress = accounts[(randomAddressIndex + 3) % NUMBER_OF_ACCOUNTS];
		let keyItemIpfsHash = "DummyItem_IpfsHash";
		let mediatedSalesTransactionIpfsHash = "DummyMediationSalesTransaction_IpfsHash";
		let quantity = 3;

		await franklinDecentralizedMarketplaceContract.addItemForSale(keyItemIpfsHash, {from: sellerAddress});
		assert.equal(await franklinDecentralizedMarketplaceContract.itemForSaleFromSellerExists(sellerAddress, keyItemIpfsHash), true,
			"Item requested to purchase should exist as an item for sale from the seller!");

		await franklinDecentralizedMarketplaceContract.setQuantityAvailableForSaleOfAnItem(keyItemIpfsHash, quantity + 10, {from: sellerAddress})
		assert.ok(await franklinDecentralizedMarketplaceContract.getQuantityAvailableForSaleOfAnItemBySeller(sellerAddress, keyItemIpfsHash) >= quantity,
			"Number of items available for sale from the seller is greater than or equal to the number requested to purchase from the buyer!");

		let priceOfItemInWei = 0.25 * ETH;
		// console.log('priceOfItemInWei =', priceOfItemInWei);
		// console.log('priceOfItemInWei.toString() =', priceOfItemInWei.toString());
		let priceOfItemInWeiBN = new BN(priceOfItemInWei.toString());
		// console.log('priceOfItemInWeiBN =', priceOfItemInWeiBN);
		// console.log('priceOfItemInWeiBN.toString() =', priceOfItemInWeiBN.toString());
		await franklinDecentralizedMarketplaceContract.setPriceOfItem(keyItemIpfsHash, priceOfItemInWeiBN, {from: sellerAddress});

		let returnedPriceOfItemInWeiBN = await franklinDecentralizedMarketplaceContract.getPriceOfItem(sellerAddress, keyItemIpfsHash);
		// console.log('returnedPriceOfItemInWeiBN =', returnedPriceOfItemInWeiBN);
		// console.log('returnedPriceOfItemInWeiBN.toString() =', returnedPriceOfItemInWeiBN.toString());
		assert.notEqual(returnedPriceOfItemInWeiBN, new BN(0), "Seller should have set a non-zero price for the item requested to purchase from the buyer!");

		let amountNeededToPurchaseItemsInWei = quantity * priceOfItemInWei;
		let amountNeededToPurchaseItemsInWeiBN = new BN(amountNeededToPurchaseItemsInWei.toString());
		// console.log('amountNeededToPurchaseItemsInWei =', amountNeededToPurchaseItemsInWei);
		// console.log('amountNeededToPurchaseItemsInWeiBN =', amountNeededToPurchaseItemsInWeiBN);
		// console.log('amountNeededToPurchaseItemsInWeiBN.toString() =', amountNeededToPurchaseItemsInWeiBN.toString());
		let amountBuyerSendsToPurchaseInWeiBN = amountNeededToPurchaseItemsInWeiBN;
		// console.log('amountBuyerSendsToPurchaseInWeiBN =', amountBuyerSendsToPurchaseInWeiBN);
		// console.log('amountBuyerSendsToPurchaseInWeiBN.toString() =', amountBuyerSendsToPurchaseInWeiBN.toString());

		assert.equal(await franklinDecentralizedMarketplaceMediationContract.mediatedSalesTransactionExists.call(mediatedSalesTransactionIpfsHash), false,
			"Given _mediatedSalesTransactionIpfsHash should not exist yet inside of Smart Contract!");

		let mediatorIpfsHashDescription = "DummyMediatorIpfsHashDescription";
		await franklinDecentralizedMarketplaceMediationContract.addOrUpdateMediator(mediatorIpfsHashDescription, {from: mediatorAddress})
		assert.equal(await franklinDecentralizedMarketplaceMediationContract.mediatorExists.call(mediatorAddress), true,
			"Given Mediator Address should exist as a Mediator!");

		assert.equal(await franklinDecentralizedMarketplaceMediationContract.numberOfMediationsMediatorInvolved.call(mediatorAddress), 0,
			"Number of mediations mediator has been involved should initially be zero in this case!");

		// This needs to be executed so that the given "mediatedSalesTransactionIpfsHash" gets stored as an already existing Mediated Sales Transaction in the
		// Smart Contract.
		await franklinDecentralizedMarketplaceMediationContract.purchaseItemWithMediator(sellerAddress, mediatorAddress, keyItemIpfsHash,
			mediatedSalesTransactionIpfsHash, quantity, {from: buyerAddress, value: amountBuyerSendsToPurchaseInWeiBN});

		assert.equal(await franklinDecentralizedMarketplaceMediationContract.mediatedSalesTransactionExists.call(mediatedSalesTransactionIpfsHash), true,
			"The given _mediatedSalesTransactionIpfsHash should exist in the Smart Contract!");

		await franklinDecentralizedMarketplaceMediationContract.approveMediatedSalesTransaction(mediatedSalesTransactionIpfsHash, {from: sellerAddress});

		// Note the approval from the "msg.sender" Address. If one approves, than one cannot disapprove.
		assert.equal(await franklinDecentralizedMarketplaceMediationContract.mediatedSalesTransactionApprovedByParties.call(
			mediatedSalesTransactionIpfsHash, SELLER_INDEX), true,
			`The mediatedSalesTransactionApprovedByParties[${mediatedSalesTransactionIpfsHash}][${SELLER_INDEX}] should be boolean true!`);
		assert.equal(await franklinDecentralizedMarketplaceMediationContract.mediatedSalesTransactionDisapprovedByParties.call(
			mediatedSalesTransactionIpfsHash, SELLER_INDEX), false,
			`The mediatedSalesTransactionDisapprovedByParties[${mediatedSalesTransactionIpfsHash}][${SELLER_INDEX}] should be boolean false!`);

		assert.equal(await franklinDecentralizedMarketplaceMediationContract.mediatedSalesTransactionHasBeenApproved.call(mediatedSalesTransactionIpfsHash), false,
			"Mediated Sales Transaction should not be in the Approved State if only one party has signaled approval!");
	});

	it("FranklinDecentralizedMarketplaceMediation : test approveMediatedSalesTransaction method - seller and mediator addresses signal approval of the given _mediatedSalesTransactionIpfsHash that exists as a Mediated Sales Transaction in the Smart Contract", async () => {
		let buyerAddress = accounts[(randomAddressIndex + 1) % NUMBER_OF_ACCOUNTS];
		let sellerAddress = accounts[(randomAddressIndex + 2) % NUMBER_OF_ACCOUNTS];
		let mediatorAddress = accounts[(randomAddressIndex + 3) % NUMBER_OF_ACCOUNTS];
		let keyItemIpfsHash = "DummyItem_IpfsHash";
		let mediatedSalesTransactionIpfsHash = "DummyMediationSalesTransaction_IpfsHash";
		let quantity = 3;

		await franklinDecentralizedMarketplaceContract.addItemForSale(keyItemIpfsHash, {from: sellerAddress});
		assert.equal(await franklinDecentralizedMarketplaceContract.itemForSaleFromSellerExists(sellerAddress, keyItemIpfsHash), true,
			"Item requested to purchase should exist as an item for sale from the seller!");

		await franklinDecentralizedMarketplaceContract.setQuantityAvailableForSaleOfAnItem(keyItemIpfsHash, quantity + 10, {from: sellerAddress})
		assert.ok(await franklinDecentralizedMarketplaceContract.getQuantityAvailableForSaleOfAnItemBySeller(sellerAddress, keyItemIpfsHash) >= quantity,
			"Number of items available for sale from the seller is greater than or equal to the number requested to purchase from the buyer!");

		let priceOfItemInWei = 0.25 * ETH;
		// console.log('priceOfItemInWei =', priceOfItemInWei);
		// console.log('priceOfItemInWei.toString() =', priceOfItemInWei.toString());
		let priceOfItemInWeiBN = new BN(priceOfItemInWei.toString());
		// console.log('priceOfItemInWeiBN =', priceOfItemInWeiBN);
		// console.log('priceOfItemInWeiBN.toString() =', priceOfItemInWeiBN.toString());
		await franklinDecentralizedMarketplaceContract.setPriceOfItem(keyItemIpfsHash, priceOfItemInWeiBN, {from: sellerAddress});

		let returnedPriceOfItemInWeiBN = await franklinDecentralizedMarketplaceContract.getPriceOfItem(sellerAddress, keyItemIpfsHash);
		// console.log('returnedPriceOfItemInWeiBN =', returnedPriceOfItemInWeiBN);
		// console.log('returnedPriceOfItemInWeiBN.toString() =', returnedPriceOfItemInWeiBN.toString());
		assert.notEqual(returnedPriceOfItemInWeiBN, new BN(0), "Seller should have set a non-zero price for the item requested to purchase from the buyer!");

		let amountNeededToPurchaseItemsInWei = quantity * priceOfItemInWei;
		let amountNeededToPurchaseItemsInWeiBN = new BN(amountNeededToPurchaseItemsInWei.toString());
		// console.log('amountNeededToPurchaseItemsInWei =', amountNeededToPurchaseItemsInWei);
		// console.log('amountNeededToPurchaseItemsInWeiBN =', amountNeededToPurchaseItemsInWeiBN);
		// console.log('amountNeededToPurchaseItemsInWeiBN.toString() =', amountNeededToPurchaseItemsInWeiBN.toString());
		let amountBuyerSendsToPurchaseInWeiBN = amountNeededToPurchaseItemsInWeiBN;
		// console.log('amountBuyerSendsToPurchaseInWeiBN =', amountBuyerSendsToPurchaseInWeiBN);
		// console.log('amountBuyerSendsToPurchaseInWeiBN.toString() =', amountBuyerSendsToPurchaseInWeiBN.toString());

		assert.equal(await franklinDecentralizedMarketplaceMediationContract.mediatedSalesTransactionExists.call(mediatedSalesTransactionIpfsHash), false,
			"Given _mediatedSalesTransactionIpfsHash should not exist yet inside of Smart Contract!");

		let mediatorIpfsHashDescription = "DummyMediatorIpfsHashDescription";
		await franklinDecentralizedMarketplaceMediationContract.addOrUpdateMediator(mediatorIpfsHashDescription, {from: mediatorAddress})
		assert.equal(await franklinDecentralizedMarketplaceMediationContract.mediatorExists.call(mediatorAddress), true,
			"Given Mediator Address should exist as a Mediator!");

		assert.equal(await franklinDecentralizedMarketplaceMediationContract.numberOfMediationsMediatorInvolved.call(mediatorAddress), 0,
			"Number of mediations mediator has been involved should initially be zero in this case!");

		// This needs to be executed so that the given "mediatedSalesTransactionIpfsHash" gets stored as an already existing Mediated Sales Transaction in the
		// Smart Contract.
		await franklinDecentralizedMarketplaceMediationContract.purchaseItemWithMediator(sellerAddress, mediatorAddress, keyItemIpfsHash,
			mediatedSalesTransactionIpfsHash, quantity, {from: buyerAddress, value: amountBuyerSendsToPurchaseInWeiBN});

		assert.equal(await franklinDecentralizedMarketplaceMediationContract.mediatedSalesTransactionExists.call(mediatedSalesTransactionIpfsHash), true,
			"The given _mediatedSalesTransactionIpfsHash should exist in the Smart Contract!");

		// First Seller signals Approval of Mediated Sales Transaction.
		await franklinDecentralizedMarketplaceMediationContract.approveMediatedSalesTransaction(mediatedSalesTransactionIpfsHash, {from: sellerAddress});

		// Note the approval from the "msg.sender" Address. If one approves, than one cannot disapprove.
		assert.equal(await franklinDecentralizedMarketplaceMediationContract.mediatedSalesTransactionApprovedByParties.call(
			mediatedSalesTransactionIpfsHash, SELLER_INDEX), true,
			`The mediatedSalesTransactionApprovedByParties[${mediatedSalesTransactionIpfsHash}][${SELLER_INDEX}] should be boolean true!`);
		assert.equal(await franklinDecentralizedMarketplaceMediationContract.mediatedSalesTransactionDisapprovedByParties.call(
			mediatedSalesTransactionIpfsHash, SELLER_INDEX), false,
			`The mediatedSalesTransactionDisapprovedByParties[${mediatedSalesTransactionIpfsHash}][${SELLER_INDEX}] should be boolean false!`);

		assert.equal(await franklinDecentralizedMarketplaceMediationContract.mediatedSalesTransactionHasBeenApproved.call(mediatedSalesTransactionIpfsHash), false,
			"Mediated Sales Transaction should not be in the Approved State if only one party has signaled approval!");

		let sellerBalanceBeforeApprovalStr = await web3.eth.getBalance(sellerAddress);
		let sellerBalanceBeforeApprovalBN = new BN(sellerBalanceBeforeApprovalStr);
		// console.log('sellerBalanceBeforeApprovalStr =', sellerBalanceBeforeApprovalStr);
		// console.log('sellerBalanceBeforeApprovalBN =', sellerBalanceBeforeApprovalBN);
		// console.log('sellerBalanceBeforeApprovalBN.toString() =', sellerBalanceBeforeApprovalBN.toString());

		let mediatorBalanceBeforeApprovalStr = await web3.eth.getBalance(mediatorAddress);
		let mediatorBalanceBeforeApprovalBN = new BN(mediatorBalanceBeforeApprovalStr);
		// console.log('mediatorBalanceBeforeApprovalStr =', mediatorBalanceBeforeApprovalStr);
		// console.log('mediatorBalanceBeforeApprovalBN =', mediatorBalanceBeforeApprovalBN);
		// console.log('mediatorBalanceBeforeApprovalBN.toString() =', mediatorBalanceBeforeApprovalBN.toString());

		let mediationContractBalanceBeforeApprovalStr = await web3.eth.getBalance(franklinDecentralizedMarketplaceMediationContract.address);
		let mediationContractBalanceBeforeApprovalBN = new BN(mediationContractBalanceBeforeApprovalStr);
		// console.log('mediationContractBalanceBeforeApprovalStr =', mediationContractBalanceBeforeApprovalStr);
		// console.log('mediationContractBalanceBeforeApprovalBN =', mediationContractBalanceBeforeApprovalBN);
		// console.log('mediationContractBalanceBeforeApprovalBN.toString() =', mediationContractBalanceBeforeApprovalBN.toString());

		// Second... Mediator signals Approval of the Mediated Sales Transaction
		let results = await franklinDecentralizedMarketplaceMediationContract.approveMediatedSalesTransaction(mediatedSalesTransactionIpfsHash, {from: mediatorAddress});

		let sellerBalanceAfterApprovalStr = await web3.eth.getBalance(sellerAddress);
		let sellerBalanceAfterApprovalBN = new BN(sellerBalanceAfterApprovalStr);
		// console.log('sellerBalanceAfterApprovalStr =', sellerBalanceAfterApprovalStr);
		// console.log('sellerBalanceAfterApprovalBN =', sellerBalanceAfterApprovalBN);
		// console.log('sellerBalanceAfterApprovalBN.toString() =', sellerBalanceAfterApprovalBN.toString());

		let mediatorBalanceAfterApprovalStr = await web3.eth.getBalance(mediatorAddress);
		let mediatorBalanceAfterApprovalBN = new BN(mediatorBalanceAfterApprovalStr);
		// console.log('mediatorBalanceAfterApprovalStr =', mediatorBalanceAfterApprovalStr);
		// console.log('mediatorBalanceAfterApprovalBN =', mediatorBalanceAfterApprovalBN);
		// console.log('mediatorBalanceAfterApprovalBN.toString() =', mediatorBalanceAfterApprovalBN.toString());

		let mediationContractBalanceAfterApprovalStr = await web3.eth.getBalance(franklinDecentralizedMarketplaceMediationContract.address);
		let mediationContractBalanceAfterApprovalBN = new BN(mediationContractBalanceAfterApprovalStr);
		// console.log('mediationContractBalanceAfterApprovalStr =', mediationContractBalanceAfterApprovalStr);
		// console.log('mediationContractBalanceAfterApprovalBN =', mediationContractBalanceAfterApprovalBN);
		// console.log('mediationContractBalanceAfterApprovalBN.toString() =', mediationContractBalanceAfterApprovalBN.toString());

		let amountOfWeiToSendMediatorBN = amountNeededToPurchaseItemsInWeiBN.mul(new BN(5)).div(new BN(100)); // 5% to mediator
		// console.log('amountOfWeiToSendMediatorBN.toString() =', amountOfWeiToSendMediatorBN.toString());
		let amountOfWeiToSendSellerBN = amountNeededToPurchaseItemsInWeiBN.sub(amountOfWeiToSendMediatorBN); // 95% to seller
		// console.log('amountOfWeiToSendSellerBN.toString() =', amountOfWeiToSendSellerBN.toString());

		let cummulativeGasUsed = results.receipt.cumulativeGasUsed;
		// console.log('cummulativeGasUsed =', cummulativeGasUsed);

		let expectedSellerBalanceAfterApprovalBN = sellerBalanceBeforeApprovalBN.add(amountOfWeiToSendSellerBN); // 95% to seller
		// expectedSellerBalanceAfterApprovalBN = expectedSellerBalanceAfterApprovalBN.sub(new BN(cummulativeGasUsed * GAS_BASE_UNIT)); // subtract gas spent
		// console.log('expectedSellerBalanceAfterApprovalBN.toString() =', expectedSellerBalanceAfterApprovalBN.toString());

		let expectedMediatorBalanceAfterApprovalBN = mediatorBalanceBeforeApprovalBN.add(amountOfWeiToSendMediatorBN); // 5% to mediator
		expectedMediatorBalanceAfterApprovalBN = expectedMediatorBalanceAfterApprovalBN.sub(new BN(cummulativeGasUsed * GAS_BASE_UNIT)); // subtract gas spent
		// console.log('expectedMediatorBalanceAfterApprovalBN.toString() =', expectedMediatorBalanceAfterApprovalBN.toString());

		let expectedMediationContractBalanceAfterApprovalBN = mediationContractBalanceBeforeApprovalBN.sub(amountNeededToPurchaseItemsInWeiBN);
		// console.log('expectedMediationContractBalanceAfterApprovalBN.toString() =', expectedMediationContractBalanceAfterApprovalBN.toString());

		assert.equal(mediationContractBalanceAfterApprovalBN.toString(), expectedMediationContractBalanceAfterApprovalBN.toString(),
			"Mediation Contract Address Balance after approval is incorrect!");
		assert.equal(sellerBalanceAfterApprovalBN.toString(), expectedSellerBalanceAfterApprovalBN.toString(),
			"Seller Address Balance after approval is incorrect!");
		assert.equal(mediatorBalanceAfterApprovalBN.toString(), expectedMediatorBalanceAfterApprovalBN.toString(),
			"Mediator Address Balance after approval is incorrect!");

		// Note the approval from the "msg.sender" Address. If one approves, than one cannot disapprove.
		assert.equal(await franklinDecentralizedMarketplaceMediationContract.mediatedSalesTransactionApprovedByParties.call(
			mediatedSalesTransactionIpfsHash, MEDIATOR_INDEX), true,
			`The mediatedSalesTransactionApprovedByParties[${mediatedSalesTransactionIpfsHash}][${MEDIATOR_INDEX}] should be boolean true!`);
		assert.equal(await franklinDecentralizedMarketplaceMediationContract.mediatedSalesTransactionDisapprovedByParties.call(
			mediatedSalesTransactionIpfsHash, MEDIATOR_INDEX), false,
			`The mediatedSalesTransactionDisapprovedByParties[${mediatedSalesTransactionIpfsHash}][${MEDIATOR_INDEX}] should be boolean false!`);

		assert.equal(await franklinDecentralizedMarketplaceMediationContract.mediatedSalesTransactionHasBeenApproved.call(mediatedSalesTransactionIpfsHash), true,
			"Mediated Sales Transaction should now be in the Approved State because two parties have signaled approval!");

		// Making sure that MediatedSalesTransactionHasBeenFullyApprovedEvent(_mediatedSalesTransactionIpfsHash) fired off
		assert.equal(results.logs.length, 1, "There should have been one Event Fired Off!");
		assert.equal(results.logs[0].event, 'MediatedSalesTransactionHasBeenFullyApprovedEvent', "There should have been a MediatedSalesTransactionHasBeenFullyApprovedEvent Fired Off!");
		assert.ok(results.logs[0].args !== undefined, "There should have been a results.logs[0].args object!");
		assert.equal(results.logs[0].args.__length__, 1, "There should have been 1 argument(s) in the MediatedSalesTransactionHasBeenFullyApprovedEvent that Fired Off!");
		assert.equal(results.logs[0].args._mediatedSalesTransactionIpfsHash, mediatedSalesTransactionIpfsHash, "The _mediatedSalesTransactionIpfsHash argument should be IPFS Hash of Item bought!");
	});

	it("FranklinDecentralizedMarketplaceMediation : test approveMediatedSalesTransaction method - nobody has yet done approval and message sender is the mediator address of the given _mediatedSalesTransactionIpfsHash that exists as a Mediated Sales Transaction in the Smart Contract", async () => {
		let buyerAddress = accounts[(randomAddressIndex + 1) % NUMBER_OF_ACCOUNTS];
		let sellerAddress = accounts[(randomAddressIndex + 2) % NUMBER_OF_ACCOUNTS];
		let mediatorAddress = accounts[(randomAddressIndex + 3) % NUMBER_OF_ACCOUNTS];
		let keyItemIpfsHash = "DummyItem_IpfsHash";
		let mediatedSalesTransactionIpfsHash = "DummyMediationSalesTransaction_IpfsHash";
		let quantity = 3;

		await franklinDecentralizedMarketplaceContract.addItemForSale(keyItemIpfsHash, {from: sellerAddress});
		assert.equal(await franklinDecentralizedMarketplaceContract.itemForSaleFromSellerExists(sellerAddress, keyItemIpfsHash), true,
			"Item requested to purchase should exist as an item for sale from the seller!");

		await franklinDecentralizedMarketplaceContract.setQuantityAvailableForSaleOfAnItem(keyItemIpfsHash, quantity + 10, {from: sellerAddress})
		assert.ok(await franklinDecentralizedMarketplaceContract.getQuantityAvailableForSaleOfAnItemBySeller(sellerAddress, keyItemIpfsHash) >= quantity,
			"Number of items available for sale from the seller is greater than or equal to the number requested to purchase from the buyer!");

		let priceOfItemInWei = 0.25 * ETH;
		// console.log('priceOfItemInWei =', priceOfItemInWei);
		// console.log('priceOfItemInWei.toString() =', priceOfItemInWei.toString());
		let priceOfItemInWeiBN = new BN(priceOfItemInWei.toString());
		// console.log('priceOfItemInWeiBN =', priceOfItemInWeiBN);
		// console.log('priceOfItemInWeiBN.toString() =', priceOfItemInWeiBN.toString());
		await franklinDecentralizedMarketplaceContract.setPriceOfItem(keyItemIpfsHash, priceOfItemInWeiBN, {from: sellerAddress});

		let returnedPriceOfItemInWeiBN = await franklinDecentralizedMarketplaceContract.getPriceOfItem(sellerAddress, keyItemIpfsHash);
		// console.log('returnedPriceOfItemInWeiBN =', returnedPriceOfItemInWeiBN);
		// console.log('returnedPriceOfItemInWeiBN.toString() =', returnedPriceOfItemInWeiBN.toString());
		assert.notEqual(returnedPriceOfItemInWeiBN, new BN(0), "Seller should have set a non-zero price for the item requested to purchase from the buyer!");

		let amountNeededToPurchaseItemsInWei = quantity * priceOfItemInWei;
		let amountNeededToPurchaseItemsInWeiBN = new BN(amountNeededToPurchaseItemsInWei.toString());
		// console.log('amountNeededToPurchaseItemsInWei =', amountNeededToPurchaseItemsInWei);
		// console.log('amountNeededToPurchaseItemsInWeiBN =', amountNeededToPurchaseItemsInWeiBN);
		// console.log('amountNeededToPurchaseItemsInWeiBN.toString() =', amountNeededToPurchaseItemsInWeiBN.toString());
		let amountBuyerSendsToPurchaseInWeiBN = amountNeededToPurchaseItemsInWeiBN;
		// console.log('amountBuyerSendsToPurchaseInWeiBN =', amountBuyerSendsToPurchaseInWeiBN);
		// console.log('amountBuyerSendsToPurchaseInWeiBN.toString() =', amountBuyerSendsToPurchaseInWeiBN.toString());

		assert.equal(await franklinDecentralizedMarketplaceMediationContract.mediatedSalesTransactionExists.call(mediatedSalesTransactionIpfsHash), false,
			"Given _mediatedSalesTransactionIpfsHash should not exist yet inside of Smart Contract!");

		let mediatorIpfsHashDescription = "DummyMediatorIpfsHashDescription";
		await franklinDecentralizedMarketplaceMediationContract.addOrUpdateMediator(mediatorIpfsHashDescription, {from: mediatorAddress})
		assert.equal(await franklinDecentralizedMarketplaceMediationContract.mediatorExists.call(mediatorAddress), true,
			"Given Mediator Address should exist as a Mediator!");

		assert.equal(await franklinDecentralizedMarketplaceMediationContract.numberOfMediationsMediatorInvolved.call(mediatorAddress), 0,
			"Number of mediations mediator has been involved should initially be zero in this case!");

		// This needs to be executed so that the given "mediatedSalesTransactionIpfsHash" gets stored as an already existing Mediated Sales Transaction in the
		// Smart Contract.
		await franklinDecentralizedMarketplaceMediationContract.purchaseItemWithMediator(sellerAddress, mediatorAddress, keyItemIpfsHash,
			mediatedSalesTransactionIpfsHash, quantity, {from: buyerAddress, value: amountBuyerSendsToPurchaseInWeiBN});

		assert.equal(await franklinDecentralizedMarketplaceMediationContract.mediatedSalesTransactionExists.call(mediatedSalesTransactionIpfsHash), true,
			"The given _mediatedSalesTransactionIpfsHash should exist in the Smart Contract!");

		await franklinDecentralizedMarketplaceMediationContract.approveMediatedSalesTransaction(mediatedSalesTransactionIpfsHash, {from: mediatorAddress});

		// Note the approval from the "msg.sender" Address. If one approves, than one cannot disapprove.
		assert.equal(await franklinDecentralizedMarketplaceMediationContract.mediatedSalesTransactionApprovedByParties.call(
			mediatedSalesTransactionIpfsHash, MEDIATOR_INDEX), true,
			`The mediatedSalesTransactionApprovedByParties[${mediatedSalesTransactionIpfsHash}][${MEDIATOR_INDEX}] should be boolean true!`);
		assert.equal(await franklinDecentralizedMarketplaceMediationContract.mediatedSalesTransactionDisapprovedByParties.call(
			mediatedSalesTransactionIpfsHash, MEDIATOR_INDEX), false,
			`The mediatedSalesTransactionDisapprovedByParties[${mediatedSalesTransactionIpfsHash}][${MEDIATOR_INDEX}] should be boolean false!`);

		assert.equal(await franklinDecentralizedMarketplaceMediationContract.mediatedSalesTransactionHasBeenApproved.call(mediatedSalesTransactionIpfsHash), false,
			"Mediated Sales Transaction should not be in the Approved State if only one party has signaled approval!");
	});

	it("FranklinDecentralizedMarketplaceMediation : test approveMediatedSalesTransaction method - mediator and buyer addresses signal approval of the given _mediatedSalesTransactionIpfsHash that exists as a Mediated Sales Transaction in the Smart Contract", async () => {
		let buyerAddress = accounts[(randomAddressIndex + 1) % NUMBER_OF_ACCOUNTS];
		let sellerAddress = accounts[(randomAddressIndex + 2) % NUMBER_OF_ACCOUNTS];
		let mediatorAddress = accounts[(randomAddressIndex + 3) % NUMBER_OF_ACCOUNTS];
		let keyItemIpfsHash = "DummyItem_IpfsHash";
		let mediatedSalesTransactionIpfsHash = "DummyMediationSalesTransaction_IpfsHash";
		let quantity = 3;

		await franklinDecentralizedMarketplaceContract.addItemForSale(keyItemIpfsHash, {from: sellerAddress});
		assert.equal(await franklinDecentralizedMarketplaceContract.itemForSaleFromSellerExists(sellerAddress, keyItemIpfsHash), true,
			"Item requested to purchase should exist as an item for sale from the seller!");

		await franklinDecentralizedMarketplaceContract.setQuantityAvailableForSaleOfAnItem(keyItemIpfsHash, quantity + 10, {from: sellerAddress})
		assert.ok(await franklinDecentralizedMarketplaceContract.getQuantityAvailableForSaleOfAnItemBySeller(sellerAddress, keyItemIpfsHash) >= quantity,
			"Number of items available for sale from the seller is greater than or equal to the number requested to purchase from the buyer!");

		let priceOfItemInWei = 0.25 * ETH;
		// console.log('priceOfItemInWei =', priceOfItemInWei);
		// console.log('priceOfItemInWei.toString() =', priceOfItemInWei.toString());
		let priceOfItemInWeiBN = new BN(priceOfItemInWei.toString());
		// console.log('priceOfItemInWeiBN =', priceOfItemInWeiBN);
		// console.log('priceOfItemInWeiBN.toString() =', priceOfItemInWeiBN.toString());
		await franklinDecentralizedMarketplaceContract.setPriceOfItem(keyItemIpfsHash, priceOfItemInWeiBN, {from: sellerAddress});

		let returnedPriceOfItemInWeiBN = await franklinDecentralizedMarketplaceContract.getPriceOfItem(sellerAddress, keyItemIpfsHash);
		// console.log('returnedPriceOfItemInWeiBN =', returnedPriceOfItemInWeiBN);
		// console.log('returnedPriceOfItemInWeiBN.toString() =', returnedPriceOfItemInWeiBN.toString());
		assert.notEqual(returnedPriceOfItemInWeiBN, new BN(0), "Seller should have set a non-zero price for the item requested to purchase from the buyer!");

		let amountNeededToPurchaseItemsInWei = quantity * priceOfItemInWei;
		let amountNeededToPurchaseItemsInWeiBN = new BN(amountNeededToPurchaseItemsInWei.toString());
		// console.log('amountNeededToPurchaseItemsInWei =', amountNeededToPurchaseItemsInWei);
		// console.log('amountNeededToPurchaseItemsInWeiBN =', amountNeededToPurchaseItemsInWeiBN);
		// console.log('amountNeededToPurchaseItemsInWeiBN.toString() =', amountNeededToPurchaseItemsInWeiBN.toString());
		let amountBuyerSendsToPurchaseInWeiBN = amountNeededToPurchaseItemsInWeiBN;
		// console.log('amountBuyerSendsToPurchaseInWeiBN =', amountBuyerSendsToPurchaseInWeiBN);
		// console.log('amountBuyerSendsToPurchaseInWeiBN.toString() =', amountBuyerSendsToPurchaseInWeiBN.toString());

		assert.equal(await franklinDecentralizedMarketplaceMediationContract.mediatedSalesTransactionExists.call(mediatedSalesTransactionIpfsHash), false,
			"Given _mediatedSalesTransactionIpfsHash should not exist yet inside of Smart Contract!");

		let mediatorIpfsHashDescription = "DummyMediatorIpfsHashDescription";
		await franklinDecentralizedMarketplaceMediationContract.addOrUpdateMediator(mediatorIpfsHashDescription, {from: mediatorAddress})
		assert.equal(await franklinDecentralizedMarketplaceMediationContract.mediatorExists.call(mediatorAddress), true,
			"Given Mediator Address should exist as a Mediator!");

		assert.equal(await franklinDecentralizedMarketplaceMediationContract.numberOfMediationsMediatorInvolved.call(mediatorAddress), 0,
			"Number of mediations mediator has been involved should initially be zero in this case!");

		// This needs to be executed so that the given "mediatedSalesTransactionIpfsHash" gets stored as an already existing Mediated Sales Transaction in the
		// Smart Contract.
		await franklinDecentralizedMarketplaceMediationContract.purchaseItemWithMediator(sellerAddress, mediatorAddress, keyItemIpfsHash,
			mediatedSalesTransactionIpfsHash, quantity, {from: buyerAddress, value: amountBuyerSendsToPurchaseInWeiBN});

		assert.equal(await franklinDecentralizedMarketplaceMediationContract.mediatedSalesTransactionExists.call(mediatedSalesTransactionIpfsHash), true,
			"The given _mediatedSalesTransactionIpfsHash should exist in the Smart Contract!");

		// First Mediator signals Approval of Mediated Sales Transaction.
		await franklinDecentralizedMarketplaceMediationContract.approveMediatedSalesTransaction(mediatedSalesTransactionIpfsHash, {from: mediatorAddress});

		// Note the approval from the "msg.sender" Address. If one approves, than one cannot disapprove.
		assert.equal(await franklinDecentralizedMarketplaceMediationContract.mediatedSalesTransactionApprovedByParties.call(
			mediatedSalesTransactionIpfsHash, MEDIATOR_INDEX), true,
			`The mediatedSalesTransactionApprovedByParties[${mediatedSalesTransactionIpfsHash}][${MEDIATOR_INDEX}] should be boolean true!`);
		assert.equal(await franklinDecentralizedMarketplaceMediationContract.mediatedSalesTransactionDisapprovedByParties.call(
			mediatedSalesTransactionIpfsHash, MEDIATOR_INDEX), false,
			`The mediatedSalesTransactionDisapprovedByParties[${mediatedSalesTransactionIpfsHash}][${MEDIATOR_INDEX}] should be boolean false!`);

		assert.equal(await franklinDecentralizedMarketplaceMediationContract.mediatedSalesTransactionHasBeenApproved.call(mediatedSalesTransactionIpfsHash), false,
			"Mediated Sales Transaction should not be in the Approved State if only one party has signaled approval!");

		let sellerBalanceBeforeApprovalStr = await web3.eth.getBalance(sellerAddress);
		let sellerBalanceBeforeApprovalBN = new BN(sellerBalanceBeforeApprovalStr);
		// console.log('sellerBalanceBeforeApprovalStr =', sellerBalanceBeforeApprovalStr);
		// console.log('sellerBalanceBeforeApprovalBN =', sellerBalanceBeforeApprovalBN);
		// console.log('sellerBalanceBeforeApprovalBN.toString() =', sellerBalanceBeforeApprovalBN.toString());

		let mediatorBalanceBeforeApprovalStr = await web3.eth.getBalance(mediatorAddress);
		let mediatorBalanceBeforeApprovalBN = new BN(mediatorBalanceBeforeApprovalStr);
		// console.log('mediatorBalanceBeforeApprovalStr =', mediatorBalanceBeforeApprovalStr);
		// console.log('mediatorBalanceBeforeApprovalBN =', mediatorBalanceBeforeApprovalBN);
		// console.log('mediatorBalanceBeforeApprovalBN.toString() =', mediatorBalanceBeforeApprovalBN.toString());

		let mediationContractBalanceBeforeApprovalStr = await web3.eth.getBalance(franklinDecentralizedMarketplaceMediationContract.address);
		let mediationContractBalanceBeforeApprovalBN = new BN(mediationContractBalanceBeforeApprovalStr);
		// console.log('mediationContractBalanceBeforeApprovalStr =', mediationContractBalanceBeforeApprovalStr);
		// console.log('mediationContractBalanceBeforeApprovalBN =', mediationContractBalanceBeforeApprovalBN);
		// console.log('mediationContractBalanceBeforeApprovalBN.toString() =', mediationContractBalanceBeforeApprovalBN.toString());

		// Second... Buyer signals Approval of the Mediated Sales Transaction
		let results = await franklinDecentralizedMarketplaceMediationContract.approveMediatedSalesTransaction(mediatedSalesTransactionIpfsHash, {from: buyerAddress});

		let sellerBalanceAfterApprovalStr = await web3.eth.getBalance(sellerAddress);
		let sellerBalanceAfterApprovalBN = new BN(sellerBalanceAfterApprovalStr);
		// console.log('sellerBalanceAfterApprovalStr =', sellerBalanceAfterApprovalStr);
		// console.log('sellerBalanceAfterApprovalBN =', sellerBalanceAfterApprovalBN);
		// console.log('sellerBalanceAfterApprovalBN.toString() =', sellerBalanceAfterApprovalBN.toString());

		let mediatorBalanceAfterApprovalStr = await web3.eth.getBalance(mediatorAddress);
		let mediatorBalanceAfterApprovalBN = new BN(mediatorBalanceAfterApprovalStr);
		// console.log('mediatorBalanceAfterApprovalStr =', mediatorBalanceAfterApprovalStr);
		// console.log('mediatorBalanceAfterApprovalBN =', mediatorBalanceAfterApprovalBN);
		// console.log('mediatorBalanceAfterApprovalBN.toString() =', mediatorBalanceAfterApprovalBN.toString());

		let mediationContractBalanceAfterApprovalStr = await web3.eth.getBalance(franklinDecentralizedMarketplaceMediationContract.address);
		let mediationContractBalanceAfterApprovalBN = new BN(mediationContractBalanceAfterApprovalStr);
		// console.log('mediationContractBalanceAfterApprovalStr =', mediationContractBalanceAfterApprovalStr);
		// console.log('mediationContractBalanceAfterApprovalBN =', mediationContractBalanceAfterApprovalBN);
		// console.log('mediationContractBalanceAfterApprovalBN.toString() =', mediationContractBalanceAfterApprovalBN.toString());

		let amountOfWeiToSendMediatorBN = amountNeededToPurchaseItemsInWeiBN.mul(new BN(5)).div(new BN(100)); // 5% to mediator
		// console.log('amountOfWeiToSendMediatorBN.toString() =', amountOfWeiToSendMediatorBN.toString());
		let amountOfWeiToSendSellerBN = amountNeededToPurchaseItemsInWeiBN.sub(amountOfWeiToSendMediatorBN); // 95% to seller
		// console.log('amountOfWeiToSendSellerBN.toString() =', amountOfWeiToSendSellerBN.toString());

		let cummulativeGasUsed = results.receipt.cumulativeGasUsed;
		// console.log('cummulativeGasUsed =', cummulativeGasUsed);

		let expectedSellerBalanceAfterApprovalBN = sellerBalanceBeforeApprovalBN.add(amountOfWeiToSendSellerBN); // 95% to seller
		// expectedSellerBalanceAfterApprovalBN = expectedSellerBalanceAfterApprovalBN.sub(new BN(cummulativeGasUsed * GAS_BASE_UNIT)); // subtract gas spent
		// console.log('expectedSellerBalanceAfterApprovalBN.toString() =', expectedSellerBalanceAfterApprovalBN.toString());

		let expectedMediatorBalanceAfterApprovalBN = mediatorBalanceBeforeApprovalBN.add(amountOfWeiToSendMediatorBN); // 5% to mediator
		// expectedMediatorBalanceAfterApprovalBN = expectedMediatorBalanceAfterApprovalBN.sub(new BN(cummulativeGasUsed * GAS_BASE_UNIT)); // subtract gas spent
		// console.log('expectedMediatorBalanceAfterApprovalBN.toString() =', expectedMediatorBalanceAfterApprovalBN.toString());

		let expectedMediationContractBalanceAfterApprovalBN = mediationContractBalanceBeforeApprovalBN.sub(amountNeededToPurchaseItemsInWeiBN);
		// console.log('expectedMediationContractBalanceAfterApprovalBN.toString() =', expectedMediationContractBalanceAfterApprovalBN.toString());

		assert.equal(mediationContractBalanceAfterApprovalBN.toString(), expectedMediationContractBalanceAfterApprovalBN.toString(),
			"Mediation Contract Address Balance after approval is incorrect!");
		assert.equal(sellerBalanceAfterApprovalBN.toString(), expectedSellerBalanceAfterApprovalBN.toString(),
			"Seller Address Balance after approval is incorrect!");
		assert.equal(mediatorBalanceAfterApprovalBN.toString(), expectedMediatorBalanceAfterApprovalBN.toString(),
			"Mediator Address Balance after approval is incorrect!");

		// Note the approval from the "msg.sender" Address. If one approves, than one cannot disapprove.
		assert.equal(await franklinDecentralizedMarketplaceMediationContract.mediatedSalesTransactionApprovedByParties.call(
			mediatedSalesTransactionIpfsHash, BUYER_INDEX), true,
			`The mediatedSalesTransactionApprovedByParties[${mediatedSalesTransactionIpfsHash}][${BUYER_INDEX}] should be boolean true!`);
		assert.equal(await franklinDecentralizedMarketplaceMediationContract.mediatedSalesTransactionDisapprovedByParties.call(
			mediatedSalesTransactionIpfsHash, BUYER_INDEX), false,
			`The mediatedSalesTransactionDisapprovedByParties[${mediatedSalesTransactionIpfsHash}][${BUYER_INDEX}] should be boolean false!`);

		assert.equal(await franklinDecentralizedMarketplaceMediationContract.mediatedSalesTransactionHasBeenApproved.call(mediatedSalesTransactionIpfsHash), true,
			"Mediated Sales Transaction should now be in the Approved State because two parties have signaled approval!");

		// Making sure that MediatedSalesTransactionHasBeenFullyApprovedEvent(_mediatedSalesTransactionIpfsHash) fired off
		assert.equal(results.logs.length, 1, "There should have been one Event Fired Off!");
		assert.equal(results.logs[0].event, 'MediatedSalesTransactionHasBeenFullyApprovedEvent', "There should have been a MediatedSalesTransactionHasBeenFullyApprovedEvent Fired Off!");
		assert.ok(results.logs[0].args !== undefined, "There should have been a results.logs[0].args object!");
		assert.equal(results.logs[0].args.__length__, 1, "There should have been 1 argument(s) in the MediatedSalesTransactionHasBeenFullyApprovedEvent that Fired Off!");
		assert.equal(results.logs[0].args._mediatedSalesTransactionIpfsHash, mediatedSalesTransactionIpfsHash, "The _mediatedSalesTransactionIpfsHash argument should be IPFS Hash of Item bought!");
	});

	it("FranklinDecentralizedMarketplaceMediation : test approveMediatedSalesTransaction method - buyer address attempts to approve Mediated Sales Transaction AFTER seller and mediator addresses signal disapproval of the given existing _mediatedSalesTransactionIpfsHash", async () => {
		let buyerAddress = accounts[(randomAddressIndex + 1) % NUMBER_OF_ACCOUNTS];
		let sellerAddress = accounts[(randomAddressIndex + 2) % NUMBER_OF_ACCOUNTS];
		let mediatorAddress = accounts[(randomAddressIndex + 3) % NUMBER_OF_ACCOUNTS];
		let keyItemIpfsHash = "DummyItem_IpfsHash";
		let mediatedSalesTransactionIpfsHash = "DummyMediationSalesTransaction_IpfsHash";
		let quantity = 3;

		await franklinDecentralizedMarketplaceContract.addItemForSale(keyItemIpfsHash, {from: sellerAddress});
		await franklinDecentralizedMarketplaceContract.setQuantityAvailableForSaleOfAnItem(keyItemIpfsHash, quantity + 10, {from: sellerAddress})

		let priceOfItemInWei = 0.25 * ETH;
		// console.log('priceOfItemInWei =', priceOfItemInWei);
		// console.log('priceOfItemInWei.toString() =', priceOfItemInWei.toString());
		let priceOfItemInWeiBN = new BN(priceOfItemInWei.toString());
		// console.log('priceOfItemInWeiBN =', priceOfItemInWeiBN);
		// console.log('priceOfItemInWeiBN.toString() =', priceOfItemInWeiBN.toString());
		await franklinDecentralizedMarketplaceContract.setPriceOfItem(keyItemIpfsHash, priceOfItemInWeiBN, {from: sellerAddress});

		let amountNeededToPurchaseItemsInWei = quantity * priceOfItemInWei;
		let amountNeededToPurchaseItemsInWeiBN = new BN(amountNeededToPurchaseItemsInWei.toString());
		// console.log('amountNeededToPurchaseItemsInWei =', amountNeededToPurchaseItemsInWei);
		// console.log('amountNeededToPurchaseItemsInWeiBN =', amountNeededToPurchaseItemsInWeiBN);
		// console.log('amountNeededToPurchaseItemsInWeiBN.toString() =', amountNeededToPurchaseItemsInWeiBN.toString());
		let amountBuyerSendsToPurchaseInWeiBN = amountNeededToPurchaseItemsInWeiBN;
		// console.log('amountBuyerSendsToPurchaseInWeiBN =', amountBuyerSendsToPurchaseInWeiBN);
		// console.log('amountBuyerSendsToPurchaseInWeiBN.toString() =', amountBuyerSendsToPurchaseInWeiBN.toString());

		let mediatorIpfsHashDescription = "DummyMediatorIpfsHashDescription";
		await franklinDecentralizedMarketplaceMediationContract.addOrUpdateMediator(mediatorIpfsHashDescription, {from: mediatorAddress})

		// This needs to be executed so that the given "mediatedSalesTransactionIpfsHash" gets stored as an already existing Mediated Sales Transaction in the
		// Smart Contract.
		await franklinDecentralizedMarketplaceMediationContract.purchaseItemWithMediator(sellerAddress, mediatorAddress, keyItemIpfsHash,
			mediatedSalesTransactionIpfsHash, quantity, {from: buyerAddress, value: amountBuyerSendsToPurchaseInWeiBN});

		// Mediator and Seller signal Disapproval of Mediated Sales Transaction.
		await franklinDecentralizedMarketplaceMediationContract.disapproveMediatedSalesTransaction(mediatedSalesTransactionIpfsHash, {from: mediatorAddress});
		await franklinDecentralizedMarketplaceMediationContract.disapproveMediatedSalesTransaction(mediatedSalesTransactionIpfsHash, {from: sellerAddress});

		assert.equal(await franklinDecentralizedMarketplaceMediationContract.mediatedSalesTransactionHasBeenDisapproved.call(mediatedSalesTransactionIpfsHash), true,
			"Mediated Sales Transaction should initially be in the Disapproved State!");

		// Buyer now attempts to Approve Mediated Sales Transaction that is already in Disapproved State.
		try {
			await franklinDecentralizedMarketplaceMediationContract.approveMediatedSalesTransaction(
				mediatedSalesTransactionIpfsHash, {from: buyerAddress});
			assert.fail("Should not be able to execute this method when _mediatedSalesTransactionIpfsHash is in the Disapproved State!");
		} catch (error) {
			assert.ok(/revert/.test(error.message), "String 'revert' not present in error message!");
			assert.ok(/Mediated Sales Transaction has already been Disapproved by at least 2-out-of-3 of the Buyer, Seller, and\/or Mediator! Cannot Approve at this point!/.test(error.message),
				"Appropriate error message not returned!");
		}
	});

	it("FranklinDecentralizedMarketplaceMediation : test approveMediatedSalesTransaction method - seller address attempts to approve Mediated Sales Transaction AFTER mediator and buyer addresses signal disapproval of the given existing _mediatedSalesTransactionIpfsHash", async () => {
		let buyerAddress = accounts[(randomAddressIndex + 1) % NUMBER_OF_ACCOUNTS];
		let sellerAddress = accounts[(randomAddressIndex + 2) % NUMBER_OF_ACCOUNTS];
		let mediatorAddress = accounts[(randomAddressIndex + 3) % NUMBER_OF_ACCOUNTS];
		let keyItemIpfsHash = "DummyItem_IpfsHash";
		let mediatedSalesTransactionIpfsHash = "DummyMediationSalesTransaction_IpfsHash";
		let quantity = 3;

		await franklinDecentralizedMarketplaceContract.addItemForSale(keyItemIpfsHash, {from: sellerAddress});
		await franklinDecentralizedMarketplaceContract.setQuantityAvailableForSaleOfAnItem(keyItemIpfsHash, quantity + 10, {from: sellerAddress})

		let priceOfItemInWei = 0.25 * ETH;
		// console.log('priceOfItemInWei =', priceOfItemInWei);
		// console.log('priceOfItemInWei.toString() =', priceOfItemInWei.toString());
		let priceOfItemInWeiBN = new BN(priceOfItemInWei.toString());
		// console.log('priceOfItemInWeiBN =', priceOfItemInWeiBN);
		// console.log('priceOfItemInWeiBN.toString() =', priceOfItemInWeiBN.toString());
		await franklinDecentralizedMarketplaceContract.setPriceOfItem(keyItemIpfsHash, priceOfItemInWeiBN, {from: sellerAddress});

		let amountNeededToPurchaseItemsInWei = quantity * priceOfItemInWei;
		let amountNeededToPurchaseItemsInWeiBN = new BN(amountNeededToPurchaseItemsInWei.toString());
		// console.log('amountNeededToPurchaseItemsInWei =', amountNeededToPurchaseItemsInWei);
		// console.log('amountNeededToPurchaseItemsInWeiBN =', amountNeededToPurchaseItemsInWeiBN);
		// console.log('amountNeededToPurchaseItemsInWeiBN.toString() =', amountNeededToPurchaseItemsInWeiBN.toString());
		let amountBuyerSendsToPurchaseInWeiBN = amountNeededToPurchaseItemsInWeiBN;
		// console.log('amountBuyerSendsToPurchaseInWeiBN =', amountBuyerSendsToPurchaseInWeiBN);
		// console.log('amountBuyerSendsToPurchaseInWeiBN.toString() =', amountBuyerSendsToPurchaseInWeiBN.toString());

		let mediatorIpfsHashDescription = "DummyMediatorIpfsHashDescription";
		await franklinDecentralizedMarketplaceMediationContract.addOrUpdateMediator(mediatorIpfsHashDescription, {from: mediatorAddress})

		// This needs to be executed so that the given "mediatedSalesTransactionIpfsHash" gets stored as an already existing Mediated Sales Transaction in the
		// Smart Contract.
		await franklinDecentralizedMarketplaceMediationContract.purchaseItemWithMediator(sellerAddress, mediatorAddress, keyItemIpfsHash,
			mediatedSalesTransactionIpfsHash, quantity, {from: buyerAddress, value: amountBuyerSendsToPurchaseInWeiBN});

		// Mediator and Buyer signal Disapproval of Mediated Sales Transaction.
		await franklinDecentralizedMarketplaceMediationContract.disapproveMediatedSalesTransaction(mediatedSalesTransactionIpfsHash, {from: mediatorAddress});
		await franklinDecentralizedMarketplaceMediationContract.disapproveMediatedSalesTransaction(mediatedSalesTransactionIpfsHash, {from: buyerAddress});

		assert.equal(await franklinDecentralizedMarketplaceMediationContract.mediatedSalesTransactionHasBeenDisapproved.call(mediatedSalesTransactionIpfsHash), true,
			"Mediated Sales Transaction should initially be in the Disapproved State!");

		// Seller now attempts to Approve Mediated Sales Transaction that is already in Disapproved State.
		try {
			await franklinDecentralizedMarketplaceMediationContract.approveMediatedSalesTransaction(
				mediatedSalesTransactionIpfsHash, {from: sellerAddress});
			assert.fail("Should not be able to execute this method when _mediatedSalesTransactionIpfsHash is in the Disapproved State!");
		} catch (error) {
			assert.ok(/revert/.test(error.message), "String 'revert' not present in error message!");
			assert.ok(/Mediated Sales Transaction has already been Disapproved by at least 2-out-of-3 of the Buyer, Seller, and\/or Mediator! Cannot Approve at this point!/.test(error.message),
				"Appropriate error message not returned!");
		}
	});

	it("FranklinDecentralizedMarketplaceMediation : test approveMediatedSalesTransaction method - mediator address attempts to approve Mediated Sales Transaction AFTER buyer and addresses signal disapproval of the given existing _mediatedSalesTransactionIpfsHash", async () => {
		let buyerAddress = accounts[(randomAddressIndex + 1) % NUMBER_OF_ACCOUNTS];
		let sellerAddress = accounts[(randomAddressIndex + 2) % NUMBER_OF_ACCOUNTS];
		let mediatorAddress = accounts[(randomAddressIndex + 3) % NUMBER_OF_ACCOUNTS];
		let keyItemIpfsHash = "DummyItem_IpfsHash";
		let mediatedSalesTransactionIpfsHash = "DummyMediationSalesTransaction_IpfsHash";
		let quantity = 3;

		await franklinDecentralizedMarketplaceContract.addItemForSale(keyItemIpfsHash, {from: sellerAddress});
		await franklinDecentralizedMarketplaceContract.setQuantityAvailableForSaleOfAnItem(keyItemIpfsHash, quantity + 10, {from: sellerAddress})

		let priceOfItemInWei = 0.25 * ETH;
		// console.log('priceOfItemInWei =', priceOfItemInWei);
		// console.log('priceOfItemInWei.toString() =', priceOfItemInWei.toString());
		let priceOfItemInWeiBN = new BN(priceOfItemInWei.toString());
		// console.log('priceOfItemInWeiBN =', priceOfItemInWeiBN);
		// console.log('priceOfItemInWeiBN.toString() =', priceOfItemInWeiBN.toString());
		await franklinDecentralizedMarketplaceContract.setPriceOfItem(keyItemIpfsHash, priceOfItemInWeiBN, {from: sellerAddress});

		let amountNeededToPurchaseItemsInWei = quantity * priceOfItemInWei;
		let amountNeededToPurchaseItemsInWeiBN = new BN(amountNeededToPurchaseItemsInWei.toString());
		// console.log('amountNeededToPurchaseItemsInWei =', amountNeededToPurchaseItemsInWei);
		// console.log('amountNeededToPurchaseItemsInWeiBN =', amountNeededToPurchaseItemsInWeiBN);
		// console.log('amountNeededToPurchaseItemsInWeiBN.toString() =', amountNeededToPurchaseItemsInWeiBN.toString());
		let amountBuyerSendsToPurchaseInWeiBN = amountNeededToPurchaseItemsInWeiBN;
		// console.log('amountBuyerSendsToPurchaseInWeiBN =', amountBuyerSendsToPurchaseInWeiBN);
		// console.log('amountBuyerSendsToPurchaseInWeiBN.toString() =', amountBuyerSendsToPurchaseInWeiBN.toString());

		let mediatorIpfsHashDescription = "DummyMediatorIpfsHashDescription";
		await franklinDecentralizedMarketplaceMediationContract.addOrUpdateMediator(mediatorIpfsHashDescription, {from: mediatorAddress})

		// This needs to be executed so that the given "mediatedSalesTransactionIpfsHash" gets stored as an already existing Mediated Sales Transaction in the
		// Smart Contract.
		await franklinDecentralizedMarketplaceMediationContract.purchaseItemWithMediator(sellerAddress, mediatorAddress, keyItemIpfsHash,
			mediatedSalesTransactionIpfsHash, quantity, {from: buyerAddress, value: amountBuyerSendsToPurchaseInWeiBN});

		// Buyer and Seller signal Disapproval of Mediated Sales Transaction.
		await franklinDecentralizedMarketplaceMediationContract.disapproveMediatedSalesTransaction(mediatedSalesTransactionIpfsHash, {from: sellerAddress});
		await franklinDecentralizedMarketplaceMediationContract.disapproveMediatedSalesTransaction(mediatedSalesTransactionIpfsHash, {from: buyerAddress});

		assert.equal(await franklinDecentralizedMarketplaceMediationContract.mediatedSalesTransactionHasBeenDisapproved.call(mediatedSalesTransactionIpfsHash), true,
			"Mediated Sales Transaction should initially be in the Disapproved State!");

		// Mediator now attempts to Approve Mediated Sales Transaction that is already in Disapproved State.
		try {
			await franklinDecentralizedMarketplaceMediationContract.approveMediatedSalesTransaction(
				mediatedSalesTransactionIpfsHash, {from: mediatorAddress});
			assert.fail("Should not be able to execute this method when _mediatedSalesTransactionIpfsHash is in the Disapproved State!");
		} catch (error) {
			assert.ok(/revert/.test(error.message), "String 'revert' not present in error message!");
			assert.ok(/Mediated Sales Transaction has already been Disapproved by at least 2-out-of-3 of the Buyer, Seller, and\/or Mediator! Cannot Approve at this point!/.test(error.message),
				"Appropriate error message not returned!");
		}
	});

	it("FranklinDecentralizedMarketplaceMediation : test approveMediatedSalesTransaction method - buyer address attempts to approve Mediated Sales Transaction AFTER seller and mediator addresses signal approval of the given existing _mediatedSalesTransactionIpfsHash", async () => {
		let buyerAddress = accounts[(randomAddressIndex + 1) % NUMBER_OF_ACCOUNTS];
		let sellerAddress = accounts[(randomAddressIndex + 2) % NUMBER_OF_ACCOUNTS];
		let mediatorAddress = accounts[(randomAddressIndex + 3) % NUMBER_OF_ACCOUNTS];
		let keyItemIpfsHash = "DummyItem_IpfsHash";
		let mediatedSalesTransactionIpfsHash = "DummyMediationSalesTransaction_IpfsHash";
		let quantity = 3;

		await franklinDecentralizedMarketplaceContract.addItemForSale(keyItemIpfsHash, {from: sellerAddress});
		await franklinDecentralizedMarketplaceContract.setQuantityAvailableForSaleOfAnItem(keyItemIpfsHash, quantity + 10, {from: sellerAddress})

		let priceOfItemInWei = 0.25 * ETH;
		// console.log('priceOfItemInWei =', priceOfItemInWei);
		// console.log('priceOfItemInWei.toString() =', priceOfItemInWei.toString());
		let priceOfItemInWeiBN = new BN(priceOfItemInWei.toString());
		// console.log('priceOfItemInWeiBN =', priceOfItemInWeiBN);
		// console.log('priceOfItemInWeiBN.toString() =', priceOfItemInWeiBN.toString());
		await franklinDecentralizedMarketplaceContract.setPriceOfItem(keyItemIpfsHash, priceOfItemInWeiBN, {from: sellerAddress});

		let amountNeededToPurchaseItemsInWei = quantity * priceOfItemInWei;
		let amountNeededToPurchaseItemsInWeiBN = new BN(amountNeededToPurchaseItemsInWei.toString());
		// console.log('amountNeededToPurchaseItemsInWei =', amountNeededToPurchaseItemsInWei);
		// console.log('amountNeededToPurchaseItemsInWeiBN =', amountNeededToPurchaseItemsInWeiBN);
		// console.log('amountNeededToPurchaseItemsInWeiBN.toString() =', amountNeededToPurchaseItemsInWeiBN.toString());
		let amountBuyerSendsToPurchaseInWeiBN = amountNeededToPurchaseItemsInWeiBN;
		// console.log('amountBuyerSendsToPurchaseInWeiBN =', amountBuyerSendsToPurchaseInWeiBN);
		// console.log('amountBuyerSendsToPurchaseInWeiBN.toString() =', amountBuyerSendsToPurchaseInWeiBN.toString());

		let mediatorIpfsHashDescription = "DummyMediatorIpfsHashDescription";
		await franklinDecentralizedMarketplaceMediationContract.addOrUpdateMediator(mediatorIpfsHashDescription, {from: mediatorAddress})

		// This needs to be executed so that the given "mediatedSalesTransactionIpfsHash" gets stored as an already existing Mediated Sales Transaction in the
		// Smart Contract.
		await franklinDecentralizedMarketplaceMediationContract.purchaseItemWithMediator(sellerAddress, mediatorAddress, keyItemIpfsHash,
			mediatedSalesTransactionIpfsHash, quantity, {from: buyerAddress, value: amountBuyerSendsToPurchaseInWeiBN});

		// Mediator and Seller signal Approval of Mediated Sales Transaction.
		await franklinDecentralizedMarketplaceMediationContract.approveMediatedSalesTransaction(mediatedSalesTransactionIpfsHash, {from: mediatorAddress});
		await franklinDecentralizedMarketplaceMediationContract.approveMediatedSalesTransaction(mediatedSalesTransactionIpfsHash, {from: sellerAddress});

		assert.equal(await franklinDecentralizedMarketplaceMediationContract.mediatedSalesTransactionHasBeenApproved.call(mediatedSalesTransactionIpfsHash), true,
			"Mediated Sales Transaction should initially be in the Approved State!");

		// Buyer now attempts to Approve Mediated Sales Transaction that is already in Approved State.
		await franklinDecentralizedMarketplaceMediationContract.approveMediatedSalesTransaction(
			mediatedSalesTransactionIpfsHash, {from: buyerAddress});

		assert.equal(await franklinDecentralizedMarketplaceMediationContract.mediatedSalesTransactionApprovedByParties.call(
			mediatedSalesTransactionIpfsHash, BUYER_INDEX), true, "Approval from the Buyer should have been noted!");

		assert.equal(await franklinDecentralizedMarketplaceMediationContract.mediatedSalesTransactionHasBeenApproved.call(mediatedSalesTransactionIpfsHash), true,
			"Mediated Sales Transaction should have stayed in the Approved State!");
	});

	it("FranklinDecentralizedMarketplaceMediation : test approveMediatedSalesTransaction method - seller address attempts to approve Mediated Sales Transaction AFTER mediator and buyer addresses signal approval of the given existing _mediatedSalesTransactionIpfsHash", async () => {
		let buyerAddress = accounts[(randomAddressIndex + 1) % NUMBER_OF_ACCOUNTS];
		let sellerAddress = accounts[(randomAddressIndex + 2) % NUMBER_OF_ACCOUNTS];
		let mediatorAddress = accounts[(randomAddressIndex + 3) % NUMBER_OF_ACCOUNTS];
		let keyItemIpfsHash = "DummyItem_IpfsHash";
		let mediatedSalesTransactionIpfsHash = "DummyMediationSalesTransaction_IpfsHash";
		let quantity = 3;

		await franklinDecentralizedMarketplaceContract.addItemForSale(keyItemIpfsHash, {from: sellerAddress});
		await franklinDecentralizedMarketplaceContract.setQuantityAvailableForSaleOfAnItem(keyItemIpfsHash, quantity + 10, {from: sellerAddress})

		let priceOfItemInWei = 0.25 * ETH;
		// console.log('priceOfItemInWei =', priceOfItemInWei);
		// console.log('priceOfItemInWei.toString() =', priceOfItemInWei.toString());
		let priceOfItemInWeiBN = new BN(priceOfItemInWei.toString());
		// console.log('priceOfItemInWeiBN =', priceOfItemInWeiBN);
		// console.log('priceOfItemInWeiBN.toString() =', priceOfItemInWeiBN.toString());
		await franklinDecentralizedMarketplaceContract.setPriceOfItem(keyItemIpfsHash, priceOfItemInWeiBN, {from: sellerAddress});

		let amountNeededToPurchaseItemsInWei = quantity * priceOfItemInWei;
		let amountNeededToPurchaseItemsInWeiBN = new BN(amountNeededToPurchaseItemsInWei.toString());
		// console.log('amountNeededToPurchaseItemsInWei =', amountNeededToPurchaseItemsInWei);
		// console.log('amountNeededToPurchaseItemsInWeiBN =', amountNeededToPurchaseItemsInWeiBN);
		// console.log('amountNeededToPurchaseItemsInWeiBN.toString() =', amountNeededToPurchaseItemsInWeiBN.toString());
		let amountBuyerSendsToPurchaseInWeiBN = amountNeededToPurchaseItemsInWeiBN;
		// console.log('amountBuyerSendsToPurchaseInWeiBN =', amountBuyerSendsToPurchaseInWeiBN);
		// console.log('amountBuyerSendsToPurchaseInWeiBN.toString() =', amountBuyerSendsToPurchaseInWeiBN.toString());

		let mediatorIpfsHashDescription = "DummyMediatorIpfsHashDescription";
		await franklinDecentralizedMarketplaceMediationContract.addOrUpdateMediator(mediatorIpfsHashDescription, {from: mediatorAddress})

		// This needs to be executed so that the given "mediatedSalesTransactionIpfsHash" gets stored as an already existing Mediated Sales Transaction in the
		// Smart Contract.
		await franklinDecentralizedMarketplaceMediationContract.purchaseItemWithMediator(sellerAddress, mediatorAddress, keyItemIpfsHash,
			mediatedSalesTransactionIpfsHash, quantity, {from: buyerAddress, value: amountBuyerSendsToPurchaseInWeiBN});

		// Mediator and Buyer signal Approval of Mediated Sales Transaction.
		await franklinDecentralizedMarketplaceMediationContract.approveMediatedSalesTransaction(mediatedSalesTransactionIpfsHash, {from: mediatorAddress});
		await franklinDecentralizedMarketplaceMediationContract.approveMediatedSalesTransaction(mediatedSalesTransactionIpfsHash, {from: buyerAddress});

		assert.equal(await franklinDecentralizedMarketplaceMediationContract.mediatedSalesTransactionHasBeenApproved.call(mediatedSalesTransactionIpfsHash), true,
			"Mediated Sales Transaction should initially be in the Approved State!");

		// Seller now attempts to Approve Mediated Sales Transaction that is already in Approved State.
		await franklinDecentralizedMarketplaceMediationContract.approveMediatedSalesTransaction(
			mediatedSalesTransactionIpfsHash, {from: sellerAddress});

		assert.equal(await franklinDecentralizedMarketplaceMediationContract.mediatedSalesTransactionApprovedByParties.call(
			mediatedSalesTransactionIpfsHash, SELLER_INDEX), true, "Approval from the Seller should have been noted!");

		assert.equal(await franklinDecentralizedMarketplaceMediationContract.mediatedSalesTransactionHasBeenApproved.call(mediatedSalesTransactionIpfsHash), true,
			"Mediated Sales Transaction should have stayed in the Approved State!");
	});

	it("FranklinDecentralizedMarketplaceMediation : test approveMediatedSalesTransaction method - mediator address attempts to approve Mediated Sales Transaction AFTER buyer and addresses signal approval of the given existing _mediatedSalesTransactionIpfsHash", async () => {
		let buyerAddress = accounts[(randomAddressIndex + 1) % NUMBER_OF_ACCOUNTS];
		let sellerAddress = accounts[(randomAddressIndex + 2) % NUMBER_OF_ACCOUNTS];
		let mediatorAddress = accounts[(randomAddressIndex + 3) % NUMBER_OF_ACCOUNTS];
		let keyItemIpfsHash = "DummyItem_IpfsHash";
		let mediatedSalesTransactionIpfsHash = "DummyMediationSalesTransaction_IpfsHash";
		let quantity = 3;

		await franklinDecentralizedMarketplaceContract.addItemForSale(keyItemIpfsHash, {from: sellerAddress});
		await franklinDecentralizedMarketplaceContract.setQuantityAvailableForSaleOfAnItem(keyItemIpfsHash, quantity + 10, {from: sellerAddress})

		let priceOfItemInWei = 0.25 * ETH;
		// console.log('priceOfItemInWei =', priceOfItemInWei);
		// console.log('priceOfItemInWei.toString() =', priceOfItemInWei.toString());
		let priceOfItemInWeiBN = new BN(priceOfItemInWei.toString());
		// console.log('priceOfItemInWeiBN =', priceOfItemInWeiBN);
		// console.log('priceOfItemInWeiBN.toString() =', priceOfItemInWeiBN.toString());
		await franklinDecentralizedMarketplaceContract.setPriceOfItem(keyItemIpfsHash, priceOfItemInWeiBN, {from: sellerAddress});

		let amountNeededToPurchaseItemsInWei = quantity * priceOfItemInWei;
		let amountNeededToPurchaseItemsInWeiBN = new BN(amountNeededToPurchaseItemsInWei.toString());
		// console.log('amountNeededToPurchaseItemsInWei =', amountNeededToPurchaseItemsInWei);
		// console.log('amountNeededToPurchaseItemsInWeiBN =', amountNeededToPurchaseItemsInWeiBN);
		// console.log('amountNeededToPurchaseItemsInWeiBN.toString() =', amountNeededToPurchaseItemsInWeiBN.toString());
		let amountBuyerSendsToPurchaseInWeiBN = amountNeededToPurchaseItemsInWeiBN;
		// console.log('amountBuyerSendsToPurchaseInWeiBN =', amountBuyerSendsToPurchaseInWeiBN);
		// console.log('amountBuyerSendsToPurchaseInWeiBN.toString() =', amountBuyerSendsToPurchaseInWeiBN.toString());

		let mediatorIpfsHashDescription = "DummyMediatorIpfsHashDescription";
		await franklinDecentralizedMarketplaceMediationContract.addOrUpdateMediator(mediatorIpfsHashDescription, {from: mediatorAddress})

		// This needs to be executed so that the given "mediatedSalesTransactionIpfsHash" gets stored as an already existing Mediated Sales Transaction in the
		// Smart Contract.
		await franklinDecentralizedMarketplaceMediationContract.purchaseItemWithMediator(sellerAddress, mediatorAddress, keyItemIpfsHash,
			mediatedSalesTransactionIpfsHash, quantity, {from: buyerAddress, value: amountBuyerSendsToPurchaseInWeiBN});

		// Buyer and Seller signal Approval of Mediated Sales Transaction.
		await franklinDecentralizedMarketplaceMediationContract.approveMediatedSalesTransaction(mediatedSalesTransactionIpfsHash, {from: sellerAddress});
		await franklinDecentralizedMarketplaceMediationContract.approveMediatedSalesTransaction(mediatedSalesTransactionIpfsHash, {from: buyerAddress});

		assert.equal(await franklinDecentralizedMarketplaceMediationContract.mediatedSalesTransactionHasBeenApproved.call(mediatedSalesTransactionIpfsHash), true,
			"Mediated Sales Transaction should initially be in the Approved State!");

		// Mediator now attempts to Approve Mediated Sales Transaction that is already in Approved State.
		await franklinDecentralizedMarketplaceMediationContract.approveMediatedSalesTransaction(
			mediatedSalesTransactionIpfsHash, {from: mediatorAddress});

		assert.equal(await franklinDecentralizedMarketplaceMediationContract.mediatedSalesTransactionApprovedByParties.call(
			mediatedSalesTransactionIpfsHash, MEDIATOR_INDEX), true, "Approval from the Mediator should have been noted!");

		assert.equal(await franklinDecentralizedMarketplaceMediationContract.mediatedSalesTransactionHasBeenApproved.call(mediatedSalesTransactionIpfsHash), true,
			"Mediated Sales Transaction should have stayed in the Approved State!");
	});

	it("FranklinDecentralizedMarketplaceMediation : test disapproveMediatedSalesTransaction method - given _mediatedSalesTransactionIpfsHash does not exist yet as a Mediated Sales Transaction in the Smart Contract", async () => {
		let mediatedSalesTransactionIpfsHash = "DummyMediationSalesTransaction_IpfsHash";
		assert.equal(await franklinDecentralizedMarketplaceMediationContract.mediatedSalesTransactionExists.call(mediatedSalesTransactionIpfsHash), false,
			"The given _mediatedSalesTransactionIpfsHash should not exist in the Smart Contract!");

		try {
			await franklinDecentralizedMarketplaceMediationContract.disapproveMediatedSalesTransaction(
				mediatedSalesTransactionIpfsHash, {from: accounts[(randomAddressIndex + 1) % NUMBER_OF_ACCOUNTS]});
			assert.fail("Should not be able to execute this method when _mediatedSalesTransactionIpfsHash does not exist in the Smart Contract!");
		} catch (error) {
			assert.ok(/revert/.test(error.message), "String 'revert' not present in error message!");
			assert.ok(/Given Mediated Sales Transaction IPFS Hash does not exist!/.test(error.message),
				"Appropriate error message not returned!");
		}
	});

	it("FranklinDecentralizedMarketplaceMediation : test disapproveMediatedSalesTransaction method - message sender is neither the buyer, seller, or mediator address of the given _mediatedSalesTransactionIpfsHash that exists as a Mediated Sales Transaction in the Smart Contract", async () => {
		let buyerAddress = accounts[(randomAddressIndex + 1) % NUMBER_OF_ACCOUNTS];
		let sellerAddress = accounts[(randomAddressIndex + 2) % NUMBER_OF_ACCOUNTS];
		let mediatorAddress = accounts[(randomAddressIndex + 3) % NUMBER_OF_ACCOUNTS];
		let keyItemIpfsHash = "DummyItem_IpfsHash";
		let mediatedSalesTransactionIpfsHash = "DummyMediationSalesTransaction_IpfsHash";
		let quantity = 3;

		await franklinDecentralizedMarketplaceContract.addItemForSale(keyItemIpfsHash, {from: sellerAddress});
		assert.equal(await franklinDecentralizedMarketplaceContract.itemForSaleFromSellerExists(sellerAddress, keyItemIpfsHash), true,
			"Item requested to purchase should exist as an item for sale from the seller!");

		await franklinDecentralizedMarketplaceContract.setQuantityAvailableForSaleOfAnItem(keyItemIpfsHash, quantity + 10, {from: sellerAddress})
		assert.ok(await franklinDecentralizedMarketplaceContract.getQuantityAvailableForSaleOfAnItemBySeller(sellerAddress, keyItemIpfsHash) >= quantity,
			"Number of items available for sale from the seller is greater than or equal to the number requested to purchase from the buyer!");

		let priceOfItemInWei = 0.25 * ETH;
		// console.log('priceOfItemInWei =', priceOfItemInWei);
		// console.log('priceOfItemInWei.toString() =', priceOfItemInWei.toString());
		let priceOfItemInWeiBN = new BN(priceOfItemInWei.toString());
		// console.log('priceOfItemInWeiBN =', priceOfItemInWeiBN);
		// console.log('priceOfItemInWeiBN.toString() =', priceOfItemInWeiBN.toString());
		await franklinDecentralizedMarketplaceContract.setPriceOfItem(keyItemIpfsHash, priceOfItemInWeiBN, {from: sellerAddress});

		let returnedPriceOfItemInWeiBN = await franklinDecentralizedMarketplaceContract.getPriceOfItem(sellerAddress, keyItemIpfsHash);
		// console.log('returnedPriceOfItemInWeiBN =', returnedPriceOfItemInWeiBN);
		// console.log('returnedPriceOfItemInWeiBN.toString() =', returnedPriceOfItemInWeiBN.toString());
		assert.notEqual(returnedPriceOfItemInWeiBN, new BN(0), "Seller should have set a non-zero price for the item requested to purchase from the buyer!");

		let amountNeededToPurchaseItemsInWei = quantity * priceOfItemInWei;
		let amountNeededToPurchaseItemsInWeiBN = new BN(amountNeededToPurchaseItemsInWei.toString());
		// console.log('amountNeededToPurchaseItemsInWei =', amountNeededToPurchaseItemsInWei);
		// console.log('amountNeededToPurchaseItemsInWeiBN =', amountNeededToPurchaseItemsInWeiBN);
		// console.log('amountNeededToPurchaseItemsInWeiBN.toString() =', amountNeededToPurchaseItemsInWeiBN.toString());
		let amountBuyerSendsToPurchaseInWeiBN = amountNeededToPurchaseItemsInWeiBN;
		// console.log('amountBuyerSendsToPurchaseInWeiBN =', amountBuyerSendsToPurchaseInWeiBN);
		// console.log('amountBuyerSendsToPurchaseInWeiBN.toString() =', amountBuyerSendsToPurchaseInWeiBN.toString());

		assert.equal(await franklinDecentralizedMarketplaceMediationContract.mediatedSalesTransactionExists.call(mediatedSalesTransactionIpfsHash), false,
			"Given _mediatedSalesTransactionIpfsHash should not exist yet inside of Smart Contract!");

		let mediatorIpfsHashDescription = "DummyMediatorIpfsHashDescription";
		await franklinDecentralizedMarketplaceMediationContract.addOrUpdateMediator(mediatorIpfsHashDescription, {from: mediatorAddress})
		assert.equal(await franklinDecentralizedMarketplaceMediationContract.mediatorExists.call(mediatorAddress), true,
			"Given Mediator Address should exist as a Mediator!");

		assert.equal(await franklinDecentralizedMarketplaceMediationContract.numberOfMediationsMediatorInvolved.call(mediatorAddress), 0,
			"Number of mediations mediator has been involved should initially be zero in this case!");

		// This needs to be executed so that the given "mediatedSalesTransactionIpfsHash" gets stored as an already existing Mediated Sales Transaction in the
		// Smart Contract.
		await franklinDecentralizedMarketplaceMediationContract.purchaseItemWithMediator(sellerAddress, mediatorAddress, keyItemIpfsHash,
			mediatedSalesTransactionIpfsHash, quantity, {from: buyerAddress, value: amountBuyerSendsToPurchaseInWeiBN});

		assert.equal(await franklinDecentralizedMarketplaceMediationContract.mediatedSalesTransactionExists.call(mediatedSalesTransactionIpfsHash), true,
			"The given _mediatedSalesTransactionIpfsHash should exist in the Smart Contract!");

		try {
			await franklinDecentralizedMarketplaceMediationContract.disapproveMediatedSalesTransaction(
				mediatedSalesTransactionIpfsHash, {from: accounts[(randomAddressIndex + 4) % NUMBER_OF_ACCOUNTS]});
			assert.fail("Should not be able to execute this method when Message Sender is neither the Buyer, Seller, nor Mediator Address!");
		} catch (error) {
			assert.ok(/revert/.test(error.message), "String 'revert' not present in error message!");
			assert.ok(/Not allowed to Disapprove Mediated Sales Transaction, because Message Sender is neither the Buyer, Seller, or Mediator!/.test(error.message),
				"Appropriate error message not returned!");
		}
	});

	it("FranklinDecentralizedMarketplaceMediation : test disapproveMediatedSalesTransaction method - nobody has yet done disapproval and message sender is the buyer address of the given _mediatedSalesTransactionIpfsHash that exists as a Mediated Sales Transaction in the Smart Contract", async () => {
		let buyerAddress = accounts[(randomAddressIndex + 1) % NUMBER_OF_ACCOUNTS];
		let sellerAddress = accounts[(randomAddressIndex + 2) % NUMBER_OF_ACCOUNTS];
		let mediatorAddress = accounts[(randomAddressIndex + 3) % NUMBER_OF_ACCOUNTS];
		let keyItemIpfsHash = "DummyItem_IpfsHash";
		let mediatedSalesTransactionIpfsHash = "DummyMediationSalesTransaction_IpfsHash";
		let quantity = 3;

		await franklinDecentralizedMarketplaceContract.addItemForSale(keyItemIpfsHash, {from: sellerAddress});
		assert.equal(await franklinDecentralizedMarketplaceContract.itemForSaleFromSellerExists(sellerAddress, keyItemIpfsHash), true,
			"Item requested to purchase should exist as an item for sale from the seller!");

		await franklinDecentralizedMarketplaceContract.setQuantityAvailableForSaleOfAnItem(keyItemIpfsHash, quantity + 10, {from: sellerAddress})
		assert.ok(await franklinDecentralizedMarketplaceContract.getQuantityAvailableForSaleOfAnItemBySeller(sellerAddress, keyItemIpfsHash) >= quantity,
			"Number of items available for sale from the seller is greater than or equal to the number requested to purchase from the buyer!");

		let priceOfItemInWei = 0.25 * ETH;
		// console.log('priceOfItemInWei =', priceOfItemInWei);
		// console.log('priceOfItemInWei.toString() =', priceOfItemInWei.toString());
		let priceOfItemInWeiBN = new BN(priceOfItemInWei.toString());
		// console.log('priceOfItemInWeiBN =', priceOfItemInWeiBN);
		// console.log('priceOfItemInWeiBN.toString() =', priceOfItemInWeiBN.toString());
		await franklinDecentralizedMarketplaceContract.setPriceOfItem(keyItemIpfsHash, priceOfItemInWeiBN, {from: sellerAddress});

		let returnedPriceOfItemInWeiBN = await franklinDecentralizedMarketplaceContract.getPriceOfItem(sellerAddress, keyItemIpfsHash);
		// console.log('returnedPriceOfItemInWeiBN =', returnedPriceOfItemInWeiBN);
		// console.log('returnedPriceOfItemInWeiBN.toString() =', returnedPriceOfItemInWeiBN.toString());
		assert.notEqual(returnedPriceOfItemInWeiBN, new BN(0), "Seller should have set a non-zero price for the item requested to purchase from the buyer!");

		let amountNeededToPurchaseItemsInWei = quantity * priceOfItemInWei;
		let amountNeededToPurchaseItemsInWeiBN = new BN(amountNeededToPurchaseItemsInWei.toString());
		// console.log('amountNeededToPurchaseItemsInWei =', amountNeededToPurchaseItemsInWei);
		// console.log('amountNeededToPurchaseItemsInWeiBN =', amountNeededToPurchaseItemsInWeiBN);
		// console.log('amountNeededToPurchaseItemsInWeiBN.toString() =', amountNeededToPurchaseItemsInWeiBN.toString());
		let amountBuyerSendsToPurchaseInWeiBN = amountNeededToPurchaseItemsInWeiBN;
		// console.log('amountBuyerSendsToPurchaseInWeiBN =', amountBuyerSendsToPurchaseInWeiBN);
		// console.log('amountBuyerSendsToPurchaseInWeiBN.toString() =', amountBuyerSendsToPurchaseInWeiBN.toString());

		assert.equal(await franklinDecentralizedMarketplaceMediationContract.mediatedSalesTransactionExists.call(mediatedSalesTransactionIpfsHash), false,
			"Given _mediatedSalesTransactionIpfsHash should not exist yet inside of Smart Contract!");

		let mediatorIpfsHashDescription = "DummyMediatorIpfsHashDescription";
		await franklinDecentralizedMarketplaceMediationContract.addOrUpdateMediator(mediatorIpfsHashDescription, {from: mediatorAddress})
		assert.equal(await franklinDecentralizedMarketplaceMediationContract.mediatorExists.call(mediatorAddress), true,
			"Given Mediator Address should exist as a Mediator!");

		assert.equal(await franklinDecentralizedMarketplaceMediationContract.numberOfMediationsMediatorInvolved.call(mediatorAddress), 0,
			"Number of mediations mediator has been involved should initially be zero in this case!");

		// This needs to be executed so that the given "mediatedSalesTransactionIpfsHash" gets stored as an already existing Mediated Sales Transaction in the
		// Smart Contract.
		await franklinDecentralizedMarketplaceMediationContract.purchaseItemWithMediator(sellerAddress, mediatorAddress, keyItemIpfsHash,
			mediatedSalesTransactionIpfsHash, quantity, {from: buyerAddress, value: amountBuyerSendsToPurchaseInWeiBN});

		assert.equal(await franklinDecentralizedMarketplaceMediationContract.mediatedSalesTransactionExists.call(mediatedSalesTransactionIpfsHash), true,
			"The given _mediatedSalesTransactionIpfsHash should exist in the Smart Contract!");

		await franklinDecentralizedMarketplaceMediationContract.disapproveMediatedSalesTransaction(mediatedSalesTransactionIpfsHash, {from: buyerAddress});

		// Note the approval from the "msg.sender" Address. If one disapproves, than one cannot approve.
		assert.equal(await franklinDecentralizedMarketplaceMediationContract.mediatedSalesTransactionApprovedByParties.call(
			mediatedSalesTransactionIpfsHash, BUYER_INDEX), false,
			`The mediatedSalesTransactionApprovedByParties[${mediatedSalesTransactionIpfsHash}][${BUYER_INDEX}] should be boolean false!`);
		assert.equal(await franklinDecentralizedMarketplaceMediationContract.mediatedSalesTransactionDisapprovedByParties.call(
			mediatedSalesTransactionIpfsHash, BUYER_INDEX), true,
			`The mediatedSalesTransactionDisapprovedByParties[${mediatedSalesTransactionIpfsHash}][${BUYER_INDEX}] should be boolean true!`);

		assert.equal(await franklinDecentralizedMarketplaceMediationContract.mediatedSalesTransactionHasBeenDisapproved.call(mediatedSalesTransactionIpfsHash), false,
			"Mediated Sales Transaction should not be in the Disapproved State if only one party has signaled disapproval!");
	});

	it("FranklinDecentralizedMarketplaceMediation : test disapproveMediatedSalesTransaction method - buyer and seller addresses signal disapproval of the given _mediatedSalesTransactionIpfsHash that exists as a Mediated Sales Transaction in the Smart Contract", async () => {
		let buyerAddress = accounts[(randomAddressIndex + 1) % NUMBER_OF_ACCOUNTS];
		let sellerAddress = accounts[(randomAddressIndex + 2) % NUMBER_OF_ACCOUNTS];
		let mediatorAddress = accounts[(randomAddressIndex + 3) % NUMBER_OF_ACCOUNTS];
		let keyItemIpfsHash = "DummyItem_IpfsHash";
		let mediatedSalesTransactionIpfsHash = "DummyMediationSalesTransaction_IpfsHash";
		let quantity = 3;

		await franklinDecentralizedMarketplaceContract.addItemForSale(keyItemIpfsHash, {from: sellerAddress});
		assert.equal(await franklinDecentralizedMarketplaceContract.itemForSaleFromSellerExists(sellerAddress, keyItemIpfsHash), true,
			"Item requested to purchase should exist as an item for sale from the seller!");

		await franklinDecentralizedMarketplaceContract.setQuantityAvailableForSaleOfAnItem(keyItemIpfsHash, quantity + 10, {from: sellerAddress})
		assert.ok(await franklinDecentralizedMarketplaceContract.getQuantityAvailableForSaleOfAnItemBySeller(sellerAddress, keyItemIpfsHash) >= quantity,
			"Number of items available for sale from the seller is greater than or equal to the number requested to purchase from the buyer!");

		let priceOfItemInWei = 0.25 * ETH;
		// console.log('priceOfItemInWei =', priceOfItemInWei);
		// console.log('priceOfItemInWei.toString() =', priceOfItemInWei.toString());
		let priceOfItemInWeiBN = new BN(priceOfItemInWei.toString());
		// console.log('priceOfItemInWeiBN =', priceOfItemInWeiBN);
		// console.log('priceOfItemInWeiBN.toString() =', priceOfItemInWeiBN.toString());
		await franklinDecentralizedMarketplaceContract.setPriceOfItem(keyItemIpfsHash, priceOfItemInWeiBN, {from: sellerAddress});

		let returnedPriceOfItemInWeiBN = await franklinDecentralizedMarketplaceContract.getPriceOfItem(sellerAddress, keyItemIpfsHash);
		// console.log('returnedPriceOfItemInWeiBN =', returnedPriceOfItemInWeiBN);
		// console.log('returnedPriceOfItemInWeiBN.toString() =', returnedPriceOfItemInWeiBN.toString());
		assert.notEqual(returnedPriceOfItemInWeiBN, new BN(0), "Seller should have set a non-zero price for the item requested to purchase from the buyer!");

		let amountNeededToPurchaseItemsInWei = quantity * priceOfItemInWei;
		let amountNeededToPurchaseItemsInWeiBN = new BN(amountNeededToPurchaseItemsInWei.toString());
		// console.log('amountNeededToPurchaseItemsInWei =', amountNeededToPurchaseItemsInWei);
		// console.log('amountNeededToPurchaseItemsInWeiBN =', amountNeededToPurchaseItemsInWeiBN);
		// console.log('amountNeededToPurchaseItemsInWeiBN.toString() =', amountNeededToPurchaseItemsInWeiBN.toString());
		let amountBuyerSendsToPurchaseInWeiBN = amountNeededToPurchaseItemsInWeiBN;
		// console.log('amountBuyerSendsToPurchaseInWeiBN =', amountBuyerSendsToPurchaseInWeiBN);
		// console.log('amountBuyerSendsToPurchaseInWeiBN.toString() =', amountBuyerSendsToPurchaseInWeiBN.toString());

		assert.equal(await franklinDecentralizedMarketplaceMediationContract.mediatedSalesTransactionExists.call(mediatedSalesTransactionIpfsHash), false,
			"Given _mediatedSalesTransactionIpfsHash should not exist yet inside of Smart Contract!");

		let mediatorIpfsHashDescription = "DummyMediatorIpfsHashDescription";
		await franklinDecentralizedMarketplaceMediationContract.addOrUpdateMediator(mediatorIpfsHashDescription, {from: mediatorAddress})
		assert.equal(await franklinDecentralizedMarketplaceMediationContract.mediatorExists.call(mediatorAddress), true,
			"Given Mediator Address should exist as a Mediator!");

		assert.equal(await franklinDecentralizedMarketplaceMediationContract.numberOfMediationsMediatorInvolved.call(mediatorAddress), 0,
			"Number of mediations mediator has been involved should initially be zero in this case!");

		// This needs to be executed so that the given "mediatedSalesTransactionIpfsHash" gets stored as an already existing Mediated Sales Transaction in the
		// Smart Contract.
		await franklinDecentralizedMarketplaceMediationContract.purchaseItemWithMediator(sellerAddress, mediatorAddress, keyItemIpfsHash,
			mediatedSalesTransactionIpfsHash, quantity, {from: buyerAddress, value: amountBuyerSendsToPurchaseInWeiBN});

		assert.equal(await franklinDecentralizedMarketplaceMediationContract.mediatedSalesTransactionExists.call(mediatedSalesTransactionIpfsHash), true,
			"The given _mediatedSalesTransactionIpfsHash should exist in the Smart Contract!");

		// First Buyer signals Disapproval of Mediated Sales Transaction.
		await franklinDecentralizedMarketplaceMediationContract.disapproveMediatedSalesTransaction(mediatedSalesTransactionIpfsHash, {from: buyerAddress});

		// Note the approval from the "msg.sender" Address. If one disapproves, than one cannot approve.
		assert.equal(await franklinDecentralizedMarketplaceMediationContract.mediatedSalesTransactionApprovedByParties.call(
			mediatedSalesTransactionIpfsHash, BUYER_INDEX), false,
			`The mediatedSalesTransactionApprovedByParties[${mediatedSalesTransactionIpfsHash}][${BUYER_INDEX}] should be boolean false!`);
		assert.equal(await franklinDecentralizedMarketplaceMediationContract.mediatedSalesTransactionDisapprovedByParties.call(
			mediatedSalesTransactionIpfsHash, BUYER_INDEX), true,
			`The mediatedSalesTransactionDisapprovedByParties[${mediatedSalesTransactionIpfsHash}][${BUYER_INDEX}] should be boolean true!`);

		assert.equal(await franklinDecentralizedMarketplaceMediationContract.mediatedSalesTransactionHasBeenDisapproved.call(mediatedSalesTransactionIpfsHash), false,
			"Mediated Sales Transaction should not be in the Disapproved State if only one party has signaled disapproval!");

		let buyerBalanceBeforeDisapprovalStr = await web3.eth.getBalance(buyerAddress);
		let buyerBalanceBeforeDisapprovalBN = new BN(buyerBalanceBeforeDisapprovalStr);
		// console.log('buyerBalanceBeforeDisapprovalStr =', buyerBalanceBeforeDisapprovalStr);
		// console.log('buyerBalanceBeforeDisapprovalBN =', buyerBalanceBeforeDisapprovalBN);
		// console.log('buyerBalanceBeforeDisapprovalBN.toString() =', buyerBalanceBeforeDisapprovalBN.toString());

		let mediationContractBalanceBeforeDisapprovalStr = await web3.eth.getBalance(franklinDecentralizedMarketplaceMediationContract.address);
		let mediationContractBalanceBeforeDisapprovalBN = new BN(mediationContractBalanceBeforeDisapprovalStr);
		// console.log('mediationContractBalanceBeforeDisapprovalStr =', mediationContractBalanceBeforeDisapprovalStr);
		// console.log('mediationContractBalanceBeforeDisapprovalBN =', mediationContractBalanceBeforeDisapprovalBN);
		// console.log('mediationContractBalanceBeforeDisapprovalBN.toString() =', mediationContractBalanceBeforeDisapprovalBN.toString());

		// Second... Seller signals Dispproval of the Mediated Sales Transaction
		let results = await franklinDecentralizedMarketplaceMediationContract.disapproveMediatedSalesTransaction(mediatedSalesTransactionIpfsHash, {from: sellerAddress});

		let buyerBalanceAfterDisapprovalStr = await web3.eth.getBalance(buyerAddress);
		let buyerBalanceAfterDisapprovalBN = new BN(buyerBalanceAfterDisapprovalStr);
		// console.log('buyerBalanceAfterDisapprovalStr =', buyerBalanceAfterDisapprovalStr);
		// console.log('buyerBalanceAfterDisapprovalBN =', buyerBalanceAfterDisapprovalBN);
		// console.log('buyerBalanceAfterDisapprovalBN.toString() =', buyerBalanceAfterDisapprovalBN.toString());

		let mediationContractBalanceAfterDisapprovalStr = await web3.eth.getBalance(franklinDecentralizedMarketplaceMediationContract.address);
		let mediationContractBalanceAfterDisapprovalBN = new BN(mediationContractBalanceAfterDisapprovalStr);
		// console.log('mediationContractBalanceAfterDisapprovalStr =', mediationContractBalanceAfterDisapprovalStr);
		// console.log('mediationContractBalanceAfterDisapprovalBN =', mediationContractBalanceAfterDisapprovalBN);
		// console.log('mediationContractBalanceAfterDisapprovalBN.toString() =', mediationContractBalanceAfterDisapprovalBN.toString());

		let amountOfWeiToSendBuyerBN = amountNeededToPurchaseItemsInWeiBN;
		// console.log('amountOfWeiToSendBuyerBN.toString() =', amountOfWeiToSendBuyerBN.toString());

		let cummulativeGasUsed = results.receipt.cumulativeGasUsed;
		// console.log('cummulativeGasUsed =', cummulativeGasUsed);

		let expectedBuyerBalanceAfterDisapprovalBN = buyerBalanceBeforeDisapprovalBN.add(amountOfWeiToSendBuyerBN); // 100% refund to buyer
		// expectedBuyerBalanceAfterDisapprovalBN = expectedBuyerBalanceAfterDisapprovalBN.sub(new BN(cummulativeGasUsed * GAS_BASE_UNIT)); // subtract gas spent
		// console.log('expectedBuyerBalanceAfterDisapprovalBN.toString() =', expectedBuyerBalanceAfterDisapprovalBN.toString());

		let expectedMediationContractBalanceAfterDisapprovalBN = mediationContractBalanceBeforeDisapprovalBN.sub(amountNeededToPurchaseItemsInWeiBN);
		// console.log('expectedMediationContractBalanceAfterDisapprovalBN.toString() =', expectedMediationContractBalanceAfterDisapprovalBN.toString());

		assert.equal(mediationContractBalanceAfterDisapprovalBN.toString(), expectedMediationContractBalanceAfterDisapprovalBN.toString(),
			"Mediation Contract Address Balance after disapproval is incorrect!");
		assert.equal(buyerBalanceAfterDisapprovalBN.toString(), expectedBuyerBalanceAfterDisapprovalBN.toString(),
			"Buyer Address Balance after disaapproval is incorrect!");

		// Note the disaapproval from the "msg.sender" Address. If one disapproves, than one cannot approve.
		assert.equal(await franklinDecentralizedMarketplaceMediationContract.mediatedSalesTransactionApprovedByParties.call(
			mediatedSalesTransactionIpfsHash, SELLER_INDEX), false,
			`The mediatedSalesTransactionApprovedByParties[${mediatedSalesTransactionIpfsHash}][${SELLER_INDEX}] should be boolean false!`);
		assert.equal(await franklinDecentralizedMarketplaceMediationContract.mediatedSalesTransactionDisapprovedByParties.call(
			mediatedSalesTransactionIpfsHash, SELLER_INDEX), true,
			`The mediatedSalesTransactionDisapprovedByParties[${mediatedSalesTransactionIpfsHash}][${SELLER_INDEX}] should be boolean true!`);

		assert.equal(await franklinDecentralizedMarketplaceMediationContract.mediatedSalesTransactionHasBeenDisapproved.call(mediatedSalesTransactionIpfsHash), true,
			"Mediated Sales Transaction should now be in the Disapproved State because two parties have signaled disapproval!");

		// Making sure that MediatedSalesTransactionHasBeenFullyDisapprovedEvent(_mediatedSalesTransactionIpfsHash) fired off
		assert.equal(results.logs.length, 1, "There should have been one Event Fired Off!");
		assert.equal(results.logs[0].event, 'MediatedSalesTransactionHasBeenFullyDisapprovedEvent', "There should have been a MediatedSalesTransactionHasBeenFullyDisapprovedEvent Fired Off!");
		assert.ok(results.logs[0].args !== undefined, "There should have been a results.logs[0].args object!");
		assert.equal(results.logs[0].args.__length__, 1, "There should have been 1 argument(s) in the MediatedSalesTransactionHasBeenFullyDisapprovedEvent that Fired Off!");
		assert.equal(results.logs[0].args._mediatedSalesTransactionIpfsHash, mediatedSalesTransactionIpfsHash, "The _mediatedSalesTransactionIpfsHash argument should be IPFS Hash of Item bought!");
	});

	it("FranklinDecentralizedMarketplaceMediation : test disapproveMediatedSalesTransaction method - nobody has yet done disapproval and message sender is the seller address of the given _mediatedSalesTransactionIpfsHash that exists as a Mediated Sales Transaction in the Smart Contract", async () => {
		let buyerAddress = accounts[(randomAddressIndex + 1) % NUMBER_OF_ACCOUNTS];
		let sellerAddress = accounts[(randomAddressIndex + 2) % NUMBER_OF_ACCOUNTS];
		let mediatorAddress = accounts[(randomAddressIndex + 3) % NUMBER_OF_ACCOUNTS];
		let keyItemIpfsHash = "DummyItem_IpfsHash";
		let mediatedSalesTransactionIpfsHash = "DummyMediationSalesTransaction_IpfsHash";
		let quantity = 3;

		await franklinDecentralizedMarketplaceContract.addItemForSale(keyItemIpfsHash, {from: sellerAddress});
		assert.equal(await franklinDecentralizedMarketplaceContract.itemForSaleFromSellerExists(sellerAddress, keyItemIpfsHash), true,
			"Item requested to purchase should exist as an item for sale from the seller!");

		await franklinDecentralizedMarketplaceContract.setQuantityAvailableForSaleOfAnItem(keyItemIpfsHash, quantity + 10, {from: sellerAddress})
		assert.ok(await franklinDecentralizedMarketplaceContract.getQuantityAvailableForSaleOfAnItemBySeller(sellerAddress, keyItemIpfsHash) >= quantity,
			"Number of items available for sale from the seller is greater than or equal to the number requested to purchase from the buyer!");

		let priceOfItemInWei = 0.25 * ETH;
		// console.log('priceOfItemInWei =', priceOfItemInWei);
		// console.log('priceOfItemInWei.toString() =', priceOfItemInWei.toString());
		let priceOfItemInWeiBN = new BN(priceOfItemInWei.toString());
		// console.log('priceOfItemInWeiBN =', priceOfItemInWeiBN);
		// console.log('priceOfItemInWeiBN.toString() =', priceOfItemInWeiBN.toString());
		await franklinDecentralizedMarketplaceContract.setPriceOfItem(keyItemIpfsHash, priceOfItemInWeiBN, {from: sellerAddress});

		let returnedPriceOfItemInWeiBN = await franklinDecentralizedMarketplaceContract.getPriceOfItem(sellerAddress, keyItemIpfsHash);
		// console.log('returnedPriceOfItemInWeiBN =', returnedPriceOfItemInWeiBN);
		// console.log('returnedPriceOfItemInWeiBN.toString() =', returnedPriceOfItemInWeiBN.toString());
		assert.notEqual(returnedPriceOfItemInWeiBN, new BN(0), "Seller should have set a non-zero price for the item requested to purchase from the buyer!");

		let amountNeededToPurchaseItemsInWei = quantity * priceOfItemInWei;
		let amountNeededToPurchaseItemsInWeiBN = new BN(amountNeededToPurchaseItemsInWei.toString());
		// console.log('amountNeededToPurchaseItemsInWei =', amountNeededToPurchaseItemsInWei);
		// console.log('amountNeededToPurchaseItemsInWeiBN =', amountNeededToPurchaseItemsInWeiBN);
		// console.log('amountNeededToPurchaseItemsInWeiBN.toString() =', amountNeededToPurchaseItemsInWeiBN.toString());
		let amountBuyerSendsToPurchaseInWeiBN = amountNeededToPurchaseItemsInWeiBN;
		// console.log('amountBuyerSendsToPurchaseInWeiBN =', amountBuyerSendsToPurchaseInWeiBN);
		// console.log('amountBuyerSendsToPurchaseInWeiBN.toString() =', amountBuyerSendsToPurchaseInWeiBN.toString());

		assert.equal(await franklinDecentralizedMarketplaceMediationContract.mediatedSalesTransactionExists.call(mediatedSalesTransactionIpfsHash), false,
			"Given _mediatedSalesTransactionIpfsHash should not exist yet inside of Smart Contract!");

		let mediatorIpfsHashDescription = "DummyMediatorIpfsHashDescription";
		await franklinDecentralizedMarketplaceMediationContract.addOrUpdateMediator(mediatorIpfsHashDescription, {from: mediatorAddress})
		assert.equal(await franklinDecentralizedMarketplaceMediationContract.mediatorExists.call(mediatorAddress), true,
			"Given Mediator Address should exist as a Mediator!");

		assert.equal(await franklinDecentralizedMarketplaceMediationContract.numberOfMediationsMediatorInvolved.call(mediatorAddress), 0,
			"Number of mediations mediator has been involved should initially be zero in this case!");

		// This needs to be executed so that the given "mediatedSalesTransactionIpfsHash" gets stored as an already existing Mediated Sales Transaction in the
		// Smart Contract.
		await franklinDecentralizedMarketplaceMediationContract.purchaseItemWithMediator(sellerAddress, mediatorAddress, keyItemIpfsHash,
			mediatedSalesTransactionIpfsHash, quantity, {from: buyerAddress, value: amountBuyerSendsToPurchaseInWeiBN});

		assert.equal(await franklinDecentralizedMarketplaceMediationContract.mediatedSalesTransactionExists.call(mediatedSalesTransactionIpfsHash), true,
			"The given _mediatedSalesTransactionIpfsHash should exist in the Smart Contract!");

		await franklinDecentralizedMarketplaceMediationContract.disapproveMediatedSalesTransaction(mediatedSalesTransactionIpfsHash, {from: sellerAddress});

		// Note the approval from the "msg.sender" Address. If one disapproves, than one cannot approve.
		assert.equal(await franklinDecentralizedMarketplaceMediationContract.mediatedSalesTransactionApprovedByParties.call(
			mediatedSalesTransactionIpfsHash, SELLER_INDEX), false,
			`The mediatedSalesTransactionApprovedByParties[${mediatedSalesTransactionIpfsHash}][${SELLER_INDEX}] should be boolean false!`);
		assert.equal(await franklinDecentralizedMarketplaceMediationContract.mediatedSalesTransactionDisapprovedByParties.call(
			mediatedSalesTransactionIpfsHash, SELLER_INDEX), true,
			`The mediatedSalesTransactionDisapprovedByParties[${mediatedSalesTransactionIpfsHash}][${SELLER_INDEX}] should be boolean true!`);

		assert.equal(await franklinDecentralizedMarketplaceMediationContract.mediatedSalesTransactionHasBeenDisapproved.call(mediatedSalesTransactionIpfsHash), false,
			"Mediated Sales Transaction should not be in the Disapproved State if only one party has signaled disapproval!");
	});

	it("FranklinDecentralizedMarketplaceMediation : test disapproveMediatedSalesTransaction method - seller and mediator addresses signal disapproval of the given _mediatedSalesTransactionIpfsHash that exists as a Mediated Sales Transaction in the Smart Contract", async () => {
		let buyerAddress = accounts[(randomAddressIndex + 1) % NUMBER_OF_ACCOUNTS];
		let sellerAddress = accounts[(randomAddressIndex + 2) % NUMBER_OF_ACCOUNTS];
		let mediatorAddress = accounts[(randomAddressIndex + 3) % NUMBER_OF_ACCOUNTS];
		let keyItemIpfsHash = "DummyItem_IpfsHash";
		let mediatedSalesTransactionIpfsHash = "DummyMediationSalesTransaction_IpfsHash";
		let quantity = 3;

		await franklinDecentralizedMarketplaceContract.addItemForSale(keyItemIpfsHash, {from: sellerAddress});
		assert.equal(await franklinDecentralizedMarketplaceContract.itemForSaleFromSellerExists(sellerAddress, keyItemIpfsHash), true,
			"Item requested to purchase should exist as an item for sale from the seller!");

		await franklinDecentralizedMarketplaceContract.setQuantityAvailableForSaleOfAnItem(keyItemIpfsHash, quantity + 10, {from: sellerAddress})
		assert.ok(await franklinDecentralizedMarketplaceContract.getQuantityAvailableForSaleOfAnItemBySeller(sellerAddress, keyItemIpfsHash) >= quantity,
			"Number of items available for sale from the seller is greater than or equal to the number requested to purchase from the buyer!");

		let priceOfItemInWei = 0.25 * ETH;
		// console.log('priceOfItemInWei =', priceOfItemInWei);
		// console.log('priceOfItemInWei.toString() =', priceOfItemInWei.toString());
		let priceOfItemInWeiBN = new BN(priceOfItemInWei.toString());
		// console.log('priceOfItemInWeiBN =', priceOfItemInWeiBN);
		// console.log('priceOfItemInWeiBN.toString() =', priceOfItemInWeiBN.toString());
		await franklinDecentralizedMarketplaceContract.setPriceOfItem(keyItemIpfsHash, priceOfItemInWeiBN, {from: sellerAddress});

		let returnedPriceOfItemInWeiBN = await franklinDecentralizedMarketplaceContract.getPriceOfItem(sellerAddress, keyItemIpfsHash);
		// console.log('returnedPriceOfItemInWeiBN =', returnedPriceOfItemInWeiBN);
		// console.log('returnedPriceOfItemInWeiBN.toString() =', returnedPriceOfItemInWeiBN.toString());
		assert.notEqual(returnedPriceOfItemInWeiBN, new BN(0), "Seller should have set a non-zero price for the item requested to purchase from the buyer!");

		let amountNeededToPurchaseItemsInWei = quantity * priceOfItemInWei;
		let amountNeededToPurchaseItemsInWeiBN = new BN(amountNeededToPurchaseItemsInWei.toString());
		// console.log('amountNeededToPurchaseItemsInWei =', amountNeededToPurchaseItemsInWei);
		// console.log('amountNeededToPurchaseItemsInWeiBN =', amountNeededToPurchaseItemsInWeiBN);
		// console.log('amountNeededToPurchaseItemsInWeiBN.toString() =', amountNeededToPurchaseItemsInWeiBN.toString());
		let amountBuyerSendsToPurchaseInWeiBN = amountNeededToPurchaseItemsInWeiBN;
		// console.log('amountBuyerSendsToPurchaseInWeiBN =', amountBuyerSendsToPurchaseInWeiBN);
		// console.log('amountBuyerSendsToPurchaseInWeiBN.toString() =', amountBuyerSendsToPurchaseInWeiBN.toString());

		assert.equal(await franklinDecentralizedMarketplaceMediationContract.mediatedSalesTransactionExists.call(mediatedSalesTransactionIpfsHash), false,
			"Given _mediatedSalesTransactionIpfsHash should not exist yet inside of Smart Contract!");

		let mediatorIpfsHashDescription = "DummyMediatorIpfsHashDescription";
		await franklinDecentralizedMarketplaceMediationContract.addOrUpdateMediator(mediatorIpfsHashDescription, {from: mediatorAddress})
		assert.equal(await franklinDecentralizedMarketplaceMediationContract.mediatorExists.call(mediatorAddress), true,
			"Given Mediator Address should exist as a Mediator!");

		assert.equal(await franklinDecentralizedMarketplaceMediationContract.numberOfMediationsMediatorInvolved.call(mediatorAddress), 0,
			"Number of mediations mediator has been involved should initially be zero in this case!");

		// This needs to be executed so that the given "mediatedSalesTransactionIpfsHash" gets stored as an already existing Mediated Sales Transaction in the
		// Smart Contract.
		await franklinDecentralizedMarketplaceMediationContract.purchaseItemWithMediator(sellerAddress, mediatorAddress, keyItemIpfsHash,
			mediatedSalesTransactionIpfsHash, quantity, {from: buyerAddress, value: amountBuyerSendsToPurchaseInWeiBN});

		assert.equal(await franklinDecentralizedMarketplaceMediationContract.mediatedSalesTransactionExists.call(mediatedSalesTransactionIpfsHash), true,
			"The given _mediatedSalesTransactionIpfsHash should exist in the Smart Contract!");

		// First Seller signals Disapproval of Mediated Sales Transaction.
		await franklinDecentralizedMarketplaceMediationContract.disapproveMediatedSalesTransaction(mediatedSalesTransactionIpfsHash, {from: sellerAddress});

		// Note the approval from the "msg.sender" Address. If one disapproves, than one cannot approve.
		assert.equal(await franklinDecentralizedMarketplaceMediationContract.mediatedSalesTransactionApprovedByParties.call(
			mediatedSalesTransactionIpfsHash, SELLER_INDEX), false,
			`The mediatedSalesTransactionApprovedByParties[${mediatedSalesTransactionIpfsHash}][${SELLER_INDEX}] should be boolean false!`);
		assert.equal(await franklinDecentralizedMarketplaceMediationContract.mediatedSalesTransactionDisapprovedByParties.call(
			mediatedSalesTransactionIpfsHash, SELLER_INDEX), true,
			`The mediatedSalesTransactionDisapprovedByParties[${mediatedSalesTransactionIpfsHash}][${SELLER_INDEX}] should be boolean true!`);

		assert.equal(await franklinDecentralizedMarketplaceMediationContract.mediatedSalesTransactionHasBeenDisapproved.call(mediatedSalesTransactionIpfsHash), false,
			"Mediated Sales Transaction should not be in the Disapproved State if only one party has signaled disapproval!");

		let buyerBalanceBeforeDisapprovalStr = await web3.eth.getBalance(buyerAddress);
		let buyerBalanceBeforeDisapprovalBN = new BN(buyerBalanceBeforeDisapprovalStr);
		// console.log('buyerBalanceBeforeDisapprovalStr =', buyerBalanceBeforeDisapprovalStr);
		// console.log('buyerBalanceBeforeDisapprovalBN =', buyerBalanceBeforeDisapprovalBN);
		// console.log('buyerBalanceBeforeDisapprovalBN.toString() =', buyerBalanceBeforeDisapprovalBN.toString());

		let mediationContractBalanceBeforeDisapprovalStr = await web3.eth.getBalance(franklinDecentralizedMarketplaceMediationContract.address);
		let mediationContractBalanceBeforeDisapprovalBN = new BN(mediationContractBalanceBeforeDisapprovalStr);
		// console.log('mediationContractBalanceBeforeDisapprovalStr =', mediationContractBalanceBeforeDisapprovalStr);
		// console.log('mediationContractBalanceBeforeDisapprovalBN =', mediationContractBalanceBeforeDisapprovalBN);
		// console.log('mediationContractBalanceBeforeDisapprovalBN.toString() =', mediationContractBalanceBeforeDisapprovalBN.toString());

		// Second... Mediator signals Disapproval of the Mediated Sales Transaction
		let results = await franklinDecentralizedMarketplaceMediationContract.disapproveMediatedSalesTransaction(mediatedSalesTransactionIpfsHash, {from: mediatorAddress});

		let buyerBalanceAfterDisapprovalStr = await web3.eth.getBalance(buyerAddress);
		let buyerBalanceAfterDisapprovalBN = new BN(buyerBalanceAfterDisapprovalStr);
		// console.log('buyerBalanceAfterDisapprovalStr =', buyerBalanceAfterDisapprovalStr);
		// console.log('buyerBalanceAfterDisapprovalBN =', buyerBalanceAfterDisapprovalBN);
		// console.log('buyerBalanceAfterDisapprovalBN.toString() =', buyerBalanceAfterDisapprovalBN.toString());

		let mediationContractBalanceAfterDisapprovalStr = await web3.eth.getBalance(franklinDecentralizedMarketplaceMediationContract.address);
		let mediationContractBalanceAfterDisapprovalBN = new BN(mediationContractBalanceAfterDisapprovalStr);
		// console.log('mediationContractBalanceAfterDisapprovalStr =', mediationContractBalanceAfterDisapprovalStr);
		// console.log('mediationContractBalanceAfterDisapprovalBN =', mediationContractBalanceAfterDisapprovalBN);
		// console.log('mediationContractBalanceAfterDisapprovalBN.toString() =', mediationContractBalanceAfterDisapprovalBN.toString());

		let amountOfWeiToSendBuyerBN = amountNeededToPurchaseItemsInWeiBN;
		// console.log('amountOfWeiToSendBuyerBN.toString() =', amountOfWeiToSendBuyerBN.toString());

		let cummulativeGasUsed = results.receipt.cumulativeGasUsed;
		// console.log('cummulativeGasUsed =', cummulativeGasUsed);

		let expectedBuyerBalanceAfterDisapprovalBN = buyerBalanceBeforeDisapprovalBN.add(amountOfWeiToSendBuyerBN); // 100% refund to buyer
		// expectedBuyerBalanceAfterDisapprovalBN = expectedBuyerBalanceAfterDisapprovalBN.sub(new BN(cummulativeGasUsed * GAS_BASE_UNIT)); // subtract gas spent
		// console.log('expectedBuyerBalanceAfterDisapprovalBN.toString() =', expectedBuyerBalanceAfterDisapprovalBN.toString());

		let expectedMediationContractBalanceAfterDisapprovalBN = mediationContractBalanceBeforeDisapprovalBN.sub(amountNeededToPurchaseItemsInWeiBN);
		// console.log('expectedMediationContractBalanceAfterDisapprovalBN.toString() =', expectedMediationContractBalanceAfterDisapprovalBN.toString());

		assert.equal(mediationContractBalanceAfterDisapprovalBN.toString(), expectedMediationContractBalanceAfterDisapprovalBN.toString(),
			"Mediation Contract Address Balance after disapproval is incorrect!");
		assert.equal(buyerBalanceAfterDisapprovalBN.toString(), expectedBuyerBalanceAfterDisapprovalBN.toString(),
			"Buyer Address Balance after disaapproval is incorrect!");

		// Note the disaapproval from the "msg.sender" Address. If one disapproves, than one cannot approve.
		assert.equal(await franklinDecentralizedMarketplaceMediationContract.mediatedSalesTransactionApprovedByParties.call(
			mediatedSalesTransactionIpfsHash, MEDIATOR_INDEX), false,
			`The mediatedSalesTransactionApprovedByParties[${mediatedSalesTransactionIpfsHash}][${MEDIATOR_INDEX}] should be boolean false!`);
		assert.equal(await franklinDecentralizedMarketplaceMediationContract.mediatedSalesTransactionDisapprovedByParties.call(
			mediatedSalesTransactionIpfsHash, MEDIATOR_INDEX), true,
			`The mediatedSalesTransactionDisapprovedByParties[${mediatedSalesTransactionIpfsHash}][${MEDIATOR_INDEX}] should be boolean true!`);

		assert.equal(await franklinDecentralizedMarketplaceMediationContract.mediatedSalesTransactionHasBeenDisapproved.call(mediatedSalesTransactionIpfsHash), true,
			"Mediated Sales Transaction should now be in the Disapproved State because two parties have signaled disapproval!");

		// Making sure that MediatedSalesTransactionHasBeenFullyDisapprovedEvent(_mediatedSalesTransactionIpfsHash) fired off
		assert.equal(results.logs.length, 1, "There should have been one Event Fired Off!");
		assert.equal(results.logs[0].event, 'MediatedSalesTransactionHasBeenFullyDisapprovedEvent', "There should have been a MediatedSalesTransactionHasBeenFullyDisapprovedEvent Fired Off!");
		assert.ok(results.logs[0].args !== undefined, "There should have been a results.logs[0].args object!");
		assert.equal(results.logs[0].args.__length__, 1, "There should have been 1 argument(s) in the MediatedSalesTransactionHasBeenFullyDisapprovedEvent that Fired Off!");
		assert.equal(results.logs[0].args._mediatedSalesTransactionIpfsHash, mediatedSalesTransactionIpfsHash, "The _mediatedSalesTransactionIpfsHash argument should be IPFS Hash of Item bought!");
	});

	it("FranklinDecentralizedMarketplaceMediation : test disapproveMediatedSalesTransaction method - nobody has yet done disapproval and message sender is the mediator address of the given _mediatedSalesTransactionIpfsHash that exists as a Mediated Sales Transaction in the Smart Contract", async () => {
		let buyerAddress = accounts[(randomAddressIndex + 1) % NUMBER_OF_ACCOUNTS];
		let sellerAddress = accounts[(randomAddressIndex + 2) % NUMBER_OF_ACCOUNTS];
		let mediatorAddress = accounts[(randomAddressIndex + 3) % NUMBER_OF_ACCOUNTS];
		let keyItemIpfsHash = "DummyItem_IpfsHash";
		let mediatedSalesTransactionIpfsHash = "DummyMediationSalesTransaction_IpfsHash";
		let quantity = 3;

		await franklinDecentralizedMarketplaceContract.addItemForSale(keyItemIpfsHash, {from: sellerAddress});
		assert.equal(await franklinDecentralizedMarketplaceContract.itemForSaleFromSellerExists(sellerAddress, keyItemIpfsHash), true,
			"Item requested to purchase should exist as an item for sale from the seller!");

		await franklinDecentralizedMarketplaceContract.setQuantityAvailableForSaleOfAnItem(keyItemIpfsHash, quantity + 10, {from: sellerAddress})
		assert.ok(await franklinDecentralizedMarketplaceContract.getQuantityAvailableForSaleOfAnItemBySeller(sellerAddress, keyItemIpfsHash) >= quantity,
			"Number of items available for sale from the seller is greater than or equal to the number requested to purchase from the buyer!");

		let priceOfItemInWei = 0.25 * ETH;
		// console.log('priceOfItemInWei =', priceOfItemInWei);
		// console.log('priceOfItemInWei.toString() =', priceOfItemInWei.toString());
		let priceOfItemInWeiBN = new BN(priceOfItemInWei.toString());
		// console.log('priceOfItemInWeiBN =', priceOfItemInWeiBN);
		// console.log('priceOfItemInWeiBN.toString() =', priceOfItemInWeiBN.toString());
		await franklinDecentralizedMarketplaceContract.setPriceOfItem(keyItemIpfsHash, priceOfItemInWeiBN, {from: sellerAddress});

		let returnedPriceOfItemInWeiBN = await franklinDecentralizedMarketplaceContract.getPriceOfItem(sellerAddress, keyItemIpfsHash);
		// console.log('returnedPriceOfItemInWeiBN =', returnedPriceOfItemInWeiBN);
		// console.log('returnedPriceOfItemInWeiBN.toString() =', returnedPriceOfItemInWeiBN.toString());
		assert.notEqual(returnedPriceOfItemInWeiBN, new BN(0), "Seller should have set a non-zero price for the item requested to purchase from the buyer!");

		let amountNeededToPurchaseItemsInWei = quantity * priceOfItemInWei;
		let amountNeededToPurchaseItemsInWeiBN = new BN(amountNeededToPurchaseItemsInWei.toString());
		// console.log('amountNeededToPurchaseItemsInWei =', amountNeededToPurchaseItemsInWei);
		// console.log('amountNeededToPurchaseItemsInWeiBN =', amountNeededToPurchaseItemsInWeiBN);
		// console.log('amountNeededToPurchaseItemsInWeiBN.toString() =', amountNeededToPurchaseItemsInWeiBN.toString());
		let amountBuyerSendsToPurchaseInWeiBN = amountNeededToPurchaseItemsInWeiBN;
		// console.log('amountBuyerSendsToPurchaseInWeiBN =', amountBuyerSendsToPurchaseInWeiBN);
		// console.log('amountBuyerSendsToPurchaseInWeiBN.toString() =', amountBuyerSendsToPurchaseInWeiBN.toString());

		assert.equal(await franklinDecentralizedMarketplaceMediationContract.mediatedSalesTransactionExists.call(mediatedSalesTransactionIpfsHash), false,
			"Given _mediatedSalesTransactionIpfsHash should not exist yet inside of Smart Contract!");

		let mediatorIpfsHashDescription = "DummyMediatorIpfsHashDescription";
		await franklinDecentralizedMarketplaceMediationContract.addOrUpdateMediator(mediatorIpfsHashDescription, {from: mediatorAddress})
		assert.equal(await franklinDecentralizedMarketplaceMediationContract.mediatorExists.call(mediatorAddress), true,
			"Given Mediator Address should exist as a Mediator!");

		assert.equal(await franklinDecentralizedMarketplaceMediationContract.numberOfMediationsMediatorInvolved.call(mediatorAddress), 0,
			"Number of mediations mediator has been involved should initially be zero in this case!");

		// This needs to be executed so that the given "mediatedSalesTransactionIpfsHash" gets stored as an already existing Mediated Sales Transaction in the
		// Smart Contract.
		await franklinDecentralizedMarketplaceMediationContract.purchaseItemWithMediator(sellerAddress, mediatorAddress, keyItemIpfsHash,
			mediatedSalesTransactionIpfsHash, quantity, {from: buyerAddress, value: amountBuyerSendsToPurchaseInWeiBN});

		assert.equal(await franklinDecentralizedMarketplaceMediationContract.mediatedSalesTransactionExists.call(mediatedSalesTransactionIpfsHash), true,
			"The given _mediatedSalesTransactionIpfsHash should exist in the Smart Contract!");

		await franklinDecentralizedMarketplaceMediationContract.disapproveMediatedSalesTransaction(mediatedSalesTransactionIpfsHash, {from: mediatorAddress});

		// Note the approval from the "msg.sender" Address. If one disapproves, than one cannot approve.
		assert.equal(await franklinDecentralizedMarketplaceMediationContract.mediatedSalesTransactionApprovedByParties.call(
			mediatedSalesTransactionIpfsHash, MEDIATOR_INDEX), false,
			`The mediatedSalesTransactionApprovedByParties[${mediatedSalesTransactionIpfsHash}][${MEDIATOR_INDEX}] should be boolean false!`);
		assert.equal(await franklinDecentralizedMarketplaceMediationContract.mediatedSalesTransactionDisapprovedByParties.call(
			mediatedSalesTransactionIpfsHash, MEDIATOR_INDEX), true,
			`The mediatedSalesTransactionDisapprovedByParties[${mediatedSalesTransactionIpfsHash}][${MEDIATOR_INDEX}] should be boolean true!`);

		assert.equal(await franklinDecentralizedMarketplaceMediationContract.mediatedSalesTransactionHasBeenDisapproved.call(mediatedSalesTransactionIpfsHash), false,
			"Mediated Sales Transaction should not be in the Disapproved State if only one party has signaled disapproval!");
	});

	it("FranklinDecentralizedMarketplaceMediation : test disapproveMediatedSalesTransaction method - mediator and buyer addresses signal disapproval of the given _mediatedSalesTransactionIpfsHash that exists as a Mediated Sales Transaction in the Smart Contract", async () => {
		let buyerAddress = accounts[(randomAddressIndex + 1) % NUMBER_OF_ACCOUNTS];
		let sellerAddress = accounts[(randomAddressIndex + 2) % NUMBER_OF_ACCOUNTS];
		let mediatorAddress = accounts[(randomAddressIndex + 3) % NUMBER_OF_ACCOUNTS];
		let keyItemIpfsHash = "DummyItem_IpfsHash";
		let mediatedSalesTransactionIpfsHash = "DummyMediationSalesTransaction_IpfsHash";
		let quantity = 3;

		await franklinDecentralizedMarketplaceContract.addItemForSale(keyItemIpfsHash, {from: sellerAddress});
		assert.equal(await franklinDecentralizedMarketplaceContract.itemForSaleFromSellerExists(sellerAddress, keyItemIpfsHash), true,
			"Item requested to purchase should exist as an item for sale from the seller!");

		await franklinDecentralizedMarketplaceContract.setQuantityAvailableForSaleOfAnItem(keyItemIpfsHash, quantity + 10, {from: sellerAddress})
		assert.ok(await franklinDecentralizedMarketplaceContract.getQuantityAvailableForSaleOfAnItemBySeller(sellerAddress, keyItemIpfsHash) >= quantity,
			"Number of items available for sale from the seller is greater than or equal to the number requested to purchase from the buyer!");

		let priceOfItemInWei = 0.25 * ETH;
		// console.log('priceOfItemInWei =', priceOfItemInWei);
		// console.log('priceOfItemInWei.toString() =', priceOfItemInWei.toString());
		let priceOfItemInWeiBN = new BN(priceOfItemInWei.toString());
		// console.log('priceOfItemInWeiBN =', priceOfItemInWeiBN);
		// console.log('priceOfItemInWeiBN.toString() =', priceOfItemInWeiBN.toString());
		await franklinDecentralizedMarketplaceContract.setPriceOfItem(keyItemIpfsHash, priceOfItemInWeiBN, {from: sellerAddress});

		let returnedPriceOfItemInWeiBN = await franklinDecentralizedMarketplaceContract.getPriceOfItem(sellerAddress, keyItemIpfsHash);
		// console.log('returnedPriceOfItemInWeiBN =', returnedPriceOfItemInWeiBN);
		// console.log('returnedPriceOfItemInWeiBN.toString() =', returnedPriceOfItemInWeiBN.toString());
		assert.notEqual(returnedPriceOfItemInWeiBN, new BN(0), "Seller should have set a non-zero price for the item requested to purchase from the buyer!");

		let amountNeededToPurchaseItemsInWei = quantity * priceOfItemInWei;
		let amountNeededToPurchaseItemsInWeiBN = new BN(amountNeededToPurchaseItemsInWei.toString());
		// console.log('amountNeededToPurchaseItemsInWei =', amountNeededToPurchaseItemsInWei);
		// console.log('amountNeededToPurchaseItemsInWeiBN =', amountNeededToPurchaseItemsInWeiBN);
		// console.log('amountNeededToPurchaseItemsInWeiBN.toString() =', amountNeededToPurchaseItemsInWeiBN.toString());
		let amountBuyerSendsToPurchaseInWeiBN = amountNeededToPurchaseItemsInWeiBN;
		// console.log('amountBuyerSendsToPurchaseInWeiBN =', amountBuyerSendsToPurchaseInWeiBN);
		// console.log('amountBuyerSendsToPurchaseInWeiBN.toString() =', amountBuyerSendsToPurchaseInWeiBN.toString());

		assert.equal(await franklinDecentralizedMarketplaceMediationContract.mediatedSalesTransactionExists.call(mediatedSalesTransactionIpfsHash), false,
			"Given _mediatedSalesTransactionIpfsHash should not exist yet inside of Smart Contract!");

		let mediatorIpfsHashDescription = "DummyMediatorIpfsHashDescription";
		await franklinDecentralizedMarketplaceMediationContract.addOrUpdateMediator(mediatorIpfsHashDescription, {from: mediatorAddress})
		assert.equal(await franklinDecentralizedMarketplaceMediationContract.mediatorExists.call(mediatorAddress), true,
			"Given Mediator Address should exist as a Mediator!");

		assert.equal(await franklinDecentralizedMarketplaceMediationContract.numberOfMediationsMediatorInvolved.call(mediatorAddress), 0,
			"Number of mediations mediator has been involved should initially be zero in this case!");

		// This needs to be executed so that the given "mediatedSalesTransactionIpfsHash" gets stored as an already existing Mediated Sales Transaction in the
		// Smart Contract.
		await franklinDecentralizedMarketplaceMediationContract.purchaseItemWithMediator(sellerAddress, mediatorAddress, keyItemIpfsHash,
			mediatedSalesTransactionIpfsHash, quantity, {from: buyerAddress, value: amountBuyerSendsToPurchaseInWeiBN});

		assert.equal(await franklinDecentralizedMarketplaceMediationContract.mediatedSalesTransactionExists.call(mediatedSalesTransactionIpfsHash), true,
			"The given _mediatedSalesTransactionIpfsHash should exist in the Smart Contract!");

		// First Mediator signals Disapproval of Mediated Sales Transaction.
		await franklinDecentralizedMarketplaceMediationContract.disapproveMediatedSalesTransaction(mediatedSalesTransactionIpfsHash, {from: mediatorAddress});

		// Note the approval from the "msg.sender" Address. If one disapproves, than one cannot approve.
		assert.equal(await franklinDecentralizedMarketplaceMediationContract.mediatedSalesTransactionApprovedByParties.call(
			mediatedSalesTransactionIpfsHash, MEDIATOR_INDEX), false,
			`The mediatedSalesTransactionApprovedByParties[${mediatedSalesTransactionIpfsHash}][${MEDIATOR_INDEX}] should be boolean false!`);
		assert.equal(await franklinDecentralizedMarketplaceMediationContract.mediatedSalesTransactionDisapprovedByParties.call(
			mediatedSalesTransactionIpfsHash, MEDIATOR_INDEX), true,
			`The mediatedSalesTransactionDisapprovedByParties[${mediatedSalesTransactionIpfsHash}][${MEDIATOR_INDEX}] should be boolean true!`);

		assert.equal(await franklinDecentralizedMarketplaceMediationContract.mediatedSalesTransactionHasBeenDisapproved.call(mediatedSalesTransactionIpfsHash), false,
			"Mediated Sales Transaction should not be in the Disapproved State if only one party has signaled disapproval!");

		let buyerBalanceBeforeDisapprovalStr = await web3.eth.getBalance(buyerAddress);
		let buyerBalanceBeforeDisapprovalBN = new BN(buyerBalanceBeforeDisapprovalStr);
		// console.log('buyerBalanceBeforeDisapprovalStr =', buyerBalanceBeforeDisapprovalStr);
		// console.log('buyerBalanceBeforeDisapprovalBN =', buyerBalanceBeforeDisapprovalBN);
		// console.log('buyerBalanceBeforeDisapprovalBN.toString() =', buyerBalanceBeforeDisapprovalBN.toString());

		let mediationContractBalanceBeforeDisapprovalStr = await web3.eth.getBalance(franklinDecentralizedMarketplaceMediationContract.address);
		let mediationContractBalanceBeforeDisapprovalBN = new BN(mediationContractBalanceBeforeDisapprovalStr);
		// console.log('mediationContractBalanceBeforeDisapprovalStr =', mediationContractBalanceBeforeDisapprovalStr);
		// console.log('mediationContractBalanceBeforeDisapprovalBN =', mediationContractBalanceBeforeDisapprovalBN);
		// console.log('mediationContractBalanceBeforeDisapprovalBN.toString() =', mediationContractBalanceBeforeDisapprovalBN.toString());

		// Second... Buyer signals Disapproval of the Mediated Sales Transaction
		let results = await franklinDecentralizedMarketplaceMediationContract.disapproveMediatedSalesTransaction(mediatedSalesTransactionIpfsHash, {from: buyerAddress});

		let buyerBalanceAfterDisapprovalStr = await web3.eth.getBalance(buyerAddress);
		let buyerBalanceAfterDisapprovalBN = new BN(buyerBalanceAfterDisapprovalStr);
		// console.log('buyerBalanceAfterDisapprovalStr =', buyerBalanceAfterDisapprovalStr);
		// console.log('buyerBalanceAfterDisapprovalBN =', buyerBalanceAfterDisapprovalBN);
		// console.log('buyerBalanceAfterDisapprovalBN.toString() =', buyerBalanceAfterDisapprovalBN.toString());

		let mediationContractBalanceAfterDisapprovalStr = await web3.eth.getBalance(franklinDecentralizedMarketplaceMediationContract.address);
		let mediationContractBalanceAfterDisapprovalBN = new BN(mediationContractBalanceAfterDisapprovalStr);
		// console.log('mediationContractBalanceAfterDisapprovalStr =', mediationContractBalanceAfterDisapprovalStr);
		// console.log('mediationContractBalanceAfterDisapprovalBN =', mediationContractBalanceAfterDisapprovalBN);
		// console.log('mediationContractBalanceAfterDisapprovalBN.toString() =', mediationContractBalanceAfterDisapprovalBN.toString());

		let amountOfWeiToSendBuyerBN = amountNeededToPurchaseItemsInWeiBN;
		// console.log('amountOfWeiToSendBuyerBN.toString() =', amountOfWeiToSendBuyerBN.toString());

		let cummulativeGasUsed = results.receipt.cumulativeGasUsed;
		// console.log('cummulativeGasUsed =', cummulativeGasUsed);

		let expectedBuyerBalanceAfterDisapprovalBN = buyerBalanceBeforeDisapprovalBN.add(amountOfWeiToSendBuyerBN); // 100% refund to buyer
		expectedBuyerBalanceAfterDisapprovalBN = expectedBuyerBalanceAfterDisapprovalBN.sub(new BN(cummulativeGasUsed * GAS_BASE_UNIT)); // subtract gas spent
		// console.log('expectedBuyerBalanceAfterDisapprovalBN.toString() =', expectedBuyerBalanceAfterDisapprovalBN.toString());

		let expectedMediationContractBalanceAfterDisapprovalBN = mediationContractBalanceBeforeDisapprovalBN.sub(amountNeededToPurchaseItemsInWeiBN);
		// console.log('expectedMediationContractBalanceAfterDisapprovalBN.toString() =', expectedMediationContractBalanceAfterDisapprovalBN.toString());

		assert.equal(mediationContractBalanceAfterDisapprovalBN.toString(), expectedMediationContractBalanceAfterDisapprovalBN.toString(),
			"Mediation Contract Address Balance after disapproval is incorrect!");
		assert.equal(buyerBalanceAfterDisapprovalBN.toString(), expectedBuyerBalanceAfterDisapprovalBN.toString(),
			"Buyer Address Balance after disaapproval is incorrect!");

		// Note the disapproval from the "msg.sender" Address. If one disapproves, than one cannot approve.
		assert.equal(await franklinDecentralizedMarketplaceMediationContract.mediatedSalesTransactionApprovedByParties.call(
			mediatedSalesTransactionIpfsHash, BUYER_INDEX), false,
			`The mediatedSalesTransactionApprovedByParties[${mediatedSalesTransactionIpfsHash}][${BUYER_INDEX}] should be boolean false!`);
		assert.equal(await franklinDecentralizedMarketplaceMediationContract.mediatedSalesTransactionDisapprovedByParties.call(
			mediatedSalesTransactionIpfsHash, BUYER_INDEX), true,
			`The mediatedSalesTransactionDisapprovedByParties[${mediatedSalesTransactionIpfsHash}][${BUYER_INDEX}] should be boolean true!`);

		assert.equal(await franklinDecentralizedMarketplaceMediationContract.mediatedSalesTransactionHasBeenDisapproved.call(mediatedSalesTransactionIpfsHash), true,
			"Mediated Sales Transaction should now be in the Disapproved State because two parties have signaled disapproval!");

		// Making sure that MediatedSalesTransactionHasBeenFullyDisapprovedEvent(_mediatedSalesTransactionIpfsHash) fired off
		assert.equal(results.logs.length, 1, "There should have been one Event Fired Off!");
		assert.equal(results.logs[0].event, 'MediatedSalesTransactionHasBeenFullyDisapprovedEvent', "There should have been a MediatedSalesTransactionHasBeenFullyDisapprovedEvent Fired Off!");
		assert.ok(results.logs[0].args !== undefined, "There should have been a results.logs[0].args object!");
		assert.equal(results.logs[0].args.__length__, 1, "There should have been 1 argument(s) in the MediatedSalesTransactionHasBeenFullyDisapprovedEvent that Fired Off!");
		assert.equal(results.logs[0].args._mediatedSalesTransactionIpfsHash, mediatedSalesTransactionIpfsHash, "The _mediatedSalesTransactionIpfsHash argument should be IPFS Hash of Item bought!");
	});

	it("FranklinDecentralizedMarketplaceMediation : test disapproveMediatedSalesTransaction method - buyer address attempts to disapprove Mediated Sales Transaction AFTER seller and mediator addresses signal approval of the given existing _mediatedSalesTransactionIpfsHash", async () => {
		let buyerAddress = accounts[(randomAddressIndex + 1) % NUMBER_OF_ACCOUNTS];
		let sellerAddress = accounts[(randomAddressIndex + 2) % NUMBER_OF_ACCOUNTS];
		let mediatorAddress = accounts[(randomAddressIndex + 3) % NUMBER_OF_ACCOUNTS];
		let keyItemIpfsHash = "DummyItem_IpfsHash";
		let mediatedSalesTransactionIpfsHash = "DummyMediationSalesTransaction_IpfsHash";
		let quantity = 3;

		await franklinDecentralizedMarketplaceContract.addItemForSale(keyItemIpfsHash, {from: sellerAddress});
		await franklinDecentralizedMarketplaceContract.setQuantityAvailableForSaleOfAnItem(keyItemIpfsHash, quantity + 10, {from: sellerAddress})

		let priceOfItemInWei = 0.25 * ETH;
		// console.log('priceOfItemInWei =', priceOfItemInWei);
		// console.log('priceOfItemInWei.toString() =', priceOfItemInWei.toString());
		let priceOfItemInWeiBN = new BN(priceOfItemInWei.toString());
		// console.log('priceOfItemInWeiBN =', priceOfItemInWeiBN);
		// console.log('priceOfItemInWeiBN.toString() =', priceOfItemInWeiBN.toString());
		await franklinDecentralizedMarketplaceContract.setPriceOfItem(keyItemIpfsHash, priceOfItemInWeiBN, {from: sellerAddress});

		let amountNeededToPurchaseItemsInWei = quantity * priceOfItemInWei;
		let amountNeededToPurchaseItemsInWeiBN = new BN(amountNeededToPurchaseItemsInWei.toString());
		// console.log('amountNeededToPurchaseItemsInWei =', amountNeededToPurchaseItemsInWei);
		// console.log('amountNeededToPurchaseItemsInWeiBN =', amountNeededToPurchaseItemsInWeiBN);
		// console.log('amountNeededToPurchaseItemsInWeiBN.toString() =', amountNeededToPurchaseItemsInWeiBN.toString());
		let amountBuyerSendsToPurchaseInWeiBN = amountNeededToPurchaseItemsInWeiBN;
		// console.log('amountBuyerSendsToPurchaseInWeiBN =', amountBuyerSendsToPurchaseInWeiBN);
		// console.log('amountBuyerSendsToPurchaseInWeiBN.toString() =', amountBuyerSendsToPurchaseInWeiBN.toString());

		let mediatorIpfsHashDescription = "DummyMediatorIpfsHashDescription";
		await franklinDecentralizedMarketplaceMediationContract.addOrUpdateMediator(mediatorIpfsHashDescription, {from: mediatorAddress})

		// This needs to be executed so that the given "mediatedSalesTransactionIpfsHash" gets stored as an already existing Mediated Sales Transaction in the
		// Smart Contract.
		await franklinDecentralizedMarketplaceMediationContract.purchaseItemWithMediator(sellerAddress, mediatorAddress, keyItemIpfsHash,
			mediatedSalesTransactionIpfsHash, quantity, {from: buyerAddress, value: amountBuyerSendsToPurchaseInWeiBN});

		// Mediator and Seller signal Approval of Mediated Sales Transaction.
		await franklinDecentralizedMarketplaceMediationContract.approveMediatedSalesTransaction(mediatedSalesTransactionIpfsHash, {from: mediatorAddress});
		await franklinDecentralizedMarketplaceMediationContract.approveMediatedSalesTransaction(mediatedSalesTransactionIpfsHash, {from: sellerAddress});

		assert.equal(await franklinDecentralizedMarketplaceMediationContract.mediatedSalesTransactionHasBeenApproved.call(mediatedSalesTransactionIpfsHash), true,
			"Mediated Sales Transaction should initially be in the Approved State!");

		// Buyer now attempts to Disapprove Mediated Sales Transaction that is already in Approved State.
		try {
			await franklinDecentralizedMarketplaceMediationContract.disapproveMediatedSalesTransaction(
				mediatedSalesTransactionIpfsHash, {from: buyerAddress});
			assert.fail("Should not be able to execute this method when _mediatedSalesTransactionIpfsHash is in the Approved State!");
		} catch (error) {
			assert.ok(/revert/.test(error.message), "String 'revert' not present in error message!");
			assert.ok(/Mediated Sales Transaction has already been Approved by at least 2-out-of-3 of the Buyer, Seller, and\/or Mediator! Cannot Disapprove at this point!/.test(error.message),
				"Appropriate error message not returned!");
		}
	});

	it("FranklinDecentralizedMarketplaceMediation : test disapproveMediatedSalesTransaction method - seller address attempts to disapprove Mediated Sales Transaction AFTER buyer and mediator addresses signal approval of the given existing _mediatedSalesTransactionIpfsHash", async () => {
		let buyerAddress = accounts[(randomAddressIndex + 1) % NUMBER_OF_ACCOUNTS];
		let sellerAddress = accounts[(randomAddressIndex + 2) % NUMBER_OF_ACCOUNTS];
		let mediatorAddress = accounts[(randomAddressIndex + 3) % NUMBER_OF_ACCOUNTS];
		let keyItemIpfsHash = "DummyItem_IpfsHash";
		let mediatedSalesTransactionIpfsHash = "DummyMediationSalesTransaction_IpfsHash";
		let quantity = 3;

		await franklinDecentralizedMarketplaceContract.addItemForSale(keyItemIpfsHash, {from: sellerAddress});
		await franklinDecentralizedMarketplaceContract.setQuantityAvailableForSaleOfAnItem(keyItemIpfsHash, quantity + 10, {from: sellerAddress})

		let priceOfItemInWei = 0.25 * ETH;
		// console.log('priceOfItemInWei =', priceOfItemInWei);
		// console.log('priceOfItemInWei.toString() =', priceOfItemInWei.toString());
		let priceOfItemInWeiBN = new BN(priceOfItemInWei.toString());
		// console.log('priceOfItemInWeiBN =', priceOfItemInWeiBN);
		// console.log('priceOfItemInWeiBN.toString() =', priceOfItemInWeiBN.toString());
		await franklinDecentralizedMarketplaceContract.setPriceOfItem(keyItemIpfsHash, priceOfItemInWeiBN, {from: sellerAddress});

		let amountNeededToPurchaseItemsInWei = quantity * priceOfItemInWei;
		let amountNeededToPurchaseItemsInWeiBN = new BN(amountNeededToPurchaseItemsInWei.toString());
		// console.log('amountNeededToPurchaseItemsInWei =', amountNeededToPurchaseItemsInWei);
		// console.log('amountNeededToPurchaseItemsInWeiBN =', amountNeededToPurchaseItemsInWeiBN);
		// console.log('amountNeededToPurchaseItemsInWeiBN.toString() =', amountNeededToPurchaseItemsInWeiBN.toString());
		let amountBuyerSendsToPurchaseInWeiBN = amountNeededToPurchaseItemsInWeiBN;
		// console.log('amountBuyerSendsToPurchaseInWeiBN =', amountBuyerSendsToPurchaseInWeiBN);
		// console.log('amountBuyerSendsToPurchaseInWeiBN.toString() =', amountBuyerSendsToPurchaseInWeiBN.toString());

		let mediatorIpfsHashDescription = "DummyMediatorIpfsHashDescription";
		await franklinDecentralizedMarketplaceMediationContract.addOrUpdateMediator(mediatorIpfsHashDescription, {from: mediatorAddress})

		// This needs to be executed so that the given "mediatedSalesTransactionIpfsHash" gets stored as an already existing Mediated Sales Transaction in the
		// Smart Contract.
		await franklinDecentralizedMarketplaceMediationContract.purchaseItemWithMediator(sellerAddress, mediatorAddress, keyItemIpfsHash,
			mediatedSalesTransactionIpfsHash, quantity, {from: buyerAddress, value: amountBuyerSendsToPurchaseInWeiBN});

		// Mediator and Buyer signal Approval of Mediated Sales Transaction.
		await franklinDecentralizedMarketplaceMediationContract.approveMediatedSalesTransaction(mediatedSalesTransactionIpfsHash, {from: mediatorAddress});
		await franklinDecentralizedMarketplaceMediationContract.approveMediatedSalesTransaction(mediatedSalesTransactionIpfsHash, {from: buyerAddress});

		assert.equal(await franklinDecentralizedMarketplaceMediationContract.mediatedSalesTransactionHasBeenApproved.call(mediatedSalesTransactionIpfsHash), true,
			"Mediated Sales Transaction should initially be in the Approved State!");

		// Seller now attempts to Disapprove Mediated Sales Transaction that is already in Approved State.
		try {
			await franklinDecentralizedMarketplaceMediationContract.disapproveMediatedSalesTransaction(
				mediatedSalesTransactionIpfsHash, {from: sellerAddress});
			assert.fail("Should not be able to execute this method when _mediatedSalesTransactionIpfsHash is in the Approved State!");
		} catch (error) {
			assert.ok(/revert/.test(error.message), "String 'revert' not present in error message!");
			assert.ok(/Mediated Sales Transaction has already been Approved by at least 2-out-of-3 of the Buyer, Seller, and\/or Mediator! Cannot Disapprove at this point!/.test(error.message),
				"Appropriate error message not returned!");
		}
	});

	it("FranklinDecentralizedMarketplaceMediation : test disapproveMediatedSalesTransaction method - mediator address attempts to disapprove Mediated Sales Transaction AFTER buyer and seller addresses signal approval of the given existing _mediatedSalesTransactionIpfsHash", async () => {
		let buyerAddress = accounts[(randomAddressIndex + 1) % NUMBER_OF_ACCOUNTS];
		let sellerAddress = accounts[(randomAddressIndex + 2) % NUMBER_OF_ACCOUNTS];
		let mediatorAddress = accounts[(randomAddressIndex + 3) % NUMBER_OF_ACCOUNTS];
		let keyItemIpfsHash = "DummyItem_IpfsHash";
		let mediatedSalesTransactionIpfsHash = "DummyMediationSalesTransaction_IpfsHash";
		let quantity = 3;

		await franklinDecentralizedMarketplaceContract.addItemForSale(keyItemIpfsHash, {from: sellerAddress});
		await franklinDecentralizedMarketplaceContract.setQuantityAvailableForSaleOfAnItem(keyItemIpfsHash, quantity + 10, {from: sellerAddress})

		let priceOfItemInWei = 0.25 * ETH;
		// console.log('priceOfItemInWei =', priceOfItemInWei);
		// console.log('priceOfItemInWei.toString() =', priceOfItemInWei.toString());
		let priceOfItemInWeiBN = new BN(priceOfItemInWei.toString());
		// console.log('priceOfItemInWeiBN =', priceOfItemInWeiBN);
		// console.log('priceOfItemInWeiBN.toString() =', priceOfItemInWeiBN.toString());
		await franklinDecentralizedMarketplaceContract.setPriceOfItem(keyItemIpfsHash, priceOfItemInWeiBN, {from: sellerAddress});

		let amountNeededToPurchaseItemsInWei = quantity * priceOfItemInWei;
		let amountNeededToPurchaseItemsInWeiBN = new BN(amountNeededToPurchaseItemsInWei.toString());
		// console.log('amountNeededToPurchaseItemsInWei =', amountNeededToPurchaseItemsInWei);
		// console.log('amountNeededToPurchaseItemsInWeiBN =', amountNeededToPurchaseItemsInWeiBN);
		// console.log('amountNeededToPurchaseItemsInWeiBN.toString() =', amountNeededToPurchaseItemsInWeiBN.toString());
		let amountBuyerSendsToPurchaseInWeiBN = amountNeededToPurchaseItemsInWeiBN;
		// console.log('amountBuyerSendsToPurchaseInWeiBN =', amountBuyerSendsToPurchaseInWeiBN);
		// console.log('amountBuyerSendsToPurchaseInWeiBN.toString() =', amountBuyerSendsToPurchaseInWeiBN.toString());

		let mediatorIpfsHashDescription = "DummyMediatorIpfsHashDescription";
		await franklinDecentralizedMarketplaceMediationContract.addOrUpdateMediator(mediatorIpfsHashDescription, {from: mediatorAddress})

		// This needs to be executed so that the given "mediatedSalesTransactionIpfsHash" gets stored as an already existing Mediated Sales Transaction in the
		// Smart Contract.
		await franklinDecentralizedMarketplaceMediationContract.purchaseItemWithMediator(sellerAddress, mediatorAddress, keyItemIpfsHash,
			mediatedSalesTransactionIpfsHash, quantity, {from: buyerAddress, value: amountBuyerSendsToPurchaseInWeiBN});

		// Buyer and Seller signal Approval of Mediated Sales Transaction.
		await franklinDecentralizedMarketplaceMediationContract.approveMediatedSalesTransaction(mediatedSalesTransactionIpfsHash, {from: sellerAddress});
		await franklinDecentralizedMarketplaceMediationContract.approveMediatedSalesTransaction(mediatedSalesTransactionIpfsHash, {from: buyerAddress});

		assert.equal(await franklinDecentralizedMarketplaceMediationContract.mediatedSalesTransactionHasBeenApproved.call(mediatedSalesTransactionIpfsHash), true,
			"Mediated Sales Transaction should initially be in the Approved State!");

		// Mediator now attempts to Disapprove Mediated Sales Transaction that is already in Approved State.
		try {
			await franklinDecentralizedMarketplaceMediationContract.disapproveMediatedSalesTransaction(
				mediatedSalesTransactionIpfsHash, {from: mediatorAddress});
			assert.fail("Should not be able to execute this method when _mediatedSalesTransactionIpfsHash is in the Approved State!");
		} catch (error) {
			assert.ok(/revert/.test(error.message), "String 'revert' not present in error message!");
			assert.ok(/Mediated Sales Transaction has already been Approved by at least 2-out-of-3 of the Buyer, Seller, and\/or Mediator! Cannot Disapprove at this point!/.test(error.message),
				"Appropriate error message not returned!");
		}
	});

	it("FranklinDecentralizedMarketplaceMediation : test disapproveMediatedSalesTransaction method - buyer address attempts to disapprove Mediated Sales Transaction AFTER seller and mediator addresses signal disapproval of the given existing _mediatedSalesTransactionIpfsHash", async () => {
		let buyerAddress = accounts[(randomAddressIndex + 1) % NUMBER_OF_ACCOUNTS];
		let sellerAddress = accounts[(randomAddressIndex + 2) % NUMBER_OF_ACCOUNTS];
		let mediatorAddress = accounts[(randomAddressIndex + 3) % NUMBER_OF_ACCOUNTS];
		let keyItemIpfsHash = "DummyItem_IpfsHash";
		let mediatedSalesTransactionIpfsHash = "DummyMediationSalesTransaction_IpfsHash";
		let quantity = 3;

		await franklinDecentralizedMarketplaceContract.addItemForSale(keyItemIpfsHash, {from: sellerAddress});
		await franklinDecentralizedMarketplaceContract.setQuantityAvailableForSaleOfAnItem(keyItemIpfsHash, quantity + 10, {from: sellerAddress})

		let priceOfItemInWei = 0.25 * ETH;
		// console.log('priceOfItemInWei =', priceOfItemInWei);
		// console.log('priceOfItemInWei.toString() =', priceOfItemInWei.toString());
		let priceOfItemInWeiBN = new BN(priceOfItemInWei.toString());
		// console.log('priceOfItemInWeiBN =', priceOfItemInWeiBN);
		// console.log('priceOfItemInWeiBN.toString() =', priceOfItemInWeiBN.toString());
		await franklinDecentralizedMarketplaceContract.setPriceOfItem(keyItemIpfsHash, priceOfItemInWeiBN, {from: sellerAddress});

		let amountNeededToPurchaseItemsInWei = quantity * priceOfItemInWei;
		let amountNeededToPurchaseItemsInWeiBN = new BN(amountNeededToPurchaseItemsInWei.toString());
		// console.log('amountNeededToPurchaseItemsInWei =', amountNeededToPurchaseItemsInWei);
		// console.log('amountNeededToPurchaseItemsInWeiBN =', amountNeededToPurchaseItemsInWeiBN);
		// console.log('amountNeededToPurchaseItemsInWeiBN.toString() =', amountNeededToPurchaseItemsInWeiBN.toString());
		let amountBuyerSendsToPurchaseInWeiBN = amountNeededToPurchaseItemsInWeiBN;
		// console.log('amountBuyerSendsToPurchaseInWeiBN =', amountBuyerSendsToPurchaseInWeiBN);
		// console.log('amountBuyerSendsToPurchaseInWeiBN.toString() =', amountBuyerSendsToPurchaseInWeiBN.toString());

		let mediatorIpfsHashDescription = "DummyMediatorIpfsHashDescription";
		await franklinDecentralizedMarketplaceMediationContract.addOrUpdateMediator(mediatorIpfsHashDescription, {from: mediatorAddress})

		// This needs to be executed so that the given "mediatedSalesTransactionIpfsHash" gets stored as an already existing Mediated Sales Transaction in the
		// Smart Contract.
		await franklinDecentralizedMarketplaceMediationContract.purchaseItemWithMediator(sellerAddress, mediatorAddress, keyItemIpfsHash,
			mediatedSalesTransactionIpfsHash, quantity, {from: buyerAddress, value: amountBuyerSendsToPurchaseInWeiBN});

		// Mediator and Seller signal Disapproval of Mediated Sales Transaction.
		await franklinDecentralizedMarketplaceMediationContract.disapproveMediatedSalesTransaction(mediatedSalesTransactionIpfsHash, {from: mediatorAddress});
		await franklinDecentralizedMarketplaceMediationContract.disapproveMediatedSalesTransaction(mediatedSalesTransactionIpfsHash, {from: sellerAddress});

		assert.equal(await franklinDecentralizedMarketplaceMediationContract.mediatedSalesTransactionHasBeenDisapproved.call(mediatedSalesTransactionIpfsHash), true,
			"Mediated Sales Transaction should initially be in the Disapproved State!");

		// Buyer now attempts to Disapprove Mediated Sales Transaction that is already in Disapproved State.
		await franklinDecentralizedMarketplaceMediationContract.disapproveMediatedSalesTransaction(
			mediatedSalesTransactionIpfsHash, {from: buyerAddress});

		assert.equal(await franklinDecentralizedMarketplaceMediationContract.mediatedSalesTransactionDisapprovedByParties.call(
			mediatedSalesTransactionIpfsHash, BUYER_INDEX), true, "Disapproval from the Buyer should have been noted!");

		assert.equal(await franklinDecentralizedMarketplaceMediationContract.mediatedSalesTransactionHasBeenDisapproved.call(mediatedSalesTransactionIpfsHash), true,
			"Mediated Sales Transaction should have stayed in the Disapproved State!");
	});

	it("FranklinDecentralizedMarketplaceMediation : test disapproveMediatedSalesTransaction method - seller address attempts to disapprove Mediated Sales Transaction AFTER buyer and mediator addresses signal disapproval of the given existing _mediatedSalesTransactionIpfsHash", async () => {
		let buyerAddress = accounts[(randomAddressIndex + 1) % NUMBER_OF_ACCOUNTS];
		let sellerAddress = accounts[(randomAddressIndex + 2) % NUMBER_OF_ACCOUNTS];
		let mediatorAddress = accounts[(randomAddressIndex + 3) % NUMBER_OF_ACCOUNTS];
		let keyItemIpfsHash = "DummyItem_IpfsHash";
		let mediatedSalesTransactionIpfsHash = "DummyMediationSalesTransaction_IpfsHash";
		let quantity = 3;

		await franklinDecentralizedMarketplaceContract.addItemForSale(keyItemIpfsHash, {from: sellerAddress});
		await franklinDecentralizedMarketplaceContract.setQuantityAvailableForSaleOfAnItem(keyItemIpfsHash, quantity + 10, {from: sellerAddress})

		let priceOfItemInWei = 0.25 * ETH;
		// console.log('priceOfItemInWei =', priceOfItemInWei);
		// console.log('priceOfItemInWei.toString() =', priceOfItemInWei.toString());
		let priceOfItemInWeiBN = new BN(priceOfItemInWei.toString());
		// console.log('priceOfItemInWeiBN =', priceOfItemInWeiBN);
		// console.log('priceOfItemInWeiBN.toString() =', priceOfItemInWeiBN.toString());
		await franklinDecentralizedMarketplaceContract.setPriceOfItem(keyItemIpfsHash, priceOfItemInWeiBN, {from: sellerAddress});

		let amountNeededToPurchaseItemsInWei = quantity * priceOfItemInWei;
		let amountNeededToPurchaseItemsInWeiBN = new BN(amountNeededToPurchaseItemsInWei.toString());
		// console.log('amountNeededToPurchaseItemsInWei =', amountNeededToPurchaseItemsInWei);
		// console.log('amountNeededToPurchaseItemsInWeiBN =', amountNeededToPurchaseItemsInWeiBN);
		// console.log('amountNeededToPurchaseItemsInWeiBN.toString() =', amountNeededToPurchaseItemsInWeiBN.toString());
		let amountBuyerSendsToPurchaseInWeiBN = amountNeededToPurchaseItemsInWeiBN;
		// console.log('amountBuyerSendsToPurchaseInWeiBN =', amountBuyerSendsToPurchaseInWeiBN);
		// console.log('amountBuyerSendsToPurchaseInWeiBN.toString() =', amountBuyerSendsToPurchaseInWeiBN.toString());

		let mediatorIpfsHashDescription = "DummyMediatorIpfsHashDescription";
		await franklinDecentralizedMarketplaceMediationContract.addOrUpdateMediator(mediatorIpfsHashDescription, {from: mediatorAddress})

		// This needs to be executed so that the given "mediatedSalesTransactionIpfsHash" gets stored as an already existing Mediated Sales Transaction in the
		// Smart Contract.
		await franklinDecentralizedMarketplaceMediationContract.purchaseItemWithMediator(sellerAddress, mediatorAddress, keyItemIpfsHash,
			mediatedSalesTransactionIpfsHash, quantity, {from: buyerAddress, value: amountBuyerSendsToPurchaseInWeiBN});

		// Mediator and Buyer signal Disapproval of Mediated Sales Transaction.
		await franklinDecentralizedMarketplaceMediationContract.disapproveMediatedSalesTransaction(mediatedSalesTransactionIpfsHash, {from: mediatorAddress});
		await franklinDecentralizedMarketplaceMediationContract.disapproveMediatedSalesTransaction(mediatedSalesTransactionIpfsHash, {from: buyerAddress});

		assert.equal(await franklinDecentralizedMarketplaceMediationContract.mediatedSalesTransactionHasBeenDisapproved.call(mediatedSalesTransactionIpfsHash), true,
			"Mediated Sales Transaction should initially be in the Disapproved State!");

		// Seller now attempts to Disapprove Mediated Sales Transaction that is already in Disapproved State.
		await franklinDecentralizedMarketplaceMediationContract.disapproveMediatedSalesTransaction(
			mediatedSalesTransactionIpfsHash, {from: sellerAddress});

		assert.equal(await franklinDecentralizedMarketplaceMediationContract.mediatedSalesTransactionDisapprovedByParties.call(
			mediatedSalesTransactionIpfsHash, SELLER_INDEX), true, "Disapproval from the Seller should have been noted!");

		assert.equal(await franklinDecentralizedMarketplaceMediationContract.mediatedSalesTransactionHasBeenDisapproved.call(mediatedSalesTransactionIpfsHash), true,
			"Mediated Sales Transaction should have stayed in the Disapproved State!");
	});

	it("FranklinDecentralizedMarketplaceMediation : test disapproveMediatedSalesTransaction method - mediator address attempts to disapprove Mediated Sales Transaction AFTER buyer and seller addresses signal disapproval of the given existing _mediatedSalesTransactionIpfsHash", async () => {
		let buyerAddress = accounts[(randomAddressIndex + 1) % NUMBER_OF_ACCOUNTS];
		let sellerAddress = accounts[(randomAddressIndex + 2) % NUMBER_OF_ACCOUNTS];
		let mediatorAddress = accounts[(randomAddressIndex + 3) % NUMBER_OF_ACCOUNTS];
		let keyItemIpfsHash = "DummyItem_IpfsHash";
		let mediatedSalesTransactionIpfsHash = "DummyMediationSalesTransaction_IpfsHash";
		let quantity = 3;

		await franklinDecentralizedMarketplaceContract.addItemForSale(keyItemIpfsHash, {from: sellerAddress});
		await franklinDecentralizedMarketplaceContract.setQuantityAvailableForSaleOfAnItem(keyItemIpfsHash, quantity + 10, {from: sellerAddress})

		let priceOfItemInWei = 0.25 * ETH;
		// console.log('priceOfItemInWei =', priceOfItemInWei);
		// console.log('priceOfItemInWei.toString() =', priceOfItemInWei.toString());
		let priceOfItemInWeiBN = new BN(priceOfItemInWei.toString());
		// console.log('priceOfItemInWeiBN =', priceOfItemInWeiBN);
		// console.log('priceOfItemInWeiBN.toString() =', priceOfItemInWeiBN.toString());
		await franklinDecentralizedMarketplaceContract.setPriceOfItem(keyItemIpfsHash, priceOfItemInWeiBN, {from: sellerAddress});

		let amountNeededToPurchaseItemsInWei = quantity * priceOfItemInWei;
		let amountNeededToPurchaseItemsInWeiBN = new BN(amountNeededToPurchaseItemsInWei.toString());
		// console.log('amountNeededToPurchaseItemsInWei =', amountNeededToPurchaseItemsInWei);
		// console.log('amountNeededToPurchaseItemsInWeiBN =', amountNeededToPurchaseItemsInWeiBN);
		// console.log('amountNeededToPurchaseItemsInWeiBN.toString() =', amountNeededToPurchaseItemsInWeiBN.toString());
		let amountBuyerSendsToPurchaseInWeiBN = amountNeededToPurchaseItemsInWeiBN;
		// console.log('amountBuyerSendsToPurchaseInWeiBN =', amountBuyerSendsToPurchaseInWeiBN);
		// console.log('amountBuyerSendsToPurchaseInWeiBN.toString() =', amountBuyerSendsToPurchaseInWeiBN.toString());

		let mediatorIpfsHashDescription = "DummyMediatorIpfsHashDescription";
		await franklinDecentralizedMarketplaceMediationContract.addOrUpdateMediator(mediatorIpfsHashDescription, {from: mediatorAddress})

		// This needs to be executed so that the given "mediatedSalesTransactionIpfsHash" gets stored as an already existing Mediated Sales Transaction in the
		// Smart Contract.
		await franklinDecentralizedMarketplaceMediationContract.purchaseItemWithMediator(sellerAddress, mediatorAddress, keyItemIpfsHash,
			mediatedSalesTransactionIpfsHash, quantity, {from: buyerAddress, value: amountBuyerSendsToPurchaseInWeiBN});

		// Buyer and Seller signal Disapproval of Mediated Sales Transaction.
		await franklinDecentralizedMarketplaceMediationContract.disapproveMediatedSalesTransaction(mediatedSalesTransactionIpfsHash, {from: sellerAddress});
		await franklinDecentralizedMarketplaceMediationContract.disapproveMediatedSalesTransaction(mediatedSalesTransactionIpfsHash, {from: buyerAddress});

		assert.equal(await franklinDecentralizedMarketplaceMediationContract.mediatedSalesTransactionHasBeenDisapproved.call(mediatedSalesTransactionIpfsHash), true,
			"Mediated Sales Transaction should initially be in the Disapproved State!");

		// Mediator now attempts to Disapprove Mediated Sales Transaction that is already in Disapproved State.
		await franklinDecentralizedMarketplaceMediationContract.disapproveMediatedSalesTransaction(
			mediatedSalesTransactionIpfsHash, {from: mediatorAddress});

		assert.equal(await franklinDecentralizedMarketplaceMediationContract.mediatedSalesTransactionDisapprovedByParties.call(
			mediatedSalesTransactionIpfsHash, MEDIATOR_INDEX), true, "Disapproval from the Mediator should have been noted!");

		assert.equal(await franklinDecentralizedMarketplaceMediationContract.mediatedSalesTransactionHasBeenDisapproved.call(mediatedSalesTransactionIpfsHash), true,
			"Mediated Sales Transaction should have stayed in the Disapproved State!");
	});

	it("FranklinDecentralizedMarketplaceMediation : test numberOfMediatedSalesTransactionsAddressInvolved method - given _party address has NOT been involved in any Mediated Sales Transactions", async () => {
		assert.equal(await franklinDecentralizedMarketplaceMediationContract.numberOfMediatedSalesTransactionsAddressInvolved(
			accounts[randomAddressIndex % NUMBER_OF_ACCOUNTS]), 0, "Given address should have indicated no involvement in any Mediated Sales Transactions!");
	});

	it("FranklinDecentralizedMarketplaceMediation : test numberOfMediatedSalesTransactionsAddressInvolved method - given _party addresse(s) have been involved in several Mediated Sales Transactions", async () => {
		let buyerAddress = accounts[(randomAddressIndex + 1) % NUMBER_OF_ACCOUNTS];
		let sellerAddress = accounts[(randomAddressIndex + 2) % NUMBER_OF_ACCOUNTS];
		let mediatorAddress = accounts[(randomAddressIndex + 3) % NUMBER_OF_ACCOUNTS];
		let keyItemIpfsHash = "DummyItem_IpfsHash";
		let mediatedSalesTransactionIpfsHashBase = "DummyMediationSalesTransaction_IpfsHash";
		let quantity = 3;

		await franklinDecentralizedMarketplaceContract.addItemForSale(keyItemIpfsHash, {from: sellerAddress});
		await franklinDecentralizedMarketplaceContract.setQuantityAvailableForSaleOfAnItem(keyItemIpfsHash, quantity + 15, {from: sellerAddress})

		let priceOfItemInWei = 0.25 * ETH;
		// console.log('priceOfItemInWei =', priceOfItemInWei);
		// console.log('priceOfItemInWei.toString() =', priceOfItemInWei.toString());
		let priceOfItemInWeiBN = new BN(priceOfItemInWei.toString());
		// console.log('priceOfItemInWeiBN =', priceOfItemInWeiBN);
		// console.log('priceOfItemInWeiBN.toString() =', priceOfItemInWeiBN.toString());
		await franklinDecentralizedMarketplaceContract.setPriceOfItem(keyItemIpfsHash, priceOfItemInWeiBN, {from: sellerAddress});

		let amountNeededToPurchaseItemsInWei = quantity * priceOfItemInWei;
		let amountNeededToPurchaseItemsInWeiBN = new BN(amountNeededToPurchaseItemsInWei.toString());
		// console.log('amountNeededToPurchaseItemsInWei =', amountNeededToPurchaseItemsInWei);
		// console.log('amountNeededToPurchaseItemsInWeiBN =', amountNeededToPurchaseItemsInWeiBN);
		// console.log('amountNeededToPurchaseItemsInWeiBN.toString() =', amountNeededToPurchaseItemsInWeiBN.toString());
		let amountBuyerSendsToPurchaseInWeiBN = amountNeededToPurchaseItemsInWeiBN;
		// console.log('amountBuyerSendsToPurchaseInWeiBN =', amountBuyerSendsToPurchaseInWeiBN);
		// console.log('amountBuyerSendsToPurchaseInWeiBN.toString() =', amountBuyerSendsToPurchaseInWeiBN.toString());

		let mediatorIpfsHashDescription = "DummyMediatorIpfsHashDescription";
		await franklinDecentralizedMarketplaceMediationContract.addOrUpdateMediator(mediatorIpfsHashDescription, {from: mediatorAddress})

		for (let i = 0; i < 3; i++) {
			let mediatedSalesTransactionIpfsHash = `${mediatedSalesTransactionIpfsHashBase}_${i}`;
			await franklinDecentralizedMarketplaceMediationContract.purchaseItemWithMediator(sellerAddress, mediatorAddress, keyItemIpfsHash,
				mediatedSalesTransactionIpfsHash, quantity, {from: buyerAddress, value: amountBuyerSendsToPurchaseInWeiBN});

			assert.equal(await franklinDecentralizedMarketplaceMediationContract.numberOfMediatedSalesTransactionsAddressInvolved(
				buyerAddress), i + 1, `Given Buyer Address should have at this point been involved in ${i + 1} Mediated Sales Transactions!`);
			assert.equal(await franklinDecentralizedMarketplaceMediationContract.numberOfMediatedSalesTransactionsAddressInvolved(
				sellerAddress), i + 1, `Given Seller Address should have at this point been involved in ${i + 1} Mediated Sales Transactions!`);
			assert.equal(await franklinDecentralizedMarketplaceMediationContract.numberOfMediatedSalesTransactionsAddressInvolved(
				mediatorAddress), i + 1, `Given Mediator Address should have at this point been involved in ${i + 1} Mediated Sales Transactions!`);
		}
	});

	// Below is what's returned in function calls that change the contract.
    /*
	it("test addItemForSale", async () => {
		let results = await franklinDecentralizedMarketplaceContract.addItemForSale("DummyItem", { from: accounts[2], data: "The cat is in the hat!" });
		console.log('results =', results);
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

	// Below Unit Test done due to being suggested by Patrick Galloway. It took about 896392 milli-seconds to complete.
	// It should be commented out, since it's highly repetitive and takes a long time to run. If run, it should be the last one to run.
	/*
	it("test capability to add 100 sellers with 10 items each as suggested by Patrick Galloway", async () => {
		for (let sellerAccountIndex = 0; sellerAccountIndex < 100; sellerAccountIndex++) {
			for (let itemIndex = 0; itemIndex < 10; itemIndex++) {
				let itemIpfsHash = `Item ${itemIndex}`;
				await franklinDecentralizedMarketplaceContract.addItemForSale(itemIpfsHash, {from: accounts[sellerAccountIndex]});

				let sellerExistsFlag = await franklinDecentralizedMarketplaceContract.sellerExists.call(accounts[sellerAccountIndex]);
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
			let sellerExistsFlag = await franklinDecentralizedMarketplaceContract.sellerExists.call(accounts[sellerAccountIndex]);
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