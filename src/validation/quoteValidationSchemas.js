import * as yup from "yup";

export const quoteSchema = yup.object().shape({
    quoteNumber: yup.string(),
    quoteDate: yup.date().required("Quote date is required"),
    expirationDate: yup
        .date()
        .nullable()
        .transform((value, originalValue) => (originalValue === "" ? null : value))
        .required("Expiration date is required")
        .test(
            "is-after-quote-date",
            "Expiration date cannot be before quote date",
            function (value) {
                const { quoteDate } = this.parent;
                if (!quoteDate || !value) return true;
                // Compare date strings YYYY-MM-DD to avoid time issues
                const qDate = new Date(quoteDate).toISOString().split('T')[0];
                const eDate = new Date(value).toISOString().split('T')[0];
                return eDate >= qDate;
            }
        ),
    status: yup.string().oneOf(["Draft", "Sent", "Accepted", "Rejected", "Converted"]).required("Status is required"),

    billFrom: yup.object().shape({
        businessName: yup.string().required("Business name is required"),
        email: yup.string().email("Invalid email").required("Email is required"),
        address: yup.string().required("Address is required"),
        phone: yup
            .string()
            .required("Phone is required")
            .matches(/^\+?\d+$/, "Phone must be a number (can start with +)"),
        fiscalNumber: yup.string().required("Fiscal number is required"),
    }),

    billTo: yup.object().shape({
        clientName: yup.string().required("Client name is required"),
        email: yup.string().email("Invalid email").required("Client email is required"),
        address: yup.string().required("Client address is required"),
        phone: yup
            .string()
            .required("Phone is required")
            .matches(/^\+?\d+$/, "Client phone must be a number (can start with +)"),
        fiscalNumber: yup.string().required("Client fiscal number is required"),
    }),

    items: yup
        .array()
        .of(
            yup.object().shape({
                name: yup.string().required("Item name is required"),
                quantity: yup
                    .number()
                    .typeError("Quantity must be a number")
                    .min(1, "Quantity must be greater than 0")
                    .required("Quantity is required"),
                unitPrice: yup
                    .number()
                    .typeError("Unit price must be a number")
                    .min(0.01, "Unit price must be greater than 0")
                    .required("Unit price is required"),
                taxPercent: yup
                    .number()
                    .typeError("Tax percent must be a number")
                    .min(0, "Tax percent must be greater than 0")
                    .required("Tax percent is required"),
            })
        )
        .min(1, "At least one item is required"),

    notes: yup.string().required('Terms & notes are required'),
    paymentTerms: yup.string().required("Payment terms are required"),

    fiscalStamp: yup
        .number()
        .typeError("Fiscal stamp must be a number")
        .min(0.01, "Fiscal stamp must be greater than 0")
        .required("Fiscal stamp is required"),
});
