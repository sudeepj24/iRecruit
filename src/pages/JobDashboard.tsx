import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import CandidateCard from '@/components/candidates/CandidateCard';
import CandidateReportModal from '@/components/candidates/CandidateReportModal';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useJobs, Candidate, CandidateStatus } from '@/contexts/JobContext';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { 
  ArrowLeft, 
  Users, 
  Target, 
  Clock, 
  Zap,
  CheckCircle2,
  ArrowRight,
  Calendar,
  Send
} from 'lucide-react';

const pipelineColumns: { status: CandidateStatus; label: string; color: string }[] = [
  { status: 'sourced', label: 'Sourced', color: 'bg-muted' },
  { status: 'shortlisted', label: 'Shortlisted', color: 'bg-primary/10' },
  { status: 'test_sent', label: 'Test Sent', color: 'bg-warning/10' },
  { status: 'interview_scheduled', label: 'Interview', color: 'bg-accent/10' },
  { status: 'completed', label: 'Completed', color: 'bg-success/10' },
  { status: 'rejected', label: 'Rejected', color: 'bg-destructive/10' },
];

const JobDashboard = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getJob, updateCandidate, settings } = useJobs();
  const { toast } = useToast();
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [isSimulating, setIsSimulating] = useState(true);
  const [simulationPhase, setSimulationPhase] = useState(0);

  const job = getJob(id || '');

  const simulateAIProcess = useCallback(() => {
    if (!job || !id) return;

    const sourcedCandidates = job.candidates.filter(c => c.status === 'sourced');
    
    if (sourcedCandidates.length === 0) {
      setIsSimulating(false);
      return;
    }

    // Simulate processing in phases
    const processCandidate = (candidate: Candidate, delay: number) => {
      setTimeout(() => {
        // Check for rejection criteria
        const isDeniedCollege = job.deniedColleges.some(
          dc => candidate.college?.toLowerCase().includes(dc.toLowerCase())
        );
        const isDeniedCompany = job.deniedCompanies.some(
          dc => candidate.company?.toLowerCase().includes(dc.toLowerCase())
        );
        const isLowScore = candidate.aiScore < settings.aiScoreThreshold;

        if (isDeniedCollege) {
          updateCandidate(id, candidate.id, { 
            status: 'rejected', 
            rejectionReason: 'Denied college' 
          });
        } else if (isDeniedCompany) {
          updateCandidate(id, candidate.id, { 
            status: 'rejected', 
            rejectionReason: 'Denied company' 
          });
        } else if (isLowScore) {
          updateCandidate(id, candidate.id, { 
            status: 'rejected', 
            rejectionReason: 'Low AIScore' 
          });
        } else {
          // Move through pipeline
          updateCandidate(id, candidate.id, { status: 'shortlisted' });

          // Simulate test
          setTimeout(() => {
            updateCandidate(id, candidate.id, { 
              status: 'test_sent',
              testScore: Math.floor(Math.random() * 30) + 70
            });

            // Simulate interview
            setTimeout(() => {
              updateCandidate(id, candidate.id, { 
                status: 'interview_scheduled',
                interviewSlot: 'Tomorrow, 10:00 AM'
              });

              // Complete
              setTimeout(() => {
                const finalScore = Math.floor(
                  (candidate.resumeMatchScore + (candidate.testScore || 75) + Math.floor(Math.random() * 20 + 75)) / 3
                );
                updateCandidate(id, candidate.id, { 
                  status: 'completed',
                  interviewScore: Math.floor(Math.random() * 20 + 75),
                  aiScore: finalScore,
                  aiRecommendation: finalScore >= 80 ? 'Strong Fit' : finalScore >= 65 ? 'Medium Fit' : 'Weak Fit'
                });
              }, 1500 + Math.random() * 1000);
            }, 1200 + Math.random() * 800);
          }, 1000 + Math.random() * 500);
        }
      }, delay);
    };

    // Process candidates with staggered delays
    sourcedCandidates.forEach((candidate, index) => {
      processCandidate(candidate, 500 + index * 300);
    });
  }, [job, id, updateCandidate, settings.aiScoreThreshold]);

  useEffect(() => {
    if (job && isSimulating) {
      const timer = setTimeout(() => {
        simulateAIProcess();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [job, isSimulating, simulateAIProcess]);

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

  const completedCandidates = job.candidates
    .filter(c => c.status === 'completed')
    .sort((a, b) => b.aiScore - a.aiScore);

  const shortlistedCandidates = job.candidates.filter(c => c.status === 'shortlisted');

  const isShortlistReady = completedCandidates.length >= job.targetShortlist;

  return (
    <DashboardLayout>
      <div className="p-6 lg:p-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <Button 
              variant="ghost" 
              size="sm" 
              className="mb-4"
              onClick={() => navigate('/jobs')}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              All Jobs
            </Button>
            <h1 className="text-3xl font-display font-bold mb-2">{job.title}</h1>
            <p className="text-muted-foreground">
              {job.experienceRange} experience • {job.skills.join(', ')}
            </p>
          </div>
          
          {isShortlistReady && (
            <Button 
              variant="hero" 
              size="lg"
              onClick={() => navigate(`/job/${job.id}/shortlist`)}
            >
              View Final Shortlist
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-card rounded-xl p-5 border border-border/50">
            <div className="flex items-center gap-3 mb-2">
              <Target className="w-5 h-5 text-primary" />
              <span className="text-sm text-muted-foreground">Target Hires</span>
            </div>
            <p className="text-2xl font-display font-bold">{job.hiresRequired}</p>
          </div>
          <div className="bg-card rounded-xl p-5 border border-border/50">
            <div className="flex items-center gap-3 mb-2">
              <Users className="w-5 h-5 text-accent" />
              <span className="text-sm text-muted-foreground">Target Shortlist</span>
            </div>
            <p className="text-2xl font-display font-bold">{job.targetShortlist}</p>
          </div>
          <div className="bg-card rounded-xl p-5 border border-border/50">
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle2 className="w-5 h-5 text-success" />
              <span className="text-sm text-muted-foreground">Ready</span>
            </div>
            <p className="text-2xl font-display font-bold">
              {completedCandidates.length}/{job.targetShortlist}
            </p>
          </div>
          <div className="bg-card rounded-xl p-5 border border-border/50">
            <div className="flex items-center gap-3 mb-2">
              <Zap className="w-5 h-5 text-warning" />
              <span className="text-sm text-muted-foreground">Status</span>
            </div>
            <Badge variant="secondary" className={cn(
              job.status === 'active' ? 'bg-success/10 text-success' : 'bg-muted'
            )}>
              <span className="w-2 h-2 rounded-full bg-current mr-2 animate-pulse" />
              AI Hiring in Progress
            </Badge>
          </div>
        </div>

        {/* Pipeline */}
        <div className="bg-card rounded-2xl border border-border/50 overflow-hidden mb-8">
          <div className="p-6 border-b border-border">
            <h2 className="text-lg font-display font-semibold">Candidate Pipeline</h2>
          </div>
          
          <div className="p-6 overflow-x-auto">
            <div className="flex gap-4 min-w-max">
              {pipelineColumns.map((column) => {
                const candidates = job.candidates.filter(c => c.status === column.status);
                
                return (
                  <div 
                    key={column.status}
                    className={cn('w-72 rounded-xl p-4', column.color)}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold">{column.label}</h3>
                      <Badge variant="secondary" className="font-mono">
                        {candidates.length}
                      </Badge>
                    </div>
                    
                    <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
                      {candidates.map((candidate) => (
                        <div 
                          key={candidate.id}
                          className="animate-scale-in"
                        >
                          <CandidateCard 
                            candidate={candidate}
                            onViewReport={() => setSelectedCandidate(candidate)}
                            compact
                          />
                        </div>
                      ))}
                      
                      {candidates.length === 0 && (
                        <p className="text-sm text-muted-foreground text-center py-8">
                          No candidates
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Schedule Interviews Card */}
        {shortlistedCandidates.length > 0 && (
          <div className="bg-gradient-subtle rounded-2xl p-6 border border-primary/20 mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-display font-semibold flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  Schedule Interviews
                </h3>
                <p className="text-muted-foreground text-sm">
                  Send calendar invites to {shortlistedCandidates.length} shortlisted candidates
                </p>
              </div>
              <Badge variant="secondary" className="bg-primary/10 text-primary">
                {shortlistedCandidates.length} candidates
              </Badge>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
              {shortlistedCandidates.slice(0, 6).map((candidate) => (
                <div key={candidate.id} className="flex items-center gap-3 p-3 bg-card rounded-lg border border-border/50">
                  <div className="w-8 h-8 rounded-full bg-gradient-hero flex items-center justify-center text-primary-foreground text-xs font-semibold">
                    {candidate.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{candidate.name}</p>
                    <p className="text-xs text-muted-foreground">Score: {candidate.aiScore}</p>
                  </div>
                </div>
              ))}
              {shortlistedCandidates.length > 6 && (
                <div className="flex items-center justify-center p-3 bg-muted rounded-lg border border-border/50">
                  <p className="text-sm text-muted-foreground">+{shortlistedCandidates.length - 6} more</p>
                </div>
              )}
            </div>

            <div className="bg-primary/5 rounded-xl p-4 mb-4 border border-primary/20">
              <p className="text-sm text-muted-foreground">
                <strong className="text-foreground">Auto-sync enabled:</strong> Available time slots will be synced from your connected calendar. 
                Candidates will receive invites with available slots to choose from.
              </p>
            </div>

            <Button 
              className="w-full" 
              size="lg"
              onClick={() => {
                toast({
                  title: 'Interview Invites Sent!',
                  description: `Calendar invites sent to ${shortlistedCandidates.length} shortlisted candidates`,
                });
              }}
            >
              <Send className="w-5 h-5 mr-2" />
              Send Interview Invites to All
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

export default JobDashboard;
