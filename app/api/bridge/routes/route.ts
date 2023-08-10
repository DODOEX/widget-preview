import { NextRequest } from "next/server";
import { API_DOMAIN } from "utils/config";
import { postRoute } from "utils/route";

const url = `https://api.${API_DOMAIN}/cross-chain/widget/routes`;

export async function POST(req: NextRequest) {
  return postRoute(url, req, {
    needQueryToken: true
  })
}