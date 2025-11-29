import * as Yup from "yup";

export const registerSchema = Yup.object().shape({
    name: Yup.string()
        .min(2, "Name must be at least 2 characters")
        .max(50, "Name must not exceed 50 characters")
        .required("Name is required"),
    email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
    password: Yup.string()
        .min(8, "Password must be at least 8 characters")
        .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
            "Password must contain at least one uppercase letter, one lowercase letter, and one number"
        )
        .required("Password is required"),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref("password"), null], "Passwords must match")
        .required("Confirm password is required"),
    businessName: Yup.string()
        .min(2, "Business name must be at least 2 characters")
        .max(100, "Business name must not exceed 100 characters")
        .optional(),
    phone: Yup.string()
        .matches(/^[0-9+\s()-]*$/, "Invalid phone number format")
        .optional(),
    address: Yup.string()
        .max(200, "Address must not exceed 200 characters")
        .optional(),
});
