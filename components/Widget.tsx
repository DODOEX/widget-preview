"use client";
import { SwapWidget, SwapWidgetProps } from "@dodoex/widgets";
import { TokenList } from "@dodoex/widgets/dist/src/hooks/Token/type";
import { CssBaseline } from "@mui/material";
import { useParams } from "next/navigation";
import { useEffect } from "react";

function Widget(props: {
  tokenList: TokenList;
  rebateAddress?: string;
  rebateRatio?: number;
  swapSlippage?: number;
  bridgeSlippage?: number;
  theme?: SwapWidgetProps["theme"];
  jsonRpcUrlMap?: SwapWidgetProps["jsonRpcUrlMap"];
  locale?: SwapWidgetProps["locale"];
  crossChain?: SwapWidgetProps["crossChain"];
  width?: SwapWidgetProps["width"];
  height?: SwapWidgetProps["height"];
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
        {...props}
      />
    </>
  );
}

export default Widget;
