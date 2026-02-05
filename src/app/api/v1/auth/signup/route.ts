import { NextResponse } from "next/server";
import { signup } from "~/modules/auth/auth.service";
import { signupSchema } from "~/modules/auth/auth.dto";
import type { SignupDto } from "~/modules/auth/auth.dto";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const validatedData = signupSchema.parse(body);
        console.log("Processing signup for:", validatedData.email);
        const result = await signup(validatedData);
        return NextResponse.json(result, { status: 201 });
    } catch (error: any) {
        if (error.name === "ZodError") {
            return NextResponse.json(
                { message: "Invalid input", errors: error.errors },
                { status: 400 }
            );
        }
        return NextResponse.json(
            { message: error.message || "An error occurred" },
            { status: 400 }
        );
    }
}
