
import { Card } from "@/components/ui/card";

const AdminPayouts = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold">Wallet & Payouts</h2>
        <p className="text-gray-400">Manage customer wallets and withdrawal requests</p>
      </div>
      
      <Card className="bg-gray-800 border-gray-700 p-6">
        <h3 className="text-2xl font-semibold mb-4">Wallet & Payout Management</h3>
        <p>This page will allow administrators to manage customer wallet balances and process withdrawal requests.</p>
      </Card>
    </div>
  );
};

export default AdminPayouts;
