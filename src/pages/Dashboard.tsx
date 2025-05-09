
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Music, Upload, Wallet, FileDown, Youtube, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const Dashboard = () => {
  const { user, profile, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    // Check authentication status
    if (!user) {
      toast.error("Please log in to access the dashboard");
      navigate("/auth");
    } else {
      setAuthChecked(true);
    }
  }, [user, navigate]);

  // Fetch releases
  const { data: releases, isLoading: releasesLoading } = useQuery({
    queryKey: ['releases', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error("User not authenticated");
      
      const { data, error } = await supabase
        .from('releases')
        .select('*, artists:artist_id (name), labels:label_id (name)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id && authChecked
  });

  // Fetch wallet
  const { data: wallet, isLoading: walletLoading } = useQuery({
    queryKey: ['wallet', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error("User not authenticated");
      
      const { data, error } = await supabase
        .from('wallets')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      return data || { balance: 0 };
    },
    enabled: !!user?.id && authChecked
  });

  // Mock data for charts
  const mockData = [
    { name: "Jan", total: 2400 },
    { name: "Feb", total: 1398 },
    { name: "Mar", total: 9800 },
    { name: "Apr", total: 3908 },
    { name: "May", total: 4800 },
    { name: "Jun", total: 3800 },
  ];

  const quickLinks = [
    {
      title: "Upload Music",
      description: "Submit your tracks for distribution",
      icon: <Upload className="h-6 w-6 text-primary" />,
      path: "/dashboard/upload",
    },
    {
      title: "My Releases",
      description: "View and manage your music",
      icon: <Music className="h-6 w-6 text-primary" />,
      path: "/dashboard/releases",
    },
    {
      title: "Wallet",
      description: "Check earnings and withdraw funds",
      icon: <Wallet className="h-6 w-6 text-primary" />,
      path: "/dashboard/wallet",
    },
    {
      title: "Royalty Reports",
      description: "Access your royalty statements",
      icon: <FileDown className="h-6 w-6 text-primary" />,
      path: "/dashboard/royalty-reports",
    },
    {
      title: "Copyright Removal",
      description: "Request YouTube copyright removals",
      icon: <Youtube className="h-6 w-6 text-primary" />,
      path: "/dashboard/copyright-removal",
    },
  ];

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <div className="flex items-center text-amber-500 bg-amber-100 dark:bg-amber-900/30 px-4 py-2 rounded-md">
          <AlertCircle className="h-5 w-5 mr-2" />
          <p>Authentication required. Please log in to continue.</p>
        </div>
        <Button onClick={() => navigate("/auth")}>
          Go to Login
        </Button>
      </div>
    );
  }

  if (releasesLoading || walletLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold mb-2">Welcome, {profile?.full_name}</h2>
        <p className="text-gray-400">
          {isAdmin ? "Manage your music distribution platform" : "Manage your music distribution"}
        </p>
      </div>

      {/* Quick Links */}
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-5">
        {quickLinks.map((link) => (
          <Card key={link.path} className="bg-gray-800 border-gray-700 hover:border-primary/50 transition-all">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-center mb-2">
                {link.icon}
              </div>
              <CardTitle className="text-white text-center text-lg">{link.title}</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-xs text-gray-400 mb-3">{link.description}</p>
              <Button asChild size="sm" variant="secondary" className="w-full">
                <Link to={link.path}>Go</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-white text-sm font-medium">Total Releases</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{releases?.length || 0}</div>
            <p className="text-xs text-gray-400 mt-1">All your music submissions</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-white text-sm font-medium">Current Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">₹{wallet?.balance || 0}</div>
            <p className="text-xs text-gray-400 mt-1">Available to withdraw</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-white text-sm font-medium">Pending Reviews</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {releases?.filter(r => r.status === 'pending_review').length || 0}
            </div>
            <p className="text-xs text-gray-400 mt-1">Releases awaiting approval</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-white text-sm font-medium">Live Releases</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {releases?.filter(r => r.status === 'live').length || 0}
            </div>
            <p className="text-xs text-gray-400 mt-1">Available on streaming platforms</p>
          </CardContent>
        </Card>
      </div>

      {/* Chart */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Earnings Overview</CardTitle>
          <CardDescription className="text-gray-400">
            Your music earnings for the past 6 months
          </CardDescription>
        </CardHeader>
        <CardContent className="pl-2">
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={mockData}>
              <XAxis
                dataKey="name"
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `₹${value}`}
              />
              <Tooltip 
                formatter={(value) => [`₹${value}`, 'Earnings']}
                contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '0.375rem' }}
                labelStyle={{ color: 'white' }}
              />
              <Bar dataKey="total" fill="#8884d8" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Recent Activity</CardTitle>
          <CardDescription className="text-gray-400">
            Your recent platform activity
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {releases && releases.length > 0 ? (
              releases.slice(0, 3).map((release) => (
                <div key={release.id} className="flex items-start gap-4 border-b border-gray-700 pb-4">
                  <div className="ml-2 flex-1">
                    <p className="text-sm font-medium text-white">
                      {release.status === 'pending_review' ? 'New release pending review' : 
                      release.status === 'approved' ? 'Release approved' : 
                      release.status === 'rejected' ? 'Release rejected' : 
                      release.status === 'live' ? 'Release now live' : 'Release status updated'}
                    </p>
                    <p className="text-xs text-gray-400">
                      Your song "{release.song_name}" by {release.artists?.name || 'Unknown'} is {release.status.replace('_', ' ')}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{new Date(release.created_at).toLocaleString()}</p>
                  </div>
                  <div className="w-12 h-12 flex-shrink-0">
                    <img 
                      src={release.cover_art_url}
                      alt={release.song_name}
                      className="w-full h-full object-cover rounded"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://placehold.co/100x100/333/white?text=NA";
                      }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-4">
                <p className="text-sm text-gray-400">No recent activity</p>
                <Button asChild variant="link" className="mt-2">
                  <Link to="/dashboard/upload">Upload your first release</Link>
                </Button>
              </div>
            )}
            
            {releases?.length > 3 && (
              <div className="text-center pt-2">
                <Button asChild variant="link">
                  <Link to="/dashboard/releases">View all releases</Link>
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
