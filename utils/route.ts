import axios, { AxiosRequestConfig } from "axios";
import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "utils/crypto";

export async function getRoute(url: string, req: NextRequest) {
  const search = new URL(req.url ?? "").searchParams;
  try {
    const encryptToken = await req.cookies.get("token")?.value;
    if (!encryptToken) {
      return new NextResponse("token is not valid.", {
        status: 401,
      });
    }
    const token = decrypt(encryptToken);
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
  try {
    const encryptToken = await req.cookies.get("token")?.value;
    if (!encryptToken) {
      return new NextResponse("token is not valid.", {
        status: 401,
      });
    }
    const token = await decrypt(encryptToken);
    const params = await req.json();
    const headers: AxiosRequestConfig["headers"] = {
      "Content-Type": "application/json",
      "user-agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36",
    };
    if (needHeaderToken) {
      headers.apikey = token;
    }
    let urlResult = url;
    if (needQueryToken) {
      urlResult += `?apikey=${token}`;
    }
    const response = await axios.post(urlResult, params, {
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
