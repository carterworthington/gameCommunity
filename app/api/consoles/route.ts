import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

const defaultConsoles = [
  "PlayStation 5",
  "Xbox Series X",
  "Nintendo Switch",
  "PC",
];

export async function GET() {
  const consoles = await Promise.all(
    defaultConsoles.map((name) =>
      prisma.console.upsert({
        where: { name },
        update: {},
        create: { name },
      })
    )
  );

  return NextResponse.json({ consoles });
}
