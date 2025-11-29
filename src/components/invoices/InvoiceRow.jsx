import React, { memo } from 'react';
import moment from 'moment';
import StatusBadge from './StatusBadge';
import ActionButtons from './ActionButtons';

const InvoiceRow = memo(({
    invoice,
    onStatusChange,
    onEdit,
    onDelete,
    onReminder,
    statusChangesLoading,
    navigate
}) => (
    <tr className='hover:bg-slate-50 transition-colors duration-150'>
        <td
            onClick={() => navigate(`/invoices/${invoice._id}`)}
            className='px-6 py-4 text-sm font-medium text-slate-900 cursor-pointer hover:text-blue-600 hover:underline transition-colors'
        >
            {invoice.invoiceNumber}
        </td>

        <td
            onClick={() => navigate(`/invoices/${invoice._id}`)}
            className='px-6 py-4 text-sm text-slate-600 cursor-pointer hover:text-blue-600 transition-colors'
        >
            {invoice.clientName || invoice.billTo?.clientName}
        </td>

        <td
            onClick={() => navigate(`/invoices/${invoice._id}`)}
            className='px-6 py-4 text-sm text-slate-600 cursor-pointer'
        >
            $ {invoice.total?.toFixed(2)}
        </td>

        <td
            onClick={() => navigate(`/invoices/${invoice._id}`)}
            className='px-6 py-4 text-sm text-slate-600 cursor-pointer'
        >
            {moment(invoice.dueDate).format('DD/MM/YYYY')}
        </td>

        <td className='px-6 py-4 whitespace-nowrap text-sm'>
            <StatusBadge status={invoice.status} />
        </td>

        <td className='px-6 py-4 whitespace-nowrap'>
            <ActionButtons
                invoice={invoice}
                onStatusChange={onStatusChange}
                onEdit={() => navigate(`/invoices/${invoice._id}/edit`)}
                onDelete={onDelete}
                onReminder={onReminder}
                statusChangesLoading={statusChangesLoading}
            />
        </td>
    </tr>
));

export default InvoiceRow;
