import React from 'react';
import { Controller } from 'react-hook-form';
import InputField from '../ui/InputField';
import TextareaField from '../ui/TextareaField';
import SelectField from '../ui/SelectField';
import { formatCurrency } from '../../utils/currencyUtils';
import { useCompany } from '../../context/CompanyContext';

/**
 * Notes and totals section component
 */
const NotesAndTotals = ({ control, errors, fiscalStamp, currentTotals }) => {
    const { currentCompany } = useCompany();

    const handlePositiveInput = (e, onChange) => {
        const value = e.target.value;
        if (value === '' || (/^\d*\.?\d*$/.test(value) && parseFloat(value) > 0)) onChange(e);
    };

    const getBorderClass = (error) =>
        error ? "border border-red-500 focus:border-red-500 focus:ring-red-500" :
            "border border-slate-200 focus:border-blue-500 focus:ring-blue-500";

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg border border-slate-200 space-y-4">
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Note & Terms</h3>

                <Controller
                    name="notes"
                    control={control}
                    render={({ field }) => (
                        <div>
                            <TextareaField label="Notes" {...field} className={getBorderClass(errors.notes)} />
                            {errors.notes && <p className="text-red-500 text-sm mt-1">{errors.notes.message}</p>}
                        </div>
                    )}
                />

                <Controller
                    name="paymentTerms"
                    control={control}
                    render={({ field }) => (
                        <div>
                            <SelectField
                                label="Payment Terms"
                                {...field}
                                options={["NET 15", "NET 30", "NET 60", "Due on receipt"]}
                                className={getBorderClass(errors.paymentTerms)}
                            />
                            {errors.paymentTerms && <p className="text-red-500 text-sm mt-1">{errors.paymentTerms.message}</p>}
                        </div>
                    )}
                />

                <Controller
                    name="fiscalStamp"
                    control={control}
                    render={({ field }) => (
                        <div>
                            <InputField
                                label="Fiscal Stamp"
                                type="number"
                                {...field}
                                onChange={(e) => handlePositiveInput(e, field.onChange)}
                                className={getBorderClass(errors.fiscalStamp)}
                            />
                            {errors.fiscalStamp && <p className="text-red-500 text-sm mt-1">{errors.fiscalStamp.message}</p>}
                        </div>
                    )}
                />
            </div>

            <div className="bg-white p-6 rounded-lg border border-slate-200 flex flex-col justify-center">
                <div className="space-y-4">
                    <div className="flex justify-between text-sm text-slate-600">
                        <p>Subtotal :</p>
                        <p>{formatCurrency(currentTotals.subTotal, currentCompany?.currency)}</p>
                    </div>
                    <div className="flex justify-between text-sm text-slate-600">
                        <p>Tax :</p>
                        <p>{formatCurrency(currentTotals.taxTotal, currentCompany?.currency)}</p>
                    </div>
                    <div className="flex justify-between text-sm text-slate-600">
                        <p>Fiscal Stamp :</p>
                        <p>{formatCurrency(Number(fiscalStamp || 0), currentCompany?.currency)}</p>
                    </div>
                    <div className="flex justify-between text-lg font-semibold text-slate-900 border-t border-slate-200 pt-4 mt-4">
                        <p>Total :</p>
                        <p>{formatCurrency(currentTotals.total, currentCompany?.currency)}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotesAndTotals;
