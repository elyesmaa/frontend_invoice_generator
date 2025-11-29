import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Loader2, AlertCircle, Mail, Edit, Printer } from 'lucide-react';
import { invoiceService } from '../../services';
import Button from '../../components/ui/Button';
import ReminderModal from '../../components/invoices/ReminderModal';
import { useCompany } from '../../context/CompanyContext';
import InvoiceTemplate from '../../components/invoices/templates/InvoiceTemplate';

const InvoiceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);
  const invoiceRef = useRef();
  const { currentCompany } = useCompany();

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        setLoading(true);
        const data = await invoiceService.getById(id);
        setInvoice(data);
      } catch (error) {
        console.error('Error fetching invoice:', error);
        toast.error('Failed to load invoice details');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchInvoice();
    }
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className='flex justify-center items-center h-96'>
        <Loader2 className='w-8 h-8 animate-spin text-blue-600' />
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className='flex flex-col items-center justify-center py-12 text-center bg-slate-50 rounded-lg'>
        <div className='w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4'>
          <AlertCircle className='w-8 h-8 text-red-600' />
        </div>
        <h3 className='text-lg font-medium text-slate-900 mb-2'>Invoice not found</h3>
        <p className='text-slate-500 mb-4 max-w-md'>
          The invoice you are looking for does not exist or could not be loaded
        </p>
        <Button onClick={() => navigate('/invoices')} variant='primary'>
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <>
      <ReminderModal
        isOpen={isReminderModalOpen}
        onClose={() => setIsReminderModalOpen(false)}
        invoiceId={id}
      />

      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 print:hidden'>
        <h1 className='text-2xl font-semibold text-slate-900 mb-4 sm:mb-0'>
          Invoice <span className='font-mono text-slate-500'>{invoice.invoiceNumber}</span>
        </h1>
        <div className='flex items-center gap-2'>
          {invoice.status !== 'Paid' && (
            <Button
              variant='secondary'
              onClick={() => setIsReminderModalOpen(true)}
              icon={Mail}
            >
              Generate Reminder
            </Button>
          )}
          <Button
            variant='secondary'
            onClick={() => navigate(`/invoices/${id}/edit`)}
            icon={Edit}
          >
            Edit
          </Button>
          <Button
            variant='secondary'
            onClick={handlePrint}
            icon={Printer}
          >
            Print or Download
          </Button>
        </div>
      </div>

      <div className='' id='invoice-content-wrapper'>
        <div
          ref={invoiceRef}
          id='invoice-preview'
        >
          <InvoiceTemplate
            invoice={invoice}
            currency={currentCompany?.currency}
            colorVariant={currentCompany?.invoiceTemplate || 'blue'}
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
    </>
  );
};

export default InvoiceDetails;