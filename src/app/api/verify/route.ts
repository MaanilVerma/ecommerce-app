import { NextRequest, NextResponse } from "next/server";
import { prisma } from "~/db/client";
import rateLimitMiddleware from "~/libs/utils/authUtils/ratelimiter";
import { validateEmail, validateOTP } from "~/libs/utils/utils";

export async function POST(req: NextRequest, res: NextResponse) {
  const rateLimitResponse = await rateLimitMiddleware(req, res);
  if (rateLimitResponse.status === 429) {
    return rateLimitResponse;
  }

  if (req.method === "POST") {
    const { email, otp } = await req.json();

    if (!email || !otp) {
      return NextResponse.json(
        { message: "Email/OTP is required" },
        { status: 400 },
      );
    }

    if (!validateEmail(email) || !validateOTP(otp)) {
      return NextResponse.json(
        { message: "Invalid Email/OTP Format" },
        { status: 400 },
      );
    }

    try {
      // Find user by email and select only necessary fields
      const user = await prisma.user.findUnique({
        where: { email },
        select: { verified: true, otp: true },
      });

      if (!user) {
        return NextResponse.json(
          { message: "User not found" },
          { status: 404 },
        );
      }

      // Check if user is already verified
      if (user.verified) {
        return NextResponse.json(
          { message: "User is already verified" },
          { status: 200 },
        );
      }

      // Check if OTP matches
      if (otp !== user.otp) {
        return NextResponse.json(
          { message: "OTP doesn't match" },
          { status: 401 },
        );
      }

      // Update user's verified status to true and set OTP to null
      await prisma.user.update({
        where: { email },
        data: { verified: true, otp: null },
      });

      return NextResponse.json(
        { message: "OTP verified successfully" },
        { status: 200 },
      );
    } catch (error) {
      console.error("Error verifying OTP:", error);
      return NextResponse.json(
        { error: "Internal Server Error" },
        { status: 500 },
      );
    }
  } else {
    return NextResponse.json({ error: "Method Not Allowed" }, { status: 405 });
  }
}
