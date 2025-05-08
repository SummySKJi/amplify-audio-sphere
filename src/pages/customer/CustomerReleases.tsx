
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

const mockReleases = [
  {
    id: '1',
    song_name: 'Summer Vibes',
    artist: 'DJ Sunshine',
    type: 'single',
    release_date: '2023-06-15',
    status: 'live',
    cover_art_url: 'https://placehold.co/400',
  },
  {
    id: '2',
    song_name: 'Midnight Dreams',
    artist: 'Luna Moon',
    type: 'single',
    release_date: '2023-07-20',
    status: 'pending_review',
    cover_art_url: 'https://placehold.co/400',
  },
  {
    id: '3',
    song_name: 'Echoes of You',
    artist: 'Echo Band',
    type: 'single',
    release_date: null,
    status: 'rejected',
    cover_art_url: 'https://placehold.co/400',
  },
  {
    id: '4',
    song_name: 'Monsoon Magic',
    artist: 'Rain Makers',
    type: 'ep',
    release_date: '2023-08-05',
    status: 'approved',
    cover_art_url: 'https://placehold.co/400',
  },
];

const CustomerReleases = () => {
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredReleases = mockReleases.filter((release) => {
    const matchesSearch = release.song_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          release.artist.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === 'all' || release.status === filter;
    
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold">My Releases</h2>
        <p className="text-gray-400">Manage and track your music releases</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="w-full md:w-64">
          <Select value={filter} onValueChange={setFilter}>
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
        {filteredReleases.map((release) => (
          <Card key={release.id} className="bg-gray-800 border-gray-700 overflow-hidden">
            <div className="relative h-48">
              <img
                src={release.cover_art_url}
                alt={release.song_name}
                className="h-full w-full object-cover"
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
                  <span className="text-sm text-white">{release.artist}</span>
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
              <div className="mt-4 flex items-center justify-center">
                <button className="text-sm text-primary hover:underline">
                  View Details
                </button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredReleases.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-300">No releases found</h3>
          <p className="text-gray-400">Try adjusting your filters or search query</p>
        </div>
      )}
    </div>
  );
};

export default CustomerReleases;
