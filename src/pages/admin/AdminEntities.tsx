
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Plus, Search, Trash2, Edit } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

// Languages and countries for dropdowns
const languages = [
  'Hindi', 'Rajasthani', 'Haryanvi', 'Punjabi', 'English', 
  'Tamil', 'Telugu', 'Kannada', 'Malayalam', 'Bengali', 
  'Marathi', 'Gujarati', 'Odia', 'Assamese', 'Urdu'
];

const countries = [
  'India', 'United States', 'United Kingdom', 'Canada', 'Australia',
  'Germany', 'France', 'Japan', 'China', 'Brazil', 'South Africa'
];

const genres = [
  'Pop', 'Rock', 'Hip-Hop', 'Rap', 'R&B', 'EDM', 'Classical', 
  'Jazz', 'Folk', 'Country', 'Metal', 'Blues', 'Reggae',
  'Bollywood', 'Indie', 'Devotional', 'Bhangra', 'Sufi'
];

const genders = ['male', 'female', 'group', 'band', 'other'];

const AdminEntities = () => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('artists');
  const [artistSearch, setArtistSearch] = useState('');
  const [labelSearch, setLabelSearch] = useState('');
  const [artistDialog, setArtistDialog] = useState(false);
  const [labelDialog, setLabelDialog] = useState(false);
  const [editingEntity, setEditingEntity] = useState<any>(null);

  // Artist form state
  const [artistName, setArtistName] = useState('');
  const [artistEmail, setArtistEmail] = useState('');
  const [artistPhone, setArtistPhone] = useState('');
  const [artistWhatsapp, setArtistWhatsapp] = useState('');
  const [artistGender, setArtistGender] = useState('');
  const [artistCountry, setArtistCountry] = useState('');
  const [selectedArtistLanguages, setSelectedArtistLanguages] = useState<string[]>([]);
  const [selectedArtistGenres, setSelectedArtistGenres] = useState<string[]>([]);
  const [artistInstagram, setArtistInstagram] = useState('');
  const [artistFacebook, setArtistFacebook] = useState('');
  const [artistBio, setArtistBio] = useState('');

  // Label form state
  const [labelName, setLabelName] = useState('');
  const [labelEmail, setLabelEmail] = useState('');
  const [labelPhone, setLabelPhone] = useState('');
  const [labelWhatsapp, setLabelWhatsapp] = useState('');
  const [labelCountry, setLabelCountry] = useState('');
  const [selectedLabelLanguages, setSelectedLabelLanguages] = useState<string[]>([]);
  const [selectedLabelGenres, setSelectedLabelGenres] = useState<string[]>([]);
  const [labelInstagram, setLabelInstagram] = useState('');
  const [labelFacebook, setLabelFacebook] = useState('');
  const [labelBio, setLabelBio] = useState('');

  // Fetch artists
  const { data: artists, isLoading: artistsLoading } = useQuery({
    queryKey: ['admin-artists'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('artists')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
  });

  // Fetch labels
  const { data: labels, isLoading: labelsLoading } = useQuery({
    queryKey: ['admin-labels'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('labels')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
  });

  // Create or update artist
  const artistMutation = useMutation({
    mutationFn: async (artistData: any) => {
      if (editingEntity) {
        const { data, error } = await supabase
          .from('artists')
          .update(artistData)
          .eq('id', editingEntity.id)
          .select();
        
        if (error) throw error;
        return data;
      } else {
        const { data, error } = await supabase
          .from('artists')
          .insert(artistData)
          .select();
        
        if (error) throw error;
        return data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-artists'] });
      resetArtistForm();
      setArtistDialog(false);
      toast.success(editingEntity ? 'Artist updated successfully' : 'Artist created successfully');
    },
    onError: (error) => {
      toast.error(`Error: ${error.message}`);
    }
  });

  // Create or update label
  const labelMutation = useMutation({
    mutationFn: async (labelData: any) => {
      if (editingEntity) {
        const { data, error } = await supabase
          .from('labels')
          .update(labelData)
          .eq('id', editingEntity.id)
          .select();
        
        if (error) throw error;
        return data;
      } else {
        const { data, error } = await supabase
          .from('labels')
          .insert(labelData)
          .select();
        
        if (error) throw error;
        return data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-labels'] });
      resetLabelForm();
      setLabelDialog(false);
      toast.success(editingEntity ? 'Label updated successfully' : 'Label created successfully');
    },
    onError: (error) => {
      toast.error(`Error: ${error.message}`);
    }
  });

  // Delete artist
  const deleteArtistMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('artists')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-artists'] });
      toast.success('Artist deleted successfully');
    },
    onError: (error) => {
      toast.error(`Error: ${error.message}`);
    }
  });

  // Delete label
  const deleteLabelMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('labels')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-labels'] });
      toast.success('Label deleted successfully');
    },
    onError: (error) => {
      toast.error(`Error: ${error.message}`);
    }
  });

  const resetArtistForm = () => {
    setArtistName('');
    setArtistEmail('');
    setArtistPhone('');
    setArtistWhatsapp('');
    setArtistGender('');
    setArtistCountry('');
    setSelectedArtistLanguages([]);
    setSelectedArtistGenres([]);
    setArtistInstagram('');
    setArtistFacebook('');
    setArtistBio('');
    setEditingEntity(null);
  };

  const resetLabelForm = () => {
    setLabelName('');
    setLabelEmail('');
    setLabelPhone('');
    setLabelWhatsapp('');
    setLabelCountry('');
    setSelectedLabelLanguages([]);
    setSelectedLabelGenres([]);
    setLabelInstagram('');
    setLabelFacebook('');
    setLabelBio('');
    setEditingEntity(null);
  };

  const handleEditArtist = (artist: any) => {
    setEditingEntity(artist);
    setArtistName(artist.name);
    setArtistEmail(artist.email);
    setArtistPhone(artist.phone);
    setArtistWhatsapp(artist.whatsapp);
    setArtistGender(artist.gender);
    setArtistCountry(artist.country);
    setSelectedArtistLanguages(artist.languages || []);
    setSelectedArtistGenres(artist.genres || []);
    setArtistInstagram(artist.instagram_id || '');
    setArtistFacebook(artist.facebook_page || '');
    setArtistBio(artist.bio || '');
    setArtistDialog(true);
  };

  const handleEditLabel = (label: any) => {
    setEditingEntity(label);
    setLabelName(label.name);
    setLabelEmail(label.email);
    setLabelPhone(label.phone);
    setLabelWhatsapp(label.whatsapp);
    setLabelCountry(label.country);
    setSelectedLabelLanguages(label.languages || []);
    setSelectedLabelGenres(label.genres || []);
    setLabelInstagram(label.instagram_id || '');
    setLabelFacebook(label.facebook_page || '');
    setLabelBio(label.bio || '');
    setLabelDialog(true);
  };

  const handleDeleteArtist = (id: string) => {
    if (window.confirm('Are you sure you want to delete this artist?')) {
      deleteArtistMutation.mutate(id);
    }
  };

  const handleDeleteLabel = (id: string) => {
    if (window.confirm('Are you sure you want to delete this label?')) {
      deleteLabelMutation.mutate(id);
    }
  };

  const handleSubmitArtist = (e: React.FormEvent) => {
    e.preventDefault();
    
    const artistData = {
      name: artistName,
      email: artistEmail,
      phone: artistPhone,
      whatsapp: artistWhatsapp,
      gender: artistGender,
      country: artistCountry,
      languages: selectedArtistLanguages,
      genres: selectedArtistGenres,
      instagram_id: artistInstagram || null,
      facebook_page: artistFacebook || null,
      bio: artistBio || null
    };

    artistMutation.mutate(artistData);
  };

  const handleSubmitLabel = (e: React.FormEvent) => {
    e.preventDefault();
    
    const labelData = {
      name: labelName,
      email: labelEmail,
      phone: labelPhone,
      whatsapp: labelWhatsapp,
      country: labelCountry,
      languages: selectedLabelLanguages,
      genres: selectedLabelGenres,
      instagram_id: labelInstagram || null,
      facebook_page: labelFacebook || null,
      bio: labelBio || null
    };

    labelMutation.mutate(labelData);
  };

  const toggleArtistLanguage = (language: string) => {
    setSelectedArtistLanguages(prev => 
      prev.includes(language) 
        ? prev.filter(l => l !== language) 
        : [...prev, language]
    );
  };

  const toggleArtistGenre = (genre: string) => {
    setSelectedArtistGenres(prev => 
      prev.includes(genre) 
        ? prev.filter(g => g !== genre) 
        : [...prev, genre]
    );
  };

  const toggleLabelLanguage = (language: string) => {
    setSelectedLabelLanguages(prev => 
      prev.includes(language) 
        ? prev.filter(l => l !== language) 
        : [...prev, language]
    );
  };

  const toggleLabelGenre = (genre: string) => {
    setSelectedLabelGenres(prev => 
      prev.includes(genre) 
        ? prev.filter(g => g !== genre) 
        : [...prev, genre]
    );
  };

  // Filter artists and labels based on search
  const filteredArtists = artists?.filter((artist: any) => 
    artist.name.toLowerCase().includes(artistSearch.toLowerCase()) || 
    artist.email.toLowerCase().includes(artistSearch.toLowerCase())
  ) || [];

  const filteredLabels = labels?.filter((label: any) => 
    label.name.toLowerCase().includes(labelSearch.toLowerCase()) || 
    label.email.toLowerCase().includes(labelSearch.toLowerCase())
  ) || [];

  if (artistsLoading || labelsLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold">Artists & Labels</h2>
        <p className="text-gray-400">Manage artists and music labels</p>
      </div>

      <Tabs 
        value={activeTab} 
        onValueChange={setActiveTab} 
        className="space-y-4"
      >
        <TabsList className="grid w-full grid-cols-2 bg-gray-800">
          <TabsTrigger value="artists">Artists ({artists?.length || 0})</TabsTrigger>
          <TabsTrigger value="labels">Labels ({labels?.length || 0})</TabsTrigger>
        </TabsList>

        {/* Artists Tab */}
        <TabsContent value="artists" className="space-y-4">
          <div className="flex flex-col md:flex-row justify-between gap-2">
            <div className="relative md:w-1/3">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                placeholder="Search artists..."
                value={artistSearch}
                onChange={(e) => setArtistSearch(e.target.value)}
                className="pl-8 bg-gray-800 border-gray-700"
              />
            </div>
            
            <Dialog open={artistDialog} onOpenChange={setArtistDialog}>
              <DialogTrigger asChild>
                <Button onClick={() => {
                  resetArtistForm();
                  setArtistDialog(true);
                }}>
                  <Plus className="mr-2 h-4 w-4" /> Add Artist
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{editingEntity ? 'Edit Artist' : 'Add New Artist'}</DialogTitle>
                </DialogHeader>
                
                <form onSubmit={handleSubmitArtist} className="space-y-4 py-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="artistName">Name*</Label>
                      <Input
                        id="artistName"
                        value={artistName}
                        onChange={(e) => setArtistName(e.target.value)}
                        placeholder="Artist name"
                        className="bg-gray-900 border-gray-700"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="artistEmail">Email*</Label>
                      <Input
                        id="artistEmail"
                        type="email"
                        value={artistEmail}
                        onChange={(e) => setArtistEmail(e.target.value)}
                        placeholder="artist@email.com"
                        className="bg-gray-900 border-gray-700"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="artistPhone">Phone*</Label>
                      <Input
                        id="artistPhone"
                        value={artistPhone}
                        onChange={(e) => setArtistPhone(e.target.value)}
                        placeholder="+91 XXXXX XXXXX"
                        className="bg-gray-900 border-gray-700"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="artistWhatsapp">WhatsApp*</Label>
                      <Input
                        id="artistWhatsapp"
                        value={artistWhatsapp}
                        onChange={(e) => setArtistWhatsapp(e.target.value)}
                        placeholder="+91 XXXXX XXXXX"
                        className="bg-gray-900 border-gray-700"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="artistGender">Gender*</Label>
                      <Select value={artistGender} onValueChange={setArtistGender} required>
                        <SelectTrigger className="bg-gray-900 border-gray-700">
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-700">
                          {genders.map((gender) => (
                            <SelectItem key={gender} value={gender} className="capitalize">
                              {gender}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="artistCountry">Country*</Label>
                      <Select value={artistCountry} onValueChange={setArtistCountry} required>
                        <SelectTrigger className="bg-gray-900 border-gray-700">
                          <SelectValue placeholder="Select country" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-700">
                          {countries.map((country) => (
                            <SelectItem key={country} value={country}>
                              {country}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="artistInstagram">Instagram ID</Label>
                      <Input
                        id="artistInstagram"
                        value={artistInstagram}
                        onChange={(e) => setArtistInstagram(e.target.value)}
                        placeholder="Instagram handle"
                        className="bg-gray-900 border-gray-700"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="artistFacebook">Facebook Page</Label>
                      <Input
                        id="artistFacebook"
                        value={artistFacebook}
                        onChange={(e) => setArtistFacebook(e.target.value)}
                        placeholder="Facebook page URL"
                        className="bg-gray-900 border-gray-700"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Languages*</Label>
                    <div className="flex flex-wrap gap-2 p-2 bg-gray-900 border border-gray-700 rounded-md">
                      {languages.map((language) => (
                        <Badge 
                          key={language} 
                          variant={selectedArtistLanguages.includes(language.toLowerCase()) ? "default" : "outline"}
                          className="cursor-pointer"
                          onClick={() => toggleArtistLanguage(language.toLowerCase())}
                        >
                          {language}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Genres</Label>
                    <div className="flex flex-wrap gap-2 p-2 bg-gray-900 border border-gray-700 rounded-md">
                      {genres.map((genre) => (
                        <Badge 
                          key={genre} 
                          variant={selectedArtistGenres.includes(genre.toLowerCase()) ? "default" : "outline"}
                          className="cursor-pointer"
                          onClick={() => toggleArtistGenre(genre.toLowerCase())}
                        >
                          {genre}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="artistBio">Bio</Label>
                    <Textarea
                      id="artistBio"
                      value={artistBio}
                      onChange={(e) => setArtistBio(e.target.value)}
                      placeholder="Artist biography"
                      className="bg-gray-900 border-gray-700 min-h-[100px]"
                    />
                  </div>
                  
                  <div className="flex justify-end space-x-2 pt-4">
                    <Button type="button" variant="outline" onClick={() => setArtistDialog(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={artistMutation.isPending}>
                      {artistMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        'Save Artist'
                      )}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Artists List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredArtists.length > 0 ? (
              filteredArtists.map((artist: any) => (
                <Card key={artist.id} className="bg-gray-800 border-gray-700 overflow-hidden">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex justify-between items-start">
                      <span className="text-white">{artist.name}</span>
                      <div className="flex space-x-1">
                        <Button 
                          size="icon" 
                          variant="ghost" 
                          onClick={() => handleEditArtist(artist)}
                        >
                          <Edit size={16} />
                        </Button>
                        <Button 
                          size="icon" 
                          variant="ghost" 
                          className="text-red-500 hover:text-red-400" 
                          onClick={() => handleDeleteArtist(artist.id)}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div className="grid grid-cols-2 gap-x-2">
                      <div>
                        <p className="text-gray-400">Email:</p>
                        <p className="truncate">{artist.email}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Phone:</p>
                        <p>{artist.phone}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Gender:</p>
                        <p className="capitalize">{artist.gender}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Country:</p>
                        <p>{artist.country}</p>
                      </div>
                    </div>
                    {artist.languages && artist.languages.length > 0 && (
                      <div>
                        <p className="text-gray-400">Languages:</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {artist.languages.map((language: string) => (
                            <Badge key={language} variant="outline" className="text-xs capitalize">
                              {language}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-3 py-8 text-center bg-gray-800 border border-gray-700 rounded-lg">
                <p className="text-gray-400">No artists found</p>
              </div>
            )}
          </div>
        </TabsContent>

        {/* Labels Tab */}
        <TabsContent value="labels" className="space-y-4">
          <div className="flex flex-col md:flex-row justify-between gap-2">
            <div className="relative md:w-1/3">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                placeholder="Search labels..."
                value={labelSearch}
                onChange={(e) => setLabelSearch(e.target.value)}
                className="pl-8 bg-gray-800 border-gray-700"
              />
            </div>
            
            <Dialog open={labelDialog} onOpenChange={setLabelDialog}>
              <DialogTrigger asChild>
                <Button onClick={() => {
                  resetLabelForm();
                  setLabelDialog(true);
                }}>
                  <Plus className="mr-2 h-4 w-4" /> Add Label
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{editingEntity ? 'Edit Label' : 'Add New Label'}</DialogTitle>
                </DialogHeader>
                
                <form onSubmit={handleSubmitLabel} className="space-y-4 py-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="labelName">Name*</Label>
                      <Input
                        id="labelName"
                        value={labelName}
                        onChange={(e) => setLabelName(e.target.value)}
                        placeholder="Label name"
                        className="bg-gray-900 border-gray-700"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="labelEmail">Email*</Label>
                      <Input
                        id="labelEmail"
                        type="email"
                        value={labelEmail}
                        onChange={(e) => setLabelEmail(e.target.value)}
                        placeholder="label@email.com"
                        className="bg-gray-900 border-gray-700"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="labelPhone">Phone*</Label>
                      <Input
                        id="labelPhone"
                        value={labelPhone}
                        onChange={(e) => setLabelPhone(e.target.value)}
                        placeholder="+91 XXXXX XXXXX"
                        className="bg-gray-900 border-gray-700"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="labelWhatsapp">WhatsApp*</Label>
                      <Input
                        id="labelWhatsapp"
                        value={labelWhatsapp}
                        onChange={(e) => setLabelWhatsapp(e.target.value)}
                        placeholder="+91 XXXXX XXXXX"
                        className="bg-gray-900 border-gray-700"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="labelCountry">Country*</Label>
                      <Select value={labelCountry} onValueChange={setLabelCountry} required>
                        <SelectTrigger className="bg-gray-900 border-gray-700">
                          <SelectValue placeholder="Select country" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-700">
                          {countries.map((country) => (
                            <SelectItem key={country} value={country}>
                              {country}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="labelInstagram">Instagram ID</Label>
                      <Input
                        id="labelInstagram"
                        value={labelInstagram}
                        onChange={(e) => setLabelInstagram(e.target.value)}
                        placeholder="Instagram handle"
                        className="bg-gray-900 border-gray-700"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="labelFacebook">Facebook Page</Label>
                      <Input
                        id="labelFacebook"
                        value={labelFacebook}
                        onChange={(e) => setLabelFacebook(e.target.value)}
                        placeholder="Facebook page URL"
                        className="bg-gray-900 border-gray-700"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Languages*</Label>
                    <div className="flex flex-wrap gap-2 p-2 bg-gray-900 border border-gray-700 rounded-md">
                      {languages.map((language) => (
                        <Badge 
                          key={language} 
                          variant={selectedLabelLanguages.includes(language.toLowerCase()) ? "default" : "outline"}
                          className="cursor-pointer"
                          onClick={() => toggleLabelLanguage(language.toLowerCase())}
                        >
                          {language}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Genres</Label>
                    <div className="flex flex-wrap gap-2 p-2 bg-gray-900 border border-gray-700 rounded-md">
                      {genres.map((genre) => (
                        <Badge 
                          key={genre} 
                          variant={selectedLabelGenres.includes(genre.toLowerCase()) ? "default" : "outline"}
                          className="cursor-pointer"
                          onClick={() => toggleLabelGenre(genre.toLowerCase())}
                        >
                          {genre}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="labelBio">Bio</Label>
                    <Textarea
                      id="labelBio"
                      value={labelBio}
                      onChange={(e) => setLabelBio(e.target.value)}
                      placeholder="Label description"
                      className="bg-gray-900 border-gray-700 min-h-[100px]"
                    />
                  </div>
                  
                  <div className="flex justify-end space-x-2 pt-4">
                    <Button type="button" variant="outline" onClick={() => setLabelDialog(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={labelMutation.isPending}>
                      {labelMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        'Save Label'
                      )}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Labels List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredLabels.length > 0 ? (
              filteredLabels.map((label: any) => (
                <Card key={label.id} className="bg-gray-800 border-gray-700 overflow-hidden">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex justify-between items-start">
                      <span className="text-white">{label.name}</span>
                      <div className="flex space-x-1">
                        <Button 
                          size="icon" 
                          variant="ghost" 
                          onClick={() => handleEditLabel(label)}
                        >
                          <Edit size={16} />
                        </Button>
                        <Button 
                          size="icon" 
                          variant="ghost" 
                          className="text-red-500 hover:text-red-400" 
                          onClick={() => handleDeleteLabel(label.id)}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div className="grid grid-cols-2 gap-x-2">
                      <div>
                        <p className="text-gray-400">Email:</p>
                        <p className="truncate">{label.email}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Phone:</p>
                        <p>{label.phone}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Country:</p>
                        <p>{label.country}</p>
                      </div>
                    </div>
                    {label.languages && label.languages.length > 0 && (
                      <div>
                        <p className="text-gray-400">Languages:</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {label.languages.map((language: string) => (
                            <Badge key={language} variant="outline" className="text-xs capitalize">
                              {language}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-3 py-8 text-center bg-gray-800 border border-gray-700 rounded-lg">
                <p className="text-gray-400">No labels found</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminEntities;
