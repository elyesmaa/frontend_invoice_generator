import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ChevronDown, User } from 'lucide-react';
import { clientService } from '../../services';
import useDebounce from '../../hooks/useDebounce';

const ClientSelector = ({ onSelect, onClear, selectedClient }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(false);
    const dropdownRef = useRef(null);

    const debouncedSearch = useDebounce(searchTerm, 300);

    useEffect(() => {
        const fetchClients = async () => {
            setLoading(true);
            try {
                // Fetch first 5 clients matching search
                const response = await clientService.getAll(1, 5, '', debouncedSearch);
                setClients(response.data || []);
            } catch (error) {
                console.error('Error fetching clients:', error);
            } finally {
                setLoading(false);
            }
        };

        if (isOpen) {
            fetchClients();
        }
    }, [debouncedSearch, isOpen]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (client) => {
        onSelect(client);
        setIsOpen(false);
        setSearchTerm('');
    };

    const handleClear = (e) => {
        e.stopPropagation();
        onClear();
        setSearchTerm('');
    };

    return (
        <div className="relative mb-4" ref={dropdownRef}>
            <label className="block text-sm font-medium text-slate-700 mb-2">
                Select Existing Client
            </label>

            {!selectedClient ? (
                <div className="relative">
                    <div
                        className="w-full h-10 px-3 py-2 border border-slate-300 rounded-lg bg-white flex items-center justify-between cursor-pointer hover:border-blue-500 transition-colors"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        <span className="text-slate-500 text-sm">
                            {isOpen ? 'Type to search...' : 'Search for a client...'}
                        </span>
                        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                    </div>

                    {isOpen && (
                        <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg overflow-hidden">
                            <div className="p-2 border-b border-slate-100">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <input
                                        type="text"
                                        className="w-full pl-9 pr-3 py-1.5 text-sm border border-slate-200 rounded-md focus:outline-none focus:border-blue-500"
                                        placeholder="Search clients..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        autoFocus
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                </div>
                            </div>

                            <div className="max-h-60 overflow-y-auto">
                                {loading ? (
                                    <div className="p-4 text-center text-sm text-slate-500">Loading...</div>
                                ) : clients.length > 0 ? (
                                    clients.map((client) => (
                                        <div
                                            key={client._id}
                                            className="px-4 py-3 hover:bg-slate-50 cursor-pointer flex items-center gap-3 transition-colors"
                                            onClick={() => handleSelect(client)}
                                        >
                                            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                                                <User className="w-4 h-4 text-blue-600" />
                                            </div>
                                            <div>
                                                <div className="text-sm font-medium text-slate-900">{client.name}</div>
                                                <div className="text-xs text-slate-500">{client.email}</div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-4 text-center text-sm text-slate-500">
                                        No clients found
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <div className="relative">
                    <div className="w-full p-3 border border-blue-200 bg-blue-50 rounded-lg flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                                <User className="w-4 h-4 text-blue-600" />
                            </div>
                            <div>
                                <div className="text-sm font-medium text-blue-900">{selectedClient.name}</div>
                                <div className="text-xs text-blue-700">Selected Client</div>
                            </div>
                        </div>
                        <button
                            onClick={handleClear}
                            className="p-1 hover:bg-blue-100 rounded-full transition-colors"
                            title="Clear selection"
                        >
                            <X className="w-4 h-4 text-blue-600" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ClientSelector;
