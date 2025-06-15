import React, { useState } from 'react';
import { useExaminers } from '@/hooks/useExaminers';
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
  const { examiners, loading, error, updateExaminer, deleteExaminer } = useExaminers();

  const handleToggleStatus = async (examiner: any) => {
    const newStatus = examiner.status === 'active' ? 'inactive' : 'active';
    try {
      await updateExaminer(examiner.id, { status: newStatus });
      toast({
        title: 'Success',
        description: 'Examiner updated successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update examiner',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteExaminer = async (examinerId: string) => {
    if (confirm('Are you sure you want to delete this examiner?')) {
      try {
        await deleteExaminer(examinerId);
        toast({
          title: 'Success',
          description: 'Examiner deleted successfully',
        });
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to delete examiner',
          variant: 'destructive',
        });
      }
    }
  };

  const filteredExaminers = examiners?.filter(examiner =>
    examiner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    examiner.email.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  if (loading) {
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
      <div className="space-y-4 w-full">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Examiners</h1>
            <p className="text-gray-600">Manage your organization's examiners</p>
          </div>
          <AddExaminerModal />
        </div>

        {/* Search */}
        <Card>
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search examiners..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Examiners Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Examiners ({filteredExaminers.length})</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[150px]">Name</TableHead>
                  <TableHead className="min-w-[200px] hidden sm:table-cell">Email</TableHead>
                  <TableHead className="min-w-[100px]">Status</TableHead>
                  <TableHead className="min-w-[100px] hidden lg:table-cell">Exams</TableHead>
                  <TableHead className="min-w-[120px] hidden xl:table-cell">Last Login</TableHead>
                  <TableHead className="w-[80px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredExaminers.map((examiner) => (
                  <TableRow key={examiner.id}>
                    <TableCell>
                      <div className="min-w-0">
                        <div className="font-medium">{examiner.name}</div>
                        <div className="text-sm text-gray-500 sm:hidden truncate">
                          {examiner.email}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">{examiner.email}</TableCell>
                    <TableCell>
                      <Badge variant={examiner.status === 'active' ? 'default' : 'secondary'}>
                        {examiner.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">{examiner.examsCreated}</TableCell>
                    <TableCell className="hidden xl:table-cell">
                      {new Date(examiner.lastLogin).toLocaleDateString()}
                    </TableCell>
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
