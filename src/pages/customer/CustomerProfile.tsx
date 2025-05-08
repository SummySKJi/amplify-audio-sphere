
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";

const CustomerProfile = () => {
  const { profile } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [isSubmittingProfile, setIsSubmittingProfile] = useState(false);
  const [isSubmittingPassword, setIsSubmittingPassword] = useState(false);
  
  const [profileData, setProfileData] = useState({
    fullName: profile?.full_name || '',
    email: profile?.email || '',
    phone: profile?.phone || '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData({ ...profileData, [name]: value });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData({ ...passwordData, [name]: value });
  };

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingProfile(true);
    
    setTimeout(() => {
      toast.success('Profile updated successfully!');
      setIsSubmittingProfile(false);
    }, 1500);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingPassword(true);
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match!');
      setIsSubmittingPassword(false);
      return;
    }
    
    setTimeout(() => {
      toast.success('Password updated successfully!');
      setIsSubmittingPassword(false);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold">My Profile</h2>
        <p className="text-gray-400">Manage your account information</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 bg-gray-800">
          <TabsTrigger value="profile">Profile Information</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Profile Details</CardTitle>
              <CardDescription className="text-gray-400">
                Update your personal information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleProfileSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input 
                    id="fullName"
                    name="fullName"
                    value={profileData.fullName}
                    onChange={handleProfileChange}
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
                    onChange={handleProfileChange}
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
                    onChange={handleProfileChange}
                    className="bg-gray-900 border-gray-700"
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full mt-2"
                  disabled={isSubmittingProfile}
                >
                  {isSubmittingProfile ? 'Saving...' : 'Update Profile'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="security">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Change Password</CardTitle>
              <CardDescription className="text-gray-400">
                Update your password for better security
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input 
                    id="currentPassword"
                    name="currentPassword"
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    className="bg-gray-900 border-gray-700"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input 
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    className="bg-gray-900 border-gray-700"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input 
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    className="bg-gray-900 border-gray-700"
                    required
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full mt-2"
                  disabled={isSubmittingPassword}
                >
                  {isSubmittingPassword ? 'Updating...' : 'Update Password'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CustomerProfile;
