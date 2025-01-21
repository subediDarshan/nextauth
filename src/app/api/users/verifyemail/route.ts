import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";



export async function POST(req: NextRequest) {
    try {

        const {token} = await req.json()
        if(!token) {
            throw new Error("Token not found")
        }

        const user = await User.findOne(
            {
                verifyToken: token,
                verifyTokenExpiry: {$gt: Date.now()}
            }
        )
        if(!user) {
            throw new Error("Invalid or expired token")
        }

        user.isVerified = true
        user.verifyToken = undefined
        user.verifyTokenExpiry = undefined
        await user.save()

        return NextResponse.json(
            {
                message: "Email verified successfully"
            },
            {status: 200}
        )

    } catch (error) {
        return NextResponse.json(
            {
                message: "Problem verifying user email",
                error
            },
            {status: 500}
        )
    }
}