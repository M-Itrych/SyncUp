import { NextResponse } from "next/server";
import { currentUser } from "@/lib/current-user";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const user = await currentUser();
    const body = await req.json();
    const { userId, userName, bio, avatarUrl } = body;

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    if (user.id !== userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const existingProfile = await db.profile.findUnique({
      where: {
        userId: userId,
      },
    });

    if (existingProfile) {
      return new NextResponse("Profile already exists", { status: 400 });
    }

    const newProfile = await db.profile.create({
      data: {
        userId,
        userName,
        bio,
        avatarUrl,
      },
    });

    return NextResponse.json(newProfile);
  } catch (error) {
    console.log("[PROFILE_CREATE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}