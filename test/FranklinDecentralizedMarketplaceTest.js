const FranklinDecentralizedMarketplace = artifacts.require("FranklinDecentralizedMarketplace");
const FranklinDecentralizedMarketplaceMediation = artifacts.require("FranklinDecentralizedMarketplaceMediation");
const utils = require("./utils.js");

// The "assert" JavaScvript documented in --> https://www.w3schools.com/nodejs/ref_assert.asp
// Reference --> https://www.trufflesuite.com/docs/truffle/getting-started/interacting-with-your-contracts

contract("FranklinDecentralizedMarketplace", async accounts => {
	let EMPTY_ADDRESS = "0x0000000000000000000000000000000000000000";

	let franklinDecentralizedMarketplaceContract;

	let franklinDecentralizedMarketplaceMediationContractAddress;
	let franklinDecentralizedMarketplaceMediationContract;

	beforeEach(async () => {
		franklinDecentralizedMarketplaceContract = await FranklinDecentralizedMarketplace.new();
		// console.log('franklinDecentralizedMarketplaceContract =', franklinDecentralizedMarketplaceContract);

		// Reference --> https://www.trufflesuite.com/docs/truffle/getting-started/interacting-with-your-contracts
		franklinDecentralizedMarketplaceMediationContractAddress =
			await franklinDecentralizedMarketplaceContract.getFranklinDecentralizedMarketplaceMediationContractAddress();
		franklinDecentralizedMarketplaceMediationContract =
			await FranklinDecentralizedMarketplaceMediation.at(franklinDecentralizedMarketplaceMediationContractAddress);
	});

	it("test constructor sets mediationMarketplace - instance of FranklinDecentralizedMarketplaceMediation Contract", async () => {
		let mediationMarketplaceAddress = await franklinDecentralizedMarketplaceContract.mediationMarketplace.call();
		assert.notEqual(mediationMarketplaceAddress, EMPTY_ADDRESS,
			"Failed to deploy FranklinDecentralizedMarketplaceMediation Contract!");

		assert.equal(mediationMarketplaceAddress,
			franklinDecentralizedMarketplaceMediationContractAddress,
			"FranklinDecentralizedMarketplaceMediation Contract Address is incorrect!");
	});

	it("test getContractOwnerOfFranklinDecentralizedMarketplaceMediation() method", async () => {
		assert.equal(await franklinDecentralizedMarketplaceContract.getContractOwnerOfFranklinDecentralizedMarketplaceMediation(),
			franklinDecentralizedMarketplaceContract.address,
			"Contract Owner Address of Deployed FranklinDecentralizedMarketplaceMediation Contract is NOT equal to the Address " +
			"of this Deployed FranklinDecentralizedMarketplace Contract!");
	});

	// Below is what's returned in function calls that change the contract.
    /*
	it("test addItemForSale", async () => {
		let tx = await franklinDecentralizedMarketplaceContract.addItemForSale("DummyItem", { from: accounts[2], data: "The cat is in the hat!" });
		console.log('tx =', tx);
	});
	*/

	// Below Unit Test done due to being suggested by Patrick Galloway. It took about 896392 milli-seconds to complete.
	// It should be commented out, since it's highly repetitve and takes a long time to run. If run, it should be the last one to run.
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

});