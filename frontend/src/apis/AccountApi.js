import urlJoin from "url-join";
import { GET_request } from "../utils/network.js";

export function synchronizeAndFetchAccounts(username) {
  const endpoint = urlJoin(
    process.env.REACT_APP_BACKEND_ENDPOINT,
    "synchronize_account"
  );

  return GET_request(endpoint, { username: username })
}

export function getBalanceTrend(username) {
  // TODO
}

export function getCashFlowTrend(username) {
  // TODO
}

export function getExpenseReport(username, dateRange) {
  // TODO
}