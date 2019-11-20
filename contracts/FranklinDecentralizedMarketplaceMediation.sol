pragma solidity >=0.4.22 <0.6.0;

import "./FranklinDecentralizedMarketplace.sol";
import "./GeneralUtilities.sol";

contract FranklinDecentralizedMarketplaceMediation {
    using GeneralUtilities for *;
    
    // Constants used for the Double-Linked list and other uses.
    bool constant private PREV = false;
    bool constant private NEXT = true;
    string constant private EMPTY_STRING = "";
    
    // This Smart Contract handles Sales Transactions that involve a Mediator. Thus, these would be referred to as Mediated Sales Transactions that involve a Buyer, Seller, and 
    // Mediator. Each Buyer, Seller, and Mediator will have a different Ethereum Address.
    
    // The "franklinDecentralizedMarketplaceContract" variable refers to the FranklinDecentralizedMarketplace Contract that was set by the "setFranklinDecentralizedMarketplaceContract" method.
    // The Contract code had to be split in two, because the Etherum Virtual Machine (EVM) would not allow deployment of a Contract
    // that has more than 24576 bytes. So, the decision was made to SPLIT the code into the FranklinDecentralizedMarketplace 
    // and FranklinDecentralizedMarketplaceMediation Contracts.  
    
    // Function calls relating to Mediated Sales Transactions should be done by making the apprioptate function calls on this Smart Contract.
    
    // This Contract will be used to store the Escrow ETH/WEI (i.e., "totalAmountOfWeiNeededToPurchase") used to pay for Items involved in ALL Mediated Sales Transactions. 
    // The Mediated Sales Transaction works as follows:
    // 1) If 2-out-of-3 of the Buyer, Seller, and/or Mediator Approves this Mediated Sales Transaction, then 95% of the "totalAmountOfWeiNeededToPurchase" will be sent to the Seller Address
    //    and 5% of the "totalAmountOfWeiNeededToPurchase" will be sent to the Mediator Address. 
    // 2) 2-out-of-3 of the Buyer, Seller, and/or Mediator Disapproves this Mediated Sales Transaction, then the "totalAmountOfWeiNeededToPurchase" will be sent back to the Buyer Address.
    // 3) If neither (1) or (2) above happens, then the Mediated Sales Transaction will be held in a State of Limbo and the "totalAmountOfWeiNeededToPurchase" will be kept inside 
    //    of this Contract.
    
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
    
    // A double-linked list that lists all the Mediators by their Ethereum Address in string format.
    //
    // For an explanation as to how the "mapping(string => mapping(bool => string))" double linked-list works and the code pertaining to it from which was borrowed, please go to the
    // https://ethereum.stackexchange.com/questions/15337/can-we-get-all-elements-stored-in-a-mapping-in-the-contract web page.
    //
    // Each "string" below refers to the Ethereum Address of the Mediator in string format.
    mapping(string => mapping(bool => string)) private listOfMediators;
    
    // Map that keeps track of whether a Mediator exists. The "address" key is the Ethereum Address of the Mediator.
    mapping(address => bool) private mediatorExistsMap;
    
    // Keeps a count on the Number of Mediators that mediate sales on this platform.
    uint private numberOfMediators;
    
    // This Mapping contains the Description Information about the Mediators. The Mediator is responsible for adding this information.
    //
    // Mapping is as follows:
    // 1) Key: Ethereum Address of the Mediator
    // 2) Value: IPFS Hash string of the information pertaining to the Mediator. This information is stored in the IPFS Storage Network.
    //           This information should be a JSON-formatted string.
    mapping(address => string) private descriptionInfoAboutMediators;
    
    // This Mapping contains the Number of Mediations that a Mediator has been involved.
    //
    // Mapping is as follows:
    // 1) Key: Ethereum Address of the Mediator
    // 2) Value: Number of Mediations that a Mediators has been involved
    mapping(address => uint) private numberOfMediationsMediatorInvolved;

    // Constants used for the Mediated Sales Transactions mappings that have a "bool[3]" as a value in it's "mapping".
    uint constant private BUYER_INDEX = 0;
    uint constant private SELLER_INDEX = 1;
    uint constant private MEDIATOR_INDEX = 2;
    
    // Maps the Mediated Sales Transaction IPFS Hash to the three Ethereum Addresses involved in the Sale of Item(s) involving a Mediator. The Mediated Sales Transaction IPFS Hash
    // refers to a JSON-formatted string that describes this Transaction in the IPFS Storage System.
    //
    // Mapping is as follows:
    // 1) Key: IPFS Hash string of the Mediated Sales Transaction
    // 2) Values:
    //    A) address[0] : Ethereum Address of the Buyer
    //    B) address[1] : Ethereum Address of the Seller
    //    C) address[2] : Ethereum Address of the Mediator
    mapping(string => address[3]) private mediatedSalesTransactionAddresses;
    
    // Map that shows whether a Mediated Sales Transaction exists. The "string" key is the Mediated Sales Transaction IPFS Hash.
    //
    // Mapping is as follows:
    // 1) Key: IPFS Hash string of the Mediated Sales Transaction
    // 2) Value:
    //    A) Boolean value of "true" indicates that the Mediated Sales Transaction exists
    //    B) Boolean value of "false" indicates that the Mediated Sales Transaction exists
    mapping (string => bool) private mediatedSalesTransactionExists;
    
    // Map that maps the Mediated Sales Transaction to the Sales Amount in Wei. The "string" key is the Mediated Sales Transaction IPFS Hash.
    //
    // Mapping is as follows:
    // 1) Key: IPFS Hash string of the Mediated Sales Transaction
    // 2) Value: Amount in Wei that the Buyer chose to pay for the Item(s)
    mapping (string => uint) private mediatedSalesTransactionAmount;
    
    // Map that keeps track of whether a Mediated Sales Transaction has been Approved by the Buyer, Seller, and/or Mediator. 
    // The "string" key is the Mediated Sales Transaction IPFS Hash.
    //
    // Mapping is as follows:
    // 1) Key: IPFS Hash string of the Mediated Sales Transaction
    // 2) Values:
    //    A) address[0] : Boolean flag indicating if Buyer Approves
    //    B) address[1] : Boolean flag indicating if Seller Approves
    //    C) address[2] : Boolean flag indicating if Mediator Approves
    mapping (string => bool[3]) private mediatedSalesTransactionApprovedByParties;
    
    // Map that keeps track of whether a Mediated Sales Transaction has been Disapproved by the Buyer, Seller, and/or Mediator. 
    // The "string" key is the Mediated Sales Transaction IPFS Hash.
    //
    // Mapping is as follows:
    // 1) Key: IPFS Hash string of the Mediated Sales Transaction
    // 2) Values:
    //    A) address[0] : Boolean flag indicating if Buyer Disapproves
    //    B) address[1] : Boolean flag indicating if Seller Disapproves
    //    C) address[2] : Boolean flag indicating if Mediator Disapproves
    mapping (string => bool[3]) private mediatedSalesTransactionDisapprovedByParties;
    
    event PurchaseItemWithMediatorEvent(address _msgSender, address _sellerAddress, address _mediatorAddress, string _keyItemIpfsHash, string _mediatedSalesTransactionIpfsHash, uint _quantity);
    event MediatedSalesTransactionHasBeenFullyApproved(string _mediatedSalesTransactionIpfsHash);
    event MediatedSalesTransactionHasBeenFullyDisapproved(string _mediatedSalesTransactionIpfsHash);
    
    // Below is the Contract Address of the FranklinDecentralizedMarketplace Contract that was set by the "setFranklinDecentralizedMarketplaceContract" method.
    // The Contract code had to be split in two, because the Etherum Virtual Machine (EVM) would not allow deployment of a Contract
    // that has more than 24576 bytes. So, the decision was made to SPLIT the code into the FranklinDecentralizedMarketplace 
    // and FranklinDecentralizedMarketplaceMediation Contracts.
    FranklinDecentralizedMarketplace public franklinDecentralizedMarketplaceContract;
    bool public franklinDecentralizedMarketplaceContractHasBeenSet;
    address public contractOwner;
    
    constructor() public {
        contractOwner = msg.sender;
    }
    
    function setFranklinDecentralizedMarketplaceContract(address franklinDecentralizedMarketplaceContractAddress) public {
        require(msg.sender == contractOwner, "This method may only be executed by the Contract Owner!");
        require(!franklinDecentralizedMarketplaceContractHasBeenSet, "The franklinDecentralizedMarketplaceContract reference has already been set!"); 
        
        FranklinDecentralizedMarketplace temp = FranklinDecentralizedMarketplace(franklinDecentralizedMarketplaceContractAddress);
        require(contractOwner == temp.contractOwner(), "Must be same Contract Owner in both the FranklinDecentralizedMarketplace and FranklinDecentralizedMarketplaceMediation contracts!");
        
        franklinDecentralizedMarketplaceContract = temp;
        franklinDecentralizedMarketplaceContractHasBeenSet = true;
    }
    
    // Private Utility function used to add a given Ethereum Address as a Mediator in the "listOfMediators". The given Ethereum Address - "_mediatorAddressString" - used 
    // as input to this method is the string format version of the Ethereum Address obtained from the "_addressToString" method.
    //
    // Assumption: Since this is an internal private method, will assume that input "_mediatorAddressString" argument is valid.
    function _addMediator(address _mediatorAddress) private {
        if (mediatorExistsMap[_mediatorAddress]) {
            return;
        }
        
        string memory _mediatorAddressString = GeneralUtilities._addressToString(_mediatorAddress);
        
        // Link the new node 
        listOfMediators[_mediatorAddressString][PREV] = EMPTY_STRING;
        listOfMediators[_mediatorAddressString][NEXT] = listOfMediators[EMPTY_STRING][NEXT];
    
        // Insert the new node
        listOfMediators[listOfMediators[EMPTY_STRING][NEXT]][PREV] = _mediatorAddressString;
        listOfMediators[EMPTY_STRING][NEXT] = _mediatorAddressString;
        
        numberOfMediators = GeneralUtilities._safeMathAdd(numberOfMediators, 1);
        mediatorExistsMap[_mediatorAddress] = true;
    }

    // Adds or Updates a Mediator with the given "_mediatorIpfsHashDescription", which refers to a JSON-formatted string stored in the IPFS Storage System.
    // The "msg.sender" will be the Ethereum Address of the entity wishing to become a Mediator in this Smart Contract. This method allows anyone with an Ethereum 
    // Address to add himself/herself as a Mediator.
    function addOrUpdateMediator(string memory _mediatorIpfsHashDescription) public {
        require(!GeneralUtilities._compareStringsEqual(_mediatorIpfsHashDescription, EMPTY_STRING), "Cannot have an empty String for the IPFS Hash Key Description of a Mediator!");
        descriptionInfoAboutMediators[msg.sender] = _mediatorIpfsHashDescription;
        
        _addMediator(msg.sender);
    }
    
    // Private Utility function used to remove a given Ethereum Address as a Mediator in the "listOfMediators". The given Ethereum Address - "_mediatorAddressString" - used 
    // as input to this method is the string format version of the Ethereum Address obtained from the "_addressToString" method.
    //
    // Assumption: Since this is an internal private method, will assume that input "_mediatorAddressString" argument is valid.    
    function _removeMediator(address _mediatorAddress) private {
        if (!mediatorExistsMap[_mediatorAddress]) {
            return;
        }
        
        string memory _mediatorAddressString = GeneralUtilities._addressToString(_mediatorAddress);
        
        // Stitch the neighbours together
        listOfMediators[ listOfMediators[_mediatorAddressString][PREV] ][NEXT] = listOfMediators[_mediatorAddressString][NEXT];
        listOfMediators[ listOfMediators[_mediatorAddressString][NEXT] ][PREV] = listOfMediators[_mediatorAddressString][PREV];
    
        // Delete state storage
        delete listOfMediators[_mediatorAddressString][PREV];
        delete listOfMediators[_mediatorAddressString][NEXT];
        
        numberOfMediators = GeneralUtilities._safeMathSubtract(numberOfMediators, 1);
        delete mediatorExistsMap[_mediatorAddress];
        
        // We do not wish to remove the Mediator Description nor any other Mediator information, because the mediator may be involved Mediating some sales, and we wish 
        // to keep such information around.
    }
    
    // Removes a Mediator from this Smart Contract. The "msg.sender" will be the Ethereum Address of the entity wishing to remove himself/herself as a Mediator in this Smart Contract. 
    // If there are any pending Sales that the Mediator is involved, the Sales and other information will still be kept.
    // This method allows anyone with an Ethereum  Address to remove himself/herself as a Mediator in this Smart Contract. 
    function removeMediator()  external {
        _removeMediator(msg.sender);
    }
    
    // Gets the Mediator Ethereum Address at the given "_index" from the "listOfMediators" double-linked list.
    //
    // Input Parameter:
    // _index : Index number into the "listOfMediators" double-linked list.
    //              Index starts at 0.
    //
    // Returns:
    // 1) If the "_index" is less than the "numberOfMediators", then the Etheruem Address of the Mediator at the given "_index" into the "listOfMediators" double-linked list
    //    is returned.
    // 2) If the "_index" is greater than or equal to the "numberOfMediators", then an Exception is thrown via the "require" below.
    function getMediatorAddress(uint _index) external view returns (address) {
        require(_index < numberOfMediators, "Index value given is greater than or equal to the Number of Mediators! It should be less than the Number of Mediators!");
        
        // The "key" below is the Ethereum Address in string format that is in the "listOfMediators" double-linked list.
        
        uint keyCount = 0;
        string memory key = EMPTY_STRING;
        while (true) {
            key = listOfMediators[key][NEXT];
            if (keyCount == _index) {
                break;
            }
            
            keyCount++;
        }
        
        return GeneralUtilities._parseEthereumAddressStringToAddress(key);    
    }
    
    // Gets the Number of Mediators in the "listOfMediators".
    function getNumberOfMediators() external view returns (uint) {
        return numberOfMediators;
    }
    
    // Returns back a boolean value to determine if the given "_mediatorAddres" is in the "listOfMediators".
    function mediatorExists(address _mediatorAddress) external view returns (bool) {
        return mediatorExistsMap[_mediatorAddress];
    }
    
    // Determines if the given "_mediatedSalesTransactionIpfsHash" Mediated Sales Transaction is in the Approved State. It is in the Approved State 
    // if 2-out-of-3 Buyer, Seller, and/or Mediator Approve it.
    function _mediatedSalesTransactionHasBeenApproved(string memory _mediatedSalesTransactionIpfsHash) private view returns (bool) {
        uint numberOfApprovals = 0;
        for (uint i = 0; i < 3; i++) {
            if (mediatedSalesTransactionApprovedByParties[_mediatedSalesTransactionIpfsHash][i]) {
                numberOfApprovals++;
            }
        }
        
        return (numberOfApprovals >= 2);
    }
    
    // Determines if the given "_mediatedSalesTransactionIpfsHash" Mediated Sales Transaction is in the Disapprived State. It is in the Disapproved State 
    // if 2-out-of-3 Buyer, Seller, and/or Mediator Disapprove it.    
    function _mediatedSalesTransactionHasBeenDisapproved(string memory _mediatedSalesTransactionIpfsHash) private view returns (bool) {
        uint numberOfDisapprovals = 0;
        for (uint i = 0; i < 3; i++) {
            if (mediatedSalesTransactionDisapprovedByParties[_mediatedSalesTransactionIpfsHash][i]) {
                numberOfDisapprovals++;
            }
        }
        
        return (numberOfDisapprovals >= 2);
    }    
    
    // This method allows one of the parties involved in a Mediated Sales Transaction to Approve the given "_mediatedSalesTransactionIpfsHash" Mediated 
    // Sales Transaction. 
    //
    // Input Parameters:
    // 1) msg.sender : The Ethereum Address of one of the parties
    // 2) _mediatedSalesTransactionIpfsHash : IPFS Hash string value that uniquely identifies the Mediated Sales Transaction. This IPFS Hash string value refers to   
    //    what should be JSON-formatted string describing the Sale stored in the IPFS Storage System.
    function approveMediatedSalesTransaction(string memory _mediatedSalesTransactionIpfsHash) public {
        require(mediatedSalesTransactionExists[_mediatedSalesTransactionIpfsHash], "Given Mediated Sales Transaction IPFS Hash does not exist!");
        
        bool allowedToApprove = (mediatedSalesTransactionAddresses[_mediatedSalesTransactionIpfsHash][BUYER_INDEX] == msg.sender) ||
                                (mediatedSalesTransactionAddresses[_mediatedSalesTransactionIpfsHash][SELLER_INDEX] == msg.sender) ||
                                (mediatedSalesTransactionAddresses[_mediatedSalesTransactionIpfsHash][MEDIATOR_INDEX] == msg.sender);
        require(allowedToApprove, "Not allowed to Approve Mediated Sales Transaction, because Message Sender is neither the Buyer, Seller, or Mediator!");
        
        // If 2-out-of-3 of the Buyer, Seller, and/or Mediator have Disapproved the Mediated Sales Transaction, then it's status cannot be changed, because the Buyer has already been refunded 
        // the amount he/she paid.
        require(!_mediatedSalesTransactionHasBeenDisapproved(_mediatedSalesTransactionIpfsHash), 
            "Mediated Sales Transaction has already been Disapproved by at least 2-out-of-3 of the Buyer, Seller, and/or Mediator! Cannot Approve at this point!");
        
        uint indexBuyerSellerOrMediator = 0;
        for (uint i = 0; i < 3; i++) {
            if (mediatedSalesTransactionAddresses[_mediatedSalesTransactionIpfsHash][i] == msg.sender) {
                indexBuyerSellerOrMediator = i;
            }
        }
        
        // If the Mediated Sales Transaction has already been Approved by 2-out-of-3 Buyer, Seller, and/or Mediator, then just note the approval from the "msg.sender" and that's it, because at 
        // this point the Seller Address has already been sent 95% of the Sales Amount, and the Mediator has already been sent 5% of the Sales Amount.
        if (_mediatedSalesTransactionHasBeenApproved(_mediatedSalesTransactionIpfsHash)) {
            mediatedSalesTransactionApprovedByParties[_mediatedSalesTransactionIpfsHash][indexBuyerSellerOrMediator] = true;
            return;
        }
        
        // Note the approval from the "msg.sender" Address. If one approves, than one cannot disapprove. Perhaps their's been a change of mind before FINAL Approval or Disapproval.
        mediatedSalesTransactionApprovedByParties[_mediatedSalesTransactionIpfsHash][indexBuyerSellerOrMediator] = true;
        mediatedSalesTransactionDisapprovedByParties[_mediatedSalesTransactionIpfsHash][indexBuyerSellerOrMediator] = false;
        
        // If after the "msg.sender" Approves the Mediated Sales Transaction, this reaches a State where 2-out-of-3 Buyer, Seller, and/or Mediator have Approved, then send 95% of the Sales Amount 
        // to the Seller Address and 5% of the Sales Amount to the Mediator Address.
        if (_mediatedSalesTransactionHasBeenApproved(_mediatedSalesTransactionIpfsHash)) {
            uint totalSalesAmount = mediatedSalesTransactionAmount[_mediatedSalesTransactionIpfsHash];
            uint amountOfWeiToSendMediator = GeneralUtilities._getPercentageOfTotalAmount(uint256(5), uint256(100), uint256(totalSalesAmount));
            uint amountOfWeiToSendSeller = GeneralUtilities._safeMathSubtract(totalSalesAmount, amountOfWeiToSendMediator);
            
            address payable sellerAddress = GeneralUtilities._convertAddressToAddressPayable(mediatedSalesTransactionAddresses[_mediatedSalesTransactionIpfsHash][SELLER_INDEX]);
            address payable mediatorAddress = GeneralUtilities._convertAddressToAddressPayable(mediatedSalesTransactionAddresses[_mediatedSalesTransactionIpfsHash][MEDIATOR_INDEX]);
            
            sellerAddress.transfer(amountOfWeiToSendSeller);
            mediatorAddress.transfer(amountOfWeiToSendMediator);
            
            emit MediatedSalesTransactionHasBeenFullyApproved(_mediatedSalesTransactionIpfsHash);
        }
    }
    
    // This method allows one of the parties involved in a Mediated Sales Transaction to Disapprove the given "_mediatedSalesTransactionIpfsHash" Mediated 
    // Sales Transaction. The "msg.sender" is the Ethereaum Address of one of the parties involved in the given "_mediatedSalesTransactionIpfsHash" Mediated 
    // Sales Transaction.
    //
    // Input Parameter:
    // 1) _mediatedSalesTransactionIpfsHash : IPFS Hash string value that uniquely identifies the Mediated Sales Transaction. This IPFS Hash string value refers to   
    //    what should be JSON-formatted string describing the Sale stored in the IPFS Storage System.
    // 2) msg.sender : Ethereum Address of the party attempting to Disapprove the Mediated Sales Transaction
    function disapproveMediatedSalesTransaction(string memory _mediatedSalesTransactionIpfsHash) public {
        require(mediatedSalesTransactionExists[_mediatedSalesTransactionIpfsHash], "Given Mediated Sales Transaction IPFS Hash does not exist!");
        
        bool allowedToDisapprove = (mediatedSalesTransactionAddresses[_mediatedSalesTransactionIpfsHash][BUYER_INDEX] == msg.sender) ||
                                (mediatedSalesTransactionAddresses[_mediatedSalesTransactionIpfsHash][SELLER_INDEX] == msg.sender) ||
                                (mediatedSalesTransactionAddresses[_mediatedSalesTransactionIpfsHash][MEDIATOR_INDEX] == msg.sender);
        require(allowedToDisapprove, "Not allowed to Disapprove Mediated Sales Transaction, because Message Sender is neither the Buyer, Seller, or Mediator!");
        
        // If 2-out-of-3 of the Buyer, Seller, and/or Mediator have Disapproved the Mediated Sales Transaction, then it's status cannot be changed, because the Seller has already been 
        // paid 95% of the Sales Amount, and the Mediator has already been paid 5% of the Sales Amount.
        require(!_mediatedSalesTransactionHasBeenApproved(_mediatedSalesTransactionIpfsHash), 
            "Mediated Sales Transaction has already been Approved by at least 2-out-of-3 of the Buyer, Seller, and/or Mediator! Cannot Disapprove at this point!");
        
        uint indexBuyerSellerOrMediator = 0;
        for (uint i = 0; i < 3; i++) {
            if (mediatedSalesTransactionAddresses[_mediatedSalesTransactionIpfsHash][i] == msg.sender) {
                indexBuyerSellerOrMediator = i;
            }
        }
        
        // If the Mediated Sales Transaction has already been Disapproved by 2-out-of-3 Buyer, Seller, and/or Mediator, then just note the disapproval from the "msg.sender" 
        // and that's it, because at this point the Buyer has alreaady been refunded the Sales Amount.
        if (_mediatedSalesTransactionHasBeenDisapproved(_mediatedSalesTransactionIpfsHash)) {
            mediatedSalesTransactionDisapprovedByParties[_mediatedSalesTransactionIpfsHash][indexBuyerSellerOrMediator] = true;
            return;
        }
        
        // Note the disapproval from the "msg.sender" Address. If one disapproves, than one cannot approve. Perhaps their's been a change of mind before FINAL Approval or Disapproval.
        mediatedSalesTransactionApprovedByParties[_mediatedSalesTransactionIpfsHash][indexBuyerSellerOrMediator] = false;
        mediatedSalesTransactionDisapprovedByParties[_mediatedSalesTransactionIpfsHash][indexBuyerSellerOrMediator] = true;
        
        // If after the "msg.sender" Disapproves the Mediated Sales Transaction, this reaches a State where 2-out-of-3 Buyer, Seller, and/or Mediator have Disapproved, then send 100% of the Sales Amount 
        // back to the Buyer Address.
        if (_mediatedSalesTransactionHasBeenApproved(_mediatedSalesTransactionIpfsHash)) {
            uint totalSalesAmount = mediatedSalesTransactionAmount[_mediatedSalesTransactionIpfsHash];
        
            address payable buyerAddress = GeneralUtilities._convertAddressToAddressPayable(mediatedSalesTransactionAddresses[_mediatedSalesTransactionIpfsHash][BUYER_INDEX]);
            buyerAddress.transfer(totalSalesAmount);
            
            emit MediatedSalesTransactionHasBeenFullyDisapproved(_mediatedSalesTransactionIpfsHash);
        }
    }
    
    // Allows a Buyer - identified by the "_buyerAddress" Ethereum Address that indirectly calls this methiod via the "FranklinDecentralizedMarketplace.purchaseItemWithMediator" 
    // method to purchase a "_quantity" of a specific Item - identified  by it's "_keyItemIpfsHash" - from a given Seller - identified by it's "_sellerAddress" Ethereum Address AND use a 
    // Mediator - identified by the given "_mediatorAddress" - to mediate the Mediatiations Sales Transaction - identified by the the given "_mediatedSalesTransactionIpfsHash" ID. 
    //
    // The FranklinDecentralizedMarketplaceMediation Contract mainly handles Sales Transactions that involve a Mediator. Thus, these would be referred to as 
    // Mediated Sales Transactions that involve a Buyer, Seller, and Mediator. Each Buyer, Seller, and Mediator will have a different Ethereum Address.
    //
    // The FranklinDecentralizedMarketplaceMediation Contract is used to store the Escrow ETH/WEI (i.e., "totalAmountOfWeiNeededToPurchase") used to pay for Items involved in ALL Mediated Sales Transactions. 
    // The Mediated Sales Transaction works as follows:
    // 1) If 2-out-of-3 of the Buyer, Seller, and/or Mediator Approves this Mediated Sales Transaction, then 95% of the "totalAmountOfWeiNeededToPurchase" will be sent to the Seller Address
    //    and 5% of the "totalAmountOfWeiNeededToPurchase" will be sent to the Mediator Address. 
    // 2) 2-out-of-3 of the Buyer, Seller, and/or Mediator Disapproves this Mediated Sales Transaction, then the "totalAmountOfWeiNeededToPurchase" will be sent back to the Buyer Address.
    // 3) If neither (1) or (2) above happens, then the Mediated Sales Transaction will be held in a State of Limbo and the "totalAmountOfWeiNeededToPurchase" will be kept inside 
    //    of this Contract.
    //
    // Input Parameters:
    // 1) _sellerAddress : Ethereum Address of the Seller
    // 2) _keyItemIpfsHash : This is the IPFS Hash of the Item being sold that points to a JSON-formatted string in the IPFS Storage System.
    // 3) _mediatorAddress : Ethereum Address of the Mediator
    // 4) _quantity : Quantity of the Item that the "msg.sender" Buyer wishes to purchase. 
    // 5) _mediatedSalesTransactionIpfsHash : This is the IPFS Hash of the Mediated Sales Transaction that points to a JSON-formatted string in the IPFS Storage System.
    // 6) _buyerAddress : Ethereum Address of the Buyer    
    function _purchaseItemWithMediator(address _buyerAddress, address _sellerAddress, address _mediatorAddress, string memory _mediatedSalesTransactionIpfsHash, 
                uint totalAmountOfWeiNeededToPurchase) private {
        require(!mediatedSalesTransactionExists[_mediatedSalesTransactionIpfsHash], "Mediated Sales Transaction already exists!");

        require(mediatorExistsMap[_mediatorAddress], "Given Mediator Address does not exist as a Mediator!");
        
        // Keep track of the existence of the Mediated Sales Transaction so that it can be Approved or Disapproved by the Buyer, Seller, and/or Mediator in the future.
        mediatedSalesTransactionExists[_mediatedSalesTransactionIpfsHash] = true;
        mediatedSalesTransactionAddresses[_mediatedSalesTransactionIpfsHash][BUYER_INDEX] = _buyerAddress;
        mediatedSalesTransactionAddresses[_mediatedSalesTransactionIpfsHash][SELLER_INDEX] = _sellerAddress;
        mediatedSalesTransactionAddresses[_mediatedSalesTransactionIpfsHash][MEDIATOR_INDEX] = _mediatorAddress;
        
        // The "totalAmountOfWeiNeededToPurchase" amount will automatically be sent to this Contract in Escrow in a Mediated Sales Transaction. We need to store the 
        // "totalAmountOfWeiNeededToPurchase" as follows so that when:
        // 1) 2-out-of-3 of the Buyer, Seller, and/or Mediator Approves this Mediated Sales Transaction, the 95% of the "totalAmountOfWeiNeededToPurchase" can be sent to the Seller Address and 5% 
        //    of the "msg.value" can be sent to the Mediator Address. 
        // 2) 2-out-of-3 of the Buyer, Seller, and/or Mediator Disapproves this Mediated Sales Transaction, the "totalAmountOfWeiNeededToPurchase" can be sent back to the Buyer Address.
        // 3) If neither (1) or (2) above happens, then the Mediated Sales Transaction will be held in a State of Limbo and the "totalAmountOfWeiNeededToPurchase" will be kept inside 
        //    of this Contract.
        mediatedSalesTransactionAmount[_mediatedSalesTransactionIpfsHash] = totalAmountOfWeiNeededToPurchase;
        
        numberOfMediationsMediatorInvolved[_mediatorAddress] = GeneralUtilities._safeMathAdd(numberOfMediationsMediatorInvolved[_mediatorAddress], 1);
    }
    
    // Allows a Buyer - identified by the "msg.sender" Ethereum Address that calls this method - to purchase a "_quantity" of a specific Item - identified 
    // by it's "_keyItemIpfsHash" - from a given Seller - identified by it's "_sellerAddress" Ethereum Address AND use a Mediator - identified by the given 
    // "_mediatorAddress" - to mediate the Mediatiations Sales Transaction - identified by the the given "_mediatedSalesTransactionIpfsHash" ID. 
    //
    // The FranklinDecentralizedMarketplaceMediation Contract mainly handles Sales Transactions that involve a Mediator. Thus, these would be referred to as 
    // Mediated Sales Transactions that involve a Buyer, Seller, and Mediator. Each Buyer, Seller, and Mediator will have a different Ethereum Address.
    //
    // The FranklinDecentralizedMarketplaceMediation Contract is used to store the Escrow ETH/WEI (i.e., "totalAmountOfWeiNeededToPurchase") used to pay for Items involved in ALL Mediated Sales Transactions. 
    // The Mediated Sales Transaction works as follows:
    // 1) If 2-out-of-3 of the Buyer, Seller, and/or Mediator Approves this Mediated Sales Transaction, then 95% of the "totalAmountOfWeiNeededToPurchase" will be sent to the Seller Address
    //    and 5% of the "totalAmountOfWeiNeededToPurchase" will be sent to the Mediator Address. 
    // 2) 2-out-of-3 of the Buyer, Seller, and/or Mediator Disapproves this Mediated Sales Transaction, then the "totalAmountOfWeiNeededToPurchase" will be sent back to the Buyer Address.
    // 3) If neither (1) or (2) above happens, then the Mediated Sales Transaction will be held in a State of Limbo and the "totalAmountOfWeiNeededToPurchase" will be kept inside 
    //    of this Contract.
    //
    // Input Parameters:
    // 1) _sellerAddress : Ethereum Address of the Seller
    // 2) _keyItemIpfsHash : This is the IPFS Hash of the Item being sold that points to a JSON-formatted string in the IPFS Storage System.
    // 3) _mediatorAddress : Ethereum Address of the Mediator
    // 4) _quantity : Quantity of the Item that the "msg.sender" Buyer wishes to purchase. 
    // 5) _mediatedSalesTransactionIpfsHash : This is the IPFS Hash of the Mediated Sales Transaction that points to a JSON-formatted string in the IPFS Storage System.
    // 6) msg.sender : Ethereum Address of the Buyer
    function purchaseItemWithMediator(address _sellerAddress, address _mediatorAddress, string memory _keyItemIpfsHash, 
                string memory _mediatedSalesTransactionIpfsHash, uint _quantity) payable public {
        require(franklinDecentralizedMarketplaceContractHasBeenSet, "The FranklinDecentralizedMarketplaceContract has not been set by the Contract Owner!");
        require(_quantity > 0, "Must purchase at least 1 quantity of the Item for Sale to happen!");
        require(!GeneralUtilities._compareStringsEqual(_keyItemIpfsHash, EMPTY_STRING), "Cannot have an empty String for the IPFS Hash Key of an Item you are purchasing!");
        require(!GeneralUtilities._compareStringsEqual(_mediatedSalesTransactionIpfsHash, EMPTY_STRING), "Cannot have an empty String for the IPFS Hash Key of the Mediated Sales Transaction!");
        
        require(franklinDecentralizedMarketplaceContract.sellerExists(_sellerAddress), "Given Seller Address does not exist as a Seller!");
        
        require(franklinDecentralizedMarketplaceContract.itemForSaleFromSellerExists(_sellerAddress, _keyItemIpfsHash), "Given IPFS Hash of Item is not listed as an Item For Sale from the Seller!");
        
        uint quantityAvailableForSaleOfItem = franklinDecentralizedMarketplaceContract.getQuantityAvailableForSaleOfAnItemBySeller(_sellerAddress, _keyItemIpfsHash);
        require(quantityAvailableForSaleOfItem > 0, "Seller has Zero quantity available for Sale for the Item requested to purchase!");
        require(quantityAvailableForSaleOfItem >= _quantity, 
            "Quantity available For Sale of the Item from the Seller is less than the quantity requested to purchase! Not enough of the Itenm available For Sale");
        
        uint priceOfItem = franklinDecentralizedMarketplaceContract.getPriceOfItem(_sellerAddress, _keyItemIpfsHash);
        require(priceOfItem > 0, "The Seller has not yet set a Price for Sale for the requested Item! Cannot purchase the Item!"); 
        
        uint totalAmountOfWeiNeededToPurchase = GeneralUtilities._safeMathMultiply(priceOfItem, _quantity);
        require(msg.value >= totalAmountOfWeiNeededToPurchase, "Not enough ETH/WEI was sent to purchase the quantity requested of the Item!");
        
        // Need to check that the Ethereum Addresses of the Buyer, Seller, and Mediator are ALL different!
        require(msg.sender != _sellerAddress, "The Buyer Address cannot be the same as the Seller Address!");
        require(msg.sender != _mediatorAddress, "The Buyer Address cannot be the same as the Mediator Address!");
        require(_sellerAddress != _mediatorAddress, "The Seller Address cannot be the same as the Mediator Address!");
        
        // Call below method to continue the processing of the Mediated Sales Transaction.
        _purchaseItemWithMediator(msg.sender, _sellerAddress, _mediatorAddress, _mediatedSalesTransactionIpfsHash, totalAmountOfWeiNeededToPurchase);
        
        // Subtract the appropriate "_quantity" of that Item for Sale to keep track of the new available quantity of that Item that may be sold. I know that the sale is NOT final 
        // at this point, BUT let's be optimistic. If the "_mediatedSalesTransactionIpfsHash" Mediated Sales Transaction gets Disapproved, then the quantity will have to be updated 
        // accordingly by the Seller Address via the "setQuantityAvailableForSaleOfAnItem" method.
        // 
        // If the Mediated Sales Transaction NEVER reaches a State of Approval nor Disapproval, then the Mediated Sales Transaction will be held in a State of Limbo and the 
        // "totalAmountOfWeiNeededToPurchase" will be kept inside of the FranklinDecentralizedMarketplaceMediation Contract. Thus, the quantity For Sale of the Item will never 
        // be automatically updated and it would have to be updated by the Seller Address via the "setQuantityAvailableForSaleOfAnItem" method.
        franklinDecentralizedMarketplaceContract.setQuantityAvailableForSaleOfAnItem(_sellerAddress, _keyItemIpfsHash, 
            GeneralUtilities._safeMathSubtract(quantityAvailableForSaleOfItem, _quantity));
        
        // We want to make sure to return back to the Buyer Address any excess ETH/WEI that exceeds the amount necessary to purchase the given "_quantity" of the Item.
        msg.sender.transfer(GeneralUtilities._safeMathSubtract(msg.value, totalAmountOfWeiNeededToPurchase));  
        
        // Since the FranklinDecentralizedMarketplaceMediation Contract will be handling any further Mediation actions, the Escrow should be kept there. 
        // So, send the Escrow Amount to the FranklinDecentralizedMarketplaceMediation Contract
        /*
        address payable mediationMarketplaceAddress = GeneralUtilities._convertAddressToAddressPayable(address(mediationMarketplace));
        mediationMarketplaceAddress.transfer(totalAmountOfWeiNeededToPurchase);
        */
        
        emit PurchaseItemWithMediatorEvent(msg.sender, _sellerAddress, _mediatorAddress, _keyItemIpfsHash, _mediatedSalesTransactionIpfsHash, _quantity);
    }
    
    // Gets the Description of a Mediator identified by the given "_mediatorAddress". The Description will be the IPFS Hash where the JSON-formatted Description of the Mediator exists.
    // If no such IPFS Hash Key Description exists, then an EMPTY_STRING will be returned. 
    function getMediatorIpfsHashDescription(address _mediatorAddress) external view returns (string memory) {
        return descriptionInfoAboutMediators[_mediatorAddress];
    }   
    
    // Gets the Number of Mediations that the given "_mediatorAddress" Mediator has been involved.
    function getNumberOfMediationsMediatorInvolved(address _mediatorAddress) external view returns (uint) {
        require(mediatorExistsMap[_mediatorAddress], "Given Mediator Address does not exist as a Mediator!");
        return numberOfMediationsMediatorInvolved[_mediatorAddress];
    }
}