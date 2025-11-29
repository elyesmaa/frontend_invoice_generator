import React, { useEffect } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useCompany } from '../../context/CompanyContext';
import toast from 'react-hot-toast';

const RequireCompanyComplete = ({ children }) => {
    const { currentCompany, loading, companies } = useCompany();
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        // Only enforce strict redirection if it's the user's only company (onboarding)
        const isFirstCompany = companies && companies.length === 1;

        if (!loading && currentCompany && !currentCompany.isComplete && isFirstCompany) {
            toast.error("Please complete your company profile first", {
                id: 'company-incomplete-error' // Prevent duplicate toasts
            });
        }
    }, [loading, currentCompany, companies]);

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    // Only enforce strict redirection if it's the user's only company (onboarding)
    const isFirstCompany = companies && companies.length === 1;

    if (currentCompany && !currentCompany.isComplete && isFirstCompany) {
        // Redirect to company edit page
        return <Navigate to={`/companies/${currentCompany._id}/edit`} state={{ from: location }} replace />;
    }

    return children;
};

export default RequireCompanyComplete;
