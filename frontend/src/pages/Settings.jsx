import { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Lock, Bell, CreditCard, Shield, Globe, Moon, Save, Camera, Building, Briefcase, X } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Switch } from '../components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import authService from '../services/auth.service';
import api from '../services/api';

export function Settings() {
  const [activeTab, setActiveTab] = useState('profile');
  const [currentUser, setCurrentUser] = useState(null);

  // Profile state
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    title: '',
    location: '',
    bio: '',
  });

  // State for profile picture
  const [previewImage, setPreviewImage] = useState(null);

  // Load user profile on component mount
  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        const user = await authService.getCurrentUser();
        if (user) {
          setCurrentUser(user); // Store current user for role check
          // Split the full name into first and last name
          const nameParts = user.name ? user.name.split(' ') : ['', ''];
          setProfile({
            firstName: nameParts[0] || '',
            lastName: nameParts.slice(1).join(' ') || '',
            email: user.email || '',
            phone: user.phone || '',
            company: user.company || '',
            title: user.title || '',
            location: user.location || '',
            bio: user.bio || '',
          });

          // Set profile picture if available
          if (user.profile_picture) {
            // Extract filename from the full path and construct the correct URL
            const fileName = user.profile_picture.split('/').pop();
            setPreviewImage(`/uploads/${fileName}`);
          }
        }
      } catch (error) {
        console.error('Error loading user profile:', error);
      }
    };

    loadUserProfile();
  }, []);

  // Notification settings
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    planUpdates: true,
    clientMessages: true,
    weeklyReports: false,
    marketingEmails: false,
    pushNotifications: true,
  });

  // Security settings
  const [security, setSecurity] = useState({
    twoFactorAuth: false,
    loginAlerts: true,
    sessionTimeout: true,
  });

  // Password change state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordError, setPasswordError] = useState('');

  const handleProfileUpdate = async () => {
    try {
      // Combine first and last name
      const fullName = `${profile.firstName} ${profile.lastName}`.trim();
      
      // Prepare profile data to send to backend
      const profileData = {
        name: fullName,
        email: profile.email,
        phone: profile.phone,
        company: profile.company,
        title: profile.title,
        location: profile.location,
        bio: profile.bio,
        height: profile.height,
        weight: profile.weight,
        age: profile.age,
        gender: profile.gender,
        activity_level: profile.activity_level,
        goal: profile.goal,
      };
      
      // Update profile via API
      await authService.updateProfile(profileData);
      
      // Show success message
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    }
  };

  const handlePasswordChange = async () => {
    setPasswordError('');
    
    // Validate passwords match
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }
    
    // Validate new password strength
    if (passwordData.newPassword.length < 8) {
      setPasswordError('Password must be at least 8 characters');
      return;
    }
    
    try {
      await api.post('/auth/change-password', {
        current_password: passwordData.currentPassword,
        new_password: passwordData.newPassword
      });
      
      // Clear password fields
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      alert('Password updated successfully!');
    } catch (error) {
      console.error('Error updating password:', error);
      setPasswordError(error.response?.data?.detail || 'Failed to update password. Please try again.');
    }
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file (JPEG, PNG, GIF)');
        return;
      }
      
      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        alert('File size exceeds 2MB limit');
        return;
      }
      
      try {
        // Preview the image
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewImage(reader.result);
        };
        reader.readAsDataURL(file);
        
        // Upload to server
        await authService.uploadProfilePicture(file);
        
        alert('Profile picture updated successfully!');
      } catch (error) {
        console.error('Error uploading profile picture:', error);
        alert('Failed to upload profile picture. Please try again.');
      }
    }
  };

  const handleRemoveImage = async () => {
    if (!confirm('Are you sure you want to remove your profile picture?')) {
      return;
    }
    
    try {
      await api.post('/auth/remove-profile-picture');
      setPreviewImage(null);
      
      // Update local storage
      const userJson = localStorage.getItem('user') || sessionStorage.getItem('user');
      if (userJson) {
        const user = JSON.parse(userJson);
        user.profile_picture = null;
        const storage = localStorage.getItem('token') ? localStorage : sessionStorage;
        storage.setItem('user', JSON.stringify(user));
      }
      
      alert('Profile picture removed successfully!');
    } catch (error) {
      console.error('Error removing profile picture:', error);
      alert('Failed to remove profile picture. Please try again.');
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 animate-fade-in max-w-6xl">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-2">Settings</h1>
        <p className="text-slate-600 dark:text-slate-300">Manage your account preferences and settings</p>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className={`grid w-full gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg ${
          currentUser?.role === 'user' ? 'grid-cols-3' : 'grid-cols-2 sm:grid-cols-4'
        }`}>
          <TabsTrigger value="profile" className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700">
            Profile
          </TabsTrigger>
          <TabsTrigger value="notifications" className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700">
            Notifications
          </TabsTrigger>
          <TabsTrigger value="security" className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700">
            Security
          </TabsTrigger>
          {currentUser?.role !== 'user' && (
            <TabsTrigger value="billing" className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700">
              Billing
            </TabsTrigger>
          )}
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          {/* Profile Picture Card */}
          <Card className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-md">
            <CardHeader>
              <CardTitle>Profile Picture</CardTitle>
              <CardDescription>Update your profile photo</CardDescription>
            </CardHeader>
          <CardContent>
              <div className="flex items-center gap-6">
                <div className="relative">
                  {previewImage ? (
                    <>
                      <img 
                        src={previewImage} 
                        alt="Profile" 
                        className="w-24 h-24 rounded-full object-cover border-4 border-white dark:border-slate-700"
                      />
                      <button
                        onClick={handleRemoveImage}
                        className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full shadow-lg flex items-center justify-center hover:bg-red-600 transition-colors"
                        title="Remove picture"
                      >
                        <X className="w-4 h-4 text-white" />
                      </button>
                    </>
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold text-3xl">
                      {profile.firstName && profile.lastName 
                        ? `${profile.firstName.charAt(0)}${profile.lastName.charAt(0)}` 
                        : profile.firstName ? profile.firstName.charAt(0) : 'U'
                      }
                    </div>
                  )}
                  <input
                    type="file"
                    id="profile-upload"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                  <label 
                    htmlFor="profile-upload" 
                    className="absolute bottom-0 right-0 w-8 h-8 bg-white dark:bg-slate-700 rounded-full shadow-lg border-2 border-white dark:border-slate-600 flex items-center justify-center hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors cursor-pointer"
                  >
                    <Camera className="w-4 h-4 text-slate-600 dark:text-slate-300" />
                  </label>
                </div>
                <div>
                  <Button variant="outline" asChild>
                    <label htmlFor="profile-upload" className="cursor-pointer">
                      Upload Photo
                    </label>
                  </Button>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">JPG, PNG or GIF. Max size 2MB.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Personal Information Card */}
          <Card className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-md">
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Update your personal details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      id="firstName"
                      value={profile.firstName}
                      onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      id="lastName"
                      value={profile.lastName}
                      onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    id="phone"
                    type="tel"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="company">Company</Label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      id="company"
                      value={profile.company}
                      onChange={(e) => setProfile({ ...profile, company: e.target.value })}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="title">Job Title</Label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      id="title"
                      value={profile.title}
                      onChange={(e) => setProfile({ ...profile, title: e.target.value })}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    id="location"
                    value={profile.location}
                    onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <textarea
                  id="bio"
                  value={profile.bio}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  className="w-full min-h-[100px] px-3 py-2 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="Tell us about yourself..."
                />
              </div>

              <div className="pt-4">
                <Button 
                  onClick={handleProfileUpdate}
                  className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6">
          <Card className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-md">
            <CardHeader>
              <CardTitle>Email Notifications</CardTitle>
              <CardDescription>Manage your email notification preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-slate-200 dark:border-slate-700">
                <div className="space-y-0.5">
                  <Label className="text-base">Email Notifications</Label>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Receive email notifications</p>
                </div>
                <Switch
                  checked={notifications.emailNotifications}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, emailNotifications: checked })}
                />
              </div>

              <div className="flex items-center justify-between py-3 border-b border-slate-200 dark:border-slate-700">
                <div className="space-y-0.5">
                  <Label className="text-base">Plan Updates</Label>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Get notified when meal plans are updated</p>
                </div>
                <Switch
                  checked={notifications.planUpdates}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, planUpdates: checked })}
                />
              </div>

              <div className="flex items-center justify-between py-3 border-b border-slate-200 dark:border-slate-700">
                <div className="space-y-0.5">
                  <Label className="text-base">Client Messages</Label>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Receive notifications for client messages</p>
                </div>
                <Switch
                  checked={notifications.clientMessages}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, clientMessages: checked })}
                />
              </div>

              <div className="flex items-center justify-between py-3 border-b border-slate-200 dark:border-slate-700">
                <div className="space-y-0.5">
                  <Label className="text-base">Weekly Reports</Label>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Receive weekly performance reports</p>
                </div>
                <Switch
                  checked={notifications.weeklyReports}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, weeklyReports: checked })}
                />
              </div>

              <div className="flex items-center justify-between py-3">
                <div className="space-y-0.5">
                  <Label className="text-base">Marketing Emails</Label>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Receive product updates and offers</p>
                </div>
                <Switch
                  checked={notifications.marketingEmails}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, marketingEmails: checked })}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-md">
            <CardHeader>
              <CardTitle>Push Notifications</CardTitle>
              <CardDescription>Manage push notification settings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Push Notifications</Label>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Receive push notifications on your devices</p>
                </div>
                <Switch
                  checked={notifications.pushNotifications}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, pushNotifications: checked })}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6">
          <Card className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-md">
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>Update your password to keep your account secure</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Error Message */}
              {passwordError && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-100 dark:bg-red-900/20 dark:border-red-900/30">
                  <p className="text-sm text-red-600 dark:text-red-400 text-center font-medium">
                    {passwordError}
                  </p>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    id="currentPassword"
                    type="password"
                    placeholder="Enter current password"
                    className="pl-10"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    id="newPassword"
                    type="password"
                    placeholder="Enter new password"
                    className="pl-10"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm new password"
                    className="pl-10"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  />
                </div>
              </div>

              <Button 
                onClick={handlePasswordChange}
                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
              >
                Update Password
              </Button>
            </CardContent>
          </Card>

          <Card className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-md">
            <CardHeader>
              <CardTitle>Security Preferences</CardTitle>
              <CardDescription>Manage your account security settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-slate-200 dark:border-slate-700">
                <div className="space-y-0.5">
                  <Label className="text-base">Two-Factor Authentication</Label>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Add an extra layer of security to your account</p>
                </div>
                <Switch
                  checked={security.twoFactorAuth}
                  onCheckedChange={(checked) => setSecurity({ ...security, twoFactorAuth: checked })}
                />
              </div>

              <div className="flex items-center justify-between py-3 border-b border-slate-200 dark:border-slate-700">
                <div className="space-y-0.5">
                  <Label className="text-base">Login Alerts</Label>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Get notified of new sign-ins to your account</p>
                </div>
                <Switch
                  checked={security.loginAlerts}
                  onCheckedChange={(checked) => setSecurity({ ...security, loginAlerts: checked })}
                />
              </div>

              <div className="flex items-center justify-between py-3">
                <div className="space-y-0.5">
                  <Label className="text-base">Session Timeout</Label>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Automatically log out after 30 minutes of inactivity</p>
                </div>
                <Switch
                  checked={security.sessionTimeout}
                  onCheckedChange={(checked) => setSecurity({ ...security, sessionTimeout: checked })}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/10">
            <CardHeader>
              <CardTitle className="text-red-700 dark:text-red-400">Danger Zone</CardTitle>
              <CardDescription className="text-red-600 dark:text-red-400">Irreversible account actions</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="destructive">
                Delete Account
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Billing Tab */}
        <TabsContent value="billing" className="space-y-6">
          <Card className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-md">
            <CardHeader>
              <CardTitle>Current Plan</CardTitle>
              <CardDescription>You are currently on the Professional plan</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-lg p-6 border border-emerald-200 dark:border-emerald-800">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Professional</h3>
                    <p className="text-slate-600 dark:text-slate-300">Perfect for growing coaching businesses</p>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-slate-900 dark:text-white">$49</p>
                    <p className="text-sm text-slate-600 dark:text-slate-300">per month</p>
                  </div>
                </div>
                <ul className="space-y-2 mb-4">
                  <li className="flex items-center text-sm text-slate-700 dark:text-slate-300">
                    <span className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center mr-2">
                      <span className="text-white text-xs">✓</span>
                    </span>
                    Unlimited meal plans
                  </li>
                  <li className="flex items-center text-sm text-slate-700 dark:text-slate-300">
                    <span className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center mr-2">
                      <span className="text-white text-xs">✓</span>
                    </span>
                    Up to 50 active clients
                  </li>
                  <li className="flex items-center text-sm text-slate-700 dark:text-slate-300">
                    <span className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center mr-2">
                      <span className="text-white text-xs">✓</span>
                    </span>
                    Priority support
                  </li>
                </ul>
                <Button variant="outline" className="w-full">
                  Change Plan
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-md">
            <CardHeader>
              <CardTitle>Payment Method</CardTitle>
              <CardDescription>Manage your payment information</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-700 rounded-lg mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-8 bg-slate-900 dark:bg-slate-700 rounded flex items-center justify-center">
                    <CreditCard className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">•••• •••• •••• 4242</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Expires 12/2026</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Update
                </Button>
              </div>
              <Button variant="outline">
                Add Payment Method
              </Button>
            </CardContent>
          </Card>

          <Card className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-md">
            <CardHeader>
              <CardTitle>Billing History</CardTitle>
              <CardDescription>View and download your invoices</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { date: 'Jan 1, 2025', amount: '$49.00', status: 'Paid', invoice: '#INV-2025-01' },
                  { date: 'Dec 1, 2024', amount: '$49.00', status: 'Paid', invoice: '#INV-2024-12' },
                  { date: 'Nov 1, 2024', amount: '$49.00', status: 'Paid', invoice: '#INV-2024-11' },
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">{item.invoice}</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">{item.date}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-semibold text-slate-900 dark:text-white">{item.amount}</span>
                      <span className="px-2 py-1 text-xs bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 rounded-full">
                        {item.status}
                      </span>
                      <Button variant="ghost" size="sm">
                        Download
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
