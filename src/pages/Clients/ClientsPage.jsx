import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Plus, Trash2 } from 'lucide-react';
import { clientService } from '../../services';
import Button from '../../components/ui/Button';
import Pagination from '../../components/ui/Pagination';
import StatCards from '../../components/clients/StatCards';
import SearchAndFilters from '../../components/clients/SearchAndFilters';
import ClientsTable from '../../components/clients/ClientsTable';
import ClientDetailsModal from '../../components/clients/ClientDetailsModal';
import GenericModal from '../../components/ui/GenericModal';

import { useCompany } from '../../context/CompanyContext';

const ClientsPage = () => {
    const navigate = useNavigate();
    const { currentCompany } = useCompany();
    const [clients, setClients] = useState([]);
    const [statistics, setStatistics] = useState(null);
    const [pagination, setPagination] = useState(null);
    const [loading, setLoading] = useState(true);

    // Modal state
    const [selectedClient, setSelectedClient] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [clientToDelete, setClientToDelete] = useState(null);

    // Filters
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState('');
    const [clientType, setClientType] = useState('');
    const limit = 5;

    // Fetch clients
    const fetchClients = async () => {
        try {
            setLoading(true);
            const response = await clientService.getAll(currentPage, limit, clientType, search);

            setClients(response.data || []);
            setStatistics(response.statistics);
            setPagination(response.pagination);
        } catch (error) {
            console.error('Error fetching clients:', error);
            toast.error('Failed to load clients');
        } finally {
            setLoading(false);
        }
    };

    // Fetch clients when filters change
    useEffect(() => {
        if (currentCompany) {
            fetchClients();
        }
    }, [currentPage, clientType, search, currentCompany]);

    // Reset filters
    const handleReset = () => {
        setSearch('');
        setClientType('');
        setCurrentPage(1);
    };

    // Handle view client
    const handleView = async (id) => {
        try {
            const response = await clientService.getById(id);


            // Extract client data - response is already the data object
            const clientData = response.client || response;


            setSelectedClient(clientData);
            setIsModalOpen(true);
        } catch (error) {
            console.error('Error fetching client:', error);
            toast.error('Failed to load client details');
        }
    };

    // Handle edit client
    const handleEdit = (id) => {
        navigate(`/clients/${id}/edit`);
    };

    // Handle delete client
    const handleDelete = (id) => {
        setClientToDelete(id);
        setIsDeleteModalOpen(true);
    };

    // Confirm delete
    const confirmDelete = async () => {
        if (!clientToDelete) return;

        try {
            await clientService.delete(clientToDelete);
            toast.success('Client deleted successfully');
            setIsDeleteModalOpen(false);
            setClientToDelete(null);
            fetchClients();
        } catch (error) {
            console.error('Error deleting client:', error);
            toast.error('Failed to delete client');
        }
    };

    // Handle create client
    const handleCreate = () => {
        navigate('/clients/new');
    };

    // Memoized page numbers for pagination
    const pageNumbers = useMemo(() => {
        if (!pagination) return [];
        const pages = [];
        const maxVisiblePages = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(pagination.totalPages, startPage + maxVisiblePages - 1);

        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }

        return pages;
    }, [currentPage, pagination]);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Clients</h1>
                    <p className="text-slate-600 mt-1">Manage your clients and their information</p>
                </div>
                <Button
                    variant="primary"
                    icon={Plus}
                    onClick={handleCreate}
                >
                    New Client
                </Button>
            </div>

            {/* Statistics Cards */}
            <StatCards statistics={statistics} />

            {/* Search and Filters */}
            <SearchAndFilters
                search={search}
                setSearch={setSearch}
                clientType={clientType}
                setClientType={setClientType}
                onReset={handleReset}
            />

            {/* Clients Table */}
            <ClientsTable
                clients={clients}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDelete}
                loading={loading}
            />

            {/* Client Details Modal */}
            <ClientDetailsModal
                isOpen={isModalOpen}
                client={selectedClient}
                onClose={() => setIsModalOpen(false)}
            />

            {/* Delete Confirmation Modal */}
            <GenericModal
                isOpen={isDeleteModalOpen}
                title="Delete Client"
                description="Are you sure you want to delete this client? This action cannot be undone."
                icon={Trash2}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                confirmText="Delete"
                cancelText="Cancel"
                confirmBtnClass="bg-red-600 hover:bg-red-700 text-white"
            />

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={pagination.totalPages}
                    onPageChange={setCurrentPage}
                    pageNumbers={pageNumbers}
                />
            )}
        </div>
    );
};

export default ClientsPage;
