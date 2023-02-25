# Hardhat Project

## Description

The Salaries smart contract allows the employer, to associate a monthly salary with each employee. 

*Note: Liquidity Provider must `approve` contract. The liquidity provider can connect with web3 to the react application and will be able to approve the contract.

Once the configuration is complete, the employer can associate a monthly salary with their employees, using `addEmployee` method.

After the 30 days of employment, the employee may withdraw. The employee may also choose not to withdraw pay immediately, but may do so after a longer period of time instead of every month.

If an employee who is terminated has not withdrawn pay for the last several months, he or she may still withdraw up to the last 30-day range that does not contain the date of termination.

## Usage

The project contains `.nvmrc` file with node version to use. Please run:
```
nvm use
```

Then run:
```
npm install
```

### 🧪 Run tests
Should pass all 38 tests, run with:

```
npx hardhat test
```

---
### ➡️ DEPLOY

Check `TOKEN_ADDRESS` (DAI Rinkeby) in `/scripts/deploy.js` and  env var `LIQUIDY_PROVIDER_ADDRESS` and then:
```
npx hardhat run scripts/deploy.js
```
**⚠️ WARNING: You should set an address of an ERC20 Token with 18 decimals (default ERC20)**.
I used DAI in Rinkeby network, to get DAI use [Compound](https://app.compound.finance/). You can only request 100 DAI at a time.

In my tests I deployed a token called DAI, this allowed me to have a large availability of tokens to be sent to the liquidity provider address.


By default script uses default hardhat network. To choose network run with:
```
npx hardhat run scripts/deploy.js --network rinkeby
```
---
### ↩️ UPGRADE
Remember to add the `PROXY_ADDRESS` in `/scripts/upgrade.js` and then:

```
npx hardhat run scripts/upgrade.js
```
*(If I had time before November 30, I would use this script to add the employee salary update functionality to the Salaries smart contract).


---
### 🔑 ENV FILE

Create an `.env` file on project root. Here the path:
```
blockchain-developer-bootcamp-final-project/hardhat-project/.env
```

The env file shoud contain:
```
ETHERSCAN_API_KEY=            # used by hardhat-gas-reporter
COINMARKETCAP_API_KEY=        # used by hardhat-gas-reporter
# to ignore remove require("hardhat-gas-reporter") in hardhat.config.js, etherscan and gasReport from module.export

PRIVATE_KEY=                  # used to deploy
INFURA_API_KEY=               # used to deploy
LIQUIDY_PROVIDER_ADDRESS=     # employees receive their salary thanks to this address
```

---


## 📐 Design Patterns

- Inheritance and Interfaces
  - IERC20 from `@openzeppelin/contracts/token/ERC20/IERC20.sol`
- Access Control Design Patterns
  - Ownable from `@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol`
- Upgradable Contracts
  - UUPS from `@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol`


## 🔒 Protect against attack vectors and Solidity Pitfalls

- Using Specific Compiler Pragma (0.8.4)
- Proper Use of Require, Assert and Revert 
- Use Modifiers Only for Validation 
- Checks-Effects-Interactions (Avoiding state changes after external calls)
- Re-entrancy
- Timestamp Dependence: I use block timestamps but the calculation interval is 30 days

## 🔐 Security

- SafeMath to avoid Integer Over/Underflow (SWC-101)
- Avoid txOrigin attack (SWC-115)
- Using new Solidity (SWC-102)


