import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { toast } from 'react-hot-toast';
import { Building2, ArrowLeft, Save } from 'lucide-react';
import { useCompany } from '../../context/CompanyContext';
import { companySchema } from '../../validation/companyValidationSchemas';
import Button from '../../components/ui/Button';
import InputField from '../../components/ui/InputField';

const CreateCompany = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { addCompany, updateCompany, companies } = useCompany();
    const [isLoading, setIsLoading] = useState(false);

    const isEditing = !!id;

    const {
        register,
        handleSubmit,
        reset,
        watch,
        formState: { errors },
    } = useForm({
        defaultValues: {
            name: '',
            email: '',
            phone: '',
            address: '',
            city: '',
            state: '',
            postalCode: '',
            taxId: '',
            registryNumber: '',
            businessActivity: '',
            type: 'Other',
            legalRepresentative: '',
            website: '',
            vatNumber: 19,
            invoicePrefix: 'INV',
            quotePrefix: 'ESTIMATE',
            currency: 'TND',
            invoiceTemplate: 'blue',
        },
        resolver: yupResolver(companySchema),
    });

    useEffect(() => {
        if (isEditing && companies && companies.length > 0) {
            const company = companies.find(c => c._id === id);
            if (company) {
                reset(company);
            } else {
                toast.error("Company not found");
                navigate('/companies');
            }
        }
    }, [isEditing, id, companies, reset, navigate]);

    const onSubmit = async (data) => {
        try {
            setIsLoading(true);
            if (isEditing) {
                await updateCompany(id, data);
                toast.success('Company updated successfully');
            } else {
                await addCompany(data);
                toast.success('Company created successfully');
            }
            navigate('/companies');
        } catch (error) {
            console.error('Error saving company:', error);
            // Error is already handled in context
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button
                    variant="ghost"
                    icon={ArrowLeft}
                    onClick={() => navigate('/companies')}
                >
                    Back
                </Button>
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">
                        {isEditing ? 'Edit Company' : 'Create New Company'}
                    </h1>
                    <p className="text-slate-600 mt-1">
                        {isEditing ? 'Update your company details' : 'Add a new business entity'}
                    </p>
                </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
                        <div className="p-2 bg-primary-50 rounded-lg">
                            <Building2 className="w-6 h-6 text-primary-600" />
                        </div>
                        <h2 className="text-lg font-semibold text-slate-900">Company Details</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <InputField
                            label="Company Name"
                            {...register('name')}
                            error={errors.name?.message}
                            placeholder="e.g. Acme Corp"
                            required
                        />
                        <InputField
                            label="Tax ID (Matricule Fiscal)"
                            {...register('taxId')}
                            error={errors.taxId?.message}
                            placeholder="e.g. 1234567/A/M/000"
                            required
                        />
                        <InputField
                            label="Email"
                            type="email"
                            {...register('email')}
                            error={errors.email?.message}
                            placeholder="contact@company.com"
                            required
                        />
                        <InputField
                            label="Phone"
                            {...register('phone')}
                            error={errors.phone?.message}
                            placeholder="+216 71 123 456"
                            required
                        />
                        <InputField
                            label="Address"
                            {...register('address')}
                            error={errors.address?.message}
                            placeholder="123 Business St"
                            required
                        />
                        <InputField
                            label="City"
                            {...register('city')}
                            error={errors.city?.message}
                            placeholder="Tunis"
                            required
                        />
                        <InputField
                            label="State/Region"
                            {...register('state')}
                            error={errors.state?.message}
                            placeholder="Optional"
                        />
                        <InputField
                            label="Postal Code"
                            {...register('postalCode')}
                            error={errors.postalCode?.message}
                            placeholder="Optional"
                        />
                        <InputField
                            label="Business Activity"
                            {...register('businessActivity')}
                            error={errors.businessActivity?.message}
                            placeholder="e.g. IT Services, Consulting"
                        />
                        <InputField
                            label="Registry Number (RNE/RC)"
                            {...register('registryNumber')}
                            error={errors.registryNumber?.message}
                            placeholder="Optional"
                        />
                        <InputField
                            label="Legal Representative"
                            {...register('legalRepresentative')}
                            error={errors.legalRepresentative?.message}
                            placeholder="Optional"
                        />
                        <InputField
                            label="Website"
                            {...register('website')}
                            error={errors.website?.message}
                            placeholder="https://example.com"
                        />
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Company Type
                            </label>
                            <select
                                {...register('type')}
                                className="w-full h-10 px-3 py-2 border border-slate-200 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="Other">Other</option>
                                <option value="SUARL">SUARL</option>
                                <option value="SARL">SARL</option>
                                <option value="SA">SA</option>
                                <option value="Sole Proprietorship">Sole Proprietorship</option>
                                <option value="SNC">SNC</option>
                                <option value="SCS">SCS</option>
                            </select>
                            {errors.type && <p className="text-sm text-red-500 mt-1">{errors.type.message}</p>}
                        </div>
                        <InputField
                            label="VAT Rate (%)"
                            type="number"
                            {...register('vatNumber')}
                            error={errors.vatNumber?.message}
                            placeholder="19"
                        />
                        <InputField
                            label="Invoice Prefix"
                            {...register('invoicePrefix')}
                            error={errors.invoicePrefix?.message}
                            placeholder="e.g. INV, FAC, VT"
                            maxLength={10}
                        />
                        <InputField
                            label="Estimate Prefix"
                            {...register('quotePrefix')}
                            error={errors.quotePrefix?.message}
                            placeholder="e.g. EST, DEVIS, QT"
                            maxLength={10}
                        />
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Currency <span className="text-red-500">*</span>
                            </label>
                            <select
                                {...register('currency')}
                                className="w-full h-10 px-3 py-2 border border-slate-200 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="TND">TND - Tunisian Dinar</option>
                                <option value="EUR">EUR - Euro</option>
                                <option value="USD">USD - US Dollar</option>
                                <option value="GBP">GBP - British Pound</option>
                                <option value="CHF">CHF - Swiss Franc</option>
                                <option value="CAD">CAD - Canadian Dollar</option>
                                <option value="AED">AED - UAE Dirham</option>
                                <option value="SAR">SAR - Saudi Riyal</option>
                                <option value="MAD">MAD - Moroccan Dirham</option>
                            </select>
                            {errors.currency && <p className="text-sm text-red-500 mt-1">{errors.currency.message}</p>}
                        </div>
                    </div>
                </div>

                {/* Invoice Template Color Selection */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
                        <div className="p-2 bg-primary-50 rounded-lg">
                            <Building2 className="w-6 h-6 text-primary-600" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-slate-900">Invoice Color</h2>
                            <p className="text-sm text-slate-600">Choose the color scheme for your invoices</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                        {[
                            { value: 'blue', label: 'Blue', color: 'bg-blue-600' },
                            { value: 'green', label: 'Green', color: 'bg-green-600' },
                            { value: 'purple', label: 'Purple', color: 'bg-purple-600' },
                            { value: 'orange', label: 'Orange', color: 'bg-orange-600' },
                            { value: 'red', label: 'Red', color: 'bg-red-600' },
                            { value: 'black', label: 'Black', color: 'bg-slate-900' },
                        ].map((template) => {
                            const selectedTemplate = watch('invoiceTemplate');
                            const isSelected = selectedTemplate === template.value;

                            return (
                                <label
                                    key={template.value}
                                    className={`relative flex flex-col items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${isSelected
                                        ? 'border-slate-900 bg-slate-50 shadow-md'
                                        : 'border-slate-200 hover:border-slate-300 hover:shadow-sm'
                                        }`}
                                >
                                    <input
                                        type="radio"
                                        value={template.value}
                                        {...register('invoiceTemplate')}
                                        className="sr-only"
                                    />
                                    {isSelected && (
                                        <div className="absolute top-2 right-2 w-5 h-5 bg-slate-900 rounded-full flex items-center justify-center">
                                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                    )}
                                    <div className={`w-16 h-16 mb-3 rounded-lg ${template.color} shadow-sm flex items-center justify-center`}>
                                        <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                    </div>
                                    <span className="font-semibold text-sm text-slate-900">
                                        {template.label}
                                    </span>
                                </label>
                            );
                        })}
                    </div>
                    {errors.invoiceTemplate && <p className="text-sm text-red-500 mt-2">{errors.invoiceTemplate.message}</p>}
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3 pt-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => navigate('/companies')}
                        disabled={isLoading}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        variant="primary"
                        disabled={isLoading}
                        icon={Save}
                    >
                        {isLoading ? 'Saving...' : (isEditing ? 'Update Company' : 'Create Company')}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default CreateCompany;
