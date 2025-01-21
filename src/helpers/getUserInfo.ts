import { NextRequest } from "next/server";
import jwt from "jsonwebtoken"
import User from "@/models/user.model";


export async function getUserInfo(req:NextRequest) {

    const token = req.cookies.get("token")?.value || ""

    const payload:any = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!)

    const user = await User.findOne({_id: payload.id}).select("-password")

    return user

}