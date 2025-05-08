
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { CheckCircle2, XCircle } from "lucide-react";

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
    submitted: '2025-05-05',
    status: 'pending_review',
    cover_art_url: 'https://placehold.co/400',
    audio_url: '#',
  },
  {
    id: '2',
    song_name: 'Midnight Dreams',
    artist: 'Luna Moon',
    type: 'single',
    submitted: '2025-05-04',
    status: 'pending_review',
    cover_art_url: 'https://placehold.co/400',
    audio_url: '#',
  },
  {
    id: '3',
    song_name: 'Echoes of You',
    artist: 'Echo Band',
    type: 'single',
    submitted: '2025-05-01',
    status: 'approved',
    cover_art_url: 'https://placehold.co/400',
    audio_url: '#',
  },
];

const allReleases = [
  ...mockReleases,
  {
    id: '4',
    song_name: 'Monsoon Magic',
    artist: 'Rain Makers',
    type: 'ep',
    submitted: '2025-04-15',
    status: 'live',
    cover_art_url: 'https://placehold.co/400',
    audio_url: '#',
  },
  {
    id: '5',
    song_name: 'Desert Wind',
    artist: 'Dune Riders',
    type: 'single',
    submitted: '2025-04-10',
    status: 'rejected',
    cover_art_url: 'https://placehold.co/400',
    audio_url: '#',
  },
];

const AdminMusic = () => {
  const [tab, setTab] = useState('queue');
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRelease, setSelectedRelease] = useState<any>(null);
  
  const filteredReleases = (tab === 'queue' ? mockReleases : allReleases).filter((release) => {
    const matchesSearch = release.song_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          release.artist.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === 'all' || release.status === filter;
    
    return matchesSearch && matchesFilter;
  });

  const handleApprove = () => {
    toast.success(`"${selectedRelease.song_name}" has been approved!`);
    setSelectedRelease(null);
  };

  const handleReject = () => {
    toast.error(`"${selectedRelease.song_name}" has been rejected!`);
    setSelectedRelease(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold">Music Management</h2>
        <p className="text-gray-400">Review and manage music releases</p>
      </div>

      <Tabs value={tab} onValueChange={setTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 bg-gray-800">
          <TabsTrigger value="queue">Review Queue</TabsTrigger>
          <TabsTrigger value="all">All Releases</TabsTrigger>
        </TabsList>

        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="w-full md:w-64">
            <Select value={filter} onValueChange={setFilter}>
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
              placeholder="Search by song or artist name..."
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
                      <span className="text-sm text-gray-400">Submitted:</span>
                      <span className="text-sm text-white">
                        {new Date(release.submitted).toLocaleDateString()}
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
                      <span className="text-sm text-gray-400">Submitted:</span>
                      <span className="text-sm text-white">
                        {new Date(release.submitted).toLocaleDateString()}
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
                    <p className="text-gray-400">by {selectedRelease.artist}</p>
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
                      <p>{new Date(selectedRelease.submitted).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <Label className="text-gray-400">Language</Label>
                      <p>Hindi</p>
                    </div>
                    <div>
                      <Label className="text-gray-400">Label</Label>
                      <p>Indie Records</p>
                    </div>
                    <div>
                      <Label className="text-gray-400">Copyright</Label>
                      <p>(C) & (P) 2025 Indie Records</p>
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-gray-400" htmlFor="adminNotes">Admin Notes</Label>
                    <Textarea 
                      id="adminNotes"
                      placeholder="Add notes about this release..."
                      className="bg-gray-900 border-gray-700 mt-1"
                    />
                  </div>
                  
                  {selectedRelease.status === 'pending_review' && (
                    <div className="flex gap-4 pt-2">
                      <Button 
                        className="flex-1 gap-2" 
                        onClick={handleApprove}
                      >
                        <CheckCircle2 size={16} />
                        Approve
                      </Button>
                      <Button 
                        className="flex-1 gap-2 bg-red-600 hover:bg-red-700" 
                        onClick={handleReject}
                      >
                        <XCircle size={16} />
                        Reject
                      </Button>
                    </div>
                  )}
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
