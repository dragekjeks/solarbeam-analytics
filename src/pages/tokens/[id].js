import {
  AppShell,
  AreaChart,
  BarChart,
  BasicTable,
  KPI,
  Link,
  PageHeader,
  PairTable,
  Percent,
  TokenIcon,
  Transactions,
} from "app/components";
import { Box, Grid, Paper, Typography } from "@material-ui/core";
import {
  currencyFormatter,
  ethPriceQuery,
  getApollo,
  getOneDayBlock,
  getEthPrice,
  getOneDayEthPrice,
  getToken,
  getTokenPairs,
  oneDayEthPriceQuery,
  sevenDayEthPriceQuery,
  tokenDayDatasQuery,
  tokenIdsQuery,
  tokenPairsQuery,
  tokenQuery,
  transactionsQuery,
  useInterval,
} from "app/core";

import Head from "next/head";
import { ParentSize } from "@visx/responsive";
import { makeStyles } from "@material-ui/core/styles";
import { useQuery, useLazyQuery } from "@apollo/client";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Skeleton } from "@material-ui/lab";

const useStyles = makeStyles((theme) => ({
  title: {
    display: "flex",
    flexDirection: "column",
    [theme.breakpoints.up("sm")]: {
      flexDirection: "row",
      justifyContent: "flex-start",
      marginBottom: 0,
      "& > div:first-of-type": {
        marginRight: theme.spacing(1),
      },
    },
  },
  links: {
    "& > a:first-of-type": {
      marginRight: theme.spacing(4),
    },
  },
  avatar: {
    marginRight: theme.spacing(2),
  },
  paper: {
    padding: theme.spacing(2),
  },
  price: {
    margin: theme.spacing(2, 0),
    [theme.breakpoints.up("sm")]: {
      margin: 0,
    },
  },
}));

function TokenPage() {
  const router = useRouter();

  if (router.isFallback) {
    return <AppShell />;
  }

  const classes = useStyles();

  const id = router.query.id.toLowerCase();

  const [token, setToken] = useState(null);
  const [pairs0, setPairs0] = useState([]);
  const [pairs1, setPairs1] = useState([]);

  const [
    queryToken,
    { called: tokenCalled, loading: tokenLoading, data: tokenResult },
  ] = useLazyQuery(tokenQuery, {
    variables: { id },
  });

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

  const [
    queryTokenDayDatas,
    {
      called: tokenDayCalled,
      loading: tokenDayLoading,
      data: tokenDayDatasResult,
    },
  ] = useLazyQuery(tokenDayDatasQuery, {
    variables: {
      tokens: [id],
    },
    pollInterval: 60000,
  });

  const [
    queryTokenPairs,
    {
      called: tokenPairsCalled,
      loading: tokenPairsLoading,
      data: tokenPairsResult,
    },
  ] = useLazyQuery(tokenPairsQuery, {
    variables: {
      tokens: [id],
    },
    pollInterval: 60000,
  });

  const pairs = [...pairs0, ...pairs1];

  const [
    queryTransactions,
    {
      called: transactionsCalled,
      loading: transactionsLoading,
      data: transactionsResult,
    },
  ] = useLazyQuery(transactionsQuery, {
    variables: {
      pairAddresses: pairs.map((pair) => pair.id).sort(),
    },
    pollInterval: 60000,
  });

  const queryAll = async () => {
    const client = getApollo();

    await getEthPrice();
    await getOneDayEthPrice(client);
    await getToken(id);

    queryToken();
    queryEthPrice();
    queryOneDayEthPrice();

    await client.query({
      query: tokenDayDatasQuery,
      variables: {
        tokens: [id],
      },
    });

    queryTokenDayDatas();

    const pairsData = await getTokenPairs(id);

    const pairAddresses = [
      ...pairsData.pairs0.map((pair) => pair.id),
      ...pairsData.pairs1.map((pair) => pair.id),
    ].sort();

    queryTokenPairs();

    setPairs0(pairsData.pairs0);
    setPairs1(pairsData.pairs1);

    await client.query({
      query: transactionsQuery,
      variables: {
        pairAddresses,
      },
    });

    queryTransactions();
  };

  useInterval(async () => {
    await queryAll();
  }, 60000);

  useEffect(() => {
    queryAll();
  }, [id]);

  useEffect(() => {
    if (tokenResult) {
      setToken(tokenResult.token);
    }
  }, [tokenResult]);

  const chartDatas = (
    (tokenDayDatasResult && tokenDayDatasResult.tokenDayDatas) ||
    []
  ).reduce(
    (previousValue, currentValue) => {
      previousValue["liquidity"].unshift({
        date: currentValue.date,
        value: parseFloat(currentValue.totalLiquidityUSD),
      });
      previousValue["volume"].unshift({
        date: currentValue.date,
        value: parseFloat(currentValue.dailyVolumeUSD),
      });
      return previousValue;
    },
    { liquidity: [], volume: [] }
  );

  const totalLiquidityUSD =
    parseFloat(token?.totalLiquidity) *
    parseFloat(token?.derivedETH) *
    parseFloat(ethPriceResult?.bundles[0].ethPrice);

  const totalLiquidityUSDYesterday =
    parseFloat(token?.oneDay?.liquidity) *
    parseFloat(token?.oneDay?.derivedETH) *
    parseFloat(oneDayEthPriceResult?.ethPrice);

  const price =
    parseFloat(token?.derivedETH) *
    parseFloat(ethPriceResult?.bundles[0].ethPrice);

  const priceYesterday =
    parseFloat(token?.oneDay?.derivedETH) *
    parseFloat(oneDayEthPriceResult?.ethPrice);

  const priceChange = ((price - priceYesterday) / priceYesterday) * 100;

  const volume = token?.tradeVolumeUSD - token?.oneDay?.volumeUSD;
  const volumeYesterday = token?.oneDay?.volumeUSD - token?.twoDay?.volumeUSD;

  const fees = volume * 0.0025;
  const feesYesterday = volumeYesterday * 0.0025;

  return (
    <AppShell>
      <Head>
        <title>
          {token &&
            `${currencyFormatter.format(price || 0)} | ${token?.symbol} | `}
          Solarbeam Analytics
        </title>
      </Head>
      <PageHeader>
        <Grid
          container
          direction="row"
          justify="space-between"
          alignItems="center"
        >
          <Grid item xs={12} sm="auto" className={classes.title}>
            <Box display="flex" alignItems="center">
              <TokenIcon id={token?.id} />
              <Typography variant="h5" component="h1" noWrap>
                {token ? (
                  <>
                    {token?.name} ({token?.symbol}){" "}
                  </>
                ) : (
                  <Skeleton
                    variant="text"
                    width={200}
                    height={40}
                    style={{ marginLeft: 15 }}
                  />
                )}
              </Typography>
            </Box>
            {token && (
              <Box display="flex" alignItems="center" className={classes.price}>
                <Typography variant="h6" component="div">
                  {currencyFormatter.format(price || 0)}
                </Typography>
                <Percent percent={priceChange} ml={1} />
              </Box>
            )}
          </Grid>
          <Grid item xs={12} sm="auto" className={classes.links}>
            <Link
              href={`https://solarbeam.io/#/add/${token?.id}/ETH`}
              target="_blank"
              variant="body1"
            >
              Add Liquidity
            </Link>
            <Link
              href={`https://solarbeam.io/#/swap?inputCurrency=${token?.id}`}
              target="_blank"
              variant="body1"
            >
              Trade
            </Link>
          </Grid>
        </Grid>
      </PageHeader>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={12} md={6}>
          <Paper
            variant="outlined"
            style={{ height: 300, position: "relative" }}
          >
            <ParentSize>
              {({ width, height }) => (
                <AreaChart
                  title="Liquidity"
                  data={chartDatas.liquidity}
                  loading={!tokenDayCalled || tokenDayLoading}
                  width={width}
                  height={height}
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
                  data={chartDatas.volume}
                  loading={!tokenDayCalled || tokenDayLoading}
                  width={width}
                  height={height}
                  margin={{ top: 125, right: 0, bottom: 0, left: 0 }}
                  tooltipDisabled
                  overlayEnabled
                />
              )}
            </ParentSize>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <KPI
            loading={!token}
            title="Liquidity (24h)"
            value={currencyFormatter.format(totalLiquidityUSD || 0)}
            difference={
              ((totalLiquidityUSD - totalLiquidityUSDYesterday) /
                totalLiquidityUSDYesterday) *
              100
            }
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <KPI
            loading={!token}
            title="Volume (24h)"
            value={currencyFormatter.format(volume || 0)}
            difference={((volume - volumeYesterday) / volumeYesterday) * 100}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <KPI
            loading={!token}
            title="Fees (24h)"
            value={currencyFormatter.format(fees)}
            difference={((fees - feesYesterday) / feesYesterday) * 100}
          />
        </Grid>
      </Grid>

      <Box my={4}>
        <BasicTable
          loading={!token}
          title="Information"
          headCells={[
            { key: "name", label: "Name" },
            { key: "symbol", label: "Symbol" },
            { key: "address", label: "Address" },
            { key: "blockscout", label: "Blockscout", align: "right" },
          ]}
          bodyCells={[
            token?.name,
            token?.symbol,
            token?.id,
            <Link
              href={`https://blockscout.moonriver.moonbeam.network/address/${token?.id}`}
            >
              View
            </Link>,
          ]}
        />
      </Box>

      <PairTable
        loading={!tokenPairsCalled || tokenPairsLoading}
        title="Pairs"
        pairs={pairs}
      />
      <Transactions
        loading={!transactionsCalled || transactionsLoading}
        transactions={transactionsResult}
        txCount={token?.txCount}
      />
    </AppShell>
  );
}

export async function getStaticProps({ params }) {
  const id = params.id.toLowerCase();

  return {
    props: {
      id,
    },
    revalidate: 1,
  };
}

export async function getStaticPaths() {
  return { paths: [], fallback: true };
}

export default TokenPage;
