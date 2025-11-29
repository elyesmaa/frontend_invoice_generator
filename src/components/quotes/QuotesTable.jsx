import React from 'react';
import { Edit, Trash2, Eye, FileText, User, Copy, Printer } from 'lucide-react';
import Button from '../ui/Button';
import { formatCurrency } from '../../utils/currencyUtils';
import { useCompany } from '../../context/CompanyContext';

const QuotesTable = ({ quotes, onView, onEdit, onDelete, onClone, loading }) => {
    const { currentCompany } = useCompany();

    const getStatusBadgeClass = (status) => {
        const statusMap = {
            'Draft': 'bg-gray-100 text-gray-800',
            'Sent': 'bg-blue-100 text-blue-800',
            'Accepted': 'bg-green-100 text-green-800',
            'Rejected': 'bg-red-100 text-red-800',
            'Converted': 'bg-purple-100 text-purple-800'
        };
        return statusMap[status] || 'bg-gray-100 text-gray-800';
    };

    if (loading) {
        return (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-slate-600">Loading estimates...</p>
            </div>
        );
    }

    if (quotes.length === 0 || !quotes) {
        return (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
                <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-600 text-lg">No estimates found</p>
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
                                Estimate Number
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                Client
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                Total
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                Expiration
                            </th>
                            <th className="px-6 py-4 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                        {quotes.map((quote) => (
                            <tr key={quote._id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4 text-sm font-medium text-slate-900">
                                    <div className="flex items-center gap-2">
                                        <FileText className="w-4 h-4 text-slate-400" />
                                        {quote.quoteNumber}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <User className="w-4 h-4 text-slate-400" />
                                        <div>
                                            <div className="text-sm font-medium text-slate-900">{quote.clientName}</div>
                                            <div className="text-xs text-slate-500">{quote.clientEmail}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm font-medium text-slate-900">
                                    {formatCurrency(quote.total, currentCompany?.currency)}
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(quote.status)}`}>
                                        {quote.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm text-slate-600">
                                    {quote.expirationDate ? new Date(quote.expirationDate).toLocaleDateString() : '-'}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            icon={Eye}
                                            onClick={() => onView(quote._id)}
                                            className="text-blue-600 hover:text-blue-700"
                                            title="View Details"
                                        />
                                        {quote.status !== 'Converted' && (
                                            <>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    icon={Edit}
                                                    onClick={() => onEdit(quote._id)}
                                                    className="text-slate-600 hover:text-slate-700"
                                                    title="Edit"
                                                />
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    icon={Copy}
                                                    onClick={() => onClone(quote._id)}
                                                    className="text-green-600 hover:text-green-700"
                                                    title="Clone"
                                                />
                                            </>
                                        )}
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            icon={Printer}
                                            onClick={() => onView(quote._id)}
                                            className="text-purple-600 hover:text-purple-700"
                                            title="Print"
                                        />
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            icon={Trash2}
                                            onClick={() => onDelete(quote._id)}
                                            className="text-red-600 hover:text-red-700"
                                            title="Delete"
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

export default QuotesTable;
