import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Loader2,
    Search,
    Plus,
    AlertCircle,
    RotateCcw,
    FileText,
    Sparkles
} from 'lucide-react';
import { quoteService } from '../../services';
import Button from '../../components/ui/Button';
import GenericModal from '../../components/ui/GenericModal';
import CreateWithAIModal from '../../components/quotes/CreateWithAIModal';
import { showSuccess, showError } from "../../components/ui/Toast";
import { useCompany } from '../../context/CompanyContext';
import { formatCurrency } from '../../utils/currencyUtils';
import Pagination from '../../components/ui/Pagination';
import QuotesTable from '../../components/quotes/QuotesTable';

const QuoteList = () => {
    const navigate = useNavigate();
    const { currentCompany } = useCompany();

    const [quotes, setQuotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        itemsPerPage: 5
    });
    const [filters, setFilters] = useState({
        search: '',
        status: ''
    });
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isAiModalOpen, setIsAiModalOpen] = useState(false);
    const [selectedQuoteId, setSelectedQuoteId] = useState(null);

    // Fetch quotes
    const fetchQuotes = useCallback(async () => {
        if (!currentCompany) return;

        try {
            setLoading(true);
            const response = await quoteService.getAll(
                pagination.currentPage,
                pagination.itemsPerPage,
                filters.search,
                filters.status
            );

            setQuotes(response.data.quotes || []);
            setPagination(response.data.pagination);
        } catch (error) {
            showError('Failed to fetch estimates');
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, [currentCompany, pagination.currentPage, pagination.itemsPerPage, filters.search, filters.status]);

    useEffect(() => {
        fetchQuotes();
    }, [fetchQuotes]);

    // Handlers
    const handleSearchChange = (search) => {
        setFilters(prev => ({ ...prev, search }));
        setPagination(prev => ({ ...prev, currentPage: 1 }));
    };

    const handleStatusFilterChange = (status) => {
        setFilters(prev => ({ ...prev, status }));
        setPagination(prev => ({ ...prev, currentPage: 1 }));
    };

    const handleResetFilters = () => {
        setFilters({ search: '', status: '' });
        setPagination(prev => ({ ...prev, currentPage: 1 }));
    };

    const handleDeleteClick = (quoteId) => {
        setSelectedQuoteId(quoteId);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!selectedQuoteId) return;

        try {
            await quoteService.delete(selectedQuoteId);
            showSuccess("Estimate deleted successfully");
            fetchQuotes();
        } catch (error) {
            showError("Failed to delete estimate");
            console.error(error);
        } finally {
            setIsDeleteModalOpen(false);
            setSelectedQuoteId(null);
        }
    };

    const handleClone = async (quoteId) => {
        try {
            await quoteService.clone(quoteId);
            showSuccess('Estimate cloned successfully!');
            fetchQuotes();
        } catch (error) {
            showError('Failed to clone estimate');
        }
    };

    const handlePageChange = (newPage) => {
        setPagination(prev => ({ ...prev, currentPage: newPage }));
    };

    const pageNumbers = useMemo(() => {
        const pages = [];
        const maxPagesToShow = 5;
        let startPage = Math.max(1, pagination.currentPage - Math.floor(maxPagesToShow / 2));
        let endPage = Math.min(pagination.totalPages, startPage + maxPagesToShow - 1);

        if (endPage - startPage + 1 < maxPagesToShow) {
            startPage = Math.max(1, endPage - maxPagesToShow + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }
        return pages;
    }, [pagination.currentPage, pagination.totalPages]);



    return (
        <div className="space-y-6">
            {/* Modals */}
            <CreateWithAIModal
                isOpen={isAiModalOpen}
                onClose={() => setIsAiModalOpen(false)}
            />

            {/* Delete Modal */}
            <GenericModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Delete Estimate"
                icon={AlertCircle}
                description="Are you sure you want to delete this estimate? This action cannot be undone."
                confirmText="Delete"
                cancelText="Cancel"
                confirmBtnClass="bg-red-600 hover:bg-red-700 text-white"
            />

            {/* Header Section */}
            <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
                <div>
                    <h1 className='text-2xl font-semibold text-slate-900'>Estimates</h1>
                    <p className='text-sm text-slate-600 mt-1'>
                        {pagination.totalItems > 0
                            ? `Showing ${quotes.length} of ${pagination.totalItems} estimates`
                            : 'No estimates found'
                        }
                    </p>
                </div>
                <div className='flex gap-3'>
                    <Button
                        onClick={() => setIsAiModalOpen(true)}
                        icon={Sparkles}
                        variant="secondary"
                    >
                        Create with AI
                    </Button>
                    <Button
                        onClick={() => navigate('/quotes/new')}
                        icon={Plus}
                    >
                        Create Estimate
                    </Button>
                </div>
            </div>

            {/* Main Content Card */}
            <div className='bg-white border border-slate-200 rounded-lg shadow-sm'>
                {/* Search & Filter Section */}
                <div className='p-4 sm:p-6 border-b border-slate-200'>
                    <div className='flex flex-col sm:flex-row gap-4'>
                        <div className='relative grow'>
                            <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                                <Search className='w-5 h-5 text-slate-400' />
                            </div>
                            <input
                                type="text"
                                placeholder='Search by client name, email, or estimate number...'
                                className='w-full h-10 pl-10 pr-4 border border-slate-200 rounded-lg bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                                value={filters.search}
                                onChange={(e) => handleSearchChange(e.target.value)}
                            />
                        </div>

                        <select
                            className='shrink-0 h-10 px-3 border border-slate-200 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                            value={filters.status}
                            onChange={(e) => handleStatusFilterChange(e.target.value)}
                        >
                            <option value=''>All Status</option>
                            <option value='draft'>Draft</option>
                            <option value='sent'>Sent</option>
                            <option value='accepted'>Accepted</option>
                            <option value='rejected'>Rejected</option>
                            <option value='converted'>Converted</option>
                        </select>

                        {(filters.search || filters.status) && (
                            <Button
                                variant='secondary'
                                onClick={handleResetFilters}
                                icon={RotateCcw}
                                className='shrink-0'
                            >
                                Reset
                            </Button>
                        )}
                    </div>
                </div>

                {/* Table Section */}
                {/* Table Section */}
                {!loading && quotes.length === 0 ? (
                    <div className='flex flex-col items-center justify-center py-12 text-center'>
                        <div className='w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4'>
                            <FileText className='w-8 h-8 text-slate-400' />
                        </div>
                        <h3 className='text-lg font-medium text-slate-900 mb-2'>No estimates found</h3>
                        <p className='text-slate-500 mb-6 max-w-md'>
                            {filters.search || filters.status
                                ? 'Try adjusting your search or filter criteria'
                                : 'Get started by creating your first estimate'
                            }
                        </p>
                        {!filters.search && !filters.status && (
                            <Button onClick={() => navigate('/quotes/new')} icon={Plus}>
                                Create First Estimate
                            </Button>
                        )}
                    </div>
                ) : (
                    <>
                        <QuotesTable
                            quotes={quotes}
                            onView={(id) => navigate(`/quotes/${id}`)}
                            onEdit={(id) => navigate(`/quotes/${id}/edit`)}
                            onDelete={handleDeleteClick}
                            onClone={handleClone}
                            loading={loading}
                        />

                        {/* Pagination */}
                        {pagination.totalPages > 1 && (
                            <div className="px-6 py-4 border-t border-slate-200">
                                <Pagination
                                    currentPage={pagination.currentPage}
                                    totalPages={pagination.totalPages}
                                    onPageChange={handlePageChange}
                                    pageNumbers={pageNumbers}
                                />
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default QuoteList;
