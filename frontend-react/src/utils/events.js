import * as R from "ramda";
import moment from "moment";
import { formatUnits } from "@ethersproject/units";

export const marshalEmployeeAddedEvents = (events) => {
  if (R.isEmpty(events)) {
    return [];
  }

  return R.reverse(
    R.map((single) => {
      return {
        id: single.transactionHash,
        address: single.args.employee,
        date: moment.unix(single.args.date.toString()).format("LLL"),
        salary: formatUnits(single.args.salary),
      };
    })(events)
  );
};

export const marshalEmployeeRemovedEvents = (events) => {
  if (R.isEmpty(events)) {
    return [];
  }

  return R.reverse(
    R.map((single) => {
      return {
        id: single.transactionHash,
        address: single.args.employee,
        date: moment.unix(single.args.date.toString()).format("LLL"),
      };
    })(events)
  );
};

export const marshalSalaryWithdrawalEvents = (events) => {
  if (R.isEmpty(events)) {
    return [];
  }

  return R.reverse(
    R.map((single) => {
      return {
        id: single.transactionHash,
        address: single.args.sender,
        amount: formatUnits(single.args.totalWithdrawalAmount),
        months: formatUnits(single.args.months, 0),
        date: moment
          .unix(single.args.transactionTimestamp.toString())
          .format("LLL"),
        period: moment
          .unix(single.args.withdrawPeriod.toString())
          .format("LLL"),
      };
    })(events)
  );
};
