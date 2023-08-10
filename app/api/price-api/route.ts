import { NextRequest } from "next/server";
import { API_DOMAIN } from "utils/config";
import { postRoute } from "utils/route";

const url = `https://api.${API_DOMAIN}/frontend-price-api/current/batch`;

export async function POST(req: NextRequest) {
  return postRoute(url, req, {
    needHeaderToken: true
  })
}