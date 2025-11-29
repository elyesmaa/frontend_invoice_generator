import { useEffect } from 'react';

/**
 * Custom hook for managing invoice totals calculations
 * @param {Array} items - Array of invoice items
 * @param {number} fiscalStamp - Fiscal stamp amount
 * @param {Function} setValue - React Hook Form setValue function
 * @returns {Object} Current totals (subTotal, taxTotal, total)
 */
const useInvoiceTotals = (items, fiscalStamp, setValue) => {
  const calculateTotals = (itemsArray, stamp = 0) => {
    const subTotal = itemsArray.reduce((sum, item) => {
      const quantity = Number(item.quantity) || 0;
      const unitPrice = Number(item.unitPrice) || 0;
      return sum + (quantity * unitPrice);
    }, 0);

    const taxTotal = itemsArray.reduce((sum, item) => {
      const quantity = Number(item.quantity) || 0;
      const unitPrice = Number(item.unitPrice) || 0;
      const taxPercent = Number(item.taxPercent) || 0;
      return sum + (quantity * unitPrice * taxPercent / 100);
    }, 0);

    const total = subTotal + taxTotal + Number(stamp);

    return { subTotal, taxTotal, total };
  };

  useEffect(() => {
    if (items?.length > 0) {
      const { subTotal, taxTotal, total } = calculateTotals(items, fiscalStamp);

      setValue("subTotal", subTotal);
      setValue("taxTotal", taxTotal);
      setValue("total", total);

      // Update individual item totals
      items.forEach((item, index) => {
        const quantity = Number(item.quantity) || 0;
        const unitPrice = Number(item.unitPrice) || 0;
        const taxPercent = Number(item.taxPercent) || 0;

        const itemSubTotal = quantity * unitPrice;
        const itemTotal = itemSubTotal * (1 + taxPercent / 100);

        setValue(`items.${index}.subTotal`, itemSubTotal);
        setValue(`items.${index}.total`, itemTotal);
      });
    }
  }, [items, fiscalStamp, setValue]);

  return calculateTotals(items || [], fiscalStamp || 0);
};

export default useInvoiceTotals;
