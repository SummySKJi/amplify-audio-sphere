
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

  useEffect(() => {
    // Check for authentication
    if (!isLoading && !user) {
      toast.info("You need to sign in to access the dashboard.");
      navigate("/auth");
      return;
    }

    // Show welcome message on first load
    if (user && !sessionStorage.getItem('dashboardWelcome')) {
      toast.success(`Welcome to your dashboard, ${user.user_metadata?.full_name || 'User'}!`);
      sessionStorage.setItem('dashboardWelcome', 'true');
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
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
