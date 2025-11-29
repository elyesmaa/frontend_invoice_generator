import React, { useState, useEffect } from 'react';
import { Loader2, Mail, Copy, Check, CircleX } from 'lucide-react';
import Button from '../ui/Button';
import TextareaField from '../ui/TextareaField';
import { quoteService } from '../../services';
import toast from 'react-hot-toast';

const ReminderModal = ({ isOpen, onClose, quoteId }) => {
    const [reminderText, setReminderText] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [hasCopied, setHasCopied] = useState(false);

    // Reset state when modal closes or opens
    useEffect(() => {
        if (!isOpen) {
            setReminderText('');
            setIsLoading(true);
        }
    }, [isOpen]);

    useEffect(() => {
        if (isOpen && quoteId) {
            const generateReminder = async () => {
                setIsLoading(true);
                setReminderText('');
                try {
                    const data = await quoteService.generateReminder(quoteId);
                    setReminderText(data.reminderText);
                } catch (error) {
                    toast.error("Failed to generate reminder email");
                    console.error(error);
                    onClose();
                } finally {
                    setIsLoading(false);
                }
            };
            generateReminder();
        }
    }, [isOpen, quoteId, onClose]);

    const handleCopyToClipboard = () => {
        navigator.clipboard.writeText(reminderText);
        setHasCopied(true);
        toast.success('Copied to clipboard');
        setTimeout(() => {
            setHasCopied(false);
        }, 2000);
    };

    if (!isOpen) return null;

    return (
        <div className='fixed inset-0 z-50 overflow-y-auto'>
            <div className='flex items-center justify-center min-h-screen px-4 text-center'>
                <div className='fixed inset-0 bg-black/10 bg-opacity-50 transition-opacity' onClick={onClose}></div>
                <div className='bg-white rounded-lg shadow-xl max-w-lg w-full p-6 relative text-left transform transition-all'>
                    <div className='flex items-center justify-between mb-4'>
                        <h3 className='text-lg font-semibold text-slate-900 flex items-center'>
                            <Mail className='w-5 h-5 mr-2 text-blue-600' />
                            AI-Generated Reminder
                        </h3>
                        <button className='text-slate-400 hover:text-slate-600' onClick={onClose}>
                            <CircleX />
                        </button>
                    </div>
                    {isLoading ? (
                        <div className="p-12 text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                            <p className="mt-4 text-slate-600">Generating reminder...</p>
                        </div>
                    ) : (
                        <div className='space-y-4'>
                            <TextareaField
                                name="reminderText"
                                value={reminderText}
                                readOnly
                                rows={10}
                            />
                        </div>
                    )}
                    <div className='flex justify-end space-x-3 mt-6'>
                        <Button variant='secondary' onClick={onClose}>Close</Button>
                        <Button
                            onClick={handleCopyToClipboard}
                            variant='primary'
                            icon={hasCopied ? Check : Copy}
                            disabled={isLoading}
                        >
                            {hasCopied ? 'Copied' : 'Copy Text'}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReminderModal;
