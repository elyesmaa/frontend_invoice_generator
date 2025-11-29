import { useEffect, useState } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { useForm, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import toast from "react-hot-toast";
import { invoiceService } from "../../services";
import { useAuth } from "../../context/AuthContext";
import { useCompany } from "../../context/CompanyContext";
import { invoiceSchema } from "../../validation/invoiceValidationSchemas";
import Button from "../../components/ui/Button";
import useInvoiceTotals from "../../hooks/useInvoiceTotals";
import useDefaultValues from "../../hooks/useDefaultValues";
import { ArrowLeft } from "lucide-react";
import InvoiceInfo from "../../components/invoices/InvoiceInfo";
import AddressSection from "../../components/invoices/AddressSection";
import InvoiceItems from "../../components/invoices/InvoiceItems";
import NotesAndTotals from "../../components/invoices/NotesAndTotals";
import ClientSelector from "../../components/clients/ClientSelector";
import IncompleteCompanyBanner from "../../components/ui/IncompleteCompanyBanner";

const CreateInvoice = ({ existingInvoice, onSave }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { currentCompany } = useCompany();
  const [isLoading, setIsLoading] = useState(false);
  const [fetchedInvoice, setFetchedInvoice] = useState(null);
  const [selectedClient, setSelectedClient] = useState(null);

  const isEditing = !!id || !!existingInvoice;
  const invoiceToEdit = fetchedInvoice || existingInvoice;

  const defaultValues = useDefaultValues(invoiceToEdit, user);

  const { control, handleSubmit, setValue, reset, watch, formState: { errors } } = useForm({
    defaultValues,
    resolver: yupResolver(invoiceSchema),
  });

  const { fields, append, remove } = useFieldArray({ name: "items", control });
  const formData = watch();
  const items = watch("items");
  const fiscalStamp = watch("fiscalStamp");

  const currentTotals = useInvoiceTotals(items, fiscalStamp, setValue);

  // Auto-populate Bill From with current company details
  useEffect(() => {
    console.log("CreateInvoice - Auto-populate effect triggered", { isEditing, currentCompany });
    if (!isEditing && currentCompany) {
      console.log("Setting billFrom.businessName to:", currentCompany.name);
      setValue("billFrom.businessName", currentCompany.name || "");
      setValue("billFrom.email", currentCompany.email || "");
      setValue("billFrom.address", `${currentCompany.address || ""}${currentCompany.city ? `, ${currentCompany.city}` : ""}`);
      setValue("billFrom.phone", currentCompany.phone || "");
      setValue("billFrom.fiscalNumber", currentCompany.taxId || "");
    }
  }, [isEditing, currentCompany, setValue]);

  // Fetch invoice if editing via URL
  useEffect(() => {
    const fetchInvoice = async () => {
      if (id) {
        try {
          setIsLoading(true);
          const data = await invoiceService.getById(id);
          setFetchedInvoice(data);
        } catch (error) {
          console.error("Error fetching invoice:", error);
          toast.error("Failed to load invoice details");
          navigate("/invoices");
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchInvoice();
  }, [id, navigate]);

  // Update form when invoice is fetched
  useEffect(() => {
    if (fetchedInvoice) {
      reset(useDefaultValues(fetchedInvoice, user));
    }
  }, [fetchedInvoice, user, reset]);

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
    }
  }, [isEditing, location.state, setValue]);

  const onSubmit = async (data) => {
    const { subTotal, taxTotal, total } = currentTotals;

    const finalData = {
      ...data,
      invoiceDate: new Date(data.invoiceDate).toISOString(),
      dueDate: new Date(data.dueDate).toISOString(),
      subTotal,
      taxTotal,
      total,
      prefix: currentCompany?.invoicePrefix || "INV"
    };

    if (onSave) {
      await onSave(finalData);
    } else {
      try {
        setIsLoading(true);
        if (id) {
          await invoiceService.update(id, finalData);
          toast.success("Invoice updated successfully!");
        } else {
          await invoiceService.create(finalData);
          toast.success("Invoice saved successfully!");
        }
        setTimeout(() => navigate("/invoices"), 2000);
      } catch (error) {
        // Handle specific error for incomplete company
        if (error.response?.data?.requiresCompanySetup) {
          toast.error(error.response.data.message);
          // Optionally redirect to company edit page
          // navigate(`/companies/${error.response.data.companyId}/edit`);
        } else {
          toast.error("Something went wrong!");
          console.error(error);
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleClientSelect = (client) => {
    setSelectedClient(client);

    // Common fields
    setValue("billTo.email", client.email || "", { shouldValidate: true });
    setValue("billTo.address", client.address || "", { shouldValidate: true });
    setValue("billTo.phone", client.phone || "", { shouldValidate: true });

    // Conditional fields based on client type
    if (client.clientType === 'company') {
      setValue("billTo.clientName", client.businessName || "", { shouldValidate: true });
      setValue("billTo.fiscalNumber", client.fiscalNumber || "", { shouldValidate: true });
    } else {
      // Individual
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
            onClick={() => navigate('/invoices')}
            className="w-fit"
          >
            Back
          </Button>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                {isEditing ? `Edit Invoice ${fetchedInvoice?.invoiceNumber || ''}` : 'Create New Invoice'}
              </h1>
              <p className="text-slate-600 mt-1">
                {isEditing ? 'Update invoice details' : 'Create a new invoice for your client'}
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate('/invoices')}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? 'Saving...' : (isEditing ? 'Update Invoice' : 'Create Invoice')}
              </Button>
            </div>
          </div>
        </div>

        <InvoiceInfo control={control} errors={errors} />

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
              <ClientSelector
                onSelect={handleClientSelect}
                onClear={handleClearClient}
                selectedClient={selectedClient}
              />
            }
          />
        </div>

        <InvoiceItems
          control={control}
          errors={errors}
          fields={fields}
          remove={remove}
          append={append}
          items={items}
        />

        <NotesAndTotals
          control={control}
          errors={errors}
          fiscalStamp={fiscalStamp}
          currentTotals={currentTotals}
        />

        <div className="mt-6">
          <Button
            type="submit"
            variant="primary"
            isLoading={isLoading}
            disabled={currentCompany && !currentCompany.isComplete}
          >
            {isEditing ? "Update Invoice" : "Save Invoice"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateInvoice;