import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle, Circle, Lock } from 'lucide-react';

export interface LearningPath {
  id: string;
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Mixed';
  estimatedTime: string;
  problems: string[];
  completedProblems: string[];
  category: string;
}

interface LearningPathsProps {
  paths: LearningPath[];
  onStartPath: (pathId: string) => void;
}

const LearningPaths: React.FC<LearningPathsProps> = ({ paths, onStartPath }) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-red-100 text-red-800';
      case 'Mixed': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getProgressIcon = (completed: number, total: number, index: number) => {
    if (index < completed) return <CheckCircle className="w-4 h-4 text-green-500" />;
    if (index === completed) return <Circle className="w-4 h-4 text-blue-500" />;
    return <Lock className="w-4 h-4 text-gray-400" />;
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Learning Paths</h3>
      <div className="grid gap-4">
        {paths.map((path) => {
          const progress = (path.completedProblems.length / path.problems.length) * 100;
          const isCompleted = path.completedProblems.length === path.problems.length;
          
          return (
            <Card key={path.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h4 className="text-lg font-semibold text-gray-900">{path.title}</h4>
                      <Badge className={getDifficultyColor(path.difficulty)}>
                        {path.difficulty}
                      </Badge>
                      {isCompleted && (
                        <Badge className="bg-green-100 text-green-800">
                          ✓ Completed
                        </Badge>
                      )}
                    </div>
                    <p className="text-gray-600 mb-3">{path.description}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                      <span>{path.estimatedTime}</span>
                      <span>{path.problems.length} problems</span>
                      <span>{path.category}</span>
                    </div>
                  </div>
                  <Button 
                    onClick={() => onStartPath(path.id)}
                    size="sm"
                    variant={isCompleted ? "outline" : "default"}
                  >
                    {isCompleted ? 'Review' : 'Continue'}
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Progress</span>
                    <span className="font-medium">{path.completedProblems.length}/{path.problems.length}</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                  
                  <div className="flex items-center space-x-2 overflow-x-auto py-2">
                    {path.problems.slice(0, 6).map((_, index) => (
                      <div key={index} className="flex items-center space-x-1 shrink-0">
                        {getProgressIcon(path.completedProblems.length, path.problems.length, index)}
                        {index < path.problems.length - 1 && index < 5 && (
                          <div className="w-6 h-0.5 bg-gray-200"></div>
                        )}
                      </div>
                    ))}
                    {path.problems.length > 6 && (
                      <span className="text-xs text-gray-500 ml-2">+{path.problems.length - 6} more</span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default LearningPaths;
