import React from 'react';
import { formatCurrency } from '../../../utils/currencyUtils';

// Color schemes for different variants - Using borders instead of backgrounds
const colorSchemes = {
    blue: {
        border: 'border-blue-600',
        borderLight: 'border-blue-200',
        text: 'text-blue-700',
        bgLight: 'bg-blue-50',
        statusPaid: 'bg-blue-100 text-blue-800',
    },
    green: {
        border: 'border-green-600',
        borderLight: 'border-green-200',
        text: 'text-green-700',
        bgLight: 'bg-green-50',
        statusPaid: 'bg-green-100 text-green-800',
    },
    purple: {
        border: 'border-purple-600',
        borderLight: 'border-purple-200',
        text: 'text-purple-700',
        bgLight: 'bg-purple-50',
        statusPaid: 'bg-purple-100 text-purple-800',
    },
    orange: {
        border: 'border-orange-600',
        borderLight: 'border-orange-200',
        text: 'text-orange-700',
        bgLight: 'bg-orange-50',
        statusPaid: 'bg-orange-100 text-orange-800',
    },
    red: {
        border: 'border-red-600',
        borderLight: 'border-red-200',
        text: 'text-red-700',
        bgLight: 'bg-red-50',
        statusPaid: 'bg-red-100 text-red-800',
    },
    black: {
        border: 'border-slate-900',
        borderLight: 'border-slate-200',
        text: 'text-slate-900',
        bgLight: 'bg-slate-50',
        statusPaid: 'bg-slate-100 text-slate-800',
    },
};

const InvoiceTemplate = ({ invoice, currency, colorVariant = 'blue', title = 'INVOICE', dateLabels = { date: 'Invoice Date', dueDate: 'Due Date' } }) => {
    const colors = colorSchemes[colorVariant] || colorSchemes.blue;

    return (
        <div className='bg-white p-6 sm:p-8 md:p-12 rounded-lg shadow-md border border-slate-200 print:shadow-none print:border-none print:p-0'>
            {/* Header */}
            <div className={`border-l-8 ${colors.border} pl-6 py-2 mb-8 flex flex-col sm:flex-row justify-between items-start`}>
                <div>
                    <h2 className={`text-4xl font-bold ${colors.text} tracking-tight`}>{title}</h2>
                    <p className='text-slate-500 mt-1'>#{invoice.invoiceNumber || invoice.quoteNumber}</p>
                </div>
                <div className='mt-4 sm:mt-0 text-right'>
                    <p className='text-xs uppercase text-slate-500 font-semibold mb-1'>Status</p>
                    <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${invoice.status === "Paid" || invoice.status === "Accepted"
                            ? 'bg-emerald-100 text-emerald-800'
                            : invoice.status === "Pending" || invoice.status === "Sent"
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                    >
                        {invoice.status}
                    </span>
                </div>
            </div>

            {/* Bill From/To */}
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-8 mb-10'>
                <div>
                    <h3 className={`text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 pb-2 border-b ${colors.borderLight}`}>
                        From
                    </h3>
                    <div className='text-slate-800'>
                        <p className={`font-bold text-lg ${colors.text} mb-1`}>{invoice.billFrom.businessName}</p>
                        <p className='text-sm'>{invoice.billFrom.address}</p>
                        <p className='text-sm'>{invoice.billFrom.email}</p>
                        <p className='text-sm'>{invoice.billFrom.phone}</p>
                        <p className='text-xs text-slate-500 mt-2'>MF: {invoice.billFrom.fiscalNumber}</p>
                    </div>
                </div>
                <div>
                    <h3 className={`text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 pb-2 border-b ${colors.borderLight}`}>
                        To
                    </h3>
                    <div className='text-slate-800'>
                        <p className='font-bold text-lg text-slate-900 mb-1'>{invoice.billTo.clientName}</p>
                        <p className='text-sm'>{invoice.billTo.address}</p>
                        <p className='text-sm'>{invoice.billTo.email}</p>
                        <p className='text-sm'>{invoice.billTo.phone}</p>
                        <p className='text-xs text-slate-500 mt-2'>MF: {invoice.billTo.fiscalNumber}</p>
                    </div>
                </div>
            </div>

            {/* Dates */}
            <div className={`grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10 p-6 rounded-lg border ${colors.borderLight} ${colors.bgLight} print:bg-white print:border-slate-200`}>
                <div>
                    <p className='text-xs text-slate-500 font-semibold uppercase mb-1'>{dateLabels.date}</p>
                    <p className='text-slate-900 font-bold'>{new Date(invoice.invoiceDate || invoice.quoteDate).toLocaleDateString()}</p>
                </div>
                <div>
                    <p className='text-xs text-slate-500 font-semibold uppercase mb-1'>{dateLabels.dueDate}</p>
                    <p className='text-slate-900 font-bold'>
                        {(invoice.dueDate || invoice.expirationDate) ? new Date(invoice.dueDate || invoice.expirationDate).toLocaleDateString() : '-'}
                    </p>
                </div>
                <div>
                    <p className='text-xs text-slate-500 font-semibold uppercase mb-1'>Payment Terms</p>
                    <p className='text-slate-900 font-bold'>{invoice.paymentTerms || '-'}</p>
                </div>
            </div>

            {/* Items Table */}
            <div className='mb-10'>
                <table className='w-full'>
                    <thead>
                        <tr className={`border-b-2 ${colors.border}`}>
                            <th className={`px-4 py-3 text-left text-xs font-bold uppercase ${colors.text}`}>Item</th>
                            <th className={`px-4 py-3 text-center text-xs font-bold uppercase ${colors.text}`}>Qty</th>
                            <th className={`px-4 py-3 text-right text-xs font-bold uppercase ${colors.text}`}>Price</th>
                            <th className={`px-4 py-3 text-right text-xs font-bold uppercase ${colors.text}`}>Tax</th>
                            <th className={`px-4 py-3 text-right text-xs font-bold uppercase ${colors.text}`}>Total</th>
                        </tr>
                    </thead>
                    <tbody className='divide-y divide-slate-100'>
                        {invoice.items.map((item, index) => (
                            <tr key={index} className='hover:bg-slate-50 print:hover:bg-transparent'>
                                <td className='px-4 py-4 text-sm font-medium text-slate-900'>{item.name}</td>
                                <td className='px-4 py-4 text-center text-sm text-slate-600'>{item.quantity}</td>
                                <td className='px-4 py-4 text-right text-sm text-slate-600'>{formatCurrency(item.unitPrice, currency)}</td>
                                <td className='px-4 py-4 text-right text-sm text-slate-600'>{item.taxPercent.toFixed(0)}%</td>
                                <td className='px-4 py-4 text-right text-sm font-bold text-slate-900'>{formatCurrency(item.total, currency)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Totals */}
            <div className='flex justify-end'>
                <div className='w-full max-w-xs space-y-3'>
                    <div className='flex justify-between text-sm text-slate-600 pb-2 border-b border-slate-100'>
                        <span>Subtotal</span>
                        <span className='font-medium'>{formatCurrency(invoice.subtotal, currency)}</span>
                    </div>
                    <div className='flex justify-between text-sm text-slate-600 pb-2 border-b border-slate-100'>
                        <span>Tax</span>
                        <span className='font-medium'>{formatCurrency(invoice.taxTotal, currency)}</span>
                    </div>
                    <div className='flex justify-between text-sm text-slate-600 pb-2 border-b border-slate-100'>
                        <span>Fiscal Stamp</span>
                        <span className='font-medium'>{formatCurrency(invoice.fiscalStamp, currency)}</span>
                    </div>
                    <div className={`flex justify-between text-xl font-bold ${colors.text} pt-2 border-t-2 ${colors.border}`}>
                        <span>Total</span>
                        <span>{formatCurrency(invoice.total, currency)}</span>
                    </div>
                </div>
            </div>

            {/* Notes */}
            {invoice.notes && (
                <div className={`mt-12 pt-6 border-t ${colors.borderLight}`}>
                    <h3 className='text-xs font-bold text-slate-400 uppercase tracking-wider mb-2'>Notes</h3>
                    <p className='text-sm text-slate-600 italic'>{invoice.notes}</p>
                </div>
            )}

            {/* Footer */}
            <div className='mt-12 text-center'>
                <p className='text-xs text-slate-400'>Thank you for your business!</p>
            </div>
        </div>
    );
};

export default InvoiceTemplate;
