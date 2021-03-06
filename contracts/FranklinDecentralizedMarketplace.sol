pragma solidity >=0.4.22 <0.6.0;

import "./GeneralUtilities.sol";
import "./FranklinDecentralizedMarketplaceMediation.sol";

contract FranklinDecentralizedMarketplace {
    using GeneralUtilities for *;
    
    // This Smart Contract serves as a Decentralized Marketplace of Buyers, Sellers, and Mediators. 

    // The Contract code had to be split in two, because the Etherum Virtual Machine (EVM) would not allow deployment of a Contract
    // that has more than 24576 bytes. So, the decision was made to SPLIT the code into the FranklinDecentralizedMarketplace 
    // and FranklinDecentralizedMarketplaceMediation Contracts. 
    //
    // So, this FranklinDecentralizedMarketplace Contract handles most of the functionality pertaining to the Franklin Decentralized Marketplace Smart Contract functionality, while MOST of the
    // functionality dealing with Mediated Sales Transactions is done by the FranklinDecentralizedMarketplaceMediation Smart Contract. 
    
    // Each Item being sold in this Decentralized Marketplace is identified by it's IPFS (InterPlanetary File System) Hash. Information about each item being sold is in a JSON-formatted
    // string stored in the IPFS (InterPlanetary File System) that may be accessed via the Infura IPFS Gateway URL. So, for example, let's say that an Item being sold by a Seller has an
    // IPFS Hash of QmZ4DZ1spT2eQhUC5mfQGugM4AhLjq8ZvuZvHdQvnvKnHH. Then, the information about this Item may be seen in one of the following URLs:
    // 1) https://ipfs.infura.io/ipfs/QmZ4DZ1spT2eQhUC5mfQGugM4AhLjq8ZvuZvHdQvnvKnHH
    // 2) https://gateway.ipfs.io/ipfs/QmZ4DZ1spT2eQhUC5mfQGugM4AhLjq8ZvuZvHdQvnvKnH
    
    // Each Seller in this Decentralized Marketplace is identified by it's Ethereum Address, but should also have information about himself/herself that is in the 
    // IPFS (InterPlanetary File System) Hash. Information about each Seller is in a JSON-formatted
    // string stored in the IPFS (InterPlanetary File System) that may be accessed via the Infura IPFS Gateway URL. So, for example, let's say that Seller has an
    // IPFS Hash of QmZ4DZ1spT2eQhUC5mfQGugM4AhLjq8ZvuZvHdQvnvKnHH describing himself/herself. Then, the information about this Seller may be seen in one of the following URLs:
    // 1) https://ipfs.infura.io/ipfs/QmZ4DZ1spT2eQhUC5mfQGugM4AhLjq8ZvuZvHdQvnvKnHH
    // 2) https://gateway.ipfs.io/ipfs/QmZ4DZ1spT2eQhUC5mfQGugM4AhLjq8ZvuZvHdQvnvKnHH
    
    // Each Mediator in this Decentralized Marketplace is identified by it's Ethereum Address, but should also have information about himself/herself that is accessed  
    // in the IPFS Stoarge Systemn via it's IPFS (InterPlanetary File System) Hash string key.
    // Each Mediator in this Decentralized Marketplace is also identified by it's IPFS (InterPlanetary File System) Hash. Information about each Mediator is in a JSON-formatted
    // string stored in the IPFS (InterPlanetary File System) that may be accessed via the Infura IPFS Gateway URL. So, for example, let's say that the Mediator has an
    // IPFS Hash of QmZ4DZ1spT2eQhUC5mfQGugM4AhLjq8ZvuZvHdQvnvKnHH. Then, the information about this Mediator may be seen in one of the following URLs:
    // 1) https://ipfs.infura.io/ipfs/QmZ4DZ1spT2eQhUC5mfQGugM4AhLjq8ZvuZvHdQvnvKnHH
    // 2) https://gateway.ipfs.io/ipfs/QmZ4DZ1spT2eQhUC5mfQGugM4AhLjq8ZvuZvHdQvnvKnH
    
    // Each Mediated Sales Transaction in this Decentralized Marketplace is identified by it's IPFS (InterPlanetary File System) Hash. Information about each Mediated Sales Transaction 
    // is in a JSON-formatted string stored in the IPFS (InterPlanetary File System) that may be accessed via the Infura IPFS Gateway URL. So, for example, let's say that the 
    // Mediated Sales Transaction has an IPFS Hash of QmZ4DZ1spT2eQhUC5mfQGugM4AhLjq8ZvuZvHdQvnvKnHH. Then, the information about this Mediated Sales Transaction may be seen in one of 
    // the following URLs:
    // 1) https://ipfs.infura.io/ipfs/QmZ4DZ1spT2eQhUC5mfQGugM4AhLjq8ZvuZvHdQvnvKnHH
    // 2) https://gateway.ipfs.io/ipfs/QmZ4DZ1spT2eQhUC5mfQGugM4AhLjq8ZvuZvHdQvnvKnH
    
    // WARNING! Befor a Seller places infomation about himself/herself in this Smart Contract, the Seller must first have at least one Item placed For Sale.
    
    // WARNING!! It is the responsibility of the Users of this Smart Contract to enter valid IPFS Hash String values for each of the Items Sold and of the Seller's Description!
    
    // Constants used for the Double-Linked list and other uses.
    bool constant private PREV = false;
    bool constant private NEXT = true;
    string constant private EMPTY_STRING = "";
    string constant private UNDER_SCORE_STRING = "_";
    
    // This is the price of all specific Items being sold by Sellers identified by their Ethereum Address in Wei.
    // The price is on a per-Item basis for one Item.
    //
    // Mapping is as follows:
    // 1) Key: Concatenation of Ethereum Address of Seller followed by IPFS Hash of Item being sold with an UNDER_SCORE_STRING in between.
    // 2) Value: Price of item being sold in Wei.
    //
    // Only the Seller may change or set the price of an Item.
    // The Seller is identified by an Ethereum Address.
    mapping(string => uint) private pricesOfItems;
    
    // This is the quantity of each Item that is being sold by a Seller. Thus, for each Item that is being sold their is a certain number of such items available for sale.
    // 
    // Mapping is as follows:
    // 1) Key: Concatenation of Ethereum Address of Seller followed by IPFS Hash of Item being sold with an UNDER_SCORE_STRING in between.
    // 2) Value: Quanity available to be sold for the Item.
    //
    // Only the Seller may change or set the quantity of the item that is available for sale..
    // The Seller is identified by an Ethereum Address.
    mapping(string => uint) private quantityAvailableForSaleOfEachItem; 
    
    // This is all the Items being sold on a per-seller basis where each seller is identified by it's Ethereum Address. The "mapping(string => mapping(bool => string))" is a
    // double-linked list used to maintain such a list of Items for a seller. The reason for using a double-linked list over an array is that it's difficult to delete items of an array
    // and still map back the Item to the Seller; use of arrays to maintain a dynamic list leads to having the array grow forever. Use of below technique solves this problem via use of "delete"
    // on a "mapping" where such a resource does get deleted. Use of Double-Linked list technique explained and code borrowed from the 
    // https://ethereum.stackexchange.com/questions/15337/can-we-get-all-elements-stored-in-a-mapping-in-the-contract web page.
    //
    // For an explanation as to how the "mapping(string => mapping(bool => string))" double linked-list works and the code pertaining to it from which was borrowed, please go to the
    // https://ethereum.stackexchange.com/questions/15337/can-we-get-all-elements-stored-in-a-mapping-in-the-contract web page.
    //
    // Mapping is as follows:
    // 1) First Key: Ethereum Address of the Seller
    // 2) First Value: The "mapping(string => mapping(bool => string))" double-linked list consisting of the IPFS Hashes of the various Items the Seller is selling. Each "string" in this mapping is
    //    either an empty string or the IPFS Hash of an Item being sold by the Seller. The "bool" is either the PREV or NEXT boolean value above.
    mapping(address => mapping(string => mapping(bool => string)) ) private itemsBeingSoldBySpecificSeller;
    
    // Used strictly to determine if an Item being sold by a Seller is in it's "itemsBeingSoldBySpecificSeller" double-linked list.
    //
    // Mapping is as follows:
    // 1) Key: Concatenation of Ethereum Address of Seller followed by IPFS Hash of Item being sold with an UNDER_SCORE_STRING in between.
    // 2) Value: Boolean value indicating if the Item is in the "itemsBeingSoldBySpecificSeller" double-linked list of the Seller.
    mapping(string => bool) private itemsKeysMap;
    
    // Used to determine the number of Items being sold by a Seller. This is NOT the quantity being sold for each Item, but the number of different types of Items.
    // It contains the number of Items in the seller's "mapping(string => mapping(bool => string))" double-linked list of the "itemsBeingSoldBySpecificSeller" mapping.
    //
    // Mapping is as follows:
    // 1) Key: Ethereum Address of the Seller.
    // 2) Value: Number of different types of Items being sold that is in the Seller's  "mapping(string => mapping(bool => string))" double-linked list of the 
    //    "itemsBeingSoldBySpecificSeller" mapping.
    mapping(address => uint) private numberOfDifferentItemsBeingSoldBySellerMap;
    
    // A double-linked list that lists all the Sellers by their Ethereum Address in string format.
    //
    // For an explanation as to how the "mapping(string => mapping(bool => string))" double linked-list works and the code pertaining to it from which was borrowed, please go to the
    // https://ethereum.stackexchange.com/questions/15337/can-we-get-all-elements-stored-in-a-mapping-in-the-contract web page.
    //
    // Each "string" below refers to the Ethereum Address of the Seller in string format.
    mapping(string => mapping(bool => string)) private listOfSellers; 
    
    // Map that keeps track of whether a Seller exists. The "address" key is the Ethereum Address of the Seller.
    mapping(address => bool) public sellerExists;
    
    // Keeps a count on the Number of Sellers selling on this platform.
    uint private numberOfSellers; 
    
    // This Mapping contains the Description Information about the Sellers. The Seller is responsible for adding this information.
    // A Seller must first have in it's "itemsBeingSoldBySpecificSeller" double-linked list at least one Item to sell BEFORE being able to add Information about
    // about himself/herself. The IPFS Hash string should refer to a JSON-formatted string describing the seller in the IPFS Storage System.
    //
    // Mapping is as follows:
    // 1) Key: Ethereum Address of the Seller
    // 2) Value: IPFS Hash string of the information pertaining to the Seller. This information is stored in the IPFS Storage Network.
    mapping(address => string) private descriptionInfoAboutSellers;
    
    // This Mapping is used to determine if a Seller is willing to sell his/her Items via the use of a Mediator. The Mediator is used to determine that BOTH parties are BOTH satisfied with the 
    // Sale of the Item. One iten of contention is that the Buyer actualy got the Item he/she purchased. 
    // In these types of Sales involving a Mediator, two out of the three parties - Buyer, Seller, and/or Mediator - must approve the sale transaction BEFORE the ETH is sent to the Seller.
    // In such cases involving a Mediator, the Buyer's ETH is not sent to the Seller, but sent to this Smart Contract. Once two out of the three parties gives the OK for the Sale, then 95% of the
    // Sales Price of the Item goes to the Seller and 5% goes to the Mediator.
    //
    // The "key" is the Ethereum Seller Address and the value is a boolean. If the Seller is willing to sell via a Mediator, then this value if boolean true. 
    // If the Seller is NOT willing to sell via a Mediator, then this value if boolean false.
    mapping(address => bool) private sellerWillingToSellItemsViaMediator;
    
    // Refers to the instance of the FranklinDecentralizedMarketplaceMediation Contract that was set by the Contract Owner via the "setFranklinDecentralizedMarketplaceMediationContract" method.
    //
    // The Contract code had to be split in two, because the Etherum Virtual Machine (EVM) would not allow deployment of a Contract
    // that has more than 24576 bytes. So, the decision was made to SPLIT the code into the FranklinDecentralizedMarketplace 
    // and FranklinDecentralizedMarketplaceMediation Contracts where the FranklinDecentralizedMarketplace would deploy the
    // FranklinDecentralizedMarketplaceMediation Contract via it's Constructor. 
    //
    // So, this FranklinDecentralizedMarketplace Contract handles most of the functionality pertaining to the Franklin Decentralized Marketplace Smart Contract functionality, while MOST of the
    // functionality dealing with Mediated Sales Transactions is done by the FranklinDecentralizedMarketplaceMediation Smart Contract.
    FranklinDecentralizedMarketplaceMediation public mediationMarketplace;
    bool public mediationMarketplaceHasBeenSet;
    address public contractOwner;
    
    // event SetSellerWillingToSellItemsViaMediatorEvent(address _msgSender, bool _flag);
    // event AddOrUpdateSellerDescriptionEvent(address _msgSender, string _ipfsHashKeyDescription);
    // event RemoveSellerAndItsItems(address _msgSender);
    // event SetPriceOfItemEvent(address _msgSender, string _keyItemIpfsHash, uint _priceInWei);
    // event SetQuantityAvailableForSaleOfAnItem(address _msgSender, string _keyItemIpfsHash, uint _quantity);
    event PurchaseItemWithoutMediatorEvent(address _msgSender, address payable _sellerAddress, string _keyItemIpfsHash, uint _quantity);
    event AddItemForSaleAndPossiblySellerEvent(address _msgSender, string _keyItemIpfsHash);
    event RemoveItemForSaleAndPossibleSellerEvent(address _msgSender, string _keyItemIpfsHash);    
    
    constructor() public {
        contractOwner = msg.sender;
    }
    
    function setFranklinDecentralizedMarketplaceMediationContract(address franklinDecentralizedMarketplaceMediationAddress) public {
        require(msg.sender == contractOwner, "This method may only be executed by the Contract Owner!");
        require(!mediationMarketplaceHasBeenSet, "The mediationMarkeplace contract reference has already been set!");
        
        FranklinDecentralizedMarketplaceMediation temp = FranklinDecentralizedMarketplaceMediation(franklinDecentralizedMarketplaceMediationAddress);
        require(contractOwner == temp.contractOwner(), "Must be same Contract Owner in both the FranklinDecentralizedMarketplace and FranklinDecentralizedMarketplaceMediation contracts!");
        
        mediationMarketplace = temp;
        mediationMarketplaceHasBeenSet = true;
    }
    
    // Determines if a Seller with the given "_sellerAddress" is willing to make sales of it's Items via a Mediator. 
    // A return of boolean false indicates that the Seller is NOT willing to sell his/her items via a Mediator. 
    // A return of boolean true indicates that the Seller IS willing to sell his/her items via a Mediator.
    function sellerIsWillingToSellItemsViaMediator(address _sellerAddress) external view returns (bool) {
        return sellerWillingToSellItemsViaMediator[_sellerAddress];
    }
    
    // This function allows a Seller to set into this Smart Contract whether he/she is willing to sell his/her Items via the use of a Mediator.
    // The Seller in this function is the "msg.sender".
    //
    // A "_flag" value of boolean true, indicates that the Seller IS willing to make sales via a Mediator.
    // A "_flag" value of boolean false, indicates that the Seller is NOT willing to make sales via a Mediator.
    function setSellerWillingToSellItemsViaMediator(bool _flag) external {
        if (!sellerExists[msg.sender]) {
            return;
        }
        
        sellerWillingToSellItemsViaMediator[msg.sender] = _flag;
        // emit SetSellerWillingToSellItemsViaMediatorEvent(msg.sender, _flag);
    }
    
    // This method allows a Seller to add/update a Description about himself/herself feeding in the "_ipfsHashKeyDescription" that should point to a JSON-formatted string in the IPFS Storage System.
    // The "msg.sender" is the Seller.
    function addOrUpdateSellerDescription(string memory _ipfsHashKeyDescription) public {
        require(numberOfDifferentItemsBeingSoldBySellerMap[msg.sender] > 0, "You must first add at least ONE Item For Sale before adding a description of yourself!");
        require(!GeneralUtilities._compareStringsEqual(_ipfsHashKeyDescription, EMPTY_STRING), "Cannot have an empty String for the IPFS Hash Key Description of a Seller!");
        
        descriptionInfoAboutSellers[msg.sender] = _ipfsHashKeyDescription;
        // emit AddOrUpdateSellerDescriptionEvent(msg.sender, _ipfsHashKeyDescription);
    }
    
    // Gets the Description of a Seller identified by the given "_sellerAddress". The Description will be the IPFS Hash where the JSON-formatted Description of the Seller exists.
    // If no such IPFS Hash Key Description exists, then an EMPTY_STRING will be returned.
    function getSellerIpfsHashDescription(address _sellerAddress) external view returns (string memory) {
        return descriptionInfoAboutSellers[_sellerAddress];
    }
    
    // Adds a Seller - identified by it's Ethereum Address - to the "listOfSellers" double-linked list.
    //
    // Source --> https://ethereum.stackexchange.com/questions/15337/can-we-get-all-elements-stored-in-a-mapping-in-the-contract
    function _addSeller(address _sellerAddress) private {
        string memory sellerAddressStringKey = GeneralUtilities._addressToString(_sellerAddress);
        
        // Will not bother to check for valid "address", because Ethereum Virtual Machine does that for us automatically and will just throw an Error that caller of this 
        // method will have to catch.
        
        if (sellerExists[_sellerAddress]) {
            return;
        }
        
        // Link the new node 
        listOfSellers[sellerAddressStringKey][PREV] = EMPTY_STRING;
        listOfSellers[sellerAddressStringKey][NEXT] = listOfSellers[EMPTY_STRING][NEXT];
    
        // Insert the new node
        listOfSellers[listOfSellers[EMPTY_STRING][NEXT]][PREV] = sellerAddressStringKey;
        listOfSellers[EMPTY_STRING][NEXT] = sellerAddressStringKey;
    
        numberOfSellers = GeneralUtilities._safeMathAdd(numberOfSellers, 1);
        sellerExists[_sellerAddress] = true;
    }
    
    // Removes a Seller - identified by it's Ethereum Address - from the "listOfSellers" double-linked list.
    //
    // No need to check for empty string on returned Ethereum Address string, because if the "_sellerAddress" is an invalid Ethereum Address, then Ethereum Virtual Machine will
    // throw an Error. Caller of this method will have to check if an Error was thrown.
    // 
    // Source --> https://ethereum.stackexchange.com/questions/15337/can-we-get-all-elements-stored-in-a-mapping-in-the-contract
    function _removeSeller(address _sellerAddress) private {
        string memory sellerAddressStringKey = GeneralUtilities._addressToString(_sellerAddress);
        
        if (!sellerExists[_sellerAddress]) {
            return;
        }
        
        // Stitch the neighbours together
        listOfSellers[ listOfSellers[sellerAddressStringKey][PREV] ][NEXT] = listOfSellers[sellerAddressStringKey][NEXT];
        listOfSellers[ listOfSellers[sellerAddressStringKey][NEXT] ][PREV] = listOfSellers[sellerAddressStringKey][PREV];
    
        // Delete state storage
        delete listOfSellers[sellerAddressStringKey][PREV];
        delete listOfSellers[sellerAddressStringKey][NEXT];
        
        numberOfSellers = GeneralUtilities._safeMathSubtract(numberOfSellers, 1);
        delete sellerExists[_sellerAddress];
        delete sellerWillingToSellItemsViaMediator[_sellerAddress];
        
        // Decided to NOT delete this information, because a Seller may be involved in a Mediator type of Sale, and we still wish to keep information 
        // about the Seller.
        // delete descriptionInfoAboutSellers[_sellerAddress];
    }
    
    // Allows a Seller to remove himself/herself from the "listOfSellers". The Seller to be removed is the "msg.sender" Ethereum Address that calls this method. 
    // Not only will the Seller be removed but also ALL of the Items assovciated with this "msg.sender" Seller.
    function removeSeller() external {
        uint numberOfDifferentItemsBeingSoldBySeller = numberOfDifferentItemsBeingSoldBySellerMap[msg.sender];
        
        // We have to first get ALL of the IPFS Key Hashes of the Items for Sale, because the Indexes will change as we delete the Items.
        string[] memory itemsForSale = new string[](numberOfDifferentItemsBeingSoldBySeller);
        for (uint itemIndex = 0; itemIndex < numberOfDifferentItemsBeingSoldBySeller; itemIndex++) {
            string memory itemForSale = getItemForSale(msg.sender, itemIndex);
            itemsForSale[itemIndex] = itemForSale;
        }
        
        // Then we delete step-by-step.
        for (uint i = 0; i < numberOfDifferentItemsBeingSoldBySeller; i++) {
            removeItemForSale(itemsForSale[i]);
        }
        
        // The Seller "msg.sender" will be automatically removed from the "listOfSellers" when the last Item it has For Sale is removed.
        // emit RemoveSellerAndItsItems(msg.sender);
    }
    
    // Gets the Seller Ethereum Address at the given "_index" from the "listOfSellers" double-linked list.
    //
    // Input Parameter:
    // _itemIndex : Index number into the "listOfSellers" double-linked list of Items Seller is selling.
    //              Index starts at 0.
    //
    // Returns:
    // 1) If the "_index" is less than the "numberOfSellers", then the Etheruem Address of the Seller at the given "_index" into the "listOfSellers" double-linked list
    //    is returned.
    // 2) If the "_index" is greater than or equal to the "numberOfSellers", then an Exception is thrown via the "require" below.
    function getSellerAddress(uint _index) external view returns (address) {
        require(_index < numberOfSellers, "Index value given is greater than or equal to the Number of Sellers! It should be less than the Number of Sellers!");
        
        // The "key" below is the Ethereum Address in string format that is in the "listOfSellers" double-linked list.
        
        uint keyCount = 0;
        string memory key = EMPTY_STRING;
        while (true) {
            key = listOfSellers[key][NEXT];
            if (keyCount == _index) {
                break;
            }
        
            keyCount++;
        }
        
        return GeneralUtilities._parseEthereumAddressStringToAddress(key);    
    }
    
    // Returns back the Number of Sellers in this Decentralized Marketplace.
    function getNumberOfSellers() external view returns (uint) {
        return numberOfSellers;
    }
    
    // Allows a Seller to set the Price of an Item the Seller is selling in Wei. The Seller would be the "msg.sender" Ethereum Address that calls this method.
    //
    // Input Parameters:
    // 1) _keyItemIpfsHash : This is the IPFS Hash of the item being sold that points to a JSON-formatted string in the IPFS Storage System.
    // 2) _priceInWei : Price of the Item to be set in Wei 
    // 3) msg.sender : Ethereum Address of the Seller
    //
    // If the Seller sets the Price of the Item to Zero (i.e., 0) Wei, then that means that the Item is set to a State where it cannot be purchased.
    //
    // If the Item in questions does not exist as an Item for Sale under the "msg.sender" Seller of if the "msg.sender" is not a Seller, then no setting of a price 
    // gets done.
    function setPriceOfItem(string memory _keyItemIpfsHash, uint _priceInWei) public {
        require(!GeneralUtilities._compareStringsEqual(_keyItemIpfsHash, EMPTY_STRING), "Cannot have an empty String for the IPFS Hash Key of an Item to Sell!");
        
        // I was thinking of not allowing the Seller to set the Price of an Itemn to Zero wei, but then I changed my mind. The Seller may have a situation where he/she has 
        // the Item in stock, but does not wish to sell the Item yet.
        // require(_priceInWei > 0, "Cannot set the Price of an Item to Zero Wei!");
        
        string memory combinedKeyAddressPlusItemIpfsHash = GeneralUtilities._getConcatenationOfEthereumAddressAndIpfsHash(msg.sender, _keyItemIpfsHash);
        require(itemsKeysMap[combinedKeyAddressPlusItemIpfsHash], "Given IPFS Hash of Item is not listed as an Item For Sale by the Seller!");
        
        pricesOfItems[combinedKeyAddressPlusItemIpfsHash] = _priceInWei;
        // emit SetPriceOfItemEvent(msg.sender, _keyItemIpfsHash, _priceInWei);
    }
    
    // Gets the Price (in Wei) of an Item - identified by the given "_keyItemIpfsHash" input parameter - being sold by a 
    // Seller - identified by the given "_sellerAddress" Etherum Address.
    //
    // A return value of Zero (i.e., 0) Wei indicates that the Seller has not yet set a Price for this Item, and thus the Item cannot be purchased
    function getPriceOfItem(address _sellerAddress, string memory _keyItemIpfsHash) public view returns (uint) {
        string memory combinedKeyAddressPlusItemIpfsHash = GeneralUtilities._getConcatenationOfEthereumAddressAndIpfsHash(_sellerAddress, _keyItemIpfsHash);
        require(itemsKeysMap[combinedKeyAddressPlusItemIpfsHash], "Given IPFS Hash of Item is not listed as an Item For Sale from the Seller!");
        
        return pricesOfItems[combinedKeyAddressPlusItemIpfsHash];
    }
    
    // Allows a Seller to set the Quantity available for Sale of an Item that a Seller is selling. The Seller would be the "msg.sender" Ethereum Address that calls this method.
    //
    // Input Parameters:
    // 1) _keyItemIpfsHash : This is the IPFS Hash of the item being sold that points to a JSON-formatted string in the IPFS Storage System.
    // 2) _quantity : The quantity available For Sale of the Item that the Seller is selling.   
    // 3) msg.sender : Ethereum Address of the Seller
    function setQuantityAvailableForSaleOfAnItem(string memory _keyItemIpfsHash, uint _quantity) public {
        require(!GeneralUtilities._compareStringsEqual(_keyItemIpfsHash, EMPTY_STRING), "Cannot have an empty String for the IPFS Hash Key of an Item to Sell!");
        
        string memory combinedKeyAddressPlusItemIpfsHash = GeneralUtilities._getConcatenationOfEthereumAddressAndIpfsHash(msg.sender, _keyItemIpfsHash);
        require(itemsKeysMap[combinedKeyAddressPlusItemIpfsHash], "Given IPFS Hash of Item is not listed as an Item For Sale by the Seller!");
        
        quantityAvailableForSaleOfEachItem[combinedKeyAddressPlusItemIpfsHash] = _quantity;
        // emit SetQuantityAvailableForSaleOfAnItem(msg.sender, _keyItemIpfsHash, _quantity);
    }
    
    // Does same functionality as above method, but may ONLY be executed by the "mediationMarketplace" Contract.
    function setQuantityAvailableForSaleOfAnItem_v2(address _sellerAddress, string memory _keyItemIpfsHash, uint _quantity) public {
        require(mediationMarketplaceHasBeenSet, "The mediationMarketplace instance has not been set by the Contract Owner!");
        require(!GeneralUtilities._compareStringsEqual(_keyItemIpfsHash, EMPTY_STRING), "Cannot have an empty String for the IPFS Hash Key of an Item to Sell!");
        
        string memory combinedKeyAddressPlusItemIpfsHash = GeneralUtilities._getConcatenationOfEthereumAddressAndIpfsHash(_sellerAddress, _keyItemIpfsHash);
        require(itemsKeysMap[combinedKeyAddressPlusItemIpfsHash], "Given IPFS Hash of Item is not listed as an Item For Sale by the Seller!");
        
        require(msg.sender == address(mediationMarketplace), "This method may only be executed by the FranklinDecentralizedMarketplaceMediation contract!");
        
        quantityAvailableForSaleOfEachItem[combinedKeyAddressPlusItemIpfsHash] = _quantity;
        // emit SetQuantityAvailableForSaleOfAnItem(msg.sender, _keyItemIpfsHash, _quantity);
    }
    
    // Gets the Quantity of the given "_keyItemIpfsHash" Item available For sale by the given "_sellerAddress" Seller.
    //
    // Input Parameters:
    // 1) _sellerAddress : Ethreum Address of the Seller
    // 2) _keyItemIpfsHash : This is the IPFS Hash of the item being sold that points to a JSON-formatted string in the IPFS Storage System.
    function getQuantityAvailableForSaleOfAnItemBySeller(address _sellerAddress, string memory _keyItemIpfsHash) public view returns (uint) {
        string memory combinedKeyAddressPlusItemIpfsHash = GeneralUtilities._getConcatenationOfEthereumAddressAndIpfsHash(_sellerAddress, _keyItemIpfsHash);
        require(itemsKeysMap[combinedKeyAddressPlusItemIpfsHash], "Given IPFS Hash of Item is not listed as an Item For Sale from the Seller!");
        
        return quantityAvailableForSaleOfEachItem[combinedKeyAddressPlusItemIpfsHash];
    }
    
    // Allows a Buyer - identified by the "msg.sender" Ethereum Address that calls this method - to purchase a "_quantity" of a specific Item - identified 
    // by it's "_keyItemIpfsHash" - from a given Seller - identified by it's "_sellerAddress" Ethereum Address.
    //
    // The Buyer is assuming the risk here in that the Buyer is expecting the Seller to be honest enough to send to the Buyer the quantity of Items 
    // in the purchase to the Buyer after the Seller receives the payment.
    //
    // Input Parameters:
    // 1) _sellerAddress : Ethereum Address of the Seller
    // 2) _keyItemIpfsHash : This is the IPFS Hash of the item being sold that points to a JSON-formatted string in the IPFS Storage System
    // 3) _quantity : Quantity of the Item that the "msg.sender" Buyer wishes to purchase.
    // 4) msg.sender :  Address of the Buyer
    function purchaseItemWithoutMediator(address payable _sellerAddress, string memory _keyItemIpfsHash, uint _quantity) payable public {
        require(_quantity > 0, "Must purchase at least 1 quantity of the Item for Sale to happen!");
        require(!GeneralUtilities._compareStringsEqual(_keyItemIpfsHash, EMPTY_STRING), "Cannot have an empty String for the IPFS Hash Key of an Item you are purchasing!");
        require(msg.sender != _sellerAddress, "The Buyer Address cannot be the same as the Seller Address!");
        
        require(sellerExists[_sellerAddress], "Given Seller Address does not exist as a Seller!");
        
        string memory combinedKeyAddressPlusItemIpfsHash = GeneralUtilities._getConcatenationOfEthereumAddressAndIpfsHash(_sellerAddress, _keyItemIpfsHash);
        require(itemsKeysMap[combinedKeyAddressPlusItemIpfsHash], "Given IPFS Hash of Item is not listed as an Item For Sale from the Seller!");
        
        require(quantityAvailableForSaleOfEachItem[combinedKeyAddressPlusItemIpfsHash] > 0, "Seller has Zero quantity available for Sale for the Item requested to purchase!");
        require(quantityAvailableForSaleOfEachItem[combinedKeyAddressPlusItemIpfsHash] >= _quantity, 
            "Quantity available For Sale of the Item from the Seller is less than the quantity requested to purchase! Not enough of the Itenm available For Sale");
        
        require(pricesOfItems[combinedKeyAddressPlusItemIpfsHash] > 0, "The Seller has not yet set a Price for Sale for the requested Item! Cannot purchase the Item!"); 
        
        uint totalAmountOfWeiNeededToPurchase = GeneralUtilities._safeMathMultiply(pricesOfItems[combinedKeyAddressPlusItemIpfsHash], _quantity);
        require(msg.value >= totalAmountOfWeiNeededToPurchase, "Not enough ETH was sent to purchase the quantity requested of the Item!");
        
        // Subtract the appropriate "_quantity" of that Item for Sale to keep track of the new available quauntity of that Item that may be sold.
        quantityAvailableForSaleOfEachItem[combinedKeyAddressPlusItemIpfsHash] = 
            GeneralUtilities._safeMathSubtract(quantityAvailableForSaleOfEachItem[combinedKeyAddressPlusItemIpfsHash], _quantity);
        
        // We want to make sure to return back any excess ETH that exceeds the amount necessary to purchase the given "_quantity" of the Item.
        msg.sender.transfer(msg.value - totalAmountOfWeiNeededToPurchase);
        
        // Transfer the "totalAmountOfWeiNeededToPurchase" to the Seller.
        _sellerAddress.transfer(totalAmountOfWeiNeededToPurchase);
        
        emit PurchaseItemWithoutMediatorEvent(msg.sender, _sellerAddress, _keyItemIpfsHash, _quantity);
    }
    
    // Adds an Item - identified by the given "_keyItemIpfsHash" input - to be Sold by a Seller to it's "itemsBeingSoldBySpecificSeller" double-linked list. 
    // The Seller in this function call is the "msg.sender" Ethereum Address that calls this function. Also, this causes the "msg.sender" Seller to be added in the "listOfSellers". 
    //
    // Source --> https://ethereum.stackexchange.com/questions/15337/can-we-get-all-elements-stored-in-a-mapping-in-the-contract
    function addItemForSale(string memory _keyItemIpfsHash) public {
        require(!GeneralUtilities._compareStringsEqual(_keyItemIpfsHash, EMPTY_STRING), "Cannot have an empty String for the IPFS Hash Key of an Item to Sell!");
        
        // If the specific type of Item is already in the list of Items that the Seller is selling, then no need to add the Item, because it's already there.
        string memory combinedKeyAddressPlusItemIpfsHash = GeneralUtilities._getConcatenationOfEthereumAddressAndIpfsHash(msg.sender, _keyItemIpfsHash);
        if (itemsKeysMap[combinedKeyAddressPlusItemIpfsHash]) {
            return;
        }
        // This below is the double-linked list of different types of Items being sold by a Seller.
        mapping(string => mapping(bool => string)) storage itemsBeingSoldBySenderAddress = itemsBeingSoldBySpecificSeller[msg.sender];
        
        // Link the new node 
        itemsBeingSoldBySenderAddress[_keyItemIpfsHash][PREV] = EMPTY_STRING;
        itemsBeingSoldBySenderAddress[_keyItemIpfsHash][NEXT] = itemsBeingSoldBySenderAddress[EMPTY_STRING][NEXT];
    
        // Insert the new node
        itemsBeingSoldBySenderAddress[itemsBeingSoldBySenderAddress[EMPTY_STRING][NEXT]][PREV] = _keyItemIpfsHash;
        itemsBeingSoldBySenderAddress[EMPTY_STRING][NEXT] = _keyItemIpfsHash;
        
        numberOfDifferentItemsBeingSoldBySellerMap[msg.sender] = GeneralUtilities._safeMathAdd(numberOfDifferentItemsBeingSoldBySellerMap[msg.sender], 1);
        itemsKeysMap[combinedKeyAddressPlusItemIpfsHash] = true;
        
        _addSeller(msg.sender); // No seller added if Seller already exists.
        
        emit AddItemForSaleAndPossiblySellerEvent(msg.sender, _keyItemIpfsHash);
    }
    
    // Removes an Item - identified by the given "_keyItemIpfsHash" input - being Sold by a Seller in it's "itemsBeingSoldBySpecificSeller" double-linked list. 
    // The Seller in this function call is the "msg.sender" 
    // Ethereum Address that calls this function.
    //
    // WARNING! If this method causes removing the last Item for Sale, the Seller (i.e., the "msg.sender") will be removed from the "listOfSellers". 
    //
    // Source --> https://ethereum.stackexchange.com/questions/15337/can-we-get-all-elements-stored-in-a-mapping-in-the-contract
    function removeItemForSale(string memory _keyItemIpfsHash) public {
        string memory combinedKeyAddressPlusItemIpfsHash = GeneralUtilities._getConcatenationOfEthereumAddressAndIpfsHash(msg.sender, _keyItemIpfsHash);
        
        if (!itemsKeysMap[combinedKeyAddressPlusItemIpfsHash]) {
            return;
        }
        
        // This below is the double-linked list of different types of Items being sold by a Seller.
        mapping(string => mapping(bool => string)) storage itemsBeingSoldBySenderAddress = itemsBeingSoldBySpecificSeller[msg.sender];
        
        // Stitch the neighbours together
        itemsBeingSoldBySenderAddress[ itemsBeingSoldBySenderAddress[_keyItemIpfsHash][PREV] ][NEXT] = itemsBeingSoldBySenderAddress[_keyItemIpfsHash][NEXT];
        itemsBeingSoldBySenderAddress[ itemsBeingSoldBySenderAddress[_keyItemIpfsHash][NEXT] ][PREV] = itemsBeingSoldBySenderAddress[_keyItemIpfsHash][PREV];
    
        // Delete state storage
        delete itemsBeingSoldBySenderAddress[_keyItemIpfsHash][PREV];
        delete itemsBeingSoldBySenderAddress[_keyItemIpfsHash][NEXT];
    
        numberOfDifferentItemsBeingSoldBySellerMap[msg.sender] = GeneralUtilities._safeMathSubtract(numberOfDifferentItemsBeingSoldBySellerMap[msg.sender], 1);
        delete itemsKeysMap[combinedKeyAddressPlusItemIpfsHash];
        delete pricesOfItems[combinedKeyAddressPlusItemIpfsHash];
        delete quantityAvailableForSaleOfEachItem[combinedKeyAddressPlusItemIpfsHash];
        
        if (numberOfDifferentItemsBeingSoldBySellerMap[msg.sender] == 0) {
            _removeSeller(msg.sender);
        }
        
        emit RemoveItemForSaleAndPossibleSellerEvent(msg.sender, _keyItemIpfsHash);
    }
    
    // Gets the number of different types of Items being sold by a Seller. Each Seller shall have a unique Ethereum Address that will be used to identify
    // the Seller.
    function getNumberOfDifferentItemsBeingSoldBySeller(address _sellerAddress) external view returns (uint) {
        return numberOfDifferentItemsBeingSoldBySellerMap[_sellerAddress];
    }

    // Returns back a boolean value indicating if a certain Item is available for sale from a given Seller.
    //
    // Input Parameters:
    // 1) _sellerAddress : The Ethereum Address of the Seller
    // 2) _keyItemIpfsHash : The IPFS Hash ID string identifying an Item For Sale
    //
    // Returns:
    // 1) Boolean true : If the given "_sellerAddress" is selling the given Item identified by it's "_keyItemIpfsHash"
    // 2) Boolean false : If the given "_sellerAddress" is NOT selling the given Item identified by it's "_keyItemIpfsHash"
    function itemForSaleFromSellerExists(address _sellerAddress, string memory _keyItemIpfsHash) public view returns (bool) {
        string memory combinedKeyAddressPlusItemIpfsHash = GeneralUtilities._getConcatenationOfEthereumAddressAndIpfsHash(_sellerAddress, _keyItemIpfsHash);
        return itemsKeysMap[combinedKeyAddressPlusItemIpfsHash];
    }

    // Gets the IPFS Hash string of an Item being sold by a Seller. Index values start at 0.
    //
    // This IPFS Hash string refers to a JSON-formatted string that is stored in the IPFS Storage System.
    //
    // Input Parameters:
    // 1) _sellerAddress : The Ethereum Address of the Seller
    // 2) _itemIndex : Index number into the "itemsBeingSoldBySpecificSeller" double-linked list of Items Seller is selling.
    //    Index starts at 0.
    //
    // Returns:
    // 1) If the "_itemIndex" refers to an Item that the "_sellerAddress" is selling, then the IPFS Hash string of the Item being sold is returned.
    // 2) If the "_itemIndex" does NOT refer to an Item that the "_sellerAddress" is selling, then an EMPTY_STRING is returned.
    function getItemForSale(address _sellerAddress, uint _itemIndex) public view returns (string memory) {
        if (_itemIndex >= numberOfDifferentItemsBeingSoldBySellerMap[_sellerAddress]) {
            return EMPTY_STRING;
        }
        
        // This below is the double-linked list of different types of Items being sold by the "_sellerAddress".
        mapping(string => mapping(bool => string)) storage itemsBeingSoldBySenderAddress = itemsBeingSoldBySpecificSeller[_sellerAddress];        
        
        uint keyCount = 0;
        string memory ipfsHashKeyOfItem = EMPTY_STRING;
        while (true) {
            ipfsHashKeyOfItem = itemsBeingSoldBySenderAddress[ipfsHashKeyOfItem][NEXT];
            if (keyCount == _itemIndex) {
                break;
            }
            
            keyCount++;
        }
        
        return ipfsHashKeyOfItem;       
    }
}