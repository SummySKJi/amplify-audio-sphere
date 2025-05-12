
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Music, Upload, Wallet, FileDown, Youtube, AlertCircle, Users, Building2 } from "lucide-react";
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

  // Fetch dashboard data for admin or customer
  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ['dashboard-data', user?.id, isAdmin],
    queryFn: async () => {
      if (!user?.id) throw new Error("User not authenticated");
      
      // Different queries for admin vs customer
      if (isAdmin) {
        // Admin dashboard data
        const [
          customersRes,
          releasesRes, 
          artistsRes, 
          labelsRes,
          pendingReleasesRes,
          withdrawalRequestsRes,
          copyrightRequestsRes,
          oacRequestsRes,
          liveReleasesRes,
          walletsRes
        ] = await Promise.all([
          supabase.from('profiles').select('count').eq('role', 'customer').single(),
          supabase.from('releases').select('count').single(),
          supabase.from('artists').select('count').single(),
          supabase.from('labels').select('count').single(),
          supabase.from('releases').select('count').eq('status', 'pending_review').single(),
          supabase.from('withdrawal_requests').select('count').eq('status', 'pending').single(),
          supabase.from('copyright_removal_requests').select('count').eq('status', 'pending').single(),
          supabase.from('oac_requests').select('count').eq('status', 'pending').single(),
          supabase.from('releases').select('count').eq('status', 'live').single(),
          supabase.from('wallets').select('sum(balance)').single()
        ]);
        
        return {
          totalCustomers: customersRes.data?.count || 0,
          totalReleases: releasesRes.data?.count || 0,
          totalArtists: artistsRes.data?.count || 0,
          totalLabels: labelsRes.data?.count || 0,
          pendingReleases: pendingReleasesRes.data?.count || 0,
          pendingWithdrawals: withdrawalRequestsRes.data?.count || 0,
          pendingCopyrightRequests: copyrightRequestsRes.data?.count || 0,
          pendingOacRequests: oacRequestsRes.data?.count || 0,
          liveReleases: liveReleasesRes.data?.count || 0,
          totalEarnings: walletsRes.data?.sum || 0
        };
      } else {
        // Customer dashboard data
        const [releasesRes, walletRes, artistsRes, labelsRes] = await Promise.all([
          supabase.from('releases').select('*').eq('user_id', user.id),
          supabase.from('wallets').select('*').eq('user_id', user.id).single(),
          supabase.from('artists').select('count').eq('user_id', user.id).single(),
          supabase.from('labels').select('count').eq('user_id', user.id).single()
        ]);
        
        return {
          releases: releasesRes.data || [],
          pendingReleases: releasesRes.data?.filter(r => r.status === 'pending_review').length || 0,
          liveReleases: releasesRes.data?.filter(r => r.status === 'live').length || 0,
          wallet: walletRes.data || { balance: 0 },
          totalArtists: artistsRes.data?.count || 0,
          totalLabels: labelsRes.data?.count || 0
        };
      }
    },
    enabled: !!user?.id && authChecked
  });

  // Fetch recent activity
  const { data: recentActivity } = useQuery({
    queryKey: ['recent-activity', user?.id, isAdmin],
    queryFn: async () => {
      if (!user?.id) throw new Error("User not authenticated");

      if (isAdmin) {
        // Admin recent activity (various entities)
        const [releasesRes, withdrawalsRes, copyrightRes, oacRes] = await Promise.all([
          supabase.from('releases')
            .select('*, artists:artist_id (name), profiles:user_id (full_name)')
            .order('created_at', { ascending: false })
            .limit(5),
          supabase.from('withdrawal_requests')
            .select('*, profiles:user_id (full_name)')
            .order('created_at', { ascending: false })
            .limit(3),
          supabase.from('copyright_removal_requests')
            .select('*, profiles:user_id (full_name)')
            .order('created_at', { ascending: false })
            .limit(3),
          supabase.from('oac_requests')
            .select('*, profiles:user_id (full_name)')
            .order('created_at', { ascending: false })
            .limit(3)
        ]);

        // Combine different types of activities
        const activities = [
          ...(releasesRes.data || []).map(r => ({
            type: 'release',
            id: r.id,
            title: `New release: ${r.song_name || 'Untitled'}`,
            description: `By ${r.artists?.name || 'Unknown'} from ${r.profiles?.full_name || 'Unknown'}`,
            status: r.status,
            date: r.created_at,
            coverUrl: r.cover_art_url
          })),
          ...(withdrawalsRes.data || []).map(w => ({
            type: 'withdrawal',
            id: w.id,
            title: `Withdrawal request: ₹${w.amount || 0}`,
            description: `From ${w.profiles?.full_name || 'Unknown'}`,
            status: w.status,
            date: w.created_at
          })),
          ...(copyrightRes.data || []).map(c => ({
            type: 'copyright',
            id: c.id,
            title: `Copyright removal request`,
            description: `From ${c.profiles?.full_name || 'Unknown'}`,
            status: c.status,
            date: c.created_at
          })),
          ...(oacRes.data || []).map(o => ({
            type: 'oac',
            id: o.id,
            title: `OAC request`,
            description: `From ${o.profiles?.full_name || 'Unknown'}`,
            status: o.status,
            date: o.created_at
          }))
        ];

        // Sort by date
        activities.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        
        return activities.slice(0, 5); // Return only 5 most recent
      } else {
        // Customer recent activity (just releases)
        const { data } = await supabase
          .from('releases')
          .select('*, artists:artist_id (name), labels:label_id (name)')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(3);
        
        return data || [];
      }
    },
    enabled: !!user?.id && authChecked
  });

  // Empty earnings data - no more demo data
  const emptyEarningsData = [
    { name: "Jan", total: 0 },
    { name: "Feb", total: 0 },
    { name: "Mar", total: 0 },
    { name: "Apr", total: 0 },
    { name: "May", total: 0 },
    { name: "Jun", total: 0 },
  ];

  // Quick links for customer vs admin
  const quickLinks = isAdmin ? [
    {
      title: "Review Music",
      description: "Review pending music submissions",
      icon: <Music className="h-6 w-6 text-primary" />,
      path: "/dashboard/music",
    },
    {
      title: "Customers",
      description: "Manage user accounts",
      icon: <Users className="h-6 w-6 text-primary" />,
      path: "/dashboard/customers",
    },
    {
      title: "Artists & Labels",
      description: "Manage entities",
      icon: <Building2 className="h-6 w-6 text-primary" />,
      path: "/dashboard/entities",
    },
    {
      title: "Payouts",
      description: "Process withdrawal requests",
      icon: <Wallet className="h-6 w-6 text-primary" />,
      path: "/dashboard/payouts",
    },
    {
      title: "Content Requests",
      description: "Copyright & OAC requests",
      icon: <Youtube className="h-6 w-6 text-primary" />,
      path: "/dashboard/copyright-requests",
    },
  ] : [
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

  if (isLoading) {
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
      {isAdmin ? (
        // Admin Stats
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-white text-sm font-medium">Total Customers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{dashboardData?.totalCustomers || 0}</div>
              <p className="text-xs text-gray-400 mt-1">Registered users</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-white text-sm font-medium">Total Releases</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{dashboardData?.totalReleases || 0}</div>
              <p className="text-xs text-gray-400 mt-1">Music submissions</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-white text-sm font-medium">Music in Review</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{dashboardData?.pendingReleases || 0}</div>
              <p className="text-xs text-gray-400 mt-1">
                <Link to="/dashboard/music" className="hover:underline">Pending review</Link>
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-white text-sm font-medium">Live Releases</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{dashboardData?.liveReleases || 0}</div>
              <p className="text-xs text-gray-400 mt-1">Active on platforms</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-white text-sm font-medium">Total Artists</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{dashboardData?.totalArtists || 0}</div>
              <p className="text-xs text-gray-400 mt-1">Registered artists</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-white text-sm font-medium">Total Labels</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{dashboardData?.totalLabels || 0}</div>
              <p className="text-xs text-gray-400 mt-1">Registered labels</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-white text-sm font-medium">Pending Withdrawals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{dashboardData?.pendingWithdrawals || 0}</div>
              <p className="text-xs text-gray-400 mt-1">
                <Link to="/dashboard/payouts" className="hover:underline">Awaiting processing</Link>
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-white text-sm font-medium">Total Balance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">₹{dashboardData?.totalEarnings || 0}</div>
              <p className="text-xs text-gray-400 mt-1">All customer wallets</p>
            </CardContent>
          </Card>
        </div>
      ) : (
        // Customer Stats
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-white text-sm font-medium">Total Releases</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{dashboardData?.releases?.length || 0}</div>
              <p className="text-xs text-gray-400 mt-1">All your music submissions</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-white text-sm font-medium">Current Balance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">₹{dashboardData?.wallet?.balance || 0}</div>
              <p className="text-xs text-gray-400 mt-1">Available to withdraw</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-white text-sm font-medium">Pending Reviews</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{dashboardData?.pendingReleases || 0}</div>
              <p className="text-xs text-gray-400 mt-1">Releases awaiting approval</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-white text-sm font-medium">Live Releases</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{dashboardData?.liveReleases || 0}</div>
              <p className="text-xs text-gray-400 mt-1">Available on streaming platforms</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Chart */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Earnings Overview</CardTitle>
          <CardDescription className="text-gray-400">
            {isAdmin ? "Platform earnings for the past 6 months" : "Your music earnings for the past 6 months"}
          </CardDescription>
        </CardHeader>
        <CardContent className="pl-2">
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={emptyEarningsData}>
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
            {isAdmin ? "Recent platform activity" : "Your recent platform activity"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {isAdmin ? (
              // Admin activity
              recentActivity && recentActivity.length > 0 ? (
                recentActivity.map((activity) => (
                  <div key={`${activity.type}-${activity.id}`} className="flex items-start gap-4 border-b border-gray-700 pb-4">
                    <div className="ml-2 flex-1">
                      <p className="text-sm font-medium text-white">{activity.title}</p>
                      <p className="text-xs text-gray-400">{activity.description}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(activity.date).toLocaleString()}
                      </p>
                    </div>
                    {activity.type === 'release' && activity.coverUrl && (
                      <div className="w-12 h-12 flex-shrink-0">
                        <img 
                          src={activity.coverUrl}
                          alt="Cover"
                          className="w-full h-full object-cover rounded"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "https://placehold.co/100x100/333/white?text=NA";
                          }}
                        />
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-sm text-gray-400">No recent activity</p>
                  <Button asChild variant="link" className="mt-2">
                    <Link to="/dashboard/music">Start by reviewing submitted music</Link>
                  </Button>
                </div>
              )
            ) : (
              // Customer activity
              recentActivity && recentActivity.length > 0 ? (
                recentActivity.map((release) => (
                  <div key={release.id} className="flex items-start gap-4 border-b border-gray-700 pb-4">
                    <div className="ml-2 flex-1">
                      <p className="text-sm font-medium text-white">
                        {release.status === 'pending_review' ? 'New release pending review' : 
                        release.status === 'approved' ? 'Release approved' : 
                        release.status === 'rejected' ? 'Release rejected' : 
                        release.status === 'live' ? 'Release now live' : 'Release status updated'}
                      </p>
                      <p className="text-xs text-gray-400">
                        Your song "{release.song_name || 'Untitled'}" by {release.artists?.name || 'Unknown'} is {(release.status || '').replace('_', ' ')}
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
                <div className="text-center py-8">
                  <p className="text-sm text-gray-400">No recent activity</p>
                  <Button asChild variant="link" className="mt-2">
                    <Link to="/dashboard/upload">Upload your first release</Link>
                  </Button>
                </div>
              )
            )}
            
            {isAdmin && recentActivity?.length > 0 ? (
              <div className="text-center pt-2">
                <Button asChild variant="link">
                  <Link to="/dashboard/music">View all music</Link>
                </Button>
              </div>
            ) : recentActivity?.length > 0 && (
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
