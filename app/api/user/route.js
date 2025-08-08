// /app/api/user/route.js

import DbConnect from "@/lib/Db/DbConnect";
import User from "@/models/user";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    
    await DbConnect();

    const users = await User.find().select("-password");
    return NextResponse.json({ users });
  } catch (error) {
    console.error("Get users error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
