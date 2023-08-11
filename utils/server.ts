import { API_DOMAIN } from "./config";

export const CONFIG_CENTER_URL = `https://api.${API_DOMAIN}/config-center`;

export interface ConsumerInfo {
  key: string;
  group: string;
}
export async function getConsumerInfo(
  projectId?: string,
  revalidate = 60
): Promise<ConsumerInfo | null> {
  if (projectId) {
    const res = await fetch(
      `https://api.${API_DOMAIN}/widget/consumer/key/${projectId}`,
      {
        next: {
          revalidate,
        },
      }
    );
    if (res.ok) {
      const data = await res.json();
      // Consumer Not Exit
      if (data.code === 50002) {
        return null;
      }
      if (data.code !== 0) {
        throw new Error(data.msg);
      }
      return data.data;
    }
  }
  return null;
}

interface WidgetConfigBasis {
  crossChainSupport: boolean;
  swapSlippage?: string;
  crossChainSlippage?: string;
  rebate?: {
    address?: string;
    ratio?: string;
  };
  rpcMap?: {
    [key: number]: string[];
  };
  name?: string;
  locale?: "en-US" | "zh-CN";
  width?: string;
  height?: string;
  fontSizeModify: number;
  backgroundImage?: string;
  themeType?: number;
  noPowerBy?: boolean;
}
interface WidgetConfigColor {
  primary?: string;
  secondary?: string;
  secondaryContrast?: string;
  error?: string;
  errorContrast?: string;
  warning?: string;
  success?: string;
  background1?: string;
  background2?: string;
  mask?: string;
  input?: string;
  card?: string;
  text1?: string;
  text2?: string;
  textDisable?: string;
  textPlaceholder?: string;
  borderSolid?: string;
  borderDash?: string;
}
export interface ConfigTokenList {
  chains: Array<{
    chainId: string;
    logoImg: string;
    name: string;
    fromTokens?: Array<string>;
    toTokens?: Array<string>;
    tokens?: Array<{
      address: string;
      chainId: number;
      decimals: number;
      logoImg: string;
      name: string;
      symbol: string;
    }>;
  }>;
  rebateAddress: string | null;
  rebateRatio: number | null;
  swapSlippage: number | null;
  crossChainSlippage: number | null;
  basis?: WidgetConfigBasis;
  style?: WidgetConfigColor;
}

export async function getWidgetTokenListConfig(
  params: {
    project: string;
    apikey: string;
  },
  revalidate = 60,
  isRetry?: boolean
): Promise<ConfigTokenList | null> {
  const res = await fetch(
    `${CONFIG_CENTER_URL}/user/tokenlist/v2?project=${params.project}&apikey=${params.apikey}`,
    {
      next: {
        revalidate,
      },
    }
  );
  if (res.ok) {
    const data = await res.json();
    if (data.code !== 0) {
      throw new Error(data.msg);
    }
    return data.data as ConfigTokenList;
    // token expired
  } else if (res.status === 401 && !isRetry) {
    const newApiKey = await getConsumerInfo(params.project, 0);
    if (newApiKey) {
      return getWidgetTokenListConfig(
        {
          project: params.project,
          apikey: newApiKey.key,
        },
        revalidate,
        true
      );
    }
  } else {
    throw new Error(res.statusText);
  }
  return null;
}
