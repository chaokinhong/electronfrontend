const HDWalletProvider = require('truffle-hdwallet-provider')
const InfuraId = 'https://rinkeby.infura.io/v3/44096091314c4325854f2bfdbac703da'
const walletAddress = '0xB1AF189DaA6C3657E809DE26d6d25bF92991fd88'
const mnemonic = require('./secret.json').mnemonic

module.exports = {
  networks: {
    development: {
      host: '127.0.0.1',
      port: 7545,
      network_id: '5777', // Match any network id
    },
    rinkeby: {
      provider: () => new HDWalletProvider(mnemonic, InfuraId),
      from: walletAddress,
      gasPrice: 0,
      network_id: 4, // networks id
      confirmation: 1, // # of confs to wait between deployments. (default: 0)
      timeoutBlocks: 200, // # of blocks before a deployment times out  (minimum/default: 50)
      skipDryRun: true, // Skip dry run before migrations? (default: false for public nets )
    },
  },

  contracts_directory: './contracts/',
  contracts_build_directory: './src/abis/',
  compilers: {
    solc: {
      version: '0.8.13',
      optimizer: {
        enabled: true,
        runs: 200,
      },
      evmVersion: 'petersburg',
    },
  },
}
