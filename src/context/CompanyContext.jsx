import { createContext, useState, useContext, useEffect } from "react";
import { companyService } from "../services";
import { useAuth } from "./AuthContext";
import toast from "react-hot-toast";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";

const CompanyContext = createContext();

export const useCompany = () => {
    const context = useContext(CompanyContext);
    if (!context) {
        throw new Error("useCompany must be used within a CompanyProvider");
    }
    return context;
};

export const CompanyProvider = ({ children }) => {
    const { user, updateUser } = useAuth();
    const [companies, setCompanies] = useState([]);
    const [currentCompany, setCurrentCompany] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            fetchCompanies();
            if (user.currentCompany) {
                setCurrentCompany(user.currentCompany);
            }
        } else {
            setCompanies([]);
            setCurrentCompany(null);
        }
    }, [user]);

    const fetchCompanies = async () => {
        try {
            setLoading(true);
            const response = await companyService.getAll();
            console.log('response companies', response);
            setCompanies(response.data);

            // If user has no currentCompany but has companies, set the first one as default
            if (user && !user.currentCompany && response.data.length > 0) {
                // Pass the company object directly to avoid state race condition
                switchCompany(response.data[0]._id, response.data[0]);
            }
        } catch (error) {
            console.error("Failed to fetch companies", error);
            toast.error("Failed to load companies");
        } finally {
            setLoading(false);
        }
    };

    const addCompany = async (companyData) => {
        try {
            const response = await companyService.create(companyData);
            const newCompany = response.data;
            setCompanies([...(companies || []), newCompany]);

            // If it's the first company, switch to it
            if (!companies || companies.length === 0) {
                switchCompany(newCompany._id, newCompany);
            }

            toast.success("Company added successfully");
            return newCompany;
        } catch (error) {
            console.error("Failed to add company", error);
            toast.error(error.response?.data?.message || "Failed to add company");
            throw error;
        }
    };

    const updateCompany = async (id, companyData) => {
        try {
            const response = await companyService.update(id, companyData);
            const updatedCompany = response.data;

            setCompanies((companies || []).map(c => c._id === id ? updatedCompany : c));

            if (currentCompany && currentCompany._id === id) {
                setCurrentCompany(updatedCompany);
                // Also update user context if needed
                updateUser({ currentCompany: updatedCompany });
            }

            toast.success("Company updated successfully");
            return updatedCompany;
        } catch (error) {
            console.error("Failed to update company", error);
            toast.error(error.response?.data?.message || "Failed to update company");
            throw error;
        }
    };

    const deleteCompany = async (id) => {
        try {
            await companyService.delete(id);
            setCompanies((companies || []).filter(c => c._id !== id));

            if (currentCompany && currentCompany._id === id) {
                setCurrentCompany(null);
                // Switch to another company if available
                const remaining = (companies || []).filter(c => c._id !== id);
                if (remaining.length > 0) {
                    switchCompany(remaining[0]._id, remaining[0]);
                } else {
                    updateUser({ currentCompany: null });
                }
            }

            toast.success("Company deleted successfully");
        } catch (error) {
            console.error("Failed to delete company", error);
            toast.error(error.response?.data?.message || "Failed to delete company");
            throw error;
        }
    };

    const switchCompany = async (companyId, targetCompany = null) => {
        try {
            // Find company in local list to set immediately, or use provided object
            const company = targetCompany || (companies || []).find(c => c._id === companyId);

            if (!company) {
                console.error("Company not found for switching", companyId);
                return;
            }

            // Update backend user profile
            await axiosInstance.put(API_PATHS.AUTH.UPDATE_PROFILE, { currentCompany: companyId });

            // Update local state
            setCurrentCompany(company);
            updateUser({ currentCompany: company });

            toast.success(`Switched to ${company?.name || 'company'}`);
        } catch (error) {
            console.error("Failed to switch company", error);
            toast.error("Failed to switch company");
        }
    };

    const value = {
        companies,
        currentCompany,
        loading,
        fetchCompanies,
        addCompany,
        updateCompany,
        deleteCompany,
        switchCompany
    };

    return (
        <CompanyContext.Provider value={value}>
            {children}
        </CompanyContext.Provider>
    );
};
