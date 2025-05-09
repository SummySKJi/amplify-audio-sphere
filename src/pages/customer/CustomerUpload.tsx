
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, PlusCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Define proper types that match our database schema
type ReleaseType = 'single' | 'album' | 'ep';

const CustomerUpload = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [releaseType, setReleaseType] = useState<ReleaseType | ''>('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [coverArt, setCoverArt] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const [songName, setSongName] = useState('');
  const [artistId, setArtistId] = useState('');
  const [instagramId, setInstagramId] = useState('');
  const [lyricsName, setLyricsName] = useState('');
  const [musicProducer, setMusicProducer] = useState('');
  const [copyright, setCopyright] = useState('');
  const [publisher, setPublisher] = useState('');
  const [language, setLanguage] = useState('');
  const [labelId, setLabelId] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [additionalNotes, setAdditionalNotes] = useState('');
  
  // Languages list
  const languages = [
    'Hindi', 'Rajasthani', 'Haryanvi', 'Punjabi', 'English', 
    'Tamil', 'Telugu', 'Kannada', 'Malayalam', 'Bengali', 
    'Marathi', 'Gujarati', 'Odia', 'Assamese', 'Urdu'
  ];

  // Check if user needs to create artists/labels first
  useEffect(() => {
    const checkEntities = async () => {
      // Check if user has any artists
      const { data: artists } = await supabase
        .from('artists')
        .select('id')
        .eq('user_id', user?.id)
        .limit(1);
        
      // Check if user has any labels
      const { data: labels } = await supabase
        .from('labels')
        .select('id')
        .eq('user_id', user?.id)
        .limit(1);
        
      if ((!artists || artists.length === 0) && (!labels || labels.length === 0)) {
        toast.info("You need to create at least one artist and label before uploading music.", {
          duration: 6000,
          action: {
            label: "Create Artist",
            onClick: () => navigate('/dashboard/artists'),
          },
        });
      } else if (!artists || artists.length === 0) {
        toast.info("You need to create at least one artist before uploading music.", {
          duration: 5000,
          action: {
            label: "Create Artist",
            onClick: () => navigate('/dashboard/artists'),
          },
        });
      } else if (!labels || labels.length === 0) {
        toast.info("You need to create at least one label before uploading music.", {
          duration: 5000,
          action: {
            label: "Create Label",
            onClick: () => navigate('/dashboard/labels'),
          },
        });
      }
    };
    
    if (user) {
      checkEntities();
    }
  }, [user, navigate]);

  // Fetch artists
  const { data: artists, isLoading: artistsLoading } = useQuery({
    queryKey: ['artists', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('artists')
        .select('*')
        .eq('user_id', user?.id);
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!user
  });

  // Fetch labels
  const { data: labels, isLoading: labelsLoading } = useQuery({
    queryKey: ['labels', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('labels')
        .select('*')
        .eq('user_id', user?.id);
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!user
  });

  // Fetch platforms
  const { data: platforms, isLoading: platformsLoading } = useQuery({
    queryKey: ['platforms'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('platforms')
        .select('*')
        .order('is_main', { ascending: false });
      
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

  const handleSelectAllPlatforms = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedPlatforms(platforms?.map(p => p.id) || []);
    } else {
      setSelectedPlatforms([]);
    }
  };

  const handleTogglePlatform = (platformId: string) => {
    setSelectedPlatforms(prev => {
      if (prev.includes(platformId)) {
        return prev.filter(id => id !== platformId);
      } else {
        return [...prev, platformId];
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('You must be logged in to upload music');
      return;
    }
    
    if (!selectedFile || !coverArt || !releaseType) {
      toast.error('Please fill in all required fields and upload both an audio file and cover art');
      return;
    }
    
    setIsUploading(true);
    
    try {
      // 1. Upload audio file to storage
      const audioFileName = `${user.id}/${Date.now()}-${selectedFile.name.replace(/\s+/g, '_')}`;
      const { data: audioData, error: audioError } = await supabase.storage
        .from('audio')
        .upload(audioFileName, selectedFile);
        
      if (audioError) throw audioError;
      
      // 2. Upload cover art to storage
      const coverFileName = `${user.id}/${Date.now()}-${coverArt.name.replace(/\s+/g, '_')}`;
      const { data: coverData, error: coverError } = await supabase.storage
        .from('cover-arts')
        .upload(coverFileName, coverArt);
        
      if (coverError) throw coverError;
      
      // 3. Get public URLs
      const audioUrl = `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/audio/${audioFileName}`;
      const coverArtUrl = `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/cover-arts/${coverFileName}`;
      
      // 4. Create release in database - Make sure to use the correct types
      const { error: releaseError } = await supabase
        .from('releases')
        .insert({
          user_id: user.id,
          type: releaseType as ReleaseType, // Ensure releaseType is correctly cast
          song_name: songName,
          artist_id: artistId,
          instagram_id: instagramId || null,
          lyrics_name: [lyricsName],
          music_producer: musicProducer || null,
          copyright,
          publisher: publisher || null,
          language,
          label_id: labelId,
          audio_url: audioUrl,
          cover_art_url: coverArtUrl,
          platforms: selectedPlatforms,
          status: 'pending_review'
        });
      
      if (releaseError) throw releaseError;
      
      toast.success('Your music has been submitted for review!');
      navigate('/dashboard/releases');
    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error(`Failed to upload: ${error.message || 'Unknown error'}`);
    } finally {
      setIsUploading(false);
    }
  };

  const isLoading = artistsLoading || labelsLoading || platformsLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const isFormComplete = 
    songName && 
    artistId && 
    lyricsName && 
    copyright && 
    language && 
    labelId && 
    selectedFile && 
    coverArt && 
    selectedPlatforms.length > 0 &&
    releaseType !== '';

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
              <Select 
                value={releaseType} 
                onValueChange={(value) => setReleaseType(value as ReleaseType)} 
                required
              >
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
                value={songName}
                onChange={(e) => setSongName(e.target.value)}
              />
            </div>
            
            {/* Artist */}
            <div className="space-y-2">
              <Label htmlFor="artist">Artist*</Label>
              <div className="flex space-x-2">
                <div className="flex-1">
                  <Select value={artistId} onValueChange={setArtistId} required>
                    <SelectTrigger className="bg-gray-900 border-gray-700">
                      <SelectValue placeholder="Select artist" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      {artists && artists.length > 0 ? (
                        artists.map((artist: any) => (
                          <SelectItem key={artist.id} value={artist.id}>{artist.name}</SelectItem>
                        ))
                      ) : (
                        <SelectItem value="no-artists" disabled>No artists found</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <Button 
                  type="button" 
                  size="icon" 
                  variant="outline" 
                  className="flex-shrink-0"
                  onClick={() => navigate('/dashboard/artists')}
                >
                  <PlusCircle className="h-5 w-5" />
                </Button>
              </div>
              <p className="text-sm text-gray-400 mt-1">
                Don't see your artist? <a href="/dashboard/artists" className="text-primary hover:underline">Create a new artist</a>
              </p>
            </div>

            {/* Instagram ID */}
            <div className="space-y-2">
              <Label htmlFor="instagramId">Instagram ID (Optional)</Label>
              <Input 
                id="instagramId" 
                placeholder="Enter Instagram ID"
                className="bg-gray-900 border-gray-700"
                value={instagramId}
                onChange={(e) => setInstagramId(e.target.value)}
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
                value={lyricsName}
                onChange={(e) => setLyricsName(e.target.value)}
              />
            </div>

            {/* Music Producer */}
            <div className="space-y-2">
              <Label htmlFor="producer">Music Producer</Label>
              <Input 
                id="producer" 
                placeholder="Enter music producer name"
                className="bg-gray-900 border-gray-700"
                value={musicProducer}
                onChange={(e) => setMusicProducer(e.target.value)}
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
                value={copyright}
                onChange={(e) => setCopyright(e.target.value)}
              />
            </div>

            {/* Publisher */}
            <div className="space-y-2">
              <Label htmlFor="publisher">Publisher</Label>
              <Input 
                id="publisher" 
                placeholder="Enter publisher name"
                className="bg-gray-900 border-gray-700"
                value={publisher}
                onChange={(e) => setPublisher(e.target.value)}
              />
            </div>

            {/* Language */}
            <div className="space-y-2">
              <Label htmlFor="language">Language*</Label>
              <Select value={language} onValueChange={setLanguage} required>
                <SelectTrigger className="bg-gray-900 border-gray-700">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700 max-h-60">
                  {languages.map((lang) => (
                    <SelectItem key={lang} value={lang.toLowerCase()}>{lang}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Label */}
            <div className="space-y-2">
              <Label htmlFor="label">Label*</Label>
              <div className="flex space-x-2">
                <div className="flex-1">
                  <Select value={labelId} onValueChange={setLabelId} required>
                    <SelectTrigger className="bg-gray-900 border-gray-700">
                      <SelectValue placeholder="Select label" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      {labels && labels.length > 0 ? (
                        labels.map((label: any) => (
                          <SelectItem key={label.id} value={label.id}>{label.name}</SelectItem>
                        ))
                      ) : (
                        <SelectItem value="no-labels" disabled>No labels found</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <Button 
                  type="button" 
                  size="icon" 
                  variant="outline" 
                  className="flex-shrink-0"
                  onClick={() => navigate('/dashboard/labels')}
                >
                  <PlusCircle className="h-5 w-5" />
                </Button>
              </div>
              <p className="text-sm text-gray-400 mt-1">
                Don't see your label? <a href="/dashboard/labels" className="text-primary hover:underline">Create a new label</a>
              </p>
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
              <div className="flex items-center space-x-2 bg-gray-900 px-3 py-2 rounded-md mb-2">
                <input 
                  type="checkbox" 
                  id="selectAll"
                  className="rounded text-primary-foreground bg-gray-700 border-gray-600" 
                  onChange={handleSelectAllPlatforms} 
                  checked={platforms && selectedPlatforms.length > 0 && selectedPlatforms.length === platforms.length}
                />
                <label htmlFor="selectAll" className="text-sm font-medium">Select All</label>
              </div>
              
              <div className="flex flex-wrap gap-4 mt-2">
                {platforms?.filter((p: any) => p.is_main).map((platform: any) => (
                  <div key={platform.id} className="flex items-center space-x-2 bg-gray-900 px-3 py-2 rounded-md">
                    <input 
                      type="checkbox" 
                      id={`platform-${platform.id}`}
                      className="rounded text-primary-foreground bg-gray-700 border-gray-600"
                      checked={selectedPlatforms.includes(platform.id)} 
                      onChange={() => handleTogglePlatform(platform.id)}
                    />
                    <label htmlFor={`platform-${platform.id}`} className="text-sm font-medium">{platform.name}</label>
                  </div>
                ))}
              </div>
              
              <div className="mt-4">
                <Label>Other Platforms</Label>
                <div className="flex flex-wrap gap-4 mt-2">
                  {platforms?.filter((p: any) => !p.is_main).map((platform: any) => (
                    <div key={platform.id} className="flex items-center space-x-2 bg-gray-900 px-3 py-2 rounded-md">
                      <input 
                        type="checkbox" 
                        id={`platform-${platform.id}`}
                        className="rounded text-primary-foreground bg-gray-700 border-gray-600"
                        checked={selectedPlatforms.includes(platform.id)} 
                        onChange={() => handleTogglePlatform(platform.id)}
                      />
                      <label htmlFor={`platform-${platform.id}`} className="text-sm font-medium">{platform.name}</label>
                    </div>
                  ))}
                </div>
              </div>
              
              <Textarea 
                placeholder="Additional platforms or notes" 
                className="mt-4 bg-gray-900 border-gray-700"
                value={additionalNotes}
                onChange={(e) => setAdditionalNotes(e.target.value)}
              />
            </div>

            <Button 
              type="submit" 
              className="w-full"
              disabled={isUploading || !isFormComplete}
            >
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Send To Review'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomerUpload;
