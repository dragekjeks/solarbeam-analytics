import { Box, Typography } from "@material-ui/core";
import { Sparklines, SparklinesLine } from "react-sparklines";
import {
  ethPriceQuery,
  oneDayEthPriceQuery,
  sevenDayEthPriceQuery,
  tokensQuery,
  useInterval,
  getEthPrice,
  getOneDayEthPrice,
  getSevenDayEthPrice,
  getTokens,
} from "app/core";
import { makeStyles, useTheme } from "@material-ui/core/styles";

import Link from "./Link";
import Percent from "./Percent";
import React, { useEffect, useState } from "react";
import SortableTable from "./SortableTable";
import { TOKEN_DENY } from "app/core/constants";
import TokenIcon from "./TokenIcon";
import { currencyFormatter } from "app/core";
import { useLazyQuery } from "@apollo/client";

const useStyles = makeStyles((theme) => ({
  root: {},
}));

export default function TokenTable({ title, ...rest }) {
  const classes = useStyles();
  const theme = useTheme();
  const [rows, setRows] = useState([]);

  const [
    queryTokens,
    { called: tokensCalled, loading: tokensLoading, data: tokensResult },
  ] = useLazyQuery(tokensQuery);

  const [queryEthPrice, { data: ethPriceResult }] = useLazyQuery(
    ethPriceQuery,
    {
      pollInterval: 60000,
    }
  );

  const [queryOneDayEthPrice, { data: oneDayEthPriceResult }] = useLazyQuery(
    oneDayEthPriceQuery,
    {
      pollInterval: 60000,
    }
  );

  const [querySevenDayEthPrice, { data: sevenDayEthPriceResult }] =
    useLazyQuery(sevenDayEthPriceQuery, {
      pollInterval: 60000,
    });

  const queryAll = async () => {
    await getOneDayEthPrice();
    await getSevenDayEthPrice();

    await getEthPrice();
    await getTokens();

    queryEthPrice();
    queryOneDayEthPrice();
    querySevenDayEthPrice();
    queryTokens();
  };

  useInterval(queryAll, 60000);

  useEffect(() => {
    queryAll();
  }, []);

  useEffect(() => {
    if (
      tokensResult &&
      ethPriceResult &&
      oneDayEthPriceResult &&
      sevenDayEthPriceResult
    ) {
      const { tokens } = tokensResult;
      const { bundles } = ethPriceResult;
      const oneDayEthPriceData = oneDayEthPriceResult;
      const sevenDayEthPriceData = sevenDayEthPriceResult;

      const _rows = (tokens || [])
        .filter(({ id }) => {
          return !TOKEN_DENY.includes(id);
        })
        .map((token) => {
          const price =
            parseFloat(token?.derivedETH) * parseFloat(bundles[0].ethPrice);

          const priceYesterday =
            parseFloat(token.oneDay?.derivedETH) *
            parseFloat(oneDayEthPriceData?.ethPrice);

          const priceChange = ((price - priceYesterday) / priceYesterday) * 100;

          const priceLastWeek =
            parseFloat(token.sevenDay?.derivedETH) *
            parseFloat(sevenDayEthPriceData?.sevenDayPrice);

          const sevenDayPriceChange =
            ((price - priceLastWeek) / priceLastWeek) * 100;

          const liquidityUSD =
            parseFloat(token?.totalLiquidity) *
            parseFloat(token?.derivedETH) *
            parseFloat(bundles[0]?.ethPrice);

          const volumeYesterday =
            token.tradeVolumeUSD - token.oneDay?.volumeUSD;

          return {
            ...token,
            price,
            priceYesterday: !Number.isNaN(priceYesterday) ? priceYesterday : 0,
            priceChange,
            liquidityUSD: liquidityUSD || 0,
            volumeYesterday: !Number.isNaN(volumeYesterday)
              ? volumeYesterday
              : 0,
            sevenDayPriceChange,
          };
        });
      setRows(_rows);
    }
  }, [
    tokensResult,
    ethPriceResult,
    sevenDayEthPriceResult,
    oneDayEthPriceResult,
  ]);

  const loading = !tokensCalled || tokensLoading;

  return (
    <div className={classes.root}>
      <SortableTable
        title={title}
        orderBy="liquidityUSD"
        loading={loading}
        columns={[
          {
            key: "name",
            label: "Name",
            render: (row, index) => (
              <Box display="flex" alignItems="center">
                <TokenIcon id={row.id} />
                <Link
                  href={`/tokens/${row.id}`}
                  variant="body2"
                  color="textPrimary"
                >
                  <Typography noWrap>{row.name}</Typography>
                </Link>
              </Box>
            ),
          },
          {
            key: "liquidityUSD",
            align: "right",
            label: "Liquidity",
            render: (row) => currencyFormatter.format(row.liquidityUSD),
          },
          {
            key: "volumeYesterday",
            align: "right",
            label: "Volume (24h)",
            render: (row) => currencyFormatter.format(row.volumeYesterday),
          },
          {
            key: "price",
            align: "right",
            label: "Price",
            render: (row) => currencyFormatter.format(row.price),
          },
          {
            key: "priceChange",
            align: "right",
            render: (row) => <Percent percent={row.priceChange} />,
            label: "24h",
          },
          {
            key: "sevenDayPriceChange",
            align: "right",
            render: (row) => <Percent percent={row.sevenDayPriceChange} />,
            label: "7d",
          },
          {
            key: "lastSevenDays",
            align: "right",
            label: "Last 7 Days",
            render: (row) => (
              <Sparklines
                data={row.tokenDayData
                  .map((d) => parseFloat(d.priceUSD))
                  .reverse()}
              >
                <SparklinesLine color="#ffc000" />
              </Sparklines>
            ),
          },
        ]}
        rows={rows}
      />
    </div>
  );
}
