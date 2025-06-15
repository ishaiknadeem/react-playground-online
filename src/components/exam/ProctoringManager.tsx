import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Camera, Monitor, Lock, AlertTriangle, Eye, X, Move } from 'lucide-react';
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
  evidence?: string;
}

interface ProctoringStatus {
  webcam: 'active' | 'inactive' | 'error';
  screenRecording: 'active' | 'inactive' | 'error';
  browserLock: 'active' | 'inactive' | 'error';
  faceDetection: 'detected' | 'not_detected' | 'multiple' | 'error';
}

interface RecordingData {
  webcamBlobs: Blob[];
  screenBlobs: Blob[];
  violations: ProctoringViolation[];
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

  const [isMinimized, setIsMinimized] = useState(false);
  const [position, setPosition] = useState({ x: 16, y: window.innerHeight - 200 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [showLockdownPrompt, setShowLockdownPrompt] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const screenRecorderRef = useRef<MediaRecorder | null>(null);
  const recordingData = useRef<RecordingData>({
    webcamBlobs: [],
    screenBlobs: [],
    violations: []
  });
  const screenStream = useRef<MediaStream | null>(null);
  const [isRecording, setIsRecording] = useState(false);

  // Store violation data
  const handleViolationInternal = useCallback((violation: ProctoringViolation) => {
    recordingData.current.violations.push(violation);
    onViolation(violation);
  }, [onViolation]);

  // Initialize webcam monitoring
  const initializeWebcam = useCallback(async () => {
    try {
      console.log('Initializing webcam...');
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
        console.log('Webcam initialized successfully');
        
        startWebcamRecording(stream);
      }
    } catch (error) {
      console.error('Failed to access webcam:', error);
      setStatus(prev => ({ ...prev, webcam: 'error' }));
      toast({
        title: "Webcam Access Required",
        description: "Please allow webcam access and refresh the page to continue with the exam.",
        variant: "destructive"
      });
      handleViolationInternal({
        type: 'face_not_detected',
        timestamp: new Date(),
        severity: 'high',
        description: 'Failed to access webcam for monitoring'
      });
    }
  }, [handleViolationInternal]);

  // Initialize screen recording with better error handling
  const initializeScreenRecording = useCallback(async () => {
    if (screenStream.current) {
      console.log('Screen recording already active, skipping...');
      return;
    }

    try {
      console.log('Requesting screen share...');
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          displaySurface: "browser"
        },
        audio: true
      });
      
      screenStream.current = stream;
      console.log('Screen recording initialized successfully');
      
      const recorder = new MediaRecorder(stream, {
        mimeType: 'video/webm;codecs=vp9'
      });
      
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordingData.current.screenBlobs.push(event.data);
        }
      };
      
      recorder.onstop = () => {
        console.log('Screen recording stopped');
      };
      
      recorder.start(30000);
      screenRecorderRef.current = recorder;
      setStatus(prev => ({ ...prev, screenRecording: 'active' }));
      
      // Enhanced detection for screen sharing end
      const videoTrack = stream.getVideoTracks()[0];
      
      videoTrack.addEventListener('ended', () => {
        console.log('Screen sharing ended - candidate stopped sharing');
        screenStream.current = null;
        setStatus(prev => ({ ...prev, screenRecording: 'error' }));
        
        toast({
          title: "🚨 Screen Sharing Stopped",
          description: "Screen sharing was stopped. Please restart screen sharing immediately or the exam will be terminated.",
          variant: "destructive"
        });
        
        handleViolationInternal({
          type: 'screen_share_stopped',
          timestamp: new Date(),
          severity: 'high',
          description: 'Candidate stopped screen sharing during exam'
        });
        
        // Attempt to restart screen recording after a delay
        setTimeout(() => {
          if (!screenStream.current) {
            initializeScreenRecording();
          }
        }, 3000);
      });
      
    } catch (error) {
      console.error('Failed to start screen recording:', error);
      setStatus(prev => ({ ...prev, screenRecording: 'error' }));
      
      if (error instanceof Error && error.name === 'NotAllowedError') {
        toast({
          title: "Screen Recording Required",
          description: "Screen recording is mandatory for this exam. Please allow screen sharing and refresh the page.",
          variant: "destructive"
        });
      }
      
      handleViolationInternal({
        type: 'screen_share_stopped',
        timestamp: new Date(),
        severity: 'high',
        description: 'Screen recording permission denied or failed to start'
      });
    }
  }, [handleViolationInternal]);

  // Start webcam recording
  const startWebcamRecording = (stream: MediaStream) => {
    try {
      const recorder = new MediaRecorder(stream, {
        mimeType: 'video/webm;codecs=vp9'
      });
      
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordingData.current.webcamBlobs.push(event.data);
        }
      };
      
      recorder.start(30000);
      mediaRecorderRef.current = recorder;
      setIsRecording(true);
      console.log('Webcam recording started');
    } catch (error) {
      console.error('Failed to start webcam recording:', error);
    }
  };

  // Enhanced browser lockdown with user-initiated fullscreen
  const initializeBrowserLock = useCallback(() => {
    console.log('Initializing browser lockdown...');
    
    const handleContextMenu = (e: MouseEvent) => e.preventDefault();
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.altKey && e.key === 'Tab') ||
        (e.ctrlKey && e.shiftKey && e.key === 'I') ||
        (e.ctrlKey && e.shiftKey && e.key === 'J') ||
        (e.ctrlKey && e.key === 'u') ||
        e.key === 'F11' ||
        e.key === 'F12' ||
        (e.ctrlKey && e.key === 'w') ||
        (e.altKey && e.key === 'F4')
      ) {
        e.preventDefault();
        handleViolationInternal({
          type: 'unauthorized_app',
          timestamp: new Date(),
          severity: 'medium',
          description: `Blocked keyboard shortcut: ${e.key}`
        });
      }
    };

    const enterFullscreen = async () => {
      try {
        if (!document.fullscreenElement) {
          await document.documentElement.requestFullscreen();
          console.log('Entered fullscreen mode');
          setStatus(prev => ({ ...prev, browserLock: 'active' }));
          setShowLockdownPrompt(false);
        }
      } catch (error) {
        console.error('Failed to enter fullscreen:', error);
        setStatus(prev => ({ ...prev, browserLock: 'error' }));
        setShowLockdownPrompt(true);
        
        toast({
          title: "Fullscreen Required",
          description: "Please click the 'Enable Lockdown' button to enter fullscreen mode for exam security.",
          variant: "destructive"
        });
      }
    };

    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        setStatus(prev => ({ ...prev, browserLock: 'error' }));
        setShowLockdownPrompt(true);
        
        handleViolationInternal({
          type: 'unauthorized_app',
          timestamp: new Date(),
          severity: 'high',
          description: 'Exited fullscreen mode during exam'
        });
        
        toast({
          title: "🚨 Fullscreen Exited",
          description: "You exited fullscreen mode. Please re-enter fullscreen to continue the exam.",
          variant: "destructive"
        });
      } else {
        setStatus(prev => ({ ...prev, browserLock: 'active' }));
        setShowLockdownPrompt(false);
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        handleViolationInternal({
          type: 'unauthorized_app',
          timestamp: new Date(),
          severity: 'medium',
          description: 'Tab switched or window minimized during exam'
        });
      }
    };

    // Add event listeners
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Try initial fullscreen request
    setTimeout(enterFullscreen, 1000);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [handleViolationInternal]);

  // Manual fullscreen activation
  const handleEnableLockdown = async () => {
    try {
      await document.documentElement.requestFullscreen();
    } catch (error) {
      console.error('Manual fullscreen failed:', error);
      toast({
        title: "Fullscreen Failed",
        description: "Unable to enable fullscreen mode. Please try again or contact support.",
        variant: "destructive"
      });
    }
  };

  // Export recording data for API submission
  const getRecordingData = useCallback(() => {
    return {
      webcamBlobs: recordingData.current.webcamBlobs,
      screenBlobs: recordingData.current.screenBlobs,
      violations: recordingData.current.violations
    };
  }, []);

  // Expose recording data to parent component
  useEffect(() => {
    (window as any).getProctoringData = getRecordingData;
    
    return () => {
      delete (window as any).getProctoringData;
    };
  }, [getRecordingData]);

  // Drag functionality
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget || (e.target as HTMLElement).closest('.drag-handle')) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    }
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isDragging) {
      const newX = Math.max(0, Math.min(window.innerWidth - 320, e.clientX - dragStart.x));
      const newY = Math.max(0, Math.min(window.innerHeight - 200, e.clientY - dragStart.y));
      setPosition({ x: newX, y: newY });
    }
  }, [isDragging, dragStart]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // Update position on window resize to keep panel in bounds
  useEffect(() => {
    const handleResize = () => {
      setPosition(prev => ({
        x: Math.min(prev.x, window.innerWidth - 320),
        y: Math.min(prev.y, window.innerHeight - 200)
      }));
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Initialize all proctoring features
  useEffect(() => {
    if (!isEnabled) return;

    let cleanupBrowserLock: (() => void) | undefined;

    const initialize = async () => {
      console.log('Initializing proctoring features...');
      await initializeWebcam();
      await initializeScreenRecording();
      cleanupBrowserLock = initializeBrowserLock();
    };

    initialize();

    return () => {
      console.log('Cleaning up proctoring features...');
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();
      }
      if (screenRecorderRef.current) {
        screenRecorderRef.current.stop();
      }
      if (screenStream.current) {
        screenStream.current.getTracks().forEach(track => track.stop());
        screenStream.current = null;
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
        return 'text-green-400';
      case 'error':
      case 'not_detected':
        return 'text-red-400';
      default:
        return 'text-yellow-400';
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
    <>
      {/* Lockdown Prompt Overlay */}
      {showLockdownPrompt && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
          <Card className="bg-gray-900/95 border-red-500/50 text-white max-w-md mx-4">
            <CardContent className="p-6 text-center">
              <Lock className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-bold mb-2">Security Lockdown Required</h2>
              <p className="text-gray-300 mb-6">
                For exam security, you must enable fullscreen mode. This prevents access to other applications during the exam.
              </p>
              <Button onClick={handleEnableLockdown} className="bg-red-600 hover:bg-red-700 w-full">
                Enable Lockdown Mode
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      <div 
        className="fixed z-50 select-none"
        style={{
          left: position.x,
          top: position.y,
          width: '320px'
        }}
        onMouseDown={handleMouseDown}
        data-proctoring-panel
      >
        <Card className="bg-gray-900/95 border-gray-700 text-white backdrop-blur-sm cursor-move">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 drag-handle">
                <Move className="w-4 h-4 text-gray-400" />
                <h3 className="text-sm font-medium">Proctoring Active</h3>
                <Badge className="bg-green-600 text-xs">MONITORING</Badge>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="h-6 w-6 p-0 text-gray-400 hover:text-white"
                >
                  {isMinimized ? '□' : '−'}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    const panel = document.querySelector('[data-proctoring-panel]') as HTMLElement;
                    if (panel) panel.style.display = 'none';
                  }}
                  className="h-6 w-6 p-0 text-gray-400 hover:text-white"
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            </div>
            
            {!isMinimized && (
              <>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    {getStatusIcon('webcam', status.webcam)}
                    <span>Webcam</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {getStatusIcon('screen', status.screenRecording)}
                    <span>Screen</span>
                  </div>
                </div>
                
                {(status.webcam === 'error' || status.screenRecording === 'error' || status.browserLock === 'error') && (
                  <div className="mt-3 p-2 bg-red-900/50 rounded border border-red-700">
                    <p className="text-xs text-red-200">
                      {status.browserLock === 'error' && 'Fullscreen required. '}
                      {status.webcam === 'error' && 'Webcam access needed. '}
                      {status.screenRecording === 'error' && 'Screen recording stopped. '}
                      Please resolve to continue exam.
                    </p>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
        
        {/* Hidden video elements for monitoring */}
        <div className="hidden">
          <video ref={videoRef} autoPlay muted playsInline />
          <canvas ref={canvasRef} />
        </div>
      </div>
    </>
  );
};

export default ProctoringManager;
