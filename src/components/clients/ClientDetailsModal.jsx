import React from 'react';
import { X, Building2, UserCircle, Mail, Phone, MapPin, Calendar, Hash } from 'lucide-react';
import Button from '../ui/Button';

const ClientDetailsModal = ({ isOpen, client, onClose }) => {
    if (!isOpen || !client) return null;

    const isCompany = client.clientType === 'company';

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isCompany ? 'bg-purple-100' : 'bg-green-100'
                            }`}>
                            {isCompany ? (
                                <Building2 className="w-6 h-6 text-purple-600" />
                            ) : (
                                <UserCircle className="w-6 h-6 text-green-600" />
                            )}
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-900">
                                {isCompany ? client.businessName : client.name}
                            </h2>
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${isCompany ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'
                                }`}>
                                {isCompany ? 'Company' : 'Individual'}
                            </span>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-600 transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Contact Information */}
                    <div>
                        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">
                            Contact Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {client.email && (
                                <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <Mail className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 mb-1">Email</p>
                                        <p className="text-sm font-medium text-slate-900">{client.email}</p>
                                    </div>
                                </div>
                            )}

                            {client.phone && (
                                <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <Phone className="w-5 h-5 text-green-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 mb-1">Phone</p>
                                        <p className="text-sm font-medium text-slate-900">{client.phone}</p>
                                    </div>
                                </div>
                            )}

                            {client.address && (
                                <div className="flex items-start gap-3 md:col-span-2">
                                    <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <MapPin className="w-5 h-5 text-orange-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 mb-1">Address</p>
                                        <p className="text-sm font-medium text-slate-900">{client.address}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Legal Information */}
                    <div>
                        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">
                            Legal Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {isCompany ? (
                                <>
                                    {client.businessName && (
                                        <div className="flex items-start gap-3">
                                            <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                                <Building2 className="w-5 h-5 text-purple-600" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-slate-500 mb-1">Business Name</p>
                                                <p className="text-sm font-medium text-slate-900">{client.businessName}</p>
                                            </div>
                                        </div>
                                    )}
                                    {client.fiscalNumber && (
                                        <div className="flex items-start gap-3">
                                            <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                                <Hash className="w-5 h-5 text-indigo-600" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-slate-500 mb-1">Fiscal Number</p>
                                                <p className="text-sm font-medium text-slate-900">{client.fiscalNumber}</p>
                                            </div>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <>
                                    {client.name && (
                                        <div className="flex items-start gap-3">
                                            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                                <UserCircle className="w-5 h-5 text-green-600" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-slate-500 mb-1">Full Name</p>
                                                <p className="text-sm font-medium text-slate-900">{client.name}</p>
                                            </div>
                                        </div>
                                    )}
                                    {client.cinOrPassport && (
                                        <div className="flex items-start gap-3">
                                            <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                                <Hash className="w-5 h-5 text-indigo-600" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-slate-500 mb-1">CIN / Passport</p>
                                                <p className="text-sm font-medium text-slate-900">{client.cinOrPassport}</p>
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>

                    {/* Metadata */}
                    {client.createdAt && (
                        <div>
                            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">
                                Additional Information
                            </h3>
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <Calendar className="w-5 h-5 text-slate-600" />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 mb-1">Created On</p>
                                    <p className="text-sm font-medium text-slate-900">
                                        {new Date(client.createdAt).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Actions */}
                <div className="sticky bottom-0 bg-slate-50 border-t border-slate-200 px-6 py-4 flex justify-end">
                    <Button
                        variant="primary"
                        onClick={onClose}
                    >
                        Close
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ClientDetailsModal;
