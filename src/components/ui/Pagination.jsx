import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Button from './Button';

const Pagination = ({ currentPage, totalPages, onPageChange, pageNumbers }) => (
    <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 border-t border-slate-200 bg-slate-50">
        <div className="text-sm text-slate-600 mb-4 sm:mb-0">
            Showing page <span className="font-semibold">{currentPage}</span> of{' '}
            <span className="font-semibold">{totalPages}</span>
        </div>

        <div className="flex items-center gap-2">
            <Button
                variant="secondary"
                size="small"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed min-w-[100px] rounded-lg"
            >
                <ChevronLeft className="w-4 h-4" />
                Previous
            </Button>

            <div className="flex items-center gap-1 mx-2">
                {pageNumbers.map(page => (
                    <button
                        key={page}
                        onClick={() => onPageChange(page)}
                        className={`w-8 h-8 flex items-center justify-center text-sm font-medium rounded-lg transition-all duration-200 ${currentPage === page
                                ? 'bg-gradient-to-r from-blue-950 to-blue-900 text-white shadow-sm'
                                : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50'
                            }`}
                    >
                        {page}
                    </button>
                ))}
            </div>

            <Button
                variant="secondary"
                size="small"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed min-w-[100px] rounded-lg"
            >
                Next
                <ChevronRight className="w-4 h-4" />
            </Button>
        </div>
    </div>
);

export default Pagination;
