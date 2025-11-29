import React from 'react';
import { Controller } from 'react-hook-form';
import InputField from '../ui/InputField';
import TextareaField from '../ui/TextareaField';
import { formatLabel } from '../../utils/formatLabel';

/**
 * Address section component for Bill From / Bill To
 */
const AddressSection = ({ title, prefix, control, errors, readOnly = false, headerContent }) => {
    const fields = ["businessName", "email", "address", "phone", "fiscalNumber"];
    const displayFields = prefix === "billFrom" ? fields :
        ["clientName", "email", "address", "phone", "fiscalNumber"];

    const getBorderClass = (error) =>
        error ? "border border-red-500 focus:border-red-500 focus:ring-red-500" :
            "border border-slate-200 focus:border-blue-500 focus:ring-blue-500";

    return (
        <div className="bg-white p-6 rounded-lg border border-slate-200 space-y-4">
            <h3 className="text-lg font-semibold text-slate-900">{title}</h3>

            {headerContent}

            {displayFields.map((field) => (
                <Controller
                    key={field}
                    name={`${prefix}.${field}`}
                    control={control}
                    render={({ field: f }) => (
                        <div>
                            {field === "address" ? (
                                <TextareaField
                                    label={formatLabel(field)}
                                    {...f}
                                    error={errors[prefix]?.[field]?.message}
                                    readOnly={readOnly}
                                />
                            ) : (
                                <InputField
                                    label={formatLabel(field)}
                                    {...f}
                                    error={errors[prefix]?.[field]?.message}
                                    readOnly={readOnly}
                                />
                            )}
                        </div>
                    )}
                />
            ))}
        </div>
    );
};

export default AddressSection;
