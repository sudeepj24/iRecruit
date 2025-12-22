import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import CandidateCard from '@/components/candidates/CandidateCard';
import CandidateReportModal from '@/components/candidates/CandidateReportModal';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useJobs, Candidate } from '@/contexts/JobContext';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { 
  ArrowLeft, 
  Trophy,
  CheckCircle2,
  Users,
  ArrowRight
} from 'lucide-react';

const FinalShortlist = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getJob } = useJobs();
  const { toast } = useToast();
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);

  const job = getJob(id || '');

  if (!job) {
    return (
      <DashboardLayout>
        <div className="p-10 text-center">
          <h2 className="text-xl font-semibold mb-4">Job not found</h2>
          <Button onClick={() => navigate('/jobs')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Jobs
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  const shortlistedCandidates = job.candidates
    .filter(c => c.status === 'completed')
    .sort((a, b) => b.aiScore - a.aiScore)
    .slice(0, job.targetShortlist);

  const getRecommendationBadge = (rec?: string) => {
    switch (rec) {
      case 'Strong Fit':
        return 'bg-success/10 text-success border-success/30';
      case 'Medium Fit':
        return 'bg-primary/10 text-primary border-primary/30';
      case 'Weak Fit':
        return 'bg-warning/10 text-warning border-warning/30';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const handleProceedToInterviews = () => {
    toast({
      title: 'Interview Process Initiated',
      description: `You can now schedule in-person interviews with ${shortlistedCandidates.length} candidates.`,
    });
  };

  return (
    <DashboardLayout>
      <div className="p-6 lg:p-10 max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <Button 
            variant="ghost" 
            size="sm" 
            className="mb-4"
            onClick={() => navigate(`/job/${job.id}`)}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Pipeline
          </Button>
          
          <div className="flex items-start justify-between">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-success/10 text-success text-sm font-medium mb-4">
                <Trophy className="w-4 h-4" />
                Final Shortlist Ready
              </div>
              <h1 className="text-3xl font-display font-bold mb-2">{job.title}</h1>
              <p className="text-muted-foreground">
                Top {job.targetShortlist} candidates sorted by AIScore
              </p>
            </div>
            
            <Button 
              variant="hero" 
              size="lg"
              onClick={handleProceedToInterviews}
            >
              Proceed to In-Person Interviews
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          <div className="bg-card rounded-xl p-5 border border-border/50">
            <div className="flex items-center gap-3 mb-2">
              <Users className="w-5 h-5 text-primary" />
              <span className="text-sm text-muted-foreground">Total Screened</span>
            </div>
            <p className="text-2xl font-display font-bold">{job.candidates.length}</p>
          </div>
          <div className="bg-card rounded-xl p-5 border border-border/50">
            <div className="flex items-center gap-3 mb-2">
              <Trophy className="w-5 h-5 text-success" />
              <span className="text-sm text-muted-foreground">Final Shortlist</span>
            </div>
            <p className="text-2xl font-display font-bold">{shortlistedCandidates.length}</p>
          </div>
          <div className="bg-card rounded-xl p-5 border border-border/50">
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle2 className="w-5 h-5 text-accent" />
              <span className="text-sm text-muted-foreground">Target Hires</span>
            </div>
            <p className="text-2xl font-display font-bold">{job.hiresRequired}</p>
          </div>
        </div>

        {/* Candidate List */}
        <div className="space-y-4">
          {shortlistedCandidates.map((candidate, index) => (
            <div 
              key={candidate.id}
              className="bg-card rounded-2xl p-6 border border-border/50 shadow-sm hover:shadow-md transition-all duration-200 animate-slide-up"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="flex items-center gap-6">
                {/* Rank */}
                <div className={cn(
                  'w-12 h-12 rounded-xl flex items-center justify-center font-display font-bold text-lg',
                  index === 0 ? 'bg-gradient-hero text-primary-foreground' :
                  index === 1 ? 'bg-accent/20 text-accent' :
                  index === 2 ? 'bg-warning/20 text-warning' :
                  'bg-muted text-muted-foreground'
                )}>
                  #{index + 1}
                </div>

                {/* Avatar */}
                <div className="w-14 h-14 rounded-xl bg-gradient-hero flex items-center justify-center text-primary-foreground font-semibold text-lg">
                  {candidate.name.split(' ').map(n => n[0]).join('')}
                </div>

                {/* Info */}
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{candidate.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {candidate.experience} years exp • {candidate.source} • {candidate.college}
                  </p>
                </div>

                {/* Score */}
                <div className="text-right mr-4">
                  <p className="text-sm text-muted-foreground mb-1">AIScore</p>
                  <p className={cn(
                    'text-3xl font-display font-bold',
                    candidate.aiScore >= 80 ? 'text-success' :
                    candidate.aiScore >= 60 ? 'text-primary' : 'text-warning'
                  )}>
                    {candidate.aiScore}
                  </p>
                </div>

                {/* Recommendation */}
                <Badge 
                  variant="outline" 
                  className={cn('text-sm py-1.5 px-4', getRecommendationBadge(candidate.aiRecommendation))}
                >
                  {candidate.aiRecommendation || 'Medium Fit'}
                </Badge>

                {/* Action */}
                <Button 
                  variant="default"
                  onClick={() => setSelectedCandidate(candidate)}
                >
                  View Full AI Report
                </Button>
              </div>
            </div>
          ))}
        </div>

        {shortlistedCandidates.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="font-semibold text-lg mb-2">No candidates ready yet</h3>
            <p className="text-muted-foreground mb-6">
              AI is still processing candidates. Check back soon.
            </p>
            <Button onClick={() => navigate(`/job/${job.id}`)}>
              View Pipeline
            </Button>
          </div>
        )}

        {/* Report Modal */}
        <CandidateReportModal
          candidate={selectedCandidate}
          isOpen={!!selectedCandidate}
          onClose={() => setSelectedCandidate(null)}
        />
      </div>
    </DashboardLayout>
  );
};

export default FinalShortlist;
