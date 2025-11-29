import * as yup from 'yup';

export const clientSchema = yup.object().shape({
    clientType: yup
        .string()
        .oneOf(['individual', 'company'], 'Client type must be either individual or company')
        .required('Client type is required'),

    // Individual fields
    name: yup.string().when('clientType', {
        is: 'individual',
        then: (schema) => schema.required('Name is required for individual clients'),
        otherwise: (schema) => schema.notRequired(),
    }),

    cinOrPassport: yup.string().when('clientType', {
        is: 'individual',
        then: (schema) => schema.required('CIN or Passport is required for individual clients'),
        otherwise: (schema) => schema.notRequired(),
    }),

    // Company fields
    businessName: yup.string().when('clientType', {
        is: 'company',
        then: (schema) => schema.required('Business name is required for companies'),
        otherwise: (schema) => schema.notRequired(),
    }),

    fiscalNumber: yup.string().when('clientType', {
        is: 'company',
        then: (schema) => schema.required('Fiscal number is required for companies'),
        otherwise: (schema) => schema.notRequired(),
    }),

    // Common fields
    email: yup
        .string()
        .email('Invalid email format')
        .notRequired(),

    phone: yup
        .string()
        .notRequired(),

    address: yup
        .string()
        .notRequired(),
});
