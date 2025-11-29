import React from 'react';
import { formatCurrency } from '../../../utils/currencyUtils';

const CreativeTemplate = ({ invoice, currency }) => {
    return (
        <div className='bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 p-6 sm:p-8 md:p-12 rounded-3xl'>
            {/* Creative Header */}
            <div className='relative mb-8'>
                <div className='absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full opacity-20 -z-10'></div>
                <div className='absolute bottom-0 right-0 w-40 h-40 bg-gradient-to-br from-orange-400 to-pink-400 rounded-full opacity-20 -z-10'></div>

                <div className='flex flex-col sm:flex-row justify-between items-start'>
                    <div>
                        <h2 className='text-5xl font-black bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent'>
                            INVOICE
                        </h2>
                        <p className='text-lg font-semibold text-slate-700 mt-2'>#{invoice.invoiceNumber}</p>
                    </div>
                    <div className='mt-4 sm:mt-0'>
                        <span
                            className={`inline-flex items-center px-5 py-2 rounded-full text-sm font-bold shadow-lg ${invoice.status === "Paid"
                                    ? "bg-gradient-to-r from-green-400 to-emerald-500 text-white"
                                    : invoice.status === "Pending"
                                        ? 'bg-gradient-to-r from-yellow-400 to-orange-400 text-white'
                                        : 'bg-gradient-to-r from-red-400 to-pink-500 text-white'
                                }`}
                        >
                            {invoice.status}
                        </span>
                    </div>
                </div>
            </div>

            {/* Bill From/To Cards */}
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8'>
                <div className='bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border-l-4 border-purple-500'>
                    <h3 className='text-xs font-black text-purple-600 uppercase tracking-wider mb-3'>From</h3>
                    <p className='font-bold text-slate-900 text-lg'>{invoice.billFrom.businessName}</p>
                    <p className='text-slate-600 text-sm mt-2'>{invoice.billFrom.address}</p>
                    <p className='text-slate-600 text-sm'>{invoice.billFrom.email}</p>
                    <p className='text-slate-600 text-sm'>{invoice.billFrom.phone}</p>
                    <p className='text-slate-500 text-xs mt-2 font-mono'>MF: {invoice.billFrom.fiscalNumber}</p>
                </div>
                <div className='bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border-l-4 border-pink-500'>
                    <h3 className='text-xs font-black text-pink-600 uppercase tracking-wider mb-3'>To</h3>
                    <p className='font-bold text-slate-900 text-lg'>{invoice.billTo.clientName}</p>
                    <p className='text-slate-600 text-sm mt-2'>{invoice.billTo.address}</p>
                    <p className='text-slate-600 text-sm'>{invoice.billTo.email}</p>
                    <p className='text-slate-600 text-sm'>{invoice.billTo.phone}</p>
                    <p className='text-slate-500 text-xs mt-2 font-mono'>MF: {invoice.billTo.fiscalNumber}</p>
                </div>
            </div>

            {/* Dates with gradient backgrounds */}
            <div className='grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8'>
                <div className='bg-gradient-to-br from-purple-500 to-purple-600 text-white p-4 rounded-xl shadow-md'>
                    <p className='text-xs font-bold uppercase opacity-90'>Invoice Date</p>
                    <p className='font-semibold mt-1'>{new Date(invoice.invoiceDate).toLocaleDateString()}</p>
                </div>
                <div className='bg-gradient-to-br from-pink-500 to-pink-600 text-white p-4 rounded-xl shadow-md'>
                    <p className='text-xs font-bold uppercase opacity-90'>Due Date</p>
                    <p className='font-semibold mt-1'>{new Date(invoice.dueDate).toLocaleDateString()}</p>
                </div>
                <div className='bg-gradient-to-br from-orange-500 to-orange-600 text-white p-4 rounded-xl shadow-md'>
                    <p className='text-xs font-bold uppercase opacity-90'>Payment Terms</p>
                    <p className='font-semibold mt-1'>{invoice.paymentTerms}</p>
                </div>
            </div>

            {/* Items Table with creative styling */}
            <div className='bg-white/90 backdrop-blur-sm rounded-2xl overflow-hidden shadow-xl mb-8'>
                <table className='w-full'>
                    <thead className='bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 text-white'>
                        <tr>
                            <th className='px-4 py-4 text-left text-xs font-bold uppercase'>Item</th>
                            <th className='px-4 py-4 text-center text-xs font-bold uppercase'>Qty</th>
                            <th className='px-4 py-4 text-right text-xs font-bold uppercase'>Price</th>
                            <th className='px-4 py-4 text-right text-xs font-bold uppercase'>Tax %</th>
                            <th className='px-4 py-4 text-right text-xs font-bold uppercase'>Total</th>
                        </tr>
                    </thead>
                    <tbody className='divide-y divide-slate-100'>
                        {invoice.items.map((item, index) => (
                            <tr key={index} className='hover:bg-purple-50/50 transition-colors'>
                                <td className='px-4 py-3 text-sm font-semibold text-slate-900'>{item.name}</td>
                                <td className='px-4 py-3 text-center text-sm text-slate-700'>{item.quantity}</td>
                                <td className='px-4 py-3 text-right text-sm text-slate-700'>{formatCurrency(item.unitPrice, currency)}</td>
                                <td className='px-4 py-3 text-right text-sm text-slate-700'>{item.taxPercent.toFixed(2)}%</td>
                                <td className='px-4 py-3 text-right text-sm font-bold text-slate-900'>{formatCurrency(item.total, currency)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Totals with gradient */}
            <div className='flex justify-end'>
                <div className='w-full max-w-sm bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-xl'>
                    <div className='space-y-3'>
                        <div className='flex justify-between text-sm text-slate-600'>
                            <span>Subtotal</span>
                            <span className='font-semibold'>{formatCurrency(invoice.subtotal, currency)}</span>
                        </div>
                        <div className='flex justify-between text-sm text-slate-600'>
                            <span>Tax</span>
                            <span className='font-semibold'>{formatCurrency(invoice.taxTotal, currency)}</span>
                        </div>
                        <div className='flex justify-between text-sm text-slate-600'>
                            <span>Fiscal Stamp</span>
                            <span className='font-semibold'>{formatCurrency(invoice.fiscalStamp, currency)}</span>
                        </div>
                        <div className='flex justify-between text-xl font-black text-white bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 p-4 rounded-xl mt-4 shadow-lg'>
                            <span>TOTAL</span>
                            <span>{formatCurrency(invoice.total, currency)}</span>
                        </div>
                    </div>
                </div>
            </div>

            {invoice.notes && (
                <div className='mt-8 bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border-l-4 border-gradient-to-b from-purple-500 to-pink-500'>
                    <h3 className='text-xs font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent uppercase tracking-wider mb-2'>
                        Notes
                    </h3>
                    <p className='text-sm text-slate-700'>{invoice.notes}</p>
                </div>
            )}
        </div>
    );
};

export default CreativeTemplate;
