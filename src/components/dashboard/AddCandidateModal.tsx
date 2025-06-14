
import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { candidateApi } from '@/services/api';
import { UserPlus } from 'lucide-react';

interface AddCandidateModalProps {
  trigger?: React.ReactNode;
  examId?: string;
  examTitle?: string;
}

const AddCandidateModal = ({ trigger, examId, examTitle }: AddCandidateModalProps) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    examTitle: examTitle || '',
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createCandidateMutation = useMutation({
    mutationFn: candidateApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['candidates'] });
      toast({
        title: 'Success',
        description: 'Candidate added successfully',
      });
      setOpen(false);
      setFormData({ name: '', email: '', examTitle: examTitle || '' });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to add candidate',
        variant: 'destructive',
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.examTitle) {
      toast({
        title: 'Error',
        description: 'Please fill in all fields',
        variant: 'destructive',
      });
      return;
    }

    createCandidateMutation.mutate({
      ...formData,
      status: 'invited',
      invitedAt: new Date().toISOString(),
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline">
            <UserPlus className="w-4 h-4 mr-2" />
            Add Candidate
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Candidate</DialogTitle>
          <DialogDescription>
            Add a candidate to take an exam. They will receive an invitation email.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter candidate's full name"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="Enter candidate's email"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="exam">Exam</Label>
              <Select
                value={formData.examTitle}
                onValueChange={(value) => setFormData(prev => ({ ...prev, examTitle: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select an exam" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="JavaScript Fundamentals">JavaScript Fundamentals</SelectItem>
                  <SelectItem value="React Components">React Components</SelectItem>
                  <SelectItem value="Algorithm Challenge">Algorithm Challenge</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={createCandidateMutation.isPending}>
              {createCandidateMutation.isPending ? 'Adding...' : 'Add Candidate'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddCandidateModal;
