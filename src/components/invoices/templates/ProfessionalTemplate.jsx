import React from 'react';
import { formatCurrency } from '../../../utils/currencyUtils';

const ProfessionalTemplate = ({ invoice, currency }) => {
    return (
        <div className='bg-white p-6 sm:p-8 md:p-12'>
            {/* Header with company branding area */}
            <div className='grid grid-cols-2 gap-8 pb-6 mb-6 border-b-4 border-slate-800'>
                <div>
                    <div className='bg-slate-800 text-white px-4 py-2 inline-block mb-3'>
                        <h2 className='text-2xl font-bold'>INVOICE</h2>
                    </div>
                    <p className='text-slate-600 text-sm'>Invoice Number: <span className='font-semibold text-slate-900'>#{invoice.invoiceNumber}</span></p>
                </div>
                <div className='text-right'>
                    <div className={`inline-block px-4 py-2 ${invoice.status === "Paid" ? "bg-green-600" :
                            invoice.status === "Pending" ? "bg-amber-500" : "bg-red-600"
                        } text-white font-semibold`}>
                        {invoice.status}
                    </div>
                </div>
            </div>

            {/* Company Info Grid */}
            <div className='grid grid-cols-2 gap-8 mb-8'>
                <div className='border-l-4 border-slate-800 pl-4'>
                    <h3 className='text-xs font-bold text-slate-800 uppercase tracking-wider mb-3 bg-slate-100 px-2 py-1'>Billed From</h3>
                    <p className='font-bold text-slate-900 text-base'>{invoice.billFrom.businessName}</p>
                    <p className='text-slate-600 text-sm mt-2'>{invoice.billFrom.address}</p>
                    <p className='text-slate-600 text-sm'>{invoice.billFrom.email}</p>
                    <p className='text-slate-600 text-sm'>{invoice.billFrom.phone}</p>
                    <p className='text-slate-500 text-xs mt-2 font-mono'>Tax ID: {invoice.billFrom.fiscalNumber}</p>
                </div>
                <div className='border-l-4 border-slate-400 pl-4'>
                    <h3 className='text-xs font-bold text-slate-800 uppercase tracking-wider mb-3 bg-slate-100 px-2 py-1'>Billed To</h3>
                    <p className='font-bold text-slate-900 text-base'>{invoice.billTo.clientName}</p>
                    <p className='text-slate-600 text-sm mt-2'>{invoice.billTo.address}</p>
                    <p className='text-slate-600 text-sm'>{invoice.billTo.email}</p>
                    <p className='text-slate-600 text-sm'>{invoice.billTo.phone}</p>
                    <p className='text-slate-500 text-xs mt-2 font-mono'>Tax ID: {invoice.billTo.fiscalNumber}</p>
                </div>
            </div>

            {/* Invoice Details */}
            <div className='bg-slate-50 p-4 mb-8 grid grid-cols-3 gap-4'>
                <div>
                    <p className='text-xs font-semibold text-slate-500 uppercase'>Invoice Date</p>
                    <p className='text-slate-900 font-semibold mt-1'>{new Date(invoice.invoiceDate).toLocaleDateString()}</p>
                </div>
                <div>
                    <p className='text-xs font-semibold text-slate-500 uppercase'>Due Date</p>
                    <p className='text-slate-900 font-semibold mt-1'>{new Date(invoice.dueDate).toLocaleDateString()}</p>
                </div>
                <div>
                    <p className='text-xs font-semibold text-slate-500 uppercase'>Payment Terms</p>
                    <p className='text-slate-900 font-semibold mt-1'>{invoice.paymentTerms}</p>
                </div>
            </div>

            {/* Items Table */}
            <div className='mb-8 border border-slate-300'>
                <table className='w-full'>
                    <thead className='bg-slate-800 text-white'>
                        <tr>
                            <th className='px-4 py-3 text-left text-xs font-bold uppercase'>Description</th>
                            <th className='px-4 py-3 text-center text-xs font-bold uppercase'>Quantity</th>
                            <th className='px-4 py-3 text-right text-xs font-bold uppercase'>Unit Price</th>
                            <th className='px-4 py-3 text-right text-xs font-bold uppercase'>Tax Rate</th>
                            <th className='px-4 py-3 text-right text-xs font-bold uppercase'>Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {invoice.items.map((item, index) => (
                            <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                                <td className='px-4 py-3 text-sm font-medium text-slate-900 border-b border-slate-200'>{item.name}</td>
                                <td className='px-4 py-3 text-center text-sm text-slate-700 border-b border-slate-200'>{item.quantity}</td>
                                <td className='px-4 py-3 text-right text-sm text-slate-700 border-b border-slate-200'>{formatCurrency(item.unitPrice, currency)}</td>
                                <td className='px-4 py-3 text-right text-sm text-slate-700 border-b border-slate-200'>{item.taxPercent.toFixed(2)}%</td>
                                <td className='px-4 py-3 text-right text-sm font-semibold text-slate-900 border-b border-slate-200'>{formatCurrency(item.total, currency)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Summary */}
            <div className='flex justify-end'>
                <div className='w-80 border border-slate-300'>
                    <div className='bg-slate-100 px-4 py-2 flex justify-between text-sm font-semibold text-slate-700'>
                        <span>Subtotal</span>
                        <span>{formatCurrency(invoice.subtotal, currency)}</span>
                    </div>
                    <div className='bg-white px-4 py-2 flex justify-between text-sm text-slate-600'>
                        <span>Tax</span>
                        <span>{formatCurrency(invoice.taxTotal, currency)}</span>
                    </div>
                    <div className='bg-white px-4 py-2 flex justify-between text-sm text-slate-600 border-b border-slate-300'>
                        <span>Fiscal Stamp</span>
                        <span>{formatCurrency(invoice.fiscalStamp, currency)}</span>
                    </div>
                    <div className='bg-slate-800 text-white px-4 py-3 flex justify-between text-lg font-bold'>
                        <span>TOTAL DUE</span>
                        <span>{formatCurrency(invoice.total, currency)}</span>
                    </div>
                </div>
            </div>

            {invoice.notes && (
                <div className='mt-8 pt-6 border-t-2 border-slate-300'>
                    <h3 className='text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 bg-slate-100 px-2 py-1 inline-block'>Additional Notes</h3>
                    <p className='text-sm text-slate-700 mt-3'>{invoice.notes}</p>
                </div>
            )}
        </div>
    );
};

export default ProfessionalTemplate;
