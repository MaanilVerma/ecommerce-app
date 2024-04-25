import { NextRequest, NextResponse } from "next/server";

interface RateLimitData {
  [ipAddress: string]: {
    lastRequestTime: number;
    requestCount: number;
  };
}

const rateLimitData: RateLimitData = {};
const RATE_LIMIT_WINDOW_MS = Number(process.env.NEXT_PUBLIC_RATE_LIMIT);
const RATE_LIMIT_MAX_REQUESTS = Number(process.env.NEXT_PUBLIC_MAX_REQUEST);

const rateLimitMiddleware = async (req: NextRequest, res: NextResponse) => {
  const ipAddress =
    req.ip ||
    req.headers?.get("x-forwarded-for") ||
    req.headers?.get("x-real-ip") ||
    "";

  const currentTime = Date.now();
  const requestData = rateLimitData[ipAddress] || {
    lastRequestTime: currentTime,
    requestCount: 0,
  };

  const elapsedTime = currentTime - requestData.lastRequestTime;
  if (elapsedTime > RATE_LIMIT_WINDOW_MS) {
    requestData.lastRequestTime = currentTime;
    requestData.requestCount = 1;
  } else {
    requestData.requestCount++;
    if (requestData.requestCount > RATE_LIMIT_MAX_REQUESTS) {
      return NextResponse.json(
        {
          message: `Too many requests from this IP, please don't spam!`,
        },
        { status: 429 },
      );
    }
  }

  rateLimitData[ipAddress] = requestData;

  return NextResponse.json({ message: "Request processed successfully" });
};

export default rateLimitMiddleware;
