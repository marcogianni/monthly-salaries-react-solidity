import { useEffect } from "react";
import * as R from "ramda";
import { useWeb3React } from "@web3-react/core";
import { formatUnits, formatEther } from "@ethersproject/units";

import { useContract } from "./useContract";
import useIsValidNetwork from "./useIsValidNetwork";

// Contracts
import { ABI } from "contracts/Salaries";
import { address as ProxyContractAddress } from "contracts/SalariesProxy";

import { successNotification } from "notifications";

import {
  marshalEmployeeAddedEvents,
  marshalEmployeeRemovedEvents,
  marshalSalaryWithdrawalEvents,
} from "utils/events";

export const useSalaries = () => {
  const { account } = useWeb3React();
  const { isValidNetwork } = useIsValidNetwork();

  // using proxyAddress as address, and ABI Implementation
  const SalariesContract = useContract(ProxyContractAddress, ABI);

  const fetchEmployeeSalary = async (account) => {
    const salary = await SalariesContract.salaries(account);
    return formatUnits(salary, 18);
  };

  const fetchEmployeeDate = async (account) => {
    const dates = await SalariesContract.dates(account);
    return dates;
  };

  const fetchEmployeeRemovalDate = async (account) => {
    const dates = await SalariesContract.removalDates(account);
    return dates;
  };

  const fetchTotalEmployees = async () => {
    const total = await SalariesContract.totalEmployees();
    return total;
  };

  // If token exist contract is initialized
  const fetchInitialized = async () => {
    const initialized = await SalariesContract.token();
    return !R.isNil(initialized) || !R.isEmpty(initialize);
  };

  const fetchCalculateWithdrawal = async (account) => {
    const [finalBalanceToWithdraw, monthsCount] =
      await SalariesContract.calculateWithdrawal(account);

    return {
      finalBalanceToWithdraw: formatEther(finalBalanceToWithdraw),
      monthsCount: formatUnits(monthsCount, 0),
    };
  };

  const initialize = async (tokenAddress, liquidityProviderAddress) => {
    await SalariesContract.initialize(tokenAddress, liquidityProviderAddress);
  };

  // EVENTS
  const fetchAddedEmployeeHistory = async () => {
    const events = await SalariesContract.queryFilter("EmployeeAdded");
    return marshalEmployeeAddedEvents(events);
  };

  const fetchRemovedEmployeeHistory = async () => {
    const events = await SalariesContract.queryFilter("EmployeeRemoved");
    return marshalEmployeeRemovedEvents(events);
  };

  const fetchSalaryWithdrawalEmployeeHistory = async () => {
    const events = await SalariesContract.queryFilter("SalaryWithdrawal");
    console.debug("fetchSalaryWithdrawalEmployeeHistory", events);
    return marshalSalaryWithdrawalEvents(events);
  };

  const fetchUserSalaryWithdrawalHistory = async (address) => {
    const filter = SalariesContract.filters.SalaryWithdrawal(address);

    const events = await SalariesContract.queryFilter(filter);
    // TODO to verify
    // I will test this function on November 19th, which is when it will be possible for employees to collect their salary. Just pull the main branch
    console.debug("fetchUserSalaryWithdrawalHistory", events);
    return marshalSalaryWithdrawalEvents(events);
  };

  const withdraw = async (setLoading) => {
    if (account && isValidNetwork) {
      try {
        setLoading(true);
        const txn = await SalariesContract.withdraw();
        await txn.wait(1);
        setLoading(false);
      } catch (err) {
        console.error("withdraw.error", err);
        setLoading(false);
        return { err };
      }
    }
  };

  const addNewEmployee = async (user, salary, setLoading) => {
    if (account && isValidNetwork) {
      try {
        setLoading(true);
        const txn = await SalariesContract.addEmployee(user, salary);
        await txn.wait(1);
        setLoading(false);
        successNotification("Employee successfully added");
      } catch (err) {
        setLoading(false);
        console.error("addNewEmployee.error", err);
        return { err };
      }
    }
  };

  const removeEmployee = async (user, setLoading) => {
    if (account && isValidNetwork) {
      try {
        setLoading(true);
        const txn = await SalariesContract.removeEmployee(user);
        await txn.wait(1);
        setLoading(false);
        successNotification(
          "Employee removed, wait for the employee to withdraw the last salary."
        );
      } catch (err) {
        setLoading(false);
        console.error("removeEmployee.error", err);
        return { err };
      }
    }
  };

  useEffect(() => {
    if (account) {
    }
  }, [account]);

  return {
    fetchEmployeeSalary,
    fetchEmployeeDate,
    fetchEmployeeRemovalDate,
    fetchTotalEmployees,
    fetchCalculateWithdrawal,
    withdraw,
    initialize,
    addNewEmployee,
    fetchInitialized,
    removeEmployee,
    fetchAddedEmployeeHistory,
    fetchRemovedEmployeeHistory,
    fetchSalaryWithdrawalEmployeeHistory,
    fetchUserSalaryWithdrawalHistory,
  };
};
