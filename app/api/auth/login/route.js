
import { setAuthCookie } from "@/lib/auth/cookies";
import { verifyPassword } from "@/lib/auth/password";
import { generateToken } from "@/lib/auth/token";
import DbConnect from "@/lib/Db/DbConnect";
import User from "@/models/user";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    await DbConnect();
    

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const isValid = await verifyPassword(password, user.password);
    if (!isValid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const token = await generateToken(user);
    const response = NextResponse.json({
      message: "Login successful",
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
      },
    });

    response.cookies.set(setAuthCookie(token));
    return response;

  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
