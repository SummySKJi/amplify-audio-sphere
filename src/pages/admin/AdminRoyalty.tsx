
import { Card } from "@/components/ui/card";

const AdminRoyalty = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold">Royalty Reports</h2>
        <p className="text-gray-400">Upload and manage royalty reports</p>
      </div>
      
      <Card className="bg-gray-800 border-gray-700 p-6">
        <h3 className="text-2xl font-semibold mb-4">Royalty Report Management</h3>
        <p>This page will allow administrators to upload royalty reports for customers.</p>
      </Card>
    </div>
  );
};

export default AdminRoyalty;
