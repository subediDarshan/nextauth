import { connectDB } from "@/dbConfig/dbConfig";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs"
import jwt from "jsonwebtoken"

await connectDB()

export async function POST(req:NextRequest) {

    try {
        
        const {email, password} = await req.json()

        // validations
        if([email, password].some((field) => field === "")) {
            return NextResponse.json(
                {message: "Every field is required"},
                {status: 400}
            )
        }

        const user = await User.findOne({email})
        if(!user) {
            throw new Error('Check your credentials')
        }

        const passwordCorrect = await bcryptjs.compare(password, user.password)
        if(!passwordCorrect) {
            throw new Error('Check your credentials')
        }

        const payload = {
            id: user._id,
            username: user.username,
            email
        }
        const jwtToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET!, {expiresIn: '1d'})

        const options = {
            httpOnly: true,
            secure: true
        }


        const response = NextResponse.json(
            {
                message: "User logged in successfully",
                user
            },
            {status: 200}
        )

        response.cookies.set("token", jwtToken, options)

        return response
        

    } catch (error) {
        return NextResponse.json(
            {
                message: "Problem logging in user",
                error
            },
            {status: 500}
        )
    }





}