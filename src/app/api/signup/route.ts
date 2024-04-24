import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { prisma } from "~/db/client";
import {
  generateOTP,
  validateEmail,
  validatePassword,
} from "~/libs/utils/utils";
import { sendOtp } from "~/libs/utils/authUtils/sendOTP";
import { UserDetails } from "~/libs/models/userDetails.model";

export async function POST(req: NextRequest, res: NextResponse) {
  if (req.method === "POST") {
    const { name, email, password } = await req.json();

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "Name, email, and password are required" },
        { status: 400 },
      );
    }

    // Validate email/password format
    if (!validateEmail(email) || !validatePassword(password)) {
      return NextResponse.json(
        { message: "Invalid Email/Password Format" },
        { status: 400 },
      );
    }
    try {
      // Check if user already exists
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        return NextResponse.json(
          { message: "User with this email already exists" },
          { status: 409 },
        );
      }

      // Hash the password
      const hashedPassword =
        password.length === 64 ? password : await bcrypt.hash(password, 10);
      const OTP = generateOTP();
      const newUser: UserDetails = {
        name,
        email,
        password: hashedPassword,
        otp: OTP,
        verified: false,
      };

      // Create user and send OTP
      const [user, otpResult] = await Promise.all([
        prisma.user.create({ data: newUser }),
        sendOtp(email, OTP),
      ]);

      if (otpResult.status === 200) {
        return NextResponse.json(
          {
            message: otpResult.message,
            data: {
              id: user.id,
              name: user.name,
              email: user.email,
              verified: user.verified,
            },
          },
          { status: 200 },
        );
      } else {
        return NextResponse.json(
          { message: "Failed to send OTP via email" },
          { status: 400 },
        );
      }
    } catch (error) {
      console.error("Error signing up:", error);
      return NextResponse.json(
        { message: "Internal Server Error" },
        { status: 500 },
      );
    }
  } else {
    return NextResponse.json(
      { message: "Method Not Allowed" },
      { status: 405 },
    );
  }
}
