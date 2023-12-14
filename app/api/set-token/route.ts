import { NextRequest, NextResponse } from "next/server";
import { encrypt } from "utils/crypto";
import { getConsumerInfo } from "utils/server";

export async function GET(req: NextRequest) {
  const search = new URL(req.url ?? "").searchParams;
  try {
    const data = await getConsumerInfo(search.get("id") ?? undefined);
    if (!data?.key) {
      return NextResponse.json({
        msg: "Consumer Not Exit",
        status: 50002,
      });
    }
    const token = encrypt(data.key);
    const response = NextResponse.json({
      status: 200,
      data: token,
    });
    // support for iframe
    // @ts-ignore
    response.cookies.set({
      name: "token",
      value: token,
      sameSite: "None",
      secure: true,
    });
    return response;
  } catch (error: any) {
    return new NextResponse(error?.message, {
      status: 500,
    });
  }
}
