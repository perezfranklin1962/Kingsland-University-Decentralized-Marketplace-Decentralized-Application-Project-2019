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

  	// Amount of Wei in 1 ETH
  	const ETH = 10**18; // Wei

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

	console.log('currentMetamaskEthereumAddress =', currentMetamaskEthereumAddress);

	// Used to keep track of the Current Mediators
	var currentMediatorsArray = [ ];

	// Used to keep track of the Current Sellers
	var currentSellersArray = [ ];

	// Used to keep track of the current items being sold by a given Seller
	var currentItemsBeingSoldByGivenSellerArray = [ ];

	// Used to keep track of the Mediated Sales Transactions an Ethereum Address is involved as a Buyer, Seller, or Mediator
	var currentMediatedSalesTransactionsGivenEthereumAddressInvolvedArray = [ ];

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

	$('#linkItems').click(function () {
		console.log('linkItems clicked');
		createCurrentItemsBeingSoldByGivenSellerTable();
	    showView("viewItems");
    });

	$('#linkMediators').click(function () {
		console.log('linkMediators clicked');
		createViewMediatorsTable();
	    showView("viewMediators");
    });

	$('#linkPurchases').click(function () {
		console.log('linkPurchases clicked');
		createMediatedSalesTransactionsGivenEthereumAddressInvolvedTable();
	    showView("viewPurchases");
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
    $('#buttonSetMiscellanousSettingsOfYourselfAsSeller').click(setMiscellanousSettingsOfYourselfAsSeller);
    $('#buttonClearAddUpdateDescriptionOfYourselfAsSeller').click(clearAddUpdateDescriptionOfYourselfAsSeller);
    $('#buttonAddUpdateDescriptionOfYourselfAsSeller').click(addUpdateDescriptionOfYourselfAsSeller);
    $('#buttonRemoveYourselfAsSeller').click(removeYourselfAsSeller);
    $('#buttonViewDetailedInformationAboutSeller').click(viewDetailedInformationAboutSeller);
    $('#buttonClearViewDetailedInformationAboutSeller').click(clearViewDetailedInformationAboutSeller);

    $('#buttonViewCurrentItemsBeingSoldByCurrentSeller').click(getCurrentItemsBeingSoldBySeller);
    $('#buttonClearViewCurrentItemsBeingSoldByCurrentSeller').click(clearCurrentItemsBeingSoldBySeller);
    $('#buttonViewDetailedInformationAboutItemBeingSoldBySeller').click(viewDetailedInformationAboutItemBeingSoldBySeller);
    $('#buttonClearViewDetailedInformationAboutItemBeingSoldBySeller').click(clearViewDetailedInformationAboutItemBeingSoldBySeller);
    $('#buttonAddItemForSale').click(addItemForSale);
    $('#buttonRemoveItemForSale').click(removeItemForSale);
    $('#buttonClearAddItemForSale').click(clearAddItemForSale);
	$('#buttonMiscellaneousSettingsOfAnItemYouAreSelling').click(setMiscellaneousSettingsOfAnItemYouAreSelling);
	$('#buttonClearSetMiscellaneousSettingsOfAnItemYouAreSelling').click(clearSetMiscellaneousSettingsOfAnItemYouAreSelling);

	$('#buttonPurchaseItemForSale').click(purchaseItemForSale);
	$('#buttonClearPurchaseItemForSale').click(clearPurchaseItemForSale);
	$('#buttonViewMediatedSalesTransactionsEthereumAddressIsInvolved').click(viewMediatedSalesTransactionsEthereumAddressIsInvolved);
	$('#buttonClearViewMediatedSalesTransactionsEthereumAddressIsInvolved').click(clearViewMediatedSalesTransactionsEthereumAddressIsInvolved);
	$('#buttonViewDetailedInformationAboutSpecificMediatedSalesTransaction').click(viewDetailedInformationAboutSpecificMediatedSalesTransaction);
	$('#buttonClearViewDetailedInformationAboutSpecificMediatedSalesTransaction').click(clearViewDetailedInformationAboutSpecificMediatedSalesTransaction);

	// Attach AJAX "loading" event listener
	$(document).on({
		ajaxStart: function () {
			$("#loadingBox").show()
		},
		ajaxStop: function () {
			$("#loadingBox").hide()
		}
	});

	function convertMetamask_X_Value_to_IntegerString(metamask_X_value) {
		let numberOfDigits = metamask_X_value.e + 1;
		let numberStr = '';
		for (let i = 0; i < metamask_X_value.c.length; i++) {
			numberStr += metamask_X_value.c[i].toString();
		}

		numberStr = numberStr.padEnd(numberOfDigits, '0');
		return numberStr;
	}

	function covertWEI_StringValue_to_ETH_StringValue(weiStringValue) {
		let ethStringValue = '';

		// console.log('covertWEI_StringValue_to_ETH_StringValue : weiStringValue =', weiStringValue);
		// console.log('covertWEI_StringValue_to_ETH_StringValue : weiStringValue.length =', weiStringValue.length);

		if (weiStringValue.length < 18) {
			ethStringValue = weiStringValue.padStart(18, '0');
			ethStringValue = '0.' + ethStringValue;
		}
		else if (weiStringValue.length === 18) {
			ethStringValue = '0.' + weiStringValue;
		}
		else { // weiStringValue.length > 18
			let dotIndex = weiStringValue.length - 18;
			ethStringValue = weiStringValue.substring(0, dotIndex) + '.' + weiStringValue.substring(dotIndex);
		}

		let lastNonZeroIndex = ethStringValue.length - 1;
		for (let index = lastNonZeroIndex; index >= 0; index--) {
			if (ethStringValue[index] !== '0') {
				lastNonZeroIndex = index;
				break;
			}
		}

		ethStringValue = ethStringValue.substring(0, lastNonZeroIndex + 1);
		if (ethStringValue[lastNonZeroIndex] === '.') {
			ethStringValue = ethStringValue.substring(0, lastNonZeroIndex);
		}

		return ethStringValue;
	}

	function convertNumberToString(aNumber) {
		if (typeof aNumber === 'bigint') {
			return aNumber.toString();
		}

		// If able to convert to BigInt, then...
		try {
			return BigInt(aNumber).toString();
		}
		catch (error) { }

		if (typeof aNumber === 'number') {
			console.log('   This is a number!');
			// Remove unnecessary and unused '0' digits after decimal point. So, "1234.0000345000" get converted to
			// "1234.0000345".
			// Reference ---> https://stackoverflow.com/questions/1015402/chop-unused-decimals-with-javascript
			// Does not work when "aNumber" is 1e-18 !!! Go figure!!!
			// return parseFloat(aNumber.toFixed(18)).toString(); // 10 to the negative 18 in ETH is one WEI, which is smallest unit!
			let decimalNumberStr = aNumber.toFixed(18);
			let lastNonZeroIndex = decimalNumberStr.length - 1;
			for (let index = lastNonZeroIndex; index >= 0; index--) {
				if (decimalNumberStr[index] !== '0') {
					lastNonZeroIndex = index;
					break;
				}
			}

			return decimalNumberStr.substring(0, lastNonZeroIndex + 1);
		}

		return aNumber.toString();
	}

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
			$('#viewItemsYourCurrentMetamaskEthereumAddress').val('');
			$('#viewPurchasesYourCurrentMetamaskEthereumAddress').val('');

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
			$('#viewItemsYourCurrentMetamaskEthereumAddress').val(currentMetamaskEthereumAddress);
			$('#viewPurchasesYourCurrentMetamaskEthereumAddress').val(currentMetamaskEthereumAddress);
		}
	}

	function clearViewDetailedInformationAboutSeller() {
		$('#textViewDetailedInformationAboutSellerEthereumAddress').val('');
		$('#textViewDetailedInformationAboutSellerName').val('');
		$('#textViewDetailedInformationAboutSellerNumberOfDifferentItemsBeingSold').val('');
		$('#textViewDetailedInformationAboutSellerWillingToSellItemsViaMediator').val('');
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

	function clearAddItemForSale() {
		$('#textAddItemForSaleName').val('');
		$('#textareaAddItemForSaleCategories').val('');
		$('#textareaAddItemForSaleDescription').val('');

		$('#fileAddItemForSaleMainPicture').val('');

		for (let i = 1; i <= 10; i++) {
			$(`#fileAddItemForSaleOtherPicture_${i}`).val('');
		}
	}

	function clearSetMiscellaneousSettingsOfAnItemYouAreSelling() {
		$('#textSetMiscellaneousSettingsOfAnItemYouAreSellingItemIpfsId').val('');
		$('#textSetMiscellaneousSettingsOfAnItemYouAreSellingItemUnitPrice').val('');
		$('#textSetMiscellaneousSettingsOfAnItemYouAreSellingQuantityAvailableForSale').val('');

		$('#checkboxSetMiscellaneousSettingsOfAnItemYouAreSellingSettingUnitPrice')[0].checked = false;
		$('#checkboxSetMiscellaneousSettingsOfAnItemYouAreSellingSettingQuantity')[0].checked = false;
	}

	function clearPurchaseItemForSale() {
		$('#textPurchaseItemForSaleSellerEthereumAddress').val('');
		$('#textPurchaseItemForSaleItemIpfsId').val('');
		$('#textPurchaseItemForSaleItemQuantityBeingPurchased').val('');
		$('#textPurchaseItemForSaleMediatorEthereumAddress').val('');
		$('#textareaPurchaseItemForSaleFromSellerResults').val('');
	}

	async function removeItemForSale() {
		let itemIpfsHashId = $('#textRemoveItemForSaleItemIpfsId').val().trim();
		if (itemIpfsHashId.length === 0) {
			showError('The Item IPFS ID identifying an Item cannot be an empty string or consist only of white space. Please enter an ' +
				'Item IPFS ID value that has no spaces and is not an empty string.');
			return;
		}

		makeSureMetamaskInstalled();

		showInfo(`Removing Item IPFS ID ${itemIpfsHashId} that you are currently Selling under Current Metamask Ethereum Public Address ${currentMetamaskEthereumAddress} ....`);

		let decentralizedMarketplaceContract =
			web3.eth.contract(decentralizedMarketplaceContractABI).at(decentralizedMarketplaceContractAddress);

		var sellerExists =
				PROMISIFY(cb => decentralizedMarketplaceContract.sellerExists.call(currentMetamaskEthereumAddress, cb));
		let sellerExistsFlag = undefined;
		let sellerExistsError = undefined;
		await sellerExists
			.then(function (response) {
				console.log('sellerExists : response =', response);
				sellerExistsFlag = response;
			})
			.catch(function (error) {
				console.log('sellerExists : error =', error);
				sellerExistsError = error;
  		});

  		if (sellerExistsError !== undefined) {
			hideInfo();
			return showError("Error encountered while calling the DecentralizedMarketplaceContract.sellerExists method: " +
				sellerExistsError);
		}

		if (sellerExistsFlag === undefined) {
			hideInfo();
			return showError("Error encountered while calling the DecentralizedMarketplaceContract.sellerExists method!");
		}

		console.log('sellerExistsFlag =', sellerExistsFlag);
		if (!sellerExistsFlag) {
			hideInfo();
			return showError(`Your current Metamask Ethereum Public Address ${currentMetamaskEthereumAddress} is not listed as a Seller in the Franklin Decentralized Marketplace!`);
		}

		let ethereumPublicAddress = currentMetamaskEthereumAddress;
		var itemForSaleFromSellerExists = PROMISIFY(cb => decentralizedMarketplaceContract.itemForSaleFromSellerExists(ethereumPublicAddress, itemIpfsHashId, cb));
		let itemForSaleFromSellerExistsFlag = undefined;
		let itemForSaleFromSellerExistsError = undefined;
		await itemForSaleFromSellerExists
			.then(function (response) {
				console.log('itemForSaleFromSellerExists : response =', response);
				itemForSaleFromSellerExistsFlag = response;
			})
			.catch(function (error) {
				console.log('itemForSaleFromSellerExists : error =', error);
				itemForSaleFromSellerExistsError = error;
  		});

  		if (itemForSaleFromSellerExistsError !== undefined) {
			hideInfo();
			return showError("Error encountered while calling the DecentralizedMarketplaceContract.itemForSaleFromSellerExists method: " +
				itemForSaleFromSellerExistsError);
		}

		if (itemForSaleFromSellerExistsFlag === undefined) {
			hideInfo();
			return showError("Error encountered while calling the DecentralizedMarketplaceContract.itemForSaleFromSellerExists method!");
		}

		console.log('itemForSaleFromSellerExistsFlag =', itemForSaleFromSellerExistsFlag);
		if (!itemForSaleFromSellerExistsFlag) {
			hideInfo();
			return showError(`No such Item IPFS ID "${itemIpfsHashId}" is sold by Seller Ethereum Public Address ${ethereumPublicAddress} in the Franklin Decentralized Marketplace!`);
		}

		decentralizedMarketplaceContract.removeItemForSale(itemIpfsHashId, function (err, txHash) {
			hideInfo();

			if (err) {
				// return showError("Smart contract call failed: " + err);
				console.log('err =', err);
				return showError(`DecentralizedMarketplaceMediationContract.removeItemForSale(${itemIpfsHashId}) call failed:  + ${err.message}`);
			}

			showInfo(`Item IPFS ID ${itemIpfsHashId} for Seller Ethereum Address ${currentMetamaskEthereumAddress} <b>successfully removed</b> from list of Items to Sell ` +
				`in the Franklin Decentralized Marketplace. Transaction hash: ${txHash}`);
		});
	}

	async function purchaseItemForSale() {
		$('#textareaPurchaseItemForSaleFromSellerResults').val('');

		let sellerEthereumAddress = $('#textPurchaseItemForSaleSellerEthereumAddress').val().trim().toLowerCase();
		if (sellerEthereumAddress.length === 0) {
			showError('The Seller Ethereum Public Address cannot be an empty string or consist only of white space. Please enter a ' +
				'Seller Ethereum Public Address value that is a 40-hex lowercase string.');
			return;
		}

		if (sellerEthereumAddress.startsWith("0x")) {
			if (sellerEthereumAddress.length > 2) {
				sellerEthereumAddress = sellerEthereumAddress.substring(2);
			}
		}

		if (!isValidPublicAddress(sellerEthereumAddress)) {
			showError("Entered Seller Ethereum Public Address is not a 40-hex valued lower case string. " +
				"Please enter a Seller Ethereum Public Address that is a 40-hex valued lower case string.");
			return;
		}

		sellerEthereumAddress = "0x" + sellerEthereumAddress;

		if (currentMetamaskEthereumAddress === sellerEthereumAddress) {
			showError(`You cannot act as both a Buyer and Seller in a Sales Transaction! Entered Seller Ethereum Public Address ${sellerEthereumAddress} is the same as Buyer Ethereum ` +
				`Public Address ${currentMetamaskEthereumAddress} !`);
			return;
		}

		let itemIpfsHashId = $('#textPurchaseItemForSaleItemIpfsId').val().trim();
		if (itemIpfsHashId.length === 0) {
			showError('The Item IPFS ID identifying an Item cannot be an empty string or consist only of white space. Please enter an ' +
				'Item IPFS ID value that has no spaces and is not an empty string.');
			return;
		}

		let quantityBeingPurchasedStr = $('#textPurchaseItemForSaleItemQuantityBeingPurchased').val().trim();
		let quantityBeingPurchased_BigInt = undefined;
		if (quantityBeingPurchasedStr === EMPTY_STRING) {
			showError('The Quantity Being Purchased cannot be an empty string or consist only of white space. Please enter a ' +
				'Quantity Being Purchased that is a positive integer value greater than or equal to one!');
			return;
		}

		if (!isNumeric(quantityBeingPurchasedStr)) {
			showError('The Quantity Being Purchased that you set is not a positive integer greater than or equal ' +
				'to one. Please enter a Quantity Being Purchased that is a positive integer greater than or equal to one!');
			return;
		}

		quantityBeingPurchased_BigInt = BigInt(quantityBeingPurchasedStr);
		if (quantityBeingPurchased_BigInt < BigInt(1)) {
			showError('The Quantity Being Purchased that you set is zero. You cannot make a purchase where the number of Items being purchased is zero. Please enter a ' +
				'Quantity Being Purchased that is a positive integer greater than or equal to one!');
			return;
		}

		let largestUint256 = 2**256 - 1;
		let largestUint256_BigInt = BigInt(largestUint256);

		if (quantityBeingPurchased_BigInt > largestUint256_BigInt) {
			showError(`The Quantity Being Purchased that you entered has a ${quantityBeingPurchased_BigInt.toString()} integer value that is greater than the ` +
				`${largestUint256_BigInt} maximum integer value that an Ethereum Smart Contract can handle!`);
			return;
		}

		let mediatorEthereumAddress = $('#textPurchaseItemForSaleMediatorEthereumAddress').val().trim().toLowerCase();

		if (mediatorEthereumAddress === EMPTY_STRING) {
			showInfo(`Buyer Ethereum Address ${currentMetamaskEthereumAddress} is in the process of purchasing Item IPFS ID ${itemIpfsHashId} from Seller Ethereum Address ` +
				`${sellerEthereumAddress} ....`);
		}
		else {
			if (mediatorEthereumAddress.startsWith("0x")) {
				if (mediatorEthereumAddress.length > 2) {
					mediatorEthereumAddress = mediatorEthereumAddress.substring(2);
				}
			}

			if (!isValidPublicAddress(mediatorEthereumAddress)) {
				showError("Entered Mediator Ethereum Public Address is not a 40-hex valued lower case string. " +
					"Please enter a Mediator Ethereum Public Address that is a 40-hex valued lower case string if you wish to make a Mediated Sales Transaction.");
				return;
			}

			mediatorEthereumAddress = "0x" + mediatorEthereumAddress;

			if (mediatorEthereumAddress === currentMetamaskEthereumAddress) {
				showError(`You cannot act as both a Buyer and Mediator in a Sales Transaction! Entered Mediator Ethereum Public Address ${mediatorEthereumAddress} is the same as ` +
					`Buyer Ethereum Public Address ${currentMetamaskEthereumAddress} !`);
				return;
			}

			if (mediatorEthereumAddress === sellerEthereumAddress) {
				showError(`The Seller and Mediator in a Sales Transaction must be different! Entered Mediator Ethereum Public Address ${mediatorEthereumAddress} is the same as ` +
					`Seller Ethereum Public Address ${sellerEthereumAddress} !`);
					return;
			}

			showInfo(`Buyer Ethereum Address ${currentMetamaskEthereumAddress} is in the process of purchasing Item IPFS ID ${itemIpfsHashId} from Seller Ethereum Address ` +
				`${sellerEthereumAddress} via Mediator Ethereum Address ${mediatorEthereumAddress} as part of a Mediated Sales Transaction ....`);
		}

		let decentralizedMarketplaceContract =
			web3.eth.contract(decentralizedMarketplaceContractABI).at(decentralizedMarketplaceContractAddress);

		var sellerExists =
				PROMISIFY(cb => decentralizedMarketplaceContract.sellerExists.call(sellerEthereumAddress, cb));
		let sellerExistsFlag = undefined;
		let sellerExistsError = undefined;
		await sellerExists
			.then(function (response) {
				console.log('sellerExists : response =', response);
				sellerExistsFlag = response;
			})
			.catch(function (error) {
				console.log('sellerExists : error =', error);
				sellerExistsError = error;
  		});

  		if (sellerExistsError !== undefined) {
			hideInfo();
			return showError("Error encountered while calling the DecentralizedMarketplaceContract.sellerExists method: " +
				sellerExistsError);
		}

		if (sellerExistsFlag === undefined) {
			hideInfo();
			return showError("Error encountered while calling the DecentralizedMarketplaceContract.sellerExists method!");
		}

		console.log('sellerExistsFlag =', sellerExistsFlag);
		if (!sellerExistsFlag) {
			hideInfo();
			return showError(`The Seller Ethereum Public Address ${sellerEthereumAddress} is not listed as a Seller in the Franklin Decentralized Marketplace!`);
		}

		var itemForSaleFromSellerExists = PROMISIFY(cb => decentralizedMarketplaceContract.itemForSaleFromSellerExists(sellerEthereumAddress, itemIpfsHashId, cb));
		let itemForSaleFromSellerExistsFlag = undefined;
		let itemForSaleFromSellerExistsError = undefined;
		await itemForSaleFromSellerExists
			.then(function (response) {
				console.log('itemForSaleFromSellerExists : response =', response);
				itemForSaleFromSellerExistsFlag = response;
			})
			.catch(function (error) {
				console.log('itemForSaleFromSellerExists : error =', error);
				itemForSaleFromSellerExistsError = error;
  		});

  		if (itemForSaleFromSellerExistsError !== undefined) {
			hideInfo();
			return showError("Error encountered while calling the DecentralizedMarketplaceContract.itemForSaleFromSellerExists method: " +
				itemForSaleFromSellerExistsError);
		}

		if (itemForSaleFromSellerExistsFlag === undefined) {
			hideInfo();
			return showError("Error encountered while calling the DecentralizedMarketplaceContract.itemForSaleFromSellerExists method!");
		}

		console.log('itemForSaleFromSellerExistsFlag =', itemForSaleFromSellerExistsFlag);
		if (!itemForSaleFromSellerExistsFlag) {
			hideInfo();
			return showError(`No such Item IPFS ID "${itemIpfsHashId}" is sold by Seller Ethereum Public Address ${sellerEthereumAddress} in the Franklin Decentralized Marketplace!`);
		}

		var getPriceOfItem = PROMISIFY(cb => decentralizedMarketplaceContract.getPriceOfItem(sellerEthereumAddress, itemIpfsHashId, cb));
		let priceOfItemInWei = undefined;
		let getPriceOfItemError = undefined;
		await getPriceOfItem
			.then(function (response) {
				console.log('getPriceOfItem : response =', response);
				priceOfItemInWei_X = response;
				// let priceOfItemInWei = priceOfItemInWei_X.c[0];
				priceOfItemInWei = convertMetamask_X_Value_to_IntegerString(priceOfItemInWei_X);
			})
			.catch(function (error) {
				console.log('getPriceOfItem : error =', error);
				getPriceOfItemError = error;
		});

		if (getPriceOfItemError !== undefined) {
			hideInfo();
			return showError(`Error encountered while calling ` +
				`DecentralizedMarketplaceContract.getPriceOfItem(${sellerEthereumAddress}, ${itemIpfsHashId}) method: ` +
				`${getPriceOfItemError}`);
		}

		if (priceOfItemInWei === undefined) {
			hideInfo();
			return showError(`Error encountered while calling DecentralizedMarketplaceContract.getPriceOfItem(${sellerEthereumAddress}, ${itemIpfsHashId}) method!`);
		}

		console.log('priceOfItemInWei =', priceOfItemInWei);

		let priceOfItemInWei_BigInt = BigInt(priceOfItemInWei);
		if (priceOfItemInWei_BigInt === BigInt(0)) {
			hideInfo();
			return showError(`The Price of Item IPFS ID ${itemIpfsHashId} sold by Seller Ethereum Public Address ${sellerEthereumAddress} is Zero ETH! ` +
				`Cannot purchase an Item with a price of Zero ETH! The Seller has not set a price yet for the Item. Please contact the Seller directly and ask Seller ` +
				`to set a non-zero price!`);
		}

		var getQuantityAvailableForSaleOfAnItemBySeller =
				PROMISIFY(cb => decentralizedMarketplaceContract.getQuantityAvailableForSaleOfAnItemBySeller(sellerEthereumAddress, itemIpfsHashId, cb));
		let quantityAvailableForSaleOfItem_BigInt = undefined;
		let getQuantityAvailableForSaleOfAnItemBySellerError = undefined;
		await getQuantityAvailableForSaleOfAnItemBySeller
			.then(function (response) {
				console.log('getQuantityAvailableForSaleOfAnItemBySeller : response =', response);
				let quantityAvailableForSaleOfItem_X = response;
				let quantityAvailableForSaleOfItem = convertMetamask_X_Value_to_IntegerString(quantityAvailableForSaleOfItem_X);
				quantityAvailableForSaleOfItem_BigInt = BigInt(quantityAvailableForSaleOfItem);
			})
			.catch(function (error) {
				console.log('getQuantityAvailableForSaleOfAnItemBySeller : error =', error);
				getQuantityAvailableForSaleOfAnItemBySellerError = error;
		});

		if (getQuantityAvailableForSaleOfAnItemBySellerError !== undefined) {
			hideInfo();
			return showError(`Error encountered while calling ` +
				`DecentralizedMarketplaceContract.getQuantityAvailableForSaleOfAnItemBySeller(${sellerEthereumAddress}, ${itemIpfsHashId}) method: ` +
				`${getQuantityAvailableForSaleOfAnItemBySellerError}`);
		}

		if (quantityAvailableForSaleOfItem_BigInt === undefined) {
			hideInfo();
			return showError(`Error encountered while calling DecentralizedMarketplaceContract.getQuantityAvailableForSaleOfAnItemBySelle(${sellerEthereumAddress}, ${itemIpfsHashId}) ` +
				`method!`);
		}

		console.log('quantityAvailableForSaleOfItem_BigInt.toString() =', quantityAvailableForSaleOfItem_BigInt.toString());

		if (quantityAvailableForSaleOfItem_BigInt === BigInt(0)) {
			hideInfo();
			return showError(`Cannot purchase Item IPFS ID ${itemIpfsHashId} from Seller Ethereum Public Address ${sellerEthereumAddress} due to the Seller having no such ` +
				`Item in stock!`);
		}

		if (quantityBeingPurchased_BigInt > quantityAvailableForSaleOfItem_BigInt) {
			hideInfo();
			return showError(`Not enough of the requested Item in stock! Cannot purchase Item IPFS ID ${itemIpfsHashId} from Seller Ethereum Public ` +
				`Address ${sellerEthereumAddress} due to you requesting ${quantityBeingPurchased_BigInt.toString()} to purchase, but the Seller has only ` +
				`${quantityAvailableForSaleOfItem_BigInt.toString()} of the Item in stock!` );
		}

		var getBalanceInWei = PROMISIFY(cb => web3.eth.getBalance(currentMetamaskEthereumAddress, cb));
		let balanceInWei_BigInt = undefined;
		let getBalanceInWeiError = undefined;
		await getBalanceInWei
			.then(function (response) {
				console.log('getBalanceInWei : response =', response);
				let balanceInWei_X = response;
				let balanceInWeiStr = convertMetamask_X_Value_to_IntegerString(balanceInWei_X);
				balanceInWei_BigInt = BigInt(balanceInWeiStr);
			})
			.catch(function (error) {
				console.log('getBalanceInWei : error =', error);
				getBalanceInWeiError = error;
		});

		if (getBalanceInWeiError !== undefined) {
			hideInfo();
			return showError(`Error encountered while calling web3.eth.getBalance(${currentMetamaskEthereumAddress}) method: ` +
				`${getBalanceInWeiError}`);
		}

		if (balanceInWei_BigInt === undefined) {
			hideInfo();
			return showError(`Error encountered while calling web3.eth.getBalance(${currentMetamaskEthereumAddress}) method!`);
		}

		console.log('balanceInWei_BigInt.toString() =', balanceInWei_BigInt.toString());

		let totalAmountOfPurchaseInWei_BigInt = quantityBeingPurchased_BigInt * priceOfItemInWei_BigInt;
		if (balanceInWei_BigInt < totalAmountOfPurchaseInWei_BigInt) {
			hideInfo();
			return showError(`Not enough of a Balance to Purchase the requested Number of Items! Buyer Ethereum Public Address ${currentMetamaskEthereumAddress} ` +
				` has a balance of ${covertWEI_StringValue_to_ETH_StringValue(balanceInWei_BigInt.toString())} ETH, but the amount needed to make the purchase is ` +
				`${covertWEI_StringValue_to_ETH_StringValue(totalAmountOfPurchaseInWei_BigInt.toString())} ETH!`);
		}

		if (mediatorEthereumAddress === EMPTY_STRING) {
			decentralizedMarketplaceContract.purchaseItemWithoutMediator(sellerEthereumAddress, itemIpfsHashId, quantityBeingPurchased_BigInt,
					{ value: totalAmountOfPurchaseInWei_BigInt }, function (err, txHash) {
				hideInfo();

				if (err) {
					// return showError("Smart contract call failed: " + err);
					console.log('purchaseItemWithoutMediator : err =', err);
					return showError(`DecentralizedMarketplaceContract.purchaseItemWithoutMediator(${sellerEthereumAddress}, ${itemIpfsHashId}, ${quantityBeingPurchased_BigInt.toString()} ` +
						`call failed:  + ${err.message}`);
				}

				let textAreaOutput = `Successful purchase made on Ethereum Blockchain WITHOUT Mediator...` + '\n\n' +
					`Buyer Ethereum Address: ${currentMetamaskEthereumAddress}` + '\n' +
					`Seller Ethereum Address: ${sellerEthereumAddress}` + '\n' +
					`Item IPFS ID Purchased: ${itemIpfsHashId}` + '\n' +
					`Quantity of the Item Purchased: ${quantityBeingPurchased_BigInt.toString()}` + '\n' +
					`Total Purchase Amount (in ETH): ${covertWEI_StringValue_to_ETH_StringValue(totalAmountOfPurchaseInWei_BigInt.toString())}` + '\n' +
					`Transaction Hash ID on Ethereum Blockchain: ${txHash}`;
				$('#textareaPurchaseItemForSaleFromSellerResults').val(textAreaOutput);


				showInfo(`Item IPFS ID ${itemIpfsHashId} from Seller Ethereum Address ${sellerEthereumAddress} with quantity ${quantityBeingPurchased_BigInt.toString()} ` +
					`<b>successfully purchased</b> by Buyer Ethereum Address ${currentMetamaskEthereumAddress} in the Franklin Decentralized Marketplace. Transaction hash: ${txHash}`);
			});
		}
		else {
			let decentralizedMarketplaceMediationContract =
				web3.eth.contract(decentralizedMarketplaceMediationContractABI).at(decentralizedMarketplaceMediationContractAddress);

			var mediatorExists =
					PROMISIFY(cb => decentralizedMarketplaceMediationContract.mediatorExists.call(mediatorEthereumAddress, cb));
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
				return showError(`The entered Mediator Ethereum Public Address ${mediatorEthereumAddress} is not listed as a Mediator in the Franklin Decentralized Marketplace!`);
			}

			hideInfo();
			showInfo('Loading information about the Mediated Sales Transaction onto IPFS (InterPlanetary File System).... ' +
				`Buyer Ethereum Address ${currentMetamaskEthereumAddress} is in the process of purchasing Item IPFS ID ${itemIpfsHashId} from Seller Ethereum Address ` +
				`${sellerEthereumAddress} via Mediator Ethereum Address ${mediatorEthereumAddress} as part of a Mediated Sales Transaction ....`);


			let currentDateTime = new Date();
			let randomBigInt = BigInt(Math.ceil(Math.random() * 10**20));
			let mediatedSalesTransactionFileContentsJson = {
					typeOfSalesTransaction: 'Mediated Sales Transaction',
					buyerEthereumAddress: currentMetamaskEthereumAddress,
					sellerEthereumAddress: sellerEthereumAddress,
					mediatorEthereumAddress: mediatorEthereumAddress,
					itemIpfsHashIdInPurchase: itemIpfsHashId,
					quantityOfItemPurchased: quantityBeingPurchased_BigInt.toString(),
					totalPurchaseAmountInETH: covertWEI_StringValue_to_ETH_StringValue(totalAmountOfPurchaseInWei_BigInt.toString()),
					dateTimestampOfCreation: currentDateTime.toISOString(),
					randomUnsignedInteger: randomBigInt.toString()
			}

			console.log('purchaseItemForSale : mediatedSalesTransactionFileContentsJson =', mediatedSalesTransactionFileContentsJson);
			let mediatedSalesTransactionFileContentsJsonString = JSON.stringify(mediatedSalesTransactionFileContentsJson);
			console.log('purchaseItemForSale : mediatedSalesTransactionFileContentsJsonString =', mediatedSalesTransactionFileContentsJsonString);

			let mediatedSalesTransactionIpfsHash = undefined;
			let errorObject = undefined;
			try {
				let fileBuffer = Buffer.from(mediatedSalesTransactionFileContentsJsonString);
				var ipfsFileAdd = PROMISIFY(cb => IPFS.add(fileBuffer, cb));

				let fileInfo = await ipfsFileAdd;
				mediatedSalesTransactionIpfsHash = fileInfo[0].hash;;
			} catch (error) {
				console.log('purchaseItemForSale ipfsFileAdd : error =', error);
				errorObject = error;
			}

			if (errorObject !== undefined) {
				hideInfo();
				showError(errorObject);
				return;
			}

			if (mediatedSalesTransactionIpfsHash === undefined) {
				hideInfo();
				showError("Unable to add the information for the Mediated Sales Transaction onto IPFS!");
				return;
			}

			hideInfo();
			showInfo(`Buyer Ethereum Address ${currentMetamaskEthereumAddress} is in the process of purchasing Item IPFS ID ${itemIpfsHashId} from Seller Ethereum Address ` +
				`${sellerEthereumAddress} via Mediator Ethereum Address ${mediatorEthereumAddress} as part of Mediated Sales Transaction IPFS ID ${mediatedSalesTransactionIpfsHash}....`);

			decentralizedMarketplaceMediationContract.purchaseItemWithMediator(sellerEthereumAddress, mediatorEthereumAddress, itemIpfsHashId, mediatedSalesTransactionIpfsHash,
					quantityBeingPurchased_BigInt, { value: totalAmountOfPurchaseInWei_BigInt }, function (err, txHash) {
				hideInfo();

				if (err) {
					// return showError("Smart contract call failed: " + err);
					console.log('purchaseItemWithMediator : err =', err);
					return showError(`DecentralizedMarketplaceMediationContract.purchaseItemWithMediator(${sellerEthereumAddress}, ${mediatorEthereumAddress}, ` +
						`${itemIpfsHashId}, ${mediatedSalesTransactionIpfsHash}, ${quantityBeingPurchased_BigInt.toString()} call failed:  + ${err.message}`);
				}

				let textAreaOutput = `Successfully created Mediated Sales Transaction ID ${mediatedSalesTransactionIpfsHash} Escrow purchase on Ethereum Blockchain WITH Mediator...` + '\n\n' +
					`Buyer Public Ethereum Address: ${currentMetamaskEthereumAddress}` + '\n' +
					`Seller Public Ethereum Address: ${sellerEthereumAddress}` + '\n' +
					`Mediator Public Ethereum Address: ${mediatorEthereumAddress}` + '\n' +
					`Item IPFS ID Purchased: ${itemIpfsHashId}` + '\n' +
					`Quantity of the Item Purchased: ${quantityBeingPurchased_BigInt.toString()}` + '\n' +
					`Total Purchase Amount (in ETH): ${covertWEI_StringValue_to_ETH_StringValue(totalAmountOfPurchaseInWei_BigInt.toString())}` + '\n' +
					`Transaction Hash ID on Ethereum Blockchain: ${txHash}` + '\n' +
					`Mediated Sales Transaction IPFS ID: ${mediatedSalesTransactionIpfsHash}` + '\n\n' +
					`The ETH for this purchase has been sent in Escrow temporarily to the FranklinDecentralizedMarketplaceMediation Smart Contract located at the ` +
					`${decentralizedMarketplaceMediationContractAddress} Ethereum Address until 2-out-of-3 of the Buyer, Seller, and/or Mediator decide whether to Approve or Disapprove this ` +
					'Mediated Sales Transaction. The three parties involved in this Mediated Sales Transaction will need to communicate with each other on how to proceed further. ' +
					'Upon 2-out-of-3 of the Buyer, Seller, and/or Mediator doing Approval or Disapproval - whichever comed first - the ETH Amount held in Escrow by the FranklinDecentralizedMarketplaceMediation Smart Contract ' +
					'will be sent from Escrow Smart Contract Account to the appropriate parties as explained in the "Home" Tab of this DApp.' + '\n\n' +
					`You may see information about this Mediated Sales Transaction by going to the https://ipfs.infura.io/ipfs/${mediatedSalesTransactionIpfsHash} web page. You may also do ` +
					'appropriate queries on the "Purchases" Tab of this DApp.'
				$('#textareaPurchaseItemForSaleFromSellerResults').val(textAreaOutput);

				showInfo(`Successfully created Mediated Sales Transaction ID ${mediatedSalesTransactionIpfsHash} Escrow purchase on Ethereum Blockchain WITH Mediator Ethereum ` +
					`Address ${mediatorEthereumAddress}... ` +
					`Item IPFS ID ${itemIpfsHashId} from Seller Ethereum Address ${sellerEthereumAddress} with quantity ${quantityBeingPurchased_BigInt.toString()} ` +
					`<b>successfully Escrow purchased</b> by Buyer Ethereum Address ${currentMetamaskEthereumAddress} in the Franklin Decentralized Marketplace. Transaction hash: ${txHash}`);
			});
		}
	}

	async function setMiscellaneousSettingsOfAnItemYouAreSelling() {
		let itemIpfsHashId = $('#textSetMiscellaneousSettingsOfAnItemYouAreSellingItemIpfsId').val().trim();
		if (itemIpfsHashId.length === 0) {
			showError('The Item IPFS ID identifying an Item cannot be an empty string or consist only of white space. Please enter an ' +
				'Item IPFS ID value that has no spaces and is not an empty string.');
			return;
		}

		let settingUnitPriceFlag = $('#checkboxSetMiscellaneousSettingsOfAnItemYouAreSellingSettingUnitPrice')[0].checked;
		let settingQuantityFlag = $('#checkboxSetMiscellaneousSettingsOfAnItemYouAreSellingSettingQuantity')[0].checked;
		if (!settingUnitPriceFlag && !settingQuantityFlag) {
			showError('None of the check boxes under the "Set Miscellaneous Settings of an Item You are Selling" section have been set!');
			return;
		}

		let unitPriceInWeiStr = $('#textSetMiscellaneousSettingsOfAnItemYouAreSellingItemUnitPrice').val().trim();
		let unitPriceInWei_BigInt = undefined;
		if (settingUnitPriceFlag) {
			if (unitPriceInWeiStr === EMPTY_STRING) {
				showError('The Unit Price that you set in the "Set Miscellaneous Settings of an Item You are Selling" section was an empty string. If you wish to ' +
					'set the Unit Price of the Item, please enter a positive integer value greater than or equal to zero!');
				return;
			}

			if (!isNumeric(unitPriceInWeiStr)) {
				showError('The Unit Price that you set in the "Set Miscellaneous Settings of an Item You are Selling" section is not a positive integer greater than or equal ' +
					'to zero. If you wish to set the Unit Price of the Item, please enter a positive integer value greater than or equal to zero!');
				return;
			}

			let largestUint256 = 2**256 - 1;
			let largestUint256_BigInt = BigInt(largestUint256);
			unitPriceInWei_BigInt = BigInt(unitPriceInWeiStr);
			if (unitPriceInWei_BigInt > largestUint256_BigInt) {
				showError(`The Unit Price (in WEI) that you entered in the "Set Miscellaneous Settings of an Item You are Selling" section has a ` +
					`${unitPriceInWei_BigInt.toString()} integer value that is greater than the ${largestUint256_BigInt} integer value that an Ethereum Smart Contract can handle!`);
				return;
			}
		}

		let quantityAvailableStr = $('#textSetMiscellaneousSettingsOfAnItemYouAreSellingQuantityAvailableForSale').val().trim();
		let quantityAvailable_BigInt = undefined;
		if (settingQuantityFlag) {
			if (quantityAvailableStr === EMPTY_STRING) {
				showError('The Quantity Available that you set in the "Set Miscellaneous Settings of an Item You are Selling" section was an empty string. If you wish to ' +
					'set the Quantity Available of the Item, please enter a positive integer value greater than or equal to zero!');
				return;
			}

			if (!isNumeric(quantityAvailableStr)) {
				showError('The Quantity Available that you set in the "Set Miscellaneous Settings of an Item You are Selling" section is not a positive integer greater than or equal ' +
					'to zero. If you wish to set the Quantity Available of the Item, please enter a positive integer value greater than or equal to zero!');
				return;
			}

			let largestUint256 = 2**256 - 1;
			let largestUint256_BigInt = BigInt(largestUint256);
			quantityAvailable_BigInt = BigInt(quantityAvailableStr);
			if (quantityAvailable_BigInt > largestUint256_BigInt) {
				showError(`The Quantity Available that you entered in the "Set Miscellaneous Settings of an Item You are Selling" section has a ` +
					`${quantityAvailable_BigInt.toString()} integer value that is greater than the ${largestUint256_BigInt} integer value that an Ethereum Smart Contract can handle!`);
				return;
			}
		}

		makeSureMetamaskInstalled();

		showInfo(`Setting Miscellaneous Settings for Item IPFS ID ${itemIpfsHashId} that you are Selling under Current Metamask Ethereum Public Address ${currentMetamaskEthereumAddress} ....`);

		let decentralizedMarketplaceContract =
			web3.eth.contract(decentralizedMarketplaceContractABI).at(decentralizedMarketplaceContractAddress);

		var sellerExists =
				PROMISIFY(cb => decentralizedMarketplaceContract.sellerExists.call(currentMetamaskEthereumAddress, cb));
		let sellerExistsFlag = undefined;
		let sellerExistsError = undefined;
		await sellerExists
			.then(function (response) {
				console.log('sellerExists : response =', response);
				sellerExistsFlag = response;
			})
			.catch(function (error) {
				console.log('sellerExists : error =', error);
				sellerExistsError = error;
  		});

  		if (sellerExistsError !== undefined) {
			hideInfo();
			return showError("Error encountered while calling the DecentralizedMarketplaceContract.sellerExists method: " +
				sellerExistsError);
		}

		if (sellerExistsFlag === undefined) {
			hideInfo();
			return showError("Error encountered while calling the DecentralizedMarketplaceContract.sellerExists method!");
		}

		console.log('sellerExistsFlag =', sellerExistsFlag);
		if (!sellerExistsFlag) {
			hideInfo();
			return showError(`Your current Metamask Ethereum Public Address ${currentMetamaskEthereumAddress} is not listed as a Seller in the Franklin Decentralized Marketplace!`);
		}

		let ethereumPublicAddress = currentMetamaskEthereumAddress;
		var itemForSaleFromSellerExists = PROMISIFY(cb => decentralizedMarketplaceContract.itemForSaleFromSellerExists(ethereumPublicAddress, itemIpfsHashId, cb));
		let itemForSaleFromSellerExistsFlag = undefined;
		let itemForSaleFromSellerExistsError = undefined;
		await itemForSaleFromSellerExists
			.then(function (response) {
				console.log('itemForSaleFromSellerExists : response =', response);
				itemForSaleFromSellerExistsFlag = response;
			})
			.catch(function (error) {
				console.log('itemForSaleFromSellerExists : error =', error);
				itemForSaleFromSellerExistsError = error;
  		});

  		if (itemForSaleFromSellerExistsError !== undefined) {
			hideInfo();
			return showError("Error encountered while calling the DecentralizedMarketplaceContract.itemForSaleFromSellerExists method: " +
				itemForSaleFromSellerExistsError);
		}

		if (itemForSaleFromSellerExistsFlag === undefined) {
			hideInfo();
			return showError("Error encountered while calling the DecentralizedMarketplaceContract.itemForSaleFromSellerExists method!");
		}

		console.log('itemForSaleFromSellerExistsFlag =', itemForSaleFromSellerExistsFlag);
		if (!itemForSaleFromSellerExistsFlag) {
			hideInfo();
			return showError(`No such Item IPFS ID "${itemIpfsHashId}" is sold by Seller Ethereum Public Address ${ethereumPublicAddress} in the Franklin Decentralized Marketplace!`);
		}

		let setPriceOfItemResponse_TxHash = undefined;
		if (settingUnitPriceFlag) {
			var setPriceOfItem = PROMISIFY(cb => decentralizedMarketplaceContract.setPriceOfItem(itemIpfsHashId, unitPriceInWei_BigInt, cb));
			let setPriceOfItemError = undefined;
			await setPriceOfItem
				.then(function (response) {
					console.log('setPriceOfItem : response =', response);
					setPriceOfItemResponse_TxHash = response;
				})
				.catch(function (error) {
					console.log('setPriceOfItem : error =', error);
					setPriceOfItemError = error;
			});

			if (setPriceOfItemError !== undefined) {
				hideInfo();
				return showError(`Error encountered while calling the DecentralizedMarketplaceContract.setPriceOfItem(${itemIpfsHashId}, ${unitPriceInWei_BigInt.toString()}) method: ` +
					setPriceOfItemError.message);
			}

			if (setPriceOfItemResponse_TxHash === undefined) {
				hideInfo();
				return showError(`Error encountered while calling the DecentralizedMarketplaceContract.setPriceOfItem(${itemIpfsHashId}, ${unitPriceInWei_BigInt.toString()}) method!`);
			}
		}

		let setQuantityAvailableForSaleOfAnItemResponse_TxHash = undefined;
		if (settingQuantityFlag) {
			var setQuantityAvailableForSaleOfAnItem = PROMISIFY(cb => decentralizedMarketplaceContract.setQuantityAvailableForSaleOfAnItem(itemIpfsHashId, quantityAvailable_BigInt, cb));
			let setQuantityAvailableForSaleOfAnItemError = undefined;
			await setQuantityAvailableForSaleOfAnItem
				.then(function (response) {
					console.log('setQuantityAvailableForSaleOfAnItem : response =', response);
					setQuantityAvailableForSaleOfAnItemResponse_TxHash = response;
				})
				.catch(function (error) {
					console.log('setQuantityAvailableForSaleOfAnItem : error =', error);
					setQuantityAvailableForSaleOfAnItemError = error;
			});

			if (setQuantityAvailableForSaleOfAnItemError !== undefined) {
				hideInfo();
				return showError(`Error encountered while calling the DecentralizedMarketplaceContract.setQuantityAvailableForSaleOfAnItem(${itemIpfsHashId}, ${quantityAvailable_BigInt.toString()}) method: ` +
					setQuantityAvailableForSaleOfAnItemError.message);
			}

			if (setQuantityAvailableForSaleOfAnItemResponse_TxHash === undefined) {
				hideInfo();
				return showError(`Error encountered while calling the DecentralizedMarketplaceContract.setQuantityAvailableForSaleOfAnItem(${itemIpfsHashId}, ${quantityAvailable_BigInt.toString()}) method!`);
			}
		}

		let successString = undefined;
		if (setPriceOfItemResponse_TxHash !== undefined && setQuantityAvailableForSaleOfAnItemResponse_TxHash === undefined) {
			successString = `Item IPFS ID ${itemIpfsHashId} for Seller Ethereum Address ${currentMetamaskEthereumAddress} has successfully had it's Unit Price set ` +
				`to ${unitPriceInWei_BigInt.toString()} WEI. Transaction hash: ${setPriceOfItemResponse_TxHash}`;
		}
		else if (setPriceOfItemResponse_TxHash === undefined && setQuantityAvailableForSaleOfAnItemResponse_TxHash !== undefined) {
			successString = `Item IPFS ID ${itemIpfsHashId} for Seller Ethereum Address ${currentMetamaskEthereumAddress} has successfully had it's Quantity Available ` +
				`set to ${quantityAvailable_BigInt.toString()}. Transaction hash: ${setQuantityAvailableForSaleOfAnItemResponse_TxHash}`;
		}
		else {
			successString = `Item IPFS ID ${itemIpfsHashId} for Seller Ethereum Address ${currentMetamaskEthereumAddress} has successfully had it's Unit Price set ` +
				`to ${unitPriceInWei_BigInt.toString()} WEI and it's Quantity Available set to ${quantityAvailable_BigInt.toString()}. ` +
				`Transaction hashes: ${setPriceOfItemResponse_TxHash} and ${setQuantityAvailableForSaleOfAnItemResponse_TxHash}`;
		}

		hideInfo();
		showInfo(successString);
	}

	async function addItemForSale() {
		makeSureMetamaskInstalled();

		let itemName = $('#textAddItemForSaleName').val().trim();
		let itemDescription = $('#textareaAddItemForSaleDescription').val().trim();

		// Coding Technique Reference --> https://stackoverflow.com/questions/17101972/how-to-make-an-array-from-a-string-by-newline-in-javascript/17102698
		let itemCategoriesStr = $('#textareaAddItemForSaleCategories').val().trim();
		let itemCategoriesTempArray = itemCategoriesStr.split('\n');
		let itemCategories = [ ];
		for (let i = 0; i < itemCategoriesTempArray.length; i++) {
			itemCategory = itemCategoriesTempArray[i].trim();
			if (itemCategory === EMPTY_STRING) {
				continue;
			}

			// Coding Technique Reference --> https://www.w3schools.com/jsref/jsref_includes_array.asp
			if (!itemCategories.includes(itemCategory)) {
				itemCategories.push(itemCategory);
			}
		}

		let mainPictureIpfsHash = EMPTY_STRING;
		try {
			// console.log('BEFORE Executing : uploadPictureToIPFS');
			mainPictureIpfsHash = await uploadPictureToIPFS("fileAddItemForSaleMainPicture");
			// console.log('AFTER Executing : uploadPictureToIPFS');
		}
		catch (error) {
			showError(error);
			return;
		}

		let otherPicturesIpfsHashes = [ ];
		for (let i = 1; i <=10; i++) {
			let otherPictureIpfsHash = EMPTY_STRING;
			try {
				// console.log('BEFORE Executing : uploadPictureToIPFS');
				otherPictureIpfsHash = await uploadPictureToIPFS(`fileAddItemForSaleOtherPicture_${i}`);
				// console.log('AFTER Executing : uploadPictureToIPFS');
			}
			catch (error) {
				showError(error);
				return;
			}

			if (otherPictureIpfsHash !== EMPTY_STRING) {
				if (!otherPicturesIpfsHashes.includes(otherPictureIpfsHash)) {
					otherPicturesIpfsHashes.push(otherPictureIpfsHash);
				}
			}
		}

		if (mainPictureIpfsHash === EMPTY_STRING) {
			if (otherPicturesIpfsHashes.length > 0) {
				mainPictureIpfsHash = otherPicturesIpfsHashes[0];
			}
		}

		hideInfo();
		showInfo("Loading given input information about Item onto IPFS (InterPlanetary File System)....");

		let fileContentsJson = {
				name: itemName,
				categories: itemCategories,
				mainPicture: mainPictureIpfsHash,
				pictures: otherPicturesIpfsHashes,
				description: itemDescription
		}

		console.log('addItemForSale : fileContentsJson =', fileContentsJson);

		let fileContents = JSON.stringify(fileContentsJson);
		console.log('addItemForSale : fileContents =', fileContents);

		var ipfsFileHash = undefined;
		errorObject = undefined;
		try {
			let fileBuffer = Buffer.from(fileContents);
			var ipfsFileAdd = PROMISIFY(cb => IPFS.add(fileBuffer, cb));

			let fileInfo = await ipfsFileAdd;
			ipfsFileHash = fileInfo[0].hash;;
		} catch (error) {
			console.log('addItemForSale ipfsFileAdd : error =', error);
			errorObject = error;
		}

		hideInfo();

		if (errorObject !== undefined) {
			showError(errorObject);
			return;
		}
		if (ipfsFileHash === undefined) {
			showError("Unable to add the information for the Item onto IPFS!");
			return;
		}

		showInfo(`Adding Item IPFS ID ${ipfsFileHash} for Sale where you are Seller Ethereum Address ${currentMetamaskEthereumAddress} onto Franklin Decentralized Marketplace....`);

		let decentralizedMarketplaceContract =
			web3.eth.contract(decentralizedMarketplaceContractABI).at(decentralizedMarketplaceContractAddress);

		decentralizedMarketplaceContract.addItemForSale(ipfsFileHash, function (err, txHash) {
			hideInfo();

			if (err) {
				// return showError("Smart contract call failed: " + err);
				console.log('err =', err);
				return showError(`DecentralizedMarketplaceMediationContract.addItemForSale(${ipfsFileHash}) call failed:  + ${err.message}`);
			}

			showInfo(`Item IPFS ID ${ipfsFileHash} for Seller Ethereum Address ${currentMetamaskEthereumAddress} <b>successfully added</b> to Franklin Decentralized Marketplace. Transaction hash: ${txHash}`);
		});
	}

	async function removeYourselfAsSeller() {
		makeSureMetamaskInstalled();

		showInfo(`Removing as Seller your current Metamask Ethereum Public Address ${currentMetamaskEthereumAddress} ....`);

		let decentralizedMarketplaceContract =
			web3.eth.contract(decentralizedMarketplaceContractABI).at(decentralizedMarketplaceContractAddress);

		var sellerExists =
				PROMISIFY(cb => decentralizedMarketplaceContract.sellerExists.call(currentMetamaskEthereumAddress, cb));
		let sellerExistsFlag = undefined;
		let sellerExistsError = undefined;
		await sellerExists
			.then(function (response) {
				console.log('sellerExists : response =', response);
				sellerExistsFlag = response;
			})
			.catch(function (error) {
				console.log('sellerExists : error =', error);
				sellerExistsError = error;
  		});

  		if (sellerExistsError !== undefined) {
			hideInfo();
			return showError("Error encountered while calling the DecentralizedMarketplaceContract.sellerExists method: " +
				sellerExistsError);
		}

		if (sellerExistsFlag === undefined) {
			hideInfo();
			return showError("Error encountered while calling the DecentralizedMarketplaceContract.sellerExists method!");
		}

		console.log('sellerExistsFlag =', sellerExistsFlag);
		if (!sellerExistsFlag) {
			hideInfo();
			return showError(`Your current Metamask Ethereum Public Address ${currentMetamaskEthereumAddress} is not listed as a Seller in the Franklin Decentralized Marketplace!`);
		}

		decentralizedMarketplaceContract.removeSeller(function (err, txHash) {
			hideInfo();

			if (err) {
				// return showError("Smart contract call failed: " + err);
				console.log('err =', err);
				return showError(`DecentralizedMarketplaceContract.removeSeller call failed:  + ${err.message}`);
			}

			showInfo(`Your current Metamask Ethereum Address ${currentMetamaskEthereumAddress} <b>successfully removed as Seller</b> from Franklin Decentralized Marketplace. ` +
				`Transaction hash: ${txHash}`);
		});
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
		$('#textViewDetailedInformationAboutSellerName').val('');
		$('#textViewDetailedInformationAboutSellerNumberOfDifferentItemsBeingSold').val('');
		$('#textViewDetailedInformationAboutSellerWillingToSellItemsViaMediator').val('');
		$('#textareaViewDetailedInformationAboutSellerPhysicalAddress').val('');
		$('#textareaViewDetailedInformationAboutSellerMailingAddress').val('');
		$('#textViewDetailedInformationAboutSellerWebsite').val('');
		$('#textViewDetailedInformationAboutSellerEmail').val('');
		$('#textViewDetailedInformationAboutSellerPhone').val('');
		$('#textViewDetailedInformationAboutSellerFax').val('');
		$('#textareaViewDetailedInformationAboutSellerDescription').val('');

		$('#pictureViewDetailedInformationAboutSeller').attr('src', '');
		$('#pictureViewDetailedInformationAboutSeller').attr('alt', '');

		let ethereumPublicAddress = $('#textViewDetailedInformationAboutSellerEthereumAddress').val().trim().toLowerCase();
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

		showInfo(`Getting Seller Detailed Information about Ethereum Public Address: ${ethereumPublicAddress}`);

		let decentralizedMarketplaceContract =
			web3.eth.contract(decentralizedMarketplaceContractABI).at(decentralizedMarketplaceContractAddress);

		var sellerExists =
				PROMISIFY(cb => decentralizedMarketplaceContract.sellerExists.call(ethereumPublicAddress, cb));
		let sellerExistsFlag = undefined;
		let sellerExistsError = undefined;
		await sellerExists
			.then(function (response) {
				console.log('sellerExists : response =', response);
				sellerExistsFlag = response;
			})
			.catch(function (error) {
				console.log('sellerExists : error =', error);
				sellerExistsError = error;
  		});

  		if (sellerExistsError !== undefined) {
			hideInfo();
			return showError("Error encountered while calling the DecentralizedMarketplaceContract.sellerExists method: " +
				sellerExistsError);
		}

		if (sellerExistsFlag === undefined) {
			hideInfo();
			return showError("Error encountered while calling the DecentralizedMarketplaceContract.sellerExists method!");
		}

		console.log('sellerExistsFlag =', sellerExistsFlag);
		if (!sellerExistsFlag) {
			hideInfo();
			return showError(`Ethereum Public Address ${ethereumPublicAddress} is not listed as a Seller in the Franklin Decentralized Marketplace!`);
		}

		let sellerAddress = ethereumPublicAddress;
		var getIpfsDescriptionInfoAboutSeller =
				PROMISIFY(cb => decentralizedMarketplaceContract.getSellerIpfsHashDescription(sellerAddress, cb));
		let ipfsHashDescOfSeller = undefined;
		let getIpfsDescriptionInfoAboutSellerError = undefined;
		await getIpfsDescriptionInfoAboutSeller
			.then(function (response) {
				ipfsHashDescOfSeller = response;
				console.log('getIpfsDescriptionInfoAboutSeller : response =', response);
			})
			.catch(function (error) {
				console.log('getIpfsDescriptionInfoAboutSeller : error =', error);
				getIpfsDescriptionInfoAboutSellerError = error;
  		});

  		if (getIpfsDescriptionInfoAboutSellerError !== undefined) {
			hideInfo();
			return showError("Error encountered while calling the DecentralizedMarketplaceContract.getSellerIpfsHashDescription method: " +
				getIpfsDescriptionInfoAboutSellerError);
		}

		if (ipfsHashDescOfSeller === undefined) {
			hideInfo();
			return showError("Error encountered while calling the DecentralizedMarketplaceContract.getSellerIpfsHashDescription method!");
		}

		let ipfsFileGetForSellerJson = undefined;
		let ipfsFileGetForSellerError = undefined;
		if (ipfsHashDescOfSeller === EMPTY_STRING) {
			ipfsFileGetForSellerJson = {
				name: '',
				physicalAddress: '',
				mailingAddress: '',
				website: '',
				email: '',
				phone: '',
				fax: '',
				description: '',
				picture: ''
			}
		}
		else {
			var ipfsFileGetForSeller = PROMISIFY(cb => IPFS.get(ipfsHashDescOfSeller, {timeout: '8000ms'}, cb));
			await ipfsFileGetForSeller
				.then(function (response) {
					console.log('ipfsFileGetForSeller : response =', response);
					let ipfsFileGetForSellerJsonString = response[0].content.toString();
					ipfsFileGetForSellerJson = JSON.parse(ipfsFileGetForSellerJsonString);
				})
				.catch(function (error) {
					console.log('ipfsFileGetForSeller : error =', error);
					ipfsFileGetForSellerError = error;
			});

			if (ipfsFileGetForSellerError !== undefined) {
				hideInfo();
				return showError(`Error encountered while calling IPFS.get(${ipfsHashDescOfSeller}) method: ${ipfsFileGetForSellerError}`);
			}

			if (ipfsFileGetForSellerJson === undefined) {
				hideInfo();
				return showError(`Error encountered while calling IPFS.get(${ipfsHashDescOfSeller}) method!`);
			}
		}

		console.log('ipfsFileGetForSellerJson =', ipfsFileGetForSellerJson);

		var getNumberOfDifferentItemsSoldBySeller =
				PROMISIFY(cb => decentralizedMarketplaceContract.getNumberOfDifferentItemsBeingSoldBySeller(sellerAddress, cb));
		let numberOfDifferentItemsSoldBySeller = undefined;
		let getNumberOfDifferentItemsSoldBySellerError = undefined;
		await getNumberOfDifferentItemsSoldBySeller
			.then(function (response) {
				console.log('getNumberOfDifferentItemsSoldBySeller : response =', response);
				let numberOfDifferentItemsSoldBySeller_X = response;
				numberOfDifferentItemsSoldBySeller = numberOfDifferentItemsSoldBySeller_X.c[0];
			})
			.catch(function (error) {
				console.log('getNumberOfDifferentItemsSoldBySeller  : error =', error);
				getNumberOfDifferentItemsSoldBySellerError = error;
  		});

  		if (getNumberOfDifferentItemsSoldBySellerError !== undefined) {
			hideInfo();
			return showError(`Error encountered while calling ` +
				`DecentralizedMarketplaceContract.getNumberOfDifferentItemsBeingSoldBySeller(${sellerAddress}) method: ` +
				`${getNumberOfDifferentItemsSoldBySellerError}`);
		}

		if (numberOfDifferentItemsSoldBySeller === undefined) {
			hideInfo();
			return showError(`Error encountered while calling DecentralizedMarketplaceContract.getNumberOfDifferentItemsBeingSoldBySeller(${sellerAddress}) method!`);
		}

		console.log('numberOfDifferentItemsSoldBySeller =', numberOfDifferentItemsSoldBySeller);

		var sellerIsWillingToSellItemsViaMediator =
				PROMISIFY(cb => decentralizedMarketplaceContract.sellerIsWillingToSellItemsViaMediator(sellerAddress, cb));
		let sellerIsWillingToSellItemsViaMediatorFlag = undefined;
		let sellerIsWillingToSellItemsViaMediatorError = undefined;
		await sellerIsWillingToSellItemsViaMediator
			.then(function (response) {
				console.log('sellerIsWillingToSellItemsViaMediator : response =', response);
				sellerIsWillingToSellItemsViaMediatorFlag = response;
			})
			.catch(function (error) {
				console.log('sellerIsWillingToSellItemsViaMediator : error =', error);
				sellerIsWillingToSellItemsViaMediatorError = error;
  		});

  		if (sellerIsWillingToSellItemsViaMediatorError !== undefined) {
			hideInfo();
			return showError(`Error encountered while calling ` +
				`DecentralizedMarketplaceContract.sellerIsWillingToSellItemsViaMediator(${sellerAddress}) method: ` +
				`${sellerIsWillingToSellItemsViaMediatorError}`);
		}

		if (sellerIsWillingToSellItemsViaMediatorFlag === undefined) {
			hideInfo();
			return showError(`Error encountered while calling DecentralizedMarketplaceContract.sellerIsWillingToSellItemsViaMediator(${sellerAddress}) method!`);
		}

		console.log('sellerIsWillingToSellItemsViaMediatorFlag =', sellerIsWillingToSellItemsViaMediatorFlag);

		$('#textViewDetailedInformationAboutSellerEthereumAddress').val(sellerAddress);
		$('#textViewDetailedInformationAboutSellerName').val(ipfsFileGetForSellerJson.name);
		$('#textViewDetailedInformationAboutSellerNumberOfDifferentItemsBeingSold').val(BigInt(numberOfDifferentItemsSoldBySeller).toString());
		$('#textViewDetailedInformationAboutSellerWillingToSellItemsViaMediator').val(sellerIsWillingToSellItemsViaMediatorFlag);
		$('#textareaViewDetailedInformationAboutSellerPhysicalAddress').val(ipfsFileGetForSellerJson.physicalAddress);
		$('#textareaViewDetailedInformationAboutSellerMailingAddress').val(ipfsFileGetForSellerJson.mailingAddress);
		$('#textViewDetailedInformationAboutSellerWebsite').val(ipfsFileGetForSellerJson.website);
		$('#textViewDetailedInformationAboutSellerEmail').val(ipfsFileGetForSellerJson.email);
		$('#textViewDetailedInformationAboutSellerPhone').val(ipfsFileGetForSellerJson.phone);
		$('#textViewDetailedInformationAboutSellerFax').val(ipfsFileGetForSellerJson.fax);
		$('#textareaViewDetailedInformationAboutSellerDescription').val(ipfsFileGetForSellerJson.description);

		if (ipfsFileGetForSellerJson.picture === EMPTY_STRING) {
			$('#pictureViewDetailedInformationAboutSeller').attr('src', '');
			$('#pictureViewDetailedInformationAboutSeller').attr('alt', '');
		}
		else {
			$('#pictureViewDetailedInformationAboutSeller').attr('src', `https://ipfs.infura.io/ipfs/${ipfsFileGetForSellerJson.picture}`);
			$('#pictureViewDetailedInformationAboutSeller').attr('alt', `${ipfsFileGetForSellerJson.picture}`);
		}

		hideInfo();
	}

	async function viewDetailedInformationAboutMediator() {
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
				getIpfsDescriptionInfoAboutMediatorError = error;
  		});

  		if (getIpfsDescriptionInfoAboutMediatorError !== undefined) {
			hideInfo();
			return showError("Error encountered while calling the DecentralizedMarketplaceMediationContract.descriptionInfoAboutMediators method: " +
				getIpfsDescriptionInfoAboutMediatorError);
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
			return showError(`Error encountered while calling IPFS.get(${ipfsHashDescOfMediator}) method: ${ipfsFileGetForMediatorError}`);
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
				// numberOfMediationsMediatorInvolved = numberOfMediationsMediatorInvolved_X.c[0];
				numberOfMediationsMediatorInvolved = BigInt(convertMetamask_X_Value_to_IntegerString(numberOfMediationsMediatorInvolved_X));
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

		console.log('numberOfMediationsMediatorInvolved.toString() =', numberOfMediationsMediatorInvolved.toString());

		$('#textViewDetailedInformationAboutMediatorEthereumAddress').val(mediatorAddress);
		$('#textViewDetailedInformationAboutMediatorName').val(ipfsFileGetForMediatorJson.name);
		$('#textViewDetailedInformationAboutMediatorNumberOfMediationsInvolved').val(numberOfMediationsMediatorInvolved.toString());
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
		*/

		console.log('uploadPictureToIPFS : inputFileElementId =', inputFileElementId);
		console.log(`uploadPictureToIPFS : $('#' + inputFileElementId) =`, $('#' + inputFileElementId));

		if ($('#' + inputFileElementId)[0].files.length === 0) {
			console.log(`uploadPictureToIPFS: No ${inputFileElementId} picture to upload!`);
			return EMPTY_STRING;
		}

		showInfo(`Loading chosen input picture "${inputFileElementId}" file onto IPFS (InterPlanetary File System) ....`);

		console.log(`uploadPicture: There IS a ${inputFileElementId} picture to upload!`);


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
		makeSureMetamaskInstalled();

		showInfo("Adding/Updating Seller Information about Yourself onto Franklin Decentralized Marketplace....");

		let decentralizedMarketplaceContract =
			web3.eth.contract(decentralizedMarketplaceContractABI).at(decentralizedMarketplaceContractAddress);

		var sellerExists =
				PROMISIFY(cb => decentralizedMarketplaceContract.sellerExists.call(currentMetamaskEthereumAddress, cb));
		let sellerExistsFlag = undefined;
		let sellerExistsError = undefined;
		await sellerExists
			.then(function (response) {
				console.log('sellerExists : response =', response);
				sellerExistsFlag = response;
			})
			.catch(function (error) {
				console.log('sellerExists : error =', error);
				sellerExistsError = error;
  		});

  		if (sellerExistsError !== undefined) {
			hideInfo();
			return showError("Error encountered while calling the DecentralizedMarketplaceContract.sellerExists method: " +
				sellerExistsError);
		}

		if (sellerExistsFlag === undefined) {
			hideInfo();
			return showError("Error encountered while calling the DecentralizedMarketplaceContract.sellerExists method!");
		}

		console.log('sellerExistsFlag =', sellerExistsFlag);
		if (!sellerExistsFlag) {
			hideInfo();
			return showError(`Your current Metamask Ethereum Public Address ${currentMetamaskEthereumAddress} is not listed as a Seller in the ` +
				`Franklin Decentralized Marketplace! Please add at least one Item to Sell to automatically become a Seller!`);
		}

		let pictureIpfsHash = undefined;
		try {
			console.log('BEFORE Executing : uploadPictureToIPFS');
			pictureIpfsHash = await uploadPictureToIPFS("fileAddUpdateDescriptionOfYourselfAsSellerPicture");
			console.log('AFTER Executing : uploadPictureToIPFS');
		}
		catch (error) {
			hideInfo();
			showError(error);
			return;
		}

		console.log('addUpdateDescriptionOfYourselfAsSeller : pictureIpfsHash =', pictureIpfsHash);

		let aName = $('#textAddUpdateDescriptionOfYourselfAsSellerName').val().trim();
		let aPhysicalAddress = $('#textareaAddUpdateDescriptionOfYourselfAsSellerPhysicalAddress').val().trim();
		let aMailingAddress = $('#textareaAddUpdateDescriptionOfYourselfAsSellerMailingAddress').val().trim();
		let aWebsite = $('#textAddUpdateDescriptionOfYourselfAsSellerWebsite').val().trim();
		let aEmail = $('#textAddUpdateDescriptionOfYourselfAsSellerEmail').val().trim();
		let aPhone = $('#textAddUpdateDescriptionOfYourselfAsSellerPhone').val().trim();
		let aFax = $('#textAddUpdateDescriptionOfYourselfAsSellerFax').val().trim();
		let aDescription = $('#textareaAddUpdateDescriptionOfYourselfAsSellerDescription').val().trim();

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


		console.log('addUpdateDescriptionOfYourselfAsSeller : fileContentsJson =', fileContentsJson);

		let fileContents = JSON.stringify(fileContentsJson);
		console.log('addUpdateDescriptionOfYourselfAsSeller : fileContents =', fileContents);

		hideInfo();
		showInfo("Loading given input information about you as a Seller onto IPFS (InterPlanetary File System)....");

		var ipfsFileHash = undefined;
		errorObject = undefined;
		try {
			let fileBuffer = Buffer.from(fileContents);
			var ipfsFileAdd = PROMISIFY(cb => IPFS.add(fileBuffer, cb));

			let fileInfo = await ipfsFileAdd;
			ipfsFileHash = fileInfo[0].hash;;
		} catch (error) {
			console.log('addUpdateDescriptionOfYourselfAsSeller ipfsFileAdd : error =', error);
			errorObject = error;
		}

		hideInfo();

		if (errorObject !== undefined) {
			showError(errorObject);
			return;
		}
		if (ipfsFileHash === undefined) {
			showError("Unable to add the information for the Seller onto IPFS!");
			return;
		}

		console.log('addUpdateDescriptionOfYourselfAsSeller : ipfsFileHash =', ipfsFileHash);

		showInfo("Adding/Updating Seller Information about Yourself onto Franklin Decentralized Marketplace....");

		let decentralizedMarketplaceMediationContract =
			web3.eth.contract(decentralizedMarketplaceContractABI).at(decentralizedMarketplaceContractAddress);

		decentralizedMarketplaceContract.addOrUpdateSellerDescription(ipfsFileHash, function (err, txHash) {
			hideInfo();

			if (err) {
				// return showError("Smart contract call failed: " + err);
				console.log('err =', err);
				return showError(`DecentralizedMarketplaceMediationContract.addOrUpdateSellerDescription(${ipfsFileHash}) call failed:  + ${err.message}`);
			}

			showInfo(`Document ${ipfsFileHash} for Seller ${currentMetamaskEthereumAddress} <b>successfully added</b> to Franklin Decentralized Marketplace. Transaction hash: ${txHash}`);
		});
	}

	async function setMiscellanousSettingsOfYourselfAsSeller() {
		makeSureMetamaskInstalled();

		showInfo(`Setting Miscellaneous Seller Information about your current Metamask Ethereum Address : ${currentMetamaskEthereumAddress}`);

		let decentralizedMarketplaceContract =
			web3.eth.contract(decentralizedMarketplaceContractABI).at(decentralizedMarketplaceContractAddress);

		var sellerExists =
				PROMISIFY(cb => decentralizedMarketplaceContract.sellerExists.call(currentMetamaskEthereumAddress, cb));
		let sellerExistsFlag = undefined;
		let sellerExistsError = undefined;
		await sellerExists
			.then(function (response) {
				console.log('sellerExists : response =', response);
				sellerExistsFlag = response;
			})
			.catch(function (error) {
				console.log('sellerExists : error =', error);
				sellerExistsError = error;
  		});

  		if (sellerExistsError !== undefined) {
			hideInfo();
			return showError("Error encountered while calling the DecentralizedMarketplaceContract.sellerExists method: " +
				sellerExistsError);
		}

		if (sellerExistsFlag === undefined) {
			hideInfo();
			return showError("Error encountered while calling the DecentralizedMarketplaceContract.sellerExists method!");
		}

		console.log('sellerExistsFlag =', sellerExistsFlag);
		if (!sellerExistsFlag) {
			hideInfo();
			return showError(`Your current Metamask Ethereum Public Address ${currentMetamaskEthereumAddress} is not listed as a Seller in the ` +
				`Franklin Decentralized Marketplace! Please add at least one Item to Sell to automatically become a Seller!`);
		}

		let willingToSellItemsViaMediator = $('#checkboxWillingToSellItemsViaMediator')[0].checked;
		console.log('willingToSellItemsViaMediator =', willingToSellItemsViaMediator);

		decentralizedMarketplaceContract.setSellerWillingToSellItemsViaMediator(willingToSellItemsViaMediator, function (err, txHash) {
			hideInfo();

			if (err) {
				// return showError("Smart contract call failed: " + err);
				console.log('err =', err);
				return showError(`DecentralizedMarketplaceMediationContract.setSellerWillingToSellItemsViaMediator(${willingToSellItemsViaMediator}) call failed:  + ${err.message}`);
			}

			showInfo(`Successfully set Miscellaneous Settings for Seller ${currentMetamaskEthereumAddress} onto the Franklin Decentralized Marketplace. Transaction hash: ${txHash}`);
		});
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

		showInfo("Adding/Updating Mediator Information about Yourself onto Franklin Decentralized Marketplace....");

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

	function clearCurrentItemsBeingSoldBySeller() {
		currentItemsBeingSoldByGivenSellerArray = [ ];
		createCurrentItemsBeingSoldByGivenSellerTable();

		$('#textViewCurrentItemsBeingSoldByCurrentSellerEthereumAddress').val('');
		$('#textViewCurrentItemsBeingSoldByCurrentSellerFilterByOneCategory').val('');
		$('#textViewCurrentItemsBeingSoldByCurrentSellerNumberOfDifferentItemsBeingSoldByGivenSellerResults').val('');
	}

	function clearViewMediatedSalesTransactionsEthereumAddressIsInvolved() {
		currentMediatedSalesTransactionsGivenEthereumAddressInvolvedArray = [ ];
		createMediatedSalesTransactionsGivenEthereumAddressInvolvedTable();

		$('#textViewMediatedSalesTransactionsEthereumAddressIsInvolvedEthereumAddress').val('');
		$('#textViewMediatedSalesTransactionsEthereumAddressIsInvolvedNumberInvolvedResults').val('');

		$('#radioViewMediatedSalesTransactionsEthereumAddressIsInvolvedAll')[0].checked = true;
		$('#radioViewMediatedSalesTransactionsEthereumAddressIsInvolvedNeitherApprovedNorDisapproved')[0].checked = false;
		$('#radioViewMediatedSalesTransactionsEthereumAddressIsInvolvedApproved')[0].checked = false;
		$('#radioViewMediatedSalesTransactionsEthereumAddressIsInvolvedDisapproved')[0].checked = false;
	}

	function clearViewDetailedInformationAboutSpecificMediatedSalesTransaction() {
		$('#textViewDetailedInformationAboutSpecificMediatedSalesTransactionIpfsId').val('');

		$('#textViewDetailedInformationAboutSpecificMediatedSalesTransactionBuyerEthereumAddress').val('');
		$('#textViewDetailedInformationAboutSpecificMediatedSalesTransactionSellerEthereumAddress').val('');
		$('#textViewDetailedInformationAboutSpecificMediatedSalesTransactionMediatorEthereumAddress').val('');
		$('#textViewDetailedInformationAboutSpecificMediatedSalesTransactionItemIpfsId').val('');
		$('#textViewDetailedInformationAboutSpecificMediatedSalesTransactionTotalSalesAmount').val('');
		$('#textViewDetailedInformationAboutSpecificMediatedSalesTransactionQuantityOfItemPurchased').val('');
		$('#textViewDetailedInformationAboutSpecificMediatedSalesTransactionDateTimestamp').val('');

		$('#checkboxViewDetailedInformationAboutSpecificMediatedSalesTransactionApproved')[0].checked = false;
		$('#checkboxViewDetailedInformationAboutSpecificMediatedSalesTransactionDisapproved')[0].checked = false;

		$('#checkboxViewDetailedInformationAboutSpecificMediatedSalesTransactionBuyerApproved')[0].checked = false;
		$('#checkboxViewDetailedInformationAboutSpecificMediatedSalesTransactionBuyerDisapproved')[0].checked = false;
		$('#checkboxViewDetailedInformationAboutSpecificMediatedSalesTransactionSellerApproved')[0].checked = false;
		$('#checkboxViewDetailedInformationAboutSpecificMediatedSalesTransactionSellerDisapproved')[0].checked = false;
		$('#checkboxViewDetailedInformationAboutSpecificMediatedSalesTransactionMediatorApproved')[0].checked = false;
		$('#checkboxViewDetailedInformationAboutSpecificMediatedSalesTransactionMediatorDisapproved')[0].checked = false;
	}

	async function viewDetailedInformationAboutSpecificMediatedSalesTransaction() {
		$('#textViewDetailedInformationAboutSpecificMediatedSalesTransactionBuyerEthereumAddress').val('');
		$('#textViewDetailedInformationAboutSpecificMediatedSalesTransactionSellerEthereumAddress').val('');
		$('#textViewDetailedInformationAboutSpecificMediatedSalesTransactionMediatorEthereumAddress').val('');
		$('#textViewDetailedInformationAboutSpecificMediatedSalesTransactionItemIpfsId').val('');
		$('#textViewDetailedInformationAboutSpecificMediatedSalesTransactionTotalSalesAmount').val('');
		$('#textViewDetailedInformationAboutSpecificMediatedSalesTransactionQuantityOfItemPurchased').val('');
		$('#textViewDetailedInformationAboutSpecificMediatedSalesTransactionDateTimestamp').val('');

		$('#checkboxViewDetailedInformationAboutSpecificMediatedSalesTransactionApproved')[0].checked = false;
		$('#checkboxViewDetailedInformationAboutSpecificMediatedSalesTransactionDisapproved')[0].checked = false;

		$('#checkboxViewDetailedInformationAboutSpecificMediatedSalesTransactionBuyerApproved')[0].checked = false;
		$('#checkboxViewDetailedInformationAboutSpecificMediatedSalesTransactionBuyerDisapproved')[0].checked = false;
		$('#checkboxViewDetailedInformationAboutSpecificMediatedSalesTransactionSellerApproved')[0].checked = false;
		$('#checkboxViewDetailedInformationAboutSpecificMediatedSalesTransactionSellerDisapproved')[0].checked = false;
		$('#checkboxViewDetailedInformationAboutSpecificMediatedSalesTransactionMediatorApproved')[0].checked = false;
		$('#checkboxViewDetailedInformationAboutSpecificMediatedSalesTransactionMediatorDisapproved')[0].checked = false;

		let mediatedSalesTransactionIpfsId = $('#textViewDetailedInformationAboutSpecificMediatedSalesTransactionIpfsId').val().trim();
		if (mediatedSalesTransactionIpfsId.length === 0) {
			showError('The Mediated Sales Transaction IPFS ID cannot be an empty string or consist only of white space. Please enter an ' +
				'Mediated Sales Transaction IPFS ID value that has no spaces and is not an empty string.');
			return;
		}

		showInfo(`Getting Detailed Information about Mediated Sales Transaction ID IPFS ${mediatedSalesTransactionIpfsId} ....`);

		makeSureMetamaskInstalled();

		let decentralizedMarketplaceMediationContract =
			web3.eth.contract(decentralizedMarketplaceMediationContractABI).at(decentralizedMarketplaceMediationContractAddress);

		var mediatedSalesTransactionExists =
					PROMISIFY(cb => decentralizedMarketplaceMediationContract.mediatedSalesTransactionExists.call(mediatedSalesTransactionIpfsId, cb));
		let mediatedSalesTransactionExistsFlag = undefined;
		let mediatedSalesTransactionExistsError = undefined;
		await mediatedSalesTransactionExists
			.then(function (response) {
				console.log('mediatedSalesTransactionExists : response =', response);
				mediatedSalesTransactionExistsFlag = response;
			})
			.catch(function (error) {
				console.log('mediatedSalesTransactionExists : error =', error);
				mediatedSalesTransactionExistsError = error;
			});

		if (mediatedSalesTransactionExistsError !== undefined) {
			hideInfo();
			return showError(`Error encountered while calling ` +
				`DecentralizedMarketplaceMediationContract.mediatedSalesTransactionExists(${mediatedSalesTransactionIpfsId}) method: ` +
				`${mediatedSalesTransactionExistsError}`);
		}

		if (mediatedSalesTransactionExistsFlag === undefined) {
			hideInfo();
			return showError(`Error encountered while calling DecentralizedMarketplaceContract.mediatedSalesTransactionExists(${mediatedSalesTransactionIpfsId}) method!`);
		}

		if (!mediatedSalesTransactionExistsFlag) {
			hideInfo();
			return showError(`Mediated Sales Transaction IPFS ID ${mediatedSalesTransactionIpfsId} is not listed as a Mediated Sales Transaction in the Franklin Decentralized Marketplace!`);
		}

		var mediatedSalesTransactionHasBeenApproved = PROMISIFY(cb => decentralizedMarketplaceMediationContract.mediatedSalesTransactionHasBeenApproved(mediatedSalesTransactionIpfsId, cb));
		let mediatedSalesTransactionHasBeenApprovedFlag = undefined;
		let mediatedSalesTransactionHasBeenApprovedError = undefined;
		await mediatedSalesTransactionHasBeenApproved
			.then(function (response) {
				mediatedSalesTransactionHasBeenApprovedFlag = response;
			})
			.catch(function (error) {
				// console.log('error =', error);
				mediatedSalesTransactionHasBeenApprovedError = error;
		});

		if (mediatedSalesTransactionHasBeenApprovedError !== undefined) {
			hideInfo();
			return showError(`Error encountered while calling the DecentralizedMarketplaceMediationContract.mediatedSalesTransactionHasBeenApproved(${mediatedSalesTransactionIpfsId}) ` +
				`method: ` + mediatedSalesTransactionHasBeenApprovedError);
		}

		if (mediatedSalesTransactionHasBeenApprovedFlag === undefined) {
			hideInfo();
			return showError(`Error encountered while calling the ` +
				`DecentralizedMarketplaceMediationContract.mediatedSalesTransactionHasBeenApproved(${mediatedSalesTransactionIpfsId}) method!`);
		}

		console.log('mediatedSalesTransactionHasBeenApprovedFlag =', mediatedSalesTransactionHasBeenApprovedFlag);

		var mediatedSalesTransactionHasBeenDisapproved = PROMISIFY(cb => decentralizedMarketplaceMediationContract.mediatedSalesTransactionHasBeenDisapproved(mediatedSalesTransactionIpfsId, cb));
		let mediatedSalesTransactionHasBeenDisapprovedFlag = undefined;
		let mediatedSalesTransactionHasBeenDisapprovedError = undefined;
		await mediatedSalesTransactionHasBeenDisapproved
			.then(function (response) {
				mediatedSalesTransactionHasBeenDisapprovedFlag = response;
			})
			.catch(function (error) {
				// console.log('error =', error);
				mediatedSalesTransactionHasBeenDisapprovedError = error;
		});

		if (mediatedSalesTransactionHasBeenDisapprovedError !== undefined) {
			hideInfo();
			return showError(`Error encountered while calling the DecentralizedMarketplaceMediationContract.mediatedSalesTransactionHasBeenDisapproved(${mediatedSalesTransactionIpfsId}) ` +
				`method: ` + mediatedSalesTransactionHasBeenDisapprovedError);
		}

		if (mediatedSalesTransactionHasBeenDisapprovedFlag === undefined) {
			hideInfo();
			return showError(`Error encountered while calling the ` +
				`DecentralizedMarketplaceMediationContract.mediatedSalesTransactionHasBeenDisapproved(${mediatedSalesTransactionIpfsId}) method!`);
		}

		console.log('mediatedSalesTransactionHasBeenDisapprovedFlag =', mediatedSalesTransactionHasBeenDisapprovedFlag);

		var getBuyerEthereumAddress = PROMISIFY(cb => decentralizedMarketplaceMediationContract.mediatedSalesTransactionAddresses.call(mediatedSalesTransactionIpfsId, 0, cb));
		let buyerEthereumAddress = undefined;
		let getBuyerEthereumAddressError = undefined;
		await getBuyerEthereumAddress
			.then(function (response) {
				buyerEthereumAddress = response;
			})
			.catch(function (error) {
				// console.log('error =', error);
				getBuyerEthereumAddressError = error;
		});

		if (getBuyerEthereumAddressError !== undefined) {
			hideInfo();
			return showError(`Error encountered while calling the DecentralizedMarketplaceMediationContract.mediatedSalesTransactionAddresses(${mediatedSalesTransactionIpfsId}, 0) ` +
				`method: ` + getBuyerEthereumAddressError);
		}

		if (buyerEthereumAddress === undefined) {
			hideInfo();
			return showError(`Error encountered while calling the DecentralizedMarketplaceMediationContract.mediatedSalesTransactionAddresses(${mediatedSalesTransactionIpfsId}, 0) method!`);
		}

		console.log('buyerEthereumAddress =', buyerEthereumAddress);

		var getSellerEthereumAddress = PROMISIFY(cb => decentralizedMarketplaceMediationContract.mediatedSalesTransactionAddresses.call(mediatedSalesTransactionIpfsId, 1, cb));
		let sellerEthereumAddress = undefined;
		let getSellerEthereumAddressError = undefined;
		await getSellerEthereumAddress
			.then(function (response) {
				sellerEthereumAddress = response;
			})
			.catch(function (error) {
				// console.log('error =', error);
				getSellerEthereumAddressError = error;
		});

		if (getSellerEthereumAddressError !== undefined) {
			hideInfo();
			return showError(`Error encountered while calling the DecentralizedMarketplaceMediationContract.mediatedSalesTransactionAddresses(${mediatedSalesTransactionIpfsId}, 1) ` +
				`method: ` + getSellerEthereumAddressError);
		}

		if (sellerEthereumAddress === undefined) {
			hideInfo();
			return showError(`Error encountered while calling the DecentralizedMarketplaceMediationContract.mediatedSalesTransactionAddresses(${mediatedSalesTransactionIpfsId}, 1) method!`);
		}

		console.log('sellerEthereumAddress =', sellerEthereumAddress);

		var getMediatorEthereumAddress = PROMISIFY(cb => decentralizedMarketplaceMediationContract.mediatedSalesTransactionAddresses.call(mediatedSalesTransactionIpfsId, 2, cb));
		let mediatorEthereumAddress = undefined;
		let getMediatorEthereumAddressError = undefined;
		await getMediatorEthereumAddress
			.then(function (response) {
				mediatorEthereumAddress = response;
			})
			.catch(function (error) {
				// console.log('error =', error);
				getMediatorEthereumAddressError = error;
		});

		if (getMediatorEthereumAddressError !== undefined) {
			hideInfo();
			return showError(`Error encountered while calling the DecentralizedMarketplaceMediationContract.mediatedSalesTransactionAddresses(${mediatedSalesTransactionIpfsId}, 2) ` +
				`method: ` + getMediatorEthereumAddressError);
		}

		if (mediatorEthereumAddress === undefined) {
			hideInfo();
			return showError(`Error encountered while calling the DecentralizedMarketplaceMediationContract.mediatedSalesTransactionAddresses(${mediatedSalesTransactionIpfsId}, 2) method!`);
		}

		console.log('mediatorEthereumAddress =', mediatorEthereumAddress);

		var getSalesAmountInWei = PROMISIFY(cb => decentralizedMarketplaceMediationContract.mediatedSalesTransactionAmount.call(mediatedSalesTransactionIpfsId, cb));
		let salesAmountInETH = undefined;
		let getSalesAmountInWeiError = undefined;
		await getSalesAmountInWei
			.then(function (response) {
				let salesAmount_Metamask_X = response;
				let salesAmountInWei = convertMetamask_X_Value_to_IntegerString(salesAmount_Metamask_X);
				salesAmountInETH = covertWEI_StringValue_to_ETH_StringValue(salesAmountInWei);
			})
			.catch(function (error) {
				// console.log('error =', error);
				getMediatorEthereumAddressError = error;
		});

		if (getSalesAmountInWeiError !== undefined) {
			hideInfo();
			return showError(`Error encountered while calling the DecentralizedMarketplaceMediationContract.mediatedSalesTransactionAmount(${mediatedSalesTransactionIpfsId}) ` +
				`method: ` + getSalesAmountInWeiError);
		}

		if (salesAmountInETH === undefined) {
			hideInfo();
			return showError(`Error encountered while calling the DecentralizedMarketplaceMediationContract.mediatedSalesTransactionAmount(${mediatedSalesTransactionIpfsId}) method!`);
		}

		console.log('salesAmountInETH =', salesAmountInETH);

		var ipfsFileGetForMediatedSalesTransaction = PROMISIFY(cb => IPFS.get(mediatedSalesTransactionIpfsId, {timeout: '8000ms'}, cb));
		let ipfsFileGetForMediatedSalesTransactionJson = undefined;
		let ipfsFileGetForMediatedSalesTransactionError = undefined;
		await ipfsFileGetForMediatedSalesTransaction
			.then(function (response) {
				console.log('ipfsFileGetForMediatedSalesTransaction : response =', response);
				let ipfsFileGetForMediatedSalesTransactionJsonString = response[0].content.toString();
				ipfsFileGetForMediatedSalesTransactionJson = JSON.parse(ipfsFileGetForMediatedSalesTransactionJsonString);
			})
			.catch(function (error) {
				console.log('ipfsFileGetForMediatedSalesTransaction : error =', error);
				ipfsFileGetForMediatedSalesTransactionError = error;
			});

		if (ipfsFileGetForMediatedSalesTransactionError !== undefined) {
			hideInfo();
			return showError(`Error encountered while calling IPFS.get(${mediatedSalesTransactionIpfsId}) method: ${ipfsFileGetForMediatedSalesTransactionError}`);
		}

		if (ipfsFileGetForMediatedSalesTransactionJson === undefined) {
			hideInfo();
			return showError(`Error encountered while calling IPFS.get(${mediatedSalesTransactionIpfsId}) method!`);
		}

		console.log('ipfsFileGetForMediatedSalesTransactionJson =', ipfsFileGetForMediatedSalesTransactionJson);

		var mediatedSalesTransactionApprovedByBuyer =
			PROMISIFY(cb => decentralizedMarketplaceMediationContract.mediatedSalesTransactionApprovedByParties.call(mediatedSalesTransactionIpfsId, 0, cb));
		let mediatedSalesTransactionApprovedByBuyerFlag = undefined;
		let mediatedSalesTransactionApprovedByBuyerError = undefined;
		await mediatedSalesTransactionApprovedByBuyer
			.then(function (response) {
				mediatedSalesTransactionApprovedByBuyerFlag = response;
			})
			.catch(function (error) {
				// console.log('error =', error);
				mediatedSalesTransactionApprovedByBuyerError = error;
		});

		if (mediatedSalesTransactionApprovedByBuyerError !== undefined) {
			hideInfo();
			return showError(`Error encountered while calling the DecentralizedMarketplaceMediationContract.mediatedSalesTransactionApprovedByParties(${mediatedSalesTransactionIpfsId}, 0) ` +
				`method: ` + mediatedSalesTransactionApprovedByBuyerError);
		}

		if (mediatedSalesTransactionApprovedByBuyerFlag === undefined) {
			hideInfo();
			return showError(`Error encountered while calling the ` +
				`DecentralizedMarketplaceMediationContract.mediatedSalesTransactionApprovedByParties(${mediatedSalesTransactionIpfsId}, 0) method!`);
		}

		console.log('mediatedSalesTransactionApprovedByBuyerFlag =', mediatedSalesTransactionApprovedByBuyerFlag);

		var mediatedSalesTransactionApprovedBySeller =
			PROMISIFY(cb => decentralizedMarketplaceMediationContract.mediatedSalesTransactionApprovedByParties.call(mediatedSalesTransactionIpfsId, 1, cb));
		let mediatedSalesTransactionApprovedBySellerFlag = undefined;
		let mediatedSalesTransactionApprovedBySellerError = undefined;
		await mediatedSalesTransactionApprovedBySeller
			.then(function (response) {
				mediatedSalesTransactionApprovedBySellerFlag = response;
			})
			.catch(function (error) {
				// console.log('error =', error);
				mediatedSalesTransactionApprovedBySellerError = error;
		});

		if (mediatedSalesTransactionApprovedBySellerError !== undefined) {
			hideInfo();
			return showError(`Error encountered while calling the DecentralizedMarketplaceMediationContract.mediatedSalesTransactionApprovedByParties(${mediatedSalesTransactionIpfsId}, 1) ` +
				`method: ` + mediatedSalesTransactionApprovedBySellerError);
		}

		if (mediatedSalesTransactionApprovedBySellerFlag === undefined) {
			hideInfo();
			return showError(`Error encountered while calling the ` +
				`DecentralizedMarketplaceMediationContract.mediatedSalesTransactionApprovedByParties(${mediatedSalesTransactionIpfsId}, 1) method!`);
		}

		console.log('mediatedSalesTransactionApprovedBySellerFlag =', mediatedSalesTransactionApprovedBySellerFlag);

		var mediatedSalesTransactionApprovedByMediator =
			PROMISIFY(cb => decentralizedMarketplaceMediationContract.mediatedSalesTransactionApprovedByParties.call(mediatedSalesTransactionIpfsId, 2, cb));
		let mediatedSalesTransactionApprovedByMediatorFlag = undefined;
		let mediatedSalesTransactionApprovedByMediatorError = undefined;
		await mediatedSalesTransactionApprovedByMediator
			.then(function (response) {
				mediatedSalesTransactionApprovedByMediatorFlag = response;
			})
			.catch(function (error) {
				// console.log('error =', error);
				mediatedSalesTransactionApprovedByMediatorError = error;
		});

		if (mediatedSalesTransactionApprovedByMediatorError !== undefined) {
			hideInfo();
			return showError(`Error encountered while calling the DecentralizedMarketplaceMediationContract.mediatedSalesTransactionApprovedByParties(${mediatedSalesTransactionIpfsId}, 2) ` +
				`method: ` + mediatedSalesTransactionApprovedByMediatorError);
		}

		if (mediatedSalesTransactionApprovedByMediatorFlag === undefined) {
			hideInfo();
			return showError(`Error encountered while calling the ` +
				`DecentralizedMarketplaceMediationContract.mediatedSalesTransactionApprovedByParties(${mediatedSalesTransactionIpfsId}, 2) method!`);
		}

		console.log('mediatedSalesTransactionApprovedByMediatorFlag =', mediatedSalesTransactionApprovedByMediatorFlag);

		var mediatedSalesTransactionDisapprovedByBuyer =
			PROMISIFY(cb => decentralizedMarketplaceMediationContract.mediatedSalesTransactionDisapprovedByParties.call(mediatedSalesTransactionIpfsId, 0, cb));
		let mediatedSalesTransactionDisapprovedByBuyerFlag = undefined;
		let mediatedSalesTransactionDisapprovedByBuyerError = undefined;
		await mediatedSalesTransactionDisapprovedByBuyer
			.then(function (response) {
				mediatedSalesTransactionDisapprovedByBuyerFlag = response;
			})
			.catch(function (error) {
				// console.log('error =', error);
				mediatedSalesTransactionDisapprovedByBuyerError = error;
		});

		if (mediatedSalesTransactionDisapprovedByBuyerError !== undefined) {
			hideInfo();
			return showError(`Error encountered while calling the DecentralizedMarketplaceMediationContract.mediatedSalesTransactionDisapprovedByParties(${mediatedSalesTransactionIpfsId}, 0) ` +
				`method: ` + mediatedSalesTransactionDisapprovedByBuyerError);
		}

		if (mediatedSalesTransactionDisapprovedByBuyerFlag === undefined) {
			hideInfo();
			return showError(`Error encountered while calling the ` +
				`DecentralizedMarketplaceMediationContract.mediatedSalesTransactionDisapprovedByParties(${mediatedSalesTransactionIpfsId}, 0) method!`);
		}

		console.log('mediatedSalesTransactionDisapprovedByBuyerFlag =', mediatedSalesTransactionDisapprovedByBuyerFlag);

		var mediatedSalesTransactionDisapprovedBySeller =
			PROMISIFY(cb => decentralizedMarketplaceMediationContract.mediatedSalesTransactionDisapprovedByParties.call(mediatedSalesTransactionIpfsId, 1, cb));
		let mediatedSalesTransactionDisapprovedBySellerFlag = undefined;
		let mediatedSalesTransactionDisapprovedBySellerError = undefined;
		await mediatedSalesTransactionDisapprovedBySeller
			.then(function (response) {
				mediatedSalesTransactionDisapprovedBySellerFlag = response;
			})
			.catch(function (error) {
				// console.log('error =', error);
				mediatedSalesTransactionDisapprovedBySellerError = error;
		});

		if (mediatedSalesTransactionDisapprovedBySellerError !== undefined) {
			hideInfo();
			return showError(`Error encountered while calling the DecentralizedMarketplaceMediationContract.mediatedSalesTransactionDisapprovedByParties(${mediatedSalesTransactionIpfsId}, 1) ` +
				`method: ` + mediatedSalesTransactionDisapprovedBySellerError);
		}

		if (mediatedSalesTransactionDisapprovedBySellerFlag === undefined) {
			hideInfo();
			return showError(`Error encountered while calling the ` +
				`DecentralizedMarketplaceMediationContract.mediatedSalesTransactionDisapprovedByParties(${mediatedSalesTransactionIpfsId}, 1) method!`);
		}

		console.log('mediatedSalesTransactionDisapprovedBySellerFlag =', mediatedSalesTransactionDisapprovedBySellerFlag);

		var mediatedSalesTransactionDisapprovedByMediator =
			PROMISIFY(cb => decentralizedMarketplaceMediationContract.mediatedSalesTransactionDisapprovedByParties.call(mediatedSalesTransactionIpfsId, 2, cb));
		let mediatedSalesTransactionDisapprovedByMediatorFlag = undefined;
		let mediatedSalesTransactionDisapprovedByMediatorError = undefined;
		await mediatedSalesTransactionDisapprovedByMediator
			.then(function (response) {
				mediatedSalesTransactionDisapprovedByMediatorFlag = response;
			})
			.catch(function (error) {
				// console.log('error =', error);
				mediatedSalesTransactionDisapprovedByMediatorError = error;
		});

		if (mediatedSalesTransactionDisapprovedByMediatorError !== undefined) {
			hideInfo();
			return showError(`Error encountered while calling the DecentralizedMarketplaceMediationContract.mediatedSalesTransactionDisapprovedByParties(${mediatedSalesTransactionIpfsId}, 2) ` +
				`method: ` + mediatedSalesTransactionDisapprovedByMediatorError);
		}

		if (mediatedSalesTransactionDisapprovedByMediatorFlag === undefined) {
			hideInfo();
			return showError(`Error encountered while calling the ` +
				`DecentralizedMarketplaceMediationContract.mediatedSalesTransactionDisapprovedByParties(${mediatedSalesTransactionIpfsId}, 2) method!`);
		}

		console.log('mediatedSalesTransactionDisapprovedByMediatorFlag =', mediatedSalesTransactionDisapprovedByMediatorFlag);

		$('#textViewDetailedInformationAboutSpecificMediatedSalesTransactionBuyerEthereumAddress').val(buyerEthereumAddress);
		$('#textViewDetailedInformationAboutSpecificMediatedSalesTransactionSellerEthereumAddress').val(sellerEthereumAddress);
		$('#textViewDetailedInformationAboutSpecificMediatedSalesTransactionMediatorEthereumAddress').val(mediatorEthereumAddress);
		$('#textViewDetailedInformationAboutSpecificMediatedSalesTransactionItemIpfsId').val(ipfsFileGetForMediatedSalesTransactionJson.itemIpfsHashIdInPurchase);
		$('#textViewDetailedInformationAboutSpecificMediatedSalesTransactionTotalSalesAmount').val(salesAmountInETH);
		$('#textViewDetailedInformationAboutSpecificMediatedSalesTransactionQuantityOfItemPurchased').val(ipfsFileGetForMediatedSalesTransactionJson.quantityOfItemPurchased);
		$('#textViewDetailedInformationAboutSpecificMediatedSalesTransactionDateTimestamp').val(ipfsFileGetForMediatedSalesTransactionJson.dateTimestampOfCreation);

		$('#checkboxViewDetailedInformationAboutSpecificMediatedSalesTransactionApproved')[0].checked = mediatedSalesTransactionHasBeenApprovedFlag;
		$('#checkboxViewDetailedInformationAboutSpecificMediatedSalesTransactionDisapproved')[0].checked = mediatedSalesTransactionHasBeenDisapprovedFlag;

		$('#checkboxViewDetailedInformationAboutSpecificMediatedSalesTransactionBuyerApproved')[0].checked = mediatedSalesTransactionApprovedByBuyerFlag;
		$('#checkboxViewDetailedInformationAboutSpecificMediatedSalesTransactionBuyerDisapproved')[0].checked = mediatedSalesTransactionDisapprovedByBuyerFlag;
		$('#checkboxViewDetailedInformationAboutSpecificMediatedSalesTransactionSellerApproved')[0].checked = mediatedSalesTransactionApprovedBySellerFlag;
		$('#checkboxViewDetailedInformationAboutSpecificMediatedSalesTransactionSellerDisapproved')[0].checked = mediatedSalesTransactionDisapprovedBySellerFlag;
		$('#checkboxViewDetailedInformationAboutSpecificMediatedSalesTransactionMediatorApproved')[0].checked = mediatedSalesTransactionApprovedByMediatorFlag;
		$('#checkboxViewDetailedInformationAboutSpecificMediatedSalesTransactionMediatorDisapproved')[0].checked = mediatedSalesTransactionDisapprovedByMediatorFlag;

		hideInfo();
	}

	async function viewMediatedSalesTransactionsEthereumAddressIsInvolved() {
		currentMediatedSalesTransactionsGivenEthereumAddressInvolvedArray = [ ];
		createMediatedSalesTransactionsGivenEthereumAddressInvolvedTable();
		$('#textViewMediatedSalesTransactionsEthereumAddressIsInvolvedNumberInvolvedResults').val('');

		let ethereumPublicAddress = $('#textViewMediatedSalesTransactionsEthereumAddressIsInvolvedEthereumAddress').val().trim().toLowerCase();
		if (ethereumPublicAddress.length === 0) {
			showError('The Ethereum Public Address cannot be an empty string or consist only of white space. Please enter a ' +
				'Seller Ethereum Public Address value that is a 40-hex lowercase string.');
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

		showInfo(`Getting Mediated Sales Transaction Ethereum Public Address ${ethereumPublicAddress} is involved based on Filter criteria ....`);

		let filterNeitherApprovedNorDisapprovedFlag = $('#radioViewMediatedSalesTransactionsEthereumAddressIsInvolvedNeitherApprovedNorDisapproved')[0].checked;
		let filterApprovedOnlyFlag = $('#radioViewMediatedSalesTransactionsEthereumAddressIsInvolvedApproved')[0].checked;
		let filterDisapprovedOnlyFlag = $('#radioViewMediatedSalesTransactionsEthereumAddressIsInvolvedDisapproved')[0].checked;

		let decentralizedMarketplaceMediationContract =
			web3.eth.contract(decentralizedMarketplaceMediationContractABI).at(decentralizedMarketplaceMediationContractAddress);

		var getNumberOfMediatedSalesTransactionsAddressInvolved =
			PROMISIFY(cb => decentralizedMarketplaceMediationContract.numberOfMediatedSalesTransactionsAddressInvolved(ethereumPublicAddress, cb));
		let numberOfMediatedSalesTransactionsAddressInvolved_BigInt = undefined;
		let getNumberOfMediatedSalesTransactionsAddressInvolvedError = undefined;
		await getNumberOfMediatedSalesTransactionsAddressInvolved
			.then(function (response) {
				let numberOfMediatedSalesTransactionsInvolved_X = response;
				numberOfMediatedSalesTransactionsAddressInvolved_BigInt = BigInt(convertMetamask_X_Value_to_IntegerString(numberOfMediatedSalesTransactionsInvolved_X));
			})
			.catch(function (error) {
				// console.log('error =', error);
				getNumberOfMediatedSalesTransactionsAddressInvolvedError = error;
  		});

  		if (getNumberOfMediatedSalesTransactionsAddressInvolvedError !== undefined) {
			hideInfo();
			return showError(`Error encountered while calling the DecentralizedMarketplaceMediationContract.numberOfMediatedSalesTransactionsAddressInvolved(${ethereumPublicAddress}) ` +
				`method: ` + getNumberOfMediatedSalesTransactionsAddressInvolvedError);
		}

		if (numberOfMediatedSalesTransactionsAddressInvolved_BigInt === undefined) {
			hideInfo();
			return showError(`Error encountered while calling the DecentralizedMarketplaceMediationContract.numberOfMediatedSalesTransactionsAddressInvolved(${ethereumPublicAddress}) method!`);
		}

		for (let i = BigInt(0); i < numberOfMediatedSalesTransactionsAddressInvolved_BigInt; i++) {
			var getMediatedSalesTransactionAddressInvolved =
				PROMISIFY(cb => decentralizedMarketplaceMediationContract.mediatedSalesTransactionsAddressInvolved.call(ethereumPublicAddress, i, cb));
			let mediatedSalesTransactionIpfsId = undefined;
			let getMediatedSalesTransactionAddressInvolvedError = undefined;
			await getMediatedSalesTransactionAddressInvolved
				.then(function (response) {
					mediatedSalesTransactionIpfsId = response;
				})
				.catch(function (error) {
					// console.log('error =', error);
					getMediatedSalesTransactionAddressInvolvedError = error;
			});

			if (getMediatedSalesTransactionAddressInvolvedError !== undefined) {
				hideInfo();
				return showError(`Error encountered while calling the DecentralizedMarketplaceMediationContract.mediatedSalesTransactionsAddressInvolved(${ethereumPublicAddress}, ${i.toString()}) ` +
					`method: ` + getMediatedSalesTransactionAddressInvolvedError);
			}

			if (mediatedSalesTransactionIpfsId === undefined) {
				hideInfo();
				return showError(`Error encountered while calling the DecentralizedMarketplaceMediationContract.mediatedSalesTransactionsAddressInvolved(${ethereumPublicAddress}, ${i.toString()}) method!`);
			}

			console.log('mediatedSalesTransactionIpfsId =', mediatedSalesTransactionIpfsId);

			var mediatedSalesTransactionHasBeenApproved = PROMISIFY(cb => decentralizedMarketplaceMediationContract.mediatedSalesTransactionHasBeenApproved(mediatedSalesTransactionIpfsId, cb));
			let mediatedSalesTransactionHasBeenApprovedFlag = undefined;
			let mediatedSalesTransactionHasBeenApprovedError = undefined;
			await mediatedSalesTransactionHasBeenApproved
				.then(function (response) {
					mediatedSalesTransactionHasBeenApprovedFlag = response;
				})
				.catch(function (error) {
					// console.log('error =', error);
					mediatedSalesTransactionHasBeenApprovedError = error;
			});

			if (mediatedSalesTransactionHasBeenApprovedError !== undefined) {
				hideInfo();
				return showError(`Error encountered while calling the DecentralizedMarketplaceMediationContract.mediatedSalesTransactionHasBeenApproved(${mediatedSalesTransactionIpfsId}) ` +
					`method: ` + mediatedSalesTransactionHasBeenApprovedError);
			}

			if (mediatedSalesTransactionHasBeenApprovedFlag === undefined) {
				hideInfo();
				return showError(`Error encountered while calling the ` +
					`DecentralizedMarketplaceMediationContract.mediatedSalesTransactionHasBeenApproved(${mediatedSalesTransactionIpfsId}) method!`);
			}

			console.log('mediatedSalesTransactionHasBeenApprovedFlag =', mediatedSalesTransactionHasBeenApprovedFlag);

			var mediatedSalesTransactionHasBeenDisapproved = PROMISIFY(cb => decentralizedMarketplaceMediationContract.mediatedSalesTransactionHasBeenDisapproved(mediatedSalesTransactionIpfsId, cb));
			let mediatedSalesTransactionHasBeenDisapprovedFlag = undefined;
			let mediatedSalesTransactionHasBeenDisapprovedError = undefined;
			await mediatedSalesTransactionHasBeenDisapproved
				.then(function (response) {
					mediatedSalesTransactionHasBeenDisapprovedFlag = response;
				})
				.catch(function (error) {
					// console.log('error =', error);
					mediatedSalesTransactionHasBeenDisapprovedError = error;
			});

			if (mediatedSalesTransactionHasBeenDisapprovedError !== undefined) {
				hideInfo();
				return showError(`Error encountered while calling the DecentralizedMarketplaceMediationContract.mediatedSalesTransactionHasBeenDisapproved(${mediatedSalesTransactionIpfsId}) ` +
					`method: ` + mediatedSalesTransactionHasBeenDisapprovedError);
			}

			if (mediatedSalesTransactionHasBeenDisapprovedFlag === undefined) {
				hideInfo();
				return showError(`Error encountered while calling the ` +
					`DecentralizedMarketplaceMediationContract.mediatedSalesTransactionHasBeenDisapproved(${mediatedSalesTransactionIpfsId}) method!`);
			}

			console.log('mediatedSalesTransactionHasBeenDisapprovedFlag =', mediatedSalesTransactionHasBeenDisapprovedFlag);

			// Do filtering here to only take the ones that align with the Filter...
			if (filterNeitherApprovedNorDisapprovedFlag) {
				if (mediatedSalesTransactionHasBeenApprovedFlag || mediatedSalesTransactionHasBeenDisapprovedFlag) {
					continue;
				}
			}
			else if (filterApprovedOnlyFlag) {
				if (!mediatedSalesTransactionHasBeenApprovedFlag) {
					continue;
				}
			}
			else if (filterDisapprovedOnlyFlag) {
				if (!mediatedSalesTransactionHasBeenDisapprovedFlag) {
					continue;
				}
			}

			var getBuyerEthereumAddress = PROMISIFY(cb => decentralizedMarketplaceMediationContract.mediatedSalesTransactionAddresses.call(mediatedSalesTransactionIpfsId, 0, cb));
			let buyerEthereumAddress = undefined;
			let getBuyerEthereumAddressError = undefined;
			await getBuyerEthereumAddress
				.then(function (response) {
					buyerEthereumAddress = response;
				})
				.catch(function (error) {
					// console.log('error =', error);
					getBuyerEthereumAddressError = error;
			});

			if (getBuyerEthereumAddressError !== undefined) {
				hideInfo();
				return showError(`Error encountered while calling the DecentralizedMarketplaceMediationContract.mediatedSalesTransactionAddresses(${mediatedSalesTransactionIpfsId}, 0) ` +
					`method: ` + getBuyerEthereumAddressError);
			}

			if (buyerEthereumAddress === undefined) {
				hideInfo();
				return showError(`Error encountered while calling the DecentralizedMarketplaceMediationContract.mediatedSalesTransactionAddresses(${mediatedSalesTransactionIpfsId}, 0) method!`);
			}

			console.log('buyerEthereumAddress =', buyerEthereumAddress);

			var getSellerEthereumAddress = PROMISIFY(cb => decentralizedMarketplaceMediationContract.mediatedSalesTransactionAddresses.call(mediatedSalesTransactionIpfsId, 1, cb));
			let sellerEthereumAddress = undefined;
			let getSellerEthereumAddressError = undefined;
			await getSellerEthereumAddress
				.then(function (response) {
					sellerEthereumAddress = response;
				})
				.catch(function (error) {
					// console.log('error =', error);
					getSellerEthereumAddressError = error;
			});

			if (getSellerEthereumAddressError !== undefined) {
				hideInfo();
				return showError(`Error encountered while calling the DecentralizedMarketplaceMediationContract.mediatedSalesTransactionAddresses(${mediatedSalesTransactionIpfsId}, 1) ` +
					`method: ` + getSellerEthereumAddressError);
			}

			if (sellerEthereumAddress === undefined) {
				hideInfo();
				return showError(`Error encountered while calling the DecentralizedMarketplaceMediationContract.mediatedSalesTransactionAddresses(${mediatedSalesTransactionIpfsId}, 1) method!`);
			}

			console.log('sellerEthereumAddress =', sellerEthereumAddress);

			var getMediatorEthereumAddress = PROMISIFY(cb => decentralizedMarketplaceMediationContract.mediatedSalesTransactionAddresses.call(mediatedSalesTransactionIpfsId, 2, cb));
			let mediatorEthereumAddress = undefined;
			let getMediatorEthereumAddressError = undefined;
			await getMediatorEthereumAddress
				.then(function (response) {
					mediatorEthereumAddress = response;
				})
				.catch(function (error) {
					// console.log('error =', error);
					getMediatorEthereumAddressError = error;
			});

			if (getMediatorEthereumAddressError !== undefined) {
				hideInfo();
				return showError(`Error encountered while calling the DecentralizedMarketplaceMediationContract.mediatedSalesTransactionAddresses(${mediatedSalesTransactionIpfsId}, 2) ` +
					`method: ` + getMediatorEthereumAddressError);
			}

			if (mediatorEthereumAddress === undefined) {
				hideInfo();
				return showError(`Error encountered while calling the DecentralizedMarketplaceMediationContract.mediatedSalesTransactionAddresses(${mediatedSalesTransactionIpfsId}, 2) method!`);
			}

			console.log('mediatorEthereumAddress =', mediatorEthereumAddress);

			var getSalesAmountInWei = PROMISIFY(cb => decentralizedMarketplaceMediationContract.mediatedSalesTransactionAmount.call(mediatedSalesTransactionIpfsId, cb));
			let salesAmountInETH = undefined;
			let getSalesAmountInWeiError = undefined;
			await getSalesAmountInWei
				.then(function (response) {
					let salesAmount_Metamask_X = response;
					let salesAmountInWei = convertMetamask_X_Value_to_IntegerString(salesAmount_Metamask_X);
					salesAmountInETH = covertWEI_StringValue_to_ETH_StringValue(salesAmountInWei);
				})
				.catch(function (error) {
					// console.log('error =', error);
					getMediatorEthereumAddressError = error;
			});

			if (getSalesAmountInWeiError !== undefined) {
				hideInfo();
				return showError(`Error encountered while calling the DecentralizedMarketplaceMediationContract.mediatedSalesTransactionAmount(${mediatedSalesTransactionIpfsId}) ` +
					`method: ` + getSalesAmountInWeiError);
			}

			if (salesAmountInETH === undefined) {
				hideInfo();
				return showError(`Error encountered while calling the DecentralizedMarketplaceMediationContract.mediatedSalesTransactionAmount(${mediatedSalesTransactionIpfsId}) method!`);
			}

			console.log('salesAmountInETH =', salesAmountInETH);

			let mediatedSalesTransactionRecord = {
					mediatedSalesTransactionIpfsId: mediatedSalesTransactionIpfsId,
					buyerEthereumAddress: buyerEthereumAddress,
					sellerEthereumAddress: sellerEthereumAddress,
					mediatorEthereumAddress: mediatorEthereumAddress,
					salesAmountInETH: salesAmountInETH,
					approved: mediatedSalesTransactionHasBeenApprovedFlag,
					disapproved: mediatedSalesTransactionHasBeenDisapprovedFlag
			}

			console.log('mediatedSalesTransactionRecord =', mediatedSalesTransactionRecord);

			currentMediatedSalesTransactionsGivenEthereumAddressInvolvedArray.push(mediatedSalesTransactionRecord);
		}

		createMediatedSalesTransactionsGivenEthereumAddressInvolvedTable();
		$('#textViewMediatedSalesTransactionsEthereumAddressIsInvolvedNumberInvolvedResults').val(currentMediatedSalesTransactionsGivenEthereumAddressInvolvedArray.length);
		hideInfo();
	}

	function clearViewDetailedInformationAboutItemBeingSoldBySeller() {
		$('#textViewDetailedInformationAboutItemBeingSoldBySellerEthereumAddress').val('');
		$('#textViewDetailedInformationAboutItemBeingSoldBySellerItemIpfsId').val('');
		$('#textViewDetailedInformationAboutItemBeingSoldBySellerName').val('');
		$('#textViewDetailedInformationAboutItemBeingSoldBySellerUnitPrice').val('');
		$('#textViewDetailedInformationAboutItemBeingSoldBySellerQuantityAvailable').val('');
		$('#textareaViewDetailedInformationAboutItemBeingSoldBySellerCategories').val('');
		$('#textareaViewDetailedInformationAboutItemBeingSoldBySellerDescription').val('');

		$('#pictureViewDetailedInformationAboutItemBeingSoldBySellerMainPicture').attr('src', '');
		$('#pictureViewDetailedInformationAboutItemBeingSoldBySellerMainPicture').attr('alt', '');
		$('#picturesViewDetailedInformationAboutItemBeingSoldBySellerOtherPicturesDiv').html('');
	}

	async function viewDetailedInformationAboutItemBeingSoldBySeller() {
		$('#textViewDetailedInformationAboutItemBeingSoldBySellerName').val('');
		$('#textViewDetailedInformationAboutItemBeingSoldBySellerUnitPrice').val('');
		$('#textViewDetailedInformationAboutItemBeingSoldBySellerQuantityAvailable').val('');
		$('#textareaViewDetailedInformationAboutItemBeingSoldBySellerCategories').val('');
		$('#textareaViewDetailedInformationAboutItemBeingSoldBySellerDescription').val('');

		$('#pictureViewDetailedInformationAboutItemBeingSoldBySellerMainPicture').attr('src', '');
		$('#pictureViewDetailedInformationAboutItemBeingSoldBySellerMainPicture').attr('alt', '');
		$('#picturesViewDetailedInformationAboutItemBeingSoldBySellerOtherPicturesDiv').html('');

		let ethereumPublicAddress = $('#textViewDetailedInformationAboutItemBeingSoldBySellerEthereumAddress').val().trim().toLowerCase();
		if (ethereumPublicAddress.length === 0) {
			showError('The Ethereum Public Address cannot be an empty string or consist only of white space. Please enter a ' +
				'Seller Ethereum Public Address value that is a 40-hex lowercase string.');
			return;
		}

		if (ethereumPublicAddress.startsWith("0x")) {
			if (ethereumPublicAddress.length > 2) {
				ethereumPublicAddress = ethereumPublicAddress.substring(2);
			}
		}

		if (!isValidPublicAddress(ethereumPublicAddress)) {
			showError("Entered Seller Ethereum Public Address is not a 40-hex valued lower case string. " +
				"Please enter a Seller Ethereum Public Address that is a 40-hex valued lower case string.");
			return;
		}

		ethereumPublicAddress = "0x" + ethereumPublicAddress;

		let itemIpfsHashId = $('#textViewDetailedInformationAboutItemBeingSoldBySellerItemIpfsId').val().trim();
		if (itemIpfsHashId.length === 0) {
			showError('The Item IPFS ID identifying an Item cannot be an empty string or consist only of white space. Please enter an ' +
				'Item IPFS ID value that has no spaces.');
			return;
		}

		makeSureMetamaskInstalled();

		showInfo(`Getting Detailed Information about Item ${itemIpfsHashId} Being Sold by Seller Ethereum Public Address ${ethereumPublicAddress} ....`);

		let decentralizedMarketplaceContract =
			web3.eth.contract(decentralizedMarketplaceContractABI).at(decentralizedMarketplaceContractAddress);

		var sellerExists =
				PROMISIFY(cb => decentralizedMarketplaceContract.sellerExists.call(ethereumPublicAddress, cb));
		let sellerExistsFlag = undefined;
		let sellerExistsError = undefined;
		await sellerExists
			.then(function (response) {
				console.log('sellerExists : response =', response);
				sellerExistsFlag = response;
			})
			.catch(function (error) {
				console.log('sellerExists : error =', error);
				sellerExistsError = error;
  		});

  		if (sellerExistsError !== undefined) {
			hideInfo();
			return showError("Error encountered while calling the DecentralizedMarketplaceContract.sellerExists method: " +
				sellerExistsError);
		}

		if (sellerExistsFlag === undefined) {
			hideInfo();
			return showError("Error encountered while calling the DecentralizedMarketplaceContract.sellerExists method!");
		}

		console.log('sellerExistsFlag =', sellerExistsFlag);
		if (!sellerExistsFlag) {
			hideInfo();
			return showError(`Ethereum Public Address ${ethereumPublicAddress} is not listed as a Seller in the Franklin Decentralized Marketplace!`);
		}

		var itemForSaleFromSellerExists = PROMISIFY(cb => decentralizedMarketplaceContract.itemForSaleFromSellerExists(ethereumPublicAddress, itemIpfsHashId, cb));
		let itemForSaleFromSellerExistsFlag = undefined;
		let itemForSaleFromSellerExistsError = undefined;
		await itemForSaleFromSellerExists
			.then(function (response) {
				console.log('itemForSaleFromSellerExists : response =', response);
				itemForSaleFromSellerExistsFlag = response;
			})
			.catch(function (error) {
				console.log('itemForSaleFromSellerExists : error =', error);
				itemForSaleFromSellerExistsError = error;
  		});

  		if (itemForSaleFromSellerExistsError !== undefined) {
			hideInfo();
			return showError("Error encountered while calling the DecentralizedMarketplaceContract.itemForSaleFromSellerExists method: " +
				itemForSaleFromSellerExistsError);
		}

		if (itemForSaleFromSellerExistsFlag === undefined) {
			hideInfo();
			return showError("Error encountered while calling the DecentralizedMarketplaceContract.itemForSaleFromSellerExists method!");
		}

		console.log('itemForSaleFromSellerExistsFlag =', itemForSaleFromSellerExistsFlag);
		if (!itemForSaleFromSellerExistsFlag) {
			hideInfo();
			return showError(`No such Item IPFS ID "${itemIpfsHashId}" is sold by Seller Ethereum Public Address ${ethereumPublicAddress} in the Franklin Decentralized Marketplace!`);
		}

		let sellerAddress = ethereumPublicAddress;
		var getPriceOfItem = PROMISIFY(cb => decentralizedMarketplaceContract.getPriceOfItem(sellerAddress, itemIpfsHashId, cb));
		let priceOfItemInETH = undefined;
		let getPriceOfItemError = undefined;
		await getPriceOfItem
			.then(function (response) {
				console.log('getPriceOfItem : response =', response);
				let priceOfItemInWei_X = response;
				// let priceOfItemInWei = priceOfItemInWei_X.c[0];
				let priceOfItemInWei = convertMetamask_X_Value_to_IntegerString(priceOfItemInWei_X);

				// priceOfItemInETH = priceOfItemInWei / ETH;
				// priceOfItemInETH = web3.utils.fromWei(priceOfItemInWei, 'ether'); // did not work
				priceOfItemInETH = covertWEI_StringValue_to_ETH_StringValue(priceOfItemInWei);
			})
			.catch(function (error) {
				console.log('getPriceOfItem : error =', error);
				getPriceOfItemError = error;
		});

		if (getPriceOfItemError !== undefined) {
			hideInfo();
			return showError(`Error encountered while calling ` +
				`DecentralizedMarketplaceContract.getPriceOfItem(${sellerAddress}, ${itemIpfsHashId}) method: ` +
				`${getPriceOfItemError}`);
		}

		if (priceOfItemInETH === undefined) {
			hideInfo();
			return showError(`Error encountered while calling DecentralizedMarketplaceContract.getPriceOfItem(${sellerAddress}, ${itemIpfsHashId}) method!`);
		}

		console.log('priceOfItemInETH =', priceOfItemInETH);

		var getQuantityAvailableForSaleOfAnItemBySeller =
				PROMISIFY(cb => decentralizedMarketplaceContract.getQuantityAvailableForSaleOfAnItemBySeller(sellerAddress, itemIpfsHashId, cb));
		let quantityAvailableForSaleOfItem = undefined;
		let getQuantityAvailableForSaleOfAnItemBySellerError = undefined;
		await getQuantityAvailableForSaleOfAnItemBySeller
			.then(function (response) {
				console.log('getQuantityAvailableForSaleOfAnItemBySeller : response =', response);
				let quantityAvailableForSaleOfItem_X = response;
				quantityAvailableForSaleOfItem = convertMetamask_X_Value_to_IntegerString(quantityAvailableForSaleOfItem_X);
			})
			.catch(function (error) {
				console.log('getQuantityAvailableForSaleOfAnItemBySeller : error =', error);
				getQuantityAvailableForSaleOfAnItemBySellerError = error;
		});

		if (getQuantityAvailableForSaleOfAnItemBySellerError !== undefined) {
			hideInfo();
			return showError(`Error encountered while calling ` +
				`DecentralizedMarketplaceContract.getQuantityAvailableForSaleOfAnItemBySeller(${sellerAddress}, ${itemIpfsHashId}) method: ` +
				`${getQuantityAvailableForSaleOfAnItemBySellerError}`);
		}

		if (quantityAvailableForSaleOfItem === undefined) {
			hideInfo();
			return showError(`Error encountered while calling DecentralizedMarketplaceContract.getQuantityAvailableForSaleOfAnItemBySelle(${sellerAddress}, ${itemIpfsHashId}) ` +
				`method!`);
		}

		console.log('quantityAvailableForSaleOfItem =', quantityAvailableForSaleOfItem);

		var ipfsFileGetForItem = PROMISIFY(cb => IPFS.get(itemIpfsHashId, {timeout: '8000ms'}, cb));
		let ipfsFileGetForItemJson = undefined;
		let ipfsFileGetForItemError = undefined;
		await ipfsFileGetForItem
			.then(function (response) {
				console.log('ipfsFileGetForItem : response =', response);
				let ipfsFileGetForItemJsonString = response[0].content.toString();
				ipfsFileGetForItemJson = JSON.parse(ipfsFileGetForItemJsonString);
			})
			.catch(function (error) {
				console.log('ipfsFileGetForItem : error =', error);
				ipfsFileGetForItemError = error;
		});

		if (ipfsFileGetForItemError !== undefined) {
			hideInfo();
			return showError(`Error encountered while calling IPFS.get(${itemIpfsHashId}) method: ${ipfsFileGetForItemError}`);
		}

		if (ipfsFileGetForItemJson === undefined) {
			hideInfo();
			return showError(`Error encountered while calling IPFS.get(${itemIpfsHashId}) method!`);
		}

		console.log('ipfsFileGetForItemJson =', ipfsFileGetForItemJson);

		$('#textViewDetailedInformationAboutItemBeingSoldBySellerName').val(ipfsFileGetForItemJson.name);
		$('#textViewDetailedInformationAboutItemBeingSoldBySellerUnitPrice').val(priceOfItemInETH);
		$('#textViewDetailedInformationAboutItemBeingSoldBySellerQuantityAvailable').val(quantityAvailableForSaleOfItem);
		$('#textareaViewDetailedInformationAboutItemBeingSoldBySellerDescription').val(ipfsFileGetForItemJson.description);

		let categoriesStr = '';
		let lastCategoryIndex = ipfsFileGetForItemJson.categories.length - 1;
		for (let i = 0; i < ipfsFileGetForItemJson.categories.length; i++) {
			categoriesStr += ipfsFileGetForItemJson.categories[i];
			if (i < lastCategoryIndex) {
				categoriesStr += '\n';
			}
		}

		$('#textareaViewDetailedInformationAboutItemBeingSoldBySellerCategories').val(categoriesStr);

		let otherPictures = ipfsFileGetForItemJson.pictures;
		if (ipfsFileGetForItemJson.mainPicture === EMPTY_STRING && ipfsFileGetForItemJson.pictures.length > 0) {
			ipfsFileGetForItemJson.mainPicture = ipfsFileGetForItemJson.pictures[0];
		}

		if (ipfsFileGetForItemJson.mainPicture === EMPTY_STRING) {
			$('#pictureViewDetailedInformationAboutItemBeingSoldBySellerMainPicture').attr('src', '');
			$('#pictureViewDetailedInformationAboutItemBeingSoldBySellerMainPicture').attr('alt', '');
		}
		else {
			$('#pictureViewDetailedInformationAboutItemBeingSoldBySellerMainPicture').attr('src', `https://ipfs.infura.io/ipfs/${ipfsFileGetForItemJson.mainPicture}`);
			$('#pictureViewDetailedInformationAboutItemBeingSoldBySellerMainPicture').attr('alt', `${ipfsFileGetForItemJson.mainPicture}`);
		}

		let otherPicturesHtml = '';
		for (let i = 0; i < ipfsFileGetForItemJson.pictures.length; i++) {
			otherPicturesHtml += `<img src="https://ipfs.infura.io/ipfs/${ipfsFileGetForItemJson.pictures[i]}" alt="${ipfsFileGetForItemJson.pictures[i]}"/>`;
		}

		$('#picturesViewDetailedInformationAboutItemBeingSoldBySellerOtherPicturesDiv').html(otherPicturesHtml);
		hideInfo();
	}

	async function getCurrentItemsBeingSoldBySeller() {
		currentItemsBeingSoldByGivenSellerArray = [ ];
		createCurrentItemsBeingSoldByGivenSellerTable();
		$('#textViewCurrentItemsBeingSoldByCurrentSellerNumberOfDifferentItemsBeingSoldByGivenSellerResults').val('');

		let ethereumPublicAddress = $('#textViewCurrentItemsBeingSoldByCurrentSellerEthereumAddress').val().trim().toLowerCase();
		if (ethereumPublicAddress.length === 0) {
			showError('The Ethereum Public Address cannot be an empty string or consist only of white space. Please enter a ' +
				'Seller Ethereum Public Address value that is a 40-hex lowercase string.');
			return;
		}

		if (ethereumPublicAddress.startsWith("0x")) {
			if (ethereumPublicAddress.length > 2) {
				ethereumPublicAddress = ethereumPublicAddress.substring(2);
			}
		}

		if (!isValidPublicAddress(ethereumPublicAddress)) {
			showError("Entered Seller Ethereum Public Address is not a 40-hex valued lower case string. " +
				"Please enter a Seller Ethereum Public Address that is a 40-hex valued lower case string.");
			return;
		}

		ethereumPublicAddress = "0x" + ethereumPublicAddress;

		makeSureMetamaskInstalled();

		showInfo(`Getting Current Items Being Sold by Seller Ethereum Public Address: ${ethereumPublicAddress} ....`);

		let decentralizedMarketplaceContract =
			web3.eth.contract(decentralizedMarketplaceContractABI).at(decentralizedMarketplaceContractAddress);

		var sellerExists =
				PROMISIFY(cb => decentralizedMarketplaceContract.sellerExists.call(ethereumPublicAddress, cb));
		let sellerExistsFlag = undefined;
		let sellerExistsError = undefined;
		await sellerExists
			.then(function (response) {
				console.log('sellerExists : response =', response);
				sellerExistsFlag = response;
			})
			.catch(function (error) {
				console.log('sellerExists : error =', error);
				sellerExistsError = error;
  		});

  		if (sellerExistsError !== undefined) {
			hideInfo();
			return showError("Error encountered while calling the DecentralizedMarketplaceContract.sellerExists method: " +
				sellerExistsError);
		}

		if (sellerExistsFlag === undefined) {
			hideInfo();
			return showError("Error encountered while calling the DecentralizedMarketplaceContract.sellerExists method!");
		}

		console.log('sellerExistsFlag =', sellerExistsFlag);
		if (!sellerExistsFlag) {
			hideInfo();
			return showError(`Ethereum Public Address ${ethereumPublicAddress} is not listed as a Seller in the Franklin Decentralized Marketplace!`);
		}

		var getNumberOfDifferentItemsSoldBySeller =
				PROMISIFY(cb => decentralizedMarketplaceContract.getNumberOfDifferentItemsBeingSoldBySeller(ethereumPublicAddress, cb));
		let numberOfDifferentItemsSoldBySeller = undefined;
		let getNumberOfDifferentItemsSoldBySellerError = undefined;
		await getNumberOfDifferentItemsSoldBySeller
			.then(function (response) {
				console.log('getNumberOfDifferentItemsSoldBySeller : response =', response);
				let numberOfDifferentItemsSoldBySeller_X = response;
				// numberOfDifferentItemsSoldBySeller = numberOfDifferentItemsSoldBySeller_X.c[0];
				numberOfDifferentItemsSoldBySeller = BigInt(convertMetamask_X_Value_to_IntegerString(numberOfDifferentItemsSoldBySeller_X));
			})
			.catch(function (error) {
				console.log('getNumberOfDifferentItemsSoldBySeller  : error =', error);
				getNumberOfDifferentItemsSoldBySellerError = error;
  		});

  		if (getNumberOfDifferentItemsSoldBySellerError !== undefined) {
			hideInfo();
			return showError(`Error encountered while calling ` +
				`DecentralizedMarketplaceContract.getNumberOfDifferentItemsBeingSoldBySeller(${ethereumPublicAddress}) method: ` +
				`${getNumberOfDifferentItemsSoldBySellerError}`);
		}

		if (numberOfDifferentItemsSoldBySeller === undefined) {
			hideInfo();
			return showError(`Error encountered while calling DecentralizedMarketplaceContract.getNumberOfDifferentItemsBeingSoldBySeller(${ethereumPublicAddress}) method!`);
		}

		console.log('numberOfDifferentItemsSoldBySeller =', numberOfDifferentItemsSoldBySeller);

		let categoryFilter = $('#textViewCurrentItemsBeingSoldByCurrentSellerFilterByOneCategory').val().trim().toLowerCase();

		for (let i = BigInt(0); i < numberOfDifferentItemsSoldBySeller; i++) {
			var getItemForSale = PROMISIFY(cb => decentralizedMarketplaceContract.getItemForSale(ethereumPublicAddress, i, cb));
			let itemIpfsHashId = undefined;
			let getItemForSaleError = undefined;
			await getItemForSale
				.then(function (response) {
					console.log('getItemForSale : response =', response);
					itemIpfsHashId  = response;
				})
				.catch(function (error) {
					console.log('getNumberOfDifferentItemsSoldBySeller  : error =', error);
					getItemForSaleError = error;
			});

			if (getItemForSaleError !== undefined) {
				hideInfo();
				return showError(`Error encountered while calling ` +
					`DecentralizedMarketplaceContract.getItemForSale(${ethereumPublicAddress}, ${i}) method: ` +
					`${getItemForSaleError}`);
			}

			if (itemIpfsHashId === undefined) {
				hideInfo();
				return showError(`Error encountered while calling DecentralizedMarketplaceContract.getItemForSale(${ethereumPublicAddress}, ${i}) method!`);
			}

			console.log('itemIpfsHashId =', itemIpfsHashId);

			var getPriceOfItem = PROMISIFY(cb => decentralizedMarketplaceContract.getPriceOfItem(ethereumPublicAddress, itemIpfsHashId, cb));
			let priceOfItemInETH = undefined;
			let getPriceOfItemError = undefined;
			await getPriceOfItem
				.then(function (response) {
					console.log('getPriceOfItem : response =', response);
					let priceOfItemInWei_X = response;
					// let priceOfItemInWei = priceOfItemInWei_X.c[0];
					let priceOfItemInWei = convertMetamask_X_Value_to_IntegerString(priceOfItemInWei_X);

					console.log('priceOfItemInWei =', priceOfItemInWei);
					// priceOfItemInETH = priceOfItemInWei / ETH;
					// priceOfItemInETH = web3.utils.fromWei(priceOfItemInWei, 'ether'); // did not work!
					priceOfItemInETH = covertWEI_StringValue_to_ETH_StringValue(priceOfItemInWei);
				})
				.catch(function (error) {
					console.log('getPriceOfItem : error =', error);
					getPriceOfItemError = error;
			});

			if (getPriceOfItemError !== undefined) {
				hideInfo();
				return showError(`Error encountered while calling ` +
					`DecentralizedMarketplaceContract.getPriceOfItem(${ethereumPublicAddress}, ${itemIpfsHashId}) method: ` +
					`${getPriceOfItemError}`);
			}

			if (priceOfItemInETH === undefined) {
				hideInfo();
				return showError(`Error encountered while calling DecentralizedMarketplaceContract.getPriceOfItem(${ethereumPublicAddress}, ${itemIpfsHashId}) method!`);
			}

			console.log('priceOfItemInETH =', priceOfItemInETH);

			var getQuantityAvailableForSaleOfAnItemBySeller =
					PROMISIFY(cb => decentralizedMarketplaceContract.getQuantityAvailableForSaleOfAnItemBySeller(ethereumPublicAddress, itemIpfsHashId, cb));
			let quantityAvailableForSaleOfItem = undefined;
			let getQuantityAvailableForSaleOfAnItemBySellerError = undefined;
			await getQuantityAvailableForSaleOfAnItemBySeller
				.then(function (response) {
					console.log('getQuantityAvailableForSaleOfAnItemBySeller : response =', response);
					let quantityAvailableForSaleOfItem_X = response;
					// quantityAvailableForSaleOfItem = quantityAvailableForSaleOfItem_X.c[0];
					quantityAvailableForSaleOfItem = BigInt(convertMetamask_X_Value_to_IntegerString(quantityAvailableForSaleOfItem_X));
				})
				.catch(function (error) {
					console.log('getQuantityAvailableForSaleOfAnItemBySeller : error =', error);
					getQuantityAvailableForSaleOfAnItemBySellerError = error;
			});

			if (getQuantityAvailableForSaleOfAnItemBySellerError !== undefined) {
				hideInfo();
				return showError(`Error encountered while calling ` +
					`DecentralizedMarketplaceContract.getQuantityAvailableForSaleOfAnItemBySeller(${ethereumPublicAddress}, ${itemIpfsHashId}) method: ` +
					`${getQuantityAvailableForSaleOfAnItemBySellerError}`);
			}

			if (quantityAvailableForSaleOfItem === undefined) {
				hideInfo();
				return showError(`Error encountered while calling DecentralizedMarketplaceContract.getQuantityAvailableForSaleOfAnItemBySelle(${ethereumPublicAddress}, ${itemIpfsHashId}) ` +
							`method!`);
			}

			console.log('quantityAvailableForSaleOfItem.toString() =', quantityAvailableForSaleOfItem.toString());

			var ipfsFileGetForItem = PROMISIFY(cb => IPFS.get(itemIpfsHashId, {timeout: '8000ms'}, cb));
			let ipfsFileGetForItemJson = undefined;
			let ipfsFileGetForItemError = undefined;
			await ipfsFileGetForItem
				.then(function (response) {
					console.log('ipfsFileGetForItem : response =', response);
					let ipfsFileGetForItemJsonString = response[0].content.toString();
					ipfsFileGetForItemJson = JSON.parse(ipfsFileGetForItemJsonString);
				})
				.catch(function (error) {
					console.log('ipfsFileGetForItem : error =', error);
					ipfsFileGetForItemError = error;
			});

			if (ipfsFileGetForItemError !== undefined) {
				hideInfo();
				return showError(`Error encountered while calling IPFS.get(${itemIpfsHashId}) method: ${ipfsFileGetForItemError}`);
			}

			if (ipfsFileGetForItemJson === undefined) {
				hideInfo();
				return showError(`Error encountered while calling IPFS.get(${itemIpfsHashId}) method!`);
			}

			console.log('ipfsFileGetForItemJson =', ipfsFileGetForItemJson);

			let itemRecord = {
					itemIpfsHashId: itemIpfsHashId,
					name: ipfsFileGetForItemJson.name,
					picture: ipfsFileGetForItemJson.mainPicture,
					unitPriceEth: priceOfItemInETH,
					quantityAvailable: quantityAvailableForSaleOfItem.toString()
			}

			// Coding Technique Reference --> https://stackoverflow.com/questions/29719329/convert-array-into-upper-case/29719347
			ipfsFileGetForItemJson.categories = ipfsFileGetForItemJson.categories.map(function(x){ return x.trim().toLowerCase() })

			if (categoryFilter !== EMPTY_STRING) {
				// Coding Technique Reference --> https://www.w3schools.com/jsref/jsref_includes_array.asp
				// Coding Technique Reference --> https://www.w3schools.com/jsref/jsref_tostring_array.asp
				if (ipfsFileGetForItemJson.categories.toString().includes(categoryFilter)) {
					currentItemsBeingSoldByGivenSellerArray.push(itemRecord);
				}
			} else {
				currentItemsBeingSoldByGivenSellerArray.push(itemRecord);
			}
		}

		createCurrentItemsBeingSoldByGivenSellerTable();
		$('#textViewCurrentItemsBeingSoldByCurrentSellerNumberOfDifferentItemsBeingSoldByGivenSellerResults').val(convertNumberToString(currentItemsBeingSoldByGivenSellerArray.length));
		hideInfo();
	}

	async function getCurrentSellers() {
		makeSureMetamaskInstalled();

		showInfo("Getting Current Sellers in Franklin Decentralized Marketplace....");
		clearCurrentSellersResults();

		let decentralizedMarketplaceContract =
			web3.eth.contract(decentralizedMarketplaceContractABI).at(decentralizedMarketplaceContractAddress);

		var getNumberOfSellers = PROMISIFY(cb => decentralizedMarketplaceContract.getNumberOfSellers(cb));
		let numberOfSellersX = undefined;
		let numberOfSellersError = undefined;
		await getNumberOfSellers
			.then(function (response) {
				numberOfSellersX = response;
			})
			.catch(function (error) {
				// console.log('error =', error);
				numberOfSellersError = error;
  		});

  		if (numberOfSellersX === undefined) {
			hideInfo();
			return showError("Error encountered while calling the DecentralizedMarketplaceContract.getNumberOfSellers method: " +
				numberOfSellersError);
		}

		console.log('numberOfSellersX =', numberOfSellersX);
		// let numberOfSellers = numberOfSellersX.c[0];
		let numberOfSellers = BigInt(convertMetamask_X_Value_to_IntegerString(numberOfSellersX));
		console.log('numberOfSellers =', numberOfSellers)

		$('#numberOfCurrentSellersViewCurrentSellersResults').val(numberOfSellers.toString());

		currentSellersArray = [ ];
		for (let i = BigInt(0); i < numberOfSellers; i++) {
			var getSellerAddress = PROMISIFY(cb => decentralizedMarketplaceContract.getSellerAddress(i, cb));
			let sellerAddress = undefined;
			let getSellerAddressError = undefined;
			await getSellerAddress
				.then(function (response) {
					sellerAddress = response;
					console.log('getSellerAddress : response =', response);
				})
				.catch(function (error) {
					console.log('getSellerAddress : error =', error);
					getSellerAddressError = error;
  			});

  			if (getSellerAddressError !== undefined) {
				hideInfo();
				return showError("Error encountered while calling the DecentralizedMarketplaceContract.getSellerAddress method: " +
					getSellerAddressError);
			}

			if (sellerAddress === undefined) {
				hideInfo();
				return showError("Error encountered while calling the DecentralizedMarketplaceContract.getSellerAddress method!");
			}

			var getIpfsDescriptionInfoAboutSeller =
					PROMISIFY(cb => decentralizedMarketplaceContract.getSellerIpfsHashDescription(sellerAddress, cb));
			let ipfsHashDescOfSeller = undefined;
			let getIpfsDescriptionInfoAboutSellerError = undefined;
			await getIpfsDescriptionInfoAboutSeller
				.then(function (response) {
					ipfsHashDescOfSeller = response;
					console.log('getIpfsDescriptionInfoAboutSeller : response =', response);
				})
				.catch(function (error) {
					console.log('getIpfsDescriptionInfoAboutSeller : error =', error);
					getIpfsDescriptionInfoAboutSellerError = error;
  			});

  			if (getIpfsDescriptionInfoAboutSellerError !== undefined) {
				hideInfo();
				return showError("Error encountered while calling the DecentralizedMarketplaceContract.getSellerIpfsHashDescription method: " +
					getIpfsDescriptionInfoAboutSellerError);
			}

			if (ipfsHashDescOfSeller === undefined) {
				hideInfo();
				return showError("Error encountered while calling the DecentralizedMarketplaceContract.getSellerIpfsHashDescription method!");
			}

			console.log('getCurrentSellers : ipfsHashDescOfSeller =', ipfsHashDescOfSeller);
			if (ipfsHashDescOfSeller === EMPTY_STRING) {
				console.log('    getCurrentSellers : ipfsHashDescOfSeller = EMPTY_STRING');
			}

			let ipfsFileGetForSellerJson = undefined;
			let ipfsFileGetForSellerError = undefined;
			if (ipfsHashDescOfSeller === EMPTY_STRING) {
				ipfsFileGetForSellerJson = {
					name: '',
					physicalAddress: '',
					mailingAddress: '',
					website: '',
					email: '',
					phone: '',
					fax: '',
					description: '',
					picture: ''
				}
			}
			else {
			var ipfsFileGetForSeller = PROMISIFY(cb => IPFS.get(ipfsHashDescOfSeller, {timeout: '8000ms'}, cb));
				await ipfsFileGetForSeller
					.then(function (response) {
						console.log('ipfsFileGetForSeller : response =', response);
						let ipfsFileGetForSellerJsonString = response[0].content.toString();
						ipfsFileGetForSellerJson = JSON.parse(ipfsFileGetForSellerJsonString);
					})
					.catch(function (error) {
						console.log('ipfsFileGetForSeller : error =', error);
						ipfsFileGetForSellerError = error;
				});

				if (ipfsFileGetForSellerError !== undefined) {
					hideInfo();
					return showError(`Error encountered while calling IPFS.get(${ipfsHashDescOfSeller}) method: ${ipfsFileGetForSellerError}`);
				}

				if (ipfsFileGetForSellerJson === undefined) {
					hideInfo();
					return showError(`Error encountered while calling IPFS.get(${ipfsHashDescOfSeller}) method!`);
				}
			}

			console.log('ipfsFileGetForSellerJson =', ipfsFileGetForSellerJson);

			var getNumberOfDifferentItemsSoldBySeller =
					PROMISIFY(cb => decentralizedMarketplaceContract.getNumberOfDifferentItemsBeingSoldBySeller(sellerAddress, cb));
			let numberOfDifferentItemsSoldBySeller = undefined;
			let getNumberOfDifferentItemsSoldBySellerError = undefined;
			await getNumberOfDifferentItemsSoldBySeller
				.then(function (response) {
					console.log('getNumberOfDifferentItemsSoldBySeller : response =', response);
					let numberOfDifferentItemsSoldBySeller_X = response;
					// numberOfDifferentItemsSoldBySeller = numberOfDifferentItemsSoldBySeller_X.c[0];
					numberOfDifferentItemsSoldBySeller = BigInt(convertMetamask_X_Value_to_IntegerString(numberOfDifferentItemsSoldBySeller_X));
				})
				.catch(function (error) {
					console.log('getNumberOfDifferentItemsSoldBySeller  : error =', error);
					getNumberOfDifferentItemsSoldBySellerError = error;
  			});

  			if (getNumberOfDifferentItemsSoldBySellerError !== undefined) {
				hideInfo();
				return showError(`Error encountered while calling ` +
					`DecentralizedMarketplaceContract.getNumberOfDifferentItemsBeingSoldBySeller(${sellerAddress}) method: ` +
					`${getNumberOfDifferentItemsSoldBySellerError}`);
			}

			if (numberOfDifferentItemsSoldBySeller === undefined) {
				hideInfo();
				return showError(`Error encountered while calling DecentralizedMarketplaceContract.getNumberOfDifferentItemsBeingSoldBySeller(${sellerAddress}) method!`);
			}

			console.log('numberOfDifferentItemsSoldBySeller =', numberOfDifferentItemsSoldBySeller);

			var sellerIsWillingToSellItemsViaMediator =
					PROMISIFY(cb => decentralizedMarketplaceContract.sellerIsWillingToSellItemsViaMediator(sellerAddress, cb));
			let sellerIsWillingToSellItemsViaMediatorFlag = undefined;
			let sellerIsWillingToSellItemsViaMediatorError = undefined;
			await sellerIsWillingToSellItemsViaMediator
				.then(function (response) {
					console.log('sellerIsWillingToSellItemsViaMediator : response =', response);
					sellerIsWillingToSellItemsViaMediatorFlag = response;
				})
				.catch(function (error) {
					console.log('sellerIsWillingToSellItemsViaMediator : error =', error);
					sellerIsWillingToSellItemsViaMediatorError = error;
			});

			if (sellerIsWillingToSellItemsViaMediatorError !== undefined) {
				hideInfo();
				return showError(`Error encountered while calling ` +
					`DecentralizedMarketplaceContract.sellerIsWillingToSellItemsViaMediator(${sellerAddress}) method: ` +
					`${sellerIsWillingToSellItemsViaMediatorError}`);
			}

			if (sellerIsWillingToSellItemsViaMediatorFlag === undefined) {
				hideInfo();
				return showError(`Error encountered while calling DecentralizedMarketplaceContract.sellerIsWillingToSellItemsViaMediator(${sellerAddress}) method!`);
			}

			console.log('sellerIsWillingToSellItemsViaMediatorFlag =', sellerIsWillingToSellItemsViaMediatorFlag);

			let sellerRecord = {
					ethereumAddress: sellerAddress,
					name: ipfsFileGetForSellerJson.name,
					picture: ipfsFileGetForSellerJson.picture,
					numberOfDifferentItemsSold: numberOfDifferentItemsSoldBySeller.toString(),
					sellerIsWillingToSellItemsViaMediator: sellerIsWillingToSellItemsViaMediatorFlag
			}

			currentSellersArray.push(sellerRecord);
		}

		createViewSellersTable();
		hideInfo();
	}

	async function getCurrentMediators() {
		makeSureMetamaskInstalled();

		showInfo("Getting Current Mediators in Franklin Decentralized Marketplace....");
		clearCurrentMediatorsResults();

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
		// let numberOfMediators = numberOfMediatorsX.c[0];
		let numberOfMediators = BigInt(convertMetamask_X_Value_to_IntegerString(numberOfMediatorsX));
		console.log('numberOfMediators =', numberOfMediators)

		$('#numberOfCurrentMediatorsViewCurrentMediatorsResults').val(numberOfMediators.toString());

		currentMediatorsArray = [ ];
		for (let i = BigInt(0); i < numberOfMediators; i++) {
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
					getIpfsDescriptionInfoAboutMediatorError = error;
  			});

  			if (getIpfsDescriptionInfoAboutMediatorError !== undefined) {
				hideInfo();
				return showError("Error encountered while calling the DecentralizedMarketplaceMediationContract.descriptionInfoAboutMediators method: " +
					getIpfsDescriptionInfoAboutMediatorError);
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
				return showError(`Error encountered while calling IPFS.get(${ipfsHashDescOfMediator}) method: ${ipfsFileGetForMediatorError}`);
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
					// numberOfMediationsMediatorInvolved = numberOfMediationsMediatorInvolved_X.c[0];
					numberOfMediationsMediatorInvolved = BigInt(convertMetamask_X_Value_to_IntegerString(numberOfMediationsMediatorInvolved_X));
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

			if (numberOfMediationsMediatorInvolved === undefined) {
				hideInfo();
				return showError(`Error encountered while calling DecentralizedMarketplaceMediationContract.numberOfMediationsMediatorInvolved(${mediatorAddress}) method!`);
			}

			console.log('numberOfMediationsMediatorInvolved =', numberOfMediationsMediatorInvolved);

			let mediatorRecord = {
					ethereumAddress: mediatorAddress,
					name: ipfsFileGetForMediatorJson.name,
					picture: ipfsFileGetForMediatorJson.picture,
					numberOfMediationsInvolved: numberOfMediationsMediatorInvolved.toString()
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
        var number_of_cols = 5;

        var table_body = '<table style="width:100%">';
        table_body += '<tr>';
		table_body += '<th>Ethereum Address</th>';
		table_body += '<th>Name</th>';
		table_body += '<th>Picture</th>';
		table_body += '<th>Number of Different Items Sold</th>';
		table_body += '<th>Willing to Sell via Mediator</th>';
  		table_body += '</tr>';

        for (var i = 0 ; i < number_of_rows; i++) {
			table_body += '<tr>';
            for (var j = 0; j < number_of_cols; j++) {
            	table_body += '<td>';

				let rowData = currentSellersArray[i];
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
				else if (j === 4) {
					table_data += rowData.sellerIsWillingToSellItemsViaMediator;
				}

                table_body += table_data;
                table_body += '</td>';
             }

             table_body += '</tr>';
        }

        table_body += '</table>';
        $('#currentSellersViewTableResultsDiv').html(table_body);
	}

	function createCurrentItemsBeingSoldByGivenSellerTable() {
        var number_of_rows = currentItemsBeingSoldByGivenSellerArray.length;
        var number_of_cols = 5;

        var table_body = '<table style="width:100%">';
        table_body += '<tr>';
		table_body += '<th>Item IPFS ID</th>';
		table_body += '<th>Name</th>';
		table_body += '<th>Picture</th>';
		table_body += '<th>Unit Price (ETH)</th>';
		table_body += '<th>Quantity Available</th>';
  		table_body += '</tr>';

        for (var i = 0 ; i < number_of_rows; i++) {
			table_body += '<tr>';
            for (var j = 0; j < number_of_cols; j++) {
            	table_body += '<td>';

				let rowData = currentItemsBeingSoldByGivenSellerArray[i];
                let table_data = '';
                if (j === 0) {
					table_data += rowData.itemIpfsHashId;
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
					table_data += rowData.unitPriceEth;
				}
				else if (j === 4) {
					table_data += rowData.quantityAvailable;
				}

                table_body += table_data;
                table_body += '</td>';
             }

             table_body += '</tr>';
        }

        table_body += '</table>';
        $('#currentItemsBeingSoldByCurrentSellerViewTableResultsDiv').html(table_body);
	}

    function createMediatedSalesTransactionsGivenEthereumAddressInvolvedTable() {
        var number_of_rows = currentMediatedSalesTransactionsGivenEthereumAddressInvolvedArray.length;
        var number_of_cols = 7;

        var table_body = '<table style="width:100%">';
        table_body += '<tr>';
		table_body += '<th>Mediated Sales Transaction IPFS ID</th>';
		table_body += '<th>Buyer Ethereum Address</th>';
		table_body += '<th>Seller Ethereum Address</th>';
		table_body += '<th>Mediator Ethereum Address</th>';
		table_body += '<th>Sales Amount (in ETH)</th>';
		table_body += '<th>Approved</th>';
		table_body += '<th>Disapproved</th>';
  		table_body += '</tr>';

        for (var i = 0 ; i < number_of_rows; i++) {
			table_body += '<tr>';
            for (var j = 0; j < number_of_cols; j++) {
            	table_body += '<td>';

				let rowData = currentMediatedSalesTransactionsGivenEthereumAddressInvolvedArray[i];
                let table_data = '';
                if (j === 0) {
					table_data += rowData.mediatedSalesTransactionIpfsId;
				}
				else if (j === 1) {
					table_data += rowData.buyerEthereumAddress;
				}
				else if (j === 2) {
					table_data += rowData.sellerEthereumAddress;
				}
				else if (j === 3) {
					table_data += rowData.mediatorEthereumAddress;
				}
				else if (j === 4) {
					table_data += rowData.salesAmountInETH;
				}
				else if (j === 5) {
					table_data += rowData.approved;
				}
				else if (j === 6) {
					table_data += rowData.disapproved;
				}

                table_body += table_data;
                table_body += '</td>';
             }

             table_body += '</tr>';
        }

        table_body += '</table>';
        $('#viewMediatedSalesTransactionsEthereumAddressIsInvolvedTableResultsDiv').html(table_body);
	}

	// Reference --> https://www.reddit.com/r/ethdev/comments/8dyfyr/how_to_make_metamask_accept_promiseswait_for
	// Not using below, but was a good educational experience on using PROMISE
	/*
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
	*/

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