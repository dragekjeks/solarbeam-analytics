import { HttpLink, from, split } from "@apollo/client";

import { RetryLink } from "@apollo/client/link/retry";

export const exchange = from([
  new RetryLink(),
  new HttpLink({
    uri: "http://subgraph.solarbeam.io/subgraphs/name/solarbeam/subgraph",
    shouldBatch: true,
  }),
]);

export const blocklytics = from([
  new RetryLink(),
  new HttpLink({
    uri: "http://subgraph.solarbeam.io/subgraphs/name/solarbeam/blocklytics",
    shouldBatch: true,
  }),
]);

export default split(
  (operation) => {
    return operation.getContext().clientName === "blocklytics";
  },
  blocklytics,
  exchange
);
