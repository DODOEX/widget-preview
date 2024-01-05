import axios, { AxiosRequestConfig } from "axios";
import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "utils/crypto";
import { getConsumerInfo } from "./server";

export async function getRoute(url: string, req: NextRequest) {
  const search = new URL(req.url ?? "").searchParams;
  try {
    const encryptToken = await req.cookies.get("token")?.value;
    let token = "";
    if (encryptToken) {
      token = decrypt(encryptToken);
    } else {
      const referer = req.headers.get("Referer");
      if (referer) {
        const refererUrl = new URL(referer);
        const project = refererUrl.pathname.replace(/\//, "");
        if (project) {
          const consumerData = await getConsumerInfo(project);
          token = consumerData?.key ?? "";
        }
      }
    }
    if (!token) {
      const project = search.get("apikey");
      if (project) {
        const consumerData = await getConsumerInfo(project);
        token = consumerData?.key ?? "";
      }
    }
    if (!token) {
      return new NextResponse("token is not valid.", {
        status: 401,
      });
    }
    const headers: AxiosRequestConfig["headers"] = {
      "Content-Type": "application/json",
      "user-agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36",
    };
    search.set("apikey", token);
    const response = await axios.get(`${url}?${search.toString()}`, {
      headers,
    });
    if (response.status !== 200) {
      return NextResponse.json({
        status: response.status,
      });
    }
    const data = response.data;
    return NextResponse.json(data);
  } catch (error: any) {
    return new NextResponse(error?.message, {
      status: 500,
    });
  }
}

export async function postRoute(
  url: string,
  req: NextRequest,
  {
    needQueryToken,
    needHeaderToken,
  }: {
    needQueryToken?: boolean;
    needHeaderToken?: boolean;
  } = {}
) {
  const search = new URL(req.url ?? "").searchParams;
  const params = await req.json();
  try {
    let token = "";
    const encryptToken = await req.cookies.get("token")?.value;
    if (encryptToken) {
      token = decrypt(encryptToken);
    } else {
      const referer = req.headers.get("Referer");
      if (referer) {
        const refererUrl = new URL(referer);
        const project = refererUrl.pathname.replace(/\//, "");
        const consumerData = await getConsumerInfo(project);
        token = consumerData?.key ?? "";
      }
    }
    // from search
    if (!token) {
      const project = search.get("apikey");
      if (project) {
        const consumerData = await getConsumerInfo(project);
        token = consumerData?.key ?? "";
        search.set("apikey", token);
      }
    }
    // from params
    if (!token) {
      const project = params.apikey;
      if (project) {
        const consumerData = await getConsumerInfo(project);
        token = consumerData?.key ?? "";
        params.apikey = token;
      }
    }
    if (!token) {
      return new NextResponse("token is not valid.", {
        status: 401,
      });
    }
    const headers: AxiosRequestConfig["headers"] = {
      "Content-Type": "application/json",
      "user-agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36",
    };
    if (needHeaderToken) {
      headers.apikey = token;
    }
    if (needQueryToken) {
      search.set("apikey", token);
    }
    const searchText = search.toString();
    const response = await axios.post(
      `${url}${searchText ? `?${searchText}` : ""}`,
      params,
      {
        headers,
      }
    );
    if (response.status !== 200) {
      return NextResponse.json({
        status: response.status,
      });
    }
    const data = response.data;
    return NextResponse.json(data);
  } catch (error: any) {
    return new NextResponse(error?.message, {
      status: 500,
    });
  }
}
