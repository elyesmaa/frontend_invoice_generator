import React from 'react';
import { Controller } from 'react-hook-form';
import InputField from '../ui/InputField';
import SelectField from '../ui/SelectField';

/**
 * Quote basic information form section
 */
const QuoteInfo = ({ control, errors, status }) => {
    const fields = [
        { name: "quoteDate", type: "date", label: "Estimate Date" },
        { name: "expirationDate", type: "date", label: "Expiration Date" },
        {
            name: "status",
            type: "select",
            label: "Status",
            options: [
                { value: "Draft", label: "Draft" },
                { value: "Sent", label: "Sent" },
                { value: "Accepted", label: "Accepted" },
                { value: "Rejected", label: "Rejected" },
            ],
            disabled: status === 'Converted'
        }
    ];

    const getBorderClass = (error) =>
        error ? "border border-red-500 focus:border-red-500 focus:ring-red-500" :
            "border border-slate-200 focus:border-blue-500 focus:ring-blue-500";

    return (
        <div className="bg-white p-6 rounded-lg border border-slate-200">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Estimate Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {fields.map(({ name, type, label, options, disabled }) => (
                    <Controller
                        key={name}
                        name={name}
                        control={control}
                        render={({ field }) => (
                            <div>
                                {type === "select" ? (
                                    <SelectField
                                        label={label}
                                        {...field}
                                        options={options}
                                        error={errors[name]?.message}
                                        disabled={disabled}
                                    />
                                ) : (
                                    <InputField
                                        label={label}
                                        type={type}
                                        {...field}
                                        error={errors[name]?.message}
                                        disabled={disabled}
                                    />
                                )}
                            </div>
                        )}
                    />
                ))}
            </div>
        </div>
    );
};

export default QuoteInfo;
