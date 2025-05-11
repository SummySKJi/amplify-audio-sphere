
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Loader2, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface Platform {
  id: string;
  name: string;
  logo_url?: string;
  is_main: boolean;
}

const AdminPlatforms = () => {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingPlatform, setEditingPlatform] = useState<Platform | null>(null);
  const [formData, setFormData] = useState<Omit<Platform, 'id'>>({
    name: '',
    logo_url: '',
    is_main: false
  });

  // Fetch platforms
  const { data: platforms, isLoading } = useQuery({
    queryKey: ['platforms'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('platforms')
        .select('*')
        .order('name', { ascending: true });
      
      if (error) throw error;
      return data || [];
    }
  });

  // Create platform mutation
  const createPlatformMutation = useMutation({
    mutationFn: async (platform: Omit<Platform, 'id'>) => {
      const { data, error } = await supabase
        .from('platforms')
        .insert(platform)
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['platforms'] });
      toast.success('Platform added successfully');
      setIsDialogOpen(false);
      resetForm();
    },
    onError: (error) => {
      console.error('Error creating platform:', error);
      toast.error('Failed to add platform');
    }
  });

  // Update platform mutation
  const updatePlatformMutation = useMutation({
    mutationFn: async ({ id, ...platform }: Platform) => {
      const { data, error } = await supabase
        .from('platforms')
        .update(platform)
        .eq('id', id)
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['platforms'] });
      toast.success('Platform updated successfully');
      setIsDialogOpen(false);
      resetForm();
    },
    onError: (error) => {
      console.error('Error updating platform:', error);
      toast.error('Failed to update platform');
    }
  });

  // Delete platform mutation
  const deletePlatformMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('platforms')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['platforms'] });
      toast.success('Platform deleted successfully');
    },
    onError: (error) => {
      console.error('Error deleting platform:', error);
      toast.error('Failed to delete platform');
    }
  });

  const handleFormChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (!formData.name) {
      toast.error('Platform name is required');
      return;
    }

    if (editingPlatform) {
      updatePlatformMutation.mutate({ ...formData, id: editingPlatform.id });
    } else {
      createPlatformMutation.mutate(formData);
    }
  };

  const openEditDialog = (platform: Platform) => {
    setEditingPlatform(platform);
    setFormData({
      name: platform.name,
      logo_url: platform.logo_url || '',
      is_main: platform.is_main
    });
    setIsDialogOpen(true);
  };

  const handleDeletePlatform = (id: string) => {
    if (confirm('Are you sure you want to delete this platform?')) {
      deletePlatformMutation.mutate(id);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      logo_url: '',
      is_main: false
    });
    setEditingPlatform(null);
  };

  const filteredPlatforms = platforms?.filter(platform => {
    if (!searchQuery) return true;
    return platform.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold">Platform Management</h2>
        <p className="text-gray-400">Manage distribution platforms</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="w-full md:w-96">
          <Input
            placeholder="Search platforms..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-gray-800 border-gray-700"
          />
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Platform
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-gray-800 border-gray-700">
            <DialogHeader>
              <DialogTitle>
                {editingPlatform ? 'Edit Platform' : 'Add New Platform'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Platform Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., Spotify"
                  value={formData.name}
                  onChange={(e) => handleFormChange('name', e.target.value)}
                  className="bg-gray-900 border-gray-700"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="logo_url">Logo URL (optional)</Label>
                <Input
                  id="logo_url"
                  placeholder="https://example.com/logo.png"
                  value={formData.logo_url}
                  onChange={(e) => handleFormChange('logo_url', e.target.value)}
                  className="bg-gray-900 border-gray-700"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="is_main"
                  checked={formData.is_main}
                  onCheckedChange={(checked) => handleFormChange('is_main', checked)}
                />
                <Label htmlFor="is_main">
                  Main Platform (Featured on homepage)
                </Label>
              </div>
              
              <div className="pt-4 flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsDialogOpen(false);
                    resetForm();
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={createPlatformMutation.isPending || updatePlatformMutation.isPending}
                >
                  {(createPlatformMutation.isPending || updatePlatformMutation.isPending) ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : editingPlatform ? 'Update Platform' : 'Add Platform'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {filteredPlatforms?.map((platform) => (
            <Card key={platform.id} className="bg-gray-800 border-gray-700 overflow-hidden">
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-4">
                    {platform.logo_url ? (
                      <img
                        src={platform.logo_url}
                        alt={platform.name}
                        className="h-10 w-10 object-contain"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://placehold.co/100x100/333/white?text=DSP';
                        }}
                      />
                    ) : (
                      <div className="h-10 w-10 bg-gray-700 rounded flex items-center justify-center text-xl font-bold">
                        {platform.name.slice(0, 1)}
                      </div>
                    )}
                    <div>
                      <h3 className="text-lg font-semibold">{platform.name}</h3>
                      {platform.is_main && (
                        <span className="text-xs text-primary">Featured Platform</span>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openEditDialog(platform)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-500 hover:text-red-600"
                      onClick={() => handleDeletePlatform(platform.id)}
                      disabled={deletePlatformMutation.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}

          {filteredPlatforms?.length === 0 && (
            <Card className="bg-gray-800 border-gray-700 col-span-full p-8 text-center">
              <p className="text-gray-400">
                No platforms found. Add your first platform by clicking the "Add Platform" button.
              </p>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminPlatforms;
