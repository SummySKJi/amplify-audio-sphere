
import { Bell, LogOut, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const DashboardHeader = () => {
  const { profile, signOut, isAdmin } = useAuth();

  return (
    <header className="h-16 flex items-center justify-between px-4 md:px-8 border-b border-gray-800 sticky top-0 z-10 bg-gray-900/95 backdrop-blur">
      <div className="md:hidden"></div>
      <div className="hidden md:block">
        <h1 className="text-xl font-bold">
          {isAdmin ? "Admin Dashboard" : "Music Distribution"}
        </h1>
      </div>
      
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            3
          </span>
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="relative flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                <User className="h-4 w-4" />
              </div>
              <span className="hidden md:inline-block">{profile?.full_name || 'User'}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <Link to="/dashboard/profile">
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
            </Link>
            <DropdownMenuItem onClick={signOut}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default DashboardHeader;
