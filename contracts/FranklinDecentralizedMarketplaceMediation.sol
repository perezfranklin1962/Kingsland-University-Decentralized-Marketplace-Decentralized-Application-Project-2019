pragma solidity >=0.4.22 <0.6.0;

import "./GeneralUtilities.sol";

contract FranklinDecentralizedMarketplaceMediation {
    using GeneralUtilities for *;
    
    // Constants used for the Double-Linked list and other uses.
    bool constant public PREV = false;
    bool constant public NEXT = true;
    string constant public EMPTY_STRING = "";
    
    // A double-linked list that lists all the Mediators by their Ethereum Address in string format.
    //
    // For an explanation as to how the "mapping(string => mapping(bool => string))" double linked-list works and the code pertaining to it from which was borrowed, please go to the
    // https://ethereum.stackexchange.com/questions/15337/can-we-get-all-elements-stored-in-a-mapping-in-the-contract web page.
    //
    // Each "string" below refers to the Ethereum Address of the Mediator in string format.
    mapping(string => mapping(bool => string)) public listOfMediators;
    
    // Map that keeps track of whether a Mediator exists. The "address" key is the Ethereum Address of the Mediator.
    mapping(address => bool) public mediatorExistsMap;
    
    // Keeps a count on the Number of Mediators that mediate sales on this platform.
    uint public numberOfMediators;
    
    // This Mapping contains the Description Information about the Mediators. The Mediator is responsible for adding this information.
    //
    // Mapping is as follows:
    // 1) Key: Ethereum Address of the Mediator
    // 2) Value: IPFS Hash string of the information pertaining to the Mediator. This information is stored in the IPFS Storage Network.
    //           This information should be a JSON-formatted string.
    mapping(address => string) public descriptionInfoAboutMediators;
    
    // This Mapping contains the Number of Mediations that a Mediator has been involved.
    //
    // Mapping is as follows:
    // 1) Key: Ethereum Address of the Mediator
    // 2) Value: Number of Mediations that a Mediators has been involved
    mapping(address => uint) public numberOfMediationsMediatorInvolved;

    // Constants used for the Mediated Sales Transactions mappings that have a "bool[3]" as a value in it's "mapping".
    uint constant public BUYER_INDEX = 0;
    uint constant public SELLER_INDEX = 1;
    uint constant public MEDIATOR_INDEX = 2;
    
    // Maps the Mediated Sales Transaction IPFS Hash to the three Ethereum Addresses involved in the Sale of an Item involving a Mediator. The Mediated Sales Transaction IPFS Hash
    // refers to a JSON-formatted string that describes this Transaction in the IPFS Storage System.
    //
    // Mapping is as follows:
    // 1) Key: IPFS Hash string of the Mediated Sales Transaction
    // 2) Values:
    //    A) address[0] : Ethereum Address of the Buyer
    //    B) address[1] : Ethereum Address of the Seller
    //    C) address[2] : Ethereum Address of the Mediator
    mapping(string => address[3]) public mediatedSalesTransactionAddresses;
    
    // Map that shows whether a Mediated Sales Transaction exists. The "string" key is the Mediated Sales Transaction IPFS Hash.
    //
    // Mapping is as follows:
    // 1) Key: IPFS Hash string of the Mediated Sales Transaction
    // 2) Value:
    //    A) Boolean value of "true" indicates that the Mediated Sales Transaction exists
    //    B) Boolean value of "false" indicates that the Mediated Sales Transaction exists
    mapping (string => bool) public mediatedSalesTransactionExists;
    
    // Map that maps the Mediated Sales Transaction to the Sales Amount in Wei. The "string" key is the Mediated Sales Transaction IPFS Hash.
    //
    // Mapping is as follows:
    // 1) Key: IPFS Hash string of the Mediated Sales Transaction
    // 2) Value: Amount in Wei that the Buyer chose to pay for the Item(s)
    mapping (string => uint) public mediatedSalesTransactionAmount;
    
    // Map that keeps track of whether a Mediated Sales Transaction has been Approved by the Buyer, Seller, and/or Mediator. 
    // The "string" key is the Mediated Sales Transaction IPFS Hash.
    //
    // Mapping is as follows:
    // 1) Key: IPFS Hash string of the Mediated Sales Transaction
    // 2) Values:
    //    A) address[0] : Boolean flag indicating if Buyer Approves
    //    B) address[1] : Boolean flag indicating if Seller Approves
    //    C) address[2] : Boolean flag indicating if Mediator Approves
    mapping (string => bool[3]) public mediatedSalesTransactionApprovedByParties;
    
    // Map that keeps track of whether a Mediated Sales Transaction has been Disapproved by the Buyer, Seller, and/or Mediator. 
    // The "string" key is the Mediated Sales Transaction IPFS Hash.
    //
    // Mapping is as follows:
    // 1) Key: IPFS Hash string of the Mediated Sales Transaction
    // 2) Values:
    //    A) address[0] : Boolean flag indicating if Buyer Disapproves
    //    B) address[1] : Boolean flag indicating if Seller Disapproves
    //    C) address[2] : Boolean flag indicating if Mediator Disapproves
    mapping (string => bool[3]) public mediatedSalesTransactionDisapprovedByParties;
    
    // Below is the Contract Address of the FranklinDecentralizedMarketplace Contract that deployed this Contract - the 
    // FranklinDecentralizedMarketplaceMediation Contract - via the constructor of the FranklinDecentralizedMarketplace Contract.
    // The Contract code had to be split in two, because the Etherum Virtual Machine (EVM) would not allow deployment of a Contract
    // that has more than 24576 bytes. So, the decision was made to SPLIT the code into the FranklinDecentralizedMarketplace 
    // and FranklinDecentralizedMarketplaceMediation Contracts where the FranklinDecentralizedMarketplace would deploy the
    // FranklinDecentralizedMarketplaceMediation Contract via it's Conststructor. 
    //
    // The code of the FranklinDecentralizedMarketplaceMediation Contract is written so that ONLY the "franklinDecentralizedMarketplaceContractAddress"
    // that spawned and deployed this FranklinDecentralizedMarketplaceMediation Contract may execute any of the public functions of this 
    // FranklinDecentralizedMarketplaceMediation Contract
    address public franklinDecentralizedMarketplaceContractAddress;
    
    modifier onlyContractOwnerMayExecute {
        require(msg.sender == franklinDecentralizedMarketplaceContractAddress, "Only the Ethereum Address that deployed THIS Contract may execute any of it's public methods!");
        _;
    }
    
    // We're getting the Address of the FranklinDecentralizedMarketplace Contract that deployed THIS FranklinDecentralizedMarketplaceMediation via the
    // constructor of this FranklinDecentralizedMarketplaceMediation Contract.
    constructor() public {
        franklinDecentralizedMarketplaceContractAddress = msg.sender;
    }
    
    // Returns back the Contract Address of the FranklinDecentralizedMarketplace Contract that deployed THIS FranklinDecentralizedMarketplaceMediation 
    // Contract via the constructor of the FranklinDecentralizedMarketplace Contract. Only the returned Address may execute ANY of the public methods of THIS
    // FranklinDecentralizedMarketplace Contract.
    function getOnlyAddressThatMayAccessThisContract() onlyContractOwnerMayExecute external view returns (address) {
        return franklinDecentralizedMarketplaceContractAddress;
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
    // The "_mediatorAddress" will be the Ethereum Address of the entity wishing to become a Mediator in this Smart Contract. This method allows anyone with an Ethereum 
    // Address to add himself/herself as a Mediator in this Smart Contract.
    function addOrUpdateMediator(address _mediatorAddress, string memory _mediatorIpfsHashDescription) onlyContractOwnerMayExecute public {
        require(!GeneralUtilities._compareStringsEqual(_mediatorIpfsHashDescription, EMPTY_STRING), "Cannot have an empty String for the IPFS Hash Key Description of a Mediator!");
        descriptionInfoAboutMediators[msg.sender] = _mediatorIpfsHashDescription;
        
        _addMediator(_mediatorAddress);
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
        
        numberOfMediators--;
        delete mediatorExistsMap[_mediatorAddress];
        
        // We do not wish to remove the Mediator Description nor any other Mediator information, because the mediator may be involved Mediating some sales, and we wish 
        // to keep such information around.
    }
    
    // Removes a Mediator from this Smart Contract. The "_mediatorAddress" will be the Ethereum Address of the entity wishing to remove himself/herself as a Mediator in this Smart Contract. 
    // If there are any pending Sales that the Mediator is involved, the Sales and other information will still be kept.
    // This method allows anyone with an Ethereum  Address to remove himself/herself as a Mediator in this Smart Contract. 
    function removeMediator(address _mediatorAddress) onlyContractOwnerMayExecute external {
        _removeMediator(_mediatorAddress);
    }
    
    // Gets the Mediator Ethereum Address at the given "_index" from the "listOfMediators" double-linked list.
    //
    // Input Parameter:
    // _itemIndex : Index number into the "listOfMediators" double-linked list.
    //              Index starts at 0.
    //
    // Returns:
    // 1) If the "_index" is less than the "numberOfMediators", then the Etheruem Address of the Mediator at the given "_index" into the "listOfMediators" double-linked list
    //    is returned.
    // 2) If the "_index" is greater than or equal to the "numberOfMediators", then an Exception is thrown via the "require" below.
    function getMediatorAddress(uint _index) onlyContractOwnerMayExecute external view returns (address) {
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
    function getNumberOfMediators() onlyContractOwnerMayExecute external view returns (uint) {
        return numberOfMediators;
    }
    
    // Returns back a boolean value to determine if the given "_mediatorAddres" is in the "listOfMediators".
    function mediatorExists(address _mediatorAddress) onlyContractOwnerMayExecute external view returns (bool) {
        return mediatorExistsMap[_mediatorAddress];
    }
    
    function _mediatedSalesTransactionHasBeenApproved(string memory _mediatedSalesTransactionIpfsHash) private view returns (bool) {
        uint numberOfApprovals = 0;
        for (uint i = 0; i < 3; i++) {
            if (mediatedSalesTransactionApprovedByParties[_mediatedSalesTransactionIpfsHash][i]) {
                numberOfApprovals++;
            }
        }
        
        return (numberOfApprovals >= 2);
    }
    
    function _mediatedSalesTransactionHasBeenDisapproved(string memory _mediatedSalesTransactionIpfsHash) private view returns (bool) {
        uint numberOfDisapprovals = 0;
        for (uint i = 0; i < 3; i++) {
            if (mediatedSalesTransactionDisapprovedByParties[_mediatedSalesTransactionIpfsHash][i]) {
                numberOfDisapprovals++;
            }
        }
        
        return (numberOfDisapprovals >= 2);
    }    
    
    function approveMediatedSalesTransaction(address _approverAddress, string memory _mediatedSalesTransactionIpfsHash) onlyContractOwnerMayExecute public {
        require(mediatedSalesTransactionExists[_mediatedSalesTransactionIpfsHash], "Given Mediated Sales Transaction IPFS Hash does not exist!");
        
        bool allowedToApprove = (mediatedSalesTransactionAddresses[_mediatedSalesTransactionIpfsHash][BUYER_INDEX] == _approverAddress) ||
                                (mediatedSalesTransactionAddresses[_mediatedSalesTransactionIpfsHash][SELLER_INDEX] == _approverAddress) ||
                                (mediatedSalesTransactionAddresses[_mediatedSalesTransactionIpfsHash][MEDIATOR_INDEX] == _approverAddress);
        require(allowedToApprove, "Not allowed to Approve Mediated Sales Transaction, because Message Sender is neither the Buyer, Seller, or Mediator!");
        
        // If 2-out-of-3 of the Buyer, Seller, and/or Mediator have Disapproved the Mediated Sales Transaction, then it's status cannot be changed, because the Buyer has already been refunded 
        // the amount he/she paid.
        require(!_mediatedSalesTransactionHasBeenDisapproved(_mediatedSalesTransactionIpfsHash), 
            "Mediated Sales Transaction has already been Disapproved by at least 2-out-of-3 of the Buyer, Seller, and/or Mediator! Cannot Approve at this point!");
        
        uint indexBuyerSellerOrMediator = 0;
        for (uint i = 0; i < 3; i++) {
            if (mediatedSalesTransactionAddresses[_mediatedSalesTransactionIpfsHash][i] == _approverAddress) {
                indexBuyerSellerOrMediator = i;
            }
        }
        
        // If the Mediated Sales Transaction has already been Approved by 2-out-of-3 Buyer, Seller, and/or Mediator, then just note the approval from the "msg.sender" and that's it, because at 
        // this point the Seller Address has already been sent 95% of the Sales Amount, and the Mediator has already been sent 5% of the Sales Amount.
        if (_mediatedSalesTransactionHasBeenApproved(_mediatedSalesTransactionIpfsHash)) {
            mediatedSalesTransactionApprovedByParties[_mediatedSalesTransactionIpfsHash][indexBuyerSellerOrMediator] = true;
            return;
        }
        
        // Note the approval from the "_approverAddress". If one approves, than one cannot disapprove. Perhaps their's been a change of mind before FINAL Approval or Disapproval.
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
        }
    }
    
    function disapproveMediatedSalesTransaction(address _disapproverAddress, string memory _mediatedSalesTransactionIpfsHash) onlyContractOwnerMayExecute public {
        require(mediatedSalesTransactionExists[_mediatedSalesTransactionIpfsHash], "Given Mediated Sales Transaction IPFS Hash does not exist!");
        
        bool allowedToDisapprove = (mediatedSalesTransactionAddresses[_mediatedSalesTransactionIpfsHash][BUYER_INDEX] == _disapproverAddress) ||
                                (mediatedSalesTransactionAddresses[_mediatedSalesTransactionIpfsHash][SELLER_INDEX] == _disapproverAddress) ||
                                (mediatedSalesTransactionAddresses[_mediatedSalesTransactionIpfsHash][MEDIATOR_INDEX] == _disapproverAddress);
        require(allowedToDisapprove, "Not allowed to Disapprove Mediated Sales Transaction, because Message Sender is neither the Buyer, Seller, or Mediator!");
        
        // If 2-out-of-3 of the Buyer, Seller, and/or Mediator have Disapproved the Mediated Sales Transaction, then it's status cannot be changed, because the Seller has already been 
        // paid 95% of the Sales Amount, and the Mediator has already been paid 5% of the Sales Amount.
        require(!_mediatedSalesTransactionHasBeenApproved(_mediatedSalesTransactionIpfsHash), 
            "Mediated Sales Transaction has already been Approved by at least 2-out-of-3 of the Buyer, Seller, and/or Mediator! Cannot Disapprove at this point!");
        
        uint indexBuyerSellerOrMediator = 0;
        for (uint i = 0; i < 3; i++) {
            if (mediatedSalesTransactionAddresses[_mediatedSalesTransactionIpfsHash][i] == _disapproverAddress) {
                indexBuyerSellerOrMediator = i;
            }
        }
        
        // If the Mediated Sales Transaction has already been Disapproved by 2-out-of-3 Buyer, Seller, and/or Mediator, then just note the disapproval from the "_disapproverAddress" 
        // and that's it, because at this point the Buyer has alreaady been refunded the Sales Amount.
        if (_mediatedSalesTransactionHasBeenDisapproved(_mediatedSalesTransactionIpfsHash)) {
            mediatedSalesTransactionDisapprovedByParties[_mediatedSalesTransactionIpfsHash][indexBuyerSellerOrMediator] = true;
            return;
        }
        
        // Note the disapproval from the "_disapproverAddress". If one disapproves, than one cannot approve. Perhaps their's been a change of mind before FINAL Approval or Disapproval.
        mediatedSalesTransactionApprovedByParties[_mediatedSalesTransactionIpfsHash][indexBuyerSellerOrMediator] = false;
        mediatedSalesTransactionDisapprovedByParties[_mediatedSalesTransactionIpfsHash][indexBuyerSellerOrMediator] = true;
        
        // If after the "msg.sender" Disapproves the Mediated Sales Transaction, this reaches a State where 2-out-of-3 Buyer, Seller, and/or Mediator have Disapproved, then send 100% of the Sales Amount 
        // back to the Buyer Address.
        if (_mediatedSalesTransactionHasBeenApproved(_mediatedSalesTransactionIpfsHash)) {
            uint totalSalesAmount = mediatedSalesTransactionAmount[_mediatedSalesTransactionIpfsHash];
        
            address payable buyerAddress = GeneralUtilities._convertAddressToAddressPayable(mediatedSalesTransactionAddresses[_mediatedSalesTransactionIpfsHash][BUYER_INDEX]);
            buyerAddress.transfer(totalSalesAmount);
        }
    }
    
    // Gets the Description of a Mediator identified by the given "_mediatorAddress". The Description will be the IPFS Hash where the JSON-formatted Description of the Mediator exists.
    // If no such IPFS Hash Key Description exists, then an EMPTY_STRING will be returned.
    function getMediatorIpfsHashDescription(address _mediatorAddress) external view returns (string memory) {
        return descriptionInfoAboutMediators[_mediatorAddress];
    }   
    
    function purchaseItemWithMediator(address _buyerAddress, address _sellerAddress, address _mediatorAddress, string memory _mediatedSalesTransactionIpfsHash, 
                uint totalAmountOfWeiNeededToPurchase) onlyContractOwnerMayExecute public {
        require(!mediatedSalesTransactionExists[_mediatedSalesTransactionIpfsHash], "Mediated Sales Transaction already exists!");

        require(mediatorExistsMap[_mediatorAddress], "Given Mediator Address does not exist as a Mediator!");
        
        // Keep track of the existence of the Mediated Sales Transaction so that it can be Approved or Disapproved by the Buyer, Seller, and/or Mediator in the future.
        mediatedSalesTransactionExists[_mediatedSalesTransactionIpfsHash] = true;
        mediatedSalesTransactionAddresses[_mediatedSalesTransactionIpfsHash][BUYER_INDEX] = _buyerAddress;
        mediatedSalesTransactionAddresses[_mediatedSalesTransactionIpfsHash][SELLER_INDEX] = _sellerAddress;
        mediatedSalesTransactionAddresses[_mediatedSalesTransactionIpfsHash][MEDIATOR_INDEX] = _mediatorAddress;
        
        // The "totalAmountOfWeiNeededToPurchase" amount will automatically be sent to this Contract in Escrow in a Mediated Sales Transaction. We need to store the "totalAmountOfWeiNeededToPurchase" as follows so that when:
        // 1) 2-out-of-3 of the Buyer, Seller, and/or Mediator Approves this Mediated Sales Transaction, the 95% of the "totalAmountOfWeiNeededToPurchase" can be sent to the Seller Address and 5% of the 
        //    "msg.value" can be sent to the Mediator Address. 
        // 2) 2-out-of-3 of the Buyer, Seller, and/or Mediator Disapproves this Mediated Sales Transaction, the "totalAmountOfWeiNeededToPurchase" can be sent back to the Buyer Address.
        mediatedSalesTransactionAmount[_mediatedSalesTransactionIpfsHash] = totalAmountOfWeiNeededToPurchase;
        
        numberOfMediationsMediatorInvolved[_mediatorAddress] = GeneralUtilities._safeMathAdd(numberOfMediationsMediatorInvolved[_mediatorAddress], 1);
    }
}