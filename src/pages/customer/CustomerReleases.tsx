
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Loader2, ExternalLink } from "lucide-react";

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

// Define the valid status types that match our database enum
type ReleaseStatus = 'pending_review' | 'approved' | 'rejected' | 'live' | 'takedown_requested' | 'takedown_completed';
type FilterType = 'all' | ReleaseStatus;

const CustomerReleases = () => {
  const { user } = useAuth();
  const [filter, setFilter] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch releases
  const { data: releases, isLoading } = useQuery({
    queryKey: ['releases', user?.id, filter],
    queryFn: async () => {
      let query = supabase
        .from('releases')
        .select(`
          *,
          artists:artist_id (name),
          labels:label_id (name)
        `)
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });
        
      if (filter !== 'all') {
        // Now filter is properly typed as FilterType and we ensure we only pass valid status values
        query = query.eq('status', filter as ReleaseStatus);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!user
  });

  // Filter releases by search query
  const filteredReleases = releases?.filter((release) => {
    const songName = release.song_name?.toLowerCase() || '';
    const artistName = release.artists?.name?.toLowerCase() || '';
    const searchLower = searchQuery.toLowerCase();
    
    return songName.includes(searchLower) || artistName.includes(searchLower);
  });

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
        <h2 className="text-3xl font-bold">My Releases</h2>
        <p className="text-gray-400">Manage and track your music releases</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="w-full md:w-64">
          <Select value={filter} onValueChange={(value: FilterType) => setFilter(value)}>
            <SelectTrigger className="bg-gray-800 border-gray-700">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700">
              <SelectItem value="all">All Releases</SelectItem>
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
            placeholder="Search by song or artist name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-gray-800 border-gray-700"
          />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredReleases && filteredReleases.length > 0 ? (
          filteredReleases.map((release) => (
            <Card key={release.id} className="bg-gray-800 border-gray-700 overflow-hidden">
              <div className="relative h-48">
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
                    <span className="text-sm text-gray-400">Label:</span>
                    <span className="text-sm text-white">{release.labels?.name || 'Unknown'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-400">Type:</span>
                    <span className="text-sm text-white capitalize">{release.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-400">Release Date:</span>
                    <span className="text-sm text-white">
                      {release.release_date ? new Date(release.release_date).toLocaleDateString() : 'Pending'}
                    </span>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  {release.status === 'rejected' && (
                    <Badge variant="destructive">
                      Rejected
                    </Badge>
                  )}
                  {release.status === 'live' && (
                    <Button variant="outline" size="sm" className="flex items-center gap-1">
                      <ExternalLink className="h-3 w-3" />
                      <span>Track</span>
                    </Button>
                  )}
                  <div className="ml-auto">
                    <Button variant="link" className="text-primary hover:text-primary-focus">
                      View Details
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <h3 className="text-lg font-medium text-gray-300">No releases found</h3>
            <p className="text-gray-400 mb-6">
              {searchQuery ? 'Try adjusting your search query' : 'You haven\'t uploaded any music yet'}
            </p>
            <Button asChild>
              <a href="/dashboard/upload">Upload Your First Release</a>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerReleases;
