
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Camera, Monitor, Lock, Shield } from 'lucide-react';

interface ProctoringSettingsProps {
  settings: {
    webcamMonitoring: boolean;
    screenRecording: boolean;
    browserLockdown: boolean;
    faceDetection: boolean;
  };
  onSettingsChange: (settings: any) => void;
  disabled?: boolean;
}

const ProctoringSettings: React.FC<ProctoringSettingsProps> = ({
  settings,
  onSettingsChange,
  disabled = false
}) => {
  const updateSetting = (key: string, value: boolean) => {
    onSettingsChange({
      ...settings,
      [key]: value
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-5 h-5" />
          Proctoring Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Camera className="w-4 h-4 text-blue-500" />
            <div>
              <Label htmlFor="webcam-monitoring">Webcam Monitoring</Label>
              <p className="text-sm text-gray-600">Record candidate's face during exam</p>
            </div>
          </div>
          <Switch
            id="webcam-monitoring"
            checked={settings.webcamMonitoring}
            onCheckedChange={(checked) => updateSetting('webcamMonitoring', checked)}
            disabled={disabled}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Monitor className="w-4 h-4 text-green-500" />
            <div>
              <Label htmlFor="screen-recording">Screen Recording</Label>
              <p className="text-sm text-gray-600">Capture entire screen activity</p>
            </div>
          </div>
          <Switch
            id="screen-recording"
            checked={settings.screenRecording}
            onCheckedChange={(checked) => updateSetting('screenRecording', checked)}
            disabled={disabled}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Lock className="w-4 h-4 text-red-500" />
            <div>
              <Label htmlFor="browser-lockdown">Browser Lockdown</Label>
              <p className="text-sm text-gray-600">Prevent access to other applications</p>
            </div>
          </div>
          <Switch
            id="browser-lockdown"
            checked={settings.browserLockdown}
            onCheckedChange={(checked) => updateSetting('browserLockdown', checked)}
            disabled={disabled}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="w-4 h-4 text-purple-500" />
            <div>
              <Label htmlFor="face-detection">Face Detection</Label>
              <p className="text-sm text-gray-600">Monitor for face presence and multiple faces</p>
            </div>
          </div>
          <Switch
            id="face-detection"
            checked={settings.faceDetection}
            onCheckedChange={(checked) => updateSetting('faceDetection', checked)}
            disabled={disabled}
          />
        </div>

        {(settings.webcamMonitoring || settings.screenRecording) && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-800">
              <strong>Privacy Notice:</strong> This exam requires camera and screen recording for security purposes. 
              All recordings are encrypted and will only be reviewed if suspicious activity is detected.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProctoringSettings;
