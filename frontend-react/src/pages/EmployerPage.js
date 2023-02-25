/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";

import { infoNotification } from "notifications";
import {
  FabEmployer,
  HeaderEmployer,
  TableEmployeesWithdrawals,
  TableAddedEmployeeHistory,
  TableRemovedEmployeeHistory,
} from "components";

import { useSalaries } from "hooks/useSalaries";
import { useDAI } from "hooks/useDAI";

const EmployerPage = () => {
  const [state, setState] = useState({
    totalEmployees: null,
    liquidityProviderAllowance: null,
    liquidityProviderBalance: null,
  });

  const { account } = useWeb3React();
  const { fetchTotalEmployees } = useSalaries();
  const { fetchAllowance, fetchBalanceOf } = useDAI();

  const updateTotalEmployees = async () => {
    const total = await fetchTotalEmployees();
    setState((s) => ({ ...s, totalEmployees: total }));
  };

  const updateAllowance = async () => {
    const liquidityProviderAllowance = await fetchAllowance();
    setState((s) => ({ ...s, liquidityProviderAllowance }));
  };

  const updateBalance = async () => {
    const liquidityProviderBalance = await fetchBalanceOf();
    setState((s) => ({ ...s, liquidityProviderBalance }));
  };

  useEffect(() => {
    infoNotification("Account changed");

    updateTotalEmployees();
    updateAllowance();
    updateBalance();
  }, [account]);

  return (
    <>
      <FabEmployer updateTotalEmployees={updateTotalEmployees} />

      <HeaderEmployer
        totalEmployees={state.totalEmployees}
        liquidityProviderBalance={state.liquidityProviderBalance}
        liquidityProviderAllowance={state.liquidityProviderAllowance}
      />

      <TableEmployeesWithdrawals />
      <TableAddedEmployeeHistory />
      <TableRemovedEmployeeHistory />
    </>
  );
};

export default EmployerPage;
