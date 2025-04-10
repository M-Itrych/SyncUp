import { NextResponse } from "next/server";
import { currentUser } from "@/lib/current-user";
import { db } from "@/lib/db";

export async function PATCH(req: Request) {
  try {
    const user = await currentUser();
    const body = await req.json();
    const { id, userId, userName, bio, avatarUrl } = body;

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    if (user.id !== userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const updatedProfile = await db.profile.update({
      where: {
        id: id,
      },
      data: {
        userName,
        bio,
        avatarUrl,
      },
    });

    return NextResponse.json(updatedProfile);
  } catch (error) {
    console.log("[PROFILE_UPDATE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}