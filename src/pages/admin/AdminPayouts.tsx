
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { CheckCircle2, Loader2, BankIcon, Wallet } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const statusColors: Record<string, string> = {
  'pending': 'bg-yellow-600 hover:bg-yellow-700',
  'processing': 'bg-blue-600 hover:bg-blue-700',
  'completed': 'bg-green-600 hover:bg-green-700',
  'rejected': 'bg-red-600 hover:bg-red-700',
};

const statusLabels: Record<string, string> = {
  'pending': 'Pending',
  'processing': 'Processing',
  'completed': 'Completed',
  'rejected': 'Rejected',
};

type FilterType = 'all' | 'pending' | 'processing' | 'completed' | 'rejected';

const AdminPayouts = () => {
  const queryClient = useQueryClient();
  const [tab, setTab] = useState('withdrawals');
  const [filter, setFilter] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [manageWalletForm, setManageWalletForm] = useState({
    userId: '',
    amount: '',
    description: '',
    operation: 'add' // 'add' or 'subtract'
  });
  
  // Fetch all withdrawal requests
  const { data: withdrawalRequests, isLoading: isLoadingWithdrawals } = useQuery({
    queryKey: ['withdrawal-requests'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('withdrawal_requests')
        .select(`
          *,
          profiles:user_id (full_name, email)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
  });

  // Fetch all users for wallet management
  const { data: users } = useQuery({
    queryKey: ['users-for-wallet'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, email')
        .eq('active', true)
        .order('full_name', { ascending: true });
      
      if (error) throw error;
      return data || [];
    },
    enabled: tab === 'wallet-management'
  });

  // Fetch wallets
  const { data: wallets, isLoading: isLoadingWallets } = useQuery({
    queryKey: ['wallets'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('wallets')
        .select(`
          *,
          profiles:user_id (full_name, email)
        `)
        .order('updated_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
    enabled: tab === 'wallet-management'
  });

  useEffect(() => {
    // Set admin notes when a request is selected
    if (selectedRequest) {
      setAdminNotes(selectedRequest.notes || '');
    } else {
      setAdminNotes('');
    }
  }, [selectedRequest]);

  // Update withdrawal request status mutation
  const updateWithdrawalMutation = useMutation({
    mutationFn: async ({ id, status, notes }: { id: string, status: string, notes: string }) => {
      const { data, error } = await supabase
        .from('withdrawal_requests')
        .update({ 
          status, 
          notes
        })
        .eq('id', id)
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['withdrawal-requests'] });
      setSelectedRequest(null);
      setAdminNotes('');
    }
  });

  // Manage wallet balance mutation
  const manageWalletMutation = useMutation({
    mutationFn: async ({ 
      userId, 
      amount, 
      description, 
      operation 
    }: { 
      userId: string, 
      amount: number, 
      description: string, 
      operation: 'add' | 'subtract' 
    }) => {
      // First get the current wallet
      const { data: wallet, error: walletError } = await supabase
        .from('wallets')
        .select('id, balance')
        .eq('user_id', userId)
        .single();
      
      if (walletError) throw walletError;
      
      if (!wallet) {
        throw new Error("Wallet not found for this user");
      }
      
      // Calculate new balance
      const newBalance = operation === 'add' 
        ? wallet.balance + amount 
        : Math.max(0, wallet.balance - amount); // Ensure balance doesn't go negative
      
      // Update wallet
      const { error: updateError } = await supabase
        .from('wallets')
        .update({ balance: newBalance })
        .eq('id', wallet.id);
      
      if (updateError) throw updateError;
      
      // Create transaction record
      const { error: transactionError } = await supabase
        .from('transactions')
        .insert({
          wallet_id: wallet.id,
          amount: operation === 'add' ? amount : -amount,
          type: operation === 'add' ? 'deposit' : 'withdrawal',
          description: description || (operation === 'add' ? 'Manual deposit by admin' : 'Manual withdrawal by admin')
        });
      
      if (transactionError) throw transactionError;
      
      return { userId, newBalance };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wallets'] });
      setManageWalletForm({
        userId: '',
        amount: '',
        description: '',
        operation: 'add'
      });
      toast.success('Wallet updated successfully');
    },
    onError: (error) => {
      console.error('Error managing wallet:', error);
      toast.error('Failed to update wallet: ' + error.message);
    }
  });

  // Filter withdrawal requests based on status filter and search query
  const getFilteredWithdrawals = () => {
    if (!withdrawalRequests) return [];
    
    return withdrawalRequests.filter((req) => {
      // Filter by status if not 'all'
      if (filter !== 'all' && req.status !== filter) {
        return false;
      }
      
      // Filter by search query
      const searchLower = searchQuery.toLowerCase();
      const userName = req.profiles?.full_name?.toLowerCase() || '';
      const userEmail = req.profiles?.email?.toLowerCase() || '';
      const accountName = req.account_holder_name?.toLowerCase() || '';
      const upiId = req.upi_id?.toLowerCase() || '';
      
      return userName.includes(searchLower) || 
             userEmail.includes(searchLower) || 
             accountName.includes(searchLower) || 
             upiId.includes(searchLower);
    });
  };

  // Filter wallets based on search query
  const getFilteredWallets = () => {
    if (!wallets) return [];
    
    if (!searchQuery) return wallets;
    
    return wallets.filter((wallet) => {
      const searchLower = searchQuery.toLowerCase();
      const userName = wallet.profiles?.full_name?.toLowerCase() || '';
      const userEmail = wallet.profiles?.email?.toLowerCase() || '';
      
      return userName.includes(searchLower) || userEmail.includes(searchLower);
    });
  };

  const filteredWithdrawals = getFilteredWithdrawals();
  const filteredWallets = getFilteredWallets();

  const handleStatusUpdate = (status: string) => {
    if (!selectedRequest) return;
    
    updateWithdrawalMutation.mutate({
      id: selectedRequest.id,
      status,
      notes: adminNotes
    }, {
      onSuccess: () => {
        toast.success(`Request marked as ${status}`);
      },
      onError: (error) => {
        console.error('Error updating request:', error);
        toast.error(`Failed to update request: ${error.message || 'Unknown error'}`);
      }
    });
  };

  const handleManageWallet = () => {
    if (!manageWalletForm.userId || !manageWalletForm.amount) {
      toast.error('Please select a user and enter an amount');
      return;
    }
    
    const amount = parseFloat(manageWalletForm.amount);
    if (isNaN(amount) || amount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    
    manageWalletMutation.mutate({
      userId: manageWalletForm.userId,
      amount,
      description: manageWalletForm.description,
      operation: manageWalletForm.operation
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold">Wallet & Payouts</h2>
        <p className="text-gray-400">Manage customer wallets and withdrawal requests</p>
      </div>

      <Tabs value={tab} onValueChange={setTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 bg-gray-800">
          <TabsTrigger value="withdrawals">Withdrawal Requests</TabsTrigger>
          <TabsTrigger value="wallet-management">Wallet Management</TabsTrigger>
        </TabsList>

        {/* Common filters for both tabs */}
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          {tab === 'withdrawals' && (
            <div className="w-full md:w-64">
              <Select value={filter} onValueChange={(value: FilterType) => setFilter(value)}>
                <SelectTrigger className="bg-gray-800 border-gray-700">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="w-full md:w-96">
            <Input
              placeholder={tab === 'withdrawals' 
                ? "Search by name, email, account..." 
                : "Search by name or email..."
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-gray-800 border-gray-700"
            />
          </div>
        </div>

        {/* Withdrawal Requests Tab */}
        <TabsContent value="withdrawals" className="mt-0">
          {isLoadingWithdrawals ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <Card className="bg-gray-800 border-gray-700 overflow-hidden">
              <div className="p-4 grid grid-cols-12 font-medium text-gray-400 border-b border-gray-700">
                <div className="col-span-1">#</div>
                <div className="col-span-2">Customer</div>
                <div className="col-span-2">Amount</div>
                <div className="col-span-3">Payment Details</div>
                <div className="col-span-2">Date</div>
                <div className="col-span-2 text-center">Status</div>
              </div>
              
              {filteredWithdrawals.length > 0 ? (
                filteredWithdrawals.map((request, index) => (
                  <div 
                    key={request.id} 
                    className="p-4 grid grid-cols-12 items-center border-b border-gray-700/50 hover:bg-gray-700/30 cursor-pointer"
                    onClick={() => setSelectedRequest(request)}
                  >
                    <div className="col-span-1 text-gray-400">{index + 1}</div>
                    <div className="col-span-2">
                      <div className="font-medium">{request.profiles?.full_name || 'Unknown'}</div>
                      <div className="text-xs text-gray-400 truncate">{request.profiles?.email}</div>
                    </div>
                    <div className="col-span-2 font-bold">₹{request.amount}</div>
                    <div className="col-span-3">
                      {request.upi_id ? (
                        <div className="text-sm">
                          <span className="text-gray-400">UPI:</span> {request.upi_id}
                        </div>
                      ) : (
                        <div className="text-sm">
                          <div><span className="text-gray-400">A/C:</span> {request.account_holder_name}</div>
                          <div className="text-xs text-gray-400">
                            {request.account_number && `${request.account_number.substring(0, 4)}...`}
                            {request.ifsc_code && ` | IFSC: ${request.ifsc_code}`}
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="col-span-2 text-gray-400 text-sm">
                      {new Date(request.created_at).toLocaleDateString()}
                    </div>
                    <div className="col-span-2 text-center">
                      <Badge className={statusColors[request.status]}>
                        {statusLabels[request.status]}
                      </Badge>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-gray-400">
                  No withdrawal requests found. Try adjusting your filters or search query.
                </div>
              )}
            </Card>
          )}
        </TabsContent>

        {/* Wallet Management Tab */}
        <TabsContent value="wallet-management" className="mt-0">
          <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
            {/* Add/Subtract Balance Form */}
            <Card className="bg-gray-800 border-gray-700 lg:col-span-1">
              <div className="p-6 space-y-6">
                <h3 className="text-xl font-bold mb-4">Manage Wallet Balance</h3>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="userId">Select Customer</Label>
                    <Select 
                      value={manageWalletForm.userId} 
                      onValueChange={(value) => setManageWalletForm(prev => ({ ...prev, userId: value }))}
                    >
                      <SelectTrigger className="bg-gray-900 border-gray-700 mt-1">
                        <SelectValue placeholder="Select a customer" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-900 border-gray-700 max-h-80">
                        {users?.map((user) => (
                          <SelectItem key={user.id} value={user.id}>
                            {user.full_name} ({user.email})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="operation">Operation</Label>
                    <Select 
                      value={manageWalletForm.operation} 
                      onValueChange={(value: 'add' | 'subtract') => 
                        setManageWalletForm(prev => ({ ...prev, operation: value }))
                      }
                    >
                      <SelectTrigger className="bg-gray-900 border-gray-700 mt-1">
                        <SelectValue placeholder="Select operation" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-900 border-gray-700">
                        <SelectItem value="add">Add Balance</SelectItem>
                        <SelectItem value="subtract">Subtract Balance</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="amount">Amount (₹)</Label>
                    <Input 
                      id="amount"
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="Enter amount"
                      className="bg-gray-900 border-gray-700 mt-1"
                      value={manageWalletForm.amount}
                      onChange={(e) => setManageWalletForm(prev => ({ ...prev, amount: e.target.value }))}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="description">Description (Optional)</Label>
                    <Input 
                      id="description"
                      placeholder="e.g., Royalty payment for April 2025"
                      className="bg-gray-900 border-gray-700 mt-1"
                      value={manageWalletForm.description}
                      onChange={(e) => setManageWalletForm(prev => ({ ...prev, description: e.target.value }))}
                    />
                  </div>
                  
                  <Button 
                    onClick={handleManageWallet}
                    className="w-full"
                    disabled={manageWalletMutation.isPending || !manageWalletForm.userId || !manageWalletForm.amount}
                  >
                    {manageWalletMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Wallet className="mr-2 h-4 w-4" />
                        {manageWalletForm.operation === 'add' ? 'Add to Wallet' : 'Subtract from Wallet'}
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </Card>
            
            {/* Wallets List */}
            <Card className="bg-gray-800 border-gray-700 lg:col-span-2">
              <div className="p-6 space-y-4">
                <h3 className="text-xl font-bold">Customer Wallets</h3>
                
                {isLoadingWallets ? (
                  <div className="flex items-center justify-center h-64">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : (
                  <div className="overflow-hidden rounded-md border border-gray-700">
                    <div className="grid grid-cols-4 bg-gray-700/50 p-4 font-medium text-gray-300">
                      <div>Customer</div>
                      <div>Current Balance</div>
                      <div>Created</div>
                      <div>Last Updated</div>
                    </div>
                    
                    <div className="max-h-[500px] overflow-auto">
                      {filteredWallets.length > 0 ? (
                        filteredWallets.map((wallet) => (
                          <div 
                            key={wallet.id} 
                            className="grid grid-cols-4 items-center p-4 border-t border-gray-700 hover:bg-gray-700/30"
                          >
                            <div>
                              <div className="font-medium">{wallet.profiles?.full_name || 'Unknown'}</div>
                              <div className="text-xs text-gray-400">{wallet.profiles?.email}</div>
                            </div>
                            <div className="font-bold">
                              ₹{wallet.balance}
                            </div>
                            <div className="text-sm text-gray-400">
                              {new Date(wallet.created_at).toLocaleDateString()}
                            </div>
                            <div className="text-sm text-gray-400">
                              {new Date(wallet.updated_at).toLocaleDateString()}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-8 text-center text-gray-400">
                          No wallets found matching your search.
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Withdrawal Request Detail Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <Card className="bg-gray-800 border-gray-700 w-full max-w-3xl">
            <div className="p-6 space-y-6">
              <div className="flex justify-between items-start">
                <h3 className="text-xl font-bold">Withdrawal Request Details</h3>
                <Button variant="ghost" onClick={() => setSelectedRequest(null)}>×</Button>
              </div>
              
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-gray-400">Customer</Label>
                  <p>{selectedRequest.profiles?.full_name}</p>
                  <p className="text-sm text-gray-400">{selectedRequest.profiles?.email}</p>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-gray-400">Amount</Label>
                  <p className="text-2xl font-bold">₹{selectedRequest.amount}</p>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-gray-400">Payment Method</Label>
                  <div className="flex items-center space-x-2">
                    <BankIcon className="h-5 w-5 text-gray-400" />
                    <span>
                      {selectedRequest.upi_id ? 'UPI' : 'Bank Transfer'}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-gray-400">Request Date</Label>
                  <p>{new Date(selectedRequest.created_at).toLocaleString()}</p>
                </div>
                
                <div className="space-y-2 md:col-span-2">
                  <Label className="text-gray-400">Payment Details</Label>
                  {selectedRequest.upi_id ? (
                    <div className="p-3 bg-gray-900 rounded-md">
                      <p><span className="text-gray-400">UPI ID:</span> {selectedRequest.upi_id}</p>
                    </div>
                  ) : (
                    <div className="p-3 bg-gray-900 rounded-md">
                      <p><span className="text-gray-400">Account Holder:</span> {selectedRequest.account_holder_name}</p>
                      <p><span className="text-gray-400">Account Number:</span> {selectedRequest.account_number}</p>
                      <p><span className="text-gray-400">IFSC Code:</span> {selectedRequest.ifsc_code}</p>
                    </div>
                  )}
                </div>
                
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="adminNotes">Admin Notes</Label>
                  <Textarea 
                    id="adminNotes"
                    placeholder="Add notes about this withdrawal request..."
                    className="bg-gray-900 border-gray-700 mt-1"
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                  />
                </div>
                
                <div className="md:col-span-2">
                  <Label className="text-gray-400 mb-2 block">Update Status</Label>
                  <div className="flex flex-wrap gap-3">
                    {selectedRequest.status !== 'processing' && (
                      <Button 
                        onClick={() => handleStatusUpdate('processing')}
                        variant="outline"
                        className="bg-blue-600/20 border-blue-600 text-blue-100"
                        disabled={updateWithdrawalMutation.isPending}
                      >
                        {updateWithdrawalMutation.isPending ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : null}
                        Mark as Processing
                      </Button>
                    )}
                    
                    {selectedRequest.status !== 'completed' && (
                      <Button 
                        onClick={() => handleStatusUpdate('completed')}
                        className="bg-green-600"
                        disabled={updateWithdrawalMutation.isPending}
                      >
                        {updateWithdrawalMutation.isPending ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <CheckCircle2 className="mr-2 h-4 w-4" />
                        )}
                        Mark as Completed
                      </Button>
                    )}
                    
                    {selectedRequest.status !== 'rejected' && (
                      <Button 
                        onClick={() => handleStatusUpdate('rejected')}
                        variant="destructive"
                        disabled={updateWithdrawalMutation.isPending}
                      >
                        {updateWithdrawalMutation.isPending ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : null}
                        Mark as Rejected
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AdminPayouts;
