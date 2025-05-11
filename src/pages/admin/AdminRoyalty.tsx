
import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { FileUp, Loader2, Plus } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AdminRoyalty = () => {
  const queryClient = useQueryClient();
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    entityType: 'user',
    entityId: '',
    reportPeriod: ''
  });
  const [tab, setTab] = useState('upload');

  // Fetch users, artists, labels
  const { data: users } = useQuery({
    queryKey: ['users-for-royalty'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, email')
        .eq('active', true)
        .order('full_name', { ascending: true });
      
      if (error) throw error;
      return data || [];
    }
  });

  const { data: artists } = useQuery({
    queryKey: ['artists-for-royalty'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('artists')
        .select('id, name')
        .order('name', { ascending: true });
      
      if (error) throw error;
      return data || [];
    }
  });

  const { data: labels } = useQuery({
    queryKey: ['labels-for-royalty'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('labels')
        .select('id, name')
        .order('name', { ascending: true });
      
      if (error) throw error;
      return data || [];
    }
  });

  // Fetch existing reports
  const { data: reports, isLoading: isLoadingReports } = useQuery({
    queryKey: ['royalty-reports'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('royalty_reports')
        .select(`
          *,
          profiles:user_id (full_name, email),
          artists:artist_id (name),
          labels:label_id (name)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    }
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleFormChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const uploadReport = async () => {
    if (!selectedFile || !formData.entityId || !formData.reportPeriod) {
      toast.error('Please fill all required fields and select a file');
      return;
    }

    setIsUploading(true);
    
    try {
      // 1. Upload file to storage
      const fileName = `royalty_reports/${formData.entityType}_${formData.entityId}_${Date.now()}_${selectedFile.name}`;
      const { error: uploadError } = await supabase.storage
        .from('reports')
        .upload(fileName, selectedFile);

      if (uploadError) throw uploadError;

      // 2. Get public URL for the file
      const { data: urlData } = await supabase.storage
        .from('reports')
        .getPublicUrl(fileName);

      if (!urlData?.publicUrl) throw new Error('Failed to get public URL');

      // 3. Insert record into royalty_reports table
      const reportData: any = {
        file_url: urlData.publicUrl,
        file_type: selectedFile.type,
        report_period: formData.reportPeriod
      };

      // Set the correct entity ID based on selection
      if (formData.entityType === 'user') {
        reportData.user_id = formData.entityId;
      } else if (formData.entityType === 'artist') {
        reportData.artist_id = formData.entityId;
      } else if (formData.entityType === 'label') {
        reportData.label_id = formData.entityId;
      }

      const { error: insertError } = await supabase
        .from('royalty_reports')
        .insert(reportData);

      if (insertError) throw insertError;

      toast.success('Royalty report uploaded successfully');
      setSelectedFile(null);
      setFormData({
        entityType: 'user',
        entityId: '',
        reportPeriod: ''
      });
      
      // Refresh reports list
      queryClient.invalidateQueries({ queryKey: ['royalty-reports'] });
      setTab('list');
      
    } catch (error) {
      console.error('Error uploading report:', error);
      toast.error('Failed to upload royalty report');
    } finally {
      setIsUploading(false);
    }
  };

  // Delete report mutation
  const deleteReportMutation = useMutation({
    mutationFn: async (reportId: string) => {
      // First get the report to get the file URL
      const { data, error: fetchError } = await supabase
        .from('royalty_reports')
        .select('file_url')
        .eq('id', reportId)
        .single();
      
      if (fetchError) throw fetchError;
      
      // Extract the file path from the URL
      const fileUrl = data.file_url;
      const filePathMatch = fileUrl.match(/royalty_reports\/.+/);
      const filePath = filePathMatch ? filePathMatch[0] : null;
      
      if (filePath) {
        // Delete file from storage
        const { error: deleteFileError } = await supabase.storage
          .from('reports')
          .remove([filePath]);
          
        if (deleteFileError) console.error('Error deleting file:', deleteFileError);
      }
      
      // Delete the record
      const { error: deleteRecordError } = await supabase
        .from('royalty_reports')
        .delete()
        .eq('id', reportId);
        
      if (deleteRecordError) throw deleteRecordError;
      
      return reportId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['royalty-reports'] });
      toast.success('Report deleted successfully');
    },
    onError: (error) => {
      console.error('Error deleting report:', error);
      toast.error('Failed to delete report');
    }
  });

  const handleDeleteReport = (reportId: string) => {
    if (confirm('Are you sure you want to delete this report?')) {
      deleteReportMutation.mutate(reportId);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold">Royalty Report Management</h2>
        <p className="text-gray-400">Upload and manage royalty reports for users, artists and labels</p>
      </div>
      
      <Tabs value={tab} onValueChange={setTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 bg-gray-800">
          <TabsTrigger value="upload">Upload New Report</TabsTrigger>
          <TabsTrigger value="list">View All Reports</TabsTrigger>
        </TabsList>
        
        <TabsContent value="upload">
          <Card className="bg-gray-800 border-gray-700 p-6">
            <div className="space-y-6">
              <div>
                <Label htmlFor="entityType">Report For</Label>
                <Select 
                  value={formData.entityType} 
                  onValueChange={(value) => {
                    handleFormChange('entityType', value);
                    handleFormChange('entityId', ''); // Reset entity ID when type changes
                  }}
                >
                  <SelectTrigger className="bg-gray-900 border-gray-700 mt-1">
                    <SelectValue placeholder="Select entity type" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-gray-700">
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="artist">Artist</SelectItem>
                    <SelectItem value="label">Label</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="entityId">Select {formData.entityType}</Label>
                <Select 
                  value={formData.entityId} 
                  onValueChange={(value) => handleFormChange('entityId', value)}
                >
                  <SelectTrigger className="bg-gray-900 border-gray-700 mt-1">
                    <SelectValue placeholder={`Select a ${formData.entityType}`} />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-gray-700 max-h-80">
                    {formData.entityType === 'user' && users?.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.full_name} ({user.email})
                      </SelectItem>
                    ))}
                    
                    {formData.entityType === 'artist' && artists?.map((artist) => (
                      <SelectItem key={artist.id} value={artist.id}>
                        {artist.name}
                      </SelectItem>
                    ))}
                    
                    {formData.entityType === 'label' && labels?.map((label) => (
                      <SelectItem key={label.id} value={label.id}>
                        {label.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="reportPeriod">Report Period</Label>
                <Input 
                  id="reportPeriod"
                  placeholder="e.g., January 2025"
                  className="bg-gray-900 border-gray-700 mt-1"
                  value={formData.reportPeriod}
                  onChange={(e) => handleFormChange('reportPeriod', e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="reportFile">Upload Report</Label>
                <div className="mt-1 flex items-center">
                  <label className="flex-1">
                    <div className="bg-gray-900 border border-gray-700 border-dashed rounded-md p-8 text-center cursor-pointer hover:bg-gray-800/50 transition-colors">
                      <FileUp className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="mt-4">
                        <span className="text-sm font-medium text-primary">
                          Click to upload file
                        </span>
                        <p className="text-xs text-gray-400 mt-1">
                          PDF, CSV, XLSX, XML files supported (Max: 10MB)
                        </p>
                      </div>
                      {selectedFile && (
                        <div className="mt-4 text-sm text-gray-300">
                          Selected: {selectedFile.name} ({Math.round(selectedFile.size / 1024)} KB)
                        </div>
                      )}
                      <Input
                        id="reportFile"
                        type="file"
                        accept=".pdf,.csv,.xlsx,.xml"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </div>
                  </label>
                </div>
              </div>
              
              <Button 
                onClick={uploadReport}
                className="w-full"
                disabled={isUploading || !selectedFile || !formData.entityId || !formData.reportPeriod}
              >
                {isUploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" />
                    Upload Report
                  </>
                )}
              </Button>
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="list">
          <Card className="bg-gray-800 border-gray-700">
            <div className="p-4 grid grid-cols-12 font-medium text-gray-400 border-b border-gray-700">
              <div className="col-span-2">Date</div>
              <div className="col-span-2">Period</div>
              <div className="col-span-3">For</div>
              <div className="col-span-2">Type</div>
              <div className="col-span-3 text-right">Actions</div>
            </div>
            
            {isLoadingReports ? (
              <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : reports && reports.length > 0 ? (
              reports.map((report) => (
                <div 
                  key={report.id} 
                  className="p-4 grid grid-cols-12 items-center border-b border-gray-700/50 hover:bg-gray-700/30"
                >
                  <div className="col-span-2 text-gray-400">
                    {new Date(report.created_at).toLocaleDateString()}
                  </div>
                  <div className="col-span-2">
                    {report.report_period}
                  </div>
                  <div className="col-span-3">
                    {report.user_id ? (
                      <span>{report.profiles?.full_name || 'Unknown User'}</span>
                    ) : report.artist_id ? (
                      <span>{report.artists?.name || 'Unknown Artist'}</span>
                    ) : (
                      <span>{report.labels?.name || 'Unknown Label'}</span>
                    )}
                  </div>
                  <div className="col-span-2">
                    {report.file_type?.split('/').pop()?.toUpperCase() || 'File'}
                  </div>
                  <div className="col-span-3 text-right space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => window.open(report.file_url, '_blank')}
                    >
                      View
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => handleDeleteReport(report.id)}
                      disabled={deleteReportMutation.isPending}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-gray-400">
                No royalty reports found. Upload your first report.
              </div>
            )}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminRoyalty;
