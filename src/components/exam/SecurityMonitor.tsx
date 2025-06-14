
import { useEffect, useRef, useState } from 'react';

interface SecurityMonitorProps {
  onSecurityViolation: (violation: SecurityViolation) => void;
  isExamActive: boolean;
}

export interface SecurityViolation {
  type: 'tab_switch' | 'window_blur' | 'right_click' | 'copy_paste' | 'dev_tools' | 'fullscreen_exit';
  timestamp: Date;
  severity: 'low' | 'medium' | 'high';
  description: string;
}

const SecurityMonitor: React.FC<SecurityMonitorProps> = ({ onSecurityViolation, isExamActive }) => {
  const [violations, setViolations] = useState<SecurityViolation[]>([]);
  const tabSwitchCount = useRef(0);
  const lastFocusTime = useRef(Date.now());

  useEffect(() => {
    if (!isExamActive) return;

    // Disable right-click context menu
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      onSecurityViolation({
        type: 'right_click',
        timestamp: new Date(),
        severity: 'low',
        description: 'Right-click attempted during exam'
      });
    };

    // Monitor tab switching and window focus
    const handleVisibilityChange = () => {
      if (document.hidden) {
        tabSwitchCount.current++;
        const severity = tabSwitchCount.current > 3 ? 'high' : tabSwitchCount.current > 1 ? 'medium' : 'low';
        
        onSecurityViolation({
          type: 'tab_switch',
          timestamp: new Date(),
          severity,
          description: `Tab switch detected (${tabSwitchCount.current} total)`
        });
      }
    };

    const handleWindowBlur = () => {
      onSecurityViolation({
        type: 'window_blur',
        timestamp: new Date(),
        severity: 'medium',
        description: 'Window lost focus during exam'
      });
    };

    // Detect copy/paste attempts
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 'c' || e.key === 'v' || e.key === 'x') {
          onSecurityViolation({
            type: 'copy_paste',
            timestamp: new Date(),
            severity: 'medium',
            description: `${e.key === 'c' ? 'Copy' : e.key === 'v' ? 'Paste' : 'Cut'} attempt detected`
          });
        }
        
        // Detect developer tools shortcuts
        if (e.key === 'i' || e.key === 'j' || e.key === 'u' || e.shiftKey && e.key === 'I') {
          e.preventDefault();
          onSecurityViolation({
            type: 'dev_tools',
            timestamp: new Date(),
            severity: 'high',
            description: 'Developer tools access attempted'
          });
        }
      }
      
      // F12 key
      if (e.key === 'F12') {
        e.preventDefault();
        onSecurityViolation({
          type: 'dev_tools',
          timestamp: new Date(),
          severity: 'high',
          description: 'F12 key pressed (developer tools)'
        });
      }
    };

    // Monitor fullscreen exit
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        onSecurityViolation({
          type: 'fullscreen_exit',
          timestamp: new Date(),
          severity: 'medium',
          description: 'Fullscreen mode exited during exam'
        });
      }
    };

    // Add event listeners
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleWindowBlur);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleWindowBlur);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [isExamActive, onSecurityViolation]);

  return null;
};

export default SecurityMonitor;
