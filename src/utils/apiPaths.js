export const BASE_URL = "https://backend-invoice-generator.onrender.com/";
export const API_PATHS = {
  AUTH: {
    REGISTER: "/api/auth/register",
    LOGIN: "/api/auth/login",
    ME: "/api/auth/me",
    UPDATE_PROFILE: "/api/auth/me",
    CHECK_EMAIL: "/api/auth/check-email",
    VERIFY_EMAIL: (token) => `/api/auth/verify-email/${token}`,
    CONFIRM_EMAIL_CHANGE: (token) => `/api/auth/confirm-email-change/${token}`,
  },

  INVOICE: {
    CREATE: "/api/invoices",
    GET_ALL_INVOICES: (page = 1, limit = 10, search = "", status = "") => {
      const params = new URLSearchParams();
      params.append("page", page);
      params.append("limit", limit);
      if (search) params.append("search", search);
      if (status) params.append("status", status);
      return `/api/invoices?${params.toString()}`;
    },
    GET_ALL_INVOICES_API: "/api/invoices",
    GET_INVOICES_SUMMARY: "/api/invoices/summary",
    GET_INVOICE_BY_ID: (id) => `/api/invoices/${id}`,
    UPDATE_INVOICE: (id) => `/api/invoices/${id}`,
    DELETE_INVOICE: (id) => `/api/invoices/${id}`,
  },

  AI: {
    PARSE_INVOICE_TEXT: "/api/ai/parse-text",
    PARSE_QUOTE_TEXT: "/api/ai/parse-quote-text",
    GENERATE_REMINDER_EMAIL: "/api/ai/generate-reminder",
    GENERATE_QUOTE_REMINDER: "/api/ai/generate-quote-reminder",
    GET_DASHBOARD_SUMMARY: "/api/ai/dashboard-summary",
  },

  CLIENT: {
    GET_ALL: '/api/clients',
    GET_BY_ID: (id) => `/api/clients/${id}`,
    CREATE: '/api/clients',
    UPDATE: (id) => `/api/clients/${id}`,
    DELETE: (id) => `/api/clients/${id}`,
  },

  COMPANY: {
    GET_ALL: '/api/companies',
    GET_BY_ID: (id) => `/api/companies/${id}`,
    CREATE: '/api/companies',
    UPDATE: (id) => `/api/companies/${id}`,
    DELETE: (id) => `/api/companies/${id}`,
  },

  QUOTE: {
    GET_ALL: '/api/quotes',
    GET_BY_ID: (id) => `/api/quotes/${id}`,
    CREATE: '/api/quotes',
    UPDATE: (id) => `/api/quotes/${id}`,
    DELETE: (id) => `/api/quotes/${id}`,
    CONVERT_TO_INVOICE: (id) => `/api/quotes/${id}/convert`,
    CLONE: (id) => `/api/quotes/${id}/clone`,
  },
};

export default API_PATHS;
