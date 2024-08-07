"use client";
import { SwapWidget } from "@dodoex/widgets";
import { CssBaseline } from "@mui/material";
import { createProvider } from "lib/ton/connect";
import React from "react";
import { WidgetProps } from "./Widget";

function TelegramWidget(props: WidgetProps) {
  const [provider, setProvider] = React.useState<
    Awaited<ReturnType<typeof createProvider>> | undefined
  >(undefined);

  React.useEffect(() => {
    const getProvider = async () => {
      const newProvider = await createProvider();
      setProvider(newProvider);
    };
    getProvider();
  }, []);
  return (
    <>
      <CssBaseline />
      <SwapWidget
        colorMode="light"
        width="100%"
        height="100%"
        {...props}
        provider={provider}
        onConnectWalletClick={async () => {
          await provider?.connect();
          return true;
        }}
      />
    </>
  );
}

export default TelegramWidget;
