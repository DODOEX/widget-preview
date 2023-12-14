import { NextRequest } from "next/server";
import { API_DOMAIN } from "utils/config";
import { getRoute } from "utils/route";

const url =
  API_DOMAIN === "gcp.dxd.ink"
    ? "https://api.gcp.dxd.ink/route/widget/getdodoroute"
    : `https://api.${API_DOMAIN}/route-service/v2/widget/getdodoroute`;

export async function GET(req: NextRequest) {
  return getRoute(url, req);
}
