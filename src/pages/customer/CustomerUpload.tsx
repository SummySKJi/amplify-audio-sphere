
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const CustomerUpload = () => {
  const [releaseType, setReleaseType] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [coverArt, setCoverArt] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  
  // Fetch artists
  const { data: artists } = useQuery({
    queryKey: ['artists'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('artists')
        .select('*')
      
      if (error) throw error;
      return data || [];
    }
  });

  // Fetch labels
  const { data: labels } = useQuery({
    queryKey: ['labels'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('labels')
        .select('*')
      
      if (error) throw error;
      return data || [];
    }
  });

  // Fetch platforms
  const { data: platforms } = useQuery({
    queryKey: ['platforms'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('platforms')
        .select('*')
      
      if (error) throw error;
      return data || [];
    }
  });

  const handleAudioFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleCoverArtChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCoverArt(file);
      
      // Create a preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setCoverPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);
    
    // Simulating upload process
    setTimeout(() => {
      toast.success('Your music has been submitted for review!');
      setIsUploading(false);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold">Upload Music</h2>
        <p className="text-gray-400">Fill in the details below to upload your music</p>
      </div>

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Music Release Details</CardTitle>
          <CardDescription className="text-gray-400">
            Provide information about your release
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Release Type */}
            <div className="space-y-2">
              <Label htmlFor="type">Release Type*</Label>
              <Select value={releaseType} onValueChange={setReleaseType} required>
                <SelectTrigger className="bg-gray-900 border-gray-700">
                  <SelectValue placeholder="Select release type" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="single">Single</SelectItem>
                  <SelectItem value="album">Album</SelectItem>
                  <SelectItem value="ep">EP</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Song Name */}
            <div className="space-y-2">
              <Label htmlFor="songName">Song Name*</Label>
              <Input 
                id="songName" 
                placeholder="Enter song name"
                className="bg-gray-900 border-gray-700"
                required
              />
            </div>
            
            {/* Artist */}
            <div className="space-y-2">
              <Label htmlFor="artist">Artist*</Label>
              <Select required>
                <SelectTrigger className="bg-gray-900 border-gray-700">
                  <SelectValue placeholder="Select artist" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  {artists?.map((artist: any) => (
                    <SelectItem key={artist.id} value={artist.id}>{artist.name}</SelectItem>
                  ))}
                  <SelectItem value="new">Create New Artist</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Instagram ID */}
            <div className="space-y-2">
              <Label htmlFor="instagramId">Instagram ID (Optional)</Label>
              <Input 
                id="instagramId" 
                placeholder="Enter Instagram ID"
                className="bg-gray-900 border-gray-700"
              />
            </div>

            {/* Lyrics Name */}
            <div className="space-y-2">
              <Label htmlFor="lyricsName">Lyrics Name*</Label>
              <Input 
                id="lyricsName" 
                placeholder="Enter lyrics name"
                className="bg-gray-900 border-gray-700"
                required
              />
            </div>

            {/* Music Producer */}
            <div className="space-y-2">
              <Label htmlFor="producer">Music Producer</Label>
              <Input 
                id="producer" 
                placeholder="Enter music producer name"
                className="bg-gray-900 border-gray-700"
              />
            </div>

            {/* Copyright */}
            <div className="space-y-2">
              <Label htmlFor="copyright">Copyright*</Label>
              <Input 
                id="copyright" 
                placeholder="E.g. (C) & (P) 2025 Your Name"
                className="bg-gray-900 border-gray-700"
                required
              />
            </div>

            {/* Publisher */}
            <div className="space-y-2">
              <Label htmlFor="publisher">Publisher</Label>
              <Input 
                id="publisher" 
                placeholder="Enter publisher name"
                className="bg-gray-900 border-gray-700"
              />
            </div>

            {/* Language */}
            <div className="space-y-2">
              <Label htmlFor="language">Language*</Label>
              <Select required>
                <SelectTrigger className="bg-gray-900 border-gray-700">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700 max-h-60">
                  <SelectItem value="hindi">Hindi</SelectItem>
                  <SelectItem value="rajasthani">Rajasthani</SelectItem>
                  <SelectItem value="haryanvi">Haryanvi</SelectItem>
                  <SelectItem value="punjabi">Punjabi</SelectItem>
                  <SelectItem value="english">English</SelectItem>
                  <SelectItem value="tamil">Tamil</SelectItem>
                  <SelectItem value="telugu">Telugu</SelectItem>
                  <SelectItem value="kannada">Kannada</SelectItem>
                  <SelectItem value="malayalam">Malayalam</SelectItem>
                  <SelectItem value="bengali">Bengali</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Label */}
            <div className="space-y-2">
              <Label htmlFor="label">Label*</Label>
              <Select required>
                <SelectTrigger className="bg-gray-900 border-gray-700">
                  <SelectValue placeholder="Select label" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  {labels?.map((label: any) => (
                    <SelectItem key={label.id} value={label.id}>{label.name}</SelectItem>
                  ))}
                  <SelectItem value="new">Create New Label</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Audio File */}
            <div className="space-y-2">
              <Label htmlFor="audioFile">Upload Audio (.mp3, .wav)*</Label>
              <div className="flex items-center justify-center w-full">
                <label htmlFor="audioFile" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer border-gray-600 hover:border-gray-500">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <p className="mb-2 text-sm text-gray-400">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-400">.MP3, .WAV files only</p>
                  </div>
                  <Input 
                    id="audioFile" 
                    type="file"
                    accept=".mp3,.wav"
                    className="hidden"
                    onChange={handleAudioFileChange}
                    required
                  />
                </label>
              </div>
              {selectedFile && (
                <p className="text-sm text-green-400">Selected: {selectedFile.name}</p>
              )}
            </div>

            {/* Cover Art */}
            <div className="space-y-2">
              <Label htmlFor="coverArt">Upload Cover Art (.jpg, .png)*</Label>
              <div className="flex items-center justify-center w-full">
                <label htmlFor="coverArt" className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer border-gray-600 hover:border-gray-500">
                  {coverPreview ? (
                    <img 
                      src={coverPreview} 
                      alt="Cover Art Preview" 
                      className="h-full w-auto rounded-lg object-contain"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <p className="mb-2 text-sm text-gray-400">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-400">.JPG, .PNG files only (min 3000x3000)</p>
                    </div>
                  )}
                  <Input 
                    id="coverArt" 
                    type="file"
                    accept="image/jpeg,image/png"
                    className="hidden"
                    onChange={handleCoverArtChange}
                    required
                  />
                </label>
              </div>
            </div>

            {/* Platforms */}
            <div className="space-y-2">
              <Label>Select Platforms*</Label>
              <div className="flex flex-wrap gap-4 mt-2">
                <div className="flex items-center space-x-2 bg-gray-900 px-3 py-2 rounded-md">
                  <input 
                    type="checkbox" 
                    id="selectAll"
                    className="rounded text-primary-foreground bg-gray-700 border-gray-600" 
                  />
                  <label htmlFor="selectAll" className="text-sm font-medium">Select All</label>
                </div>
                
                {platforms?.filter((p: any) => p.is_main).map((platform: any) => (
                  <div key={platform.id} className="flex items-center space-x-2 bg-gray-900 px-3 py-2 rounded-md">
                    <input 
                      type="checkbox" 
                      id={`platform-${platform.id}`}
                      className="rounded text-primary-foreground bg-gray-700 border-gray-600" 
                    />
                    <label htmlFor={`platform-${platform.id}`} className="text-sm font-medium">{platform.name}</label>
                  </div>
                ))}
              </div>
              <Textarea 
                placeholder="Additional platforms or notes" 
                className="mt-2 bg-gray-900 border-gray-700"
              />
            </div>

            <Button 
              type="submit" 
              className="w-full"
              disabled={isUploading}
            >
              {isUploading ? 'Submitting...' : 'Send To Review'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomerUpload;
