import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { prisma } from "~/db/client";
import { validateEmail, validatePassword } from "~/libs/utils/utils";
import jwt from "jsonwebtoken";
import { CookieSerializeOptions, serialize } from "cookie";
import { TOKEN } from "~/libs/enums/constants";

const JWT_SECRET = process.env.NEXT_PUBLIC_JWT_SECRET;

export async function POST(req: NextRequest, res: NextResponse) {
  if (req.method === "POST") {
    const { email, password } = await req.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and Password are required" },
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
      // Find user by email
      const user = await prisma.user.findUnique({ where: { email } });
      const newUser = {
        id: user!.id,
        name: user!.name,
        email: user!.email,
        verified: user!.verified,
      };
      if (!user) {
        return NextResponse.json(
          { message: "User not found!" },
          { status: 404 },
        );
      }

      // Verify if user is verified
      if (!user.verified) {
        return NextResponse.json(
          { message: "Please verify your account before logging in." },
          { status: 403 },
        );
      }

      // Verify password
      const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch) {
        return NextResponse.json(
          { message: "Invalid credentials" },
          { status: 401 },
        );
      }

      const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET!, {
        expiresIn: "1h",
      });

      const cookieOptions: CookieSerializeOptions = {
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 3600, // 1 hour expiration
        path: "/",
      };

      const cookieValue = serialize(`${TOKEN}`, token, cookieOptions);
      const response = NextResponse.json(
        {
          data: newUser,
          message: "Login successful",
          token,
        },
        { status: 200, headers: { "Set-Cookie": cookieValue } },
      );

      response.headers.set("Set-Cookie", cookieValue);

      return response;
    } catch (error) {
      console.error("Error logging in:", error);
      return NextResponse.json(
        { error: "Internal Server Error" },
        { status: 500 },
      );
    }
  } else {
    return NextResponse.json({ error: "Method Not Allowed" }, { status: 405 });
  }
}
