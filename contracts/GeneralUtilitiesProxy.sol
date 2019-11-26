pragma solidity >=0.4.22 <0.6.0;

import "./GeneralUtilities.sol";

// Purpose of this contract is to simply allow for the testing of ALL the frunctions in the GeneralUtilities.sol file. It simply serves as a 
// proxy so that the actual unit tests may be written in JavaScript inside of the GeneralUtilities.js file.
//
// Initally, this file was placed inside of the "test" directory. The Unit Tests in the GeneralUtilitiesTest.js file ran successfully when "truffle test"
// was executed, but many failed when the "npm run test:coverage" ran. So, decision was made to move it to the "contracts" directory, and all the unit tests
// in the GeneralUtilitiesTest.js file passed.
contract GeneralUtilitiesProxy {
    using GeneralUtilities for *;
    
    function _getConcatenationOfEthereumAddressAndIpfsHash(address _ethereumAddress, string memory _ipfsHash) public pure returns (string memory) {
    	return GeneralUtilities._getConcatenationOfEthereumAddressAndIpfsHash(_ethereumAddress, _ipfsHash);
    }
    
    function _convertAddressToAddressPayable(address _incomingAddress) public pure returns (address payable) {
        return GeneralUtilities._convertAddressToAddressPayable(_incomingAddress);
    }
    
    function _safeMathAdd(uint256 a, uint256 b) public pure returns (uint256) {
    	return GeneralUtilities._safeMathAdd(a, b);
    }
    
    function _safeMathSubtract(uint256 a, uint256 b) public pure returns (uint256) {
    	return GeneralUtilities._safeMathSubtract(a, b);
    }
    
    function _compareStringsEqual(string memory a, string memory b) public pure returns (bool) {
    	return GeneralUtilities._compareStringsEqual(a, b);
    }
    
    function _addressToString(address _addr) public pure returns (string memory) {
    	return GeneralUtilities._addressToString(_addr);
    }
    
    function _parseEthereumAddressStringToAddress(string memory _a) public pure returns (address) {
    	return GeneralUtilities._parseEthereumAddressStringToAddress(_a);
    }
    
    function _safeMathDivide(uint256 a, uint256 b) public pure returns (uint256) {
    	return GeneralUtilities._safeMathDivide(a, b);
    }
    
    function _safeMathMultiply(uint256 _a, uint256 _b) public pure returns (uint256) {
    	return GeneralUtilities._safeMathMultiply(_a, _b);
    }
    
    function _getPercentageOfTotalAmount(uint256 _numerator, uint256 _denominator, uint256 _totalAmount) public pure returns (uint256) {
    	return GeneralUtilities._getPercentageOfTotalAmount(_numerator, _denominator, _totalAmount);
    }
}