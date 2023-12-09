import { SignUpFormInput, UserType } from "@/type";

import { accounts } from './../db/schema/accounts';
import { authOptions } from "@/lib/auth";
import { db } from "@/db";
import { eq } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { hash } from "bcryptjs";
import { users } from "@/db/schema/users";

export const getUserByEmail = async (email: string, showPassword: boolean = false) => {
    const user = await db.query.users.findFirst({
        where: eq(users.email, email),
        columns: {
            id: true,
            email: true,
            name: true,
            password: showPassword,
            emailVerified: true
        },
    });

    return user;
}

export const createUser = async (data: SignUpFormInput) => {
    const hashPassword: string = await hash(data.password, 12);
    try {
        await db.insert(users).values({
            id: crypto.randomUUID(),
            name: data.name,
            email: data.email,
            password: hashPassword,
            emailVerified: null
        });
        return true
    } catch (error) {
    }

    return false;
}



