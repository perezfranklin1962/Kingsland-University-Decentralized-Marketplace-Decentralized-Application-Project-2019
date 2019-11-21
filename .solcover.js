// File to specify options pertaining to: solidity-coverage
//
// Sources:
// 1) https://www.npmjs.com/package/solidity-coverage
// 2) https://github.com/sc-forks/solidity-coverage

module.exports = {
    accounts: 100,
    port: 8545,
    norpc: true,
    skipFiles: ['GeneralUtilities.sol']
};

