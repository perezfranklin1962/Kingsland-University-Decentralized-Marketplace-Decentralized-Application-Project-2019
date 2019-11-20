const FranklinDecentralizedMarketplace = artifacts.require("FranklinDecentralizedMarketplace");
const FranklinDecentralizedMarketplaceMediation = artifacts.require("FranklinDecentralizedMarketplaceMediation");
const utils = require("./utils.js");

// The "assert" JavaScvript documented in --> https://www.w3schools.com/nodejs/ref_assert.asp
// Reference --> https://www.trufflesuite.com/docs/truffle/getting-started/interacting-with-your-contracts

contract("FranklinDecentralizedMarketplace and FranklinDecentralizedMarketplaceMediation", async accounts => {
	let EMPTY_ADDRESS = "0x0000000000000000000000000000000000000000";
	let EMPTY_STRING = "";
	let NUMBER_OF_ACCOUNTS = 100;

	let franklinDecentralizedMarketplaceContract;

	let franklinDecentralizedMarketplaceMediationContractAddress;
	let franklinDecentralizedMarketplaceMediationContract;

	let randomAddressIndex = 0;

	beforeEach(async () => {
		franklinDecentralizedMarketplaceContract = await FranklinDecentralizedMarketplace.new();
		// console.log('franklinDecentralizedMarketplaceContract =', franklinDecentralizedMarketplaceContract);

		// Reference --> https://www.trufflesuite.com/docs/truffle/getting-started/interacting-with-your-contracts
		franklinDecentralizedMarketplaceMediationContractAddress =
			await franklinDecentralizedMarketplaceContract.getFranklinDecentralizedMarketplaceMediationContractAddress();
		franklinDecentralizedMarketplaceMediationContract =
			await FranklinDecentralizedMarketplaceMediation.at(franklinDecentralizedMarketplaceMediationContractAddress);
	});

	afterEach(async () => {
		// Will have in Ganache Ethereum Server a Total of NUMBER_OF_ACCOUNTS Ethereum Addresses
		randomAddressIndex = (randomAddressIndex + 1) % NUMBER_OF_ACCOUNTS;
	});

	it("FranklinDecentralizedMarketplace : test constructor sets mediationMarketplace - instance of FranklinDecentralizedMarketplaceMediation Contract", async () => {
		let mediationMarketplaceAddress = await franklinDecentralizedMarketplaceContract.mediationMarketplace.call();
		assert.notEqual(mediationMarketplaceAddress, EMPTY_ADDRESS,
			"Failed to deploy FranklinDecentralizedMarketplaceMediation Contract!");

		assert.equal(mediationMarketplaceAddress,
			franklinDecentralizedMarketplaceMediationContractAddress,
			"FranklinDecentralizedMarketplaceMediation Contract Address is incorrect!");
	});

	it("FranklinDecentralizedMarketplace : test getContractOwnerOfFranklinDecentralizedMarketplaceMediation method", async () => {
		assert.equal(await franklinDecentralizedMarketplaceContract.getContractOwnerOfFranklinDecentralizedMarketplaceMediation(),
			franklinDecentralizedMarketplaceContract.address,
			"Contract Owner Address of Deployed FranklinDecentralizedMarketplaceMediation Contract is NOT equal to the Address " +
			"of this Deployed FranklinDecentralizedMarketplace Contract!");
	});

	it("FranklinDecentralizedMarketplace : test getFranklinDecentralizedMarketplaceMediationContractAddress method", async () => {
		assert.equal(await franklinDecentralizedMarketplaceContract.getFranklinDecentralizedMarketplaceMediationContractAddress(),
			franklinDecentralizedMarketplaceMediationContractAddress,
			"Returned Contract Address should be the FranklinDecentralizedMarketplaceMediationContract Address instantiated by the " +
			"FranklinDecentralizedMarketplaceContract");
	});

	it("FranklinDecentralizedMarketplace : test getFranklinDecentralizedMarketplaceMediationContract method", async () => {
		assert.equal(await franklinDecentralizedMarketplaceContract.getFranklinDecentralizedMarketplaceMediationContract(),
			franklinDecentralizedMarketplaceMediationContractAddress,
			"Returned Contract Referennce should be the FranklinDecentralizedMarketplaceMediationContract reference instantiated by the " +
			"FranklinDecentralizedMarketplaceContract");
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
			assert.ok(/Cannot have an empty String for the IPFS Hash Key of an Item!/.test(error.message),
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
			assert.ok(/Cannot have an empty String for the IPFS Hash Key of an Item!/.test(error.message),
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


	// Below is what's returned in function calls that change the contract.
    /*
	it("test addItemForSale", async () => {
		let tx = await franklinDecentralizedMarketplaceContract.addItemForSale("DummyItem", { from: accounts[2], data: "The cat is in the hat!" });
		console.log('tx =', tx);
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