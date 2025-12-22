import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useJobs } from '@/contexts/JobContext';
import { cn } from '@/lib/utils';
import { 
  Briefcase, 
  Plus, 
  ArrowRight,
  Users,
  Clock,
  Zap
} from 'lucide-react';

const Jobs = () => {
  const navigate = useNavigate();
  const { jobs } = useJobs();

  return (
    <DashboardLayout>
      <div className="p-6 lg:p-10 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-display font-bold mb-2">Jobs</h1>
            <p className="text-muted-foreground">
              Manage all your job postings and track AI hiring progress
            </p>
          </div>
          <Button onClick={() => navigate('/create-job')}>
            <Plus className="w-4 h-4 mr-2" />
            Create Job
          </Button>
        </div>

        {/* Jobs List */}
        {jobs.length === 0 ? (
          <div className="bg-card rounded-2xl border border-border/50 p-16 text-center">
            <div className="w-20 h-20 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-6">
              <Briefcase className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No jobs yet</h3>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Create your first job posting to start the AI-powered hiring process
            </p>
            <Button variant="hero" size="lg" onClick={() => navigate('/create-job')}>
              <Plus className="w-5 h-5 mr-2" />
              Create Your First Job
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {jobs.map((job) => {
              const completedCount = job.candidates.filter(c => c.status === 'completed').length;
              const rejectedCount = job.candidates.filter(c => c.status === 'rejected').length;
              const inProgressCount = job.candidates.length - completedCount - rejectedCount;
              
              return (
                <div 
                  key={job.id}
                  className="bg-card rounded-2xl p-6 border border-border/50 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group"
                  onClick={() => navigate(`/job/${job.id}`)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-5">
                      <div className="w-14 h-14 rounded-xl bg-gradient-hero flex items-center justify-center text-primary-foreground">
                        <Briefcase className="w-7 h-7" />
                      </div>
                      
                      <div>
                        <h3 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors">
                          {job.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {job.experienceRange} exp • {job.skills.slice(0, 3).join(', ')}
                          {job.skills.length > 3 && ` +${job.skills.length - 3} more`}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-8">
                      {/* Stats */}
                      <div className="flex items-center gap-6 text-sm">
                        <div className="text-center">
                          <p className="font-semibold text-lg">{job.hiresRequired}</p>
                          <p className="text-muted-foreground">Hires</p>
                        </div>
                        <div className="text-center">
                          <p className="font-semibold text-lg">{job.candidates.length}</p>
                          <p className="text-muted-foreground">Sourced</p>
                        </div>
                        <div className="text-center">
                          <p className="font-semibold text-lg text-success">{completedCount}</p>
                          <p className="text-muted-foreground">Ready</p>
                        </div>
                      </div>

                      {/* Status */}
                      <Badge 
                        variant="secondary" 
                        className={cn(
                          'py-1.5 px-4',
                          job.status === 'active' 
                            ? 'bg-success/10 text-success' 
                            : 'bg-muted text-muted-foreground'
                        )}
                      >
                        {job.status === 'active' ? (
                          <>
                            <Zap className="w-3.5 h-3.5 mr-1" />
                            AI Active
                          </>
                        ) : (
                          job.status
                        )}
                      </Badge>

                      <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-5 pt-5 border-t border-border">
                    <div className="flex items-center gap-4">
                      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-hero rounded-full transition-all duration-500"
                          style={{ width: `${(completedCount / job.targetShortlist) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm text-muted-foreground whitespace-nowrap">
                        {completedCount}/{job.targetShortlist} target
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Jobs;
