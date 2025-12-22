import { Candidate } from '@/contexts/JobContext';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { 
  Linkedin, 
  Globe, 
  Building2, 
  FileText, 
  Phone,
  XCircle,
  CheckCircle2,
  Clock,
  AlertCircle,
  Calendar
} from 'lucide-react';

interface CandidateCardProps {
  candidate: Candidate;
  onViewReport: () => void;
  onScheduleInterview?: () => void;
  compact?: boolean;
}

const sourceIcons = {
  LinkedIn: Linkedin,
  Naukri: Globe,
  Internal: Building2,
  Indeed: Globe,
};

const statusConfig = {
  sourced: { label: 'Sourced', color: 'bg-muted text-muted-foreground', icon: Clock },
  shortlisted: { label: 'Shortlisted', color: 'bg-primary/10 text-primary', icon: CheckCircle2 },
  test_sent: { label: 'Test Sent', color: 'bg-warning/10 text-warning', icon: AlertCircle },
  interview_scheduled: { label: 'Interview Scheduled', color: 'bg-accent/10 text-accent', icon: Clock },
  completed: { label: 'Completed', color: 'bg-success/10 text-success', icon: CheckCircle2 },
  rejected: { label: 'Rejected', color: 'bg-destructive/10 text-destructive', icon: XCircle },
};

const CandidateCard = ({ candidate, onViewReport, onScheduleInterview, compact = false }: CandidateCardProps) => {
  const SourceIcon = sourceIcons[candidate.source] || Globe;
  const statusInfo = statusConfig[candidate.status];
  const StatusIcon = statusInfo.icon;

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-success';
    if (score >= 60) return 'text-primary';
    if (score >= 40) return 'text-warning';
    return 'text-destructive';
  };

  if (compact) {
    return (
      <div className="bg-card rounded-xl p-4 border border-border/50 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-hero flex items-center justify-center text-primary-foreground text-xs font-semibold">
              {candidate.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <h4 className="font-medium text-sm">{candidate.name}</h4>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <SourceIcon className="w-3 h-3" />
                {candidate.source}
              </div>
            </div>
          </div>
          <div className={cn('text-2xl font-display font-bold', getScoreColor(candidate.aiScore))}>
            {candidate.aiScore}
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <Badge variant="secondary" className={cn('text-xs', statusInfo.color)}>
            <StatusIcon className="w-3 h-3 mr-1" />
            {statusInfo.label}
          </Badge>
          <Button variant="ghost" size="sm" className="text-xs h-7" onClick={onViewReport}>
            <FileText className="w-3 h-3 mr-1" />
            Report
          </Button>
        </div>
        
        {candidate.status === 'rejected' && candidate.rejectionReason && (
          <p className="text-xs text-destructive mt-2 flex items-center gap-1">
            <XCircle className="w-3 h-3" />
            {candidate.rejectionReason}
          </p>
        )}

        {candidate.callOutcome && (
          <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
            <Phone className="w-3 h-3" />
            {candidate.callOutcome}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="bg-card rounded-2xl p-6 border border-border/50 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-hero flex items-center justify-center text-primary-foreground font-semibold">
            {candidate.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <h4 className="font-semibold">{candidate.name}</h4>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <SourceIcon className="w-4 h-4" />
              {candidate.source}
              <span className="text-border">•</span>
              {candidate.experience} years exp
            </div>
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-sm text-muted-foreground mb-1">AIScore</div>
          <div className={cn('text-3xl font-display font-bold', getScoreColor(candidate.aiScore))}>
            {candidate.aiScore}
          </div>
        </div>
      </div>

      {/* Skills */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {candidate.skills.map((skill) => (
          <Badge key={skill} variant="secondary" className="text-xs">
            {skill}
          </Badge>
        ))}
      </div>

      {/* Details */}
      <div className="grid grid-cols-2 gap-2 text-sm mb-4">
        {candidate.college && (
          <div className="text-muted-foreground">
            <span className="font-medium text-foreground">College:</span> {candidate.college}
          </div>
        )}
        {candidate.company && (
          <div className="text-muted-foreground">
            <span className="font-medium text-foreground">Company:</span> {candidate.company}
          </div>
        )}
      </div>

      {/* Status & Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-border">
        <Badge variant="secondary" className={cn(statusInfo.color)}>
          <StatusIcon className="w-3.5 h-3.5 mr-1" />
          {statusInfo.label}
        </Badge>
        
        <div className="flex gap-2">
          {candidate.status === 'shortlisted' && onScheduleInterview && (
            <Button variant="outline" size="sm" onClick={onScheduleInterview}>
              <Calendar className="w-4 h-4 mr-1" />
              Schedule
            </Button>
          )}
          <Button variant="default" size="sm" onClick={onViewReport}>
            <FileText className="w-4 h-4 mr-1" />
            View Report
          </Button>
        </div>
      </div>

      {/* Rejection Reason */}
      {candidate.status === 'rejected' && candidate.rejectionReason && (
        <div className="mt-4 p-3 rounded-lg bg-destructive/5 border border-destructive/20">
          <p className="text-sm text-destructive flex items-center gap-2">
            <XCircle className="w-4 h-4" />
            <span className="font-medium">Rejected:</span> {candidate.rejectionReason}
          </p>
        </div>
      )}

      {/* Call Outcome */}
      {candidate.callOutcome && (
        <div className="mt-4 p-3 rounded-lg bg-muted">
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            <Phone className="w-4 h-4" />
            <span className="font-medium">Call Result:</span> {candidate.callOutcome}
          </p>
        </div>
      )}
    </div>
  );
};

export default CandidateCard;
