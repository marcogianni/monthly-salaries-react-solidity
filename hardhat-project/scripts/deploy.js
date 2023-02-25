const { ethers, upgrades } = require("hardhat");

const TOKEN_ADDRESS = "0x5592ec0cfb4dbc12d3ab100b257153436a1f0fea"; // DAI Rinkeby
const LIQUIDY_PROVIDER_ADDRESS = process.env.LIQUIDY_PROVIDER_ADDRESS;

async function main() {
  // Deploying
  const Salaries = await ethers.getContractFactory("Salaries");
  console.log("Deploying implementation(first) and ERC1967Proxy(second)...");
  const instance = await upgrades.deployProxy(Salaries, [TOKEN_ADDRESS, LIQUIDY_PROVIDER_ADDRESS], {
    initializer: "initialize",
    kind: "uups",
  });
  console.log("Proxy deployed to: ", instance.address);
  await instance.deployed();
}

main()
  .then(() => process.exit(0))
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
