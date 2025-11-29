import React, { useEffect, useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Loader2,
  Search,
  FileText,
  Plus,
  AlertCircle,
  Sparkles,
  RotateCcw
} from 'lucide-react';
import { useInvoices } from '../../hooks/useInvoices';
import { invoiceService } from '../../services';
import Button from '../../components/ui/Button';
import CreateWithAIModal from '../../components/invoices/CreateWithAIModal';
import ReminderModal from '../../components/invoices/ReminderModal';
import GenericModal from '../../components/ui/GenericModal';
import InvoicesTable from '../../components/invoices/InvoicesTable';
import Pagination from '../../components/ui/Pagination';
import { showSuccess, showError } from "../../components/ui/Toast";
import CreateInvoice from './CreateInvoice';
import { useCompany } from '../../context/CompanyContext';

const InvoiceList = () => {
  const navigate = useNavigate();
  const { currentCompany } = useCompany();
  const {
    invoices,
    pagination,
    filters,
    loading,
    error,
    statusChangesLoading,
    fetchInvoices,
    updateInvoiceStatus,
    deleteInvoice,
    setState
  } = useInvoices();

  // Modal states
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [invoiceToEdit, setInvoiceToEdit] = useState(null);

  // Fetch invoices when filters change - simple approach like ClientsPage
  useEffect(() => {
    if (currentCompany) {
      fetchInvoices({
        page: pagination.currentPage,
        limit: pagination.itemsPerPage,
        search: filters.search,
        status: filters.status
      });
    }
  }, [pagination.currentPage, pagination.itemsPerPage, filters.search, filters.status, currentCompany]);


  // Handlers
  const handleSearchChange = useCallback((search) => {
    setState(prev => ({
      ...prev,
      filters: { ...prev.filters, search },
      pagination: { ...prev.pagination, currentPage: 1 }
    }));
  }, []);

  const handleStatusFilterChange = useCallback((status) => {
    setState(prev => ({
      ...prev,
      filters: { ...prev.filters, status },
      pagination: { ...prev.pagination, currentPage: 1 }
    }));
  }, []);

  const handleResetFilters = useCallback(() => {
    setState(prev => ({
      ...prev,
      filters: { search: '', status: '' },
      pagination: { ...prev.pagination, currentPage: 1 }
    }));
  }, []);

  const handlePageChange = useCallback((newPage) => {
    setState(prev => ({
      ...prev,
      pagination: { ...prev.pagination, currentPage: newPage }
    }));
  }, []);

  const handleStatusChange = useCallback(async (invoice) => {
    const newStatus = invoice.status === 'Paid' ? 'Unpaid' : 'Paid';
    await updateInvoiceStatus(invoice._id, newStatus);
  }, [updateInvoiceStatus]);

  const handleDeleteClick = useCallback((invoiceId) => {
    setSelectedInvoiceId(invoiceId);
    setIsDeleteModalOpen(true);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (!selectedInvoiceId) return;

    const success = await deleteInvoice(selectedInvoiceId);
    if (success) {
      showSuccess("Invoice deleted successfully");
    }
    setIsDeleteModalOpen(false);
    setSelectedInvoiceId(null);
  }, [selectedInvoiceId, deleteInvoice]);

  const handleEditClick = useCallback(async (invoiceId) => {
    try {
      const data = await invoiceService.getById(invoiceId);
      setInvoiceToEdit(data);
      setIsEditing(true);
    } catch (error) {
      showError("Failed to fetch invoice details");
      console.error(error);
    }
  }, []);

  const handleUpdateInvoice = useCallback(async (formData) => {
    try {
      await invoiceService.update(invoiceToEdit._id, formData);
      showSuccess('Invoice updated successfully');
      setIsEditing(false);
      setInvoiceToEdit(null);
      // Refresh the list
      fetchInvoices({
        page: pagination.currentPage,
        limit: pagination.itemsPerPage,
        search: filters.search,
        status: filters.status
      });
    } catch (error) {
      showError('Failed to update invoice');
      console.error(error);
    }
  }, [invoiceToEdit, fetchInvoices, pagination, filters]);

  const handleReminderClick = useCallback((invoiceId) => {
    setSelectedInvoiceId(invoiceId);
    setIsReminderModalOpen(true);
  }, []);

  // Memoized values
  const pageNumbers = useMemo(() => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, pagination.currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(pagination.totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  }, [pagination.currentPage, pagination.totalPages]);

  // Loading state
  // if (loading && invoices.length === 0) {
  //   return (
  //     <div className="flex justify-center items-center min-h-64">
  //       <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
  //     </div>
  //   );
  // }

  if (isEditing && invoiceToEdit) {
    return (
      <CreateInvoice
        existingInvoice={invoiceToEdit}
        onSave={handleUpdateInvoice}
        onCancel={() => {
          setIsEditing(false);
          setInvoiceToEdit(null);
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Modals */}
      <CreateWithAIModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
      />

      <ReminderModal
        isOpen={isReminderModalOpen}
        onClose={() => setIsReminderModalOpen(false)}
        invoiceId={selectedInvoiceId}
      />

      <GenericModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Invoice"
        icon={AlertCircle}
        description="Are you sure you want to delete this invoice? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        confirmBtnClass="bg-red-600 hover:bg-red-700 text-white"
      />

      {/* Header Section */}
      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
        <div>
          <h1 className='text-2xl font-semibold text-slate-900'>All Invoices</h1>
          <p className='text-sm text-slate-600 mt-1'>
            {pagination.totalItems > 0
              ? `Showing ${invoices.length} of ${pagination.totalItems} invoices`
              : 'No invoices found'
            }
          </p>
        </div>
        <div className='flex items-center gap-2'>
          <Button
            variant='secondary'
            onClick={() => setIsAiModalOpen(true)}
            icon={Sparkles}
          >
            Create With AI
          </Button>
          <Button
            onClick={() => navigate('/invoices/new')}
            icon={Plus}
          >
            Create Invoice
          </Button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className='p-4 rounded-lg bg-red-50 border border-red-200'>
          <div className='flex items-start'>
            <AlertCircle className='w-5 h-5 text-red-600 mt-0.5 mr-3' />
            <div className='flex-1'>
              <h3 className='text-sm font-medium text-red-800 mb-1'>Error</h3>
              <p className='text-sm text-red-700'>{error}</p>
            </div>
          </div>
        </div>
      )}

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
                placeholder='Search by client name, email, or invoice number...'
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
              <option value='paid'>Paid</option>
              <option value='unpaid'>Unpaid</option>
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
        {!loading && invoices.length === 0 ? (

          <div className='flex flex-col items-center justify-center py-12 text-center'>
            <div className='w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4'>
              <FileText className='w-8 h-8 text-slate-400' />
            </div>
            <h3 className='text-lg font-medium text-slate-900 mb-2'>No invoices found</h3>
            <p className='text-slate-500 mb-6 max-w-md'>
              {filters.search || filters.status
                ? 'Try adjusting your search or filter criteria'
                : 'Get started by creating your first invoice'
              }
            </p>
            {!filters.search && !filters.status && (
              <Button onClick={() => navigate('/invoices/new')} icon={Plus}>
                Create First Invoice
              </Button>
            )}
          </div>
        ) : (
          <>
            <InvoicesTable
              invoices={invoices}
              onView={(id) => navigate(`/invoices/${id}`)}
              onEdit={(id) => navigate(`/invoices/${id}/edit`)}
              onDelete={handleDeleteClick}
              onReminder={handleReminderClick}
              onStatusChange={handleStatusChange}
              loading={loading}
            />


            {pagination.totalPages > 1 && (
              <Pagination
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                onPageChange={handlePageChange}
                pageNumbers={pageNumbers}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default InvoiceList;