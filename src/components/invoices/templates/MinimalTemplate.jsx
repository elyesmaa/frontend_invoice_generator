import React from 'react';
import { formatCurrency } from '../../../utils/currencyUtils';

const MinimalTemplate = ({ invoice, currency }) => {
    return (
        <div className='bg-white p-6 sm:p-8 md:p-12'>
            {/* Header */}
            <div className='flex justify-between items-start pb-6 border-b-2 border-black mb-8'>
                <div>
                    <h2 className='text-4xl font-light text-black'>INVOICE</h2>
                    <p className='text-sm text-black mt-2'>#{invoice.invoiceNumber}</p>
                </div>
                <div className='text-right'>
                    <p className='text-xs uppercase tracking-wide text-black'>Status</p>
                    <p className='font-semibold text-black mt-1'>{invoice.status}</p>
                </div>
            </div>

            {/* Bill From/To */}
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-12 mb-10'>
                <div>
                    <p className='text-xs uppercase tracking-wide text-black font-semibold mb-3'>From</p>
                    <p className='font-semibold text-black'>{invoice.billFrom.businessName}</p>
                    <p className='text-sm text-black mt-1'>{invoice.billFrom.address}</p>
                    <p className='text-sm text-black'>{invoice.billFrom.email}</p>
                    <p className='text-sm text-black'>{invoice.billFrom.phone}</p>
                    <p className='text-xs text-black mt-1'>MF: {invoice.billFrom.fiscalNumber}</p>
                </div>
                <div>
                    <p className='text-xs uppercase tracking-wide text-black font-semibold mb-3'>To</p>
                    <p className='font-semibold text-black'>{invoice.billTo.clientName}</p>
                    <p className='text-sm text-black mt-1'>{invoice.billTo.address}</p>
                    <p className='text-sm text-black'>{invoice.billTo.email}</p>
                    <p className='text-sm text-black'>{invoice.billTo.phone}</p>
                    <p className='text-xs text-black mt-1'>MF: {invoice.billTo.fiscalNumber}</p>
                </div>
            </div>

            {/* Dates */}
            <div className='grid grid-cols-3 gap-6 mb-10 pb-6 border-b border-black'>
                <div>
                    <p className='text-xs uppercase tracking-wide text-black font-semibold'>Invoice Date</p>
                    <p className='text-sm text-black mt-1'>{new Date(invoice.invoiceDate).toLocaleDateString()}</p>
                </div>
                <div>
                    <p className='text-xs uppercase tracking-wide text-black font-semibold'>Due Date</p>
                    <p className='text-sm text-black mt-1'>{new Date(invoice.dueDate).toLocaleDateString()}</p>
                </div>
                <div>
                    <p className='text-xs uppercase tracking-wide text-black font-semibold'>Payment Terms</p>
                    <p className='text-sm text-black mt-1'>{invoice.paymentTerms}</p>
                </div>
            </div>

            {/* Items Table */}
            <div className='mb-8'>
                <table className='w-full'>
                    <thead>
                        <tr className='border-b-2 border-black'>
                            <th className='py-3 text-left text-xs uppercase tracking-wide font-semibold text-black'>Item</th>
                            <th className='py-3 text-center text-xs uppercase tracking-wide font-semibold text-black'>Qty</th>
                            <th className='py-3 text-right text-xs uppercase tracking-wide font-semibold text-black'>Price</th>
                            <th className='py-3 text-right text-xs uppercase tracking-wide font-semibold text-black'>Tax %</th>
                            <th className='py-3 text-right text-xs uppercase tracking-wide font-semibold text-black'>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {invoice.items.map((item, index) => (
                            <tr key={index} className='border-b border-gray-300'>
                                <td className='py-3 text-sm text-black'>{item.name}</td>
                                <td className='py-3 text-center text-sm text-black'>{item.quantity}</td>
                                <td className='py-3 text-right text-sm text-black'>{formatCurrency(item.unitPrice, currency)}</td>
                                <td className='py-3 text-right text-sm text-black'>{item.taxPercent.toFixed(2)}%</td>
                                <td className='py-3 text-right text-sm font-semibold text-black'>{formatCurrency(item.total, currency)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Totals */}
            <div className='flex justify-end'>
                <div className='w-64'>
                    <div className='flex justify-between py-2 text-sm text-black'>
                        <span>Subtotal</span>
                        <span>{formatCurrency(invoice.subtotal, currency)}</span>
                    </div>
                    <div className='flex justify-between py-2 text-sm text-black'>
                        <span>Tax</span>
                        <span>{formatCurrency(invoice.taxTotal, currency)}</span>
                    </div>
                    <div className='flex justify-between py-2 text-sm text-black'>
                        <span>Fiscal Stamp</span>
                        <span>{formatCurrency(invoice.fiscalStamp, currency)}</span>
                    </div>
                    <div className='flex justify-between py-3 border-t-2 border-black mt-2 text-lg font-semibold text-black'>
                        <span>Total</span>
                        <span>{formatCurrency(invoice.total, currency)}</span>
                    </div>
                </div>
            </div>

            {invoice.notes && (
                <div className='mt-10 pt-6 border-t border-black'>
                    <p className='text-xs uppercase tracking-wide text-black font-semibold mb-2'>Notes</p>
                    <p className='text-sm text-black'>{invoice.notes}</p>
                </div>
            )}
        </div>
    );
};

export default MinimalTemplate;
