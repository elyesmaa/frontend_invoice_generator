import React from 'react';
import { Edit, Trash2, Eye, Building2, UserCircle, Users } from 'lucide-react';
import Button from '../ui/Button';

const ClientsTable = ({ clients, onView, onEdit, onDelete, loading }) => {
    if (loading) {
        return (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-slate-600">Loading clients...</p>
            </div>
        );
    }

    if (!clients || clients.length === 0) {
        return (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
                <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-600 text-lg">No clients found</p>
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
                                Client
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                Type
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                Email
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                Phone
                            </th>
                            <th className="px-6 py-4 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                        {clients.map((client) => (
                            <tr key={client._id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${client.clientType === 'company' ? 'bg-purple-100' : 'bg-green-100'
                                            }`}>
                                            {client.clientType === 'company' ? (
                                                <Building2 className={`w-5 h-5 ${client.clientType === 'company' ? 'text-purple-600' : 'text-green-600'
                                                    }`} />
                                            ) : (
                                                <UserCircle className="w-5 h-5 text-green-600" />
                                            )}
                                        </div>
                                        <div className="ml-4">
                                            <p className="text-sm font-medium text-slate-900">
                                                {client.clientType === 'company' ? client.businessName : client.name}
                                            </p>
                                            <p className="text-xs text-slate-500">
                                                {client.clientType === 'company'
                                                    ? `MF: ${client.fiscalNumber}`
                                                    : `CIN: ${client.cinOrPassport}`}
                                            </p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${client.clientType === 'company'
                                        ? 'bg-purple-100 text-purple-800'
                                        : 'bg-green-100 text-green-800'
                                        }`}>
                                        {client.clientType === 'company' ? 'Company' : 'Individual'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm text-slate-600">
                                    {client.email || '-'}
                                </td>
                                <td className="px-6 py-4 text-sm text-slate-600">
                                    {client.phone || '-'}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            icon={Eye}
                                            onClick={() => onView(client._id)}
                                            className="text-blue-600 hover:text-blue-700"
                                        />
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            icon={Edit}
                                            onClick={() => onEdit(client._id)}
                                            className="text-slate-600 hover:text-slate-700"
                                        />
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            icon={Trash2}
                                            onClick={() => onDelete(client._id)}
                                            className="text-red-600 hover:text-red-700"
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

export default ClientsTable;
