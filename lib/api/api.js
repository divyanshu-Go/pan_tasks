import { cookies } from "next/headers";

const BASE_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : "https://pan-tasks.vercel.app";

export async function getUserProfile() {
  const cookieStore = await cookies(); // 🟢 This reads cookies on the server
  const token = cookieStore.get("auth_token")?.value ;

  if (!token) {
    return null;
  }

  const res = await fetch(`${BASE_URL}/api/user/profile`, {
    method: "GET",
    headers: {
      Cookie: `auth_token=${token}`, // 🟢 Pass the cookie to the backend API
    },
    cache: "no-store",
  });

  const json = await res.json();
  if (!res.ok || !json.user) {
    console.error("User fetch failed. API responded with: " + (json.message || "Unknown error"));
  }

  return json.user;
}