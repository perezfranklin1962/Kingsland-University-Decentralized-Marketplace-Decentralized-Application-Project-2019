const GeneralUtilitiesProxy = artifacts.require("GeneralUtilitiesProxy");

contract("GeneralUtilities", async accounts => {

	const UNDER_SCORE_STRING = "_";
	const NUMBER_OF_ACCOUNTS = 100;

	// Reference --> https://web3js.readthedocs.io/en/v1.2.0/web3-utils.html#bn
	var BN = web3.utils.BN;

	let generalUtilities;

	// Before ALL the tests are executed.
	before(async () => {
		try {
			generalUtilities = await GeneralUtilitiesProxy.new({from: accounts[0]});
		}
		catch (error) {
			assert.fail("Unable to deploy GeneralUtilitiesTest! Cannot continue tests!");
			exit(1);
		}
	});

	it("test _getConcatenationOfEthereumAddressAndIpfsHash method", async () => {
		let ipfsHash = "DummyIpfsHash";
		let result = await generalUtilities._getConcatenationOfEthereumAddressAndIpfsHash(accounts[0], ipfsHash);
		expectedResult = accounts[0].toLowerCase() + UNDER_SCORE_STRING + ipfsHash;
		assert.equal(result, expectedResult, "Incorrect returned value obtained!");
	});

	it("test _convertAddressToAddressPayable method", async () => {
		let result = await generalUtilities._convertAddressToAddressPayable(accounts[0]);
		assert.equal(result, accounts[0], "Incorrect returned value obtained!");
	});

	it("test _safeMathAdd method : no addition overflow", async () => {
		let aBN = new BN(324);
		let bBN = new BN(765);
		let result = await generalUtilities._safeMathAdd(aBN, bBN);

		let expectedResult = aBN.add(bBN);
		assert.equal(result.toString(), expectedResult.toString(), "Incorrect returned value obtained!");
	});

	it("test _safeMathAdd method : addition overflow occurs - input 'a' is too large causing overflow", async () => {
		let aBN = new BN(2).pow(new BN(256)).sub(new BN(1));
		let bBN = new BN(765);

		try {
			await generalUtilities._safeMathAdd(aBN, bBN);
			assert.fail("Addition Overflow Exception should have occurred!");
		} catch (error) {
			assert.ok(/revert/.test(error.message), "String 'revert' not present in error message!");
				assert.ok(/_safeMathAdd : Addition Overflow/.test(error.message),
				"Appropriate error message not returned!");
		}
	});

	it("test _safeMathAdd method : addition overflow occurs - input 'b' is too large causing overflow", async () => {
		let bBN = new BN(2).pow(new BN(256)).sub(new BN(1));
		let aBN = new BN(765);

		try {
			await generalUtilities._safeMathAdd(aBN, bBN);
			assert.fail("Addition Overflow Error should have occurred!");
		} catch (error) {
			assert.ok(/revert/.test(error.message), "String 'revert' not present in error message!");
			assert.ok(/_safeMathAdd : Addition Overflow/.test(error.message),
				"Appropriate error message not returned!");
		}
	});

	it("test _safeMathSubtract method : no subtraction overflow", async () => {
		let aBN = new BN(5654);
		let bBN = new BN(765);
		let result = await generalUtilities._safeMathSubtract(aBN, bBN);

		let expectedResult = aBN.sub(bBN);
		assert.equal(result.toString(), expectedResult.toString(), "Incorrect returned value obtained!");
	});

	it("test _safeMathSubtract method : input 'a' is less than input 'b' causing subtraction overflow", async () => {
		let aBN = new BN(5654);
		let bBN = new BN(5655);

		try {
			await generalUtilities._safeMathSubtract(aBN, bBN);
			assert.fail("Subtraction Overflow Error should have occurred!");
		} catch (error) {
			assert.ok(/revert/.test(error.message), "String 'revert' not present in error message!");
			assert.ok(/_safeMathSubtract : Subtraction Overflow/.test(error.message),
				"Appropriate error message not returned!");
		}
	});

	it("test _compareStringsEqual method : both input strings are the same", async () => {
		let a = "This is the string!";
		let b = "This is the string!";

		assert.equal(await generalUtilities._compareStringsEqual(a, b), true, "Should have indicated that both strings are equal!");
	});

	it("test _compareStringsEqual method : both input strings are NOT the same", async () => {
		let a = "This is the string!";
		let b = "This is the different string!";

		assert.equal(await generalUtilities._compareStringsEqual(a, b), false, "Should have indicated that both strings are NOT equal!");
	});

	it("test _addressToString method", async () => {
		assert.equal(await generalUtilities._addressToString(accounts[0]), accounts[0].toLowerCase(),
			"Should have returned Ethereum Address as a lower case string!");
	});

	it("test _parseEthereumAddressStringToAddress method", async () => {
		for (let i = 0; i < 5; i++) {
			let lowerCaseEthereumAddressStr = await generalUtilities._addressToString(accounts[i]);
			assert.equal(await generalUtilities._parseEthereumAddressStringToAddress(lowerCaseEthereumAddressStr), accounts[i],
				"Should have returned correct Ethereum Address!");

			assert.equal(await generalUtilities._parseEthereumAddressStringToAddress(accounts[i]), accounts[i],
				"Should have returned correct Ethereum Address!");

			let upperCaseEthereumAddressStr = lowerCaseEthereumAddressStr.toUpperCase();
			assert.equal(await generalUtilities._parseEthereumAddressStringToAddress(upperCaseEthereumAddressStr), accounts[i],
				"Should have returned correct Ethereum Address!");
		}
	});

	it("test _safeMathDivide method : no division overflow", async () => {
		let aBN = new BN(6789);
		let bBN = new BN(76);
		let result = await generalUtilities._safeMathDivide(aBN, bBN);

		let expectedResult = aBN.div(bBN);
		assert.equal(result.toString(), expectedResult.toString(), "Incorrect returned value obtained!");
	});

	it("test _safeMathDivide method : no division overflow - input 'a' is zero and input 'b' is largest uint256 possible", async () => {
		let aBN = new BN(0);
		let bBN = new BN(2).pow(new BN(256)).sub(new BN(1));
		let result = await generalUtilities._safeMathDivide(aBN, bBN);

		let expectedResult = aBN.div(bBN);
		assert.equal(result.toString(), expectedResult.toString(), "Incorrect returned value obtained!");
	});

	it("test _safeMathDivide method : no division overflow - input 'a' is one and input 'b' is largest uint256 possible", async () => {
		let aBN = new BN(1);
		let bBN = new BN(2).pow(new BN(256)).sub(new BN(1));
		let result = await generalUtilities._safeMathDivide(aBN, bBN);

		let expectedResult = aBN.div(bBN);
		assert.equal(result.toString(), expectedResult.toString(), "Incorrect returned value obtained!");
	});

	it("test _safeMathDivide method : no division overflow - input 'b' is one and input 'a' is largest uint256 possible", async () => {
		let bBN = new BN(1);
		let aBN = new BN(2).pow(new BN(256)).sub(new BN(1));
		let result = await generalUtilities._safeMathDivide(aBN, bBN);

		let expectedResult = aBN.div(bBN);
		assert.equal(result.toString(), expectedResult.toString(), "Incorrect returned value obtained!");
	});

	it("test _safeMathDivide method : division error occurs - input denominator 'b' is zero", async () => {
		let aBN = new BN(7898)
		let bBN = new BN(0);

		try {
			await generalUtilities._safeMathDivide(aBN, bBN);
			assert.fail("Division Denominator Zero Error should have occurred!");
		} catch (error) {
			assert.ok(/revert/.test(error.message), "String 'revert' not present in error message!");
				assert.ok(/_safeMathDivide : Denominator is 0/.test(error.message),
				"Appropriate error message not returned!");
		}
	});

	it("test _safeMathMultiply method : no multiplication overflow", async () => {
		let aBN = new BN(324);
		let bBN = new BN(765);
		let result = await generalUtilities._safeMathMultiply(aBN, bBN);

		let expectedResult = aBN.mul(bBN);
		assert.equal(result.toString(), expectedResult.toString(), "Incorrect returned value obtained!");
	});

	it("test _safeMathMultiply method : input 'a' is zero - no multiplication overflow", async () => {
		let aBN = new BN(0);
		let bBN = new BN(2).pow(new BN(256)).sub(new BN(1));
		let result = await generalUtilities._safeMathMultiply(aBN, bBN);

		let expectedResult = aBN.mul(bBN);
		assert.equal(result.toString(), expectedResult.toString(), "Incorrect returned value obtained!");
	});

	it("test _safeMathMultiply method : input 'b' is zero - no multiplication overflow", async () => {
		let aBN = new BN(324);
		let bBN = new BN(0);
		let result = await generalUtilities._safeMathMultiply(aBN, bBN);

		let expectedResult = aBN.mul(bBN);
		assert.equal(result.toString(), expectedResult.toString(), "Incorrect returned value obtained!");
	});

	it("test _safeMathMultiply method : multiplication overflow occurs - input 'a' is too large causing overflow", async () => {
		let aBN = new BN(2).pow(new BN(256)).sub(new BN(1));
		let bBN = new BN(765);

		try {
			await generalUtilities._safeMathMultiply(aBN, bBN);
			assert.fail("Multiplication Overflow Error should have occurred!");
		} catch (error) {
			assert.ok(/revert/.test(error.message), "String 'revert' not present in error message!");
				assert.ok(/_safeMathMultiply : Multiplication Overflow/.test(error.message),
				"Appropriate error message not returned!");
		}
	});

	it("test _safeMathMultiply method : multiplication overflow occurs - input 'b' is too large causing overflow", async () => {
		let bBN = new BN(2).pow(new BN(256)).sub(new BN(1));
		let aBN = new BN(765);

		try {
			await generalUtilities._safeMathMultiply(aBN, bBN);
			assert.fail("Multiplication Overflow Error should have occurred!");
		} catch (error) {
			assert.ok(/revert/.test(error.message), "String 'revert' not present in error message!");
			assert.ok(/_safeMathMultiply : Multiplication Overflow/.test(error.message),
				"Appropriate error message not returned!");
		}
	});

	it("test _getPercentageOfTotalAmount method", async () => {
		let numeratorBN = new BN(5)
		let denominatorBN = new BN(100);
		let totalAmountBN = new BN(9674);
		let result = await generalUtilities._getPercentageOfTotalAmount(numeratorBN, denominatorBN, totalAmountBN);

		let expectedResult = numeratorBN.mul(totalAmountBN).div(denominatorBN);
		assert.equal(result.toString(), expectedResult.toString(), "Incorrect returned value obtained!");
	});

	it("test _getPercentageOfTotalAmount method : denominator is zero causing division error", async () => {
		let numeratorBN = new BN(5)
		let denominatorBN = new BN(0);
		let totalAmountBN = new BN(9674);

		try {
			await generalUtilities._getPercentageOfTotalAmount(numeratorBN, denominatorBN, totalAmountBN);
			assert.fail("Division denominator zero error should have occurred!");
		} catch (error) {
			assert.ok(/revert/.test(error.message), "String 'revert' not present in error message!");
			assert.ok(/_safeMathDivide : Denominator is 0/.test(error.message),
				"Appropriate error message not returned!");
		}

	});
});