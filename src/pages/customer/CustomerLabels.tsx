
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Trash, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

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

const CustomerLabels = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('list');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  
  // Label form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [website, setWebsite] = useState('');
  const [country, setCountry] = useState('');
  const [instagram, setInstagram] = useState('');
  const [facebook, setFacebook] = useState('');
  const [youtube, setYoutube] = useState('');
  const [bio, setBio] = useState('');

  // Fetch labels
  const { data: labels, isLoading, refetch } = useQuery({
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
    setWebsite('');
    setCountry('');
    setInstagram('');
    setFacebook('');
    setYoutube('');
    setBio('');
    setSelectedLanguages([]);
    setSelectedGenres([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('You must be logged in to create a label');
      return;
    }
    
    if (!name || !email || !phone || !whatsapp || !country || selectedLanguages.length === 0) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('labels')
        .insert({
          user_id: user.id,
          name,
          email,
          phone,
          whatsapp,
          website: website || null,
          country,
          languages: selectedLanguages,
          genres: selectedGenres.length > 0 ? selectedGenres : null,
          instagram_id: instagram || null,
          facebook_page: facebook || null,
          youtube_channel: youtube || null,
          bio: bio || null
        });
      
      if (error) throw error;
      
      toast.success('Label created successfully!');
      resetForm();
      setActiveTab('list');
      refetch(); // Refresh labels list
    } catch (error: any) {
      toast.error(`Error creating label: ${error.message}`);
      console.error('Error creating label:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteLabel = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this label?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('labels')
        .delete()
        .eq('id', id)
        .eq('user_id', user?.id);
      
      if (error) throw error;
      
      toast.success('Label deleted successfully!');
      refetch(); // Refresh labels list
    } catch (error: any) {
      toast.error(`Error deleting label: ${error.message}`);
      console.error('Error deleting label:', error);
    }
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
        <h2 className="text-3xl font-bold">Labels Management</h2>
        <p className="text-gray-400">Create and manage your music labels</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 bg-gray-800">
          <TabsTrigger value="list">My Labels</TabsTrigger>
          <TabsTrigger value="add">Add Label</TabsTrigger>
        </TabsList>
        
        <TabsContent value="list">
          <div className="grid gap-6 md:grid-cols-2">
            {labels && labels.length > 0 ? (
              labels.map((label: any) => (
                <Card key={label.id} className="bg-gray-800 border-gray-700">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-white text-lg">{label.name}</CardTitle>
                      <div className="flex space-x-2">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleDeleteLabel(label.id)}
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
                        <span className="text-sm">{label.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-400">Phone:</span>
                        <span className="text-sm">{label.phone}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-400">Country:</span>
                        <span className="text-sm">{label.country}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-400">Languages:</span>
                        <span className="text-sm">{label.languages?.join(', ') || 'None'}</span>
                      </div>
                      {label.genres && label.genres.length > 0 && (
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-400">Genres:</span>
                          <span className="text-sm">{label.genres.join(', ')}</span>
                        </div>
                      )}
                      {label.instagram_id && (
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-400">Instagram:</span>
                          <span className="text-sm">@{label.instagram_id}</span>
                        </div>
                      )}
                      {label.website && (
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-400">Website:</span>
                          <a href={label.website} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">
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
                <h3 className="text-lg font-medium text-gray-300">No labels created yet</h3>
                <p className="text-gray-400 mt-2">Click on "Add Label" to create your first label</p>
                <Button className="mt-4" onClick={() => setActiveTab('add')}>
                  Add Label
                </Button>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="add">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Add New Label</CardTitle>
              <CardDescription className="text-gray-400">
                Create a new music label with detailed information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Label Name*</Label>
                  <Input 
                    id="name"
                    placeholder="Enter label name"
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
                      placeholder="label@example.com"
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
                  <Label htmlFor="website">Website</Label>
                  <Input 
                    id="website"
                    placeholder="https://www.labelwebsite.com"
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
                  <Label htmlFor="bio">Label Bio</Label>
                  <Textarea 
                    id="bio"
                    placeholder="Write a short description for the label"
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
                  ) : 'Save Label'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CustomerLabels;
