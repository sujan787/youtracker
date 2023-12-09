"use server"

import { GenerateAuthTokenTypes, ServerActionReturnType } from "@/type";

import generateMailTemplate from "@/components/templates/mail_template";
import { generateToken } from "@/services/jwt_service";
import { getUserByEmail, } from "@/services/user_service.DB"
import { sendMail } from "@/services/nodemailer_service";

export const sendEmailVerificationMail = async (email: string, url: string)
    : ServerActionReturnType => {
    const user = await getUserByEmail(email);
    if (!user) return { message: { error: "User not found" }, is_ok: false }
    const callbackUrl = url;
    const callbackName = "Click Here";
    const subject = "Email Verification";
    const body = `Hello,${user.name}, Please Verify your Email`;
    const template = generateMailTemplate(subject, body, callbackName, callbackUrl);

    try {
        await sendMail(user.email, "Email Verification", template);
        return { message: { success: "Email verification mail has been sent" }, is_ok: true }
    } catch (error) {
        return { message: { error: "Internal Server Error" }, is_ok: false }
    }
}

// export const sendResetPasswordMail = async (email: string)
//     : ServerActionReturnType => {
//     const user = await getUserByEmail(email);
//     if (!user) return { message: { error: "User not found" }, is_ok: false }
//     const token = await generateToken({
//         user: user,
//         redirect_route: "/",
//         action: "EMAIL_VERIFY"
//     } as GenerateAuthTokenTypes);
//     const callbackUrl = `${process.env.APP_URL}/api/verify_auth_token?token=${token}`;
//     const callbackName = "Click Here";
//     const subject = "Email Verification";
//     const body = `Hello,${user.name}, Please Verify your Email`;
//     const template = generateMailTemplate(subject, body, callbackName, callbackUrl);

//     try {
//         await sendMail(user.email, "Email Verification", template);
//         return { message: { success: "Email verification mail has been sent" }, is_ok: true }
//     } catch (error) {
//         return { message: { error: "Internal Server Error" }, is_ok: false }
//     }
// }