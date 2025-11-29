import React from 'react';
import { Controller } from 'react-hook-form';
import InputField from '../ui/InputField';
import SelectField from '../ui/SelectField';

/**
 * Invoice basic information form section
 */
const InvoiceInfo = ({ control, errors }) => {
    const fields = [
        { name: "invoiceNumber", type: "text", label: "Invoice Number", disabled: true },
        { name: "invoiceDate", type: "date", label: "Invoice Date" },
        { name: "dueDate", type: "date", label: "Due Date" },
        { name: "status", type: "select", label: "Status", options: ["Paid", "Unpaid"] }
    ];

    const getBorderClass = (error) =>
        error ? "border border-red-500 focus:border-red-500 focus:ring-red-500" :
            "border border-slate-200 focus:border-blue-500 focus:ring-blue-500";

    return (
        <div className="bg-white p-6 rounded-lg border border-slate-200">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
                                        className={getBorderClass(errors[name])}
                                    />
                                ) : (
                                    <InputField
                                        label={label}
                                        type={type}
                                        {...field}
                                        disabled={disabled}
                                        placeholder={name === "invoiceNumber" && !field.value ? "Will be generated automatically" : ""}
                                        className={getBorderClass(errors[name])}
                                    />
                                )}
                                {errors[name] && (
                                    <p className="text-red-500 text-sm mt-1">{errors[name].message}</p>
                                )}
                            </div>
                        )}
                    />
                ))}
            </div>
        </div>
    );
};

export default InvoiceInfo;
