
import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus } from 'lucide-react';
import { examApi } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { useAuthStore } from '@/store/authStore';

interface CreateExamModalProps {
  trigger?: React.ReactNode;
}

const CreateExamModal = ({ trigger }: CreateExamModalProps) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    duration: 60,
    difficulty: 'medium' as 'easy' | 'medium' | 'hard'
  });

  const { toast } = useToast();
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  const createExamMutation = useMutation({
    mutationFn: async (examData: any) => {
      // This would be the actual API call
      console.log('Creating exam:', examData);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      return { id: Date.now().toString(), ...examData };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-exams'] });
      queryClient.invalidateQueries({ queryKey: ['my-exams'] });
      setOpen(false);
      setFormData({ title: '', description: '', duration: 60, difficulty: 'medium' });
      toast({
        title: 'Success',
        description: 'Exam created successfully',
      });
    },
    onError: (error) => {
      console.error('Failed to create exam:', error);
      toast({
        title: 'Error',
        description: 'Failed to create exam',
        variant: 'destructive',
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.description) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    createExamMutation.mutate({
      ...formData,
      createdBy: user?.name || 'Current User',
      createdAt: new Date().toISOString(),
      status: 'draft' as const,
      candidates: 0,
      completedSubmissions: 0
    });
  };

  const defaultTrigger = (
    <Button className="bg-blue-600 hover:bg-blue-700">
      <Plus className="w-4 h-4 mr-2" />
      Create New Exam
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Exam</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Exam Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="e.g., JavaScript Fundamentals"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Brief description of the exam content and objectives"
              rows={3}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Input
                id="duration"
                type="number"
                min="15"
                max="300"
                value={formData.duration}
                onChange={(e) => setFormData(prev => ({ ...prev, duration: Number(e.target.value) }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="difficulty">Difficulty</Label>
              <Select value={formData.difficulty} onValueChange={(value: 'easy' | 'medium' | 'hard') => setFormData(prev => ({ ...prev, difficulty: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={createExamMutation.isPending}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {createExamMutation.isPending ? 'Creating...' : 'Create Exam'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateExamModal;
