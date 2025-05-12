
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Music2,
  Users,
  Building2,
  Wallet,
  FileDown,
  Youtube,
  Settings,
  UserCircle
} from "lucide-react";

const AdminSidebar = ({ mobile = false }: { mobile?: boolean }) => {
  const location = useLocation();

  const navItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: <LayoutDashboard className="w-5 h-5" />,
      exact: true,
    },
    {
      name: "Music Management",
      path: "/dashboard/music",
      icon: <Music2 className="w-5 h-5" />,
    },
    {
      name: "Customer Management",
      path: "/dashboard/customers",
      icon: <Users className="w-5 h-5" />,
    },
    {
      name: "Artists & Labels",
      path: "/dashboard/entities",
      icon: <Building2 className="w-5 h-5" />,
    },
    {
      name: "Wallet & Payouts",
      path: "/dashboard/payouts",
      icon: <Wallet className="w-5 h-5" />,
    },
    {
      name: "Copyright Requests",
      path: "/dashboard/copyright-requests",
      icon: <Youtube className="w-5 h-5" />,
    },
    {
      name: "OAC Requests",
      path: "/dashboard/oac-requests",
      icon: <Youtube className="w-5 h-5" />,
    },
    {
      name: "Royalty Reports",
      path: "/dashboard/royalty-upload",
      icon: <FileDown className="w-5 h-5" />,
    },
    {
      name: "Platform Management",
      path: "/dashboard/platforms",
      icon: <Settings className="w-5 h-5" />,
    },
    {
      name: "Admin Profile",
      path: "/dashboard/admin-profile",
      icon: <UserCircle className="w-5 h-5" />,
    }
  ];

  const isActive = (path: string, exact = false) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="h-full flex flex-col bg-gray-800 border-r border-gray-700 overflow-y-auto">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-white">Admin Panel</h2>
        <p className="text-sm text-gray-400 mt-1">Music Distribution India</p>
      </div>
      
      <nav className="flex-1 px-4 pb-6 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors",
              isActive(item.path, item.exact)
                ? "bg-primary text-primary-foreground"
                : "text-gray-300 hover:bg-gray-700 hover:text-white"
            )}
          >
            {item.icon}
            <span className="ml-3">{item.name}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default AdminSidebar;
