import React from 'react';
import { formatCurrency } from '../../../utils/currencyUtils';

const ModernTemplate = ({ invoice, currency }) => {
    return (
        <div className='bg-gradient-to-br from-slate-50 to-white p-6 sm:p-8 md:p-12 rounded-2xl shadow-lg'>
            {/* Header with accent */}
            <div className='bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-xl mb-8'>
                <div className='flex flex-col sm:flex-row justify-between items-start'>
                    <div>
                        <h2 className='text-3xl font-bold'>INVOICE</h2>
                        <p className='text-blue-100 mt-2'>#{invoice.invoiceNumber}</p>
                    </div>
                    <div className='mt-4 sm:mt-0'>
                        <span
                            className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold ${invoice.status === "Paid"
                                    ? "bg-green-500 text-white"
                                    : invoice.status === "Pending"
                                        ? 'bg-yellow-400 text-slate-900'
                                        : 'bg-red-500 text-white'
                                }`}
                        >
                            {invoice.status}
                        </span>
                    </div>
                </div>
            </div>

            {/* Bill From/To */}
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8'>
                <div className='bg-white p-5 rounded-xl border border-slate-200'>
                    <h3 className='text-xs font-bold text-blue-600 uppercase tracking-wider mb-3'>From</h3>
                    <p className='font-bold text-slate-900 text-lg'>{invoice.billFrom.businessName}</p>
                    <p className='text-slate-600 text-sm mt-2'>{invoice.billFrom.address}</p>
                    <p className='text-slate-600 text-sm'>{invoice.billFrom.email}</p>
                    <p className='text-slate-600 text-sm'>{invoice.billFrom.phone}</p>
                    <p className='text-slate-500 text-xs mt-2'>MF: {invoice.billFrom.fiscalNumber}</p>
                </div>
                <div className='bg-white p-5 rounded-xl border border-slate-200'>
                    <h3 className='text-xs font-bold text-blue-600 uppercase tracking-wider mb-3'>To</h3>
                    <p className='font-bold text-slate-900 text-lg'>{invoice.billTo.clientName}</p>
                    <p className='text-slate-600 text-sm mt-2'>{invoice.billTo.address}</p>
                    <p className='text-slate-600 text-sm'>{invoice.billTo.email}</p>
                    <p className='text-slate-600 text-sm'>{invoice.billTo.phone}</p>
                    <p className='text-slate-500 text-xs mt-2'>MF: {invoice.billTo.fiscalNumber}</p>
                </div>
            </div>

            {/* Dates */}
            <div className='grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8'>
                <div className='bg-blue-50 p-4 rounded-lg'>
                    <p className='text-xs text-blue-600 font-semibold uppercase'>Invoice Date</p>
                    <p className='text-slate-900 font-medium mt-1'>{new Date(invoice.invoiceDate).toLocaleDateString()}</p>
                </div>
                <div className='bg-blue-50 p-4 rounded-lg'>
                    <p className='text-xs text-blue-600 font-semibold uppercase'>Due Date</p>
                    <p className='text-slate-900 font-medium mt-1'>{new Date(invoice.dueDate).toLocaleDateString()}</p>
                </div>
                <div className='bg-blue-50 p-4 rounded-lg'>
                    <p className='text-xs text-blue-600 font-semibold uppercase'>Payment Terms</p>
                    <p className='text-slate-900 font-medium mt-1'>{invoice.paymentTerms}</p>
                </div>
            </div>

            {/* Items Table */}
            <div className='bg-white rounded-xl overflow-hidden border border-slate-200 mb-8'>
                <table className='w-full'>
                    <thead className='bg-gradient-to-r from-blue-600 to-blue-700 text-white'>
                        <tr>
                            <th className='px-4 py-3 text-left text-xs font-semibold uppercase'>Item</th>
                            <th className='px-4 py-3 text-center text-xs font-semibold uppercase'>Qty</th>
                            <th className='px-4 py-3 text-right text-xs font-semibold uppercase'>Price</th>
                            <th className='px-4 py-3 text-right text-xs font-semibold uppercase'>Tax %</th>
                            <th className='px-4 py-3 text-right text-xs font-semibold uppercase'>Total</th>
                        </tr>
                    </thead>
                    <tbody className='divide-y divide-slate-100'>
                        {invoice.items.map((item, index) => (
                            <tr key={index} className='hover:bg-slate-50'>
                                <td className='px-4 py-3 text-sm font-medium text-slate-900'>{item.name}</td>
                                <td className='px-4 py-3 text-center text-sm text-slate-700'>{item.quantity}</td>
                                <td className='px-4 py-3 text-right text-sm text-slate-700'>{formatCurrency(item.unitPrice, currency)}</td>
                                <td className='px-4 py-3 text-right text-sm text-slate-700'>{item.taxPercent.toFixed(2)}%</td>
                                <td className='px-4 py-3 text-right text-sm font-semibold text-slate-900'>{formatCurrency(item.total, currency)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Totals */}
            <div className='flex justify-end'>
                <div className='w-full max-w-sm bg-white p-6 rounded-xl border border-slate-200'>
                    <div className='space-y-3'>
                        <div className='flex justify-between text-sm text-slate-600'>
                            <span>Subtotal</span>
                            <span className='font-medium'>{formatCurrency(invoice.subtotal, currency)}</span>
                        </div>
                        <div className='flex justify-between text-sm text-slate-600'>
                            <span>Tax</span>
                            <span className='font-medium'>{formatCurrency(invoice.taxTotal, currency)}</span>
                        </div>
                        <div className='flex justify-between text-sm text-slate-600'>
                            <span>Fiscal Stamp</span>
                            <span className='font-medium'>{formatCurrency(invoice.fiscalStamp, currency)}</span>
                        </div>
                        <div className='flex justify-between text-lg font-bold text-white bg-gradient-to-r from-blue-600 to-blue-700 p-3 rounded-lg mt-4'>
                            <span>Total</span>
                            <span>{formatCurrency(invoice.total, currency)}</span>
                        </div>
                    </div>
                </div>
            </div>

            {invoice.notes && (
                <div className='mt-8 bg-blue-50 p-5 rounded-xl'>
                    <h3 className='text-xs font-bold text-blue-600 uppercase tracking-wider mb-2'>Notes</h3>
                    <p className='text-sm text-slate-700'>{invoice.notes}</p>
                </div>
            )}
        </div>
    );
};

export default ModernTemplate;
