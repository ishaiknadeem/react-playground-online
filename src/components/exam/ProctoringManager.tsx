
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Camera, Monitor, Lock, AlertTriangle, Eye } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';

interface ProctoringManagerProps {
  isEnabled: boolean;
  onViolation: (violation: ProctoringViolation) => void;
  examId: string;
}

export interface ProctoringViolation {
  type: 'face_not_detected' | 'multiple_faces' | 'screen_share_stopped' | 'unauthorized_app' | 'suspicious_behavior';
  timestamp: Date;
  severity: 'low' | 'medium' | 'high';
  description: string;
  evidence?: string; // base64 image or other data
}

interface ProctoringStatus {
  webcam: 'active' | 'inactive' | 'error';
  screenRecording: 'active' | 'inactive' | 'error';
  browserLock: 'active' | 'inactive' | 'error';
  faceDetection: 'detected' | 'not_detected' | 'multiple' | 'error';
}

const ProctoringManager: React.FC<ProctoringManagerProps> = ({ 
  isEnabled, 
  onViolation, 
  examId 
}) => {
  const [status, setStatus] = useState<ProctoringStatus>({
    webcam: 'inactive',
    screenRecording: 'inactive',
    browserLock: 'inactive',
    faceDetection: 'not_detected'
  });

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const screenRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunks = useRef<Blob[]>([]);
  const faceDetectionInterval = useRef<NodeJS.Timeout | null>(null);
  const [isRecording, setIsRecording] = useState(false);

  // Initialize webcam monitoring
  const initializeWebcam = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user'
        },
        audio: true 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setStatus(prev => ({ ...prev, webcam: 'active' }));
        
        // Start face detection
        startFaceDetection();
        
        // Start recording
        startWebcamRecording(stream);
      }
    } catch (error) {
      console.error('Failed to access webcam:', error);
      setStatus(prev => ({ ...prev, webcam: 'error' }));
      onViolation({
        type: 'face_not_detected',
        timestamp: new Date(),
        severity: 'high',
        description: 'Failed to access webcam for monitoring'
      });
    }
  }, [onViolation]);

  // Initialize screen recording
  const initializeScreenRecording = useCallback(async () => {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: { mediaSource: 'screen' },
        audio: true
      });
      
      const recorder = new MediaRecorder(screenStream, {
        mimeType: 'video/webm;codecs=vp9'
      });
      
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunks.current.push(event.data);
        }
      };
      
      recorder.onstop = () => {
        // Save recording data (in real implementation, upload to server)
        console.log('Screen recording stopped, chunks:', recordedChunks.current.length);
      };
      
      recorder.start(10000); // Record in 10-second chunks
      screenRecorderRef.current = recorder;
      setStatus(prev => ({ ...prev, screenRecording: 'active' }));
      
      // Monitor if user stops screen sharing
      screenStream.getVideoTracks()[0].addEventListener('ended', () => {
        setStatus(prev => ({ ...prev, screenRecording: 'error' }));
        onViolation({
          type: 'screen_share_stopped',
          timestamp: new Date(),
          severity: 'high',
          description: 'Screen sharing was stopped during exam'
        });
      });
      
    } catch (error) {
      console.error('Failed to start screen recording:', error);
      setStatus(prev => ({ ...prev, screenRecording: 'error' }));
      onViolation({
        type: 'screen_share_stopped',
        timestamp: new Date(),
        severity: 'medium',
        description: 'Failed to start screen recording'
      });
    }
  }, [onViolation]);

  // Start webcam recording
  const startWebcamRecording = (stream: MediaStream) => {
    try {
      const recorder = new MediaRecorder(stream, {
        mimeType: 'video/webm;codecs=vp9'
      });
      
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          // In real implementation, upload chunks to server
          console.log('Webcam chunk recorded:', event.data.size);
        }
      };
      
      recorder.start(5000); // Record in 5-second chunks
      mediaRecorderRef.current = recorder;
      setIsRecording(true);
    } catch (error) {
      console.error('Failed to start webcam recording:', error);
    }
  };

  // Simple face detection using canvas
  const startFaceDetection = () => {
    faceDetectionInterval.current = setInterval(() => {
      if (videoRef.current && canvasRef.current) {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const video = videoRef.current;
        
        if (ctx && video.readyState === 4) {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          ctx.drawImage(video, 0, 0);
          
          // Simple brightness-based face detection (placeholder)
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const data = imageData.data;
          let brightness = 0;
          
          for (let i = 0; i < data.length; i += 4) {
            brightness += (data[i] + data[i + 1] + data[i + 2]) / 3;
          }
          
          const avgBrightness = brightness / (data.length / 4);
          
          // Basic heuristic: if too dark, likely no face
          if (avgBrightness < 50) {
            setStatus(prev => ({ ...prev, faceDetection: 'not_detected' }));
            onViolation({
              type: 'face_not_detected',
              timestamp: new Date(),
              severity: 'medium',
              description: 'Face not detected in webcam feed'
            });
          } else {
            setStatus(prev => ({ ...prev, faceDetection: 'detected' }));
          }
        }
      }
    }, 2000); // Check every 2 seconds
  };

  // Browser lockdown
  const initializeBrowserLock = useCallback(() => {
    // Prevent context menu
    const handleContextMenu = (e: MouseEvent) => e.preventDefault();
    
    // Prevent certain keyboard shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent Alt+Tab, Ctrl+Shift+I, F11, etc.
      if (
        (e.altKey && e.key === 'Tab') ||
        (e.ctrlKey && e.shiftKey && e.key === 'I') ||
        (e.ctrlKey && e.shiftKey && e.key === 'J') ||
        e.key === 'F11' ||
        e.key === 'F12' ||
        (e.ctrlKey && e.key === 'u')
      ) {
        e.preventDefault();
        onViolation({
          type: 'unauthorized_app',
          timestamp: new Date(),
          severity: 'medium',
          description: `Blocked keyboard shortcut: ${e.key}`
        });
      }
    };

    // Try to enter fullscreen
    const enterFullscreen = async () => {
      try {
        await document.documentElement.requestFullscreen();
        setStatus(prev => ({ ...prev, browserLock: 'active' }));
      } catch (error) {
        console.error('Failed to enter fullscreen:', error);
        setStatus(prev => ({ ...prev, browserLock: 'error' }));
      }
    };

    // Monitor fullscreen exit
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        setStatus(prev => ({ ...prev, browserLock: 'error' }));
        onViolation({
          type: 'unauthorized_app',
          timestamp: new Date(),
          severity: 'high',
          description: 'Exited fullscreen mode during exam'
        });
        
        // Try to re-enter fullscreen
        setTimeout(enterFullscreen, 1000);
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    
    // Enter fullscreen immediately
    enterFullscreen();

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [onViolation]);

  // Initialize all proctoring features
  useEffect(() => {
    if (!isEnabled) return;

    let cleanupBrowserLock: (() => void) | undefined;

    const initialize = async () => {
      await initializeWebcam();
      await initializeScreenRecording();
      cleanupBrowserLock = initializeBrowserLock();
    };

    initialize();

    return () => {
      // Cleanup
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();
      }
      if (screenRecorderRef.current) {
        screenRecorderRef.current.stop();
      }
      if (faceDetectionInterval.current) {
        clearInterval(faceDetectionInterval.current);
      }
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
      if (cleanupBrowserLock) {
        cleanupBrowserLock();
      }
    };
  }, [isEnabled, initializeWebcam, initializeScreenRecording, initializeBrowserLock]);

  if (!isEnabled) return null;

  const getStatusColor = (statusValue: string) => {
    switch (statusValue) {
      case 'active':
      case 'detected':
        return 'text-green-500';
      case 'error':
      case 'not_detected':
        return 'text-red-500';
      default:
        return 'text-yellow-500';
    }
  };

  const getStatusIcon = (type: string, statusValue: string) => {
    const iconClass = `w-4 h-4 ${getStatusColor(statusValue)}`;
    
    switch (type) {
      case 'webcam':
        return <Camera className={iconClass} />;
      case 'screen':
        return <Monitor className={iconClass} />;
      case 'lock':
        return <Lock className={iconClass} />;
      case 'face':
        return <Eye className={iconClass} />;
      default:
        return <AlertTriangle className={iconClass} />;
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50">
      <Card className="bg-gray-900/95 border-gray-700 text-white backdrop-blur-sm">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium">Proctoring Active</h3>
            <Badge className="bg-green-600 text-xs">MONITORING</Badge>
          </div>
          
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="flex items-center gap-2">
              {getStatusIcon('webcam', status.webcam)}
              <span>Webcam</span>
            </div>
            
            <div className="flex items-center gap-2">
              {getStatusIcon('screen', status.screenRecording)}
              <span>Screen</span>
            </div>
            
            <div className="flex items-center gap-2">
              {getStatusIcon('lock', status.browserLock)}
              <span>Lockdown</span>
            </div>
            
            <div className="flex items-center gap-2">
              {getStatusIcon('face', status.faceDetection)}
              <span>Face</span>
            </div>
          </div>
          
          {(status.webcam === 'error' || status.screenRecording === 'error' || status.faceDetection === 'not_detected') && (
            <div className="mt-3 p-2 bg-red-900/50 rounded border border-red-700">
              <p className="text-xs text-red-200">
                Proctoring issues detected. Your exam is being monitored.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Hidden video elements for monitoring */}
      <div className="hidden">
        <video ref={videoRef} autoPlay muted playsInline />
        <canvas ref={canvasRef} />
      </div>
    </div>
  );
};

export default ProctoringManager;
