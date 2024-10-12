require("@nomiclabs/hardhat-waffle");


module.exports = {
  solidity: "0.8.27",
  networks: {

    hardhat : {
      chainId: 31337
    }
  },
  paths: {
    sources: "./contracts",
    cache: "./cache",
    artifacts: "./artifacts"
  }
};