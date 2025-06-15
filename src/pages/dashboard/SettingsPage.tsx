import React, { useState, useEffect } from 'react';
import { useAppSelector } from '@/store/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Save, Shield, Bell, Users, Code, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import CandidateLayout from '@/components/dashboard/CandidateLayout';

const SettingsPage = () => {
  const { user } = useAppSelector(state => state.auth);
  const { toast } = useToast();
  
  const [settings, setSettings] = useState({
    // Organization settings (admin/examiner only)
    organizationName: '',
    website: '',
    
    // Personal settings (all users)
    name: '',
    email: '',
    phone: '',
    
    // Notification settings (all users)
    emailNotifications: true,
    examReminders: true,
    
    // Exam settings (admin/examiner only)
    autoGrading: true,
    proctoring: false,
    maxExamDuration: 120,
    allowedLanguages: ['javascript', 'python', 'java'],
  });
  const [loading, setLoading] = useState(false);

  // Mock settings data based on user role
  useEffect(() => {
    const baseSettings = {
      name: user?.name || '',
      email: user?.email || '',
      phone: '',
      emailNotifications: true,
      examReminders: true,
    };

    if (user?.role === 'candidate') {
      setSettings({
        ...baseSettings,
        organizationName: '',
        website: '',
        autoGrading: true,
        proctoring: false,
        maxExamDuration: 120,
        allowedLanguages: ['javascript', 'python', 'java'],
      });
    } else {
      setSettings({
        ...baseSettings,
        organizationName: 'Tech Corp',
        website: 'https://techcorp.com',
        autoGrading: true,
        proctoring: false,
        maxExamDuration: 120,
        allowedLanguages: ['javascript', 'python', 'java'],
      });
    }
  }, [user]);

  const handleSave = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast({
        title: 'Success',
        description: 'Settings saved successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save settings',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLanguageToggle = (lang: string) => {
    const newLanguages = settings.allowedLanguages.includes(lang)
      ? settings.allowedLanguages.filter(l => l !== lang)
      : [...settings.allowedLanguages, lang];
    setSettings({...settings, allowedLanguages: newLanguages});
  };

  const isCandidate = user?.role === 'candidate';
  const Layout = isCandidate ? CandidateLayout : DashboardLayout;

  return (
    <Layout>
      <div className="space-y-6 max-w-4xl">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {isCandidate ? 'Account Settings' : 'Settings'}
          </h1>
          <p className="text-gray-600">
            {isCandidate 
              ? 'Manage your profile and preferences' 
              : 'Manage your organization and examination preferences'
            }
          </p>
        </div>

        {/* Personal Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={settings.name}
                  onChange={(e) => setSettings({...settings, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={settings.email}
                  onChange={(e) => setSettings({...settings, email: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={settings.phone}
                  onChange={(e) => setSettings({...settings, phone: e.target.value})}
                  placeholder="Optional"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Organization Settings - Only for admin/examiner */}
        {!isCandidate && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Organization Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="orgName">Organization Name</Label>
                  <Input
                    id="orgName"
                    value={settings.organizationName}
                    onChange={(e) => setSettings({...settings, organizationName: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    value={settings.website}
                    onChange={(e) => setSettings({...settings, website: e.target.value})}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="emailNotifications">Email Notifications</Label>
                <p className="text-sm text-gray-600">
                  {isCandidate 
                    ? 'Receive email updates about your exams and results'
                    : 'Receive email updates about exam activities'
                  }
                </p>
              </div>
              <Switch
                id="emailNotifications"
                checked={settings.emailNotifications}
                onCheckedChange={(checked) => setSettings({...settings, emailNotifications: checked})}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="examReminders">Exam Reminders</Label>
                <p className="text-sm text-gray-600">
                  {isCandidate 
                    ? 'Get reminders before your scheduled exams'
                    : 'Send reminder emails to candidates'
                  }
                </p>
              </div>
              <Switch
                id="examReminders"
                checked={settings.examReminders}
                onCheckedChange={(checked) => setSettings({...settings, examReminders: checked})}
              />
            </div>
          </CardContent>
        </Card>

        {/* Exam Settings - Only for admin/examiner */}
        {!isCandidate && (
          <>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="w-5 h-5" />
                  Exam Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="autoGrading">Auto Grading</Label>
                    <p className="text-sm text-gray-600">Automatically grade coding submissions</p>
                  </div>
                  <Switch
                    id="autoGrading"
                    checked={settings.autoGrading}
                    onCheckedChange={(checked) => setSettings({...settings, autoGrading: checked})}
                  />
                </div>
                <Separator />
                <div className="space-y-2">
                  <Label htmlFor="maxDuration">Maximum Exam Duration (minutes)</Label>
                  <Input
                    id="maxDuration"
                    type="number"
                    value={settings.maxExamDuration}
                    onChange={(e) => setSettings({...settings, maxExamDuration: parseInt(e.target.value)})}
                    className="w-32"
                  />
                </div>
                <Separator />
                <div className="space-y-2">
                  <Label>Allowed Programming Languages</Label>
                  <div className="flex gap-2 flex-wrap">
                    {['javascript', 'python', 'java', 'cpp', 'csharp'].map((lang) => (
                      <Badge
                        key={lang}
                        variant={settings.allowedLanguages.includes(lang) ? "default" : "secondary"}
                        className="cursor-pointer"
                        onClick={() => handleLanguageToggle(lang)}
                      >
                        {lang}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Security Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Security & Proctoring
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="proctoring">Enable Proctoring</Label>
                    <p className="text-sm text-gray-600">Monitor candidates during exams</p>
                  </div>
                  <Switch
                    id="proctoring"
                    checked={settings.proctoring}
                    onCheckedChange={(checked) => setSettings({...settings, proctoring: checked})}
                  />
                </div>
                {settings.proctoring && (
                  <div className="ml-4 p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800">
                      Proctoring features include webcam monitoring, screen recording, and browser lockdown.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Account Info - Only for admin */}
            {user?.role === 'admin' && (
              <Card>
                <CardHeader>
                  <CardTitle>Account Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Current Plan</Label>
                      <p className="text-sm font-medium">Professional</p>
                    </div>
                    <div>
                      <Label>Subscription Status</Label>
                      <Badge className="bg-green-100 text-green-800">Active</Badge>
                    </div>
                    <div>
                      <Label>Total Examiners</Label>
                      <p className="text-sm font-medium">12</p>
                    </div>
                    <div>
                      <Label>Monthly Exam Limit</Label>
                      <p className="text-sm font-medium">500 / 1000</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}

        {/* Save Button */}
        <div className="flex justify-end">
          <Button 
            onClick={handleSave} 
            className="bg-blue-600 hover:bg-blue-700"
            disabled={loading}
          >
            <Save className="w-4 h-4 mr-2" />
            {loading ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default SettingsPage;
