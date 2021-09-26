import { AppShell, PairTable } from "app/components";
import Head from "next/head";
import React from "react";

function PairsPage() {
  return (
    <AppShell>
      <Head>
        <title>Pairs | Solarbeam Analytics</title>
      </Head>
      <PairTable title="Pairs" />
    </AppShell>
  );
}

export default PairsPage;
