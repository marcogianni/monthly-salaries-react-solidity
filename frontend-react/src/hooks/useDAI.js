import { useContract } from "./useContract";
import { useWeb3React } from "@web3-react/core";
import useIsValidNetwork from "./useIsValidNetwork";
import { address as ContractAddress, ABI } from "contracts/DAIToken";
import { address as ProxyContractAddress } from "contracts/SalariesProxy";

import { formatUnits } from "@ethersproject/units";

export const useDAI = () => {
  const { account } = useWeb3React();
  const { isValidNetwork } = useIsValidNetwork();

  const DAIContract = useContract(ContractAddress, ABI);

  const fetchAllowance = async (
    owner = process.env.REACT_APP_LIQUIDITY_PROVIDER_ADDRESS,
    spender = ProxyContractAddress
  ) => {
    const allowance = await DAIContract.allowance(owner, spender);
    return formatUnits(allowance, 18);
  };

  const approve = async (setLoading) => {
    if (account && isValidNetwork) {
      try {
        setLoading(true);
        const txn = await DAIContract.approve(
          ProxyContractAddress,
          "1000000000000000000000000"
        );
        await txn.wait(1);
        setLoading(false);
      } catch (err) {
        console.error("approve.error", err);
        setLoading(false);
        return { err };
      }
    }
  };

  const fetchBalanceOf = async (
    account = process.env.REACT_APP_LIQUIDITY_PROVIDER_ADDRESS
  ) => {
    const balance = await DAIContract.balanceOf(account);
    return formatUnits(balance, 18);
  };

  return {
    fetchAllowance,
    approve,
    fetchBalanceOf,
  };
};
