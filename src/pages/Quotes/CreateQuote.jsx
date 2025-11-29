import { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useForm, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import toast from "react-hot-toast";
import { quoteService } from "../../services";
import { useAuth } from "../../context/AuthContext";
import { useCompany } from "../../context/CompanyContext";
import { quoteSchema } from "../../validation/quoteValidationSchemas";
import Button from "../../components/ui/Button";
import useInvoiceTotals from "../../hooks/useInvoiceTotals";
import InvoiceItems from "../../components/invoices/InvoiceItems";
import NotesAndTotals from "../../components/invoices/NotesAndTotals";
import ClientSelector from "../../components/clients/ClientSelector";
import IncompleteCompanyBanner from "../../components/ui/IncompleteCompanyBanner";
import QuoteInfo from "../../components/quotes/QuoteInfo";
import AddressSection from "../../components/invoices/AddressSection";
import { ArrowLeft } from "lucide-react";

const CreateQuote = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuth();
    const { currentCompany } = useCompany();
    const [isLoading, setIsLoading] = useState(false);
    const [fetchedQuote, setFetchedQuote] = useState(null);
    const [selectedClient, setSelectedClient] = useState(null);

    const isEditing = !!id;

    const getDefaultValues = (quote) => {
        if (quote) {
            return {
                quoteDate: quote.quoteDate ? new Date(quote.quoteDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
                expirationDate: quote.expirationDate ? new Date(quote.expirationDate).toISOString().split('T')[0] : "",
                status: quote.status || "Draft",
                billFrom: quote.billFrom || {},
                billTo: quote.billTo || {},
                items: quote.items || [{ name: "", quantity: 1, unitPrice: 0, taxPercent: 0, subTotal: 0, total: 0 }],
                notes: quote.notes || "",
                paymentTerms: quote.paymentTerms || "",
                fiscalStamp: quote.fiscalStamp || 1,
            };
        }

        return {
            quoteDate: new Date().toISOString().split('T')[0],
            expirationDate: "",
            status: "Draft",
            billFrom: {
                businessName: "",
                email: "",
                address: "",
                phone: "",
                fiscalNumber: "",
            },
            billTo: {
                clientName: "",
                email: "",
                address: "",
                phone: "",
                fiscalNumber: "",
            },
            items: [{ name: "", quantity: 1, unitPrice: 0, taxPercent: 0, subTotal: 0, total: 0 }],
            notes: "",
            paymentTerms: "",
            fiscalStamp: 1,
        };
    };

    const { control, handleSubmit, setValue, reset, watch, formState: { errors } } = useForm({
        defaultValues: getDefaultValues(null),
        resolver: yupResolver(quoteSchema),
    });

    const { fields, append, remove } = useFieldArray({ name: "items", control });
    const formData = watch();
    const items = watch("items");
    const fiscalStamp = watch("fiscalStamp");

    const currentTotals = useInvoiceTotals(items, fiscalStamp, setValue);

    // Auto-populate Bill From with current company details
    useEffect(() => {
        if (!isEditing && currentCompany) {
            setValue("billFrom.businessName", currentCompany.name || "");
            setValue("billFrom.email", currentCompany.email || "");
            setValue("billFrom.address", `${currentCompany.address || ""}${currentCompany.city ? `, ${currentCompany.city}` : ""}`);
            setValue("billFrom.phone", currentCompany.phone || "");
            setValue("billFrom.fiscalNumber", currentCompany.taxId || "");
        }
    }, [isEditing, currentCompany, setValue]);

    // Fetch quote if editing
    useEffect(() => {
        const fetchQuote = async () => {
            if (id) {
                try {
                    setIsLoading(true);
                    const data = await quoteService.getById(id);
                    setFetchedQuote(data);
                    reset(getDefaultValues(data));
                } catch (error) {
                    console.error("Error fetching estimate:", error);
                    toast.error("Failed to load estimate details");
                    navigate("/quotes");
                } finally {
                    setIsLoading(false);
                }
            }
        };

        fetchQuote();
    }, [id, navigate, reset]);

    // Handle AI data population
    useEffect(() => {
        const aiData = location.state?.aiData;

        if (aiData && !isEditing) {
            setValue("billTo.clientName", aiData.clientName || "");
            setValue("billTo.email", aiData.clientEmail || "");
            setValue("billTo.address", aiData.clientAddress || "");
            setValue("billTo.phone", aiData.clientPhone || "");
            setValue("billTo.fiscalNumber", aiData.fiscalNumber || "");
            setValue("items", Array.isArray(aiData.items) && aiData.items.length > 0
                ? aiData.items.map(item => ({
                    name: item.name || "",
                    quantity: Number(item.quantity) || 1,
                    unitPrice: Number(item.unitPrice) || 0,
                    taxPercent: Number(item.taxPercent) || 0,
                    subTotal: 0,
                    total: 0
                }))
                : [{ name: "", quantity: 1, unitPrice: 0, taxPercent: 0, subTotal: 0, total: 0 }]
            );
            if (aiData.notes) {
                setValue("notes", aiData.notes);
            }
        }
    }, [isEditing, location.state, setValue]);

    const onSubmit = async (data) => {
        const { subTotal, taxTotal, total } = currentTotals;

        // Remove subTotal from data to avoid validation error (backend expects subtotal)
        const { subTotal: _, ...cleanData } = data;

        const finalData = {
            ...cleanData,
            items: data.items.map(({ subTotal, _id, ...item }) => item),
            quoteDate: new Date(data.quoteDate).toISOString(),
            expirationDate: new Date(data.expirationDate).toISOString(),
            subtotal: subTotal,
            taxTotal,
            total,
        };

        try {
            setIsLoading(true);
            if (id) {
                await quoteService.update(id, finalData);
                toast.success("Estimate updated successfully!");
            } else {
                await quoteService.create(finalData);
                toast.success("Estimate created successfully!");
            }
            setTimeout(() => navigate("/quotes"), 2000);
        } catch (error) {
            if (error.response?.data?.requiresCompanySetup) {
                toast.error(error.response.data.message);
            } else if (error.response?.data?.errors && Array.isArray(error.response.data.errors)) {
                // Show the first validation error from backend
                toast.error(error.response.data.errors[0]);
                console.error("Backend validation errors:", error.response.data.errors);
            } else {
                toast.error(error.response?.data?.message || "Something went wrong!");
                console.error(error);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleClientSelect = (client) => {
        setSelectedClient(client);

        setValue("billTo.email", client.email || "", { shouldValidate: true });
        setValue("billTo.address", client.address || "", { shouldValidate: true });
        setValue("billTo.phone", client.phone || "", { shouldValidate: true });

        if (client.clientType === 'company') {
            setValue("billTo.clientName", client.businessName || "", { shouldValidate: true });
            setValue("billTo.fiscalNumber", client.fiscalNumber || "", { shouldValidate: true });
        } else {
            setValue("billTo.clientName", client.name || "", { shouldValidate: true });
            setValue("billTo.fiscalNumber", client.cinOrPassport || "", { shouldValidate: true });
        }
    };

    const handleClearClient = () => {
        setSelectedClient(null);
        setValue("billTo.clientName", "", { shouldValidate: true });
        setValue("billTo.email", "", { shouldValidate: true });
        setValue("billTo.address", "", { shouldValidate: true });
        setValue("billTo.phone", "", { shouldValidate: true });
        setValue("billTo.fiscalNumber", "", { shouldValidate: true });
    };

    return (
        <div className="pb-[100vh]">
            <IncompleteCompanyBanner />

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Header */}
                <div className="space-y-4">
                    <Button
                        type="button"
                        variant="ghost"
                        icon={ArrowLeft}
                        onClick={() => navigate('/quotes')}
                        className="w-fit"
                    >
                        Back
                    </Button>

                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900">
                                {isEditing ? `Edit Estimate ${fetchedQuote?.quoteNumber || ''}` : 'Create New Estimate'}
                            </h1>
                            <p className="text-slate-600 mt-1">
                                {isEditing ? 'Update estimate details' : 'Create a new estimate for your client'}
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={() => navigate('/quotes')}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Saving...' : (isEditing ? 'Update Estimate' : 'Create Estimate')}
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Estimate Info */}
                <QuoteInfo
                    control={control}
                    errors={errors}
                    status={formData.status}
                />

                {/* Bill From / Bill To */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <AddressSection
                        title="Bill From"
                        prefix="billFrom"
                        control={control}
                        errors={errors}
                    />
                    <AddressSection
                        title="Bill To"
                        prefix="billTo"
                        control={control}
                        errors={errors}
                        readOnly={!!selectedClient}
                        headerContent={
                            <div className="mb-4">
                                <ClientSelector
                                    onSelect={handleClientSelect}
                                    onClear={handleClearClient}
                                    selectedClient={selectedClient}
                                />
                            </div>
                        }
                    />
                </div>

                {/* Items */}
                <InvoiceItems
                    control={control}
                    errors={errors}
                    fields={fields}
                    remove={remove}
                    append={append}
                    items={items}
                />

                {/* Notes and Totals */}
                <NotesAndTotals
                    control={control}
                    errors={errors}
                    fiscalStamp={fiscalStamp}
                    currentTotals={currentTotals}
                />

                {/* Submit Button */}
                <div className="mt-6">
                    <Button
                        type="submit"
                        variant="primary"
                        isLoading={isLoading}
                        disabled={(currentCompany && !currentCompany.isComplete) || formData.status === 'Converted'}
                    >
                        {isEditing ? "Update Estimate" : "Save Estimate"}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default CreateQuote;
