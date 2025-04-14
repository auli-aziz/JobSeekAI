import { db } from "~/server/db";
import { users } from "~/server/db/schema"; // your schema file
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

type SignUpRequest = {
  name: string;
  email: string;
  password: string;
};

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as SignUpRequest;

    if (!body.name || !body.email || !body.password) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const existingUser = await db.query.users.findFirst({
      where: (u, { eq }) => eq(u.email, body.email),
    });

    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(body.password, 10);

    await db.insert(users).values({
      name: body.name,
      email: body.email,
      password: hashedPassword,
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err) {
    console.error("Signup Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
