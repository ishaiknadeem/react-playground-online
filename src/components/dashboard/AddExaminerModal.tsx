
import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UserPlus } from 'lucide-react';
import { examinerApi } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

interface AddExaminerModalProps {
  trigger?: React.ReactNode;
}

const AddExaminerModal = ({ trigger }: AddExaminerModalProps) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: ''
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createExaminerMutation = useMutation({
    mutationFn: examinerApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['examiners'] });
      setOpen(false);
      setFormData({ name: '', email: '', role: '' });
      toast({
        title: 'Success',
        description: 'Examiner added successfully',
      });
    },
    onError: (error) => {
      console.error('Failed to create examiner:', error);
      toast({
        title: 'Error',
        description: 'Failed to add examiner',
        variant: 'destructive',
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.role) {
      toast({
        title: 'Error',
        description: 'Please fill in all fields',
        variant: 'destructive',
      });
      return;
    }

    createExaminerMutation.mutate({
      ...formData,
      status: 'active' as const,
      examsCreated: 0,
      lastLogin: new Date().toISOString(),
      joinedDate: new Date().toISOString()
    });
  };

  const defaultTrigger = (
    <Button className="bg-blue-600 hover:bg-blue-700">
      <UserPlus className="w-4 h-4 mr-2" />
      Add Examiner
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Examiner</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter full name"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              placeholder="Enter email address"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select value={formData.role} onValueChange={(value) => setFormData(prev => ({ ...prev, role: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="HR Manager">HR Manager</SelectItem>
                <SelectItem value="Technical Recruiter">Technical Recruiter</SelectItem>
                <SelectItem value="HR Coordinator">HR Coordinator</SelectItem>
                <SelectItem value="Senior HR Manager">Senior HR Manager</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={createExaminerMutation.isPending}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {createExaminerMutation.isPending ? 'Adding...' : 'Add Examiner'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddExaminerModal;
