
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Home,
  Upload,
  Music,
  Wallet,
  UserCircle,
  Users,
  Building,
  FileDown,
  Youtube,
  ChevronDown
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const CustomerSidebar = ({ mobile = false }: { mobile?: boolean }) => {
  const location = useLocation();
  const [managementOpen, setManagementOpen] = useState(false);

  const navItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: <Home className="w-5 h-5" />,
      exact: true,
    },
    {
      name: "Upload Music",
      path: "/dashboard/upload",
      icon: <Upload className="w-5 h-5" />,
    },
    {
      name: "My Releases",
      path: "/dashboard/releases",
      icon: <Music className="w-5 h-5" />,
    },
    {
      name: "Wallet",
      path: "/dashboard/wallet",
      icon: <Wallet className="w-5 h-5" />,
    },
    {
      name: "Royalty Reports",
      path: "/dashboard/royalty-reports",
      icon: <FileDown className="w-5 h-5" />,
    },
    {
      name: "Copyright Removal",
      path: "/dashboard/copyright-removal",
      icon: <Youtube className="w-5 h-5" />,
    },
    {
      name: "OAC Request",
      path: "/dashboard/oac-request",
      icon: <Youtube className="w-5 h-5" />,
    },
    {
      name: "Profile",
      path: "/dashboard/profile",
      icon: <UserCircle className="w-5 h-5" />,
    }
  ];

  const managementItems = [
    {
      name: "Artists",
      path: "/dashboard/artists",
      icon: <Users className="w-5 h-5" />,
    },
    {
      name: "Labels",
      path: "/dashboard/labels",
      icon: <Building className="w-5 h-5" />,
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
        <h2 className="text-2xl font-bold text-white">Music Dist.</h2>
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
            onClick={() => mobile && setManagementOpen(false)}
          >
            {item.icon}
            <span className="ml-3">{item.name}</span>
          </Link>
        ))}

        {/* Management Section */}
        <div>
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-between text-gray-300 hover:bg-gray-700 hover:text-white",
              managementOpen && "bg-gray-700"
            )}
            onClick={() => setManagementOpen(!managementOpen)}
          >
            <div className="flex items-center">
              <Users className="w-5 h-5" />
              <span className="ml-3">Management</span>
            </div>
            <ChevronDown className={cn(
              "w-4 h-4 transition-transform",
              managementOpen && "transform rotate-180"
            )} />
          </Button>

          {managementOpen && (
            <div className="mt-1 pl-4 space-y-1">
              {managementItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors",
                    isActive(item.path)
                      ? "bg-primary text-primary-foreground"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white"
                  )}
                  onClick={() => mobile && setManagementOpen(false)}
                >
                  {item.icon}
                  <span className="ml-3">{item.name}</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </nav>
    </div>
  );
};

export default CustomerSidebar;
