
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "./contexts/AuthContext";
import DashboardLayout from "./components/layouts/DashboardLayout";

// Import customer dashboard pages
import CustomerUpload from "./pages/customer/CustomerUpload";
import CustomerReleases from "./pages/customer/CustomerReleases";
import CustomerWallet from "./pages/customer/CustomerWallet";
import CustomerRoyalty from "./pages/customer/CustomerRoyalty";
import CustomerCopyright from "./pages/customer/CustomerCopyright";
import CustomerOac from "./pages/customer/CustomerOac";
import CustomerArtists from "./pages/customer/CustomerArtists";
import CustomerLabels from "./pages/customer/CustomerLabels";
import CustomerProfile from "./pages/customer/CustomerProfile";

// Import admin dashboard pages
import AdminMusic from "./pages/admin/AdminMusic";
import AdminCustomers from "./pages/admin/AdminCustomers";
import AdminEntities from "./pages/admin/AdminEntities";
import AdminPayouts from "./pages/admin/AdminPayouts";
import AdminCopyright from "./pages/admin/AdminCopyright";
import AdminOac from "./pages/admin/AdminOac";
import AdminRoyalty from "./pages/admin/AdminRoyalty";
import AdminPlatforms from "./pages/admin/AdminPlatforms";
import AdminProfile from "./pages/admin/AdminProfile";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            
            {/* Dashboard routes */}
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<Dashboard />} />
              
              {/* Customer routes */}
              <Route path="upload" element={<CustomerUpload />} />
              <Route path="releases" element={<CustomerReleases />} />
              <Route path="wallet" element={<CustomerWallet />} />
              <Route path="royalty-reports" element={<CustomerRoyalty />} />
              <Route path="copyright-removal" element={<CustomerCopyright />} />
              <Route path="oac-request" element={<CustomerOac />} />
              <Route path="artists" element={<CustomerArtists />} />
              <Route path="labels" element={<CustomerLabels />} />
              <Route path="profile" element={<CustomerProfile />} />
              
              {/* Admin routes */}
              <Route path="music" element={<AdminMusic />} />
              <Route path="customers" element={<AdminCustomers />} />
              <Route path="entities" element={<AdminEntities />} />
              <Route path="payouts" element={<AdminPayouts />} />
              <Route path="copyright-requests" element={<AdminCopyright />} />
              <Route path="oac-requests" element={<AdminOac />} />
              <Route path="royalty-upload" element={<AdminRoyalty />} />
              <Route path="platforms" element={<AdminPlatforms />} />
              <Route path="admin-profile" element={<AdminProfile />} />
            </Route>
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
