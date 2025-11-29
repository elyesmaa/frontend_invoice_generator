import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, FileText, ArrowRight, Loader2, Edit, Copy, Printer, Mail } from 'lucide-react';
import Button from '../../components/ui/Button';
import { quoteService } from '../../services';
import { showSuccess, showError } from '../../components/ui/Toast';
import { useCompany } from '../../context/CompanyContext';
import { formatCurrency } from '../../utils/currencyUtils';
import InvoiceTemplate from '../../components/invoices/templates/InvoiceTemplate';
import ReminderModal from '../../components/quotes/ReminderModal';

const QuoteDetails = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { currentCompany } = useCompany();
    const [quote, setQuote] = useState(null);
    const [loading, setLoading] = useState(true);
    const [converting, setConverting] = useState(false);
    const [cloning, setCloning] = useState(false);
    const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);

    useEffect(() => {
        const fetchQuote = async () => {
            try {
                const data = await quoteService.getById(id);
                setQuote(data);
            } catch (error) {
                showError('Failed to fetch estimate details');
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchQuote();
    }, [id]);

    const handleConvertToInvoice = async () => {
        try {
            setConverting(true);
            const result = await quoteService.convertToInvoice(id);
            showSuccess('Estimate converted to invoice successfully!');
            // Navigate to the new invoice
            navigate(`/invoices/${result.invoice._id}`);
        } catch (error) {
            showError(error.response?.data?.message || 'Failed to convert estimate');
            console.error(error);
        } finally {
            setConverting(false);
        }
    };

    const handleClone = async () => {
        try {
            setCloning(true);
            const result = await quoteService.clone(id);
            showSuccess('Estimate cloned successfully!');
            // Navigate to the new cloned estimate
            navigate(`/quotes/${result.data._id}`);
        } catch (error) {
            showError(error.response?.data?.message || 'Failed to clone estimate');
            console.error(error);
        } finally {
            setCloning(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-64">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        );
    }

    if (!quote) {
        return (
            <div className="text-center py-12">
                <p className="text-slate-600">Estimate not found</p>
                <Button onClick={() => navigate('/quotes')} className="mt-4">
                    Back to Estimates
                </Button>
            </div>
        );
    }

    const getStatusBadgeClass = (status) => {
        const statusMap = {
            'Draft': 'bg-gray-100 text-gray-800',
            'Sent': 'bg-blue-100 text-blue-800',
            'Accepted': 'bg-green-100 text-green-800',
            'Rejected': 'bg-red-100 text-red-800',
            'Converted': 'bg-purple-100 text-purple-800'
        };
        return statusMap[status] || 'bg-gray-100 text-gray-800';
    };


    return (
        <div className="space-y-6">
            {/* Reminder Modal */}
            <ReminderModal
                isOpen={isReminderModalOpen}
                onClose={() => setIsReminderModalOpen(false)}
                quoteId={id}
            />
            {/* Back Button - Separate Line */}
            <div className="print:hidden">
                <Button
                    variant="ghost"
                    icon={ArrowLeft}
                    onClick={() => navigate('/quotes')}
                >
                    Back
                </Button>
            </div>

            {/* Header with Title and Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 print:hidden">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Estimate {quote.quoteNumber}</h1>
                    <p className="text-slate-600 mt-1">Estimate details</p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    {quote.status !== 'Converted' && quote.status !== 'Rejected' && (
                        <Button
                            variant="secondary"
                            onClick={() => setIsReminderModalOpen(true)}
                            icon={Mail}
                        >
                            Send Reminder
                        </Button>
                    )}
                    <Button
                        variant="secondary"
                        onClick={() => navigate(`/quotes/${id}/edit`)}
                        icon={Edit}
                    >
                        Edit
                    </Button>
                    <Button
                        variant="secondary"
                        onClick={handleClone}
                        disabled={cloning}
                        icon={cloning ? Loader2 : Copy}
                    >
                        {cloning ? 'Cloning...' : 'Clone'}
                    </Button>
                    <Button
                        variant="secondary"
                        onClick={() => window.print()}
                        icon={Printer}
                    >
                        Print
                    </Button>
                </div>
            </div>

            {/* Convert to Invoice Call-to-Action */}
            {quote.status !== 'Converted' && (
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-6 print:hidden">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="text-center sm:text-left">
                            <h3 className="text-lg font-semibold text-slate-900 mb-1">
                                Ready to convert this estimate?
                            </h3>
                            <p className="text-sm text-slate-600">
                                Transform this estimate into an invoice with one click
                            </p>
                        </div>
                        <Button
                            onClick={handleConvertToInvoice}
                            disabled={converting}
                            className={`bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 flex items-center gap-2 ${converting ? 'animate-pulse' : ''}`}
                        >
                            {converting ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    <span>Converting...</span>
                                </>
                            ) : (
                                <>
                                    <span>Convert to Invoice</span>
                                    <ArrowRight className="w-5 h-5" />
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            )}

            {/* Quote Details Card */}
            <div className='' id='invoice-content-wrapper'>
                <div id='invoice-preview'>
                    <InvoiceTemplate
                        invoice={quote}
                        currency={currentCompany?.currency}
                        colorVariant={currentCompany?.invoiceTemplate || 'blue'}
                        title="ESTIMATE"
                        dateLabels={{ date: 'Estimate Date', dueDate: 'Expiration Date' }}
                    />
                </div>
            </div>

            <style>
                {`
                  @page {
                    margin: 0.5cm;
                    size: A4;
                  }

                  @media print {
                    body * {
                      visibility: hidden;
                    }

                    #invoice-content-wrapper,
                    #invoice-content-wrapper * {
                      visibility: visible;
                    }

                    #invoice-content-wrapper {
                      position: absolute;
                      top: 0;
                      left: 0;
                      right: 0;
                      width: 100%;
                    }

                    #invoice-preview {
                      box-shadow: none;
                      border: none;
                      border-radius: 0;
                      padding: 0;
                    }
                  }
                `}
            </style>
        </div>
    );
};

export default QuoteDetails;
