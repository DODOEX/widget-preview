"use client";
import { GraphQLRequests } from "@dodoex/api";
import { SwapWidget, SwapWidgetProps, WidgetProps } from "@dodoex/widgets";
import { CssBaseline } from "@mui/material";
import { useParams } from "next/navigation";
import { useEffect, useMemo } from "react";
import { API_DOMAIN } from "utils/config";

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
}) {
  const { id } = useParams();
  const graphQLRequests = useMemo(() => {
    return new GraphQLRequests({
      url: `https://api.${API_DOMAIN}/widget-graphql`,
      getHeaders:
        typeof id === "string"
          ? () => {
              return {
                apikey: id,
              };
            }
          : undefined,
    });
  }, [id]);

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
        graphQLRequests={graphQLRequests}
        {...props}
      />
    </>
  );
}

export default Widget;
