import { connectDB } from "@/dbConfig/dbConfig";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs"
import { sendEmail } from "@/helpers/mailer";

await connectDB()

export async function POST(req:NextRequest) {
    try {
        
        const {username, email, password} = await req.json()

        // validations
        if([username, email, password].some((field) => field === "")) {
            return NextResponse.json(
                {message: "Every field is required"},
                {status: 400}
            )
        }

        const userWithEmail = await User.findOne({email})
        if(userWithEmail) {
            return NextResponse.json(
                {message: "Email is already connected with another account"},
                {status: 400}
            )
        }

        const userWithUsername = await User.findOne({username})
        if(userWithUsername) {
            return NextResponse.json(
                {message: "Username already exists"},
                {status: 400}
            )
        }


        // hash password
        const salt = await bcryptjs.genSalt(10)
        const hashedPassword = await bcryptjs.hash(password, salt)

        // create new user
        const newUser = await User.create({
            username, 
            email,
            password: hashedPassword
        })
        if(!newUser) {
            return NextResponse.json(
                {message: "Problem creating new user in DB"},
                {status: 500}
            )
        }

        // send verification email
        await sendEmail({email, emailType: "VERIFY", userId: newUser._id})

        return NextResponse.json(
            {
                message: "User signed up successfully",
                success: true,
                newUser
            },
            {
                status: 201
            }
        )


    } catch (error) {
        return NextResponse.json(
            {
                message: "Problem signing up user",
                error
            },
            {status: 500}
        )
    }
}