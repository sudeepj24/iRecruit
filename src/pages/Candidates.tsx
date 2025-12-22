import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import CandidateCard from '@/components/candidates/CandidateCard';
import CandidateReportModal from '@/components/candidates/CandidateReportModal';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useJobs, Candidate, CandidateStatus } from '@/contexts/JobContext';
import { cn } from '@/lib/utils';
import { 
  Search, 
  Users,
  Filter
} from 'lucide-react';

const statusFilters: { value: CandidateStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'sourced', label: 'Sourced' },
  { value: 'shortlisted', label: 'Shortlisted' },
  { value: 'test_sent', label: 'Test Sent' },
  { value: 'interview_scheduled', label: 'Interview' },
  { value: 'completed', label: 'Completed' },
  { value: 'rejected', label: 'Rejected' },
];

const Candidates = () => {
  const { jobs } = useJobs();
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<CandidateStatus | 'all'>('all');

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
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {sortedCandidates.map((candidate) => (
              <div key={candidate.id} className="animate-slide-up">
                <CandidateCard
                  candidate={candidate}
                  onViewReport={() => setSelectedCandidate(candidate)}
                />
              </div>
            ))}
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

export default Candidates;
