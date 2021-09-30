import Cors from "cors";
const { default: axios } = require("axios");

// Initializing the cors middleware
const cors = Cors({
  methods: ["POST", "HEAD"],
});

function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }

      return resolve(result);
    });
  });
}

export default async function handler(req, res) {
  await runMiddleware(req, res, cors);

  const result = await axios.post(
    `http://subgraph.solarbeam.io/subgraphs/name/solarbeam/blocklytics`,
    req.body
  );

  res.status(200).json({
    data: result.data.data,
  });
}
