import * as yup from 'yup';

export const companySchema = yup.object().shape({
    name: yup.string().required('Company name is required'),
    email: yup.string().email('Invalid email').required('Email is required'),
    phone: yup.string().required('Phone number is required'),
    address: yup.string().required('Address is required'),
    city: yup.string().required('City is required'),
    state: yup.string(),
    postalCode: yup.string(),
    taxId: yup.string().required('Tax ID (Matricule Fiscal) is required'),
    registryNumber: yup.string(),
    businessActivity: yup.string(),
    type: yup.string().oneOf(["SUARL", "SARL", "SA", "Sole Proprietorship", "SNC", "SCS", "Other"]).default("Other"),
    legalRepresentative: yup.string(),
    website: yup.string().url('Invalid URL'),
    vatNumber: yup.number().typeError('VAT must be a number').default(19),
    invoicePrefix: yup.string().max(10, 'Prefix must be 10 characters or less').default('INV'),
    currency: yup.string().oneOf(['TND', 'EUR', 'USD', 'GBP', 'CHF', 'CAD', 'AED', 'SAR', 'MAD'], 'Invalid currency').required('Currency is required').default('TND'),
    invoiceTemplate: yup.string().oneOf(['blue', 'green', 'purple', 'orange', 'red', 'black'], 'Invalid template color').optional(),
});
