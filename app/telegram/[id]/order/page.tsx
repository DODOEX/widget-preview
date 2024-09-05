import { SwapWidgetProps } from "@dodoex/widgets";
import type { TokenList } from "@dodoex/widgets/dist/src/hooks/Token/type";
import Widget from "components/Widget";
import {
  ConfigTokenList,
  ConsumerInfo,
  getConsumerInfo,
  getWidgetTokenListConfig,
} from "utils/server";
import { goDeveloper } from "utils/url";
import styles from "./styles.module.css";
import { strToColorStr } from "utils/color";
import clsx from "clsx";
import OrderWidget from "components/OrderWidget";

export default async function Page(props: {
  params: {
    id: string;
  };
  searchParams?: {
    "no-cache"?: "true" | "false";
    "full-screen"?: "true" | "false";
    tonAccount: string;
    fromTokenAddress: string;
    fromChainId: string;
    toTokenAddress: string;
    toChainId: string;
    fromAmt: string;
    slippage?: string;
  };
}) {
  const { params, searchParams } = props;
  if (!searchParams) {
    throw new Error("Invalid search parameters");
  }
  const revalidate = searchParams?.["no-cache"] === "true" ? 0 : 60;
  const fullScreen = searchParams?.["full-screen"] === "true" ? true : false;
  const projectId = params.id;
  let consumerInfo: ConsumerInfo | null = null;
  let rebateAddress: string | null = null;
  let rebateRatio: number | null = null;
  let swapSlippage: number | null = null;
  let bridgeSlippage: number | null = null;
  let configTokenList: ConfigTokenList | null = null;
  let apiKey = "";
  const tokenList: TokenList = [];
  if (projectId) {
    consumerInfo = await getConsumerInfo(projectId, revalidate);
    if (consumerInfo?.key) {
      apiKey = consumerInfo.key;
      configTokenList = await getWidgetTokenListConfig(
        {
          project: projectId,
          apikey: apiKey,
        },
        revalidate
      );
    } else {
      // goDeveloper();
    }
  }
  const width = fullScreen ? "100vw" : configTokenList?.basis?.width ?? "100%";
  const height = fullScreen ? "100vh" : configTokenList?.basis?.height ?? 494;
  const locale = configTokenList?.basis?.locale;
  const crossChain = configTokenList?.basis?.crossChainSupport ?? true;
  const jsonRpcUrlMap = configTokenList?.basis?.rpcMap;
  const noPowerBy = configTokenList?.basis?.noPowerBy;
  let theme: SwapWidgetProps["theme"] | undefined;
  if (configTokenList?.style && Object.keys(configTokenList.style).length) {
    const fontSizeModify = configTokenList?.basis?.fontSizeModify;
    theme = {
      palette: {
        mode: "light",
        primary: {
          main: strToColorStr(configTokenList.style.primary),
        },
        secondary: {
          main: strToColorStr(configTokenList.style.secondary),
          contrastText: strToColorStr(configTokenList.style.secondaryContrast),
        },
        error: {
          main: strToColorStr(configTokenList.style.error),
          contrastText: strToColorStr(configTokenList.style.errorContrast),
        },
        warning: {
          main: strToColorStr(configTokenList.style.warning),
        },
        success: {
          main: strToColorStr(configTokenList.style.success),
        },
        background: {
          default: strToColorStr(configTokenList.style.background1),
          paper: strToColorStr(configTokenList.style.background1),
          paperContrast: strToColorStr(configTokenList.style.background2),
          backdrop: strToColorStr(configTokenList.style.mask),
          input: strToColorStr(configTokenList.style.input),
          tag: strToColorStr(configTokenList.style.card),
        },
        text: {
          primary: strToColorStr(configTokenList.style.text1),
          secondary: strToColorStr(configTokenList.style.text2),
          disabled: strToColorStr(configTokenList.style.textDisable),
          placeholder: strToColorStr(configTokenList.style.textPlaceholder),
        },
        border: {
          main: strToColorStr(configTokenList.style.borderSolid),
          light: strToColorStr(configTokenList.style.borderDash),
          disabled: strToColorStr(configTokenList.style.borderSolid),
        },
      },
      typography: fontSizeModify
        ? {
            fontSize: 16 + fontSizeModify,
            ht: {
              fontSize: 36 + fontSizeModify,
            },
            h2: {
              fontSize: 32 + fontSizeModify,
            },
            h3: {
              fontSize: 28 + fontSizeModify,
            },
            caption: {
              fontSize: 20 + fontSizeModify,
            },
            h5: {
              fontSize: 18 + fontSizeModify,
            },
            body1: {
              fontSize: 16 + fontSizeModify,
            },
            body2: {
              fontSize: 14 + fontSizeModify,
            },
            h6: {
              fontSize: 12 + fontSizeModify,
            },
            button: {
              fontSize: 16 + fontSizeModify,
            },
          }
        : undefined,
    };
  }

  const backgroundImage = configTokenList?.basis?.backgroundImage;

  return (
    <div
      className={clsx(styles.app, fullScreen ? styles.fullScreen : "")}
      style={
        backgroundImage
          ? {
              backgroundImage: `url(${backgroundImage})`,
              backgroundSize: "cover",
            }
          : undefined
      }
    >
      <div className={styles.content}>
        {fullScreen ? (
          ""
        ) : (
          <h5 className={styles.projectName}>
            {configTokenList?.basis?.name ?? projectId}
          </h5>
        )}
        <div className={styles.widgetWrapper}>
          <OrderWidget
            // tokenList={tokenList}
            rebateAddress={rebateAddress ?? undefined}
            rebateRatio={rebateRatio ?? undefined}
            swapSlippage={swapSlippage ?? undefined}
            bridgeSlippage={bridgeSlippage ?? undefined}
            width={width}
            height={height}
            locale={locale}
            crossChain={crossChain}
            jsonRpcUrlMap={jsonRpcUrlMap}
            theme={theme}
            noPowerBy={noPowerBy}
            apikey={apiKey}
            tonConnect
            orderParams={{
              tonAccount: searchParams.tonAccount,
              fromTokenAddress: searchParams.fromTokenAddress,
              fromChainId: parseInt(searchParams.fromChainId),
              toTokenAddress: searchParams.toTokenAddress,
              toChainId: parseInt(searchParams.toChainId),
              fromAmt: searchParams.fromAmt,
              redirectLink: "https://t.me/gwegwehgww35223BOT/bridge",
            }}
          />
        </div>
      </div>
    </div>
  );
}
