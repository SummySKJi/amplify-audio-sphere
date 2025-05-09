
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const statusColors: Record<string, string> = {
  'pending_review': 'bg-yellow-600 hover:bg-yellow-700',
  'approved': 'bg-green-600 hover:bg-green-700',
  'rejected': 'bg-red-600 hover:bg-red-700',
  'live': 'bg-blue-600 hover:bg-blue-700',
  'takedown_requested': 'bg-purple-600 hover:bg-purple-700',
  'takedown_completed': 'bg-gray-600 hover:bg-gray-700',
};

const statusLabels: Record<string, string> = {
  'pending_review': 'Pending Review',
  'approved': 'Approved',
  'rejected': 'Rejected',
  'live': 'Live',
  'takedown_requested': 'Takedown Requested',
  'takedown_completed': 'Takedown Completed',
};

// Define types
type ReleaseStatus = 'pending_review' | 'approved' | 'rejected' | 'live' | 'takedown_requested' | 'takedown_completed';
type FilterType = 'all' | ReleaseStatus;

const AdminMusic = () => {
  const queryClient = useQueryClient();
  const [tab, setTab] = useState('queue');
  const [filter, setFilter] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRelease, setSelectedRelease] = useState<any>(null);
  const [adminNotes, setAdminNotes] = useState('');
  
  // Fetch all releases from database
  const { data: releases, isLoading } = useQuery({
    queryKey: ['admin-releases'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('releases')
        .select(`
          *,
          artists:artist_id (name),
          labels:label_id (name),
          profiles:user_id (full_name, email)
        `)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching releases:', error);
        throw error;
      }
      return data || [];
    },
  });

  useEffect(() => {
    // Set admin notes when a release is selected
    if (selectedRelease) {
      setAdminNotes(selectedRelease.admin_notes || '');
    } else {
      setAdminNotes('');
    }
  }, [selectedRelease]);

  // Update release status mutation
  const updateReleaseMutation = useMutation({
    mutationFn: async ({ id, status, adminNotes }: { id: string, status: ReleaseStatus, adminNotes: string }) => {
      const { data, error } = await supabase
        .from('releases')
        .update({ 
          status, 
          admin_notes: adminNotes,
          ...(status === 'live' ? { release_date: new Date().toISOString() } : {})
        })
        .eq('id', id)
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-releases'] });
      setSelectedRelease(null);
      setAdminNotes('');
    }
  });

  // Filter releases based on tab, status filter, and search query
  const getFilteredReleases = () => {
    if (!releases) return [];
    
    return releases.filter((release) => {
      // Filter by tab
      if (tab === 'queue' && release.status !== 'pending_review') {
        return false;
      }
      
      // Filter by status if not 'all'
      if (filter !== 'all' && release.status !== filter) {
        return false;
      }
      
      // Filter by search query
      const searchLower = searchQuery.toLowerCase();
      const songName = release.song_name?.toLowerCase() || '';
      const artistName = release.artists?.name?.toLowerCase() || '';
      const labelName = release.labels?.name?.toLowerCase() || '';
      const userName = release.profiles?.full_name?.toLowerCase() || '';
      
      return songName.includes(searchLower) || 
             artistName.includes(searchLower) || 
             labelName.includes(searchLower) ||
             userName.includes(searchLower);
    });
  }

  const filteredReleases = getFilteredReleases();

  const handleApprove = () => {
    if (!selectedRelease) return;
    
    updateReleaseMutation.mutate({
      id: selectedRelease.id,
      status: 'approved',
      adminNotes
    }, {
      onSuccess: () => {
        toast.success(`"${selectedRelease.song_name}" has been approved!`);
      },
      onError: (error) => {
        console.error('Error approving release:', error);
        toast.error(`Failed to approve release: ${error.message || 'Unknown error'}`);
      }
    });
  };

  const handleReject = () => {
    if (!selectedRelease) return;
    
    updateReleaseMutation.mutate({
      id: selectedRelease.id,
      status: 'rejected',
      adminNotes
    }, {
      onSuccess: () => {
        toast.error(`"${selectedRelease.song_name}" has been rejected!`);
      },
      onError: (error) => {
        console.error('Error rejecting release:', error);
        toast.error(`Failed to reject release: ${error.message || 'Unknown error'}`);
      }
    });
  };

  const handleSetLive = () => {
    if (!selectedRelease) return;
    
    updateReleaseMutation.mutate({
      id: selectedRelease.id,
      status: 'live',
      adminNotes
    }, {
      onSuccess: () => {
        toast.success(`"${selectedRelease.song_name}" is now live!`);
      },
      onError: (error) => {
        console.error('Error setting release live:', error);
        toast.error(`Failed to set release live: ${error.message || 'Unknown error'}`);
      }
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold">Music Management</h2>
        <p className="text-gray-400">Review and manage music releases</p>
      </div>

      <Tabs value={tab} onValueChange={setTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 bg-gray-800">
          <TabsTrigger value="queue">Review Queue ({releases?.filter(r => r.status === 'pending_review').length || 0})</TabsTrigger>
          <TabsTrigger value="all">All Releases ({releases?.length || 0})</TabsTrigger>
        </TabsList>

        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="w-full md:w-64">
            <Select value={filter} onValueChange={(value: FilterType) => setFilter(value)}>
              <SelectTrigger className="bg-gray-800 border-gray-700">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending_review">Pending Review</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="live">Live</SelectItem>
                <SelectItem value="takedown_requested">Takedown Requested</SelectItem>
                <SelectItem value="takedown_completed">Takedown Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="w-full md:w-96">
            <Input
              placeholder="Search by song, artist, label or customer name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-gray-800 border-gray-700"
            />
          </div>
        </div>

        <TabsContent value="queue" className="mt-0">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredReleases.map((release) => (
              <Card 
                key={release.id} 
                className="bg-gray-800 border-gray-700 cursor-pointer hover:border-gray-500 transition-all"
                onClick={() => setSelectedRelease(release)}
              >
                <div className="h-40 relative">
                  <img
                    src={release.cover_art_url}
                    alt={release.song_name}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://placehold.co/400x400/333/white?text=No+Image";
                    }}
                  />
                  <Badge className={`absolute top-2 right-2 ${statusColors[release.status]}`}>
                    {statusLabels[release.status]}
                  </Badge>
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-white text-lg">{release.song_name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-400">Artist:</span>
                      <span className="text-sm text-white">{release.artists?.name || 'Unknown'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-400">Customer:</span>
                      <span className="text-sm text-white">{release.profiles?.full_name || 'Unknown'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-400">Type:</span>
                      <span className="text-sm text-white capitalize">{release.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-400">Submitted:</span>
                      <span className="text-sm text-white">
                        {new Date(release.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredReleases.length === 0 && (
            <div className="text-center py-12 bg-gray-800 border border-gray-700 rounded-lg">
              <h3 className="text-lg font-medium text-gray-300">No releases found</h3>
              <p className="text-gray-400">Try adjusting your filters or search query</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="all" className="mt-0">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredReleases.map((release) => (
              <Card 
                key={release.id} 
                className="bg-gray-800 border-gray-700 cursor-pointer hover:border-gray-500 transition-all"
                onClick={() => setSelectedRelease(release)}
              >
                <div className="h-40 relative">
                  <img
                    src={release.cover_art_url}
                    alt={release.song_name}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://placehold.co/400x400/333/white?text=No+Image";
                    }}
                  />
                  <Badge className={`absolute top-2 right-2 ${statusColors[release.status]}`}>
                    {statusLabels[release.status]}
                  </Badge>
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-white text-lg">{release.song_name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-400">Artist:</span>
                      <span className="text-sm text-white">{release.artists?.name || 'Unknown'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-400">Customer:</span>
                      <span className="text-sm text-white">{release.profiles?.full_name || 'Unknown'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-400">Type:</span>
                      <span className="text-sm text-white capitalize">{release.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-400">Status:</span>
                      <Badge className={statusColors[release.status]}>
                        {statusLabels[release.status]}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredReleases.length === 0 && (
            <div className="text-center py-12 bg-gray-800 border border-gray-700 rounded-lg">
              <h3 className="text-lg font-medium text-gray-300">No releases found</h3>
              <p className="text-gray-400">Try adjusting your filters or search query</p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {selectedRelease && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <Card className="bg-gray-800 border-gray-700 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-white text-xl">Review Release</CardTitle>
              <Button variant="ghost" onClick={() => setSelectedRelease(null)}>×</Button>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-1/3">
                  <img
                    src={selectedRelease.cover_art_url}
                    alt={selectedRelease.song_name}
                    className="w-full h-auto rounded-lg"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://placehold.co/400x400/333/white?text=No+Image";
                    }}
                  />
                  <div className="mt-4">
                    <audio controls className="w-full">
                      <source src={selectedRelease.audio_url} type="audio/mpeg" />
                      Your browser does not support the audio element.
                    </audio>
                  </div>
                </div>
                
                <div className="w-full md:w-2/3 space-y-4">
                  <div>
                    <h3 className="text-lg font-bold">{selectedRelease.song_name}</h3>
                    <p className="text-gray-400">by {selectedRelease.artists?.name}</p>
                    <p className="text-gray-500">Customer: {selectedRelease.profiles?.full_name}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-gray-400">Type</Label>
                      <p className="capitalize">{selectedRelease.type}</p>
                    </div>
                    <div>
                      <Label className="text-gray-400">Status</Label>
                      <Badge className={statusColors[selectedRelease.status]}>
                        {statusLabels[selectedRelease.status]}
                      </Badge>
                    </div>
                    <div>
                      <Label className="text-gray-400">Submitted Date</Label>
                      <p>{new Date(selectedRelease.created_at).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <Label className="text-gray-400">Language</Label>
                      <p className="capitalize">{selectedRelease.language}</p>
                    </div>
                    <div>
                      <Label className="text-gray-400">Label</Label>
                      <p>{selectedRelease.labels?.name || 'None'}</p>
                    </div>
                    <div>
                      <Label className="text-gray-400">Copyright</Label>
                      <p>{selectedRelease.copyright}</p>
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-gray-400" htmlFor="adminNotes">Admin Notes</Label>
                    <Textarea 
                      id="adminNotes"
                      placeholder="Add notes about this release..."
                      className="bg-gray-900 border-gray-700 mt-1"
                      value={adminNotes}
                      onChange={(e) => setAdminNotes(e.target.value)}
                    />
                  </div>
                  
                  <div className="flex gap-4 pt-2">
                    {selectedRelease.status === 'pending_review' && (
                      <>
                        <Button 
                          className="flex-1 gap-2" 
                          onClick={handleApprove}
                          disabled={updateReleaseMutation.isPending}
                        >
                          {updateReleaseMutation.isPending ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />}
                          Approve
                        </Button>
                        <Button 
                          className="flex-1 gap-2 bg-red-600 hover:bg-red-700" 
                          onClick={handleReject}
                          disabled={updateReleaseMutation.isPending}
                        >
                          {updateReleaseMutation.isPending ? <Loader2 size={16} className="animate-spin" /> : <XCircle size={16} />}
                          Reject
                        </Button>
                      </>
                    )}
                    
                    {selectedRelease.status === 'approved' && (
                      <Button 
                        className="flex-1 gap-2 bg-blue-600 hover:bg-blue-700" 
                        onClick={handleSetLive}
                        disabled={updateReleaseMutation.isPending}
                      >
                        {updateReleaseMutation.isPending ? <Loader2 size={16} className="animate-spin" /> : null}
                        Set Live
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AdminMusic;
