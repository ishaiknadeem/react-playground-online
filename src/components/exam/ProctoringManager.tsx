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
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [noFaceCount, setNoFaceCount] = useState(0);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const screenRecorderRef = useRef<MediaRecorder | null>(null);
  const recordingData = useRef<RecordingData>({
    webcamBlobs: [],
    screenBlobs: [],
    violations: []
  });
  const faceDetectionInterval = useRef<NodeJS.Timeout | null>(null);
  const screenStream = useRef<MediaStream | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const fullscreenRetryCount = useRef(0);

  // Store violation data
  const handleViolationInternal = useCallback((violation: ProctoringViolation) => {
    recordingData.current.violations.push(violation);
    onViolation(violation);
  }, [onViolation]);

  // Initialize webcam monitoring with better error handling
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
        
        videoRef.current.onloadedmetadata = () => {
          startFaceDetection();
        };
        
        startWebcamRecording(stream);
      }
    } catch (error) {
      console.error('Failed to access webcam:', error);
      setStatus(prev => ({ ...prev, webcam: 'error' }));
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
        video: true,
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
      
      recorder.start(30000); // Record in 30-second chunks
      screenRecorderRef.current = recorder;
      setStatus(prev => ({ ...prev, screenRecording: 'active' }));
      
      // Handle when user stops screen sharing
      stream.getVideoTracks()[0].addEventListener('ended', () => {
        screenStream.current = null;
        setStatus(prev => ({ ...prev, screenRecording: 'error' }));
        handleViolationInternal({
          type: 'screen_share_stopped',
          timestamp: new Date(),
          severity: 'high',
          description: 'Screen sharing was stopped during exam'
        });
      });
      
    } catch (error) {
      console.error('Failed to start screen recording:', error);
      setStatus(prev => ({ ...prev, screenRecording: 'error' }));
      handleViolationInternal({
        type: 'screen_share_stopped',
        timestamp: new Date(),
        severity: 'medium',
        description: 'Screen recording permission denied or failed'
      });
    }
  }, [handleViolationInternal]);

  // Start webcam recording with error handling
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
      
      recorder.start(30000); // Record in 30-second chunks
      mediaRecorderRef.current = recorder;
      setIsRecording(true);
      console.log('Webcam recording started');
    } catch (error) {
      console.error('Failed to start webcam recording:', error);
    }
  };

  // Improved face detection with better algorithm
  const startFaceDetection = () => {
    console.log('Starting face detection...');
    faceDetectionInterval.current = setInterval(() => {
      if (videoRef.current && canvasRef.current) {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const video = videoRef.current;
        
        if (ctx && video.readyState === 4 && video.videoWidth > 0) {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          ctx.drawImage(video, 0, 0);
          
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const data = imageData.data;
          
          let brightness = 0;
          let pixelCount = 0;
          let skinTonePixels = 0;
          let motionPixels = 0;
          
          // Focus on center area where face would likely be
          const startX = Math.floor(canvas.width * 0.25);
          const endX = Math.floor(canvas.width * 0.75);
          const startY = Math.floor(canvas.height * 0.15);
          const endY = Math.floor(canvas.height * 0.85);
          
          for (let y = startY; y < endY; y += 2) {
            for (let x = startX; x < endX; x += 2) {
              const i = (y * canvas.width + x) * 4;
              const r = data[i];
              const g = data[i + 1];
              const b = data[i + 2];
              
              const pixelBrightness = (r + g + b) / 3;
              brightness += pixelBrightness;
              
              // Enhanced skin tone detection
              if (r > 80 && g > 35 && b > 20 && 
                  r > g && r > b && 
                  Math.abs(r - g) > 10 &&
                  r - b > 15) {
                skinTonePixels++;
              }
              
              // Motion detection (brightness variance)
              if (pixelBrightness > 60 && pixelBrightness < 200) {
                motionPixels++;
              }
              
              pixelCount++;
            }
          }
          
          const avgBrightness = brightness / pixelCount;
          const skinRatio = skinTonePixels / pixelCount;
          const motionRatio = motionPixels / pixelCount;
          
          // Improved face detection with multiple criteria
          const hasFace = avgBrightness > 30 && 
                         avgBrightness < 240 && 
                         skinRatio > 0.015 &&
                         motionRatio > 0.1 &&
                         pixelCount > 100;
          
          if (hasFace) {
            setStatus(prev => ({ ...prev, faceDetection: 'detected' }));
            setNoFaceCount(0);
          } else {
            setNoFaceCount(prev => prev + 1);
            
            if (noFaceCount >= 3) {
              setStatus(prev => ({ ...prev, faceDetection: 'not_detected' }));
              
              if (noFaceCount % 5 === 0) {
                handleViolationInternal({
                  type: 'face_not_detected',
                  timestamp: new Date(),
                  severity: 'medium',
                  description: 'Face not detected in webcam feed'
                });
              }
            }
          }
        }
      }
    }, 2000);
  };

  // Improved browser lockdown with retry mechanism
  const initializeBrowserLock = useCallback(() => {
    console.log('Initializing browser lockdown...');
    
    const handleContextMenu = (e: MouseEvent) => e.preventDefault();
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.altKey && e.key === 'Tab') ||
        (e.ctrlKey && e.shiftKey && e.key === 'I') ||
        (e.ctrlKey && e.shiftKey && e.key === 'J') ||
        e.key === 'F11' ||
        e.key === 'F12' ||
        (e.ctrlKey && e.key === 'u')
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
          setStatus(prev => ({ ...prev, browserLock: 'active' }));
          fullscreenRetryCount.current = 0;
          console.log('Fullscreen mode activated');
        }
      } catch (error) {
        console.error('Failed to enter fullscreen:', error);
        fullscreenRetryCount.current++;
        
        if (fullscreenRetryCount.current < 3) {
          // Retry after a short delay
          setTimeout(enterFullscreen, 2000);
        } else {
          setStatus(prev => ({ ...prev, browserLock: 'error' }));
          handleViolationInternal({
            type: 'unauthorized_app',
            timestamp: new Date(),
            severity: 'high',
            description: 'Failed to activate browser lockdown (fullscreen denied)'
          });
        }
      }
    };

    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        setStatus(prev => ({ ...prev, browserLock: 'error' }));
        handleViolationInternal({
          type: 'unauthorized_app',
          timestamp: new Date(),
          severity: 'high',
          description: 'Exited fullscreen mode during exam'
        });
        
        // Retry entering fullscreen
        setTimeout(enterFullscreen, 1000);
      } else {
        setStatus(prev => ({ ...prev, browserLock: 'active' }));
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

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Initial fullscreen request
    enterFullscreen();

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [handleViolationInternal]);

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
    // Store the function in window for access from ExamInterface
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
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
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
    <div 
      className="fixed z-50 select-none"
      style={{
        top: position.y || 16,
        right: position.x ? window.innerWidth - position.x - 320 : 16,
        transform: position.x || position.y ? 'none' : undefined
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
                
                <div className="flex items-center gap-2">
                  {getStatusIcon('lock', status.browserLock)}
                  <span>Lockdown</span>
                </div>
                
                <div className="flex items-center gap-2">
                  {getStatusIcon('face', status.faceDetection)}
                  <span>Face</span>
                </div>
              </div>
              
              {(status.webcam === 'error' || status.screenRecording === 'error' || status.faceDetection === 'not_detected' || status.browserLock === 'error') && (
                <div className="mt-3 p-2 bg-red-900/50 rounded border border-red-700">
                  <p className="text-xs text-red-200">
                    {status.browserLock === 'error' && 'Browser lockdown failed. '}
                    {status.webcam === 'error' && 'Webcam access denied. '}
                    {status.screenRecording === 'error' && 'Screen recording failed. '}
                    {status.faceDetection === 'not_detected' && 'Face not detected. '}
                    Please ensure permissions are granted.
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
  );
};

export default ProctoringManager;
