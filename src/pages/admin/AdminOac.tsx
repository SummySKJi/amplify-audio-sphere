
import { Card } from "@/components/ui/card";

const AdminOac = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold">OAC Requests</h2>
        <p className="text-gray-400">Manage Official Artist Channel requests</p>
      </div>
      
      <Card className="bg-gray-800 border-gray-700 p-6">
        <h3 className="text-2xl font-semibold mb-4">OAC Request Management</h3>
        <p>This page will allow administrators to view and process Official Artist Channel requests for YouTube.</p>
      </Card>
    </div>
  );
};

export default AdminOac;
