
import { Card } from "@/components/ui/card";

const AdminCustomers = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold">Customer Management</h2>
        <p className="text-gray-400">Manage registered users</p>
      </div>
      
      <Card className="bg-gray-800 border-gray-700 p-6">
        <h3 className="text-2xl font-semibold mb-4">Customer Management Dashboard</h3>
        <p>This page will allow administrators to view and manage customer accounts.</p>
      </Card>
    </div>
  );
};

export default AdminCustomers;
