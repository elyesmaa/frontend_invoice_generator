/**
 * Currency symbols mapping
 */
const CURRENCY_SYMBOLS = {
    TND: 'TND',
    EUR: '€',
    USD: '$',
    GBP: '£',
    CHF: 'CHF',
    CAD: 'CA$',
    AED: 'AED',
    SAR: 'SAR',
    MAD: 'MAD',
};

/**
 * Format amount with currency symbol
 * @param {number} amount - The amount to format
 * @param {string} currency - Currency code (TND, EUR, USD, etc.)
 * @returns {string} Formatted amount with currency symbol
 */
export const formatCurrency = (amount, currency = 'TND') => {
    const symbol = CURRENCY_SYMBOLS[currency] || currency;
    const formattedAmount = amount?.toFixed(2) || '0.00';

    // For currencies with symbols on the left (USD, GBP, EUR)
    if (['USD', 'GBP', 'EUR', 'CAD'].includes(currency)) {
        return `${symbol}${formattedAmount}`;
    }

    // For currencies with symbols on the right (TND, CHF, etc.)
    return `${formattedAmount} ${symbol}`;
};

/**
 * Get currency symbol
 * @param {string} currency - Currency code
 * @returns {string} Currency symbol
 */
export const getCurrencySymbol = (currency = 'TND') => {
    return CURRENCY_SYMBOLS[currency] || currency;
};
