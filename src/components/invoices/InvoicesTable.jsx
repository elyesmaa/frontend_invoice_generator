import React from 'react';
import { Edit, Trash2, Eye, FileText, Mail, CheckCircle } from 'lucide-react';
import moment from 'moment';
import Button from '../ui/Button';
import StatusBadge from './StatusBadge';
import { formatCurrency } from '../../utils/currencyUtils';
import { useCompany } from '../../context/CompanyContext';

const InvoicesTable = ({ invoices, onView, onEdit, onDelete, onReminder, onStatusChange, loading }) => {
    const { currentCompany } = useCompany();

    if (loading) {
        return (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-slate-600">Loading invoices...</p>
            </div>
        );
    }

    if (invoices.length === 0 || !invoices) {

        return (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
                <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-600 text-lg">No invoices found</p>
                <p className="text-slate-400 text-sm mt-2">Try adjusting your search or filters</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                Invoice
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                Client
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                Amount
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                Due Date
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-6 py-4 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                Status Action
                            </th>
                            <th className="px-6 py-4 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                        {invoices.map((invoice) => (
                            <tr key={invoice._id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center">
                                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                                            <FileText className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <div className="ml-4">
                                            <p className="text-sm font-medium text-slate-900">
                                                {invoice.invoiceNumber}
                                            </p>
                                            <p className="text-xs text-slate-500">
                                                {moment(invoice.createdAt).format('DD/MM/YYYY')}
                                            </p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm text-slate-600">
                                    {invoice.clientName || invoice.billTo?.clientName || '-'}
                                </td>
                                <td className="px-6 py-4">
                                    <p className="text-sm font-medium text-slate-900">
                                        {formatCurrency(invoice.total, currentCompany?.currency)}
                                    </p>
                                </td>
                                <td className="px-6 py-4 text-sm text-slate-600">
                                    {moment(invoice.dueDate).format('DD/MM/YYYY')}
                                </td>
                                <td className="px-6 py-4">
                                    <StatusBadge status={invoice.status} />
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <button
                                        onClick={() => onStatusChange(invoice)}
                                        className={`min-w-[130px] px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${invoice.status === 'Paid'
                                            ? 'bg-orange-50 text-orange-700 hover:bg-orange-100 border border-orange-200'
                                            : 'bg-green-50 text-green-700 hover:bg-green-100 border border-green-200'
                                            }`}
                                    >
                                        {invoice.status === 'Paid' ? 'Mark as Unpaid' : 'Mark as Paid'}
                                    </button>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            icon={Eye}
                                            onClick={() => onView(invoice._id)}
                                            className="text-blue-600 hover:text-blue-700"
                                            title="View Invoice"
                                        />
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            icon={Edit}
                                            onClick={() => onEdit(invoice._id)}
                                            className="text-slate-600 hover:text-slate-700"
                                            title="Edit Invoice"
                                        />
                                        {invoice.status !== 'Paid' && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                icon={Mail}
                                                onClick={() => onReminder(invoice._id)}
                                                className="text-green-600 hover:text-green-700"
                                                title="Send Reminder"
                                            />
                                        )}
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            icon={Trash2}
                                            onClick={() => onDelete(invoice._id)}
                                            className="text-red-600 hover:text-red-700"
                                            title="Delete Invoice"
                                        />
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default InvoicesTable;
