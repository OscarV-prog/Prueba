import { db } from "~/server/db";
import type { SignupDto } from "~/modules/auth/auth.dto";
import bcrypt from "bcryptjs";

export async function signup(dto: SignupDto) {
    const { email, password, name } = dto;

    // Check if user exists
    const existingUser = await db.user.findUnique({
        where: { email },
    });

    if (existingUser) {
        throw new Error("User already exists");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const user = await db.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
            },
        });

        const { password: _, ...userWithoutPassword } = user;
        return {
            message: "User registered successfully",
            user: userWithoutPassword,
        };
    } catch (error) {
        console.error("Signup error:", error);
        throw new Error("Failed to register user");
    }
}
