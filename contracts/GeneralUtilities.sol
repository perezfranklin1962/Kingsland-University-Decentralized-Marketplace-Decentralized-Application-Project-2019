pragma solidity >=0.4.22 <0.6.0;

library GeneralUtilities {

    string constant public UNDER_SCORE_STRING = "_";
    
    // Gets the Concatentaion of an Ethereum Address and an IPFS Hash string with an underscore placed in between.
    //
    // Reference for coding technique --> https://ethereum.stackexchange.com/questions/729/how-to-concatenate-strings-in-solidity
    function _getConcatenationOfEthereumAddressAndIpfsHash(address _ethereumAddress, string memory _ipfsHash) internal pure returns (string memory) {
        return string(abi.encodePacked(_addressToString(_ethereumAddress), UNDER_SCORE_STRING, _ipfsHash));
    }
    
    // Source --> https://ethereum.stackexchange.com/questions/62222/address-payable-type-store-address-and-send-later-using-solidity-0-5-0
    function _convertAddressToAddressPayable(address _incomingAddress) internal pure returns (address payable) {
        address payable anAddressPayable = address(uint160(_incomingAddress));
        return anAddressPayable;
    }
    
    // Allow for safely adding two numbers.
    // Source --> https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/math/SafeMath.sol
    function _safeMathAdd(uint256 a, uint256 b) internal pure returns (uint256) {
        uint256 c = a + b;
        require(c >= a && c >= b, "_safeMathAdd : Addition Overflow");

        return c;
    }
    
    // Allows for safely subtracting two numbers.
    // Source --> https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/math/SafeMath.sol
    function _safeMathSubtract(uint256 a, uint256 b) internal pure returns (uint256) {
        require(b <= a, "_safeMathSubtract : Subtraction Overflow");
        uint256 c = a - b;

        return c;
    }
    
    // Compares two strings for equality.
    //
    // Reference --> https://ethereum.stackexchange.com/questions/30912/how-to-compare-strings-in-solidity
    function _compareStringsEqual(string memory a, string memory b) internal pure returns (bool) {
        return ( keccak256(abi.encodePacked((a))) == keccak256(abi.encodePacked((b))) );
    }
    
    // Converts an Ethereum Address to a string.
    // 
    // Reference --> https://ethereum.stackexchange.com/questions/8346/convert-address-to-string
    function _addressToString(address _addr) internal pure returns (string memory) {
        bytes32 value = bytes32(uint256(_addr));
        bytes memory alphabet = "0123456789abcdef";
    
        bytes memory str = new bytes(42);
        str[0] = '0';
        str[1] = 'x';
        for (uint i = 0; i < 20; i++) {
            str[2+i*2] = alphabet[uint(uint8(value[i + 12] >> 4))];
            str[3+i*2] = alphabet[uint(uint8(value[i + 12] & 0x0f))];
        }
        return string(str);
    }
    
    // Converts an Ethereum Address string that was obtained from the "_addressToString" method above and converts it into
    // an Ethereum "address" type.
    //
    // Reference --> https://ethereum.stackexchange.com/questions/67436/a-solidity-0-5-x-function-to-convert-adress-string-to-ethereum-address
    function _parseEthereumAddressStringToAddress(string memory _a) internal pure returns (address) {
        bytes memory tmp = bytes(_a);
        uint160 iaddr = 0;
        uint160 b1;
        uint160 b2;
        
        for (uint i = 2; i < 2 + 2 * 20; i += 2) {
            iaddr *= 256;
            b1 = uint160(uint8(tmp[i]));
            b2 = uint160(uint8(tmp[i + 1]));
            
            if ((b1 >= 97) && (b1 <= 102)) {
                b1 -= 87;
            } else if ((b1 >= 65) && (b1 <= 70)) {
                b1 -= 55;
            } else if ((b1 >= 48) && (b1 <= 57)) {
                b1 -= 48;
            }
            
            if ((b2 >= 97) && (b2 <= 102)) {
                b2 -= 87;
            } else if ((b2 >= 65) && (b2 <= 70)) {
                b2 -= 55;
            } else if ((b2 >= 48) && (b2 <= 57)) {
                b2 -= 48;
            }
            
            iaddr += (b1 * 16 + b2);
        }
        
        return address(iaddr);
    }
    
    // Allows for safely dividing two numbers.
    // Source --> https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/math/SafeMath.sol
    function _safeMathDivide(uint256 a, uint256 b) internal pure returns (uint256) {
        require(b > 0, "_safeMathDivide : Denominator is 0"); // Solidity automatically throws when dividing by 0
        uint256 c = a / b;
        // require(a == b * c + a % b, "_safeMathDivide : Division Overflow"); // There is no case in which this doesn't hold
        return c;
    }
    
    // Allows for safely multiplying two numbers.
    // Source --> Simple Timed Auction Homeowrk Assignment and https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/math/SafeMath.sol
    function _safeMathMultiply(uint256 _a, uint256 _b) internal pure returns (uint256) {
        if (_a == 0 || _b == 0) {
            return 0;
        }
        
        uint c = _a * _b;
        
        require(c / _a == _b, "_safeMathMultiply : Multiplication Overflow");
        require(c / _b == _a, "_safeMathMultiply : Multiplication Overflow");
        
        return c;
    }
    
    // Allows for safely obtaining the Percentage of a Total Amount.
    // Source --> https://ethereum.stackexchange.com/questions/36272/get-percentage-of-gas-price-solidity-ethereum
    function _getPercentageOfTotalAmount(uint256 _numerator, uint256 _denominator, uint256 _totalAmount) internal pure returns (uint256) {
        uint256 totalNumerator = _safeMathMultiply(_numerator, _totalAmount);
        return _safeMathDivide(totalNumerator, _denominator);
    }
}