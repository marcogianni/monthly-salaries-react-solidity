const { ethers, upgrades } = require("hardhat");

const PROXY_ADDRESS = ""; //the ERC1967Proxy

async function main() {
  // Upgrading
  const Salaries = await ethers.getContractFactory("Salaries");
  const upgraded = await upgrades.upgradeProxy(PROXY_ADDRESS, Salaries);

  console.log("Proxy deployed to: ", upgraded.address);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
