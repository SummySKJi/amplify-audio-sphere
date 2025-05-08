
import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

const Dashboard = () => {
  const { user, profile, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/auth");
    }
  }, [user, navigate]);

  const mockData = [
    {
      name: "Jan",
      total: 2400,
    },
    {
      name: "Feb",
      total: 1398,
    },
    {
      name: "Mar",
      total: 9800,
    },
    {
      name: "Apr",
      total: 3908,
    },
    {
      name: "May",
      total: 4800,
    },
    {
      name: "Jun",
      total: 3800,
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold mb-2">Welcome, {profile?.full_name}</h2>
        <p className="text-gray-400">
          {isAdmin ? "Manage your music distribution platform" : "Manage your music distribution"}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-white text-sm font-medium">Total Releases</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">12</div>
            <p className="text-xs text-gray-400 mt-1">+2 from last month</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-white text-sm font-medium">Total Earnings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">₹42,560</div>
            <p className="text-xs text-green-500 mt-1">+10% from last month</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-white text-sm font-medium">Pending Reviews</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">3</div>
            <p className="text-xs text-gray-400 mt-1">Updated 30 mins ago</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-white text-sm font-medium">Total Artists</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">8</div>
            <p className="text-xs text-gray-400 mt-1">+1 new this week</p>
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
            <div className="flex items-start gap-4 border-b border-gray-700 pb-4">
              <div className="ml-2">
                <p className="text-sm font-medium text-white">New release pending review</p>
                <p className="text-xs text-gray-400">Your song "Summer Nights" is pending review</p>
                <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-start gap-4 border-b border-gray-700 pb-4">
              <div className="ml-2">
                <p className="text-sm font-medium text-white">New earnings added</p>
                <p className="text-xs text-gray-400">₹1,245 has been added to your wallet</p>
                <p className="text-xs text-gray-500 mt-1">Yesterday</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="ml-2">
                <p className="text-sm font-medium text-white">Release is now live</p>
                <p className="text-xs text-gray-400">Your song "Midnight Dreams" is now live on all platforms</p>
                <p className="text-xs text-gray-500 mt-1">3 days ago</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
