"use client";
import { GraphQLRequests } from "@dodoex/api";
import { SwapWidget, SwapWidgetProps, WidgetProps } from "@dodoex/widgets";
import { CssBaseline } from "@mui/material";
import React from "react";

function Widget(props: {
  tokenList: WidgetProps["tokenList"];
  rebateTo?: SwapWidgetProps["rebateTo"];
  feeRate?: SwapWidgetProps["feeRate"];
  swapSlippage?: SwapWidgetProps["swapSlippage"];
  bridgeSlippage?: SwapWidgetProps["bridgeSlippage"];
  theme?: SwapWidgetProps["theme"];
  jsonRpcUrlMap?: SwapWidgetProps["jsonRpcUrlMap"];
  locale?: SwapWidgetProps["locale"];
  crossChain?: SwapWidgetProps["crossChain"];
  width?: SwapWidgetProps["width"];
  height?: SwapWidgetProps["height"];
  noPowerBy?: SwapWidgetProps["noPowerBy"];
  apikey?: SwapWidgetProps["apikey"];
}) {
  const graphQLRequests = React.useMemo(() => {
    return new GraphQLRequests({
      url: `https://api.${API_DOMAIN}/widget-graphql`,
      getHeaders: props.apikey
        ? () => {
            return {
              apikey: props.apikey ?? "",
            };
          }
        : undefined,
    });
  }, [props.apikey]);

  return (
    <>
      <CssBaseline />
      <SwapWidget
        colorMode="light"
        width="100%"
        height="100%"
        graphQLRequests={graphQLRequests}
        {...props}
      />
    </>
  );
}

export default Widget;
