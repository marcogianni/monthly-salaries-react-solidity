/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import * as R from "ramda";
import { useWeb3React } from "@web3-react/core";

import {
  infoNotification,
  warningNotification,
  successNotification,
} from "notifications";

import { HeaderEmployer } from "components";
import LoadingButton from "@mui/lab/LoadingButton";
import SpellcheckIcon from "@mui/icons-material/Spellcheck";

import { useDAI } from "hooks/useDAI";

const LiquidityProviderPage = () => {
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState({
    liquidityProviderAllowance: 0,
    liquidityProviderBalance: null,
  });

  const { account } = useWeb3React();
  const { fetchAllowance, fetchBalanceOf, approve } = useDAI();

  const getAllowance = async () => {
    const liquidityProviderAllowance = await fetchAllowance();
    setState((s) => ({ ...s, liquidityProviderAllowance }));
  };

  const updateBalance = async () => {
    const liquidityProviderBalance = await fetchBalanceOf();
    setState((s) => ({ ...s, liquidityProviderBalance }));
  };

  useEffect(async () => {
    infoNotification("Account changed");

    getAllowance();
    updateBalance();
  }, [account]);

  const handleClick = async () => {
    const trx = await approve(setLoading);
    const error = R.pathOr(null, ["err", "error", "message"], trx);

    if (error) {
      warningNotification(error);
    } else {
      successNotification("Allowance Updated");
      getAllowance();
    }
  };

  return (
    <>
      <HeaderEmployer
        totalEmployees={null}
        liquidityProviderBalance={state.liquidityProviderBalance}
        liquidityProviderAllowance={state.liquidityProviderAllowance}
        isLiquidityProvider={true}
      />
      {Number(state.liquidityProviderAllowance) < 10000 && (
        <LoadingButton
          loading={loading}
          size="large"
          variant="contained"
          color={"secondary"}
          startIcon={<SpellcheckIcon />}
          onClick={handleClick}
          style={{ marginTop: 15 }}
        >
          Approve Smart Contract
        </LoadingButton>
      )}
    </>
  );
};

export default LiquidityProviderPage;
