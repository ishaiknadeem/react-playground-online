import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { UserPlus, Search, Send, Eye, MoreHorizontal, Mail, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { candidateApi, type Candidate } from '@/services/api';

const CandidatesPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: candidates, isLoading, error } = useQuery({
    queryKey: ['candidates'],
    queryFn: candidateApi.getAll,
  });

  const resendInvitationMutation = useMutation({
    mutationFn: candidateApi.resendInvitation,
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Invitation resent successfully',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to resend invitation',
        variant: 'destructive',
      });
    },
  });

  const deleteCandidateMutation = useMutation({
    mutationFn: candidateApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['candidates'] });
      toast({
        title: 'Success',
        description: 'Candidate removed successfully',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to remove candidate',
        variant: 'destructive',
      });
    },
  });

  const handleResendInvitation = (candidateId: string) => {
    resendInvitationMutation.mutate(candidateId);
  };

  const handleDeleteCandidate = (candidateId: string) => {
    if (confirm('Are you sure you want to remove this candidate?')) {
      deleteCandidateMutation.mutate(candidateId);
    }
  };

  const handleAddCandidate = () => {
    // TODO: Implement add candidate modal
    toast({
      title: 'Feature Coming Soon',
      description: 'Add candidate functionality will be implemented',
    });
  };

  const handleSendInvites = () => {
    // TODO: Implement bulk send invites
    toast({
      title: 'Feature Coming Soon',
      description: 'Bulk send invites functionality will be implemented',
    });
  };

  console.log('Candidates Page - Data:', candidates);
  console.log('Candidates Page - Loading:', isLoading);
  console.log('Candidates Page - Error:', error);

  const filteredCandidates = candidates?.filter(candidate =>
    candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    candidate.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    candidate.examTitle.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const getStatusBadge = (status: Candidate['status']) => {
    const variants = {
      invited: 'secondary',
      'in-progress': 'default',
      completed: 'default',
      submitted: 'default'
    } as const;

    const colors = {
      invited: 'bg-yellow-100 text-yellow-800',
      'in-progress': 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      submitted: 'bg-purple-100 text-purple-800'
    };

    return (
      <Badge variant={variants[status]} className={colors[status]}>
        {status.replace('-', ' ')}
      </Badge>
    );
  };

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
    console.error('Error loading candidates:', error);
  }

  return (
    <DashboardLayout>
      <div className="space-y-4 md:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Candidates</h1>
            <p className="text-gray-600">Track candidate progress and exam results</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <Button variant="outline" onClick={handleAddCandidate} className="w-full sm:w-auto">
              <UserPlus className="w-4 h-4 mr-2" />
              Add Candidate
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto" onClick={handleSendInvites}>
              <Send className="w-4 h-4 mr-2" />
              Send Invites
            </Button>
          </div>
        </div>

        {/* Search and Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <Card className="lg:col-span-2">
            <CardContent className="p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search candidates..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">
                {candidates?.filter(c => c.status === 'completed' || c.status === 'submitted').length || 0}
              </div>
              <div className="text-sm text-gray-600">Completed</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">
                {candidates?.filter(c => c.status === 'in-progress').length || 0}
              </div>
              <div className="text-sm text-gray-600">In Progress</div>
            </CardContent>
          </Card>
        </div>

        {/* Candidates Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Candidates ({filteredCandidates.length})</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[150px]">Name</TableHead>
                    <TableHead className="min-w-[200px]">Email</TableHead>
                    <TableHead className="min-w-[150px] hidden md:table-cell">Exam</TableHead>
                    <TableHead className="min-w-[100px]">Status</TableHead>
                    <TableHead className="min-w-[80px] hidden lg:table-cell">Score</TableHead>
                    <TableHead className="min-w-[100px] hidden lg:table-cell">Time Spent</TableHead>
                    <TableHead className="min-w-[100px] hidden xl:table-cell">Submitted</TableHead>
                    <TableHead className="w-[80px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCandidates.map((candidate) => (
                    <TableRow key={candidate.id}>
                      <TableCell className="font-medium">{candidate.name}</TableCell>
                      <TableCell>{candidate.email}</TableCell>
                      <TableCell className="hidden md:table-cell">{candidate.examTitle}</TableCell>
                      <TableCell>{getStatusBadge(candidate.status)}</TableCell>
                      <TableCell className="hidden lg:table-cell">
                        {candidate.score ? `${candidate.score}%` : '-'}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">{candidate.timeSpent || '-'}</TableCell>
                      <TableCell className="hidden xl:table-cell">
                        {candidate.submittedAt 
                          ? new Date(candidate.submittedAt).toLocaleDateString()
                          : '-'
                        }
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="w-4 h-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            {candidate.status === 'invited' && (
                              <DropdownMenuItem onClick={() => handleResendInvitation(candidate.id)}>
                                <Mail className="w-4 h-4 mr-2" />
                                Resend Invitation
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => handleDeleteCandidate(candidate.id)}
                              className="text-red-600"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Remove
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default CandidatesPage;
