/**
 * Custom hook for managing default form values
 * @param {Object} existingInvoice - Existing invoice data for editing
 * @param {Object} user - Current user data
 * @returns {Object} Default values for the invoice form
 */
const useDefaultValues = (existingInvoice, user) => {
  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  };

  if (existingInvoice) {
    return {
      ...existingInvoice,
      invoiceDate: formatDateForInput(existingInvoice.invoiceDate),
      dueDate: formatDateForInput(existingInvoice.dueDate),
      items: existingInvoice.items.map(item => ({
        ...item,
        subTotal: item.quantity * item.unitPrice,
        total: item.total
      }))
    };
  }
  
  return {
    invoiceNumber: "",
    invoiceDate: new Date().toISOString().split("T")[0],
    dueDate: "",
    billFrom: {
      businessName: user?.businessName || "",
      email: user?.email || "",
      address: user?.address || "",
      phone: user?.phone || "",
      fiscalNumber: user?.fiscalNumber || "",
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
    paymentTerms: "NET 15",
    fiscalStamp: 1,
    status: "Unpaid",
    prefix: "VT",
    taxTotal: 0,
    subTotal: 0,
    total: 0
  };
};

export default useDefaultValues;
