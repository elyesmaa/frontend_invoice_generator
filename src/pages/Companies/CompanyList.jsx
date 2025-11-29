import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCompany } from '../../context/CompanyContext';
import { Plus, Edit, Trash2, Building, AlertCircle } from 'lucide-react';
import GenericModal from '../../components/ui/GenericModal';
import Button from '../../components/ui/Button';

const CompanyList = () => {
    const { companies, loading, fetchCompanies, deleteCompany, switchCompany, currentCompany } = useCompany();
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [companyToDelete, setCompanyToDelete] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchCompanies();
    }, []);

    const handleDeleteClick = (id) => {
        setCompanyToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (companyToDelete) {
            await deleteCompany(companyToDelete);
            setIsDeleteModalOpen(false);
            setCompanyToDelete(null);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <GenericModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Delete Company"
                description="Are you sure you want to delete this company? This action cannot be undone and all associated data (invoices, clients) might be affected."
                icon={AlertCircle}
                confirmText="Delete Company"
                cancelText="Cancel"
                confirmBtnClass="bg-red-600 hover:bg-red-700 text-white"
            />

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-semibold text-slate-900">My Companies</h1>
                    <p className="text-sm text-slate-600 mt-1">Manage your business entities and settings</p>
                </div>
                <Button
                    onClick={() => navigate('/companies/new')}
                    icon={Plus}
                >
                    New Company
                </Button>
            </div>

            {!companies || companies.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-lg shadow-sm border border-slate-200">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Building className="w-8 h-8 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-medium text-slate-900 mb-2">No companies yet</h3>
                    <p className="text-slate-500 mb-6 max-w-md mx-auto">Create your first company to start generating professional invoices and managing your clients.</p>
                    <Button
                        onClick={() => navigate('/companies/new')}
                        icon={Plus}
                    >
                        Create First Company
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {companies.map((company) => {
                        const isActive = currentCompany?._id === company._id;
                        return (
                            <div
                                key={company._id}
                                className={`bg-white rounded-lg border transition-all duration-200 ${isActive
                                    ? 'border-green-500 shadow-md'
                                    : 'border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300'
                                    }`}
                            >
                                <div className="p-5">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg font-bold ${isActive
                                                ? 'bg-green-600 text-white'
                                                : 'bg-slate-100 text-slate-600'
                                                }`}>
                                                {company.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="min-w-0">
                                                <h3 className="font-semibold text-slate-900 text-base truncate">{company.name}</h3>
                                                <p className="text-xs text-slate-500 truncate">{company.email}</p>
                                            </div>
                                        </div>
                                        {isActive && (
                                            <span className="inline-flex items-center px-2 py-0.5 bg-green-50 text-green-700 text-xs font-medium rounded-full border border-green-200">
                                                Active
                                            </span>
                                        )}
                                    </div>

                                    <div className="space-y-2 text-sm text-slate-600 mb-6 bg-slate-50 p-3 rounded-lg">
                                        <div className="flex items-start gap-2">
                                            <span className="text-slate-400 font-medium min-w-[50px] text-xs">Address</span>
                                            <span className="text-slate-900 truncate">{company.address || 'N/A'}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-slate-400 font-medium min-w-[50px] text-xs">Phone</span>
                                            <span className="text-slate-900 truncate">{company.phone || 'N/A'}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-slate-400 font-medium min-w-[50px] text-xs">Tax ID</span>
                                            <span className="text-slate-900 truncate">{company.taxId || 'N/A'}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                                        {isActive ? (
                                            <button
                                                disabled
                                                className="flex-1 py-2 px-4 bg-green-50 text-green-700 text-sm font-medium rounded-lg border border-green-200 cursor-default"
                                            >
                                                ✓ Currently Active
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => switchCompany(company._id)}
                                                className="flex-1 py-2 px-4 bg-gradient-to-r from-blue-950 to-blue-900 hover:from-blue-900 hover:to-blue-800 text-white text-sm font-medium rounded-lg transition-all shadow-sm hover:shadow-md"
                                            >
                                                Switch to this Company
                                            </button>
                                        )}

                                        <div className="flex gap-1">
                                            <button
                                                onClick={() => navigate(`/companies/${company._id}/edit`)}
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                title="Edit Company"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteClick(company._id)}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Delete Company"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default CompanyList;
