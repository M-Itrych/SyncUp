import { NextResponse } from "next/server";
import { hasPermission } from "@/lib/permission-handler";
import { currentUser } from "@/lib/current-user";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const serverId = searchParams.get("serverId");
    const requiredPermission = searchParams.get("permission");
    if (!serverId || !requiredPermission) {
      return NextResponse.json(
        { error: "Missing required parameters" }, 
        { status: 400 }
      );
    }
    const user = await currentUser();
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" }, 
        { status: 401 }
      );
    }
    const hasUserPermission = await hasPermission(user.id, serverId, requiredPermission);
    return NextResponse.json({ hasPermission: hasUserPermission });
  } catch (error) {
    console.error("[PERMISSIONS_ERROR]", error);
    return NextResponse.json(
      { error: "Internal server error" }, 
      { status: 500 }
    );
  }
}