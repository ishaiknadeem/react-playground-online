
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, MoreHorizontal, UserCheck, UserX, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import AddExaminerModal from '@/components/dashboard/AddExaminerModal';
import { examinerApi, type Examiner } from '@/services/api';

const ExaminersPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: examiners, isLoading, error } = useQuery({
    queryKey: ['examiners'],
    queryFn: examinerApi.getAll,
  });

  const updateExaminerMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Examiner> }) =>
      examinerApi.update(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['examiners'] });
      toast({
        title: 'Success',
        description: 'Examiner updated successfully',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to update examiner',
        variant: 'destructive',
      });
    },
  });

  const deleteExaminerMutation = useMutation({
    mutationFn: examinerApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['examiners'] });
      toast({
        title: 'Success',
        description: 'Examiner deleted successfully',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to delete examiner',
        variant: 'destructive',
      });
    },
  });

  const handleToggleStatus = (examiner: Examiner) => {
    const newStatus = examiner.status === 'active' ? 'inactive' : 'active';
    updateExaminerMutation.mutate({
      id: examiner.id,
      updates: { status: newStatus }
    });
  };

  const handleDeleteExaminer = (examinerId: string) => {
    if (confirm('Are you sure you want to delete this examiner?')) {
      deleteExaminerMutation.mutate(examinerId);
    }
  };

  const filteredExaminers = examiners?.filter(examiner =>
    examiner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    examiner.email.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    console.error('Error loading examiners:', error);
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Examiners</h1>
            <p className="text-gray-600">Manage your organization's examiners</p>
          </div>
          <AddExaminerModal />
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search examiners..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Examiners Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Examiners ({filteredExaminers.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Exams Created</TableHead>
                  <TableHead>Last Login</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredExaminers.map((examiner) => (
                  <TableRow key={examiner.id}>
                    <TableCell className="font-medium">{examiner.name}</TableCell>
                    <TableCell>{examiner.email}</TableCell>
                    <TableCell>{examiner.role}</TableCell>
                    <TableCell>
                      <Badge variant={examiner.status === 'active' ? 'default' : 'secondary'}>
                        {examiner.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{examiner.examsCreated}</TableCell>
                    <TableCell>{new Date(examiner.lastLogin).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleToggleStatus(examiner)}>
                            {examiner.status === 'active' ? (
                              <>
                                <UserX className="w-4 h-4 mr-2" />
                                Deactivate
                              </>
                            ) : (
                              <>
                                <UserCheck className="w-4 h-4 mr-2" />
                                Activate
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => handleDeleteExaminer(examiner.id)}
                            className="text-red-600"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ExaminersPage;
