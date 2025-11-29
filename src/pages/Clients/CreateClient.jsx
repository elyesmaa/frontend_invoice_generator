import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { toast } from 'react-hot-toast';
import { Building2, UserCircle, ArrowLeft, Save } from 'lucide-react';
import { clientService } from '../../services';
import { useCompany } from '../../context/CompanyContext';
import { clientSchema } from '../../validation/clientValidationSchemas';
import Button from '../../components/ui/Button';
import InputField from '../../components/ui/InputField';
import TextareaField from '../../components/ui/TextareaField';
import IncompleteCompanyBanner from '../../components/ui/IncompleteCompanyBanner';

const CreateClient = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { currentCompany } = useCompany();
    const [isLoading, setIsLoading] = useState(false);
    const isEditing = !!id;

    const {
        register,
        handleSubmit,
        watch,
        reset,
        setValue,
        formState: { errors },
    } = useForm({
        defaultValues: {
            clientType: 'individual',
            name: '',
            cinOrPassport: '',
            businessName: '',
            fiscalNumber: '',
            email: '',
            phone: '',
            address: '',
        },
        resolver: yupResolver(clientSchema),
    });

    const clientType = watch('clientType');

    useEffect(() => {
        const fetchClient = async () => {
            if (isEditing) {
                try {
                    setIsLoading(true);
                    const response = await clientService.getById(id);
                    const client = response.client || response;

                    // Reset form with client data
                    reset({
                        clientType: client.clientType,
                        name: client.name || '',
                        cinOrPassport: client.cinOrPassport || '',
                        businessName: client.businessName || '',
                        fiscalNumber: client.fiscalNumber || '',
                        email: client.email || '',
                        phone: client.phone || '',
                        address: client.address || '',
                    });
                } catch (error) {
                    console.error('Error fetching client:', error);
                    toast.error('Failed to load client details');
                    navigate('/clients');
                } finally {
                    setIsLoading(false);
                }
            }
        };

        fetchClient();
    }, [isEditing, id, reset, navigate]);

    const onSubmit = async (data) => {
        try {
            setIsLoading(true);
            if (isEditing) {
                await clientService.update(id, data);
                toast.success('Client updated successfully');
            } else {
                await clientService.create(data);
                toast.success('Client created successfully');
            }
            navigate('/clients');
        } catch (error) {
            console.error('Error saving client:', error);
            if (error.response?.data?.requiresCompanySetup) {
                toast.error(error.response.data.message);
            } else {
                toast.error(error.response?.data?.message || `Failed to ${isEditing ? 'update' : 'create'} client`);
            }
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading && isEditing && !watch('name') && !watch('businessName')) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <IncompleteCompanyBanner />

            {/* Header */}
            <div className="flex items-center gap-4">
                <Button
                    variant="ghost"
                    icon={ArrowLeft}
                    onClick={() => navigate('/clients')}
                >
                    Back
                </Button>
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">
                        {isEditing ? 'Edit Client' : 'Create New Client'}
                    </h1>
                    <p className="text-slate-600 mt-1">
                        {isEditing ? 'Update client information' : 'Add a new client to your database'}
                    </p>
                </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Client Type Selection */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <h2 className="text-lg font-semibold text-slate-900 mb-4">Client Type</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <label
                            className={`relative flex items-center gap-4 p-4 border-2 rounded-lg cursor-pointer transition-all ${clientType === 'individual'
                                ? 'border-green-500 bg-green-50'
                                : 'border-slate-200 hover:border-slate-300'
                                }`}
                        >
                            <input
                                type="radio"
                                value="individual"
                                {...register('clientType')}
                                className="sr-only"
                            />
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${clientType === 'individual' ? 'bg-green-100' : 'bg-slate-100'
                                }`}>
                                <UserCircle className={`w-6 h-6 ${clientType === 'individual' ? 'text-green-600' : 'text-slate-600'
                                    }`} />
                            </div>
                            <div>
                                <p className="font-medium text-slate-900">Individual</p>
                                <p className="text-sm text-slate-500">Personal client</p>
                            </div>
                        </label>

                        <label
                            className={`relative flex items-center gap-4 p-4 border-2 rounded-lg cursor-pointer transition-all ${clientType === 'company'
                                ? 'border-purple-500 bg-purple-50'
                                : 'border-slate-200 hover:border-slate-300'
                                }`}
                        >
                            <input
                                type="radio"
                                value="company"
                                {...register('clientType')}
                                className="sr-only"
                            />
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${clientType === 'company' ? 'bg-purple-100' : 'bg-slate-100'
                                }`}>
                                <Building2 className={`w-6 h-6 ${clientType === 'company' ? 'text-purple-600' : 'text-slate-600'
                                    }`} />
                            </div>
                            <div>
                                <p className="font-medium text-slate-900">Company</p>
                                <p className="text-sm text-slate-500">Business client</p>
                            </div>
                        </label>
                    </div>
                    {errors.clientType && (
                        <p className="text-red-500 text-sm mt-2">{errors.clientType.message}</p>
                    )}
                </div>

                {/* Client Information */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <h2 className="text-lg font-semibold text-slate-900 mb-4">
                        {clientType === 'company' ? 'Company Information' : 'Personal Information'}
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {clientType === 'individual' ? (
                            <>
                                <InputField
                                    label="Full Name"
                                    {...register('name')}
                                    error={errors.name?.message}
                                    placeholder="John Doe"
                                    required
                                />
                                <InputField
                                    label="CIN / Passport"
                                    {...register('cinOrPassport')}
                                    error={errors.cinOrPassport?.message}
                                    placeholder="12345678"
                                    required
                                />
                            </>
                        ) : (
                            <>
                                <InputField
                                    label="Business Name"
                                    {...register('businessName')}
                                    error={errors.businessName?.message}
                                    placeholder="Tech Solutions SARL"
                                    required
                                />
                                <InputField
                                    label="Fiscal Number"
                                    {...register('fiscalNumber')}
                                    error={errors.fiscalNumber?.message}
                                    placeholder="1234567A"
                                    required
                                />
                            </>
                        )}
                    </div>
                </div>

                {/* Contact Information */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <h2 className="text-lg font-semibold text-slate-900 mb-4">Contact Information</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <InputField
                            label="Email"
                            type="email"
                            {...register('email')}
                            error={errors.email?.message}
                            placeholder="contact@example.com"
                        />
                        <InputField
                            label="Phone"
                            {...register('phone')}
                            error={errors.phone?.message}
                            placeholder="+216 12 345 678"
                        />
                    </div>

                    <TextareaField
                        label="Address"
                        {...register('address')}
                        error={errors.address?.message}
                        placeholder="123 Main Street, City, Country"
                        rows={3}
                    />
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => navigate('/clients')}
                        disabled={isLoading}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        variant="primary"
                        disabled={isLoading || (currentCompany && !currentCompany.isComplete)}
                        icon={Save}
                    >
                        {isLoading ? 'Saving...' : (isEditing ? 'Update Client' : 'Create Client')}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default CreateClient;
