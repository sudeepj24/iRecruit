import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { 
  X,
  Send,
  User,
  Mail,
  Briefcase
} from 'lucide-react';

interface ScheduleInterviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidate: {
    name: string;
    email: string;
    aiScore: number;
    jobTitle?: string;
  } | null;
}

const ScheduleInterviewModal = ({ isOpen, onClose, candidate }: ScheduleInterviewModalProps) => {
  const { toast } = useToast();
  const [isSending, setIsSending] = useState(false);

  const handleSendInvite = async () => {
    setIsSending(true);
    
    // Simulate sending invite
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast({
      title: 'Interview Invite Sent!',
      description: `Calendar invite sent to ${candidate?.name}`,
    });
    
    setIsSending(false);
    onClose();
  };

  if (!isOpen || !candidate) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-2xl border border-border/50 shadow-2xl max-w-md w-full">
        {/* Header */}
        <div className="p-6 border-b border-border/50">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-display font-bold">Schedule Interview</h2>
              <p className="text-muted-foreground text-sm mt-1">
                Send calendar invite to candidate
              </p>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Candidate Info */}
        <div className="p-6">
          <div className="bg-muted/50 rounded-xl p-4 mb-6">
            <div className="flex items-center gap-4 mb-3">
              <div className="w-12 h-12 rounded-full bg-gradient-hero flex items-center justify-center text-primary-foreground font-semibold">
                {candidate?.name[0]}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold flex items-center gap-2">
                  <User className="w-4 h-4 text-muted-foreground" />
                  {candidate?.name}
                </h3>
                <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                  <Mail className="w-4 h-4" />
                  {candidate?.email}
                </p>
                {candidate?.jobTitle && (
                  <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                    <Briefcase className="w-4 h-4" />
                    {candidate.jobTitle}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="bg-primary/5 rounded-xl p-4 mb-6 border border-primary/20">
            <p className="text-sm text-muted-foreground">
              <strong className="text-foreground">Note:</strong> Interview slots will be automatically synced from your connected calendar. 
              The candidate will receive available time slots to choose from.
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose} 
              className="flex-1"
              disabled={isSending}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSendInvite} 
              className="flex-1"
              disabled={isSending}
            >
              {isSending ? (
                <>
                  <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin mr-2" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Send Invite
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduleInterviewModal;