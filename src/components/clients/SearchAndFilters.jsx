import React from 'react';
import { Search, X } from 'lucide-react';
import Button from '../ui/Button';

const SearchAndFilters = ({ search, setSearch, clientType, setClientType, onReset }) => {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Search Input */}
                <div className="md:col-span-2">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search by name, email, phone, address..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                    </div>
                </div>

                {/* Client Type Filter */}
                <div className="flex gap-2">
                    <select
                        value={clientType}
                        onChange={(e) => setClientType(e.target.value)}
                        className="flex-1 px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    >
                        <option value="">All Types</option>
                        <option value="individual">Individual</option>
                        <option value="company">Company</option>
                    </select>

                    {/* Reset Button */}
                    {(search || clientType) && (
                        <Button
                            variant="outline"
                            onClick={onReset}
                            icon={X}
                            className="px-4"
                        >
                            Reset
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SearchAndFilters;
