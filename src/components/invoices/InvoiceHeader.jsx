import React from 'react';

/**
 * Invoice header component displaying title and status
 */
const InvoiceHeader = ({ existingInvoice, status }) => (
    <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-slate-900">
            {existingInvoice ? "Edit Invoice" : "Create Invoice"}
        </h2>
        <span className={`px-3 py-1 rounded-full font-semibold text-sm ${status === "Paid" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
            }`}>
            {status}
        </span>
    </div>
);

export default InvoiceHeader;
