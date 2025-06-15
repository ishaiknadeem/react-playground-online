
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Camera, Monitor, X, Move } from 'lucide-react';
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
    screenRecording: 'inactive'
  });

  const [isMinimized, setIsMinimized] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const videoRef = useRef<HTMLVideoElement>(null);
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
      handleViolationInternal({
        type: 'face_not_detected',
        timestamp: new Date(),
        severity: 'high',
        description: 'Failed to access webcam for monitoring'
      });
    }
  }, [handleViolationInternal]);

  // Initialize screen recording
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
      
      recorder.start(30000); // Record in 30-second chunks
      mediaRecorderRef.current = recorder;
      setIsRecording(true);
      console.log('Webcam recording started');
    } catch (error) {
      console.error('Failed to start webcam recording:', error);
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

  // Initialize proctoring features
  useEffect(() => {
    if (!isEnabled) return;

    const initialize = async () => {
      console.log('Initializing proctoring features...');
      await initializeWebcam();
      await initializeScreenRecording();
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
    };
  }, [isEnabled, initializeWebcam, initializeScreenRecording]);

  if (!isEnabled) return null;

  const getStatusColor = (statusValue: string) => {
    switch (statusValue) {
      case 'active':
        return 'text-green-400';
      case 'error':
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
      default:
        return null;
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
              </div>
              
              {(status.webcam === 'error' || status.screenRecording === 'error') && (
                <div className="mt-3 p-2 bg-red-900/50 rounded border border-red-700">
                  <p className="text-xs text-red-200">
                    {status.webcam === 'error' && 'Webcam access denied. '}
                    {status.screenRecording === 'error' && 'Screen recording failed. '}
                    Please ensure permissions are granted.
                  </p>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
      
      {/* Hidden video element for monitoring */}
      <div className="hidden">
        <video ref={videoRef} autoPlay muted playsInline />
      </div>
    </div>
  );
};

export default ProctoringManager;
