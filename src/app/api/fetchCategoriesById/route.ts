// import { NextRequest, NextResponse } from "next/server";
// import jwt from "jsonwebtoken";
// import { prisma } from "~/db/client";
// import { JwtPayload } from "~/libs/models/jwt.model";

// const JWT_SECRET = process.env.NEXT_PUBLIC_JWT_SECRET || "";

// export async function GET(req: NextRequest, res: NextResponse) {
//   if (req.method !== "GET") {
//     return NextResponse.json(
//       { message: "Method not allowed" },
//       { status: 405 },
//     );
//   }
//   const authHeader = req.headers.get("Authorization");
//   const token = authHeader?.split(" ")[1];

//   if (!token) {
//     return NextResponse.json(
//       { message: "No authorization token provided" },
//       { status: 401 },
//     );
//   }

//   try {
//     const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

//     const userId = decoded?.id;

//     const count = parseInt(req.nextUrl.searchParams.get("count") || "0", 10);

//     const categories = await prisma.userSavedInterests.findMany({
//       where: {
//         userId: userId,
//       },
//       include: {
//         category: true,
//       },
//     });

//     const totalCount = await prisma.category.count();
//     const pageCount = Math.ceil(totalCount / Number(count));

//     if (!categories) {
//       return NextResponse.json(
//         { message: "Categories not found" },
//         { status: 400 },
//       );
//     }

//     const userLikedCategories = categories
//       .filter((userSavedInterest) => userSavedInterest.userId === userId)
//       .map((userSavedInterest) => userSavedInterest.category);

//     const userLikedCategoryIds = userLikedCategories.map(
//       (category) => category.id,
//     );

//     return NextResponse.json(
//       { categories, userLikedCategoryIds, pageCount },
//       { status: 200 },
//     );
//   } catch (error) {
//     console.error("Error fetching data:", error);

//     return NextResponse.json(
//       { error: "Internal Server Error" },
//       { status: 500 },
//     );
//   }
// }

// Import necessary modules
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "~/db/client";
import { JwtPayload } from "~/libs/models/jwt.model";

// Define JWT secret
const JWT_SECRET = process.env.NEXT_PUBLIC_JWT_SECRET || "";

// Define GET function
export async function GET(req: NextRequest, res: NextResponse) {
  try {
    // Check request method
    if (req.method !== "GET") {
      return NextResponse.json(
        { message: "Method not allowed" },
        { status: 405 },
      );
    }

    // Extract token from authorization header
    const authHeader = req.headers.get("Authorization");
    const token = authHeader?.split(" ")[1];

    // Return error if token is not provided
    if (!token) {
      return NextResponse.json(
        { message: "No authorization token provided" },
        { status: 401 },
      );
    }

    // Verify JWT token
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    const userId = decoded?.id;

    // Extract count parameter from query string
    const count = parseInt(req.nextUrl.searchParams.get("count") || "0", 10);

    // Fetch user saved interests and total count of categories concurrently
    const [categories, totalCount] = await Promise.all([
      prisma.userSavedInterests.findMany({
        where: {
          userId: userId,
        },
        include: {
          category: true,
        },
      }),
      prisma.category.count(),
    ]);

    // Calculate page count
    const pageCount = Math.ceil(totalCount / Number(count));

    // Return error if categories are not found
    if (!categories) {
      return NextResponse.json(
        { message: "Categories not found" },
        { status: 400 },
      );
    }

    // Extract user liked category ids
    const userLikedCategoryIds = categories
      .filter((userSavedInterest) => userSavedInterest.userId === userId)
      .map((userSavedInterest) => userSavedInterest.category.id);

    // Return response
    return NextResponse.json(
      { categories, userLikedCategoryIds, pageCount },
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
