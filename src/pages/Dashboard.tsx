
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

// This is a placeholder Dashboard that will be implemented in the future
const Dashboard = () => {
  const navigate = useNavigate();
  
  // Simulate authentication check
  useEffect(() => {
    // In a real app, we would check if the user is authenticated
    // For now, we'll just display this placeholder page
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="bg-black/50 border-b border-white/10 py-4">
        <div className="container mx-auto px-6 flex justify-between items-center">
          <Link to="/" className="text-xl font-bold text-gradient">
            IND Distribution
          </Link>
          <Button 
            variant="outline" 
            className="border-white/10 hover:bg-white/5"
            onClick={() => {
              // Simulate logout
              navigate('/');
            }}
          >
            Sign Out
          </Button>
        </div>
      </header>
      
      <div className="flex-grow flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold mb-4">Welcome to IND Distribution</h1>
          <p className="mb-6 text-gray-300">
            Your dashboard is currently under development. Soon you'll be able to upload music,
            track royalties, and manage your artist profile here.
          </p>
          <Link to="/">
            <Button className="btn-primary">Return to Home</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
