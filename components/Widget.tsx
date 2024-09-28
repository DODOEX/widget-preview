"use client";
import { SwapWidget, SwapWidgetProps } from "@dodoex/widgets";
import { TokenList } from "@dodoex/widgets/dist/src/hooks/Token/type";
import { CssBaseline } from "@mui/material";
import { useParams } from "next/navigation";
import { useEffect } from "react";

function Widget(props: {
  tokenList: TokenList;
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
}) {
  const { id } = useParams();
  useEffect(() => {
    fetch(`/api/set-token?id=${id}`);
  }, []);
  return (
    <>
      <CssBaseline />
      <SwapWidget
        colorMode="light"
        width="100%"
        height="100%"
        apiServices={{
          routePrice: "/api/route-service",
          fiatPrice: "/api/price-api",
          bridgeRoutePrice: "/api/bridge/routes",
          bridgeEncode: "/api/bridge/encode",
          bridgeCreateRoute: "/api/bridge/order/create",
        }}
        apikey={typeof id === "string" ? id : undefined}
        {...props}
      />
    </>
  );
}

export default Widget;
