import * as yup from "yup"

export const registerSchema = yup
    .object({
        name: yup.string().required("Name is required"),
        email: yup
            .string()
            .email("please enter valid email")
            .required("Email is required"),
        password: yup
            .string()
            .required("Password is required")
            .min(8, "Password should be 8 chars minimum"),
        confirm_password: yup
            .string()
            .required("Confirm Password is required")
            .oneOf([yup.ref("password")], "Passwords must match"),
    })
    .required()


export const loginSchema = yup
    .object({
        email: yup
            .string()
            .email("please enter valid email")
            .required("Email is required"),
        password: yup
            .string()
            .required("Password is required")
            .min(8, "Password should be 8 chars minimum"),
    })
    .required()

export const emailVerificationSchema = yup
    .object({
        email: yup
            .string()
            .email("please enter valid email")
            .required("Email is required"),
    })
    .required()

export const resetPasswordSchema = () => {
    return yup.object().shape({
        email: yup
            .string()
            .email("please enter valid email")
            .required("Email is required"),
        password: yup
            .string()
            .required("Password is required")
            .min(8, "Password should be 8 chars minimum"),
        confirm_password: yup
            .string()
            .required("Confirm Password is required")
            .oneOf([yup.ref("password")], "Passwords must match"),
    });
}

export const videoAddSchema = yup
    .object({
        url: yup
            .string()
            .url()
            .required("Url is required"),

        playlist_id: yup
            .string(),

        playlist_name: yup
            .string()
    })
    .required()


export const playlistAddSchema = yup
    .object({
        name: yup
            .string()
            .required("Play List Name is required"),
    })
    .required()


export const downloadInputSchema = yup
    .object({
        url: yup
            .string()
            .url()
            .required("Url is required"),
    })
    .required()