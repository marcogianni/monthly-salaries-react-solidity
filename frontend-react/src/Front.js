import React, { useEffect } from "react";
import * as R from "ramda";
import { useWeb3React } from "@web3-react/core";

import {
  ConnectPage,
  EmployerPage,
  LiquidityProviderPage,
  UserPage,
} from "pages";
import { warningNotification } from "notifications";

const Front = () => {
  const { active, account, chainId } = useWeb3React();

  useEffect(() => {
    if (!R.isNil(chainId) && chainId !== 4) {
      warningNotification("Please connect to Rinkeby Network");
    }
  }, [chainId]);

  if (!active) {
    return <ConnectPage />;
  }

  if (account === process.env.REACT_APP_EMPLOYER_ADDRESS) {
    return <EmployerPage />;
  }

  if (account === process.env.REACT_APP_LIQUIDITY_PROVIDER_ADDRESS) {
    return <LiquidityProviderPage />;
  }

  return <UserPage />;
};

export default Front;
