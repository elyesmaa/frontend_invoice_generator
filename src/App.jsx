

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from 'react-router-dom'
import HomePage from './pages/HomePage/HomePage'
import SignUp from './pages/Auth/SignUp'
import Login from './pages/Auth/Login'
import VerifyEmail from './pages/Auth/VerifyEmail'
import VerifyEmailChange from './pages/Auth/VerifyEmailChange'
import { Toaster } from 'react-hot-toast'
import CreateInvoice from './pages/Invoices/CreateInvoice'
import InvoiceDetails from './pages/Invoices/InvoiceDetails'
import InvoiceList from './pages/Invoices/InvoiceList'
import Profile from './pages/Profile/Profile'
import DashboardLayout from './components/layout/DashboardLayout'
import ProtectedRoute from './components/auth/ProtectedRoute'
import PublicRoute from './components/auth/PublicRoute'
import Dashboard from './pages/Dashboard/Dashboard'
import ClientsPage from './pages/Clients/ClientsPage'
import CreateClient from './pages/Clients/CreateClient'
import QuoteList from './pages/Quotes/QuoteList'
import CreateQuote from './pages/Quotes/CreateQuote'
import QuoteDetails from './pages/Quotes/QuoteDetails'
import CompanyList from './pages/Companies/CompanyList'
import CreateCompany from './pages/Companies/CreateCompany'
import { AuthProvider } from './context/AuthContext'
import { CompanyProvider } from './context/CompanyContext'
import RequireCompanyComplete from './components/auth/RequireCompanyComplete'

const App = () => {
  return (
    <AuthProvider>
      <CompanyProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path='/' element={<HomePage />} />
            <Route path="/verify-email-change" element={<VerifyEmailChange />} />
            <Route element={<PublicRoute />}>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/verify-email" element={<VerifyEmail />} />
            </Route>

            {/* Protected Routes avec DashboardLayout */}
            <Route element={<ProtectedRoute />}>
              <Route element={<DashboardLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/invoices" element={<InvoiceList />} />
                <Route path="/invoices/new" element={
                  <RequireCompanyComplete>
                    <CreateInvoice />
                  </RequireCompanyComplete>
                } />
                <Route path="/invoices/:id/edit" element={
                  <RequireCompanyComplete>
                    <CreateInvoice />
                  </RequireCompanyComplete>
                } />
                <Route path="/invoices/:id" element={<InvoiceDetails />} />
                <Route path="/clients" element={<ClientsPage />} />
                <Route path="/clients/new" element={
                  <RequireCompanyComplete>
                    <CreateClient />
                  </RequireCompanyComplete>
                } />
                <Route path="/clients/:id/edit" element={
                  <RequireCompanyComplete>
                    <CreateClient />
                  </RequireCompanyComplete>
                } />
                <Route path="/quotes" element={<QuoteList />} />
                <Route path="/quotes/new" element={
                  <RequireCompanyComplete>
                    <CreateQuote />
                  </RequireCompanyComplete>
                } />
                <Route path="/quotes/:id/edit" element={
                  <RequireCompanyComplete>
                    <CreateQuote />
                  </RequireCompanyComplete>
                } />
                <Route path="/quotes/:id" element={<QuoteDetails />} />
                <Route path="/companies" element={<CompanyList />} />
                <Route path="/companies/new" element={<CreateCompany />} />
                <Route path="/companies/:id/edit" element={<CreateCompany />} />
                <Route path="/profile" element={<Profile />} />
              </Route>
            </Route>

            {/* Catch all route */}
            <Route path='*' element={<Navigate to='/' replace />} />
          </Routes>
        </Router>
        <Toaster toastOptions={{
          className: "",
          style: {
            fontSize: "14px"
          }
        }} />
      </CompanyProvider>
    </AuthProvider>
  )
}

export default App