import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Building2, Plus, Check } from 'lucide-react';
import { useCompany } from '../../context/CompanyContext';
import { Link } from 'react-router-dom';

const CompanySwitcher = ({ isCollapsed }) => {
    const { companies, currentCompany, switchCompany } = useCompany();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    if (!currentCompany) return null;

    return (
        <div className="relative px-4 mb-4" ref={dropdownRef}>
            <button
                onClick={() => !isCollapsed && setIsOpen(!isOpen)}
                className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'
                    } p-2 rounded-xl transition-all duration-200 border ${isOpen
                        ? 'bg-white border-blue-200 shadow-sm ring-1 ring-blue-100'
                        : 'bg-white border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                    }`}
            >
                <div className="flex items-center overflow-hidden">
                    <div className="min-w-[32px] h-8 w-8 bg-primary-100 rounded-lg flex items-center justify-center text-primary-700 font-bold">
                        {currentCompany.name.charAt(0).toUpperCase()}
                    </div>
                    {!isCollapsed && (
                        <div className="ml-3 text-left truncate">
                            <p className="text-sm font-medium text-gray-900 truncate">
                                {currentCompany.name}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                                {currentCompany.taxId}
                            </p>
                        </div>
                    )}
                </div>
                {!isCollapsed && <ChevronDown className="w-4 h-4 text-gray-400" />}
            </button>

            {isOpen && !isCollapsed && (
                <div className="absolute top-full left-4 right-4 mt-1 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-50">
                    <div className="max-h-60 overflow-y-auto">
                        {(companies || []).map((company) => (
                            <button
                                key={company._id}
                                onClick={() => {
                                    switchCompany(company._id);
                                    setIsOpen(false);
                                }}
                                className="w-full flex items-center justify-between px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                            >
                                <div className="flex items-center truncate">
                                    <Building2 className="w-4 h-4 mr-2 text-gray-400" />
                                    <span className="truncate">{company.name}</span>
                                </div>
                                {currentCompany._id === company._id && (
                                    <Check className="w-3 h-3 text-primary-600" />
                                )}
                            </button>
                        ))}
                    </div>
                    <div className="border-t border-gray-100 mt-1 pt-1">
                        <Link
                            to="/companies/new"
                            onClick={() => setIsOpen(false)}
                            className="flex items-center px-3 py-2 text-sm text-primary-600 hover:bg-primary-50"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Add Company
                        </Link>
                        <Link
                            to="/companies"
                            onClick={() => setIsOpen(false)}
                            className="flex items-center px-3 py-2 text-sm text-gray-600 hover:bg-gray-50"
                        >
                            <Building2 className="w-4 h-4 mr-2" />
                            Manage Companies
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CompanySwitcher;
