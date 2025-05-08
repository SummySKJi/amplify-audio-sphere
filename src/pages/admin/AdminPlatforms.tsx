
import { Card } from "@/components/ui/card";

const AdminPlatforms = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold">Platform Management</h2>
        <p className="text-gray-400">Manage distribution platforms</p>
      </div>
      
      <Card className="bg-gray-800 border-gray-700 p-6">
        <h3 className="text-2xl font-semibold mb-4">Platform Management Dashboard</h3>
        <p>This page will allow administrators to manage the list of music distribution platforms.</p>
      </Card>
    </div>
  );
};

export default AdminPlatforms;
