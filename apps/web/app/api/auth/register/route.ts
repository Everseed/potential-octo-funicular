// app/api/auth/register/route.ts
import { NextResponse } from "next/server";
import { hash } from "bcrypt";

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    // Appel à l'API backend pour créer l'utilisateur
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        password: await hash(password, 10),
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(
        { message: error.message || "Erreur lors de l'inscription" },
        { status: response.status }
      );
    }

    const user = await response.json();

    return NextResponse.json(
      { message: "Compte créé avec succès", user },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Erreur lors de l'inscription" },
      { status: 500 }
    );
  }
}