$(document).ready(function () {
	const decentralizedMarketplaceContractAddress = "0xC1f5106f4df7d679b6a2df9c0E3ac3E555CCd6Aa";
	const decentralizedMarketplaceContractABI = [
		{
		  "constant": true,
		  "inputs": [],
		  "name": "mediationMarketplace",
		  "outputs": [
			{
			  "name": "",
			  "type": "address"
			}
		  ],
		  "payable": false,
		  "stateMutability": "view",
		  "type": "function"
		},
		{
		  "constant": true,
		  "inputs": [],
		  "name": "mediationMarketplaceHasBeenSet",
		  "outputs": [
			{
			  "name": "",
			  "type": "bool"
			}
		  ],
		  "payable": false,
		  "stateMutability": "view",
		  "type": "function"
		},
		{
		  "constant": true,
		  "inputs": [
			{
			  "name": "",
			  "type": "address"
			}
		  ],
		  "name": "sellerExists",
		  "outputs": [
			{
			  "name": "",
			  "type": "bool"
			}
		  ],
		  "payable": false,
		  "stateMutability": "view",
		  "type": "function"
		},
		{
		  "constant": true,
		  "inputs": [],
		  "name": "contractOwner",
		  "outputs": [
			{
			  "name": "",
			  "type": "address"
			}
		  ],
		  "payable": false,
		  "stateMutability": "view",
		  "type": "function"
		},
		{
		  "inputs": [],
		  "payable": false,
		  "stateMutability": "nonpayable",
		  "type": "constructor"
		},
		{
		  "anonymous": false,
		  "inputs": [
			{
			  "indexed": false,
			  "name": "_msgSender",
			  "type": "address"
			},
			{
			  "indexed": false,
			  "name": "_sellerAddress",
			  "type": "address"
			},
			{
			  "indexed": false,
			  "name": "_keyItemIpfsHash",
			  "type": "string"
			},
			{
			  "indexed": false,
			  "name": "_quantity",
			  "type": "uint256"
			}
		  ],
		  "name": "PurchaseItemWithoutMediatorEvent",
		  "type": "event"
		},
		{
		  "anonymous": false,
		  "inputs": [
			{
			  "indexed": false,
			  "name": "_msgSender",
			  "type": "address"
			},
			{
			  "indexed": false,
			  "name": "_keyItemIpfsHash",
			  "type": "string"
			}
		  ],
		  "name": "AddItemForSaleAndPossiblySellerEvent",
		  "type": "event"
		},
		{
		  "anonymous": false,
		  "inputs": [
			{
			  "indexed": false,
			  "name": "_msgSender",
			  "type": "address"
			},
			{
			  "indexed": false,
			  "name": "_keyItemIpfsHash",
			  "type": "string"
			}
		  ],
		  "name": "RemoveItemForSaleAndPossibleSellerEvent",
		  "type": "event"
		},
		{
		  "constant": false,
		  "inputs": [
			{
			  "name": "franklinDecentralizedMarketplaceMediationAddress",
			  "type": "address"
			}
		  ],
		  "name": "setFranklinDecentralizedMarketplaceMediationContract",
		  "outputs": [],
		  "payable": false,
		  "stateMutability": "nonpayable",
		  "type": "function"
		},
		{
		  "constant": true,
		  "inputs": [
			{
			  "name": "_sellerAddress",
			  "type": "address"
			}
		  ],
		  "name": "sellerIsWillingToSellItemsViaMediator",
		  "outputs": [
			{
			  "name": "",
			  "type": "bool"
			}
		  ],
		  "payable": false,
		  "stateMutability": "view",
		  "type": "function"
		},
		{
		  "constant": false,
		  "inputs": [
			{
			  "name": "_flag",
			  "type": "bool"
			}
		  ],
		  "name": "setSellerWillingToSellItemsViaMediator",
		  "outputs": [],
		  "payable": false,
		  "stateMutability": "nonpayable",
		  "type": "function"
		},
		{
		  "constant": false,
		  "inputs": [
			{
			  "name": "_ipfsHashKeyDescription",
			  "type": "string"
			}
		  ],
		  "name": "addOrUpdateSellerDescription",
		  "outputs": [],
		  "payable": false,
		  "stateMutability": "nonpayable",
		  "type": "function"
		},
		{
		  "constant": true,
		  "inputs": [
			{
			  "name": "_sellerAddress",
			  "type": "address"
			}
		  ],
		  "name": "getSellerIpfsHashDescription",
		  "outputs": [
			{
			  "name": "",
			  "type": "string"
			}
		  ],
		  "payable": false,
		  "stateMutability": "view",
		  "type": "function"
		},
		{
		  "constant": false,
		  "inputs": [],
		  "name": "removeSeller",
		  "outputs": [],
		  "payable": false,
		  "stateMutability": "nonpayable",
		  "type": "function"
		},
		{
		  "constant": true,
		  "inputs": [
			{
			  "name": "_index",
			  "type": "uint256"
			}
		  ],
		  "name": "getSellerAddress",
		  "outputs": [
			{
			  "name": "",
			  "type": "address"
			}
		  ],
		  "payable": false,
		  "stateMutability": "view",
		  "type": "function"
		},
		{
		  "constant": true,
		  "inputs": [],
		  "name": "getNumberOfSellers",
		  "outputs": [
			{
			  "name": "",
			  "type": "uint256"
			}
		  ],
		  "payable": false,
		  "stateMutability": "view",
		  "type": "function"
		},
		{
		  "constant": false,
		  "inputs": [
			{
			  "name": "_keyItemIpfsHash",
			  "type": "string"
			},
			{
			  "name": "_priceInWei",
			  "type": "uint256"
			}
		  ],
		  "name": "setPriceOfItem",
		  "outputs": [],
		  "payable": false,
		  "stateMutability": "nonpayable",
		  "type": "function"
		},
		{
		  "constant": true,
		  "inputs": [
			{
			  "name": "_sellerAddress",
			  "type": "address"
			},
			{
			  "name": "_keyItemIpfsHash",
			  "type": "string"
			}
		  ],
		  "name": "getPriceOfItem",
		  "outputs": [
			{
			  "name": "",
			  "type": "uint256"
			}
		  ],
		  "payable": false,
		  "stateMutability": "view",
		  "type": "function"
		},
		{
		  "constant": false,
		  "inputs": [
			{
			  "name": "_keyItemIpfsHash",
			  "type": "string"
			},
			{
			  "name": "_quantity",
			  "type": "uint256"
			}
		  ],
		  "name": "setQuantityAvailableForSaleOfAnItem",
		  "outputs": [],
		  "payable": false,
		  "stateMutability": "nonpayable",
		  "type": "function"
		},
		{
		  "constant": false,
		  "inputs": [
			{
			  "name": "_sellerAddress",
			  "type": "address"
			},
			{
			  "name": "_keyItemIpfsHash",
			  "type": "string"
			},
			{
			  "name": "_quantity",
			  "type": "uint256"
			}
		  ],
		  "name": "setQuantityAvailableForSaleOfAnItem_v2",
		  "outputs": [],
		  "payable": false,
		  "stateMutability": "nonpayable",
		  "type": "function"
		},
		{
		  "constant": true,
		  "inputs": [
			{
			  "name": "_sellerAddress",
			  "type": "address"
			},
			{
			  "name": "_keyItemIpfsHash",
			  "type": "string"
			}
		  ],
		  "name": "getQuantityAvailableForSaleOfAnItemBySeller",
		  "outputs": [
			{
			  "name": "",
			  "type": "uint256"
			}
		  ],
		  "payable": false,
		  "stateMutability": "view",
		  "type": "function"
		},
		{
		  "constant": false,
		  "inputs": [
			{
			  "name": "_sellerAddress",
			  "type": "address"
			},
			{
			  "name": "_keyItemIpfsHash",
			  "type": "string"
			},
			{
			  "name": "_quantity",
			  "type": "uint256"
			}
		  ],
		  "name": "purchaseItemWithoutMediator",
		  "outputs": [],
		  "payable": true,
		  "stateMutability": "payable",
		  "type": "function"
		},
		{
		  "constant": false,
		  "inputs": [
			{
			  "name": "_keyItemIpfsHash",
			  "type": "string"
			}
		  ],
		  "name": "addItemForSale",
		  "outputs": [],
		  "payable": false,
		  "stateMutability": "nonpayable",
		  "type": "function"
		},
		{
		  "constant": false,
		  "inputs": [
			{
			  "name": "_keyItemIpfsHash",
			  "type": "string"
			}
		  ],
		  "name": "removeItemForSale",
		  "outputs": [],
		  "payable": false,
		  "stateMutability": "nonpayable",
		  "type": "function"
		},
		{
		  "constant": true,
		  "inputs": [
			{
			  "name": "_sellerAddress",
			  "type": "address"
			}
		  ],
		  "name": "getNumberOfDifferentItemsBeingSoldBySeller",
		  "outputs": [
			{
			  "name": "",
			  "type": "uint256"
			}
		  ],
		  "payable": false,
		  "stateMutability": "view",
		  "type": "function"
		},
		{
		  "constant": true,
		  "inputs": [
			{
			  "name": "_sellerAddress",
			  "type": "address"
			},
			{
			  "name": "_keyItemIpfsHash",
			  "type": "string"
			}
		  ],
		  "name": "itemForSaleFromSellerExists",
		  "outputs": [
			{
			  "name": "",
			  "type": "bool"
			}
		  ],
		  "payable": false,
		  "stateMutability": "view",
		  "type": "function"
		},
		{
		  "constant": true,
		  "inputs": [
			{
			  "name": "_sellerAddress",
			  "type": "address"
			},
			{
			  "name": "_itemIndex",
			  "type": "uint256"
			}
		  ],
		  "name": "getItemForSale",
		  "outputs": [
			{
			  "name": "",
			  "type": "string"
			}
		  ],
		  "payable": false,
		  "stateMutability": "view",
		  "type": "function"
		}
  	];

  	const decentralizedMarketplaceMediationContractAddress = "0xD4117eb19678E6dB410c53268542c8eedf36fff9";
  	const decentralizedMarketplaceMediationContractABI = [
		{
		  "constant": true,
		  "inputs": [
			{
			  "name": "",
			  "type": "address"
			}
		  ],
		  "name": "mediatorExists",
		  "outputs": [
			{
			  "name": "",
			  "type": "bool"
			}
		  ],
		  "payable": false,
		  "stateMutability": "view",
		  "type": "function"
		},
		{
		  "constant": true,
		  "inputs": [
			{
			  "name": "",
			  "type": "string"
			}
		  ],
		  "name": "mediatedSalesTransactionExists",
		  "outputs": [
			{
			  "name": "",
			  "type": "bool"
			}
		  ],
		  "payable": false,
		  "stateMutability": "view",
		  "type": "function"
		},
		{
		  "constant": true,
		  "inputs": [
			{
			  "name": "",
			  "type": "address"
			}
		  ],
		  "name": "descriptionInfoAboutMediators",
		  "outputs": [
			{
			  "name": "",
			  "type": "string"
			}
		  ],
		  "payable": false,
		  "stateMutability": "view",
		  "type": "function"
		},
		{
		  "constant": true,
		  "inputs": [],
		  "name": "numberOfMediators",
		  "outputs": [
			{
			  "name": "",
			  "type": "uint256"
			}
		  ],
		  "payable": false,
		  "stateMutability": "view",
		  "type": "function"
		},
		{
		  "constant": true,
		  "inputs": [
			{
			  "name": "",
			  "type": "string"
			},
			{
			  "name": "",
			  "type": "uint256"
			}
		  ],
		  "name": "mediatedSalesTransactionApprovedByParties",
		  "outputs": [
			{
			  "name": "",
			  "type": "bool"
			}
		  ],
		  "payable": false,
		  "stateMutability": "view",
		  "type": "function"
		},
		{
		  "constant": true,
		  "inputs": [],
		  "name": "franklinDecentralizedMarketplaceContract",
		  "outputs": [
			{
			  "name": "",
			  "type": "address"
			}
		  ],
		  "payable": false,
		  "stateMutability": "view",
		  "type": "function"
		},
		{
		  "constant": true,
		  "inputs": [
			{
			  "name": "",
			  "type": "string"
			},
			{
			  "name": "",
			  "type": "uint256"
			}
		  ],
		  "name": "mediatedSalesTransactionDisapprovedByParties",
		  "outputs": [
			{
			  "name": "",
			  "type": "bool"
			}
		  ],
		  "payable": false,
		  "stateMutability": "view",
		  "type": "function"
		},
		{
		  "constant": true,
		  "inputs": [
			{
			  "name": "",
			  "type": "address"
			},
			{
			  "name": "",
			  "type": "uint256"
			}
		  ],
		  "name": "mediatedSalesTransactionsAddressInvolved",
		  "outputs": [
			{
			  "name": "",
			  "type": "string"
			}
		  ],
		  "payable": false,
		  "stateMutability": "view",
		  "type": "function"
		},
		{
		  "constant": true,
		  "inputs": [],
		  "name": "franklinDecentralizedMarketplaceContractHasBeenSet",
		  "outputs": [
			{
			  "name": "",
			  "type": "bool"
			}
		  ],
		  "payable": false,
		  "stateMutability": "view",
		  "type": "function"
		},
		{
		  "constant": true,
		  "inputs": [
			{
			  "name": "",
			  "type": "address"
			}
		  ],
		  "name": "numberOfMediationsMediatorInvolved",
		  "outputs": [
			{
			  "name": "",
			  "type": "uint256"
			}
		  ],
		  "payable": false,
		  "stateMutability": "view",
		  "type": "function"
		},
		{
		  "constant": true,
		  "inputs": [],
		  "name": "contractOwner",
		  "outputs": [
			{
			  "name": "",
			  "type": "address"
			}
		  ],
		  "payable": false,
		  "stateMutability": "view",
		  "type": "function"
		},
		{
		  "constant": true,
		  "inputs": [
			{
			  "name": "",
			  "type": "string"
			},
			{
			  "name": "",
			  "type": "uint256"
			}
		  ],
		  "name": "mediatedSalesTransactionAddresses",
		  "outputs": [
			{
			  "name": "",
			  "type": "address"
			}
		  ],
		  "payable": false,
		  "stateMutability": "view",
		  "type": "function"
		},
		{
		  "constant": true,
		  "inputs": [
			{
			  "name": "",
			  "type": "string"
			}
		  ],
		  "name": "mediatedSalesTransactionAmount",
		  "outputs": [
			{
			  "name": "",
			  "type": "uint256"
			}
		  ],
		  "payable": false,
		  "stateMutability": "view",
		  "type": "function"
		},
		{
		  "inputs": [],
		  "payable": false,
		  "stateMutability": "nonpayable",
		  "type": "constructor"
		},
		{
		  "anonymous": false,
		  "inputs": [
			{
			  "indexed": false,
			  "name": "_msgSender",
			  "type": "address"
			},
			{
			  "indexed": false,
			  "name": "_sellerAddress",
			  "type": "address"
			},
			{
			  "indexed": false,
			  "name": "_mediatorAddress",
			  "type": "address"
			},
			{
			  "indexed": false,
			  "name": "_keyItemIpfsHash",
			  "type": "string"
			},
			{
			  "indexed": false,
			  "name": "_mediatedSalesTransactionIpfsHash",
			  "type": "string"
			},
			{
			  "indexed": false,
			  "name": "_quantity",
			  "type": "uint256"
			}
		  ],
		  "name": "PurchaseItemWithMediatorEvent",
		  "type": "event"
		},
		{
		  "anonymous": false,
		  "inputs": [
			{
			  "indexed": false,
			  "name": "_mediatedSalesTransactionIpfsHash",
			  "type": "string"
			}
		  ],
		  "name": "MediatedSalesTransactionHasBeenFullyApprovedEvent",
		  "type": "event"
		},
		{
		  "anonymous": false,
		  "inputs": [
			{
			  "indexed": false,
			  "name": "_mediatedSalesTransactionIpfsHash",
			  "type": "string"
			}
		  ],
		  "name": "MediatedSalesTransactionHasBeenFullyDisapprovedEvent",
		  "type": "event"
		},
		{
		  "constant": false,
		  "inputs": [
			{
			  "name": "franklinDecentralizedMarketplaceContractAddress",
			  "type": "address"
			}
		  ],
		  "name": "setFranklinDecentralizedMarketplaceContract",
		  "outputs": [],
		  "payable": false,
		  "stateMutability": "nonpayable",
		  "type": "function"
		},
		{
		  "constant": false,
		  "inputs": [
			{
			  "name": "_mediatorIpfsHashDescription",
			  "type": "string"
			}
		  ],
		  "name": "addOrUpdateMediator",
		  "outputs": [],
		  "payable": false,
		  "stateMutability": "nonpayable",
		  "type": "function"
		},
		{
		  "constant": false,
		  "inputs": [],
		  "name": "removeMediator",
		  "outputs": [],
		  "payable": false,
		  "stateMutability": "nonpayable",
		  "type": "function"
		},
		{
		  "constant": true,
		  "inputs": [
			{
			  "name": "_index",
			  "type": "uint256"
			}
		  ],
		  "name": "getMediatorAddress",
		  "outputs": [
			{
			  "name": "",
			  "type": "address"
			}
		  ],
		  "payable": false,
		  "stateMutability": "view",
		  "type": "function"
		},
		{
		  "constant": false,
		  "inputs": [
			{
			  "name": "_sellerAddress",
			  "type": "address"
			},
			{
			  "name": "_mediatorAddress",
			  "type": "address"
			},
			{
			  "name": "_keyItemIpfsHash",
			  "type": "string"
			},
			{
			  "name": "_mediatedSalesTransactionIpfsHash",
			  "type": "string"
			},
			{
			  "name": "_quantity",
			  "type": "uint256"
			}
		  ],
		  "name": "purchaseItemWithMediator",
		  "outputs": [],
		  "payable": true,
		  "stateMutability": "payable",
		  "type": "function"
		},
		{
		  "constant": true,
		  "inputs": [
			{
			  "name": "_mediatedSalesTransactionIpfsHash",
			  "type": "string"
			}
		  ],
		  "name": "mediatedSalesTransactionHasBeenApproved",
		  "outputs": [
			{
			  "name": "",
			  "type": "bool"
			}
		  ],
		  "payable": false,
		  "stateMutability": "view",
		  "type": "function"
		},
		{
		  "constant": true,
		  "inputs": [
			{
			  "name": "_mediatedSalesTransactionIpfsHash",
			  "type": "string"
			}
		  ],
		  "name": "mediatedSalesTransactionHasBeenDisapproved",
		  "outputs": [
			{
			  "name": "",
			  "type": "bool"
			}
		  ],
		  "payable": false,
		  "stateMutability": "view",
		  "type": "function"
		},
		{
		  "constant": false,
		  "inputs": [
			{
			  "name": "_mediatedSalesTransactionIpfsHash",
			  "type": "string"
			}
		  ],
		  "name": "approveMediatedSalesTransaction",
		  "outputs": [],
		  "payable": false,
		  "stateMutability": "nonpayable",
		  "type": "function"
		},
		{
		  "constant": false,
		  "inputs": [
			{
			  "name": "_mediatedSalesTransactionIpfsHash",
			  "type": "string"
			}
		  ],
		  "name": "disapproveMediatedSalesTransaction",
		  "outputs": [],
		  "payable": false,
		  "stateMutability": "nonpayable",
		  "type": "function"
		},
		{
		  "constant": true,
		  "inputs": [
			{
			  "name": "_partyAddress",
			  "type": "address"
			}
		  ],
		  "name": "numberOfMediatedSalesTransactionsAddressInvolved",
		  "outputs": [
			{
			  "name": "",
			  "type": "uint256"
			}
		  ],
		  "payable": false,
		  "stateMutability": "view",
		  "type": "function"
		}
  	];

  	// The amount of Wei that is returned back from the "web3.eth.getBalance" method is in 10^14 Wei.
  	const WEB3_GET_BALANCE_MULTIPLIER = 10**14;

  	const EMPTY_STRING = "";

	var currentMetamaskEthereumAddress = undefined;
	var accountIntervalFunction = undefined;
	window.ethereum.enable();

	makeSureMetamaskInstalled();

	const IPFS = window.IpfsApi('ipfs.infura.io', '5001', {protocol: 'https'});
	const Buffer = IPFS.Buffer;

	// Below is used to be able to call Metamask "web3" methods synchronously via await.
	// Reference --> https://www.reddit.com/r/ethdev/comments/8dyfyr/how_to_make_metamask_accept_promiseswait_for
	const PROMISIFY = (inner) =>
		new Promise((resolve, reject) =>
			 inner((err, res) => {
				if (err) {
					reject(err);
					console.log('PROMISIFY : err =', err);
				} else {
					resolve(res);
				}
			})
    );

	/*
	let balance = undefined;
	getBalanceInWei()
		.then(function (response) {
			balance = response;
			console.log('balance =', balance);

			let balanceBigInt = BigInt(balance);
			console.log('balanceBigInt =', balanceBigInt);
			console.log('balanceBigInt.toString() =', balanceBigInt.toString());
		});
	*/

	console.log('currentMetamaskEthereumAddress =', currentMetamaskEthereumAddress);

	// Used to keep track of the Current Mediators
	var currentMediatorsArray = [ ];

	// Used to keep track of the Current Sellers
	var currentSellersArray = [ ];

	showView("viewHome");

	$('#linkHome').click(function () {
		console.log('linkHome clicked');
	    showView("viewHome");
    });

	$('#linkSellers').click(function () {
		console.log('linkSellers clicked');
		createViewSellersTable();
	    showView("viewSellers");
    });

	$('#linkMediators').click(function () {
		console.log('linkMediators clicked');
		createViewMediatorsTable();
	    showView("viewMediators");
    });

    $('#buttonGetCurrentMediators').click(getCurrentMediators);
    $('#buttonClearCurrentMediatorsResults').click(clearCurrentMediatorsResults);
    $('#buttonClearAddUpdateYourselfAsMediator').click(clearAddUpdateYourselfAsMediator);
    $('#buttonAddUpdateYourselfAsMediator').click(addUpdateYourselfAsMediator);
    $('#buttonRemoveYourselfAsMediator').click(removeYourselfAsMediator);
    $('#buttonViewDetailedInformationAboutMediator').click(viewDetailedInformationAboutMediator);
    $('#buttonClearViewDetailedInformationAboutMediator').click(clearViewDetailedInformationAboutMediator);

    $('#buttonGetCurrentSellers').click(getCurrentSellers);
    $('#buttonClearCurrentSellersResults').click(clearCurrentSellersResults);
    $('#buttonClearAddUpdateDescriptionOfYourselfAsSeller').click(clearAddUpdateDescriptionOfYourselfAsSeller);
    $('#buttonAddUpdateDescriptionOfYourselfAsSeller').click(addUpdateDescriptionOfYourselfAsSeller);
    $('#buttonRemoveYourselfAsSeller').click(removeYourselfAsSeller);
    $('#buttonViewDetailedInformationAboutSeller').click(viewDetailedInformationAboutSeller);
    $('#buttonClearViewDetailedInformationAboutSeller').click(clearViewDetailedInformationAboutSeller);

	// Attach AJAX "loading" event listener
	$(document).on({
		ajaxStart: function () {
			$("#loadingBox").show()
		},
		ajaxStop: function () {
			$("#loadingBox").hide()
		}
	});

	function makeSureMetamaskInstalled() {
		if (typeof web3 === 'undefined') {
			currentMetamaskEthereumAddress = undefined;
		}
		else {
			currentMetamaskEthereumAddress = web3.eth.accounts[0];
			console.log('web3 =', web3);
		}

		if (currentMetamaskEthereumAddress === undefined) {
			$('#viewMediatorsYourCurrentMetamaskEthereumAddress').val('');
			$('#viewSellersYourCurrentMetamaskEthereumAddress').val('');

			showError("You must install the Metamask Ethereum Wallet plugin inside your browser in order to use this DApp. " +
				"Please install MetaMask to access the Ethereum Web3 API from your browser. If you've already installede Metamask, then " +
				"perhaps Metamask is locked, and you need to unlock it");
		}
		else {
			if (accountIntervalFunction === undefined) {
				accountIntervalFunction = setInterval(function () {
					if (web3.eth.accounts[0] !== currentMetamaskEthereumAddress && currentMetamaskEthereumAddress !== undefined) {
						currentMetamaskEthereumAddress = web3.eth.accounts[0];
						location.reload();
					}
				}, 1000);
			}

			$('#viewMediatorsYourCurrentMetamaskEthereumAddress').val(currentMetamaskEthereumAddress);
			$('#viewSellersYourCurrentMetamaskEthereumAddress').val(currentMetamaskEthereumAddress);
		}
	}

	function clearViewDetailedInformationAboutSeller() {
		$('#textViewDetailedInformationAboutSellerEthereumAddress').val('');
		$('#textViewDetailedInformationAboutSellerName').val('');
		$('#textViewDetailedInformationAboutSellerNumberOfDifferentItemsBeingSold').val('');
		$('#textareaViewDetailedInformationAboutSellerPhysicalAddress').val('');
		$('#textareaViewDetailedInformationAboutSellerMailingAddress').val('');
		$('#textViewDetailedInformationAboutSellerWebsite').val('');
		$('#textViewDetailedInformationAboutSellerEmail').val('');
		$('#textViewDetailedInformationAboutSellerPhone').val('');
		$('#textViewDetailedInformationAboutSellerFax').val('');
		$('#textareaViewDetailedInformationAboutSellerDescription').val('');

		$('#pictureViewDetailedInformationAboutSeller').attr('src', '');
		$('#pictureViewDetailedInformationAboutSeller').attr('alt', '');
	}

	function clearViewDetailedInformationAboutMediator() {
		$('#textViewDetailedInformationAboutMediatorEthereumAddress').val('');
		$('#textViewDetailedInformationAboutMediatorName').val('');
		$('#textViewDetailedInformationAboutMediatorNumberOfMediationsInvolved').val('');
		$('#textareaViewDetailedInformationAboutMediatorPhysicalAddress').val('');
		$('#textareaViewDetailedInformationAboutMediatorMailingAddress').val('');
		$('#textViewDetailedInformationAboutMediatorWebsite').val('');
		$('#textViewDetailedInformationAboutMediatorEmail').val('');
		$('#textViewDetailedInformationAboutMediatorPhone').val('');
		$('#textViewDetailedInformationAboutMediatorFax').val('');
		$('#textareaViewDetailedInformationAboutMediatorDescription').val('');

		$('#pictureViewDetailedInformationAboutMediator').attr('src', '');
		$('#pictureViewDetailedInformationAboutMediator').attr('alt', '');
	}

	async function removeYourselfAsSeller() {

	}

	async function removeYourselfAsMediator() {
		makeSureMetamaskInstalled();

		let ethereumPublicAddress = currentMetamaskEthereumAddress;
		showInfo(`Removing as Mediator Your Metamask Ethereum Public Address ${ethereumPublicAddress} ....`);

		let decentralizedMarketplaceMediationContract =
			web3.eth.contract(decentralizedMarketplaceMediationContractABI).at(decentralizedMarketplaceMediationContractAddress);

		var mediatorExists =
				PROMISIFY(cb => decentralizedMarketplaceMediationContract.mediatorExists.call(ethereumPublicAddress, cb));
		let mediatorExistsFlag = undefined;
		let mediatorExistsError = undefined;
		await mediatorExists
			.then(function (response) {
				console.log('mediatorExists : response =', response);
				mediatorExistsFlag = response;
			})
			.catch(function (error) {
				console.log('mediatorExists : error =', error);
				mediatorExistsError = error;
  		});

  		if (mediatorExistsError !== undefined) {
			hideInfo();
			return showError("Error encountered while calling the DecentralizedMarketplaceMediationContract.mediatorExists method: " +
				mediatorExistsError);
		}

		if (mediatorExistsFlag === undefined) {
			hideInfo();
			return showError("Error encountered while calling the DecentralizedMarketplaceMediationContract.mediatorExists method!");
		}

		console.log('mediatorExistsFlag =', mediatorExistsFlag);
		if (!mediatorExistsFlag) {
			hideInfo();
			return showError(`No remove was done! Your current Metamask Ethereum Public Address ${ethereumPublicAddress} was not listed as a Mediator in the Franklin Decentralized Marketplace!`);
		}

		decentralizedMarketplaceMediationContract.removeMediator(function (err, txHash) {
			hideInfo();

			if (err) {
				// return showError("Smart contract call failed: " + err);
				console.log('err =', err);
				return showError(`DecentralizedMarketplaceMediationContract.removeMediator call failed:  + ${err.message}`);
			}

			showInfo(`Your current Metamask Ethereum Address ${currentMetamaskEthereumAddress} <b>successfully removed as Mediator</b> from Franklin Decentralized Marketplace. ` +
				`Transaction hash: ${txHash}`);
		});
	}

	async function viewDetailedInformationAboutSeller() {

	}

	async function viewDetailedInformationAboutMediator() {
		let ethereumPublicAddress = $('#textViewDetailedInformationAboutMediatorEthereumAddress').val().trim().toLowerCase();
		if (ethereumPublicAddress.length === 0) {
			showError('The Ethereum Public Address cannot be an empty string or consist only of white space. Please enter an ' +
				'Ethereum Public Address value that is a 40-hex lowercase string.');
			return;
		}

		if (ethereumPublicAddress.startsWith("0x")) {
			if (ethereumPublicAddress.length > 2) {
				ethereumPublicAddress = ethereumPublicAddress.substring(2);
			}
		}

		if (!isValidPublicAddress(ethereumPublicAddress)) {
			showError("Entered Ethereum Public Address is not a 40-hex valued lower case string. " +
				"Please enter an Ethereum Public Address that is a 40-hex valued lower case string.");
			return;
		}

		ethereumPublicAddress = "0x" + ethereumPublicAddress;

		makeSureMetamaskInstalled();

		showInfo(`Getting Mediator Detailed Information about Ethereum Public Address: ${ethereumPublicAddress}`);

		let decentralizedMarketplaceMediationContract =
			web3.eth.contract(decentralizedMarketplaceMediationContractABI).at(decentralizedMarketplaceMediationContractAddress);

		var mediatorExists =
				PROMISIFY(cb => decentralizedMarketplaceMediationContract.mediatorExists.call(ethereumPublicAddress, cb));
		let mediatorExistsFlag = undefined;
		let mediatorExistsError = undefined;
		await mediatorExists
			.then(function (response) {
				console.log('mediatorExists : response =', response);
				mediatorExistsFlag = response;
			})
			.catch(function (error) {
				console.log('mediatorExists : error =', error);
				mediatorExistsError = error;
  		});

  		if (mediatorExistsError !== undefined) {
			hideInfo();
			return showError("Error encountered while calling the DecentralizedMarketplaceMediationContract.mediatorExists method: " +
				mediatorExistsError);
		}

		if (mediatorExistsFlag === undefined) {
			hideInfo();
			return showError("Error encountered while calling the DecentralizedMarketplaceMediationContract.mediatorExists method!");
		}

		console.log('mediatorExistsFlag =', mediatorExistsFlag);
		if (!mediatorExistsFlag) {
			hideInfo();
			return showError(`Ethereum Public Address ${ethereumPublicAddress} is not listed as a Mediator in the Franklin Decentralized Marketplace!`);
		}

		let mediatorAddress = ethereumPublicAddress;
		var getIpfsDescriptionInfoAboutMediator =
				PROMISIFY(cb => decentralizedMarketplaceMediationContract.descriptionInfoAboutMediators.call(mediatorAddress, cb));
		let ipfsHashDescOfMediator = undefined;
		let getIpfsDescriptionInfoAboutMediatorError = undefined;
		await getIpfsDescriptionInfoAboutMediator
			.then(function (response) {
				ipfsHashDescOfMediator = response;
				console.log('getIpfsDescriptionInfoAboutMediator : response =', response);
			})
			.catch(function (error) {
				console.log('getIpfsDescriptionInfoAboutMediator : error =', error);
				numberOfMediatorsError = error;
  		});

  		if (getIpfsDescriptionInfoAboutMediatorError !== undefined) {
			hideInfo();
			return showError("Error encountered while calling the DecentralizedMarketplaceMediationContract.descriptionInfoAboutMediators method: " +
				getMediatorAddressError);
		}

		if (ipfsHashDescOfMediator === undefined) {
			hideInfo();
			return showError("Error encountered while calling the DecentralizedMarketplaceMediationContract.descriptionInfoAboutMediators method!");
		}

		var ipfsFileGetForMediator = PROMISIFY(cb => IPFS.get(ipfsHashDescOfMediator, {timeout: '8000ms'}, cb));
		let ipfsFileGetForMediatorJson = undefined;
		let ipfsFileGetForMediatorError = undefined;
		await ipfsFileGetForMediator
			.then(function (response) {
				console.log('ipfsFileGetForMediator : response =', response);
				let ipfsFileGetForMediatorJsonString = response[0].content.toString();
				ipfsFileGetForMediatorJson = JSON.parse(ipfsFileGetForMediatorJsonString);
			})
			.catch(function (error) {
				console.log('ipfsFileGetForMediator : error =', error);
				ipfsFileGetForMediatorError = error;
  		});

  		if (ipfsFileGetForMediatorError !== undefined) {
			hideInfo();
			return showError(`Error encountered while calling IPFS.get(${ipfsHashDescOfMediator}) method: ${getMediatorAddressError}`);
		}

		if (ipfsFileGetForMediatorJson === undefined) {
			hideInfo();
			return showError(`Error encountered while calling IPFS.get(${ipfsHashDescOfMediator}) method!`);
		}

		console.log('ipfsFileGetForMediatorJson =', ipfsFileGetForMediatorJson);

		var getNumberOfMediationsMediatorInvolved =
				PROMISIFY(cb => decentralizedMarketplaceMediationContract.numberOfMediationsMediatorInvolved.call(mediatorAddress, cb));
		let numberOfMediationsMediatorInvolved = undefined;
		let getNumberOfMediationsMediatorInvolvedError = undefined;
		await getNumberOfMediationsMediatorInvolved
			.then(function (response) {
				console.log('getNumberOfMediationsMediatorInvolved : response =', response);
				let numberOfMediationsMediatorInvolved_X = response;
				numberOfMediationsMediatorInvolved = numberOfMediationsMediatorInvolved_X.c[0];
			})
			.catch(function (error) {
				console.log('getNumberOfMediationsMediatorInvolved : error =', error);
				getNumberOfMediationsMediatorInvolvedError = error;
  		});

  		if (getNumberOfMediationsMediatorInvolvedError !== undefined) {
			hideInfo();
			return showError(`Error encountered while calling ` +
				`DecentralizedMarketplaceMediationContract.numberOfMediationsMediatorInvolved(${mediatorAddress}) method: ` +
				`${getNumberOfMediationsMediatorInvolvedError}`);
		}

		if (ipfsFileGetForMediatorJson === undefined) {
			hideInfo();
			return showError(`Error encountered while calling DecentralizedMarketplaceMediationContract.numberOfMediationsMediatorInvolved(${mediatorAddress}) method!`);
		}

		console.log('numberOfMediationsMediatorInvolved =', numberOfMediationsMediatorInvolved);

		$('#textViewDetailedInformationAboutMediatorEthereumAddress').val(mediatorAddress);
		$('#textViewDetailedInformationAboutMediatorName').val(ipfsFileGetForMediatorJson.name);
		$('#textViewDetailedInformationAboutMediatorNumberOfMediationsInvolved').val(BigInt(numberOfMediationsMediatorInvolved).toString());
		$('#textareaViewDetailedInformationAboutMediatorPhysicalAddress').val(ipfsFileGetForMediatorJson.physicalAddress);
		$('#textareaViewDetailedInformationAboutMediatorMailingAddress').val(ipfsFileGetForMediatorJson.mailingAddress);
		$('#textViewDetailedInformationAboutMediatorWebsite').val(ipfsFileGetForMediatorJson.website);
		$('#textViewDetailedInformationAboutMediatorEmail').val(ipfsFileGetForMediatorJson.email);
		$('#textViewDetailedInformationAboutMediatorPhone').val(ipfsFileGetForMediatorJson.phone);
		$('#textViewDetailedInformationAboutMediatorFax').val(ipfsFileGetForMediatorJson.fax);
		$('#textareaViewDetailedInformationAboutMediatorDescription').val(ipfsFileGetForMediatorJson.description);

		if (ipfsFileGetForMediatorJson.picture === EMPTY_STRING) {
			$('#pictureViewDetailedInformationAboutMediator').attr('src', '');
			$('#pictureViewDetailedInformationAboutMediator').attr('alt', '');
		}
		else {
			$('#pictureViewDetailedInformationAboutMediator').attr('src', `https://ipfs.infura.io/ipfs/${ipfsFileGetForMediatorJson.picture}`);
			$('#pictureViewDetailedInformationAboutMediator').attr('alt', `${ipfsFileGetForMediatorJson.picture}`);
		}

		hideInfo();
	}

	// Reference --> https://blog.shovonhasan.com/using-promises-with-filereader
	const readUploadedFileAsArrayBuffer = (inputFile) => {
	  const temporaryFileReader = new FileReader();

	  return new Promise((resolve, reject) => {
		temporaryFileReader.onerror = () => {
		  temporaryFileReader.abort();
		  reject(new Error("Problem parsing input file!"));
		};

		temporaryFileReader.onload = () => {
		  resolve(temporaryFileReader.result);
		};

		temporaryFileReader.readAsArrayBuffer(inputFile);
	  });
	};

	// Reference --> https://blog.shovonhasan.com/using-promises-with-filereader
	async function uploadPictureToIPFS(inputFileElementId) {
		/*
		let numberOfFiles_1 = $('#' + inputFileElementId)[0].files.length;
		let numberOfFiles_2 = $('#' + inputFileElementId).length;
		console.log('uploadPictureToIPFS : elementInfo =', $('#' + inputFileElementId));

		var input = document.getElementById(inputFileElementId);
		console.log('uploadPictureToIPFS : input =', input);
		console.log('uploadPictureToIPFS : input.files =', input.files);

		console.log('uploadPictureToIPFS : numberOfFiles_1 =', numberOfFiles_1);
		console.log('uploadPictureToIPFS : numberOfFiles_2 =', numberOfFiles_2);
		for (let i = 0; i < numberOfFiles_1; i++) {
			console.log(`uploadPictureToIPFS : file[${i}] = `, $('#' + inputFileElementId)[0].files[0]);
		}

		if ($('#' + inputFileElementId)[0].files.length === 0) {
			console.log('uploadPicture: No picture to upload!');
			return EMPTY_STRING;
		}
		*/

		showInfo("Loading chosen input picture file onto IPFS (InterPlanetary File System)....");

		console.log('uploadPicture: There IS a picture to upload!');


		let fileBuffer = undefined;
		let errorObject = undefined;
		try {
			let fileContents = await readUploadedFileAsArrayBuffer($('#' + inputFileElementId)[0].files[0]);
			fileBuffer = Buffer.from(fileContents);
		}
		catch (error) {
			if (error.message === undefined) {
				errorObject = error;
			}
			else {
				errorObject = error.message;
			}
		}
		if (errorObject !== undefined) {
			throw errorObject;
		}
		if (fileBuffer === undefined) {
			throw "Unable to get the File Buffer for Input Picture file!";
		}

		console.log('fileBuffer =', fileBuffer);

		var ipfsFileAdd = PROMISIFY(cb => IPFS.add(fileBuffer, cb));
		var ipfsFileHash = undefined;
		errorObject = undefined;
		try {
			let fileInfo = await ipfsFileAdd;
			ipfsFileHash = fileInfo[0].hash;;
		} catch (error) {
			console.log('uploadPictureToIPFS ipfsFileAdd : error =', error);
			errorObject = error;
		}

		hideInfo();

		if (errorObject !== undefined) {
			throw errorObject;
		}
		if (ipfsFileHash === undefined) {
			throw "Unable to add the given Picture File to IPFS!";
		}

		console.log('ipfsFileHash =', ipfsFileHash);
		return ipfsFileHash;
	}

	async function addUpdateDescriptionOfYourselfAsSeller() {

	}

	async function addUpdateYourselfAsMediator() {
		makeSureMetamaskInstalled();

		let pictureIpfsHash = undefined;
		try {
			console.log('BEFORE Executing : uploadPictureToIPFS');
			pictureIpfsHash = await uploadPictureToIPFS("fileAddUpdateYourselfAsMediatorPicture");
			console.log('AFTER Executing : uploadPictureToIPFS');
		}
		catch (error) {
			showError(error);
			return;
		}

		console.log('addUpdateYourselfAsMediator : pictureIpfsHash =', pictureIpfsHash);

		let aName = $('#textAddUpdateYourselfAsMediatorName').val().trim();
		let aPhysicalAddress = $('#textareaAddUpdateYourselfAsMediatorPhysicalAddress').val().trim();
		let aMailingAddress = $('#textareaAddUpdateYourselfAsMediatorMailingAddress').val().trim();
		let aWebsite = $('#textAddUpdateYourselfAsMediatorWebsite').val().trim();
		let aEmail = $('#textAddUpdateYourselfAsMediatorEmail').val().trim();
		let aPhone = $('#textAddUpdateYourselfAsMediatorPhone').val().trim();
		let aFax = $('#textAddUpdateYourselfAsMediatorFax').val().trim();
		let aDescription = $('#textareaAddUpdateYourselfAsMediatorDescription').val().trim();

		let fileContentsJson = {
				name: aName,
				physicalAddress: aPhysicalAddress,
				mailingAddress: aMailingAddress,
				website: aWebsite,
				email: aEmail,
				phone: aPhone,
				fax: aFax,
				picture: pictureIpfsHash,
				description: aDescription
		}

		let fileContents = JSON.stringify(fileContentsJson);

		showInfo("Loading given input information about Mediator onto IPFS (InterPlanetary File System)....");

		var ipfsFileHash = undefined;
		errorObject = undefined;
		try {
			let fileBuffer = Buffer.from(fileContents);
			var ipfsFileAdd = PROMISIFY(cb => IPFS.add(fileBuffer, cb));

			let fileInfo = await ipfsFileAdd;
			ipfsFileHash = fileInfo[0].hash;;
		} catch (error) {
			console.log('addUpdateYourselfAsMediator ipfsFileAdd : error =', error);
			errorObject = error;
		}

		hideInfo();

		if (errorObject !== undefined) {
			showError(errorObject);
			return;
		}
		if (ipfsFileHash === undefined) {
			showError("Unable to add the information for the Mediator onto IPFS!");
			return;
		}

		console.log('addUpdateYourselfAsMediator : ipfsFileHash =', ipfsFileHash);
		// showInfo(`Successfully added/update Mediator Information! IPFS Hash = ${ipfsFileHash}`)

		let decentralizedMarketplaceMediationContract =
			web3.eth.contract(decentralizedMarketplaceMediationContractABI).at(decentralizedMarketplaceMediationContractAddress);

		decentralizedMarketplaceMediationContract.addOrUpdateMediator(ipfsFileHash, function (err, txHash) {
			hideInfo();

			if (err) {
				// return showError("Smart contract call failed: " + err);
				console.log('err =', err);
				return showError(`DecentralizedMarketplaceMediationContract.addOrUpdateMediator(${ipfsFileHash}) call failed:  + ${err.message}`);
			}

			showInfo(`Document ${ipfsFileHash} for Mediator ${currentMetamaskEthereumAddress} <b>successfully added</b> to Franklin Decentralized Marketplace. Transaction hash: ${txHash}`);
		});
	}

	function clearAddUpdateDescriptionOfYourselfAsSeller() {
		$('#textAddUpdateDescriptionOfYourselfAsSellerName').val('');
		$('#textareaAddUpdateDescriptionOfYourselfAsSellerPhysicalAddress').val('');
		$('#textareaAddUpdateDescriptionOfYourselfAsSellerMailingAddress').val('');
		$('#textAddUpdateDescriptionOfYourselfAsSellerWebsite').val('');
		$('#textAddUpdateDescriptionOfYourselfAsSellerEmail').val('');
		$('#textAddUpdateDescriptionOfYourselfAsSellerPhone').val('');
		$('#textAddUpdateDescriptionOfYourselfAsSellerFax').val('');
		$('#fileAddUpdateDescriptionOfYourselfAsSellerPicture').val('');
		$('#textareaAddUpdateDescriptionOfYourselfAsSellerDescription').val('');
	}

	function clearAddUpdateYourselfAsMediator() {
		$('#textAddUpdateYourselfAsMediatorName').val('');
		$('#textareaAddUpdateYourselfAsMediatorPhysicalAddress').val('');
		$('#textareaAddUpdateYourselfAsMediatorMailingAddress').val('');
		$('#textAddUpdateYourselfAsMediatorWebsite').val('');
		$('#textAddUpdateYourselfAsMediatorEmail').val('');
		$('#textAddUpdateYourselfAsMediatorPhone').val('');
		$('#textAddUpdateYourselfAsMediatorFax').val('');
		$('#fileAddUpdateYourselfAsMediatorPicture').val('');
		$('#textareaAddUpdateYourselfAsMediatorDescription').val('');
	}

	function clearCurrentSellersResults() {
		currentSellersArray = [ ];
		createViewSellersTable();
		$('#numberOfCurrentSellersViewCurrentSellersResults').val('');
	}

	function clearCurrentMediatorsResults() {
		currentMediatorsArray = [ ];
		createViewMediatorsTable();
		$('#numberOfCurrentMediatorsViewCurrentMediatorsResults').val('');
	}

	async function getCurrentSellers() {

	}

	async function getCurrentMediators() {
		makeSureMetamaskInstalled();

		showInfo("Getting Current Mediators in Franklin Decentralized Marketplace....");

		let decentralizedMarketplaceMediationContract =
			web3.eth.contract(decentralizedMarketplaceMediationContractABI).at(decentralizedMarketplaceMediationContractAddress);

		var getNumberOfMediators = PROMISIFY(cb => decentralizedMarketplaceMediationContract.numberOfMediators.call(cb));
		let numberOfMediatorsX = undefined;
		let numberOfMediatorsError = undefined;
		await getNumberOfMediators
			.then(function (response) {
				numberOfMediatorsX = response;
			})
			.catch(function (error) {
				// console.log('error =', error);
				numberOfMediatorsError = error;
  		});

  		if (numberOfMediatorsX === undefined) {
			hideInfo();
			return showError("Error encountered while calling the DecentralizedMarketplaceMediationContract.numberOfMediators method: " +
				numberOfMediatorsError);
		}

		console.log('numberOfMediatorsX =', numberOfMediatorsX);
		let numberOfMediators = numberOfMediatorsX.c[0];
		console.log('numberOfMediators =', numberOfMediators)

		$('#numberOfCurrentMediatorsViewCurrentMediatorsResults').val(numberOfMediators.toString(10));

		currentMediatorsArray = [ ];
		for (let i = 0; i < numberOfMediators; i++) {
			var getMediatorAddress = PROMISIFY(cb => decentralizedMarketplaceMediationContract.getMediatorAddress(i, cb));
			let mediatorAddress = undefined;
			let getMediatorAddressError = undefined;
			await getMediatorAddress
				.then(function (response) {
					mediatorAddress = response;
					console.log('getMediatorAddress : response =', response);
				})
				.catch(function (error) {
					console.log('getMediatorAddress : error =', error);
					getMediatorAddressError = error;
  			});

  			if (getMediatorAddressError !== undefined) {
				hideInfo();
				return showError("Error encountered while calling the DecentralizedMarketplaceMediationContract.getMediatorAddress method: " +
					getMediatorAddressError);
			}

			if (mediatorAddress === undefined) {
				hideInfo();
				return showError("Error encountered while calling the DecentralizedMarketplaceMediationContract.getMediatorAddress method!");
			}

			var getIpfsDescriptionInfoAboutMediator =
					PROMISIFY(cb => decentralizedMarketplaceMediationContract.descriptionInfoAboutMediators.call(mediatorAddress, cb));
			let ipfsHashDescOfMediator = undefined;
			let getIpfsDescriptionInfoAboutMediatorError = undefined;
			await getIpfsDescriptionInfoAboutMediator
				.then(function (response) {
					ipfsHashDescOfMediator = response;
					console.log('getIpfsDescriptionInfoAboutMediator : response =', response);
				})
				.catch(function (error) {
					console.log('getIpfsDescriptionInfoAboutMediator : error =', error);
					numberOfMediatorsError = error;
  			});

  			if (getIpfsDescriptionInfoAboutMediatorError !== undefined) {
				hideInfo();
				return showError("Error encountered while calling the DecentralizedMarketplaceMediationContract.descriptionInfoAboutMediators method: " +
					getMediatorAddressError);
			}

			if (ipfsHashDescOfMediator === undefined) {
				hideInfo();
				return showError("Error encountered while calling the DecentralizedMarketplaceMediationContract.descriptionInfoAboutMediators method!");
			}

			var ipfsFileGetForMediator = PROMISIFY(cb => IPFS.get(ipfsHashDescOfMediator, {timeout: '8000ms'}, cb));
			let ipfsFileGetForMediatorJson = undefined;
			let ipfsFileGetForMediatorError = undefined;
			await ipfsFileGetForMediator
				.then(function (response) {
					console.log('ipfsFileGetForMediator : response =', response);
					let ipfsFileGetForMediatorJsonString = response[0].content.toString();
					ipfsFileGetForMediatorJson = JSON.parse(ipfsFileGetForMediatorJsonString);
				})
				.catch(function (error) {
					console.log('ipfsFileGetForMediator : error =', error);
					ipfsFileGetForMediatorError = error;
  			});

  			if (ipfsFileGetForMediatorError !== undefined) {
				hideInfo();
				return showError(`Error encountered while calling IPFS.get(${ipfsHashDescOfMediator}) method: ${getMediatorAddressError}`);
			}

			if (ipfsFileGetForMediatorJson === undefined) {
				hideInfo();
				return showError(`Error encountered while calling IPFS.get(${ipfsHashDescOfMediator}) method!`);
			}

			console.log('ipfsFileGetForMediatorJson =', ipfsFileGetForMediatorJson);

			var getNumberOfMediationsMediatorInvolved =
					PROMISIFY(cb => decentralizedMarketplaceMediationContract.numberOfMediationsMediatorInvolved.call(mediatorAddress, cb));
			let numberOfMediationsMediatorInvolved = undefined;
			let getNumberOfMediationsMediatorInvolvedError = undefined;
			await getNumberOfMediationsMediatorInvolved
				.then(function (response) {
					console.log('getNumberOfMediationsMediatorInvolved : response =', response);
					let numberOfMediationsMediatorInvolved_X = response;
					numberOfMediationsMediatorInvolved = numberOfMediationsMediatorInvolved_X.c[0];
				})
				.catch(function (error) {
					console.log('getNumberOfMediationsMediatorInvolved : error =', error);
					getNumberOfMediationsMediatorInvolvedError = error;
  			});

  			if (getNumberOfMediationsMediatorInvolvedError !== undefined) {
				hideInfo();
				return showError(`Error encountered while calling ` +
					`DecentralizedMarketplaceMediationContract.numberOfMediationsMediatorInvolved(${mediatorAddress}) method: ` +
					`${getNumberOfMediationsMediatorInvolvedError}`);
			}

			if (ipfsFileGetForMediatorJson === undefined) {
				hideInfo();
				return showError(`Error encountered while calling DecentralizedMarketplaceMediationContract.numberOfMediationsMediatorInvolved(${mediatorAddress}) method!`);
			}

			console.log('numberOfMediationsMediatorInvolved =', numberOfMediationsMediatorInvolved);

			let mediatorRecord = {
					ethereumAddress: mediatorAddress,
					name: ipfsFileGetForMediatorJson.name,
					picture: ipfsFileGetForMediatorJson.picture,
					numberOfMediationsInvolved: BigInt(numberOfMediationsMediatorInvolved).toString()
			}

			currentMediatorsArray.push(mediatorRecord);
		}

		createViewMediatorsTable();

		hideInfo();
	}

	function createViewMediatorsTable() {
        var number_of_rows = currentMediatorsArray.length;
        var number_of_cols = 4;

        var table_body = '<table style="width:100%">';
        table_body += '<tr>';
		table_body += '<th>Ethereum Address</th>';
		table_body += '<th>Name</th>';
		table_body += '<th>Picture</th>';
		table_body += '<th>Number of Mediations Involved</th>';
  		table_body += '</tr>';

        for (var i = 0 ; i < number_of_rows; i++) {
			table_body += '<tr>';
            for (var j = 0; j < number_of_cols; j++) {
            	table_body += '<td>';

				let rowData = currentMediatorsArray[i];
                let table_data = '';
                if (j === 0) {
					table_data += rowData.ethereumAddress;
				}
				else if (j === 1) {
					table_data += rowData.name;
				}
				else if (j === 2) {
					// table_data += rowData.picture;
					if (rowData.picture === EMPTY_STRING) {
						table_data += '';
					}
					else {
						table_data += `<img src="https://ipfs.infura.io/ipfs/${rowData.picture}" alt="${rowData.picture}" width="40" height="40"/>`;
					}
				}
				else if (j === 3) {
					table_data += rowData.numberOfMediationsInvolved;
				}

                table_body += table_data;
                table_body += '</td>';
             }

             table_body += '</tr>';
        }

        table_body += '</table>';
        $('#currentMediatorsViewTableResultsDiv').html(table_body);
	}

	function createViewSellersTable() {
        var number_of_rows = currentSellersArray.length;
        var number_of_cols = 4;

        var table_body = '<table style="width:100%">';
        table_body += '<tr>';
		table_body += '<th>Ethereum Address</th>';
		table_body += '<th>Name</th>';
		table_body += '<th>Picture</th>';
		table_body += '<th>Number of Different Items Sold</th>';
  		table_body += '</tr>';

        for (var i = 0 ; i < number_of_rows; i++) {
			table_body += '<tr>';
            for (var j = 0; j < number_of_cols; j++) {
            	table_body += '<td>';

				let rowData = currentMediatorsArray[i];
                let table_data = '';
                if (j === 0) {
					table_data += rowData.ethereumAddress;
				}
				else if (j === 1) {
					table_data += rowData.name;
				}
				else if (j === 2) {
					// table_data += rowData.picture;
					if (rowData.picture === EMPTY_STRING) {
						table_data += '';
					}
					else {
						table_data += `<img src="https://ipfs.infura.io/ipfs/${rowData.picture}" alt="${rowData.picture}" width="40" height="40"/>`;
					}
				}
				else if (j === 3) {
					table_data += rowData.numberOfDifferentItemsSold;
				}

                table_body += table_data;
                table_body += '</td>';
             }

             table_body += '</tr>';
        }

        table_body += '</table>';
        $('#currentSellersViewTableResultsDiv').html(table_body);
	}

	// Reference --> https://www.reddit.com/r/ethdev/comments/8dyfyr/how_to_make_metamask_accept_promiseswait_for
	async function getBalanceInWei() {
		var getBalanceInWei = PROMISIFY(cb => web3.eth.getBalance(currentMetamaskEthereumAddress, cb));
		var localBalanceWei = undefined;

		try {
			localBalanceWei = await getBalanceInWei;
			// balance = web3.fromWei(await wei, 'ether')
			// document.getElementById("output").innerHTML = balance + " ETH";
		} catch (error) {
			// document.getElementById("output").innerHTML = error;
			console.log('getBalance : error =', error);
			return error;
		}

		console.log('localBalanceWei =', localBalanceWei);
		let balanceInWei = localBalanceWei.c[0] * WEB3_GET_BALANCE_MULTIPLIER;
		// console.log('balanceInWei =', balanceInWei);
		return balanceInWei;
	}

	function showView(viewName) {
		// Hide all views and show the selected view only
		$('main > section').hide();
		$('#' + viewName).show();
	}

	function showInfo(message) {
		$('#infoBox>p').html(message);
		$('#infoBox').show();
		$('#infoBox>header').click(function () {
			$('#infoBox').hide();
		});
	}

    function hideInfo() {
		$('#infoBox').hide();
	}

	function showError(errorMsg) {
		$('#errorBox>p').html("Error: " + errorMsg);
		$('#errorBox').show();
		$('#errorBox>header').click(function () {
			$('#errorBox').hide();
		});
	}

});