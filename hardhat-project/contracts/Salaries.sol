//SPDX-License-Identifier: Unlicense
pragma solidity 0.8.4;

import "hardhat/console.sol";

// Contracts
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol"; // Includes Intialize, Context
import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

// Libraries
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts-upgradeable/utils/AddressUpgradeable.sol";

// Interfaces
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Salaries is UUPSUpgradeable, OwnableUpgradeable, ReentrancyGuardUpgradeable, PausableUpgradeable {
    using AddressUpgradeable for address;
    using SafeMath for uint256;

    struct AddressParam {
        address oldValue;
        address newValue;
        uint256 timestamp;
    }

    /**
     * Emitted when a new Liquidity Provider address value is set.
     * @param value A new address value.
     * @param sender The owner address at the moment of address changing.
     */
    event LiquidityProviderAddressSet(address value, address sender);

    /**
     * @param sender Employee address.
     * @param totalWithdrawalAmount Total withdrawn
     * @param months Number of months
     * @param transactionTimestamp Precise instant in which the DAI are withdrawn
     * @param withdrawPeriod Withdrawal date, 30 days multiplied by the number of months
     */
    event SalaryWithdrawal(
        address indexed sender,
        uint256 totalWithdrawalAmount,
        uint256 months,
        uint256 transactionTimestamp,
        uint256 withdrawPeriod
    );

    /**
     * @param employee Employee address.
     * @param date add date
     * @param salary Employee salary
     */
    event EmployeeAdded(address indexed employee, uint256 date, uint256 salary);

    /**
     * @param employee Employee address.
     * @param date removal date
     */
    event EmployeeRemoved(address indexed employee, uint256 date);

    // The address for the Liquidity Providers
    AddressParam public liquidityProviderAddressParam;

    IERC20 public token; // the withdraw token ( I will use DAI )

    // The period after which the new value of the parameter is set
    uint256 public constant PARAM_UPDATE_DELAY = 7 days;
    uint256 public constant MONTH = 30 days;

    /*
     * Contains the monthly salary for each employee. If not present, the value will be zero.
     * An employee who receives a salary must be present in this mapping with a non-zero value.
     */
    mapping(address => uint256) public salaries;

    /**
     * @dev
     * This variable is used to track how much time has passed since the employee's last paycheck.
     * Each time the employee withdraws the entire sum, which can be for a month or cumulative for a period.
     * The employee can choose to withdraw every month, or whenever he wants as long as at least a month has passed.
     * A newly hired employee cannot withdraw his calculated sum, he has to wait for 30 days to pass.

     * The calculation of how much an employee can withdraw depends on the salary (greater than zero) and the last date saved in this mapping.
     */
    mapping(address => uint256) public dates;
    mapping(address => uint256) public removalDates;
    uint16 public totalEmployees; // max 65535 employee

    /**
     * Initializes the contract
     * @param _tokenAddress The address of the token contract.
     * @param _liquidityProviderAddress The address for the Liquidity Provider
     */
    function initialize(
        address _tokenAddress, // 0x5592ec0cfb4dbc12d3ab100b257153436a1f0fea DAI Rinkeby
        address _liquidityProviderAddress
    ) external initializer {
        require(_tokenAddress.isContract(), "Not a contract address");

        __Ownable_init();
        __Pausable_init();
        __ReentrancyGuard_init();

        token = IERC20(_tokenAddress);
        setLiquidityProviderAddress(_liquidityProviderAddress);
    }

    function _authorizeUpgrade(address) internal override onlyOwner {}

    // Check if an address is an employee (receiving a salary)
    modifier receivesASalary(address _address) {
        require(salaries[_address] > 0, "Not an employee");
        _;
    }

    /*
     * Only the owner can call this function.
     * The employee must already receive a salary.
     */
    function addEmployee(address _employee, uint256 _salary) public onlyOwner whenNotPaused {
        require(salaries[_employee] == 0, "Already has a salary");
        salaries[_employee] = _salary;
        dates[_employee] = _now();
        totalEmployees += 1;
        emit EmployeeAdded(_employee, _now(), _salary);
    }

    /*
     * This feature allows an employer to remove an employee's salary.
     * The employee can withdraw up to the 30-day range prior to the removal date.
     * Only the owner can call this function.
     */
    function removeEmployee(address _employee) public onlyOwner whenNotPaused {
        require(salaries[_employee] != 0, "Not an employee");
        removalDates[_employee] = _now();
        emit EmployeeRemoved(_employee, _now());
    }

    function withdraw() public receivesASalary(msg.sender) whenNotPaused {
        require(_now().sub(dates[msg.sender]) > 30 days, "Too early"); // You cannot withdraw before 30 days

        _withdraw(msg.sender);
    }

    function _withdraw(address _employee) internal nonReentrant {
        (uint256 finalBalanceToWithdraw, uint256 monthsCount) = calculateWithdrawal(_employee);

        if (removalDates[_employee] == 0) {
            dates[_employee] += (monthsCount * MONTH);
        } else {
            // Completely remove employee, this is the last paycheck
            dates[_employee] = 0;
            removalDates[_employee] = 0;
            salaries[_employee] = 0;
            totalEmployees -= 1;
        }

        if (finalBalanceToWithdraw != 0) {
            require(
                token.transferFrom(liquidityProviderAddress(), _employee, finalBalanceToWithdraw),
                "Transfer failed"
            );

            emit SalaryWithdrawal(_employee, finalBalanceToWithdraw, monthsCount, _now(), dates[_employee]);
        }
    }

    /**
     * Function that calculates how many months have passed since the last payroll
     * withdrawal or the start of payroll.
     *
     * Returns the total salary withdrawable from the employee by multiplying
     * the number of months passed by the monthly salary, and the months count.
     *
     * The date is always updated in multiples of 30 days. This allows the employer to be assured that each
     * employee receives the pay due every 30 days, allowing the employee to withdraw not necessarily every month
     * (greatly reducing transaction fees).
     *
     * If dates[_employee] == 0 then it is not an employee and is not entitled to a salary.
     *
     * @param _employee The employee address
     * @return amount to withdraw and months count
     */
    function calculateWithdrawal(address _employee) public view returns (uint256, uint256) {
        // If there is no start date, not an employee
        if (dates[_employee] == 0) {
            return (0, 0);
        }

        uint256 monthsCount;

        /**
         * @dev
         * NOTE: If the employer adds an employee on day 0 and after 10 days (less than 30 days)
         * decides to fire him, the withdraw transaction passes but the employee does not receive the
         * salary as expected.
         */
        for (uint256 i = dates[_employee]; i <= _now(); i = i.add(MONTH)) {
            if (_now() > i + MONTH) {
                // If a salary removal date has been scheduled and the date
                // is in the 30-day range, do not add to the count.
                if (removalDates[_employee] != 0 && removalDates[_employee] < i.add(MONTH)) {
                    break;
                }
                monthsCount++;
            } else {
                break;
            }
        }

        return (salaries[_employee].mul(monthsCount), monthsCount);
    }

    /**
     * Sets the address for the Liquidity Providers.
     * Can only be called by owner.
     * @param _address The new address.
     */
    function setLiquidityProviderAddress(address _address) public onlyOwner {
        require(_address != address(0), "Zero address");
        require(_address != address(this), "Wrong address");
        AddressParam memory param = liquidityProviderAddressParam;
        if (param.timestamp == 0) {
            param.oldValue = _address;
        } else if (_paramUpdateDelayElapsed(param.timestamp)) {
            param.oldValue = param.newValue;
        }
        param.newValue = _address;
        param.timestamp = _now();
        liquidityProviderAddressParam = param;
        emit LiquidityProviderAddressSet(_address, msg.sender);
    }

    /**
     * @return Current liquidity providers address.
     */
    function liquidityProviderAddress() public view returns (address) {
        AddressParam memory param = liquidityProviderAddressParam;
        return param.newValue;
    }

    /**
     * @param _paramTimestamp passed timestamp
     * @return Returns true if param update delay elapsed.
     */
    function _paramUpdateDelayElapsed(uint256 _paramTimestamp) internal view returns (bool) {
        return _now() > _paramTimestamp.add(PARAM_UPDATE_DELAY);
    }

    /**
     * @return current timestamp.
     */
    function _now() internal view returns (uint256) {
        // Note that the timestamp can have a 900-second error:
        // https://github.com/ethereum/wiki/blob/c02254611f218f43cbb07517ca8e5d00fd6d6d75/Block-Protocol-2.0.md
        return block.timestamp;
    }

    function pause() public onlyOwner whenNotPaused {
        _pause();
    }

    function unpause() public onlyOwner whenPaused {
        _unpause();
    }
}
