import NextCors from "nextjs-cors";
const { default: axios } = require("axios");

export default async function handler(req, res) {
  // Run the cors middleware
  // nextjs-cors uses the cors package, so we invite you to check the documentation https://github.com/expressjs/cors
  await NextCors(req, res, {
    // Options
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
    origin: "*",
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  });

  const result = await axios.post(
    `http://subgraph.solarbeam.io/subgraphs/name/solarbeam/dexcandles`,
    req.body
  );

  res.status(200).json({
    data: result.data.data,
  });
}
