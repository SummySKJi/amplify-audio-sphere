
import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Search, Loader2, UserCircle } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const AdminCustomers = () => {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');

  const { data: customers, isLoading } = useQuery({
    queryKey: ['admin-customers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    }
  });

  const updateUserStatusMutation = useMutation({
    mutationFn: async ({ userId, active }: { userId: string, active: boolean }) => {
      const { data, error } = await supabase
        .from('profiles')
        .update({ active })
        .eq('id', userId)
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-customers'] });
      toast.success('Customer status updated successfully');
    },
    onError: (error) => {
      console.error('Error updating customer status:', error);
      toast.error('Failed to update customer status');
    }
  });

  const handleToggleActive = (userId: string, currentStatus: boolean) => {
    updateUserStatusMutation.mutate({ 
      userId, 
      active: !currentStatus 
    });
  };

  const filteredCustomers = customers?.filter(customer => {
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    return (
      customer.full_name?.toLowerCase().includes(query) || 
      customer.email?.toLowerCase().includes(query)
    );
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold">Customer Management</h2>
        <p className="text-gray-400">Manage registered users</p>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="w-full md:w-96">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
            <Input
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-gray-800 border-gray-700 pl-10"
            />
          </div>
        </div>
        
        <div className="text-sm text-gray-400">
          {filteredCustomers?.length || 0} customers found
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid gap-4">
          <Card className="bg-gray-800 border-gray-700">
            <div className="p-4 grid grid-cols-12 font-medium text-gray-400 border-b border-gray-700">
              <div className="col-span-1">#</div>
              <div className="col-span-3">Name</div>
              <div className="col-span-3">Email</div>
              <div className="col-span-2 text-center">Role</div>
              <div className="col-span-2">Created</div>
              <div className="col-span-1 text-center">Status</div>
            </div>
            
            {filteredCustomers && filteredCustomers.length > 0 ? (
              filteredCustomers.map((customer, index) => (
                <div 
                  key={customer.id} 
                  className="p-4 grid grid-cols-12 items-center border-b border-gray-700/50 hover:bg-gray-700/30"
                >
                  <div className="col-span-1 text-gray-400">{index + 1}</div>
                  <div className="col-span-3 flex items-center gap-2">
                    <UserCircle className="h-6 w-6 text-gray-400" />
                    <span>{customer.full_name || 'Unknown'}</span>
                  </div>
                  <div className="col-span-3 text-gray-300 truncate">
                    {customer.email || 'No email'}
                  </div>
                  <div className="col-span-2 text-center">
                    <Badge className={customer.role === 'admin' ? 'bg-purple-600' : 'bg-blue-600'}>
                      {customer.role}
                    </Badge>
                  </div>
                  <div className="col-span-2 text-gray-400 text-sm">
                    {new Date(customer.created_at).toLocaleDateString()}
                  </div>
                  <div className="col-span-1 flex justify-center">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id={`user-active-${customer.id}`}
                        checked={customer.active}
                        onCheckedChange={() => handleToggleActive(customer.id, customer.active)}
                        disabled={updateUserStatusMutation.isPending}
                      />
                      <Label htmlFor={`user-active-${customer.id}`} className="sr-only">
                        {customer.active ? 'Active' : 'Inactive'}
                      </Label>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-gray-400">
                No customers found. Try adjusting your search.
              </div>
            )}
          </Card>
        </div>
      )}
    </div>
  );
};

export default AdminCustomers;
