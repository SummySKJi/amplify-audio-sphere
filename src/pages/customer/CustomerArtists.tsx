
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Edit, Trash, Loader2, AlertCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const countries = [
  'India', 'United States', 'United Kingdom', 'Canada', 'Australia',
  'Germany', 'France', 'Japan', 'Singapore', 'United Arab Emirates'
];

const languages = [
  'Hindi', 'English', 'Punjabi', 'Tamil', 'Telugu', 'Malayalam',
  'Kannada', 'Bengali', 'Marathi', 'Gujarati', 'Rajasthani', 'Haryanvi'
];

const genres = [
  'Pop', 'Rock', 'Hip-Hop', 'EDM', 'Folk', 'Classical', 'Jazz',
  'Blues', 'R&B', 'Country', 'Indie', 'Bollywood', 'Devotional'
];

const CustomerArtists = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('list');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [authChecked, setAuthChecked] = useState(false);
  
  // Artist form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | 'other' | ''>('');
  const [website, setWebsite] = useState('');
  const [country, setCountry] = useState('');
  const [instagram, setInstagram] = useState('');
  const [facebook, setFacebook] = useState('');
  const [youtube, setYoutube] = useState('');
  const [spotify, setSpotify] = useState('');
  const [appleMusic, setAppleMusic] = useState('');
  const [bio, setBio] = useState('');
  
  // Check if user is authenticated
  useEffect(() => {
    if (!user) {
      toast.error("You must be logged in to access this page");
      navigate("/auth");
    } else {
      setAuthChecked(true);
    }
  }, [user, navigate]);

  // Fetch artists
  const { data: artists, isLoading, refetch } = useQuery({
    queryKey: ['artists', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error("User not authenticated");
      
      const { data, error } = await supabase
        .from('artists')
        .select('*')
        .eq('user_id', user.id);
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id && authChecked
  });

  // Handle language selection
  const handleLanguageSelect = (value: string) => {
    if (!selectedLanguages.includes(value)) {
      setSelectedLanguages([...selectedLanguages, value]);
    }
  };

  // Handle genre selection
  const handleGenreSelect = (value: string) => {
    if (!selectedGenres.includes(value)) {
      setSelectedGenres([...selectedGenres, value]);
    }
  };

  const resetForm = () => {
    setName('');
    setEmail('');
    setPhone('');
    setWhatsapp('');
    setGender('');
    setWebsite('');
    setCountry('');
    setInstagram('');
    setFacebook('');
    setYoutube('');
    setSpotify('');
    setAppleMusic('');
    setBio('');
    setSelectedLanguages([]);
    setSelectedGenres([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !user.id) {
      toast.error('You must be logged in to create an artist');
      navigate("/auth");
      return;
    }
    
    if (!name || !email || !phone || !whatsapp || !gender || !country || selectedLanguages.length === 0) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Ensure user is authenticated with a valid ID
      console.log("Creating artist with user_id:", user.id);
      
      const { error } = await supabase
        .from('artists')
        .insert({
          user_id: user.id,
          name,
          email,
          phone,
          whatsapp,
          gender,
          website: website || null,
          country,
          languages: selectedLanguages,
          genres: selectedGenres.length > 0 ? selectedGenres : null,
          instagram_id: instagram || null,
          facebook_page: facebook || null,
          youtube_channel: youtube || null,
          spotify_link: spotify || null,
          apple_music_link: appleMusic || null,
          bio: bio || null
        });
      
      if (error) {
        console.error('Artist creation error details:', error);
        
        if (error.message.includes('foreign key constraint')) {
          toast.error("Authentication error. Please log out and log in again before creating artists.");
        } else {
          toast.error(`Error creating artist: ${error.message}`);
        }
        throw error;
      }
      
      toast.success('Artist created successfully!');
      resetForm();
      setActiveTab('list');
      refetch(); // Refresh artists list
    } catch (error: any) {
      console.error('Error creating artist:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteArtist = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this artist?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('artists')
        .delete()
        .eq('id', id)
        .eq('user_id', user?.id);
      
      if (error) throw error;
      
      toast.success('Artist deleted successfully!');
      refetch(); // Refresh artists list
    } catch (error: any) {
      toast.error(`Error deleting artist: ${error.message}`);
      console.error('Error deleting artist:', error);
    }
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <div className="flex items-center text-amber-500 bg-amber-100 dark:bg-amber-900/30 px-4 py-2 rounded-md">
          <AlertCircle className="h-5 w-5 mr-2" />
          <p>Authentication required. Please log in to continue.</p>
        </div>
        <Button onClick={() => navigate("/auth")}>
          Go to Login
        </Button>
      </div>
    );
  }

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
        <h2 className="text-3xl font-bold">Artists Management</h2>
        <p className="text-gray-400">Create and manage your artist profiles</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 bg-gray-800">
          <TabsTrigger value="list">My Artists</TabsTrigger>
          <TabsTrigger value="add">Add Artist</TabsTrigger>
        </TabsList>
        
        <TabsContent value="list">
          <div className="grid gap-6 md:grid-cols-2">
            {artists && artists.length > 0 ? (
              artists.map((artist: any) => (
                <Card key={artist.id} className="bg-gray-800 border-gray-700">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-white text-lg">{artist.name}</CardTitle>
                      <div className="flex space-x-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleDeleteArtist(artist.id)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-400">Email:</span>
                        <span className="text-sm">{artist.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-400">Phone:</span>
                        <span className="text-sm">{artist.phone}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-400">Gender:</span>
                        <span className="text-sm capitalize">{artist.gender}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-400">Country:</span>
                        <span className="text-sm">{artist.country}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-400">Languages:</span>
                        <span className="text-sm">{artist.languages?.join(', ') || 'None'}</span>
                      </div>
                      {artist.genres && artist.genres.length > 0 && (
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-400">Genres:</span>
                          <span className="text-sm">{artist.genres.join(', ')}</span>
                        </div>
                      )}
                      {artist.instagram_id && (
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-400">Instagram:</span>
                          <span className="text-sm">@{artist.instagram_id}</span>
                        </div>
                      )}
                      {artist.website && (
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-400">Website:</span>
                          <a href={artist.website} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">
                            Visit Website
                          </a>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-2 text-center py-8 bg-gray-800 border border-gray-700 rounded-lg">
                <h3 className="text-lg font-medium text-gray-300">No artists created yet</h3>
                <p className="text-gray-400 mt-2">Click on "Add Artist" to create your first artist profile</p>
                <Button className="mt-4" onClick={() => setActiveTab('add')}>
                  Add Artist
                </Button>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="add">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Add New Artist</CardTitle>
              <CardDescription className="text-gray-400">
                Create a new artist profile with detailed information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Artist Name*</Label>
                  <Input 
                    id="name"
                    placeholder="Enter artist name"
                    className="bg-gray-900 border-gray-700"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email*</Label>
                    <Input 
                      id="email"
                      type="email"
                      placeholder="artist@example.com"
                      className="bg-gray-900 border-gray-700"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number*</Label>
                    <Input 
                      id="phone"
                      placeholder="+91 98765 43210"
                      className="bg-gray-900 border-gray-700"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="whatsapp">WhatsApp Number*</Label>
                    <Input 
                      id="whatsapp"
                      placeholder="+91 98765 43210"
                      className="bg-gray-900 border-gray-700"
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender*</Label>
                    <Select value={gender} onValueChange={(value: 'male' | 'female' | 'other') => setGender(value)} required>
                      <SelectTrigger className="bg-gray-900 border-gray-700">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input 
                    id="website"
                    placeholder="https://www.artistwebsite.com"
                    className="bg-gray-900 border-gray-700"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="youtube">YouTube Channel</Label>
                    <Input 
                      id="youtube"
                      placeholder="YouTube channel link"
                      className="bg-gray-900 border-gray-700"
                      value={youtube}
                      onChange={(e) => setYoutube(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="instagram">Instagram ID</Label>
                    <Input 
                      id="instagram"
                      placeholder="Instagram username (without @)"
                      className="bg-gray-900 border-gray-700"
                      value={instagram}
                      onChange={(e) => setInstagram(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="facebook">Facebook Page</Label>
                    <Input 
                      id="facebook"
                      placeholder="Facebook page link"
                      className="bg-gray-900 border-gray-700"
                      value={facebook}
                      onChange={(e) => setFacebook(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="spotify">Spotify Link</Label>
                    <Input 
                      id="spotify"
                      placeholder="Spotify artist profile link"
                      className="bg-gray-900 border-gray-700"
                      value={spotify}
                      onChange={(e) => setSpotify(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="apple">Apple Music Link</Label>
                    <Input 
                      id="apple"
                      placeholder="Apple Music artist profile link"
                      className="bg-gray-900 border-gray-700"
                      value={appleMusic}
                      onChange={(e) => setAppleMusic(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="country">Country*</Label>
                  <Select value={country} onValueChange={setCountry} required>
                    <SelectTrigger className="bg-gray-900 border-gray-700">
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700 max-h-60">
                      {countries.map((country) => (
                        <SelectItem key={country} value={country}>{country}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="languages">Languages*</Label>
                  <Select onValueChange={handleLanguageSelect}>
                    <SelectTrigger className="bg-gray-900 border-gray-700">
                      <SelectValue placeholder="Select languages" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700 max-h-60">
                      {languages.map((language) => (
                        <SelectItem key={language} value={language}>{language}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedLanguages.map((lang) => (
                      <div key={lang} className="bg-gray-700 px-2 py-1 rounded-md text-sm flex items-center gap-1">
                        <span>{lang}</span>
                        <button
                          type="button"
                          onClick={() => setSelectedLanguages(selectedLanguages.filter(l => l !== lang))}
                          className="text-gray-400 hover:text-white"
                        >
                          &times;
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="genres">Genres</Label>
                  <Select onValueChange={handleGenreSelect}>
                    <SelectTrigger className="bg-gray-900 border-gray-700">
                      <SelectValue placeholder="Select genres" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700 max-h-60">
                      {genres.map((genre) => (
                        <SelectItem key={genre} value={genre}>{genre}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedGenres.map((genre) => (
                      <div key={genre} className="bg-gray-700 px-2 py-1 rounded-md text-sm flex items-center gap-1">
                        <span>{genre}</span>
                        <button
                          type="button"
                          onClick={() => setSelectedGenres(selectedGenres.filter(g => g !== genre))}
                          className="text-gray-400 hover:text-white"
                        >
                          &times;
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="bio">Artist Bio</Label>
                  <Textarea 
                    id="bio"
                    placeholder="Write a short biography for the artist"
                    className="bg-gray-900 border-gray-700 min-h-24"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full mt-2"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : 'Save Artist'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CustomerArtists;
