
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ArrowDown, ArrowUp, CreditCard } from "lucide-react";

const CustomerWallet = () => {
  const handleWithdrawalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Withdrawal request submitted successfully!");
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold">Wallet</h2>
        <p className="text-gray-400">Manage your earnings and withdrawals</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Available Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">₹12,450.00</div>
            <p className="text-sm text-gray-400 mt-2">Last updated: May 5, 2025</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Total Earnings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">₹58,760.00</div>
            <p className="text-sm text-green-500 mt-2">+₹2,300 this month</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Request Withdrawal</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="upi" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-gray-900">
              <TabsTrigger value="upi">UPI</TabsTrigger>
              <TabsTrigger value="bank">Bank Account</TabsTrigger>
            </TabsList>
            <TabsContent value="upi" className="mt-4">
              <form onSubmit={handleWithdrawalSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="upi-id">UPI ID</Label>
                  <Input
                    id="upi-id"
                    placeholder="yourname@upi"
                    className="bg-gray-900 border-gray-700"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="amount-upi">Withdrawal Amount (₹)</Label>
                  <Input
                    id="amount-upi"
                    type="number"
                    min="500"
                    placeholder="Enter amount"
                    className="bg-gray-900 border-gray-700"
                    required
                  />
                  <p className="text-xs text-gray-400">Minimum withdrawal: ₹500</p>
                </div>
                <Button type="submit" className="w-full mt-2">Request Withdrawal</Button>
              </form>
            </TabsContent>
            <TabsContent value="bank" className="mt-4">
              <form onSubmit={handleWithdrawalSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="account-name">Account Holder Name</Label>
                  <Input
                    id="account-name"
                    placeholder="Enter account holder name"
                    className="bg-gray-900 border-gray-700"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="account-number">Account Number</Label>
                  <Input
                    id="account-number"
                    placeholder="Enter account number"
                    className="bg-gray-900 border-gray-700"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ifsc">IFSC Code</Label>
                  <Input
                    id="ifsc"
                    placeholder="Enter IFSC code"
                    className="bg-gray-900 border-gray-700"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="amount-bank">Withdrawal Amount (₹)</Label>
                  <Input
                    id="amount-bank"
                    type="number"
                    min="500"
                    placeholder="Enter amount"
                    className="bg-gray-900 border-gray-700"
                    required
                  />
                  <p className="text-xs text-gray-400">Minimum withdrawal: ₹500</p>
                </div>
                <Button type="submit" className="w-full mt-2">Request Withdrawal</Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Transaction History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-md bg-gray-900">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-green-500/20 flex items-center justify-center">
                  <ArrowDown className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <p className="font-medium">Royalty Earnings</p>
                  <p className="text-xs text-gray-400">May 1, 2025</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-green-500">+₹1,250.00</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 rounded-md bg-gray-900">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-red-500/20 flex items-center justify-center">
                  <ArrowUp className="h-5 w-5 text-red-500" />
                </div>
                <div>
                  <p className="font-medium">Withdrawal to UPI</p>
                  <p className="text-xs text-gray-400">April 25, 2025</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-red-500">-₹5,000.00</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 rounded-md bg-gray-900">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-green-500/20 flex items-center justify-center">
                  <ArrowDown className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <p className="font-medium">Royalty Earnings</p>
                  <p className="text-xs text-gray-400">April 1, 2025</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-green-500">+₹3,480.00</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 rounded-md bg-gray-900">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-red-500/20 flex items-center justify-center">
                  <ArrowUp className="h-5 w-5 text-red-500" />
                </div>
                <div>
                  <p className="font-medium">Withdrawal to Bank Account</p>
                  <p className="text-xs text-gray-400">March 15, 2025</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-red-500">-₹10,000.00</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomerWallet;
