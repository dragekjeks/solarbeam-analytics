import { Box } from "@material-ui/core";
import Link from "./Link";
import { PAIR_DENY } from "app/core/constants";
import PairIcon from "./PairIcon";
import Percent from "./Percent";
import React, { useEffect, useState } from "react";
import SortableTable from "./SortableTable";
import { currencyFormatter, pairsQuery, getPairs, useInterval } from "app/core";
import { makeStyles } from "@material-ui/core/styles";
import { useLazyQuery } from "@apollo/client";

const useStyles = makeStyles((theme) => ({
  root: {},
}));

export default function PairTable({ pairs, title, ...rest }) {
  const classes = useStyles();
  const [rows, setRows] = useState([]);

  const [
    queryPairs,
    { called: pairsCalled, loading: pairsLoading, data: pairsResult },
  ] = useLazyQuery(pairsQuery);

  const queryAll = async () => {
    getPairs().then(() => {
      queryPairs();
    });
  };

  useInterval(queryAll, 60000);

  useEffect(() => {
    queryAll();
  }, []);

  useEffect(() => {
    if (pairsResult) {
      const { pairs } = pairsResult;

      const _rows = (pairs || [])
        .filter((row) => {
          return !PAIR_DENY.includes(row.id);
        })
        .map((pair) => {
          const volumeUSD =
            pair?.volumeUSD === "0"
              ? pair?.untrackedVolumeUSD
              : pair?.volumeUSD;

          const oneDayVolumeUSD =
            pair?.oneDay?.volumeUSD === "0"
              ? pair?.oneDay?.untrackedVolumeUSD
              : pair?.oneDay?.volumeUSD;

          const sevenDayVolumeUSD =
            pair?.sevenDay?.volumeUSD === "0"
              ? pair?.sevenDay?.untrackedVolumeUSD
              : pair?.sevenDay?.volumeUSD;

          const oneDayVolume = volumeUSD - oneDayVolumeUSD;
          const oneDayFees = oneDayVolume * 0.0025;
          const oneYearFees =
            (oneDayVolume * 0.0025 * 365 * 100) / pair.reserveUSD;
          const sevenDayVolume = volumeUSD - sevenDayVolumeUSD;

          return {
            ...pair,
            displayName: `${pair.token0.symbol.replace(
              "WMOVR",
              "MOVR"
            )}/${pair.token1.symbol.replace("WMOVR", "MOVR")}`,
            oneDayVolume: !Number.isNaN(oneDayVolume) ? oneDayVolume : 0,
            sevenDayVolume: !Number.isNaN(sevenDayVolume) ? sevenDayVolume : 0,
            oneDayFees: !Number.isNaN(oneDayFees) ? oneDayFees : 0,
            oneYearFees,
          };
        });

      setRows(_rows);
    }
  }, [pairsResult]);

  const loading = !pairsCalled || pairsLoading;

  return (
    <div className={classes.root}>
      <SortableTable
        orderBy="reserveUSD"
        title={title}
        loading={loading}
        {...rest}
        columns={[
          {
            key: "displayName",
            numeric: false,
            render: (row, index) => (
              <Box display="flex" alignItems="center">
                <PairIcon base={row.token0.id} quote={row.token1.id} />
                <Link
                  href={`/pairs/${row.id}`}
                  variant="body2"
                  color="textPrimary"
                  noWrap
                >
                  {row.displayName}
                </Link>
              </Box>
            ),
            label: "Name",
          },
          {
            key: "reserveUSD",
            render: (row) => currencyFormatter.format(row.reserveUSD),
            align: "right",
            label: "Liquidity",
          },
          {
            key: "oneDayVolume",
            render: (row) => currencyFormatter.format(row.oneDayVolume),
            align: "right",
            label: "Volume (24h)",
          },
          {
            key: "sevenDayVolume",
            render: (row) => currencyFormatter.format(row.sevenDayVolume),
            align: "right",
            label: "Volume (7d)",
          },
          {
            key: "oneDayFees",
            render: (row) => currencyFormatter.format(row.oneDayFees),
            align: "right",
            label: "Fees (24h)",
          },
          {
            key: "sevenDayFees",
            render: (row) =>
              currencyFormatter.format(row.sevenDayVolume * 0.0025),
            align: "right",
            label: "Fees (7d)",
          },
          {
            key: "oneYearFees",
            render: (row) => <Percent percent={row.oneYearFees} />,
            align: "right",
            label: "Fees (Yearly)",
          },
        ]}
        rows={rows}
      />
    </div>
  );
}
