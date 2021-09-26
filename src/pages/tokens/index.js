import { AppShell, TokenTable } from "app/components";
import Head from "next/head";
import React from "react";

function TokensPage() {
  return (
    <AppShell>
      <Head>
        <title>Tokens | Solarbeam Analytics</title>
      </Head>
      <TokenTable title="Tokens" />
    </AppShell>
  );
}

export default TokensPage;
