import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import CandidateCard from '@/components/candidates/CandidateCard';
import CandidateReportModal from '@/components/candidates/CandidateReportModal';
import ScheduleInterviewModal from '@/components/ScheduleInterviewModal';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useJobs, Candidate, CandidateStatus } from '@/contexts/JobContext';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { 
  Search, 
  Users,
  Filter,
  Calendar,
  Send
} from 'lucide-react';

const statusFilters: { value: CandidateStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'shortlisted', label: 'Shortlisted' },
  { value: 'test_sent', label: 'Test Sent' },
  { value: 'interview_scheduled', label: 'Interview' },
  { value: 'completed', label: 'Completed' },
  { value: 'sourced', label: 'Sourced' },
  { value: 'rejected', label: 'Rejected' },
];

const Candidates = () => {
  const { jobs } = useJobs();
  const { toast } = useToast();
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [scheduleCandidate, setScheduleCandidate] = useState<Candidate | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<CandidateStatus | 'all'>('shortlisted');

  // Aggregate all candidates from all jobs
  const allCandidates = jobs.flatMap(job => 
    job.candidates.map(c => ({ ...c, jobTitle: job.title, jobId: job.id }))
  );

  // Filter candidates
  const filteredCandidates = allCandidates.filter(candidate => {
    const matchesSearch = candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      candidate.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      candidate.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || candidate.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Get shortlisted candidates for schedule card
  const shortlistedCandidates = allCandidates.filter(c => c.status === 'shortlisted');

  // Sort by AIScore descending
  const sortedCandidates = [...filteredCandidates].sort((a, b) => b.aiScore - a.aiScore);

  return (
    <DashboardLayout>
      <div className="p-6 lg:p-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-display font-bold mb-2">Candidate Pool</h1>
          <p className="text-muted-foreground">
            View and manage all candidates across your job postings
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search by name, email, or skill..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0">
            <Filter className="w-5 h-5 text-muted-foreground flex-shrink-0" />
            {statusFilters.map((filter) => (
              <Badge
                key={filter.value}
                variant="secondary"
                className={cn(
                  'cursor-pointer py-2 px-4 whitespace-nowrap transition-colors',
                  statusFilter === filter.value 
                    ? 'bg-primary text-primary-foreground hover:bg-primary/90' 
                    : 'hover:bg-muted'
                )}
                onClick={() => setStatusFilter(filter.value)}
              >
                {filter.label}
              </Badge>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 mb-6">
          <Badge variant="secondary" className="py-1.5 px-3">
            <Users className="w-4 h-4 mr-2" />
            {sortedCandidates.length} candidates
          </Badge>
        </div>

        {/* Candidates Grid */}
        {sortedCandidates.length === 0 ? (
          <div className="bg-card rounded-2xl border border-border/50 p-16 text-center">
            <div className="w-20 h-20 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-6">
              <Users className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No candidates found</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              {searchQuery || statusFilter !== 'all' 
                ? 'Try adjusting your filters to see more candidates'
                : 'Create a job posting to start sourcing candidates'}
            </p>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
              {sortedCandidates.map((candidate) => (
                <div key={candidate.id} className="animate-slide-up">
                  <CandidateCard
                    candidate={candidate}
                    onViewReport={() => setSelectedCandidate(candidate)}
                    onScheduleInterview={candidate.status === 'shortlisted' ? () => setScheduleCandidate(candidate) : undefined}
                  />
                </div>
              ))}
            </div>

            {/* Schedule Interview Card - Only show when viewing shortlisted */}
            {statusFilter === 'shortlisted' && shortlistedCandidates.length > 0 && (
              <div className="mt-8">
                <div className="bg-gradient-subtle rounded-2xl p-6 border border-primary/20">
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
                      // Simulate bulk invite
                      setTimeout(() => {
                        toast({
                          title: 'Interview Invites Sent!',
                          description: `Calendar invites sent to all ${shortlistedCandidates.length} shortlisted candidates`,
                        });
                      }, 1000);
                    }}
                  >
                    <Send className="w-5 h-5 mr-2" />
                    Send Interview Invites to All
                  </Button>
                </div>
              </div>
            )}
          </>
        )}

        {/* Report Modal */}
        <CandidateReportModal
          candidate={selectedCandidate}
          isOpen={!!selectedCandidate}
          onClose={() => setSelectedCandidate(null)}
        />

        {/* Schedule Interview Modal */}
        <ScheduleInterviewModal
          candidate={scheduleCandidate}
          isOpen={!!scheduleCandidate}
          onClose={() => setScheduleCandidate(null)}
        />
      </div>
    </DashboardLayout>
  );
};

export default Candidates;
