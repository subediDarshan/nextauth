import { connectDB } from "@/dbConfig/dbConfig";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";
import { getUserInfo } from "@/helpers/getUserInfo";

await connectDB();

export async function GET(req: NextRequest) {
  try {
    const userInfo = await getUserInfo(req);

    return NextResponse.json(
      {
        data: userInfo,
        message: "User info fetched successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: "Problem getting user info",
        error,
      },
      { status: 500 }
    );
  }
}
