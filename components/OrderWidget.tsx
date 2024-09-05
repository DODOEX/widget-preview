"use client";
import {
  Widget,
  SwapWidgetProps,
  BridgeTonSummaryDialog,
} from "@dodoex/widgets";
import { TokenList } from "@dodoex/widgets/dist/src/hooks/Token/type";
import { CssBaseline } from "@mui/material";

export interface WidgetProps {
  tokenList?: TokenList;
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
  noPowerBy?: SwapWidgetProps["noPowerBy"];
  apikey?: SwapWidgetProps["apikey"];
  tonConnect?: SwapWidgetProps["tonConnect"];
  defaultChainId?: SwapWidgetProps["defaultChainId"];
  orderParams: Parameters<typeof BridgeTonSummaryDialog>[0];
}
function OrderWidget({ orderParams, ...props }: WidgetProps) {
  return (
    <>
      <CssBaseline />
      <Widget width="100%" height="100%" {...props}>
        <BridgeTonSummaryDialog {...orderParams} />
      </Widget>
    </>
  );
}

export default OrderWidget;
