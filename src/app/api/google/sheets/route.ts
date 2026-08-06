import { NextRequest, NextResponse } from "next/server";
import { readGradesFromSheet } from "@/lib/googleWorkspace";

export async function GET(req: NextRequest) {
  const accessToken = req.cookies.get("google_access_token")?.value;
  const rows = await readGradesFromSheet(accessToken);
  return NextResponse.json({ rows });
}
