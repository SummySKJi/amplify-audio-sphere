
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

const statusColors: Record<string, string> = {
  'pending': 'bg-yellow-600',
  'in_process': 'bg-blue-600',
  'approved': 'bg-green-600',
  'rejected': 'bg-red-600',
  'completed': 'bg-purple-600',
};

const statusLabels: Record<string, string> = {
  'pending': 'Pending',
  'in_process': 'In Process',
  'approved': 'Approved',
  'rejected': 'Rejected',
  'completed': 'Completed',
};

const mockReleases = [
  { id: '1', title: 'Summer Vibes' },
  { id: '2', title: 'Midnight Dreams' },
  { id: '3', title: 'Echoes of You' },
  { id: '4', title: 'Monsoon Magic' },
];

const mockLabels = [
  { id: '1', name: 'Indie Records' },
  { id: '2', name: 'Rhythm Productions' },
  { id: '3', name: 'Beats International' },
];

const mockRequests = [
  {
    id: '1',
    song: 'Summer Vibes',
    youtubeLink: 'https://youtube.com/watch?v=abc123',
    label: 'Indie Records',
    status: 'completed',
    dateSubmitted: '2025-04-10',
    notes: 'Copyright claim successfully removed.',
  },
  {
    id: '2',
    song: 'Midnight Dreams',
    youtubeLink: 'https://youtube.com/watch?v=def456',
    label: 'Rhythm Productions',
    status: 'pending',
    dateSubmitted: '2025-05-05',
    notes: null,
  },
  {
    id: '3',
    song: 'Echoes of You',
    youtubeLink: 'https://youtube.com/watch?v=ghi789',
    label: 'Beats International',
    status: 'in_process',
    dateSubmitted: '2025-05-01',
    notes: 'Working on removing the claim.',
  },
];

const CustomerCopyright = () => {
  const [activeTab, setActiveTab] = useState('new-request');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    setTimeout(() => {
      toast.success('Copyright removal request submitted successfully!');
      setIsSubmitting(false);
      setActiveTab('my-requests');
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold">Copyright Removal Requests</h2>
        <p className="text-gray-400">Request removal of Content ID claims from YouTube videos</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 bg-gray-800">
          <TabsTrigger value="new-request">New Request</TabsTrigger>
          <TabsTrigger value="my-requests">My Requests</TabsTrigger>
        </TabsList>
        
        <TabsContent value="new-request">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">New Copyright Removal Request</CardTitle>
              <CardDescription className="text-gray-400">
                Fill in the details below to request removal of a Content ID claim
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="songSelect">Select Song*</Label>
                  <Select required>
                    <SelectTrigger className="bg-gray-900 border-gray-700">
                      <SelectValue placeholder="Select a song" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      {mockReleases.map((release) => (
                        <SelectItem key={release.id} value={release.id}>{release.title}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="youtubeLink">YouTube Video Link*</Label>
                  <Input 
                    id="youtubeLink"
                    placeholder="https://youtube.com/watch?v=..."
                    className="bg-gray-900 border-gray-700"
                    required
                  />
                  <p className="text-xs text-gray-400">
                    Provide the full link to the YouTube video where the claim needs to be removed
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="labelSelect">Choose Label*</Label>
                  <Select required>
                    <SelectTrigger className="bg-gray-900 border-gray-700">
                      <SelectValue placeholder="Select a label" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      {mockLabels.map((label) => (
                        <SelectItem key={label.id} value={label.id}>{label.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full mt-2"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : 'Send Request'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="my-requests">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">My Copyright Removal Requests</CardTitle>
              <CardDescription className="text-gray-400">
                Track the status of your submitted requests
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockRequests.map((request) => (
                  <div key={request.id} className="p-4 rounded-lg bg-gray-900 border border-gray-700">
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                      <h3 className="font-semibold text-lg">{request.song}</h3>
                      <Badge className={`${statusColors[request.status]} mt-2 md:mt-0`}>
                        {statusLabels[request.status]}
                      </Badge>
                    </div>
                    
                    <div className="grid gap-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">YouTube Link:</span>
                        <a 
                          href={request.youtubeLink} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-primary hover:underline truncate max-w-[250px]"
                        >
                          {request.youtubeLink}
                        </a>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-gray-400">Label:</span>
                        <span>{request.label}</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-gray-400">Date Submitted:</span>
                        <span>
                          {new Date(request.dateSubmitted).toLocaleDateString()}
                        </span>
                      </div>
                      
                      {request.notes && (
                        <div className="mt-2 pt-2 border-t border-gray-700">
                          <p className="text-gray-400">Notes:</p>
                          <p className="mt-1">{request.notes}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                
                {mockRequests.length === 0 && (
                  <div className="text-center py-8">
                    <h3 className="text-lg font-medium text-gray-300">No requests submitted yet</h3>
                    <p className="text-gray-400">Your copyright removal requests will appear here</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CustomerCopyright;
