
import { Card } from "@/components/ui/card";

const AdminCopyright = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold">Copyright Removal Requests</h2>
        <p className="text-gray-400">Manage copyright removal requests from customers</p>
      </div>
      
      <Card className="bg-gray-800 border-gray-700 p-6">
        <h3 className="text-2xl font-semibold mb-4">Copyright Request Management</h3>
        <p>This page will allow administrators to view and process copyright removal requests submitted by customers.</p>
      </Card>
    </div>
  );
};

export default AdminCopyright;
