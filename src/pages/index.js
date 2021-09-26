import {
  AppShell,
  AreaChart,
  BarChart,
  PairTable,
  Search,
  TokenTable,
} from "app/components";
import { Box, Grid, Paper } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import {
  dayDatasQuery,
  getDayData,
  getPairs,
  getTokens,
  pairsQuery,
  tokensQuery,
  useInterval,
} from "app/core";

import Head from "next/head";
import { ParentSize } from "@visx/responsive";

import { useLazyQuery } from "@apollo/client";

function IndexPage() {
  const [liquidity, setLiquidity] = useState(undefined);
  const [volume, setVolume] = useState(undefined);

  const [
    queryTokens,
    { called: tokensCalled, loading: tokensLoading, data: tokensResult },
  ] = useLazyQuery(tokensQuery);

  const [
    queryPairs,
    { called: pairsCalled, loading: pairsLoading, data: pairsResult },
  ] = useLazyQuery(pairsQuery);

  const [
    queryDayData,
    { called: dayDataCalled, loading: dayDataLoading, data: dayDataResult },
  ] = useLazyQuery(dayDatasQuery);

  const queryAll = async () => {
    getDayData().then(() => {
      queryDayData();
    });

    getPairs().then(() => {
      queryPairs();
    });

    getTokens().then(() => {
      queryTokens();
    });
  };

  useInterval(queryAll, 60000);

  useEffect(() => {
    queryAll();
  }, []);

  useEffect(() => {
    if (dayDataResult && dayDataResult.uniswapDayDatas) {
      const [_liquidity, _volume] = dayDataResult.uniswapDayDatas
        .filter((d) => d.totalLiquidityUSD !== "0")
        .reduce(
          (previousValue, currentValue) => {
            previousValue[0].unshift({
              date: currentValue.date,
              value: parseFloat(currentValue.totalLiquidityUSD),
            });
            previousValue[1].unshift({
              date: currentValue.date,
              value: parseFloat(currentValue.dailyVolumeUSD),
            });
            return previousValue;
          },
          [[], []]
        );
      setLiquidity(_liquidity);
      setVolume(_volume);
    }
  }, [dayDataResult]);

  return (
    <AppShell>
      <Head>
        <title>Dashboard | Solarbeam Analytics</title>
      </Head>

      <Box mb={3}>
        <Search
          pairs={pairsResult?.pairs}
          tokens={tokensResult?.tokens}
          loading={!tokensCalled || !pairsCalled}
        />
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={12} md={6}>
          <Paper variant="outlined" style={{ height: 300 }}>
            <ParentSize>
              {({ width, height }) => (
                <AreaChart
                  title="Liquidity"
                  width={width}
                  height={height}
                  loading={!dayDataCalled || dayDataLoading}
                  data={liquidity}
                  margin={{ top: 125, right: 0, bottom: 0, left: 0 }}
                  tooltipDisabled
                  overlayEnabled
                />
              )}
            </ParentSize>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={12} md={6}>
          <Paper
            variant="outlined"
            style={{ height: 300, position: "relative" }}
          >
            <ParentSize>
              {({ width, height }) => (
                <BarChart
                  title="Volume"
                  width={width}
                  height={height}
                  data={volume}
                  loading={!dayDataCalled || dayDataLoading}
                  margin={{ top: 125, right: 0, bottom: 0, left: 0 }}
                  tooltipDisabled
                  overlayEnabled
                />
              )}
            </ParentSize>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <PairTable title="Top Liquidity Pairs" />
        </Grid>

        <Grid item xs={12}>
          <TokenTable title="Top Tokens" />
        </Grid>
      </Grid>
    </AppShell>
  );
}

// export async function getStaticProps() {
//   const client = getApollo();

//   await getDayData(client);

//   await getEthPrice(client);

//   await getTokens(client);

//   await getPairs(client);

//   await getOneDayEthPrice(client);

//   // await getSevenDayEthPrice(client);

//   return {
//     props: {
//       initialApolloState: client.cache.extract(),
//     },
//     revalidate: 1,
//   };
// }

export default IndexPage;
