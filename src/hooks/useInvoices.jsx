import { useState, useCallback } from 'react';
import { invoiceService } from '../services';
import { showError } from '../components/ui/Toast';

export const useInvoices = () => {
  const [state, setState] = useState({
    invoices: [],
    pagination: {
      currentPage: 1,
      totalPages: 1,
      totalItems: 0,
      itemsPerPage: 5
    },
    filters: {
      search: '',
      status: ''
    },
    loading: true,
    error: null,
    statusChangesLoading: null
  });

  const fetchInvoices = useCallback(async (filters = {}) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const startTime = Date.now();  // ← AJOUTER CETTE LIGNE

      const { page = 1, limit = 5, search = '', status = '' } = filters;
      const data = await invoiceService.getAll(page, limit, search, status);

      if (data.success) {
        setState(prev => ({
          ...prev,
          invoices: data.data.invoices || [],
          pagination: data.data.pagination || prev.pagination,
          filters: data.data.filters || prev.filters
        }));
      }


      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, 1000 - elapsedTime);
      await new Promise(resolve => setTimeout(resolve, remainingTime));
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch invoices';
      setState(prev => ({ ...prev, error: errorMessage }));
      showError(errorMessage);
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  }, []);

  const updateInvoiceStatus = useCallback(async (invoiceId, newStatus) => {
    try {
      setState(prev => ({ ...prev, statusChangesLoading: invoiceId }));

      const invoice = state.invoices.find(inv => inv._id === invoiceId);
      if (!invoice) return;

      await invoiceService.update(invoiceId, { ...invoice, status: newStatus });

      setState(prev => ({
        ...prev,
        invoices: prev.invoices.map(inv =>
          inv._id === invoiceId ? { ...inv, status: newStatus } : inv
        )
      }));
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to update invoice status';
      showError(errorMessage);
    } finally {
      setState(prev => ({ ...prev, statusChangesLoading: null }));
    }
  }, [state.invoices]);

  const deleteInvoice = useCallback(async (invoiceId) => {
    try {
      await invoiceService.delete(invoiceId);

      setState(prev => ({
        ...prev,
        invoices: prev.invoices.filter(inv => inv._id !== invoiceId),
        pagination: {
          ...prev.pagination,
          totalItems: prev.pagination.totalItems - 1
        }
      }));

      return true;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to delete invoice';
      showError(errorMessage);
      return false;
    }
  }, []);

  return {
    ...state,
    fetchInvoices,
    updateInvoiceStatus,
    deleteInvoice,
    setState: (updater) => setState(updater)
  };
};