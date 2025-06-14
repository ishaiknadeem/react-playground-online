
import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
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
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { candidateApi } from '@/services/api';
import { Send } from 'lucide-react';

interface SendInvitesModalProps {
  trigger?: React.ReactNode;
}

const SendInvitesModal = ({ trigger }: SendInvitesModalProps) => {
  const [open, setOpen] = useState(false);
  const [selectedCandidates, setSelectedCandidates] = useState<string[]>([]);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: candidates } = useQuery({
    queryKey: ['candidates'],
    queryFn: candidateApi.getAll,
  });

  const sendInvitesMutation = useMutation({
    mutationFn: async (candidateIds: string[]) => {
      const promises = candidateIds.map(id => candidateApi.resendInvitation(id));
      await Promise.all(promises);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['candidates'] });
      toast({
        title: 'Success',
        description: `Invitations sent to ${selectedCandidates.length} candidates`,
      });
      setOpen(false);
      setSelectedCandidates([]);
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to send some invitations',
        variant: 'destructive',
      });
    },
  });

  const invitedCandidates = candidates?.filter(c => c.status === 'invited') || [];

  const handleCandidateToggle = (candidateId: string) => {
    setSelectedCandidates(prev =>
      prev.includes(candidateId)
        ? prev.filter(id => id !== candidateId)
        : [...prev, candidateId]
    );
  };

  const handleSelectAll = () => {
    if (selectedCandidates.length === invitedCandidates.length) {
      setSelectedCandidates([]);
    } else {
      setSelectedCandidates(invitedCandidates.map(c => c.id));
    }
  };

  const handleSendInvites = () => {
    if (selectedCandidates.length === 0) {
      toast({
        title: 'Error',
        description: 'Please select at least one candidate',
        variant: 'destructive',
      });
      return;
    }

    sendInvitesMutation.mutate(selectedCandidates);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Send className="w-4 h-4 mr-2" />
            Send Invites
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Send Exam Invitations</DialogTitle>
          <DialogDescription>
            Select candidates to send exam invitations to. Only candidates with "invited" status are shown.
          </DialogDescription>
        </DialogHeader>
        <div className="max-h-[400px] overflow-y-auto">
          {invitedCandidates.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No candidates with invited status found.
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="select-all"
                  checked={selectedCandidates.length === invitedCandidates.length}
                  onCheckedChange={handleSelectAll}
                />
                <label htmlFor="select-all" className="text-sm font-medium">
                  Select all ({invitedCandidates.length})
                </label>
              </div>
              <div className="space-y-3">
                {invitedCandidates.map((candidate) => (
                  <div key={candidate.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                    <Checkbox
                      id={candidate.id}
                      checked={selectedCandidates.includes(candidate.id)}
                      onCheckedChange={() => handleCandidateToggle(candidate.id)}
                    />
                    <div className="flex-1">
                      <div className="font-medium">{candidate.name}</div>
                      <div className="text-sm text-gray-500">{candidate.email}</div>
                      <div className="text-xs text-gray-400">{candidate.examTitle}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSendInvites}
            disabled={selectedCandidates.length === 0 || sendInvitesMutation.isPending}
          >
            {sendInvitesMutation.isPending ? 'Sending...' : `Send Invites (${selectedCandidates.length})`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SendInvitesModal;
