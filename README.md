## ConsenSys Final Project

# Employee salaries in cryptocurrency

### Advantages of Paying Salaries in Crypto
Why would you want to pay in crypto, not fiat? There are certain unbeatable benefits of digital currencies.

- **No Boundaries**: More and more teams today are working remotely. Cryptocurrencies can be easily used internationally and exchanged at any point. That is why companies with employees or contractors working from other countries may find crypto payments a simpler option for a global workforce.
- **Speed**: Have you ever waited for your salary which was delayed because of the banks? Thankfully, digital currency payments can be up to 96% faster compared to old-fashioned wire transfers.
- **Transparency**: Every crypto transaction is recorded on a public ledger, which means you can always check whether your employees received their salary paid in Bitcoin or other cryptocurrency.
- **Attracts Better Talent and New Clients**: The most forward-thinking and tech-savvy workers are fascinated by crypto as it is a new, constantly developing industry. Crypto payroll may become one of the key factors for your future employee when they choose the company they want to work with. Moreover, when you start paying salaries in Bitcoin or other digital currency, you draw the attention of other crypto companies and startups - potentially attracting new clients and partners.
- **Automatic**: Using ethereum start contracts, you can automate the sending of salaries to your employees.

It is from this last key point that my idea for the final Consensys project was born.

---
My idea of smart contract I would like it to work as follows:
The contract owner (employer) assigns each employee a monthly salary (every 30 days). The owner must have had each employee's public address delivered. This way he can associate, within the contract, the monthly salary value to each employee.

Workflow example

1. Contract Deploy
   1. The owner decides the ERC-20 token (For this example, I will use a stable coin (DAI)) 
   2. The owner decides the liquidity provider address (The owner will need to ensure that their liquidity provider own the currency they want to use for salaries)
2. Owner add new employee `mapping(address => uint256) public salaries`
3. Once the record is added, the employee must wait 30 days before being allowed to withdraw.
 

So every 30 days the employee can withdraw their amount.

I would also like to give the employee the option to choose to withdraw every month, or when they prefer, accumulating their withdrawal amount.
By withdrawing after longer periods, instead of every month, it allows the employee to pay less fees per withdrawal.

---
The text above is meant to be just a brief introduction of what my final project is.
**Browse inside the `hardhat-project` or `frontend-react` folders to read the documentation.**
