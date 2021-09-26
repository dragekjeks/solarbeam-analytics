const { default: axios } = require("axios");

export default async function handler(req, res) {
  const result = await axios.post(
    `http://subgraph.solarbeam.io/subgraphs/name/solarbeam/subgraph`,
    req.body
  );

  res.status(200).json({
    data: result.data.data,
  });
}
