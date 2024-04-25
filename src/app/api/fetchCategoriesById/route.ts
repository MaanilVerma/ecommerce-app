import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "~/db/client";
import { JwtPayload } from "~/libs/models/jwt.model";

const JWT_SECRET = process.env.NEXT_PUBLIC_JWT_SECRET || "";

export async function GET(req: NextRequest, res: NextResponse) {
  try {
    if (req.method !== "GET") {
      return NextResponse.json(
        { message: "Method not allowed" },
        { status: 405 },
      );
    }

    const authHeader = req.headers.get("Authorization");
    const token = authHeader?.split(" ")[1];

    if (!token) {
      return NextResponse.json(
        { message: "No authorization token provided" },
        { status: 401 },
      );
    }

    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    const userId = decoded?.id;

    const limit = parseInt(req.nextUrl.searchParams.get("limit") || "6", 10);
    const offset = parseInt(req.nextUrl.searchParams.get("offset") || "0", 10);

    const [allCategories, userSavedInterests, totalPages] = await Promise.all([
      prisma.category.findMany({
        take: Number(limit),
        skip: Number(offset),
      }),
      prisma.userSavedInterests.findMany({
        where: {
          userId: userId,
        },
      }),
      prisma.category.count(),
    ]);

    const userLikedCategoryIds = userSavedInterests.map(
      (interest) => interest.categoryId,
    );
    const userLikedCategories = userLikedCategoryIds.map((id) => ({ id }));

    const pageCount = Math.ceil(totalPages / Number(limit));

    return NextResponse.json(
      { categories: allCategories, userLikedCategories, pageCount },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching data:", error);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
