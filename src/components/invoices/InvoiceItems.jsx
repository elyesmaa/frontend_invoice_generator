import React from 'react';
import { Controller } from 'react-hook-form';
import { Plus, Trash2 } from 'lucide-react';
import Button from '../ui/Button';
import { formatCurrency } from '../../utils/currencyUtils';
import { useCompany } from '../../context/CompanyContext';

/**
 * Invoice items table component
 */
const InvoiceItems = ({ control, errors, fields, remove, append, items }) => {
    const { currentCompany } = useCompany();

    const handlePositiveInput = (e, onChange) => {
        const value = e.target.value;
        if (value === '' || (/^\d*\.?\d*$/.test(value) && parseFloat(value) > 0)) onChange(e);
    };

    const handleNonNegativeInput = (e, onChange) => {
        const value = e.target.value;
        if (value === '' || (/^-?\d*\.?\d*$/.test(value) && parseFloat(value) >= 0)) onChange(e);
    };

    const getInputClass = (error) =>
        `w-full h-10 px-3 py-2 border rounded-lg ${error ? "border-red-500 focus:ring-red-500" : "border-slate-200 focus:ring-blue-500"
        }`;

    return (
        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
            <div className="p-4 sm:p-6 border-b border-slate-200 bg-slate-50">
                <h3 className="text-lg font-semibold text-slate-900">Items</h3>
                {errors.items && <p className="text-red-500 text-sm mt-1">{errors.items.message}</p>}
            </div>

            <div className="overflow-x-auto">
                <table className="w-full min-w-[400px] divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                        <tr>
                            {["Item", "Qty", "Price", "Tax (%)", "Total"].map((head) => (
                                <th key={head} className="px-2 sm:px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">
                                    {head}
                                </th>
                            ))}
                            <th></th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-200">
                        {fields.map((item, index) => {
                            const quantity = Number(items[index]?.quantity) || 0;
                            const unitPrice = Number(items[index]?.unitPrice) || 0;
                            const taxPercent = Number(items[index]?.taxPercent) || 0;
                            const lineTotal = quantity * unitPrice * (1 + taxPercent / 100);

                            return (
                                <tr key={item.id} className="hover:bg-slate-50">
                                    <td className="px-4 py-3">
                                        <Controller
                                            name={`items.${index}.name`}
                                            control={control}
                                            render={({ field: f }) => (
                                                <input
                                                    type="text"
                                                    {...f}
                                                    className={getInputClass(errors.items?.[index]?.name)}
                                                    placeholder="Item name"
                                                />
                                            )}
                                        />
                                        {errors.items?.[index]?.name && (
                                            <p className="text-red-500 text-sm mt-1">{errors.items[index].name.message}</p>
                                        )}
                                    </td>

                                    <td className="px-4 py-3">
                                        <Controller
                                            name={`items.${index}.quantity`}
                                            control={control}
                                            render={({ field: f }) => (
                                                <input
                                                    type="number"
                                                    {...f}
                                                    onChange={(e) => handlePositiveInput(e, f.onChange)}
                                                    className={getInputClass(errors.items?.[index]?.quantity)}
                                                    placeholder="Qty"
                                                />
                                            )}
                                        />
                                    </td>

                                    <td className="px-4 py-3">
                                        <Controller
                                            name={`items.${index}.unitPrice`}
                                            control={control}
                                            render={({ field: f }) => (
                                                <input
                                                    type="number"
                                                    {...f}
                                                    onChange={(e) => handlePositiveInput(e, f.onChange)}
                                                    className={getInputClass(errors.items?.[index]?.unitPrice)}
                                                    placeholder="Price"
                                                />
                                            )}
                                        />
                                    </td>

                                    <td className="px-4 py-3">
                                        <Controller
                                            name={`items.${index}.taxPercent`}
                                            control={control}
                                            render={({ field: f }) => (
                                                <input
                                                    type="number"
                                                    {...f}
                                                    onChange={(e) => handleNonNegativeInput(e, f.onChange)}
                                                    className={getInputClass(errors.items?.[index]?.taxPercent)}
                                                    placeholder="Tax %"
                                                />
                                            )}
                                        />
                                    </td>

                                    <td className="px-4 py-3 text-sm text-slate-700 font-medium">
                                        {formatCurrency(lineTotal, currentCompany?.currency)}
                                    </td>

                                    <td className="px-4 py-3 text-right">
                                        <Button type="button" variant="ghost" size="small" onClick={() => remove(index)}>
                                            <Trash2 className="w-4 h-4 text-red-500" />
                                        </Button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            <div className="p-4 sm:p-6 border-t border-slate-200 bg-slate-50">
                <Button
                    type="button"
                    variant="primary"
                    onClick={() => append({ name: "", quantity: 1, unitPrice: 0, taxPercent: 0, subTotal: 0, total: 0 })}
                    icon={Plus}
                >
                    Add Item
                </Button>
            </div>
        </div>
    );
};

export default InvoiceItems;
