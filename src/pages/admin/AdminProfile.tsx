
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

const AdminProfile = () => {
  const { profile } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [profileData, setProfileData] = useState({
    fullName: profile?.full_name || 'Admin User',
    email: profile?.email || 'musicdistributionindia.in@gmail.com',
    phone: profile?.phone || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData({ ...profileData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    setTimeout(() => {
      toast.success('Profile updated successfully!');
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold">Admin Profile</h2>
        <p className="text-gray-400">Manage your admin account information</p>
      </div>

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Profile Details</CardTitle>
          <CardDescription className="text-gray-400">
            Update your personal information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input 
                id="fullName"
                name="fullName"
                value={profileData.fullName}
                onChange={handleChange}
                className="bg-gray-900 border-gray-700"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input 
                id="email"
                name="email"
                type="email"
                value={profileData.email}
                onChange={handleChange}
                className="bg-gray-900 border-gray-700"
                disabled
              />
              <p className="text-xs text-gray-400">Email cannot be changed</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input 
                id="phone"
                name="phone"
                value={profileData.phone}
                onChange={handleChange}
                className="bg-gray-900 border-gray-700"
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full mt-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Update Profile'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Admin Settings</CardTitle>
          <CardDescription className="text-gray-400">
            Manage administrator-specific settings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-400">
            Additional admin settings will be available here.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminProfile;
