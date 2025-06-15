
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

  // Store violation data
  const handleViolationInternal = useCallback((violation: ProctoringViolation) => {
    recordingData.current.violations.push(violation);
    onViolation(violation);
  }, [onViolation]);

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

  // Initialize screen recording (fixed double permission issue)
  const initializeScreenRecording = useCallback(async () => {
    if (screenStream.current) {
      console.log('Screen recording already active, skipping...');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true
      });
      
      screenStream.current = stream;
      
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
        description: 'Failed to start screen recording'
      });
    }
  }, [handleViolationInternal]);

  // Start webcam recording (optimized)
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
    } catch (error) {
      console.error('Failed to start webcam recording:', error);
    }
  };

  // Enhanced face detection
  const startFaceDetection = () => {
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
          
          // Focus on center area where face would likely be
          const startX = Math.floor(canvas.width * 0.3);
          const endX = Math.floor(canvas.width * 0.7);
          const startY = Math.floor(canvas.height * 0.2);
          const endY = Math.floor(canvas.height * 0.8);
          
          for (let y = startY; y < endY; y += 3) {
            for (let x = startX; x < endX; x += 3) {
              const i = (y * canvas.width + x) * 4;
              const r = data[i];
              const g = data[i + 1];
              const b = data[i + 2];
              
              const pixelBrightness = (r + g + b) / 3;
              brightness += pixelBrightness;
              
              // Improved skin tone detection
              if (r > 95 && g > 40 && b > 20 && 
                  r > g && r > b && 
                  Math.abs(r - g) > 15) {
                skinTonePixels++;
              }
              
              pixelCount++;
            }
          }
          
          const avgBrightness = brightness / pixelCount;
          const skinRatio = skinTonePixels / pixelCount;
          
          // More reliable face detection
          const hasFace = avgBrightness > 40 && 
                         avgBrightness < 220 && 
                         skinRatio > 0.02 &&
                         pixelCount > 100;
          
          if (hasFace) {
            setStatus(prev => ({ ...prev, faceDetection: 'detected' }));
            setNoFaceCount(0);
          } else {
            setNoFaceCount(prev => prev + 1);
            
            if (noFaceCount >= 2) {
              setStatus(prev => ({ ...prev, faceDetection: 'not_detected' }));
              
              if (noFaceCount % 4 === 0) {
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

  // Browser lockdown
  const initializeBrowserLock = useCallback(() => {
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
        await document.documentElement.requestFullscreen();
        setStatus(prev => ({ ...prev, browserLock: 'active' }));
      } catch (error) {
        console.error('Failed to enter fullscreen:', error);
        setStatus(prev => ({ ...prev, browserLock: 'error' }));
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
        
        setTimeout(enterFullscreen, 1000);
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    
    enterFullscreen();

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
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
      await initializeWebcam();
      await initializeScreenRecording();
      cleanupBrowserLock = initializeBrowserLock();
    };

    initialize();

    return () => {
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
              
              {(status.webcam === 'error' || status.screenRecording === 'error' || status.faceDetection === 'not_detected') && (
                <div className="mt-3 p-2 bg-red-900/50 rounded border border-red-700">
                  <p className="text-xs text-red-200">
                    Proctoring issues detected. Your exam is being monitored.
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
