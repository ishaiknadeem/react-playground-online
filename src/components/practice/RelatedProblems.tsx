
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle, Clock, Target } from 'lucide-react';

interface RelatedProblem {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  similarityScore: number;
  solved: boolean;
  timeEstimate: number;
  tags: string[];
}

interface RelatedProblemsProps {
  currentProblemId: string;
  relatedProblems: RelatedProblem[];
  onProblemClick: (problemId: string) => void;
}

const RelatedProblems: React.FC<RelatedProblemsProps> = ({ 
  currentProblemId, 
  relatedProblems, 
  onProblemClick 
}) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSimilarityColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-gray-600';
  };

  if (relatedProblems.length === 0) {
    return null;
  }

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          <Target className="w-5 h-5 text-blue-600 mr-2" />
          Related Problems
        </CardTitle>
        <p className="text-sm text-gray-600">Problems similar to this one that you might find interesting</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {relatedProblems.map((problem) => (
            <div 
              key={problem.id}
              className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <h4 className="font-medium text-gray-900 truncate">{problem.title}</h4>
                  <Badge className={getDifficultyColor(problem.difficulty)}>
                    {problem.difficulty}
                  </Badge>
                  {problem.solved && (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  )}
                </div>
                
                <div className="flex items-center space-x-4 text-sm text-gray-500 mb-2">
                  <span>{problem.category}</span>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>~{problem.timeEstimate} min</span>
                  </div>
                  <span className={`font-medium ${getSimilarityColor(problem.similarityScore)}`}>
                    {problem.similarityScore}% similar
                  </span>
                </div>
                
                <div className="flex flex-wrap gap-1">
                  {problem.tags.slice(0, 3).map(tag => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {problem.tags.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{problem.tags.length - 3}
                    </Badge>
                  )}
                </div>
              </div>
              
              <Button 
                onClick={() => onProblemClick(problem.id)}
                variant="outline"
                size="sm"
                className="ml-4 shrink-0"
              >
                {problem.solved ? 'Practice Again' : 'Try Now'}
                <ArrowRight className="w-3 h-3 ml-1" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RelatedProblems;
