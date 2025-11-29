import React, { memo } from 'react';
import { Edit, Trash2, Mail } from 'lucide-react';
import Button from '../ui/Button';

const ActionButtons = memo(({
    invoice,
    onStatusChange,
    onEdit,
    onDelete,
    onReminder,
    statusChangesLoading
}) => (
    <div className='flex items-center justify-start gap-2' onClick={e => e.stopPropagation()}>
        <Button
            size='small'
            variant='secondary'
            onClick={() => onStatusChange(invoice)}
            isLoading={statusChangesLoading === invoice._id}
            className={`min-w-[120px] h-8 px-4 text-sm font-medium rounded-lg transition-all duration-200 ${invoice.status === 'Paid'
                ? 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-100'
                : 'bg-gradient-to-r from-blue-950 to-blue-900 text-white hover:from-blue-900 hover:to-blue-800'
                }`}
        >
            {statusChangesLoading === invoice._id ? (
                'Updating...'
            ) : invoice.status === 'Paid' ? (
                'Mark Unpaid'
            ) : (
                'Mark Paid'
            )}
        </Button>

        <div className='flex items-center gap-1 border border-slate-200 rounded-lg p-1 bg-slate-50'>
            <Button
                size="small"
                variant="ghost"
                onClick={() => onEdit(invoice._id)}
                className='h-8 w-8 p-0 flex items-center justify-center hover:bg-white'
                title="Edit invoice"
            >
                <Edit className='w-4 h-4' />
            </Button>

            <Button
                size='small'
                variant='ghost'
                onClick={() => onDelete(invoice)}
                className='h-8 w-8 p-0 flex items-center justify-center hover:bg-white'
                title="Delete invoice"
            >
                <Trash2 className='w-4 h-4 text-red-500' />
            </Button>

            {invoice.status === 'Unpaid' && (
                <Button
                    size='small'
                    variant='ghost'
                    onClick={() => onReminder(invoice._id)}
                    title="Generate Reminder"
                    className='h-8 w-8 p-0 flex items-center justify-center hover:bg-white'
                >
                    <Mail className='w-4 h-4 text-blue-500' />
                </Button>
            )}
        </div>
    </div>
));

export default ActionButtons;
