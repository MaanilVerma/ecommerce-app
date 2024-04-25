import { NextRequest, NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";
import { prisma } from "~/db/client";
import rateLimitMiddleware from "~/libs/utils/authUtils/ratelimiter";

const JWT_SECRET = process.env.NEXT_PUBLIC_JWT_SECRET || "";

export async function POST(req: NextRequest, res: NextResponse) {
  const rateLimitResponse = await rateLimitMiddleware(req, res);
  if (rateLimitResponse.status === 429) {
    return rateLimitResponse;
  }

  const authHeader = req.headers.get("Authorization");
  const token = authHeader?.split(" ")[1];

  if (!token) {
    return NextResponse.json(
      { message: "No authorization token provided" },
      { status: 401 },
    );
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

    const userId = decoded?.id;

    const { categoryId } = await req.json();

    if (req.method === "POST") {
      await prisma.userSavedInterests.upsert({
        where: { userId_categoryId: { userId, categoryId } },
        update: {},
        create: {
          userId,
          categoryId,
        },
      });

      return NextResponse.json(
        { message: "Interest added successfully" },
        { status: 200 },
      );
    } else {
      return NextResponse.json(
        { message: "Method Not Allowed" },
        { status: 405 },
      );
    }
  } catch (error) {
    console.error("Error updating interest:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function DELETE(req: NextRequest, res: NextResponse) {
  const authHeader = req.headers.get("Authorization");
  const token = authHeader?.split(" ")[1];

  if (!token) {
    return NextResponse.json(
      { message: "No authorization token provided" },
      { status: 401 },
    );
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

    const userId = decoded?.id;

    const { categoryId } = await req.json();

    if (req.method === "DELETE") {
      await prisma.userSavedInterests.delete({
        where: { userId_categoryId: { userId, categoryId } },
      });

      return NextResponse.json(
        { message: "Interest removed successfully" },
        { status: 200 },
      );
    } else {
      return NextResponse.json(
        { message: "Method Not Allowed" },
        { status: 405 },
      );
    }
  } catch (error) {
    console.error("Error updating interest:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
