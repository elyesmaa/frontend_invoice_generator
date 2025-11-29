import { useEffect, useState } from "react";
import { dashboardService } from '../../services';
import { Loader2, FileText, DollarSign, Plus, Lightbulb, CloudCog } from "lucide-react";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import Button from "../../components/ui/Button";
import AiInsightsCard from "../../components/ui/AiInsightsCard";
import IncompleteCompanyBanner from "../../components/ui/IncompleteCompanyBanner";

import { useCompany } from "../../context/CompanyContext";

const Dashboard = () => {
  const { currentCompany } = useCompany();
  const [stats, setStats] = useState({
    totalInvoice: 0,
    totalPaid: 0,
    totalUnpaid: 0,
  });
  const [recentInvoices, setRecentInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  const [insights, setInsights] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentCompany) return;

    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const invoicesSummaryData = await dashboardService.getStats();


        setStats({
          totalInvoice:
            invoicesSummaryData.invoiceData.summary.paidInvoicesCount +
            invoicesSummaryData.invoiceData.summary.unpaidInvoicesCount,
          totalPaid: invoicesSummaryData.invoiceData.summary.totalPaid,
          totalUnpaid: invoicesSummaryData.invoiceData.summary.totalUnpaid,
        });
        setRecentInvoices(invoicesSummaryData.invoiceData.latestInvoices);

      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      } finally {
        setLoading(false);
      }
    };
    const fetchMessage = async () => {
      try {
        setIsLoading(true);
        const res = await dashboardService.getAiInsights();
        setInsights(res.insights || []);
      } catch (error) {
        console.error("Error fetching insights :", error);
        setInsights([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessage();
    fetchDashboardData();
  }, [currentCompany]);

  const statsData = [
    {
      icon: FileText,
      label: "Total Invoices",
      value: stats?.totalInvoice,
      color: "blue",
    },
    {
      icon: DollarSign,
      label: "Total Paid",
      value: `${stats?.totalPaid.toFixed(2)}`,
      color: "emerald",
    },
    {
      icon: DollarSign,
      label: "Total Unpaid",
      value: `${stats?.totalUnpaid.toFixed(2)}`,
      color: "red",
    },
  ];

  const colorClasses = {
    blue: { bg: "bg-blue-100", text: "text-blue-600" },
    emerald: { bg: "bg-emerald-100", text: "text-emerald-600" },
    red: { bg: "bg-red-100", text: "text-red-600" },
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="animate-spin h-8 w-8 text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-8">
      <IncompleteCompanyBanner />
      {/* Header */}
      <div>
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Dashboard</h2>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          A quick overview of your business stats
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
        {statsData.map((stat, index) => (
          <div
            key={index}
            className="bg-white p-3 sm:p-4 rounded-xl border border-slate-200 shadow-sm shadow-gray-100"
          >
            <div className="flex items-center gap-2 sm:gap-4">
              <div
                className={`shrink-0 w-10 h-10 sm:w-12 sm:h-12 ${colorClasses[stat.color].bg} rounded-lg flex items-center justify-center`}
              >
                <stat.icon
                  className={`w-5 h-5 sm:w-6 sm:h-6 ${colorClasses[stat.color].text}`}
                />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs sm:text-sm font-medium text-slate-500 truncate">
                  {stat.label}
                </div>
                <div className="text-lg sm:text-2xl font-bold text-slate-900 truncate">
                  {stat.value}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Insights Card */}
      <AiInsightsCard
        title="AI Insights"
        icon={Lightbulb}
        message={insights}
        isLoading={isLoading}
      />
      {/* Recent Invoices Section */}
      <div className="w-full bg-white border border-slate-200 rounded-lg shadow-sm shadow-gray-100 overflow-hidden">
        <div className="px-3 sm:px-6 py-3 sm:py-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center flex-wrap gap-2">
          <h3 className="text-base sm:text-lg font-semibold text-slate-900">
            Recent Invoices
          </h3>
          <Button variant="ghost" onClick={() => navigate("/invoices")}>
            View All
          </Button>
        </div>

        {/* Desktop Table */}
        {recentInvoices.length > 0 ? (
          <>
            <div className="overflow-x-auto hidden md:block">
              <table className="min-w-full divide-y divide-slate-200 text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Client
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Due Date
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                  {recentInvoices.map((invoice) => (

                    <tr
                      key={invoice._id}
                      className="hover:bg-slate-50 cursor-pointer"
                      onClick={() => navigate(`/invoices/${invoice._id}`)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-slate-900">
                          {invoice.clientName}
                        </div>
                        <div className="text-sm text-slate-500">
                          #{invoice.invoiceNumber}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-800">
                        ${invoice.total.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${invoice.status === "Paid"
                            ? "bg-emerald-100 text-emerald-800"
                            : invoice.status === "Unpaid"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                            }`}
                        >
                          {invoice.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-slate-500 text-sm">
                        {moment(invoice.dueDate).format("MMM DD, YYYY")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="block md:hidden divide-y divide-slate-200">
              {recentInvoices.map((invoice) => (
                <div
                  key={invoice._id}
                  className="p-4 flex flex-col space-y-1 hover:bg-slate-50 cursor-pointer"
                  onClick={() => navigate(`/invoices/${invoice._id}`)}
                >
                  <div className="font-semibold text-slate-900">
                    {invoice.clientName}
                  </div>
                  <div className="text-sm text-slate-500">
                    #{invoice.invoiceNumber}
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="font-medium">
                      ${invoice.total.toFixed(2)}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${invoice.status === "Paid"
                        ? "bg-emerald-100 text-emerald-800"
                        : invoice.status === "Unpaid"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                        }`}
                    >
                      {invoice.status}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500">
                    Due {moment(invoice.dueDate).format("MMM DD, YYYY")}
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
              <FileText className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-slate-900 mb-2 text-lg font-semibold">
              No invoices yet
            </h3>
            <p className="text-slate-500 mb-6 max-w-md">
              You haven’t created any invoices yet. Click the button below to
              create your first one.
            </p>
            <Button onClick={() => navigate("/invoices/create")} icon={Plus}>
              Create Invoice
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
