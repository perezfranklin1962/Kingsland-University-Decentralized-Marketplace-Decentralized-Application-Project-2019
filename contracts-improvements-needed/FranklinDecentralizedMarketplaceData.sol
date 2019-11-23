pragma solidity >=0.4.22 <0.6.0;

import "./GeneralUtilities.sol";

contract FranklinDecentralizedMarketplaceData {
    
    // This contract was created, because I needed to create the "addressAssociatedWithMediatorDescription" mapping, and I could not add it in the 
    // FranklinDecentralizedMarketplaceMediation, because when I attempted to deploy the FranklinDecentralizedMarketplaceMediation Contract, the 
    // EVM (Ethereum Virtial Machine) would not lety me due to exceeding number of bytes limit by EVM (Ethereum Virtual Machine).
    
    string constant private EMPTY_STRING = "";
    
    
    // Map that shows whether a Mediated Sales Transaction exists. The "string" key is the Mediated Sales Transaction IPFS Hash.
    //
    // Mapping is as follows:
    // 1) Key: IPFS Hash string of the Mediated Sales Transaction
    // 2) Value:
    //    A) Boolean value of "true" indicates that the Mediated Sales Transaction exists
    //    B) Boolean value of "false" indicates that the Mediated Sales Transaction exists
    mapping (string => bool) public mediatedSalesTransactionExists;
    
    // This Mapping contains the Description Information about the Mediators. The Mediator is responsible for adding this information.
    // A Mediator cannot exist without having Description Information, but you can have a Mediator that currently does not exist have a 
    // Description Information.
    //
    // Mapping is as follows:
    // 1) Key: Ethereum Address of the Mediator
    // 2) Value: IPFS Hash string of the information pertaining to the Mediator. This information is stored in the IPFS Storage Network.
    //           This information should be a JSON-formatted string.
    mapping(address => string) public descriptionInfoAboutMediators;
    
    // This mapping maps the Mediator IPFS Description to the Mediator Address (in string format). This is needed in order to prevent a Mediator 
    // address from using the Mediator IPFS Description of someone else.
    //
    // Mapping is as follows:
    // 1) Key: IPFS Hash string of the information pertaining to the Mediator. This information is stored in the IPFS Storage Network.
    //         This information should be a JSON-formatted string.
    // 2) Value: Ethereum Address of the Mediator in string format
    mapping (string => string) public addressAssociatedWithMediatorDescription;
    
    // This Mapping contains the Number of Mediations that a Mediator has been involved.
    //
    // Mapping is as follows:
    // 1) Key: Ethereum Address of the Mediator
    // 2) Value: Number of Mediations that a Mediators has been involved
    mapping(address => uint) public numberOfMediationsMediatorInvolved;
    
    // Map that maps the Mediated Sales Transaction to the Sales Amount in Wei. The "string" key is the Mediated Sales Transaction IPFS Hash.
    //
    // Mapping is as follows:
    // 1) Key: IPFS Hash string of the Mediated Sales Transaction
    // 2) Value: Amount in Wei that the Buyer chose to pay for the Item(s)
    mapping (string => uint) public mediatedSalesTransactionAmount;
    
    // Map that keeps track of all the Mediated Sales Transactions that an Address has been involved either as a Buyer, Seller, or Mediator.
    //
    // Mapping is as follows:
    // 1) Key: Ethereum Address of the Buyer, Seller, or Mediator 
    // 2) Value: Dynamic Array of string elements where each element is the Mediated Sales Transaction IPFS Hash that uniquely identifies the 
    //           Mediated Sales Transaction
    mapping (address => string[]) public mediatedSalesTransactionsAddressInvolved;
    
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
    
    address public contractOwner;
    
    address public franklinDecentralizedMarketplaceMediationContractAddress;
    bool public franklinDecentralizedMarketplaceMediationContractAddressHasBeenSet;
    
    modifier onlyFranklinDecentralizedMarketplaceMediationContractAddress {
        require(franklinDecentralizedMarketplaceMediationContractAddressHasBeenSet, "The franklinDecentralizedMarketplaceMediationContractAddress has not been set by contractOwner!");
        require(msg.sender == franklinDecentralizedMarketplaceMediationContractAddress, 
            "Only the FranklinDecentralizedMarketplaceMediationContract Address set by the Contract Owner may execute this method!");
        _;
    }
    
    constructor() public {
        contractOwner = msg.sender;
    }
    
    function setFranklinDecentralizedMarketplaceMediationContractAddress(address _franklinDecentralizedMarketplaceMediationContractAddress) public {
        require(msg.sender == contractOwner, "Only Contract Owner may execute this method!");
        require(!franklinDecentralizedMarketplaceMediationContractAddressHasBeenSet, "The franklinDecentralizedMarketplaceMediationContractAddress has alraedy been set!");
        
        franklinDecentralizedMarketplaceMediationContractAddress = _franklinDecentralizedMarketplaceMediationContractAddress;
        franklinDecentralizedMarketplaceMediationContractAddressHasBeenSet = true;
    }
    
    function setDescriptionInfoAboutMediator(address _mediatorAddress, string memory _mediatorIpfsHashDescription) onlyFranklinDecentralizedMarketplaceMediationContractAddress public {
        require(!GeneralUtilities._compareStringsEqual(_mediatorIpfsHashDescription, EMPTY_STRING), "Cannot have an empty String for the IPFS Hash Key Description of a Mediator!");
        
        string memory _mediatorAddressString = GeneralUtilities._addressToString(_mediatorAddress);
        string memory theAddressStringAssociatedWithMediatorDescription = addressAssociatedWithMediatorDescription[_mediatorIpfsHashDescription];
        require(GeneralUtilities._compareStringsEqual(theAddressStringAssociatedWithMediatorDescription, EMPTY_STRING) ||
                GeneralUtilities._compareStringsEqual(theAddressStringAssociatedWithMediatorDescription, _mediatorAddressString),
                "Cannot set a Mediator IPFS Description that has already been associated with another Ethereum Address");
        
        descriptionInfoAboutMediators[_mediatorAddress] = _mediatorIpfsHashDescription;
        addressAssociatedWithMediatorDescription[_mediatorIpfsHashDescription] = _mediatorAddressString;
    }
    
    function setNumberOfMediationsMediatorInvolved(address _mediatorAddress, uint _numberOfMediations) onlyFranklinDecentralizedMarketplaceMediationContractAddress public {
        numberOfMediationsMediatorInvolved[_mediatorAddress] = _numberOfMediations;
    }
    
    function setMediatedSalesTransactionAmount(string memory _mediatorIpfsHashDescription, uint _amount) onlyFranklinDecentralizedMarketplaceMediationContractAddress public {
        mediatedSalesTransactionAmount[_mediatorIpfsHashDescription] = _amount;
    }
    
    // Gets the number of Mediated sales Transactions that the given "_partyAddress" has been involved.
    function numberOfMediatedSalesTransactionsAddressInvolved(address _partyAddress) external view returns (uint) {
        return mediatedSalesTransactionsAddressInvolved[_partyAddress].length;
    }
    
    function addMediatedSalesTransactionsAddressInvolved(address _partyAddress, string memory _mediatedSalesTransactionIpfsHash) onlyFranklinDecentralizedMarketplaceMediationContractAddress public {
        mediatedSalesTransactionsAddressInvolved[_partyAddress].push(_mediatedSalesTransactionIpfsHash);
    }
    
    // Determines if the given "_mediatedSalesTransactionIpfsHash" Mediated Sales Transaction is in the Approved State. It is in the Approved State 
    // if 2-out-of-3 Buyer, Seller, and/or Mediator Approve it.
    function mediatedSalesTransactionHasBeenApproved(string memory _mediatedSalesTransactionIpfsHash) public view returns (bool) {
        require(mediatedSalesTransactionExists[_mediatedSalesTransactionIpfsHash], "Given Mediated Sales Transaction IPFS Hash does not exist!");
        
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
    function mediatedSalesTransactionHasBeenDisapproved(string memory _mediatedSalesTransactionIpfsHash) public view returns (bool) {
        require(mediatedSalesTransactionExists[_mediatedSalesTransactionIpfsHash], "Given Mediated Sales Transaction IPFS Hash does not exist!");
        
        uint numberOfDisapprovals = 0;
        for (uint i = 0; i < 3; i++) {
            if (mediatedSalesTransactionDisapprovedByParties[_mediatedSalesTransactionIpfsHash][i]) {
                numberOfDisapprovals++;
            }
        }
        
        return (numberOfDisapprovals >= 2);
    }   
    
    function setMediatedSalesTransactionExistsFlag(string memory _mediatedSalesTransactionIpfsHash, bool _flag) onlyFranklinDecentralizedMarketplaceMediationContractAddress public {
        mediatedSalesTransactionExists[_mediatedSalesTransactionIpfsHash] = _flag;
    }
    
    function setMediatedSalesTransactionApprovedByPartiesFlag(string memory _mediatedSalesTransactionIpfsHash, uint _indexBuyerSellerOrMediator, bool _flag) onlyFranklinDecentralizedMarketplaceMediationContractAddress public {
        mediatedSalesTransactionApprovedByParties[_mediatedSalesTransactionIpfsHash][_indexBuyerSellerOrMediator] = _flag;
    }
    
    function setMediatedSalesTransactionDisapprovedByPartiesFlag(string memory _mediatedSalesTransactionIpfsHash, uint _indexBuyerSellerOrMediator, bool _flag) onlyFranklinDecentralizedMarketplaceMediationContractAddress public {
        mediatedSalesTransactionDisapprovedByParties[_mediatedSalesTransactionIpfsHash][_indexBuyerSellerOrMediator] = _flag;   
    }
}