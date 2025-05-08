
import { useState, useEffect } from "react";
import { Bell, LogOut, User, Upload, Music, Wallet } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const DashboardHeader = () => {
  const { profile, signOut, isAdmin } = useAuth();
  const [notificationCount, setNotificationCount] = useState(0);

  // Fetch notifications (pending reviews, new reports, etc.)
  const { data: notifications } = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      // For customer: fetch pending releases
      // For admin: fetch all pending items
      if (isAdmin) {
        const [releasesRes, withdrawalRes, copyrightRes, oacRes] = await Promise.all([
          supabase.from('releases').select('id').eq('status', 'pending_review'),
          supabase.from('withdrawal_requests').select('id').eq('status', 'pending'),
          supabase.from('copyright_removal_requests').select('id').eq('status', 'pending'),
          supabase.from('oac_requests').select('id').eq('status', 'pending')
        ]);
        
        return {
          releases: releasesRes.data?.length || 0,
          withdrawals: withdrawalRes.data?.length || 0,
          copyright: copyrightRes.data?.length || 0,
          oac: oacRes.data?.length || 0
        };
      } else {
        const [releasesRes, reportsRes] = await Promise.all([
          supabase.from('releases')
            .select('id')
            .eq('status', 'approved')
            .order('updated_at', { ascending: false })
            .limit(3),
          supabase.from('royalty_reports')
            .select('id')
            .order('created_at', { ascending: false })
            .limit(3)
        ]);
        
        return {
          releases: releasesRes.data?.length || 0,
          reports: reportsRes.data?.length || 0
        };
      }
    },
    refetchInterval: 60000, // Refetch every minute
    enabled: !!profile
  });

  // Calculate notification count
  useEffect(() => {
    if (notifications) {
      if (isAdmin) {
        setNotificationCount(
          notifications.releases + 
          notifications.withdrawals +
          notifications.copyright + 
          notifications.oac
        );
      } else {
        setNotificationCount(notifications.releases + notifications.reports);
      }
    }
  }, [notifications, isAdmin]);

  const quickLinks = isAdmin
    ? [
        { icon: <Music className="h-4 w-4" />, label: "Review Music", path: "/dashboard/music" },
        { icon: <Wallet className="h-4 w-4" />, label: "Manage Payouts", path: "/dashboard/payouts" }
      ]
    : [
        { icon: <Upload className="h-4 w-4" />, label: "Upload Music", path: "/dashboard/upload" },
        { icon: <Music className="h-4 w-4" />, label: "My Releases", path: "/dashboard/releases" },
        { icon: <Wallet className="h-4 w-4" />, label: "Wallet", path: "/dashboard/wallet" }
      ];

  return (
    <header className="h-16 flex items-center justify-between px-4 md:px-8 border-b border-gray-800 sticky top-0 z-10 bg-gray-900/95 backdrop-blur">
      <div className="md:hidden"></div>
      <div className="hidden md:block">
        <h1 className="text-xl font-bold">
          {isAdmin ? "Admin Dashboard" : "Music Distribution"}
        </h1>
      </div>
      
      <div className="flex items-center space-x-4">
        {/* Quick Actions */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="hidden md:flex">
              Quick Actions
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {quickLinks.map((link) => (
              <DropdownMenuItem key={link.path} asChild>
                <Link to={link.path} className="flex items-center">
                  {link.icon}
                  <span className="ml-2">{link.label}</span>
                </Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        
        {/* Notifications */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {notificationCount}
                </span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0" align="end">
            <div className="p-4 border-b border-gray-700">
              <h3 className="font-medium">Notifications</h3>
            </div>
            <div className="max-h-80 overflow-y-auto">
              {isAdmin ? (
                <div className="py-2">
                  {notifications?.releases > 0 && (
                    <Link to="/dashboard/music" className="flex items-center px-4 py-2 hover:bg-gray-800">
                      <div className="flex-1">
                        <p className="text-sm font-medium">New Music Submissions</p>
                        <p className="text-xs text-gray-400">
                          {notifications.releases} pending review
                        </p>
                      </div>
                    </Link>
                  )}
                  {notifications?.withdrawals > 0 && (
                    <Link to="/dashboard/payouts" className="flex items-center px-4 py-2 hover:bg-gray-800">
                      <div className="flex-1">
                        <p className="text-sm font-medium">Withdrawal Requests</p>
                        <p className="text-xs text-gray-400">
                          {notifications.withdrawals} pending approval
                        </p>
                      </div>
                    </Link>
                  )}
                  {notifications?.copyright > 0 && (
                    <Link to="/dashboard/copyright-requests" className="flex items-center px-4 py-2 hover:bg-gray-800">
                      <div className="flex-1">
                        <p className="text-sm font-medium">Copyright Removal Requests</p>
                        <p className="text-xs text-gray-400">
                          {notifications.copyright} pending review
                        </p>
                      </div>
                    </Link>
                  )}
                  {notifications?.oac > 0 && (
                    <Link to="/dashboard/oac-requests" className="flex items-center px-4 py-2 hover:bg-gray-800">
                      <div className="flex-1">
                        <p className="text-sm font-medium">OAC Requests</p>
                        <p className="text-xs text-gray-400">
                          {notifications.oac} pending review
                        </p>
                      </div>
                    </Link>
                  )}
                </div>
              ) : (
                <div className="py-2">
                  {notifications?.releases > 0 ? (
                    <Link to="/dashboard/releases" className="flex items-center px-4 py-2 hover:bg-gray-800">
                      <div className="flex-1">
                        <p className="text-sm font-medium">Release Updates</p>
                        <p className="text-xs text-gray-400">
                          {notifications.releases} recently approved releases
                        </p>
                      </div>
                    </Link>
                  ) : null}
                  {notifications?.reports > 0 ? (
                    <Link to="/dashboard/royalty-reports" className="flex items-center px-4 py-2 hover:bg-gray-800">
                      <div className="flex-1">
                        <p className="text-sm font-medium">New Reports Available</p>
                        <p className="text-xs text-gray-400">
                          {notifications.reports} royalty reports
                        </p>
                      </div>
                    </Link>
                  ) : null}
                </div>
              )}
              {notificationCount === 0 && (
                <div className="px-4 py-8 text-center">
                  <p className="text-sm text-gray-400">No new notifications</p>
                </div>
              )}
            </div>
          </PopoverContent>
        </Popover>
        
        {/* User Menu */}
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
            <div className="px-4 py-3 border-b border-gray-700">
              <p className="text-sm font-medium">{profile?.full_name}</p>
              <p className="text-xs text-gray-400 mt-1 truncate">{profile?.email}</p>
            </div>
            <Link to="/dashboard">
              <DropdownMenuItem>
                Dashboard
              </DropdownMenuItem>
            </Link>
            <Link to={isAdmin ? "/dashboard/admin-profile" : "/dashboard/profile"}>
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
            </Link>
            <DropdownMenuSeparator />
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
