
import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Save, Shield, Bell, Users, Code } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { useAuthStore } from '@/store/authStore';
import { settingsApi } from '@/services/api';

const SettingsPage = () => {
  const { user } = useAuthStore();
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    organizationName: '',
    website: '',
    emailNotifications: true,
    examReminders: true,
    autoGrading: true,
    proctoring: false,
    maxExamDuration: 120,
    allowedLanguages: ['javascript', 'python', 'java'],
  });

  const { data: settingsData, isLoading } = useQuery({
    queryKey: ['settings'],
    queryFn: settingsApi.getSettings,
  });

  const updateSettingsMutation = useMutation({
    mutationFn: settingsApi.updateSettings,
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Settings saved successfully',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to save settings',
        variant: 'destructive',
      });
    },
  });

  useEffect(() => {
    if (settingsData) {
      setSettings(settingsData);
    }
  }, [settingsData]);

  const handleSave = () => {
    updateSettingsMutation.mutate(settings);
  };

  const handleLanguageToggle = (lang: string) => {
    const newLanguages = settings.allowedLanguages.includes(lang)
      ? settings.allowedLanguages.filter(l => l !== lang)
      : [...settings.allowedLanguages, lang];
    setSettings({...settings, allowedLanguages: newLanguages});
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-4xl">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600">Manage your organization and examination preferences</p>
        </div>

        {/* Organization Settings */}
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
                <p className="text-sm text-gray-600">Receive email updates about exam activities</p>
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
                <p className="text-sm text-gray-600">Send reminder emails to candidates</p>
              </div>
              <Switch
                id="examReminders"
                checked={settings.examReminders}
                onCheckedChange={(checked) => setSettings({...settings, examReminders: checked})}
              />
            </div>
          </CardContent>
        </Card>

        {/* Exam Settings */}
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

        {/* Account Info */}
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

        {/* Save Button */}
        <div className="flex justify-end">
          <Button 
            onClick={handleSave} 
            className="bg-blue-600 hover:bg-blue-700"
            disabled={updateSettingsMutation.isPending}
          >
            <Save className="w-4 h-4 mr-2" />
            {updateSettingsMutation.isPending ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SettingsPage;
