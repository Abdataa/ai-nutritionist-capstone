import { useState } from 'react';
import { User, Mail, Phone, MapPin, Lock, Bell, CreditCard, Shield, Globe, Moon, Save, Camera, Building, Briefcase } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Switch } from '../components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';

export function Settings({ onNavigate }) {
  const [activeTab, setActiveTab] = useState('profile');

  // Profile state
  const [profile, setProfile] = useState({
    firstName: 'Alex',
    lastName: 'Thompson',
    email: 'alex.thompson@nutritionist.com',
    phone: '+1 (555) 123-4567',
    company: 'Elite Fitness Coaching',
    title: 'Senior Nutrition Coach',
    location: 'San Francisco, CA',
    bio: 'Certified nutrition coach with 10+ years of experience helping clients achieve their fitness goals through personalized meal planning.',
  });

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

  const handleProfileUpdate = () => {
    // Handle profile update
    alert('Profile updated successfully!');
  };

  const handlePasswordChange = () => {
    // Handle password change
    alert('Password change requested!');
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
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
          <TabsTrigger value="profile" className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700">
            Profile
          </TabsTrigger>
          <TabsTrigger value="notifications" className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700">
            Notifications
          </TabsTrigger>
          <TabsTrigger value="security" className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700">
            Security
          </TabsTrigger>
          <TabsTrigger value="billing" className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700">
            Billing
          </TabsTrigger>
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
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold text-3xl">
                    AT
                  </div>
                  <button className="absolute bottom-0 right-0 w-8 h-8 bg-white dark:bg-slate-700 rounded-full shadow-lg border-2 border-white dark:border-slate-600 flex items-center justify-center hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors">
                    <Camera className="w-4 h-4 text-slate-600 dark:text-slate-300" />
                  </button>
                </div>
                <div>
                  <Button variant="outline" className="mb-2">
                    Upload Photo
                  </Button>
                  <p className="text-sm text-slate-500 dark:text-slate-400">JPG, PNG or GIF. Max size 2MB.</p>
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
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    id="currentPassword"
                    type="password"
                    placeholder="Enter current password"
                    className="pl-10"
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
