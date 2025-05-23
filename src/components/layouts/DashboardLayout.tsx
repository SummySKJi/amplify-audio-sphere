
import { useState, useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2, Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import AdminSidebar from "@/components/dashboard/AdminSidebar";
import CustomerSidebar from "@/components/dashboard/CustomerSidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { toast } from "sonner";

const DashboardLayout = () => {
  const { user, isLoading, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [authCheckComplete, setAuthCheckComplete] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      // Check for authentication
      if (!user) {
        toast.info("You need to sign in to access the dashboard.");
        navigate("/auth");
        return;
      }
      
      // Set auth check complete after verifying login
      setAuthCheckComplete(true);
      
      // Show welcome message only on first load
      if (user && !sessionStorage.getItem('dashboardWelcome')) {
        const welcomeName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'User';
        toast.success(`Welcome to your dashboard${isAdmin ? ' (Admin)' : ''}, ${welcomeName}!`);
        sessionStorage.setItem('dashboardWelcome', 'true');
      }
      
      // For admin-specific routes, redirect non-admins
      const isAdminRoute = window.location.pathname.includes('/admin-') || 
                           window.location.pathname.includes('/music') || 
                           window.location.pathname.includes('/customers') ||
                           window.location.pathname.includes('/entities') ||
                           window.location.pathname.includes('/payouts') ||
                           window.location.pathname.includes('/royalty-upload') ||
                           window.location.pathname.includes('/platforms');
                           
      if (isAdminRoute && !isAdmin) {
        toast.error("You don't have permission to access this page.");
        navigate('/dashboard');
        return;
      }
    }
  }, [user, isLoading, navigate, isAdmin]);

  if (isLoading || !authCheckComplete) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black text-white">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-xl">Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black text-white">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col h-screen sticky top-0">
        {isAdmin ? <AdminSidebar /> : <CustomerSidebar />}
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
        <SheetTrigger asChild>
          <button className="md:hidden p-4 bg-gray-800 rounded absolute top-4 left-4 z-20">
            <Menu className="h-6 w-6" />
          </button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0 bg-gray-800 border-r border-gray-700">
          {isAdmin ? <AdminSidebar mobile={true} /> : <CustomerSidebar mobile={true} />}
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <DashboardHeader />
        <main className="flex-1 overflow-y-auto px-4 py-8 md:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
