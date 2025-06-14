
import React from 'react';
import { Shield, Eye, Lock, AlertTriangle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SecurityViolation } from './SecurityMonitor';

interface SecurityStatusProps {
  violations: SecurityViolation[];
  isMonitoring: boolean;
}

const SecurityStatus: React.FC<SecurityStatusProps> = ({ violations, isMonitoring }) => {
  const highViolations = violations.filter(v => v.severity === 'high').length;
  const mediumViolations = violations.filter(v => v.severity === 'medium').length;
  const lowViolations = violations.filter(v => v.severity === 'low').length;

  const getStatusColor = () => {
    if (highViolations > 0) return 'text-red-500';
    if (mediumViolations > 2) return 'text-yellow-500';
    return 'text-green-500';
  };

  const getStatusText = () => {
    if (highViolations > 0) return 'High Risk';
    if (mediumViolations > 2) return 'Medium Risk';
    return 'Secure';
  };

  return (
    <Card className="bg-gray-800/50 border-gray-700 text-white">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Shield className={`w-5 h-5 ${getStatusColor()}`} />
            <span className="text-sm font-medium">Security Status</span>
          </div>
          <Badge className={`${getStatusColor()} bg-opacity-20`}>
            {getStatusText()}
          </Badge>
        </div>

        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="flex flex-col items-center">
            <Eye className="w-4 h-4 text-blue-400 mb-1" />
            <span className="text-xs text-gray-400">Tab Monitoring</span>
            <span className={`text-xs ${isMonitoring ? 'text-green-400' : 'text-red-400'}`}>
              {isMonitoring ? 'Active' : 'Inactive'}
            </span>
          </div>

          <div className="flex flex-col items-center">
            <Lock className="w-4 h-4 text-blue-400 mb-1" />
            <span className="text-xs text-gray-400">Anti-Cheat</span>
            <span className="text-xs text-green-400">Enabled</span>
          </div>

          <div className="flex flex-col items-center">
            <AlertTriangle className="w-4 h-4 text-yellow-400 mb-1" />
            <span className="text-xs text-gray-400">Violations</span>
            <span className="text-xs text-white">{violations.length}</span>
          </div>
        </div>

        {violations.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-700">
            <div className="text-xs text-gray-400 mb-2">Recent Violations:</div>
            <div className="space-y-1 max-h-20 overflow-y-auto">
              {violations.slice(-3).map((violation, index) => (
                <div key={index} className="flex justify-between text-xs">
                  <span className="text-gray-300">{violation.description}</span>
                  <Badge className={`text-xs ${
                    violation.severity === 'high' ? 'bg-red-600' :
                    violation.severity === 'medium' ? 'bg-yellow-600' :
                    'bg-blue-600'
                  }`}>
                    {violation.severity}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SecurityStatus;
