import React from 'react';
import { AlertCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCompany } from '../../context/CompanyContext';

/**
 * Banner component that displays a warning when company information is incomplete
 * Shows on pages where complete company info is required (invoices, clients, etc.)
 */
const IncompleteCompanyBanner = () => {
    const { currentCompany, companies } = useCompany();

    // Don't show banner if no company or company is complete
    // Also don't show if user has multiple companies (only enforce for first-time onboarding)
    if (!currentCompany || currentCompany.isComplete || (companies && companies.length > 1)) {
        return null;
    }

    return (
        <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mb-6 rounded-r-lg">
            <div className="flex items-start">
                <div className="flex-shrink-0">
                    <AlertCircle className="h-5 w-5 text-amber-400" />
                </div>
                <div className="ml-3 flex-1">
                    <h3 className="text-sm font-medium text-amber-800">
                        Complete Your Company Information
                    </h3>
                    <div className="mt-2 text-sm text-amber-700">
                        <p>
                            Please complete your company information before creating invoices or clients.
                            This ensures all your documents have the correct business details.
                        </p>
                    </div>
                    <div className="mt-4">
                        <Link
                            to={`/companies/${currentCompany._id}/edit`}
                            className="inline-flex items-center px-4 py-2 bg-amber-600 text-white text-sm font-medium rounded-lg hover:bg-amber-700 transition-colors"
                        >
                            Complete Company Info
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default IncompleteCompanyBanner;
