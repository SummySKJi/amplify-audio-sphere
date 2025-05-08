
import { Card } from "@/components/ui/card";

const AdminEntities = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold">Artists & Labels</h2>
        <p className="text-gray-400">Manage artists and music labels</p>
      </div>
      
      <Card className="bg-gray-800 border-gray-700 p-6">
        <h3 className="text-2xl font-semibold mb-4">Entity Management Dashboard</h3>
        <p>This page will allow administrators to view, edit and manage artists and labels.</p>
      </Card>
    </div>
  );
};

export default AdminEntities;
