import React from 'react';
import { formatCurrency } from '../../../utils/currencyUtils';

const ClassicTemplate = ({ invoice, currency }) => {
    return (
        <div className='bg-white p-6 sm:p-8 md:p-12 rounded-lg shadow-md border-slate-200'>
            <div className='flex flex-col sm:flex-row justify-between items-start pb-8 border-b border-slate-200'>
                <div>
                    <h2 className='text-3xl font-bold text-slate-900'>INVOICE</h2>
                    <p className='text-sm text-slate-500 mt-2'># {invoice.invoiceNumber}</p>
                </div>
                <div className='text-left sm:text-right mt-4 sm:mt-0'>
                    <p className='text-sm text-slate-500'>Status</p>
                    <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium ${invoice.status === "Paid"
                                ? "bg-emerald-100 text-emerald-800"
                                : invoice.status === "Pending"
                                    ? 'bg-amber-100 text-amber-800'
                                    : 'bg-red-100 text-red-800'
                            }`}
                    >
                        {invoice.status}
                    </span>
                </div>
            </div>

            <div className='grid grid-cols-1 sm:grid-cols-2 gap-8 my-8'>
                <div>
                    <h3 className='text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3'>
                        Bill From
                    </h3>
                    <p className='font-semibold text-slate-800'>{invoice.billFrom.businessName}</p>
                    <p className='text-slate-600'>{invoice.billFrom.address}</p>
                    <p className='text-slate-600'>{invoice.billFrom.email}</p>
                    <p className='text-slate-600'>{invoice.billFrom.phone}</p>
                    <p className='text-slate-600'>MF: {invoice.billFrom.fiscalNumber}</p>
                </div>
                <div className='sm:text-right'>
                    <h3 className='text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3'>
                        Bill To
                    </h3>
                    <p className='font-semibold text-slate-800'>{invoice.billTo.clientName}</p>
                    <p className='text-slate-600'>{invoice.billTo.address}</p>
                    <p className='text-slate-600'>{invoice.billTo.email}</p>
                    <p className='text-slate-600'>{invoice.billTo.phone}</p>
                    <p className='text-slate-600'>MF: {invoice.billTo.fiscalNumber}</p>
                </div>
            </div>

            <div className='grid grid-cols-1 sm:grid-cols-3 gap-8 my-8'>
                <div>
                    <h3 className='text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3'>
                        Invoice Date
                    </h3>
                    <p className='font-medium text-slate-800'>
                        {new Date(invoice.invoiceDate).toLocaleDateString()}
                    </p>
                </div>
                <div>
                    <h3 className='text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3'>
                        Due Date
                    </h3>
                    <p className='font-medium text-slate-800'>
                        {new Date(invoice.dueDate).toLocaleDateString()}
                    </p>
                </div>
                <div>
                    <h3 className='text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3'>
                        Payment Terms
                    </h3>
                    <p className='font-medium text-slate-800'>{invoice.paymentTerms}</p>
                </div>
            </div>

            <div className='bg-white border border-slate-200 rounded-lg overflow-hidden'>
                <table className='w-full divide-y divide-slate-200'>
                    <thead className='bg-slate-50'>
                        <tr>
                            <th className='px-4 sm:px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide'>
                                Item
                            </th>
                            <th className='px-4 sm:px-6 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wide'>
                                Quantity
                            </th>
                            <th className='px-4 sm:px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wide'>
                                Price
                            </th>
                            <th className='px-4 sm:px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wide'>
                                Tax (%)
                            </th>
                            <th className='px-4 sm:px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wide'>
                                Total
                            </th>
                        </tr>
                    </thead>
                    <tbody className='bg-white divide-y divide-slate-200'>
                        {invoice.items.map((item, index) => (
                            <tr key={index}>
                                <td className='px-4 sm:px-6 py-4 text-sm font-medium text-slate-900'>{item.name}</td>
                                <td className='px-4 sm:px-6 py-4 text-center text-sm text-slate-900'>{item.quantity}</td>
                                <td className='px-4 sm:px-6 py-4 text-right text-sm text-slate-900'>
                                    {formatCurrency(item.unitPrice, currency)}
                                </td>
                                <td className='px-4 sm:px-6 py-4 text-right text-sm text-slate-900'>
                                    {item.taxPercent.toFixed(2)}%
                                </td>
                                <td className='px-4 sm:px-6 py-4 text-right text-sm font-medium text-slate-900'>
                                    {formatCurrency(item.total, currency)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className='flex justify-end mt-8'>
                <div className='w-full max-w-sm space-y-3'>
                    <div className='flex justify-between text-sm text-slate-600'>
                        <span>Subtotal</span>
                        <span>{formatCurrency(invoice.subtotal, currency)}</span>
                    </div>
                    <div className='flex justify-between text-sm text-slate-600'>
                        <span>Tax</span>
                        <span>{formatCurrency(invoice.taxTotal, currency)}</span>
                    </div>
                    <div className='flex justify-between text-sm text-slate-600'>
                        <span>Fiscal Stamp</span>
                        <span>{formatCurrency(invoice.fiscalStamp, currency)}</span>
                    </div>
                    <div className='flex justify-between font-semibold text-lg text-slate-900 border-t border-slate-200 pt-3 mt-3'>
                        <span>Total</span>
                        <span>{formatCurrency(invoice.total, currency)}</span>
                    </div>
                </div>
            </div>

            {invoice.notes && (
                <div className='mt-8 pt-8 border-t border-slate-200'>
                    <h3 className='text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3'>
                        Notes
                    </h3>
                    <p className='text-sm text-slate-600'>{invoice.notes}</p>
                </div>
            )}
        </div>
    );
};

export default ClassicTemplate;
