import { connectDB } from "@/dbConfig/dbConfig";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs"
import jwt from "jsonwebtoken"

await connectDB()

export async function POST(req:NextRequest) {
    try {

        const response = NextResponse.json(
            {message: "User logged out successfully"},
            {status: 200}
        )
        response.cookies.delete("token")

        return response


    } catch (error) {
        return NextResponse.json(
            {
                message: "Problem logging out user",
                error
            },
            {status: 500}
        )
    }

}